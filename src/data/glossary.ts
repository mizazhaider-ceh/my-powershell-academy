import { GlossaryItem } from '../types';

export const GLOSSARY: GlossaryItem[] = [
  // ==========================================================================
  // WINDOWS INTERNALS
  // ==========================================================================
  {
    term: 'User Mode (Ring 3) vs. Kernel Mode (Ring 0)',
    category: 'Windows Internals',
    definition:
      'Hardware-enforced CPU privilege rings. User Mode (Ring 3) isolates applications and background services in private virtual memory with no direct hardware access; Kernel Mode (Ring 0) runs ntoskrnl.exe, HAL, and .sys drivers with unrestricted access to RAM and hardware.',
    example: 'Get-CimInstance Win32_SystemDriver | Where-Object State -eq "Running"',
    relatedTerms: ['NTDLL.DLL', 'Executive (ntoskrnl.exe)', 'BSOD'],
    relatedLessonPath: '/learn/chapter-02/user-vs-kernel-mode-syscalls',
  },
  {
    term: 'NTDLL.DLL (System Call Gatekeeper)',
    category: 'Windows Internals',
    definition:
      'The lowest-level User Mode library in Windows. Translates documented Win32 API calls (like WriteFile in kernel32.dll) into native Nt* system calls (NtWriteFile) and executes the CPU SYSCALL instruction to cross into Kernel Mode.',
    example: '(Get-Process -Id $PID).Modules | Where-Object ModuleName -eq "ntdll.dll"',
    relatedTerms: ['User Mode (Ring 3) vs. Kernel Mode (Ring 0)', 'Executive (ntoskrnl.exe)'],
    relatedLessonPath: '/learn/chapter-02/user-vs-kernel-mode-syscalls',
  },
  {
    term: 'Executive (ntoskrnl.exe)',
    category: 'Windows Internals',
    definition:
      'The upper layer of the Windows NT kernel image (ntoskrnl.exe) running in Ring 0. Houses the Object Manager, Security Reference Monitor (SRM), I/O Manager, Memory Manager, Process/Thread Manager, and Plug & Play / Power Manager.',
    example: 'Get-Item C:\\Windows\\System32\\ntoskrnl.exe | Select-Object Name, VersionInfo',
    relatedTerms: ['HAL (Hardware Abstraction Layer)', 'Handle'],
    relatedLessonPath: '/learn/chapter-02/user-vs-kernel-mode-syscalls',
  },
  {
    term: 'Process vs. Thread',
    category: 'Windows Internals',
    definition:
      'A Process is an isolated living resource container in RAM (holding a PID, Private Virtual Address Space, Handle Table, and Security Access Token). Threads are the individual execution workers inside that process that the CPU actually schedules.',
    example: 'Get-Process | Select-Object Name, Id, @{N="Threads";E={$_.Threads.Count}}, Handles',
    relatedTerms: ['Handle', 'Virtual Memory & 4 KB Pages'],
    relatedLessonPath: '/learn/chapter-01/processes-threads-and-handles',
  },
  {
    term: 'Handle & Handle Table',
    category: 'Windows Internals',
    definition:
      'An opaque numeric claim ticket stored in a process’s Handle Table that references a protected Kernel Object (such as an open file, registry key, or process) after the Security Reference Monitor validates the process’s Access Token.',
    example: 'Get-Process | Sort-Object Handles -Descending | Select-Object -First 5 Name, Id, Handles',
    relatedTerms: ['Process vs. Thread', 'Executive (ntoskrnl.exe)'],
    relatedLessonPath: '/learn/chapter-02/user-vs-kernel-mode-syscalls',
  },
  {
    term: 'Virtual Memory & 4 KB Pages',
    category: 'Windows Internals',
    definition:
      'Memory isolation architecture managed by the Windows Memory Manager and CPU MMU. Every process sees a private virtual address space divided into 4 KB pages mapped to physical RAM frames (Working Set) or swapped to C:\\pagefile.sys when idle.',
    example: 'Get-Process | Sort-Object WorkingSet64 -Descending | Select-Object -First 5 Name, WorkingSet64',
    relatedTerms: ['Process vs. Thread'],
    relatedLessonPath: '/learn/chapter-01/virtual-memory-and-paging',
  },
  {
    term: 'LSASS.EXE (Local Security Authority Subsystem Service)',
    category: 'Windows Internals',
    definition:
      'Core Windows security process spawned by wininit.exe (always 1 instance in C:\\Windows\\System32\\lsass.exe). Validates user logons, generates Security Access Tokens, and manages Kerberos tickets and NTLM hashes in memory.',
    example: 'Get-CimInstance Win32_Process -Filter "Name = \'lsass.exe\'" | Select-Object ProcessId, ParentProcessId, ExecutablePath',
    relatedTerms: ['SVCHOST.EXE', 'Services.exe (SCM)'],
    relatedLessonPath: '/learn/chapter-02/system-processes-and-service-accounts',
  },
  {
    term: 'SVCHOST.EXE (Service Host)',
    category: 'Windows Internals',
    definition:
      'Generic host process (C:\\Windows\\System32\\svchost.exe) always spawned by services.exe to run Windows services compiled as .dll files. Running multiple instances isolates services so one crash does not bring down others.',
    example: 'Get-CimInstance Win32_Process -Filter "Name = \'svchost.exe\'" | Select-Object ProcessId, ParentProcessId, CommandLine',
    relatedTerms: ['LSASS.EXE (Local Security Authority Subsystem Service)'],
    relatedLessonPath: '/learn/chapter-02/system-processes-and-service-accounts',
  },
  {
    term: 'UEFI + GPT vs. BIOS + MBR',
    category: 'Windows Internals',
    definition:
      'Legacy BIOS booted by blindly executing 446 bytes of code inside the 512-byte Master Boot Record (Sector 0, limited to 4 primary partitions and 2 TB disks). Modern UEFI boots signed .efi binaries from a GPT disk (supporting 128+ partitions, zettabyte disks, backup headers, and Secure Boot).',
    example: 'Get-Disk | Select-Object Number, FriendlyName, PartitionStyle, Size',
    relatedTerms: ['STEM Boot Defenses (Secure, Trusted, ELAM, Measured)'],
    relatedLessonPath: '/learn/chapter-02/boot-chain-uefi-gpt-defenses',
  },
  {
    term: 'STEM Boot Defenses (Secure, Trusted, ELAM, Measured)',
    category: 'Windows Internals',
    definition:
      'The 4-stage Windows hardware boot defense relay: Secure Boot (UEFI verifies bootmgfw.efi/winload.efi), Trusted Boot (winload.efi verifies ntoskrnl.exe), ELAM (Early Launch Anti-Malware inspects third-party boot drivers first), and Measured Boot (TPM records cryptographic hashes).',
    example: 'Confirm-SecureBootUEFI',
    relatedTerms: ['UEFI + GPT vs. BIOS + MBR'],
    relatedLessonPath: '/learn/chapter-02/boot-chain-uefi-gpt-defenses',
  },

  // ==========================================================================
  // CORE CONCEPTS
  // ==========================================================================
  {
    term: 'Cmdlet (Verb-SingularNoun)',
    category: 'Core Concepts',
    definition:
      'A native PowerShell command compiled in .NET that follows the strict ApprovedVerb-SingularNoun naming convention (e.g., Get-Process, New-LocalUser, Enable-NetFirewallRule) and emits structured objects.',
    example: 'Get-Command -Verb Get -Noun *Service*',
    relatedTerms: ['Self-Reliance Pocketknife', 'Alias'],
    relatedLessonPath: '/learn/chapter-03/verb-noun-and-discovery',
  },
  {
    term: 'Self-Reliance Pocketknife (Get-Command, Get-Help, Get-Member)',
    category: 'Core Concepts',
    definition:
      'The three discovery commands that make a PowerShell engineer 100% self-sufficient offline: Get-Command (discover the right cmdlet), Get-Help (learn syntax, examples, and pipeline binding), and Get-Member (X-ray output object properties and methods).',
    example: 'Get-Help Get-Service -Examples',
    relatedTerms: ['Cmdlet (Verb-SingularNoun)'],
    relatedLessonPath: '/learn/chapter-03/help-and-self-reliance',
  },
  {
    term: 'Alias',
    category: 'Core Concepts',
    definition:
      'A shorthand nickname pointing to a full cmdlet (such as dir/ls/gci for Get-ChildItem, ? for Where-Object, and % for ForEach-Object). Convenient for interactive typing, but full cmdlet names should always be used in saved .ps1 scripts.',
    example: 'Get-Alias -Definition Get-ChildItem',
    relatedTerms: ['Cmdlet (Verb-SingularNoun)'],
    relatedLessonPath: '/learn/chapter-03/verb-noun-and-discovery',
  },
  {
    term: 'PSProvider & PSDrive',
    category: 'Core Concepts',
    definition:
      'A PSProvider is an adapter that exposes a hierarchical data store (FileSystem, Registry, Environment, Certificate, ActiveDirectory) as virtual drives (PSDrives like C:, HKLM:, HKCU:, Env:, Cert:, AD:) navigable via Set-Location and Get-ChildItem.',
    example: 'Get-PSDrive',
    relatedTerms: ['Get-ChildItem'],
    relatedLessonPath: '/learn/chapter-08/psproviders-and-psdrives',
  },

  // ==========================================================================
  // PIPELINE & OBJECTS
  // ==========================================================================
  {
    term: '.NET Object (Properties & Methods)',
    category: 'Pipeline & Objects',
    definition:
      'Every item emitted by a PowerShell command is a live instance of a .NET class containing Properties (attributes read via $obj.Property) and Methods (actions invoked with parentheses via $obj.Method()).',
    example: 'Get-Process | Get-Member',
    relatedTerms: ['Parameter Binding (ByValue vs. ByPropertyName)', '[PSCustomObject]@{}'],
    relatedLessonPath: '/learn/chapter-04/objects-properties-methods',
  },
  {
    term: 'Parameter Binding (ByValue vs. ByPropertyName)',
    category: 'Pipeline & Objects',
    definition:
      'How a receiving cmdlet binds incoming pipeline objects to its parameters: it first attempts ByValue (matching the incoming object’s exact .NET TypeName) and second attempts ByPropertyName (matching a property name on the incoming object to a parameter name).',
    example: '[PSCustomObject]@{ Name = "explorer" } | Get-Process',
    relatedTerms: ['.NET Object (Properties & Methods)'],
    relatedLessonPath: '/learn/chapter-05/pipeline-mechanics-and-binding',
  },
  {
    term: 'Filter Left, Format Right',
    category: 'Pipeline & Objects',
    definition:
      'Two foundational pipeline laws: Filter Left (filter as early as possible at the source cmdlet using -Filter before falling back to Where-Object) and Format Right (place Format-Table / Format-List at the very end because they destroy original data objects).',
    example: 'Get-ChildItem -Path C:\\Windows -Filter *.dll -Recurse | Sort-Object Length -Descending | Select-Object -First 5 | Format-Table -AutoSize',
    relatedTerms: ['[PSCustomObject]@{}'],
    relatedLessonPath: '/learn/chapter-07/filter-left-and-where-object',
  },
  {
    term: '[PSCustomObject]@{}',
    category: 'Pipeline & Objects',
    definition:
      'Constructs a structured custom object from key-value pairs where every key becomes a NoteProperty that can be filtered, sorted, exported to CSV/JSON/HTML, or piped ByPropertyName into other cmdlets.',
    example: '[PSCustomObject]@{ Host = $env:COMPUTERNAME; Time = Get-Date }',
    relatedTerms: ['Parameter Binding (ByValue vs. ByPropertyName)'],
    relatedLessonPath: '/learn/chapter-04/formatting-and-custom-objects',
  },

  // ==========================================================================
  // SCRIPTING & FUNCTIONS
  // ==========================================================================
  {
    term: 'Execution Policy (RemoteSigned)',
    category: 'Scripting & Functions',
    definition:
      'A safety seatbelt controlling when PowerShell runs .ps1 scripts. RemoteSigned allows locally written scripts to run unsigned while requiring a trusted digital signature on scripts downloaded from the internet.',
    example: 'Set-ExecutionPolicy RemoteSigned -Scope CurrentUser',
    relatedTerms: ['Constrained Language Mode (CLM)'],
    relatedLessonPath: '/learn/chapter-10/scripts-and-execution-policies',
  },
  {
    term: 'Parameter Splatting (@params)',
    category: 'Scripting & Functions',
    definition:
      'Passing a hashtable of parameter names and values to a cmdlet using the @ symbol (@params instead of $params) to keep multi-parameter calls clean, readable, and free of fragile backticks.',
    example: '$p = @{ Name = "wuauserv"; ErrorAction = "Stop" } ; Get-Service @p',
    relatedTerms: ['Advanced Function ([CmdletBinding()])'],
    relatedLessonPath: '/learn/chapter-14/error-handling-and-splatting',
  },
  {
    term: 'Terminating vs. Non-Terminating Errors (-ErrorAction Stop)',
    category: 'Scripting & Functions',
    definition:
      'Cmdlets emit Non-Terminating errors by default so a single bad item does not abort a 100-item pipeline, meaning try/catch ignores them unless you pass -ErrorAction Stop to promote the failure into a Terminating exception.',
    example: 'try { Get-Item C:\\Missing.txt -ErrorAction Stop } catch { $_.Exception.Message }',
    relatedTerms: ['Parameter Splatting (@params)'],
    relatedLessonPath: '/learn/chapter-14/error-handling-and-splatting',
  },
  {
    term: 'Advanced Function ([CmdletBinding()])',
    category: 'Scripting & Functions',
    definition:
      'A PowerShell function decorated with [CmdletBinding()] and [Parameter()] attributes that gains compiled-cmdlet capabilities including -Verbose, -ErrorAction, -WhatIf (SupportsShouldProcess), and streaming pipeline input via begin/process/end blocks.',
    example: '[CmdletBinding(SupportsShouldProcess = $true)] param([Parameter(ValueFromPipeline)]$Name)',
    relatedTerms: ['Parameter Splatting (@params)'],
    relatedLessonPath: '/learn/chapter-14/advanced-functions-toolmaking',
  },

  // ==========================================================================
  // ADMINISTRATION & REMOTING
  // ==========================================================================
  {
    term: 'WinRM (Windows Remote Management - Ports 5985 / 5986)',
    category: 'Administration & Remoting',
    definition:
      'Microsoft’s implementation of the WS-Management protocol used by PowerShell Remoting (Enter-PSSession and Invoke-Command). Listens on TCP 5985 (HTTP) and TCP 5986 (HTTPS) with Kerberos payload encryption in domain environments.',
    example: 'Test-WSMan -ComputerName SRV-CORE01',
    relatedTerms: ['Kerberos Double-Hop Problem'],
    relatedLessonPath: '/learn/chapter-11/winrm-and-remoting',
  },
  {
    term: 'Kerberos Double-Hop Problem',
    category: 'Administration & Remoting',
    definition:
      'When you connect from Workstation A to Server B via WinRM (Hop 1) and try to access a network share on Server C from inside that session (Hop 2), Kerberos blocks Server B from forwarding your credentials to Server C unless delegation is configured.',
    example: 'Copy-Item -Path .\\app.msi -Destination C:\\Temp -ToSession $session',
    relatedTerms: ['WinRM (Windows Remote Management - Ports 5985 / 5986)'],
    relatedLessonPath: '/learn/chapter-11/winrm-and-remoting',
  },

  // ==========================================================================
  // ACTIVE DIRECTORY & NETWORKING
  // ==========================================================================
  {
    term: 'Fine-Grained Password Policy (FGPP / PSO)',
    category: 'Active Directory & Networking',
    definition:
      'Allows applying stricter password length and lockout rules to specific Users or Global Security Groups (never OUs!) inside an Active Directory domain. When multiple policies apply to a user, the lowest Precedence integer (e.g., 1 vs 50) wins.',
    example: 'New-ADFineGrainedPasswordPolicy -Name "Admin-PSO" -Precedence 1 -MinPasswordLength 20',
    relatedTerms: ['Group Policy Object (GPO & LSDOU)'],
    relatedLessonPath: '/learn/chapter-12/ad-forests-dns-and-fgpp',
  },
  {
    term: 'Group Policy Object (GPO & LSDOU)',
    category: 'Active Directory & Networking',
    definition:
      'Centralized configuration policies evaluated in LSDOU order (Local -> Site -> Domain -> Organizational Unit), where the last applied policy (closest OU) overrides earlier settings unless a higher GPO is Enforced. Audited via Get-GPResultantSetOfPolicy (RSoP).',
    example: 'Get-GPResultantSetOfPolicy -ReportType Html -Path C:\\Reports\\RSoP.html',
    relatedTerms: ['Fine-Grained Password Policy (FGPP / PSO)'],
    relatedLessonPath: '/learn/chapter-13/gpo-rsop-and-scheduled-tasks',
  },

  // ==========================================================================
  // SECURITY & ETHICAL HACKING
  // ==========================================================================
  {
    term: '[adsisearcher] & Kerberoasting (SPNs)',
    category: 'Security & Ethical Hacking',
    definition:
      '[adsisearcher] is a built-in .NET type accelerator (System.DirectoryServices.DirectorySearcher) that lets ethical hackers and admins query Active Directory LDAP without RSAT, commonly used to audit user accounts with ServicePrincipalNames (SPNs) vulnerable to offline Kerberoasting.',
    example: '[adsisearcher]"(&(objectCategory=person)(objectClass=user)(servicePrincipalName=*))"',
    relatedTerms: ['AMSI (Antimalware Scan Interface)', 'Event ID 4104 (Script Block Logging)'],
    relatedLessonPath: '/learn/chapter-15/offensive-recon-and-ad-enum',
  },
  {
    term: 'AMSI (Antimalware Scan Interface / amsi.dll)',
    category: 'Security & Ethical Hacking',
    definition:
      'A Windows security interface loaded inside powershell.exe/pwsh.exe that intercepts script buffers in memory right before execution (such as inside Invoke-Expression / IEX), allowing EDR/Defender to inspect payloads after Base64 decoding and de-obfuscation.',
    example: '(Get-Process -Id $PID).Modules | Where-Object ModuleName -eq "amsi.dll"',
    relatedTerms: ['Event ID 4104 (Script Block Logging)', 'Constrained Language Mode (CLM)'],
    relatedLessonPath: '/learn/chapter-15/in-memory-cradles-and-evasion',
  },
  {
    term: 'Event ID 4104 (Script Block Logging)',
    category: 'Security & Ethical Hacking',
    definition:
      'Recorded in Microsoft-Windows-PowerShell/Operational, Event ID 4104 captures the full, de-obfuscated source code of every PowerShell scriptblock compiled and executed in memory, providing complete forensic visibility into fileless attacks.',
    example: 'Get-WinEvent -FilterHashtable @{ LogName = "Microsoft-Windows-PowerShell/Operational"; Id = 4104 } -MaxEvents 10',
    relatedTerms: ['AMSI (Antimalware Scan Interface / amsi.dll)', 'Just Enough Administration (JEA)'],
    relatedLessonPath: '/learn/chapter-16/powershell-auditing-and-logging',
  },
  {
    term: 'Constrained Language Mode (CLM)',
    category: 'Security & Ethical Hacking',
    definition:
      'A hardened PowerShell execution mode (enforced via WDAC or AppLocker) that permits core cmdlets while blocking arbitrary .NET type creation, Win32 API calls, Add-Type C# compilation, and COM objects.',
    example: '$ExecutionContext.SessionState.LanguageMode',
    relatedTerms: ['Just Enough Administration (JEA)', 'AMSI (Antimalware Scan Interface / amsi.dll)'],
    relatedLessonPath: '/learn/chapter-16/hardening-jea-and-threat-hunting',
  },
  {
    term: 'Just Enough Administration (JEA)',
    category: 'Security & Ethical Hacking',
    definition:
      'A WinRM security technology that uses Role Capability files (.psrc) and Session Configurations (.pssc) with RunAsVirtualAccount to let non-admin operators execute only whitelisted cmdlets and parameters without granting standing Administrator privileges.',
    example: 'New-PSSessionConfigurationFile -Path .\\Helpdesk.pssc -SessionType RestrictedRemoteServer -RunAsVirtualAccount',
    relatedTerms: ['Constrained Language Mode (CLM)', 'Event ID 4104 (Script Block Logging)'],
    relatedLessonPath: '/learn/chapter-16/hardening-jea-and-threat-hunting',
  },
];

export const glossary = GLOSSARY;
export const glossaryItems = GLOSSARY;
