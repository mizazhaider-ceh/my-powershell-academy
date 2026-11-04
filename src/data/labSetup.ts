import { LAB_ENVIRONMENT as LAB } from './labEnvironment';

export interface LabStep {
  title: string;
  body: string[];
  code?: string;
  tip?: string;
}

export const LAB_REQUIREMENTS: { label: string; value: string; why: string }[] = [
  { label: 'Memory', value: '16 GB RAM', why: 'The three machines use about 8 GB between them, and Windows itself needs the rest.' },
  { label: 'Disk', value: '150 GB free, SSD', why: 'Each machine is a large file. An SSD keeps boot and patching bearable.' },
  { label: 'CPU', value: 'Virtualisation switched on', why: 'Look for Intel VT-x or AMD-V in your BIOS or UEFI settings if the hypervisor refuses to start.' },
  { label: 'Cost', value: 'Free', why: 'Microsoft publishes evaluation versions for testing. Check the current terms and time limits on their download page before you start.' },
];

export const LAB_STEPS: LabStep[] = [
  {
    title: 'Choose a hypervisor',
    body: [
      'A hypervisor runs virtual computers inside your real one. Hyper-V is built into Windows Pro, Enterprise and Education. If you have Windows Home, use VirtualBox or VMware Workstation instead, because they run on any edition.',
      'The lessons assume Hyper-V commands, but every step maps onto another hypervisor: make three machines, join them to one private network, and take snapshots.',
    ],
    code: 'Enable-WindowsOptionalFeature -Online -FeatureName Microsoft-Hyper-V-All\n# Restart when prompted. Run this in an administrator window.',
    tip: 'This changes your PC, so it is one of the few places where "Run as administrator" is correct.',
  },
  {
    title: 'Download the evaluation media',
    body: [
      'Get Windows Server and Windows 11 from the Microsoft Evaluation Center. Download the Server ISO once and use it for both DC01 and SRV-CORE01.',
      'Evaluation copies are time-limited and meant for testing, not for real work. The length of the trial has changed over the years, so read it on the download page rather than trusting a number from a tutorial.',
    ],
  },
  {
    title: 'Create the private network',
    body: [
      `Make one internal switch named ${LAB.switchName}. An internal switch lets your lab machines talk to each other and to your PC, and it keeps them away from your real network.`,
    ],
    code: `New-VMSwitch -Name ${LAB.switchName} -SwitchType Internal`,
    tip: 'An internal switch has no route to the internet. That is deliberate. Download updates and tools before you disconnect, or add a second adapter later.',
  },
  {
    title: 'Create the three machines',
    body: ['Create each machine with the memory and disk shown in the diagram above. Use Generation 2, attach the ISO, and connect the network adapter to the lab switch.'],
    code: `New-VM -Name DC01 -Generation 2 -MemoryStartupBytes 2GB -NewVHDPath "$env:PUBLIC\\Documents\\Hyper-V\\DC01.vhdx" -NewVHDSize 40GB -SwitchName ${LAB.switchName}`,
  },
  {
    title: 'Give each machine its address',
    body: ['Set static addresses inside each machine so every lesson can use the same names and numbers. This example is for DC01, run inside that machine.'],
    code: `New-NetIPAddress -InterfaceAlias 'Ethernet' -IPAddress ${LAB.hosts[0].ip} -PrefixLength ${LAB.prefixLength}\nSet-DnsClientServerAddress -InterfaceAlias 'Ethernet' -ServerAddresses ${LAB.dnsServer}`,
    tip: 'Your adapter may not be called Ethernet. Run Get-NetAdapter to see its real name.',
  },
  {
    title: 'Build it up through the course',
    body: [
      `Module 9 builds the Server Core machine. Module 12 promotes DC01 to a domain controller for ${LAB.domain}. You do not need the whole domain to start. Modules 3 to 8 run on your own PC.`,
    ],
  },
  {
    title: 'Snapshot before you experiment',
    body: ['A checkpoint is an undo button for the whole machine. Take one after each milestone and before anything risky.'],
    code: "Checkpoint-VM -Name DC01 -SnapshotName 'clean-install'\nRestore-VMCheckpoint -VMName DC01 -Name 'clean-install' -Confirm:$false",
    tip: 'Restoring a domain controller from a checkpoint is fine in a single-DC lab. Never do it in a real domain with several controllers.',
  },
];

export const LAB_SAFETY: string[] = [
  'Keep the lab on its private switch. Do not bridge it to a work or school network.',
  'Only run offensive-security exercises (modules 15 and 16) on these machines or on systems you own and are authorised to test.',
  'Use throwaway passwords that you do not use anywhere else, and write them in your own notes.',
  'When you are finished, delete the lab cleanly: Stop-VM, Remove-VM, then delete the disk files.',
];
