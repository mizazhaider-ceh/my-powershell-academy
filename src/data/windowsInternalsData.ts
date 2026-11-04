export const SYSCALL_STEPS = [
  {
    id: 'scApp',
    short: '1 · App (User Mode)',
    title: 'Notepad.exe (User Mode)',
    badge: 'Ring 3 · Unprivileged',
    color: 'border-blue-500 bg-blue-500/10 text-blue-700 dark:text-blue-300',
    desc: 'You press Ctrl+S in Notepad. The app prepares the bytes in memory, but because it lives in User Mode, the CPU blocks it from touching the physical disk. It has to ask the kernel for a favor.',
  },
  {
    id: 'scNtdll',
    short: '2 · NTDLL.DLL Gate',
    title: 'NTDLL.DLL (The Syscall Boundary)',
    badge: 'User ↔ Kernel Gate',
    color:
      'border-amber-500 bg-amber-500/10 text-amber-700 dark:text-amber-300',
    desc: 'Notepad calls NtWriteFile inside NTDLL.DLL. This special library packages the request with a system call number and executes the CPU syscall instruction, switching the processor from User Mode into Kernel Mode.',
  },
  {
    id: 'scKernel',
    short: '3 · Executive (Kernel)',
    title: 'Executive - ntoskrnl.exe (I/O, Object & Security Managers)',
    badge: 'Ring 0 · Security Check Here',
    color:
      'border-purple-500 bg-purple-500/10 text-purple-700 dark:text-purple-300',
    desc: 'The I/O Manager receives the request. The Object Manager looks up the file kernel object using Notepad’s handle ticket, and the Security Reference Monitor verifies your Access Token: are you actually allowed to write to this file?',
  },
  {
    id: 'scDriver',
    short: '4 · Disk Driver',
    title: 'Storage Device Driver (disk.sys / nvme.sys)',
    badge: 'Ring 0 · Hardware Protocol',
    color:
      'border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
    desc: 'Once approved, the I/O Manager hands an I/O Request Packet (IRP) to the disk driver. The driver translates the generic write request into NVMe or SATA controller commands.',
  },
  {
    id: 'scHal',
    short: '5 · HAL & Hardware',
    title: 'HAL (Hardware Abstraction Layer) → Physical Disk',
    badge: 'Physical Silicon',
    color:
      'border-stone-500 bg-stone-500/10 text-stone-700 dark:text-stone-300',
    desc: 'The HAL translates the command for your exact motherboard chipset, the bytes land on the SSD flash cells, and the success status climbs all the way back up to Notepad. This round-trip happens thousands of times per second!',
  },
];

export interface ProcessNode {
  name: string;
  pid: number;
  parent: string;
  path: string;
  isMalware: boolean;
  verdictExplanation: string;
}

export const PROCESS_TREE_NODES: ProcessNode[] = [
  {
    name: 'System',
    pid: 4,
    parent: ', (Kernel itself)',
    path: 'N/A (Lives in kernel mode)',
    isMalware: false,
    verdictExplanation:
      'Legitimate! SYSTEM always has PID 4 and represents kernel-mode threads.',
  },
  {
    name: 'smss.exe',
    pid: 512,
    parent: 'System (PID 4)',
    path: 'C:\\Windows\\System32\\smss.exe',
    isMalware: false,
    verdictExplanation:
      'Legitimate! Session Manager is spawned by System and lives in System32.',
  },
  {
    name: 'wininit.exe',
    pid: 604,
    parent: 'smss.exe',
    path: 'C:\\Windows\\System32\\wininit.exe',
    isMalware: false,
    verdictExplanation:
      'Legitimate! Windows Initialization starts Session 0 background services.',
  },
  {
    name: 'services.exe',
    pid: 672,
    parent: 'wininit.exe',
    path: 'C:\\Windows\\System32\\services.exe',
    isMalware: false,
    verdictExplanation:
      'Legitimate! Service Control Manager is always a child of wininit.exe in System32.',
  },
  {
    name: 'lsass.exe',
    pid: 700,
    parent: 'wininit.exe',
    path: 'C:\\Windows\\System32\\lsass.exe',
    isMalware: false,
    verdictExplanation:
      'Legitimate! Local Security Authority Subsystem is spawned by wininit.exe in System32.',
  },
  {
    name: 'winlogon.exe',
    pid: 724,
    parent: 'smss.exe',
    path: 'C:\\Windows\\System32\\winlogon.exe',
    isMalware: false,
    verdictExplanation:
      'Legitimate! Manages the interactive Ctrl+Alt+Del logon session.',
  },
  {
    name: 'svchost.exe',
    pid: 884,
    parent: 'services.exe',
    path: 'C:\\Windows\\System32\\svchost.exe',
    isMalware: false,
    verdictExplanation:
      'Legitimate! Hosted under services.exe and running from C:\\Windows\\System32.',
  },
  {
    name: 'explorer.exe',
    pid: 2412,
    parent: 'userinit.exe (exited)',
    path: 'C:\\Windows\\explorer.exe',
    isMalware: false,
    verdictExplanation:
      'Legitimate! The Windows graphical shell lives directly in C:\\Windows\\explorer.exe.',
  },
  {
    name: 'svch0st.exe',
    pid: 1337,
    parent: 'explorer.exe',
    path: 'C:\\Users\\izaz\\AppData\\Roaming\\svch0st.exe',
    isMalware: true,
    verdictExplanation:
      'MALWARE CAUGHT! Triple red flag: spelled with a zero ("svch0st"), parent is explorer.exe instead of services.exe, and running out of AppData\\Roaming!',
  },
  {
    name: 'Isass.exe',
    pid: 1500,
    parent: 'explorer.exe',
    path: 'C:\\Temp\\Isass.exe',
    isMalware: true,
    verdictExplanation:
      'MALWARE CAUGHT! Name trick: starts with a capital "i" (Isass) pretending to be lowercase "L" (lsass), spawned by explorer.exe, and running from C:\\Temp!',
  },
];
