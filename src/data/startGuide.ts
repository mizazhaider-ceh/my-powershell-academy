export interface StartStep {
  title: string;
  body: string[];
  code?: string;
  output?: string;
  tip?: string;
}

export const START_STEPS: StartStep[] = [
  {
    title: 'Open PowerShell',
    body: [
      'Press the Windows key, type "PowerShell" and press Enter. On Windows 11 you can also right-click the Start button and choose Terminal.',
      'You will see a window with a line of text ending in a > symbol. That line is the prompt. It means PowerShell is waiting for you to type.',
      'Do not choose "Run as administrator" yet. Almost everything in the early lessons works as a normal user, and that is the safer way to learn.',
    ],
    tip: 'Windows PowerShell (blue window, version 5.1) comes with Windows. PowerShell 7 (the command is pwsh) is a separate, newer program. The lessons work in 5.1 unless they say otherwise.',
  },
  {
    title: 'Read the prompt',
    body: [
      'The prompt shows where you are, like PS C:\\Users\\you>. PS is the shell, and the path is your current folder. Anything you type runs from there.',
      'Type a command and press Enter to run it. The result prints under the command, and a new prompt appears.',
    ],
  },
  {
    title: 'Your first win',
    body: ['Type this exactly, then press Enter. It cannot break anything, it only reads the clock.'],
    code: 'Get-Date',
    output: 'Tuesday, 14 January 2025 09:42:17',
    tip: 'Your date and time will differ. If you see red text, you probably mistyped. Press the Up arrow to bring the line back, fix it, and press Enter again.',
  },
  {
    title: 'See which version you have',
    body: ['Every PowerShell has a built-in variable that describes itself.'],
    code: '$PSVersionTable.PSVersion',
    output: 'Major  Minor  Build  Revision\n-----  -----  -----  --------\n5      1      22621  4391',
    tip: 'A Major number of 5 means Windows PowerShell 5.1. A 7 means PowerShell 7. Both are fine for this course.',
  },
  {
    title: 'Ask for a list of things',
    body: [
      'Commands that start with Get- only look. They never change your system. This one lists the five processes using the most memory.',
    ],
    code: 'Get-Process | Sort-Object WorkingSet -Descending | Select-Object -First 5 Name, Id',
    tip: 'The | symbol is the pipe. It hands the output of one command to the next. Lesson 5-1 explains it properly, so for now just notice that it works.',
  },
];

export const TYPING_TIPS: { key: string; what: string }[] = [
  { key: 'Tab', what: 'Finishes the command or parameter you started. Press it again to cycle through matches.' },
  { key: 'Up / Down arrows', what: 'Walk back through commands you already ran.' },
  { key: 'Ctrl + C', what: 'Stops a command that is running or hanging. It does not copy while a command runs.' },
  { key: 'Right-click or Ctrl + V', what: 'Pastes. In Windows Terminal use Ctrl + V. In the older blue console, right-click pastes.' },
  { key: 'Get-Help <name>', what: 'Explains any command. Try Get-Help Get-Date -Examples.' },
  { key: 'Get-Command *service*', what: 'Searches for commands by a word in the name.' },
];

export const SAFETY_LEVELS: { label: string; tone: 'safe' | 'change' | 'care'; verbs: string; meaning: string }[] = [
  { label: 'Reads only', tone: 'safe', verbs: 'Get-, Select-, Where-, Sort-, Measure-', meaning: 'Looks at things. Safe to run any time.' },
  { label: 'Changes something', tone: 'change', verbs: 'Set-, New-, Add-, Start-, Stop-, Restart-', meaning: 'Makes a change. Read the line first, and practise in your lab.' },
  { label: 'Removes something', tone: 'care', verbs: 'Remove-, Clear-, Disable-', meaning: 'Can delete or switch things off. Add -WhatIf first to preview the effect.' },
];

export interface StartPath {
  id: string;
  name: string;
  who: string;
  modules: number[];
  note: string;
}

export const START_PATHS: StartPath[] = [
  {
    id: 'beginner',
    name: 'Beginner route',
    who: 'New to the command line or to PowerShell.',
    modules: [3, 4, 5, 6, 7],
    note: 'Start at module 3 and leave the Windows internals modules for later. They are fascinating, but you do not need them to be productive.',
  },
  {
    id: 'admin',
    name: 'Admin fast track',
    who: 'You manage Windows machines and want results this week.',
    modules: [3, 5, 8, 10, 11, 12, 13, 14],
    note: 'Skim 3 and 5 for the pipeline, then go straight to files and registry, scripts, remoting, Active Directory, Group Policy and toolmaking.',
  },
  {
    id: 'security',
    name: 'Security route',
    who: 'You want the defender and attacker view of PowerShell.',
    modules: [1, 2, 3, 5, 15, 16],
    note: 'Learn how Windows runs code, the pipeline basics, then the offensive and defensive modules. Only practise on machines you own or are authorised to test.',
  },
];
