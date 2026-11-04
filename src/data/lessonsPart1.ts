import { Lesson } from '../types';

export const LESSONS_PART_1: Lesson[] = [
  // ==========================================================================
  // CHAPTER 1: INSIDE THE WINDOWS KERNEL: PROCESSES, THREADS & MEMORY
  // ==========================================================================
  {
    id: '1-1',
    chapterId: 'chapter-01',
    slug: 'windows-evolution-and-least-privilege',
    title: 'Windows Evolution, Kernel Convergence & The Golden Rule of Least Privilege',
    subtitle: 'From Windows NT 3.1 (1993) to Server 2025, WSL2, and why you never log in daily as Admin',
    estimatedMinutes: 15,
    oneSentenceSummary:
      'Modern Windows Client and Windows Server are built on the same NT kernel, and the most valuable security habit is using a standard account for daily work and elevating only when needed.',
    summary:
      'You will type your first PowerShell command (`whoami`) in this lesson. Then a short history of how Microsoft moved its consumer and enterprise operating systems onto one NT kernel, a tour of the modern Windows ecosystem (Client, Server, WSL2, Azure), and the Golden Rule of Least Privilege. The history is background: if you only want to start typing commands, skim it and come back later.',
    whyItMatters:
      'If you think Windows 11 on a laptop and Windows Server 2025 in a datacenter are completely different operating systems, you will waste years relearning the same internals. And if you log in daily with a Domain Admin or local Administrator account, a single mistyped command, or a single phishing link, owns your entire machine.',
    learningObjectives: [
      'Trace the evolution of Windows from 16-bit MS-DOS shells to the 32/64-bit Windows NT kernel (NT 3.1 to Server 2025)',
      'Explain why Windows 11 and Windows Server 2025 are built on the same NT kernel (ntoskrnl.exe) and differ mainly in tuned defaults and Server Roles',
      'Identify the 4 pillars of the modern Windows ecosystem: Client, Server, Cloud (Azure/Entra ID), and Cross-Platform (WSL2 & PowerShell 7)',
      'Apply the Principle of Least Privilege by separating your daily standard user account from your elevated administrative credentials',
    ],
    keyTerms: [
      'Windows NT (New Technology)',
      'Kernel Convergence',
      'Active Directory (Windows 2000)',
      'Principle of Least Privilege (PoLP)',
      'User Account Control (UAC)',
      'WSL2 (Windows Subsystem for Linux)',
    ],
    conceptSections: [
      {
        heading: 'How We Got Here: Two Family Trees Becoming One',
        body: [
          'For its first fifteen years, Microsoft actually maintained two completely separate operating system families. On the consumer side stood Windows 1.0 (1985), Windows 3.x, Windows 95, Windows 98, and Windows Me, graphical shells sitting on top of MS-DOS. They were great for home games, but if one bad application overwrote memory, the entire PC froze.',
          'Meanwhile, in 1993, Microsoft hired veteran DEC engineer Dave Cutler to architect a true 32-bit, preemptive, hardware-protected operating system from scratch: Windows NT 3.1 ("New Technology"). NT introduced strict memory isolation, security access tokens, and a hardware abstraction layer.',
          'Here are the four historical milestones I always keep in mind:\n• 1993 (Windows NT 3.1): The birth of the modern NT kernel architecture we still run today.\n• 2000 (Windows 2000): Introduced Active Directory (AD), transforming Windows from isolated servers into unified enterprise domains.\n• 2001 (Windows XP): The great convergence. Microsoft retired the fragile Win9x line and moved home and business PCs onto the NT kernel.\n• 2016 to 2025 (Windows 10/11 & Server 2016/2019/2022/2025): Unified 64-bit kernel baseline across client, datacenter, and cloud.',
        ],
      },
      {
        heading: 'Client vs. Server: Same Engine, Different Tuning',
        body: [
          'Here is a secret that surprises many beginners: Windows 11 and Windows Server 2025 are built on the same NT kernel, and both ship the same kernel file name (`C:\\Windows\\System32\\ntoskrnl.exe`).',
          'The difference is how the engine is tuned out of the box:\n• Windows Client (10/11) prioritizes foreground responsiveness (your mouse, browser, and active window get CPU priority) and ships with consumer apps.\n• Windows Server (2022/2025) prioritizes background network services and file sharing, supports massive hardware (terabytes of RAM and dozens of CPU sockets), can be installed completely headless without a desktop GUI (Server Core), and unlocks enterprise Server Roles like Active Directory Domain Services (AD DS), DNS, DHCP, and Hyper-V.',
        ],
      },
      {
        heading: 'My #1 Rule: The Principle of Least Privilege',
        body: [
          'Before you touch a server or open an elevated shell, lock in this rule: Never use an Administrator account for your daily browsing, email, or regular work.',
          'Every user and every background service should run with the bare minimum permissions required to do its job, and nothing more. As an engineer, you should have two identities:\n1. Your daily standard user account (for reading docs, checking email, writing code).\n2. Your dedicated administrative account (invoked only via "Run as administrator" or UAC elevation when configuring the system).',
          'Why? Because malware inherits the exact permissions of the user who accidentally launched it. If you click a malicious attachment while logged in as a standard user, the malware is trapped in User Mode with no rights to touch `C:\\Windows\\System32` or install kernel drivers. If you are logged in as Administrator, you just handed the attacker the keys to the kingdom.',
        ],
      },
    ],
    calloutNotes: [
      {
        type: 'key',
        title: 'The One-Sentence Version',
        body: 'Windows 11 and Windows Server share the same NT kernel. Use your Admin credentials only when a task needs them, and work as a standard user the rest of the time.',
      },
      {
        type: 'try',
        title: 'Check Your Current Privilege Level Right Now',
        body: 'Click Start, type `PowerShell`, and press Enter. A window opens (usually blue) with a line of text that ends in `>`, such as `PS C:\\Users\\you>`. That line is the prompt: `PS` means PowerShell, the path is the folder you are in, and `>` means it is waiting for you to type. Click inside the window, type `whoami`, and press Enter. It prints the account you are signed in as (for example `mypc\\you`). This command only reads information, so it is completely safe. Do not type the `PS C:\\>` part yourself.',
      },
      {
        type: 'danger',
        title: 'Why UAC Exists',
        body: 'Even if your account is in the local Administrators group, Windows logs you in with two tokens (a stripped standard token and a full admin token). User Account Control (UAC) keeps the admin token locked away until you explicitly approve an elevation prompt.',
      },
    ],
    commandBreakdowns: [
      {
        cmdlet: 'Get-ComputerInfo',
        aliases: ['gin'],
        syntax: 'Get-ComputerInfo [-Property <String[]>]',
        parameters: [
          {
            name: '-Property',
            type: 'String[]',
            description: 'Filters output to specific OS or hardware properties (supports wildcards like Os*).',
          },
        ],
        examples: ['Get-ComputerInfo -Property OsName, OsVersion, OsBuildNumber, CsProcessors'],
      },
    ],
    codeExamples: [
      {
        title: 'Inspecting the NT Kernel Version and Current Privilege Token',
        description: 'Verify that your machine runs the Win32NT platform and inspect whether your current PowerShell session is elevated.',
        code: `# 1. Inspect the underlying OS platform and build
[System.Environment]::OSVersion

# 2. Check if your current PowerShell session is running as Administrator
$identity  = [Security.Principal.WindowsIdentity]::GetCurrent()
$principal = New-Object Security.Principal.WindowsPrincipal($identity)
$isAdmin   = $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

Write-Output "Current User : $($identity.Name)"
Write-Output "Is Elevated? : $isAdmin"`,
        output: `Platform ServicePack Version      VersionString
-------- ----------- -------      -------------
 Win32NT             10.0.26100.0 Microsoft Windows NT 10.0.26100.0

Current User : WORKSTATION\\izaz
Is Elevated? : False`,
      },
    ],
    mistakesAndTraps: [
      {
        mistake: 'Disabling UAC (User Account Control) because the popups feel annoying.',
        cause: 'Thinking UAC is just an annoying confirmation box rather than a token-isolation boundary.',
        fix: 'Keep UAC enabled and use a non-admin account for daily work, elevating only specific terminal windows when performing system administration.',
      },
    ],
    tryItYourself: [
      'In the PowerShell window, run `[System.Environment]::OSVersion` to see the `Win32NT` identifier.',
      'Next step (slightly harder): run `whoami /groups | Select-String "S-1-16"`. The `|` (pipe) hands the output of `whoami /groups` to `Select-String`, which keeps only the line that contains the integrity level. If you see `Medium Mandatory Level`, your window is a standard (not elevated) token. `High Mandatory Level` means the window was opened with "Run as administrator".',
      'Run `whoami /priv` in a normal PowerShell window, then open a second PowerShell window using "Run as administrator" and run `whoami /priv` again. Count how many extra privileges (like `SeDebugPrivilege`) appear in the elevated token!',
    ],
    knowledgeCheck: [
      {
        question: 'Which historic Windows release introduced Active Directory (AD) and unified enterprise domain management?',
        options: ['Windows NT 3.1 (1993)', 'Windows 95 (1995)', 'Windows 2000 (2000)', 'Windows XP (2001)'],
        correctIndex: 2,
        explanation: 'Windows 2000 introduced Active Directory, Group Policy, and Kerberos authentication to the Windows Server line.',
      },
      {
        question: 'Why does the Principle of Least Privilege forbid logging into your daily workstation as a full Administrator?',
        options: [
          'Administrator accounts cannot run web browsers',
          'Any script or malware you accidentally trigger inherits your full administrative permissions automatically',
          'Windows Server only allows one user account to exist',
          'PowerShell only runs under standard user accounts',
        ],
        correctIndex: 1,
        explanation: 'Every process you launch inherits your security access token. Running daily tasks as a standard user contains accidental mistakes and malware inside a restricted sandbox.',
      },
    ],
  },

  {
    id: '1-2',
    chapterId: 'chapter-01',
    slug: 'processes-threads-and-handles',
    title: 'Processes, Threads, Access Tokens & Process Explorer',
    subtitle: 'The Notepad story, the restaurant kitchen analogy for threads, handle tables, and parent-child malware tells',
    estimatedMinutes: 20,
    oneSentenceSummary:
      'A program is a dead `.exe` recipe sitting on disk; a process is the living kitchen in RAM (with its own memory, handle table, and security token), and threads are the individual workers inside that kitchen.',
    summary:
      'What actually happens inside Windows the microsecond you double-click `notepad.exe`? In this lesson, we dissect the five ingredients of every living Windows process, learn why threads, not processes, are what the CPU actually schedules, understand handles and access tokens, and see why Sysinternals Process Explorer beats Task Manager for hunting malware.',
    whyItMatters:
      'When a server pegs at 100% CPU, when a file refuses to delete because "another process has it locked", or when an attacker hides a reverse shell inside a legitimate-looking process name, understanding PIDs, parent-child trees, threads, and handles turns guesswork into surgical forensics.',
    learningObjectives: [
      'Contrast a passive program on disk (.exe) with a live process in RAM',
      'List the 5 core components of every Windows process: PID, Private Virtual Address Space, Handle Table, Security Access Token, and Threads',
      'Explain why a process with 1 thread can freeze while a multi-threaded app stays responsive',
      'Use Sysinternals Process Explorer to inspect parent-child process trees, company signatures, and open handles',
    ],
    keyTerms: [
      'Process ID (PID)',
      'Thread',
      'Handle & Handle Table',
      'Security Access Token',
      'Parent-Child Process Tree',
      'Sysinternals Process Explorer',
    ],
    conceptSections: [
      {
        heading: 'The Notepad Story: Program vs. Process',
        body: [
          'Think of `C:\\Windows\\System32\\notepad.exe` as a printed recipe sitting in a cookbook on your shelf. While it sits on the SSD, it consumes zero RAM and zero CPU. It is just a passive file, a program.',
          'The moment you double-click `notepad.exe`, the Windows kernel builds a living container in RAM called a **Process**. Every single Windows process is born with five things:\n1. **A unique Process ID (PID):** A number assigned by the kernel (e.g., PID `4812`). Note that PIDs get recycled after a process exits!\n2. **A Private Virtual Address Space:** Its own isolated sandbox of memory addresses so it cannot read or corrupt another app’s memory.\n3. **Executable Code & DLLs:** The loaded `.exe` instructions plus shared libraries like `kernel32.dll` and `ntdll.dll`.\n4. **A Handle Table + Security Access Token:** A list of numbered "claim tickets" (handles) to open files or registry keys, plus the user identity badge (token) it inherited from whatever launched it.\n5. **At least one Thread:** The actual worker that executes instructions on a CPU core.',
        ],
      },
      {
        heading: 'Processes vs. Threads: The Restaurant Kitchen Analogy',
        body: [
          'Beginners often say "the CPU runs processes." Strictly speaking, **a process never runs, threads run!**',
          'Picture a process as a restaurant kitchen stocked with stoves, ingredients (memory), and health permits (security token). An empty kitchen cooks nothing. **Threads** are the chefs working inside that kitchen:\n• All threads inside the same process **share** the same memory and handles (so Chef 1 and Chef 2 can read the same order ticket instantly).\n• If a process has only **one thread** and that thread starts saving a huge 2 GB file to a slow disk, the window freezes ("Not Responding") because nobody is left to listen to mouse clicks.\n• Well-written apps spawn separate threads: Thread 1 redraws the UI, Thread 2 saves the file in the background, and Thread 3 checks spelling.',
        ],
      },
      {
        heading: 'Why I Always Replace Task Manager with Process Explorer',
        body: [
          'Windows Task Manager (`taskmgr.exe`) is fine for a quick glance, but when I am troubleshooting a server or investigating an incident, I reach immediately for **Sysinternals Process Explorer** (`procexp.exe`), authored by Mark Russinovich.',
          'Why? Because Process Explorer shows you what Task Manager hides:\n• **True Parent-Child Hierarchy:** You see the exact tree of *who spawned whom*. If `explorer.exe` spawned `cmd.exe`, an interactive user opened it. If `winword.exe` (Microsoft Word) spawned `powershell.exe`, you are almost certainly looking at a malicious macro!\n• **Color-Coded Context:** Services highlight in pink, your own processes in blue, new processes flash green, and terminated ones flash red.\n• **Handle & DLL Search (`Ctrl+F`):** Ever tried to delete a folder and Windows yelled *"The action can’t be completed because the folder is open in another program"*? In Process Explorer, press `Ctrl+F`, type the filename, and it shows the exact process and handle locking that file.',
        ],
      },
    ],
    calloutNotes: [
      {
        type: 'key',
        title: 'The One-Sentence Version',
        body: 'Processes own resources (memory, handles, security token); threads execute code on the CPU.',
      },
      {
        type: 'try',
        title: 'Inspect Thread & Handle Counts in PowerShell',
        body: 'Run `Get-Process | Select-Object Name, Id, @{N="Threads";E={$_.Threads.Count}}, Handles | Sort-Object Handles -Descending | Select-Object -First 10` to see which processes hold the most kernel handles and threads right now.',
      },
      {
        type: 'pro',
        title: 'Security Lens: Parent Process Spoofing & Lineage',
        body: 'In incident response, a process name means very little, anyone can rename `nc.exe` to `svchost.exe`. Always check three things: the Image Path on disk, the Digital Signature (Verified Signer), and the Parent Process.',
      },
    ],
    commandBreakdowns: [
      {
        cmdlet: 'Get-Process',
        aliases: ['gps', 'ps'],
        syntax: 'Get-Process [[-Name] <String[]>] [-Id <Int32[]>]',
        parameters: [
          {
            name: '-Name',
            type: 'String[]',
            description: 'Filters processes by process name (without the .exe extension). Supports wildcards.',
          },
          {
            name: '-Id',
            type: 'Int32[]',
            description: 'Targets one or more processes by their unique numeric Process ID (PID).',
          },
        ],
        examples: [
          'Get-Process -Name explorer',
          'Get-Process | Sort-Object WorkingSet64 -Descending | Select-Object -First 5',
        ],
      },
    ],
    codeExamples: [
      {
        title: 'Inspecting Live Processes, Threads, Handles, and Parent PIDs',
        description: 'Use Get-Process and Get-CimInstance Win32_Process to inspect both resource consumption and parent-child lineage. The output is a sample: your numbers and PowerShell edition (powershell.exe for Windows PowerShell 5.1, pwsh.exe for PowerShell 7) will differ.',
        code: `# 1. Inspect top 5 processes by Handle count and Thread count
Get-Process |
  Sort-Object Handles -Descending |
  Select-Object -First 5 Name, Id, Handles, @{Name='ThreadCount';Expression={$_.Threads.Count}}

# 2. Query Parent Process IDs (PPID) and full command lines via CIM
Get-CimInstance Win32_Process -Filter "Name = 'powershell.exe' OR Name = 'pwsh.exe'" |
  Select-Object ProcessId, ParentProcessId, Name, CommandLine`,
        output: `Name          Id Handles ThreadCount
----          -- ------- -----------
System         4    4120         184
explorer    5412    2890          76
svchost     1428    1945          38
pwsh        8820     912          24
lsass        792     880          14

ProcessId ParentProcessId Name     CommandLine
--------- --------------- ----     -----------
     8820            5412 pwsh.exe "C:\\Program Files\\PowerShell\\7\\pwsh.exe"`,
      },
    ],
    mistakesAndTraps: [
      {
        mistake: 'Including `.exe` when running `Get-Process -Name notepad.exe`.',
        cause: '`Get-Process` uses the friendly process name without the file extension (`notepad`), whereas WMI/CIM (`Win32_Process`) uses the executable filename (`notepad.exe`).',
        fix: 'Use `Get-Process -Name notepad` (no `.exe`).',
      },
    ],
    tryItYourself: [
      'Open two separate Notepad windows and run `Get-Process -Name notepad`. Notice how the same program (`notepad.exe`) creates two completely separate processes with different `Id` (PID) numbers.',
      'Use `Get-CimInstance Win32_Process | Select-Object ProcessId, ParentProcessId, Name` to find which process is the parent of your current PowerShell window.',
    ],
    knowledgeCheck: [
      {
        question: 'Which component of a Windows process is actually scheduled to run instructions on a CPU core?',
        options: ['The Handle Table', 'The Thread', 'The Access Token', 'The Virtual Address Space'],
        correctIndex: 1,
        explanation: 'A process is a resource container; threads are the units of execution scheduled across CPU cores.',
      },
      {
        question: 'What is a significant red flag when inspecting a parent-child process tree in Process Explorer?',
        options: [
          'services.exe is the parent of svchost.exe',
          'explorer.exe is the parent of notepad.exe',
          'winword.exe (Microsoft Word) is the parent of powershell.exe or cmd.exe',
          'wininit.exe is the parent of lsass.exe',
        ],
        correctIndex: 2,
        explanation: 'An Office document spawning a command shell (`powershell.exe` or `cmd.exe`) is a classic indicator of a malicious macro or exploit.',
      },
    ],
  },

  {
    id: '1-3',
    chapterId: 'chapter-01',
    slug: 'virtual-memory-and-paging',
    title: 'Virtual Memory, 4 KB Pages & The Memory Manager',
    subtitle: 'How private virtual address spaces protect processes and how inactive pages swap out to disk',
    estimatedMinutes: 20,
    diagramId: 'virtual-memory-pager',
    oneSentenceSummary:
      'No process ever touches physical RAM sticks directly, the Windows Memory Manager gives every process a private virtual address illusion divided into 4 KB pages and swaps idle pages to `pagefile.sys` when RAM fills up.',
    summary:
      'Have you ever wondered how a system with 16 GB of physical RAM can keep 24 GB of applications open without crashing, or why a bug in your browser cannot overwrite the memory of your password manager? In this lesson, we explore Virtual Memory, 4 KB pages, Page Tables, and `pagefile.sys`, complete with an interactive RAM-and-Disk paging simulator.',
    whyItMatters:
      'When administrators misread memory metrics (`WorkingSet` vs `PrivateMemorySize` vs `PageFileUsage`), they waste money buying unnecessary RAM or misdiagnose disk thrashing caused by heavy page faults.',
    learningObjectives: [
      'Explain why processes use Virtual Memory addresses instead of raw physical RAM addresses',
      'Describe how the Memory Manager maps 4 KB virtual pages to physical RAM frames or disk (`C:\\pagefile.sys`)',
      'Distinguish between a Soft Page Fault (already in RAM) and a Hard Page Fault (must be fetched from disk)',
      'Inspect process memory footprints (`WorkingSet64` and `PrivateMemorySize64`) using PowerShell',
    ],
    keyTerms: [
      'Virtual Address Space',
      '4 KB Memory Page',
      'Page Table',
      'Working Set',
      'pagefile.sys (Paging File)',
      'Hard Page Fault (read from disk)',
    ],
    conceptSections: [
      {
        heading: 'The Grand Illusion: Private Virtual Address Spaces',
        body: [
          'Imagine what would happen if Notepad and Chrome both tried to write directly to physical RAM address `0x00401000` at the same time. They would overwrite each other’s data instantly, or worse, a malicious app could read your banking password right out of your browser’s RAM.',
          'To prevent this, the Windows **Memory Manager** (assisted by the CPU’s Memory Management Unit, or MMU) gives every process a **private Virtual Address Space**. On 64-bit Windows, every single process believes it has terabytes of contiguous memory all to itself.',
          'When Process A writes to virtual address `0x00401000` and Process B writes to the exact same virtual address `0x00401000`, the Memory Manager silently translates those virtual addresses to two completely different physical locations in RAM. Neither process can even *see* the other’s memory.',
        ],
      },
      {
        heading: '4 KB Pages, Working Sets & C:\\pagefile.sys',
        body: [
          'Rather than managing memory one byte at a time, Windows slices memory into uniform **4 KB blocks called Pages**.',
          '• **Active Pages (The Working Set):** The 4 KB pages a process is actively using right now stay in fast physical RAM. In PowerShell and Task Manager, the RAM a process currently holds is called its **Working Set**.\n• **Paging Out to Disk:** When physical RAM starts filling up, the Memory Manager looks for 4 KB pages that haven’t been touched in a while (for example, a minimized app you haven’t clicked in an hour) and moves them out to a hidden system file on your SSD called **`C:\\pagefile.sys`**.\n• **Hard Page Faults (Paging In):** The moment you click that minimized window again, the process tries to read its virtual page. The Page Table says *"Hold on, that page is currently parked on disk!"* The kernel pauses the thread until the read finishes (milliseconds on a hard disk, a fraction of a millisecond on an SSD, still far slower than RAM), reads the 4 KB page back into a free RAM frame, updates the Page Table, and resumes the thread. Note that many hard faults are not about `pagefile.sys` at all: when a program or DLL is first used, Windows also reads its pages from the `.exe`/`.dll` file on disk. A few hard faults are normal; constant heavy paging that slows the whole machine is called thrashing.',
        ],
      },
      {
        heading: 'Shared DLLs: How Windows Saves Gigabytes of RAM',
        body: [
          'If 120 running processes all need `kernel32.dll` and `ntdll.dll`, does Windows load 120 duplicate copies into physical RAM? No!',
          'Because code inside system DLLs is read-only, the Memory Manager loads **one single copy** of `ntdll.dll` into physical RAM and maps all 120 processes’ virtual page tables to point at those same physical frames. Every process gets isolation for its private data while sharing a single physical copy of common OS code.',
        ],
      },
    ],
    calloutNotes: [
      {
        type: 'key',
        title: 'The One-Sentence Version',
        body: 'Virtual memory slices memory into 4 KB pages so processes can never collide in RAM and idle pages can overflow safely onto `C:\\pagefile.sys`.',
      },
      {
        type: 'try',
        title: 'Use the Interactive Virtual Memory Simulator Below',
        body: 'Click "Launch App (+2 Pages)" in the interactive simulator below until physical RAM fills up to 8/8 frames, then launch one more app to watch the Memory Manager swap cold pages out to `pagefile.sys`!',
      },
      {
        type: 'gotcha',
        title: 'Never Delete or Disable pagefile.sys Because "I Have 32 GB of RAM"',
        body: 'Even on machines with huge RAM, Windows relies on `pagefile.sys` to commit memory reservations and write crash dumps (`MEMORY.DMP`) if a BSOD occurs. Leave it system-managed.',
      },
    ],
    commandBreakdowns: [
      {
        cmdlet: 'Get-Process',
        aliases: ['gps', 'ps'],
        syntax: 'Get-Process | Select-Object Name, WorkingSet64, PrivateMemorySize64',
        parameters: [
          {
            name: 'WorkingSet64',
            type: 'Int64 (Property)',
            description: 'The current amount of physical RAM (in bytes) allocated to the process.',
          },
          {
            name: 'PrivateMemorySize64',
            type: 'Int64 (Property)',
            description: 'Memory allocated exclusively to this process that cannot be shared with other processes.',
          },
        ],
        examples: [
          'Get-Process | Sort-Object WorkingSet64 -Descending | Select-Object -First 5 Name, @{N="RAM_MB";E={[math]::Round($_.WorkingSet64 / 1MB, 1)}}',
        ],
      },
    ],
    codeExamples: [
      {
        title: 'Calculating Physical RAM (WorkingSet) vs Commit Memory in Megabytes',
        description: 'Convert raw byte counts into clean Megabyte (MB) numbers using PowerShell’s built-in 1MB multiplier.',
        code: `# Top 5 processes by Physical RAM (Working Set) vs Private Commit
Get-Process |
  Sort-Object WorkingSet64 -Descending |
  Select-Object -First 5 Name, Id,
    @{Name = 'WorkingSet_MB'; Expression = { [math]::Round($_.WorkingSet64 / 1MB, 1) }},
    @{Name = 'PrivateMem_MB'; Expression = { [math]::Round($_.PrivateMemorySize64 / 1MB, 1) }}`,
        output: `Name          Id WorkingSet_MB PrivateMem_MB
----          -- ------------- -------------
MsMpEng     3412         312.4         285.0
explorer    5412         198.2         142.6
pwsh        8820         124.5         108.1
svchost     1892          86.3          64.2
lsass        792          48.1          32.5`,
      },
    ],
    mistakesAndTraps: [
      {
        mistake: 'Panicking when `WorkingSet64` looks large even though the system has plenty of free RAM.',
        cause: 'Windows intentionally keeps pages in a process’s Working Set as long as RAM is plentiful, trimming them only when another process needs memory.',
        fix: 'Check actual memory pressure and hard page fault rates rather than judging a single process’s Working Set in isolation.',
      },
    ],
    tryItYourself: [
      'Use the interactive Virtual Memory & Paging Simulator on this page to fill all 8 physical RAM frames and trigger automatic paging to `C:\\pagefile.sys`.',
      'Run `Get-CimInstance Win32_PageFileUsage | Select-Object Name, AllocatedBaseSize, CurrentUsage, PeakUsage` in PowerShell to inspect your machine’s real paging file usage.',
    ],
    knowledgeCheck: [
      {
        question: 'What is the standard size of a virtual memory page in x64 Windows?',
        options: ['512 bytes', '4 KB (4,096 bytes)', '64 MB', '1 GB'],
        correctIndex: 1,
        explanation: 'The Windows Memory Manager divides virtual address spaces and physical RAM into 4 KB pages.',
      },
      {
        question: 'What happens when a process tries to access a virtual memory page that was previously swapped out to C:\\pagefile.sys?',
        options: [
          'The process immediately crashes with an Access Violation',
          'The Memory Manager triggers a Hard Page Fault, reads the 4 KB page from disk back into physical RAM, updates the Page Table, and resumes the thread',
          'The CPU deletes pagefile.sys',
          'The user must reboot the computer',
        ],
        correctIndex: 1,
        explanation: 'Paging is completely transparent to the application; the kernel fetches the page from disk back into RAM automatically.',
      },
    ],
  },

  // ==========================================================================
  // CHAPTER 2: RINGS OF POWER: USER MODE, KERNEL MODE & THE BOOT CHAIN
  // ==========================================================================
  {
    id: '2-1',
    chapterId: 'chapter-02',
    slug: 'user-vs-kernel-mode-syscalls',
    title: 'User Mode vs Kernel Mode, NTDLL.DLL & The Executive Managers',
    subtitle: 'Why app crashes stay contained while kernel bugs cause a BSOD, and how handles unlock kernel objects',
    estimatedMinutes: 20,
    diagramId: 'syscall-animator',
    oneSentenceSummary:
      'User Mode (Ring 3) is a locked sandbox where apps cannot touch hardware; to open a file or packet, an app must ask `NTDLL.DLL` to make a System Call across the boundary into Kernel Mode (Ring 0).',
    summary:
      'Every modern CPU enforces hardware privilege rings. In this lesson, we draw the hard red line between User Mode (Ring 3) and Kernel Mode (Ring 0), trace a file-save request step-by-step from `Notepad.exe` through `NTDLL.DLL` into `ntoskrnl.exe`, meet the key Executive managers, and understand how Handles act as hotel keycards for kernel objects.',
    whyItMatters:
      'This single architectural boundary explains why a crashing game just closes its window while a buggy anti-cheat or storage driver causes a Blue Screen of Death (BSOD), and why EDR security sensors hook `NTDLL.DLL` to watch for malicious system calls.',
    learningObjectives: [
      'Compare User Mode (Ring 3) and Kernel Mode (Ring 0) in terms of memory access, CPU instructions, and crash blast radius',
      'Trace a System Call from an application through the Win32 API and `NTDLL.DLL` across the kernel boundary',
      'Identify the roles of the Kernel Executive (`ntoskrnl.exe`), Device Drivers (`.sys`), and the Hardware Abstraction Layer (HAL)',
      'Explain why User Mode applications receive opaque Handles instead of direct pointers to Kernel Objects',
    ],
    keyTerms: [
      'User Mode (Ring 3)',
      'Kernel Mode (Ring 0)',
      'NTDLL.DLL (System Call Gatekeeper)',
      'Executive (ntoskrnl.exe)',
      'Security Reference Monitor (SRM)',
      'Hardware Abstraction Layer (HAL)',
    ],
    conceptSections: [
      {
        heading: 'The Two Worlds: User Mode (Ring 3) vs. Kernel Mode (Ring 0)',
        body: [
          'Your CPU hardware physically enforces two operating modes for Windows code:\n• **User Mode (Ring 3):** Where your applications (`notepad.exe`, `chrome.exe`, `pwsh.exe`) and even background Windows services (`svchost.exe`, `lsass.exe`) live. Code in User Mode is **blindfolded and handcuffed**: it can only see its own private virtual memory, and the CPU blocks it from talking directly to disks, network cards, or GPUs. If a User Mode app crashes, Windows simply cleans up that one process.\n• **Kernel Mode (Ring 0):** Where the OS core (`ntoskrnl.exe`), Hardware Abstraction Layer (`hal.dll`), and hardware device drivers (`.sys`) live. Code in Ring 0 has **total access** to all physical memory and all hardware registers. If a driver in Kernel Mode writes to a bad pointer, the OS can no longer trust the state of RAM and immediately halts the machine with a **Blue Screen of Death (BSOD)** to prevent corrupting your disk.',
        ],
      },
      {
        heading: 'Crossing the Border: Win32 API → NTDLL.DLL → Executive (ntoskrnl.exe)',
        body: [
          'If Notepad in User Mode is forbidden from touching the SSD, how does it save `notes.txt`? It has to ask the Kernel to do the work on its behalf via a **System Call (Syscall)**:\n1. **Application (`Notepad.exe`):** Calls the documented Win32 function `WriteFile()` inside `kernel32.dll`.\n2. **The Gatekeeper (`NTDLL.DLL`):** The lowest layer of User Mode. `NTDLL.DLL` translates `WriteFile` into the native system call `NtWriteFile`, loads the syscall number into CPU registers, and executes the special `SYSCALL` CPU instruction to cross into Ring 0.\n3. **The Windows Executive (`ntoskrnl.exe`):** Inside Kernel Mode, the Executive houses many cooperating managers. Six you will meet most often:\n   - **Object Manager:** Creates and tracks kernel objects and hands out handles.\n   - **Security Reference Monitor (SRM):** Checks your process’s Access Token against the file’s permissions (ACL).\n   - **I/O Manager:** Packages the write request into an I/O Request Packet (IRP) and routes it to the right driver.\n   - **Memory Manager:** Manages virtual-to-physical 4 KB pages.\n   - **Process & Thread Manager:** Creates and terminates processes and threads.\n   - **Plug & Play / Power Manager:** Manages hardware discovery and power states.\n   - **Others:** The Cache Manager, the Configuration Manager (the registry) and more.\n4. **Device Drivers & HAL:** The file system driver (`ntfs.sys`) and storage driver (`stornvme.sys`) translate the IRP into hardware commands through the **HAL (Hardware Abstraction Layer)**, which hides motherboard and chipset differences from the rest of the kernel. (Windows runs on x64 and ARM64 because Microsoft builds separate versions for each, not because the HAL makes one binary run everywhere.)',
        ],
      },
      {
        heading: 'Kernel Objects & Handles: The Hotel Keycard Analogy',
        body: [
          'Whenever the Kernel opens a file, registry key, process, or thread, the **Object Manager** creates a data structure inside Kernel Mode memory called a **Kernel Object**.',
          'Because User Mode code is never allowed to read or write Kernel Mode memory directly, the kernel cannot give Notepad a memory pointer to that file object. Instead, it gives Notepad a **Handle** - a simple index number (like `0x000001A4`) in the process’s Handle Table.',
          'Think of a Handle like a **hotel keycard**: when you check in (open a file), the front desk checks your ID (Security Reference Monitor checks your Access Token) and hands you a plastic keycard valid only for Room 304 (Read/Write). Every time you want to read or write the file, you present that keycard handle to `NTDLL.DLL`.',
        ],
      },
    ],
    calloutNotes: [
      {
        type: 'key',
        title: 'The One-Sentence Version',
        body: 'User Mode apps can never touch hardware directly, they present a Handle to `NTDLL.DLL`, which executes a System Call into `ntoskrnl.exe` in Kernel Mode.',
      },
      {
        type: 'try',
        title: 'Step Through the Interactive Syscall Animator Below',
        body: 'Use the interactive **System Call Animator** below to step from `Notepad.exe` through `NTDLL.DLL`, `ntoskrnl.exe`, `ntfs.sys`, and the HAL all the way to the physical disk.',
      },
      {
        type: 'pro',
        title: 'Security Lens: Why Red Teams Talk About "Direct Syscalls"',
        body: 'Endpoint Detection & Response (EDR) tools often monitor User Mode by placing hooks inside `NTDLL.DLL` to inspect API calls before they reach the kernel. Advanced attackers sometimes attempt "direct syscalls" to bypass user-mode hooks, which is why modern security products also collect telemetry from inside the kernel (for example through kernel callbacks and event tracing) instead of trusting user-mode hooks alone.',
      },
    ],
    commandBreakdowns: [
      {
        cmdlet: 'Get-CimInstance',
        aliases: ['gcim'],
        syntax: 'Get-CimInstance [-ClassName] <String> [-Filter <String>]',
        parameters: [
          {
            name: '-ClassName',
            type: 'String',
            description: 'Specifies the WMI/CIM class to query (such as Win32_SystemDriver for kernel drivers).',
          },
        ],
        examples: ['Get-CimInstance Win32_SystemDriver | Where-Object State -eq "Running"'],
      },
    ],
    codeExamples: [
      {
        title: 'Listing Running Kernel-Mode Drivers (.sys) vs User-Mode Services',
        description: 'Use Get-CimInstance Win32_SystemDriver to inspect actual Ring 0 kernel drivers loaded in memory.',
        code: `# Inspect running Ring 0 Kernel Drivers (.sys files)
Get-CimInstance Win32_SystemDriver |
  Where-Object State -eq 'Running' |
  Select-Object -First 8 Name, DisplayName, StartMode, PathName`,
        output: `Name      DisplayName                        StartMode PathName
----      -----------                        --------- --------
ACPI      Microsoft ACPI Driver              Boot      \\SystemRoot\\System32\\drivers\\ACPI.sys
Disk      Disk Driver                        Boot      \\SystemRoot\\System32\\drivers\\disk.sys
KSecDD    KSecDD                             Boot      \\SystemRoot\\System32\\Drivers\\ksecdd.sys
MountMgr  Mount Point Manager                Boot      \\SystemRoot\\System32\\drivers\\mountmgr.sys
NDIS      NDIS System Driver                 Boot      \\SystemRoot\\system32\\drivers\\ndis.sys
Ntfs      Ntfs                               Manual    \\SystemRoot\\system32\\drivers\\Ntfs.sys
partmgr   Partition Manager                  Boot      \\SystemRoot\\System32\\drivers\\partmgr.sys
volmgr    Volume Manager Driver              Boot      \\SystemRoot\\System32\\drivers\\volmgr.sys`,
      },
    ],
    mistakesAndTraps: [
      {
        mistake: 'Assuming Windows background services (`svchost.exe`, `lsass.exe`) run in Kernel Mode.',
        cause: 'Confusing "runs as SYSTEM privilege" with "runs in Ring 0 Kernel Mode".',
        fix: 'Remember: `svchost.exe`, `services.exe`, and `lsass.exe` are still **User Mode (Ring 3)** `.exe` processes! Only `ntoskrnl.exe`, `hal.dll`, and `.sys` drivers run in Kernel Mode (Ring 0).',
      },
    ],
    tryItYourself: [
      'Click through all 5 stages of the **System Call Animator** widget on this page and watch how `NTDLL.DLL` bridges Ring 3 and Ring 0.',
      'Run `(Get-Process -Id $PID).Modules | Where-Object ModuleName -match "ntdll|kernel32"` in PowerShell to prove that your own PowerShell process has `ntdll.dll` and `kernel32.dll` loaded in User Mode.',
    ],
    knowledgeCheck: [
      {
        question: 'Which DLL sits at the very bottom of User Mode (Ring 3) and executes the CPU SYSCALL instruction to enter Kernel Mode?',
        options: ['explorer.exe', 'ntdll.dll', 'notepad.exe', 'cmd.exe'],
        correctIndex: 1,
        explanation: 'NTDLL.DLL is the native User Mode gatekeeper that transitions calls across the boundary into ntoskrnl.exe.',
      },
      {
        question: 'Which Executive Manager inside ntoskrnl.exe verifies your Access Token against a file’s permissions before allowing a handle to be opened?',
        options: [
          'Plug and Play Manager',
          'Security Reference Monitor (SRM)',
          'Disk Defragmenter',
          'Task Manager',
        ],
        correctIndex: 1,
        explanation: 'The Security Reference Monitor (SRM) enforces access control checks across all kernel objects.',
      },
    ],
  },

  {
    id: '2-2',
    chapterId: 'chapter-02',
    slug: 'system-processes-and-service-accounts',
    title: 'The 7 Core System Processes, Service Accounts & Hunting Imposters',
    subtitle: 'Interactive boot process lineup, the 3 forensic red flags, and least-privilege service accounts',
    estimatedMinutes: 25,
    diagramId: 'system-processes-stepper',
    secondaryDiagramId: 'malware-process-hunter',
    oneSentenceSummary:
      'Every healthy Windows machine boots the exact same 7 core system processes in the exact same parent-child order, memorize their true paths and parents, and malware imposters have nowhere to hide.',
    summary:
      'How do incident responders look at a machine with 180 running processes and spot a trojan in 10 seconds? They know the baseline! In this lesson, we step through the 7 core Windows system processes in boot order (`SYSTEM` PID 4, `SMSS`, `WININIT`, `SERVICES`, `LSASS`, `WINLOGON`, `SVCHOST`), test your eye in the interactive **Malware Process Hunter** game, and compare the three built-in service accounts (`LocalSystem`, `LocalService`, `NetworkService`).',
    whyItMatters:
      'Attackers love naming their malware `svchost.exe`, `svch0st.exe`, or `lsass.exe` so administrators are afraid to kill it. Once you know that real `svchost.exe` is ALWAYS spawned by `services.exe` from `C:\\Windows\\System32\\` and real `lsass.exe` only ever has 1 instance, imposters become easy to spot.',
    learningObjectives: [
      'List the 7 core Windows system processes in boot order along with their legitimate image path and parent process',
      'Spot malicious imposter processes using the 3 Forensic Rules: Spelling/Lookalikes, Image Path (`C:\\Windows\\System32`), and Parent Process lineage',
      'Explain why `LSASS.EXE` is the #1 credential-dumping target for attackers (Mimikatz) and why Credential Guard isolates it',
      'Choose the least-privileged service account (`LocalService` vs `NetworkService` vs `LocalSystem`) when running background services',
    ],
    keyTerms: [
      'SYSTEM (PID 4)',
      'SMSS.EXE (Session Manager)',
      'WININIT.EXE & WINLOGON.EXE',
      'SERVICES.EXE (Service Control Manager)',
      'LSASS.EXE (Local Security Authority)',
      'SVCHOST.EXE (Service Host)',
    ],
    conceptSections: [
      {
        heading: 'The 7 Core Windows System Processes (In Boot Order)',
        body: [
          'Every time Windows boots, these 7 processes start in a strict hierarchy:\n1. **`SYSTEM` (Always PID 4):** The home for Kernel Mode threads. Parent: `System Idle Process (PID 0)`. Path: `ntoskrnl.exe`.\n2. **`SMSS.EXE` (Session Manager Subsystem):** The very first User-Mode process! Spawned by `SYSTEM (PID 4)`. It creates **Session 0** (isolated background services) and **Session 1+** (your interactive desktop).\n3. **`WININIT.EXE` (Windows Initialization):** Created in Session 0 by a short-lived copy of `smss.exe`. That copy exits soon after, so Process Explorer shows `wininit.exe` with no parent (this is normal). Its job is to launch the two pillars of Session 0: `services.exe` and `lsass.exe`.\n4. **`SERVICES.EXE` (Service Control Manager - SCM):** Spawned by `wininit.exe`. Starts, stops, and manages all Windows services and is the **only legitimate parent of `svchost.exe`**.\n5. **`LSASS.EXE` (Local Security Authority Subsystem Service):** Spawned by `wininit.exe` (exactly **1 instance**). Validates passwords, generates Security Access Tokens, and holds Kerberos tickets and NTLM hashes. Because of this, attackers target `lsass.exe` with tools like Mimikatz.\n6. **`WINLOGON.EXE` (Windows Logon Manager):** Created in the first interactive session (Session 1) by a short-lived copy of `smss.exe`, so it also shows no parent in Process Explorer (normal). Manages the `Ctrl+Alt+Del` Secure Attention Sequence (SAS) logon screen and starts `userinit.exe` → `explorer.exe`.\n7. **`SVCHOST.EXE` (Service Host):** Spawned by `services.exe` (dozens of instances). Hosts Windows services packaged inside `.dll` files so a crash in one service doesn’t take down others.',
          'One more core process worth knowing is `CSRSS.EXE` (Client/Server Runtime Subsystem). There is one instance per session, it is also created by `smss.exe`, and it shows no parent either. That is why the list above is a learning set of 7, not every system process.',
        ],
      },
      {
        heading: 'My 3 Forensic Rules for Catching Imposters',
        body: [
          'Whenever I inspect a suspicious process in Process Explorer or PowerShell, I ask three questions:\n1. **Is the spelling exact?** Attackers use zero-for-O (`svch0st.exe`) or capital-I-for-L (`Isass.exe`).\n2. **Is it living in `C:\\Windows\\System32\\`?** All 6 user-mode core executables (`smss`, `wininit`, `services`, `lsass`, `winlogon`, `svchost`) live inside `C:\\Windows\\System32\\`. If you ever see `svchost.exe` running from `C:\\Users\\Public\\`, `C:\\Temp\\`, or `AppData`, **it is almost certainly malware**.\n3. **Who is its Parent Process?** If `svchost.exe` was launched by `cmd.exe`, `powershell.exe`, or `explorer.exe` instead of `services.exe`, sound the alarm. (This check works for `svchost.exe`, `services.exe` and `lsass.exe`. `wininit.exe`, `winlogon.exe` and `csrss.exe` legitimately show no parent, so check their path, session and signature instead.)',
        ],
      },
      {
        heading: 'Background Service Accounts: LocalSystem vs. LocalService vs. NetworkService',
        body: [
          'Background services run inside **Session 0** even when no human is logged into the server. Which identity do they use? Windows provides three built-in service accounts:\n• **`LocalSystem` (`NT AUTHORITY\\SYSTEM`):** God-mode on the local machine, **and** presents the computer’s own Active Directory account (`DOMAIN\\SERVER01$`) on the network. If a service running as `LocalSystem` gets exploited, the attacker immediately owns the entire server.\n• **`NetworkService` (`NT AUTHORITY\\NETWORK SERVICE`):** Has limited, standard-user permissions on the local machine, **plus** can authenticate across the network as the computer account (`DOMAIN\\SERVER01$`).\n• **`LocalService` (`NT AUTHORITY\\LOCAL SERVICE`):** The safest choice for services that don’t need network auth. Limited local permissions, and **anonymous (untrusted)** on the network.',
        ],
      },
    ],
    calloutNotes: [
      {
        type: 'key',
        title: 'The One-Sentence Version',
        body: '`SYSTEM (PID 4)` → `smss.exe` → `wininit.exe` → (`services.exe` → `svchost.exe`) & (`lsass.exe`). A core process running from outside `C:\\Windows\\System32` is an imposter.',
      },
      {
        type: 'try',
        title: 'Play the Interactive Malware Process Hunter Below!',
        body: 'Scroll down to the **Spot the Malware Imposter** widget and inspect all 10 processes in the live tree. Can you find both malicious imposters without flagging a single legitimate Windows process?',
      },
      {
        type: 'danger',
        title: 'Protect LSASS at All Costs',
        body: 'Because `lsass.exe` caches credentials in memory to support Single Sign-On, Windows 11 and modern Windows Server use **Credential Guard** (Virtualization-Based Security) and **RunAsPPL** (Protected Process Light) so even an Administrator cannot dump `lsass.exe` memory.',
      },
    ],
    commandBreakdowns: [
      {
        cmdlet: 'Get-Service',
        aliases: ['gsv'],
        syntax: 'Get-Service [[-Name] <String[]>] [-DisplayName <String[]>]',
        parameters: [
          {
            name: '-Name',
            type: 'String[]',
            description: 'Specifies the short service name(s) to retrieve (e.g., wuauserv, bits, WinRM).',
          },
        ],
        examples: ['Get-Service | Where-Object Status -eq "Running"'],
      },
    ],
    codeExamples: [
      {
        title: 'Auditing Core System Process Paths & Service Accounts with PowerShell',
        description: 'Hunt for any core system process running outside C:\\Windows\\System32 and check which account each service runs under. The output below is sample output for part 2 only (the counts differ on every machine); part 1 prints nothing when all paths are correct.',
        code: `# 1. Run this in an elevated (Administrator) window: otherwise ExecutablePath is blank
#    for protected processes such as lsass.exe and they are falsely flagged.
#    Verify ExecutablePath and ParentProcessId of all svchost.exe and lsass.exe instances
#    (prints nothing when every path is correct)
Get-CimInstance Win32_Process -Filter "Name = 'svchost.exe' OR Name = 'lsass.exe'" |
  Where-Object { $_.ExecutablePath -ne 'C:\\Windows\\System32\\' + $_.Name } |
  Select-Object ProcessId, ParentProcessId, Name, ExecutablePath

# 2. Group running Windows services by the Account (StartName) they run under
Get-CimInstance Win32_Service -Filter "State = 'Running'" |
  Group-Object StartName |
  Select-Object Count, Name |
  Sort-Object Count -Descending`,
        output: `Count Name
----- ----
   84 LocalSystem
   52 NT AUTHORITY\\LocalService
   29 NT AUTHORITY\\NetworkService`,
      },
    ],
    mistakesAndTraps: [
      {
        mistake: 'Killing a real `svchost.exe` or `lsass.exe` in `C:\\Windows\\System32` thinking it is bloatware.',
        cause: 'Seeing 60+ `svchost.exe` processes in Task Manager and assuming multiple instances are abnormal.',
        fix: 'Having 50 to 80 `svchost.exe` processes in `C:\\Windows\\System32` spawned by `services.exe` is completely normal on modern Windows, Windows splits services into separate hosts for stability and security.',
      },
    ],
    tryItYourself: [
      'Complete both the **7 Core System Processes Stepper** and the **Malware Process Hunter** challenge below.',
      'Run `Get-CimInstance Win32_Process -Filter "Name = \'lsass.exe\'" | Select-Object ProcessId, ParentProcessId, ExecutablePath` on your machine and verify which PID is its parent (`wininit.exe`). Run it in an elevated window, otherwise `ExecutablePath` shows blank for `lsass.exe`.',
    ],
    knowledgeCheck: [
      {
        question: 'Which process is the ONLY legitimate parent of svchost.exe?',
        options: ['explorer.exe', 'services.exe (Service Control Manager)', 'cmd.exe', 'winlogon.exe'],
        correctIndex: 1,
        explanation: 'All legitimate svchost.exe processes are spawned by services.exe (the Service Control Manager) from C:\\Windows\\System32\\svchost.exe.',
      },
      {
        question: 'If you are configuring a background service that only reads local log files and NEVER needs to authenticate over the network, which service account follows Least Privilege?',
        options: ['LocalSystem', 'Domain Admin', 'LocalService', 'NetworkService'],
        correctIndex: 2,
        explanation: 'LocalService has restricted local user permissions and presents anonymous credentials on the network, minimizing blast radius.',
      },
    ],
  },

  {
    id: '2-3',
    chapterId: 'chapter-02',
    slug: 'boot-chain-uefi-gpt-defenses',
    title: 'From Power Button to Logon: BIOS/MBR vs UEFI/GPT, Boot Phases & Defenses',
    subtitle: 'Interactive 512-byte MBR inspector, the 4 boot phases, Secure Boot, Trusted Boot, ELAM, Measured Boot, and WinGet',
    estimatedMinutes: 20,
    diagramId: 'mbr-byte-inspector',
    oneSentenceSummary:
      'Modern Windows replaced the fragile 512-byte BIOS/MBR Sector 0 with UEFI + GPT so hardware cryptographic checks (Secure Boot → Trusted Boot → ELAM → Measured Boot) can verify every single stage before the kernel runs.',
    summary:
      'What happens in the five seconds between pressing the physical power button and seeing the Windows logon screen? In this lesson, we dissect the 512-byte Master Boot Record (MBR) to see why legacy BIOS was limited to 4 partitions and 2 TB disks, compare it with modern UEFI + GPT, trace the 4 Windows Boot Phases, and learn how Windows 11 stops rootkits before the OS is even awake.',
    whyItMatters:
      'Whether you are troubleshooting an "Operating System Not Found" boot failure, converting a server disk to GPT, or explaining why Windows 11 mandates UEFI Secure Boot and TPM 2.0, mastering the boot chain helps you diagnose boot failures quickly and explain the reasoning behind these requirements.',
    learningObjectives: [
      'Dissect the 512 bytes of a legacy MBR Sector 0 (446B Bootstrap, 64B Partition Table = 4 × 16B, 2B `0x55AA` magic signature)',
      'Contrast Legacy BIOS + MBR (2 TB limit, 4 partitions, no signature checks) with Modern UEFI + GPT (up to 128 partition entries by default on Windows, backup headers, Secure Boot)',
      'Trace the 4 Windows Boot Phases: Pre-Boot → Windows Boot Manager (`bootmgfw.efi`) → OS Loader (`winload.efi`) → Kernel Init (`ntoskrnl.exe`)',
      'Explain the 4-layer Boot Defense relay race: Secure Boot, Trusted Boot, ELAM (Early Launch Anti-Malware), and Measured Boot (TPM)',
    ],
    keyTerms: [
      'BIOS + MBR (Sector 0, 512 Bytes)',
      'UEFI + GPT (GUID Partition Table)',
      'bootmgfw.efi & BCD (Boot Configuration Data)',
      'winload.efi (Windows OS Loader)',
      'Secure Boot & Trusted Boot',
      'ELAM (Early Launch Anti-Malware) & Measured Boot',
    ],
    conceptSections: [
      {
        heading: 'Legacy BIOS + MBR (512 Bytes) vs. Modern UEFI + GPT',
        body: [
          'For thirty years, PCs booted using **BIOS** (1980s 16-bit firmware) paired with an **MBR (Master Boot Record)** disk layout. When you pressed the power button, BIOS blindly read the very first 512-byte sector of the hard drive (**Sector 0**) into RAM and executed whatever raw CPU instructions sat there.',
          'Let’s do the exact math of those **512 bytes** in Sector 0:\n• **Bytes 0 to 445 (446 bytes):** Tiny bootstrap machine code.\n• **Bytes 446 to 509 (64 bytes):** The Partition Table. Each partition entry requires **16 bytes** (`64 ÷ 16 = 4`), which is why MBR disks can only ever have **4 primary partitions**! And because MBR uses 32-bit sector addresses, it hits a hard wall at **2 TB**.\n• **Bytes 510 to 511 (2 bytes):** The Boot Signature (`0x55AA`).\n• **The Fatal Flaw:** If a single disk scratch or a "Bootkit" virus overwrote Sector 0, the PC was either unbootable or infected *before* Windows or antivirus even existed in RAM.',
          'Modern computers replace BIOS/MBR with **UEFI (Unified Extensible Firmware Interface)** paired with **GPT (GUID Partition Table)**:\n• Windows reserves **128 partition entries** by default, and GPT supports disks far beyond 2 TB (the theoretical limit is in the zettabyte range).\n• Stores a **backup copy of the GPT partition table** at the very end of the disk, plus CRC32 checksums to self-heal corruption.\n• Boots normal `.efi` files from a dedicated FAT32 **EFI System Partition (ESP)** and verifies cryptographic digital signatures (**Secure Boot**).',
        ],
      },
      {
        heading: 'The 4 Phases of the Windows Boot Sequence',
        body: [
          'Every modern Windows boot walks through four distinct phases:\n• **Phase 1 - Pre-Boot (UEFI Firmware):** You press Power. UEFI runs POST (Power-On Self-Test) to check RAM, CPU, and storage, initializes hardware, verifies signatures via Secure Boot, and launches the Windows Boot Manager from the EFI System Partition.\n• **Phase 2 - Windows Boot Manager (`bootmgfw.efi`):** Reads the **BCD (Boot Configuration Data)** database to determine which Windows installation to boot (and displays the boot menu if you dual-boot), then hands control to the OS Loader.\n• **Phase 3 - Windows OS Loader (`winload.efi`):** Loads the core Kernel (`ntoskrnl.exe`), the HAL (`hal.dll`), the `SYSTEM` Registry hive, and all **Boot-start `.sys` drivers** (like NTFS and NVMe storage drivers) into RAM.\n• **Phase 4 - Windows NT OS Kernel Initialization (`ntoskrnl.exe`):** The kernel takes over! It initializes the Executive managers, starts `SMSS.EXE`, which spawns `WININIT.EXE` (`services.exe` + `lsass.exe`) and `WINLOGON.EXE` - bringing you to the sign-in screen.',
        ],
      },
      {
        heading: 'The 4-Stage Boot Defense Relay Race & Modern Tooling (WinGet)',
        body: [
          'How does Windows 11 make sure a rootkit hasn’t hijacked the boot chain? Four defenses pass the baton like a relay race:\n1. **Secure Boot (UEFI Hardware):** UEFI firmware checks the digital signature of `bootmgfw.efi` and `winload.efi` before executing them. Unsigned bootkits are blocked cold.\n2. **Trusted Boot (`winload.efi`):** Once `winload.efi` takes over, it verifies the cryptographic signature of `ntoskrnl.exe` and every boot-start driver.\n3. **ELAM (Early Launch Anti-Malware):** The **very first** third-party driver the kernel initializes is your antivirus/Defender ELAM driver. Because ELAM wakes up *before* any other non-Microsoft driver, it inspects every subsequent driver and blocks known-bad rootkits from loading.\n4. **Measured Boot (TPM 2.0):** Throughout the entire boot, hashes of every firmware, bootloader, and driver stage are recorded inside the hardware **TPM (Trusted Platform Module)** chip so BitLocker and security tools can prove the boot wasn’t tampered with.',
          'Once your system is booted and you log in, how do you install tools like Process Explorer without clicking shady download buttons in a web browser? Using **`winget`** (the official Windows Package Manager, built into current Windows 10/11): `winget install Microsoft.Sysinternals.ProcessExplorer`. This installs only Process Explorer, not the whole Sysinternals Suite.',
        ],
      },
    ],
    calloutNotes: [
      {
        type: 'key',
        title: 'The One-Sentence Version',
        body: 'UEFI → `bootmgfw.efi` (reads BCD) → `winload.efi` (loads kernel & drivers) → `ntoskrnl.exe` (spawns `smss.exe` → `winlogon.exe`), guarded end-to-end by Secure Boot, Trusted Boot, ELAM, and TPM Measured Boot.',
      },
      {
        type: 'try',
        title: 'Explore the 512-Byte MBR vs. UEFI/GPT Inspector Below',
        body: 'Click each byte segment (`0x000 to 0x1BD`, `0x1BE, 0x1FD`, `0x1FE, 0x1FF`) in the interactive **MBR Byte Inspector** below and switch to the UEFI + GPT comparison view.',
      },
      {
        type: 'pro',
        title: 'Quick Mnemonic for the 4 Boot Defenses: S → T → E → M',
        body: 'Remember **STEM** in exact chronological order: **S**ecure Boot (firmware checks bootloader) → **T**rusted Boot (bootloader checks kernel) → **E**LAM (AV driver checks third-party drivers) → **M**easured Boot (TPM records cryptographic hashes of the whole chain).',
      },
    ],
    commandBreakdowns: [
      {
        cmdlet: 'Get-Disk',
        aliases: [],
        syntax: 'Get-Disk [[-Number] <UInt32[]>]',
        parameters: [
          {
            name: '-Number',
            type: 'UInt32[]',
            description: 'Specifies the disk number(s) to inspect. Look at the PartitionStyle property (GPT vs MBR).',
          },
        ],
        examples: ['Get-Disk | Select-Object Number, FriendlyName, PartitionStyle, Size, OperationalStatus'],
      },
      {
        cmdlet: 'Confirm-SecureBootUEFI',
        aliases: [],
        syntax: 'Confirm-SecureBootUEFI',
        parameters: [],
        examples: ['Confirm-SecureBootUEFI'],
      },
    ],
    codeExamples: [
      {
        title: 'Checking Disk Partition Style (GPT vs MBR), Secure Boot, and TPM Status',
        description: 'Verify that your machine is booted in modern UEFI mode with GPT partitioning, Secure Boot enabled, and a healthy TPM 2.0 chip. Run it in an elevated (Administrator) window: Confirm-SecureBootUEFI and Get-Tpm need elevation, and Confirm-SecureBootUEFI throws an error on a legacy BIOS machine. The output is sample output from a UEFI machine.',
        code: `# 1. Check whether disks use modern GPT or legacy MBR
Get-Disk | Select-Object Number, FriendlyName, PartitionStyle,
  @{Name='Size_GB';Expression={[math]::Round($_.Size / 1GB, 1)}}

# 2. Check if UEFI Secure Boot is currently enabled
Confirm-SecureBootUEFI

# 3. Check the TPM chip
Get-Tpm | Select-Object TpmPresent, TpmReady

# 4. Inspect the EFI System Partition (ESP) and Windows partitions
Get-Partition -DiskNumber 0 | Select-Object PartitionNumber, DriveLetter, Type, Size

# 5. Optional, installs software: install Process Explorer (only that tool, not the whole Sysinternals Suite)
winget install --id Microsoft.Sysinternals.ProcessExplorer --silent`,
        output: `Number FriendlyName          PartitionStyle Size_GB
------ ------------          -------------- -------
     0 NVMe Samsung SSD 990  GPT              512.0

True

TpmPresent TpmReady
---------- --------
      True     True

PartitionNumber DriveLetter Type     Size
--------------- ----------- ----     ----
              1             System   104857600
              2             Reserved 16777216
              3           C Basic    548966092800`,
      },
    ],
    mistakesAndTraps: [
      {
        mistake: 'Confusing `bootmgfw.efi` (Boot Manager) with `winload.efi` (OS Loader).',
        cause: 'Both live in the boot chain and end in `.efi`.',
        fix: 'Remember: `bootmgfw.efi` reads the **BCD** and picks *which* OS to boot; `winload.efi` loads **`ntoskrnl.exe`**, `hal.dll`, and boot-start drivers into RAM.',
      },
    ],
    tryItYourself: [
      'Click through the **512-Byte MBR Sector 0 Inspector** below to see why `64 bytes ÷ 16 bytes = 4 primary partitions`.',
      'Run `Get-Disk` in PowerShell on your computer and check whether `PartitionStyle` says `GPT` or `MBR`.',
    ],
    knowledgeCheck: [
      {
        question: 'Why can a legacy MBR disk have at most 4 primary partitions?',
        options: [
          'Because Windows only supports 4 drive letters',
          'Because Sector 0 is 512 bytes total, and only 64 bytes are reserved for the partition table (4 entries × 16 bytes each)',
          'Because UEFI blocks more than 4 partitions',
          'Because hard drives only have 4 platters',
        ],
        correctIndex: 1,
        explanation: 'In the 512-byte Master Boot Record, 446 bytes are bootstrap code, 2 bytes are 0x55AA, and 64 bytes hold the partition table (4 entries × 16 bytes = 64 bytes).',
      },
      {
        question: 'In the 4-stage Windows boot defense chain (STEM), what is the specific role of ELAM (Early Launch Anti-Malware)?',
        options: [
          'It replaces the UEFI motherboard chip',
          'It initializes as the very first kernel driver so it can inspect and block malicious third-party boot drivers before they load',
          'It formats the hard drive on every boot',
          'It encrypts user emails',
        ],
        correctIndex: 1,
        explanation: 'ELAM starts before any other third-party driver in Phase 3/4 so it can evaluate the health and signature of every subsequent boot driver.',
      },
    ],
  },

  // ==========================================================================
  // CHAPTER 3: THE OBJECT REVOLUTION: WHY I STOPPED PARSING TEXT
  // ==========================================================================
  {
    id: '3-1',
    chapterId: 'chapter-03',
    slug: 'what-is-powershell',
    title: 'What PowerShell Actually Is, The DRY Principle & 5.1 vs 7',
    subtitle: 'Why Jeffrey Snover’s Monad replaced fragile text parsing, the three workspaces, and version differences that matter',
    estimatedMinutes: 18,
    oneSentenceSummary:
      'PowerShell is a two-in-one engine, an interactive command shell and a full `.NET` scripting language, that passes live objects instead of fragile text lines.',
    summary:
      'You can start this lesson without Chapters 1 and 2: everything you need is explained here. Now I’m handing you the steering wheel that controls one machine or ten thousand at once. We explore why Jeffrey Snover invented PowerShell (codenamed Monad), why the DRY ("Don’t Repeat Yourself") philosophy drives everything I automate, which of the three PowerShell environments to use, and the differences between Windows PowerShell 5.1 and the current PowerShell 7 LTS release. Windows PowerShell 5.1 is already installed on your PC and is perfectly fine for this course.',
    whyItMatters:
      'Clicking through GUI wizards works when you create one user account. When you have to create 400 accounts, audit 80 servers, or configure a headless Windows Server Core VM with no mouse or desktop, GUI admins click for hours while a PowerShell engineer runs one short script.',
    learningObjectives: [
      'Explain why PowerShell is both an interactive CLI shell and a full scripting language built on .NET',
      'Apply the DRY (Don’t Repeat Yourself) principle to decide when to automate a task',
      'Compare the three PowerShell workspaces: CLI Console, Windows PowerShell ISE (legacy), and Visual Studio Code',
      'Contrast Windows PowerShell 5.1 (`powershell.exe`, .NET Framework 4.x, Windows-only) with PowerShell 7.x (`pwsh.exe`, modern .NET, cross-platform)',
    ],
    keyTerms: [
      'Monad Manifesto (Jeffrey Snover)',
      'DRY (Don’t Repeat Yourself)',
      'Windows PowerShell 5.1 (Desktop Edition)',
      'PowerShell 7 (Core Edition / pwsh.exe)',
      '.NET Runtime & CLR',
      '$PSVersionTable',
    ],
    conceptSections: [
      {
        heading: 'Why Traditional Shells Failed on Windows (The Monad Story)',
        body: [
          'On Linux, almost all configuration lives inside plain-text files (`/etc/ssh/sshd_config`, `/etc/passwd`), so classic text tools like `grep`, `awk`, and `sed` work great. On Windows, however, configuration lives inside rich binary APIs: the Registry, Active Directory, WMI/CIM, and the Certificate Store.',
          'For years, Windows admins only had `cmd.exe` (a carryover from 1980s MS-DOS). In 2002, Microsoft architect **Jeffrey Snover** published the famous **Monad Manifesto**. His breakthrough idea was simple: instead of commands spitting out dead lines of text that you have to chop up by counting spaces, **every command should output live, structured `.NET` objects!**',
          'That made PowerShell a **two-in-one tool**:\n1. **An Interactive Command Shell:** Type a quick one-liner to inspect or fix a server right now.\n2. **A Full Scripting Language:** Combine commands with variables, loops, error handling, and `.NET` classes inside `.ps1` scripts.',
        ],
      },
      {
        heading: 'The DRY Principle & Choosing Your Workspace',
        body: [
          'Every great systems engineer lives by **DRY: Don’t Repeat Yourself**. If I catch myself doing the same manual task three times, I write a script so the computer does it the next ten thousand times without typos.',
          'Where do you write and run PowerShell? You have three environments:\n1. **The PowerShell CLI (Console inside Windows Terminal):** Fast, lightweight, and available on every server (including headless Server Core). Best for interactive commands.\n2. **Windows PowerShell ISE (`powershell_ise.exe`):** Built into Windows (`Ctrl+R` toggles the script pane, `F5` runs the script, `F8` runs just the highlighted lines). **Important:** Microsoft stopped updating ISE after PowerShell 5.1, it cannot run PowerShell 7!\n3. **Visual Studio Code (VS Code) + PowerShell Extension:** My daily driver for writing scripts. Full IntelliSense, integrated debugger, Git integration, and works with PowerShell 7 across Windows, Linux, and macOS.',
        ],
      },
      {
        heading: 'Windows PowerShell 5.1 vs. PowerShell 7: Side by Side',
        body: [
          'You will encounter two editions of PowerShell in the real world, and they can live side-by-side on the same PC:\n• **Windows PowerShell 5.1 (`powershell.exe`):** Ships pre-installed in every copy of Windows 10/11 and Windows Server (`PSEdition: Desktop`). Built on the legacy **.NET Framework 4.x**. Windows-only and feature-frozen (security patches only).\n• **PowerShell 7 (`pwsh.exe`):** Use the current LTS (long-term support) release. Installed separately via `winget install Microsoft.PowerShell` (`PSEdition: Core`). Built on **modern .NET**, open-source, runs on **Windows, Linux, and macOS**, and adds quality-of-life features like pipeline chain operators (`&&` runs the second command only if the first succeeded, `||` only if it failed), `ForEach-Object -Parallel`, and ternary operators (`? :`).',
        ],
      },
    ],
    calloutNotes: [
      {
        type: 'key',
        title: 'The One-Sentence Version',
        body: 'Windows PowerShell 5.1 (`powershell.exe`) comes built into Windows on `.NET Framework`; PowerShell 7 (`pwsh.exe`) is the modern, cross-platform engine built on `.NET Core`.',
      },
      {
        type: 'try',
        title: 'Check Which Engine You Are In Right Now',
        body: 'Type `$PSVersionTable` and press Enter. Look at two lines: `PSVersion` (`5.1.x` vs `7.x.x`) and `PSEdition` (`Desktop` vs `Core`).',
      },
      {
        type: 'gotcha',
        title: 'Why Both 5.1 and 7 Matter',
        body: 'When you connect to a Windows Server Core machine for the first time, you land at a plain `cmd.exe` prompt (on Server 2022 and later, the SConfig menu opens automatically). Type `powershell` to start Windows PowerShell 5.1 (`powershell.exe`); PowerShell 7 is not there unless someone installed it. Always know which features are 7-only (like `&&`) so your scripts never break on a bare server!',
      },
    ],
    commandBreakdowns: [
      {
        cmdlet: '$PSVersionTable',
        aliases: [],
        syntax: '$PSVersionTable',
        parameters: [
          {
            name: 'PSVersion',
            type: 'Version (Property)',
            description: 'Displays the exact PowerShell engine version (e.g., 5.1.26100.x for Windows PowerShell or 7.x.x for PowerShell 7).',
          },
          {
            name: 'PSEdition',
            type: 'String (Property)',
            description: 'Returns Desktop for Windows PowerShell 5.1 or Core for PowerShell 7+.',
          },
        ],
        examples: ['$PSVersionTable', '$PSVersionTable.PSVersion'],
      },
    ],
    codeExamples: [
      {
        title: 'Inspecting $PSVersionTable and Installing PowerShell 7 via WinGet',
        description: 'Check your active PowerShell edition. Step 3 is optional and installs or upgrades PowerShell 7 from the terminal. The output is sample output from a PowerShell 7 session (Windows PowerShell 5.1 shows PSVersion 5.1.x and PSEdition Desktop instead).',
        code: `# 1. Inspect the active PowerShell engine details
$PSVersionTable

# 2. Access just the version number or edition property
$PSVersionTable.PSVersion
$PSVersionTable.PSEdition

# 3. Optional (changes your system): install or update PowerShell 7 using WinGet
winget install --id Microsoft.PowerShell --source winget`,
        output: `Name                           Value
----                           -----
PSVersion                      7.4.6
PSEdition                      Core
GitCommitId                    7.4.6
OS                             Microsoft Windows 10.0.26100
Platform                       Win32NT
PSCompatibleVersions           {1.0, 2.0, 3.0, 4.0...}
PSRemotingProtocolVersion      2.3
SerializationVersion           1.1.0.1
WSManStackVersion              3.0`,
      },
    ],
    mistakesAndTraps: [
      {
        mistake: 'Trying to run PowerShell 7 scripts inside the old Windows PowerShell ISE.',
        cause: 'ISE is hardcoded to the legacy Windows PowerShell 5.1 engine.',
        fix: 'Use Visual Studio Code with the official PowerShell extension for PowerShell 7 development, or use the ISE only when targeting 5.1.',
      },
    ],
    tryItYourself: [
      'Run `$PSVersionTable` in your terminal and check whether `PSEdition` says `Desktop` (5.1) or `Core` (7.x).',
      'If you are in Windows PowerShell ISE, press `Ctrl+R` to toggle the script editor pane, highlight a single line of code, and press `F8` to run only the selection.',
    ],
    knowledgeCheck: [
      {
        question: 'What is the executable name for modern cross-platform PowerShell 7, and how does it differ from Windows PowerShell 5.1?',
        options: [
          'cmd.exe for PowerShell 7; bash.exe for 5.1',
          'pwsh.exe for PowerShell 7 (Core edition); powershell.exe for Windows PowerShell 5.1 (Desktop edition)',
          'powershell7.exe for 7; ps5.exe for 5.1',
          'Both versions use the exact same executable name',
        ],
        correctIndex: 1,
        explanation: 'PowerShell 7+ uses pwsh.exe so it can run side-by-side on the same machine without overwriting built-in Windows PowerShell 5.1 (powershell.exe).',
      },
      {
        question: 'What does the DRY principle stand for in automation?',
        options: [
          'Do Reboot Yearly',
          'Don’t Repeat Yourself',
          'Disk Recovery Yield',
          'Direct Registry YAML',
        ],
        correctIndex: 1,
        explanation: 'DRY (Don’t Repeat Yourself) means replacing repetitive manual work or copy-pasted code with reusable scripts and functions.',
      },
    ],
  },

  {
    id: '3-2',
    chapterId: 'chapter-03',
    slug: 'verb-noun-and-discovery',
    title: 'The Verb-Noun Law, Singular Nouns & Discovering Cmdlets',
    subtitle: 'Read a cmdlet like an English sentence, use wildcards with Get-Command, and understand why aliases can trap you',
    estimatedMinutes: 18,
    diagramId: 'cmdlet-anatomy-svg',
    oneSentenceSummary:
      'Every native PowerShell cmdlet follows the strict `ApprovedVerb-SingularNoun` law (`Get-Process`, `New-LocalUser`, `Stop-Service`), so you can guess and discover commands you have never seen before.',
    summary:
      'In bash or `cmd.exe` (older command-line tools), command names look like random historical accidents (`ls`, `grep`, `awk`, `netstat`, `ipconfig`). You do not need to know any of them. PowerShell abolished that chaos with one strict law: **Verb-Noun**. In this lesson, we dissect the anatomy of a cmdlet, learn why the Noun is ALWAYS singular, use `Get-Command` with wildcards (`*`) to find anything in seconds, and see why aliases (`ls`, `dir`, `%`, `?`) belong in interactive typing, never in saved scripts.',
    whyItMatters:
      'Once you know the Verb-Noun law and `Get-Command`, you can find the command you need on your own, even on a server with no internet access.',
    learningObjectives: [
      'Deconstruct any cmdlet invocation into Verb, Singular Noun, Parameter (`-Name`), and Argument',
      'Use `Get-Verb` and `Get-Command` (with `-Verb`, `-Noun`, and `*` wildcards) to discover cmdlets',
      'Save keystrokes and avoid typos using `Tab` auto-completion for cmdlets, parameters, and arguments',
      'Translate cryptic aliases (`dir`, `ls`, `gps`, `gsv`, `?`, `%`) into full cmdlet names using `Get-Alias`',
    ],
    keyTerms: [
      'Cmdlet (Command-let)',
      'Verb-Noun Naming Law',
      'Singular Noun Convention',
      'Get-Command (gcm)',
      'Get-Verb',
      'Alias (Get-Alias / gal)',
    ],
    conceptSections: [
      {
        heading: 'The Verb-Noun Law & Why the Noun Is Always Singular',
        body: [
          'Look at the visual anatomy diagram below for `Get-Process -Name explorer`. Every PowerShell cmdlet is built like a clear English sentence:\n• **Verb (The Action):** What you want to do, chosen from Microsoft’s official list of ~100 approved verbs (`Get`, `Set`, `New`, `Remove`, `Start`, `Stop`, `Restart`, `Enable`, `Disable`, `Test`, `Invoke`).\n• **Singular Noun (The Target):** The *single thing* you are acting on (`Process`, `Service`, `LocalUser`, `ADUser`, `NetIPAddress`, `FirewallRule`).',
          'Memorize this rule right now: **The Noun in a PowerShell cmdlet is ALWAYS singular!** Even when you want to list 200 processes or 300 services, the command is `Get-Process` (never `Get-Processes`) and `Get-Service` (never `Get-Services`).',
          'Why is this law so powerful? Suppose you walk up to a server and need to manage firewall rules or DNS records for the first time in your life. You already know the verb to inspect things is `Get`. You type `Get-Command *Firewall*` or `Get-Command -Verb Get -Noun *Dns*` (the `*` is a wildcard that matches any characters) - and PowerShell lists the matching cmdlets for you.',
        ],
      },
      {
        heading: 'Tab Completion & Discovering Anything with Get-Command',
        body: [
          'My #1 rule when teaching PowerShell is: **Type commands yourself, and let the `Tab` key do the heavy lifting.**\n• Type `Get-Pr` and press `Tab` → PowerShell completes `Get-Process`.\n• Type `Get-Process -N` and press `Tab` → PowerShell completes `-Name`.\n• Press `Ctrl+Space` after a dash (`Get-Process -`) to pop up an interactive menu of every parameter that cmdlet accepts!',
          'When you don’t know a cmdlet’s name, use **`Get-Command`** (part of my 3-tool Self-Reliance Pocketknife):\n• `Get-Command -Name *IP*` (or `Get-Command *IP*`) finds every command with `IP` in its name.\n• `Get-Command -Verb New -Noun *User*` finds every command that creates a user account.\n• `Get-Verb` lists all approved PowerShell verbs so you know whether Microsoft uses `Delete` or `Remove` (spoiler: it is always **`Remove`**, never `Delete`!).',
        ],
      },
      {
        heading: 'Aliases: Great Shortcuts at the Prompt, Dangerous in Scripts',
        body: [
          'To make Linux and `cmd.exe` veterans feel at home, PowerShell includes **Aliases** - nicknames that point to real cmdlets. For example, whether you type `dir`, `ls`, or `gci`, PowerShell actually runs **`Get-ChildItem`** under the hood.',
          'Here are the classic aliases you will see in the wild:\n• `dir` / `ls` / `gci` → `Get-ChildItem`\n• `cd` / `sl` → `Set-Location`\n• `cat` / `type` / `gc` → `Get-Content`\n• `gps` / `ps` → `Get-Process`\n• `gsv` → `Get-Service`\n• `?` / `where` → `Where-Object`\n• `%` / `foreach` → `ForEach-Object`\n• `select` → `Select-Object`\n• `gm` → `Get-Member`',
          'How do you look up an alias?\n• Know the alias (`dir`), want the real cmdlet? Run **`Get-Alias -Name dir`**.\n• Know the cmdlet (`Get-ChildItem`), want all its aliases? Run **`Get-Alias -Definition Get-ChildItem`**.',
        ],
      },
    ],
    calloutNotes: [
      {
        type: 'key',
        title: 'The One-Sentence Version',
        body: 'PowerShell cmdlets always use `ApprovedVerb-SingularNoun` (`Remove`, never `Delete`; `New`, never `Create`; `Get-Service`, never `Get-Services`).',
      },
      {
        type: 'try',
        title: 'Test Wildcard Discovery Right Now',
        body: 'Run `Get-Command -Verb Get -Noun *Net*` to see every network inspection cmdlet built into Windows.',
      },
      {
        type: 'gotcha',
        title: 'Get-Alias -Name vs. Get-Alias -Definition',
        body: 'Don’t mix these two up! Use `-Name` when you have the short nickname (`Get-Alias -Name gci`). Use `-Definition` when you have the full cmdlet name (`Get-Alias -Definition Get-ChildItem`).',
      },
    ],
    commandBreakdowns: [
      {
        cmdlet: 'Get-Command',
        aliases: ['gcm'],
        syntax: 'Get-Command [[-Name] <String[]>] [-Verb <String[]>] [-Noun <String[]>] [-Module <String[]>]',
        parameters: [
          {
            name: '-Name',
            type: 'String[]',
            description: 'Searches commands by name. Supports wildcards (*).',
          },
          {
            name: '-Verb',
            type: 'String[]',
            description: 'Filters cmdlets by their action verb (e.g., Get, Set, New, Remove).',
          },
          {
            name: '-Noun',
            type: 'String[]',
            description: 'Filters cmdlets by their target noun (supports wildcards like *User* or *Firewall*).',
          },
        ],
        examples: [
          'Get-Command -Name *Firewall*',
          'Get-Command -Verb New -Noun *User*',
          'Get-Command -Module NetTCPIP',
        ],
      },
      {
        cmdlet: 'Get-Alias',
        aliases: ['gal'],
        syntax: 'Get-Alias [[-Name] <String[]>] [-Definition <String[]>]',
        parameters: [
          {
            name: '-Name',
            type: 'String[]',
            description: 'Looks up the real cmdlet behind a short alias name (e.g., ls, gps, ?).',
          },
          {
            name: '-Definition',
            type: 'String[]',
            description: 'Finds all aliases that point to a specific full cmdlet (e.g., Get-ChildItem).',
          },
        ],
        examples: ['Get-Alias -Name ls', 'Get-Alias -Definition Get-ChildItem'],
      },
    ],
    codeExamples: [
      {
        title: 'Discovering Cmdlets with Wildcards and Resolving Aliases',
        description: 'Use Get-Verb, Get-Command, and Get-Alias to explore unknown commands without touching a search engine. The output is sample output from Windows PowerShell 5.1 (PowerShell 7 adds an AliasPrefix and Description column to Get-Verb).',
        code: `# 1. Check approved verbs that start with 'R' (Notice: Remove, Restart, Resume - no 'Delete'!)
Get-Verb -Verb R*

# 2. Find all cmdlets that deal with Local Users
Get-Command -Noun *LocalUser*

# 3. Resolve a short alias ('gci') to its real cmdlet
Get-Alias -Name gci

# 4. Find all aliases that point to Get-ChildItem
Get-Alias -Definition Get-ChildItem`,
        output: `Verb     Group
----     -----
Redo     Common
Remove   Common
Rename   Common
Reset    Common
Resize   Common
Restore  Data
Register Lifecycle
Request  Lifecycle
Restart  Lifecycle
Resume   Lifecycle
Repair   Diagnostic
Resolve  Diagnostic
Read     Communications
Receive  Communications
Revoke   Security

CommandType Name              Version Source
----------- ----              ------- ------
Cmdlet      Disable-LocalUser 1.0.0.0 Microsoft.PowerShell.LocalAccounts
Cmdlet      Enable-LocalUser  1.0.0.0 Microsoft.PowerShell.LocalAccounts
Cmdlet      Get-LocalUser     1.0.0.0 Microsoft.PowerShell.LocalAccounts
Cmdlet      New-LocalUser     1.0.0.0 Microsoft.PowerShell.LocalAccounts
Cmdlet      Remove-LocalUser  1.0.0.0 Microsoft.PowerShell.LocalAccounts
Cmdlet      Rename-LocalUser  1.0.0.0 Microsoft.PowerShell.LocalAccounts
Cmdlet      Set-LocalUser     1.0.0.0 Microsoft.PowerShell.LocalAccounts

CommandType Name                 Version Source
----------- ----                 ------- ------
Alias       gci -> Get-ChildItem

CommandType Name                 Version Source
----------- ----                 ------- ------
Alias       dir -> Get-ChildItem
Alias       gci -> Get-ChildItem
Alias       ls -> Get-ChildItem`,
      },
    ],
    mistakesAndTraps: [
      {
        mistake: 'Writing `gps | ? {$_.ws -gt 100mb} | % {kill $_.id}` inside a shared production `.ps1` script.',
        cause: 'Overusing cryptic aliases (`gps`, `?`, `%`, `kill`) makes scripts unreadable and can break on Linux where `ls` or `kill` may invoke native binaries.',
        fix: 'Use aliases when typing quick one-liners interactively; always spell out full cmdlet and parameter names (`Get-Process | Where-Object ...`) in saved `.ps1` scripts.',
      },
    ],
    tryItYourself: [
      'Run `Get-Command -Noun *Service*` to discover every cmdlet that works with services.',
      'Run `Get-Alias -Definition Where-Object` and `Get-Alias -Definition ForEach-Object` to see which essential pipeline cmdlets the single-character aliases `?` and `%` stand for. (Do not type `Get-Alias -Name ?`: the `?` is a wildcard that matches every one-letter alias.)',
    ],
    knowledgeCheck: [
      {
        question: 'Which command finds all aliases that point to the cmdlet Get-Process?',
        options: [
          'Get-Alias -Name Get-Process',
          'Get-Alias -Definition Get-Process',
          'Get-Process -Aliases',
          'Find-Alias Get-Process',
        ],
        correctIndex: 1,
        explanation: 'Use Get-Alias -Definition <CmdletName> when you know the full cmdlet and want to see all nicknames that point to it.',
      },
      {
        question: 'If you want to create a new firewall rule or a new Active Directory user in PowerShell, which approved Verb does PowerShell use?',
        options: ['Create', 'Make', 'New', 'Build'],
        correctIndex: 2,
        explanation: 'Microsoft’s approved verb for creating a new resource is always New (e.g., New-Item, New-LocalUser, New-NetFirewallRule, New-ADUser).',
      },
    ],
  },

  {
    id: '3-3',
    chapterId: 'chapter-03',
    slug: 'help-and-self-reliance',
    title: 'My Self-Reliance Pocketknife: Get-Help, -Examples, -Full & Syntax Decoding',
    subtitle: 'Why you never need to memorize 10,000 cmdlets when you know how to decode brackets and query examples',
    estimatedMinutes: 19,
    oneSentenceSummary:
      'Combined with `Get-Command` and `Get-Member`, `Get-Help` forms your Self-Reliance Pocketknife, teaching you how to run any cmdlet offline by reading `-Examples` and decoding `[square]` and `<angle>` brackets.',
    summary:
      'There are thousands of PowerShell cmdlets across Windows, Azure, Active Directory, and VMware. Trying to memorize them all is impossible, and pointless. Instead, I want you to carry my 3-tool **Self-Reliance Pocketknife**: `Get-Command`, `Get-Help`, and `Get-Member`. In this lesson, you will learn how to update offline help on a fresh machine, jump straight to working code with `Get-Help -Examples`, decode syntax blocks like a compiler, and read `about_*` conceptual guides.',
    whyItMatters:
      'When you are inside a secure datacenter or configuring a fresh Server Core VM before routing is working, you cannot copy-paste from a web forum. If you know how to read `Get-Help -Examples` and `Get-Help -Full` (after running `Update-Help` or `Save-Help` while you still have internet), you can work out most commands without a web forum.',
    learningObjectives: [
      'Download and refresh local documentation with `Update-Help` (PowerShell 7+: `-Scope CurrentUser`, no Administrator needed)',
      'Choose the right `Get-Help` switch (`-Examples`, `-Detailed`, `-Full`, `-Online`, `-ShowWindow`)',
      'Decode every bracket in a PowerShell syntax diagram: `[-Name <String[]>]` vs `[-Id] <Int32>` vs `<String>`',
      'Use `Show-Command` to generate valid cmdlet syntax visually and read `about_*` conceptual topics',
    ],
    keyTerms: [
      'Self-Reliance Pocketknife (Get-Command, Get-Help, Get-Member)',
      'Update-Help',
      'Get-Help -Examples & -Full',
      'Positional vs Named Parameters',
      'Mandatory vs Optional Brackets []',
      'about_* Conceptual Help Topics',
    ],
    conceptSections: [
      {
        heading: 'Updating Offline Help & Picking the Right Switch',
        body: [
          'To keep the Windows ISO small, fresh installations of Windows and Windows Server ship with only bare-bones help stubs. Therefore, the first thing I do on a new workstation or Server Core build is download the full help with **`Update-Help`**. You do not need Administrator for this in PowerShell 7+: run **`Update-Help -Scope CurrentUser`** and the help is saved in your own profile. (Windows PowerShell 5.1 has no `-Scope` parameter; it saves help under `C:\\Windows\\System32`, so there you need an elevated window and `Update-Help -Force`. If you would rather not change anything, skip this step: `Get-Help <cmdlet> -Online` always works when you have internet.) `Update-Help` itself needs internet access; on a server with no internet, use `Save-Help` on a connected machine and point `Update-Help -SourcePath` at the saved folder.',
          'Once help is downloaded, here is how I use **`Get-Help`** every day:\n• **`Get-Help Stop-Process -Examples`:** My #1 shortcut! Skips the wall of text and shows real, copy-pasteable code examples immediately.\n• **`Get-Help Stop-Process -Full`:** The complete technical manual, including parameter tables that tell you whether each parameter accepts pipeline input (`ByValue` or `ByPropertyName`) and wildcards.\n• **`Get-Help Stop-Process -Online`:** Opens the official Microsoft Learn page in your browser.\n• **`help Stop-Process` (or `man Stop-Process`):** Unlike `Get-Help` (which dumps the entire page at once), the `help` function pipes the output through `more` so you can scroll one screen at a time with the `Spacebar`!',
        ],
      },
      {
        heading: 'How to Decode Any PowerShell Syntax Block in 10 Seconds',
        body: [
          'When you run `Get-Help Get-Process`, you see a `SYNTAX` block filled with square brackets `[ ]` and angle brackets `< >`. Most beginners gloss right over it. Once you learn the 4 bracket rules, you can read any cmdlet’s syntax with confidence:\n1. **Everything inside `[square brackets]` is OPTIONAL.** If both the parameter and its value are inside outer brackets, like `[-ComputerName <String[]>]` - the entire parameter is optional.\n2. **No outer square brackets means MANDATORY.** In `Stop-Process -Name <String[]>`, there are no brackets around `-Name <String[]>`, which means you *must* supply `-Name` or the command will prompt you for it!\n3. **Parameter name in brackets, value outside: `[-Name] <String[]>` means POSITIONAL.** Because `[-Name]` is inside brackets, typing the word `-Name` is optional (`Get-Process explorer` works just like `Get-Process -Name explorer`). The same goes for `Stop-Process [-Id] <Int32[]>`: `-Id` is mandatory *and* positional, so `Stop-Process 4120` works.\n4. **`<Type[]>` inside angle brackets tells you the Data Type.** `<String>` accepts a single text string; `<String[]>` (with empty brackets `[]` attached to the type name!) means it accepts a **comma-separated array** of multiple strings (`Get-Process -Name explorer, pwsh, lsass`).',
        ],
      },
      {
        heading: 'Multiple Syntax Blocks (Parameter Sets) & Conceptual about_ Pages',
        body: [
          'Why does `Get-Help Stop-Process` show two or three separate `SYNTAX` paragraphs? Each paragraph is a **Parameter Set** - mutually exclusive ways to call the cmdlet. For example, you can stop a process **by `-Id`** (`Stop-Process -Id 4120`) OR **by `-Name`** (`Stop-Process -Name notepad`), but you cannot mix parameters from two different sets in the same command.',
          'What if you want to learn a *concept* (like loops, operators, or execution policies) rather than a single cmdlet? PowerShell includes hundreds of built-in book chapters whose names start with **`about_`**. Run `Get-Help about_*` to list them all, or `Get-Help about_Comparison_Operators` to read the complete operator reference offline!',
        ],
      },
    ],
    calloutNotes: [
      {
        type: 'key',
        title: 'The One-Sentence Version',
        body: 'In syntax diagrams, `[outer brackets]` mean optional, `[-Param] <Value>` means positional, and `<String[]>` means you can pass a comma-separated list.',
      },
      {
        type: 'try',
        title: 'Run Get-Help -Examples on Any Command',
        body: 'Run `Get-Help Select-String -Examples` right now. Notice how a minute of reading the examples usually saves a lot of guessing about syntax.',
      },
      {
        type: 'pro',
        title: 'GUI Helper: Show-Command',
        body: 'On desktop Windows with a GUI, running `Show-Command Get-Process` opens a pop-up window with text boxes for every parameter Set, letting you fill in the blanks and copy the resulting command!',
      },
    ],
    commandBreakdowns: [
      {
        cmdlet: 'Get-Help',
        aliases: ['help', 'man'],
        syntax: 'Get-Help [[-Name] <String>] [-Examples] [-Detailed] [-Full] [-Online]',
        parameters: [
          {
            name: '-Examples',
            type: 'SwitchParameter',
            description: 'Displays only the synopsis and practical code examples for the cmdlet.',
          },
          {
            name: '-Full',
            type: 'SwitchParameter',
            description: 'Displays the complete help file, including parameter metadata (Accept pipeline input, Accept wildcard characters).',
          },
          {
            name: '-Online',
            type: 'SwitchParameter',
            description: 'Opens the up-to-date Microsoft Learn webpage for the cmdlet in your default browser.',
          },
        ],
        examples: [
          'Update-Help -Scope CurrentUser',
          'Get-Help Get-Process -Examples',
          'Get-Help Get-Service -Full',
          'Get-Help about_Execution_Policies',
        ],
      },
    ],
    codeExamples: [
      {
        title: 'Using the Self-Reliance Pocketknife: Update-Help, -Examples, -Parameter, and about_*',
        description: 'Query working code examples, inspect a single parameter’s pipeline rules, and search conceptual about_ guides. The output is sample output and will differ slightly on your machine.',
        code: `# 1. Download/refresh local help files. PowerShell 7+: no Administrator needed.
Update-Help -Scope CurrentUser

# 1b. Windows PowerShell 5.1 has no -Scope parameter: run this in an elevated window instead
# Update-Help -Force

# 2. View practical, copy-pasteable examples for a cmdlet
Get-Help Get-ChildItem -Examples

# 3. Inspect the exact metadata of a single parameter (-Name on Get-Service)
Get-Help Get-Service -Parameter Name

# 4. List built-in conceptual 'about_' help articles matching 'Operator'
Get-Help about_*Operator*`,
        output: `--- Get-Help Get-Service -Parameter Name ---
-Name <String[]>
    Specifies the service names of services to be retrieved. Wildcards are permitted.

    Required?                    false
    Position?                    0
    Default value                None
    Accept pipeline input?       True (ByPropertyName, ByValue)
    Accept wildcard characters?  true

Name                              Category  Module  Synopsis
----                              --------  ------  --------
about_Arithmetic_Operators        HelpFile          Describes the operators that perform arithmetic...
about_Comparison_Operators        HelpFile          Describes the operators that compare values in...
about_Logical_Operators           HelpFile          Describes the operators that connect statements...
about_Pipeline_Chain_Operators    HelpFile          Describes chaining pipelines with && and ||...`,
      },
    ],
    mistakesAndTraps: [
      {
        mistake: 'Running `Update-Help` in Windows PowerShell 5.1 from a standard (non-Administrator) window and getting "Access is denied" errors.',
        cause: 'In 5.1, system module help files live inside protected folders like `C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\`, and `Update-Help` has no `-Scope` parameter. (Hiding the errors with `-ErrorAction SilentlyContinue` only hides the reason it failed.)',
        fix: 'In PowerShell 7+ use `Update-Help -Scope CurrentUser`, which needs no elevation. In Windows PowerShell 5.1 either run `Update-Help` in an elevated Administrator shell or skip it and use `Get-Help <cmdlet> -Online`.',
      },
    ],
    tryItYourself: [
      'Run `Get-Help Stop-Process` and examine the two `SYNTAX` blocks. Identify which parameter is mandatory in the first block (`-Id`) vs the second block (`-Name`).',
      'Run `Get-Help Get-Process -Parameter Name` and check whether `Accept wildcard characters?` is `true`.',
    ],
    knowledgeCheck: [
      {
        question: 'In a PowerShell syntax block, what does `[-Name] <String[]>` tell you?',
        options: [
          'The parameter does not accept strings',
          'The parameter is positional (typing -Name is optional) and accepts an array of multiple strings',
          'You must type the square brackets literally on the command line',
          'The command can only be run once',
        ],
        correctIndex: 1,
        explanation: 'Brackets around only the parameter name [-Name] mean it is positional; the [] inside <String[]> means it accepts multiple comma-separated string values.',
      },
      {
        question: 'Which Get-Help switch skips the parameter table and shows only practical code examples?',
        options: ['-SyntaxOnly', '-Examples', '-Quiet', '-Fast'],
        correctIndex: 1,
        explanation: 'Get-Help <Cmdlet> -Examples displays the command synopsis and all code examples.',
      },
    ],
  },

  // ==========================================================================
  // CHAPTER 4: X-RAY VISION: OBJECTS, PROPERTIES, METHODS & CUSTOM TYPES
  // ==========================================================================
  {
    id: '4-1',
    chapterId: 'chapter-04',
    slug: 'objects-properties-methods',
    title: 'Everything Is an Object: Classes, Properties, Methods & Get-Member',
    subtitle: 'Use Get-Member as your X-ray scanner before filtering or selecting anything',
    estimatedMinutes: 25,
    diagramId: 'object-anatomy',
    oneSentenceSummary:
      'Every command in PowerShell outputs live `.NET` objects packed with Properties (facts you read with `.Property`) and Methods (actions you trigger with `.Method()`), and `Get-Member` is your X-ray scanner to see all of them.',
    summary:
      'This is the mental shift that turns PowerShell from "just another command line" into a much more powerful tool. When you run `Get-Service` or `Get-Process`, PowerShell does NOT return text lines, it returns live `.NET` objects. In this lesson, we compare a Class (the blueprint) with an Object (the live instance), distinguish Properties from Methods, and master `Get-Member` (`gm`), the third blade of your Self-Reliance Pocketknife.',
    whyItMatters:
      'Beginners constantly guess property names based on column headers on the screen (like typing `$_.CPU(s)` or `$_.NPM(K)`) and wonder why their scripts return blank output. When you pipe to `Get-Member` first, you never guess a property name again.',
    learningObjectives: [
      'Explain the relationship between a .NET Class (TypeName blueprint) and an Object (live instance in memory)',
      'Distinguish between Properties (attributes/data like `.Status`, `.Id`, `.Length`) and Methods (actions like `.Stop()`, `.Kill()`, `.ToUpper()`)',
      'Pipe any command to `Get-Member` (`gm`) to inspect its exact `TypeName`, `Property`, `NoteProperty`, `ScriptProperty`, and `Method` definitions',
      'Access single properties with dot notation (`$obj.Property`) and invoke methods with parentheses (`$obj.Method()`)',
    ],
    keyTerms: [
      '.NET Object & Class (TypeName)',
      'Property vs. Method',
      'Get-Member (gm)',
      'Property / NoteProperty / ScriptProperty',
      'Dot Notation ($object.Property)',
      'System.Diagnostics.Process',
    ],
    conceptSections: [
      {
        heading: 'Blueprint vs. Reality: Classes, Objects, Properties, and Methods',
        body: [
          'Think of a **Class** as the architectural blueprint for a car, and an **Object** as an actual physical car rolling off the assembly line. In PowerShell, every item produced by a cmdlet is an instance of a `.NET` class:\n• `Get-Process` outputs `System.Diagnostics.Process` objects.\n• `Get-Service` outputs `System.ServiceProcess.ServiceController` objects.\n• `Get-ChildItem` outputs `System.IO.FileInfo` and `System.IO.DirectoryInfo` objects.',
          'Every object has two kinds of members (collectively called its **Members**):\n1. **Properties (Nouns / Facts about the object):** Characteristics you can inspect, like a car’s color, speed, or fuel level. On a Process object, properties include `.Name`, `.Id`, `.WorkingSet64`, `.StartTime`, and `.Path`. You read a property using **dot notation without parentheses**: `$proc.Id`.\n2. **Methods (Verbs / Actions the object can perform):** Built-in behaviors the object knows how to execute, like a car’s `StartEngine()` or `Brake()`. On a Process object, `.Kill()` terminates the process; on a String object, `.ToUpper()` or `.Replace("a","b")` transforms the text. You always call a method **with parentheses `()`**: `"powershell".ToUpper()`.',
        ],
      },
      {
        heading: 'Get-Member (gm): Your Object X-Ray Scanner',
        body: [
          'When you run `Get-Process` on the screen, PowerShell only shows you a handful of columns so the table fits on your monitor (Windows PowerShell 5.1 shows `Handles`, `NPM(K)`, `PM(K)`, `WS(K)`, `CPU(s)`, `Id`, `SI`, `ProcessName`; PowerShell 7 shows `PM(M)` and `WS(M)` in megabytes instead). Underneath that table, each `Process` object actually carries **dozens of hidden properties and methods** (around 90 members in Windows PowerShell 5.1).',
          'How do you see the real blueprint? Pipe any command into **`Get-Member`** (alias `gm`):\n`Get-Process | Get-Member`',
          'Look closely at three things in `Get-Member`’s output:\n• **`TypeName` at the very top:** Tells you the exact `.NET` class (`System.Diagnostics.Process`).\n• **`MemberType` column:** Shows `Property` (native .NET property), `AliasProperty` (a shortcut nickname like `WS` pointing to `WorkingSet`), `ScriptProperty` (calculated on the fly, like `CPU`), and `Method` (callable action).\n• **`Definition` column:** Shows the data type (`int`, `string`, `datetime`) and whether a property is read-only (`{get;}`) or read-write (`{get;set;}`).',
        ],
      },
    ],
    calloutNotes: [
      {
        type: 'key',
        title: 'The One-Sentence Version',
        body: 'Properties describe what an object *is* (`$obj.Name`); Methods are actions an object *does* (`$obj.Kill()`); and `Get-Member` reveals all of them.',
      },
      {
        type: 'try',
        title: 'Interact with the Object Anatomy Diagram Below',
        body: 'Click through the **Object Anatomy Inspector** below to explore the live properties and methods of `System.Diagnostics.Process`, `ServiceController`, and `FileInfo` objects.',
      },
      {
        type: 'gotcha',
        title: 'Don’t Forget the Parentheses () on a Method!',
        body: 'If you type `"hello".ToUpper` *without* parentheses, PowerShell does not run the method, it just prints the method’s definition signature! Always include `()`: `"hello".ToUpper()`.',
      },
    ],
    commandBreakdowns: [
      {
        cmdlet: 'Get-Member',
        aliases: ['gm'],
        syntax: 'Get-Member [-InputObject <PSObject>] [[-Name] <String[]>] [-MemberType <PSMemberTypes>]',
        parameters: [
          {
            name: '-MemberType',
            type: 'PSMemberTypes',
            description: 'Filters output to specific member types such as Property, Properties (all property types), or Method.',
          },
          {
            name: '-Name',
            type: 'String[]',
            description: 'Filters output to members matching a name or wildcard (e.g., *Memory* or *Time*).',
          },
        ],
        examples: [
          'Get-Process | Get-Member',
          'Get-Service | Get-Member -MemberType Properties',
          '"Hello World" | Get-Member -MemberType Method',
        ],
      },
    ],
    codeExamples: [
      {
        title: 'Using Get-Member to X-Ray Objects, Read Properties, and Call Methods',
        description: 'Inspect the hidden properties of a Service or Process object and call methods on a String and DateTime object. The output is abridged sample output (the member list is longer on a real machine, and the date is whenever you run it plus 7 days).',
        code: `# 1. X-Ray a Service object (showing all property types: Property, AliasProperty, ScriptProperty)
Get-Service -Name wuauserv | Get-Member -MemberType Properties

# 2. Access properties using Dot Notation
$svc = Get-Service -Name wuauserv
$svc.DisplayName
$svc.Status
$svc.StartType

# 3. Call Methods (always with parentheses!) on a String and a DateTime object
$hostname = "  srv-dc01.corp.local  "
$hostname.Trim().ToUpper().Replace(".CORP.LOCAL", "")

# Add 7 days to the current date using the .AddDays() method
(Get-Date).AddDays(7)`,
        output: `   TypeName: System.ServiceProcess.ServiceController

Name                MemberType    Definition
----                ----------    ----------
Name                AliasProperty Name = ServiceName
RequiredServices    AliasProperty RequiredServices = ServicesDependedOn
CanPauseAndContinue Property      bool CanPauseAndContinue {get;}
CanShutdown         Property      bool CanShutdown {get;}
CanStop             Property      bool CanStop {get;}
DisplayName         Property      string DisplayName {get;set;}
MachineName         Property      string MachineName {get;set;}
ServiceName         Property      string ServiceName {get;set;}
StartType           Property      System.ServiceProcess.ServiceStartMode StartType {get;}
Status              Property      System.ServiceProcess.ServiceControllerStatus Status {get;}

Windows Update
Running
Manual
SRV-DC01
Tuesday, November 10, 2026 11:45:00 PM`,
      },
    ],
    mistakesAndTraps: [
      {
        mistake: 'Using `-MemberType Property` and wondering why `CPU` or `Name` did not show up on `Get-Process`.',
        cause: '`CPU` is a `ScriptProperty` and `Name` is an `AliasProperty`. `-MemberType Property` only shows raw .NET properties.',
        fix: 'Use `Get-Member -MemberType Properties` (plural!) to see `Property`, `AliasProperty`, `NoteProperty`, and `ScriptProperty` all together.',
      },
    ],
    tryItYourself: [
      'Run `Get-Date | Get-Member` to see every property (`DayOfWeek`, `DayOfYear`, `Hour`) and method (`AddDays()`, `AddHours()`, `ToUniversalTime()`) on a `System.DateTime` object.',
      'Run `(Get-Date).DayOfWeek` to extract just the day of the week.',
    ],
    knowledgeCheck: [
      {
        question: 'What is the syntactic difference between accessing a Property and calling a Method on a PowerShell object?',
        options: [
          'Properties use square brackets []; Methods use curly braces {}',
          'Properties use dot notation without parentheses ($obj.Status); Methods require parentheses ($obj.Stop())',
          'Methods start with a dollar sign $; Properties do not',
          'There is no difference',
        ],
        correctIndex: 1,
        explanation: 'Properties are read via $object.PropertyName, whereas Methods are invoked with parentheses $object.MethodName().',
      },
      {
        question: 'If you run Get-Process in Windows PowerShell 5.1 and see a column header called "WS(K)", how do you find the real property name to use in a script?',
        options: [
          'Reboot the computer',
          'Pipe the command to Get-Member (Get-Process | Get-Member -MemberType Properties)',
          'Type WS(K) inside quotes',
          'Open Registry Editor',
        ],
        correctIndex: 1,
        explanation: 'Format tables often use abbreviated display headers like WS(K); Get-Member reveals the true underlying properties (WorkingSet / WorkingSet64).',
      },
    ],
  },

  {
    id: '4-2',
    chapterId: 'chapter-04',
    slug: 'formatting-and-custom-objects',
    title: 'Why the Screen Lies: Formatting, Calculated Properties & [PSCustomObject]',
    subtitle: 'Uncover hidden properties, compute live process runtimes, and construct clean custom objects',
    estimatedMinutes: 25,
    oneSentenceSummary:
      '`Format-Table` and `Format-List` destroy your live objects to turn them into screen drawings, so always put `Format-*` at the very end of your pipeline, and use `Select-Object` or `[PSCustomObject]` when you want to keep real data.',
    summary:
      'Why does `Get-Process | Format-Table Name, Id | Export-Csv procs.csv` produce a broken CSV file full of internal formatting gibberish? Because `Format-*` cmdlets destroy your original objects! In this lesson, you will learn the Law of Format Right, uncover every hidden property with `Format-List *`, build calculated properties on the fly (`@{Label=...; Expression={...}}`), and craft your own structured objects from scratch with `[PSCustomObject]@{}`.',
    whyItMatters:
      'Knowing the difference between `Select-Object` (which keeps real, exportable data objects) and `Format-Table` (which draws dead screen text) saves you from one of the most common frustrations in PowerShell.',
    learningObjectives: [
      'Use `Format-Table -AutoSize`, `Format-List *`, and `Format-Wide` to customize console output',
      'Explain the "Format Right" rule: why nothing except `Out-File` or `Out-Host` can come after a `Format-*` cmdlet',
      'Create on-the-fly calculated columns using hashtable syntax `@{Label="..."; Expression={ ... }}`',
      'Construct brand-new structured objects using `[PSCustomObject]@{ Key = Value }`',
    ],
    keyTerms: [
      'Format-Table (ft) & Format-List (fl)',
      'Format Right Rule',
      'Format-List * (Reveal All Properties)',
      'Calculated Property @{Label=...; Expression={...}}',
      '[PSCustomObject]@{}',
      'New-TimeSpan',
    ],
    conceptSections: [
      {
        heading: 'How to See Hidden Properties: Format-List * and The "Format Right" Law',
        body: [
          'Want to see the actual values of all the hidden properties on a single process or Active Directory user? Pipe one item into **`Format-List *`** (or `fl *`):\n`Get-Process -Id $PID | Format-List *`',
          'PowerShell provides three primary formatting cmdlets:\n• **`Format-Table` (`ft`):** Displays objects in rows and columns (`-AutoSize` tightens column widths; `-Wrap` prevents long text from truncating with `...`).\n• **`Format-List` (`fl`):** Displays one property per line. Essential when inspecting an object with 10+ properties.\n• **`Format-Wide` (`fw`):** Displays a single property (like `Name`) across multiple compact columns (`Format-Wide -Column 4`).',
          '**CRITICAL RULE ("Format Right"):** The moment you pipe `Process` objects into `Format-Table`, PowerShell throws away the `Process` objects and replaces them with `Microsoft.PowerShell.Commands.Internal.Format.*` drawing instructions! Therefore, **`Format-*` must ALWAYS be the very last thing on your command line.** If you want to pick specific columns *and* still sort, filter, or export to CSV/HTML/JSON, use **`Select-Object`**, never `Format-Table`!',
        ],
      },
      {
        heading: 'Calculated Properties: Computing New Columns on the Fly',
        body: [
          'What if you want `Select-Object` or `Format-Table` to display a property that doesn’t exist yet, like converting bytes into Gigabytes, or calculating how many minutes each process has been running (`New-TimeSpan`)?',
          'Both `Select-Object` and `Format-Table` accept a **Calculated Property Hashtable**:\n`@{ Label = "ColumnTitle"; Expression = { <code using $_> } }`\n*(Note: You can also use `Name` or `N` instead of `Label`, and `E` instead of `Expression`!)*',
          'For example, to show every process’s name and how long it has been running since `.StartTime`:\n`Get-Process | Where-Object StartTime | Select-Object Name, Id, @{Label="RunningTime"; Expression={ (New-TimeSpan -Start $_.StartTime -End (Get-Date)).ToString("d\\.hh\\:mm\\:ss") }}`',
        ],
      },
      {
        heading: 'Building Your Own Objects with [PSCustomObject]@{}',
        body: [
          'You don’t just have to consume objects that Microsoft’s cmdlets output, you can invent your own objects! Whenever I write a script that gathers facts from three different places (say, OS info, RAM size, and IP address) or defines a new user account to pass down the pipeline, I wrap a hashtable in **`[PSCustomObject]@{}`**.',
          'Why is `[PSCustomObject]@{}` better than printing text lines with `Write-Host`? Because a `[PSCustomObject]` is a first-class citizen in the pipeline: you can pipe it straight into `Where-Object`, `Sort-Object`, `Export-Csv`, `ConvertTo-Json`, `Out-GridView`, or even directly into cmdlets like `New-LocalUser` (which binds its properties `ByPropertyName`)!',
        ],
      },
    ],
    calloutNotes: [
      {
        type: 'key',
        title: 'The One-Sentence Version',
        body: 'Use `Select-Object` when you want to keep real data objects for sorting or exporting; use `Format-Table` or `Format-List` only at the very end when drawing for human eyes.',
      },
      {
        type: 'try',
        title: 'Prove That Format-Table Destroys Objects',
        body: 'Run `Get-Process | Select-Object Name, Id | Get-Member`: the type becomes `Selected.System.Diagnostics.Process`, a new object that keeps just the properties you chose (as NoteProperties) and loses the methods. Then run `Get-Process | Format-Table Name, Id | Get-Member`: the type becomes `Internal.Format` drawing instructions that no longer contain your data at all.',
      },
      {
        type: 'pro',
        title: 'Inspecting Values of Every Property at Once',
        body: '`Get-Member` shows you the *names and types* of all properties. `Select-Object -First 1 | Format-List *` shows you the *actual values* of all properties on a live object.',
      },
    ],
    commandBreakdowns: [
      {
        cmdlet: 'Format-Table',
        aliases: ['ft'],
        syntax: 'Format-Table [[-Property] <Object[]>] [-AutoSize] [-Wrap]',
        parameters: [
          {
            name: '-Property',
            type: 'Object[]',
            description: 'Specifies the properties (or calculated property hashtables) to display as columns.',
          },
          {
            name: '-AutoSize',
            type: 'SwitchParameter',
            description: 'Adjusts column widths based on the actual data width.',
          },
        ],
        examples: ['Get-Process | Format-Table Name, Id, Responding -AutoSize'],
      },
      {
        cmdlet: 'Format-List',
        aliases: ['fl'],
        syntax: 'Format-List [[-Property] <Object[]>]',
        parameters: [
          {
            name: '-Property',
            type: 'Object[]',
            description: 'Specifies properties to list (pass * to reveal every hidden property value).',
          },
        ],
        examples: ['Get-Service -Name bits | Format-List *'],
      },
    ],
    codeExamples: [
      {
        title: 'Calculated Properties (Process Uptime) and Creating a [PSCustomObject]',
        description: 'Compute a live Uptime column using New-TimeSpan and construct a custom server health object.',
        code: `# 1. Calculate how long each process has been running using a Calculated Property
Get-Process |
  Where-Object { $null -ne $_.StartTime } |
  Select-Object -First 4 Name, Id, StartTime, @{
    Label      = 'RunningMinutes'
    Expression = { [math]::Round((New-TimeSpan -Start $_.StartTime -End (Get-Date)).TotalMinutes, 1) }
  } | Format-Table -AutoSize

# 2. Construct your own structured object with [PSCustomObject]
$serverAudit = [PSCustomObject]@{
  ComputerName = $env:COMPUTERNAME
  OSBuild      = [System.Environment]::OSVersion.Version.Build
  ProcessCount = (Get-Process).Count
  AuditTime    = (Get-Date).ToString('yyyy-MM-dd HH:mm')
}

$serverAudit`,
        output: `Name       Id StartTime             RunningMinutes
----       -- ---------             --------------
explorer 5412 11/3/2026 8:00:12 AM           225.4
lsass     792 11/3/2026 7:59:40 AM           225.9
pwsh     8820 11/3/2026 11:15:00 AM           30.6
svchost  1428 11/3/2026 7:59:45 AM           225.8

ComputerName OSBuild ProcessCount AuditTime
------------ ------- ------------ ---------
SRV-CORE01     26100           94 2026-11-03 11:45`,
      },
    ],
    mistakesAndTraps: [
      {
        mistake: 'Running `Get-Process | Format-Table Name, Id | Sort-Object Id` or piping `Format-Table` into `Export-Csv`.',
        cause: '`Format-Table` outputs formatting instructions, not `Process` objects, so `Sort-Object` and `Export-Csv` fail to find the `Name` and `Id` properties.',
        fix: 'Replace `Format-Table` with `Select-Object` (`Get-Process | Select-Object Name, Id | Sort-Object Id | Export-Csv procs.csv -NoTypeInformation`).',
      },
    ],
    tryItYourself: [
      'Run `Get-Service -Name wuauserv | Format-List *` to inspect every single property of the Windows Update service.',
      'Create a `[PSCustomObject]@{ Name = "TestUser"; Department = "Security"; Active = $true }` and pipe it to `Get-Member` to see that each key became a `NoteProperty`.',
    ],
    knowledgeCheck: [
      {
        question: 'Why does `Get-Service | Format-Table Name, Status | Export-Csv services.csv` produce a corrupted CSV file?',
        options: [
          'Export-Csv only works on Linux',
          'Format-Table replaces the original ServiceController objects with internal formatting objects intended only for screen display',
          'Get-Service does not have a Name property',
          'CSV files cannot have two columns',
        ],
        correctIndex: 1,
        explanation: 'Format-* cmdlets convert live data objects into display formatting instructions. Always use Select-Object when piping to Export-Csv, ConvertTo-Json, or ConvertTo-Html.',
      },
      {
        question: 'Which two keys are required inside a Calculated Property hashtable in Select-Object or Format-Table?',
        options: [
          'Title and Value',
          'Label (or Name) and Expression',
          'Header and Script',
          'Column and Row',
        ],
        correctIndex: 1,
        explanation: 'Calculated properties use @{ Label = "ColumnName"; Expression = { $_.Property } } (or Name/N and E as shorthand).',
      },
    ],
  },

  // ==========================================================================
  // CHAPTER 5: MASTERING THE PIPELINE & PARAMETER BINDING
  // ==========================================================================
  {
    id: '5-1',
    chapterId: 'chapter-05',
    slug: 'pipeline-mechanics-and-binding',
    title: 'The Object Conveyor Belt & Parameter Binding (ByValue vs ByPropertyName)',
    subtitle: 'Why "bits" | Get-Service works while "explorer" | Get-Process fails, and how to check help in 5 seconds',
    estimatedMinutes: 30,
    diagramId: 'pipeline-visualizer',
    oneSentenceSummary:
      'The pipe symbol (`|`) streams live `.NET` objects from one cmdlet to the next, matching parameters automatically first `ByValue` (the incoming object’s type fits the parameter) and second `ByPropertyName` (matching property name).',
    summary:
      'The pipeline (`|`) is the heart of PowerShell. Instead of saving intermediate files or writing 15-line loops, you snap simple cmdlets together like Lego bricks (`Get-Process | Out-GridView -PassThru | Select-Object Name, Id`). But have you ever wondered why `"wuauserv" | Get-Service` works cleanly while `"notepad" | Get-Process` throws a red error? In this lesson, we open up the PowerShell parameter-binding engine so you can predict why a pipeline works or fails, and check it yourself with `Get-Help`.',
    whyItMatters:
      'Understanding `ByValue` vs. `ByPropertyName` is what lets you wire two cmdlets together on purpose instead of copy-pasting pipelines and hoping they work (even across different modules like Active Directory and CSV files).',
    learningObjectives: [
      'Trace how live objects stream one-by-one across a multi-stage pipeline (`Get-Process | Where-Object | Select-Object`)',
      'Use `Out-GridView -PassThru` to build interactive GUI pickers that feed selected objects back into the pipeline',
      'Explain the two parameter binding modes: `ByValue` (the incoming object’s type fits the parameter) and `ByPropertyName` (matches a property name on the incoming object)',
      'Check `Get-Help <Cmdlet> -Full` (or `-Parameter`) to prove why `"wuauserv" | Get-Service` succeeds and how `[PSCustomObject]@{Name="explorer"} | Get-Process` binds `ByPropertyName`',
    ],
    keyTerms: [
      'Object Pipeline (|)',
      'Out-GridView -PassThru',
      'Parameter Binding',
      'Accept Pipeline Input: ByValue',
      'Accept Pipeline Input: ByPropertyName',
      'Type Conversion / Coercion',
    ],
    conceptSections: [
      {
        heading: 'The Object Conveyor Belt & Out-GridView -PassThru',
        body: [
          'Picture the pipe symbol (`|`) as a factory conveyor belt. Cmdlet A places live objects onto the belt one at a time; Cmdlet B picks each object up, inspects or transforms it, and places the result onto the next section of belt.',
          'One of my favorite demonstrations of the object conveyor belt is **`Out-GridView -PassThru`**:\n`Get-Process | Out-GridView -PassThru | Select-Object Name, Id`\nHere is what happens:\n1. `Get-Process` puts all live `System.Diagnostics.Process` objects onto the belt.\n2. `Out-GridView -PassThru` opens an interactive graphical window (on a Windows desktop; it does not exist on Server Core) where you can filter and click 2 or 3 processes and click **OK**. Because you added **`-PassThru`**, the exact `Process` objects you clicked are placed back onto the conveyor belt!\n3. `Select-Object Name, Id` receives only those selected objects and shows two columns. This demo is harmless: it only reads and displays information.\n\nLater you will swap `Select-Object` for a command that changes things, such as `Stop-Process`. Before you do that, add **`-WhatIf`**: it is a safety switch that makes a command print what it *would* do without actually doing it. (`Stop-Process -Id 1234 -WhatIf` prints "What if: Performing the operation Stop-Process on target ..." and nothing is stopped.) Never practise `Stop-Process` on processes you do not recognise.',
        ],
      },
      {
        heading: 'Under the Hood: How PowerShell Connects the Pipe (ByValue vs. ByPropertyName)',
        body: [
          'When Cmdlet B receives an object from the pipeline, which of Cmdlet B’s parameters gets that object? PowerShell never guesses blindly, it checks `Get-Help CmdletB -Full` and tries two rules in strict order:\n• **Attempt 1 - `ByValue` (Match by Object Type):** PowerShell checks the incoming object’s `.NET TypeName`. Does Cmdlet B have a parameter marked `Accept pipeline input? True (ByValue)` that accepts that type (or a type it can be treated as, such as a derived type)? If yes, the entire object plugs right in!\n• **Attempt 2 - `ByPropertyName` (Match by Property Name):** If `ByValue` doesn’t match, PowerShell looks inside the incoming object’s properties. Does the incoming object have a property (say, `.Name` or `.Id`) whose name matches a parameter on Cmdlet B marked `Accept pipeline input? True (ByPropertyName)`? If yes, PowerShell extracts that property’s value and passes it to the matching parameter!\n\n(Simplified: PowerShell actually tries both rules first without type conversion and then again allowing conversion. See `Get-Help about_Parameter_Binding` for the full story.)',
        ],
      },
      {
        heading: 'Solving the Famous Mystery: Why "wuauserv" | Get-Service Works, But "notepad" | Get-Process Fails!',
        body: [
          'Try running these two commands:\n• `"wuauserv" | Get-Service` → **WORKS!**\n• `"notepad" | Get-Process` → **FAILS with a red binding error!**\nWhy? Let’s check `Get-Help` for both cmdlets!\n• In `Get-Help Get-Service -Parameter Name`, you see:\n  `-Name <String[]>` → `Accept pipeline input? True (ByPropertyName, ByValue)`\n  Because `Get-Service -Name` accepts a `<String>` **ByValue**, piping the string `"wuauserv"` plugs straight into `-Name`!\n• Now check `Get-Help Get-Process -Parameter Name`:\n  `-Name <String[]>` → `Accept pipeline input? True (ByPropertyName)` - **Notice: NO `ByValue` for `<String>`!**\n  A raw string `"notepad"` only has one property (`.Length`). It does NOT have a `.Name` property, so both `ByValue` and `ByPropertyName` fail!\n• **How do we make `Get-Process` accept it via the pipeline?** Give it an object that actually has a `.Name` property so `ByPropertyName` kicks in:\n  `[PSCustomObject]@{ Name = "explorer" } | Get-Process` → **WORKS!**',
        ],
      },
    ],
    calloutNotes: [
      {
        type: 'key',
        title: 'The One-Sentence Version',
        body: '`ByValue` matches the incoming object’s `.NET TypeName`; `ByPropertyName` matches a property name on the incoming object to a parameter name on the receiving cmdlet.',
      },
      {
        type: 'try',
        title: 'Run the Interactive Pipeline Visualizer Below',
        body: 'Use the **Pipeline Visualizer** below to step through a 4-stage pipeline and see how objects are filtered, reshaped, and bound stage by stage.',
      },
      {
        type: 'gotcha',
        title: 'Why Out-GridView Needs -PassThru in the Middle of a Pipeline',
        body: 'Without `-PassThru`, `Out-GridView` is a dead-end display window, nothing comes out the other side of the pipe. Adding `-PassThru` adds **OK / Cancel** buttons so your highlighted rows continue down the pipeline!',
      },
    ],
    commandBreakdowns: [
      {
        cmdlet: 'Out-GridView',
        aliases: ['ogv'],
        syntax: 'Out-GridView [-InputObject <PSObject>] [-Title <String>] [-PassThru]',
        parameters: [
          {
            name: '-PassThru',
            type: 'SwitchParameter',
            description: 'Adds OK/Cancel buttons to the GUI grid and sends the user-selected objects down the pipeline.',
          },
          {
            name: '-Title',
            type: 'String',
            description: 'Sets a custom window title for the interactive grid view.',
          },
        ],
        examples: [
          'Get-Service | Out-GridView -Title "All Services"',
          'Get-Process | Out-GridView -PassThru | Select-Object Name, Id',
        ],
      },
    ],
    codeExamples: [
      {
        title: 'Testing ByValue vs. ByPropertyName Parameter Binding Live',
        description: 'Compare Get-Service (which accepts String ByValue) with Get-Process (which accepts Name ByPropertyName). The output is sample output from PowerShell 7 (Windows PowerShell 5.1 shows PM(K) and WS(K) columns instead).',
        code: `# 1. Check pipeline binding rules on Get-Service vs Get-Process
Get-Help Get-Service -Parameter Name
Get-Help Get-Process -Parameter Name

# 2. Works ByValue because Get-Service -Name accepts <String> ByValue
"wuauserv", "bits" | Get-Service

# 3. Works ByPropertyName because our custom object has a .Name property!
[PSCustomObject]@{ Name = 'explorer' } | Get-Process`,
        output: `Status   Name               DisplayName
------   ----               -----------
Running  wuauserv           Windows Update
Running  bits               Background Intelligent Transfer Service

 NPM(K)    PM(M)      WS(M)     CPU(s)      Id  SI ProcessName
 ------    -----      -----     ------      --  -- -----------
    112   142.60     198.20      14.25    5412   1 explorer`,
      },
    ],
    mistakesAndTraps: [
      {
        mistake: 'Guessing whether a cmdlet accepts strings or objects from the pipeline without checking `Get-Help -Full`.',
        cause: 'Different cmdlets bind different types (`ByValue` vs `ByPropertyName`).',
        fix: 'Run `Get-Help <CmdletName> -Parameter *` to see every parameter where `Accept pipeline input?` is `True`.',
      },
    ],
    tryItYourself: [
      'Run `"bits" | Get-Service` and then `"explorer" | Get-Process` to see the difference firsthand.',
      'Fix the `Get-Process` pipeline by wrapping the name in `[PSCustomObject]@{ Name = "explorer" } | Get-Process`.',
    ],
    knowledgeCheck: [
      {
        question: 'Why does `"explorer" | Get-Process` fail while `[PSCustomObject]@{ Name = "explorer" } | Get-Process` succeeds?',
        options: [
          'Get-Process cannot be used with a pipe symbol',
          'Get-Process -Name only accepts pipeline input ByPropertyName (looking for a .Name property), not a raw String ByValue',
          'explorer is not a process',
          'Strings are banned in PowerShell',
        ],
        correctIndex: 1,
        explanation: 'Get-Process -Name accepts pipeline input ByPropertyName, not ByValue. A raw [string] has no .Name property, whereas the [PSCustomObject] has a .Name property that binds cleanly.',
      },
      {
        question: 'Which switch must you add to Out-GridView so the rows you click in the GUI window get sent on to the next cmdlet in the pipeline?',
        options: ['-Continue', '-PassThru', '-SendPipe', '-Output'],
        correctIndex: 1,
        explanation: 'Out-GridView -PassThru displays OK and Cancel buttons and passes the selected objects down the pipeline.',
      },
    ],
  },

  {
    id: '5-2',
    chapterId: 'chapter-05',
    slug: 'chaining-and-multiline',
    title: 'Command Chaining (; vs && and ||) & Multi-Line Console Technique',
    subtitle: 'Avoid the classic PowerShell 5.1 && failure on Server Core and format long pipelines cleanly',
    estimatedMinutes: 20,
    oneSentenceSummary:
      'A pipe (`|`) passes output objects from Command A into Command B; a semicolon (`;`) simply runs Command A and then Command B independently, and conditional chains (`&&` and `||`) only exist in PowerShell 7+.',
    summary:
      'What is the difference between separating two commands with a pipe (`|`) versus a semicolon (`;`), `&&`, or `||`? And how do you write clean, multi-line pipelines without accidentally executing half a command? In this lesson, we contrast object piping with sequential command chaining and master multi-line editing in the console and scripts.',
    whyItMatters:
      'Many administrators who use bash or PowerShell 7 on their laptop type `ipconfig /flushdns && gpupdate /force` on a Windows Server Core machine running PowerShell 5.1, and get hit with a syntax error because `&&` did not exist in 5.1!',
    learningObjectives: [
      'Contrast the object pipeline (`|`) with the sequential statement separator (`;`)',
      'Use conditional pipeline chain operators (`&&` for success, `||` for failure) in PowerShell 7+',
      'Avoid the PowerShell 5.1 `&&` syntax error when working on Windows Server Core',
      'Write clean multi-line commands using natural line breaks after `|`, `Shift+Enter`, or the backtick (`` ` ``) escape character',
    ],
    keyTerms: [
      'Statement Separator (;)',
      'AND Chain Operator (&& - PowerShell 7+)',
      'OR Chain Operator (|| - PowerShell 7+)',
      'Natural Line Continuation (after | or {)',
      'Backtick Escape Character (`)',
    ],
    conceptSections: [
      {
        heading: 'Pipe (|) vs. Semicolon (;) vs. Conditional Chains (&& and ||)',
        body: [
          'Don’t confuse **piping** with **chaining**:\n• **`CmdA | CmdB` (The Object Pipe):** Runs `CmdA` and feeds its output objects directly into `CmdB` as input.\n• **`CmdA ; CmdB` (Unconditional Semicolon - Works in 5.1 and 7):** Runs `CmdA`, finishes it, and then runs `CmdB` completely independently, even if `CmdA` failed with an error! No data passes from `CmdA` to `CmdB`.\n• **`CmdA && CmdB` (Conditional AND - PowerShell 7+ ONLY):** Runs `CmdA`, and runs `CmdB` **only if `CmdA` succeeded**.\n• **`CmdA || CmdB` (Conditional OR - PowerShell 7+ ONLY):** Runs `CmdA`, and runs `CmdB` **only if `CmdA` failed** (great for fallback actions!). Both operators look at whether the command *succeeded* (an error means it failed), not at the value it returned: `Test-Path C:\\Missing` returns `False` but still succeeds, so `Test-Path C:\\Missing || ...` never runs the fallback. To react to True/False, use `if`.',
        ],
      },
      {
        heading: 'Writing Clean Multi-Line Commands Without Backtick Traps',
        body: [
          'When a pipeline has four or five stages, cramming 200 characters onto one line makes it impossible to read. You have three clean ways to break a command across multiple lines:\n1. **Break right after a Pipe (`|`), Comma (`,`), or Opening Brace (`{`):** PowerShell is smart! If a line ends with `|`, PowerShell knows the command isn’t finished yet and automatically waits for the next line without needing any special escape character.\n2. **Press `Shift+Enter` at the Interactive Prompt:** Moves the cursor to a new line (`>>`) inside the console without executing the command until you press a plain `Enter`.\n3. **The Backtick Character (`` ` ``) at the Very End of a Line:** Tells PowerShell to ignore the newline immediately following it. **Warning:** If you accidentally type a single invisible space *after* the backtick (` ``[space]`), it escapes the space instead of the newline and breaks your command! That is why breaking naturally after `|` is always safer.',
        ],
      },
    ],
    calloutNotes: [
      {
        type: 'key',
        title: 'The One-Sentence Version',
        body: 'Use `|` to pass data between commands, `;` to run independent commands in any PowerShell version, and `&&` / `||` for conditional chaining in PowerShell 7+.',
      },
      {
        type: 'gotcha',
        title: 'The PowerShell 5.1 && Trap on Server Core',
        body: 'In Windows PowerShell 5.1, typing `Command1 && Command2` throws `The token \'&&\' is not a valid statement separator in this version`. On 5.1, use `;` or an `if ($?) { ... }` check!',
      },
      {
        type: 'pro',
        title: 'Prefer Natural Line Breaks Over Backticks',
        body: 'End each line of a multi-line pipeline with the pipe symbol `|`. PowerShell wraps to the next line naturally, and you never have to worry about a trailing space breaking a backtick.',
      },
    ],
    commandBreakdowns: [
      {
        cmdlet: 'Clear-Host',
        aliases: ['cls', 'clear'],
        syntax: 'Clear-Host',
        parameters: [],
        examples: ['Clear-Host ; Get-Date'],
      },
    ],
    codeExamples: [
      {
        title: 'Comparing ; vs && and || and Formatting Multi-Line Pipelines',
        description: 'Run sequential commands with ;, conditional chains in PowerShell 7 with && / ||, and clean multi-line pipelines. The output is sample output from PowerShell 7 (the date, error wording and services differ on your machine). Note that && and || react to success or failure, not to True or False.',
        code: `# 1. Semicolon (;) runs both commands independently in ALL PowerShell versions (5.1 & 7)
Write-Output "Step 1: Checking Date" ; Get-Date

# 2. PowerShell 7+ Conditional Chains (&& and ||)
Test-Path C:\\Windows && Write-Output "Windows folder exists!"

# Test-Path returns False for a missing folder but still SUCCEEDS, so a || after it never fires.
# Use a command that really fails (Get-Item writes an error when the path is missing):
Get-Item C:\\NonExistentFolder || Write-Output "Fallback: Folder was missing!"

# 3. The version-independent way to react to True/False (works in 5.1 and 7)
if (-not (Test-Path C:\\NonExistentFolder)) { Write-Output "Folder is missing (checked with if)" }

# 4. Clean multi-line pipeline (natural line break right after each '|' symbol)
Get-Service |
  Where-Object Status -eq 'Running' |
  Sort-Object DisplayName |
  Select-Object -First 5 Name, DisplayName, Status`,
        output: `Step 1: Checking Date
Tuesday, November 3, 2026 11:50:00 PM
True
Windows folder exists!
Get-Item: Cannot find path 'C:\\NonExistentFolder' because it does not exist.
Fallback: Folder was missing!
Folder is missing (checked with if)

Name                 DisplayName                                Status
----                 -----------                                ------
Appinfo              Application Information                   Running
BITS                 Background Intelligent Transfer Service   Running
BrokerInfrastructure Background Tasks Infrastructure Service   Running
BFE                  Base Filtering Engine                     Running
CertPropSvc          Certificate Propagation                   Running`,
      },
    ],
    mistakesAndTraps: [
      {
        mistake: 'Putting a trailing space after a backtick line continuation (`` ` ``).',
        cause: 'The backtick escapes whatever single character comes immediately after it. If that character is a space instead of the newline, the command breaks prematurely.',
        fix: 'Break lines naturally right after `|`, `,`, or `{` instead of relying on backticks.',
      },
    ],
    tryItYourself: [
      'Type `Get-Process |` in your terminal and press `Enter`. Notice how PowerShell shows `>>` and waits for you to type `Select-Object -First 3` on the next line!',
      'Run `Write-Output "First" ; Write-Output "Second"` to see how `;` runs two independent statements on one line.',
    ],
    knowledgeCheck: [
      {
        question: 'What happens if you run `CommandA && CommandB` inside Windows PowerShell 5.1 on a fresh Windows Server?',
        options: [
          'Both commands run in parallel',
          'PowerShell 5.1 throws a parser error because && and || were introduced in PowerShell 7',
          'CommandA is deleted',
          'The server reboots',
        ],
        correctIndex: 1,
        explanation: 'Pipeline chain operators (&& and ||) are only supported in PowerShell 7+. In Windows PowerShell 5.1, use ; for unconditional chaining or if ($?) for conditional execution.',
      },
      {
        question: 'What is the safest way to split a long pipeline across multiple lines in a .ps1 script?',
        options: [
          'End each line with a pipe character (|) so PowerShell continues naturally onto the next line',
          'Put a semicolon at the start of every line',
          'Use backticks followed by three spaces',
          'Wrap every word in quotes',
        ],
        correctIndex: 0,
        explanation: 'Ending a line with |, a comma, or an opening brace { tells the PowerShell parser that the expression continues on the next line without fragile backticks.',
      },
    ],
  },

  // ==========================================================================
  // CHAPTER 6: VARIABLES, TYPE CASTING, QUOTES & SECURE INPUT
  // ==========================================================================
  {
    id: '6-1',
    chapterId: 'chapter-06',
    slug: 'variables-arrays-and-types',
    title: 'Variables, Zero-Indexed Arrays & Strong .NET Data Types',
    subtitle: 'Store objects in boxes, address array elements by index, pass arrays to parameters, and cast types',
    estimatedMinutes: 25,
    oneSentenceSummary:
      'Variables (`$var`) store live objects or zero-indexed arrays (`$arr[0]`, `$arr[-1]`) in memory, and locking a variable’s type (`[int]$port = 443`) prevents sneaky string-vs-number bugs.',
    summary:
      'Variables are the memory boxes of your scripts. Unlike bash (which stores everything as flat text strings), a PowerShell variable can hold a number, a string, a `DateTime` object, an array of 500 `Process` objects, or a hashtable. In this lesson, we master variable creation, automatic variables (`$_`, `$PSVersionTable`, `$env:`), zero-indexed arrays (`@()`), and `.NET` type casting (`[string]`, `[int]`, `[datetime]`).',
    whyItMatters:
      'Wait until `Read-Host` gives you the string `"50"` and you multiply `"50" * 2`, getting `"5050"` instead of `100`! Once you understand strong types (`[int]`) and zero-indexed arrays (`$arr[0]`), your scripts handle data cleanly every time.',
    learningObjectives: [
      'Create, inspect, and clear variables using `$name = value`, `Get-Variable`, `Set-Variable`, and `Remove-Variable`',
      'Build arrays (`@()` or comma-separated lists), access elements by zero-based index (`[0]`, `[-1]`, `[0..2]`), and append items with `+=`',
      'Pass an array variable directly to any cmdlet parameter marked `<String[]>`',
      'Lock or convert data types using `.NET` type accelerators (`[string]`, `[int]`, `[decimal]`, `[bool]`, `[datetime]`, `[array]`, `[hashtable]`)',
    ],
    keyTerms: [
      'Variable ($var)',
      'Automatic Variables ($_, $PSVersionTable, $PID)',
      'Zero-Indexed Array (@(), $arr[0], $arr[-1])',
      'Type Casting / Strong Typing ([int], [datetime])',
      'Hashtable (@{ Key = Value })',
      '$null',
    ],
    conceptSections: [
      {
        heading: 'Variables: Labeled Boxes That Hold Real Objects',
        body: [
          'In PowerShell, every variable name starts with a **`$`** sign (`$serverName = "SRV-DC01"`, `$procs = Get-Process`). You don’t just use `$` when reading a variable like in bash, you use `$` both when **assigning** and when **reading**.',
          'There are three categories of variables in PowerShell:\n1. **User-Created Variables:** Created by you (`$ip = "192.168.153.210"`).\n2. **Automatic Variables:** Maintained by PowerShell itself (`$_` or `$PSItem` for the current pipeline object, `$PSVersionTable`, `$PID` for your shell’s Process ID, `$true`, `$false`, `$null`).\n3. **Preference Variables:** Control how PowerShell behaves (`$ErrorActionPreference`).',
          'Note: When you use the `*-Variable` cmdlets (`Get-Variable`, `Set-Variable`, `Clear-Variable`, `Remove-Variable`), pass the variable’s **name without the `$` sign** (`Remove-Variable -Name ip`).',
        ],
      },
      {
        heading: 'Zero-Indexed Arrays: Counting from 0 and Passing Lists to Cmdlets',
        body: [
          'The comma (`,`) is PowerShell’s array-building operator, and `@(...)` is the explicit array wrapper:\n`$servers = @("DC01", "DC02", "SQL01", "WEB01")`',
          'Every array in PowerShell is **zero-indexed** (we start counting at `0`):\n• `$servers[0]` → First item (`"DC01"`)\n• `$servers[1]` → Second item (`"DC02"`)\n• `$servers[-1]` → Last item (`"WEB01"` - negative indices count backward from the end!)\n• `$servers[0..2]` → Slice of items 0, 1, and 2\n• `$servers.Count` → Total number of items (`4`)\n• `$servers += "APP01"` → Appends a new item to the array (PowerShell actually builds a brand-new, slightly bigger array each time, which is fine for small lists but slow for thousands of items).',
          '**Pro Move:** Remember how `Get-Help` showed `-Name <String[]>` with `[]` brackets? That means you can pass an array variable right into the parameter:\n`$targets = @("wuauserv", "bits", "Spooler")`\n`Get-Service -Name $targets`',
        ],
      },
      {
        heading: 'Strong Type Casting: Why "5" + "5" Is "55" Until You Use [int]',
        body: [
          'By default, PowerShell variables are dynamically typed (a box can hold a string now and an integer later). But if you place a **type accelerator in square brackets** on the left side of the variable (`[int]$port = 443`), you **lock** that box so it only accepts integers!',
          'Why is type casting so critical? Look at what happens with the `+` and `*` operators:\n• `"50" + "50"` (two strings) → concatenates into **`"5050"`**!\n• `[int]"50" + [int]"50"` (two integers) → adds mathematically to **`100`**!\n• `"50" * 3` (string times integer) → repeats the string **`"505050"`**!\n• `[int]"50" * 3` → **`150`**.\n\n**The rule: the type of the LEFT operand decides.** `"50" + 1` gives the string **`"501"`** (a string on the left, so `1` is converted to text), but `1 + "50"` gives the number **`51`** (a number on the left, so `"50"` is converted to a number).',
          'Nine `.NET` type accelerators I use constantly:\n• `[string]` - Text (`"Hello"`)\n• `[int]` - 32-bit whole number (`42`)\n• `[long]` - 64-bit whole number (great for huge byte counts)\n• `[decimal]` / `[double]` - Decimal numbers (`3.14`)\n• `[bool]` - Boolean (`$true` or `$false`)\n• `[datetime]` - Parses a string into a real calendar object (`[datetime]"2026-12-25"`)\n• `[array]` & `[hashtable]` - Collections (`@()` and `@{}`).',
        ],
      },
    ],
    calloutNotes: [
      {
        type: 'key',
        title: 'The One-Sentence Version',
        body: 'Arrays start counting at index `[0]` (with `[-1]` for the last element), and prefixing a variable with `[int]` or `[datetime]` forces PowerShell to treat text as real numbers or dates.',
      },
      {
        type: 'try',
        title: 'Try Date Math with [datetime]',
        body: 'Run `([datetime]"2026-12-31" - (Get-Date)).Days` to calculate how many days remain until New Year’s Eve in one line!',
      },
      {
        type: 'gotcha',
        title: 'Do Not Include $ When Calling Get-Variable or Remove-Variable',
        body: 'Write `$myVar = 10` when you use the `$` syntax, but write `Remove-Variable -Name myVar` (no `$`!) when you call the cmdlet. The `*-Variable` cmdlets take the variable’s name, not its value.',
      },
    ],
    commandBreakdowns: [
      {
        cmdlet: 'Get-Variable',
        aliases: ['gv'],
        syntax: 'Get-Variable [[-Name] <String[]>]',
        parameters: [
          {
            name: '-Name',
            type: 'String[]',
            description: 'Specifies the variable name WITHOUT the leading $ symbol.',
          },
        ],
        examples: ['Get-Variable -Name PSVersionTable', 'Remove-Variable -Name servers'],
      },
    ],
    codeExamples: [
      {
        title: 'Working with Zero-Indexed Arrays, Passing Arrays to Cmdlets, and Type Casting',
        description: 'Index into arrays, pass an array to Get-Service, and prevent string concatenation bugs with [int].',
        code: `# 1. Create a zero-indexed array of service names
$services = @('wuauserv', 'bits', 'Spooler', 'WinRM')

Write-Output "First element [0] : $($services[0])"
Write-Output "Last element [-1] : $($services[-1])"
Write-Output "Total count       : $($services.Count)"

# 2. Pass the entire array directly to Get-Service -Name <String[]>
Get-Service -Name $services | Select-Object Name, Status

# 3. String concatenation vs Integer math with [int]
$rawInput = "25"
Write-Output "As String  : $($rawInput * 4)"
Write-Output "As [int]   : $([int]$rawInput * 4)"`,
        output: `First element [0] : wuauserv
Last element [-1] : WinRM
Total count       : 4

Name     Status
----     ------
bits     Running
Spooler  Running
WinRM    Stopped
wuauserv Running

As String  : 25252525
As [int]   : 100`,
      },
    ],
    mistakesAndTraps: [
      {
        mistake: 'Expecting `$servers[1]` to return the first item in the array.',
        cause: 'PowerShell arrays are zero-indexed, so index `0` is the first item and index `1` is the second item.',
        fix: 'Always use `$array[0]` for the first item and `$array[-1]` for the last item.',
      },
    ],
    tryItYourself: [
      'Create an array `$nums = 10, 20, 30, 40, 50` and retrieve the first item (`$nums[0]`), the third item (`$nums[2]`), and the last item (`$nums[-1]`).',
      'Run `("100").GetType().Name` and `([int]"100").GetType().Name` to see the exact `.NET` type change from `String` to `Int32`.',
    ],
    knowledgeCheck: [
      {
        question: 'Given `$ips = @("10.0.0.1", "10.0.0.2", "10.0.0.3")`, what does `$ips[1]` return?',
        options: ['"10.0.0.1"', '"10.0.0.2"', '"10.0.0.3"', '$null'],
        correctIndex: 1,
        explanation: 'Arrays are zero-indexed: [0] is "10.0.0.1", [1] is "10.0.0.2", and [2] (or [-1]) is "10.0.0.3".',
      },
      {
        question: 'What is the output of `"10" * 3` vs `[int]"10" * 3` in PowerShell?',
        options: [
          'Both output 30',
          '"10" * 3 outputs the string "101010"; [int]"10" * 3 outputs the integer 30',
          'Both throw an error',
          '"10" * 3 outputs 13',
        ],
        correctIndex: 1,
        explanation: 'Multiplying a [string] by 3 repeats the string three times ("101010"); casting to [int] performs mathematical multiplication (30).',
      },
    ],
  },

  {
    id: '6-2',
    chapterId: 'chapter-06',
    slug: 'quotes-and-secure-io',
    title: 'The Quote Expansion Trap, Write-Host vs Write-Output & SecureString',
    subtitle: 'Why single quotes freeze variables, why Write-Host output skips the Success stream, and how to mask passwords properly',
    estimatedMinutes: 25,
    oneSentenceSummary:
      'Double quotes (`"Hello $name"`) expand variables while single quotes (`\'Hello $name\'`) print literally; `Write-Output` feeds the pipeline while `Write-Host` writes to the Information stream (shown on screen, not sent down the pipeline); and `Read-Host -AsSecureString` keeps passwords out of plain text.',
    summary:
      'Three classic traps catch almost every PowerShell learner in their first month: using single quotes when they wanted a variable to expand, trying to pipe `Write-Host` into a file and getting an empty file, and prompting for passwords in plain text with `Read-Host`. In this lesson, we learn to avoid all three.',
    whyItMatters:
      'When you build user-provisioning scripts or server automation tools, you must know how to format dynamic strings (`"$($user.Name)"`), emit pipeline-friendly output (`Write-Output`), and pass protected credentials (`SecureString` and `PSCredential`).',
    learningObjectives: [
      'Predict string output inside Double Quotes (`"..."` - expands variables and `$()` subexpressions) vs. Single Quotes (`\'...\'` - literal)',
      'Use the subexpression operator `$($object.Property)` when embedding object properties inside double-quoted strings',
      'Explain why `Write-Output "text" | Out-File` works while `Write-Host "text" | Out-File` creates an empty file (different output streams)',
      'Prompt for numeric input (`[int](Read-Host)`) and passwords (`Read-Host -AsSecureString` and `Get-Credential`) without showing them on screen',
    ],
    keyTerms: [
      'Double Quotes ("..." - Expandable String)',
      'Single Quotes (\'...\' - Literal String)',
      'Subexpression Operator $($obj.Prop)',
      'Write-Output vs. Write-Host',
      'Read-Host -AsSecureString',
      'Get-Credential (PSCredential)',
    ],
    conceptSections: [
      {
        heading: 'Double Quotes (" ") vs. Single Quotes (\' \') & The $($obj.Prop) Rule',
        body: [
          'In PowerShell, double quotes and single quotes are NOT interchangeable:\n• **Double Quotes (`"..."` - Expandable):** PowerShell looks inside the string and replaces any `$variable` with its value! If `$user = "Izaz"`, then `"Welcome $user"` outputs **`Welcome Izaz`**.\n• **Single Quotes (`\'...\'` - Literal):** PowerShell treats every character inside single quotes as frozen, literal text. `\'Welcome $user\'` outputs **`Welcome $user`** literally!',
          '**The Object Property Trap in Double Quotes:** What happens if `$proc = Get-Process -Id $PID` and you write `"Process ID is $proc.Id"`? PowerShell expands `$proc` first and then prints `.Id` as literal text (`System.Diagnostics.Process (pwsh).Id`)!\n**The Fix:** Whenever you access a `.Property` or expression inside double quotes, wrap it in the **Subexpression Operator `$()`**:\n`"Process ID is $($proc.Id)"` → **`Process ID is 8820`**.',
        ],
      },
      {
        heading: 'Write-Output vs. Write-Host: Why Write-Host Output Never Reaches Out-File',
        body: [
          'Look at these two commands:\n• `Write-Output "Server Ready" | Out-File status.txt` → Writes `"Server Ready"` into `status.txt`.\n• `Write-Host "Server Ready" | Out-File status.txt` → Prints `"Server Ready"` on your monitor and leaves `status.txt` **completely empty!**',
          'Why? Because PowerShell has separate output streams:\n• **`Write-Output` (Stream #1 - Success Stream):** Places the object onto the **pipeline conveyor belt**. If nothing catches it at the end of the pipeline, PowerShell displays it on screen; if you pipe it to `Out-File` or assign it to `$result = ...`, it travels down the pipe.\n• **`Write-Host` (Stream #6 - Information Stream):** Since PowerShell 5.0 it writes to the Information stream, not the Success stream, so nothing goes down the pipe to `Out-File`. The host displays it on screen (supporting `-ForegroundColor Green` and `-NoNewline`). You can still capture it on purpose with `6>&1` or `*>`, but it is not meant for returning data. Use `Write-Host` only for colorful human status messages in interactive menus.',
        ],
      },
      {
        heading: 'Interactive Input & Never Storing Plain-Text Passwords (SecureString)',
        body: [
          'When a script needs input from a human operator, use **`Read-Host`**:\n• **The String Return Trap:** `Read-Host` ALWAYS returns a `[string]`. If you ask for a number (`$count = Read-Host "How many?"`), cast it immediately: **`[int]$count = Read-Host "How many?"`**.\n• **Masking Passwords (`-AsSecureString`):** Never prompt for a password in plain text where someone looking over your shoulder (or reading console history) can see it! Add **`-AsSecureString`**:\n  `$securePwd = Read-Host "Enter Password" -AsSecureString`\n  This masks every keystroke (`*`) and stores the password in memory as a `System.Security.SecureString` object, the type that password parameters expect. On Windows a SecureString is only protected with the current user’s data-protection key (DPAPI): better than plain text, but not strong encryption, and Microsoft discourages it for new cross-platform code. (PowerShell 7.1+ also has `Read-Host -MaskInput`, which masks the typing but returns a plain string. It does not exist in Windows PowerShell 5.1.) For example, `New-LocalUser` takes its `-Password` as a SecureString.\n• **Full Username + Password (`Get-Credential`):** Prompts for both username and password and returns a `PSCredential` object ready for `-Credential`.',
        ],
      },
    ],
    calloutNotes: [
      {
        type: 'key',
        title: 'The One-Sentence Version',
        body: 'Use `"$($obj.Property)"` for variable expansion, `Write-Output` when data needs to travel down the pipeline, and `Read-Host -AsSecureString` whenever handling passwords.',
      },
      {
        type: 'gotcha',
        title: 'Why "$proc.Name" Fails Without $()',
        body: 'Inside `"..."`, PowerShell stops variable expansion at the dot `.`. Always write `"$($proc.Name)"` so PowerShell evaluates `$proc.Name` first and inserts the result.',
      },
      {
        type: 'danger',
        title: 'Never Hardcode Plain-Text Passwords in .ps1 Scripts',
        body: 'Hardcoding `$password = "P@ssw0rd123"` in a `.ps1` file leaves credentials in Git repos and Script Block Logs (Event ID 4104). Always prompt dynamically with `Read-Host -AsSecureString` or `Get-Credential`.',
      },
    ],
    commandBreakdowns: [
      {
        cmdlet: 'Read-Host',
        aliases: [],
        syntax: 'Read-Host [[-Prompt] <Object>] [-AsSecureString] [-MaskInput (PowerShell 7.1+ only)]',
        parameters: [
          {
            name: '-Prompt',
            type: 'Object',
            description: 'Displays the prompt message to the user (PowerShell appends a colon automatically).',
          },
          {
            name: '-AsSecureString',
            type: 'SwitchParameter',
            description: 'Masks input characters and returns a System.Security.SecureString object (protected with the current user’s key on Windows, not strong encryption).',
          },
        ],
        examples: [
          '[int]$port = Read-Host -Prompt "Enter TCP Port"',
          '$securePwd = Read-Host -Prompt "Enter Admin Password" -AsSecureString',
        ],
      },
      {
        cmdlet: 'Write-Output',
        aliases: ['write', 'echo'],
        syntax: 'Write-Output [-InputObject] <PSObject[]>',
        parameters: [
          {
            name: '-InputObject',
            type: 'PSObject[]',
            description: 'Sends the specified objects down the success pipeline to the next command.',
          },
        ],
        examples: ['Write-Output "Deployment Complete" | Out-File deploy.log'],
      },
    ],
    codeExamples: [
      {
        title: 'Double vs. Single Quotes, Subexpressions $(), and SecureString Input',
        description: 'Demonstrate string expansion, subexpression evaluation, and the line that creates a SecureString for user creation (commented out so the demo does not stop to ask for input).',
        code: `# 1. Double Quotes (expand) vs Single Quotes (literal)
$admin = "Izaz"
Write-Output "Double quotes : Hello $admin"
Write-Output 'Single quotes : Hello $admin'

# 2. Using the Subexpression Operator $() inside double quotes
$svc = Get-Service -Name wuauserv
Write-Output "Service $($svc.DisplayName) is currently $($svc.Status)."

# 3. Escape character (\`) to print a literal $ inside double quotes
Write-Output "The variable \`$svc holds a $($svc.GetType().Name) object."

# 4. Capturing an encrypted password with -AsSecureString (required by New-LocalUser)
# $securePassword = Read-Host -Prompt "Enter password for new user" -AsSecureString`,
        output: `Double quotes : Hello Izaz
Single quotes : Hello $admin
Service Windows Update is currently Running.
The variable $svc holds a ServiceController object.`,
      },
    ],
    mistakesAndTraps: [
      {
        mistake: 'Using `Write-Host` inside a function or pipeline and wondering why the next cmdlet receives nothing.',
        cause: '`Write-Host` writes to the Information stream (shown on the console) instead of the Success stream that feeds the pipeline, so `| Out-File` or `$x = ...` receives nothing.',
        fix: 'Use `Write-Output` (or simply state the variable/object name on its own line) whenever you want output to pass down the pipeline.',
      },
    ],
    tryItYourself: [
      'Set `$hostName = "SRV-01"` and compare `"Connecting to $hostName"` vs `\'Connecting to $hostName\'`.',
      'Run `$p = Get-Process -Id $PID` and compare `"PID: $p.Id"` (wrong!) with `"PID: $($p.Id)"` (correct!).',
    ],
    knowledgeCheck: [
      {
        question: 'If `$envName = "Prod"`, what does `Write-Output \'Deploying to $envName\'` output?',
        options: [
          'Deploying to Prod',
          'Deploying to $envName',
          'An error message',
          'Nothing',
        ],
        correctIndex: 1,
        explanation: 'Single quotes (\'...\') create a literal string where variables are never expanded.',
      },
      {
        question: 'How do you correctly embed the `.Status` property of `$service` inside a double-quoted string?',
        options: [
          '"Status is $service.Status"',
          '"Status is $($service.Status)"',
          '\'Status is $service.Status\'',
          '"Status is [service.Status]"',
        ],
        correctIndex: 1,
        explanation: 'Wrapping object property access in the subexpression operator $($service.Status) tells PowerShell to evaluate the property before inserting it into the double-quoted string.',
      },
    ],
  },

  // ==========================================================================
  // CHAPTER 7: PRECISION FILTERING, SORTING & SAFETY SWITCHES
  // ==========================================================================
  {
    id: '7-1',
    chapterId: 'chapter-07',
    slug: 'filter-left-and-where-object',
    title: 'Source Filtering (-Filter) vs Where-Object & The Complete Operator Reference',
    subtitle: 'How $_ represents each object in turn and why filtering at the source usually beats filtering later in the pipeline',
    estimatedMinutes: 25,
    oneSentenceSummary:
      'Always follow the "Filter Left" law: filter at the source cmdlet first (with its `-Filter`, `-FilterHashtable` or similar parameter) whenever possible, and use `Where-Object` (`$_`) in the pipeline when you need rich multi-condition comparisons.',
    summary:
      'Why does PowerShell use `-eq` and `-gt` instead of `=` and `>`? And what is the difference between `Get-ChildItem -Filter *.dll` versus `Get-ChildItem | Where-Object Name -like "*.dll"`? In this lesson, we master the Golden Rule of "Filter Left", learn how `Where-Object` evaluates every object on the conveyor belt using `$_` (`$PSItem`), and master every comparison and boolean operator.',
    whyItMatters:
      'If you query an Active Directory server with 100,000 users using `Get-ADUser -Filter * | Where-Object Department -eq "IT"`, you drag all 100,000 accounts across the network before filtering. Using `-Filter "Department -eq \'IT\'"` asks the Domain Controller to do the filtering, so only the matching accounts travel back. How much faster that is depends on your network and directory size, so measure it yourself with `Measure-Command` (see the exercises below).',
    learningObjectives: [
      'Apply the "Filter Left" performance rule: check whether the source cmdlet has its own filtering parameter (such as `-Filter` or `-FilterHashtable`) before piping to `Where-Object`',
      'Explain why PowerShell uses `-eq`, `-ne`, `-gt`, `-ge`, `-lt`, `-le` instead of `>` or `=`',
      'Write both simplified `Where-Object Property -op Value` and full scriptblock `Where-Object { $_.Property -op Value }` filters',
      'Combine multiple conditions using `-and`, `-or`, `-not` (`!`), `-like` (wildcards `*`), and `-match` (regex)',
    ],
    keyTerms: [
      'Filter Left Rule (Source Filtering)',
      'Where-Object (? / where)',
      '$_ / $PSItem (Current Pipeline Object)',
      'Comparison Operators (-eq, -ne, -gt, -lt, -like, -match)',
      'Logical Operators (-and, -or, -not)',
      'Case-Sensitive Operators (-ceq, -clike)',
    ],
    conceptSections: [
      {
        heading: 'The "Filter Left" Law: Source Filtering (-Filter) vs. Pipeline Filtering (Where-Object)',
        body: [
          'When you need to filter results, you have two places to do it:\n1. **Filter at the Source ("Filter Left" - Fastest):** Many cmdlets have a parameter that filters at the source, but the name and the syntax differ by cmdlet:\n   • `Get-ChildItem -Filter *.dll` uses simple file wildcards.\n   • `Get-CimInstance Win32_Service -Filter "State = \'Running\'"` uses WQL syntax.\n   • `Get-ADUser -Filter "Department -eq \'IT\'"` uses the Active Directory filter syntax.\n   • `Get-WinEvent` has no `-Filter`: it uses `-FilterHashtable @{ LogName = \'System\'; Id = 41 }` (or `-FilterXPath` / `-FilterXml`).\n   (Careful: `Get-ChildItem -Name` is only a switch that returns names instead of objects, it does not filter.) When you use one of these, the underlying provider (NTFS, WMI, Active Directory, the event log) filters the data **before** creating `.NET` objects or sending them across the network.\n2. **Filter in the Pipeline (`Where-Object` - Most Flexible):** Not every cmdlet can filter by the property you want (for example, `Get-Process` only filters by `-Name` or `-Id`, not by CPU or RAM). When the source cmdlet cannot filter by the property you want, pipe the objects into **`Where-Object`**!',
        ],
      },
      {
        heading: 'How Where-Object Works: The $_ ($PSItem) Conveyor Belt Inspector',
        body: [
          'Picture `Where-Object` as a quality-control inspector standing beside the pipeline conveyor belt. As each object rolls by:\n1. PowerShell places that **one current object** inside the automatic variable **`$_`** (also written `$PSItem`).\n2. `Where-Object` runs your condition inside `{ ... }`.\n3. If the condition evaluates to **`$true`**, the object stays on the belt! If it evaluates to **`$false`**, the object is dropped.',
          'Why does PowerShell use `-gt` instead of `>`? Because since the 1970s, the `>` symbol in command shells means **redirect output to a file** (`Get-Process > procs.txt`)! To prevent `>` from accidentally overwriting files inside comparisons, PowerShell uses hyphenated operators:\n• **`-eq` / `-ne`:** Equal to / Not equal to\n• **`-gt` / `-ge`:** Greater than (`>`) / Greater than or equal to (`>=`)\n• **`-lt` / `-le`:** Less than (`<`) / Less than or equal to (`<=`)\n• **`-like` / `-notlike`:** Wildcard pattern match using `*` (`$_.Name -like "svc*"`)\n• **`-match` / `-notmatch`:** Regular expression match\n• **`-in` / `-contains`:** Array membership check\n• **`-and` / `-or` / `-not`:** Combine multiple conditions (`$_.Status -eq "Running" -and $_.StartType -eq "Automatic"`).',
        ],
      },
    ],
    calloutNotes: [
      {
        type: 'key',
        title: 'The One-Sentence Version',
        body: 'Filter as far to the left (at the source cmdlet with `-Filter`) as possible; when filtering in the pipeline with `Where-Object`, `$_` represents each individual object as it passes through.',
      },
      {
        type: 'gotcha',
        title: '-like Requires a Wildcard (*)!',
        body: 'If you write `$_.DisplayName -like "Windows"` *without* an asterisk `*`, it behaves just like `-eq` and only matches the exact word `"Windows"`. Always include `*`: `$_.DisplayName -like "*Windows*"`.',
      },
      {
        type: 'pro',
        title: 'Simplified Syntax vs. ScriptBlock Syntax',
        body: 'For a single condition, you can skip the `{}` braces and `$_`: `Get-Service | Where-Object Status -eq "Running"`. When combining two or more conditions with `-and` or `-or`, you MUST use the `{}` scriptblock syntax with `$_`!',
      },
    ],
    commandBreakdowns: [
      {
        cmdlet: 'Where-Object',
        aliases: ['?', 'where'],
        syntax: 'Where-Object [-FilterScript] <ScriptBlock>',
        parameters: [
          {
            name: '-FilterScript',
            type: 'ScriptBlock',
            description: 'A scriptblock { ... } that uses $_ ($PSItem) to return $true (keep object) or $false (discard object).',
          },
        ],
        examples: [
          'Get-Service | Where-Object Status -eq "Running"',
          'Get-Process | Where-Object { $_.WorkingSet64 -gt 100MB -and $_.Responding -eq $true }',
        ],
      },
    ],
    codeExamples: [
      {
        title: 'Source Filtering (-Filter) vs. Single and Compound Where-Object Filters',
        description: 'Compare fast source filtering on Get-ChildItem with rich multi-condition filtering in Where-Object. The output is sample output (the file names, services and memory numbers on your machine will differ).',
        code: `# 1. Filter Left (at the source): NTFS provider filters BEFORE returning objects
Get-ChildItem -Path C:\\Windows\\System32 -Filter *.dll | Select-Object -First 3 Name, Length

# 2. Single-condition Where-Object (Simplified syntax, no {} or $_ needed)
Get-Service | Where-Object Status -eq 'Running' | Select-Object -First 3 Name, Status

# 3. Multi-condition Where-Object using {}, $_, -and, and the 1MB multiplier
Get-Process |
  Where-Object { $_.WorkingSet64 -gt 100MB -and $_.Name -notlike 'svchost*' } |
  Select-Object Name, Id, @{N='RAM_MB';E={[math]::Round($_.WorkingSet64 / 1MB, 1)}}`,
        output: `Name                 Length
----                 ------
aadcloudap.dll       540672
aadjcsp.dll          184320
aadtb.dll           1142784

Name     Status
----     ------
Appinfo  Running
AudioSrv Running
BFE      Running

Name        Id RAM_MB
----        -- ------
MsMpEng   3412  312.4
explorer  5412  198.2
pwsh      8820  124.5`,
      },
    ],
    mistakesAndTraps: [
      {
        mistake: 'Writing `Where-Object { $_.Status = "Running" }` using `=` instead of `-eq`.',
        cause: '`=` is the assignment operator (it tries to overwrite the property value), whereas `-eq` is the equality comparison operator.',
        fix: 'Always use `-eq` for equality checks in PowerShell.',
      },
    ],
    tryItYourself: [
      'Find all services that are set to start automatically (`StartType -eq "Automatic"`) but are currently stopped (`Status -ne "Running"`). (Hint: this is a classic sysadmin health check!)',
      'Find all processes using more than 50 MB of RAM (`$_.WorkingSet64 -gt 50MB`).',
      'Measure it yourself: compare `Measure-Command { Get-ChildItem C:\\Windows\\System32 -Filter *.dll }` with `Measure-Command { Get-ChildItem C:\\Windows\\System32 | Where-Object Name -like "*.dll" }` and look at the `TotalMilliseconds` of each. Run each twice (the second run is warmer) and compare the numbers on your own machine.',
    ],
    knowledgeCheck: [
      {
        question: 'What does "Filter Left" mean in PowerShell?',
        options: [
          'Always align your code to the left margin',
          'Filter data as early as possible using the source cmdlet’s -Filter parameter before piping to Where-Object',
          'Put Where-Object before Get-Process',
          'Only filter strings from left to right',
        ],
        correctIndex: 1,
        explanation: 'Filtering at the source cmdlet (-Filter) reduces memory and network traffic by discarding unwanted records before PowerShell constructs pipeline objects.',
      },
      {
        question: 'Which command finds all Automatic services that are currently Stopped?',
        options: [
          'Get-Service | Where-Object { $_.StartType = "Automatic" & $_.Status = "Stopped" }',
          'Get-Service | Where-Object { $_.StartType -eq "Automatic" -and $_.Status -eq "Stopped" }',
          'Get-Service -Filter "Stopped"',
          'Get-Service | Select-Object Stopped',
        ],
        correctIndex: 1,
        explanation: 'Compound conditions in Where-Object require a scriptblock { }, $_ for each object, -eq for equality, and -and to join both checks.',
      },
    ],
  },

  {
    id: '7-2',
    chapterId: 'chapter-07',
    slug: 'select-sort-and-safety',
    title: 'Select-Object, Sort-Object, Pipeline Ordering & Safety Switches (-WhatIf)',
    subtitle: 'Avoid the classic -First 3 ordering trap and test destructive commands without breaking anything',
    estimatedMinutes: 25,
    oneSentenceSummary:
      'Order your pipelines `Filter → Sort → Select -First N` so you never slice random rows before sorting, and always test state-changing commands with `-WhatIf` before pulling the trigger.',
    summary:
      'What happens if you run `Get-Process | Select-Object -First 3 | Sort-Object CPU -Descending` thinking you will get the top 3 CPU hogs? You get a completely wrong answer! In this lesson, we see why pipeline stage order matters, master `Select-Object` (`-First`, `-Last`, `-Unique`, `-ExpandProperty`) and `Sort-Object` (`-Descending`), and use PowerShell’s built-in safety switches (`-WhatIf`, `-Confirm`, `-Verbose`) so you never accidentally take down a production server.',
    whyItMatters:
      'Ordering bugs (`Select -First` before `Sort`) silently corrupt reports without throwing an error, and running `Stop-Process` or `Remove-ADUser` with a wildcard without testing `-WhatIf` first is how outages happen.',
    learningObjectives: [
      'Order multi-stage pipelines properly: `Get-*` → `Where-Object` (Filter) → `Sort-Object` (Sort) → `Select-Object -First N` (Slice & Project)',
      'Sort objects in ascending or `-Descending` order across one or multiple properties with `Sort-Object`',
      'Extract raw values from a single property using `Select-Object -ExpandProperty`',
      'Perform dry runs of destructive commands using `-WhatIf`, force confirmation prompts with `-Confirm`, and view detailed execution logs with `-Verbose`',
    ],
    keyTerms: [
      'Pipeline Ordering Trap (Sort before Select -First)',
      'Sort-Object (sort) -Descending',
      'Select-Object -First / -Last / -Unique',
      'Select-Object -ExpandProperty',
      '-WhatIf (Dry-Run Safety Switch)',
      '-Confirm & -Verbose',
    ],
    conceptSections: [
      {
        heading: 'The Classic Pipeline Ordering Trap: Why Sort MUST Come Before Select -First!',
        body: [
          'Suppose I ask you: *"Show me the 3 processes using the most RAM (`WorkingSet64`)."*',
          'Look at what happens if you get the pipeline order backwards:\n• **WRONG:** `Get-Process | Select-Object -First 3 | Sort-Object WorkingSet64 -Descending`\n  What did that actually do? `Get-Process` returns processes in **alphabetical order** (`aggregatorHost`, `ApplicationFrameHost`, `audiodg`). `Select-Object -First 3` immediately throws away the other 180 processes and keeps only those 3 `"A"` processes, and then `Sort-Object` sorts just those 3! You completely missed Chrome, SQL Server, and Defender!\n• **RIGHT:** `Get-Process | Sort-Object WorkingSet64 -Descending | Select-Object -First 3`\n  Here, we **sort all processes from largest to smallest first**, and then slice the top 3!',
          '**My Universal Pipeline Order:**\n`Source (Get-*)` → `Filter (Where-Object)` → `Sort (Sort-Object)` → `Slice & Columns (Select-Object)` → `Output/Export (Format-* or Export-*)`',
        ],
      },
      {
        heading: 'Select-Object -Property vs. -ExpandProperty',
        body: [
          'Here is a subtle distinction you will use constantly in scripts:\n• `Get-Service -Name wuauserv | Select-Object -Property Status`\n  Returns a new object (type `Selected.System.ServiceProcess.ServiceController`) that still has a column header called `Status`.\n• `Get-Service -Name wuauserv | Select-Object -ExpandProperty Status` (or `(Get-Service wuauserv).Status`)\n  Strips away the object wrapper and returns the **raw value itself** (`Running`), which is critical when feeding a list of plain strings into another command.',
        ],
      },
      {
        heading: 'The Safety Seatbelts: -WhatIf, -Confirm, and -Verbose',
        body: [
          'Many cmdlets that change, stop, or delete something (`Stop-Process`, `Stop-Service`, `Remove-Item`, `Remove-ADUser`, `New-LocalUser`) support two lifesaving risk-mitigation parameters (not all of them do: check the `SYNTAX` block in `Get-Help` for `[-WhatIf] [-Confirm]`):\n• **`-WhatIf` (The Dry-Run Simulator):** Tells PowerShell: *"Do NOT actually execute this change, just print on screen exact lines showing what WOULD happen if I ran it for real!"*\n  Example: `Get-Process -Name note* | Stop-Process -WhatIf`\n  Output: `What if: Performing the operation "Stop-Process" on target "notepad (4812)".`\n• **`-Confirm`:** Forces an interactive `[Y] Yes [A] Yes to All [N] No` prompt before each object is modified.\n• **`-Verbose`:** Prints extra diagnostic progress lines showing what the cmdlet is doing under the hood.',
        ],
      },
    ],
    calloutNotes: [
      {
        type: 'key',
        title: 'The One-Sentence Version',
        body: 'Always `Filter → Sort → Select -First N`, and never run a wildcard `Remove-*` or `Stop-*` command without testing `-WhatIf` first.',
      },
      {
        type: 'try',
        title: 'Test -WhatIf Safely Right Now',
        body: 'Run `Get-Service | Where-Object Status -eq "Running" | Stop-Service -WhatIf`. Watch how PowerShell lists every running service it *would* stop without actually touching a single service!',
      },
      {
        type: 'gotcha',
        title: 'How to Tell If a Cmdlet Supports -WhatIf',
        body: 'Look at `Get-Help <Cmdlet>` in the `SYNTAX` block: if you see `[-WhatIf] [-Confirm]`, the cmdlet supports dry-run simulation!',
      },
    ],
    commandBreakdowns: [
      {
        cmdlet: 'Sort-Object',
        aliases: ['sort'],
        syntax: 'Sort-Object [[-Property] <Object[]>] [-Descending] [-Unique]',
        parameters: [
          {
            name: '-Property',
            type: 'Object[]',
            description: 'Specifies one or more properties to sort by.',
          },
          {
            name: '-Descending',
            type: 'SwitchParameter',
            description: 'Sorts from highest to lowest (Z to A, largest to smallest) instead of the default ascending order.',
          },
        ],
        examples: [
          'Get-Process | Sort-Object CPU -Descending',
          'Get-Service | Sort-Object Status, DisplayName',
        ],
      },
      {
        cmdlet: 'Select-Object',
        aliases: ['select'],
        syntax: 'Select-Object [[-Property] <Object[]>] [-First <Int32>] [-Last <Int32>] [-Unique] [-ExpandProperty <String>]',
        parameters: [
          {
            name: '-First',
            type: 'Int32',
            description: 'Selects the first N objects from the pipeline.',
          },
          {
            name: '-ExpandProperty',
            type: 'String',
            description: 'Extracts the raw underlying value (or unrolls a collection) of a single property without an outer object wrapper.',
          },
        ],
        examples: [
          'Get-Process | Sort-Object WorkingSet64 -Descending | Select-Object -First 5 Name, Id, WorkingSet64',
        ],
      },
    ],
    codeExamples: [
      {
        title: 'Correct Pipeline Ordering (Filter -> Sort -> Select) and -WhatIf Dry Runs',
        description: 'Find the top 3 longest-running processes and simulate stopping a process safely with -WhatIf.',
        code: `# 1. Correct Pipeline Order: Filter -> Sort -> Select -First 3
Get-Process |
  Where-Object { $null -ne $_.StartTime } |
  Sort-Object StartTime |
  Select-Object -First 3 Name, Id, StartTime

# 2. Extract raw string values with -ExpandProperty
$runningServiceNames = Get-Service |
  Where-Object Status -eq 'Running' |
  Select-Object -First 3 -ExpandProperty Name
$runningServiceNames

# 3. Preview a destructive action safely with -WhatIf
Get-Process -Name explorer | Stop-Process -WhatIf`,
        output: `Name       Id StartTime
----       -- ---------
lsass     792 11/3/2026 7:59:40 AM
svchost  1428 11/3/2026 7:59:45 AM
explorer 5412 11/3/2026 8:00:12 AM

Appinfo
AudioSrv
BFE

What if: Performing the operation "Stop-Process" on target "explorer (5412)".`,
      },
    ],
    mistakesAndTraps: [
      {
        mistake: 'Running `Get-Process | Select-Object -First 5 | Sort-Object WorkingSet64 -Descending`.',
        cause: 'Slicing `-First 5` before sorting only sorts the first 5 alphabetical processes.',
        fix: 'Always put `Sort-Object` BEFORE `Select-Object -First N`.',
      },
    ],
    tryItYourself: [
      'Write a pipeline that finds the 5 largest files in `C:\\Windows\\System32` sorted by `Length` descending, displaying `Name` and `Length`.',
      'Run `Remove-Item C:\\Windows\\System32\\*.log -WhatIf` to see `-WhatIf` protect files.',
    ],
    knowledgeCheck: [
      {
        question: 'Which pipeline correctly returns the 3 processes using the MOST physical RAM (WorkingSet64)?',
        options: [
          'Get-Process | Select-Object -First 3 | Sort-Object WorkingSet64 -Descending',
          'Get-Process | Sort-Object WorkingSet64 -Descending | Select-Object -First 3',
          'Get-Process | Sort-Object WorkingSet64 | Select-Object -First 3',
          'Select-Object -First 3 | Get-Process',
        ],
        correctIndex: 1,
        explanation: 'You must sort all processes in -Descending order first so the largest processes are at the top, and then slice the -First 3.',
      },
      {
        question: 'What does adding `-WhatIf` to `Stop-Process -Name notepad -WhatIf` do?',
        options: [
          'Stops Notepad silently without printing errors',
          'Simulates the command and prints which process would be stopped without actually terminating it',
          'Asks Notepad to save its file',
          'Deletes notepad.exe from disk',
        ],
        correctIndex: 1,
        explanation: '-WhatIf performs a non-destructive dry run showing the exact target and operation that would occur.',
      },
    ],
  },

  // ==========================================================================
  // CHAPTER 8: EVERYTHING IS A DRIVE: PROVIDERS, REGISTRY & FILE HUNTING
  // ==========================================================================
  {
    id: '8-1',
    chapterId: 'chapter-08',
    slug: 'psproviders-and-psdrives',
    title: 'PSProviders & PSDrives: Treating the Registry, Env & OS Like Folders',
    subtitle: 'Use cd and Get-ChildItem inside HKLM:\\, HKCU:\\, Env:\\, and AD:\\',
    estimatedMinutes: 20,
    oneSentenceSummary:
      'PowerShell Providers (`Get-PSProvider`) map hierarchical data stores, like the Windows Registry (`HKLM:`, `HKCU:`), Environment Variables (`Env:`), Certificates (`Cert:`), and Active Directory (`AD:`), into virtual drives (`Get-PSDrive`) that you navigate with `cd` and `Get-ChildItem`.',
    summary:
      'In traditional shells, you need completely different tools to browse files (`dir`), inspect the Windows Registry (`reg.exe`), read environment variables (`set`), or browse certificates (`certutil`). PowerShell unifies all of them under a single mental model: **PSProviders and PSDrives**. Once you know `Set-Location` (`cd`), `Get-ChildItem` (`dir`/`ls`), and `New-Item`, you already know how to navigate the Registry and Active Directory!',
    whyItMatters:
      'Whether you are checking a registry Run key for malware persistence (`HKLM:\\Software\\Microsoft\\Windows\\CurrentVersion\\Run`), reading `$env:PATH`, or browsing an Active Directory Organizational Unit (`AD:\\`), PSDrives let you reuse the exact same file commands everywhere.',
    learningObjectives: [
      'Distinguish between a `PSProvider` (the adapter driver, like `Registry` or `FileSystem`) and a `PSDrive` (the mounted drive letter/name, like `HKLM:` or `C:`)',
      'List all active providers and drives using `Get-PSProvider` and `Get-PSDrive`',
      'Navigate into the Windows Registry (`Set-Location HKLM:\\SOFTWARE`), Environment (`Get-ChildItem Env:`), and Function/Alias drives',
      'Mount a custom shortcut PSDrive to a deep folder or registry path using `New-PSDrive`',
    ],
    keyTerms: [
      'PSProvider (Get-PSProvider)',
      'PSDrive (Get-PSDrive)',
      'HKLM: (HKEY_LOCAL_MACHINE) & HKCU: (HKEY_CURRENT_USER)',
      'Env: (Environment Variables Drive)',
      'Cert: & AD: Drives',
      'Set-Location (cd) & Get-ItemProperty (gp)',
    ],
    conceptSections: [
      {
        heading: 'The Big Idea: PSProviders (The Adapter) vs. PSDrives (The Drive)',
        body: [
          'Why learn ten different command sets when one works everywhere? PowerShell uses a two-layer architecture:\n• **PSProvider (`Get-PSProvider`):** A plug-in adapter that translates a data store into a folder-and-item hierarchy. Built-in providers include `FileSystem`, `Registry`, `Environment`, `Variable`, `Alias`, `Function`, and `Certificate` (and importing the `ActiveDirectory` module adds the `ActiveDirectory` provider!).\n• **PSDrive (`Get-PSDrive`):** A named drive exposed by a provider:\n  - `FileSystem` provider exposes `C:`, `D:` (and `Temp:` in PowerShell 7)\n  - `Registry` provider exposes **`HKLM:`** (`HKEY_LOCAL_MACHINE`) and **`HKCU:`** (`HKEY_CURRENT_USER`)\n  - `Environment` provider exposes **`Env:`**\n  - `Variable` provider exposes **`Variable:`**\n  - `Certificate` provider exposes **`Cert:`**',
        ],
      },
      {
        heading: 'Browsing the Registry and Environment Like Regular Folders',
        body: [
          'Watch how natural this feels:\n• List all environment variables: `Get-ChildItem Env:`\n• Read a single environment variable: `$env:COMPUTERNAME` or `$env:USERNAME`\n• Change into the Local Machine Registry hive: `Set-Location HKLM:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion`\n• List subkeys right inside the Registry: `Get-ChildItem`\n• Read the values inside the Startup `Run` key (a favorite hiding spot for malware, but only one of several places that can start a program automatically): `Get-ItemProperty HKLM:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Run`',
        ],
      },
    ],
    calloutNotes: [
      {
        type: 'key',
        title: 'The One-Sentence Version',
        body: 'PSProviders turn the Registry (`HKLM:`), Environment (`Env:`), Certificates (`Cert:`), and Active Directory (`AD:`) into virtual drives you browse with `Set-Location` (`cd`) and `Get-ChildItem` (`ls`).',
      },
      {
        type: 'try',
        title: 'Audit Autorun Registry Keys in One Line',
        body: 'Run `Get-ItemProperty HKLM:\\Software\\Microsoft\\Windows\\CurrentVersion\\Run` and `Get-ItemProperty HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Run` to see two of the common places where programs are set to launch automatically at login. (It is not the full list: `RunOnce`, the 32-bit `WOW6432Node` keys, Startup folders, scheduled tasks and services can start programs too.)',
      },
      {
        type: 'gotcha',
        title: 'Remember the Colon (:) on Drive Names!',
        body: 'If you type `Set-Location HKLM` *without* the colon `:`, PowerShell looks for a folder named `HKLM` inside your current directory! Always include the colon: `Set-Location HKLM:` or `Get-ChildItem Env:`.',
      },
    ],
    commandBreakdowns: [
      {
        cmdlet: 'Get-PSDrive',
        aliases: ['gdr'],
        syntax: 'Get-PSDrive [[-Name] <String[]>] [-PSProvider <String[]>]',
        parameters: [
          {
            name: '-PSProvider',
            type: 'String[]',
            description: 'Filters drives by their underlying provider (e.g., FileSystem, Registry).',
          },
        ],
        examples: ['Get-PSDrive', 'Get-PSDrive -PSProvider Registry'],
      },
      {
        cmdlet: 'Get-PSProvider',
        aliases: [],
        syntax: 'Get-PSProvider [[-PSProvider] <String[]>]',
        parameters: [],
        examples: ['Get-PSProvider'],
      },
    ],
    codeExamples: [
      {
        title: 'Exploring PSProviders, PSDrives, Environment Variables, and Registry Keys',
        description: 'Use the exact same navigation cmdlets across FileSystem, Env:, and HKLM: Registry drives. The output is sample output from PowerShell 7 (the Temp: drive exists only in PowerShell 7, and your numbers, paths and user name will differ).',
        code: `# 1. List all loaded PSProviders and the drives they expose
Get-PSProvider | Select-Object Name, Drives

# 2. List all environment variables matching 'PROCESSOR' or 'OS' in the Env: drive
Get-ChildItem Env: | Where-Object Name -match 'PROCESSOR|OS'

# 3. Inspect Windows Startup programs inside the HKLM: Registry drive
Get-ItemProperty -Path 'HKLM:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Run'

# 4. Inspect free and used disk space on FileSystem drives
Get-PSDrive -PSProvider FileSystem`,
        output: `Name        Drives
----        ------
Registry    {HKLM, HKCU}
Alias       {Alias}
Environment {Env}
FileSystem  {C, Temp}
Function    {Function}
Variable    {Variable}

Name                           Value
----                           -----
NUMBER_OF_PROCESSORS           16
OS                             Windows_NT
PROCESSOR_ARCHITECTURE         AMD64

Name           Used (GB)     Free (GB) Provider      Root
----           ---------     --------- --------      ----
C                 142.30        369.70 FileSystem    C:\\
Temp              142.30        369.70 FileSystem    C:\\Users\\izaz\\AppData\\Local\\Temp\\`,
      },
    ],
    mistakesAndTraps: [
      {
        mistake: 'Using `Get-Content` to read Registry values inside a Registry key.',
        cause: 'In the Registry provider, keys act like folders (`Get-ChildItem`), and the values stored *inside* a key are treated as Item Properties.',
        fix: 'Use `Get-ItemProperty -Path HKLM:\\...` to read the values stored inside a Registry key.',
      },
    ],
    tryItYourself: [
      'Run `Get-PSDrive` to see every virtual drive currently mounted in your session.',
      'Run `Set-Location HKCU:\\Software` and then `Get-ChildItem` to browse your current user’s software registry keys, then run `Set-Location C:\\` to return to the C: drive.',
    ],
    knowledgeCheck: [
      {
        question: 'Which two PSDrives are automatically created by the PowerShell Registry provider?',
        options: [
          'REG1: and REG2:',
          'HKLM: (HKEY_LOCAL_MACHINE) and HKCU: (HKEY_CURRENT_USER)',
          'C: and D:',
          'SYS: and USER:',
        ],
        correctIndex: 1,
        explanation: 'The Registry provider mounts HKLM: and HKCU: by default so you can navigate both hives like folders.',
      },
      {
        question: 'What happens if you run `Set-Location Env` instead of `Set-Location Env:`?',
        options: [
          'They do the exact same thing',
          'Without the colon (:), PowerShell looks for a folder named "Env" inside your current working directory instead of switching to the Env: drive',
          'It deletes all environment variables',
          'It opens System Properties',
        ],
        correctIndex: 1,
        explanation: 'Drive names require a trailing colon (C:, HKLM:, Env:). Without the colon, Set-Location treats the argument as a relative subdirectory name.',
      },
    ],
  },

  {
    id: '8-2',
    chapterId: 'chapter-08',
    slug: 'files-and-select-string',
    title: 'Precision File Hunting (Get-ChildItem), Bulk Creation (New-Item) & Select-String',
    subtitle: 'Master -Filter vs -Recurse, create 150 files from a list with a short loop, and grep file contents',
    estimatedMinutes: 25,
    oneSentenceSummary:
      'Use `Get-ChildItem -Filter *.dll -Recurse` to search directory trees at native speed, `New-Item` to create files or folders in bulk, and `Select-String` to search for text patterns inside thousands of files.',
    summary:
      'In this lesson, we put the FileSystem provider through a real engineering workout. We compare the four ways people search for `.dll` files in `C:\\Windows` (and see why only `-Filter *.dll -Recurse` gives you fast, deep results), generate 150 files from a text list with a short `ForEach-Object` loop, and use `Select-String` (PowerShell’s object-oriented `grep`) to hunt for secrets or error codes inside log files.',
    whyItMatters:
      'Searching log files across a server, scaffolding project directories, or hunting for configuration files containing a specific IP address or password keyword are daily realities for every administrator and security analyst.',
    learningObjectives: [
      'Compare `Get-ChildItem -Filter *.dll` with and without `-Recurse`, and against `Where-Object`',
      'Create directories (`-ItemType Directory`) and bulk files (`-ItemType File`) from arrays or text lists (`Get-Content`)',
      'Search inside text files for patterns using `Select-String -Pattern` and inspect `.Filename`, `.LineNumber`, and `.Line`',
      'Combine `Get-ChildItem -Recurse | Select-String` to hunt across an entire directory tree',
    ],
    keyTerms: [
      'Get-ChildItem (gci / dir / ls)',
      '-Filter vs. -Recurse',
      'New-Item (ni) -ItemType Directory / File',
      'Get-Content (gc / cat)',
      'Select-String (sls)',
      'MatchInfo Object (.Filename, .LineNumber, .Line)',
    ],
    conceptSections: [
      {
        heading: 'The 4 Get-ChildItem Variations Every Engineer Must Know Cold',
        body: [
          'Suppose you need to find `.dll` files inside `C:\\Windows`. Look closely at the exact difference between these four commands:\n1. **`Get-ChildItem -Path C:\\Windows -Filter *.dll`**\n   Fast source filter, **top folder only** (does NOT look inside subfolders like `System32`).\n2. **`Get-ChildItem -Path C:\\Windows -Filter *.dll -Recurse -ErrorAction SilentlyContinue`**\n   **The Winner for Deep Hunts!** Fast source filter **AND** searches every subfolder recursively.\n3. **`Get-ChildItem -Path C:\\Windows | Where-Object Name -like "*.dll"`**\n   Fetches all items in the top folder first, then filters in the pipeline (no subfolders).\n4. **`Get-ChildItem -Path C:\\Windows -Recurse | Where-Object Name -like "*.dll"`**\n   Slowest! Pulls **every single file under `C:\\Windows`** across the pipeline before `Where-Object` checks if the name ends in `.dll`. Always prefer `#2` (`-Filter *.dll -Recurse`)!',
        ],
      },
      {
        heading: 'Bulk File & Folder Creation with New-Item',
        body: [
          'In PowerShell, **`New-Item`** creates both folders and files (and even Registry keys!) depending on **`-ItemType`**:\n• Create a folder: `New-Item -Path C:\\Lab -Name Reports -ItemType Directory`\n• Create a file: `New-Item -Path C:\\Lab\\Reports -Name readme.txt -ItemType File -Value "Initial log"`',
          '**The Bulk Creation Trick:** `New-Item -Name` accepts only ONE name (a single `[String]`), so passing an array to `-Name` fails with a "Cannot convert System.Object[] to String" style error. Instead, read the names and send them one at a time through `ForEach-Object` (`$_` is the current name; you will see this cmdlet properly in a later lesson). You can create 150 files from a text list (`files.txt`) with a short loop:\n`$names = Get-Content -Path C:\\Lab\\files.txt`\n`$names | ForEach-Object { New-Item -Path C:\\Lab\\Output -Name $_ -ItemType File }`',
        ],
      },
      {
        heading: 'Searching Inside Files with Select-String (PowerShell’s Object Grep)',
        body: [
          'What if you don’t know *which* file contains the word `"ERROR"` or `"password"`? Use **`Select-String`** (alias `sls`):\n`Get-ChildItem -Path C:\\Logs -Filter *.log -Recurse | Select-String -Pattern "ERROR"`',
          'Unlike Linux `grep` (which spits out raw text lines), `Select-String` outputs rich **`Microsoft.PowerShell.Commands.MatchInfo` objects** containing `.Filename`, `.Path`, `.LineNumber`, and `.Line` - so you can group, count, or export your matches cleanly!',
        ],
      },
    ],
    calloutNotes: [
      {
        type: 'key',
        title: 'The One-Sentence Version',
        body: 'Combine `-Filter` (what filename to match at the source) with `-Recurse` (search all subfolders) on `Get-ChildItem`, and pipe to `Select-String` when searching *inside* files.',
      },
      {
        type: 'try',
        title: 'Create 3 Files in One Pipeline',
        body: 'Run `"srv1.txt","srv2.txt","srv3.txt" | ForEach-Object { New-Item -Path $env:TEMP -Name $_ -ItemType File }` and watch three empty files appear in your temp folder. (`New-Item -Name` takes a single name, so the loop feeds it one name at a time.) Clean up afterwards with `Remove-Item $env:TEMP\\srv?.txt`.',
      },
      {
        type: 'pro',
        title: 'Suppressing Permission Warnings During Deep Recursive Searches',
        body: 'When scanning `C:\\Windows -Recurse` as a standard user, protected folders like `C:\\Windows\\CSC` throw red Access Denied errors. Add `-ErrorAction SilentlyContinue` so your search continues smoothly.',
      },
    ],
    commandBreakdowns: [
      {
        cmdlet: 'Get-ChildItem',
        aliases: ['gci', 'dir', 'ls'],
        syntax: 'Get-ChildItem [[-Path] <String[]>] [[-Filter] <String>] [-Recurse] [-File] [-Directory] [-Force]',
        parameters: [
          {
            name: '-Filter',
            type: 'String',
            description: 'High-speed provider-level filename filter (e.g., *.dll, *.log).',
          },
          {
            name: '-Recurse',
            type: 'SwitchParameter',
            description: 'Searches the specified path and all nested subdirectories.',
          },
          {
            name: '-Force',
            type: 'SwitchParameter',
            description: 'Includes hidden and system files in the results.',
          },
        ],
        examples: [
          'Get-ChildItem -Path C:\\Windows -Filter *.dll -Recurse -ErrorAction SilentlyContinue',
        ],
      },
      {
        cmdlet: 'Select-String',
        aliases: ['sls'],
        syntax: 'Select-String [-Pattern] <String[]> [-Path <String[]>] [-CaseSensitive]',
        parameters: [
          {
            name: '-Pattern',
            type: 'String[]',
            description: 'Specifies the text or regular expression pattern to search for inside each file.',
          },
        ],
        examples: [
          'Get-ChildItem -Path C:\\Windows\\Logs -Filter *.log -Recurse | Select-String -Pattern "Error"',
        ],
      },
    ],
    codeExamples: [
      {
        title: 'Fast Recursive File Hunting, Bulk Creation from a List, and Select-String',
        description: 'Compare -Filter with -Recurse, create multiple files from a list with a ForEach-Object loop, and grep inside files with Select-String. The output is sample output (file names and sizes differ on your machine).',
        code: `# 1. Fast recursive search for .dll files using -Filter and -Recurse
Get-ChildItem -Path C:\\Windows\\System32 -Filter *.dll -Recurse -ErrorAction SilentlyContinue |
  Select-Object -First 3 Name, FullName, Length

# 2. Create a directory, then create several files from a list.
#    New-Item -Name accepts ONE name, so a loop feeds it one name at a time.
$labDir = Join-Path $env:TEMP 'PSAcademyLab'
New-Item -Path $labDir -ItemType Directory -Force | Out-Null

$fileNames = @('web01.log', 'db01.log', 'dc01.log')
$fileNames | ForEach-Object {
  New-Item -Path $labDir -Name $_ -ItemType File -Value "2026-11-03 INFO: Service healthy\`n2026-11-03 ERROR: Timeout on port 443" -Force | Out-Null
}

# 3. Search inside all .log files for 'ERROR' and return structured MatchInfo properties
Get-ChildItem -Path $labDir -Filter *.log -Recurse |
  Select-String -Pattern 'ERROR' |
  Select-Object Filename, LineNumber, Line

# 4. Clean up the practice folder when you are done
# Remove-Item -Path $labDir -Recurse`,
        output: `Name             FullName                                 Length
----             --------                                 ------
aadcloudap.dll   C:\\Windows\\System32\\aadcloudap.dll       540672
aadjcsp.dll      C:\\Windows\\System32\\aadjcsp.dll          184320
aadtb.dll        C:\\Windows\\System32\\aadtb.dll           1142784

Filename LineNumber Line
-------- ---------- ----
db01.log          2 2026-11-03 ERROR: Timeout on port 443
dc01.log          2 2026-11-03 ERROR: Timeout on port 443
web01.log         2 2026-11-03 ERROR: Timeout on port 443`,
      },
    ],
    mistakesAndTraps: [
      {
        mistake: 'Running `New-Item -Path C:\\MyFolder` without specifying `-ItemType Directory`.',
        cause: '`New-Item` needs to know whether you want to create a `File` or a `Directory` (otherwise it prompts you interactively).',
        fix: 'Always specify `-ItemType Directory` for folders and `-ItemType File` for files.',
      },
    ],
    tryItYourself: [
      'Compare the speed and output count of `(Get-ChildItem -Path C:\\Windows -Filter *.exe).Count` (top folder only) vs `(Get-ChildItem -Path C:\\Windows -Filter *.exe -Recurse -ErrorAction SilentlyContinue).Count`.',
      'Use `Select-String` to search for a specific word across `.txt` or `.log` files in your directory.',
    ],
    knowledgeCheck: [
      {
        question: 'What is the fastest and most efficient command to find all .dll files inside C:\\Windows AND all of its subfolders?',
        options: [
          'Get-ChildItem -Path C:\\Windows -Filter *.dll',
          'Get-ChildItem -Path C:\\Windows -Filter *.dll -Recurse',
          'Get-ChildItem -Path C:\\Windows -Recurse | Where-Object Name -like "*.dll"',
          'Select-String -Path C:\\Windows -Pattern "*.dll"',
        ],
        correctIndex: 1,
        explanation: 'Combining -Filter *.dll (high-speed source filtering) with -Recurse (all subdirectories) lets the NTFS provider filter at native speed while traversing the tree.',
      },
      {
        question: 'Which cmdlet searches INSIDE the text contents of files for a word or regular expression and returns MatchInfo objects with Filename and LineNumber?',
        options: ['Find-File', 'Select-String', 'Where-Object', 'Get-ChildItem'],
        correctIndex: 1,
        explanation: 'Select-String (alias sls) searches inside strings and files for text/regex patterns and outputs structured MatchInfo objects.',
      },
    ],
  },
];
