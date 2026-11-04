/**
 * Capstone projects: four real-world scripts built step by step.
 * Lab universe: corp.example.com, DC01 192.168.56.10, SRV-CORE01 192.168.56.20, CLIENT01 192.168.56.30.
 * Written for Windows PowerShell 5.1. Everything state-changing is marked LAB ONLY and defaults to -WhatIf.
 */

export interface ProjectStep {
  title: string;
  explain: string;
  code: string;
  expect: string;
}

export interface ProjectGuide {
  id: string;
  title: string;
  scenario: string;
  level: 'Intermediate' | 'Advanced';
  minutes: number;
  needs: string[];
  outcomes: string[];
  steps: ProjectStep[];
  finalScript: string;
  checklist: string[];
  pitfalls: { problem: string; fix: string }[];
  stretch: string[];
}

/** Tag for PowerShell source: keeps backslashes, `$` and quotes exactly as written, trims the ends. */
const ps = (strings: TemplateStringsArray): string => strings.raw[0].trim();

/** Indents every non-empty line, used to nest a block inside try { } when the script is assembled. */
const indent = (code: string, spaces = 4): string =>
  code
    .split('\n')
    .map((line) => (line.length > 0 ? ' '.repeat(spaces) + line : line))
    .join('\n');

/* ------------------------------------------------------------------ */
/* Shared function blocks (used by project 1 and project 4)           */
/* ------------------------------------------------------------------ */

const SAM_FUNCTIONS = ps`
function Get-SamBaseName {
    [CmdletBinding()]
    [OutputType([string])]
    param(
        [Parameter(Mandatory)][string]$GivenName,
        [Parameter(Mandatory)][string]$Surname
    )

    # Strip accents first (FormD splits e + accent), then keep letters only
    $clean = {
        param([string]$Text)
        $plain = $Text.Normalize([System.Text.NormalizationForm]::FormD) -replace '\p{M}', ''
        $plain -replace '[^a-zA-Z]', ''
    }
    $first = & $clean $GivenName
    $last = & $clean $Surname
    if (-not $first -or -not $last) {
        throw "Cannot build a SamAccountName from '$GivenName' '$Surname'"
    }

    $base = ('{0}.{1}' -f $first.Substring(0, 1), $last).ToLowerInvariant()
    # SamAccountName is limited to 20 characters; keep room for a numeric suffix
    if ($base.Length -gt 18) { $base = $base.Substring(0, 18) }
    $base
}

function Test-SamAccountNameInUse {
    [CmdletBinding()]
    [OutputType([bool])]
    param(
        [Parameter(Mandatory)][string]$SamAccountName,
        [Parameter(Mandatory)][string]$Server
    )

    # Get-ADObject (not Get-ADUser): sAMAccountName must be unique across users, groups and computers
    $found = Get-ADObject -LDAPFilter "(sAMAccountName=$SamAccountName)" -Server $Server -ErrorAction Stop
    [bool]$found
}

function Get-UniqueSamAccountName {
    [CmdletBinding()]
    [OutputType([string])]
    param(
        [Parameter(Mandatory)][string]$BaseName,
        [Parameter(Mandatory)][string]$Server,
        [Parameter(Mandatory)][AllowEmptyCollection()][System.Collections.Generic.HashSet[string]]$Reserved
    )

    $candidate = $BaseName
    $n = 1
    while ($Reserved.Contains($candidate) -or (Test-SamAccountNameInUse -SamAccountName $candidate -Server $Server)) {
        $n++
        $suffix = [string]$n
        $keep = [Math]::Min($BaseName.Length, 20 - $suffix.Length)
        $candidate = $BaseName.Substring(0, $keep) + $suffix
    }
    [void]$Reserved.Add($candidate)
    $candidate
}
`;

/* ------------------------------------------------------------------ */
/* Project 1: AD onboarding                                           */
/* ------------------------------------------------------------------ */

const ONB_HEADER = ps`
#Requires -Version 5.1
#Requires -Modules ActiveDirectory
<#
.SYNOPSIS
    Creates AD accounts from a CSV. Safe to re-run: people who already exist are skipped.
.EXAMPLE
    .\New-StaffAccounts.ps1 -CsvPath users.csv -WhatIf
.EXAMPLE
    .\New-StaffAccounts.ps1 -CsvPath users.csv
#>
[CmdletBinding(SupportsShouldProcess)]
param(
    [Parameter(Mandatory)]
    [ValidateScript({ Test-Path -LiteralPath $_ -PathType Leaf })]
    [string]$CsvPath,

    [string]$Server = 'DC01',
    [string]$DomainDn = 'DC=corp,DC=example,DC=com',
    [string]$UpnSuffix = 'corp.example.com',
    [string]$StaffOu = "OU=Staff,$DomainDn",
    [string]$OutDir = (Join-Path $PSScriptRoot 'output')
)

# Department -> OU and security group. Change this table, not the logic below.
$DepartmentMap = @{
    'Finance' = @{ Ou = "OU=Finance,$StaffOu"; Group = 'GG-Finance' }
    'IT'      = @{ Ou = "OU=IT,$StaffOu";      Group = 'GG-IT' }
    'HR'      = @{ Ou = "OU=HR,$StaffOu";      Group = 'GG-HR' }
    'Sales'   = @{ Ou = "OU=Sales,$StaffOu";   Group = 'GG-Sales' }
}
`;

const ONB_CSV_FUNCTION = ps`
function Import-OnboardingCsv {
    [CmdletBinding()]
    param([Parameter(Mandatory)][string]$Path)

    $required = 'GivenName', 'Surname', 'Department', 'Title', 'Manager'
    $rows = @(Import-Csv -LiteralPath $Path -Encoding UTF8)
    if ($rows.Count -eq 0) { throw "No data rows found in $Path" }

    # A missing column is a file-level error: stop before touching anything
    $columns = $rows[0].PSObject.Properties.Name
    $missing = @($required | Where-Object { $_ -notin $columns })
    if ($missing.Count -gt 0) { throw "Missing required column(s): $($missing -join ', ')" }

    $line = 1   # the header is line 1
    foreach ($row in $rows) {
        $line++
        foreach ($name in $required) {
            if ($null -ne $row.$name) { $row.$name = $row.$name.Trim() }
        }
        $blank = @($required | Where-Object { [string]::IsNullOrWhiteSpace($row.$_) })

        # A blank value is a row-level problem: report it, keep going
        [pscustomobject]@{
            Line       = $line
            GivenName  = $row.GivenName
            Surname    = $row.Surname
            Department = $row.Department
            Title      = $row.Title
            Manager    = $row.Manager
            Problem    = if ($blank.Count -gt 0) { "Blank value(s): $($blank -join ', ')" } else { $null }
        }
    }
}
`;

const ONB_EXISTS_FUNCTIONS = ps`
function ConvertTo-LdapFilterValue {
    [CmdletBinding()]
    param([Parameter(Mandatory)][string]$Value)

    # RFC 4515: escape \ * ( ) so a name can never change the meaning of the filter
    [regex]::Replace($Value, '[\\*()]', { param($m) '\{0:x2}' -f [int][char]$m.Value })
}

function Find-ExistingPerson {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory)][string]$GivenName,
        [Parameter(Mandatory)][string]$Surname,
        [Parameter(Mandatory)][string]$SearchBase,
        [Parameter(Mandatory)][string]$Server
    )

    $g = ConvertTo-LdapFilterValue -Value $GivenName
    $s = ConvertTo-LdapFilterValue -Value $Surname
    $filter = "(&(objectCategory=person)(objectClass=user)(givenName=$g)(sn=$s))"
    $users = @(Get-ADUser -LDAPFilter $filter -SearchBase $SearchBase -Server $Server -ErrorAction Stop)
    if ($users.Count -gt 0) { $users[0] }
}
`;

const ONB_PASSWORD_FUNCTIONS = ps`
function Get-RandomSecurePassword {
    [CmdletBinding()]
    [OutputType([System.Security.SecureString])]
    param([ValidateRange(12, 64)][int]$Length = 16)

    # No look-alike characters (0/O, 1/l/I) so it survives being read aloud or retyped
    $sets = @(
        'ABCDEFGHJKLMNPQRSTUVWXYZ',
        'abcdefghijkmnopqrstuvwxyz',
        '23456789',
        '!#$%&*+-=?@'
    )

    $rng = [System.Security.Cryptography.RandomNumberGenerator]::Create()
    $buffer = New-Object byte[] 4
    $pick = {
        param([int]$Max)
        $rng.GetBytes($buffer)
        [int]([BitConverter]::ToUInt32($buffer, 0) % $Max)
    }

    # One character from every set guarantees the complexity rules, then fill up and shuffle
    $chars = New-Object System.Collections.Generic.List[char]
    foreach ($set in $sets) { $chars.Add($set[(& $pick $set.Length)]) }
    $all = -join $sets
    while ($chars.Count -lt $Length) { $chars.Add($all[(& $pick $all.Length)]) }
    for ($i = $chars.Count - 1; $i -gt 0; $i--) {
        $j = & $pick ($i + 1)
        $tmp = $chars[$i]; $chars[$i] = $chars[$j]; $chars[$j] = $tmp
    }

    # Build the SecureString character by character: the password never exists as one plain string here
    $secure = New-Object System.Security.SecureString
    foreach ($c in $chars) { $secure.AppendChar($c) }
    $secure.MakeReadOnly()
    $rng.Dispose()
    $secure
}

function Show-Handover {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory)][AllowEmptyCollection()]
        [System.Collections.Generic.List[object]]$Handover
    )

    if ($Handover.Count -eq 0) { return }
    Write-Host ''
    Write-Host 'INITIAL PASSWORDS: shown once, not in the log, not in the CSV. Hand them over now.' -ForegroundColor Yellow
    foreach ($entry in $Handover) {
        $bstr = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($entry.Password)
        try { $plain = [System.Runtime.InteropServices.Marshal]::PtrToStringBSTR($bstr) }
        finally { [System.Runtime.InteropServices.Marshal]::ZeroFreeBSTR($bstr) }
        Write-Host ('  {0,-16} {1}' -f $entry.SamAccountName, $plain)
    }
}
`;

const ONB_MAIN_SETUP = ps`
$stamp = Get-Date -Format 'yyyyMMdd-HHmmss'
$logPath = Join-Path $OutDir "onboarding-$stamp.log"
$resultsPath = Join-Path $OutDir "onboarding-results-$stamp.csv"
$handover = [System.Collections.Generic.List[object]]::new()

# -WhatIf:$false on purpose: New-Item, Start-Transcript and Export-Csv also honour -WhatIf,
# and a dry run that writes no log and no results file is useless
New-Item -ItemType Directory -Path $OutDir -Force -WhatIf:$false | Out-Null
Start-Transcript -Path $logPath -WhatIf:$false | Out-Null
`;

const ONB_MAIN_PREFLIGHT = ps`
# Preflight: fail before touching anything if the DC, the OUs or the groups are not what we expect
$null = Get-ADDomain -Server $Server -ErrorAction Stop
$null = Get-ADOrganizationalUnit -Identity $StaffOu -Server $Server -ErrorAction Stop
foreach ($dept in $DepartmentMap.Keys) {
    $null = Get-ADOrganizationalUnit -Identity $DepartmentMap[$dept].Ou -Server $Server -ErrorAction Stop
    $null = Get-ADGroup -Identity $DepartmentMap[$dept].Group -Server $Server -ErrorAction Stop
}

$rows = @(Import-OnboardingCsv -Path $CsvPath)
$reserved = [System.Collections.Generic.HashSet[string]]::new([System.StringComparer]::OrdinalIgnoreCase)
$seen = @{}
`;

const ONB_MAIN_LOOP = ps`
$results = foreach ($item in $rows) {
    $r = [ordered]@{
        Line              = $item.Line
        GivenName         = $item.GivenName
        Surname           = $item.Surname
        Department        = $item.Department
        SamAccountName    = ''
        UserPrincipalName = ''
        Status            = 'Failed'
        Reason            = ''
    }

    try {
        if ($item.Problem) { throw $item.Problem }

        $key = ('{0}|{1}' -f $item.GivenName, $item.Surname).ToLowerInvariant()
        if ($seen.ContainsKey($key)) {
            # The same person twice in one file (a -WhatIf run would otherwise plan two accounts)
            $r.Status = 'Skipped'
            $r.Reason = "Same person as CSV line $($seen[$key])"
        }
        else {
            $seen[$key] = $item.Line

            $map = $DepartmentMap[$item.Department]
            if (-not $map) { throw "No OU/group mapping for Department '$($item.Department)'" }

            $existing = Find-ExistingPerson -GivenName $item.GivenName -Surname $item.Surname -SearchBase $StaffOu -Server $Server
            if ($existing) {
                # This check is what makes the script idempotent
                $r.SamAccountName = $existing.SamAccountName
                $r.UserPrincipalName = $existing.UserPrincipalName
                $r.Status = 'Skipped'
                $r.Reason = 'Already exists in AD'
            }
            else {
                # Throws if the manager cannot be found: a wrong manager is a data error, not a guess
                $manager = Get-ADUser -Identity $item.Manager -Server $Server -ErrorAction Stop

                $base = Get-SamBaseName -GivenName $item.GivenName -Surname $item.Surname
                $sam = Get-UniqueSamAccountName -BaseName $base -Server $Server -Reserved $reserved
                $upn = "$sam@$UpnSuffix"
                $r.SamAccountName = $sam
                $r.UserPrincipalName = $upn

                if ($PSCmdlet.ShouldProcess($sam, "Create user in $($map.Ou) and add to $($map.Group)")) {
                    $password = Get-RandomSecurePassword
                    $newUser = @{
                        Name                  = "$($item.GivenName) $($item.Surname)"
                        GivenName             = $item.GivenName
                        Surname               = $item.Surname
                        DisplayName           = "$($item.GivenName) $($item.Surname)"
                        SamAccountName        = $sam
                        UserPrincipalName     = $upn
                        Department            = $item.Department
                        Title                 = $item.Title
                        Manager               = $manager.DistinguishedName
                        Path                  = $map.Ou
                        AccountPassword       = $password
                        Enabled               = $true
                        ChangePasswordAtLogon = $true
                        Server                = $Server
                        ErrorAction           = 'Stop'
                    }
                    New-ADUser @newUser
                    $handover.Add([pscustomobject]@{ SamAccountName = $sam; Password = $password })

                    try {
                        Add-ADGroupMember -Identity $map.Group -Members $sam -Server $Server -ErrorAction Stop
                        $r.Status = 'Created'
                        $r.Reason = "Created in $($map.Ou), member of $($map.Group)"
                    }
                    catch {
                        # The account exists now, so say so: a later run will skip it
                        $r.Status = 'Created'
                        $r.Reason = "Created, but adding to $($map.Group) FAILED: $($_.Exception.Message)"
                    }
                }
                else {
                    $r.Status = 'Skipped'
                    $r.Reason = "WhatIf: would create in $($map.Ou) and add to $($map.Group)"
                }
            }
        }
    }
    catch {
        $r.Status = 'Failed'
        $r.Reason = $_.Exception.Message
    }

    Write-Host ('[{0}] line {1}: {2} {3} {4} ({5})' -f $r.Status, $r.Line, $r.GivenName, $r.Surname, $r.SamAccountName, $r.Reason)
    [pscustomobject]$r
}
`;

const ONB_MAIN_TAIL = ps`
$results | Export-Csv -Path $resultsPath -NoTypeInformation -Encoding UTF8 -WhatIf:$false
$results | Group-Object Status | ForEach-Object { Write-Host ('{0}: {1}' -f $_.Name, $_.Count) }
Write-Host "Results CSV: $resultsPath"
Write-Host "Transcript:  $logPath"
`;

const ONB_MAIN_FINALLY = ps`
# Stop the transcript BEFORE showing passwords: a transcript records everything printed to the console
Stop-Transcript | Out-Null
Show-Handover -Handover $handover
`;

const ONB_SAM_DEMO = ps`
# Try it without AD: a stand-in replaces the AD lookup and pretends a.khan already exists in the directory
function Test-SamAccountNameInUse { param($SamAccountName, $Server) $SamAccountName -eq 'a.khan' }
$reserved = [System.Collections.Generic.HashSet[string]]::new([System.StringComparer]::OrdinalIgnoreCase)

Get-SamBaseName -GivenName 'Liam' -Surname "O'Brien"
Get-UniqueSamAccountName -BaseName (Get-SamBaseName -GivenName 'Jane' -Surname 'Smith') -Server DC01 -Reserved $reserved
Get-UniqueSamAccountName -BaseName (Get-SamBaseName -GivenName 'John' -Surname 'Smith') -Server DC01 -Reserved $reserved
Get-UniqueSamAccountName -BaseName (Get-SamBaseName -GivenName 'Aisha' -Surname 'Khan') -Server DC01 -Reserved $reserved
`;

const ONB_PASSWORD_DEMO = ps`
# Try the generator (in memory only). Convert it back to text just to look at its shape.
$demo = Get-RandomSecurePassword
$demo.GetType().Name
$demo.Length
$bstr = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($demo)
try { $plain = [System.Runtime.InteropServices.Marshal]::PtrToStringBSTR($bstr) }
finally { [System.Runtime.InteropServices.Marshal]::ZeroFreeBSTR($bstr) }
($plain -cmatch '[A-Z]'), ($plain -cmatch '[a-z]'), ($plain -match '\d'), ($plain -match '[^a-zA-Z0-9]')
$plain = $null
`;

const ONB_FINAL_SCRIPT = [
  ONB_HEADER,
  [ONB_CSV_FUNCTION, SAM_FUNCTIONS, ONB_EXISTS_FUNCTIONS, ONB_PASSWORD_FUNCTIONS].join('\n\n'),
  ONB_MAIN_SETUP,
  'try {\n' + indent([ONB_MAIN_PREFLIGHT, ONB_MAIN_LOOP, ONB_MAIN_TAIL].join('\n\n')) + '\n}\nfinally {\n' + indent(ONB_MAIN_FINALLY) + '\n}',
  '# One result object per CSV row goes to the pipeline\n$results',
].join('\n\n');

const AD_ONBOARDING: ProjectGuide = {
  id: 'ad-onboarding',
  title: 'Safe, re-runnable AD onboarding from a CSV',
  scenario:
    'HR sends you a CSV of new starters every Monday. Last month a half-working script was run twice, so one person ended up with two accounts and the initial password sat in a log file. You will build a script you can run twice without damage, that shows what it would do before it does it, and that tells you per row what happened and why.',
  level: 'Advanced',
  minutes: 90,
  needs: [
    'Lab: DC01 (192.168.56.10) for corp.example.com and CLIENT01 (192.168.56.30) with the RSAT ActiveDirectory module',
    'In AD: OU=Staff,DC=corp,DC=example,DC=com with child OUs Finance, IT, HR and Sales',
    'In AD: security groups GG-Finance, GG-IT, GG-HR and GG-Sales',
    'In AD: manager accounts t.baker, m.lopez and s.idris (create them by hand first, or edit the CSV)',
    'Lessons 12-1 (AD users, groups and OUs), 14-1 (error handling and splatting), 14-2 (advanced functions) and 7-2 (-WhatIf)',
  ],
  outcomes: [
    'Validate a CSV before it touches AD: required columns, blank values, stray spaces',
    'Generate unique SamAccountNames and UPNs, handling collisions (j.smith, j.smith2)',
    'Make a script idempotent by checking whether the person already exists',
    'Support -WhatIf properly with SupportsShouldProcess and $PSCmdlet.ShouldProcess',
    'Emit one result object per row, write a results CSV and a transcript, and keep passwords out of both',
  ],
  steps: [
    {
      title: 'Define the input and plant the traps',
      explain:
        'Start from the data, not the code. A script that only works on a clean file is a demo, not a tool. This sample has five rows with deliberate problems: the same person twice, two different people who would both be j.smith, a blank Manager, spaces around values, and an apostrophe in a surname. Create it in your lab working folder.',
      code: ps`
$csv = @'
GivenName,Surname,Department,Title,Manager
Jane,Smith,Finance,Accountant,t.baker
John,Smith,IT,Systems Administrator,m.lopez
Jane,Smith,Finance,Accountant,t.baker
Aisha,Khan,Sales,Account Manager,
 Liam , O'Brien ,HR,HR Assistant,s.idris
'@
Set-Content -Path users.csv -Value $csv -Encoding UTF8
Import-Csv -Path users.csv | Format-Table
`,
      expect:
        'The file has 5 data rows. Import-Csv prints them as given (the Aisha row has an empty Manager):\n\nGivenName Surname  Department Title                 Manager\n--------- -------  ---------- -----                 -------\nJane      Smith    Finance    Accountant            t.baker\nJohn      Smith    IT         Systems Administrator m.lopez\nJane      Smith    Finance    Accountant            t.baker\nAisha     Khan     Sales      Account Manager\nLiam      O\'Brien  HR         HR Assistant          s.idris\n\nThe Liam row still has spaces around its values in the file; you cannot see them here, which is exactly why the next steps trim.',
    },
    {
      title: 'Script skeleton: parameters, -WhatIf support and the department table',
      explain:
        '[CmdletBinding(SupportsShouldProcess)] gives your script -WhatIf and -Confirm for free, and gives you $PSCmdlet.ShouldProcess to guard each change. Keep the Department to OU and group mapping in one table at the top, so a reorganisation means editing data, not logic. The domain details are parameters with lab defaults. Use the server name (DC01), not its IP address, so Kerberos works.',
      code: ONB_HEADER,
      expect:
        'Nothing runs yet. Save this as New-StaffAccounts.ps1 in a dedicated folder (for example C:\\Automation\\Onboarding). The script already refuses to start without -CsvPath, and Test-Path in ValidateScript rejects a path that does not exist before any of your code runs.',
    },
    {
      title: 'Validate the CSV: columns, blanks and trimming',
      explain:
        'Bad input is the most common reason bulk scripts fail halfway. Check the whole file shape first (a missing column means stop), then check each row (a blank value means fail that row, not the run). Trim every value: " Liam " and "Liam" would otherwise become two different people. Returning a Problem property keeps validation separate from AD logic, which also makes it easy to test.',
      code:
        ONB_CSV_FUNCTION +
        '\n\n# Try it on the sample file. No AD needed for this step.\nImport-OnboardingCsv -Path users.csv | Format-Table Line, GivenName, Surname, Department, Manager, Problem -AutoSize',
      expect:
        'Line numbers are file lines (the header is line 1). Only the Aisha row has a Problem; the others are valid:\n\nLine GivenName Surname Department Manager Problem\n---- --------- ------- ---------- ------- -------\n   2 Jane      Smith   Finance    t.baker\n   3 John      Smith   IT         m.lopez\n   4 Jane      Smith   Finance    t.baker\n   5 Aisha     Khan    Sales              Blank value(s): Manager\n   6 Liam      O\'Brien HR         s.idris',
    },
    {
      title: 'Build a unique SamAccountName and UPN',
      explain:
        'The convention here is first initial, dot, surname: j.smith. Two Smiths will collide, so the script appends 2, 3 and so on. It checks two places: AD (through a small wrapper function) and a set of names already handed out earlier in this run. The second check matters because with -WhatIf nothing is created, so AD alone would offer j.smith to both Smiths. Names are cleaned (accents, spaces and apostrophes removed) and capped at 18 characters so a suffix still fits inside the 20 character limit.',
      code: SAM_FUNCTIONS + '\n\n' + ONB_SAM_DEMO,
      expect:
        'The four results, in order:\n\nl.obrien\nj.smith\nj.smith2\na.khan2\n\nO\'Brien lost the apostrophe. The second Smith got j.smith2 because j.smith was reserved earlier in the same run (no AD hit needed). Aisha Khan got a.khan2 because the stand-in said a.khan already exists.',
    },
    {
      title: 'Check whether the person already exists',
      explain:
        'This one check turns a dangerous script into one you can safely run twice. Look the person up by given name and surname inside the Staff OU; if found, skip the row. The lookup uses an LDAP filter with the values escaped, so a name like O\'Brien or a stray parenthesis cannot break (or inject into) the query. Be honest about the limit: two different people with the same name in the same OU look like one person to this script. A real HR file should carry an EmployeeID (see the stretch goals).',
      code: ONB_EXISTS_FUNCTIONS,
      expect:
        'Not run against a real domain (the ActiveDirectory module is not installed on the authoring machine); the lookups were exercised against in-memory stand-ins. Find-ExistingPerson returns nothing for a new starter and the AD user object (with SamAccountName and UserPrincipalName) for someone already created. ConvertTo-LdapFilterValue was run for real: the input a(b)*c\\d becomes a\\28b\\29\\2ac\\5cd, and O\'Brien is left alone because an apostrophe is not special in an LDAP filter.',
    },
    {
      title: 'Generate the initial password and decide where it may be seen',
      explain:
        'Never put a fixed password in the script, and never write a real one to a log. Generate a random one per user with a cryptographic random number generator and build it straight into a SecureString. Then decide how a human gets it. Options: (1) show it once on screen after the transcript is stopped, which is what this script does; (2) hand it to a password vault or a ticket field through an approved process; (3) skip passwords entirely and use a self-service reset flow. Do not email it and do not store it in the results CSV. A transcript records everything printed to the console, so printing a password while a transcript is running puts it in the log.',
      code: ONB_PASSWORD_FUNCTIONS + '\n\n' + ONB_PASSWORD_DEMO,
      expect:
        'SecureString\n16\nTrue\nTrue\nTrue\nTrue\n\nIt is a SecureString of 16 characters, and the four checks confirm at least one upper case letter, one lower case letter, one digit and one symbol. Every run gives a different password.',
    },
    {
      title: 'The per-row loop: ShouldProcess, try/catch and one result object',
      explain:
        'Each row gets its own try/catch with -ErrorAction Stop, because AD cmdlets mostly write non-terminating errors that a catch block never sees. One bad row becomes a Failed result and the loop carries on. $PSCmdlet.ShouldProcess wraps the only state-changing part: with -WhatIf it prints what it would do and returns false, so no password is generated and nothing is created. The result is a single object per row with Status (Created, Skipped or Failed) and a Reason, which is exactly what you will want to read on Monday morning. New-ADUser is called with -Enabled $true and -ChangePasswordAtLogon $true through a splatting hashtable so each setting is on its own line.',
      code: ONB_MAIN_LOOP,
      expect:
        'Simulated: the whole script was run against in-memory stand-ins for the AD cmdlets, not a real domain, with the three manager accounts present. The console shows one line per row:\n\n[Created] line 2: Jane Smith j.smith (Created in OU=Finance,OU=Staff,DC=corp,DC=example,DC=com, member of GG-Finance)\n[Created] line 3: John Smith j.smith2 (Created in OU=IT,OU=Staff,DC=corp,DC=example,DC=com, member of GG-IT)\n[Skipped] line 4: Jane Smith  (Same person as CSV line 2)\n[Failed] line 5: Aisha Khan  (Blank value(s): Manager)\n[Created] line 6: Liam O\'Brien l.obrien (Created in OU=HR,OU=Staff,DC=corp,DC=example,DC=com, member of GG-HR)\n\nWith -WhatIf the same rows print [Skipped] ... (WhatIf: would create in ...) and PowerShell adds its own line per account: What if: Performing the operation "Create user in OU=Finance,OU=Staff,DC=corp,DC=example,DC=com and add to GG-Finance" on target "j.smith".',
    },
    {
      title: 'Wrap it: preflight, transcript, results CSV and the one-time password display',
      explain:
        'The wrapper does four jobs. Preflight checks the DC, the OUs and the groups exist so you fail before changing anything. Start-Transcript records what happened. Export-Csv saves the per-row results. A try/finally guarantees the transcript stops and the passwords are shown even if something unexpected breaks the run. Watch for one trap: Start-Transcript, Export-Csv and New-Item all honour -WhatIf, so under a dry run they would silently do nothing. -WhatIf:$false on those three keeps your log and results even in a dry run.',
      code:
        ONB_MAIN_SETUP +
        '\n\ntry {\n' +
        indent(ONB_MAIN_PREFLIGHT) +
        '\n\n    # ... the per-row loop from the previous step goes here ...\n\n' +
        indent(ONB_MAIN_TAIL) +
        '\n}\nfinally {\n' +
        indent(ONB_MAIN_FINALLY) +
        '\n}\n\n$results',
      expect:
        'Simulated (in-memory stand-ins for the AD cmdlets, not a real domain). After the loop:\n\nCreated: 3\nSkipped: 1\nFailed: 1\nResults CSV: output\\onboarding-results-<timestamp>.csv\nTranscript:  output\\onboarding-<timestamp>.log\n\nINITIAL PASSWORDS: shown once, not in the log, not in the CSV. Hand them over now.\n  j.smith          <16 random characters>\n  j.smith2         <16 random characters>\n  l.obrien         <16 random characters>\n\nIn the simulated run a search of the transcript found no password. The passwords appear only after Stop-Transcript, on screen.',
    },
    {
      title: 'Run it: dry run first, then for real, then again',
      explain:
        'Always run -WhatIf first and read every row. Then run for real. Then run it a second time: if your script is idempotent, the second run creates nothing and reports every existing person as Skipped. That second run is your proof, so do not skip it. Finally verify one account directly in AD.',
      code: ps`
# 1. Dry run: nothing is created, but you still get a log and a results CSV
.\New-StaffAccounts.ps1 -CsvPath users.csv -WhatIf

# 2. LAB ONLY: the real run (creates accounts in corp.example.com)
.\New-StaffAccounts.ps1 -CsvPath users.csv

# 3. Run it again: expect Created = 0
.\New-StaffAccounts.ps1 -CsvPath users.csv | Format-Table Line, SamAccountName, Status, Reason -AutoSize

# 4. Verify one account
Get-ADUser -Identity j.smith -Server DC01 -Properties Enabled, Department, Manager, PasswordLastSet, MemberOf |
    Select-Object SamAccountName, UserPrincipalName, Enabled, Department, Manager, PasswordLastSet, MemberOf
`,
      expect:
        'Simulated (in-memory stand-ins, not a real domain). First real run: Created 3 (j.smith, j.smith2, l.obrien), Skipped 1 (the duplicate row), Failed 1 (the blank Manager). The -WhatIf run before it created nothing. The second real run:\n\nLine SamAccountName Status  Reason\n---- -------------- ------  ------\n   2 j.smith        Skipped Already exists in AD\n   3 j.smith2       Skipped Already exists in AD\n   4                Skipped Same person as CSV line 2\n   5                Failed  Blank value(s): Manager\n   6 l.obrien       Skipped Already exists in AD\n\nNo new accounts: that is idempotency. In a real domain, Get-ADUser should show Enabled True and a Manager DN, and PasswordLastSet is empty or old because the account must change its password at next logon.',
    },
  ],
  finalScript: ONB_FINAL_SCRIPT,
  checklist: [
    'Run with -WhatIf against the lab and read every row of the output before running for real.',
    'Open DepartmentMap and confirm every OU and group is the real one in your directory, spelled exactly.',
    'Run on 2 or 3 rows first. Then run the full file twice: the second run must report Created = 0.',
    'Check one created account: Enabled is True, the manager is right, the account is in the right group and PasswordLastSet is empty (change at next logon).',
    'Search the log and the results CSV for a password. There must be none.',
    'Run it under an account with delegated rights on OU=Staff only, not a Domain Admin account.',
    'The log and CSV contain employee names: store them in a restricted folder and delete the input CSV after use. Never commit real user data to Git.',
    'Confirm the Manager column holds the manager\'s SamAccountName, and that those accounts exist.',
  ],
  pitfalls: [
    {
      problem: 'Re-running the script creates j.smith2 for the same person.',
      fix: 'Check whether the person already exists (given name plus surname in the target OU) before generating a new SamAccountName. Collision handling is for different people with similar names, not for repeat runs.',
    },
    {
      problem: 'A -WhatIf run produces no log or results file.',
      fix: 'Start-Transcript, Export-Csv and New-Item honour -WhatIf too. Pass -WhatIf:$false on those calls so a dry run still writes its evidence.',
    },
    {
      problem: 'In a -WhatIf run, both John Smith and Jane Smith are planned as j.smith.',
      fix: 'Nothing is created in a dry run, so AD cannot tell you the name is taken. Keep a set of names already allocated in this run and check it as well as AD.',
    },
    {
      problem: 'The initial passwords turn up in the transcript.',
      fix: 'A transcript captures everything written to the console, including Write-Host. Stop the transcript before showing passwords, or better, hand them over through a vault or a self-service reset. Never write them to the results CSV.',
    },
    {
      problem: 'A surname such as O\'Brien or Smith (Jr) breaks the AD lookup or matches too much.',
      fix: 'Never paste raw CSV text into a filter. Escape \\ * ( ) for LDAP filters (the helper does this), or escape quotes for -Filter strings. Strip accents and punctuation from SamAccountNames.',
    },
    {
      problem: 'Two real people named John Smith in the same OU are treated as one person and the second is skipped. A created user may also end up with no group because Add-ADGroupMember failed after New-ADUser worked.',
      fix: 'Add an EmployeeID column and use it as the identity key. The Reason column already says when a group add failed after the account was created; fix those by hand or add a repair pass that re-applies group membership for existing users.',
    },
  ],
  stretch: [
    'Add an EmployeeID column to the CSV, store it on the account, and use it (not the name) to decide whether someone already exists.',
    'Make Manager optional, and look the manager up by display name or email when it is not a SamAccountName.',
    'Add a repair pass: for existing users, re-apply group membership and OU placement, and report what changed.',
    'Replace the on-screen password with a handover through your password vault or a self-service reset link.',
    'Cover Get-SamBaseName and Get-UniqueSamAccountName with Pester tests (project 4).',
  ],
};

/* ------------------------------------------------------------------ */
/* Project 2: patching report                                         */
/* ------------------------------------------------------------------ */

const PATCH_HEADER = ps`
#Requires -Version 5.1
<#
.SYNOPSIS
    Patch compliance report for a list of servers: CSV plus HTML.
.EXAMPLE
    .\Get-PatchReport.ps1 -MaxPatchAgeDays 35
#>
[CmdletBinding()]
param(
    [string[]]$ComputerName = @('DC01', 'SRV-CORE01', 'CLIENT01', 'SRV-GONE01'),
    [ValidateRange(1, 365)][int]$MaxPatchAgeDays = 35,
    [ValidateRange(1, 64)][int]$ThrottleLimit = 16,
    [string]$OutDir = (Join-Path $PSScriptRoot 'reports'),
    [switch]$PassThru
)
`;

const PATCH_REACH = ps`
function Test-HostReachable {
    [CmdletBinding()]
    [OutputType([bool])]
    param([Parameter(Mandatory)][string]$Name)

    # A plain TCP check on the WinRM port: fast, and it never throws for a dead name
    [bool](Test-NetConnection -ComputerName $Name -Port 5985 -InformationLevel Quiet -WarningAction SilentlyContinue)
}

function Test-WinRMListener {
    [CmdletBinding()]
    [OutputType([bool])]
    param([Parameter(Mandatory)][string]$Name)

    # Stricter: asks the WinRM service itself, so it also proves a listener is answering
    try { $null = Test-WSMan -ComputerName $Name -ErrorAction Stop; $true }
    catch { $false }
}
`;

const PATCH_COLLECT = ps`
# Runs ON each server. Return one flat object of simple values (strings, numbers, dates, booleans).
$collect = {
    $os = Get-CimInstance -ClassName Win32_OperatingSystem

    # InstalledOn can be blank for some updates, so ignore those when looking for "newest"
    $hotfixes = @(Get-HotFix -ErrorAction SilentlyContinue | Where-Object { $_.InstalledOn } | Sort-Object InstalledOn -Descending)
    $newest = if ($hotfixes.Count -gt 0) { $hotfixes[0] }

    # Three common "a restart is waiting" signals
    $cbs = Test-Path 'HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Component Based Servicing\RebootPending'
    $wu = Test-Path 'HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\WindowsUpdate\Auto Update\RebootRequired'
    $sessionManager = 'HKLM:\SYSTEM\CurrentControlSet\Control\Session Manager'
    $pendingRename = $null -ne (Get-ItemProperty -Path $sessionManager -Name PendingFileRenameOperations -ErrorAction SilentlyContinue)

    [pscustomobject]@{
        ComputerName      = $env:COMPUTERNAME
        OS                = $os.Caption
        LastBoot          = $os.LastBootUpTime
        NewestHotFixId    = $newest.HotFixID
        NewestHotFixDate  = $newest.InstalledOn
        HotFixCount       = $hotfixes.Count
        RebootPendingCbs  = $cbs
        RebootRequiredWU  = $wu
        PendingFileRename = $pendingRename
    }
}
`;

const PATCH_ROW = ps`
function ConvertTo-PatchRow {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory)][string]$ComputerName,
        [string]$Status = '',
        [string]$Detail = '',
        [psobject]$Data,
        [int]$MaxPatchAgeDays = 35
    )

    $patchAge = $null
    $uptime = $null
    $reboot = $null
    if ($Data) {
        if ($Data.NewestHotFixDate) { $patchAge = [int][math]::Floor(((Get-Date) - [datetime]$Data.NewestHotFixDate).TotalDays) }
        if ($Data.LastBoot) { $uptime = [int][math]::Floor(((Get-Date) - [datetime]$Data.LastBoot).TotalDays) }
        $reboot = [bool]($Data.RebootPendingCbs -or $Data.RebootRequiredWU)

        $Status = if ($null -eq $patchAge) { 'NoHotfixData' }
                  elseif ($patchAge -gt $MaxPatchAgeDays) { 'OutOfDate' }
                  elseif ($reboot) { 'RebootPending' }
                  else { 'OK' }
    }

    # Every row, healthy or not, has exactly the same columns (Export-Csv in 5.1 takes its columns from the first row)
    [pscustomobject]@{
        ComputerName      = $ComputerName
        Status            = $Status
        Detail            = $Detail
        OS                = $Data.OS
        LastBoot          = $Data.LastBoot
        UptimeDays        = $uptime
        NewestHotFix      = $Data.NewestHotFixId
        NewestHotFixDate  = $Data.NewestHotFixDate
        PatchAgeDays      = $patchAge
        HotFixCount       = $Data.HotFixCount
        RebootPending     = $reboot
        PendingFileRename = $Data.PendingFileRename
    }
}
`;

const PATCH_ROW_DEMO = ps`
# Try it with the local data from the previous step ($collect), and with a failure row
$data = & $collect
ConvertTo-PatchRow -ComputerName CLIENT01 -Data $data -MaxPatchAgeDays 35 | Format-List
ConvertTo-PatchRow -ComputerName SRV-GONE01 -Status Unreachable -Detail 'No answer on TCP 5985 (WinRM)' | Format-List
`;

const PATCH_MAIN_COLLECT = ps`
$targets = $ComputerName | Sort-Object -Unique
$rows = New-Object System.Collections.Generic.List[object]
$reachable = New-Object System.Collections.Generic.List[string]

# 1. Pre-check: unreachable hosts are recorded, never allowed to stop the run
foreach ($name in $targets) {
    if (Test-HostReachable -Name $name) {
        $reachable.Add($name)
    }
    else {
        Write-Warning "$name did not answer on TCP 5985; recording it as Unreachable"
        $rows.Add((ConvertTo-PatchRow -ComputerName $name -Status 'Unreachable' -Detail 'No answer on TCP 5985 (WinRM)'))
    }
}

# 2. Fan out. Errors are collected in $remoteErrors instead of being printed in red
$remoteErrors = $null
$raw = @()
if ($reachable.Count -gt 0) {
    $raw = @(Invoke-Command -ComputerName $reachable.ToArray() -ScriptBlock $collect -ThrottleLimit $ThrottleLimit -ErrorAction SilentlyContinue -ErrorVariable remoteErrors)
}

# 3. Hosts that answered
foreach ($item in $raw) {
    $rows.Add((ConvertTo-PatchRow -ComputerName $item.PSComputerName -Data $item -MaxPatchAgeDays $MaxPatchAgeDays))
}

# 4. Hosts that were reachable on the port but returned nothing (access denied, WinRM not configured, timeout)
$answered = @($raw | ForEach-Object { $_.PSComputerName })
foreach ($name in $reachable) {
    if ($name -notin $answered) {
        $why = $remoteErrors | Where-Object { $_.TargetObject -eq $name -or $_.OriginInfo.PSComputerName -eq $name } | Select-Object -First 1
        $detail = if ($why) { ($why.Exception.Message -replace '\s+', ' ').Trim() } else { 'Port 5985 open but no data returned' }
        $rows.Add((ConvertTo-PatchRow -ComputerName $name -Status 'RemotingFailed' -Detail $detail))
    }
}
`;

const PATCH_TRAP_DEMO = ps`
# The deserialized-object trap, shown locally: push a live object through the serializer that remoting uses
$live = Get-Service -Name Spooler
$copy = [System.Management.Automation.PSSerializer]::Deserialize([System.Management.Automation.PSSerializer]::Serialize($live, 2))
$live.GetType().FullName
$copy.PSObject.TypeNames[0]
'Has a Stop() method: live={0}, copy={1}' -f ($null -ne $live.PSObject.Methods['Stop']), ($null -ne $copy.PSObject.Methods['Stop'])
$live.Status.GetType().Name
$copy.Status.GetType().Name
`;

const PATCH_MAIN_REPORT = ps`
# Worst first, so the problems are at the top of the report
$rank = @{ Unreachable = 0; RemotingFailed = 1; OutOfDate = 2; RebootPending = 3; NoHotfixData = 4; OK = 5 }
$report = @($rows | Sort-Object @{ Expression = { $rank[$_.Status] } }, ComputerName)

New-Item -ItemType Directory -Path $OutDir -Force | Out-Null
$stamp = Get-Date -Format 'yyyyMMdd-HHmm'
$csvPath = Join-Path $OutDir "patch-report-$stamp.csv"
$htmlPath = Join-Path $OutDir "patch-report-$stamp.html"

$report | Export-Csv -Path $csvPath -NoTypeInformation -Encoding UTF8

$counts = $report | Group-Object Status | Sort-Object Name | ForEach-Object { '{0}: {1}' -f $_.Name, $_.Count }

$css = @'
body { font-family: Segoe UI, Arial, sans-serif; margin: 24px; color: #222; }
table { border-collapse: collapse; width: 100%; font-size: 13px; }
th { background: #1f3a5f; color: #fff; text-align: left; padding: 6px 8px; }
td { border-bottom: 1px solid #ddd; padding: 6px 8px; }
tr:nth-child(even) td { background: #f6f8fa; }
td.ok { color: #1a7f37; font-weight: 600; }
td.warn { color: #9a6700; font-weight: 600; }
td.bad { color: #cf222e; font-weight: 600; }
'@

# -Fragment returns just the <table>; the page around it is ours
$table = $report | ConvertTo-Html -Fragment | Out-String
$table = $table -replace '<td>(OK)</td>', '<td class="ok">$1</td>'
$table = $table -replace '<td>(OutOfDate|RebootPending|NoHotfixData)</td>', '<td class="warn">$1</td>'
$table = $table -replace '<td>(Unreachable|RemotingFailed)</td>', '<td class="bad">$1</td>'

$html = @"
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Patch compliance report</title><style>$css</style></head>
<body>
<h1>Patch compliance report</h1>
<p>Generated $(Get-Date -Format 'yyyy-MM-dd HH:mm') on $env:COMPUTERNAME. OutOfDate means the newest hotfix is more than $MaxPatchAgeDays days old.</p>
<p>$($counts -join ' | ')</p>
$table
<p><small>Source: Get-HotFix and Win32_OperatingSystem over WinRM. Get-HotFix does not list every update, so treat this as a triage list. WSUS, Intune or Windows Update reports are the authoritative record.</small></p>
</body>
</html>
"@
Set-Content -Path $htmlPath -Value $html -Encoding UTF8

$report | Format-Table ComputerName, Status, NewestHotFix, PatchAgeDays, RebootPending, Detail -AutoSize | Out-Host
Write-Host "CSV:  $csvPath"
Write-Host "HTML: $htmlPath"
if ($PassThru) { $report }
`;

const PATCH_FINAL_SCRIPT = [
  PATCH_HEADER,
  [PATCH_REACH, PATCH_ROW].join('\n\n'),
  PATCH_COLLECT,
  [PATCH_MAIN_COLLECT, PATCH_MAIN_REPORT].join('\n\n'),
].join('\n\n');

const PATCHING_REPORT: ProjectGuide = {
  id: 'patching-report',
  title: 'Patch compliance report across a list of servers',
  scenario:
    'Every month someone asks which servers are behind on patches, and today you answer by remoting into each one and looking at Windows Update. You will build a report that checks a whole list in one pass, copes with servers that are off or unreachable, and produces a CSV for the spreadsheet and an HTML page you can drop on a share.',
  level: 'Intermediate',
  minutes: 60,
  needs: [
    'Lab: DC01 (192.168.56.10), SRV-CORE01 (192.168.56.20) and CLIENT01 (192.168.56.30), with PowerShell remoting enabled (Enable-PSRemoting on each)',
    'An account that is a local administrator on the targets (the lab domain administrator is fine)',
    'Lessons 11-2 (WinRM and remoting), 5-1 (the pipeline) and 14-1 (error handling)',
  ],
  outcomes: [
    'Collect update, uptime and pending-reboot data from many servers in one pass with Invoke-Command -ThrottleLimit',
    'Pre-check reachability and record unreachable hosts instead of crashing or hanging',
    'Capture remote errors with -ErrorAction SilentlyContinue -ErrorVariable and report them per host',
    'Avoid the deserialized-object trap by returning flat objects from the remote side',
    'Produce a CSV and a styled HTML report with ConvertTo-Html -Fragment, and explain what Get-HotFix cannot tell you',
  ],
  steps: [
    {
      title: 'Decide what the report must answer',
      explain:
        'Write the questions before the code. For each server: is it reachable, when was the newest update installed, is it older than your limit, has it been restarted since, and is a restart waiting? The default host list is the three lab machines plus SRV-GONE01, a name that does not exist, so you can watch the failure path work. The 35 day limit is a monthly patch cycle plus a few days of slack; change it to match your policy.',
      code: PATCH_HEADER,
      expect:
        'Nothing runs yet. Save the finished script as Get-PatchReport.ps1. The parameters give you sensible lab defaults and validate the numbers: -MaxPatchAgeDays 0 or -ThrottleLimit 500 is rejected before any server is touched.',
    },
    {
      title: 'Pre-check reachability',
      explain:
        'Invoke-Command against a dead name can sit and wait for a timeout, and it buries the useful information in red errors. A quick TCP check on port 5985 (WinRM over HTTP) tells you in seconds which hosts to even try. Test-WSMan is the stricter version: it asks the WinRM service rather than just the port. Either way, the answer is a plain true or false that your script can act on. Use host names, not IP addresses, so Kerberos authentication works.',
      code:
        PATCH_REACH +
        '\n\nTest-HostReachable -Name localhost\nTest-HostReachable -Name SRV-GONE01\nTest-WinRMListener -Name localhost',
      expect:
        'Run for real on a machine where WinRM is not running (a normal Windows 11 client):\n\nFalse\nFalse\nFalse\n\nlocalhost is False because nothing listens on 5985 there, SRV-GONE01 is False because the name does not exist, and Test-WSMan agrees (False). On a lab server with remoting enabled, the first and third calls return True. Note that nothing threw: a dead host is just a false.',
    },
    {
      title: 'Write what runs on each server',
      explain:
        'Put the collection code in a script block, so it can run locally while you test and remotely when it works. Get-HotFix gives the installed updates, Win32_OperatingSystem gives LastBootUpTime, and three registry checks tell you whether a restart is pending: Component Based Servicing RebootPending, Windows Update RebootRequired, and the PendingFileRenameOperations value. The last one is a weaker signal because some installers set it for harmless reasons, so the report keeps it in its own column. Return one flat object of simple values: that is what survives the trip back to your computer.',
      code: PATCH_COLLECT + '\n\n# Test the block on this machine first\n& $collect | Format-List',
      expect:
        'Run for real on a Windows 11 machine (computer name and dates shown are from that run, the name replaced):\n\nComputerName      : CLIENT01\nOS                : Microsoft Windows 11 Pro\nLastBoot          : 10/24/2026 12:48:35 AM\nNewestHotFixId    : KB5127648\nNewestHotFixDate  : 10/15/2026 12:00:00 AM\nHotFixCount       : 4\nRebootPendingCbs  : False\nRebootRequiredWU  : False\nPendingFileRename : True\n\nThe date format follows your regional settings. PendingFileRename is True here even though no restart is requested by CBS or Windows Update, which is why it is a weak signal.',
    },
    {
      title: 'Fan out with Invoke-Command and collect the errors',
      explain:
        'Invoke-Command -ComputerName runs the block on many servers at once, up to -ThrottleLimit at a time (the default is 32, so 50 servers are not all done together). -ErrorAction SilentlyContinue keeps one bad host from flooding the screen, and -ErrorVariable remoteErrors (no dollar sign) keeps the errors so you can say which host failed and why. The script then builds one row per host from three sources: hosts that failed the pre-check, hosts that answered, and hosts that passed the pre-check but returned nothing. Below the code is the deserialized-object trap: objects that come back over remoting are copies without methods, so call methods on the remote side or return plain values.',
      code: PATCH_MAIN_COLLECT + '\n\n' + PATCH_TRAP_DEMO,
      expect:
        'The Invoke-Command part could not be run for real here (WinRM is off on the authoring machine); it was exercised with stand-ins that return a result for DC01 and SRV-CORE01, and an Access is denied error for CLIENT01. The trap demo at the bottom was run for real, and shows what remoting does to an object:\n\nSystem.ServiceProcess.ServiceController\nDeserialized.System.ServiceProcess.ServiceController\nHas a Stop() method: live=True, copy=False\nServiceControllerStatus\nInt32\n\nThe copy has the right properties but no methods, and even the Status enum has become a plain number.',
    },
    {
      title: 'Turn raw data into report rows',
      explain:
        'One small function turns either a result or a failure into a row. It works out the patch age in days, the uptime, and a single Status: OutOfDate if the newest hotfix is older than your limit, RebootPending if a restart is waiting, NoHotfixData if the server returned no dated hotfixes, otherwise OK. Every row has exactly the same columns. That matters because Export-Csv in Windows PowerShell 5.1 takes its column list from the first object: if the first row were a short "Unreachable" row, the CSV would lose the other columns.',
      code: PATCH_ROW + '\n\n' + PATCH_ROW_DEMO,
      expect:
        'Run for real with the local data and a failure row (the Status logic is the same for remote data):\n\nComputerName      : CLIENT01\nStatus            : OK\nDetail            :\nOS                : Microsoft Windows 11 Pro\nLastBoot          : 10/24/2026 12:48:35 AM\nUptimeDays        : 11\nNewestHotFix      : KB5127648\nNewestHotFixDate  : 10/15/2026 12:00:00 AM\nPatchAgeDays      : 20\nHotFixCount       : 4\nRebootPending     : False\nPendingFileRename : True\n\nComputerName      : SRV-GONE01\nStatus            : Unreachable\nDetail            : No answer on TCP 5985 (WinRM)\n(all other columns empty)\n\nThe numbers depend on the day you run it.',
    },
    {
      title: 'Write the CSV and the HTML report',
      explain:
        'The CSV is for spreadsheets and for comparing month to month. The HTML is for people: ConvertTo-Html -Fragment returns only the table, and you add the page, the CSS and the summary line around it. A small -replace colours the Status cells. Rows are sorted worst first so the problems are at the top. The footer states the limits of the data in the report itself, so nobody reads it as more than it is.',
      code: PATCH_MAIN_REPORT,
      expect:
        'Run for real in a scratch folder, on a four-row report built with stand-ins for the remoting (so the data for DC01 is invented). The console shows the worst rows first:\n\nComputerName Status         NewestHotFix PatchAgeDays RebootPending Detail\n------------ ------         ------------ ------------ ------------- ------\nSRV-GONE01   Unreachable                                            No answer on TCP 5985 (WinRM)\nCLIENT01     RemotingFailed                                         Connecting to remote server CLIENT01 failed with...\nDC01         OutOfDate      KB0000001    61           False\nSRV-CORE01   OK             KB5127648    20           False\n\nThe CSV has one header and one row per host, all with 12 columns (failure rows have empty cells). In the HTML the Status cells carry class="bad", "warn" or "ok", and the summary line reads: OK: 1 | OutOfDate: 1 | RemotingFailed: 1 | Unreachable: 1. Open the HTML in a browser to see the colours.',
    },
    {
      title: 'Run it and read it honestly',
      explain:
        'Run the finished script. Then read the result with its limits in mind. Get-HotFix reads Win32_QuickFixEngineering, which lists only the updates that Component Based Servicing reports. Some updates, for example certain driver, Defender, .NET or Office updates, may not appear, and InstalledOn is sometimes blank. A server shown as OK here is not proven fully patched. For the authoritative answer use the Windows Update Agent API, the PSWindowsUpdate module, an Intune update report, or your WSUS or Configuration Manager compliance reports. Treat this script as a fast triage that tells you where to look first.',
      code: ps`
# Lab run (read-only on the servers; writes the reports into .\reports)
.\Get-PatchReport.ps1 -MaxPatchAgeDays 35

# Only the problems, from the CSV
Import-Csv (Get-ChildItem .\reports\patch-report-*.csv | Sort-Object LastWriteTime | Select-Object -Last 1).FullName |
    Where-Object Status -ne 'OK' |
    Format-Table ComputerName, Status, Detail -AutoSize
`,
      expect:
        'In your lab you should see a warning for SRV-GONE01, the table from the previous step with your real servers, and the two file paths. The second command prints only rows that are not OK. Expected on the first run: SRV-GONE01 (Unreachable) and any server whose newest hotfix is older than 35 days or that failed remoting, each with a Detail explaining why. Not run against real lab servers here.',
    },
  ],
  finalScript: PATCH_FINAL_SCRIPT,
  checklist: [
    'Run it first against one lab server, then the full list, before you point it at production.',
    'Confirm WinRM works with names (not IP addresses) from the machine you run it on: Test-WSMan SRV-CORE01.',
    'Check the account you run it with is a local administrator on the targets and nothing more privileged than that.',
    'Read the Unreachable and RemotingFailed rows: a server that cannot be checked is itself a finding.',
    'Compare a few OK and OutOfDate rows with Windows Update history on the server itself.',
    'Decide your MaxPatchAgeDays from your real patch policy, not from the default.',
    'Say in the report footer that it is Get-HotFix based, and keep a pointer to your authoritative source (WSUS, Intune or Configuration Manager).',
    'Keep the CSVs: next month you can compare them with Compare-Object.',
  ],
  pitfalls: [
    {
      problem: 'Get-HotFix -ComputerName fails or times out on servers where remoting works fine.',
      fix: 'Get-HotFix -ComputerName uses DCOM/RPC, not WinRM, and firewalls often block it. Run Get-HotFix inside Invoke-Command so it uses the WinRM port you already opened.',
    },
    {
      problem: 'Code that calls methods on remote results fails, or sorting and formatting behave strangely.',
      fix: 'Results from Invoke-Command are deserialized copies: properties only, no methods, and a Deserialized type name. Do the work on the remote side and return flat objects of simple values, as the collect block does.',
    },
    {
      problem: 'One dead server makes the run slow or fills the screen with red errors.',
      fix: 'Pre-check with a quick port test, use -ErrorAction SilentlyContinue -ErrorVariable on Invoke-Command, and turn every failure into a row in the report.',
    },
    {
      problem: 'The CSV is missing columns, or the columns are wrong for most rows.',
      fix: 'Windows PowerShell 5.1 Export-Csv takes the columns from the first object. Give every row, including failure rows, the same properties by building them all with one function.',
    },
    {
      problem: 'A server looks stale or has no data even though it is fully patched.',
      fix: 'Get-HotFix does not list every update and InstalledOn can be blank. Report that case as NoHotfixData, and confirm with WSUS, Intune, Configuration Manager or the Windows Update Agent.',
    },
    {
      problem: 'Many healthy servers show a pending file rename and the report cries wolf.',
      fix: 'PendingFileRenameOperations is set by many installers and is a weak signal. Keep it in its own column and base the RebootPending status on the CBS and Windows Update keys. Also use host names, not IP addresses, or Kerberos fails and you end up fighting TrustedHosts.',
    },
  ],
  stretch: [
    'Run the collection with -AsJob and Receive-Job so a slow server does not hold up the rest.',
    'Query the Windows Update Agent (Microsoft.Update.Session) for updates that are missing, not just installed.',
    'Compare this month\'s CSV with last month\'s using Compare-Object and report only what changed.',
    'Schedule the script monthly and mail or post the HTML report using the unattended pattern from project 3.',
  ],
};

/* ------------------------------------------------------------------ */
/* Project 3: unattended automation with secrets                      */
/* ------------------------------------------------------------------ */

const UNATT_NONINTERACTIVE = ps`
# What a scheduled task sees: a PowerShell with no human attached
powershell.exe -NoProfile -NonInteractive -Command "Read-Host 'Password' -AsSecureString"
'Exit code: ' + $LASTEXITCODE

powershell.exe -NoProfile -NonInteractive -Command "Get-Credential"
'Exit code: ' + $LASTEXITCODE
`;

const UNATT_CLIXML = ps`
# Demo with a made-up account and a made-up password. Never type a real password into a demo.
$demo = New-Object System.Management.Automation.PSCredential('CORP\svc-demo', (ConvertTo-SecureString 'NotARealPassword-Demo1' -AsPlainText -Force))
$path = Join-Path $env:TEMP 'demo-cred.xml'
$demo | Export-Clixml -Path $path

Get-Content -Path $path

$back = Import-Clixml -Path $path
$back.UserName
$back.Password.GetType().Name

Remove-Item -Path $path
`;

const UNATT_SECRETS = ps`
# LAB ONLY. Installs two modules for your user only. -WhatIf shows the plan; remove it to really install.
Install-Module -Name Microsoft.PowerShell.SecretManagement, Microsoft.PowerShell.SecretStore -Scope CurrentUser -Repository PSGallery -WhatIf

# LAB ONLY, one time, as the account that will read the secrets: register the local vault
Register-SecretVault -Name LabVault -ModuleName Microsoft.PowerShell.SecretStore -DefaultVault

# Choose how the store is protected. Option A, an interactive workstation: a store password,
# asked once and remembered for 15 minutes
Set-SecretStoreConfiguration -Scope CurrentUser -Authentication Password -PasswordTimeout 900 -Interaction Prompt
# Option B, unattended: no store password and no prompts. Anyone who can run code as this
# account can read every secret in the store.
# Set-SecretStoreConfiguration -Scope CurrentUser -Authentication None -Interaction None

# Store and read secrets (typed in once, never in the script or in history)
Set-Secret -Name InventoryApiToken -Secret (Read-Host -Prompt 'Paste the API token' -AsSecureString)
Set-Secret -Name AlertWebhookUrl -Secret (Read-Host -Prompt 'Paste the alert webhook URL' -AsSecureString)

Get-SecretInfo                                       # names and types, never values
$token = Get-Secret -Name InventoryApiToken          # a SecureString
Get-Secret -Name InventoryApiToken -AsPlainText      # only at the moment of use, never print or log it

# With a store password and -Interaction None, an unattended job must unlock the store first:
# Unlock-SecretStore -Password $storePassword -PasswordTimeout 3600
`;

const UNATT_GMSA = ps`
# LAB ONLY, on DC01 as a domain admin. Every command that supports it is run with -WhatIf first.
# A gMSA needs a KDS root key, once per forest.
Get-KdsRootKey
# Lab trick: back-date the key so it works at once. In production it takes about 10 hours to replicate.
Add-KdsRootKey -EffectiveTime ((Get-Date).AddHours(-10)) -WhatIf

# The account. Only the computers listed here can retrieve its password.
New-ADServiceAccount -Name 'gmsa-nightly' -DNSHostName 'gmsa-nightly.corp.example.com' -PrincipalsAllowedToRetrieveManagedPassword 'SRV-CORE01$' -WhatIf

# LAB ONLY, on SRV-CORE01 (needs the ActiveDirectory module there)
Install-ADServiceAccount -Identity 'gmsa-nightly' -WhatIf
Test-ADServiceAccount -Identity 'gmsa-nightly'
`;

const UNATT_HEADER = ps`
#Requires -Version 5.1
<#
.SYNOPSIS
    Unattended nightly job with no password in the file.
    -Register creates the scheduled task (run once, elevated, LAB first). Without it, the job runs.
.EXAMPLE
    .\NightlyCheck.ps1 -Register -TaskAccount 'CORP\gmsa-nightly$' -WhatIf
#>
[CmdletBinding(SupportsShouldProcess)]
param(
    [switch]$Register,
    [string]$TaskAccount = 'CORP\gmsa-nightly$',
    [string]$TaskName = 'NightlyCheck',
    [string]$ApiUri = 'https://inventory.corp.example.com/api/v1/health',
    [string]$EventSource = 'NightlyCheck'
)

# Exit codes: what Task Scheduler shows as "Last Run Result"
$ExitOk = 0
$ExitSecretMissing = 10
$ExitJobFailed = 20
`;

const UNATT_LOGGING = ps`
function Write-Log {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory)][string]$Message,
        [ValidateSet('INFO', 'WARN', 'ERROR')][string]$Level = 'INFO'
    )

    # One JSON object per line: easy to read, and easy to query later with ConvertFrom-Json
    $entry = [ordered]@{
        Time    = (Get-Date).ToString('o')
        Level   = $Level
        Host    = $env:COMPUTERNAME
        User    = [Environment]::UserName
        Message = $Message
    }
    ($entry | ConvertTo-Json -Compress) | Add-Content -Path $script:LogFile -Encoding UTF8 -WhatIf:$false
    Write-Verbose "[$Level] $Message"
}

function Send-FailureAlert {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory)][string]$Message,
        [Parameter(Mandatory)][int]$ExitCode,
        [Parameter(Mandatory)][string]$EventSource
    )

    $text = 'NightlyCheck on {0} failed with exit code {1}: {2}' -f $env:COMPUTERNAME, $ExitCode, $Message

    # 1. Event log: your monitoring or event forwarding can pick this up (Send-MailMessage is obsolete)
    try {
        Write-EventLog -LogName Application -Source $EventSource -EntryType Error -EventId (4000 + $ExitCode) -Message $text -ErrorAction Stop
    }
    catch { Write-Log -Level WARN -Message "Event log entry failed: $($_.Exception.Message)" }

    # 2. Webhook placeholder: the URL is itself a secret, so it comes from the vault
    try {
        $hook = Get-Secret -Name 'AlertWebhookUrl' -AsPlainText -ErrorAction Stop
        $body = @{ text = $text } | ConvertTo-Json -Compress
        Invoke-RestMethod -Uri $hook -Method Post -ContentType 'application/json' -Body $body -TimeoutSec 15 -ErrorAction Stop | Out-Null
    }
    catch { Write-Log -Level WARN -Message "Webhook alert skipped: $($_.Exception.Message)" }
}
`;

const UNATT_JOB = ps`
function Invoke-NightlyJob {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory)][string]$ApiUri,
        [Parameter(Mandatory)][string]$EventSource
    )

    $exitCode = $ExitOk
    $logDir = Join-Path $PSScriptRoot 'Logs'
    New-Item -ItemType Directory -Path $logDir -Force -WhatIf:$false | Out-Null
    $stamp = Get-Date -Format 'yyyyMMdd'
    $script:LogFile = Join-Path $logDir "nightly-$stamp.jsonl"
    Start-Transcript -Path (Join-Path $logDir "transcript-$stamp.txt") -Append -WhatIf:$false | Out-Null

    try {
        Write-Log 'Job started'
        # Older 5.1 builds may not negotiate TLS 1.2 by default
        [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

        try {
            Import-Module Microsoft.PowerShell.SecretManagement -ErrorAction Stop
            $token = Get-Secret -Name 'InventoryApiToken' -AsPlainText -ErrorAction Stop
        }
        catch {
            $exitCode = $ExitSecretMissing
            throw "Could not read secret InventoryApiToken: $($_.Exception.Message)"
        }

        $headers = @{ Authorization = "Bearer $token" }
        $health = Invoke-RestMethod -Uri $ApiUri -Headers $headers -TimeoutSec 30 -ErrorAction Stop
        Write-Log "API answered: $($health.status)"
    }
    catch {
        if ($exitCode -eq $ExitOk) { $exitCode = $ExitJobFailed }
        Write-Log -Level ERROR -Message $_.Exception.Message
        Send-FailureAlert -Message $_.Exception.Message -ExitCode $exitCode -EventSource $EventSource
    }
    finally {
        Write-Log "Finished with exit code $exitCode"
        Stop-Transcript | Out-Null
    }

    # Set a script-level variable instead of returning, so stray output can never become the exit code
    $script:JobExitCode = $exitCode
}
`;

const UNATT_FOLDER = ps`
function Protect-AutomationFolder {
    [CmdletBinding(SupportsShouldProcess)]
    param(
        [Parameter(Mandatory)][string]$Path,
        [Parameter(Mandatory)][string]$Account
    )

    if (-not $PSCmdlet.ShouldProcess($Path, "Remove inherited permissions; SYSTEM and Administrators full control; $Account read-only except Logs")) { return }

    $inherit = [System.Security.AccessControl.InheritanceFlags]'ContainerInherit, ObjectInherit'
    $none = [System.Security.AccessControl.PropagationFlags]::None
    $allow = [System.Security.AccessControl.AccessControlType]::Allow
    $logs = Join-Path $Path 'Logs'
    New-Item -ItemType Directory -Path $logs -Force | Out-Null

    # Folder: stop inheriting (and drop the inherited rules), then add back only what is needed
    $acl = Get-Acl -Path $Path
    $acl.SetAccessRuleProtection($true, $false)
    $grants = @(
        @{ Who = 'NT AUTHORITY\SYSTEM'; Rights = 'FullControl' },
        @{ Who = 'BUILTIN\Administrators'; Rights = 'FullControl' },
        @{ Who = $Account; Rights = 'ReadAndExecute' }
    )
    foreach ($g in $grants) {
        $rule = New-Object System.Security.AccessControl.FileSystemAccessRule($g.Who, $g.Rights, $inherit, $none, $allow)
        $acl.AddAccessRule($rule)
    }
    Set-Acl -Path $Path -AclObject $acl

    # Logs: the only place the task account may write. It cannot change the script it runs.
    $logAcl = Get-Acl -Path $logs
    $logRule = New-Object System.Security.AccessControl.FileSystemAccessRule($Account, 'Modify', $inherit, $none, $allow)
    $logAcl.AddAccessRule($logRule)
    Set-Acl -Path $logs -AclObject $logAcl
}
`;

const UNATT_REGISTER = ps`
function Register-NightlyTask {
    [CmdletBinding(SupportsShouldProcess)]
    param(
        [Parameter(Mandatory)][string]$TaskName,
        [Parameter(Mandatory)][string]$ScriptPath,
        [Parameter(Mandatory)][string]$Account,
        [Parameter(Mandatory)][string]$EventSource
    )

    $folder = Split-Path -Parent $ScriptPath
    if ($folder -match '^[A-Za-z]:\\?$' -or $folder -like "$env:USERPROFILE*") {
        throw "Keep the script in its own folder such as C:\Automation\NightlyCheck. Refusing to lock down $folder"
    }
    $isAdmin = ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
    if (-not $isAdmin -and -not $WhatIfPreference) { throw 'Run this from an elevated PowerShell window.' }

    # RemoteSigned, not Bypass: the script is local, so it runs, and a downloaded unsigned script would not
    $arguments = '-NoProfile -NonInteractive -ExecutionPolicy RemoteSigned -File "{0}"' -f $ScriptPath
    $action = New-ScheduledTaskAction -Execute 'powershell.exe' -Argument $arguments -WorkingDirectory $folder
    $trigger = New-ScheduledTaskTrigger -Daily -At '02:00'
    $settings = New-ScheduledTaskSettingsSet -ExecutionTimeLimit (New-TimeSpan -Hours 1) -StartWhenAvailable -MultipleInstances IgnoreNew

    # Register-ScheduledTask and New-EventLog have no -WhatIf of their own, so this gate is the dry run
    if (-not $PSCmdlet.ShouldProcess("$TaskName as $Account", 'Create event source, lock the script folder, register the scheduled task')) { return }

    if (-not [System.Diagnostics.EventLog]::SourceExists($EventSource)) {
        New-EventLog -LogName Application -Source $EventSource
    }
    Protect-AutomationFolder -Path $folder -Account $Account

    if ($Account.EndsWith('$')) {
        # gMSA: Windows supplies and rotates the password, so none is passed here
        $principal = New-ScheduledTaskPrincipal -UserId $Account -LogonType Password -RunLevel Limited
        Register-ScheduledTask -TaskName $TaskName -Action $action -Trigger $trigger -Settings $settings -Principal $principal -Description 'Nightly check (lab)' | Out-Null
    }
    else {
        # Ordinary service account: Task Scheduler must store its password once
        $cred = Get-Credential -UserName $Account -Message "Password for $Account"
        Register-ScheduledTask -TaskName $TaskName -Action $action -Trigger $trigger -Settings $settings -User $cred.UserName -Password $cred.GetNetworkCredential().Password -RunLevel Limited -Description 'Nightly check (lab)' | Out-Null
    }
}
`;

const UNATT_MAIN = ps`
if ($Register) {
    Register-NightlyTask -TaskName $TaskName -ScriptPath $PSCommandPath -Account $TaskAccount -EventSource $EventSource
    return
}

$script:JobExitCode = $ExitOk
Invoke-NightlyJob -ApiUri $ApiUri -EventSource $EventSource
exit $script:JobExitCode
`;

const UNATT_OPERATE = ps`
# Test the script by hand first, under the SAME account the task will use, and look at the exit code
powershell.exe -NoProfile -ExecutionPolicy RemoteSigned -File C:\Automation\NightlyCheck\NightlyCheck.ps1
'Exit code: ' + $LASTEXITCODE

# LAB ONLY: run the registered task now, then read the evidence
Start-ScheduledTask -TaskName NightlyCheck
Start-Sleep -Seconds 15
Get-ScheduledTaskInfo -TaskName NightlyCheck | Select-Object LastRunTime, LastTaskResult, NextRunTime

Get-Content C:\Automation\NightlyCheck\Logs\nightly-*.jsonl | ConvertFrom-Json | Format-Table Time, Level, Message -AutoSize
Get-WinEvent -FilterHashtable @{ LogName = 'Application'; ProviderName = 'NightlyCheck' } -MaxEvents 5 -ErrorAction SilentlyContinue |
    Format-List TimeCreated, Id, Message
`;

const UNATT_FINAL_SCRIPT = [
  UNATT_HEADER,
  [UNATT_LOGGING, UNATT_FOLDER, UNATT_REGISTER, UNATT_JOB].join('\n\n'),
  UNATT_MAIN,
].join('\n\n');

const UNATTENDED_SECRETS: ProjectGuide = {
  id: 'unattended-secrets',
  title: 'Run a script unattended without a password in the file',
  scenario:
    'Your nightly job works when you run it by hand, because you type the password when it asks. Now it has to run at 02:00 with nobody there. The tempting fixes are a password in the script, a password in a text file, or ExecutionPolicy Bypass, and all of them end up in an incident report. You will build the job so that no secret is in the file, it runs as an account that is not you, it logs what it does, and it raises an alert when it fails.',
  level: 'Advanced',
  minutes: 75,
  needs: [
    'Lab: SRV-CORE01 (192.168.56.20) to host the task, DC01 (192.168.56.10) for the gMSA, and CLIENT01 (192.168.56.30) to work from',
    'An elevated PowerShell window on the machine that will run the task',
    'Internet access to the PowerShell Gallery (for the SecretManagement and SecretStore modules), on a lab machine',
    'Lessons 6-2 (secure input), 10-1 (scripts and execution policies), 13-2 (scheduled tasks) and 14-1 (error handling)',
  ],
  outcomes: [
    'Explain why Read-Host and Get-Credential cannot work in a scheduled task',
    'Use Export-Clixml and SecretManagement with SecretStore, and state exactly who can read each one',
    'Explain why a gMSA is the right identity for a service account and what its lab setup looks like',
    'Register a scheduled task with a principal, RunLevel Limited and ExecutionPolicy RemoteSigned, and lock the script folder with an ACL',
    'Add a structured log, meaningful exit codes and a failure alert without Send-MailMessage',
  ],
  steps: [
    {
      title: 'See why prompts cannot work unattended',
      explain:
        'A scheduled task runs without a person at the keyboard. Read-Host and Get-Credential both need a person: with -NonInteractive they fail at once, and without it, the prompt waits in a window nobody can see until the task time limit stops it. So anything your script needs, a password or a token, has to come from somewhere the script can reach on its own. The rest of this project is about choosing that somewhere safely.',
      code: UNATT_NONINTERACTIVE,
      expect:
        'Run for real. Both fail straight away (error text shortened):\n\nRead-Host : Windows PowerShell is in NonInteractive mode. Read and Prompt functionality is not available.\nExit code: 1\nGet-Credential : Cannot process command because of one or more missing mandatory parameters: Credential.\nExit code: 1\n\nWithout -NonInteractive the task would not fail: it would sit in a hidden window waiting for someone to type, until the task time limit stops it.',
    },
    {
      title: 'Export-Clixml: a credential file, and its limits',
      explain:
        'Export-Clixml writes a credential to an XML file, and the password inside is encrypted with the Windows Data Protection API (DPAPI). That encryption is tied to the user and the computer: only the same user, on the same machine, can decrypt it. This has two consequences. It is safer than plain text, because copying the file to another computer or opening it as another user gets you nothing. But it also means the file you created as yourself will not work for the service account that runs the task, and anyone who can run code as that account can decrypt it. It also does not move with the script. Use it for a personal script on your own machine, not as a shared secret store.',
      code: UNATT_CLIXML,
      expect:
        'Run for real with the fake account (the long encrypted value is shortened here):\n\n<Objs Version="1.1.0.1" xmlns="http://schemas.microsoft.com/powershell/2004/04">\n  <Obj RefId="0">\n    <TN RefId="0">\n      <T>System.Management.Automation.PSCredential</T>\n      <T>System.Object</T>\n    </TN>\n    <ToString>System.Management.Automation.PSCredential</ToString>\n    <Props>\n      <S N="UserName">CORP\\svc-demo</S>\n      <SS N="Password">01000000d08c9ddf0115d1118c7a00c04fc297eb01000000...</SS>\n    </Props>\n  </Obj>\n</Objs>\nCORP\\svc-demo\nSecureString\n\nThe user name is readable, the password is an encrypted blob (the SS element means "secure string"). Import-Clixml gives you the credential back, but only as the same user on the same machine.',
    },
    {
      title: 'SecretManagement and SecretStore',
      explain:
        'Microsoft.PowerShell.SecretManagement gives you one set of commands (Set-Secret, Get-Secret) that sit in front of any vault, so your script does not change when the vault does. SecretStore is the local vault module: it keeps secrets encrypted in the profile of the user who created it, so like Clixml it is per user and per machine. The important decision is Authentication. With a store password, an unattended job must supply that password to unlock the store, which only moves the problem. With Authentication None there is no password and no prompt, which suits unattended jobs, but anyone who can run code as that account can read the secrets. Be clear about that trade-off. The real gain of SecretManagement is that you can later point the same Get-Secret calls at an enterprise vault such as Azure Key Vault.',
      code: UNATT_SECRETS,
      expect:
        'Not run: the SecretManagement and SecretStore modules are not installed on the authoring machine and nothing was installed. These commands use the documented parameters of both modules. In your lab you should see: Install-Module only prints a "What if" line; Get-SecretInfo lists InventoryApiToken and AlertWebhookUrl with type SecureString and VaultName LabVault, with no values; Get-Secret returns System.Security.SecureString; and Get-Secret -AsPlainText returns your token as text, so never put that call in a line that prints or logs it.',
    },
    {
      title: 'gMSA: the right identity for a service account (lab only)',
      explain:
        'The best way to avoid a stored password is to have no password to store. A group Managed Service Account (gMSA) is an AD account whose password is generated and rotated by the domain, and only the computers you name can retrieve it. Nobody knows the password, nobody types it and it cannot be used to log on interactively. A scheduled task can run as a gMSA with no password supplied. A gMSA covers Windows and AD access. It does not hold third-party secrets such as an API token: for those you still need a vault that the gMSA identity can read. Everything here is lab only and uses -WhatIf where the cmdlet supports it.',
      code: UNATT_GMSA,
      expect:
        'Not run: the ActiveDirectory module is not installed on the authoring machine, and these commands change the domain. Documented behaviour: with -WhatIf each state-changing line prints a "What if" message and changes nothing. Get-KdsRootKey prints nothing in a new lab, which is why the root key is created first. Test-ADServiceAccount returns True on SRV-CORE01 once the gMSA is installed there; False or an error means the computer is not allowed to retrieve the password. Remove -WhatIf only in a disposable lab.',
    },
    {
      title: 'Logging and a failure alert that does not need email',
      explain:
        'An unattended job that fails silently is worse than one that fails loudly. Write-Log writes one JSON object per line, which you can read with ConvertFrom-Json. Send-FailureAlert writes an entry to the Application event log, where monitoring or event forwarding can see it, and posts to a webhook whose URL comes from the vault. Send-MailMessage is obsolete (Microsoft recommends against it, and it cannot do modern authentication), so it is not used. The alert code is wrapped in its own try/catch: a broken alert must never hide the original failure. Create the event source once, elevated, as part of registration.',
      code: UNATT_LOGGING,
      expect:
        'Nothing runs yet; the functions are used by the job in the next step. Exercised for real in a scratch folder with the event log write replaced by a stand-in (no event source was created). A failed run writes JSON lines like:\n\n{"Time":"2026-11-04T06:50:00.0000000+01:00","Level":"ERROR","Host":"SRV-CORE01","User":"gmsa-nightly$","Message":"The remote name could not be resolved: inventory.corp.example.com"}\n\nand the alert text is: NightlyCheck on SRV-CORE01 failed with exit code 20: ... (event ID 4020). The values shown for Host and User are examples.',
    },
    {
      title: 'The job: read the secret, do the work, exit with a code',
      explain:
        'Task Scheduler cannot read your logs, but it does record your exit code as Last Run Result. So give each kind of failure its own code: 0 is success, 10 means the secret could not be read, 20 means the job itself failed. The structure is: start a transcript, try the work, catch to set the code and raise the alert, and finally to log the result and stop the transcript. The token exists only in a variable, is used once and is never written to a log. With powershell.exe -File, "exit 20" becomes the process exit code, which is what $LASTEXITCODE shows in a calling shell.',
      code: UNATT_JOB,
      expect:
        'Run for real as a whole script, with Get-Secret and Invoke-RestMethod replaced by stand-ins and Write-EventLog replaced by a recorder. Three scenarios gave these results (Level and Message of the log lines):\n\nSecret module missing: exit code 10\n  INFO Job started\n  ERROR Could not read secret InventoryApiToken: The specified module \'Microsoft.PowerShell.SecretManagement\' was not loaded because no valid module file was found in any module directory.\n  WARN Webhook alert skipped: The term \'Get-Secret\' is not recognized ...\n  INFO Finished with exit code 10\n\nEverything works: exit code 0\n  INFO Job started\n  INFO API answered: ok\n  INFO Finished with exit code 0\n\nAPI call fails: exit code 20, ERROR line with the API error, an alert recorded as event ID 4020. The fake token appeared in neither the log nor the transcript.',
    },
    {
      title: 'Lock the folder and register the task (LAB ONLY)',
      explain:
        'If a normal user can edit the script, they can run their code as the service account, so the folder ACL is part of the security of the job. The function removes inherited permissions, gives SYSTEM and Administrators full control, gives the task account read and execute only, and gives it Modify on the Logs subfolder alone. The task itself uses a principal, RunLevel Limited (not Highest, unless the job truly needs elevation) and ExecutionPolicy RemoteSigned. Do not use Bypass: it turns off the one check that stops a downloaded script from running. Because Register-ScheduledTask and New-EventLog have no -WhatIf of their own, the function gates them with ShouldProcess so -WhatIf works.',
      code: UNATT_FOLDER + '\n\n' + UNATT_REGISTER + '\n\n# LAB ONLY. Dry run first (prints what it would do):\n# .\\NightlyCheck.ps1 -Register -TaskAccount \'CORP\\gmsa-nightly$\' -WhatIf',
      expect:
        'The dry run was run for real and changed nothing. It prints:\n\nWhat if: Performing the operation "Create event source, lock the script folder, register the scheduled task" on target "NightlyCheck as CORP\\gmsa-nightly$".\n\nThe registration itself (Register-ScheduledTask, New-EventLog, Set-Acl) was NOT run here. The New-ScheduledTaskPrincipal, -Trigger and -SettingsSet calls were run for real in memory and gave UserId CORP\\gmsa-nightly$, LogonType Password, RunLevel Limited, ExecutionTimeLimit PT1H and MultipleInstances IgnoreNew. The script refuses to lock a folder that is a drive root or inside your user profile.',
    },
    {
      title: 'Test the failure path on purpose, then operate it',
      explain:
        'A job you have only seen succeed is untested. Run it by hand as the task account, then break it deliberately (remove the secret, point the URL at nothing) and check that the exit code, the log line, the event log entry and the webhook all appear. After that, look at the task like an operator: Last Run Result, the JSON log and the event log. Somebody must also be watching the alert, or you have only built a quieter way to fail.',
      code: UNATT_OPERATE,
      expect:
        'Not run (it needs a registered task). In your lab, a healthy night looks like: Exit code: 0, a LastTaskResult of 0 and three log lines (Job started, API answered, Finished with exit code 0). With the secret removed you should see Exit code: 10, LastTaskResult 10 and an Application event from source NightlyCheck with ID 4010. Task Scheduler stores the exit code as a number, so 20 shows as 20 (0x14 in hex).',
    },
  ],
  finalScript: UNATT_FINAL_SCRIPT,
  checklist: [
    'Search the script and the folder for secrets: Select-String -Path .\\* -Pattern \'password|token|secret|apikey\' and read every hit.',
    'Run the script by hand once as the exact account the task will use, before you schedule it.',
    'Check the folder ACL with Get-Acl: SYSTEM and Administrators can write, the task account can read, and only Logs is writable by it.',
    'The task action uses -ExecutionPolicy RemoteSigned and -NonInteractive. No Bypass anywhere.',
    'RunLevel is Limited unless you can explain why the job needs elevation.',
    'Break the job on purpose (remove the secret) and confirm exit code 10, a log line, an event log entry and the webhook.',
    'Make sure transcripts and logs never contain a secret: do not print tokens, and do not echo headers or request bodies.',
    'Write down where each secret lives, who can read it and how to rotate it, then put a reminder in the calendar.',
    'Decide who watches the alert (monitoring, event forwarding or the webhook channel) and check they can see it.',
    'Register with -WhatIf first and read the message before you run it for real.',
  ],
  pitfalls: [
    {
      problem: 'The task works when you test it but fails when it runs as the service account, with an error about a missing credential or secret.',
      fix: 'Export-Clixml files and SecretStore vaults are per user and per machine. A secret created under your account does not exist for another account. Create it under the identity that will read it, or use a vault that the service identity can authenticate to.',
    },
    {
      problem: 'Task Scheduler refuses to start the task: Logon failure, or the user has not been granted the requested logon type.',
      fix: 'The account needs the "Log on as a batch job" right, and it must not be denied by Group Policy. Check Local Security Policy or the GPO, and check the gMSA is installed on this computer with Test-ADServiceAccount.',
    },
    {
      problem: 'Someone adds -ExecutionPolicy Bypass to the task "to make it work".',
      fix: 'Find the real cause. A local script runs under RemoteSigned. If a downloaded script is blocked, unblock it deliberately after you have read it, or sign it and use AllSigned. Bypass removes the check for every script that account runs.',
    },
    {
      problem: 'The script folder is writable by Users, or lives in a user profile or on a share many people can edit.',
      fix: 'Whoever can edit the script runs code as the service account. Keep it in its own folder with the ACL from step 7, and give the task account write access to the Logs folder only.',
    },
    {
      problem: 'The alert code uses Send-MailMessage.',
      fix: 'It is obsolete and does not support modern authentication. Write to the event log for your monitoring, and post to a webhook or use your mail platform\'s own API.',
    },
    {
      problem: 'Task Scheduler says the last run succeeded (0), but the job did nothing useful.',
      fix: 'A task reports the process exit code. If the script catches an error and ends normally, the code is 0. Set explicit exit codes, call exit in the script, run it with -File, and test the failure path on purpose.',
    },
  ],
  stretch: [
    'Sign the script with Set-AuthenticodeSignature and switch the task to -ExecutionPolicy AllSigned.',
    'Register the Azure Key Vault extension (Az.KeyVault) as a second SecretManagement vault and keep the same Get-Secret calls.',
    'Forward the Application log entries from the job to a central collector (Windows Event Forwarding) and alert on event ID 4010 and 4020.',
    'Add a heartbeat: the job writes a "last success" timestamp, and a second check alerts if it is more than 26 hours old.',
  ],
};

/* ------------------------------------------------------------------ */
/* Project 4: Pester and PSScriptAnalyzer                             */
/* ------------------------------------------------------------------ */

const PESTER_STAFF_FUNCTION = ps`
function New-StaffAccount {
    [CmdletBinding(SupportsShouldProcess)]
    param(
        [Parameter(Mandatory)][string]$SamAccountName,
        [Parameter(Mandatory)][string]$GivenName,
        [Parameter(Mandatory)][string]$Surname,
        [Parameter(Mandatory)][string]$Path,
        [Parameter(Mandatory)][securestring]$Password,
        [string]$UpnSuffix = 'corp.example.com',
        [string]$Server = 'DC01'
    )

    if ($PSCmdlet.ShouldProcess($SamAccountName, "Create AD user in $Path")) {
        $newUser = @{
            Name                  = "$GivenName $Surname"
            GivenName             = $GivenName
            Surname               = $Surname
            SamAccountName        = $SamAccountName
            UserPrincipalName     = "$SamAccountName@$UpnSuffix"
            Path                  = $Path
            AccountPassword       = $Password
            Enabled               = $true
            ChangePasswordAtLogon = $true
            Server                = $Server
            ErrorAction           = 'Stop'
        }
        New-ADUser @newUser
        [pscustomobject]@{ SamAccountName = $SamAccountName; Status = 'Created' }
    }
    else {
        [pscustomobject]@{ SamAccountName = $SamAccountName; Status = 'Skipped' }
    }
}
`;

// Only function definitions: dot-sourcing this file must not DO anything
const PESTER_HELPERS = [
  '# OnboardingHelpers.ps1: functions only. Nothing here runs until a function is called.',
  SAM_FUNCTIONS,
  PESTER_STAFF_FUNCTION,
].join('\n\n');

const PESTER_TEST_HEAD = ps`
BeforeAll {
    # Pester 5: load the code under test inside BeforeAll, never loose at the top of the file
    . (Join-Path $PSScriptRoot 'OnboardingHelpers.ps1')

    # Mock needs the command to exist. Where the ActiveDirectory module is missing,
    # define a stand-in with the same parameter names so the tests still run.
    if (-not (Get-Command New-ADUser -ErrorAction SilentlyContinue)) {
        function New-ADUser {
            [CmdletBinding()]
            param($Name, $GivenName, $Surname, $SamAccountName, $UserPrincipalName, $Path, $AccountPassword, $Enabled, $ChangePasswordAtLogon, $Server)
        }
    }
}
`;

const PESTER_TEST_SAM = ps`
Describe 'Get-SamBaseName' {
    It 'builds <Expected> from <Given> <Surname>' -TestCases @(
        @{ Given = 'Jane'; Surname = 'Smith'; Expected = 'j.smith' }
        @{ Given = 'Liam'; Surname = "O'Brien"; Expected = 'l.obrien' }
        @{ Given = 'Mary Ann'; Surname = 'Van Dyke'; Expected = 'm.vandyke' }
    ) {
        param($Given, $Surname, $Expected)
        Get-SamBaseName -GivenName $Given -Surname $Surname | Should -Be $Expected
    }

    It 'removes accents' {
        # [char] codes keep this file pure ASCII, so any editor and encoding is safe
        $given = "Jos$([char]0x00E9)"
        $surname = "Garc$([char]0x00ED)a"
        Get-SamBaseName -GivenName $given -Surname $surname | Should -Be 'j.garcia'
    }

    It 'never exceeds 18 characters, so a numeric suffix still fits in 20' {
        (Get-SamBaseName -GivenName 'Anna' -Surname 'Wolfeschlegelsteinhausenbergerdorff').Length | Should -BeLessOrEqual 18
    }

    It 'throws when no usable letters are left' {
        { Get-SamBaseName -GivenName 'A' -Surname '123' } | Should -Throw
    }
}
`;

const PESTER_TEST_UNIQUE = ps`
Describe 'Get-UniqueSamAccountName' {
    BeforeEach {
        $reserved = [System.Collections.Generic.HashSet[string]]::new([System.StringComparer]::OrdinalIgnoreCase)
    }

    Context 'when the name is free in AD' {
        BeforeAll { Mock Test-SamAccountNameInUse { $false } }

        It 'returns the base name unchanged' {
            Get-UniqueSamAccountName -BaseName 'j.smith' -Server 'DC01' -Reserved $reserved | Should -Be 'j.smith'
        }

        It 'gives the next person a suffix, because the first name is now reserved' {
            $null = Get-UniqueSamAccountName -BaseName 'j.smith' -Server 'DC01' -Reserved $reserved
            Get-UniqueSamAccountName -BaseName 'j.smith' -Server 'DC01' -Reserved $reserved | Should -Be 'j.smith2'
        }
    }

    Context 'when j.smith and j.smith2 already exist in AD' {
        BeforeAll {
            Mock Test-SamAccountNameInUse { $SamAccountName -in 'j.smith', 'j.smith2' }
        }

        It 'returns j.smith3' {
            Get-UniqueSamAccountName -BaseName 'j.smith' -Server 'DC01' -Reserved $reserved | Should -Be 'j.smith3'
        }

        It 'asks AD about each candidate once' {
            $null = Get-UniqueSamAccountName -BaseName 'j.smith' -Server 'DC01' -Reserved $reserved
            Should -Invoke Test-SamAccountNameInUse -Exactly -Times 3
        }

        It 'asks about j.smith2 by name' {
            $null = Get-UniqueSamAccountName -BaseName 'j.smith' -Server 'DC01' -Reserved $reserved
            Should -Invoke Test-SamAccountNameInUse -Exactly -Times 1 -ParameterFilter { $SamAccountName -eq 'j.smith2' }
        }
    }
}
`;

const PESTER_TEST_WHATIF = ps`
Describe 'New-StaffAccount' {
    BeforeAll {
        Mock New-ADUser { }
        $account = @{
            SamAccountName = 'j.smith'
            GivenName      = 'Jane'
            Surname        = 'Smith'
            Path           = 'OU=Finance,OU=Staff,DC=corp,DC=example,DC=com'
            Password       = (New-Object System.Security.SecureString)   # empty: the mock never uses it
        }
    }

    Context 'with -WhatIf' {
        It 'does not call New-ADUser' {
            $null = New-StaffAccount @account -WhatIf
            Should -Invoke New-ADUser -Exactly -Times 0
        }

        It 'reports Skipped' {
            (New-StaffAccount @account -WhatIf).Status | Should -Be 'Skipped'
        }
    }

    Context 'without -WhatIf' {
        It 'creates an enabled account that must change its password at logon' {
            $null = New-StaffAccount @account
            Should -Invoke New-ADUser -Exactly -Times 1 -ParameterFilter {
                $SamAccountName -eq 'j.smith' -and $Enabled -eq $true -and $ChangePasswordAtLogon -eq $true
            }
        }

        It 'reports Created' {
            (New-StaffAccount @account).Status | Should -Be 'Created'
        }
    }
}
`;

const PESTER_TESTS = [PESTER_TEST_HEAD, PESTER_TEST_SAM, PESTER_TEST_UNIQUE, PESTER_TEST_WHATIF].join('\n\n');

const PESTER_CHECK_LINE =
  '$lint = @(Invoke-ScriptAnalyzer -Path $PSScriptRoot -Recurse -Severity Warning, Error); $lint | Format-Table RuleName, Severity, ScriptName, Line -AutoSize | Out-Host; $test = Invoke-Pester -Path $PSScriptRoot -Output Minimal -PassThru; exit ([int]($lint.Count -gt 0 -or $test.FailedCount -gt 0))';

const PESTER_VERSION_CHECK = ps`
# Which Pester do you have? Windows 10 and 11 ship Pester 3.4.0, which uses older syntax.
Get-Module -ListAvailable -Name Pester | Sort-Object Version -Descending | Select-Object Name, Version, Path

$best = (Get-Module -ListAvailable -Name Pester | Sort-Object Version -Descending | Select-Object -First 1).Version
if ($best -lt [version]'5.0.0') { 'Pester {0} is too old for this project: install Pester 5' -f $best }
else { 'Pester {0} is fine' -f $best }

# LAB: install Pester 5 for your user. -SkipPublisherCheck is needed because the built-in 3.4 was signed by
# a different publisher. -WhatIf shows the plan; remove it to really install.
Install-Module -Name Pester -Force -SkipPublisherCheck -Scope CurrentUser -MinimumVersion 5.0.0 -WhatIf

# After installing, load version 5 in this session (open a new window if 3.4 was already loaded)
Import-Module -Name Pester -MinimumVersion 5.0.0 -Force
Get-Module Pester | Select-Object Name, Version
`;

const PESTER_RUN = ps`
# From the folder that holds the two files
Invoke-Pester -Path . -Output Detailed

# Or keep the result object and use it in a script
$result = Invoke-Pester -Path . -Output Minimal -PassThru
'{0} passed, {1} failed' -f $result.PassedCount, $result.FailedCount
`;

const PESTER_ANALYZER = ps`
# LAB: install the analyzer for your user. -WhatIf shows the plan; remove it to really install.
Install-Module -Name PSScriptAnalyzer -Scope CurrentUser -WhatIf

# Check one file, or the whole folder
Invoke-ScriptAnalyzer -Path .\OnboardingHelpers.ps1 -Severity Warning, Error
Invoke-ScriptAnalyzer -Path . -Recurse -Severity Warning, Error | Format-Table RuleName, Severity, ScriptName, Line -AutoSize

# Try project 1's script too. Expect PSAvoidUsingWriteHost warnings: decide each one on purpose.
Invoke-ScriptAnalyzer -Path .\New-StaffAccounts.ps1 -Severity Warning, Error

# Explain a rule you do not understand
Get-ScriptAnalyzerRule -Name PSUseShouldProcessForStateChangingFunctions | Format-List Name, Description
`;

const PESTER_GIT = ps`
# One-line check, saved as Check.ps1 next to the code. It exits 1 if the analyzer or a test complains.
# __CHECK_LINE__

# Run it by hand
powershell.exe -NoProfile -ExecutionPolicy RemoteSigned -File .\Check.ps1
'Exit code: ' + $LASTEXITCODE

# LAB: make Git run it before every commit. Hooks need LF line endings, so build the text with [char]10.
$hook = Join-Path (Get-Location) '.git\hooks\pre-commit'
$text = '#!/bin/sh' + [char]10 + 'powershell.exe -NoProfile -ExecutionPolicy RemoteSigned -File ./Check.ps1 || exit 1' + [char]10
[System.IO.File]::WriteAllText($hook, $text)

# The workflow: branch, change, check, commit
git status
git switch -c add-sam-tests
git add OnboardingHelpers.ps1 OnboardingHelpers.Tests.ps1 Check.ps1
git commit -m "Add Pester tests for the SamAccountName helpers"
`.replace('# __CHECK_LINE__', PESTER_CHECK_LINE);

const PESTER_FINAL_SCRIPT = [
  ps`
#Requires -Version 5.1
<#
.SYNOPSIS
    Creates the onboarding helpers, their Pester 5 tests and a one-line check in a folder,
    then runs the tests and the analyzer. Use -WhatIf to see what it would create.
.EXAMPLE
    .\Initialize-PesterDemo.ps1 -Path C:\Dev\OnboardingTests -WhatIf
#>
[CmdletBinding(SupportsShouldProcess)]
param([Parameter(Mandatory)][string]$Path)
`,
  "$helpers = @'\n" + PESTER_HELPERS + "\n'@",
  "$tests = @'\n" + PESTER_TESTS + "\n'@",
  "$check = @'\n" + PESTER_CHECK_LINE + "\n'@",
  ps`
# Pester 5 or newer is required (Windows ships 3.4, which cannot run these tests)
$pester = @(Get-Module -ListAvailable -Name Pester | Sort-Object Version -Descending)[0]
if (-not $pester -or $pester.Version -lt [version]'5.0.0') {
    Write-Warning 'Pester 5 is required. Install it with: Install-Module Pester -Force -SkipPublisherCheck -Scope CurrentUser'
    return
}

if (-not $PSCmdlet.ShouldProcess($Path, 'Create OnboardingHelpers.ps1, OnboardingHelpers.Tests.ps1 and Check.ps1, then run them')) { return }

New-Item -ItemType Directory -Path $Path -Force | Out-Null
Set-Content -Path (Join-Path $Path 'OnboardingHelpers.ps1') -Value $helpers -Encoding UTF8
Set-Content -Path (Join-Path $Path 'OnboardingHelpers.Tests.ps1') -Value $tests -Encoding UTF8
Set-Content -Path (Join-Path $Path 'Check.ps1') -Value $check -Encoding UTF8

Import-Module -Name Pester -MinimumVersion 5.0.0 -Force
$result = Invoke-Pester -Path $Path -Output Detailed -PassThru

if (Get-Module -ListAvailable -Name PSScriptAnalyzer) {
    Invoke-ScriptAnalyzer -Path $Path -Recurse -Severity Warning, Error | Format-Table RuleName, Severity, ScriptName, Line -AutoSize
}
else {
    Write-Warning 'PSScriptAnalyzer is not installed: Install-Module PSScriptAnalyzer -Scope CurrentUser'
}

'{0} passed, {1} failed' -f $result.PassedCount, $result.FailedCount
`,
].join('\n\n');

const PESTER_YOUR_SCRIPT: ProjectGuide = {
  id: 'pester-your-script',
  title: 'Test your script with Pester and PSScriptAnalyzer',
  scenario:
    'You keep tweaking the SamAccountName logic from the onboarding script, and every tweak is a gamble. The last one quietly made O\'Brien impossible to onboard and nobody noticed until Monday. You will put the functions under automated tests with Pester 5, add a static check with PSScriptAnalyzer, and join both into one command you run before every commit.',
  level: 'Intermediate',
  minutes: 60,
  needs: [
    'Project 1 (ad-onboarding): you test its SamAccountName functions here. The code is repeated below, so you can also start from scratch',
    'Windows PowerShell 5.1 on CLIENT01 (192.168.56.30) or any Windows 10/11 machine. The tests do not need AD: they replace it with mocks',
    'Internet access to the PowerShell Gallery to install Pester 5 and PSScriptAnalyzer (lab machine, current user only)',
    'Git for Windows, optional, for the workflow step',
    'Lessons 14-1 (error handling), 14-2 (advanced functions and -WhatIf) and 11-1 (modules and Install-Module)',
  ],
  outcomes: [
    'Check which Pester version you have and install Pester 5 next to the built-in 3.4',
    'Structure a script so it can be tested: functions in a dot-sourced file, no top-level side effects',
    'Write Pester 5 tests with Describe, Context, It, BeforeAll, Should and -TestCases',
    'Mock an AD lookup with Mock and -ParameterFilter, and verify calls with Should -Invoke',
    'Test that -WhatIf really changes nothing, run PSScriptAnalyzer, and combine both into a one-line check',
  ],
  steps: [
    {
      title: 'Find out which Pester you have',
      explain:
        'Windows 10 and 11 ship Pester 3.4.0. Pester 5 changed the syntax and the way tests run, so a Pester 5 test file behaves very differently, or simply fails, on 3.4. Check first and install version 5 for your own user. -SkipPublisherCheck is needed because the built-in module was signed by a different publisher than the one in the Gallery. Then load version 5 explicitly with -MinimumVersion.',
      code: PESTER_VERSION_CHECK,
      expect: '__EXPECT_P4_STEP1__',
    },
    {
      title: 'Make the code testable',
      explain:
        'You can only test what you can load without side effects. The rule is: put the logic in functions, put the functions in a .ps1 file that only defines them, and let a separate script (or the tests) call them. If a file creates users or writes logs as soon as it is loaded, dot-sourcing it in a test would do that for real. Keep the parts that talk to the outside world, such as the AD lookup, in small wrapper functions, so a test can replace them. Anything that changes something supports -WhatIf with SupportsShouldProcess, so a test can prove that a dry run does nothing. Save this as OnboardingHelpers.ps1 (these are the same SamAccountName functions as project 1, plus a small New-StaffAccount).',
      code: PESTER_HELPERS,
      expect:
        'Nothing runs when you load this file: dot-sourcing it (. .\\OnboardingHelpers.ps1) only defines Get-SamBaseName, Test-SamAccountNameInUse, Get-UniqueSamAccountName and New-StaffAccount. The pure functions were run for real in a scratch session: Get-SamBaseName gives j.smith for Jane Smith and l.obrien for Liam O\'Brien.',
    },
    {
      title: 'Your first tests',
      explain:
        'A Pester file ends in .Tests.ps1. Describe names the thing under test, It states one expected behaviour, and Should compares the result. Pester 5 runs a file in two phases: it first discovers every Describe and It, and only then runs them. That is why the dot-sourcing sits inside BeforeAll: code in BeforeAll runs in the run phase, where your functions are needed. -TestCases repeats one It for several inputs, which suits name-cleaning rules. Write at least one test for each trap in your data: apostrophes, accents, long names, nothing usable.',
      code: PESTER_TEST_HEAD + '\n\n' + PESTER_TEST_SAM,
      expect: '__EXPECT_P4_STEP3__',
    },
    {
      title: 'Mock the AD lookup',
      explain:
        'A unit test must not need a domain controller. Mock replaces a command with your own scriptblock for the duration of the test, so Test-SamAccountNameInUse can say "j.smith and j.smith2 exist" without touching AD. That is why the lookup lives in its own wrapper function: you mock your own function, which always exists, instead of Get-ADObject, which does not exist on a machine without RSAT. -ParameterFilter makes an assertion about the arguments, and Should -Invoke checks how often the mock was called. Test behaviour (the name you get back) first, and call counts only where they matter.',
      code: PESTER_TEST_UNIQUE,
      expect: '__EXPECT_P4_STEP4__',
    },
    {
      title: 'Prove that -WhatIf changes nothing',
      explain:
        'The most valuable test for any script that changes things is the dry-run test. Mock the cmdlet that makes the change (New-ADUser), call your function with -WhatIf, and assert the mock was called zero times. Then call it without -WhatIf and assert it was called once with the arguments that matter for security: the account is enabled and must change its password at logon. Mock needs the command to exist, so the file-level BeforeAll defines a stand-in New-ADUser when the ActiveDirectory module is missing.',
      code: PESTER_TEST_WHATIF,
      expect: '__EXPECT_P4_STEP5__',
    },
    {
      title: 'Run the tests',
      explain:
        'Invoke-Pester runs every .Tests.ps1 file under the path. -Output Detailed shows each It with its result, Minimal shows only failures, and -PassThru returns an object with PassedCount, FailedCount and the failed tests, which is what you want in scripts and in CI. Read a failure message carefully: Pester shows the expected value, the actual value and the line. When a test fails, decide whether the code or the test is wrong, and never delete the test just to get green.',
      code: PESTER_RUN,
      expect: '__EXPECT_P4_STEP6__',
    },
    {
      title: 'Add PSScriptAnalyzer',
      explain:
        'Tests check behaviour you thought of. PSScriptAnalyzer checks the code itself against rules of good practice: unapproved verbs, missing ShouldProcess on functions that change things, unused parameters, plain-text password parameters, Write-Host and more. Run it on the whole folder with -Recurse, and fix or consciously suppress each finding. A useful example: it will flag a function called New-UniqueSamAccountName, because New- implies a change and the function has no ShouldProcess, which is why project 1 calls it Get-UniqueSamAccountName.',
      code: PESTER_ANALYZER,
      expect: '__EXPECT_P4_STEP7__',
    },
    {
      title: 'One command before every commit, and the Git workflow',
      explain:
        'Checks you have to remember are checks you skip. Put the analyzer and the tests on one line in Check.ps1, make it exit with 1 when anything is wrong, and let Git run it as a pre-commit hook: a failing check stops the commit. The workflow is short. Work on a branch, run the check, commit small changes with a message that says why, and never commit real data: no real users.csv, no logs, no credential files. A .gitignore keeps them out. Pull requests then show the code change and the test change together.',
      code: PESTER_GIT,
      expect: '__EXPECT_P4_STEP8__',
    },
  ],
  finalScript: PESTER_FINAL_SCRIPT,
  checklist: [
    'Run Get-Module -ListAvailable Pester and confirm version 5 or newer is installed and loaded in the session that runs the tests.',
    'The file under test only defines functions: dot-source it in a fresh session and confirm nothing happens.',
    'Every test can run on a machine with no AD, no network and no admin rights.',
    'There is a test for each trap in your real data: apostrophes, accents, blanks, duplicates and very long names.',
    'There is a -WhatIf test for every function that changes something.',
    'Break the code on purpose (change a function so it returns the wrong value) and confirm a test goes red. A test that never fails proves nothing.',
    'Run PSScriptAnalyzer on the whole folder and treat every warning as a decision: fix it, or suppress it with a comment that says why.',
    'Check.ps1 returns a non-zero exit code on failure, and the hook works from a different folder inside the repo.',
    '.gitignore excludes CSVs with real data, logs, credential files and test result files.',
  ],
  pitfalls: [
    {
      problem: 'Tests fail with strange errors, or -Output and Should -Invoke are "not found".',
      fix: 'You are running Pester 3.4. Install Pester 5, then run Import-Module Pester -MinimumVersion 5.0.0 -Force, or start a fresh PowerShell window so 3.4 is not already loaded.',
    },
    {
      problem: 'The test file says "The term Get-SamBaseName is not recognized" even though you dot-sourced the file at the top.',
      fix: 'In Pester 5 code outside BeforeAll, It and similar blocks runs in the discovery phase, and its variables and functions are not there when the tests run. Dot-source inside BeforeAll.',
    },
    {
      problem: 'Mock fails with "Could not find Command Get-ADUser" (or New-ADUser) on your laptop.',
      fix: 'Mock needs the command to exist. Mock your own wrapper function instead (Test-SamAccountNameInUse), or define a stand-in function with the same parameter names in BeforeAll, as the test file does.',
    },
    {
      problem: 'Loading the script in a test creates accounts, writes logs or prompts for input.',
      fix: 'The file has top-level code. Move the logic into functions in one file, and keep the code that runs them in a separate script. Anything that changes state needs SupportsShouldProcess so the test can use -WhatIf.',
    },
    {
      problem: 'A test with accented characters passes in your editor but fails on another machine.',
      fix: 'Windows PowerShell 5.1 reads a .ps1 without a byte order mark as the ANSI code page, which mangles accents. Build such strings with [char] codes, as the tests do, or save the file as UTF-8 with BOM.',
    },
    {
      problem: 'PSScriptAnalyzer warnings are ignored because there are always some, or they are hidden with a blanket -ExcludeRule.',
      fix: 'Fix what you can. For a deliberate exception (for example Write-Host to show a password once), suppress that one rule on that one function with SuppressMessageAttribute and a justification, so the next warning still means something.',
    },
  ],
  stretch: [
    'Turn on code coverage with New-PesterConfiguration (CodeCoverage.Enabled and CodeCoverage.Path) and see which lines no test reaches.',
    'Write tests for project 2: ConvertTo-PatchRow is a pure function and an ideal first target (OK, OutOfDate, RebootPending and Unreachable rows).',
    'Add a PSScriptAnalyzerSettings.psd1 so the whole team uses the same rules, and pass it with -Settings.',
    'Run Check.ps1 in CI (for example GitHub Actions on windows-latest) and write test results as NUnit XML for the build report.',
  ],
};

// @@APPEND_PROJECTS@@

export const PROJECTS: ProjectGuide[] = [AD_ONBOARDING, PATCHING_REPORT, UNATTENDED_SECRETS, PESTER_YOUR_SCRIPT];
