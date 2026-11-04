export interface MemberItem {
  name: string;
  type: 'Property' | 'Method';
  definition: string;
  sampleValueOrAction: string;
  explanation: string;
  exampleCall: string;
}

export const PROCESS_MEMBERS: MemberItem[] = [
  {
    name: 'ProcessName',
    type: 'Property',
    definition: 'string ProcessName {get;}',
    sampleValueOrAction: '"powershell"',
    explanation: 'Stores the executable filename without extension.',
    exampleCall: '$proc.ProcessName',
  },
  {
    name: 'Id',
    type: 'Property',
    definition: 'int Id {get;}',
    sampleValueOrAction: '4082',
    explanation: 'Operating system process identifier (PID).',
    exampleCall: '$proc.Id',
  },
  {
    name: 'Handles',
    type: 'Property',
    definition: 'int HandleCount {get;}',
    sampleValueOrAction: '640',
    explanation: 'Number of operating system handles opened by this process.',
    exampleCall: '$proc.Handles',
  },
  {
    name: 'WorkingSet64',
    type: 'Property',
    definition: 'long WorkingSet64 {get;}',
    sampleValueOrAction: '124997632 (bytes)',
    explanation: 'Physical RAM allocated to the process in bytes.',
    exampleCall: '[math]::Round($proc.WorkingSet64 / 1MB, 2)',
  },
  {
    name: 'Kill()',
    type: 'Method',
    definition: 'void Kill()',
    sampleValueOrAction: 'Immediately terminates the process tree',
    explanation:
      'Forces the Windows kernel to terminate the target process immediately.',
    exampleCall: '$proc.Kill()',
  },
  {
    name: 'WaitForExit()',
    type: 'Method',
    definition: 'bool WaitForExit(int milliseconds)',
    sampleValueOrAction: 'Pauses script execution until process terminates',
    explanation:
      'Blocks execution until the target process exits or timeout expires.',
    exampleCall: '$proc.WaitForExit(5000)',
  },
  {
    name: 'Refresh()',
    type: 'Method',
    definition: 'void Refresh()',
    sampleValueOrAction: 'Re-queries the operating system for current metrics',
    explanation:
      'Refreshes cached property values (like CPU or memory) with live kernel state.',
    exampleCall: '$proc.Refresh()',
  },
];

export interface SimulatedObject {
  id: number;
  name: string;
  handles: number;
  wsMB: number;
  status: 'initial' | 'passed-filter' | 'rejected-filter' | 'selected';
}

export const INITIAL_PROCESSES: SimulatedObject[] = [
  {
    id: 104,
    name: 'powershell.exe',
    handles: 620,
    wsMB: 112,
    status: 'initial',
  },
  { id: 218, name: 'notepad.exe', handles: 85, wsMB: 18, status: 'initial' },
  {
    id: 340,
    name: 'explorer.exe',
    handles: 1420,
    wsMB: 245,
    status: 'initial',
  },
  { id: 412, name: 'svchost.exe', handles: 490, wsMB: 84, status: 'initial' },
  { id: 509, name: 'calc.exe', handles: 110, wsMB: 22, status: 'initial' },
  { id: 630, name: 'code.exe', handles: 890, wsMB: 310, status: 'initial' },
];

export const SYS_PROCS = [
  {
    name: 'SYSTEM',
    pid: 'PID 4 (Always)',
    parent: 'None (Kernel)',
    path: 'N/A (Kernel Memory)',
    summary:
      'Not an executable file on disk, it represents the Windows Kernel itself and hosts all kernel-mode threads. If you ever see a process named "System" with any PID other than 4, you are looking at malware.',
  },
  {
    name: 'SMSS.EXE',
    pid: 'Random PID',
    parent: 'SYSTEM (PID 4)',
    path: 'C:\\Windows\\System32\\smss.exe',
    summary:
      'Session Manager Subsystem - the very first real user-mode process started by the kernel. It initializes environment variables, creates Session 0 (isolated background services) and Session 1+ (interactive user desktop).',
  },
  {
    name: 'WININIT.EXE',
    pid: 'Random PID',
    parent: 'smss.exe (Session 0)',
    path: 'C:\\Windows\\System32\\wininit.exe',
    summary:
      'Windows Initialization Process - launches the two bedrock pillars of Session 0: services.exe (Service Control Manager) and lsass.exe (Local Security Authority).',
  },
  {
    name: 'SERVICES.EXE',
    pid: 'Random PID',
    parent: 'wininit.exe',
    path: 'C:\\Windows\\System32\\services.exe',
    summary:
      'Service Control Manager (SCM) - starts, stops, and manages all Windows background services. It is the legitimate parent of every svchost.exe instance on the system.',
  },
  {
    name: 'LSASS.EXE',
    pid: 'Random PID',
    parent: 'wininit.exe',
    path: 'C:\\Windows\\System32\\lsass.exe',
    summary:
      'Local Security Authority Subsystem Service - verifies logons, issues Access Tokens, and holds Kerberos tickets & NTLM hashes in memory. Because tools like Mimikatz target LSASS memory, Windows defends it with RunAsPPL and Credential Guard.',
  },
  {
    name: 'WINLOGON.EXE',
    pid: 'Random PID',
    parent: 'smss.exe (Session 1)',
    path: 'C:\\Windows\\System32\\winlogon.exe',
    summary:
      'Windows Logon Manager - handles the interactive Ctrl+Alt+Del Secure Attention Sequence (SAS), launches LogonUI.exe for password/PIN entry, and starts userinit.exe → explorer.exe to load your desktop.',
  },
  {
    name: 'SVCHOST.EXE',
    pid: 'Multiple PIDs',
    parent: 'services.exe',
    path: 'C:\\Windows\\System32\\svchost.exe',
    summary:
      'Service Host - an umbrella wrapper that hosts DLL-based Windows services using the -k flag (e.g., svchost.exe -k netsvcs). Every legitimate svchost.exe lives in System32 and has services.exe as its parent.',
  },
];
