import type { TeachingMap } from '../../types';

export const TEACHING_A: TeachingMap = {
  // ==========================================================================
  // 1-1  Windows evolution, kernel convergence and least privilege
  // ==========================================================================
  '1-1': {
    hook: `If a laptop and a datacenter server run the same kernel, why does one choice, the account you log in with, decide whether a single bad click is a shrug or a disaster?`,
    mentalModel: `Picture Windows as one engine bolted into different vehicles: a family car (Client) and a freight truck (Server). Your account is the key. A valet key (standard user) lets you drive but not open the engine bay. A master key (administrator) opens everything, so you only fetch it when you must lift the hood, then put it back.`,
    misconceptions: [
      {
        myth: `Windows Server is a totally different operating system from Windows 11, so I have to learn it from scratch.`,
        truth: `Both are built on the same NT kernel. Server is tuned differently (background services, more hardware, Server Roles, optional no-GUI Server Core), but the processes, services, registry and PowerShell you learn on a laptop carry over.`,
        test: `Run [System.Environment]::OSVersion on a Windows 11 PC and on a Server. Both report Platform Win32NT and a 10.0.x build number.`,
      },
      {
        myth: `If my account is in the Administrators group, everything I run is already running as admin.`,
        truth: `UAC gives an admin account two tokens: a stripped standard one and a full one. Your normal shell uses the stripped token (Medium integrity) until you approve an elevation prompt.`,
        test: `Run whoami /groups | Select-String 'Mandatory Level' in a normal window, then in "Run as administrator". Medium becomes High.`,
      },
      {
        myth: `I am careful, so using an admin account all day is fine.`,
        truth: `Least privilege is not about trusting yourself. Anything you launch, including a mistyped command or a booby-trapped attachment, inherits your token. A smaller token means a smaller blast radius, however careful you are.`,
        test: `Count your privileges: (whoami /priv | Select-String '^Se' | Measure-Object).Count. A standard shell shows about 5, an elevated one shows 20 or more.`,
      },
    ],
    workedExample: {
      goal: `Prove who you are and how powerful the current PowerShell window really is.`,
      steps: [
        {
          think: `Before I change anything on a machine I always ask "who am I?" first. It takes one second and prevents mistakes.`,
          action: `whoami`,
          result: `DESKTOP-LAB\\yourname (the machine or domain name, then your account).`,
        },
        {
          think: `Being in the Administrators group is not the same as being elevated. The integrity level label on my token tells the real story.`,
          action: `whoami /groups | Select-String 'Mandatory Level'`,
          result: `Mandatory Label\\Medium Mandatory Level ... S-1-16-8192 in a normal window. Medium means a standard token. High (S-1-16-12288) means elevated.`,
        },
        {
          think: `I want a second opinion from .NET so I can reuse this check inside scripts later.`,
          action: `[Security.Principal.WindowsPrincipal]::new([Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)`,
          result: `False in a normal window, even if your account is an administrator.`,
        },
        {
          think: `Privileges are the verbs my token is allowed to use. Counting them shows how much power I am carrying.`,
          action: `(whoami /priv | Select-String '^Se' | Measure-Object).Count`,
          result: `A small number, about 5, for a standard token.`,
        },
        {
          think: `Now the comparison. I will open a second window only to measure, then close it right away. Admin windows are for jobs, not for living in.`,
          action: `Press Win+X, choose Terminal (Admin) or Windows PowerShell (Admin), approve the UAC prompt, run the same count, then close the window.`,
          result: `A much bigger number, usually 20 or more, and the group check now says High Mandatory Level.`,
        },
      ],
      takeaway: `Same person, same account, two very different tokens. Work in the small one and borrow the big one only for the minute you need it.`,
    },
    checkpoints: [
      {
        question: `Which file is the NT kernel, and do Windows 11 and Windows Server 2025 use the same one?`,
        hint: `It lives in System32 and its name starts with "nt".`,
        answer: `C:\\Windows\\System32\\ntoskrnl.exe. Yes, both use the NT kernel. They differ in tuning, defaults and the Server Roles they offer.`,
      },
      {
        question: `Why can malware launched from a standard-user session usually not edit C:\\Windows\\System32?`,
        hint: `Think about whose permissions a program inherits.`,
        answer: `A process inherits the access token of the user who launched it. A standard token has no write permission on System32, so the malware hits "Access denied" just like you would.`,
      },
      {
        question: `What does UAC actually do for an account that is a member of Administrators?`,
        hint: `Think two tokens.`,
        answer: `It keeps the full admin token locked away and runs your normal programs with a filtered standard token. The full token is only used after you approve an elevation prompt.`,
      },
    ],
    challenge: {
      brief: `Find out whether your PowerShell window is Standard or Elevated, without changing anything. Run the whoami /groups command from the worked example, find the line that contains the words Mandatory Level, and read whether it says Medium (standard) or High (elevated).`,
      hints: [
        `Nearly the whole answer: whoami /groups | Select-String 'Mandatory Level'. Type it exactly, press Enter, and look for the word Medium or High in the one line it prints.`,
        `If nothing prints, check the quotes and the pipe character |. The pipe sends the output of whoami to Select-String, which keeps only the lines containing your text.`,
        `Extension (the hard version, only when the easy one works): write one line that prints the word Elevated or Standard. Wrap [Security.Principal.WindowsIdentity]::GetCurrent() in a WindowsPrincipal, call IsInRole() with the Administrator value from [Security.Principal.WindowsBuiltInRole], and use an if/else on the True or False result.`,
      ],
      solution: `whoami /groups | Select-String 'Mandatory Level'\n\nExtension:\nif ([Security.Principal.WindowsPrincipal]::new([Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) { 'Elevated' } else { 'Standard' }`,
      why: `The integrity label on your token is Medium in a normal window and High after elevation. The extension asks the same question through .NET: IsInRole checks the token of the running process, so it is False in a normal window even for an administrator account, and the script reports exactly what this session can do.`,
    },
    teachBack: `Explain to a friend who only knows "admin" and "not admin" why a Windows laptop and a Windows Server feel different but share one kernel, and why you should still use a standard account every day.`,
    diagrams: [
      {
        kind: 'tree',
        title: `One kernel, many vehicles`,
        caption: `Everything in the Windows family hangs off the same NT kernel. Only the tuning and the shipped features change.`,
        root: {
          label: `NT kernel`,
          sub: `ntoskrnl.exe`,
          detail: `The shared engine since Windows NT 3.1 in 1993: memory protection, security tokens, scheduler, drivers.`,
          tone: 'blue',
          children: [
            {
              label: `Windows 10 / 11`,
              sub: `Client`,
              detail: `Tuned so the window you are using stays snappy. Ships consumer apps and desktop features.`,
              tone: 'cyan',
            },
            {
              label: `Windows Server 2025`,
              sub: `Datacenter workhorse`,
              detail: `Tuned for background services and huge hardware. Adds Server Roles such as AD DS, DNS, DHCP and Hyper-V.`,
              tone: 'green',
              children: [
                {
                  label: `Server Core`,
                  sub: `No desktop GUI`,
                  detail: `The same Server with no desktop shell. Smaller attack surface, managed with PowerShell and remote tools.`,
                  tone: 'green',
                },
                {
                  label: `Desktop Experience`,
                  sub: `Server with a GUI`,
                  detail: `The same Server with the familiar desktop and graphical consoles installed.`,
                  tone: 'green',
                },
              ],
            },
            {
              label: `Windows VMs in Azure`,
              sub: `Same kernel, virtual HW`,
              detail: `A Windows VM in the cloud is still Windows Server or Client. It just sees virtual CPUs and disks.`,
              tone: 'violet',
            },
            {
              label: `WSL2`,
              sub: `Linux kernel beside NT`,
              detail: `WSL2 runs a real Linux kernel in a lightweight virtual machine next to Windows. It is a neighbour of the NT kernel, not a branch of it.`,
              tone: 'amber',
            },
          ],
        },
      },
      {
        kind: 'compare',
        title: `Daily admin vs standard plus elevate`,
        caption: `The same careless click lands very differently depending on the token your shell carries.`,
        left: {
          heading: `Logged in as admin all day`,
          tone: 'red',
          rows: [
            { label: `Token in use`, value: `Full administrator token` },
            { label: `Bad attachment can`, value: `Install services, edit System32` },
            { label: `Mistyped Remove-Item`, value: `Can delete almost anywhere` },
            { label: `Blast radius`, value: `The whole machine` },
          ],
        },
        right: {
          heading: `Standard user, elevate on demand`,
          tone: 'green',
          rows: [
            { label: `Token in use`, value: `Filtered standard token` },
            { label: `Bad attachment can`, value: `Touch your own profile only` },
            { label: `Mistyped Remove-Item`, value: `Blocked outside your files` },
            { label: `Blast radius`, value: `Your user profile` },
          ],
        },
        verdict: `Elevation is a speed bump that makes you pause. Taking it away does not make you faster, it makes every mistake bigger.`,
      },
    ],
  },

  // ==========================================================================
  // 1-2  Processes, threads, tokens, handles
  // ==========================================================================
  '1-2': {
    hook: `You double-click Notepad. Which thing actually runs on the CPU: the program, the process, or something smaller that nobody tells you about?`,
    mentalModel: `A process is a restaurant kitchen: it owns the stoves and ingredients (memory), a rack of numbered keys (handles) and the health permit on the wall (the access token). The kitchen cooks nothing by itself. Threads are the chefs, and the CPU only ever hands out turns to chefs.`,
    misconceptions: [
      {
        myth: `The CPU runs processes.`,
        truth: `The scheduler runs threads. A process is only the container that owns memory, handles and the token. A process with no threads is just a corpse waiting to be cleaned up.`,
        test: `(Get-Process -Id $PID).Threads.Count shows how many threads your own PowerShell window owns. It is never 1.`,
      },
      {
        myth: `A PID is a permanent ID for a program.`,
        truth: `A PID names one running process only for its lifetime. Windows recycles the numbers, so a PID in an old log may now belong to a different program.`,
        test: `$a = Start-Process notepad -PassThru; $a.Id; Stop-Process -Id $a.Id; $b = Start-Process notepad -PassThru; $b.Id; Stop-Process -Id $b.Id. The numbers differ, and over time old ones get reused.`,
      },
      {
        myth: `If Task Manager shows svchost.exe, the process must be legitimate.`,
        truth: `A name is just a label any file can carry. Judge a process by its path on disk, its digital signature and its parent process, never by the name alone.`,
        test: `Get-CimInstance Win32_Process -Filter "Name = 'svchost.exe'" | Select-Object -First 3 ProcessId, ParentProcessId, ExecutablePath shows the parent and path you should check.`,
      },
    ],
    workedExample: {
      goal: `Triage a running process like an investigator: how big is it, who started it, where does it live, and is it signed?`,
      steps: [
        {
          think: `First I find who is holding many kernel objects. A handle count is a cheap, fast signal.`,
          action: `Get-Process | Sort-Object Handles -Descending | Select-Object -First 5 Name, Id, Handles, @{n='Threads';e={$_.Threads.Count}}`,
          result: `A table of five busy processes with their handle and thread counts. System and a browser are often near the top.`,
        },
        {
          think: `I need a process I can safely study. My own shell is perfect, and CIM gives me the parent PID that Get-Process hides in Windows PowerShell 5.1.`,
          action: `$me = Get-CimInstance Win32_Process -Filter "ProcessId = $PID"; $me | Select-Object ProcessId, ParentProcessId, ExecutablePath, CommandLine`,
          result: `Your shell's PID, the PID of whoever launched it, and the full path of powershell.exe or pwsh.exe.`,
        },
        {
          think: `A parent PID is only a number. I turn it into a name to see who started this shell.`,
          action: `Get-Process -Id $me.ParentProcessId | Select-Object Name, Id`,
          result: `Usually explorer, WindowsTerminal or another shell. If the parent has already exited you get an error, which is normal and a good reminder that a PPID is a record, not a live link.`,
        },
        {
          think: `The name proves nothing, so I check the path is where I expect and that the file is signed.`,
          action: `Get-AuthenticodeSignature $me.ExecutablePath | Select-Object Status, Path`,
          result: `Status Valid for a genuine Microsoft-signed shell.`,
        },
        {
          think: `Last, the threads. I want to see that a process is a container holding several workers.`,
          action: `(Get-Process -Id $PID).Threads | Select-Object -First 5 Id, ThreadState, PriorityLevel`,
          result: `Several thread IDs with states like Wait. Most threads wait most of the time, which is healthy.`,
        },
      ],
      takeaway: `Name, path, signature and parent: four quick facts turn "looks fine" into evidence.`,
    },
    checkpoints: [
      {
        question: `Name the five things every process is born with.`,
        hint: `One is a number, one is a private sandbox of addresses.`,
        answer: `A PID, a private virtual address space, loaded code and DLLs, a handle table plus a security access token, and at least one thread.`,
      },
      {
        question: `Why does a single-threaded app show "Not Responding" while it saves a huge file?`,
        hint: `Who is left to listen to the mouse?`,
        answer: `The only thread is busy with the slow disk write, so nothing is processing window messages. A well-written app does the save on a worker thread and keeps the UI thread free.`,
      },
      {
        question: `What is a handle?`,
        hint: `Think claim ticket.`,
        answer: `A number in the process's handle table that stands for an open kernel object such as a file, registry key or thread. It is only meaningful inside that one process.`,
      },
    ],
    challenge: {
      brief: `List the five processes with the most threads, showing name, PID and thread count, and also print the name of each one's parent process. Do not change anything.`,
      hints: [
        `Get-Process exposes a Threads collection, so $_.Threads.Count gives a count.`,
        `Get-CimInstance Win32_Process has ParentProcessId. Build a lookup of all processes by ProcessId first.`,
        `Create a hashtable keyed by ProcessId, then use it inside a calculated property to turn ParentProcessId into a name.`,
      ],
      solution: `$names = @{}
Get-CimInstance Win32_Process | ForEach-Object { $names[[int]$_.ProcessId] = $_.Name }
Get-Process |
  Select-Object Name, Id, @{n='Threads';e={$_.Threads.Count}} |
  Sort-Object Threads -Descending |
  Select-Object -First 5 Name, Id, Threads, @{n='Parent';e={ $pp = (Get-CimInstance Win32_Process -Filter "ProcessId = $($_.Id)").ParentProcessId; $names[[int]$pp] }}`,
      why: `The hashtable turns a PID into a name in constant time. Get-Process gives the thread data, CIM gives the lineage, and a calculated property joins the two without any loops of your own.`,
    },
    teachBack: `Explain to a friend who only knows "programs and apps" what the difference is between a program on disk, a process, and a thread, using the kitchen picture in your own words.`,
    diagrams: [
      {
        kind: 'tree',
        title: `What lives inside one process`,
        caption: `A process is a container. Its resources are shared by every thread inside it, and the threads do the actual running.`,
        root: {
          label: `notepad.exe process`,
          sub: `PID 4812 (recycled later)`,
          detail: `The living container the kernel built when you double-clicked. The PID names it only while it is alive.`,
          tone: 'blue',
          children: [
            {
              label: `Private address space`,
              sub: `Memory nobody else sees`,
              detail: `Holds the .exe code, loaded DLLs, the heap and each thread's stack, all inside this process's own virtual memory.`,
              tone: 'cyan',
            },
            {
              label: `Handle table`,
              sub: `Numbered claim tickets`,
              detail: `One entry for each open file, registry key or event. The numbers mean nothing in any other process.`,
              tone: 'violet',
            },
            {
              label: `Access token`,
              sub: `The identity badge`,
              detail: `Inherited from the parent. It decides which files and registry keys this process may open.`,
              tone: 'amber',
            },
            {
              label: `Threads`,
              sub: `The chefs`,
              detail: `What the scheduler really runs. All of them share the memory and handles above.`,
              tone: 'green',
              children: [
                {
                  label: `UI thread`,
                  sub: `Paints and listens`,
                  detail: `Redraws the window and responds to clicks. If it gets stuck, the window freezes.`,
                  tone: 'green',
                },
                {
                  label: `Worker thread`,
                  sub: `Saves in background`,
                  detail: `Does slow jobs like writing a file so the UI thread stays free.`,
                  tone: 'green',
                },
              ],
            },
          ],
        },
      },
      {
        kind: 'compare',
        title: `One chef vs a kitchen crew`,
        caption: `The same save-a-big-file job, with and without worker threads.`,
        left: {
          heading: `Single-threaded app`,
          tone: 'red',
          rows: [
            { label: `Who saves the file`, value: `The only thread` },
            { label: `Who listens to the mouse`, value: `Nobody until the save ends` },
            { label: `What you see`, value: `"Not Responding"` },
            { label: `Memory`, value: `One stack, easy but blocking` },
          ],
        },
        right: {
          heading: `Multi-threaded app`,
          tone: 'green',
          rows: [
            { label: `Who saves the file`, value: `A worker thread` },
            { label: `Who listens to the mouse`, value: `The UI thread, as usual` },
            { label: `What you see`, value: `A progress bar that moves` },
            { label: `Memory`, value: `Shared, so threads need care` },
          ],
        },
        verdict: `Threads cost a little coordination, but they let a process do two things at once while keeping the window alive.`,
      },
    ],
  },

  // ==========================================================================
  // 1-3  Virtual memory
  // ==========================================================================
  '1-3': {
    hook: `Your PC has 16 GB of RAM but you have 24 GB of apps open and nothing has crashed. Where did the extra 8 GB go, and why can't one app read another app's memory?`,
    mentalModel: `Think of a hotel front desk. Every guest holds a card that says "Room 1, Room 2, Room 3" (virtual addresses). The desk (Memory Manager) privately maps each guest's rooms to real rooms (RAM) or to the storage closet (pagefile.sys). Two guests can both own "Room 1" and never meet.`,
    misconceptions: [
      {
        myth: `Virtual memory is just another name for the pagefile, a slow fake RAM on disk.`,
        truth: `Virtual memory is the always-on address translation that gives each process its private view. The pagefile is only the overflow area for pages that do not fit in RAM.`,
        test: `Get-Process -Id $PID | Select-Object WorkingSet64, VirtualMemorySize64. The virtual number is far larger than the RAM actually held, even with the pagefile barely used.`,
      },
      {
        myth: `If Task Manager shows memory almost full, I have a leak or need more RAM.`,
        truth: `Windows deliberately uses spare RAM as cache. The real pressure signals are low available memory and a high rate of hard page faults (pages read from disk).`,
        test: `Get-Counter '\\Memory\\Available MBytes','\\Memory\\Pages/sec' -SampleInterval 1 -MaxSamples 3. Healthy machines show decent available MB and low Pages/sec.`,
      },
      {
        myth: `With 32 GB of RAM I can safely delete or disable pagefile.sys.`,
        truth: `Windows uses the pagefile to back its commit limit and to write crash dumps. Removing it can make apps fail to allocate memory even when RAM looks free. Leave it system-managed.`,
        test: `Get-CimInstance Win32_PageFileUsage | Select-Object Name, AllocatedBaseSize, CurrentUsage shows the file exists and how much of it is in use.`,
      },
    ],
    workedExample: {
      goal: `Read the memory story of a process without confusing working set, private memory and virtual size.`,
      steps: [
        {
          think: `Everything is counted in pages, so I check the page size first. I should not assume it.`,
          action: `[Environment]::SystemPageSize`,
          result: `4096, which is 4 KB.`,
        },
        {
          think: `I will inspect my own shell with three different numbers and give each a plain-English meaning.`,
          action: `$p = Get-Process -Id $PID; $p | Select-Object Name, @{n='WorkingSetMB';e={[math]::Round($_.WorkingSet64/1MB,1)}}, @{n='PrivateMB';e={[math]::Round($_.PrivateMemorySize64/1MB,1)}}, @{n='VirtualMB';e={[math]::Round($_.VirtualMemorySize64/1MB,1)}}`,
          result: `WorkingSet is RAM held right now, Private is memory this process alone committed, Virtual is the address range reserved. Virtual is usually the largest.`,
        },
        {
          think: `If memory is sliced into 4 KB pages, I can turn the working set into a page count.`,
          action: `$p.WorkingSet64 / 4KB`,
          result: `A number in the thousands: how many 4 KB pages of this process are in RAM.`,
        },
        {
          think: `Now the overflow area. Is the pagefile used, and how big is it?`,
          action: `Get-CimInstance Win32_PageFileUsage | Select-Object Name, AllocatedBaseSize, CurrentUsage`,
          result: `C:\\pagefile.sys with sizes in MB. Low current usage on a healthy machine.`,
        },
        {
          think: `Finally I check whether the system is actually paging from disk right now, which is the real health signal.`,
          action: `Get-Counter '\\Memory\\Pages/sec' -SampleInterval 1 -MaxSamples 3`,
          result: `Three samples with a CookedValue. Small values are normal, sustained large values mean disk thrashing.`,
        },
      ],
      takeaway: `Big virtual numbers are normal, big working sets are normal, and only sustained paging activity points to a real memory shortage.`,
    },
    checkpoints: [
      {
        question: `How big is a memory page on Windows x64, and who manages the mapping?`,
        hint: `The number is also the answer to [Environment]::SystemPageSize.`,
        answer: `4 KB (4096 bytes). The Windows Memory Manager, helped by the CPU's MMU, keeps page tables that map virtual pages to physical frames or to disk.`,
      },
      {
        question: `What is the difference between a soft and a hard page fault?`,
        hint: `One needs the disk and one does not.`,
        answer: `A soft fault finds the page already somewhere in RAM and just fixes the mapping. A hard fault must read the page from disk (the pagefile, or the original .exe or .dll file for code), which is far slower.`,
      },
      {
        question: `120 processes use kernel32.dll. Does Windows keep 120 copies in RAM?`,
        hint: `The code is read-only.`,
        answer: `No. One physical copy is mapped into all 120 virtual address spaces, so code is shared while each process keeps its own private data.`,
      },
    ],
    challenge: {
      brief: `Show the ten processes using the most RAM (working set) with the size in MB and also the equivalent number of 4 KB pages. Read-only.`,
      hints: [
        `Sort by WorkingSet64 in descending order and take the first ten.`,
        `A calculated property with Select-Object lets you add a column that is not on the object.`,
        `Pages = WorkingSet64 / 4KB. Use [math]::Round to keep MB tidy.`,
      ],
      solution: `Get-Process |
  Sort-Object WorkingSet64 -Descending |
  Select-Object -First 10 Name, Id,
    @{n='WorkingSetMB';e={[math]::Round($_.WorkingSet64/1MB,1)}},
    @{n='Pages4KB';e={[math]::Round($_.WorkingSet64/4KB)}}`,
      why: `WorkingSet64 is the bytes of RAM currently mapped for the process. Dividing by 1MB or 4KB turns the raw number into units you can reason about, and sorting first means the cheap Select-Object only formats ten rows.`,
    },
    teachBack: `Explain to a friend who thinks "RAM is the only memory" how two programs can both use the address 0x00401000 at the same time without overwriting each other.`,
    diagrams: [
      {
        kind: 'layers',
        title: `From virtual address to real bytes`,
        caption: `A hard page fault takes the long road through the pagefile. A normal access stops at the RAM frame.`,
        layers: [
          {
            label: `Thread uses 0x00401000`,
            sub: `A virtual address`,
            detail: `Your code only ever sees virtual addresses. It has no idea where the bytes really live.`,
            tone: 'blue',
          },
          {
            label: `Page table lookup`,
            sub: `CPU MMU + Memory Manager`,
            detail: `The 4 KB page number is looked up. The entry says either "frame 812 in RAM" or "not present".`,
            tone: 'cyan',
          },
          {
            label: `pagefile.sys`,
            sub: `Overflow on disk`,
            detail: `If the page was paged out, or is backed by a file such as a DLL, the kernel pauses the thread and reads the 4 KB page back from disk: the pagefile for private data, the original file for code.`,
            tone: 'amber',
          },
          {
            label: `Physical RAM frame`,
            sub: `Fast, real memory`,
            detail: `The page lands in a free frame, the page table is updated, and the thread resumes as if nothing happened.`,
            tone: 'green',
          },
        ],
        traceLabel: `Trace a hard page fault`,
        tracePath: [0, 1, 2, 3],
      },
      {
        kind: 'compare',
        title: `Soft fault vs hard fault`,
        caption: `Both are normal. The difference is whether the disk is involved.`,
        left: {
          heading: `Soft page fault`,
          tone: 'green',
          rows: [
            { label: `Where is the page`, value: `Already in RAM` },
            { label: `Kernel work`, value: `Fix the mapping` },
            { label: `Cost`, value: `Microseconds` },
            { label: `Symptom`, value: `None you can feel` },
          ],
        },
        right: {
          heading: `Hard page fault`,
          tone: 'red',
          rows: [
            { label: `Where is the page`, value: `On disk (pagefile or file)` },
            { label: `Kernel work`, value: `Read 4 KB, then map it` },
            { label: `Cost`, value: `Far slower, disk speed` },
            { label: `Symptom`, value: `Lag if it happens constantly` },
          ],
        },
        verdict: `A few hard faults are fine. Hundreds per second, sustained, is thrashing and the signal to add RAM or close apps.`,
      },
    ],
  },

  // ==========================================================================
  // 2-1  User mode, kernel mode, syscalls
  // ==========================================================================
  '2-1': {
    hook: `A game crashes and Windows quietly closes one window. A storage driver crashes and the whole PC dies with a blue screen. What invisible wall makes the difference?`,
    mentalModel: `Imagine an airport. Apps wait in the public terminal (Ring 3). Only staff walk the airside runway (Ring 0). When a passenger needs a bag moved, they hand a boarding pass (a handle) to a gate agent (NTDLL), who walks it across the border to the staff.`,
    misconceptions: [
      {
        myth: `If a process runs as Administrator or SYSTEM, it runs in Kernel Mode.`,
        truth: `Privilege (what your token allows) and CPU mode (Ring 3 or Ring 0) are two different things. Even SYSTEM processes such as services.exe run in User Mode. Only the kernel and drivers run in Ring 0.`,
        test: `In an elevated shell run Get-Process -Id $PID | Select-Object UserProcessorTime, PrivilegedProcessorTime. You are admin, yet most CPU time is User time.`,
      },
      {
        myth: `A Win32 call like WriteFile goes straight into the kernel.`,
        truth: `It travels through layers: kernel32 and kernelbase in User Mode, then ntdll.dll, which executes the SYSCALL instruction that crosses into the kernel.`,
        test: `Preview of Where-Object (module 7): (Get-Process -Id $PID).Modules | Where-Object ModuleName -in 'kernel32.dll','kernelbase.dll','ntdll.dll' | Select-Object ModuleName, FileName shows the layers loaded in your own shell.`,
      },
      {
        myth: `A handle is a pointer to the kernel object in memory.`,
        truth: `A handle is just an index into your process's handle table. User Mode is never allowed to point at kernel memory, so it carries the index and the kernel does the lookup.`,
        test: `Open a file with .NET and watch your handle count rise by one, then close it and watch it fall (see the worked example).`,
      },
    ],
    workedExample: {
      goal: `Collect hands-on evidence of the user and kernel sides of Windows from an ordinary PowerShell window.`,
      steps: [
        {
          think: `Every thread spends time in two modes. If the border is real, the process object should report them separately.`,
          action: `Get-Process -Id $PID | Select-Object Name, UserProcessorTime, PrivilegedProcessorTime`,
          result: `Two TimeSpans. User time is your own code, privileged time is the kernel working on your behalf.`,
        },
        {
          think: `The gatekeeper must be loaded in my process. I look for ntdll.dll and its friends. (Preview: Where-Object keeps only the rows that match a condition. You will learn it properly in module 7, so for now read it as "keep the modules whose name is in this list".)`,
          action: `(Get-Process -Id $PID).Modules | Where-Object ModuleName -in 'kernel32.dll','kernelbase.dll','ntdll.dll' | Select-Object ModuleName, FileName`,
          result: `All three listed from C:\\Windows\\System32. ntdll.dll is the bottom of User Mode.`,
        },
        {
          think: `Over the border live the drivers. Win32_SystemDriver lists them, so I sample a few that are running.`,
          action: `Get-CimInstance Win32_SystemDriver | Where-Object State -eq 'Running' | Select-Object -First 5 Name, PathName`,
          result: `Entries such as ACPI or Ntfs with paths ending in .sys. These run in Ring 0.`,
        },
        {
          think: `Now I prove handles are per-process counters. I record my handle count, open a temp file and compare. This is a lab action: it only creates and then deletes one small temp file. (Preview: [IO.File]::Open is a .NET call. You will meet .NET types in modules 4 and 6, so just type it as shown.)`,
          action: `$before = (Get-Process -Id $PID).Handles; $f = [IO.File]::Open("$env:TEMP\\handle-demo.txt", [IO.FileMode]::OpenOrCreate); $after = (Get-Process -Id $PID).Handles; "$before -> $after"`,
          result: `The second number is larger, usually by one. The kernel created a file object and gave you a handle to it.`,
        },
        {
          think: `Good hygiene: I close the handle so the kernel object is released, then remove my demo file.`,
          action: `$f.Dispose(); Remove-Item "$env:TEMP\\handle-demo.txt"; (Get-Process -Id $PID).Handles`,
          result: `The handle count falls back to about where it started.`,
        },
      ],
      takeaway: `You never touch the file, only a ticket for it. Every request crosses the same border, and every ticket is checked by the kernel.`,
    },
    checkpoints: [
      {
        question: `Why does a crashing app only close one window, while a crashing driver can blue-screen the PC?`,
        hint: `Compare what each is allowed to touch.`,
        answer: `User Mode code can only damage its own private memory, so the kernel cleans up that one process. Driver code in Ring 0 can touch all memory, so after a bad pointer the OS can no longer trust RAM and stops with a BSOD to protect your data.`,
      },
      {
        question: `Which Executive manager checks your access token against a file's ACL?`,
        hint: `The initials are SRM.`,
        answer: `The Security Reference Monitor. The Object Manager creates the object and handle, but the SRM decides whether you are allowed.`,
      },
      {
        question: `What does the HAL do?`,
        hint: `Hardware differences.`,
        answer: `The Hardware Abstraction Layer hides motherboard and chipset differences so the same kernel runs on different hardware.`,
      },
    ],
    challenge: {
      brief: `Count how many kernel drivers are in each state (Running, Stopped) and how many are configured to load at Boot. Read-only.`,
      hints: [
        `Win32_SystemDriver is the CIM class for kernel drivers.`,
        `Group-Object State gives you counts per state (a preview: Group-Object is not taught in this course, so treat it as a counting helper).`,
        `StartMode has the value Boot for drivers loaded by winload.efi. Use Measure-Object to count them.`,
      ],
      solution: `Get-CimInstance Win32_SystemDriver | Group-Object State | Select-Object Name, Count
Get-CimInstance Win32_SystemDriver | Where-Object StartMode -eq 'Boot' | Measure-Object | Select-Object Count`,
      why: `Drivers are the code that runs in Ring 0, so counting them shows how much code shares the kernel's trust. Boot-start drivers are loaded earliest, which is why defenders care about them.`,
    },
    teachBack: `Explain to a friend who thinks "the program saves the file" how Notepad actually gets bytes onto the SSD, mentioning handles, NTDLL, the border, and who checks permissions.`,
    diagrams: [
      {
        kind: 'layers',
        title: `The border between two worlds`,
        caption: `Everything above the red line can be killed without hurting Windows. Everything below can end the machine.`,
        layers: [
          {
            label: `Apps and services`,
            sub: `Ring 3, User Mode`,
            detail: `notepad.exe, pwsh.exe, even svchost.exe and lsass.exe. A crash here only costs one process.`,
            tone: 'blue',
          },
          {
            label: `kernel32 / kernelbase`,
            sub: `Documented Win32 API`,
            detail: `Friendly functions like WriteFile. They are still in User Mode and mostly translate and validate.`,
            tone: 'cyan',
          },
          {
            label: `ntdll.dll`,
            sub: `The gate agent`,
            detail: `Turns NtWriteFile into a syscall number and executes the SYSCALL instruction. This is the last stop before the border.`,
            tone: 'violet',
          },
          {
            label: `ntoskrnl.exe Executive`,
            sub: `Ring 0, Kernel Mode`,
            detail: `Object Manager, Security Reference Monitor, I/O Manager, Memory Manager and friends decide and act.`,
            tone: 'red',
          },
          {
            label: `Drivers and HAL`,
            sub: `ntfs.sys, stornvme.sys`,
            detail: `Translate the request into hardware commands. A bug here is a blue screen.`,
            tone: 'amber',
          },
          {
            label: `Hardware`,
            sub: `SSD, NIC, GPU`,
            detail: `The physical device that finally stores the bytes.`,
            tone: 'green',
          },
        ],
        traceLabel: `Trace a file save`,
      },
      {
        kind: 'sequence',
        title: `Opening a file and getting a handle`,
        caption: `The app never receives a pointer. It receives a ticket that only the kernel can redeem.`,
        actors: [
          { name: `Notepad`, sub: `User Mode`, tone: 'blue' },
          { name: `ntdll.dll`, sub: `Gate agent`, tone: 'violet' },
          { name: `Object Manager`, sub: `Kernel`, tone: 'red' },
          { name: `Security Ref Monitor`, sub: `Kernel`, tone: 'amber' },
          { name: `ntfs.sys`, sub: `Driver`, tone: 'green' },
        ],
        messages: [
          { from: 0, to: 1, label: `CreateFile(notes.txt)`, detail: `Notepad calls the Win32 function. It is turned into the native NtCreateFile.` },
          { from: 1, to: 2, label: `SYSCALL into Ring 0`, detail: `ntdll loads the syscall number into registers and executes the SYSCALL instruction.` },
          { from: 2, to: 3, label: `May this token open it?`, detail: `The Object Manager asks the SRM to compare the process token with the file's ACL.` },
          { from: 3, to: 2, label: `Access granted`, detail: `If the ACL allows it, the SRM approves exactly the rights asked for (for example read and write).` },
          { from: 2, to: 4, label: `Open the file object`, detail: `The I/O Manager routes the open to the file system driver, which finds the file on disk.` },
          { from: 2, to: 0, label: `Return handle 0x1A4`, detail: `The kernel stores a pointer in the process handle table and returns only the index. Later WriteFile calls present this number.` },
        ],
      },
    ],
  },

  // ==========================================================================
  // 2-2  Core system processes and service accounts
  // ==========================================================================
  '2-2': {
    hook: `A server shows 180 processes. A good responder spots the one that does not belong in seconds. What do they already know that you can learn in an afternoon?`,
    mentalModel: `Think of a stage play with seven actors who always enter in the same order, wear the same costume (path) and take direction from the same director (parent). An imposter can copy the name tag, but the wrong costume or the wrong director gives them away.`,
    misconceptions: [
      {
        myth: `Lots of svchost.exe entries in the list means I have malware.`,
        truth: `Dozens of svchost.exe processes are normal. Each hosts a group of services. What is suspicious is a svchost.exe with the wrong parent (not services.exe) or the wrong path.`,
        test: `Get-CimInstance Win32_Process -Filter "Name = 'svchost.exe'" | Group-Object ParentProcessId | Select-Object Count, Name. Normally one parent PID, the PID of services.exe, owns them all.`,
      },
      {
        myth: `If the name is spelled correctly, the process is the real thing.`,
        truth: `Anyone can name a file svchost.exe and run it from any folder. Real core processes live in C:\\Windows\\System32 and have the right parent.`,
        test: `Get-CimInstance Win32_Process -Filter "Name = 'svchost.exe'" | Where-Object { $_.ExecutablePath -and $_.ExecutablePath -ne "$env:SystemRoot\\System32\\svchost.exe" } should return nothing.`,
      },
      {
        myth: `Services should run as LocalSystem so permission problems never happen.`,
        truth: `LocalSystem is god-mode on the machine. If that service is exploited, the attacker owns the server. Choose LocalService or NetworkService, or a dedicated low-privilege account, whenever possible.`,
        test: `Get-CimInstance Win32_Service | Group-Object StartName | Sort-Object Count -Descending | Select-Object Count, Name -First 5 shows which identities your services use.`,
      },
    ],
    workedExample: {
      goal: `Baseline a machine: confirm the key process rules that malware tends to break.`,
      steps: [
        {
          think: `LSASS should exist exactly once. More than one, or none, is a red flag.`,
          action: `(Get-Process -Name lsass -ErrorAction SilentlyContinue | Measure-Object).Count`,
          result: `1`,
        },
        {
          think: `I need the PID of the real Service Control Manager, because it is the only legitimate parent of svchost.exe.`,
          action: `$scm = Get-Process -Name services; $scm.Id`,
          result: `One PID, for example 1120.`,
        },
        {
          think: `Now the parent rule: show any svchost.exe whose parent is not services.exe.`,
          action: `Get-CimInstance Win32_Process -Filter "Name = 'svchost.exe'" | Where-Object ParentProcessId -ne $scm.Id | Select-Object ProcessId, ParentProcessId, ExecutablePath`,
          result: `Nothing. An empty result is the healthy answer. (A rare svchost started by another process would appear here.)`,
        },
        {
          think: `Next the path rule. I only compare entries where the path is readable. In a non-elevated shell protected processes show no path, so I skip empty values.`,
          action: `Get-CimInstance Win32_Process -Filter "Name = 'svchost.exe'" | Where-Object { $_.ExecutablePath -and $_.ExecutablePath -ne "$env:SystemRoot\\System32\\svchost.exe" } | Select-Object ProcessId, ExecutablePath`,
          result: `Nothing again. For full coverage run this in an elevated window.`,
        },
        {
          think: `Last, least privilege. Which identities do services run under on this machine?`,
          action: `Get-CimInstance Win32_Service | Group-Object StartName | Sort-Object Count -Descending | Select-Object Count, Name -First 6`,
          result: `LocalSystem at the top, then LocalService and NetworkService, then a few named accounts.`,
        },
      ],
      takeaway: `Baselines turn a haystack into a checklist: one lsass, svchost children of services.exe only, paths in System32.`,
    },
    checkpoints: [
      {
        question: `Who is the only legitimate parent of svchost.exe?`,
        hint: `The Service Control Manager.`,
        answer: `services.exe. If svchost.exe was started by explorer.exe, cmd.exe or powershell.exe, treat it as an alarm.`,
      },
      {
        question: `Which process manages the Ctrl+Alt+Del logon screen and starts explorer.exe via userinit.exe?`,
        hint: `It lives in Session 1.`,
        answer: `winlogon.exe, created by an smss.exe instance for the interactive session. That smss.exe instance then exits, so winlogon.exe normally shows no parent.`,
      },
      {
        question: `Which service account is the safest choice for a service that needs no network identity?`,
        hint: `Anonymous on the network.`,
        answer: `LocalService. It has limited local rights and presents anonymous credentials on the network.`,
      },
    ],
    challenge: {
      brief: `Write a read-only check that lists any process named smss, wininit, services, lsass, winlogon or svchost whose executable is NOT under C:\\Windows\\System32.`,
      hints: [
        `Get-CimInstance Win32_Process gives Name and ExecutablePath.`,
        `Put the six names (with .exe) in an array and use -in against Name. (-in asks "is this value in the list?" and is a preview of module 7.)`,
        `Skip entries with an empty ExecutablePath, then use -notlike with "$env:SystemRoot\\System32\\*".`,
      ],
      solution: `$core = 'smss.exe','wininit.exe','services.exe','lsass.exe','winlogon.exe','svchost.exe'
Get-CimInstance Win32_Process |
  Where-Object { $_.Name -in $core -and $_.ExecutablePath -and $_.ExecutablePath -notlike "$env:SystemRoot\\System32\\*" } |
  Select-Object ProcessId, Name, ExecutablePath, ParentProcessId`,
      why: `This encodes the second forensic rule (path) in code. An empty result means every core process you can read is in System32. Run it elevated so protected processes report a path too.`,
    },
    teachBack: `Explain to a friend who only knows Task Manager how you would decide in thirty seconds whether a process called svchost.exe is real, using spelling, path and parent.`,
    diagrams: [
      {
        kind: 'tree',
        title: `The seven actors and who spawns whom`,
        caption: `Memorize this tree and almost every imposter becomes a process that appears in the wrong place.`,
        root: {
          label: `System (PID 4)`,
          sub: `Kernel threads`,
          detail: `Home of kernel-mode threads. Always PID 4 and its parent is the Idle process (PID 0).`,
          tone: 'red',
          children: [
            {
              label: `smss.exe`,
              sub: `Session Manager`,
              detail: `The first user-mode process. It creates Session 0 for services and Session 1 and up for desktops, and starts csrss.exe in each session. It then hands off and its short-lived session instances exit.`,
              tone: 'violet',
              children: [
                {
                  label: `wininit.exe`,
                  sub: `Session 0`,
                  detail: `Starts the two pillars of Session 0: services.exe and lsass.exe. It is created by a short-lived smss.exe instance that then exits, so its parent PID points at nothing and Process Explorer shows it parentless. That is normal.`,
                  tone: 'blue',
                  children: [
                    {
                      label: `services.exe`,
                      sub: `Service Control Manager`,
                      detail: `Starts and stops services. The only legitimate parent of svchost.exe.`,
                      tone: 'green',
                      children: [
                        {
                          label: `svchost.exe (many)`,
                          sub: `Service hosts`,
                          detail: `Dozens of instances, each hosting service DLLs so one crash does not take down the rest.`,
                          tone: 'cyan',
                        },
                      ],
                    },
                    {
                      label: `lsass.exe (one)`,
                      sub: `Local Security Authority`,
                      detail: `Validates logons and builds tokens. Exactly one instance, which is why it is a prime credential target.`,
                      tone: 'amber',
                    },
                  ],
                },
                {
                  label: `winlogon.exe`,
                  sub: `Session 1`,
                  detail: `Owns the secure logon screen and launches userinit.exe, which starts your desktop (explorer.exe). Like wininit.exe it is created by a short-lived smss.exe, so its parent is not shown. Its partner csrss.exe, which also starts in each session, completes the usual set of core processes.`,
                  tone: 'blue',
                },
              ],
            },
          ],
        },
      },
      {
        kind: 'compare',
        title: `Real svchost.exe vs an imposter`,
        caption: `Three fast questions, three different answers. Any single mismatch deserves a closer look.`,
        left: {
          heading: `Genuine svchost.exe`,
          tone: 'green',
          rows: [
            { label: `Spelling`, value: `svchost.exe` },
            { label: `Path`, value: `C:\\Windows\\System32\\` },
            { label: `Parent`, value: `services.exe` },
            { label: `Signature`, value: `Valid, Microsoft Windows` },
          ],
        },
        right: {
          heading: `Imposter`,
          tone: 'red',
          rows: [
            { label: `Spelling`, value: `svch0st.exe or scvhost.exe` },
            { label: `Path`, value: `C:\\Users\\Public\\ or AppData` },
            { label: `Parent`, value: `explorer.exe or powershell.exe` },
            { label: `Signature`, value: `Missing or unknown publisher` },
          ],
        },
        verdict: `Attackers can copy a name but they struggle to copy the whole family tree. Check spelling, path and parent together.`,
      },
    ],
  },

  // ==========================================================================
  // 2-3  Boot chain
  // ==========================================================================
  '2-3': {
    hook: `Between pressing the power button and seeing the logon screen, a handful of seconds pass. Who is checking, in that darkness, that nobody swapped the front door?`,
    mentalModel: `The boot is a relay race with a baton inspector at every handoff. Each runner shows ID to the next before passing the baton. The TPM is the scorekeeper writing every handoff in a notebook that nobody can edit afterwards.`,
    misconceptions: [
      {
        myth: `UEFI and GPT are the same thing.`,
        truth: `UEFI is the firmware that starts the machine. GPT is the way the disk is laid out. Windows booting in UEFI mode needs a GPT system disk, so they usually travel together, but they are different layers.`,
        test: `Get-Disk | Select-Object Number, FriendlyName, PartitionStyle tells you the disk layout. In an elevated shell, bcdedit /enum '{current}' | Select-String 'path' shows winload.efi on UEFI and winload.exe on legacy BIOS.`,
      },
      {
        myth: `Secure Boot encrypts my disk and scans for viruses at startup.`,
        truth: `Secure Boot only verifies digital signatures of boot components. BitLocker encrypts the disk and the ELAM driver scans early drivers. Three jobs, three features.`,
        test: `Confirm-SecureBootUEFI in an elevated window returns True or False. It says nothing about encryption.`,
      },
      {
        myth: `Measured Boot blocks a tampered boot.`,
        truth: `Secure Boot and Trusted Boot block. Measured Boot records hashes into the TPM so that BitLocker or a remote service can judge afterwards. It is a witness, not a bouncer.`,
        test: `Get-Tpm | Select-Object TpmPresent, TpmReady (elevated) shows the chip that holds the measurements. It has no "block" setting.`,
      },
    ],
    workedExample: {
      goal: `Work out how this computer boots and which boot defenses are on.`,
      steps: [
        {
          think: `Start with the disk layout. It decides whether UEFI and Secure Boot are even possible.`,
          action: `Get-Disk | Select-Object Number, FriendlyName, PartitionStyle`,
          result: `PartitionStyle GPT on a modern system disk. MBR means a legacy layout.`,
        },
        {
          think: `The EFI System Partition should be visible as a small System partition next to a Reserved one.`,
          action: `Get-Partition -DiskNumber 0 | Select-Object PartitionNumber, Type, @{n='SizeMB';e={[math]::Round($_.Size/1MB)}}`,
          result: `Rows like System (about 100 to 260 MB, the ESP), Reserved (16 MB), Basic (your C: drive) and often Recovery.`,
        },
        {
          think: `In an elevated shell I ask the firmware whether Secure Boot is enforcing signatures. A legacy BIOS PC will throw an error, which is also an answer.`,
          action: `Confirm-SecureBootUEFI`,
          result: `True when Secure Boot is on. On legacy BIOS: "Cmdlet not supported on this platform".`,
        },
        {
          think: `The boot database tells me which OS loader runs, and its file extension reveals the firmware mode.`,
          action: `bcdedit /enum '{current}' | Select-String 'path'`,
          result: `path  \\WINDOWS\\system32\\winload.efi on UEFI. winload.exe would mean legacy BIOS boot.`,
        },
        {
          think: `Finally the scorekeeper. Is there a TPM that can hold the measurements?`,
          action: `Get-Tpm | Select-Object TpmPresent, TpmReady, ManufacturerIdTxt`,
          result: `TpmPresent True and TpmReady True on a prepared Windows 11 PC.`,
        },
      ],
      takeaway: `Four small read-only questions (layout, partitions, signatures, TPM) describe the whole trust chain of a PC.`,
    },
    checkpoints: [
      {
        question: `Do the math: why can an MBR disk have only 4 primary partitions?`,
        hint: `The partition table is 64 bytes and each entry has a fixed size.`,
        answer: `The partition table is 64 bytes and each entry is 16 bytes, so 64 / 16 = 4 entries.`,
      },
      {
        question: `Put these in boot order: winload.efi, bootmgfw.efi, ntoskrnl.exe, UEFI firmware.`,
        hint: `Firmware first, kernel last.`,
        answer: `UEFI firmware, then bootmgfw.efi (Boot Manager, reads the BCD), then winload.efi (OS Loader), then ntoskrnl.exe (kernel).`,
      },
      {
        question: `What does the STEM mnemonic stand for?`,
        hint: `Four defenses in time order.`,
        answer: `Secure Boot, Trusted Boot, ELAM, Measured Boot.`,
      },
    ],
    challenge: {
      brief: `Produce a table of every disk showing number, name, partition style, size in TB, and a Note column that says "2 TB limit applies" for MBR disks and "OK" for GPT disks. Read-only.`,
      hints: [
        `Get-Disk exposes PartitionStyle and Size (in bytes).`,
        `Use a calculated property to turn Size into TB with [math]::Round($_.Size/1TB,2).`,
        `The Note column is another calculated property with an if/else on PartitionStyle.`,
      ],
      solution: `Get-Disk | Select-Object Number, FriendlyName, PartitionStyle,
  @{n='SizeTB';e={[math]::Round($_.Size/1TB,2)}},
  @{n='Note';e={ if ($_.PartitionStyle -eq 'MBR') { '2 TB limit applies' } else { 'OK' } }}`,
      why: `The disk layout fixes the limits: MBR uses 32-bit sector addresses (2 TB) and four primary partitions, while GPT does not. A table like this is a quick audit before you plan a Secure Boot migration.`,
    },
    teachBack: `Explain to a friend who thinks "the computer just starts" what each boot stage checks before handing over to the next, and why a bootkit used to be so dangerous on old BIOS and MBR systems.`,
    diagrams: [
      {
        kind: 'layers',
        title: `The chain of trust`,
        caption: `Each stage verifies the next before running it. Break one link and everything below it can no longer be trusted.`,
        layers: [
          {
            label: `UEFI firmware`,
            sub: `Secure Boot`,
            detail: `Starts first and holds the trusted signing keys. It refuses to run an unsigned or revoked bootloader.`,
            tone: 'amber',
          },
          {
            label: `bootmgfw.efi`,
            sub: `Windows Boot Manager`,
            detail: `Lives on the EFI System Partition. Reads the BCD to choose which Windows to start.`,
            tone: 'blue',
          },
          {
            label: `winload.efi`,
            sub: `Trusted Boot starts here`,
            detail: `Loads the kernel, the HAL, the SYSTEM hive and boot-start drivers after checking their signatures.`,
            tone: 'cyan',
          },
          {
            label: `ntoskrnl.exe`,
            sub: `Kernel initialises`,
            detail: `Brings up the Executive managers and starts smss.exe.`,
            tone: 'violet',
          },
          {
            label: `ELAM driver`,
            sub: `First third-party driver`,
            detail: `Your antimalware vendor's early driver. It judges every later driver before it may load.`,
            tone: 'green',
          },
          {
            label: `Services and logon`,
            sub: `wininit, winlogon`,
            detail: `The familiar system processes start and you reach the sign-in screen.`,
            tone: 'red',
          },
        ],
        traceLabel: `Walk the boot chain`,
      },
      {
        kind: 'sequence',
        title: `Measured Boot: the notebook nobody can edit`,
        caption: `Every stage hashes the next one into the TPM before running it. Later, software decides whether the story looks honest.`,
        actors: [
          { name: `UEFI firmware`, tone: 'amber' },
          { name: `Boot Manager`, sub: `bootmgfw.efi`, tone: 'blue' },
          { name: `OS Loader`, sub: `winload.efi`, tone: 'cyan' },
          { name: `TPM 2.0`, sub: `Hardware chip`, tone: 'violet' },
          { name: `BitLocker`, sub: `or attestation`, tone: 'green' },
        ],
        messages: [
          { from: 0, to: 3, label: `Measure firmware`, detail: `The firmware extends a PCR in the TPM with a hash of itself and its configuration.` },
          { from: 0, to: 3, label: `Measure bootmgfw.efi`, detail: `Before launching the Boot Manager its hash is recorded. A PCR can only be extended, never overwritten.` },
          { from: 1, to: 3, label: `Measure winload.efi`, detail: `The Boot Manager records the OS Loader the same way.` },
          { from: 2, to: 3, label: `Measure boot drivers`, detail: `The loader records the kernel and early drivers it is about to load.` },
          { from: 4, to: 3, label: `Unseal key if PCRs match`, detail: `BitLocker asks the TPM to release the disk key only when the recorded values are the expected ones.` },
          { from: 3, to: 4, label: `Key released or refused`, detail: `A tampered boot chain produces different hashes, so the key stays locked and you see the recovery screen.` },
        ],
      },
      {
        kind: 'layers',
        title: `Which defence guards which stage`,
        caption: `The four STEM defences are not four steps in a row. Secure Boot and Trusted Boot block, ELAM judges drivers, and Measured Boot quietly records every stage for later.`,
        layers: [
          {
            label: `UEFI to bootmgfw.efi`,
            sub: `Secure Boot (blocks)`,
            detail: `Firmware checks the signature of the Boot Manager against its trusted keys and refuses to run anything unsigned or revoked.`,
            tone: 'amber',
          },
          {
            label: `winload.efi to ntoskrnl.exe`,
            sub: `Trusted Boot (blocks)`,
            detail: `The OS Loader verifies the kernel, boot-start drivers and system files before they are used. A corrupted component is repaired or refused.`,
            tone: 'blue',
          },
          {
            label: `ELAM driver`,
            sub: `Early Launch Anti-Malware`,
            detail: `Loads before the other boot drivers and classifies each one as good, bad or unknown so malware cannot hide among them.`,
            tone: 'green',
          },
          {
            label: `Every stage above`,
            sub: `Measured Boot (records)`,
            detail: `Each handoff is hashed into TPM registers. Nothing is blocked here. The log is judged later by BitLocker or an attestation service.`,
            tone: 'violet',
          },
          {
            label: `smss.exe and logon`,
            sub: `The user-mode result`,
            detail: `If the chain held, the kernel starts smss.exe and you reach the sign-in screen with BitLocker unlocked.`,
            tone: 'cyan',
          },
        ],
        traceLabel: `Follow the defences`,
        tracePath: [0, 1, 2, 3, 4],
      },
    ],
  },

  // ==========================================================================
  // 15-1  Recon and AD enumeration (defensive audit framing)
  // ==========================================================================
  '15-1': {
    hook: `A standard user with no admin tools sits at a domain-joined laptop. How much of your environment can they map in a few seconds using only what ships with Windows, and what should you fix before they try?`,
    mentalModel: `You are a building inspector walking your own building with a flashlight. It is exactly the walk a burglar would take, but you take it first, write down every unlocked door, and fix the list.`,
    misconceptions: [
      {
        myth: `Attackers need special hacking tools to learn about my domain.`,
        truth: `Active Directory is built so that any authenticated domain user can read most of it over LDAP. Built-in PowerShell and .NET are enough to ask the questions, so defence comes from hygiene and detection, not from hoping nobody asks.`,
        test: `In your own lab domain, as a standard user: ([adsisearcher]'(&(objectCategory=person)(objectClass=user))').FindAll().Count returns the number of user objects without any module or admin rights.`,
      },
      {
        myth: `Only accounts in Domain Admins matter. Service accounts are harmless.`,
        truth: `Any user account with a servicePrincipalName can have a service ticket requested by any domain user. If its password is weak, that ticket can be guessed offline. Service accounts are a favourite stepping stone.`,
        test: `Lab domain: ([adsisearcher]'(&(objectCategory=person)(objectClass=user)(servicePrincipalName=*))').FindAll() | ForEach-Object { $_.Properties['samaccountname'] } lists who is exposed.`,
      },
      {
        myth: `An unquoted service path is always an instant privilege escalation.`,
        truth: `It only matters when three things are true together: the path has spaces and no quotes, the service runs as a powerful account, and a low-privilege user can write into one of the folders Windows would search. Break any one and the risk disappears.`,
        test: `(Get-Acl 'C:\\Program Files').Access | Where-Object IdentityReference -match 'Users' shows Users with read and execute only, not write.`,
      },
    ],
    workedExample: {
      goal: `Audit your own lab machine and lab domain the way an assessor would, then list a fix next to every finding. Run this only on systems you own or are authorised to test.`,
      steps: [
        {
          think: `First I learn what my current token can do. Powerful privileges such as SeImpersonatePrivilege or SeDebugPrivilege deserve a note.`,
          action: `whoami /priv`,
          result: `A short list for a standard user, with State Disabled on most rows. Disabled still means the privilege exists in the token.`,
        },
        {
          think: `Open ports tell me what the machine offers to the network. I also want the owning process name, not just a PID.`,
          action: `Get-NetTCPConnection -State Listen | Sort-Object LocalPort | Select-Object -First 10 LocalAddress, LocalPort, @{n='Process';e={(Get-Process -Id $_.OwningProcess -ErrorAction SilentlyContinue).Name}}`,
          result: `Ports such as 135, 445 and 5985 with names like svchost, System or wsmprovhost.`,
        },
        {
          think: `Now the unquoted-path test. I list services whose executable path contains a space before .exe and is not wrapped in quotes.`,
          action: `Get-CimInstance Win32_Service | Where-Object { $_.PathName -and $_.PathName -notlike '"*' -and ($_.PathName -replace '(?i)\\.exe.*$', '.exe') -match ' ' } | Select-Object Name, StartName, PathName`,
          result: `Often nothing on a clean system. Any row is a finding to review, together with its StartName.`,
        },
        {
          think: `A finding only matters if someone unprivileged can write in that path. I check the folder's ACL for broad groups with write-type rights.`,
          action: `(Get-Acl 'C:\\Program Files').Access | Where-Object { $_.IdentityReference -match 'Users|Everyone|Authenticated' } | Select-Object IdentityReference, FileSystemRights, AccessControlType`,
          result: `Users with ReadAndExecute, Synchronize. Warning signs would be Modify, Write or FullControl.`,
        },
        {
          think: `On my lab domain I list user accounts that carry an SPN. These are the accounts to protect with long random passwords or gMSAs. krbtgt always appears and is expected.`,
          action: `([adsisearcher]'(&(objectCategory=person)(objectClass=user)(servicePrincipalName=*))').FindAll() | ForEach-Object { $_.Properties['samaccountname'] }`,
          result: `krbtgt plus any service accounts such as svc-sql. Each one is a to-do item: migrate to a gMSA or set a 25-plus character password.`,
        },
      ],
      takeaway: `Every finding pairs with a fix: quote the path, tighten the ACL, run services with a low-privilege account, and move SPN accounts to gMSAs.`,
    },
    checkpoints: [
      {
        question: `Why do assessors prefer [adsisearcher] on a machine that has no RSAT?`,
        hint: `Think about what is pre-installed.`,
        answer: `It is a .NET type accelerator for DirectorySearcher, so it exists on every Windows machine. It needs no module install and no admin rights, only a domain logon.`,
      },
      {
        question: `What makes an account Kerberoastable?`,
        hint: `One attribute and one weakness.`,
        answer: `A user account with a servicePrincipalName value, so any domain user can request its ticket, combined with a weak password that can be guessed offline.`,
      },
      {
        question: `What is the best structural fix for SPN accounts with human-chosen passwords?`,
        hint: `Group Managed Service Accounts.`,
        answer: `Move to gMSAs (New-ADServiceAccount). Active Directory generates and rotates a very long random password automatically.`,
      },
    ],
    challenge: {
      brief: `In your lab, write a read-only report of services that run as LocalSystem and whose PathName is unquoted and contains a space before the .exe. Show Name, StartName and PathName, sorted by Name.`,
      hints: [
        `Win32_Service has Name, StartName and PathName.`,
        `Filter StartName -eq 'LocalSystem', and PathName -notlike '"*'.`,
        `To test for a space in the executable part only, replace everything after .exe with .exe first, then match a space.`,
      ],
      solution: `Get-CimInstance Win32_Service |
  Where-Object { $_.StartName -eq 'LocalSystem' -and $_.PathName -and $_.PathName -notlike '"*' -and ($_.PathName -replace '(?i)\\.exe.*$', '.exe') -match ' ' } |
  Sort-Object Name |
  Select-Object Name, StartName, PathName`,
      why: `The report isolates the dangerous combination of a powerful account and an ambiguous path. You then check folder permissions and fix the path by adding quotes, which removes the ambiguity completely.`,
    },
    teachBack: `Explain to a friend who thinks "hacking needs special tools" why a defender should run the attacker's first five questions against their own systems, and what you would fix for each answer.`,
    diagrams: [
      {
        kind: 'sequence',
        title: `Why an SPN account is exposed`,
        caption: `Conceptual flow only. The attacker needs no special rights and generates almost no network noise after step three.`,
        actors: [
          { name: `Any domain user`, sub: `Standard account`, tone: 'amber' },
          { name: `Domain controller`, sub: `Directory and KDC`, tone: 'blue' },
          { name: `Service account`, sub: `Has an SPN`, tone: 'violet' },
          { name: `Defender`, sub: `Audit and logs`, tone: 'green' },
        ],
        messages: [
          { from: 0, to: 1, label: `LDAP: who has an SPN?`, detail: `A normal directory query that any authenticated user is allowed to make.` },
          { from: 0, to: 1, label: `Ask for a service ticket`, detail: `Requesting a ticket for a service is normal Kerberos behaviour and needs no special permission.` },
          { from: 1, to: 0, label: `Ticket sealed with the key`, detail: `The ticket is encrypted with a key derived from the service account's password.` },
          { from: 0, to: 0, label: `Guess passwords offline`, detail: `Guessing happens on the attacker's own computer, so there are no lockouts. A weak password falls, a long random one does not.` },
          { from: 3, to: 2, label: `Move to a gMSA`, detail: `Audit SPN accounts and replace human-set passwords with gMSAs that have very long random secrets.` },
          { from: 3, to: 1, label: `Watch event 4769`, detail: `Look for bursts of service ticket requests and tickets that use weak RC4 encryption (type 0x17).` },
        ],
      },
      {
        kind: 'compare',
        title: `The three-part unquoted path risk`,
        caption: `The attack needs all three conditions. Breaking one is enough, and quoting the path is the cheapest fix.`,
        left: {
          heading: `Risky combination`,
          tone: 'red',
          rows: [
            { label: `Path`, value: `Spaces, no quotes` },
            { label: `Service identity`, value: `LocalSystem` },
            { label: `Folder permissions`, value: `Users can write` },
            { label: `Result`, value: `Possible escalation` },
          ],
        },
        right: {
          heading: `Break any one link`,
          tone: 'green',
          rows: [
            { label: `Path`, value: `Wrap it in quotes` },
            { label: `Service identity`, value: `LocalService or gMSA` },
            { label: `Folder permissions`, value: `Only admins can write` },
            { label: `Result`, value: `Nothing to exploit` },
          ],
        },
        verdict: `Security is rarely one big wall. It is three small gates, and the attacker needs all of them open at once.`,
      },
    ],
  },

  // ==========================================================================
  // 15-2  Fileless cradles, -EncodedCommand, AMSI (defensive framing)
  // ==========================================================================
  '15-2': {
    hook: `Attackers hide a command inside Base64 and run it straight from memory. Why does that give them far less cover than they imagine?`,
    mentalModel: `A sealed envelope must be opened before it can be read aloud. AMSI is the inspector standing at the speaker's microphone: however many envelopes are nested inside each other, the words must be plain at the moment they are spoken.`,
    misconceptions: [
      {
        myth: `-EncodedCommand hides or encrypts a command so analysts cannot read it.`,
        truth: `Base64 is a reversible encoding with no key. PowerShell expects the text as UTF-16LE, so every letter is followed by a zero byte, which is why the Base64 is full of A characters.`,
        test: `[Text.Encoding]::Unicode.GetString([Convert]::FromBase64String('RwBlAHQALQBEAGEAdABlAA==')) returns Get-Date in one second.`,
      },
      {
        myth: `Fileless means no evidence is left behind.`,
        truth: `Fileless means no script file on disk. The command line, AMSI scans, Script Block Logging (event 4104), network connections and process creation events can all still record what happened.`,
        test: `Get-WinEvent -FilterHashtable @{ LogName = 'Microsoft-Windows-PowerShell/Operational'; Id = 4104 } -MaxEvents 3 -ErrorAction SilentlyContinue lists recent scriptblocks (run elevated if access is denied).`,
      },
      {
        myth: `AMSI is an antivirus that blocks every bad script.`,
        truth: `AMSI is an interface. PowerShell hands the plain text to whatever antimalware engine is registered, and that engine decides. It is one strong layer among several, not a guarantee.`,
        test: `(Get-Process -Id $PID).Modules.ModuleName -contains 'amsi.dll' returns True: AMSI is loaded inside your own PowerShell process.`,
      },
    ],
    workedExample: {
      goal: `Practise safely decoding an encoded command during triage without ever executing it.`,
      steps: [
        {
          think: `I make my own sample so I know exactly what is inside. Real alerts get the same treatment later.`,
          action: `$plain = 'Get-Date'; $b64 = [Convert]::ToBase64String([Text.Encoding]::Unicode.GetBytes($plain)); $b64`,
          result: `RwBlAHQALQBEAGEAdABlAA==`,
        },
        {
          think: `Why are there so many A characters? I look at the raw bytes to see the zero padding of UTF-16LE.`,
          action: `[Convert]::FromBase64String($b64) | Select-Object -First 6`,
          result: `71, 0, 101, 0, 116, 0. That is G, nothing, e, nothing, t, nothing. Each letter is two bytes.`,
        },
        {
          think: `Decoding means converting the bytes back to text. I must only read the text, never run it.`,
          action: `$decoded = [Text.Encoding]::Unicode.GetString([Convert]::FromBase64String($b64)); $decoded`,
          result: `Get-Date`,
        },
        {
          think: `Triage means looking for behaviour words. A match is a lead, not a verdict, and I keep the string as inert text.`,
          action: `$decoded -match 'DownloadString|Invoke-Expression|IEX|FromBase64String|WebClient'`,
          result: `False for Get-Date. A True would tell me to read the whole decoded text carefully.`,
        },
        {
          think: `Finally I confirm the safety net exists on this host: AMSI is loaded in my PowerShell process.`,
          action: `(Get-Process -Id $PID).Modules.ModuleName -contains 'amsi.dll'`,
          result: `True`,
        },
      ],
      takeaway: `Decode to text, read it, never pipe it to IEX. Encoding slows a reader by seconds and does nothing against AMSI or logging.`,
    },
    checkpoints: [
      {
        question: `Why does a legitimate administrator use -EncodedCommand?`,
        hint: `Quotes and special characters.`,
        answer: `To pass a complex script on one command line without cmd.exe or the parent process mangling nested quotes and special characters.`,
      },
      {
        question: `At what moment does AMSI see the code of an obfuscated script?`,
        hint: `After decoding or before?`,
        answer: `After. PowerShell must turn the code into plain text to execute it, and at that point it submits the decoded buffer to AmsiScanBuffer before running it.`,
      },
      {
        question: `Why should you almost never see Invoke-Expression in a production script?`,
        hint: `Think about what it does with strings.`,
        answer: `It executes any string as code, which hides what will run from reviewers. Legitimate scripts have safer alternatives, so IEX in logs deserves a look.`,
      },
    ],
    challenge: {
      brief: `Decode the string VwByAGkAdABlAC0ATwB1AHQAcAB1AHQAIAAnAGgAZQBsAGwAbwAnAA== to readable text without executing it, then wrap your solution in a small reusable function.`,
      hints: [
        `The encoding PowerShell uses for -EncodedCommand is [Text.Encoding]::Unicode.`,
        `First [Convert]::FromBase64String(...) to get bytes, then GetString(...) on the Unicode encoding.`,
        `Put it in function ConvertFrom-EncodedCommand with a mandatory string parameter, and output the text only.`,
      ],
      solution: `function ConvertFrom-EncodedCommand {
    param([Parameter(Mandatory)][string]$Text)
    [Text.Encoding]::Unicode.GetString([Convert]::FromBase64String($Text))
}
ConvertFrom-EncodedCommand 'VwByAGkAdABlAC0ATwB1AHQAcAB1AHQAIAAnAGgAZQBsAGwAbwAnAA=='
# Write-Output 'hello'`,
      why: `The function only converts bytes to a string and returns it, so nothing is executed. The decoded text is Write-Output 'hello', and you can now read and judge it before deciding anything else.`,
    },
    teachBack: `Explain to a friend who thinks "Base64 hides the command" why AMSI and Script Block Logging still see the real text, using the sealed envelope picture.`,
    diagrams: [
      {
        kind: 'sequence',
        title: `Where AMSI sits in a PowerShell run`,
        caption: `All the encoding games happen on the left. The decisive check happens at the last moment, on plain text.`,
        actors: [
          { name: `Command line`, sub: `powershell -enc ...`, tone: 'amber' },
          { name: `PowerShell engine`, sub: `powershell.exe or pwsh.exe`, tone: 'blue' },
          { name: `amsi.dll`, sub: `Inside the process`, tone: 'violet' },
          { name: `Antimalware engine`, sub: `Defender or EDR`, tone: 'green' },
          { name: `Event log`, sub: `PowerShell/Operational`, tone: 'cyan' },
        ],
        messages: [
          { from: 0, to: 1, label: `Encoded text arrives`, detail: `The engine receives a Base64 string. To the engine it is just an input parameter.` },
          { from: 1, to: 1, label: `Decode and join strings`, detail: `The engine must unpack any encoding or string splitting to produce the plain script it will run.` },
          { from: 1, to: 2, label: `AmsiScanBuffer(plain text)`, detail: `The decoded, readable buffer is handed to AMSI in memory, before anything executes.` },
          { from: 2, to: 3, label: `Scan request`, detail: `amsi.dll forwards the content to the registered antimalware provider.` },
          { from: 3, to: 1, label: `Allow or block`, detail: `The provider returns a verdict. A detected threat stops the script with an error.` },
          { from: 1, to: 4, label: `Log scriptblock (4104)`, detail: `With Script Block Logging on, the plain text of what ran is written to the event log as well.` },
        ],
      },
      {
        kind: 'compare',
        title: `What a scanner sees: disk vs memory`,
        caption: `Obfuscation fools a scanner that looks at the container. It does not fool one that looks at the final text.`,
        left: {
          heading: `File scanner only`,
          tone: 'amber',
          rows: [
            { label: `Base64 blob`, value: `Meaningless characters` },
            { label: `Split strings`, value: `Harmless fragments` },
            { label: `Never saved to disk`, value: `Nothing to scan` },
            { label: `Timing`, value: `When a file is written` },
          ],
        },
        right: {
          heading: `AMSI in memory`,
          tone: 'green',
          rows: [
            { label: `Base64 blob`, value: `Decoded plain text` },
            { label: `Split strings`, value: `Joined into full words` },
            { label: `Never saved to disk`, value: `Buffer is submitted anyway` },
            { label: `Timing`, value: `Just before execution` },
          ],
        },
        verdict: `The closer to execution you inspect, the less obfuscation matters. That is why AMSI and 4104 sit at the very end.`,
      },
      {
        kind: 'layers',
        title: `An in-memory attack still leaves a trail`,
        caption: `Defender's view of a fileless attack, one stage per layer. Every stage has something to detect, but each detection depends on a setting you must switch on beforehand.`,
        layers: [
          {
            label: `Launch the command`,
            sub: `Event 4688 (process creation)`,
            detail: `The command line, including a long -EncodedCommand string, is recorded only if you enable the Process Creation audit policy and the setting to include the command line.`,
            tone: 'amber',
          },
          {
            label: `Run the decoded script`,
            sub: `AMSI scan plus event 4104`,
            detail: `The plain text is submitted to the antimalware engine and, with Script Block Logging on, written to the Operational log. AMSI is one strong layer, not a guarantee.`,
            tone: 'blue',
          },
          {
            label: `Ask for service tickets`,
            sub: `Event 4769 on the DC`,
            detail: `Bursts of service ticket requests from one user, especially with RC4 encryption (type 0x17), point to Kerberoasting-style activity.`,
            tone: 'violet',
          },
          {
            label: `Erase the evidence`,
            sub: `Event 1102 (log cleared)`,
            detail: `Clearing the Security log writes 1102 as its own last record. If you forward logs to a collector, the copy survives the clean-up.`,
            tone: 'red',
          },
        ],
        traceLabel: `Walk the attack and its detections`,
        tracePath: [0, 1, 2, 3],
      },
    ],
  },

  // ==========================================================================
  // 16-1  PowerShell auditing and logging
  // ==========================================================================
  '16-1': {
    hook: `An attacker runs a script entirely from memory and then deletes everything. What is still sitting in an event log, with the decoded code inside, waiting for you to find it?`,
    mentalModel: `Script Block Logging is a security camera filming the words after they have been unscrambled. Transcription is a stenographer typing everything said in the room. Module logging is the receipt printer listing each tool that was used. Three records, three different angles.`,
    misconceptions: [
      {
        myth: `Scripts that run only in memory leave no trace.`,
        truth: `With Script Block Logging enabled, event 4104 in Microsoft-Windows-PowerShell/Operational stores the decoded script text even when no file ever existed. PowerShell also logs some suspicious scriptblocks at Warning level by default.`,
        test: `Get-WinEvent -FilterHashtable @{ LogName = 'Microsoft-Windows-PowerShell/Operational'; Id = 4104 } -MaxEvents 1 | Format-List TimeCreated, Message (run elevated if needed).`,
      },
      {
        myth: `Script block logging, module logging and transcription are three names for the same thing.`,
        truth: `They record different things. 4104 records code as compiled, 4103 records pipeline execution and parameter bindings, and transcription records an over-the-shoulder text of input and output to a file.`,
        test: `Get-ChildItem 'HKLM:\\SOFTWARE\\Policies\\Microsoft\\Windows\\PowerShell' -ErrorAction SilentlyContinue lists separate policy keys: ScriptBlockLogging, ModuleLogging and Transcription.`,
      },
      {
        myth: `Get-EventLog or Where-Object filtering gives the same result as Get-WinEvent -FilterHashtable.`,
        truth: `Get-EventLog is Windows PowerShell only and cannot read modern Applications and Services logs. Piping a huge log into Where-Object filters too late and is much slower than filtering at the source.`,
        test: `Measure-Command { Get-WinEvent -LogName Application | Where-Object Id -eq 1000 } versus Measure-Command { Get-WinEvent -FilterHashtable @{ LogName = 'Application'; Id = 1000 } -ErrorAction SilentlyContinue }. The second is dramatically faster.`,
      },
    ],
    workedExample: {
      goal: `Check whether you could detect a malicious PowerShell run on this machine, then hunt in the last 24 hours. Use an elevated window for the Security log.`,
      steps: [
        {
          think: `First I check that the camera is even switched on. Policy settings live under a known registry path.`,
          action: `Get-ItemProperty 'HKLM:\\SOFTWARE\\Policies\\Microsoft\\Windows\\PowerShell\\ScriptBlockLogging' -ErrorAction SilentlyContinue | Select-Object EnableScriptBlockLogging`,
          result: `EnableScriptBlockLogging 1 when configured. Blank means the policy is not set here.`,
        },
        {
          think: `Now I look at what has been recorded in the last day. I filter at the source and cap the count so the query stays fast. No events is not an error in my script, so I silence that message.`,
          action: `Get-WinEvent -FilterHashtable @{ LogName = 'Microsoft-Windows-PowerShell/Operational'; Id = 4104; StartTime = (Get-Date).AddHours(-24) } -MaxEvents 5 -ErrorAction SilentlyContinue | Select-Object TimeCreated, LevelDisplayName, @{n='Preview';e={$_.Message.Substring(0,[Math]::Min(80,$_.Message.Length))}}`,
          result: `Up to five rows with a time, level and the start of the script text.`,
        },
        {
          think: `Warnings stand out. PowerShell tags blocks containing suspicious API names as Level 3, so I ask for those alone.`,
          action: `Get-WinEvent -FilterHashtable @{ LogName = 'Microsoft-Windows-PowerShell/Operational'; Id = 4104; Level = 3 } -MaxEvents 5 -ErrorAction SilentlyContinue | Select-Object TimeCreated, Id`,
          result: `Often empty on a quiet machine. Anything here deserves a read of the full Message.`,
        },
        {
          think: `Failed logons tell a different story: password guessing. I group by target account to spot a pattern. Property 5 of event 4625 is the target user name.`,
          action: `Get-WinEvent -FilterHashtable @{ LogName = 'Security'; Id = 4625; StartTime = (Get-Date).AddDays(-1) } -MaxEvents 200 -ErrorAction SilentlyContinue | Group-Object { $_.Properties[5].Value } | Sort-Object Count -Descending | Select-Object Count, Name -First 5`,
          result: `The accounts with the most failures. One account with hundreds of failures from one source is a classic brute-force sign.`,
        },
        {
          think: `Transcription is the stenographer. I try it harmlessly on myself and read the file back.`,
          action: `Start-Transcript -Path "$env:TEMP\\academy-demo.txt"; Get-Date; Stop-Transcript; Get-Content "$env:TEMP\\academy-demo.txt"`,
          result: `A header with host and user, your command, its output, and a footer with an end time.`,
        },
      ],
      takeaway: `Check the policy, filter left, read the Warning-level events first, and keep the stenographer and the camera as separate tools.`,
    },
    checkpoints: [
      {
        question: `Which event ID holds the full decoded text of a script block, and in which log?`,
        hint: `Four digits starting with 41.`,
        answer: `Event ID 4104 in Microsoft-Windows-PowerShell/Operational.`,
      },
      {
        question: `What does event 4625 mean and what pattern in it suggests password spraying?`,
        hint: `Security log, logon.`,
        answer: `4625 is a failed logon. Many failures across many different accounts from one source, or many failures against one account in a short time, are the patterns to investigate.`,
      },
      {
        question: `Why filter with -FilterHashtable instead of piping to Where-Object?`,
        hint: `Filter left.`,
        answer: `The event log service filters at the source and returns only matching events, so you avoid pulling a huge log into PowerShell objects first.`,
      },
    ],
    challenge: {
      brief: `Find up to 10 events from the last 7 days in the PowerShell Operational log with ID 4104 whose text mentions DownloadString. Show time and the first 100 characters of the text. Read-only.`,
      hints: [
        `Use Get-WinEvent -FilterHashtable with LogName, Id and StartTime.`,
        `Add -ErrorAction SilentlyContinue so that "no events found" does not look like a failure.`,
        `Use Where-Object { $_.Message -like '*DownloadString*' }, then Select-Object -First 10 with a calculated Preview property.`,
      ],
      solution: `Get-WinEvent -FilterHashtable @{ LogName = 'Microsoft-Windows-PowerShell/Operational'; Id = 4104; StartTime = (Get-Date).AddDays(-7) } -ErrorAction SilentlyContinue |
  Where-Object { $_.Message -like '*DownloadString*' } |
  Select-Object -First 10 TimeCreated, @{n='Preview';e={$_.Message.Substring(0,[Math]::Min(100,$_.Message.Length))}}`,
      why: `The cheap filters (log, ID, time) run at the source, and the expensive text match runs only on what remains. Note that running this very query can create a 4104 event containing the word DownloadString, so the first match you find may be your own hunt.`,
    },
    teachBack: `Explain to a friend who thinks "memory-only means invisible" what three records PowerShell can keep, where each one is stored, and how you would search for the one that holds the decoded code.`,
    diagrams: [
      {
        kind: 'sequence',
        title: `Where each record is written`,
        caption: `The engine writes the camera feed, the receipts and the transcript to different places, so you need all three channels.`,
        actors: [
          { name: `Script or command`, sub: `Typed or run from memory`, tone: 'amber' },
          { name: `PowerShell engine`, sub: `5.1 or 7`, tone: 'blue' },
          { name: `Operational log`, sub: `4104 and 4103`, tone: 'cyan' },
          { name: `Transcript share`, sub: `Write-only text files`, tone: 'violet' },
          { name: `Analyst or SIEM`, sub: `Get-WinEvent`, tone: 'green' },
        ],
        messages: [
          { from: 0, to: 1, label: `Code reaches the engine`, detail: `It may be typed, loaded from a file, or arrive from memory through a download cradle.` },
          { from: 1, to: 1, label: `Compile into a script block`, detail: `The engine compiles the plain text into a script block, after any decoding has happened.` },
          { from: 1, to: 2, label: `Write event 4104`, detail: `The compiled text is logged. Large scripts are split into numbered parts.` },
          { from: 1, to: 2, label: `Write event 4103`, detail: `With module logging on, each pipeline execution and its parameter bindings are logged.` },
          { from: 1, to: 3, label: `Append to transcript`, detail: `System-wide transcription writes everything typed and displayed to timestamped text files.` },
          { from: 4, to: 2, label: `Hunt with FilterHashtable`, detail: `The analyst or SIEM pulls the events filtered by log, ID and time at the source.` },
        ],
      },
      {
        kind: 'compare',
        title: `Filter left vs filter late`,
        caption: `The same question asked two ways. Only one of them respects the size of a real Security log.`,
        left: {
          heading: `Pipe then Where-Object`,
          tone: 'red',
          rows: [
            { label: `Where filtering happens`, value: `After every event is loaded` },
            { label: `Memory use`, value: `Large` },
            { label: `Speed on a big log`, value: `Slow, grows with log size` },
            { label: `PowerShell 7`, value: `Get-EventLog is missing` },
          ],
        },
        right: {
          heading: `Get-WinEvent -FilterHashtable`,
          tone: 'green',
          rows: [
            { label: `Where filtering happens`, value: `Inside the Event Log service` },
            { label: `Memory use`, value: `Only matching events` },
            { label: `Speed on a big log`, value: `Much faster (measure it)` },
            { label: `PowerShell 7`, value: `Works in 5.1 and 7` },
          ],
        },
        verdict: `Ask the log service the narrowest possible question. Use PowerShell for shaping the answer, not for finding it.`,
      },
      {
        kind: 'layers',
        title: `A detection for each stage of an attack`,
        caption: `The same attack path as 15-2, seen from the log side. Read it as a to-do list: for each stage, which log do I need, and is it switched on?`,
        layers: [
          {
            label: `Run a script from memory`,
            sub: `4104 and AMSI`,
            detail: `Operational log. Needs Script Block Logging enabled. Hunt: Get-WinEvent with LogName, Id 4104 and a start time, and read Warning-level events first.`,
            tone: 'cyan',
          },
          {
            label: `Spawn child processes`,
            sub: `4688 in the Security log`,
            detail: `Shows which process started which, for example winword.exe starting powershell.exe. The command line is only present if the audit policy and the include-command-line setting are both enabled.`,
            tone: 'blue',
          },
          {
            label: `Ask for service tickets`,
            sub: `4769 on the domain controller`,
            detail: `Look for many ticket requests from one account in a short time and tickets using RC4 (0x17) where your environment normally uses AES.`,
            tone: 'violet',
          },
          {
            label: `Clear the logs`,
            sub: `1102 (and 104 in System)`,
            detail: `1102 is written when the Security log is cleared and 104 when other logs are. Alert on these and forward events so a local clear cannot erase the only copy.`,
            tone: 'red',
          },
        ],
        traceLabel: `Match each stage to its log`,
        tracePath: [0, 1, 2, 3],
      },
    ],
  },

  // ==========================================================================
  // 16-2  Hardening: v2 removal, CLM, JEA
  // ==========================================================================
  '16-2': {
    hook: `What if a helpdesk technician could restart exactly one service on a Domain Controller and literally nothing else, even if their password leaked tomorrow?`,
    mentalModel: `JEA is a vending machine: it has a few labelled buttons and it holds the stockroom key so the customer never has to. Constrained Language Mode locks the sharp knives in a drawer. Removing PowerShell 2.0 bolts the old back door that bypassed both.`,
    misconceptions: [
      {
        myth: `Removing PowerShell 2.0 will break my modern PowerShell.`,
        truth: `PowerShell 2.0 is a separate optional feature. Windows PowerShell 5.1 and PowerShell 7 are not affected. Only very old scripts that explicitly request -Version 2 stop working, which is the point.`,
        test: `Run $PSVersionTable.PSVersion before and after. It is unchanged. In an elevated shell, Get-WindowsOptionalFeature -Online -FeatureName MicrosoftWindowsPowerShellV2Root | Select-Object FeatureName, State shows the v2 feature state.`,
      },
      {
        myth: `Constrained Language Mode is just a setting I can turn on in PowerShell.`,
        truth: `A real CLM enforcement comes from an application control policy such as WDAC or AppLocker script rules, which decide what is trusted. Changing the mode by hand in one session only affects that session and is not a security boundary.`,
        test: `$ExecutionContext.SessionState.LanguageMode shows FullLanguage on a normal machine. On a WDAC-enforced endpoint it reports ConstrainedLanguage for untrusted scripts.`,
      },
      {
        myth: `A JEA user effectively becomes an administrator.`,
        truth: `They get a session that exposes only the commands you whitelisted, running under a temporary virtual account. The power lives in the machine, not in the person. The whitelist must be chosen carefully, because allowing a command like Invoke-Expression or Start-Process would open the whole door again.`,
        test: `Get-PSSessionCapability -ConfigurationName HelpdeskJEA -Username 'CORP\\helpdesk1' lists exactly what that user may run (lab endpoint).`,
      },
    ],
    workedExample: {
      goal: `In a lab VM only: see Constrained Language Mode block raw .NET, then build and register a tiny JEA endpoint. These steps change the lab system, so do not run them on production.`,
      steps: [
        {
          think: `Always start from the current state. The language mode tells me what this session may do.`,
          action: `$ExecutionContext.SessionState.LanguageMode`,
          result: `FullLanguage on an unrestricted machine.`,
        },
        {
          think: `I want to feel what CLM does without touching policy. In a throwaway window I lock only that session. A session can be moved to ConstrainedLanguage but never back, so I will close the window afterwards.`,
          action: `$ExecutionContext.SessionState.LanguageMode = 'ConstrainedLanguage'; New-Object System.Net.WebClient`,
          result: `An error such as "Cannot create type. Only core types are supported in this language mode." Normal cmdlets like Get-Process still work.`,
        },
        {
          think: `Now JEA. The role capability says what the role may run. I allow Get-Service and a Restart-Service limited to two services. Role capability files must live in a module's RoleCapabilities folder.`,
          action: `$mod = "$env:ProgramFiles\\WindowsPowerShell\\Modules\\HelpdeskJEA"; New-Item -ItemType Directory -Path "$mod\\RoleCapabilities" -Force | Out-Null; New-ModuleManifest -Path "$mod\\HelpdeskJEA.psd1"; New-PSRoleCapabilityFile -Path "$mod\\RoleCapabilities\\DnsOps.psrc" -VisibleCmdlets 'Get-Service', @{ Name = 'Restart-Service'; Parameters = @{ Name = 'Name'; ValidateSet = 'Spooler', 'Dns' } }`,
          result: `A module folder with a DnsOps.psrc file. Nothing is exposed yet.`,
        },
        {
          think: `The session configuration decides who may connect, as whom they run, and where the transcripts go. I map a lab group to the role.`,
          action: `New-PSSessionConfigurationFile -Path .\\HelpdeskJEA.pssc -SessionType RestrictedRemoteServer -RunAsVirtualAccount -TranscriptDirectory C:\\JEATranscripts -RoleDefinitions @{ 'CORP\\Helpdesk' = @{ RoleCapabilities = 'DnsOps' } }`,
          result: `A HelpdeskJEA.pssc file in the current folder.`,
        },
        {
          think: `Registering changes WinRM, so I rehearse with -WhatIf first and read what it says.`,
          action: `Register-PSSessionConfiguration -Name HelpdeskJEA -Path .\\HelpdeskJEA.pssc -WhatIf`,
          result: `What if: Performing the operation "Register-PSSessionConfiguration" ... The command reports what it would do without doing it.`,
        },
        {
          think: `After a real registration in the lab, I verify the endpoint from the point of view of the helpdesk user, rather than trusting my files.`,
          action: `Get-PSSessionCapability -ConfigurationName HelpdeskJEA -Username 'CORP\\helpdesk1'`,
          result: `A short list: Get-Service, Restart-Service and the small set of built-in commands needed for the session. Get-ADUser and Stop-Computer are absent.`,
        },
      ],
      takeaway: `Prove the restriction by asking what the user can run, not by reading what you meant to allow.`,
    },
    checkpoints: [
      {
        question: `Why does a PowerShell 2.0 downgrade defeat AMSI and Script Block Logging?`,
        hint: `Those features arrived in a later version.`,
        answer: `The v2 engine predates AMSI and Script Block Logging, so a command started with powershell.exe -Version 2 runs without either one. Removing the v2 feature closes the door.`,
      },
      {
        question: `Which file lists the allowed commands for a JEA role and which file sets the session type and virtual account?`,
        hint: `Extensions .psrc and .pssc.`,
        answer: `The role capability file (.psrc) lists the allowed commands and parameters. The session configuration file (.pssc) sets SessionType, RunAsVirtualAccount, transcripts and the mapping from groups to roles.`,
      },
      {
        question: `Name two things that still work and two that are blocked in Constrained Language Mode.`,
        hint: `Think cmdlets versus arbitrary .NET.`,
        answer: `Working: ordinary signed cmdlets such as Get-Process and Get-Service, plus variables, loops and pipelines. Blocked: creating arbitrary .NET types with New-Object, [adsisearcher], COM objects and Add-Type C# compilation.`,
      },
    ],
    challenge: {
      brief: `Write a short audit for your lab that reports whether the PowerShell 2.0 engine is enabled and, if it is, prints what the removal would do with -WhatIf instead of removing it. Run it in an elevated window.`,
      hints: [
        `Get-WindowsOptionalFeature -Online -FeatureName MicrosoftWindowsPowerShellV2Root returns an object with a State property.`,
        `Add -ErrorAction SilentlyContinue because newer Windows builds may not ship the feature at all, which leaves you with $null.`,
        `Compare State to 'Enabled' and call Disable-WindowsOptionalFeature with -NoRestart and -WhatIf inside the true branch.`,
      ],
      solution: `$f = Get-WindowsOptionalFeature -Online -FeatureName MicrosoftWindowsPowerShellV2Root -ErrorAction SilentlyContinue
if ($f -and $f.State -eq 'Enabled') {
    'PowerShell 2.0 is ENABLED: downgrade risk'
    Disable-WindowsOptionalFeature -Online -FeatureName MicrosoftWindowsPowerShellV2Root -NoRestart -WhatIf
} else {
    'PowerShell 2.0 is not enabled'
}`,
      why: `Auditing first and rehearsing the change with -WhatIf is the safe pattern for every hardening step. A $null or Disabled result means the downgrade route is already closed on that machine.`,
    },
    teachBack: `Explain to a friend who knows only "admin or not admin" how JEA gives someone the power to do one job without handing them the keys to the whole server, and why the list of allowed commands must be chosen carefully.`,
    diagrams: [
      {
        kind: 'layers',
        title: `Defence in depth for PowerShell`,
        caption: `Each layer covers a gap the others leave open. Remove one and an attacker has an easier path.`,
        layers: [
          {
            label: `Logging and AMSI`,
            sub: `4104, 4103, transcripts`,
            detail: `Records and scans what actually executes, so even a clever attack leaves evidence for the defenders.`,
            tone: 'green',
          },
          {
            label: `JEA endpoints`,
            sub: `Few commands per role`,
            detail: `Operators use a whitelisted endpoint instead of full admin rights, and every session is transcribed.`,
            tone: 'blue',
          },
          {
            label: `Constrained Language`,
            sub: `WDAC or AppLocker`,
            detail: `Untrusted scripts lose access to arbitrary .NET, COM and Add-Type, which shrinks what they can do.`,
            tone: 'violet',
          },
          {
            label: `No PowerShell 2.0`,
            sub: `Downgrade door closed`,
            detail: `Removes the old engine that has no AMSI and no Script Block Logging, so the layers above cannot be bypassed that way.`,
            tone: 'amber',
          },
          {
            label: `Least-privilege accounts`,
            sub: `Standard daily user`,
            detail: `The foundation from lesson 1-1. Everything above works better when daily accounts hold little power.`,
            tone: 'red',
          },
        ],
        traceLabel: `Walk the layers`,
      },
      {
        kind: 'sequence',
        title: `A JEA session from connect to disconnect`,
        caption: `The helpdesk user never receives admin credentials. The endpoint does the privileged work on their behalf.`,
        actors: [
          { name: `Helpdesk user`, sub: `Normal account`, tone: 'amber' },
          { name: `WinRM endpoint`, sub: `HelpdeskJEA`, tone: 'blue' },
          { name: `JEA session`, sub: `Virtual account`, tone: 'violet' },
          { name: `Transcript folder`, sub: `Audit trail`, tone: 'green' },
        ],
        messages: [
          { from: 0, to: 1, label: `Enter-PSSession (JEA)`, detail: `The user connects to the named endpoint over WinRM with their own normal credentials.` },
          { from: 1, to: 1, label: `Map group to role`, detail: `The .pssc RoleDefinitions entry says that group gets the DnsOps role capability.` },
          { from: 1, to: 2, label: `Create restricted runspace`, detail: `A temporary virtual account is created and only the cmdlets from the .psrc are exposed.` },
          { from: 0, to: 2, label: `Restart-Service Spooler`, detail: `An allowed command runs with the virtual account's rights, not the user's.` },
          { from: 0, to: 2, label: `Get-ADUser (refused)`, detail: `A command outside the role does not exist in the session and returns a not-recognised error.` },
          { from: 2, to: 3, label: `Transcript, then cleanup`, detail: `Everything typed and returned is saved. On disconnect the virtual account disappears.` },
        ],
      },
    ],
  },
};
