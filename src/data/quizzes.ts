import { QuizQuestion } from '../types';

type QuizType = QuizQuestion['type'];

interface QuizSeed {
  chapter: number;
  type: QuizType;
  question: string;
  code?: string;
  options: [string, string, string, string];
  /** Index of the correct option. The answer text is derived from it, so it can never drift. */
  correct: 0 | 1 | 2 | 3;
  explanation: string;
  lesson: keyof typeof LESSON_PATHS;
}

const LESSON_PATHS = {
  '1-1': '/learn/chapter-01/windows-evolution-and-least-privilege',
  '1-2': '/learn/chapter-01/processes-threads-and-handles',
  '1-3': '/learn/chapter-01/virtual-memory-and-paging',
  '2-1': '/learn/chapter-02/user-vs-kernel-mode-syscalls',
  '2-2': '/learn/chapter-02/system-processes-and-service-accounts',
  '2-3': '/learn/chapter-02/boot-chain-uefi-gpt-defenses',
  '3-1': '/learn/chapter-03/what-is-powershell',
  '3-2': '/learn/chapter-03/verb-noun-and-discovery',
  '3-3': '/learn/chapter-03/help-and-self-reliance',
  '4-1': '/learn/chapter-04/objects-properties-methods',
  '4-2': '/learn/chapter-04/formatting-and-custom-objects',
  '5-1': '/learn/chapter-05/pipeline-mechanics-and-binding',
  '5-2': '/learn/chapter-05/chaining-and-multiline',
  '6-1': '/learn/chapter-06/variables-arrays-and-types',
  '6-2': '/learn/chapter-06/quotes-and-secure-io',
  '7-1': '/learn/chapter-07/filter-left-and-where-object',
  '7-2': '/learn/chapter-07/select-sort-and-safety',
  '8-1': '/learn/chapter-08/psproviders-and-psdrives',
  '8-2': '/learn/chapter-08/files-and-select-string',
  '9-1': '/learn/chapter-09/headless-server-core-build',
  '9-2': '/learn/chapter-09/hands-on-admin-workout',
  '10-1': '/learn/chapter-10/scripts-and-execution-policies',
  '10-2': '/learn/chapter-10/control-flow-and-loops',
  '11-1': '/learn/chapter-11/module-lifecycle',
  '11-2': '/learn/chapter-11/winrm-and-remoting',
  '12-1': '/learn/chapter-12/ad-users-groups-and-ous',
  '12-2': '/learn/chapter-12/ad-forests-dns-and-fgpp',
  '13-1': '/learn/chapter-13/firewall-profiles-and-rules',
  '13-2': '/learn/chapter-13/gpo-rsop-and-scheduled-tasks',
  '14-1': '/learn/chapter-14/error-handling-and-splatting',
  '14-2': '/learn/chapter-14/advanced-functions-toolmaking',
  '15-1': '/learn/chapter-15/offensive-recon-and-ad-enum',
  '15-2': '/learn/chapter-15/in-memory-cradles-and-evasion',
  '16-1': '/learn/chapter-16/powershell-auditing-and-logging',
  '16-2': '/learn/chapter-16/hardening-jea-and-threat-hunting',
} as const;

const SEEDS: QuizSeed[] = [
  // ==========================================================================
  // CHAPTER 1: INSIDE THE WINDOWS KERNEL
  // ==========================================================================
  {
    chapter: 1,
    type: 'multiple-choice',
    question:
      'You are a member of the Administrators group and open PowerShell normally. whoami /groups reports Medium Mandatory Level. What does that tell you?',
    options: [
      'Your account was removed from Administrators when you logged in',
      'UAC gave this window a filtered standard token, so you must elevate to use the full one',
      'Windows runs every PowerShell window at Medium, even when it is elevated',
      'The window runs as SYSTEM with a deliberately reduced set of privileges',
    ],
    correct: 1,
    explanation:
      'UAC gives an administrator two tokens and starts normal programs with the filtered, Medium integrity one. High Mandatory Level appears only after you approve elevation. Group membership never changed, so the first option is wrong. An elevated window reports High, so Medium is not a fixed PowerShell trait, and SYSTEM is a different identity that reports System Mandatory Level.',
    lesson: '1-1',
  },
  {
    chapter: 1,
    type: 'output-interpretation',
    question: 'What does this output tell you about the window it was run in?',
    code: `PS C:\\> whoami /groups | Select-String 'Mandatory Level'

Mandatory Label\\High Mandatory Level   Label   S-1-16-12288`,
    options: [
      'It runs as a standard user with the filtered token',
      'It runs as SYSTEM, the most powerful local account',
      'UAC is turned off on this computer',
      'It is elevated and holds the full administrator token',
    ],
    correct: 3,
    explanation:
      'S-1-16-12288 is the High integrity level, which a window gets only after elevation with the full administrator token. A standard token shows Medium (S-1-16-8192), and SYSTEM would show System Mandatory Level instead. A High label does not prove UAC is off, because with UAC on you reach High by approving the elevation prompt.',
    lesson: '1-1',
  },
  {
    chapter: 1,
    type: 'scenario',
    question:
      'A single-threaded editor shows (Not Responding) while it saves a very large file, then recovers by itself. What is the most likely cause?',
    options: [
      'The process lost its handles, so Windows paused the whole program',
      'The CPU stopped scheduling the process until the save finished',
      'The only thread was busy with the slow write and could not process window messages',
      'The access token expired and the program waited for a new one',
    ],
    correct: 2,
    explanation:
      'The scheduler runs threads, and this process has one thread that is stuck inside the disk write, so nobody answers clicks or redraws the window. Well-written programs save on a worker thread. Handles are not lost during a save, the scheduler keeps offering the thread turns (it is just waiting on the disk), and tokens do not expire in the middle of a session.',
    lesson: '1-2',
  },
  {
    chapter: 1,
    type: 'multiple-choice',
    question:
      'A firewall log from last week says PID 4812 opened a connection. Why can you not assume PID 4812 is the same program today?',
    options: [
      'Windows recycles PIDs, so a number identifies a process only while it is alive',
      'PIDs are re-randomised every time the user signs in',
      'PIDs belong to threads, and threads are always replaced',
      'Only service processes keep a fixed PID across a whole week',
    ],
    correct: 0,
    explanation:
      'A PID names one running process for its lifetime and is reused after it exits, so old logs need a timestamp plus the process name or path. PIDs are not re-randomised at sign-in, a PID belongs to the process (threads have their own thread IDs), and even services get a new PID whenever they restart.',
    lesson: '1-2',
  },
  {
    chapter: 1,
    type: 'output-interpretation',
    question: 'What do these numbers tell you?',
    code: `Name     WorkingSetMB  PrivateMB  VirtualMB
----     ------------  ---------  ---------
chrome          310.2      285.4     2150.8`,
    options: [
      'The process has leaked 2150 MB of RAM that must be freed',
      'About 310 MB is in RAM now, and the larger virtual figure is reserved address space',
      'The pagefile holds the 1840 MB difference between virtual size and working set',
      'The three columns are the same measurement taken at different moments',
    ],
    correct: 1,
    explanation:
      'WorkingSet is the part of the process currently in physical RAM, Private is memory only this process committed, and Virtual is the address range it reserved or mapped. A big virtual number is normal and is not a leak. Subtracting working set from virtual size does not give pagefile usage, because most of a reserved range is never backed by anything, and the columns measure different things rather than different moments.',
    lesson: '1-3',
  },
  {
    chapter: 1,
    type: 'multiple-choice',
    question:
      'Task Manager shows 85% of memory in use on a healthy workstation. Which pair of facts would better show real memory pressure?',
    options: [
      'Large virtual sizes and a pagefile.sys that exists',
      'A high number of processes and many open handles',
      'A full memory bar and a busy CPU',
      'Low Available MBytes and a sustained high Pages/sec rate',
    ],
    correct: 3,
    explanation:
      'Windows deliberately fills spare RAM with cache, so a full bar alone is normal. Pressure shows when available memory is low and pages are read from disk continuously (sustained high Pages/sec). Large virtual sizes, an existing pagefile, many processes or handles and a busy CPU are all common on healthy systems and say nothing about paging.',
    lesson: '1-3',
  },

  // ==========================================================================
  // CHAPTER 2: RINGS OF POWER AND THE BOOT CHAIN
  // ==========================================================================
  {
    chapter: 2,
    type: 'multiple-choice',
    question: 'services.exe runs under the SYSTEM account. In which CPU mode does it run?',
    options: [
      'Kernel Mode (Ring 0), because SYSTEM is the most privileged account',
      'Kernel Mode, but only while it starts a service',
      'User Mode (Ring 3), with a very powerful token',
      'Hypervisor mode, which sits above Ring 0',
    ],
    correct: 2,
    explanation:
      'Privilege (what a token allows) and CPU mode (Ring 3 or Ring 0) are separate ideas. SYSTEM processes such as services.exe still run in User Mode and enter the kernel only through system calls. Only the kernel and drivers run in Ring 0, and the hypervisor is not involved in this ordinary case.',
    lesson: '2-1',
  },
  {
    chapter: 2,
    type: 'scenario',
    question:
      'In Process Explorer you find svchost.exe with explorer.exe as its parent, running from C:\\Users\\Public. What is the best conclusion?',
    options: [
      'Treat it as suspicious: a real svchost.exe lives in System32 and is started by services.exe',
      'It is normal, because dozens of svchost.exe processes are expected',
      'It is normal, because explorer.exe starts every user-mode process',
      'It is harmless as long as its name is spelled correctly',
    ],
    correct: 0,
    explanation:
      'Many svchost.exe instances are normal, but the path (System32) and the parent (services.exe) must match, and here both are wrong. explorer.exe starts your programs, not Windows service hosts, and a correct spelling proves nothing because any file can carry the name. Check the signature as well.',
    lesson: '2-2',
  },
  {
    chapter: 2,
    type: 'output-interpretation',
    question:
      'You ran this in a normal (non-elevated) window and the path is blank. What should you conclude?',
    code: `PS C:\\> Get-CimInstance Win32_Process -Filter "Name = 'lsass.exe'" | Select-Object ProcessId, ExecutablePath

ProcessId ExecutablePath
--------- --------------
      712`,
    options: [
      'The file has been deleted from disk, so this is certainly malware',
      'Nothing yet: protected processes can hide their path from a non-elevated shell, so repeat elevated',
      'lsass.exe never has a path, so a blank value is expected',
      'Win32_Process cannot report paths, so Get-Process is the only option',
    ],
    correct: 1,
    explanation:
      'Reading the path of a protected process needs elevation, so a blank value from a standard window reflects a limit of your access rather than tampering (the same blank appears for the genuine lsass.exe). A running process always has an image file, so blank is not normal, and Win32_Process does report paths for most processes. Repeat the query elevated before judging.',
    lesson: '2-2',
  },
  {
    chapter: 2,
    type: 'multiple-choice',
    question:
      'Which of the four boot defences records what happened but never blocks the boot by itself?',
    options: ['Secure Boot', 'Trusted Boot', 'ELAM', 'Measured Boot'],
    correct: 3,
    explanation:
      'Measured Boot hashes each stage into the TPM so BitLocker or an attestation service can judge afterwards, which makes it a witness. Secure Boot and Trusted Boot refuse unsigned or damaged components, and ELAM classifies early drivers as good, bad or unknown and can stop bad ones from loading.',
    lesson: '2-3',
  },
  {
    chapter: 2,
    type: 'command-completion',
    question:
      'Complete the command that reports whether Secure Boot is enforcing signatures (run it elevated on a UEFI machine).',
    code: '____-SecureBootUEFI',
    options: ['Confirm', 'Get', 'Test', 'Enable'],
    correct: 0,
    explanation:
      'The cmdlet is Confirm-SecureBootUEFI and it returns True or False. Get-, Test- and Enable- do not exist for this noun, and nothing here changes the setting. On a legacy BIOS machine the cmdlet throws a "not supported on this platform" error, which is an answer in itself.',
    lesson: '2-3',
  },

  // ==========================================================================
  // CHAPTER 3: WHAT POWERSHELL IS, DISCOVERY AND HELP
  // ==========================================================================
  {
    chapter: 3,
    type: 'scenario',
    question:
      'A script that uses Get-Service && Get-Process works on your laptop but fails with a parser error on a freshly built Server Core machine. Why?',
    options: [
      'Server Core blocks chain operators for security reasons',
      'The && operator only works in an elevated session',
      'You are in Windows PowerShell 5.1, which has no && operator',
      'Get-Process is not installed on Server Core',
    ],
    correct: 2,
    explanation:
      'Server Core boots to a command prompt (SConfig opens on Server 2022 and later), and typing powershell starts Windows PowerShell 5.1. The && and || operators exist only in PowerShell 7 and later. Nothing blocks them for security, elevation is irrelevant to parsing, and Get-Process ships with every Windows PowerShell.',
    lesson: '3-1',
  },
  {
    chapter: 3,
    type: 'command-completion',
    question: 'Complete the discovery command that finds the cmdlet for deleting firewall rules.',
    code: 'Get-Command -Verb ____ -Noun NetFirewallRule',
    options: ['Delete', 'Erase', 'Remove', 'Clear'],
    correct: 2,
    explanation:
      'Remove is the approved verb for deleting, so Remove-NetFirewallRule exists. Delete and Erase are not approved verbs. Clear is approved but means emptying the contents of something while keeping the container, and there is no Clear-NetFirewallRule.',
    lesson: '3-2',
  },
  {
    chapter: 3,
    type: 'output-interpretation',
    question: 'What is the real mistake behind this error?',
    code: `PS C:\\> Get-Services
Get-Services : The term 'Get-Services' is not recognized as the name of a cmdlet, function, script file, or operable program.`,
    options: [
      'Cmdlet nouns are singular, so the command is Get-Service',
      'Get-Service needs a module imported before it can be used',
      'The Get verb is not approved, so Microsoft renamed it',
      'The shell must be elevated before services can be listed',
    ],
    correct: 0,
    explanation:
      'The noun names the kind of thing, not the count, so it is Get-Service even when hundreds of services come back. Get-Service is built in and needs no module or elevation, and Get is the most common approved verb. The "not recognized" wording means the name does not exist, not that rights are missing.',
    lesson: '3-2',
  },
  {
    chapter: 3,
    type: 'output-interpretation',
    question: 'Using only this syntax line, which call is valid?',
    code: `SYNTAX
    Stop-Process [-Id] <int[]> [-PassThru] [-Force] [-WhatIf] [-Confirm] [<CommonParameters>]`,
    options: [
      'Stop-Process -PassThru -WhatIf',
      'Stop-Process 4812 -WhatIf',
      'Stop-Process -Id',
      'Stop-Process -Ids 4812 -WhatIf',
    ],
    correct: 1,
    explanation:
      'Brackets around only -Id mean the parameter name may be left out (it is positional), but the value is still required, so Stop-Process 4812 -WhatIf is a valid preview. The first call supplies no ID at all, the third gives -Id no value, and -Ids is not a parameter name.',
    lesson: '3-3',
  },
  {
    chapter: 3,
    type: 'scenario',
    question:
      'On a server with no internet access, Get-Help Get-Process shows only syntax and no examples. What should you do?',
    options: [
      'Run Get-Help Get-Process -Full, which downloads the missing text',
      'Install PowerShell 7, which includes all help files',
      'Use Get-Help -Online and read the page in the console',
      'Run Save-Help on a connected machine, then Update-Help -SourcePath on the server',
    ],
    correct: 3,
    explanation:
      'Fresh installs hold only help stubs. Update-Help fills them, and an offline server needs the files saved elsewhere with Save-Help and loaded from a folder or share with -SourcePath. The -Full switch only formats what is already on disk, PowerShell 7 also needs Update-Help for its help, and -Online opens a web page that needs a browser and internet.',
    lesson: '3-3',
  },

  // ==========================================================================
  // CHAPTER 4: EVERYTHING IS AN OBJECT
  // ==========================================================================
  {
    chapter: 4,
    type: 'output-interpretation',
    question: 'The second command did not stop the PowerShell window. Why?',
    code: `PS C:\\> $p = Get-Process -Id $PID
PS C:\\> $p.Kill

OverloadDefinitions
-------------------
void Kill()`,
    options: [
      'Kill is a property, so it only reads the process state',
      'The window needed -Force before it could be stopped',
      'Without parentheses PowerShell shows the method signature and does not call it',
      'Windows protects the current shell from being killed',
    ],
    correct: 2,
    explanation:
      'A method must be called with parentheses, even when empty. Without them PowerShell prints the definition, which is a safe way to inspect a method. Kill is a method rather than a property, there is no -Force on a method call, and the shell is not protected: $p.Kill() would end this very window.',
    lesson: '4-1',
  },
  {
    chapter: 4,
    type: 'multiple-choice',
    question: 'Get-ChildItem C:\\Windows | Get-Member prints two TypeName blocks. What does that mean?',
    options: [
      'Get-Member ran twice because the folder is large',
      'The pipeline held two kinds of objects, DirectoryInfo and FileInfo',
      'Each file has two blueprints, one for data and one for display',
      'One block lists the properties and the other lists the methods',
    ],
    correct: 1,
    explanation:
      'Get-Member prints one block per distinct type that comes through the pipeline, and a folder listing mixes folders and files. It runs only once, an object has one type (display is handled separately), and properties and methods are listed together inside each block.',
    lesson: '4-1',
  },
  {
    chapter: 4,
    type: 'scenario',
    question:
      'A colleague exports a report with Get-Service | Format-Table Name, Status | Export-Csv s.csv. The CSV has columns such as pageHeaderEntry and shapeInfo. What is the fix?',
    options: [
      'Add -NoTypeInformation to Export-Csv',
      'Add -AutoSize to Format-Table',
      'Move Format-Table to the start of the pipeline',
      'Replace Format-Table with Select-Object Name, Status',
    ],
    correct: 3,
    explanation:
      'Format-Table turns objects into layout records meant for the screen, so Export-Csv exported those records. Select-Object keeps real (trimmed) objects, which export cleanly. -NoTypeInformation only removes the #TYPE line, -AutoSize only changes column widths, and moving Format-Table earlier destroys the data even sooner.',
    lesson: '4-2',
  },
  {
    chapter: 4,
    type: 'command-completion',
    question: 'Complete the calculated property so the new column is called MemMB.',
    code: "Get-Process | Select-Object Name, @{ ____ = 'MemMB'; Expression = { [math]::Round($_.WorkingSet64 / 1MB, 1) } }",
    options: ['Name', 'Value', 'Header', 'Column'],
    correct: 0,
    explanation:
      'A calculated property is a hashtable whose Name key (Label also works) sets the column title and whose Expression key holds the recipe. Value, Header and Column are not recognised keys, so Select-Object would reject them with an error.',
    lesson: '4-2',
  },
  {
    chapter: 4,
    type: 'output-interpretation',
    question: 'What does this TypeName show?',
    code: `PS C:\\> Get-Process | Select-Object Name, Id | Get-Member | Select-Object -First 1

   TypeName: Selected.System.Diagnostics.Process`,
    options: [
      'Nothing changed: the objects are still genuine Process objects',
      'Select-Object turned the objects into formatting records',
      'Select-Object built new trimmed objects, so methods such as Kill() are gone',
      'Get-Member is describing the type of the Select-Object cmdlet',
    ],
    correct: 2,
    explanation:
      'Select-Object makes a copy that carries only the chosen properties and tags it Selected.<original type>. It still sorts and exports, but the methods are gone. It did not keep the original type, and formatting records come from the Format-* cmdlets, which show a Microsoft.PowerShell.Commands.Internal.Format type instead. Get-Member describes the objects that arrive, not the cmdlet.',
    lesson: '4-2',
  },

  // ==========================================================================
  // CHAPTER 5: THE PIPELINE
  // ==========================================================================
  {
    chapter: 5,
    type: 'output-interpretation',
    question: "Why does this fail while 'spooler' | Get-Service works?",
    code: `PS C:\\> 'explorer' | Get-Process
Get-Process : The input object cannot be bound to any parameters for the command either because the command does not take pipeline input or the input and its properties do not match any of the parameters that take pipeline input.`,
    options: [
      'Get-Process cannot take any pipeline input',
      'Process names must be piped in uppercase',
      'Get-Process -Name is positional, so a pipe is not allowed',
      'Get-Process -Name accepts only ByPropertyName, and a string has no Name property',
    ],
    correct: 3,
    explanation:
      'Get-Process takes pipeline input through -InputObject (Process objects) and through -Name only ByPropertyName, so a plain string matches nothing. Get-Service -Name also accepts ByValue, which is why a string works there. Capitalisation is irrelevant, and being positional says nothing about pipeline input.',
    lesson: '5-1',
  },
  {
    chapter: 5,
    type: 'command-completion',
    question: 'Complete the custom object so it binds to Get-Process by property name.',
    code: "[PSCustomObject]@{ ____ = 'explorer' } | Get-Process",
    options: ['Value', 'Name', 'Process', 'Target'],
    correct: 1,
    explanation:
      'ByPropertyName binding matches a property to a parameter of the same name, so a property called Name feeds -Name. Value, Process and Target do not match any parameter of Get-Process that accepts pipeline input, so the object would be rejected.',
    lesson: '5-1',
  },
  {
    chapter: 5,
    type: 'scenario',
    question:
      'Import-Csv services.csv has one column called Svc, and Import-Csv services.csv | Get-Service fails with a binding error. What is the cleanest fix?',
    options: [
      'Map Svc to Name with a calculated property in Select-Object',
      'Add -ByPropertyName to Get-Service',
      'Pipe the rows through Out-String first',
      'Cast each row to [string] before the pipe',
    ],
    correct: 0,
    explanation:
      'Get-Service -Name binds ByPropertyName, so the incoming object needs a property called Name, and a calculated property or a renamed column creates it. There is no -ByPropertyName switch, because binding is decided by how the parameter is declared. Out-String and a [string] cast turn each row into text such as @{Svc=Spooler}, which is not a service name.',
    lesson: '5-1',
  },
  {
    chapter: 5,
    type: 'output-interpretation',
    question: 'Why did the warning not print?',
    code: `# PowerShell 7 only: && and || do not exist in Windows PowerShell 5.1
PS C:\\> Test-Path C:\\NoSuchFolder || Write-Warning 'Folder is missing'
False`,
    options: [
      '|| only runs its right side when the left side returned True',
      'Write-Warning is hidden unless -Verbose is set',
      '|| reacts to command failure, and Test-Path succeeded by returning False',
      'Test-Path raised an error that the chain swallowed',
    ],
    correct: 2,
    explanation:
      'Pipeline chain operators test whether the previous command succeeded ($?), not which value it returned. Test-Path completes successfully and prints False, so || never fires. To act on a False result use if (-not (Test-Path ...)). The operator runs on failure rather than on True, Write-Warning needs no -Verbose, and no error occurred.',
    lesson: '5-2',
  },
  {
    chapter: 5,
    type: 'command-completion',
    question:
      'Complete the line that works in both Windows PowerShell 5.1 and 7 and prints worked only if the native command succeeded.',
    code: "cmd /c exit 0; if (____) { 'worked' } else { 'failed' }",
    options: ['$?', '$_', '$Error', '$PSItem'],
    correct: 0,
    explanation:
      '$? holds True when the previous command succeeded (a native command succeeds when its exit code is 0), and it exists in every version. $_ and $PSItem only have a value inside pipeline blocks such as ForEach-Object, and $Error is a list of past errors rather than a success flag.',
    lesson: '5-2',
  },

  // ==========================================================================
  // CHAPTER 6: VARIABLES, TYPES, QUOTES AND OUTPUT
  // ==========================================================================
  {
    chapter: 6,
    type: 'output-interpretation',
    question: 'What does the last line print?',
    code: `$a = 1, 2
$b = $a
$a += 3
"$($a.Count) $($b.Count)"`,
    options: ['3 3', '3 2', '2 2', '2 3'],
    correct: 1,
    explanation:
      'Arrays have a fixed size, so += builds a brand new array and points $a at it. $b still points at the original two-item array, which gives 3 and 2. 3 3 would need the array to grow in place, and the other answers swap or lose the new item.',
    lesson: '6-1',
  },
  {
    chapter: 6,
    type: 'output-interpretation',
    question: 'What do these two lines print?',
    code: `"50" + 50
50 + "50"`,
    options: ['100 and 100', '5050 and 5050', '100 and 5050', '5050 and 100'],
    correct: 3,
    explanation:
      'The left operand decides the type. A string on the left makes + join text (5050), while a number on the left converts the other side to a number and adds (100). The answer therefore depends on order, which is why input should be cast with [int] before doing math.',
    lesson: '6-1',
  },
  {
    chapter: 6,
    type: 'scenario',
    question:
      'Your script uses Write-Host to log progress and then pipes to Out-File log.txt, but the file is empty. What is the best explanation and fix?',
    options: [
      'Write-Host output can never be captured, so drop the logging',
      'Out-File only writes when -Append is present',
      'Write-Host uses the Information stream, so use Write-Output for data',
      'Write-Host works only in 5.1 and fails silently in 7',
    ],
    correct: 2,
    explanation:
      'Since PowerShell 5.0, Write-Host writes to the Information stream (6) rather than the Success stream that a pipe carries, so Out-File receives nothing. Use Write-Output for data, or capture the stream with 6> or *>. Write-Host is not impossible to capture, -Append only controls overwriting, and the cmdlet works in both editions.',
    lesson: '6-2',
  },
  {
    chapter: 6,
    type: 'command-completion',
    question: 'Complete the string so it prints the PID of the current process.',
    code: `$p = Get-Process -Id $PID
"PID is ____"`,
    options: ['$($p.Id)', '$p.Id', '$(p.Id)', '${p.Id}'],
    correct: 0,
    explanation:
      'Inside double quotes only a simple variable name expands, so a property access needs the subexpression operator $( ). $p.Id would print the object text followed by .Id, $(p.Id) tries to run a command called p.Id, and ${p.Id} looks for a variable literally named p.Id.',
    lesson: '6-2',
  },
  {
    chapter: 6,
    type: 'multiple-choice',
    question: 'What does Read-Host -AsSecureString return?',
    options: [
      'Plain text that is only hidden while you type',
      'A SecureString object that will not display as readable text',
      'A strongly encrypted string that is safe to paste into a script',
      'A salted hash that cannot be turned back into the password',
    ],
    correct: 1,
    explanation:
      'It returns a System.Security.SecureString, which is protected in memory and prints as the type name rather than the text. It is not plain text, but it is also not a durable secret: the protected form is tied to the user and machine, and Microsoft discourages new designs built on it. A hash is one-way, so it could not be used to sign in, and neither form belongs in a script file.',
    lesson: '6-2',
  },

  // ==========================================================================
  // CHAPTER 7: FILTER LEFT, SELECT, SORT AND SAFETY
  // ==========================================================================
  {
    chapter: 7,
    type: 'output-interpretation',
    question: 'No processes were listed and a strange file appeared. What happened?',
    code: `PS C:\\Lab> Get-Process | Where-Object { $_.WorkingSet > 100MB }
PS C:\\Lab>
# Get-ChildItem now shows a new file called 100MB`,
    options: [
      '> redirects output, so values were written to a file named 100MB',
      'The 100MB suffix is not valid, so Where-Object ignored the test',
      'Where-Object cannot compare numbers, so it created a log',
      'WorkingSet returned nothing, so an empty file was made',
    ],
    correct: 0,
    explanation:
      'Inside a condition, > is the stream redirection operator and not "greater than". The script block wrote its values to a file named 100MB and passed nothing down the pipeline. PowerShell comparison operators are -gt, -lt, -ge and so on. The 100MB suffix is valid, Where-Object compares numbers happily, and WorkingSet has a value.',
    lesson: '7-1',
  },
  {
    chapter: 7,
    type: 'scenario',
    question:
      'A report over 50,000 AD users is slow because it pulls every user and then filters on Department. Which rewrite applies Filter Left?',
    options: [
      "Get-ADUser -Filter * -Properties Department | Where-Object Department -eq 'Finance'",
      'Get-ADUser -Filter * -Properties Department | Select-Object -First 150',
      "Get-ADUser -Filter * | ForEach-Object { if ($_.Department -eq 'Finance') { $_ } }",
      "Get-ADUser -Filter \"Department -eq 'Finance'\" -Properties Department",
    ],
    correct: 3,
    explanation:
      'Putting the condition into -Filter makes the domain controller do the narrowing, so only matching objects cross the network. The other three still download every user first: Where-Object and ForEach-Object filter on your workstation, and Select-Object -First 150 keeps whichever 150 users arrive first, which are not the Finance users.',
    lesson: '7-1',
  },
  {
    chapter: 7,
    type: 'command-completion',
    question: 'Complete the Get-WinEvent call so the Event Log service does the filtering.',
    code: "Get-WinEvent -____ @{ LogName = 'Application'; Id = 1000 }",
    options: ['Filter', 'FilterHashtable', 'Where', 'Query'],
    correct: 1,
    explanation:
      'Get-WinEvent offers -FilterHashtable, -FilterXPath and -FilterXml, and the hashtable form is the friendliest. It has no -Filter, -Where or -Query parameter, so those would fail with a parameter error.',
    lesson: '7-1',
  },
  {
    chapter: 7,
    type: 'output-interpretation',
    question: 'The author wanted the three biggest processes by memory. What does this return?',
    code: 'Get-Process | Select-Object -First 3 Name, WorkingSet64 | Sort-Object WorkingSet64 -Descending',
    options: [
      'The three biggest processes, because sorting still runs on every process',
      'Nothing, because Select-Object -First must be the last stage',
      'The first three processes in default order, sorted among themselves',
      'An error, because Sort-Object cannot read a Selected object',
    ],
    correct: 2,
    explanation:
      'Select-Object -First 3 cuts the list to whatever arrived first, and only then does Sort-Object sort those three. Sort first, then slice. The sort never sees the other processes, Select-Object -First works fine in the middle of a pipeline, and Sort-Object can sort any object that has the property.',
    lesson: '7-2',
  },
  {
    chapter: 7,
    type: 'multiple-choice',
    question: 'How can you check whether a cmdlet really supports -WhatIf before you rely on it?',
    options: [
      'Assume it does, because any cmdlet that changes something supports it',
      'Run it once with -Confirm and see whether it asks',
      'Only cmdlets with the verb Remove or Stop support it',
      'Look for [-WhatIf] in its Get-Help syntax or its parameters',
    ],
    correct: 3,
    explanation:
      'Only cmdlets that implement ShouldProcess expose -WhatIf, and the syntax block or (Get-Command Name).Parameters shows it. Many cmdlets that change things do not support it, the verb does not decide, and -Confirm would let the action run if you answered Yes.',
    lesson: '7-2',
  },

  // ==========================================================================
  // CHAPTER 8: PROVIDERS, FILES AND SEARCHING
  // ==========================================================================
  {
    chapter: 8,
    type: 'command-completion',
    question: 'Complete the command that reads the startup entries stored as values in the HKLM Run key.',
    code: 'Get-____ HKLM:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Run',
    options: ['Content', 'ChildItem', 'ItemProperty', 'Member'],
    correct: 2,
    explanation:
      'In the Registry provider keys are the folders and the settings inside them are values, which PowerShell exposes as item properties, so Get-ItemProperty reads them. Get-ChildItem lists only subkeys, Get-Content has no file-style content to read here, and Get-Member inspects objects rather than registry paths.',
    lesson: '8-1',
  },
  {
    chapter: 8,
    type: 'scenario',
    question:
      "You run $env:MY_SETTING = 'abc', sign out, sign back in and the variable is empty. Why?",
    options: [
      'The Env: drive changes only the current process, so the value vanished with the window',
      'Windows wipes all environment variables at sign-out',
      'Variables set in PowerShell are saved only after Windows restarts',
      'The Env: drive is read-only and silently ignored the assignment',
    ],
    correct: 0,
    explanation:
      'Assigning through $env: edits the environment block of the running process (and its child processes), so nothing is stored for the next session. Permanent values live in the registry or are set with the .NET SetEnvironmentVariable method using a User or Machine target. Windows does not wipe persistent variables at sign-out, a restart is not what saves them, and Env: is writable.',
    lesson: '8-1',
  },
  {
    chapter: 8,
    type: 'output-interpretation',
    question: 'What happens when this runs in Windows PowerShell 5.1?',
    code: `$names = 'a.log', 'b.log', 'c.log'
New-Item -Path C:\\Lab -Name $names -ItemType File`,
    options: [
      'Three files are created in one call',
      'It fails: -Name takes one string and cannot bind an array',
      'One file named a.log b.log c.log is created',
      'It prompts for each of the three names',
    ],
    correct: 1,
    explanation:
      'In Windows PowerShell 5.1, -Name is a single String, so an array raises a binding error (Cannot convert System.Object[] to the type System.String). To create several files, send the names through ForEach-Object so New-Item runs once per name. PowerShell does not join the array into one file name, and it does not prompt for the other names.',
    lesson: '8-2',
  },
  {
    chapter: 8,
    type: 'multiple-choice',
    question:
      'Why is Get-ChildItem C:\\Windows -Recurse -Filter *.dll faster than the same listing piped to Where-Object Name -like "*.dll"?',
    options: [
      '-Filter runs on several CPU cores at once',
      'Where-Object rereads each file from disk',
      '-Filter caches the folder listing between runs',
      'The provider skips non-matching items, so fewer objects are created',
    ],
    correct: 3,
    explanation:
      '-Filter is applied by the file system provider while it reads the folder, so unmatched items never become objects. Where-Object runs afterwards on every item that was created. -Filter is not parallel, Where-Object does not touch the disk (it inspects objects already in memory), and nothing is cached between runs.',
    lesson: '8-2',
  },

  // ==========================================================================
  // CHAPTER 9: SERVER CORE AND ADMIN WORKOUTS
  // ==========================================================================
  {
    chapter: 9,
    type: 'scenario',
    question:
      'You run New-NetIPAddress on a new Hyper-V VM and it fails, or the adapter ends up with two addresses. Which step was missing first?',
    options: [
      'Enable-PSRemoting -Force',
      'Rename-Computer -NewName SRV-CORE01',
      'Set-NetIPInterface -Dhcp Disabled',
      'Restart-NetAdapter -Name Ethernet',
    ],
    correct: 2,
    explanation:
      'Virtual adapters start with DHCP enabled, so the static address collides with the leased one or is rejected until DHCP is disabled on that interface. Enabling remoting and renaming the computer have nothing to do with addressing, and restarting the adapter would just renew the DHCP lease.',
    lesson: '9-1',
  },
  {
    chapter: 9,
    type: 'command-completion',
    question: 'Complete the command that finds the interface number the other network cmdlets need.',
    code: "Get-NetAdapter | Where-Object Status -eq 'Up' | Select-Object Name, ____",
    options: ['ifIndex', 'IPAddress', 'PrefixLength', 'ServerAddresses'],
    correct: 0,
    explanation:
      'Get-NetAdapter objects carry ifIndex, the number you pass to -InterfaceIndex. IPAddress and PrefixLength belong to Get-NetIPAddress and ServerAddresses belongs to Get-DnsClientServerAddress, so those columns would be blank. If the VM has several adapters, choose by Name rather than taking the first.',
    lesson: '9-1',
  },
  {
    chapter: 9,
    type: 'output-interpretation',
    question: 'Why does the file name show month 10 instead of 11?',
    code: `# Today is 4 November 2026 and the time is 05:10
PS C:\\> Get-Date -Format 'dd-mm-yyyy'
04-10-2026`,
    options: [
      'The system clock is set to the wrong month',
      'The yyyy part shifted the other parts by one',
      'Regional settings reorder day and month',
      'Lowercase mm means minutes, and the month needs uppercase MM',
    ],
    correct: 3,
    explanation:
      'In .NET format strings case matters: mm is minutes (10 here) and MM is the month. The clock is fine, and the result still looks like a valid date, which is why the bug survives reviews. yyyy does not affect other parts, and regional settings change only standard formats, not letters you spell out.',
    lesson: '9-2',
  },
  {
    chapter: 9,
    type: 'multiple-choice',
    question: 'Which pipeline really saves an HTML report of the disk volumes to a file?',
    options: [
      'Get-Volume | ConvertTo-Html -Path report.html',
      'Get-Volume | ConvertTo-Html | Out-File report.html',
      'Get-Volume | Format-Table | Out-File report.html',
      'Get-Volume | Export-Html report.html',
    ],
    correct: 1,
    explanation:
      'ConvertTo-Html only builds HTML text and sends it down the pipeline, so Out-File (or Set-Content) must write it. ConvertTo-Html has no -Path parameter, Format-Table followed by Out-File saves plain text rather than HTML, and there is no Export-Html cmdlet.',
    lesson: '9-2',
  },

  // ==========================================================================
  // CHAPTER 10: SCRIPTS AND CONTROL FLOW
  // ==========================================================================
  {
    chapter: 10,
    type: 'output-interpretation',
    question: 'What is the right next step?',
    code: `PS C:\\Scripts> hello.ps1
hello.ps1 : The term 'hello.ps1' is not recognized as the name of a cmdlet, function, script file, or operable program.
Suggestion [3,General]: The command hello.ps1 was not found, but does exist in the current location. PowerShell does not load commands from the current location by default. If you trust this command, instead type: ".\\hello.ps1".`,
    options: [
      'Run Set-ExecutionPolicy Bypass for the machine',
      'Type .\\hello.ps1 to say you mean the file in this folder',
      'Reopen PowerShell as administrator and run hello.ps1 again',
      'Rename the file to hello.cmd so it is found',
    ],
    correct: 1,
    explanation:
      'PowerShell does not search the current folder for commands, which stops a planted file from hijacking a normal command name, so you prefix the path with .\\. Execution policy is a separate gate that matters only after the file is found, elevation does not change command lookup, and renaming it to .cmd would hand a PowerShell script to a different shell.',
    lesson: '10-1',
  },
  {
    chapter: 10,
    type: 'scenario',
    question:
      'A manager asks you to set the execution policy to Restricted so staff cannot run malicious scripts. What is the right response?',
    options: [
      'Agree: Restricted blocks every script and every PowerShell command',
      'Agree, but add AllSigned too because Restricted can be bypassed',
      'Refuse: execution policy applies only to the Administrator account',
      'Explain that it prevents accidents, not attacks, and plan AppLocker or WDAC instead',
    ],
    correct: 3,
    explanation:
      'Execution policy is a safety guard against double-clicking the wrong script, not a security boundary: anyone who can start PowerShell can pass -ExecutionPolicy Bypass for that process or paste commands directly. Application control such as AppLocker or WDAC is what limits what may run. Restricted does not block interactive commands, AllSigned can be bypassed the same way, and the policy is not limited to administrators.',
    lesson: '10-1',
  },
  {
    chapter: 10,
    type: 'output-interpretation',
    question: 'How many lines does this print, and what is wrong?',
    code: `$servers = 'DC01', 'SRV-CORE01', 'CLIENT01'
for ($i = 0; $i -le $servers.Count; $i++) {
    Write-Output "Checking $($servers[$i])"
}`,
    options: [
      'Four lines: -le runs one extra pass, so the last name is empty',
      'Three lines: -le and -lt behave the same here',
      'Three lines, then an error for index 3',
      'An infinite loop, because $i never reaches the count',
    ],
    correct: 0,
    explanation:
      'Indexes run from 0 to Count minus 1, so -le lets $i reach 3, one past the last item. Outside strict mode that read returns $null and the body prints "Checking " with no name. Use -lt $servers.Count instead. -le and -lt differ by exactly that extra pass, no error is raised for an out-of-range read without strict mode, and $i keeps increasing so the loop does end.',
    lesson: '10-2',
  },
  {
    chapter: 10,
    type: 'multiple-choice',
    question:
      'You must wait an unknown time until the Spooler service reports Running, then continue. Which loop fits best?',
    options: [
      'foreach over a list of names',
      'for with a fixed counter',
      'do ... until the status is Running',
      'switch on the service name',
    ],
    correct: 2,
    explanation:
      'A do...until (or while) loop repeats until a condition is met, which suits an unknown wait, and it should include a timeout counter so it cannot spin forever. foreach walks a known collection, for suits a known number of passes, and switch chooses between branches instead of repeating.',
    lesson: '10-2',
  },

  // ==========================================================================
  // CHAPTER 11: MODULES AND REMOTING
  // ==========================================================================
  {
    chapter: 11,
    type: 'output-interpretation',
    question: 'The install succeeded but Get-Module prints nothing. Why?',
    code: `PS C:\\> Install-Module -Name Posh-Git -Scope CurrentUser
PS C:\\> Get-Module -Name Posh-Git
PS C:\\>`,
    options: [
      'The install failed silently and must be repeated as administrator',
      'Posh-Git can only be loaded by PowerShell 7',
      'CurrentUser installs are hidden from Get-Module',
      'Get-Module lists loaded modules only, so add -ListAvailable to see installed ones',
    ],
    correct: 3,
    explanation:
      'Install-Module copies files to disk, while Get-Module without switches reports the modules loaded in the current session. Get-Module -ListAvailable searches the module folders. A failed install would have shown an error, the edition does not affect a listing, and CurrentUser modules are not hidden.',
    lesson: '11-1',
  },
  {
    chapter: 11,
    type: 'command-completion',
    question: 'Complete the install command so that no administrator rights are needed.',
    code: 'Install-Module -Name Posh-Git -Scope ____',
    options: ['Local', 'CurrentUser', 'User', 'Session'],
    correct: 1,
    explanation:
      'The valid scopes are CurrentUser and AllUsers. CurrentUser writes under your profile and needs no elevation, while AllUsers writes to Program Files. Local, User and Session are not accepted values for -Scope.',
    lesson: '11-1',
  },
  {
    chapter: 11,
    type: 'scenario',
    question:
      'In the lab domain, Invoke-Command -ComputerName 192.168.56.20 fails with a WinRM error that mentions TrustedHosts. Which fix is best?',
    options: [
      "Set TrustedHosts to '*' on CLIENT01",
      'Switch the connection to Basic authentication',
      'Use the computer name SRV-CORE01 so Kerberos can authenticate',
      'Turn off the firewall on SRV-CORE01',
    ],
    correct: 2,
    explanation:
      'Kerberos needs a host name to build a service ticket, so connecting by name lets domain authentication work without relaxing anything. Connecting by IP address forces a weaker fallback that requires TrustedHosts or HTTPS. A wildcard TrustedHosts entry and Basic authentication both weaken security, and the firewall is not the cause of an authentication error.',
    lesson: '11-2',
  },
  {
    chapter: 11,
    type: 'output-interpretation',
    question: 'Both servers have only 5 GB free. What does this print?',
    code: `$threshold = 20
Invoke-Command -ComputerName SRV-CORE01, DC01 -ScriptBlock {
    (Get-PSDrive C).Free / 1GB -lt $threshold
}`,
    options: [
      'False for both, because $threshold is empty on the remote side',
      'True for both, because 5 is less than 20',
      'An error that $threshold is not defined',
      'True for the first server and False for the second',
    ],
    correct: 0,
    explanation:
      'The script block runs in another process on another computer, so your local $threshold does not exist there. Outside strict mode it is $null, and 5 -lt $null is False, which silently gives the wrong answer. Pass the value with $using:threshold or -ArgumentList. It does not print True, no undefined-variable error appears without strict mode, and both servers behave the same way.',
    lesson: '11-2',
  },

  // ==========================================================================
  // CHAPTER 12: ACTIVE DIRECTORY
  // ==========================================================================
  {
    chapter: 12,
    type: 'output-interpretation',
    question: 'Does this prove the user has no department?',
    code: `PS C:\\> Get-ADUser -Identity ihaider | Select-Object Name, Department

Name         Department
----         ----------
Izaz Haider`,
    options: [
      'Yes: an empty column means the attribute is empty',
      'No: Department is not a default property, so request it with -Properties',
      'Yes: only users with a manager have a department',
      'No: the Department column needs Format-List to appear',
    ],
    correct: 1,
    explanation:
      'Get-ADUser returns only a small default set of properties to keep the network light, and Department comes back only when you name it, for example -Properties Department. Without that the column is simply blank. The blank does not reflect the directory, departments do not depend on a manager, and Format-List would not add a property that was never fetched.',
    lesson: '12-1',
  },
  {
    chapter: 12,
    type: 'scenario',
    question:
      'A VM was restored from an old snapshot and now says the trust relationship with the domain failed. You can sign in as a local administrator. What do you try first?',
    options: [
      'Unjoin the computer, restart, rejoin and restart again',
      'Reset the Administrator password in the domain',
      'Reinstall the RSAT tools on the client',
      'Test-ComputerSecureChannel -Repair -Credential (Get-Credential)',
    ],
    correct: 3,
    explanation:
      'The snapshot rewound the computer\'s machine account password, so it no longer matches the domain controller. Test-ComputerSecureChannel -Repair with a domain account allowed to reset the computer account re-syncs it online. Unjoining and rejoining also works but is slower and unnecessary, a domain password reset does not touch the machine password, and RSAT has nothing to do with the secure channel.',
    lesson: '12-1',
  },
  {
    chapter: 12,
    type: 'command-completion',
    question: 'Complete the query a client effectively makes to find domain controllers.',
    code: 'Resolve-DnsName -Name _ldap._tcp.dc._msdcs.corp.example.com -Type ____',
    options: ['A', 'PTR', 'SRV', 'MX'],
    correct: 2,
    explanation:
      'SRV records map a service name to host names and ports, which is how a client discovers which servers offer LDAP for the domain. An A record maps one known name to an address, PTR maps an address back to a name, and MX is for mail routing.',
    lesson: '12-2',
  },
  {
    chapter: 12,
    type: 'multiple-choice',
    question:
      'Sam is in GRP_A (PSO precedence 5) and GRP_B (PSO precedence 20), and neither PSO is linked to Sam directly. Which policy applies?',
    options: [
      'The precedence 5 PSO, because the lowest number wins',
      'The precedence 20 PSO, because the highest number wins',
      'Both, using the strictest value of each setting',
      'The Default Domain Policy, because PSOs only apply to OUs',
    ],
    correct: 0,
    explanation:
      'Active Directory picks the PSO with the lowest precedence number among those that reach the user through groups (a PSO linked directly to the user would beat both). PSOs are not merged, they can never be applied to an OU (only to users and global security groups), and the Default Domain Policy is used only when no PSO applies.',
    lesson: '12-2',
  },

  // ==========================================================================
  // CHAPTER 13: FIREWALL, GPO AND SCHEDULED TASKS
  // ==========================================================================
  {
    chapter: 13,
    type: 'scenario',
    question:
      'You created an inbound allow rule scoped to the Domain profile. It shows Enabled True but connections still fail, and Get-NetConnectionProfile reports Public. What is going on?',
    options: [
      'Allow rules are ignored until the firewall service is restarted',
      'The rule applies only to Domain networks, so it is inactive on this Public connection',
      'Enabled True means the rule exists but is not yet allowed',
      'Public networks accept rules only from Group Policy',
    ],
    correct: 1,
    explanation:
      'A rule is evaluated only when the connection profile is in its Profile list, so an enabled Domain-only rule does nothing on a Public network. Fix the classification (for example so Network Location Awareness detects the domain) or scope the rule to the right profile, and do not switch the firewall off. Rules apply without a restart, Enabled does mean active when the profile matches, and Public networks accept locally created rules.',
    lesson: '13-1',
  },
  {
    chapter: 13,
    type: 'command-completion',
    question: 'Complete the command that enables the built-in bundle of WinRM rules.',
    code: "Enable-NetFirewallRule -____ 'Windows Remote Management'",
    options: ['DisplayGroup', 'DisplayName', 'Profile', 'Direction'],
    correct: 0,
    explanation:
      'DisplayGroup selects every rule in that named bundle (so a group can open more than one port), whereas DisplayName selects a single rule by its own name. Profile and Direction filter rules rather than select them by name. Group display names are localised, so on a non-English system use the language-neutral -Group value instead.',
    lesson: '13-1',
  },
  {
    chapter: 13,
    type: 'scenario',
    question:
      'The Domain GPO sets lockout to 10 minutes and a GPO on OU=Servers sets 5 minutes. SRV-CORE01 is in that OU. Which value does it get, and what changes if the Domain link is Enforced?',
    options: [
      '10 minutes, and Enforced changes nothing',
      '5 minutes, and Enforced changes nothing',
      '10 minutes, and Enforced makes it 5',
      '5 minutes, and Enforced makes it 10',
    ],
    correct: 3,
    explanation:
      'Policies apply in the order Local, Site, Domain, then OUs, and the last one applied wins a conflict, so the OU value (5) normally beats the domain. An Enforced link reverses that for the conflicting setting, so the domain value (10) wins. The other options either ignore the order or swap the two cases.',
    lesson: '13-2',
  },
  {
    chapter: 13,
    type: 'output-interpretation',
    question: 'Why has the policy not been applied yet?',
    code: `PS C:\\> Invoke-GPUpdate -Computer SRV-CORE01 -Force
PS C:\\>   # returns at once, but the setting is still old three minutes later`,
    options: [
      '-Force only works on the local computer',
      'The remote refresh is queued until the next logon',
      'The refresh is delayed by a default random wait of up to 10 minutes',
      'Invoke-GPUpdate only schedules a check for next midnight',
    ],
    correct: 2,
    explanation:
      'For a remote computer Invoke-GPUpdate schedules the refresh with a default RandomDelayInMinutes of 10, so many machines do not hit the domain controller together. Add -RandomDelayInMinutes 0 for an immediate run. -Force does work remotely, the refresh is not tied to logon, and it is not scheduled for midnight. Remote refresh also needs the Remote Scheduled Tasks and WMI firewall rules.',
    lesson: '13-2',
  },

  // ==========================================================================
  // CHAPTER 14: ERROR HANDLING AND TOOLMAKING
  // ==========================================================================
  {
    chapter: 14,
    type: 'output-interpretation',
    question: 'The console shows red error text but never prints Caught. Why?',
    code: "try { Get-Item C:\\NoSuchFile.txt } catch { 'Caught' }",
    options: [
      'catch only handles errors raised by .NET code',
      'The error is non-terminating, so catch is skipped unless you add -ErrorAction Stop',
      'try needs a finally block before catch can run',
      'Get-Item swallows errors that happen inside a try block',
    ],
    correct: 1,
    explanation:
      'Most cmdlet failures are non-terminating: they print red text and the script carries on. catch runs only for terminating errors, which -ErrorAction Stop creates for that one command. catch handles cmdlet errors once they terminate, finally is optional, and Get-Item does not swallow anything.',
    lesson: '14-1',
  },
  {
    chapter: 14,
    type: 'command-completion',
    question: 'Complete the call so each hashtable key becomes a parameter.',
    code: `$opts = @{ Name = 'explorer'; ErrorAction = 'SilentlyContinue' }
Get-Process ____opts`,
    options: ['@', '$', '%', '&'],
    correct: 0,
    explanation:
      'The splatting operator @ unpacks the hashtable so each key is a parameter name and each value its argument. $opts would pass the whole hashtable as one value to the first positional parameter, while % and & mean other things (the ForEach-Object alias and the call operator).',
    lesson: '14-1',
  },
  {
    chapter: 14,
    type: 'output-interpretation',
    question: 'What happens to C:\\Lab\\old.txt?',
    code: `function Remove-LabFile {
    [CmdletBinding(SupportsShouldProcess)]
    param([string]$Path)
    [System.IO.File]::Delete($Path)
}
Remove-LabFile -Path C:\\Lab\\old.txt -WhatIf`,
    options: [
      'It is kept and a What if message is printed automatically',
      'It is kept, because -WhatIf stops every method call',
      'It is deleted, because a .NET call does not honour -WhatIf',
      'PowerShell asks for confirmation before the delete',
    ],
    correct: 2,
    explanation:
      'SupportsShouldProcess only exposes -WhatIf. Protection comes from cmdlets that honour it or from your own check, and a .NET method such as File.Delete ignores the preference, so the file is deleted. Wrap the call in if ($PSCmdlet.ShouldProcess($Path, "Delete")) { ... }. Nothing prints automatically, -WhatIf does not intercept methods, and no confirmation appears at the default impact level.',
    lesson: '14-2',
  },
  {
    chapter: 14,
    type: 'output-interpretation',
    question: 'What is printed, in order?',
    code: `function Test-Flow {
    [CmdletBinding()]
    param([Parameter(ValueFromPipeline)]$Item)
    begin   { 'B' }
    process { "P$Item" }
    end     { 'E' }
}
1, 2, 3 | Test-Flow`,
    options: [
      'B P1 E B P2 E B P3 E',
      'P1 P2 P3',
      'B P E',
      'B P1 P2 P3 E',
    ],
    correct: 3,
    explanation:
      'begin runs once before the first item, process runs once for each piped item, and end runs once after the last. Repeating begin and end for every item would mean three separate function calls, dropping begin and end would ignore those blocks, and printing P without the number would skip the piped value.',
    lesson: '14-2',
  },

  // ==========================================================================
  // CHAPTER 15: OFFENSIVE TECHNIQUES FROM THE DEFENDER'S SIDE
  // ==========================================================================
  {
    chapter: 15,
    type: 'scenario',
    question:
      'Your audit finds several service accounts with SPNs and human-chosen passwords. What is the best structural fix?',
    options: [
      'Move them to group Managed Service Accounts with long random passwords',
      'Block LDAP queries for all standard users',
      'Rename the accounts so attackers cannot guess them',
      'Turn off event 4769 logging to reduce noise',
    ],
    correct: 0,
    explanation:
      'Any authenticated user can request a service ticket for an SPN account and guess its password offline, so removing the human-chosen password fixes the root cause, and gMSAs generate and rotate very long random secrets. Blocking LDAP for users would break the domain, account names are not secrets, and disabling 4769 would only blind your detection.',
    lesson: '15-1',
  },
  {
    chapter: 15,
    type: 'output-interpretation',
    question: 'What does this print, and is the decoded command executed?',
    code: "PS C:\\> [Text.Encoding]::Unicode.GetString([Convert]::FromBase64String('RwBlAHQALQBEAGEAdABlAA=='))",
    options: [
      'The current date, because Get-Date runs while decoding',
      'RwBlAHQALQBEAGEAdABlAA==, because Base64 cannot be reversed',
      'Garbled text, because Base64 is encryption',
      'Get-Date as text, and nothing is executed',
    ],
    correct: 3,
    explanation:
      'Base64 is a reversible encoding with no key, and -EncodedCommand text is UTF-16LE, so Unicode.GetString returns the plain string Get-Date. Decoding only converts bytes to text. Nothing runs unless someone pipes it to Invoke-Expression, which an analyst must never do with untrusted text. It is not encryption, so it is neither garbled nor irreversible.',
    lesson: '15-2',
  },
  {
    chapter: 15,
    type: 'multiple-choice',
    question:
      'At what point does AMSI inspect a script hidden with Base64 and split strings, and how far can you trust it?',
    options: [
      'Before decoding, by scanning the Base64 blob, so it is a complete defence',
      'After the engine decodes it, on plain text, as one layer rather than a guarantee',
      'Only after it runs, by watching network traffic',
      'Only when the script is saved to disk',
    ],
    correct: 1,
    explanation:
      'PowerShell must produce the plain text to run it, and at that moment it submits the buffer to the registered antimalware engine, so simple obfuscation does not help an attacker. AMSI still depends on the engine and its signatures and can be bypassed, so keep logging, EDR and application control as well. It does not scan blobs before decoding, it is not network based, and it is not limited to files on disk.',
    lesson: '15-2',
  },
  {
    chapter: 15,
    type: 'multiple-choice',
    question:
      'A service runs as LocalSystem with the path C:\\Program Files\\Lab App\\svc.exe, unquoted. What is the cheapest fix that removes the ambiguity?',
    options: [
      'Move the service to a different drive letter',
      'Rename svc.exe to a longer name',
      'Wrap the path in quotes in the service configuration',
      'Turn on Secure Boot for the server',
    ],
    correct: 2,
    explanation:
      'Without quotes Windows tries C:\\Program.exe and then C:\\Program Files\\Lab.exe before the real file, so a writable folder could plant a binary that runs as SYSTEM, and quoting removes the ambiguity completely. Changing the drive or the file name does not change the spaces, and Secure Boot protects the boot chain rather than service paths.',
    lesson: '15-1',
  },

  // ==========================================================================
  // CHAPTER 16: AUDITING, LOGGING AND HARDENING
  // ==========================================================================
  {
    chapter: 16,
    type: 'command-completion',
    question: 'Complete the hunt query for script block logging events.',
    code: "Get-WinEvent -FilterHashtable @{ LogName = '____'; Id = 4104 }",
    options: [
      'Microsoft-Windows-PowerShell/Operational',
      'Microsoft-Windows-WinRM/Operational',
      'Microsoft-Windows-PowerShell/Admin',
      'Windows PowerShell',
    ],
    correct: 0,
    explanation:
      'Event 4104 (script block text) is written to Microsoft-Windows-PowerShell/Operational. The Admin log holds a few engine-level messages, the WinRM log records remoting activity, and the classic Windows PowerShell log holds engine lifecycle events such as 400 and 403, not script text. The Security log holds 4688 and 4769, not 4104.',
    lesson: '16-1',
  },
  {
    chapter: 16,
    type: 'scenario',
    question:
      'You see 4688 process creation events in the Security log, but the command line field is empty. What is missing?',
    options: [
      'Script Block Logging, which fills in the command line',
      'A larger Security log size',
      'PowerShell 7, which records command lines',
      'The include-command-line policy, on top of the process creation audit policy',
    ],
    correct: 3,
    explanation:
      '4688 records command lines only when the Process Creation audit subcategory is enabled and the "Include command line in process creation events" administrative template setting is on. Script Block Logging writes 4104 to a different log, log size affects retention rather than content, and the PowerShell edition has no effect on Windows process auditing.',
    lesson: '16-1',
  },
  {
    chapter: 16,
    type: 'output-interpretation',
    question:
      'The goal is a role that may restart only Spooler and Dns. What is wrong with this role capability?',
    code: "New-PSRoleCapabilityFile -Path .\\DnsOps.psrc -VisibleCmdlets 'Get-Service', 'Restart-Service'",
    options: [
      'Nothing: JEA limits Restart-Service to the services listed elsewhere',
      'It exposes Restart-Service for every service, so add a parameter ValidateSet',
      'VisibleCmdlets cannot contain more than one cmdlet',
      'Restart-Service cannot be used in a JEA role at all',
    ],
    correct: 1,
    explanation:
      'Listing a cmdlet by name exposes all of its parameter values, so this role can restart any service, including security tools. Constrain it with a hashtable entry whose Parameters value uses ValidateSet for Spooler and Dns. JEA has no hidden service list, VisibleCmdlets accepts many entries, and Restart-Service is a typical JEA command.',
    lesson: '16-2',
  },
  {
    chapter: 16,
    type: 'scenario',
    question:
      'An attacker with a shell runs powershell.exe -Version 2 to avoid AMSI and Script Block Logging. Which hardening step closes that route?',
    options: [
      'Set the execution policy to AllSigned',
      'Turn on Constrained Language Mode in a single session',
      'Remove the PowerShell 2.0 optional feature where it exists',
      'Run PowerShell only from Windows Terminal',
    ],
    correct: 2,
    explanation:
      'The version 2 engine predates AMSI and Script Block Logging, so a v2 session runs without either, and removing the optional feature closes the downgrade (newer builds may not include it at all). Execution policy is not a boundary, a per-session language mode is not a security control and a user can still start a v2 process, and the host window has no effect on which engine runs.',
    lesson: '16-2',
  },
];

export const QUIZZES: QuizQuestion[] = SEEDS.map((seed, index) => {
  const chapterId = `chapter-${String(seed.chapter).padStart(2, '0')}`;
  const question: QuizQuestion = {
    id: `q-${index + 1}`,
    chapterId,
    type: seed.type,
    question: seed.question,
    options: [...seed.options],
    correctAnswer: seed.options[seed.correct],
    explanation: seed.explanation,
    relatedLessonPath: LESSON_PATHS[seed.lesson],
  };
  if (seed.code) question.codeSnippet = seed.code;
  return question;
});

export const quizzes = QUIZZES;
export const quizQuestions = QUIZZES;
