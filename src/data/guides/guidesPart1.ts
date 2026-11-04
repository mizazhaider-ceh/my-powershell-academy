import { LessonGuide } from '../../types';

export const GUIDES_PART_1: Record<string, LessonGuide> = {
  '1-1': {
    oneSentence:
      'Windows 11 and Windows Server share one engine (the NT kernel), and the account you use every day should be the weakest one that still does the job.',
    analogy:
      'Think of Windows like a big office building. The NT kernel is the building itself (walls, locks, electricity). Windows 11 is the building set up as a comfortable apartment for one person. Windows Server is the same building set up as a busy office for hundreds of people. Same structure, different furniture. And your Administrator account is the master key: you only take it out of your pocket when you really need to open a locked door, then you put it right back.',
    plainEnglish: [
      'Windows 11 (your laptop) and Windows Server (the big computer in a datacenter) are built on the same core engine called the NT kernel. Learn one and you already understand most of the other.',
      'The "Principle of Least Privilege" simply means: use the weakest account that can still do the job. Do your daily work as a normal user. Switch to Administrator only for the few seconds you need it.',
      'This matters because anything you run inherits your power. A virus launched by a normal user is stuck in a small room. A virus launched by an Administrator can wreck the whole building.',
    ],
    beforeYouStart: [
      'A Windows 10, 11 or Server machine (a virtual machine is perfect for practice).',
      'Windows PowerShell 5.1 or PowerShell 7 already installed (press the Start button and type "PowerShell").',
      'No programming experience needed. If you can type a line and press Enter, you are ready.',
    ],
    atoZSteps: [
      {
        title: 'Step 1: Open PowerShell the normal way',
        detail:
          'Click Start, type PowerShell, and press Enter (do NOT right-click and choose Run as administrator). Pick plain "Windows PowerShell", not "ISE". A window opens (usually blue) with a line ending in `>`, such as `PS C:\\Users\\you>`. That line is called the prompt: `PS` means PowerShell, the path is the folder you are in, and `>` means it is waiting for you. You type commands in this window (on a laptop or PC, not in the lesson page), and you do not type the prompt itself. This is your safe, everyday window.',
      },
      {
        title: 'Step 2: Ask "who am I?"',
        detail:
          'Run `whoami`. Windows answers with your computer name and user name. This tells you which identity every command will run as.',
      },
      {
        title: 'Step 3: Look at your computer',
        detail:
          'Run `Get-ComputerInfo` to see the Windows edition and build. You will notice that Client and Server report the same style of version number (10.0.xxxxx), proof they share the NT kernel.',
      },
      {
        title: 'Step 4: Check your power level',
        detail:
          'Run `whoami /groups` and look for the "Mandatory Level" line. Medium means standard (safe). High means elevated Administrator.',
      },
      {
        title: 'Step 5: Open an elevated window on purpose',
        detail:
          'Right-click PowerShell, choose Run as administrator, accept the UAC prompt, and repeat Step 4. You will now see High. Close this window as soon as your admin task is finished.',
      },
      {
        title: 'Step 6: Build the habit',
        detail:
          'Standard window for reading, learning and testing. Elevated window only for changing the system. Say it out loud: "scalpel, not butter knife".',
      },
    ],
    wordsYouWillMeet: [
      { word: 'Kernel', meaning: 'The core of the operating system that talks directly to the hardware.' },
      { word: 'NT', meaning: 'New Technology. The modern Windows engine started in 1993 and still used today.' },
      { word: 'UAC', meaning: 'User Account Control, the pop-up that asks "Do you really want to allow this?"' },
      { word: 'Elevated', meaning: 'A window that is running with full Administrator power.' },
      { word: 'Token', meaning: 'A digital badge Windows gives you at logon that lists what you are allowed to do.' },
    ],
    beginner: {
      intro:
        'These are your first commands. They only read information, so nothing here can break your computer. Type them exactly, press Enter, and read the answer.',
      commands: [
        {
          title: 'Who am I logged in as?',
          code: 'whoami',
          whatItDoes: 'Prints the name of the account running this PowerShell window, in the form COMPUTER\\User.',
          parts: [{ part: 'whoami', meaning: 'A small built-in Windows program (not a cmdlet) that means "who am I".' }],
          sampleOutput: 'workstation\\izaz',
          watchOut: 'If you are inside an elevated window the name is the same. Use the next commands to tell the difference.',
        },
        {
          title: 'See your Windows version',
          code: '[System.Environment]::OSVersion',
          whatItDoes: 'Shows the platform and version number. You will see Win32NT, which is the NT kernel family.',
          parts: [
            { part: '[System.Environment]', meaning: 'A built-in .NET toolbox about the current computer. Square brackets mean "the type".' },
            { part: '::', meaning: 'Means "use a ready-made member that belongs to the type itself".' },
            { part: 'OSVersion', meaning: 'The property that holds the operating system version.' },
          ],
          sampleOutput: 'Platform ServicePack Version      VersionString\n-------- ----------- -------      -------------\n Win32NT             10.0.26100.0 Microsoft Windows NT 10.0.26100.0',
        },
        {
          title: 'Get the full computer summary',
          code: 'Get-ComputerInfo -Property OsName, OsVersion, OsBuildNumber',
          whatItDoes: 'Asks Windows for a few facts about the operating system and shows them as a small table.',
          parts: [
            { part: 'Get-ComputerInfo', meaning: 'The cmdlet (a PowerShell command). "Get" means read, never change.' },
            { part: '-Property', meaning: 'A parameter (option) that says "only show these fields".' },
            { part: 'OsName, OsVersion, OsBuildNumber', meaning: 'The list of fields you want, separated by commas.' },
          ],
          watchOut: 'Running Get-ComputerInfo with no -Property prints dozens of lines and can take a few seconds. That is normal.',
        },
      ],
    },
    intermediate: {
      intro:
        'Now you will use the pipeline (the | symbol) to filter results, and check your privilege level the way real administrators do.',
      commands: [
        {
          title: 'Is my window elevated?',
          code: 'whoami /groups | Select-String "S-1-16"',
          whatItDoes: 'Lists your security groups, then keeps only the line that shows your integrity (power) level.',
          parts: [
            { part: 'whoami /groups', meaning: 'Prints every group your token belongs to. /groups is a switch for the whoami program.' },
            { part: '|', meaning: 'The pipe. It hands the output of the left command to the command on the right.' },
            { part: 'Select-String "S-1-16"', meaning: 'Searches the text for lines containing S-1-16, the prefix Windows uses for integrity levels.' },
          ],
          sampleOutput: 'Mandatory Label\\Medium Mandatory Level   Label   S-1-16-8192',
          watchOut: 'Medium = normal user. High = Administrator. If you expect High and see Medium, you forgot to choose Run as administrator.',
        },
        {
          title: 'Test for Administrator in a script-friendly way',
          code: '$id = [Security.Principal.WindowsIdentity]::GetCurrent()\n$p  = New-Object Security.Principal.WindowsPrincipal($id)\n$p.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)',
          whatItDoes: 'Returns True when the current window is elevated and False when it is not. Scripts use this to refuse to run without the right power.',
          parts: [
            { part: '$id = ...GetCurrent()', meaning: 'Saves your identity (who you are) in a variable named $id.' },
            { part: 'New-Object ...WindowsPrincipal($id)', meaning: 'Wraps that identity in an object that can answer role questions.' },
            { part: '.IsInRole(...)', meaning: 'A method (an action) that asks "are you an Administrator right now?"' },
          ],
          sampleOutput: 'False',
        },
        {
          title: 'Compare OS details from several properties',
          code: 'Get-ComputerInfo | Select-Object WindowsProductName, OsArchitecture, CsProcessors',
          whatItDoes: 'Reads the full info object once, then trims it to just the three columns you care about.',
          parts: [
            { part: 'Get-ComputerInfo', meaning: 'Produces one big object full of facts.' },
            { part: 'Select-Object', meaning: 'Picks only the properties you name.' },
          ],
        },
      ],
    },
    pro: {
      intro:
        'Professional habits: prove your privilege level in code, elevate safely when needed, and make automation fail loudly instead of silently running with too much power.',
      commands: [
        {
          title: 'Force a script to require elevation',
          code: '#Requires -RunAsAdministrator\nWrite-Output "Running with full admin rights"',
          whatItDoes: 'Placed at the top of a .ps1 file, PowerShell refuses to start the script unless the window is elevated.',
          parts: [
            { part: '#Requires', meaning: 'A special comment that PowerShell actually reads before running anything.' },
            { part: '-RunAsAdministrator', meaning: 'The condition that must be true.' },
          ],
          watchOut: 'Only works in scripts (.ps1 files), not when typed directly in the console.',
        },
        {
          title: 'Launch one elevated command without living in an admin window',
          code: 'Start-Process pwsh -Verb RunAs -ArgumentList \'-NoProfile -Command "Get-Service WinRM"\'',
          whatItDoes: 'Opens a new elevated PowerShell for a single job, shows the UAC prompt, then you close it. Your daily window stays standard.',
          parts: [
            { part: 'Start-Process', meaning: 'Starts a new program.' },
            { part: 'pwsh', meaning: 'PowerShell 7. Use powershell for Windows PowerShell 5.1.' },
            { part: '-Verb RunAs', meaning: 'The same as right-click then Run as administrator.' },
            { part: '-ArgumentList', meaning: 'The text passed to the new window. -NoProfile skips your startup script for a clean state.' },
          ],
          watchOut: 'The new window is separate. You cannot read its output back in the original window unless you write it to a file.',
        },
        {
          title: 'Audit which groups give you power',
          code: '[Security.Principal.WindowsIdentity]::GetCurrent().Groups |\n  ForEach-Object { $_.Translate([Security.Principal.NTAccount]).Value } |\n  Sort-Object',
          whatItDoes: 'Converts the raw security IDs (SIDs) in your token into readable group names so you can see why you do or do not have admin rights.',
          parts: [
            { part: '.Groups', meaning: 'The list of group SIDs inside your access token.' },
            { part: 'ForEach-Object { ... }', meaning: 'Runs the code in braces once for each item. $_ means "the current item".' },
            { part: '.Translate([...NTAccount])', meaning: 'Turns a SID like S-1-5-32-544 into a name like BUILTIN\\Administrators.' },
            { part: 'Sort-Object', meaning: 'Alphabetizes the result so it is easy to scan.' },
          ],
        },
      ],
    },
    recap: [
      'Windows Client and Windows Server share the same NT kernel.',
      'Use a standard account every day and elevate only for admin work.',
      'whoami, whoami /groups and Get-ComputerInfo are your first three safe commands.',
      'Pro scripts check for elevation with #Requires -RunAsAdministrator or IsInRole.',
    ],
  },
  '1-2': {
    oneSentence:
      'A process is a program that is actually running, with its own memory, an ID number called the PID, handles to files, and a security badge copied from the user who started it.',
    analogy:
      'A program (.exe) is a recipe book sitting on a shelf. A process is a real kitchen that opens when someone starts cooking: it has its own counters (memory), a ring of keys to the pantry (handles), an ID badge that says what the cook may touch (access token), and one or more cooks (threads). The CPU never "runs a kitchen". It only ever watches individual cooks.',
    plainEnglish: [
      'When you double-click Notepad, Windows reads `notepad.exe` from disk and builds a process: a private box in memory with a number called the PID (Process ID).',
      'Inside that box live threads. A thread is one line of work. The CPU schedules threads, not processes, which is why one busy thread can freeze a window while other apps keep running.',
      'Every process holds handles (numbered tickets for files, registry keys and more) and a security token (a badge copied from the user who started it). Learning to read PIDs, parents, handles and tokens is how you spot a fake process.',
    ],
    beforeYouStart: [
      'A normal (not elevated) PowerShell window is enough for the beginner and intermediate commands.',
      'Optional: download Sysinternals Process Explorer to see the same facts in a graphical tree.',
      'Use a lab VM before trying anything that stops a process.',
    ],
    atoZSteps: [
      {
        title: 'Step 1: Meet your own process',
        detail: 'PowerShell itself is a process. Run `Get-Process -Id $PID`. The special variable `$PID` always holds the PID of the current window.',
      },
      {
        title: 'Step 2: Count the cooks',
        detail: 'Run `(Get-Process -Id $PID).Threads.Count` to see how many threads your window uses. Even an idle program has several.',
      },
      {
        title: 'Step 3: Open an app and find it',
        detail: 'Start Notepad, then run `Get-Process notepad`. Note its Id (PID) and the HandleCount column.',
      },
      {
        title: 'Step 4: Find its parent',
        detail: 'Run `Get-CimInstance Win32_Process -Filter "Name=\'notepad.exe\'"` and read ParentProcessId. That number is the process that launched it (usually explorer.exe).',
      },
      {
        title: 'Step 5: Read your token',
        detail: 'Run `whoami /priv` to see the privileges printed on your security badge. Most are Disabled for a normal user.',
      },
      {
        title: 'Step 6: Close it safely',
        detail: 'Practise with `Get-Process notepad | Stop-Process -WhatIf` first. -WhatIf only describes what would happen, so you build the habit of previewing before killing.',
      },
    ],
    wordsYouWillMeet: [
      { word: 'Process', meaning: 'A running program with its own private memory, handles and security token.' },
      { word: 'PID', meaning: 'Process ID, the unique number Windows gives each running process.' },
      { word: 'Thread', meaning: 'A single path of work inside a process. The CPU schedules threads.' },
      { word: 'Handle', meaning: 'A numbered ticket that lets a process use a file, key or other object.' },
      { word: 'Access token', meaning: 'The badge attached to a process that lists who it runs as and what it may do.' },
      { word: 'Parent process', meaning: 'The process that started another one. Odd parents are a classic malware clue.' },
    ],
    beginner: {
      intro: 'All of these only read information. Use them to get comfortable with what a process looks like in PowerShell.',
      commands: [
        {
          title: 'Look at your own PowerShell process',
          code: 'Get-Process -Id $PID',
          whatItDoes: 'Shows one row of facts (handles, memory, CPU, PID, name) about the PowerShell window you are typing in.',
          parts: [
            { part: 'Get-Process', meaning: 'Cmdlet that lists running processes. "Get" only reads.' },
            { part: '-Id', meaning: 'Parameter that picks a process by its PID number.' },
            { part: '$PID', meaning: 'Automatic variable that holds the PID of the current PowerShell session.' },
          ],
          sampleOutput: 'Handles  NPM(K)    PM(K)      WS(K)     CPU(s)     Id  SI ProcessName\n-------  ------    -----      -----     ------     --  -- -----------\n    712      42   118320     131084       2.31  14872   1 powershell',
        },
        {
          title: 'Count the threads inside it',
          code: '(Get-Process -Id $PID).Threads.Count',
          whatItDoes: 'Returns a single number: how many threads (workers) the process owns right now.',
          parts: [
            { part: '( ... )', meaning: 'Run the command inside first, then use its result.' },
            { part: '.Threads', meaning: 'Property that holds the list of threads in that process.' },
            { part: '.Count', meaning: 'Property that counts items in a list.' },
          ],
          sampleOutput: '38',
          watchOut: 'The number changes from moment to moment. Do not worry if you get a different value each time.',
        },
        {
          title: 'See the privileges on your token',
          code: 'whoami /priv',
          whatItDoes: 'Prints the privileges on your access token and whether each is Enabled or Disabled.',
          parts: [
            { part: 'whoami', meaning: 'Built-in Windows program that reports identity information.' },
            { part: '/priv', meaning: 'Switch that asks for the privilege list instead of just the name.' },
          ],
          sampleOutput: 'PRIVILEGES INFORMATION\n----------------------\nPrivilege Name                Description                          State\nSeShutdownPrivilege           Shut down the system                 Disabled\nSeChangeNotifyPrivilege       Bypass traverse checking             Enabled',
          watchOut: 'Disabled does not mean missing. It means the privilege exists on the token but is switched off until needed.',
        },
      ],
    },
    intermediate: {
      intro: 'Now combine commands with the pipeline to rank, calculate and trace processes like an administrator.',
      commands: [
        {
          title: 'Top 5 memory users in friendly megabytes',
          code: 'Get-Process |\n  Sort-Object WorkingSet64 -Descending |\n  Select-Object -First 5 Name, Id, @{n=\'MemMB\';e={[math]::Round($_.WorkingSet64/1MB)}}',
          whatItDoes: 'Lists every process, puts the hungriest first, keeps five, and adds a new column that turns raw bytes into megabytes.',
          parts: [
            { part: 'Sort-Object WorkingSet64 -Descending', meaning: 'Sorts by RAM in use, biggest first.' },
            { part: 'Select-Object -First 5', meaning: 'Keeps only the first five results.' },
            { part: '@{n=...;e={...}}', meaning: 'A calculated property: n is the new column name, e is the formula.' },
            { part: '$_', meaning: 'Stands for the current process as it flows down the pipeline.' },
            { part: '1MB', meaning: 'PowerShell shortcut meaning 1,048,576 bytes.' },
          ],
          sampleOutput: 'Name     Id MemMB\n----     -- -----\nchrome 8120   612\ncode   5544   388',
        },
        {
          title: 'Who is my parent process?',
          code: '$me = Get-CimInstance Win32_Process -Filter "ProcessId=$PID"\nGet-Process -Id $me.ParentProcessId',
          whatItDoes: 'Finds the PID of whatever launched this window, then looks that process up. Real investigators walk parent-child chains like this.',
          parts: [
            { part: 'Get-CimInstance Win32_Process', meaning: 'Reads Windows management data about processes, including the parent PID.' },
            { part: '-Filter "ProcessId=$PID"', meaning: 'Asks the source to return only your own process. Double quotes let $PID expand to a number.' },
            { part: '$me.ParentProcessId', meaning: 'The PID of the process that started you.' },
          ],
          sampleOutput: 'Handles  NPM(K)    PM(K)      WS(K)     CPU(s)     Id  SI ProcessName\n    540      31    62144      78012       4.85   9264   1 WindowsTerminal',
          watchOut: 'If the parent already closed, the lookup fails with "Cannot find a process". That is normal, PIDs can be reused.',
        },
        {
          title: 'Practise stopping a process safely',
          code: 'Start-Process notepad\nGet-Process notepad | Stop-Process -WhatIf',
          whatItDoes: 'Opens Notepad, then shows what Stop-Process WOULD do without actually closing it.',
          parts: [
            { part: 'Start-Process notepad', meaning: 'Launches a new Notepad process.' },
            { part: 'Get-Process notepad', meaning: 'Finds every running Notepad.' },
            { part: 'Stop-Process', meaning: 'Cmdlet that ends a process. Receives processes from the pipe.' },
            { part: '-WhatIf', meaning: 'Safety switch: describe the action, do not perform it.' },
          ],
          sampleOutput: 'What if: Performing the operation "Stop-Process" on target "notepad (7312)".',
          watchOut: 'Remove -WhatIf only in a lab VM and only for processes you started. Unsaved work in a stopped app is lost.',
        },
      ],
    },
    pro: {
      intro: 'Professional process work is about baselines, trust and evidence: who owns it, is it signed, and is anything abnormal.',
      commands: [
        {
          title: 'Rank processes by thread count',
          code: 'Get-Process |\n  Select-Object Name, Id, HandleCount, @{n=\'Threads\';e={$_.Threads.Count}} |\n  Sort-Object Threads -Descending |\n  Select-Object -First 5',
          whatItDoes: 'Builds a small report of handles and threads per process so unusually busy or leaking processes stand out.',
          parts: [
            { part: 'HandleCount', meaning: 'Number of open handles. A number that keeps climbing can mean a leak.' },
            { part: '@{n=\'Threads\';e={$_.Threads.Count}}', meaning: 'Calculated column that counts each process threads.' },
            { part: 'Sort-Object Threads -Descending', meaning: 'Sorts the new column, highest first.' },
          ],
        },
        {
          title: 'Find running programs that are not validly signed',
          code: 'Get-Process | Where-Object { $_.Path } |\n  Select-Object -ExpandProperty Path -Unique |\n  ForEach-Object { Get-AuthenticodeSignature -FilePath $_ } |\n  Where-Object Status -ne \'Valid\' |\n  Select-Object Path, Status',
          whatItDoes: 'Checks the digital signature of every running program file and lists the ones that are unsigned or fail verification. A starting point for triage, not a verdict.',
          parts: [
            { part: 'Where-Object { $_.Path }', meaning: 'Skips processes whose file path is hidden from you.' },
            { part: '-ExpandProperty Path -Unique', meaning: 'Pulls out just the path text and removes duplicates.' },
            { part: 'Get-AuthenticodeSignature', meaning: 'Reads the digital signature of a file.' },
            { part: 'Where-Object Status -ne \'Valid\'', meaning: 'Keeps only files whose signature is not valid.' },
          ],
          watchOut: 'Many harmless tools (your own scripts, open-source apps) are unsigned. Treat results as questions to investigate, and it may take a minute to run.',
        },
        {
          title: 'See which accounts own your processes',
          code: '#Requires -RunAsAdministrator\nGet-Process -IncludeUserName |\n  Group-Object UserName |\n  Sort-Object Count -Descending |\n  Select-Object Count, Name',
          whatItDoes: 'Groups running processes by the account in their access token, so unexpected owners are easy to spot.',
          parts: [
            { part: '#Requires -RunAsAdministrator', meaning: 'Script guard. -IncludeUserName needs an elevated window.' },
            { part: '-IncludeUserName', meaning: 'Adds the owner of each process to the output.' },
            { part: 'Group-Object UserName', meaning: 'Bundles processes that share the same owner.' },
            { part: 'Select-Object Count, Name', meaning: 'Shows how many processes each owner has.' },
          ],
          sampleOutput: 'Count Name\n----- ----\n   92 NT AUTHORITY\\SYSTEM\n   41 WORKSTATION\\izaz',
          watchOut: 'Typed directly in the console, the #Requires line is only a comment. Open an elevated window yourself first.',
        },
      ],
    },
    recap: [
      'A process is a living kitchen in memory, a program is only the recipe on disk.',
      'Threads do the real work and are what the CPU schedules.',
      'Handles and access tokens decide what a process can touch.',
      'Get-Process, Get-CimInstance Win32_Process and Stop-Process -WhatIf cover most daily process work.',
    ],
  },
  '1-3': {
    oneSentence:
      'Every process gets its own private pretend-memory (virtual memory) split into 4 KB pages, and Windows quietly moves inactive pages to disk when RAM runs low.',
    analogy:
      'Imagine every tenant in an apartment building believes they own the whole building and numbers their rooms from 1. The building manager (the Memory Manager) secretly maps each tenant\'s room numbers to real rooms and moves rarely used boxes to a storage unit (the page file) when space gets tight. Tenants never see each other\'s rooms and never know the boxes moved.',
    plainEnglish: [
      'Every process sees its own private "virtual" address space. Address 0x1000 in one program is a completely different spot from 0x1000 in another, so programs cannot read each other by accident.',
      'Memory is cut into 4 KB pieces called pages. Pages in use stay in RAM, and rarely touched ones can be written to the page file on disk and loaded back when needed (paging).',
      'Seeing the numbers helps you answer "is this machine short on RAM, or is one program leaking?" before you buy hardware.',
    ],
    beforeYouStart: [
      'Any Windows PowerShell 5.1 or 7 window. No elevation needed for the beginner or intermediate commands.',
      'Know that PowerShell reports memory in different units (bytes, kilobytes, megabytes). Always check the unit.',
      'Pro commands that create files write them into your current folder.',
    ],
    atoZSteps: [
      {
        title: 'Step 1: Check the page size',
        detail: 'Run `[Environment]::SystemPageSize`. You should see 4096, the famous 4 KB page.',
      },
      {
        title: 'Step 2: Check physical RAM',
        detail: 'Run `Get-CimInstance Win32_OperatingSystem` and note TotalVisibleMemorySize and FreePhysicalMemory (both in KB).',
      },
      {
        title: 'Step 3: Look for the page file',
        detail: 'Run `Get-CimInstance Win32_PageFileUsage`. Name is the file on disk and CurrentUsage is how many MB are in it right now.',
      },
      {
        title: 'Step 4: Compare virtual and physical for one process',
        detail: 'Run `Get-Process -Id $PID | Select Name, WorkingSet64, PrivateMemorySize64, VirtualMemorySize64`. The virtual number is usually much bigger than the working set.',
      },
      {
        title: 'Step 5: Convert to pages',
        detail: 'Divide a process working set by 4096 to see how many pages it keeps in RAM. This turns abstract numbers into something countable.',
      },
      {
        title: 'Step 6: Watch over time',
        detail: 'Take the same measurement a few times. Private memory that only ever grows can mean a memory leak.',
      },
    ],
    wordsYouWillMeet: [
      { word: 'Virtual address space', meaning: 'The private set of memory addresses each process thinks it owns.' },
      { word: 'Page', meaning: 'A fixed 4 KB block, the unit the Memory Manager moves around.' },
      { word: 'Working set', meaning: 'The pages of a process that are currently in physical RAM.' },
      { word: 'Page file', meaning: 'A file on disk (pagefile.sys) used as overflow storage for memory pages.' },
      { word: 'Paging', meaning: 'Moving pages between RAM and the page file.' },
    ],
    beginner: {
      intro: 'Read-only commands that show how much memory your computer and a single process are really using.',
      commands: [
        {
          title: 'Show the memory page size',
          code: '[Environment]::SystemPageSize',
          whatItDoes: 'Prints the size in bytes of one memory page on this computer.',
          parts: [
            { part: '[Environment]', meaning: 'A built-in .NET type with facts about the computer. Square brackets name a type.' },
            { part: '::', meaning: 'Use a member that belongs to the type itself.' },
            { part: 'SystemPageSize', meaning: 'Property holding the page size in bytes.' },
          ],
          sampleOutput: '4096',
        },
        {
          title: 'Physical and virtual memory totals',
          code: 'Get-CimInstance Win32_OperatingSystem |\n  Select-Object TotalVisibleMemorySize, FreePhysicalMemory, TotalVirtualMemorySize',
          whatItDoes: 'Shows installed RAM, free RAM and total virtual memory (RAM plus page file). The values are in kilobytes.',
          parts: [
            { part: 'Get-CimInstance Win32_OperatingSystem', meaning: 'Reads the operating system facts from Windows management data.' },
            { part: 'TotalVisibleMemorySize', meaning: 'RAM Windows can use, in KB.' },
            { part: 'FreePhysicalMemory', meaning: 'RAM that is currently unused, in KB.' },
            { part: 'TotalVirtualMemorySize', meaning: 'RAM plus page file combined, in KB.' },
          ],
          sampleOutput: 'TotalVisibleMemorySize FreePhysicalMemory TotalVirtualMemorySize\n---------------------- ------------------ ---------------------\n              16678912            7421032              22921216',
          watchOut: 'These are KB, not bytes or MB. Divide by 1024 twice to get GB.',
        },
        {
          title: 'Check the page file',
          code: 'Get-CimInstance Win32_PageFileUsage | Select-Object Name, AllocatedBaseSize, CurrentUsage',
          whatItDoes: 'Shows where the page file lives, how large it is and how much is currently used (all in MB).',
          parts: [
            { part: 'Win32_PageFileUsage', meaning: 'Management class describing page file usage.' },
            { part: 'AllocatedBaseSize', meaning: 'Size of the page file in MB.' },
            { part: 'CurrentUsage', meaning: 'MB of the page file in use right now.' },
          ],
          sampleOutput: 'Name              AllocatedBaseSize CurrentUsage\n----              ----------------- ------------\nC:\\pagefile.sys                2048          312',
          watchOut: 'No output at all just means the system has no page file or it is managed in a way WMI does not list.',
        },
      ],
    },
    intermediate: {
      intro: 'Turn raw numbers into answers: percent used, pages held, and who is using the most.',
      commands: [
        {
          title: 'How much RAM is in use (percent)?',
          code: '$os = Get-CimInstance Win32_OperatingSystem\n$used = $os.TotalVisibleMemorySize - $os.FreePhysicalMemory\n\'{0:P0} of RAM is in use\' -f ($used / $os.TotalVisibleMemorySize)',
          whatItDoes: 'Subtracts free from total memory and prints the result as a percentage.',
          parts: [
            { part: '$os = ...', meaning: 'Stores the operating system object in a variable.' },
            { part: '$used = total - free', meaning: 'Simple maths on two properties.' },
            { part: '-f', meaning: 'The format operator. It fills {0} in the text on the left with the value on the right.' },
            { part: ':P0', meaning: 'Format code meaning percent with zero decimal places.' },
          ],
          sampleOutput: '56 % of RAM is in use',
          watchOut: 'High RAM use alone is not a problem, Windows deliberately fills spare RAM with cache. Look at paging activity too.',
        },
        {
          title: 'How many 4 KB pages does my process hold?',
          code: '(Get-Process -Id $PID).WorkingSet64 / [Environment]::SystemPageSize',
          whatItDoes: 'Divides your process RAM usage in bytes by the page size to count the pages it currently keeps in RAM.',
          parts: [
            { part: '.WorkingSet64', meaning: 'Bytes of this process currently in physical RAM.' },
            { part: '/', meaning: 'Division.' },
            { part: '[Environment]::SystemPageSize', meaning: 'Bytes per page (4096).' },
          ],
          sampleOutput: '32541.5',
          watchOut: 'A fractional result is possible because the working set is reported from slightly different counters. Round it with [math]::Round().',
        },
        {
          title: 'Top 5 processes by private memory',
          code: 'Get-Process |\n  Sort-Object PrivateMemorySize64 -Descending |\n  Select-Object -First 5 Name, Id, @{n=\'PrivateMB\';e={[math]::Round($_.PrivateMemorySize64/1MB)}}',
          whatItDoes: 'Ranks processes by memory that belongs only to them (not shared), shown in MB.',
          parts: [
            { part: 'PrivateMemorySize64', meaning: 'Bytes committed that cannot be shared with other processes.' },
            { part: '-Descending', meaning: 'Biggest first.' },
            { part: '[math]::Round(x)', meaning: 'Rounds a number to the nearest whole value.' },
          ],
        },
      ],
    },
    pro: {
      intro: 'Pros sample performance counters and track trends, then save evidence instead of guessing.',
      commands: [
        {
          title: 'Sample paging activity with performance counters',
          code: 'Get-Counter \'\\Memory\\Available MBytes\', \'\\Memory\\Pages/sec\' -SampleInterval 2 -MaxSamples 3',
          whatItDoes: 'Takes three readings, two seconds apart, of free memory and how often Windows is moving pages to and from disk.',
          parts: [
            { part: 'Get-Counter', meaning: 'Reads Windows performance counters.' },
            { part: '\'\\Memory\\Pages/sec\'', meaning: 'Counter name. Sustained high values mean heavy paging (a possible RAM shortage).' },
            { part: '-SampleInterval 2', meaning: 'Seconds between each reading.' },
            { part: '-MaxSamples 3', meaning: 'Stop after three readings.' },
          ],
          watchOut: 'Counter names are language specific. On a non-English Windows they can fail with "path not found".',
        },
        {
          title: 'Watch one process for a memory leak',
          code: '1..5 | ForEach-Object {\n  Get-Process -Id $PID |\n    Select-Object @{n=\'Time\';e={Get-Date -Format T}}, @{n=\'PrivateMB\';e={[math]::Round($_.PrivateMemorySize64/1MB,1)}}\n  Start-Sleep -Seconds 2\n}',
          whatItDoes: 'Measures private memory five times, two seconds apart. Replace $PID with a real PID to watch another process.',
          parts: [
            { part: '1..5', meaning: 'Range operator that produces 1, 2, 3, 4, 5.' },
            { part: 'ForEach-Object { ... }', meaning: 'Repeats the block once per number.' },
            { part: 'Get-Date -Format T', meaning: 'Current time as a short text stamp.' },
            { part: 'Start-Sleep -Seconds 2', meaning: 'Pause between readings.' },
          ],
          watchOut: 'A single rising number proves little. Real leaks show growth over many minutes or hours.',
        },
        {
          title: 'Save a memory report to CSV',
          code: 'Get-Process |\n  Sort-Object PrivateMemorySize64 -Descending |\n  Select-Object -First 10 Name, Id, @{n=\'PrivateMB\';e={[math]::Round($_.PrivateMemorySize64/1MB)}} |\n  Export-Csv .\\top-memory.csv -NoTypeInformation',
          whatItDoes: 'Saves the ten biggest memory users to a CSV file you can open in Excel or compare against later.',
          parts: [
            { part: 'Select-Object -First 10', meaning: 'Keeps only the top ten.' },
            { part: 'Export-Csv', meaning: 'Writes objects out as a comma-separated file.' },
            { part: '.\\top-memory.csv', meaning: 'File name in the current folder.' },
            { part: '-NoTypeInformation', meaning: 'Skips a useless type header line (needed in Windows PowerShell 5.1).' },
          ],
          watchOut: 'This creates a file and overwrites a file of the same name. Run it in a folder you own.',
        },
      ],
    },
    recap: [
      'Each process gets a private virtual address space made of 4 KB pages.',
      'The working set is what is in RAM now, the rest may sit in the page file.',
      'Check units: WMI memory values are KB, process values are bytes.',
      'Use trends and counters such as Pages/sec before declaring a RAM shortage.',
    ],
  },
  '2-1': {
    oneSentence:
      'Your apps run in a safe outer ring (user mode), the operating system core runs in an inner ring (kernel mode), and a system call is the single controlled door between them.',
    analogy:
      'Think of a bank. Customers (your apps) stay in the lobby (user mode). The vault (kernel mode) can reach everything, so customers never walk in. They fill out a request slip and a teller (NTDLL.DLL) carries it to the vault staff (the Executive managers), who do the job and hand back a keycard (a handle). If a customer faints in the lobby, the bank stays open. If the vault staff faint, the whole bank closes (a blue screen).',
    plainEnglish: [
      'Your programs run in user mode, which is fenced off. If one crashes, only that program dies. The core of Windows runs in kernel mode with full hardware access, so a kernel bug can crash the entire computer.',
      'Apps never call the kernel directly. They go through `ntdll.dll`, which switches the CPU into kernel mode, asks for the service and switches back.',
      'The kernel hands back handles instead of real pointers. A handle is a safe keycard number that only makes sense inside your process.',
    ],
    beforeYouStart: [
      'A standard PowerShell window works for everything except where marked.',
      'Remember: these commands only look at things. Never remove or disable drivers on a real machine.',
      'Optional: a lab VM for experimenting with crash events.',
    ],
    atoZSteps: [
      {
        title: 'Step 1: See that ntdll is everywhere',
        detail: 'Run `(Get-Process -Id $PID).Modules | Where-Object ModuleName -eq \'ntdll.dll\'`. Almost every process loads it.',
      },
      {
        title: 'Step 2: Count your handles',
        detail: 'Run `Get-Process -Id $PID | Select Name, HandleCount` to see how many kernel objects your window holds tickets for.',
      },
      {
        title: 'Step 3: List kernel-mode drivers',
        detail: 'Run `Get-CimInstance Win32_SystemDriver | Select -First 10 Name, State`. These run with kernel power.',
      },
      {
        title: 'Step 4: Read an app crash',
        detail: 'Look in the Application log for crash events (user mode). A crash here never takes Windows down.',
      },
      {
        title: 'Step 5: Look for a blue screen record',
        detail: 'Look in the System log for event 1001. That is a kernel-mode crash report if one ever happened.',
      },
      {
        title: 'Step 6: Connect the dots',
        detail: 'Remember which side of the wall each thing lives on: apps and PowerShell in user mode, drivers and the Executive in kernel mode.',
      },
    ],
    wordsYouWillMeet: [
      { word: 'User mode', meaning: 'Restricted CPU mode where normal apps run. A crash stays contained.' },
      { word: 'Kernel mode', meaning: 'Privileged CPU mode used by the OS core and drivers.' },
      { word: 'NTDLL.DLL', meaning: 'The user-mode library that is the doorway into the kernel.' },
      { word: 'Executive', meaning: 'The set of kernel managers (memory, process, security and more).' },
      { word: 'Handle', meaning: 'A safe ticket number that stands for a kernel object.' },
      { word: 'BSOD', meaning: 'Blue Screen Of Death, the stop screen shown after a fatal kernel error.' },
    ],
    beginner: {
      intro: 'Peek at both sides of the wall: a user-mode process and the kernel-mode drivers. Everything here is read-only.',
      commands: [
        {
          title: 'Prove your process uses ntdll.dll',
          code: '(Get-Process -Id $PID).Modules |\n  Where-Object ModuleName -eq \'ntdll.dll\' |\n  Select-Object ModuleName, FileName',
          whatItDoes: 'Lists the files (modules) loaded in your PowerShell process and keeps only the entry for ntdll.dll.',
          parts: [
            { part: '.Modules', meaning: 'Property listing every DLL and file loaded into the process.' },
            { part: 'Where-Object ModuleName -eq \'ntdll.dll\'', meaning: 'Filters the list to the single module with that name.' },
            { part: 'Select-Object ModuleName, FileName', meaning: 'Shows only the name and file location.' },
          ],
          sampleOutput: 'ModuleName FileName\n---------- --------\nntdll.dll  C:\\WINDOWS\\SYSTEM32\\ntdll.dll',
        },
        {
          title: 'Count open handles',
          code: 'Get-Process -Id $PID | Select-Object Name, Id, HandleCount',
          whatItDoes: 'Shows how many handles (tickets to kernel objects) your process currently holds.',
          parts: [
            { part: 'Get-Process -Id $PID', meaning: 'Gets your own process.' },
            { part: 'Select-Object', meaning: 'Chooses which columns to display.' },
            { part: 'HandleCount', meaning: 'Number of entries in the process handle table.' },
          ],
          sampleOutput: 'Name   Id HandleCount\n----   -- -----------\npwsh 14872         712',
        },
        {
          title: 'Peek at kernel-mode drivers',
          code: 'Get-CimInstance Win32_SystemDriver | Select-Object -First 5 Name, State, PathName',
          whatItDoes: 'Lists a few system drivers, the code that runs in kernel mode, with their status and file path.',
          parts: [
            { part: 'Win32_SystemDriver', meaning: 'Management class that lists drivers.' },
            { part: 'State', meaning: 'Whether the driver is Running or Stopped.' },
            { part: 'PathName', meaning: 'Location of the driver file, usually under System32\\drivers.' },
          ],
          sampleOutput: 'Name     State   PathName\n----     -----   --------\n1394ohci Stopped C:\\WINDOWS\\System32\\drivers\\1394ohci.sys',
          watchOut: 'Look only. Stopping or removing a driver can crash or break the computer.',
        },
      ],
    },
    intermediate: {
      intro: 'Filter, sort and read logs to separate harmless user-mode crashes from serious kernel-level problems.',
      commands: [
        {
          title: 'Inspect the modules loaded into a process',
          code: '(Get-Process -Id $PID).Modules |\n  Select-Object -First 8 ModuleName, @{n=\'SizeKB\';e={[int]($_.ModuleMemorySize/1KB)}}',
          whatItDoes: 'Shows the first eight DLLs in your process with their size in KB, so you see how much user-mode code a normal app pulls in.',
          parts: [
            { part: 'ModuleMemorySize', meaning: 'Bytes of memory a module takes.' },
            { part: '[int]( ... )', meaning: 'Casts the result to a whole number.' },
            { part: '1KB', meaning: 'Shortcut for 1024 bytes.' },
          ],
        },
        {
          title: 'List drivers that are running',
          code: 'Get-CimInstance Win32_SystemDriver |\n  Where-Object State -eq \'Running\' |\n  Sort-Object Name |\n  Select-Object -First 10 Name, DisplayName',
          whatItDoes: 'Filters to drivers that are active right now, sorts alphabetically and shows the first ten.',
          parts: [
            { part: 'Where-Object State -eq \'Running\'', meaning: 'Keeps only objects whose State property equals Running.' },
            { part: 'Sort-Object Name', meaning: 'Alphabetical order by driver name.' },
            { part: 'DisplayName', meaning: 'The human-friendly description of the driver.' },
          ],
        },
        {
          title: 'Show recent application crashes (user mode)',
          code: 'Get-WinEvent -FilterHashtable @{ LogName = \'Application\'; ProviderName = \'Application Error\' } -MaxEvents 3 -ErrorAction SilentlyContinue |\n  Select-Object TimeCreated, Id',
          whatItDoes: 'Reads the three most recent app-crash events. These are user-mode failures that Windows survived.',
          parts: [
            { part: 'Get-WinEvent', meaning: 'Reads Windows event logs.' },
            { part: '-FilterHashtable @{...}', meaning: 'Filters at the source by log name and provider, which is fast.' },
            { part: '-MaxEvents 3', meaning: 'Limits the result to three events.' },
            { part: '-ErrorAction SilentlyContinue', meaning: 'Hides the error you get when there are no matching events.' },
          ],
          sampleOutput: 'TimeCreated           Id\n-----------           --\n03/11/2026 09:14:22 1000',
        },
      ],
    },
    pro: {
      intro: 'Kernel-level health and hardening checks that administrators and security teams run regularly.',
      commands: [
        {
          title: 'Find evidence of a past blue screen',
          code: 'Get-WinEvent -FilterHashtable @{ LogName = \'System\'; Id = 1001; ProviderName = \'Microsoft-Windows-WER-SystemErrorReporting\' } -MaxEvents 3 -ErrorAction SilentlyContinue |\n  Select-Object TimeCreated, Message',
          whatItDoes: 'Looks for bugcheck reports, the record Windows writes after a kernel crash, including the stop code.',
          parts: [
            { part: 'Id = 1001', meaning: 'Event ID used for the crash report.' },
            { part: 'ProviderName', meaning: 'The component that wrote the event.' },
            { part: 'Select-Object TimeCreated, Message', meaning: 'Shows when it happened and the stop code details.' },
          ],
          watchOut: 'No output is good news: it means no recorded blue screens in the log.',
        },
        {
          title: 'List devices with unsigned drivers',
          code: 'Get-CimInstance Win32_PnPSignedDriver |\n  Where-Object { $_.IsSigned -eq $false } |\n  Select-Object DeviceName, DriverProviderName, DriverVersion',
          whatItDoes: 'Finds drivers without a valid signature. Unsigned kernel code is a stability and security risk.',
          parts: [
            { part: 'Win32_PnPSignedDriver', meaning: 'Management class with driver signing details.' },
            { part: '$_.IsSigned -eq $false', meaning: 'Test that is true when the driver is not signed.' },
            { part: 'DriverProviderName', meaning: 'Who published the driver.' },
          ],
          watchOut: 'Some entries have an empty IsSigned value for virtual devices. Investigate before concluding anything.',
        },
        {
          title: 'Watch a handle count over time',
          code: '1..3 | ForEach-Object {\n  [pscustomobject]@{ Time = Get-Date -Format T; Handles = (Get-Process -Id $PID).HandleCount }\n  Start-Sleep -Seconds 2\n}',
          whatItDoes: 'Records how many handles your process owns three times. A count that only grows can reveal a handle leak.',
          parts: [
            { part: '[pscustomobject]@{...}', meaning: 'Builds a small custom object from the name and value pairs.' },
            { part: 'Handles = (...).HandleCount', meaning: 'Stores the current handle count in a column called Handles.' },
            { part: 'Start-Sleep -Seconds 2', meaning: 'Waits between samples.' },
          ],
        },
      ],
    },
    recap: [
      'User mode is fenced off and crashes stay contained, kernel mode is all-powerful and crashes everything.',
      'Apps reach the kernel through ntdll.dll and hold handles, never raw pointers.',
      'Drivers run in kernel mode, so keep them signed and updated.',
      'Event logs separate harmless app crashes (Application Error) from real blue screens (event 1001).',
    ],
  },
  '2-2': {
    oneSentence:
      'Seven special system processes are born during every boot, and a fake process usually betrays itself by its wrong name, path, or parent.',
    analogy:
      'Picture a school with a strict roll call. Every morning the same seven staff members must arrive in the same order and sit in the same seats, each hired by a specific person. If you see a stranger in the principal\'s chair, wearing a name tag spelled a little wrong, you know straight away something is off. Knowing the normal roll call is how you spot an imposter.',
    plainEnglish: [
      'A healthy Windows machine always starts the same core processes: System (PID 4), smss.exe, csrss.exe, wininit.exe, services.exe, lsass.exe, winlogon.exe and many svchost.exe helpers.',
      'Malware loves hiding by borrowing these names. You catch it with three checks: spelling, file path (real ones live in `C:\\Windows\\System32`) and parent process (for example, svchost.exe must be started by services.exe). Note that smss.exe, csrss.exe, wininit.exe and winlogon.exe legitimately show no parent, because the short-lived process that created them has already exited.',
      'Services also run under accounts. LocalSystem is all-powerful, LocalService and NetworkService have less. Choose the least powerful one that works.',
    ],
    beforeYouStart: [
      'A normal PowerShell window works for most commands. Reading some process paths may need an elevated window.',
      'Never kill a core system process to "test" it. Stopping the wrong one can crash Windows.',
      'All security content here is defensive, for learning on your own lab machine.',
    ],
    atoZSteps: [
      {
        title: 'Step 1: List the core processes',
        detail: 'Run `Get-Process -Name System, smss, wininit, services, lsass, winlogon`. Note each PID.',
      },
      {
        title: 'Step 2: Count svchost',
        detail: 'Many svchost.exe processes are normal because each hosts different services. Count them to learn your baseline.',
      },
      {
        title: 'Step 3: Check the path rule',
        detail: 'Use Get-CimInstance to read the ExecutablePath (open an elevated window first: without elevation, protected processes such as lsass.exe show a blank path). Real core processes run from `C:\\Windows\\System32`.',
      },
      {
        title: 'Step 4: Check the parent rule',
        detail: 'Compare each svchost ParentProcessId with the PID of services.exe. They should all match. (Only apply the parent rule to svchost, services and lsass: wininit, winlogon and csrss show no parent on a healthy machine.)',
      },
      {
        title: 'Step 5: Check the count rule',
        detail: 'There should be exactly one lsass.exe. Two would be very suspicious.',
      },
      {
        title: 'Step 6: Review service accounts',
        detail: 'Group services by StartName to see which run as LocalSystem, LocalService or NetworkService, and ask whether each needs that power.',
      },
    ],
    wordsYouWillMeet: [
      { word: 'SYSTEM (PID 4)', meaning: 'The kernel itself, shown as a process.' },
      { word: 'services.exe', meaning: 'The Service Control Manager that starts and parents the svchost processes.' },
      { word: 'lsass.exe', meaning: 'The security guard that checks passwords and creates tokens. Attackers target it, so there must be only one.' },
      { word: 'svchost.exe', meaning: 'A generic host that runs many Windows services.' },
      { word: 'LocalSystem', meaning: 'The most powerful built-in service account.' },
      { word: 'Imposter', meaning: 'Malware that copies a trusted process name to hide.' },
    ],
    beginner: {
      intro: 'Learn the normal roll call. All commands here only read.',
      commands: [
        {
          title: 'List the core system processes',
          code: 'Get-Process -Name System, smss, wininit, services, lsass, winlogon | Select-Object Name, Id',
          whatItDoes: 'Shows the PIDs of the core processes. Names are given with no .exe.',
          parts: [
            { part: '-Name', meaning: 'Selects processes by name. A comma-separated list means "any of these".' },
            { part: 'System, smss, wininit...', meaning: 'The core process names, without the .exe ending.' },
            { part: 'Select-Object Name, Id', meaning: 'Show only the name and the PID.' },
          ],
          sampleOutput: 'Name         Id\n----         --\nlsass       892\nservices    876\nsmss        332\nSystem        4\nwininit     792\nwinlogon    980',
        },
        {
          title: 'Count svchost.exe processes',
          code: 'Get-Process -Name svchost | Measure-Object | Select-Object Count',
          whatItDoes: 'Counts how many svchost processes are running. Dozens is normal.',
          parts: [
            { part: 'Measure-Object', meaning: 'Counts or totals what comes through the pipeline.' },
            { part: 'Select-Object Count', meaning: 'Shows only the Count column.' },
          ],
          sampleOutput: 'Count\n-----\n   74',
        },
        {
          title: 'Where does lsass.exe live?',
          code: 'Get-CimInstance Win32_Process -Filter "Name=\'lsass.exe\'" |\n  Select-Object Name, ProcessId, ExecutablePath',
          whatItDoes: 'Prints the full file path of lsass.exe. It should be inside C:\\Windows\\System32.',
          parts: [
            { part: 'Win32_Process', meaning: 'Management class describing running processes.' },
            { part: '-Filter "Name=\'lsass.exe\'"', meaning: 'Asks Windows for only that process. Single quotes sit inside the double quotes.' },
            { part: 'ExecutablePath', meaning: 'Full path of the file the process was started from.' },
          ],
          sampleOutput: 'Name      ProcessId ExecutablePath\n----      --------- --------------\nlsass.exe       892 C:\\Windows\\system32\\lsass.exe',
        },
      ],
    },
    intermediate: {
      intro: 'Turn the three forensic rules into small checks. Expect an empty result when everything is healthy.',
      commands: [
        {
          title: 'Any svchost with the wrong parent?',
          code: '$svc = (Get-Process -Name services).Id\nGet-CimInstance Win32_Process -Filter "Name=\'svchost.exe\'" |\n  Where-Object ParentProcessId -ne $svc |\n  Select-Object ProcessId, ParentProcessId, ExecutablePath',
          whatItDoes: 'Finds svchost.exe processes not started by services.exe. On a healthy machine this prints nothing.',
          parts: [
            { part: '$svc = (...).Id', meaning: 'Saves the PID of services.exe.' },
            { part: 'Where-Object ParentProcessId -ne $svc', meaning: 'Keeps only svchosts whose parent is not services.exe.' },
            { part: '-ne', meaning: 'Comparison operator for "not equal".' },
          ],
          watchOut: 'Empty output means healthy. A result is a lead to investigate, not proof of malware.',
        },
        {
          title: 'Any svchost running from the wrong folder?',
          code: 'Get-CimInstance Win32_Process -Filter "Name=\'svchost.exe\'" |\n  Where-Object { $_.ExecutablePath -and $_.ExecutablePath -ne "$env:windir\\System32\\svchost.exe" } |\n  Select-Object ProcessId, ExecutablePath',
          whatItDoes: 'Compares each svchost path against the one true location and shows any that differ.',
          parts: [
            { part: '$env:windir', meaning: 'Environment variable holding the Windows folder, usually C:\\Windows.' },
            { part: '$_.ExecutablePath -and ...', meaning: 'First makes sure the path is not empty, then compares it.' },
            { part: '-ne', meaning: 'Not equal. Comparisons ignore upper and lower case by default.' },
          ],
          watchOut: 'Run it in an elevated window to avoid empty paths for protected processes.',
        },
        {
          title: 'Which accounts do services run as?',
          code: 'Get-CimInstance Win32_Service |\n  Group-Object StartName |\n  Sort-Object Count -Descending |\n  Select-Object Count, Name',
          whatItDoes: 'Groups every service by its logon account so you can see how many run as LocalSystem versus the safer built-in accounts.',
          parts: [
            { part: 'Win32_Service', meaning: 'Management class for Windows services.' },
            { part: 'StartName', meaning: 'The account a service runs under.' },
            { part: 'Group-Object', meaning: 'Bundles items that share the same value and counts them.' },
          ],
          sampleOutput: 'Count Name\n----- ----\n   94 LocalSystem\n   31 NT AUTHORITY\\LocalService\n   18 NT AUTHORITY\\NetworkService',
        },
      ],
    },
    pro: {
      intro: 'Turn the rules into repeatable checks you can run on every server. Treat hits as leads and confirm with other evidence.',
      commands: [
        {
          title: 'Enforce the one-lsass rule',
          code: '$l = @(Get-Process -Name lsass)\nif ($l.Count -ne 1) { Write-Warning "Expected 1 lsass.exe but found $($l.Count)" } else { \'lsass count OK\' }',
          whatItDoes: 'Counts lsass.exe processes and warns when there is not exactly one.',
          parts: [
            { part: '@( ... )', meaning: 'Forces the result into an array so .Count always works.' },
            { part: 'if (...) { } else { }', meaning: 'Runs one block when the test is true, another when false.' },
            { part: 'Write-Warning', meaning: 'Prints a yellow warning message.' },
            { part: '$($l.Count)', meaning: 'Sub-expression that inserts a value into a double-quoted string.' },
          ],
          sampleOutput: 'lsass count OK',
        },
        {
          title: 'Core process running outside System32',
          code: 'Get-Process -Name svchost, lsass, services, winlogon, wininit, smss, csrss -ErrorAction SilentlyContinue |\n  Where-Object { $_.Path -and $_.Path -notlike "$env:windir\\System32\\*" } |\n  Select-Object Name, Id, Path',
          whatItDoes: 'Flags any process wearing a core name but running from outside System32, a classic imposter sign.',
          parts: [
            { part: '-ErrorAction SilentlyContinue', meaning: 'Do not complain about names that are not running.' },
            { part: '-notlike', meaning: 'Wildcard comparison that is true when the text does not match.' },
            { part: '\\System32\\*', meaning: 'The * wildcard means "anything after this folder".' },
          ],
          watchOut: 'Run elevated so Path is readable for every process. Empty output is the healthy result.',
        },
        {
          title: 'Hunt for lookalike names',
          code: 'Get-Process | Where-Object { $_.Name -match \'^(svch0st|svhost|scvhost|lsas|lssas|lsass0|winlogin|servces)$\' } |\n  Select-Object Name, Id, Path',
          whatItDoes: 'Matches a short list of common misspellings of core process names. Starts you off with a pattern you can extend.',
          parts: [
            { part: '-match', meaning: 'Regular-expression comparison.' },
            { part: '^( ... )$', meaning: '^ means start of text, $ means end, and | means "or". The name must be exactly one of the options.' },
            { part: 'Select-Object Name, Id, Path', meaning: 'Shows where each hit lives.' },
          ],
          watchOut: 'This only finds the typos you list. Always combine it with path and parent checks.',
        },
        {
          title: 'Is Credential Guard protecting LSASS?',
          code: 'Get-CimInstance -ClassName Win32_DeviceGuard -Namespace root\\Microsoft\\Windows\\DeviceGuard |\n  Select-Object -ExpandProperty SecurityServicesRunning',
          whatItDoes: 'Lists the virtualization-based security features running. A value of 1 means Credential Guard is active.',
          parts: [
            { part: '-Namespace root\\Microsoft\\Windows\\DeviceGuard', meaning: 'The management area that holds Device Guard data.' },
            { part: 'SecurityServicesRunning', meaning: 'Numbers for active features: 1 = Credential Guard, 2 = memory integrity (HVCI).' },
            { part: '-ExpandProperty', meaning: 'Outputs the raw values rather than a table.' },
          ],
          watchOut: 'No output or an error simply means the feature is unsupported or the class is missing on this edition.',
        },
      ],
    },
    recap: [
      'Healthy Windows always starts the same core processes in the same order.',
      'Check name, path (System32) and parent to spot imposters.',
      'lsass.exe must appear exactly once, and svchost.exe must be a child of services.exe.',
      'Prefer LocalService or NetworkService over LocalSystem for services.',
    ],
  },
  '2-3': {
    oneSentence:
      'Turning on a PC is a four-stage chain of trust, and Secure Boot plus Trusted Boot refuse to run anything that is not signed.',
    analogy:
      'Starting a computer is like opening a bank each morning. First a guard checks the building (firmware), then the manager confirms every key and ID is genuine before letting staff in (Secure Boot, Trusted Boot), a security scanner arrives before anyone else (ELAM), and a camera records the whole opening procedure (Measured Boot). Only then do the doors open to customers (the logon screen).',
    plainEnglish: [
      'Old computers used BIOS with an MBR: a tiny 512-byte first sector that trusted whatever code it held. It supported only 4 partitions and about 2 TB disks and had no signature checks.',
      'Modern computers use UEFI with a GPT disk layout, which supports far larger disks and many partitions, and can verify every stage cryptographically.',
      'Windows boots in four phases: firmware, Windows Boot Manager (`bootmgfw.efi`), OS Loader (`winload.efi`) and then the kernel. Each layer of defense checks the next before trusting it.',
    ],
    beforeYouStart: [
      'Several commands here need an elevated PowerShell window. Each is marked.',
      'Never convert or repair a disk without a full backup, and do disk work only in a lab VM.',
      'A virtual machine may report fewer security features such as no TPM. That is expected.',
    ],
    atoZSteps: [
      {
        title: 'Step 1: Find out when you last booted',
        detail: 'Run `Get-CimInstance Win32_OperatingSystem | Select LastBootUpTime`.',
      },
      {
        title: 'Step 2: UEFI or Legacy?',
        detail: 'Run `Get-ComputerInfo -Property BiosFirmwareType`. UEFI is modern, Legacy means BIOS.',
      },
      {
        title: 'Step 3: MBR or GPT?',
        detail: 'Run `Get-Disk | Select Number, PartitionStyle`. It prints GPT or MBR for each disk.',
      },
      {
        title: 'Step 4: Check Secure Boot (elevated)',
        detail: 'Open an elevated window and run `Confirm-SecureBootUEFI`. True means firmware is verifying boot files. On a legacy BIOS machine (or some VMs) it throws an error saying the cmdlet is not supported, which just means Secure Boot does not exist there.',
      },
      {
        title: 'Step 5: Check the TPM (elevated)',
        detail: 'Run `Get-Tpm`. The TPM is the chip that stores boot measurements for Measured Boot.',
      },
      {
        title: 'Step 6: Know your options',
        detail: 'If you need to move a legacy disk to GPT, use `mbr2gpt /validate` first. Converting is a planned, backed-up task, never a casual experiment.',
      },
    ],
    wordsYouWillMeet: [
      { word: 'MBR', meaning: 'Master Boot Record, the 512-byte first sector of a legacy disk.' },
      { word: 'GPT', meaning: 'GUID Partition Table, the modern disk layout used with UEFI.' },
      { word: 'UEFI', meaning: 'The modern firmware that replaced BIOS and supports Secure Boot.' },
      { word: 'Secure Boot', meaning: 'Firmware only loads boot files signed by a trusted publisher.' },
      { word: 'ELAM', meaning: 'Early Launch Anti-Malware, an antivirus driver loaded before other drivers.' },
      { word: 'TPM', meaning: 'A security chip that records measurements of the boot process.' },
    ],
    beginner: {
      intro: 'Safe, read-only commands that reveal how this computer started.',
      commands: [
        {
          title: 'When did I last boot?',
          code: 'Get-CimInstance Win32_OperatingSystem | Select-Object CSName, LastBootUpTime',
          whatItDoes: 'Shows the computer name and the exact date and time of the last startup.',
          parts: [
            { part: 'Win32_OperatingSystem', meaning: 'Management class with operating system facts.' },
            { part: 'CSName', meaning: 'The computer name.' },
            { part: 'LastBootUpTime', meaning: 'Date and time Windows last started.' },
          ],
          sampleOutput: 'CSName      LastBootUpTime\n------      --------------\nWORKSTATION 02/11/2026 08:02:41',
        },
        {
          title: 'Is the firmware UEFI or Legacy BIOS?',
          code: 'Get-ComputerInfo -Property BiosFirmwareType, BiosVersion',
          whatItDoes: 'Tells you whether this machine boots through modern UEFI or old BIOS.',
          parts: [
            { part: 'Get-ComputerInfo', meaning: 'Gathers many computer facts into one object.' },
            { part: '-Property', meaning: 'Limits the output to the listed fields.' },
            { part: 'BiosFirmwareType', meaning: 'Shows Uefi or Legacy.' },
          ],
          sampleOutput: 'BiosFirmwareType BiosVersion\n---------------- -----------\nUefi             {LENOVO - 1, N3ZET60W (1.35)}',
          watchOut: 'The command can take a few seconds because it collects a lot of information.',
        },
        {
          title: 'Is my disk MBR or GPT?',
          code: 'Get-Disk | Select-Object Number, FriendlyName, PartitionStyle, @{n=\'SizeGB\';e={[math]::Round($_.Size/1GB)}}',
          whatItDoes: 'Lists each disk with its partition style (GPT or MBR) and size in GB.',
          parts: [
            { part: 'Get-Disk', meaning: 'Lists physical disks seen by Windows.' },
            { part: 'PartitionStyle', meaning: 'GPT (modern) or MBR (legacy).' },
            { part: '$_.Size/1GB', meaning: 'Turns bytes into gigabytes. Inside a calculated column, $_ is the current disk.' },
          ],
          sampleOutput: 'Number FriendlyName     PartitionStyle SizeGB\n------ ------------     -------------- ------\n     0 NVMe Samsung 980 GPT               477',
          watchOut: 'On some systems Get-Disk needs an elevated window to list every disk.',
        },
      ],
    },
    intermediate: {
      intro: 'Check the boot defenses and measure uptime. The first two commands need an elevated window.',
      commands: [
        {
          title: 'Is Secure Boot on?',
          code: 'Confirm-SecureBootUEFI',
          whatItDoes: 'Returns True if UEFI Secure Boot is enabled and False if it is off.',
          parts: [
            { part: 'Confirm-SecureBootUEFI', meaning: 'Cmdlet that asks the UEFI firmware about Secure Boot. Needs elevation.' },
          ],
          sampleOutput: 'True',
          watchOut: 'On Legacy BIOS machines it throws "Cmdlet not supported on this platform". That error itself tells you the machine is not using UEFI.',
        },
        {
          title: 'Is there a working TPM?',
          code: 'Get-Tpm | Select-Object TpmPresent, TpmReady, ManufacturerIdTxt',
          whatItDoes: 'Shows whether a Trusted Platform Module exists and is ready to store boot measurements.',
          parts: [
            { part: 'Get-Tpm', meaning: 'Reads the status of the TPM chip. Needs elevation.' },
            { part: 'TpmPresent', meaning: 'True when a TPM exists.' },
            { part: 'TpmReady', meaning: 'True when it is initialised and usable.' },
          ],
          sampleOutput: 'TpmPresent TpmReady ManufacturerIdTxt\n---------- --------- -----------------\n      True      True INTC',
        },
        {
          title: 'Show uptime as days and hours',
          code: '$up = (Get-Date) - (Get-CimInstance Win32_OperatingSystem).LastBootUpTime\n\'{0} days, {1} hours\' -f $up.Days, $up.Hours',
          whatItDoes: 'Subtracts the last boot time from now to get a time span, then prints it in a friendly sentence.',
          parts: [
            { part: '(Get-Date) - ...', meaning: 'Subtracting two dates gives a TimeSpan object.' },
            { part: '$up.Days, $up.Hours', meaning: 'Properties of the TimeSpan.' },
            { part: '-f', meaning: 'Format operator that fills the {0} and {1} placeholders.' },
          ],
          sampleOutput: '2 days, 5 hours',
        },
      ],
    },
    pro: {
      intro: 'Pro habits: validate before changing disks, keep software updated, and build one report you can run on every machine. Run in a lab first.',
      commands: [
        {
          title: 'Read the boot manager entry',
          code: 'bcdedit /enum "{bootmgr}"',
          whatItDoes: 'Prints the Windows Boot Manager settings stored in the Boot Configuration Data (BCD).',
          parts: [
            { part: 'bcdedit', meaning: 'Built-in tool that views and edits boot configuration.' },
            { part: '/enum', meaning: 'Only list entries, change nothing.' },
            { part: '"{bootmgr}"', meaning: 'The identifier of the boot manager. Quotes stop PowerShell reading the braces as code.' },
          ],
          sampleOutput: 'Windows Boot Manager\n--------------------\nidentifier              {bootmgr}\npath                    \\EFI\\Microsoft\\Boot\\bootmgfw.efi',
          watchOut: 'Needs an elevated window. Other bcdedit switches change how the PC boots, so do not use them outside a lab.',
        },
        {
          title: 'Validate a disk for MBR to GPT conversion',
          code: 'mbr2gpt /validate /allowFullOS',
          whatItDoes: 'Checks whether the system disk can be safely converted from MBR to GPT without changing anything.',
          parts: [
            { part: 'mbr2gpt', meaning: 'Windows tool that converts MBR disks to GPT.' },
            { part: '/validate', meaning: 'Only check eligibility. It does not convert.' },
            { part: '/allowFullOS', meaning: 'Allows the check to run from the normal Windows desktop instead of recovery mode.' },
          ],
          watchOut: 'Never follow this with /convert unless you have a full backup, a plan to switch the firmware to UEFI, and a lab-tested procedure.',
        },
        {
          title: 'List software with available updates',
          code: 'winget upgrade',
          whatItDoes: 'Shows installed apps that have newer versions. Keeping software updated closes known holes.',
          parts: [
            { part: 'winget', meaning: 'Windows Package Manager.' },
            { part: 'upgrade', meaning: 'With no extra options it only lists updates, it does not install them.' },
          ],
          watchOut: 'Adding --all would install every update. Do that only on purpose after testing.',
        },
        {
          title: 'One-shot boot health report',
          code: '$sb = try { Confirm-SecureBootUEFI } catch { \'Unknown (not UEFI or not elevated)\' }\n[pscustomobject]@{\n  Firmware   = (Get-ComputerInfo -Property BiosFirmwareType).BiosFirmwareType\n  SecureBoot = $sb\n  LastBoot   = (Get-CimInstance Win32_OperatingSystem).LastBootUpTime\n}',
          whatItDoes: 'Collects firmware type, Secure Boot state and last boot time into one neat object you can export or compare across machines.',
          parts: [
            { part: 'try { } catch { }', meaning: 'Tries the command and runs the fallback if it fails.' },
            { part: '[pscustomobject]@{ ... }', meaning: 'Builds a custom object from named values.' },
            { part: 'Firmware = ...', meaning: 'Each line is Name = Value inside the hashtable.' },
          ],
          sampleOutput: 'Firmware SecureBoot LastBoot\n-------- ---------- --------\nUefi           True 02/11/2026 08:02:41',
        },
      ],
    },
    recap: [
      'BIOS with MBR is the old 512-byte design, UEFI with GPT is the modern verified design.',
      'Windows boots in four phases: firmware, boot manager, OS loader, kernel.',
      'Secure Boot, Trusted Boot, ELAM and Measured Boot check each handoff.',
      'Get-ComputerInfo, Get-Disk, Confirm-SecureBootUEFI and Get-Tpm are your read-only boot checks.',
    ],
  },
  '3-1': {
    oneSentence:
      'PowerShell is a command-line shell and a .NET automation language in one, and the DRY rule says never type the same thing twice when a script can do it.',
    analogy:
      'Old command lines are like faxing a printed spreadsheet and making someone re-type it. PowerShell is like emailing the spreadsheet itself: the next command gets real rows and columns it can sort and filter, not a picture of text. And DRY ("Don\'t Repeat Yourself") is the rule that if you do the same chore three times, you write it down once and let the computer do it from then on.',
    plainEnglish: [
      'PowerShell is both a command line and a scripting language. Its big idea, from Jeffrey Snover\'s "Monad" manifesto, is that commands return live objects with named properties, not plain text.',
      'You can write PowerShell in the console, in the older ISE (frozen at 5.1) or in Visual Studio Code with the PowerShell extension, which is the modern choice.',
      'Two versions coexist: Windows PowerShell 5.1 (built into Windows, `powershell.exe`) and PowerShell 7 (`pwsh.exe`, cross-platform and updated). You often need to know which one you are in.',
    ],
    beforeYouStart: [
      'Open PowerShell from the Start menu. Windows PowerShell 5.1 (already on your PC) is perfectly fine for this course. Both versions can be installed side by side.',
      'Optional: install PowerShell 7 with `winget install Microsoft.PowerShell` and Visual Studio Code.',
      'No scripting experience needed, you will only type single lines.',
    ],
    atoZSteps: [
      {
        title: 'Step 1: Check your version',
        detail: 'Run `$PSVersionTable`. PSVersion 5.1 is Windows PowerShell, 7.x is PowerShell 7.',
      },
      {
        title: 'Step 2: Check the edition',
        detail: 'Run `$PSVersionTable.PSEdition`. Desktop means 5.1 and Core means 7.',
      },
      {
        title: 'Step 3: See that output is objects',
        detail: 'Run `Get-Service -Name Spooler | Get-Member -MemberType Property` to list the properties you can filter on. (Get-Member is covered properly in lesson 4-1. For now just read the list: each name is a fact about the service.)',
      },
      {
        title: 'Step 4: Filter by property',
        detail: 'Run `Get-Service | Where-Object Status -eq \'Running\'`. No text chopping, you simply name the property. (Where-Object has its own lesson later, 7-1. Just type it as shown.)',
      },
      {
        title: 'Step 5: Apply DRY',
        detail: 'Read the loop in the Intermediate tier: `ForEach-Object` runs the same job once per item, which is the DRY idea in action. Saving commands as a `.ps1` script comes later in the course, so for now just type the loop.',
      },
      {
        title: 'Step 6: Pick your workspace',
        detail: 'Use the console for quick commands and VS Code for scripts. Use ISE only when you must stay on 5.1.',
      },
    ],
    wordsYouWillMeet: [
      { word: 'Cmdlet', meaning: 'A built-in PowerShell command named Verb-Noun, such as Get-Service.' },
      { word: 'Object', meaning: 'A piece of data with named properties and actions, not just text.' },
      { word: 'Pipeline', meaning: 'The | symbol that passes objects from one command to the next.' },
      { word: 'DRY', meaning: 'Don\'t Repeat Yourself. Automate chores you repeat.' },
      { word: 'Windows PowerShell 5.1', meaning: 'The classic version that ships with Windows (powershell.exe).' },
      { word: 'PowerShell 7', meaning: 'The modern, cross-platform version (pwsh.exe).' },
    ],
    beginner: {
      intro: 'First look at PowerShell itself. Nothing here changes the computer.',
      commands: [
        {
          title: 'Which PowerShell am I using?',
          code: '$PSVersionTable',
          whatItDoes: 'Prints a table of version information about the current PowerShell session.',
          parts: [
            { part: '$PSVersionTable', meaning: 'Built-in variable (the $ marks a variable) holding version details.' },
          ],
          sampleOutput: 'Name                      Value\n----                      -----\nPSVersion                 7.4.6\nPSEdition                 Core\nOS                        Microsoft Windows 10.0.26100',
        },
        {
          title: 'Desktop or Core?',
          code: '$PSVersionTable.PSEdition',
          whatItDoes: 'Prints Desktop for Windows PowerShell 5.1 or Core for PowerShell 7.',
          parts: [
            { part: '.PSEdition', meaning: 'A property of the version table. The dot reaches inside an object.' },
          ],
          sampleOutput: 'Core',
        },
        {
          title: 'See that results are objects',
          code: 'Get-Service -Name Spooler | Get-Member -MemberType Property | Select-Object -First 5 Name, MemberType',
          whatItDoes: 'Lists some of the properties of a service object, proving you get real data with names, not text.',
          parts: [
            { part: 'Get-Service -Name Spooler', meaning: 'Gets the Print Spooler service.' },
            { part: 'Get-Member', meaning: 'Shows what properties and methods an object has.' },
            { part: '-MemberType Property', meaning: 'Limits the list to properties (data), not methods (actions).' },
          ],
          sampleOutput: 'Name                MemberType\n----                ----------\nCanPauseAndContinue   Property\nCanShutdown           Property\nCanStop               Property',
        },
      ],
    },
    intermediate: {
      intro: 'Use the pipeline to filter objects by property and see the DRY idea in action.',
      commands: [
        {
          title: 'Filter running services by property',
          code: 'Get-Service |\n  Where-Object Status -eq \'Running\' |\n  Sort-Object DisplayName |\n  Select-Object -First 5 Name, DisplayName',
          whatItDoes: 'Gets all services, keeps the running ones, sorts them and shows five. No text parsing needed.',
          parts: [
            { part: 'Where-Object Status -eq \'Running\'', meaning: 'Keeps items whose Status property equals Running.' },
            { part: 'Sort-Object DisplayName', meaning: 'Alphabetical sort by a property.' },
            { part: '|', meaning: 'Pipe. Each command receives real objects from the one before it.' },
          ],
        },
        {
          title: 'Repeat one job for a list (DRY)',
          code: '\'Spooler\', \'BITS\', \'WinRM\' |\n  ForEach-Object { Get-Service -Name $_ } |\n  Select-Object Name, Status',
          whatItDoes: 'Runs the same check for three services with one line, instead of typing three commands.',
          parts: [
            { part: '\'Spooler\', \'BITS\', \'WinRM\'', meaning: 'A list (array) of three text values.' },
            { part: 'ForEach-Object { ... }', meaning: 'Runs the code in braces once for each item.' },
            { part: '$_', meaning: 'The current item inside the loop.' },
          ],
          sampleOutput: 'Name    Status\n----    ------\nSpooler Running\nBITS    Stopped\nWinRM   Running',
        },
        {
          title: 'Count cmdlets in this version',
          code: 'Get-Command -CommandType Cmdlet | Measure-Object | Select-Object Count',
          whatItDoes: 'Counts the cmdlets available. Run it in 5.1 and in 7 to see they are different.',
          parts: [
            { part: 'Get-Command', meaning: 'Finds commands you can run.' },
            { part: '-CommandType Cmdlet', meaning: 'Only list real cmdlets, not functions or aliases.' },
            { part: 'Measure-Object', meaning: 'Counts the items passing through.' },
          ],
          watchOut: 'The number depends on which modules are installed, so it varies between machines.',
        },
      ],
    },
    pro: {
      intro: 'Pro habits: be explicit about versions, write reusable scripts, and keep the execution policy and trust boundaries in mind.',
      commands: [
        {
          title: 'Run a command in Windows PowerShell 5.1 from anywhere',
          code: 'powershell.exe -NoProfile -Command \'$PSVersionTable.PSVersion.ToString()\'',
          whatItDoes: 'Starts a fresh 5.1 engine for one command and returns its version. Handy when a script must work in both versions.',
          parts: [
            { part: 'powershell.exe', meaning: 'The Windows PowerShell 5.1 program. Use pwsh.exe for PowerShell 7.' },
            { part: '-NoProfile', meaning: 'Skip your startup script for a clean, predictable run.' },
            { part: '-Command \'...\'', meaning: 'The text to run. Single quotes stop the outer shell expanding $PSVersionTable.' },
          ],
          sampleOutput: '5.1.26100.2161',
        },
        {
          title: 'A small reusable script (DRY)',
          code: '#Requires -Version 5.1\nparam([string[]]$Name = @(\'Spooler\', \'BITS\', \'WinRM\'))\nGet-Service -Name $Name -ErrorAction SilentlyContinue |\n  Select-Object Name, Status, StartType',
          whatItDoes: 'Saved as a .ps1 file, this turns a repeated check into a script that accepts different service names.',
          parts: [
            { part: '#Requires -Version 5.1', meaning: 'Refuse to run on older PowerShell versions.' },
            { part: 'param([string[]]$Name = @(...))', meaning: 'Declares an input called Name that accepts several values and has a default list.' },
            { part: '-ErrorAction SilentlyContinue', meaning: 'Do not print errors for service names that do not exist.' },
          ],
          watchOut: 'Save as a .ps1 file and run it as .\\Check-Services.ps1 -Name Spooler. Scripts can be blocked by the execution policy.',
        },
        {
          title: 'Write version-aware code',
          code: 'if ($PSVersionTable.PSVersion.Major -ge 7) { \'PowerShell 7 features are available\' } else { \'Stay compatible with 5.1\' }',
          whatItDoes: 'Checks the major version and chooses the path to follow. Use it when a script must work on both versions.',
          parts: [
            { part: '$PSVersionTable.PSVersion.Major', meaning: 'The first number of the version, such as 5 or 7.' },
            { part: '-ge 7', meaning: 'Comparison meaning "greater than or equal to 7".' },
            { part: 'if { } else { }', meaning: 'Choose between two blocks of code.' },
          ],
          watchOut: 'Features like && and || between commands, and the ?? operator, only exist in PowerShell 7.',
        },
        {
          title: 'Review the execution policy',
          code: 'Get-ExecutionPolicy -List',
          whatItDoes: 'Shows the script-running policy at every scope. It is a safety belt against accidental scripts, not a security boundary.',
          parts: [
            { part: 'Get-ExecutionPolicy', meaning: 'Reads the policy that decides which scripts may run.' },
            { part: '-List', meaning: 'Shows the setting for each scope (MachinePolicy, UserPolicy, Process, CurrentUser, LocalMachine).' },
          ],
          sampleOutput: '        Scope ExecutionPolicy\n        ----- ---------------\nMachinePolicy       Undefined\n   UserPolicy       Undefined\n      Process       Undefined\n CurrentUser    RemoteSigned\nLocalMachine       Undefined',
          watchOut: 'This only reads. Do not loosen the policy to Unrestricted on a real machine just to make a script run.',
        },
      ],
    },
    recap: [
      'PowerShell passes live objects, not text, which makes filtering simple and reliable.',
      'DRY: if you repeat a chore, script it once and reuse it.',
      'Windows PowerShell 5.1 (Desktop) and PowerShell 7 (Core) are different engines, check $PSVersionTable.',
      'VS Code with the PowerShell extension is the modern editor, ISE stays on 5.1.',
    ],
  },
};
