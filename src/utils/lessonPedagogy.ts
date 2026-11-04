import { KEY_TERM_DEFINITIONS } from '../data/keyTermDefinitions';
import { GLOSSARY } from '../data/glossary';
import { COMMANDS } from '../data/commands';
import {
  Lesson,
  Chapter,
  LessonFlowchartData,
  FlowchartStageNode,
  ObjectStructureBlueprint,
} from '../types';

export interface PlainEnglishTermExplanation {
  term: string;
  plainEnglish: string;
}

export interface SyntaxRuleHelp {
  token: string;
  meaning: string;
}

const BEGINNER_TERM_LEXICON: Record<string, string> = {
  'windows nt':
    'The modern 32/64-bit operating system engine ("New Technology") created in 1993 that powers both Windows 11 and Windows Server 2025.',
  'kernel convergence':
    'The fact that desktop Windows (10/11) and datacenter Windows Server share the exact same core operating system brain (ntoskrnl.exe).',
  'active directory':
    'Microsoftâ€™s central database for an organizationâ€™s computers, user accounts, passwords, and security groups.',
  'least privilege':
    'The safety rule that every user or program should only have the minimum permissions needed to do its current job, never full Admin rights by default.',
  uac:
    'User Account Control: the security gatekeeper that keeps your Administrator power locked away until you explicitly approve an elevation prompt.',
  wsl2:
    'Windows Subsystem for Linux 2: a lightweight virtual machine built into Windows that lets you run a real Linux kernel side-by-side with PowerShell.',
  process:
    'A living container in memory created when you launch a program. It holds the programâ€™s memory space, security badge (token), and open file handles.',
  pid:
    'Process Identifier: a unique ID number (like a license plate) that Windows assigns to each running program while it is alive.',
  thread:
    'A worker inside a process that actually executes instructions on the CPU. One process can have many threads working in parallel.',
  handle:
    'A numbered claim ticket in a processâ€™s private table that points to a protected kernel resource like an open file, registry key, or another process.',
  token:
    'Access Token: a digital ID badge attached to a process that lists who started it, which groups they belong to, and what privileges they hold.',
  'virtual memory':
    'An illusion created by the CPU and OS where every program thinks it has its own private, continuous stretch of RAM, isolated from all other programs.',
  '4 kb':
    'The standard 4,096-byte building block ("page") that Windows uses to slice up and manage memory between RAM chips and the disk pagefile.',
  pagefile:
    'A hidden file on your hard drive (C:\\pagefile.sys) where Windows parks inactive memory pages when physical RAM gets crowded.',
  'ring 3':
    'User Mode: the restricted CPU safety zone where your normal apps and PowerShell run. Apps here cannot touch hardware or other processes directly.',
  'ring 0':
    'Kernel Mode: the unrestricted CPU master zone where ntoskrnl.exe and hardware drivers run with total control over memory and hardware.',
  ntdll:
    'NTDLL.DLL: the official border-crossing bridge DLL in User Mode that translates application requests into low-level CPU system calls into the Kernel.',
  syscall:
    'System Call: the controlled transition where a User Mode program asks the Kernel (Ring 0) to perform a privileged action like reading a file or allocating memory.',
  hal:
    'Hardware Abstraction Layer: the translator layer in the kernel that lets Windows run on different motherboards and CPUs without rewriting drivers.',
  lsass:
    'Local Security Authority Subsystem Service (lsass.exe): the high-value Windows process that verifies logins and holds active authentication credentials in memory.',
  svchost:
    'Service Host (svchost.exe): a shared container process that runs background Windows DLL services (like DNS Client or Windows Update).',
  mbr:
    'Master Boot Record: the legacy 1980s partitioning scheme stored in the very first 512 bytes (Sector 0) of a disk, limited to 4 partitions and 2 TB.',
  gpt:
    'GUID Partition Table: the modern UEFI partitioning standard supporting 128 partitions, disks vastly larger than 2 TB, and backup recovery headers.',
  uefi:
    'Unified Extensible Firmware Interface: the modern motherboard firmware that replaced legacy 16-bit BIOS and verifies digital signatures via Secure Boot.',
  'secure boot':
    'A UEFI firmware defense that refuses to boot any operating system bootloader unless it carries a trusted cryptographic digital signature.',
  cmdlet:
    'Pronounced "command-let": a native PowerShell command built on .NET that always follows the Verb-SingularNoun naming rule (like Get-Process or Stop-Service).',
  '.net':
    'Microsoftâ€™s software framework and runtime engine (CLR) that sits underneath PowerShell and provides live, structured objects instead of plain text.',
  'get-member':
    'The X-ray vision cmdlet (alias gm) that reveals an objectâ€™s exact .NET class name, its data Properties, and its action Methods.',
  'get-help':
    'PowerShellâ€™s built-in manual system that shows syntax, parameter details, and copy-ready code examples (-Examples) right in your terminal.',
  'get-command':
    'PowerShellâ€™s discovery search engine (alias gcm) that finds commands by wildcard name, Verb, Noun, or Module.',
  object:
    'A live package of structured data in memory that has Properties (facts about it, like Name or CPU) and Methods (actions it can perform, like .Kill()).',
  property:
    'A named piece of data inside an object, like a column on an ID card (for example, $proc.Id or $file.Length).',
  method:
    'A built-in action attached to an object that always ends with parentheses () when you call it, like $service.Stop() or $text.ToUpper().',
  pscustomobject:
    '[PSCustomObject]@{ ... }: the clean, high-speed way to build your own structured objects with custom property names in PowerShell.',
  byvalue:
    'Parameter Binding ByValue: when a command accepts an entire piped object automatically because its .NET data type matches what the parameter expects.',
  bypropertyname:
    'Parameter Binding ByPropertyName: when a command matches a property inside the piped object (like .Name or .Id) to a parameter with that exact same name.',
  securestring:
    '[System.Security.SecureString]: a protected memory container that keeps passwords and secrets masked instead of sitting in plain-text variables.',
  'filter left':
    'The golden performance rule: filter data as early as possible at the source (using -Filter) before sending thousands of objects down the pipeline.',
  'format right':
    'The golden display rule: put Format-Table or Format-List at the very end of your pipeline because formatting converts real objects into screen-drawing instructions.',
  psprovider:
    'An adapter built into PowerShell that lets you navigate the Windows Registry (HKLM:), Certificates (Cert:), and Active Directory (AD:) just like file folders.',
  psdrive:
    'A drive letter or named mount point (like C:, Env:, HKLM:, or Variable:) exposed by a PSProvider so you can use cd and Get-ChildItem inside it.',
  ifindex:
    'InterfaceIndex: the unique number Windows assigns to each physical or virtual network card (found via Get-NetAdapter).',
  'execution policy':
    'A safety seatbelt (like RemoteSigned or Restricted) that prevents accidental launching of untrusted .ps1 scripts, not a security boundary against attackers.',
  winrm:
    'Windows Remote Management: Microsoftâ€™s WS-Management protocol (ports 5985 HTTP / 5986 HTTPS) that powers encrypted PowerShell remoting across servers.',
  'double-hop':
    'The Kerberos authentication limit where credentials sent from Machine A to Remote Server B cannot automatically hop a second time to File Server C without delegation or CredSSP.',
  fgpp:
    'Fine-Grained Password Policy: an Active Directory feature that lets you enforce stricter password rules on privileged Admin groups than on regular users.',
  rsop:
    'Resultant Set of Policy: a diagnostic report showing the final winning Group Policy settings on a machine after all site, domain, and OU policies are combined.',
  splatting:
    'Passing a hashtable of parameters (@params) into a cmdlet so long 10-parameter commands stay clean, vertical, and easy to read.',
  cmdletbinding:
    '[CmdletBinding()]: the attribute that upgrades a custom PowerShell function into an Advanced Function supporting -Verbose, -ErrorAction, and -WhatIf.',
  adsisearcher:
    'The built-in .NET [adsisearcher] type accelerator that lets ethical hackers and admins query Active Directory over LDAP without installing RSAT modules.',
  spn:
    'Service Principal Name: an Active Directory identifier linking a service (like SQL or IIS) to a domain service account, often targeted in Kerberoasting.',
  amsi:
    'Antimalware Scan Interface (amsi.dll): the Windows inspection hook that scans PowerShell code in memory right before the engine executes it, even after Base64 decoding.',
  iex:
    'Invoke-Expression (alias IEX): a cmdlet that executes a text string as live PowerShell code, frequently abused in fileless download cradles.',
  '4104':
    'Event ID 4104 (Script Block Logging): the forensic Windows Event Log record that captures the full, de-obfuscated text of suspicious or all PowerShell code blocks.',
  clm:
    'Constrained Language Mode: a hardened PowerShell lockdown mode (enforced via WDAC/AppLocker) that blocks arbitrary .NET APIs, C# compilation, and COM abuse.',
  jea:
    'Just Enough Administration: a PowerShell Remoting security architecture that gives delegated operators access to specific approved commands without granting them full Admin rights.',
};

const normalise = (value: string) => value.toLowerCase().replace(/\(.*?\)/g, '').replace(/[^a-z0-9\- ]+/g, ' ').replace(/\s+/g, ' ').trim();

const GLOSSARY_BY_TERM = new Map(GLOSSARY.map((g) => [normalise(g.term), g.definition]));
const PURPOSE_BY_CMDLET = new Map(COMMANDS.map((c) => [c.name.toLowerCase(), c.purpose]));

/**
 * Plain-English meaning for each key term. Only real definitions are used (glossary, lexicon, cmdlet library).
 * A term with no real definition is left out rather than padded with filler.
 */
export function extractPlainEnglishKeyTerms(lesson: Lesson): PlainEnglishTermExplanation[] {
  const results: PlainEnglishTermExplanation[] = [];

  for (const rawTerm of lesson.keyTerms) {
    const key = normalise(rawTerm);
    const lexiconKey = Object.keys(BEGINNER_TERM_LEXICON).find((k) => key === k || key.split(' ').includes(k));
    const meaning =
      KEY_TERM_DEFINITIONS[rawTerm] ??
      GLOSSARY_BY_TERM.get(key) ??
      (lexiconKey ? BEGINNER_TERM_LEXICON[lexiconKey] : undefined) ??
      PURPOSE_BY_CMDLET.get(rawTerm.toLowerCase());
    if (meaning) results.push({ term: rawTerm, plainEnglish: meaning });
  }

  return results;
}
export function decodeSyntaxForBeginners(syntax: string): SyntaxRuleHelp[] {
  const rules: SyntaxRuleHelp[] = [];
  if (syntax.includes('[[-')) {
    rules.push({
      token: '[[-Name] <Type>]',
      meaning:
        'Optional & Positional: Because both the whole parameter and the parameter name are inside square brackets [ ], you can omit it or pass the value without typing the parameter name.',
    });
  } else if (syntax.includes('[-')) {
    rules.push({
      token: '[-Parameter <Type>]',
      meaning:
        'Optional Parameter: Anything wrapped in outer square brackets [ ] is optional, the command will still run if you leave it out.',
    });
  }

  if (syntax.includes('[]>') || syntax.includes('String[]') || syntax.includes('Object[]')) {
    rules.push({
      token: '<Type[]>',
      meaning:
        'Accepts a List (Array): The empty square brackets [] right after the type name mean you can pass multiple values separated by commas (e.g., "bits", "wuauserv").',
    });
  }

  if (syntax.includes('<String>') || syntax.includes('<Int') || syntax.includes('<UInt')) {
    rules.push({
      token: '<DataType>',
      meaning:
        'Expected Value Type: Angle brackets < > tell you what kind of value to supply (like <String> for text or <Int32> for a whole number). Never type the < > symbols themselves.',
    });
  }

  if (rules.length === 0) {
    rules.push({
      token: 'Verb-Noun -Parameter Value',
      meaning:
        'Standard Command Pattern: Start with the Verb-Noun command name, followed by a dash (-) parameter switch and the value you want to pass.',
    });
  }

  return rules;
}

/**
 * Dynamically builds the interactive SVG Pipeline Flowchart and Object-Oriented
 * Data Structure Blueprint for any lesson in the academy.
 */
export function buildLessonFlowchartData(
  lesson: Lesson,
  chapter?: Chapter
): LessonFlowchartData {
  const track = chapter?.track || 'Advanced Object Pipeline';

  // 1. Track- & Lesson-Aware Curated Blueprints + Dynamic Synthesis
  if (track === 'Windows Internals') {
    if (lesson.id === '1-2' || lesson.slug.includes('processes')) {
      return {
        pipelineTitle: 'Windows Process Creation & Thread Execution Flow',
        pipelineSubtitle:
          'How launching an executable on disk becomes a living Kernel EPROCESS with threads and handles',
        stages: [
          {
            id: 'stage-1',
            stepNumber: 1,
            label: 'Passive Image on Disk',
            sublabel: 'PE Executable (.exe)',
            commandOrMechanism: 'C:\\Windows\\System32\\notepad.exe',
            inputType: 'Static File Bytes',
            outputType: 'Section Object',
            plainEnglishSummary:
              'On disk, a program is just inert bytes sitting in a file. It has no PID, uses zero RAM, and cannot run anything until Windows loads it.',
            kind: 'source',
          },
          {
            id: 'stage-2',
            stepNumber: 2,
            label: 'Kernel EPROCESS Container',
            sublabel: 'PID + Virtual Address Space',
            commandOrMechanism: 'NtCreateUserProcess()',
            inputType: 'Section Object',
            outputType: 'EPROCESS (PID Assigned)',
            plainEnglishSummary:
              'The Windows Kernel creates a private EPROCESS container, assigns a unique Process ID (PID), and sets up an isolated Virtual Address Space.',
            kind: 'transform',
          },
          {
            id: 'stage-3',
            stepNumber: 3,
            label: 'Access Token & Handle Table',
            sublabel: 'Security Badge Attached',
            commandOrMechanism: 'Token Inheritance (Medium / High IL)',
            inputType: 'Parent Token',
            outputType: 'Process Security Context',
            plainEnglishSummary:
              'The new process inherits a copy of its parentâ€™s Access Token (defining what it is allowed to touch) and initializes its private Handle Table.',
            kind: 'security',
          },
          {
            id: 'stage-4',
            stepNumber: 4,
            label: 'Thread 0 CPU Execution',
            sublabel: 'System.Diagnostics.Process',
            commandOrMechanism: 'Get-Process -Id $PID',
            inputType: 'ETHREAD Stack',
            outputType: 'Live .NET Process Object',
            plainEnglishSummary:
              'The first worker thread starts executing CPU instructions, and PowerShell can now inspect the live process as a rich .NET object.',
            kind: 'output',
          },
        ],
        objectBlueprint: {
          typeName: 'System.Diagnostics.Process',
          friendlyTitle: 'Live Windows Process Object Blueprint',
          layerOrNamespace: 'Kernel EPROCESS â†” .NET Diagnostics Layer',
          plainEnglishOverview:
            'When you run Get-Process, PowerShell does not give you text, it wraps the live Windows kernel process into this structured .NET object.',
          members: [
            {
              name: 'Id',
              kind: 'property',
              dataType: 'System.Int32',
              sampleValue: '4812',
              plainEnglish: 'The unique Process ID (PID) assigned by the Windows kernel while this program is running.',
            },
            {
              name: 'ProcessName',
              kind: 'property',
              dataType: 'System.String',
              sampleValue: '"pwsh"',
              plainEnglish: 'The friendly executable name without the .exe extension.',
            },
            {
              name: 'HandleCount',
              kind: 'property',
              dataType: 'System.Int32',
              sampleValue: '642',
              plainEnglish: 'How many kernel claim tickets (open files, registry keys, threads) this process currently holds.',
            },
            {
              name: 'WorkingSet64',
              kind: 'property',
              dataType: 'System.Int64',
              sampleValue: '94371840 (90 MB)',
              plainEnglish: 'The exact amount of physical RAM (in bytes) currently mapped to this processâ€™s 4 KB pages.',
            },
            {
              name: 'Path',
              kind: 'property',
              dataType: 'System.String',
              sampleValue: '"C:\\Program Files\\PowerShell\\7\\pwsh.exe"',
              plainEnglish: 'The full disk path where the executable launched from, critical for spotting malware imposters.',
            },
            {
              name: 'Kill()',
              kind: 'method',
              dataType: 'void',
              sampleValue: '$proc.Kill()',
              plainEnglish: 'Action method that asks the Windows kernel to immediately terminate the process.',
            },
          ],
        },
      };
    }

    if (lesson.id === '1-3' || lesson.slug.includes('memory')) {
      return {
        pipelineTitle: 'Virtual Memory Translation & 4 KB Page Lifecycle',
        pipelineSubtitle:
          'How the Memory Manager translates private virtual addresses to physical RAM or pagefile.sys',
        stages: [
          {
            id: 'stage-1',
            stepNumber: 1,
            label: 'App Requests Memory',
            sublabel: 'Private Virtual Address',
            commandOrMechanism: '0x00007FF6A1B00000',
            inputType: 'Virtual Pointer',
            outputType: 'Page Table Lookup',
            plainEnglishSummary:
              'Every process sees its own private virtual memory map and asks for an address without knowing where physical RAM chips are located.',
            kind: 'source',
          },
          {
            id: 'stage-2',
            stepNumber: 2,
            label: 'MMU & Page Table Mapping',
            sublabel: '4 KB Page Granularity',
            commandOrMechanism: 'CPU MMU + Kernel Page Tables',
            inputType: 'Page Table Lookup',
            outputType: 'Valid / PageFault Bit',
            plainEnglishSummary:
              'The CPU Memory Management Unit checks the processâ€™s Page Table to see if that 4 KB page is currently sitting in fast physical RAM.',
            kind: 'transform',
          },
          {
            id: 'stage-3',
            stepNumber: 3,
            label: 'RAM Working Set vs Pagefile',
            sublabel: 'Active vs Standby/Swapped',
            commandOrMechanism: 'C:\\pagefile.sys',
            inputType: 'Valid / PageFault Bit',
            outputType: 'Physical Frame Mapped',
            plainEnglishSummary:
              'If the page was moved to disk (pagefile.sys) to free up space, the Kernel transparently fetches the 4 KB page back into RAM.',
            kind: 'filter',
          },
          {
            id: 'stage-4',
            stepNumber: 4,
            label: 'PowerShell Memory Telemetry',
            sublabel: 'WorkingSet64 &PagedMemorySize64',
            commandOrMechanism: 'Get-Process | Select-Object Name, WorkingSet64',
            inputType: 'Physical Frame Mapped',
            outputType: 'Memory Diagnostics Object',
            plainEnglishSummary:
              'You can inspect any processâ€™s exact physical RAM footprint (WorkingSet64) and pagefile usage directly in PowerShell.',
            kind: 'output',
          },
        ],
        objectBlueprint: {
          typeName: 'Win32_OperatingSystem (CIM Memory Object)',
          friendlyTitle: 'Kernel Memory & Pagefile Telemetry Object',
          layerOrNamespace: 'ROOT\\CIMV2 Â· Memory Manager',
          plainEnglishOverview:
            'Querying Get-CimInstance Win32_OperatingSystem exposes the kernelâ€™s real-time physical RAM and virtual memory counters.',
          members: [
            {
              name: 'TotalVisibleMemorySize',
              kind: 'property',
              dataType: 'System.UInt64',
              sampleValue: '16777216 (16 GB)',
              plainEnglish: 'Total physical RAM (in kilobytes) installed and usable by the Windows kernel.',
            },
            {
              name: 'FreePhysicalMemory',
              kind: 'property',
              dataType: 'System.UInt64',
              sampleValue: '6421504 (~6.1 GB)',
              plainEnglish: 'Physical RAM currently free and ready for immediate 4 KB page allocation.',
            },
            {
              name: 'TotalVirtualMemorySize',
              kind: 'property',
              dataType: 'System.UInt64',
              sampleValue: '19660800',
              plainEnglish: 'Combined commit limit (Physical RAM + disk pagefile.sys capacity).',
            },
            {
              name: 'FreeVirtualMemory',
              kind: 'property',
              dataType: 'System.UInt64',
              sampleValue: '10124800',
              plainEnglish: 'Remaining virtual commit space before Windows runs out of memory.',
            },
          ],
        },
      };
    }

    // Default Windows Internals Flowchart (Ring 3 -> Ring 0 / Boot / Kernel)
    return {
      pipelineTitle: 'User Mode (Ring 3) to Kernel Mode (Ring 0) Execution Flow',
      pipelineSubtitle:
        'How a command in PowerShell crosses NTDLL.DLL safely into the Windows NT Kernel Executive',
      stages: [
        {
          id: 'stage-1',
          stepNumber: 1,
          label: 'PowerShell / User App',
          sublabel: 'Ring 3 (User Mode)',
          commandOrMechanism: lesson.commandBreakdowns[0]?.cmdlet || 'Get-ComputerInfo',
          inputType: 'User Command',
          outputType: '.NET / Win32 API Call',
          plainEnglishSummary:
            'Your command starts in Ring 3 (User Mode), where applications are isolated and forbidden from touching hardware directly.',
          kind: 'source',
        },
        {
          id: 'stage-2',
          stepNumber: 2,
          label: 'Subsystem & NTDLL.DLL',
          sublabel: 'The Border Checkpoint',
          commandOrMechanism: 'ntdll.dll â†’ syscall instruction',
          inputType: '.NET / Win32 API Call',
          outputType: 'Kernel Syscall Trap',
          plainEnglishSummary:
            'Win32 DLLs hand the request to NTDLL.DLL, which loads the system call number and executes the CPU syscall instruction to cross into Ring 0.',
          kind: 'transform',
        },
        {
          id: 'stage-3',
          stepNumber: 3,
          label: 'NT Kernel Executive',
          sublabel: 'Ring 0 (ntoskrnl.exe)',
          commandOrMechanism: 'Security Reference Monitor + Object Manager',
          inputType: 'Kernel Syscall Trap',
          outputType: 'Validated Kernel Handle',
          plainEnglishSummary:
            'Inside Ring 0, ntoskrnl.exe verifies your Access Token permissions before touching hardware drivers or system structures.',
          kind: 'security',
        },
        {
          id: 'stage-4',
          stepNumber: 4,
          label: 'Structured .NET Output',
          sublabel: 'Returned to PowerShell',
          commandOrMechanism: 'PSCustomObject / CIM Instance',
          inputType: 'Validated Kernel Handle',
          outputType: 'Live .NET Object',
          plainEnglishSummary:
            'The kernel returns the result across NTDLL back to PowerShell, which wraps it into a structured .NET object with properties you can query.',
          kind: 'output',
        },
      ],
      objectBlueprint: {
        typeName: 'System.Security.Principal.WindowsIdentity',
        friendlyTitle: 'Windows Security Access Token & Identity Object',
        layerOrNamespace: 'System.Security.Principal (.NET / LSA)',
        plainEnglishOverview:
          'Every PowerShell session carries an Access Token object that tells the Windows Kernel who you are and whether your session is elevated.',
        members: [
          {
            name: 'Name',
            kind: 'property',
            dataType: 'System.String',
            sampleValue: '"WORKSTATION\\izaz"',
            plainEnglish: 'The domain or machine username attached to the current process token.',
          },
          {
            name: 'User',
            kind: 'property',
            dataType: 'SecurityIdentifier (SID)',
            sampleValue: 'S-1-5-21-...-1001',
            plainEnglish: 'The immutable Security Identifier (SID) that Windows uses internally instead of your display name.',
          },
          {
            name: 'Groups',
            kind: 'property',
            dataType: 'IdentityReferenceCollection',
            sampleValue: 'Administrators, Users, High Mandatory Level',
            plainEnglish: 'The list of security groups and integrity levels active inside this token.',
          },
          {
            name: 'IsAuthenticated',
            kind: 'property',
            dataType: 'System.Boolean',
            sampleValue: 'True',
            plainEnglish: 'Indicates whether LSASS verified this identity during logon.',
          },
          {
            name: 'GetCurrent()',
            kind: 'method',
            dataType: 'WindowsIdentity',
            sampleValue: '[Security.Principal.WindowsIdentity]::GetCurrent()',
            plainEnglish: 'Static method that fetches the live security token of your current PowerShell process.',
          },
        ],
      },
    };
  }

  if (track === 'PowerShell for Ethical Hackers') {
    const isBlueTeam = lesson.chapterId === 'chapter-16';
    return {
      pipelineTitle: isBlueTeam
        ? 'Blue Team Telemetry, AMSI Inspection & Event ID 4104 Pipeline'
        : 'Red Team Native Recon & In-Memory Inspection Flow',
      pipelineSubtitle: isBlueTeam
        ? 'How PowerShell de-obfuscates scripts in memory, passes them to AMSI, and records Event ID 4104'
        : 'How native .NET [adsisearcher] queries Active Directory and how AMSI intercepts payloads in memory',
      stages: [
        {
          id: 'stage-1',
          stepNumber: 1,
          label: isBlueTeam ? 'Incoming Script / Payload' : 'Native .NET / ADSI Query',
          sublabel: isBlueTeam ? 'Plain or -EncodedCommand' : 'Zero External Binaries',
          commandOrMechanism:
            lesson.commandBreakdowns[0]?.cmdlet ||
            (isBlueTeam ? 'powershell.exe -enc <Base64>' : '[adsisearcher]"(servicePrincipalName=*)"'),
          inputType: isBlueTeam ? 'Obfuscated Input String' : 'LDAP Filter String',
          outputType: isBlueTeam ? 'Decoded UTF-16LE Buffer' : 'DirectorySearcher Object',
          plainEnglishSummary: isBlueTeam
            ? 'Even if an attacker encodes a command in Base64 or layers string concatenation, PowerShell must decode it in memory before it can run.'
            : 'Instead of dropping noisy third-party tools onto disk, operators use built-in .NET classes already present on every Windows machine.',
          kind: 'source',
        },
        {
          id: 'stage-2',
          stepNumber: 2,
          label: 'AMSI Memory Hook',
          sublabel: 'amsi.dll :: AmsiScanBuffer()',
          commandOrMechanism: 'AMSI Inspection Gate',
          inputType: isBlueTeam ? 'Decoded UTF-16LE Buffer' : 'ScriptBlock AST in RAM',
          outputType: 'AMSI_RESULT_CLEAN / DETECTED',
          plainEnglishSummary:
            'Right before execution, the PowerShell engine hands the unrolled, plain-text script buffer to amsi.dll so Endpoint Detection / Defender can inspect it.',
          kind: 'security',
        },
        {
          id: 'stage-3',
          stepNumber: 3,
          label: 'Script Block Logging',
          sublabel: 'Event ID 4104 Telemetry',
          commandOrMechanism: 'Microsoft-Windows-PowerShell/Operational',
          inputType: 'Executed ScriptBlock AST',
          outputType: 'EventLogRecord (EID 4104)',
          plainEnglishSummary:
            'The engine writes the full de-obfuscated code into the Windows Operational Event Log under Event ID 4104 for Blue Team threat hunters.',
          kind: 'filter',
        },
        {
          id: 'stage-4',
          stepNumber: 4,
          label: isBlueTeam ? 'Forensic Threat Hunting' : 'Structured Recon Output',
          sublabel: isBlueTeam ? 'Get-WinEvent -FilterHashtable' : 'SearchResultCollection',
          commandOrMechanism: isBlueTeam
            ? 'Get-WinEvent -FilterHashtable @{LogName="..."; Id=4104}'
            : '$searcher.FindAll() | Select-Object Properties',
          inputType: 'EventLogRecord (EID 4104)',
          outputType: 'Actionable Security Objects',
          plainEnglishSummary: isBlueTeam
            ? 'Blue Team responders query Event ID 4104 and 4103 as structured objects to reconstruct every command an attacker ran.'
            : 'The query returns structured AD object properties (like samaccountname and serviceprincipalname) so defenders know which accounts need hardening.',
          kind: 'output',
        },
      ],
      objectBlueprint: {
        typeName: isBlueTeam
          ? 'System.Diagnostics.Eventing.Reader.EventLogRecord'
          : 'System.DirectoryServices.DirectorySearcher',
        friendlyTitle: isBlueTeam
          ? 'Forensic Event Log Record (Event ID 4104)'
          : 'Native Active Directory Searcher ([adsisearcher])',
        layerOrNamespace: isBlueTeam
          ? 'System.Diagnostics.Eventing.Reader'
          : 'System.DirectoryServices (.NET LDAP Client)',
        plainEnglishOverview: isBlueTeam
          ? 'Each event returned by Get-WinEvent is a rich object containing the timestamp, User SID, Process ID, and the full de-obfuscated script text.'
          : 'The [adsisearcher] type accelerator creates this .NET object to query Domain Controllers over LDAP using your current domain user token.',
        members: isBlueTeam
          ? [
              {
                name: 'Id',
                kind: 'property',
                dataType: 'System.Int32',
                sampleValue: '4104',
                plainEnglish: 'The Event ID number (4104 = Script Block Logging, 4103 = Module/Pipeline Logging, 4625 = Failed Logon).',
              },
              {
                name: 'TimeCreated',
                kind: 'property',
                dataType: 'System.DateTime',
                sampleValue: '2026-11-03 23:14:09',
                plainEnglish: 'Exact timestamp when the PowerShell engine compiled and logged the script block.',
              },
              {
                name: 'UserId',
                kind: 'property',
                dataType: 'SecurityIdentifier',
                sampleValue: 'S-1-5-21-...-1104',
                plainEnglish: 'The exact user SID whose PowerShell process executed the script block.',
              },
              {
                name: 'Message',
                kind: 'property',
                dataType: 'System.String',
                sampleValue: '"Creating Scriptblock text (1 of 1): Invoke-Mimikatz..."',
                plainEnglish: 'Contains the complete, decoded plain-text script code that ran in memory.',
              },
              {
                name: 'ToXml()',
                kind: 'method',
                dataType: 'System.String',
                sampleValue: '$event.ToXml()',
                plainEnglish: 'Exports the raw forensic XML structure including ScriptBlockId and Path.',
              },
            ]
          : [
              {
                name: 'Filter',
                kind: 'property',
                dataType: 'System.String',
                sampleValue: '"(&(objectCategory=user)(servicePrincipalName=*))"',
                plainEnglish: 'The LDAP query string that tells the Domain Controller which objects to return.',
              },
              {
                name: 'SearchRoot',
                kind: 'property',
                dataType: 'DirectoryEntry',
                sampleValue: '"LDAP://DC=corp,DC=local"',
                plainEnglish: 'The Active Directory domain or Organizational Unit where the search starts.',
              },
              {
                name: 'PageSize',
                kind: 'property',
                dataType: 'System.Int32',
                sampleValue: '1000',
                plainEnglish: 'Prevents LDAP results from truncating at 1,000 objects in large enterprise domains.',
              },
              {
                name: 'FindAll()',
                kind: 'method',
                dataType: 'SearchResultCollection',
                sampleValue: '$searcher.FindAll()',
                plainEnglish: 'Executes the LDAP query against the Domain Controller and returns all matching directory objects.',
              },
            ],
      },
    };
  }

  // Synthesize dynamic pipeline stages from lesson's commandBreakdowns and codeExamples
  const primaryCmdlet =
    lesson.commandBreakdowns[0]?.cmdlet ||
    (track === 'Systems & Fleet Automation' ? 'Get-CimInstance' : 'Get-Process');
  const secondaryCmdlet =
    lesson.commandBreakdowns[1]?.cmdlet ||
    (lesson.slug.includes('format')
      ? 'Format-Table -AutoSize'
      : lesson.slug.includes('where') || lesson.slug.includes('filter')
      ? 'Where-Object { $_.Status -eq "Running" }'
      : 'Select-Object -Property Name, Id');

  return {
    pipelineTitle: `Live .NET Object Pipeline Flow: ${lesson.title}`,
    pipelineSubtitle:
      'See how PowerShell passes structured .NET objects from stage to stage instead of fragile text lines',
    stages: [
      {
        id: 'stage-1',
        stepNumber: 1,
        label: '1. Source Producer Cmdlet',
        sublabel: 'Queries OS / Provider',
        commandOrMechanism: primaryCmdlet,
        inputType: 'Parameter / Filter Input',
        outputType: 'Live .NET Object Stream',
        plainEnglishSummary: `${primaryCmdlet} queries Windows and emits full, structured .NET objects (with dozens of hidden properties and methods) one at a time into the pipeline.`,
        kind: 'source',
      },
      {
        id: 'stage-2',
        stepNumber: 2,
        label: '2. Parameter Binding Gate',
        sublabel: 'ByValue â†’ ByPropertyName',
        commandOrMechanism: 'Pipeline Binder (|)',
        inputType: 'Live .NET Object Stream',
        outputType: 'Bound Pipeline Object ($_)',
        plainEnglishSummary:
          'When an object crosses the pipe symbol (|), PowerShell first checks if the next command accepts its exact .NET Type (ByValue), or matches a property name like .Name or .Id (ByPropertyName).',
        kind: 'transform',
      },
      {
        id: 'stage-3',
        stepNumber: 3,
        label: '3. Filter, Transform or Act',
        sublabel: 'Preserves Object Integrity',
        commandOrMechanism: secondaryCmdlet,
        inputType: 'Bound Pipeline Object ($_)',
        outputType: 'Filtered / Projected Objects',
        plainEnglishSummary:
          'Each object is tested, transformed, or acted upon in memory. No text parsing or regex splitting is needed because properties are accessed directly by name.',
        kind: 'filter',
      },
      {
        id: 'stage-4',
        stepNumber: 4,
        label: '4. Output / Formatting Engine',
        sublabel: 'Format Right at the Very End',
        commandOrMechanism: 'Out-Default / Export-Csv / Action',
        inputType: 'Filtered / Projected Objects',
        outputType: 'Console Table or Structured File',
        plainEnglishSummary:
          'Only at the very end of the pipeline does PowerShell render the surviving objects to your screen, or export their properties cleanly to CSV, JSON, or HTML.',
        kind: 'output',
      },
    ],
    objectBlueprint: {
      typeName:
        track === 'Systems & Fleet Automation'
          ? 'Microsoft.Management.Infrastructure.CimInstance'
          : 'System.Management.Automation.PSObject',
      friendlyTitle: `Live Object Structure in ${lesson.id} (${primaryCmdlet})`,
      layerOrNamespace: 'System.Management.Automation (.NET CLR)',
      plainEnglishOverview:
        'Every item flowing through this lessonâ€™s commands is a self-describing package containing Metadata (TypeName), Properties (facts you can read), and Methods (actions you can trigger).',
      members: [
        {
          name: 'PSTypeNames[0]',
          kind: 'property',
          dataType: 'System.String',
          sampleValue: `"Selected.${primaryCmdlet.replace('-', '.')}"`,
          plainEnglish:
            'The exact .NET blueprint name (revealed by Get-Member) that determines how ByValue parameter binding treats this object.',
        },
        {
          name: lesson.commandBreakdowns[0]?.parameters[0]?.name.replace(/^-/, '') || 'Name',
          kind: 'property',
          dataType: lesson.commandBreakdowns[0]?.parameters[0]?.type || 'System.String',
          sampleValue: '"wuauserv" / "SRV-CORE01"',
          plainEnglish:
            lesson.commandBreakdowns[0]?.parameters[0]?.description ||
            'Primary identifier property used for filtering and ByPropertyName pipeline binding.',
        },
        {
          name: lesson.commandBreakdowns[0]?.parameters[1]?.name.replace(/^-/, '') || 'Status',
          kind: 'property',
          dataType: lesson.commandBreakdowns[0]?.parameters[1]?.type || 'System.Object',
          sampleValue: '"Running" / True',
          plainEnglish:
            lesson.commandBreakdowns[0]?.parameters[1]?.description ||
            'Live state property you can inspect with Where-Object { $_.Status -eq ... }.',
        },
        {
          name: 'CalculatedProperty',
          kind: 'noteproperty',
          dataType: 'ScriptProperty',
          sampleValue: '@{Name="SizeMB"; Expression={...}}',
          plainEnglish:
            'You can attach new custom properties on the fly using Select-Object or [PSCustomObject]@{}.',
        },
        {
          name: 'GetType()',
          kind: 'method',
          dataType: 'System.Type',
          sampleValue: '$obj.GetType().FullName',
          plainEnglish:
            'Built-in .NET method available on every object in PowerShell to inspect its exact underlying class.',
        },
      ],
    },
  };
}
