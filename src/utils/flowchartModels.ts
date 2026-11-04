import { Lesson, Chapter } from '../types';

export type ProcessTreeScenario = 'normal' | 'anomaly';

export interface ProcessTreeNode {
  id: string;
  name: string;
  pid: number;
  ppid: number;
  parentId: string | null;
  ring: 'Ring 0' | 'Ring 3';
  sessionId: number;
  integrityLevel: 'System' | 'High' | 'Medium';
  workingSetMB: number;
  threads: number;
  handles: number;
  executablePath: string;
  commandLine: string;
  expectedParent: string;
  isSuspicious: boolean;
  roleSummary: string;
  forensicNote: string;
  powershellQuery: string;
  x: number;
  y: number;
}

export interface PipelineSamplePacket {
  id: string;
  name: string;
  pid: number;
  cpuSeconds: number;
  workingSetMB: number;
  status: 'Running' | 'Responding';
  survivesFilter: boolean;
  projectedOutput: string;
}

const NORMAL_PROCESS_TREE_NODES: ProcessTreeNode[] = [
  {
    id: 'proc-system',
    name: 'System',
    pid: 4,
    ppid: 0,
    parentId: null,
    ring: 'Ring 0',
    sessionId: 0,
    integrityLevel: 'System',
    workingSetMB: 12,
    threads: 164,
    handles: 3420,
    executablePath: 'C:\\Windows\\System32\\ntoskrnl.exe',
    commandLine: 'System',
    expectedParent: 'Idle (PID 0)',
    isSuspicious: false,
    roleSummary:
      'The Windows NT Kernel Executive (ntoskrnl.exe) running in Ring 0. Always holds PID 4 and anchors kernel threads and handles.',
    forensicNote:
      'Legitimate System always has PID 4, Session 0, and no user-mode image path anomalies.',
    powershellQuery: 'Get-Process -Id 4 | Select-Object Id, ProcessName, Threads, Handles',
    x: 490,
    y: 46,
  },
  {
    id: 'proc-smss',
    name: 'smss.exe',
    pid: 384,
    ppid: 4,
    parentId: 'proc-system',
    ring: 'Ring 3',
    sessionId: 0,
    integrityLevel: 'System',
    workingSetMB: 4,
    threads: 4,
    handles: 68,
    executablePath: 'C:\\Windows\\System32\\smss.exe',
    commandLine: '\\SystemRoot\\System32\\smss.exe',
    expectedParent: 'System (PID 4)',
    isSuspicious: false,
    roleSummary:
      'Session Manager Subsystem: the very first User-Mode (Ring 3) process spawned by the kernel during boot. Creates Session 0 (services) and Session 1 (interactive user).',
    forensicNote:
      'Must be spawned directly by PID 4 (System) and run from C:\\Windows\\System32\\smss.exe.',
    powershellQuery:
      'Get-CimInstance Win32_Process -Filter "Name = \'smss.exe\'" | Select-Object ProcessId, ParentProcessId, ExecutablePath',
    x: 490,
    y: 144,
  },
  {
    id: 'proc-wininit',
    name: 'wininit.exe',
    pid: 612,
    ppid: 384,
    parentId: 'proc-smss',
    ring: 'Ring 3',
    sessionId: 0,
    integrityLevel: 'System',
    workingSetMB: 14,
    threads: 6,
    handles: 185,
    executablePath: 'C:\\Windows\\System32\\wininit.exe',
    commandLine: 'wininit.exe',
    expectedParent: 'smss.exe (Session 0)',
    isSuspicious: false,
    roleSummary:
      'Windows Initialization Process in Session 0. Launches background system daemons: services.exe (Service Control Manager) and lsass.exe.',
    forensicNote:
      'Runs in Session 0. Only one instance of wininit.exe should exist on a healthy system.',
    powershellQuery:
      'Get-CimInstance Win32_Process -Filter "ProcessId = 612" | Select-Object Name, ProcessId, SessionId',
    x: 235,
    y: 262,
  },
  {
    id: 'proc-winlogon',
    name: 'winlogon.exe',
    pid: 892,
    ppid: 384,
    parentId: 'proc-smss',
    ring: 'Ring 3',
    sessionId: 1,
    integrityLevel: 'System',
    workingSetMB: 22,
    threads: 8,
    handles: 290,
    executablePath: 'C:\\Windows\\System32\\winlogon.exe',
    commandLine: 'winlogon.exe',
    expectedParent: 'smss.exe (Session 1+)',
    isSuspicious: false,
    roleSummary:
      'Interactive Logon Manager in Session 1. Coordinates CTRL+ALT+DEL secure desktop, loads your user profile, and launches userinit.exe -> explorer.exe.',
    forensicNote:
      'Runs in interactive user sessions (Session 1+). Spawns userinit.exe which launches explorer.exe.',
    powershellQuery:
      'Get-Process -Name winlogon | Select-Object Id, SI, ProcessName, WorkingSet64',
    x: 720,
    y: 262,
  },
  {
    id: 'proc-services',
    name: 'services.exe',
    pid: 748,
    ppid: 612,
    parentId: 'proc-wininit',
    ring: 'Ring 3',
    sessionId: 0,
    integrityLevel: 'System',
    workingSetMB: 28,
    threads: 14,
    handles: 820,
    executablePath: 'C:\\Windows\\System32\\services.exe',
    commandLine: 'C:\\Windows\\system32\\services.exe',
    expectedParent: 'wininit.exe (PID 612)',
    isSuspicious: false,
    roleSummary:
      'Service Control Manager (SCM): starts, stops, and manages all Windows services and is the ONLY legitimate parent of svchost.exe.',
    forensicNote:
      'Every legitimate svchost.exe process on Windows must trace its ParentProcessId back to services.exe.',
    powershellQuery:
      'Get-CimInstance Win32_Process -Filter "ParentProcessId = 748" | Select-Object Name, ProcessId, CommandLine',
    x: 130,
    y: 356,
  },
  {
    id: 'proc-lsass',
    name: 'lsass.exe',
    pid: 764,
    ppid: 612,
    parentId: 'proc-wininit',
    ring: 'Ring 3',
    sessionId: 0,
    integrityLevel: 'System',
    workingSetMB: 46,
    threads: 12,
    handles: 1240,
    executablePath: 'C:\\Windows\\System32\\lsass.exe',
    commandLine: 'C:\\Windows\\system32\\lsass.exe',
    expectedParent: 'wininit.exe (PID 612)',
    isSuspicious: false,
    roleSummary:
      'Local Security Authority Subsystem Service: validates logins, enforces security policy, and issues Access Tokens (SIDs + privileges).',
    forensicNote:
      'Prime credential-dumping target. There must be exactly ONE lsass.exe running from System32 under wininit.exe.',
    powershellQuery:
      'Get-CimInstance Win32_Process -Filter "Name = \'lsass.exe\'" | Select-Object ProcessId, ParentProcessId, ExecutablePath',
    x: 340,
    y: 356,
  },
  {
    id: 'proc-explorer',
    name: 'explorer.exe',
    pid: 4120,
    ppid: 892,
    parentId: 'proc-winlogon',
    ring: 'Ring 3',
    sessionId: 1,
    integrityLevel: 'Medium',
    workingSetMB: 148,
    threads: 62,
    handles: 2150,
    executablePath: 'C:\\Windows\\explorer.exe',
    commandLine: 'C:\\Windows\\Explorer.EXE',
    expectedParent: 'userinit.exe / winlogon.exe',
    isSuspicious: false,
    roleSummary:
      'Windows Graphical Shell running in Session 1 with a Medium Integrity Access Token. Parent of interactive apps you launch from the Start Menu or Taskbar.',
    forensicNote:
      'Standard interactive applications inherit explorer.exe as their parent and start at Medium Integrity unless elevated via UAC.',
    powershellQuery:
      'Get-Process -Id 4120 | Select-Object Id, ProcessName, SI, Path',
    x: 720,
    y: 356,
  },
  {
    id: 'proc-svchost',
    name: 'svchost.exe',
    pid: 1184,
    ppid: 748,
    parentId: 'proc-services',
    ring: 'Ring 3',
    sessionId: 0,
    integrityLevel: 'System',
    workingSetMB: 64,
    threads: 24,
    handles: 940,
    executablePath: 'C:\\Windows\\System32\\svchost.exe',
    commandLine: 'C:\\Windows\\system32\\svchost.exe -k netsvcs -p',
    expectedParent: 'services.exe (PID 748)',
    isSuspicious: false,
    roleSummary:
      'Shared Service Host container that loads DLL-based background services (such as WinRM, DNS Client, or Windows Update) using the -k group flag.',
    forensicNote:
      'Always verify two rules for svchost.exe: ParentProcessId must be services.exe, and CommandLine must include -k.',
    powershellQuery:
      'Get-CimInstance Win32_Process -Filter "ProcessId = 1184" | Select-Object Name, ParentProcessId, CommandLine',
    x: 130,
    y: 448,
  },
  {
    id: 'proc-pwsh',
    name: 'pwsh.exe',
    pid: 8192,
    ppid: 4120,
    parentId: 'proc-explorer',
    ring: 'Ring 3',
    sessionId: 1,
    integrityLevel: 'High',
    workingSetMB: 92,
    threads: 18,
    handles: 640,
    executablePath: 'C:\\Program Files\\PowerShell\\7\\pwsh.exe',
    commandLine: '"C:\\Program Files\\PowerShell\\7\\pwsh.exe" -NoLogo',
    expectedParent: 'explorer.exe / wt.exe',
    isSuspicious: false,
    roleSummary:
      'PowerShell 7 Engine hosting the .NET Common Language Runtime (CLR) and executing structured object pipelines in your interactive session.',
    forensicNote:
      'Interactive administrative session launched by the user; logs ScriptBlock execution to Event ID 4104.',
    powershellQuery:
      'Get-Process -Id $PID | Select-Object Id, ProcessName, WorkingSet64, Path',
    x: 600,
    y: 448,
  },
  {
    id: 'proc-child-tool',
    name: 'conhost.exe',
    pid: 9410,
    ppid: 4120,
    parentId: 'proc-explorer',
    ring: 'Ring 3',
    sessionId: 1,
    integrityLevel: 'Medium',
    workingSetMB: 18,
    threads: 6,
    handles: 142,
    executablePath: 'C:\\Windows\\System32\\conhost.exe',
    commandLine: '\\??\\C:\\Windows\\system32\\conhost.exe 0x4',
    expectedParent: 'explorer.exe / console app',
    isSuspicious: false,
    roleSummary:
      'Console Window Host spawned in Session 1 to render interactive command-line windows alongside PowerShell and terminal tools.',
    forensicNote:
      'Interactive desktop applications and shells in Session 1 trace their parent lineage up to explorer.exe (PID 4120).',
    powershellQuery:
      'Get-CimInstance Win32_Process -Filter "ParentProcessId = 4120" | Select-Object Name, ProcessId, CommandLine',
    x: 840,
    y: 448,
  },
];

const ANOMALY_PROCESS_TREE_NODES: ProcessTreeNode[] = [
  ...NORMAL_PROCESS_TREE_NODES.slice(0, 7),
  {
    id: 'proc-fake-svchost',
    name: 'svchost.exe (!)',
    pid: 9920,
    ppid: 4120,
    parentId: 'proc-explorer',
    ring: 'Ring 3',
    sessionId: 1,
    integrityLevel: 'Medium',
    workingSetMB: 38,
    threads: 9,
    handles: 210,
    executablePath: 'C:\\Users\\Public\\Downloads\\svchost.exe',
    commandLine: 'C:\\Users\\Public\\Downloads\\svchost.exe --beacon',
    expectedParent: 'services.exe (PID 748)',
    isSuspicious: true,
    roleSummary:
      'MALWARE MASQUERADE ALERT: Named svchost.exe to blend into Task Manager, but spawned by explorer.exe in Session 1 from C:\\Users\\Public!',
    forensicNote:
      'Red Flags: 1) PPID is 4120 (explorer.exe) instead of 748 (services.exe). 2) Path is C:\\Users\\Public instead of System32. 3) Missing -k service flag.',
    powershellQuery:
      'Get-CimInstance Win32_Process -Filter "Name = \'svchost.exe\' AND ParentProcessId != 748"',
    x: 575,
    y: 448,
  },
  {
    id: 'proc-winword',
    name: 'WINWORD.EXE',
    pid: 6320,
    ppid: 4120,
    parentId: 'proc-explorer',
    ring: 'Ring 3',
    sessionId: 1,
    integrityLevel: 'Medium',
    workingSetMB: 185,
    threads: 28,
    handles: 980,
    executablePath: 'C:\\Program Files\\Microsoft Office\\root\\Office16\\WINWORD.EXE',
    commandLine: '"WINWORD.EXE" "C:\\Users\\izaz\\Downloads\\Invoice_Q4.docm"',
    expectedParent: 'explorer.exe (PID 4120)',
    isSuspicious: true,
    roleSummary:
      'Office document viewer opening a macro-enabled document (.docm). Used as the initial access vehicle before spawning a child shell.',
    forensicNote:
      'Office applications (WINWORD.EXE, EXCEL.EXE) spawning command shells (powershell.exe, cmd.exe, wscript.exe) is a classic macro payload indicator.',
    powershellQuery:
      'Get-CimInstance Win32_Process -Filter "ParentProcessId = 6320" | Select-Object Name, ProcessId, CommandLine',
    x: 840,
    y: 356,
  },
  {
    id: 'proc-rogue-ps',
    name: 'powershell.exe (!)',
    pid: 7744,
    ppid: 6320,
    parentId: 'proc-winword',
    ring: 'Ring 3',
    sessionId: 1,
    integrityLevel: 'Medium',
    workingSetMB: 78,
    threads: 14,
    handles: 512,
    executablePath: 'C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe',
    commandLine: 'powershell.exe -NoP -W Hidden -Enc SQBFAFgAIAAoAE4AZQB3AC0ATwBiAGoAZQBjAHQA...',
    expectedParent: 'explorer.exe / wt.exe (NOT Office)',
    isSuspicious: true,
    roleSummary:
      'SUSPICIOUS CHILD SHELL: Spawned by WINWORD.EXE (PID 6320) with hidden window (-W Hidden) and Base64 -EncodedCommand cradle.',
    forensicNote:
      'Inspect Event ID 4104 (Script Block Logging) and AMSI telemetry immediately to see the decoded payload executed by PID 7744.',
    powershellQuery:
      'Get-WinEvent -FilterHashtable @{LogName="Microsoft-Windows-PowerShell/Operational"; Id=4104} | Select-Object -First 5',
    x: 840,
    y: 448,
  },
];

const DEFAULT_PIPELINE_PACKETS: PipelineSamplePacket[] = [
  {
    id: 'pkt-1',
    name: 'pwsh',
    pid: 8192,
    cpuSeconds: 18.4,
    workingSetMB: 92,
    status: 'Running',
    survivesFilter: true,
    projectedOutput: '@{ Name = "pwsh"; Id = 8192; RAM_MB = 92 }',
  },
  {
    id: 'pkt-2',
    name: 'explorer',
    pid: 4120,
    cpuSeconds: 42.1,
    workingSetMB: 148,
    status: 'Running',
    survivesFilter: true,
    projectedOutput: '@{ Name = "explorer"; Id = 4120; RAM_MB = 148 }',
  },
  {
    id: 'pkt-3',
    name: 'notepad',
    pid: 9044,
    cpuSeconds: 0.3,
    workingSetMB: 16,
    status: 'Running',
    survivesFilter: false,
    projectedOutput: '(Filtered out at Stage 2: WorkingSetMB < 50)',
  },
  {
    id: 'pkt-4',
    name: 'svchost',
    pid: 1184,
    cpuSeconds: 11.7,
    workingSetMB: 64,
    status: 'Running',
    survivesFilter: true,
    projectedOutput: '@{ Name = "svchost"; Id = 1184; RAM_MB = 64 }',
  },
];

/**
 * Returns the interactive process tree nodes for either the normal Windows
 * hierarchy or the forensic PPID-anomaly hunting scenario.
 */
export function getProcessTreeNodes(
  scenario: ProcessTreeScenario
): ProcessTreeNode[] {
  return scenario === 'anomaly'
    ? ANOMALY_PROCESS_TREE_NODES
    : NORMAL_PROCESS_TREE_NODES;
}

/**
 * Computes the ordered ancestor lineage IDs from root (System PID 4) down to
 * the selected process node ID so the SVG tree can highlight the exact parent chain.
 */
export function getProcessLineageIds(
  nodes: ProcessTreeNode[],
  selectedNodeId: string
): string[] {
  const byId = new Map<string, ProcessTreeNode>();
  for (const node of nodes) {
    byId.set(node.id, node);
  }

  const chain: string[] = [];
  let cursor = byId.get(selectedNodeId);
  const visited = new Set<string>();

  while (cursor && !visited.has(cursor.id)) {
    visited.add(cursor.id);
    chain.unshift(cursor.id);
    cursor = cursor.parentId ? byId.get(cursor.parentId) : undefined;
  }

  return chain;
}

/**
 * Returns sample live .NET objects flowing through the 4 pipeline stages so
 * visual learners can watch how filtering and property projection transform objects.
 */
export function getPipelinePacketsForStage(
  stageIndex: number
): {
  packets: PipelineSamplePacket[];
  bindingRule: 'Source Producer' | 'ByValue ([Process])' | 'ByPropertyName (.Id / .Name)';
  stageStatusSummary: string;
} {
  const clamped = Math.max(0, Math.min(3, stageIndex));
  if (clamped === 0) {
    return {
      packets: DEFAULT_PIPELINE_PACKETS,
      bindingRule: 'Source Producer',
      stageStatusSummary:
        'Stage 1 emits all 4 live System.Diagnostics.Process objects one-by-one into the pipeline stream.',
    };
  }
  if (clamped === 1) {
    return {
      packets: DEFAULT_PIPELINE_PACKETS,
      bindingRule: 'ByValue ([Process])',
      stageStatusSummary:
        'Stage 2 binds each incoming Process object ByValue ($_ / $PSItem) and evaluates the filter condition in memory.',
    };
  }
  const surviving = DEFAULT_PIPELINE_PACKETS.filter((p) => p.survivesFilter);
  if (clamped === 2) {
    return {
      packets: surviving,
      bindingRule: 'ByValue ([Process])',
      stageStatusSummary: `Stage 3 receives the ${surviving.length} surviving objects (notepad PID 9044 was dropped at Stage 2) and projects structured properties.`,
    };
  }
  return {
    packets: surviving,
    bindingRule: 'ByPropertyName (.Id / .Name)',
    stageStatusSummary: `Stage 4 binds the ${surviving.length} surviving objects for final output rendering or action execution.`,
  };
}

/**
 * Determines which visual tab should open by default for a given lesson so
 * process/kernel/forensic lessons open directly on the Process Tree or Pipeline view.
 */
export function getRecommendedFlowchartTab(
  lesson: Lesson,
  chapter?: Chapter
): 'pipeline' | 'processtree' | 'object' {
  const slugAndTitle = `${lesson.slug} ${lesson.title}`.toLowerCase();
  if (
    lesson.id === '1-2' ||
    lesson.id === '1-5' ||
    slugAndTitle.includes('process') ||
    slugAndTitle.includes('lsass') ||
    slugAndTitle.includes('svchost') ||
    slugAndTitle.includes('hunter') ||
    (chapter?.track === 'Windows Internals' && lesson.id !== '1-3')
  ) {
    return 'processtree';
  }
  return 'pipeline';
}
