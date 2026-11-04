export interface BugChallenge {
  id: string;
  moduleRef: string;
  title: string;
  scenario: string;
  brokenCode: string;
  brokenOutput: string;
  options: {
    id: string;
    label: string;
    code: string;
    isCorrect: boolean;
    explanation: string;
  }[];
  fixedOutput: string;
  takeaway: string;
}

export const BUG_CHALLENGES: BugChallenge[] = [
  {
    id: 'bug-gt-redirection',
    moduleRef: 'Module 07 · Comparison Operators',
    title: 'Bug #1: The Silent File-Creation Trap (> vs -gt)',
    scenario:
      'A junior admin tried to list all processes using more than 100 MB of WorkingSet memory, but nothing printed to the screen, and a strange file named "100MB" appeared in the current folder!',
    brokenCode: 'Get-Process | Where-Object { $_.WorkingSet > 100MB }',
    brokenOutput:
      '[No console output - PowerShell redirected objects into a text file named .\\100MB!]',
    options: [
      {
        id: 'opt-a',
        label: 'Replace > with -gt',
        code: 'Get-Process | Where-Object { $_.WorkingSet -gt 100MB }',
        isCorrect: true,
        explanation:
          'Correct! In PowerShell, > is the stream redirection operator (alias for Out-File). All comparison operators use hyphenated flags: -gt, -lt, -eq, -ne.',
      },
      {
        id: 'opt-b',
        label: 'Wrap 100MB in double quotes',
        code: 'Get-Process | Where-Object { $_.WorkingSet > "100MB" }',
        isCorrect: false,
        explanation:
          'Still broken! > is still the file redirection operator, and quoting "100MB" turns the 100MB byte multiplier into a plain string.',
      },
      {
        id: 'opt-c',
        label: 'Use == instead of >',
        code: 'Get-Process | Where-Object { $_.WorkingSet == 100MB }',
        isCorrect: false,
        explanation:
          'PowerShell does not use == for equality or > for comparison. Use -gt (Greater Than) or -ge (Greater Than or Equal).',
      },
    ],
    fixedOutput: `Handles  NPM(K)    PM(K)      WS(K)     CPU(s)     Id  ProcessName
-------  ------    -----      -----     ------     --  -----------
   1420      88   245120     312400      48.20   4192  pwsh
    980      64   189400     215800      19.05   2840  MsMpEng`,
    takeaway:
      'Never use >, <, or == inside Where-Object or if() conditions. Always use -gt, -lt, -ge, -le, -eq, and -ne.',
  },
  {
    id: 'bug-format-table-pipe',
    moduleRef: 'Module 07 · Filter Left, Format Right',
    title: 'Bug #2: Format-Table Destroying the Pipeline Before Export-Csv',
    scenario:
      'An engineer formatted a service report with Format-Table so it looked nice, then piped it to Export-Csv. When they opened the CSV in Excel, every row was garbage metadata!',
    brokenCode:
      'Get-Service | Select-Object Name, Status | Format-Table | Export-Csv .\\services.csv -NoTypeInformation',
    brokenOutput: `"ClassId2e4f51ef21dd47e99d3c952918aff9cd","pageHeaderEntry","pageFooterEntry"
"033ecb2bc07a4d43b5ef94ed5a35d280",,""`,
    options: [
      {
        id: 'opt-a',
        label:
          'Remove Format-Table so live ServiceController objects reach Export-Csv',
        code: 'Get-Service | Select-Object Name, Status | Export-Csv .\\services.csv -NoTypeInformation',
        isCorrect: true,
        explanation:
          'Spot on! Format-Table converts live .NET objects into internal layout instructions meant only for screen drawing. Format cmdlets must always be the very last stage, or omitted completely when exporting.',
      },
      {
        id: 'opt-b',
        label: 'Move Format-Table before Select-Object',
        code: 'Get-Service | Format-Table | Select-Object Name, Status | Export-Csv .\\services.csv',
        isCorrect: false,
        explanation:
          'Moving Format-Table earlier destroys the ServiceController objects even sooner!',
      },
      {
        id: 'opt-c',
        label: 'Add -AutoSize to Format-Table',
        code: 'Get-Service | Format-Table -AutoSize | Export-Csv .\\services.csv',
        isCorrect: false,
        explanation:
          '-AutoSize only adjusts screen column widths; it still emits internal formatting objects.',
      },
    ],
    fixedOutput: `"Name","Status"
"EventLog","Running"
"LanmanServer","Running"
"Spooler","Stopped"`,
    takeaway:
      'Rule of Thumb: "Format Right." Once you call Format-Table or Format-List, your original objects are gone.',
  },
  {
    id: 'bug-single-quotes',
    moduleRef: 'Module 06 · Strings & Variable Expansion',
    title: 'Bug #3: Literal Single Quotes Blocking Variable Expansion',
    scenario:
      'During a Server Core deployment script, the admin wanted to print the server name and current date, but the terminal literally printed "$ServerName booted at $(Get-Date)".',
    brokenCode:
      '$ServerName = "DC01-CORE"\nWrite-Output \'Server $ServerName booted at $(Get-Date)\'',
    brokenOutput: 'Server $ServerName booted at $(Get-Date)',
    options: [
      {
        id: 'opt-a',
        label: 'Switch outer quotes from single (\'...\') to double ("...")',
        code: '$ServerName = "DC01-CORE"\nWrite-Output "Server $ServerName booted at $(Get-Date)"',
        isCorrect: true,
        explanation:
          'Exactly! In PowerShell, single quotes (\'...\') are 100% literal strings. Double quotes ("...") enable variable interpolation ($ServerName) and subexpression evaluation ($(Get-Date)).',
      },
      {
        id: 'opt-b',
        label: 'Add a backtick before $ServerName inside single quotes',
        code: "Write-Output 'Server `$ServerName booted at $(Get-Date)'",
        isCorrect: false,
        explanation:
          'Inside single quotes, even the backtick (`) is treated as a literal character!',
      },
      {
        id: 'opt-c',
        label: 'Use Write-Host with single quotes',
        code: "Write-Host 'Server $ServerName booted at $(Get-Date)'",
        isCorrect: false,
        explanation:
          'Write-Host obeys the exact same quoting rules as Write-Output, single quotes are always literal.',
      },
    ],
    fixedOutput: 'Server DC01-CORE booted at 11/03/2026 23:45:12',
    takeaway:
      'Use single quotes (\'...\') for literal strings and double quotes ("...") whenever you need $Variable or $(SubExpression) expansion.',
  },
  {
    id: 'bug-ad-filter-left',
    moduleRef: 'Module 12 · Active Directory & Filter Left',
    title: 'Bug #4: Pulling 50,000 AD Users Over the Network Before Filtering',
    scenario:
      'An administrator wrote a script to find all users in the Finance department. In production with 50,000 users it saturates the Domain Controller and takes 45 seconds.',
    brokenCode:
      'Get-ADUser -Filter * -Properties Department | Where-Object { $_.Department -eq "Finance" }',
    brokenOutput:
      '[Warning: Streamed all 50,000 AD user objects over the network to client RAM before discarding 49,850 of them]',
    options: [
      {
        id: 'opt-a',
        label:
          'Push the Department filter directly into Get-ADUser -Filter (Filter Left)',
        code: 'Get-ADUser -Filter "Department -eq \'Finance\'" -Properties Department',
        isCorrect: true,
        explanation:
          'Correct! Passing the condition to -Filter executes the query on the Domain Controller LDAP database index and only sends the matching 150 Finance objects across the wire.',
      },
      {
        id: 'opt-b',
        label: 'Pipe to Select-Object -First 150 at the end',
        code: 'Get-ADUser -Filter * -Properties Department | Select-Object -First 150',
        isCorrect: false,
        explanation:
          'That just grabs the first 150 random users in Active Directory regardless of department!',
      },
      {
        id: 'opt-c',
        label: 'Replace Where-Object with ForEach-Object',
        code: 'Get-ADUser -Filter * | ForEach-Object { if ($_.Department -eq "Finance") { $_ } }',
        isCorrect: false,
        explanation:
          'This still downloads all 50,000 objects from the Domain Controller before filtering locally.',
      },
    ],
    fixedOutput: `DistinguishedName : CN=Sarah Chen,OU=Finance,DC=corp,DC=internal
Department        : Finance
Enabled           : True
SamAccountName    : schen`,
    takeaway:
      'Always check if the source cmdlet supports -Filter (Get-ADUser, Get-CimInstance, Get-ChildItem) before falling back to Where-Object.',
  },
  {
    id: 'bug-try-catch-erroraction',
    moduleRef: 'Module 14 · Error Handling & Toolmaking',
    title: 'Bug #5: Why Did try/catch Ignore a Failed Cmdlet?',
    scenario:
      'An engineer wrapped Get-Service "FakeService" inside a try/catch block, expecting the catch block to log a clean alert. Instead, red error text printed to the screen and catch never ran!',
    brokenCode:
      'try {\n  Get-Service -Name "NonExistentService"\n} catch {\n  Write-Warning "Service missing!"\n}',
    brokenOutput:
      "Get-Service : Cannot find any service with service name 'NonExistentService'. (Catch block was skipped!)",
    options: [
      {
        id: 'opt-a',
        label:
          'Add -ErrorAction Stop so the non-terminating error triggers catch {}',
        code: 'try {\n  Get-Service -Name "NonExistentService" -ErrorAction Stop\n} catch {\n  Write-Warning "Service missing!"\n}',
        isCorrect: true,
        explanation:
          'Spot on! Most PowerShell cmdlet errors are non-terminating by default so pipelines can continue. try/catch only catches terminating exceptions, adding -ErrorAction Stop promotes it so catch {} runs.',
      },
      {
        id: 'opt-b',
        label: 'Add finally {} instead of catch {}',
        code: 'try { Get-Service "NonExistentService" } finally { Write-Warning "Missing" }',
        isCorrect: false,
        explanation:
          'finally {} runs whether the command succeeded or failed, and still does not suppress the non-terminating error stream.',
      },
      {
        id: 'opt-c',
        label: 'Pipe Get-Service to Out-Null',
        code: 'try { Get-Service "NonExistentService" | Out-Null } catch { ... }',
        isCorrect: false,
        explanation:
          'Out-Null only discards Stream 1 (Success output); Stream 2 (Error output) still bypasses catch without -ErrorAction Stop.',
      },
    ],
    fixedOutput: 'WARNING: Service missing!',
    takeaway:
      'Always append -ErrorAction Stop to cmdlets inside a try {} block if you want catch {} to intercept failures.',
  },
];

export interface PresetScenario {
  id: string;
  label: string;
  baseCmd: string;
  dotnetType: string;
  filterLeftFlag: string;
  whereClause: string;
  selectProps: string;
  supportsWhatIf: boolean;
  actionCmd: string;
  rows: Array<Record<string, string>>;
  explanation: string;
}

export const COMMAND_BUILDER_SCENARIOS: PresetScenario[] = [
  {
    id: 'services',
    label: 'Windows Services (Get-Service)',
    baseCmd: 'Get-Service',
    dotnetType: 'System.ServiceProcess.ServiceController',
    filterLeftFlag: '-Name "w*"',
    whereClause: '| Where-Object { $_.Status -eq "Running" }',
    selectProps: '| Select-Object Name, Status, StartType -First 3',
    supportsWhatIf: true,
    actionCmd: '| Restart-Service -WhatIf',
    rows: [
      {
        Name: 'W32Time',
        Status: 'Running',
        StartType: 'Automatic',
        CanStop: 'True',
      },
      {
        Name: 'Winmgmt',
        Status: 'Running',
        StartType: 'Automatic',
        CanStop: 'True',
      },
      {
        Name: 'WinRM',
        Status: 'Running',
        StartType: 'Automatic',
        CanStop: 'True',
      },
      {
        Name: 'wuauserv',
        Status: 'Stopped',
        StartType: 'Manual',
        CanStop: 'False',
      },
    ],
    explanation:
      'Get-Service emits live ServiceController objects. Filtering left with -Name narrows the list immediately, and -WhatIf simulates restarting without touching production services.',
  },
  {
    id: 'processes',
    label: 'Processes & RAM (Get-Process)',
    baseCmd: 'Get-Process',
    dotnetType: 'System.Diagnostics.Process',
    filterLeftFlag: '-Name "pwsh", "svchost", "lsass"',
    whereClause: '| Where-Object { $_.WS -gt 20MB }',
    selectProps: '| Select-Object Id, ProcessName, WS -First 3',
    supportsWhatIf: true,
    actionCmd: '| Stop-Process -WhatIf',
    rows: [
      {
        Id: '712',
        ProcessName: 'lsass',
        WS: '28 MB',
        Path: 'C:\\Windows\\System32\\lsass.exe',
      },
      {
        Id: '1420',
        ProcessName: 'svchost',
        WS: '44 MB',
        Path: 'C:\\Windows\\System32\\svchost.exe',
      },
      {
        Id: '4892',
        ProcessName: 'pwsh',
        WS: '96 MB',
        Path: 'C:\\Program Files\\PowerShell\\7\\pwsh.exe',
      },
      {
        Id: '1104',
        ProcessName: 'svchost',
        WS: '11 MB',
        Path: 'C:\\Windows\\System32\\svchost.exe',
      },
    ],
    explanation:
      'Every running process in Windows has a Private Virtual Address Space and Working Set (WS). Inspecting Process objects lets you spot high memory usage or abnormal executable paths.',
  },
  {
    id: 'winevent',
    label: 'Blue Team Logs (Get-WinEvent)',
    baseCmd: 'Get-WinEvent',
    dotnetType: 'System.Diagnostics.Eventing.Reader.EventLogRecord',
    filterLeftFlag:
      '-FilterHashtable @{LogName="Microsoft-Windows-PowerShell/Operational"; Id=4104}',
    whereClause:
      '| Where-Object { $_.Message -match "Invoke-Expression|FromBase64String" }',
    selectProps: '| Select-Object TimeCreated, Id, LevelDisplayName -First 3',
    supportsWhatIf: false,
    actionCmd: '| Export-Csv .\\Suspicious4104.csv -NoTypeInformation',
    rows: [
      {
        TimeCreated: '2026-11-03 22:14:09',
        Id: '4104',
        LevelDisplayName: 'Warning',
        Message: 'IEX ([Text.Encoding]::UTF8.GetString(...))',
      },
      {
        TimeCreated: '2026-11-03 22:11:42',
        Id: '4104',
        LevelDisplayName: 'Warning',
        Message: 'FromBase64String("SQBFAFgA...")',
      },
      {
        TimeCreated: '2026-11-03 21:58:10',
        Id: '4104',
        LevelDisplayName: 'Information',
        Message: 'Get-Service | Where-Object Status -eq Running',
      },
    ],
    explanation:
      'Filter Left Rule in action: -FilterHashtable queries the Windows Event Log engine at the source before crossing the pipeline, running 10× faster than pulling all logs into Where-Object.',
  },
];

export function generateServerCorePlaybookScript(params: {
  hostname: string;
  ipAddress: string;
  prefixLength: string;
  gateway: string;
  dnsServer: string;
  interfaceAlias: string;
  adminUser: string;
}): string {
  const {
    hostname,
    ipAddress,
    prefixLength,
    gateway,
    dnsServer,
    interfaceAlias,
    adminUser,
  } = params;
  return `#Requires -RunAsAdministrator
<#
  .SYNOPSIS
    Headless Windows Server Core Baseline Provisioning Script
    Generated via PowerShell Academy (Created by Muhammad Izaz Haider)
#>
[CmdletBinding(SupportsShouldProcess)]
param()

$ErrorActionPreference = 'Stop'

# 1. Configure Static IPv4 Address & Default Gateway
New-NetIPAddress -InterfaceAlias '${interfaceAlias}' \`
                 -IPAddress '${ipAddress}' \`
                 -PrefixLength ${prefixLength} \`
                 -DefaultGateway '${gateway}'

# 2. Point DNS Client to Domain Controller / Internal Resolver
Set-DnsClientServerAddress -InterfaceAlias '${interfaceAlias}' \`
                           -ServerAddresses ('${dnsServer}')

# 3. Create Dedicated Local Administrator Account Safely
$Password = Read-Host -Prompt 'Enter password for ${adminUser}' -AsSecureString
New-LocalUser -Name '${adminUser}' -Password $Password -FullName '${adminUser}'
Add-LocalGroupMember -Group 'Administrators' -Member '${adminUser}'

# 4. Enable PowerShell Remoting (WinRM Ports 5985/5986)
Enable-PSRemoting -Force

# 5. Rename Server Core Host & Reboot
Rename-Computer -NewName '${hostname}' -Force -Restart`;
}
