import { CommandEntry } from '../types';
import { COMMANDS_EXTRA_1 } from './commandsExtra1';
import { COMMANDS_EXTRA_2 } from './commandsExtra2';
import { COMMANDS_EXTRA_3 } from './commandsExtra3';
import { COMMANDS_EXTRA_4 } from './commandsExtra4';

const CORE_COMMANDS: CommandEntry[] = [
  {
    name: 'Get-Help',
    verb: 'Get',
    noun: 'Help',
    module: 'Microsoft.PowerShell.Core',
    purpose: 'Display offline technical documentation, syntax diagrams, parameter metadata, and verified code examples.',
    syntax: 'Get-Help [[-Name] <String>] [-Examples] [-Detailed] [-Full] [-Parameter <String>] [-Online]',
    description:
      'Get-Help is the first blade of my 3-tool Self-Reliance Pocketknife. It retrieves built-in help files for cmdlets, functions, providers, and conceptual about_ topics.',
    parameters: [
      { name: '-Name', type: 'String', required: false, position: 0, pipelineInput: 'ByValue', description: 'Specifies the name of the cmdlet or about_ topic.' },
      { name: '-Examples', type: 'SwitchParameter', required: false, pipelineInput: 'False', description: 'Skips parameter tables and displays practical real-world usage examples immediately.' },
      { name: '-Full', type: 'SwitchParameter', required: false, pipelineInput: 'False', description: 'Displays the complete help file including parameter pipeline binding rules (ByValue vs ByPropertyName).' },
      { name: '-Parameter', type: 'String', required: false, pipelineInput: 'False', description: 'Displays documentation and pipeline rules for a single specified parameter.' },
      { name: '-Online', type: 'SwitchParameter', required: false, pipelineInput: 'False', description: 'Opens the latest Microsoft Learn reference page in your default web browser.' },
    ],
    practicalExamples: [
      {
        title: 'Jump Straight to Practical Code Examples',
        description: 'View copy-pasteable examples for any unfamiliar cmdlet.',
        code: 'Get-Help Get-ChildItem -Examples',
        illustrativeOutput: 'NAME\n    Get-ChildItem\n\n-------------------------- EXAMPLE 1 --------------------------\nPS C:\\> Get-ChildItem -Path C:\\Test\n\n-------------------------- EXAMPLE 2 --------------------------\nPS C:\\> Get-ChildItem -Path C:\\Test -Filter *.txt -Recurse',
        explanation: 'My go-to habit whenever I need to check syntax on a server without touching a web browser.',
      },
      {
        title: 'Inspect Parameter Pipeline Binding Rules',
        description: 'Check whether a parameter accepts pipeline input ByValue or ByPropertyName.',
        code: 'Get-Help Get-Service -Parameter Name',
        illustrativeOutput: '-Name <String[]>\n    Specifies the service names for the services to be retrieved.\n\n    Required?                    false\n    Position?                    0\n    Accept pipeline input?       True (ByPropertyName, ByValue)\n    Accept wildcard characters?  true',
        explanation: 'Proves in 2 seconds why "wuauserv" | Get-Service works ByValue.',
      },
    ],
    commonMistakes: [
      'Expecting detailed examples on a brand-new Server Core VM before running Update-Help.',
      'Forgetting that conceptual guides begin with about_ (e.g., Get-Help about_Comparison_Operators).',
    ],
    troubleshooting: 'If Get-Help only displays a short syntax stub, open an elevated Administrator shell and run Update-Help -Force.',
    relatedCommands: ['Update-Help', 'Get-Command', 'Get-Member'],
    relatedLessonPath: '/learn/chapter-03/help-and-self-reliance',
    isEssentialPocketknife: true,
  },
  {
    name: 'Update-Help',
    verb: 'Update',
    noun: 'Help',
    module: 'Microsoft.PowerShell.Core',
    purpose: 'Download and install the latest offline help files from Microsoft for all installed modules.',
    syntax: 'Update-Help [[-Module] <String[]>] [-Force] [-Scope <String>] [-ErrorAction <ActionPreference>]',
    description:
      'Fresh Windows and Windows Server installations ship without full help files to keep the OS image small. Update-Help downloads full syntax descriptions and examples for offline use.',
    parameters: [
      { name: '-Module', type: 'String[]', required: false, position: 0, pipelineInput: 'ByPropertyName', description: 'Updates help for specified modules only.' },
      { name: '-Force', type: 'SwitchParameter', required: false, pipelineInput: 'False', description: 'Bypasses the default once-per-24-hours throttle check.' },
      { name: '-Scope', type: 'String', required: false, pipelineInput: 'False', description: 'Set to CurrentUser in PowerShell 7 to update help without needing Administrator elevation.' },
    ],
    practicalExamples: [
      {
        title: 'First-Boot Help Refresh on a New Server',
        description: 'Download all local documentation before locking down network interfaces.',
        code: 'Update-Help -Force -ErrorAction SilentlyContinue',
        illustrativeOutput: 'Updating Help for module Microsoft.PowerShell.Management...\nUpdating Help for module NetTCPIP...',
        explanation: 'Ensures Get-Help -Examples works completely offline.',
      },
    ],
    commonMistakes: [
      'Running Update-Help in a non-elevated Windows PowerShell 5.1 window and getting Access Denied.',
    ],
    troubleshooting: 'Some minor OS sub-modules do not publish downloadable help XML files; pass -ErrorAction SilentlyContinue to ignore harmless missing-XML warnings.',
    relatedCommands: ['Get-Help', 'Save-Help'],
    relatedLessonPath: '/learn/chapter-03/help-and-self-reliance',
    isEssentialPocketknife: true,
  },
  {
    name: 'Get-Command',
    verb: 'Get',
    noun: 'Command',
    module: 'Microsoft.PowerShell.Core',
    purpose: 'Discover cmdlets, functions, aliases, and executables installed on the system using verbs, nouns, or wildcards.',
    syntax: 'Get-Command [[-Name] <String[]>] [-Verb <String[]>] [-Noun <String[]>] [-Module <String[]>]',
    description:
      'The second blade of the Self-Reliance Pocketknife. Get-Command lets you search by Verb, singular Noun, Module, or wildcard (*) so you never have to memorize thousands of command names.',
    parameters: [
      { name: '-Name', type: 'String[]', required: false, position: 0, pipelineInput: 'ByValue, ByPropertyName', description: 'Searches commands by name (supports * wildcards).' },
      { name: '-Verb', type: 'String[]', required: false, pipelineInput: 'False', description: 'Filters cmdlets by approved verb (e.g., Get, Set, New, Remove, Enable).' },
      { name: '-Noun', type: 'String[]', required: false, pipelineInput: 'False', description: 'Filters cmdlets by singular noun (supports wildcards like *Firewall* or *User*).' },
      { name: '-Module', type: 'String[]', required: false, pipelineInput: 'False', description: 'Lists all commands exported by a specific module.' },
    ],
    practicalExamples: [
      {
        title: 'Find All Cmdlets That Manage Firewall Rules',
        description: 'Use wildcards on -Noun to discover unfamiliar networking commands.',
        code: 'Get-Command -Verb Get, Enable, New -Noun *Firewall*',
        illustrativeOutput: 'CommandType Name                    Version Source\n----------- ----                    ------- ------\nFunction    Enable-NetFirewallRule  2.0.0.0 NetSecurity\nFunction    Get-NetFirewallProfile  2.0.0.0 NetSecurity\nFunction    Get-NetFirewallRule     2.0.0.0 NetSecurity\nFunction    New-NetFirewallRule     2.0.0.0 NetSecurity',
        explanation: 'Reveals the exact Verb-Noun commands and the module (NetSecurity) they belong to.',
      },
    ],
    commonMistakes: [
      'Searching for plural nouns (e.g., -Noun Processes) instead of singular nouns (-Noun *Process*).',
    ],
    troubleshooting: 'Wrap your search keyword in asterisks (*ip*, *dns*, *ad*) when you are unsure of the exact prefix.',
    relatedCommands: ['Get-Help', 'Get-Verb', 'Get-Alias', 'Get-Member'],
    relatedLessonPath: '/learn/chapter-03/verb-noun-and-discovery',
    isEssentialPocketknife: true,
  },
  {
    name: 'Get-Member',
    verb: 'Get',
    noun: 'Member',
    module: 'Microsoft.PowerShell.Utility',
    purpose: 'X-ray any pipeline object to reveal its exact .NET TypeName, Properties, and callable Methods.',
    syntax: 'Get-Member [-InputObject <PSObject>] [[-Name] <String[]>] [-MemberType <PSMemberTypes>]',
    description:
      'The third blade of the Self-Reliance Pocketknife. Piping any cmdlet to Get-Member (alias gm) reveals the true .NET class blueprint, all hidden properties (Property, AliasProperty, ScriptProperty, NoteProperty), and methods.',
    parameters: [
      { name: '-MemberType', type: 'PSMemberTypes', required: false, pipelineInput: 'False', description: 'Filters output to Properties (all property types), Property, Method, NoteProperty, etc.' },
      { name: '-Name', type: 'String[]', required: false, position: 0, pipelineInput: 'False', description: 'Filters members by name or wildcard (e.g., *Memory* or *Time*).' },
    ],
    practicalExamples: [
      {
        title: 'Reveal All Properties on a Process Object',
        description: 'Inspect every property (including hidden ones not shown in the default table).',
        code: 'Get-Process | Get-Member -MemberType Properties',
        illustrativeOutput: '   TypeName: System.Diagnostics.Process\n\nName               MemberType     Definition\n----               ----------     ----------\nHandles            AliasProperty  Handles = Handlecount\nName               AliasProperty  Name = ProcessName\nCPU                ScriptProperty System.Object CPU {get=...}\nId                 Property       int Id {get;}\nStartTime          Property       datetime StartTime {get;}\nWorkingSet64       Property       long WorkingSet64 {get;}',
        explanation: 'Shows exact property names and data types before you write Where-Object or Select-Object.',
      },
    ],
    commonMistakes: [
      'Guessing property names from abbreviated table column headers like WS(K) instead of checking Get-Member.',
    ],
    troubleshooting: 'Use -MemberType Properties (plural) to see Property, AliasProperty, NoteProperty, and ScriptProperty together.',
    relatedCommands: ['Format-List', 'Select-Object', 'Get-Help'],
    relatedLessonPath: '/learn/chapter-04/objects-properties-methods',
    isEssentialPocketknife: true,
  },
  {
    name: 'Get-Alias',
    verb: 'Get',
    noun: 'Alias',
    module: 'Microsoft.PowerShell.Utility',
    purpose: 'Translate short command nicknames (ls, dir, gps, ?, %) to their real PowerShell cmdlet names or vice versa.',
    syntax: 'Get-Alias [[-Name] <String[]>] [-Definition <String[]>]',
    description:
      'Get-Alias resolves command shortcuts. Use -Name when you know the short alias (e.g., gci) and want the full cmdlet; use -Definition when you know the full cmdlet (e.g., Get-ChildItem) and want all its aliases.',
    parameters: [
      { name: '-Name', type: 'String[]', required: false, position: 0, pipelineInput: 'ByValue, ByPropertyName', description: 'The short alias nickname to resolve (e.g., dir, ?, %). ' },
      { name: '-Definition', type: 'String[]', required: false, pipelineInput: 'False', description: 'The full cmdlet name to look up aliases for (e.g., Get-ChildItem).' },
    ],
    practicalExamples: [
      {
        title: 'Find All Aliases Pointing to Get-ChildItem',
        description: 'Use -Definition when searching by the target cmdlet name.',
        code: 'Get-Alias -Definition Get-ChildItem',
        illustrativeOutput: 'CommandType Name                 Version Source\n----------- ----                 ------- ------\nAlias       dir -> Get-ChildItem\nAlias       gci -> Get-ChildItem\nAlias       ls -> Get-ChildItem',
        explanation: 'Demonstrates that dir, ls, and gci all run the exact same Get-ChildItem cmdlet.',
      },
    ],
    commonMistakes: [
      'Mixing up -Name (the nickname) and -Definition (the real cmdlet).',
    ],
    troubleshooting: 'Remember: -Name takes the short nickname; -Definition takes the full Verb-Noun cmdlet.',
    relatedCommands: ['Get-Command'],
    relatedLessonPath: '/learn/chapter-03/verb-noun-and-discovery',
    isEssentialPocketknife: false,
  },
  {
    name: 'Get-Process',
    verb: 'Get',
    noun: 'Process',
    module: 'Microsoft.PowerShell.Management',
    purpose: 'Retrieve live System.Diagnostics.Process objects representing running processes in RAM.',
    syntax: 'Get-Process [[-Name] <String[]>] [-Id <Int32[]>]',
    description:
      'Inspects active processes on the system, exposing PIDs (.Id), physical RAM Working Set (.WorkingSet64), threads (.Threads), handle counts (.Handles), and executable paths (.Path).',
    parameters: [
      { name: '-Name', type: 'String[]', required: false, position: 0, pipelineInput: 'ByPropertyName', description: 'Filters processes by friendly name (without .exe). Supports wildcards.' },
      { name: '-Id', type: 'Int32[]', required: false, pipelineInput: 'ByPropertyName', description: 'Targets processes by numeric Process ID (PID).' },
    ],
    practicalExamples: [
      {
        title: 'Find Top 5 Processes by Physical RAM Usage (MB)',
        description: 'Sort by WorkingSet64 descending before slicing with Select-Object -First 5.',
        code: 'Get-Process | Sort-Object WorkingSet64 -Descending | Select-Object -First 5 Name, Id, @{N="RAM_MB";E={[math]::Round($_.WorkingSet64 / 1MB, 1)}}',
        illustrativeOutput: 'Name        Id RAM_MB\n----        -- ------\nMsMpEng   3412  312.4\nexplorer  5412  198.2\npwsh      8820  124.5',
        explanation: 'Uses the 1MB multiplier and [math]::Round for clean megabyte reporting.',
      },
    ],
    commonMistakes: [
      'Appending .exe to the process name (Get-Process -Name notepad.exe fails; use Get-Process -Name notepad).',
      'Piping a raw string ("explorer" | Get-Process) instead of an object with a .Name property.',
    ],
    troubleshooting: 'To view ParentProcessId (PPID) and full CommandLine arguments, query Get-CimInstance Win32_Process.',
    relatedCommands: ['Stop-Process', 'Start-Process', 'Get-CimInstance'],
    relatedLessonPath: '/learn/chapter-01/processes-threads-and-handles',
    isEssentialPocketknife: false,
  },
  {
    name: 'Stop-Process',
    verb: 'Stop',
    noun: 'Process',
    module: 'Microsoft.PowerShell.Management',
    purpose: 'Terminate one or more running processes by Process ID (-Id), Name (-Name), or piped Process object.',
    syntax: 'Stop-Process [-Id] <Int32[]> [-Force] [-WhatIf] [-Confirm]\nStop-Process -Name <String[]> [-Force] [-WhatIf] [-Confirm]',
    description:
      'Terminates running processes. Supports -WhatIf and -Confirm so you can preview exactly which processes would be terminated before executing.',
    parameters: [
      { name: '-Id', type: 'Int32[]', required: true, position: 0, pipelineInput: 'ByPropertyName', description: 'Specifies the numeric Process IDs to terminate.' },
      { name: '-Name', type: 'String[]', required: true, pipelineInput: 'ByPropertyName', description: 'Specifies the process names to terminate (supports wildcards).' },
      { name: '-WhatIf', type: 'SwitchParameter', required: false, pipelineInput: 'False', description: 'Simulates the termination and prints target PIDs without killing the processes.' },
    ],
    practicalExamples: [
      {
        title: 'Preview Stopping Processes Safely with -WhatIf',
        description: 'Verify which processes match a wildcard before terminating.',
        code: 'Get-Process -Name note* | Stop-Process -WhatIf',
        illustrativeOutput: 'What if: Performing the operation "Stop-Process" on target "notepad (4812)".',
        explanation: 'Prevents accidental termination of critical services or user work.',
      },
    ],
    commonMistakes: [
      'Running Stop-Process with a wildcard without testing -WhatIf first.',
    ],
    troubleshooting: 'Stopping elevated or SYSTEM processes requires an elevated Administrator PowerShell window.',
    relatedCommands: ['Get-Process', 'Out-GridView'],
    relatedLessonPath: '/learn/chapter-07/select-sort-and-safety',
    isEssentialPocketknife: false,
  },
  {
    name: 'Get-Service',
    verb: 'Get',
    noun: 'Service',
    module: 'Microsoft.PowerShell.Management',
    purpose: 'Retrieve Windows background service objects (ServiceController) including Status and StartType.',
    syntax: 'Get-Service [[-Name] <String[]>] [-DisplayName <String[]>]',
    description:
      'Queries the Service Control Manager (services.exe) and returns ServiceController objects representing background services.',
    parameters: [
      { name: '-Name', type: 'String[]', required: false, position: 0, pipelineInput: 'ByValue, ByPropertyName', description: 'Specifies the short service name (e.g., wuauserv, bits, WinRM).' },
      { name: '-DisplayName', type: 'String[]', required: false, pipelineInput: 'False', description: 'Filters by human-friendly display name (supports wildcards like *Update*).' },
    ],
    practicalExamples: [
      {
        title: 'Find Automatic Services That Are Currently Stopped',
        description: 'Classic sysadmin health check for crashed or failed startup services.',
        code: 'Get-Service | Where-Object { $_.StartType -eq "Automatic" -and $_.Status -ne "Running" }',
        illustrativeOutput: 'Status   Name               DisplayName\n------   ----               -----------\nStopped  sppsvc             Software Protection',
        explanation: 'Combines two property checks with -and inside Where-Object.',
      },
    ],
    commonMistakes: [
      'Confusing the short -Name (wuauserv) with the long -DisplayName ("Windows Update").',
    ],
    troubleshooting: 'To inspect which service account (LocalSystem vs LocalService) a service runs under, use Get-CimInstance Win32_Service.',
    relatedCommands: ['Start-Service', 'Stop-Service', 'Restart-Service', 'Get-CimInstance'],
    relatedLessonPath: '/learn/chapter-02/system-processes-and-service-accounts',
    isEssentialPocketknife: false,
  },
  {
    name: 'Get-CimInstance',
    verb: 'Get',
    noun: 'CimInstance',
    module: 'CimCmdlets',
    purpose: 'Query WMI/CIM management classes for deep OS internals, parent PIDs, service accounts, and kernel drivers.',
    syntax: 'Get-CimInstance [-ClassName] <String> [-Filter <String>] [-ComputerName <String[]>]',
    description:
      'The modern, WinRM-friendly replacement for legacy Get-WmiObject. Queries CIM classes such as Win32_Process (for ParentProcessId and CommandLine), Win32_Service (for StartName and PathName), and Win32_OperatingSystem.',
    parameters: [
      { name: '-ClassName', type: 'String', required: true, position: 0, pipelineInput: 'False', description: 'The WMI/CIM class name (e.g., Win32_Process, Win32_Service, Win32_SystemDriver).' },
      { name: '-Filter', type: 'String', required: false, pipelineInput: 'False', description: 'WQL source filter string evaluated before returning objects (e.g., "Name = \'lsass.exe\'").' },
    ],
    practicalExamples: [
      {
        title: 'Inspect Process Parent PIDs (PPID) and Full Command Lines',
        description: 'Uncover parent-child lineage and arguments for forensic hunting.',
        code: 'Get-CimInstance Win32_Process -Filter "Name = \'svchost.exe\'" | Select-Object -First 3 ProcessId, ParentProcessId, ExecutablePath, CommandLine',
        illustrativeOutput: 'ProcessId ParentProcessId ExecutablePath                  CommandLine\n--------- --------------- --------------                  -----------\n     1024             712 C:\\Windows\\System32\\svchost.exe C:\\Windows\\system32\\svchost.exe -k DcomLaunch -p',
        explanation: 'Verifies that svchost.exe lives in System32 and was spawned by services.exe (PID 712).',
      },
    ],
    commonMistakes: [
      'Using PowerShell operators (-eq) instead of WQL operators (=, AND, OR, LIKE) inside the -Filter string of Get-CimInstance.',
    ],
    troubleshooting: 'Inside Get-CimInstance -Filter, always use SQL/WQL syntax: "State = \'Running\' AND StartMode = \'Auto\'".',
    relatedCommands: ['Get-Process', 'Get-Service'],
    relatedLessonPath: '/learn/chapter-02/system-processes-and-service-accounts',
    isEssentialPocketknife: false,
  },
  {
    name: 'Where-Object',
    verb: 'Where',
    noun: 'Object',
    module: 'Microsoft.PowerShell.Core',
    purpose: 'Filter objects flowing through the pipeline based on property values and comparison operators.',
    syntax: 'Where-Object [-FilterScript] <ScriptBlock>\nWhere-Object [-Property] <String> [[-Value] <Object>] [-EQ | -NE | -GT | -LT | -Like | -Match]',
    description:
      'Evaluates every incoming pipeline object ($_) against a condition and passes down only those objects where the condition evaluates to $true.',
    parameters: [
      { name: '-FilterScript', type: 'ScriptBlock', required: true, position: 0, pipelineInput: 'False', description: 'A { ... } scriptblock using $_ ($PSItem) and comparison/logical operators.' },
    ],
    practicalExamples: [
      {
        title: 'Compound Filter Using $_ and -and',
        description: 'Filter processes using more than 100 MB of RAM that are not svchost.',
        code: 'Get-Process | Where-Object { $_.WorkingSet64 -gt 100MB -and $_.Name -notlike "svchost*" }',
        illustrativeOutput: ' NPM(K)    PM(M)      WS(M)     CPU(s)      Id  SI ProcessName\n ------    -----      -----     ------      --  -- -----------\n     84   285.00     312.40      19.40    3412   0 MsMpEng',
        explanation: 'Always use the { $_ } scriptblock syntax when combining two or more conditions with -and or -or.',
      },
    ],
    commonMistakes: [
      'Using = (assignment) instead of -eq (equality comparison).',
      'Forgetting the asterisk (*) wildcard when using -like ($_.Name -like "*sql*").',
    ],
    troubleshooting: 'Check if the source cmdlet offers a native -Filter parameter first ("Filter Left") before falling back to Where-Object.',
    relatedCommands: ['Select-Object', 'Sort-Object', 'Get-Member'],
    relatedLessonPath: '/learn/chapter-07/filter-left-and-where-object',
    isEssentialPocketknife: false,
  },
  {
    name: 'Select-Object',
    verb: 'Select',
    noun: 'Object',
    module: 'Microsoft.PowerShell.Utility',
    purpose: 'Choose specific properties, create calculated columns, or slice the first/last N objects in a pipeline.',
    syntax: 'Select-Object [[-Property] <Object[]>] [-First <Int32>] [-Last <Int32>] [-Unique] [-ExpandProperty <String>]',
    description:
      'Unlike Format-Table (which destroys objects for screen display), Select-Object keeps real structured objects that can be sorted, piped, or exported to CSV/JSON/HTML.',
    parameters: [
      { name: '-Property', type: 'Object[]', required: false, position: 0, pipelineInput: 'False', description: 'Property names or calculated property hashtables @{Label=...; Expression={...}}.' },
      { name: '-First', type: 'Int32', required: false, pipelineInput: 'False', description: 'Selects the first N objects from the top of the pipeline.' },
      { name: '-ExpandProperty', type: 'String', required: false, pipelineInput: 'False', description: 'Extracts the raw value of a single property without an outer object wrapper.' },
    ],
    practicalExamples: [
      {
        title: 'Create a Calculated Property Column for Uptime',
        description: 'Compute how many minutes each process has been running.',
        code: 'Get-Process | Where-Object StartTime | Select-Object -First 3 Name, Id, @{Label="UptimeMin";Expression={[math]::Round((New-TimeSpan -Start $_.StartTime -End (Get-Date)).TotalMinutes, 1)}}',
        illustrativeOutput: 'Name       Id UptimeMin\n----       -- ---------\nexplorer 5412     225.4\nlsass     792     225.9\npwsh     8820      30.6',
        explanation: 'Uses @{Label=...; Expression={...}} to compute a brand-new property on the fly.',
      },
    ],
    commonMistakes: [
      'Putting Select-Object -First 3 BEFORE Sort-Object and slicing alphabetical rows instead of the top sorted rows.',
    ],
    troubleshooting: 'Always order pipelines: Filter (Where-Object) -> Sort (Sort-Object) -> Slice (Select-Object -First N).',
    relatedCommands: ['Sort-Object', 'Where-Object', 'Format-Table'],
    relatedLessonPath: '/learn/chapter-07/select-sort-and-safety',
    isEssentialPocketknife: false,
  },
  {
    name: 'Sort-Object',
    verb: 'Sort',
    noun: 'Object',
    module: 'Microsoft.PowerShell.Utility',
    purpose: 'Sort pipeline objects in ascending or descending order by one or more properties.',
    syntax: 'Sort-Object [[-Property] <Object[]>] [-Descending] [-Unique]',
    description:
      'Orders objects numerically, chronologically, or alphabetically based on the actual underlying .NET property type.',
    parameters: [
      { name: '-Property', type: 'Object[]', required: false, position: 0, pipelineInput: 'False', description: 'Specifies the property or properties to sort by.' },
      { name: '-Descending', type: 'SwitchParameter', required: false, pipelineInput: 'False', description: 'Sorts from largest to smallest (Z to A) instead of ascending.' },
    ],
    practicalExamples: [
      {
        title: 'Sort Processes by RAM Usage from Highest to Lowest',
        description: 'Sort by WorkingSet64 with -Descending.',
        code: 'Get-Process | Sort-Object -Property WorkingSet64 -Descending | Select-Object -First 5 Name, WorkingSet64',
        illustrativeOutput: 'Name     WorkingSet64\n----     ------------\nMsMpEng     327581696\nexplorer    207826944',
        explanation: 'Always sort before taking -First N.',
      },
    ],
    commonMistakes: [
      'Sorting after Format-Table (Format-Table destroys the original object properties!).',
    ],
    troubleshooting: 'Ensure Sort-Object comes before any Format-* cmdlet.',
    relatedCommands: ['Select-Object', 'Where-Object'],
    relatedLessonPath: '/learn/chapter-07/select-sort-and-safety',
    isEssentialPocketknife: false,
  },
  {
    name: 'Get-ChildItem',
    verb: 'Get',
    noun: 'ChildItem',
    module: 'Microsoft.PowerShell.Management',
    purpose: 'List items and child containers inside any PSDrive (FileSystem C:, Registry HKLM:, Env:, Cert:, AD:).',
    syntax: 'Get-ChildItem [[-Path] <String[]>] [[-Filter] <String>] [-Recurse] [-File] [-Directory] [-Force]',
    description:
      'The universal directory and container scanner across all PowerShell providers. Combine -Filter (source filtering) with -Recurse (subfolders) for high-speed file hunting.',
    parameters: [
      { name: '-Path', type: 'String[]', required: false, position: 0, pipelineInput: 'ByValue, ByPropertyName', description: 'The folder, registry key, or PSDrive path to list.' },
      { name: '-Filter', type: 'String', required: false, position: 1, pipelineInput: 'False', description: 'High-speed provider-level wildcard filter (e.g., *.dll, *.log).' },
      { name: '-Recurse', type: 'SwitchParameter', required: false, pipelineInput: 'False', description: 'Searches all nested subdirectories recursively.' },
      { name: '-Force', type: 'SwitchParameter', required: false, pipelineInput: 'False', description: 'Reveals hidden and system files.' },
    ],
    practicalExamples: [
      {
        title: 'High-Speed Recursive Hunt for .dll Files',
        description: 'Filter at the NTFS provider level while traversing all subfolders.',
        code: 'Get-ChildItem -Path C:\\Windows\\System32 -Filter *.dll -Recurse -ErrorAction SilentlyContinue',
        illustrativeOutput: 'Mode                 LastWriteTime         Length Name\n----                 -------------         ------ ----\n-a---           11/3/2026 10:00 AM         540672 aadcloudap.dll',
        explanation: 'Orders of magnitude faster than piping Get-ChildItem -Recurse into Where-Object.',
      },
    ],
    commonMistakes: [
      'Omitting -Recurse and only searching the top-level directory.',
      'Piping Get-ChildItem -Recurse to Where-Object Name -like "*.dll" instead of using -Filter *.dll.',
    ],
    troubleshooting: 'Add -ErrorAction SilentlyContinue when scanning system drives recursively to skip protected folders cleanly.',
    relatedCommands: ['Set-Location', 'New-Item', 'Select-String', 'Get-PSDrive'],
    relatedLessonPath: '/learn/chapter-08/files-and-select-string',
    isEssentialPocketknife: false,
  },
  {
    name: 'Select-String',
    verb: 'Select',
    noun: 'String',
    module: 'Microsoft.PowerShell.Utility',
    purpose: 'Search inside files or text strings for regex or wildcard patterns (PowerShellâ€™s object-oriented grep).',
    syntax: 'Select-String [-Pattern] <String[]> [-Path <String[]>] [-CaseSensitive] [-SimpleMatch]',
    description:
      'Scans the text contents of files or piped strings for a pattern and returns rich MatchInfo objects containing Filename, Path, LineNumber, and Line.',
    parameters: [
      { name: '-Pattern', type: 'String[]', required: true, position: 0, pipelineInput: 'False', description: 'The regular expression or text string to search for inside files.' },
      { name: '-Path', type: 'String[]', required: false, position: 1, pipelineInput: 'ByPropertyName', description: 'File paths to search (or pipe FileInfo objects from Get-ChildItem).' },
    ],
    practicalExamples: [
      {
        title: 'Search All Log Files in a Directory Tree for Errors',
        description: 'Pipe Get-ChildItem -Recurse into Select-String.',
        code: 'Get-ChildItem -Path C:\\Windows\\Logs -Filter *.log -Recurse -ErrorAction SilentlyContinue | Select-String -Pattern "Error" | Select-Object -First 3 Filename, LineNumber, Line',
        illustrativeOutput: 'Filename       LineNumber Line\n--------       ---------- ----\nCBS.log               142 2026-11-03 08:12:01, Info CBS Failed to query error state',
        explanation: 'Returns structured MatchInfo objects rather than flat text.',
      },
    ],
    commonMistakes: [
      'Confusing Get-ChildItem -Filter (which searches file NAMES) with Select-String -Pattern (which searches INSIDE file contents).',
    ],
    troubleshooting: 'Use -SimpleMatch if your search string contains literal regex characters like brackets or dots.',
    relatedCommands: ['Get-ChildItem', 'Get-Content'],
    relatedLessonPath: '/learn/chapter-08/files-and-select-string',
    isEssentialPocketknife: false,
  },
  {
    name: 'New-NetIPAddress',
    verb: 'New',
    noun: 'NetIPAddress',
    module: 'NetTCPIP',
    purpose: 'Assign a static IPv4 or IPv6 address, subnet prefix length (/24), and Default Gateway to a network adapter.',
    syntax: 'New-NetIPAddress -InterfaceIndex <UInt32> -IPAddress <String> -PrefixLength <Byte> [-DefaultGateway <String>]',
    description:
      'Core networking cmdlet used when provisioning headless Windows Server Core hosts. Pairs with Set-DnsClientServerAddress to complete static network configuration.',
    parameters: [
      { name: '-InterfaceIndex', type: 'UInt32', required: true, pipelineInput: 'ByPropertyName', description: 'The numeric ifIndex of the network card (from Get-NetAdapter).' },
      { name: '-IPAddress', type: 'String', required: true, pipelineInput: 'ByPropertyName', description: 'The static IPv4 address (e.g., 192.168.153.210).' },
      { name: '-PrefixLength', type: 'Byte', required: true, pipelineInput: 'ByPropertyName', description: 'CIDR subnet mask bit length (e.g., 24 for 255.255.255.0).' },
      { name: '-DefaultGateway', type: 'String', required: false, pipelineInput: 'ByPropertyName', description: 'Router/gateway IP address on the local subnet (e.g., 192.168.153.1).' },
    ],
    practicalExamples: [
      {
        title: 'Configure Static IPv4 and Gateway on Server Core',
        description: 'Set 192.168.153.210/24 with gateway 192.168.153.1 on interface index 4.',
        code: 'New-NetIPAddress -InterfaceIndex 4 -IPAddress "192.168.153.210" -PrefixLength 24 -DefaultGateway "192.168.153.1"',
        illustrativeOutput: 'IPAddress         : 192.168.153.210\nInterfaceIndex    : 4\nInterfaceAlias    : Ethernet0\nAddressFamily     : IPv4\nPrefixLength      : 24',
        explanation: 'Follow immediately with Set-DnsClientServerAddress to configure DNS resolution.',
      },
    ],
    commonMistakes: [
      'Passing "255.255.255.0" to -PrefixLength instead of the CIDR bit count 24.',
      'Guessing -InterfaceIndex without running Get-NetAdapter first.',
    ],
    troubleshooting: 'Verify the applied address using Get-NetIPAddress -InterfaceIndex 4 -AddressFamily IPv4.',
    relatedCommands: ['Get-NetAdapter', 'Get-NetIPAddress', 'Set-DnsClientServerAddress'],
    relatedLessonPath: '/learn/chapter-09/headless-server-core-build',
    isEssentialPocketknife: false,
  },
  {
    name: 'Set-DnsClientServerAddress',
    verb: 'Set',
    noun: 'DnsClientServerAddress',
    module: 'DnsClient',
    purpose: 'Configure the DNS server IP addresses used by a network interface.',
    syntax: 'Set-DnsClientServerAddress -InterfaceIndex <UInt32> [-ServerAddresses <String[]>] [-ResetServerAddresses]',
    description:
      'Points a network interface at one or more DNS servers (such as a pfSense router or an Active Directory Domain Controller).',
    parameters: [
      { name: '-InterfaceIndex', type: 'UInt32', required: true, pipelineInput: 'ByPropertyName', description: 'The numeric ifIndex of the network adapter.' },
      { name: '-ServerAddresses', type: 'String[]', required: true, pipelineInput: 'False', description: 'One or more DNS server IP addresses.' },
    ],
    practicalExamples: [
      {
        title: 'Point Server Core NIC at Gateway DNS',
        description: 'Set DNS server to 192.168.153.1 on ifIndex 4.',
        code: 'Set-DnsClientServerAddress -InterfaceIndex 4 -ServerAddresses "192.168.153.1"',
        illustrativeOutput: '(Completes silently; verify with Get-DnsClientServerAddress -InterfaceIndex 4)',
        explanation: 'Essential before joining an Active Directory domain.',
      },
    ],
    commonMistakes: [
      'Forgetting to set DNS before running Add-Computer -DomainName (causing domain join to fail).',
    ],
    troubleshooting: 'Run Get-DnsClientServerAddress -AddressFamily IPv4 and Resolve-DnsName to verify DNS resolution.',
    relatedCommands: ['Get-DnsClientServerAddress', 'New-NetIPAddress', 'Resolve-DnsName'],
    relatedLessonPath: '/learn/chapter-09/headless-server-core-build',
    isEssentialPocketknife: false,
  },
  {
    name: 'Invoke-Command',
    verb: 'Invoke',
    noun: 'Command',
    module: 'Microsoft.PowerShell.Core',
    purpose: 'Execute commands or local .ps1 scripts across one or hundreds of remote servers in parallel via WinRM.',
    syntax: 'Invoke-Command [-ComputerName <String[]>] [-ScriptBlock] <ScriptBlock> [-Credential <PSCredential>]\nInvoke-Command [-ComputerName <String[]>] [-FilePath] <String>',
    description:
      'The 1-to-many PowerShell Remoting workhorse. Connects over WinRM (TCP 5985 HTTP / 5986 HTTPS), executes the scriptblock in parallel across all specified servers, and tags every returned object with PSComputerName.',
    parameters: [
      { name: '-ComputerName', type: 'String[]', required: false, pipelineInput: 'ByPropertyName', description: 'One or more remote server hostnames.' },
      { name: '-ScriptBlock', type: 'ScriptBlock', required: true, position: 0, pipelineInput: 'False', description: 'The { ... } block of code to execute on the remote endpoints.' },
      { name: '-FilePath', type: 'String', required: true, pipelineInput: 'False', description: 'Path to a local .ps1 script to execute remotely without copying the file first.' },
    ],
    practicalExamples: [
      {
        title: 'Parallel Health Check Across Multiple Servers',
        description: 'Query the WinRM service status across three servers at once.',
        code: 'Invoke-Command -ComputerName SRV-CORE01, SRV-DC01, SRV-SQL01 -ScriptBlock { Get-Service -Name WinRM }',
        illustrativeOutput: 'Status   Name   DisplayName                        PSComputerName\n------   ----   -----------                        --------------\nRunning  WinRM  Windows Remote Management (WS-Man) SRV-CORE01\nRunning  WinRM  Windows Remote Management (WS-Man) SRV-DC01',
        explanation: 'Runs simultaneously and identifies each server via PSComputerName.',
      },
    ],
    commonMistakes: [
      'Referencing a local variable $myVar inside -ScriptBlock { } without the $using:myVar scope prefix.',
    ],
    troubleshooting: 'Use Test-WSMan -ComputerName <Server> to verify WinRM reachability on TCP 5985 before invoking commands.',
    relatedCommands: ['Enter-PSSession', 'Test-WSMan', 'New-PSSession'],
    relatedLessonPath: '/learn/chapter-11/winrm-and-remoting',
    isEssentialPocketknife: false,
  },
  {
    name: 'Get-ADUser',
    verb: 'Get',
    noun: 'ADUser',
    module: 'ActiveDirectory',
    purpose: 'Query Active Directory user accounts using server-side filters and retrieve extended directory attributes.',
    syntax: 'Get-ADUser -Filter <String> [-SearchBase <String>] [-Properties <String[]>]\nGet-ADUser [-Identity] <ADUser> [-Properties <String[]>]',
    description:
      'Retrieves domain user objects from Active Directory Domain Services. Returns 10 basic properties by default; pass -Properties to retrieve extra attributes such as Department, Title, LastLogonDate, or ServicePrincipalName.',
    parameters: [
      { name: '-Filter', type: 'String', required: true, pipelineInput: 'False', description: 'Server-side query string evaluated by the Domain Controller (e.g., "Department -eq \'IT\'").' },
      { name: '-Identity', type: 'ADUser', required: true, position: 0, pipelineInput: 'ByValue, ByPropertyName', description: 'SamAccountName, DistinguishedName, SID, or GUID of a single user.' },
      { name: '-Properties', type: 'String[]', required: false, pipelineInput: 'False', description: 'Additional AD attributes to fetch beyond the 10 defaults.' },
    ],
    practicalExamples: [
      {
        title: 'Query Active Users in a Specific Department',
        description: 'Filter at the Domain Controller and request Department and LastLogonDate.',
        code: 'Get-ADUser -Filter "Enabled -eq $true -and Department -eq \'Security\'" -Properties Department, LastLogonDate | Select-Object Name, SamAccountName, Department, LastLogonDate',
        illustrativeOutput: 'Name        SamAccountName Department LastLogonDate\n----        -------------- ---------- -------------\nIzaz Haider ihaider        Security   11/3/2026 11:40:00 PM',
        explanation: 'Applies Filter Left so the Domain Controller only transmits matching records.',
      },
    ],
    commonMistakes: [
      'Forgetting -Properties Department and wondering why $user.Department is empty.',
      'Running Get-ADUser -Filter * -Properties * on a large enterprise domain.',
    ],
    troubleshooting: 'On machines without RSAT installed, use the native .NET [adsisearcher] accelerator.',
    relatedCommands: ['New-ADUser', 'Set-ADUser', 'Remove-ADUser', 'Get-ADGroupMember'],
    relatedLessonPath: '/learn/chapter-12/ad-users-groups-and-ous',
    isEssentialPocketknife: false,
  },
  {
    name: 'Test-ComputerSecureChannel',
    verb: 'Test',
    noun: 'ComputerSecureChannel',
    module: 'Microsoft.PowerShell.Management',
    purpose: 'Verify and repair the domain trust relationship between a workstation/server and its Active Directory Domain Controller.',
    syntax: 'Test-ComputerSecureChannel [-Repair] [-Credential <PSCredential>] [-Server <String>] [-Verbose]',
    description:
      'Checks whether the local machineâ€™s domain account password matches Active Directory. Passing -Repair resets and resynchronizes a broken trust relationship online without unjoining the domain or rebooting.',
    parameters: [
      { name: '-Repair', type: 'SwitchParameter', required: false, pipelineInput: 'False', description: 'Repairs a broken domain trust channel online.' },
      { name: '-Credential', type: 'PSCredential', required: false, pipelineInput: 'False', description: 'Domain credentials with permission to reset the computer account.' },
    ],
    practicalExamples: [
      {
        title: 'Repair a Broken Workstation Domain Trust After Reverting a Snapshot',
        description: 'Fix "The trust relationship between this workstation and the primary domain failed" in one line.',
        code: 'Test-ComputerSecureChannel -Repair -Credential (Get-Credential) -Verbose',
        illustrativeOutput: 'VERBOSE: Performing the operation "Test-ComputerSecureChannel" on target "SRV-CORE01".\nTrue',
        explanation: 'Saves 20 minutes of unjoining to a workgroup and rebooting twice.',
      },
    ],
    commonMistakes: [
      'Running -Repair without providing domain admin credentials via -Credential when logged in as a local account.',
    ],
    troubleshooting: 'Ensure the machineâ€™s DNS client points to the Active Directory Domain Controller first.',
    relatedCommands: ['Add-Computer', 'Get-ADComputer'],
    relatedLessonPath: '/learn/chapter-12/ad-users-groups-and-ous',
    isEssentialPocketknife: false,
  },
  {
    name: 'Enable-NetFirewallRule',
    verb: 'Enable',
    noun: 'NetFirewallRule',
    module: 'NetSecurity',
    purpose: 'Enable previously disabled Windows Defender Firewall rules by DisplayGroup or DisplayName.',
    syntax: 'Enable-NetFirewallRule [-DisplayGroup <String[]>] [-DisplayName <String[]>] [-Name <String[]>]',
    description:
      'Opens built-in Windows service ports safely by enabling functional DisplayGroups (like "Windows Remote Management" or "File and Printer Sharing") without disabling the firewall profile.',
    parameters: [
      { name: '-DisplayGroup', type: 'String[]', required: false, pipelineInput: 'ByPropertyName', description: 'The rule category group name to enable.' },
      { name: '-DisplayName', type: 'String[]', required: false, pipelineInput: 'ByPropertyName', description: 'Specific rule display name(s) to enable.' },
    ],
    practicalExamples: [
      {
        title: 'Enable Remote Event Log and File Sharing Rules on Server Core',
        description: 'Open management ports cleanly by DisplayGroup.',
        code: 'Enable-NetFirewallRule -DisplayGroup "Remote Event Log Management", "File and Printer Sharing"',
        illustrativeOutput: '(Enables all matching rules across the active profile cleanly)',
        explanation: 'Follows Least Privilege instead of turning off the entire firewall.',
      },
    ],
    commonMistakes: [
      'Turning off all firewall profiles (Set-NetFirewallProfile -Enabled False) instead of enabling the specific DisplayGroup.',
    ],
    troubleshooting: 'Discover available group names with: Get-NetFirewallRule | Select-Object -ExpandProperty DisplayGroup -Unique.',
    relatedCommands: ['Get-NetFirewallProfile', 'Get-NetFirewallRule', 'New-NetFirewallRule'],
    relatedLessonPath: '/learn/chapter-13/firewall-profiles-and-rules',
    isEssentialPocketknife: false,
  },
  {
    name: 'Get-WinEvent',
    verb: 'Get',
    noun: 'WinEvent',
    module: 'Microsoft.PowerShell.Diagnostics',
    purpose: 'Query classic and modern Windows Event Logs (including PowerShell Script Block Event ID 4104 and Security 4624/4625) at native speed.',
    syntax: 'Get-WinEvent -FilterHashtable <Hashtable> [-MaxEvents <Int64>] [-ComputerName <String>]',
    description:
      'The primary Blue Team forensic and threat-hunting cmdlet. Supports high-speed source filtering via -FilterHashtable across Security, System, and Applications and Services logs (such as Microsoft-Windows-PowerShell/Operational).',
    parameters: [
      { name: '-FilterHashtable', type: 'Hashtable', required: true, pipelineInput: 'False', description: 'Source filter hashtable supporting LogName, Id, Level, StartTime, EndTime, and ProviderName.' },
      { name: '-MaxEvents', type: 'Int64', required: false, pipelineInput: 'False', description: 'Stops scanning after returning N matching events.' },
    ],
    practicalExamples: [
      {
        title: 'Hunt PowerShell Script Block Logs (Event ID 4104)',
        description: 'Retrieve the 10 most recent executed PowerShell scriptblocks from the Operational log.',
        code: 'Get-WinEvent -FilterHashtable @{ LogName = "Microsoft-Windows-PowerShell/Operational"; Id = 4104 } -MaxEvents 10 | Select-Object TimeCreated, Id, Message',
        illustrativeOutput: 'TimeCreated            Id Message\n-----------            -- -------\n11/3/2026 11:58:12 PM 4104 Creating Scriptblock text (1 of 1): Get-Service -Name WinRM...',
        explanation: 'Captures the full de-obfuscated source code executed in memory.',
      },
    ],
    commonMistakes: [
      'Using deprecated Get-EventLog (which cannot read Microsoft-Windows-PowerShell/Operational).',
      'Piping millions of Security events to Where-Object instead of using -FilterHashtable.',
    ],
    troubleshooting: 'Querying the Security log requires an elevated Administrator PowerShell session.',
    relatedCommands: ['Start-Transcript', 'Select-String'],
    relatedLessonPath: '/learn/chapter-16/powershell-auditing-and-logging',
    isEssentialPocketknife: false,
  },
];

const ALL_COMMANDS = [...CORE_COMMANDS, ...COMMANDS_EXTRA_1, ...COMMANDS_EXTRA_2, ...COMMANDS_EXTRA_3, ...COMMANDS_EXTRA_4];

/** The full cmdlet library. Core entries win if a name appears twice. */
export const COMMANDS: CommandEntry[] = ALL_COMMANDS.filter(
  (c, i) => ALL_COMMANDS.findIndex((o) => o.name.toLowerCase() === c.name.toLowerCase()) === i,
);

export const commandReference = COMMANDS;
export const commands = COMMANDS;
