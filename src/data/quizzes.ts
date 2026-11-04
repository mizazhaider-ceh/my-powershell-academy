import { QuizQuestion } from '../types';

export const QUIZZES: QuizQuestion[] = [
  // ==========================================================================
  // CHAPTER 1: INSIDE THE WINDOWS KERNEL
  // ==========================================================================
  {
    id: 'q-1',
    chapterId: 'chapter-01',
    type: 'multiple-choice',
    question: 'Why does the Principle of Least Privilege forbid logging into your daily workstation as a local or Domain Administrator?',
    options: [
      'Administrator accounts cannot open web browsers',
      'Every program or malicious script you accidentally launch inherits your active Security Access Token and permissions',
      'Windows 11 deletes Administrator accounts after 24 hours',
      'PowerShell only runs under standard accounts',
    ],
    correctAnswer: 'Every program or malicious script you accidentally launch inherits your active Security Access Token and permissions',
    explanation: 'A process inherits the Security Access Token of its parent. Running daily work as a standard user contains accidental mistakes and malware in a restricted context.',
    relatedLessonPath: '/learn/chapter-01/windows-evolution-and-least-privilege',
  },
  {
    id: 'q-2',
    chapterId: 'chapter-01',
    type: 'multiple-choice',
    question: 'In the Windows kernel architecture, what is the difference between a Process and a Thread?',
    options: [
      'They are two names for the exact same thing',
      'A Process is the resource container (PID, private virtual memory, handles, token); Threads are the execution workers inside that container scheduled on CPU cores',
      'Threads own separate virtual address spaces while Processes share one',
      'Processes run on the GPU while Threads run on the hard drive',
    ],
    correctAnswer: 'A Process is the resource container (PID, private virtual memory, handles, token); Threads are the execution workers inside that container scheduled on CPU cores',
    explanation: 'Processes own memory, handles, and security tokens; threads execute code instructions on the CPU.',
    relatedLessonPath: '/learn/chapter-01/processes-threads-and-handles',
  },
  {
    id: 'q-3',
    chapterId: 'chapter-01',
    type: 'multiple-choice',
    question: 'How does the Windows Memory Manager prevent one process from reading or corrupting another process’s RAM, and what happens when physical RAM fills up?',
    options: [
      'It gives every process direct access to physical RAM sticks',
      'It gives every process an isolated Virtual Address Space divided into 4 KB pages and swaps inactive pages out to C:\\pagefile.sys on disk',
      'It reboots the system whenever RAM reaches 80%',
      'It stores all memory inside the Registry',
    ],
    correctAnswer: 'It gives every process an isolated Virtual Address Space divided into 4 KB pages and swaps inactive pages out to C:\\pagefile.sys on disk',
    explanation: 'Virtual memory maps 4 KB virtual pages to physical RAM frames via per-process Page Tables and pages inactive memory to C:\\pagefile.sys.',
    relatedLessonPath: '/learn/chapter-01/virtual-memory-and-paging',
  },

  // ==========================================================================
  // CHAPTER 2: RINGS OF POWER & THE BOOT CHAIN
  // ==========================================================================
  {
    id: 'q-4',
    chapterId: 'chapter-02',
    type: 'multiple-choice',
    question: 'When a User Mode application (Ring 3) wants to write a file to disk, which DLL acts as the gatekeeper that executes the CPU SYSCALL instruction to enter Kernel Mode (Ring 0)?',
    options: ['explorer.exe', 'NTDLL.DLL', 'notepad.exe', 'calc.exe'],
    correctAnswer: 'NTDLL.DLL',
    explanation: 'NTDLL.DLL sits at the bottom of User Mode and translates Win32 API calls into native Nt* system calls across the boundary into ntoskrnl.exe.',
    relatedLessonPath: '/learn/chapter-02/user-vs-kernel-mode-syscalls',
  },
  {
    id: 'q-5',
    chapterId: 'chapter-02',
    type: 'scenario',
    question: 'While inspecting a server, you spot a process named "svchost.exe" running from "C:\\Users\\Public\\svchost.exe" whose parent process is "cmd.exe". What can you conclude immediately?',
    options: [
      'This is a normal Windows Update background process',
      'It is 100% malware, legitimate svchost.exe ALWAYS lives in C:\\Windows\\System32\\ and is ALWAYS spawned by services.exe',
      'cmd.exe is the normal parent of all Windows services',
      'It is part of UEFI Secure Boot',
    ],
    correctAnswer: 'It is 100% malware, legitimate svchost.exe ALWAYS lives in C:\\Windows\\System32\\ and is ALWAYS spawned by services.exe',
    explanation: 'Real svchost.exe binaries reside in C:\\Windows\\System32\\ (or SysWOW64) and have services.exe (Service Control Manager) as their parent.',
    relatedLessonPath: '/learn/chapter-02/system-processes-and-service-accounts',
  },
  {
    id: 'q-6',
    chapterId: 'chapter-02',
    type: 'multiple-choice',
    question: 'Why was the legacy BIOS + MBR partition table limited to a maximum of 4 primary partitions and 2 TB disks?',
    options: [
      'Because Sector 0 is only 512 bytes total (446B bootstrap code + 64B partition table of 4 × 16B entries + 2B 0x55AA signature) with 32-bit sector addressing',
      'Because SATA cables only have 4 wires',
      'Because Windows NT 3.1 blocked larger drives',
      'Because GPT did not support SSDs',
    ],
    correctAnswer: 'Because Sector 0 is only 512 bytes total (446B bootstrap code + 64B partition table of 4 × 16B entries + 2B 0x55AA signature) with 32-bit sector addressing',
    explanation: 'MBR allocates exactly 64 bytes for partition entries (16 bytes per partition = 4 partitions max). Modern UEFI + GPT removes this limitation.',
    relatedLessonPath: '/learn/chapter-02/boot-chain-uefi-gpt-defenses',
  },
  {
    id: 'q-7',
    chapterId: 'chapter-02',
    type: 'multiple-choice',
    question: 'In the 4-stage Windows boot defense chain (Secure Boot → Trusted Boot → ELAM → Measured Boot), what does ELAM (Early Launch Anti-Malware) do?',
    options: [
      'It flashes the motherboard BIOS',
      'It loads as the very first third-party kernel driver during boot so it can inspect and block malicious rootkit drivers before they initialize',
      'It prompts the user for their BitLocker PIN',
      'It formats the EFI System Partition',
    ],
    correctAnswer: 'It loads as the very first third-party kernel driver during boot so it can inspect and block malicious rootkit drivers before they initialize',
    explanation: 'ELAM initializes before all other third-party boot drivers so antivirus can evaluate every subsequent driver before it loads into Ring 0.',
    relatedLessonPath: '/learn/chapter-02/boot-chain-uefi-gpt-defenses',
  },

  // ==========================================================================
  // CHAPTER 3: THE OBJECT REVOLUTION & DISCOVERY
  // ==========================================================================
  {
    id: 'q-8',
    chapterId: 'chapter-03',
    type: 'multiple-choice',
    question: 'What is the executable name for modern cross-platform PowerShell 7.x, and what edition does `$PSVersionTable.PSEdition` report for it?',
    options: [
      'powershell.exe (Desktop)',
      'pwsh.exe (Core)',
      'cmd.exe (Legacy)',
      'bash.exe (Unix)',
    ],
    correctAnswer: 'pwsh.exe (Core)',
    explanation: 'Windows PowerShell 5.1 uses powershell.exe (PSEdition: Desktop); modern PowerShell 7+ uses pwsh.exe (PSEdition: Core).',
    relatedLessonPath: '/learn/chapter-03/what-is-powershell',
  },
  {
    id: 'q-9',
    chapterId: 'chapter-03',
    type: 'command-completion',
    question: 'You know the full cmdlet name `Get-ChildItem` and want to list every short alias (`dir`, `ls`, `gci`) that points to it. Which command is correct?',
    codeSnippet: 'Get-Alias ________ Get-ChildItem',
    options: ['-Name', '-Definition', '-Target', '-Cmdlet'],
    correctAnswer: '-Definition',
    explanation: 'Use Get-Alias -Name when you have the alias nickname (Get-Alias -Name gci); use Get-Alias -Definition when you have the full cmdlet name.',
    relatedLessonPath: '/learn/chapter-03/verb-noun-and-discovery',
  },
  {
    id: 'q-10',
    chapterId: 'chapter-03',
    type: 'multiple-choice',
    question: 'When reading `Get-Help Get-Process`, you see `[-Name] <String[]>`. What do the two sets of square brackets tell you?',
    options: [
      'You must type square brackets around the process name',
      '[-Name] means the parameter name is positional (optional to type), and <String[]> means it accepts an array (comma-separated list) of strings',
      'The parameter only accepts numbers',
      'The parameter is deprecated',
    ],
    correctAnswer: '[-Name] means the parameter name is positional (optional to type), and <String[]> means it accepts an array (comma-separated list) of strings',
    explanation: 'Brackets around just the parameter name [-Name] indicate a positional parameter; [] attached to the type name <String[]> indicates an array.',
    relatedLessonPath: '/learn/chapter-03/help-and-self-reliance',
  },

  // ==========================================================================
  // CHAPTER 4: OBJECTS, PROPERTIES, METHODS & FORMATTING
  // ==========================================================================
  {
    id: 'q-11',
    chapterId: 'chapter-04',
    type: 'multiple-choice',
    question: 'Which command acts as an X-ray scanner to reveal the exact `.NET TypeName`, Properties, and Methods of the objects output by `Get-Service`?',
    options: [
      'Get-Service | Format-Table',
      'Get-Service | Get-Member',
      'Get-Help Get-Service',
      'Get-Service | Out-File',
    ],
    correctAnswer: 'Get-Service | Get-Member',
    explanation: 'Get-Member (alias gm) reflects over pipeline objects to show their .NET class blueprint, properties, and methods.',
    relatedLessonPath: '/learn/chapter-04/objects-properties-methods',
  },
  {
    id: 'q-12',
    chapterId: 'chapter-04',
    type: 'output-interpretation',
    question: 'Why does `Get-Process | Format-Table Name, Id | Export-Csv procs.csv` produce a broken CSV file full of `Microsoft.PowerShell.Commands.Internal.Format` rows?',
    options: [
      'Export-Csv cannot export numbers',
      'Format-Table destroys the original Process objects and replaces them with screen-drawing formatting instructions ("Format Right" rule)',
      'Get-Process does not have a Name property',
      'CSV files require Format-List instead',
    ],
    correctAnswer: 'Format-Table destroys the original Process objects and replaces them with screen-drawing formatting instructions ("Format Right" rule)',
    explanation: 'Format-* cmdlets must always be the last step for console display. Use Select-Object Name, Id when piping to Export-Csv, Sort-Object, or ConvertTo-Html.',
    relatedLessonPath: '/learn/chapter-04/formatting-and-custom-objects',
  },

  // ==========================================================================
  // CHAPTER 5: PIPELINE & PARAMETER BINDING
  // ==========================================================================
  {
    id: 'q-13',
    chapterId: 'chapter-05',
    type: 'scenario',
    question: 'Why does `"wuauserv" | Get-Service` work while `"explorer" | Get-Process` fails with a parameter binding error?',
    options: [
      'Get-Process does not support the pipe character',
      'Get-Service -Name accepts <String> input ByValue, whereas Get-Process -Name only accepts pipeline input ByPropertyName (requiring an object with a .Name property)',
      'explorer is a kernel driver, not a process',
      'Get-Service only works in PowerShell 7',
    ],
    correctAnswer: 'Get-Service -Name accepts <String> input ByValue, whereas Get-Process -Name only accepts pipeline input ByPropertyName (requiring an object with a .Name property)',
    explanation: 'Checking Get-Help -Parameter Name shows Get-Service accepts String ByValue, while Get-Process -Name only binds ByPropertyName (so [PSCustomObject]@{Name="explorer"} | Get-Process works!).',
    relatedLessonPath: '/learn/chapter-05/pipeline-mechanics-and-binding',
  },
  {
    id: 'q-14',
    chapterId: 'chapter-05',
    type: 'multiple-choice',
    question: 'What happens if you use the conditional chain operator `ipconfig /flushdns && gpupdate /force` inside Windows PowerShell 5.1 on a fresh Windows Server Core machine?',
    options: [
      'Both commands run in parallel',
      'Windows PowerShell 5.1 throws a parser error because && and || are only supported in PowerShell 7+ (use ; in 5.1)',
      'The server restarts automatically',
      'It deletes the DNS cache permanently',
    ],
    correctAnswer: 'Windows PowerShell 5.1 throws a parser error because && and || are only supported in PowerShell 7+ (use ; in 5.1)',
    explanation: 'The && and || pipeline chain operators were introduced in PowerShell 7. In Windows PowerShell 5.1, use ; or an if ($?) check.',
    relatedLessonPath: '/learn/chapter-05/chaining-and-multiline',
  },

  // ==========================================================================
  // CHAPTER 6: VARIABLES, ARRAYS, TYPES & QUOTES
  // ==========================================================================
  {
    id: 'q-15',
    chapterId: 'chapter-06',
    type: 'output-interpretation',
    question: 'Given `$servers = @("DC01", "SQL01", "WEB01", "FILE01")`, what do `$servers[1]` and `$servers[-1]` return?',
    options: [
      '"DC01" and "FILE01"',
      '"SQL01" and "FILE01"',
      '"SQL01" and "DC01"',
      'An error because negative indices are not allowed',
    ],
    correctAnswer: '"SQL01" and "FILE01"',
    explanation: 'PowerShell arrays are zero-indexed: [0] is "DC01", [1] is "SQL01", and [-1] always returns the last element ("FILE01").',
    relatedLessonPath: '/learn/chapter-06/variables-arrays-and-types',
  },
  {
    id: 'q-16',
    chapterId: 'chapter-06',
    type: 'multiple-choice',
    question: 'Why does `Write-Host "Audit Complete" | Out-File audit.txt` create a completely empty `audit.txt` file?',
    options: [
      'Out-File cannot write text strings',
      'Write-Host bypasses the pipeline success stream and draws directly to the console screen; use Write-Output to send data down the pipeline',
      'Write-Host requires Administrator rights',
      'audit.txt is a reserved filename',
    ],
    correctAnswer: 'Write-Host bypasses the pipeline success stream and draws directly to the console screen; use Write-Output to send data down the pipeline',
    explanation: 'Write-Output places objects onto the pipeline conveyor belt (Stream #1), whereas Write-Host writes directly to the host console.',
    relatedLessonPath: '/learn/chapter-06/quotes-and-secure-io',
  },

  // ==========================================================================
  // CHAPTER 7: FILTERING, SORTING & SAFETY SWITCHES
  // ==========================================================================
  {
    id: 'q-17',
    chapterId: 'chapter-07',
    type: 'multiple-choice',
    question: 'Why does `Get-Process | Select-Object -First 3 | Sort-Object WorkingSet64 -Descending` fail to return the 3 largest processes on the computer?',
    options: [
      'WorkingSet64 is not a valid property',
      'Select-Object -First 3 slices the first 3 alphabetical processes BEFORE Sort-Object ever gets to sort the full list',
      'Get-Process only returns 3 processes',
      '-Descending sorts from smallest to largest',
    ],
    correctAnswer: 'Select-Object -First 3 slices the first 3 alphabetical processes BEFORE Sort-Object ever gets to sort the full list',
    explanation: 'Always order pipelines: Filter (Where-Object) -> Sort (Sort-Object -Descending) -> Slice (Select-Object -First 3).',
    relatedLessonPath: '/learn/chapter-07/select-sort-and-safety',
  },
  {
    id: 'q-18',
    chapterId: 'chapter-07',
    type: 'command-completion',
    question: 'Which safety switch lets you preview exactly which processes `Get-Process -Name note* | Stop-Process` would terminate without actually killing them?',
    codeSnippet: 'Get-Process -Name note* | Stop-Process ________',
    options: ['-Preview', '-WhatIf', '-Simulate', '-DryRun'],
    correctAnswer: '-WhatIf',
    explanation: '-WhatIf performs a safe dry-run simulation showing the exact targets that would be affected.',
    relatedLessonPath: '/learn/chapter-07/select-sort-and-safety',
  },

  // ==========================================================================
  // CHAPTER 8: PROVIDERS, REGISTRY & FILE HUNTING
  // ==========================================================================
  {
    id: 'q-19',
    chapterId: 'chapter-08',
    type: 'multiple-choice',
    question: 'Which command is the fastest and most accurate way to find all `.dll` files inside `C:\\Windows` AND all of its nested subfolders?',
    options: [
      'Get-ChildItem -Path C:\\Windows -Filter *.dll',
      'Get-ChildItem -Path C:\\Windows -Filter *.dll -Recurse',
      'Get-ChildItem -Path C:\\Windows -Recurse | Where-Object Name -like "*.dll"',
      'Select-String -Path C:\\Windows -Pattern "*.dll"',
    ],
    correctAnswer: 'Get-ChildItem -Path C:\\Windows -Filter *.dll -Recurse',
    explanation: '-Filter *.dll filters at the NTFS provider level ("Filter Left") while -Recurse traverses all subdirectories.',
    relatedLessonPath: '/learn/chapter-08/files-and-select-string',
  },

  // ==========================================================================
  // CHAPTER 9: HEADLESS SERVER CORE BUILD
  // ==========================================================================
  {
    id: 'q-20',
    chapterId: 'chapter-09',
    type: 'scenario',
    question: 'You are configuring a fresh headless Windows Server Core VM (`ifIndex 4`) with IP `192.168.153.210`, subnet mask `255.255.255.0`, and gateway `192.168.153.1`. Which command is correct?',
    options: [
      'New-NetIPAddress -InterfaceIndex 4 -IPAddress 192.168.153.210 -PrefixLength 24 -DefaultGateway 192.168.153.1',
      'Set-DnsClientServerAddress -InterfaceIndex 4 -IPAddress 192.168.153.210',
      'New-NetIPAddress -InterfaceIndex 4 -IPAddress 192.168.153.210 -SubnetMask 255.255.255.0',
      'Rename-Computer -NewName 192.168.153.210',
    ],
    correctAnswer: 'New-NetIPAddress -InterfaceIndex 4 -IPAddress 192.168.153.210 -PrefixLength 24 -DefaultGateway 192.168.153.1',
    explanation: 'New-NetIPAddress uses -PrefixLength 24 (representing 255.255.255.0) along with -InterfaceIndex, -IPAddress, and -DefaultGateway.',
    relatedLessonPath: '/learn/chapter-09/headless-server-core-build',
  },
  {
    id: 'q-21',
    chapterId: 'chapter-09',
    type: 'multiple-choice',
    question: 'Why does `Get-Date -Format "dd-mm-yyyy"` produce the wrong month in a report filename?',
    options: [
      'Get-Date does not have a -Format parameter',
      'Lowercase "mm" outputs Minutes (00 to 59), whereas uppercase "MM" outputs the two-digit Month (01 to 12)',
      'Years must come first',
      'Dashes are not allowed in dates',
    ],
    correctAnswer: 'Lowercase "mm" outputs Minutes (00 to 59), whereas uppercase "MM" outputs the two-digit Month (01 to 12)',
    explanation: 'In .NET date formatting, uppercase MM is Month and lowercase mm is minute. Always use "dd-MM-yyyy".',
    relatedLessonPath: '/learn/chapter-09/hands-on-admin-workout',
  },

  // ==========================================================================
  // CHAPTER 10: SCRIPTS, EXECUTION POLICIES & LOOPS
  // ==========================================================================
  {
    id: 'q-22',
    chapterId: 'chapter-10',
    type: 'multiple-choice',
    question: 'Which Execution Policy allows local `.ps1` scripts that you write on your own machine to run without a signature, while requiring a digital signature on scripts downloaded from the internet?',
    options: ['Restricted', 'AllSigned', 'RemoteSigned', 'Bypass'],
    correctAnswer: 'RemoteSigned',
    explanation: 'RemoteSigned is the recommended balance: local scripts run freely, while internet-downloaded scripts carrying the Mark of the Web require a trusted signature.',
    relatedLessonPath: '/learn/chapter-10/scripts-and-execution-policies',
  },
  {
    id: 'q-23',
    chapterId: 'chapter-10',
    type: 'command-completion',
    question: 'Inside a `foreach ($proc in $processes)` loop, how do you correctly embed `$proc.Id` inside a double-quoted string?',
    codeSnippet: 'Write-Output "Process $($proc.Name) has PID ________"',
    options: ['$proc.Id', '$($proc.Id)', '\'$proc.Id\'', '[proc.Id]'],
    correctAnswer: '$($proc.Id)',
    explanation: 'Wrapping object property access in the subexpression operator $($proc.Id) ensures PowerShell evaluates the .Id property inside double quotes.',
    relatedLessonPath: '/learn/chapter-10/control-flow-and-loops',
  },

  // ==========================================================================
  // CHAPTER 11: MODULES & WINRM REMOTING
  // ==========================================================================
  {
    id: 'q-24',
    chapterId: 'chapter-11',
    type: 'multiple-choice',
    question: 'What are the two default TCP ports used by WinRM (PowerShell Remoting), and which cmdlet executes a scriptblock across 50 servers in parallel?',
    options: [
      'TCP 22 and 23; Enter-PSSession',
      'TCP 5985 (HTTP) and TCP 5986 (HTTPS); Invoke-Command',
      'TCP 80 and 443; Test-Connection',
      'TCP 3389 and 445; Import-Module',
    ],
    correctAnswer: 'TCP 5985 (HTTP) and TCP 5986 (HTTPS); Invoke-Command',
    explanation: 'WinRM listens on TCP 5985 (HTTP) and 5986 (HTTPS). Invoke-Command runs scriptblocks in parallel across multiple remote computers.',
    relatedLessonPath: '/learn/chapter-11/winrm-and-remoting',
  },

  // ==========================================================================
  // CHAPTER 12: ACTIVE DIRECTORY, DNS & FGPP
  // ==========================================================================
  {
    id: 'q-25',
    chapterId: 'chapter-12',
    type: 'multiple-choice',
    question: 'Which one-line PowerShell command repairs a broken domain trust relationship ("The trust relationship between this workstation and the primary domain failed") without unjoining the domain or rebooting?',
    options: [
      'Test-ComputerSecureChannel -Repair -Credential (Get-Credential)',
      'Restart-Service Netlogon',
      'Rename-Computer -Force',
      'New-ADDomain',
    ],
    correctAnswer: 'Test-ComputerSecureChannel -Repair -Credential (Get-Credential)',
    explanation: 'Test-ComputerSecureChannel -Repair resets and re-synchronizes the computer account password with the Domain Controller online.',
    relatedLessonPath: '/learn/chapter-12/ad-users-groups-and-ous',
  },
  {
    id: 'q-26',
    chapterId: 'chapter-12',
    type: 'scenario',
    question: 'An Active Directory admin user belongs to two groups: "IT-Staff" (linked to a Fine-Grained Password Policy with Precedence 50) and "Tier0-Admins" (linked to a policy with Precedence 5). Which policy applies?',
    options: [
      'Precedence 50 wins because 50 is higher',
      'Precedence 5 wins because lower Precedence integers always have higher priority',
      'Neither applies because FGPP only links to OUs',
      'The user cannot log in',
    ],
    correctAnswer: 'Precedence 5 wins because lower Precedence integers always have higher priority',
    explanation: 'In Fine-Grained Password Policies (which attach to Users or Global Security Groups, never OUs), the lowest Precedence integer wins.',
    relatedLessonPath: '/learn/chapter-12/ad-forests-dns-and-fgpp',
  },

  // ==========================================================================
  // CHAPTER 13: FIREWALL, GPO & SCHEDULED TASKS
  // ==========================================================================
  {
    id: 'q-27',
    chapterId: 'chapter-13',
    type: 'multiple-choice',
    question: 'In what order are Group Policy Objects (GPOs) evaluated, and which cmdlet generates an HTML Resultant Set of Policy (RSoP) report?',
    options: [
      'LSDOU (Local → Site → Domain → OU); Get-GPResultantSetOfPolicy -ReportType Html',
      'OU → Domain → Site → Local; Backup-Gpo',
      'Alphabetical order; Invoke-GPUpdate',
      'Random order; Get-GPO',
    ],
    correctAnswer: 'LSDOU (Local → Site → Domain → OU); Get-GPResultantSetOfPolicy -ReportType Html',
    explanation: 'GPOs process in LSDOU order (where the last applied closest OU wins), and Get-GPResultantSetOfPolicy exports the effective settings to HTML.',
    relatedLessonPath: '/learn/chapter-13/gpo-rsop-and-scheduled-tasks',
  },

  // ==========================================================================
  // CHAPTER 14: TOOLMAKING, SPLATTING & ERROR HANDLING
  // ==========================================================================
  {
    id: 'q-28',
    chapterId: 'chapter-14',
    type: 'multiple-choice',
    question: 'Why does `try { Get-Item C:\\Missing.txt } catch { Write-Warning "Caught!" }` fail to run the `catch` block unless you add `-ErrorAction Stop`?',
    options: [
      'Get-Item does not throw errors',
      'Cmdlets emit Non-Terminating errors by default so pipelines can continue; try/catch only catches Terminating errors promoted via -ErrorAction Stop',
      'Write-Warning is not allowed inside catch',
      'try/catch only works in PowerShell 5.1',
    ],
    correctAnswer: 'Cmdlets emit Non-Terminating errors by default so pipelines can continue; try/catch only catches Terminating errors promoted via -ErrorAction Stop',
    explanation: 'Adding -ErrorAction Stop converts non-terminating cmdlet errors into terminating exceptions that jump immediately into catch { }.',
    relatedLessonPath: '/learn/chapter-14/error-handling-and-splatting',
  },

  // ==========================================================================
  // CHAPTER 15: ETHICAL HACKING & OFFENSIVE SECURITY
  // ==========================================================================
  {
    id: 'q-29',
    chapterId: 'chapter-15',
    type: 'multiple-choice',
    question: 'How does AMSI (`amsi.dll`) catch obfuscated and Base64-encoded PowerShell attacks that run entirely in memory via `Invoke-Expression` (`IEX`)?',
    options: [
      'It blocks the internet connection',
      'It hooks directly into the PowerShell engine in memory and scans the fully decoded, de-obfuscated script buffer right before execution',
      'It only scans files saved in C:\\Temp',
      'It disables the keyboard',
    ],
    correctAnswer: 'It hooks directly into the PowerShell engine in memory and scans the fully decoded, de-obfuscated script buffer right before execution',
    explanation: 'No matter how many layers of encoding an attacker uses, PowerShell must unpack the plain text in RAM to execute it, where AMSI inspects the buffer.',
    relatedLessonPath: '/learn/chapter-15/in-memory-cradles-and-evasion',
  },

  // ==========================================================================
  // CHAPTER 16: BLUE TEAM FORENSICS & HARDENING
  // ==========================================================================
  {
    id: 'q-30',
    chapterId: 'chapter-16',
    type: 'multiple-choice',
    question: 'Which Windows Event ID in `Microsoft-Windows-PowerShell/Operational` records the full, decoded source code of executed PowerShell scriptblocks, and how do you stop PowerShell v2.0 downgrade bypasses?',
    options: [
      'Event ID 4104; disable the MicrosoftWindowsPowerShellV2Root optional feature',
      'Event ID 4624; uninstall Windows Defender',
      'Event ID 1000; turn off WinRM',
      'Event ID 7045; set ExecutionPolicy to Bypass',
    ],
    correctAnswer: 'Event ID 4104; disable the MicrosoftWindowsPowerShellV2Root optional feature',
    explanation: 'Event ID 4104 logs full scriptblock code, and removing MicrosoftWindowsPowerShellV2Root prevents attackers from bypassing AMSI/4104 via powershell.exe -Version 2.',
    relatedLessonPath: '/learn/chapter-16/powershell-auditing-and-logging',
  },
];

export const quizzes = QUIZZES;
export const quizQuestions = QUIZZES;
