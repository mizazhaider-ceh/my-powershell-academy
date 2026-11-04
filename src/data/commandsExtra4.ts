import type { CommandEntry } from '../types';

export const COMMANDS_EXTRA_4: CommandEntry[] = [
  {
    name: 'Get-NetFirewallProfile',
    verb: 'Get',
    noun: 'NetFirewallProfile',
    module: 'NetSecurity',
    purpose: 'Show whether Windows Defender Firewall is on for the Domain, Private and Public profiles, and what each profile does by default.',
    syntax: 'Get-NetFirewallProfile [[-Name] <String[]>] [-All] [-PolicyStore <String>] [-CimSession <CimSession[]>]',
    description:
      'Windows Defender Firewall keeps three separate sets of settings called profiles: Domain (you are on the corporate network), Private (a trusted home or office network) and Public (everything else, such as a coffee shop). Windows picks the profile automatically based on the network you are connected to. Get-NetFirewallProfile is the read-only way to check them. It returns one object per profile with properties such as Enabled, DefaultInboundAction, DefaultOutboundAction and the logging settings. Use it first in any firewall investigation, because a profile that is switched off makes every individual rule irrelevant.',
    parameters: [
      { name: '-Name', type: 'String[]', required: false, position: 0, pipelineInput: 'False', description: 'The profile to return: Domain, Private or Public. Leave it out to get all three.' },
      { name: '-All', type: 'SwitchParameter', required: false, pipelineInput: 'False', description: 'Returns every profile. This is also what you get when you give no filter at all.' },
      { name: '-PolicyStore', type: 'String', required: false, pipelineInput: 'False', description: 'Which copy of the settings to read. The default is ActiveStore (what is really enforced now). PersistentStore is the local settings saved on disk, and a GPO store name reads a domain policy.' },
      { name: '-CimSession', type: 'CimSession[]', required: false, pipelineInput: 'False', description: 'Runs the query on one or more remote computers through a CIM session created with New-CimSession.' },
      { name: '-AssociatedNetFirewallRule', type: 'CimInstance', required: false, pipelineInput: 'ByValue', description: 'Lets you pipe a firewall rule object in, to find out which profiles that rule belongs to.' },
    ],
    practicalExamples: [
      {
        title: 'Check That Every Firewall Profile Is Enabled',
        description: 'A quick health check you can run on any workstation or server.',
        code: `Get-NetFirewallProfile | Select-Object Name, Enabled, DefaultInboundAction, DefaultOutboundAction`,
        illustrativeOutput: `Name    Enabled DefaultInboundAction DefaultOutboundAction
----    ------- -------------------- ---------------------
Domain     True        NotConfigured         NotConfigured
Private    True        NotConfigured         NotConfigured
Public     True        NotConfigured         NotConfigured`,
        explanation: 'Enabled should be True for all three. NotConfigured means nobody has set the value explicitly, so Windows uses its built-in default (block inbound, allow outbound). Never "fix" a problem by turning a profile off; open the one port you need with a rule instead.',
      },
      {
        title: 'Inspect Firewall Logging on the Public Profile',
        description: 'See whether dropped connections are being logged, and where the log file lives.',
        code: `Get-NetFirewallProfile -Name Public | Format-List Name, Enabled, LogAllowed, LogBlocked, LogFileName, LogMaxSizeKilobytes`,
        illustrativeOutput: `Name                : Public
Enabled             : True
LogAllowed          : False
LogBlocked          : False
LogFileName         : %systemroot%\\system32\\LogFiles\\Firewall\\pfirewall.log
LogMaxSizeKilobytes : 4096`,
        explanation: 'By default neither allowed nor blocked connections are logged. If you are hunting for who is probing a machine, a defender can switch LogBlocked on with Set-NetFirewallProfile and then read pfirewall.log.',
      },
      {
        title: 'Audit All Lab Machines at Once',
        description: 'Ask SRV-CORE01 and CLIENT01 for their profiles through CIM (read-only, lab).',
        code: `$sessions = New-CimSession -ComputerName SRV-CORE01, CLIENT01
Get-NetFirewallProfile -CimSession $sessions | Select-Object PSComputerName, Name, Enabled
Remove-CimSession $sessions`,
        illustrativeOutput: `PSComputerName Name    Enabled
-------------- ----    -------
SRV-CORE01     Domain     True
SRV-CORE01     Private    True
SRV-CORE01     Public     True
CLIENT01       Domain     True
CLIENT01       Private    True
CLIENT01       Public     True`,
        explanation: 'PSComputerName tells you which machine each row came from. The remote machines need WinRM (or DCOM) reachable from where you run the command.',
      },
    ],
    commonMistakes: [
      'Assuming "NotConfigured" means the firewall is open. It only means no explicit value was set, so the built-in default applies.',
      'Checking only one profile. A laptop can switch from Domain to Public when it leaves the office, so audit all three.',
      'Reading local settings and forgetting that a Group Policy can override them. Use the default ActiveStore to see what is truly enforced.',
    ],
    troubleshooting: 'If Enabled looks wrong, compare the stores: Get-NetFirewallProfile -PolicyStore PersistentStore shows the local setting, while the default ActiveStore shows the result after Group Policy. To see which profile is active right now, run Get-NetConnectionProfile (NetConnection module). Remote queries fail with "Access is denied" or "WinRM cannot process the request" when you lack admin rights on the target or the remote management firewall group is closed.',
    relatedCommands: ['Get-NetFirewallRule', 'Test-NetConnection', 'Get-NetAdapter'],
    relatedLessonPath: '/learn/chapter-13/firewall-profiles-and-rules',
    isEssentialPocketknife: false,
  },
  {
    name: 'Get-NetFirewallRule',
    verb: 'Get',
    noun: 'NetFirewallRule',
    module: 'NetSecurity',
    purpose: 'List Windows Defender Firewall rules and filter them by name, group, direction, action or enabled state.',
    syntax: 'Get-NetFirewallRule [[-Name] <String[]>] [-DisplayName <String[]>] [-DisplayGroup <String[]>] [-Enabled <Enabled[]>] [-Direction <Direction[]>] [-Action <Action[]>] [-PolicyStore <String>]',
    description:
      'A firewall rule is a single allow or block instruction, such as "allow inbound TCP 5985 for Windows Remote Management". A normal Windows machine has several hundred of them (763 on the test machine used for this reference), so you almost never want the raw list. Get-NetFirewallRule returns the rule objects and lets you filter with parameters. The rule object holds the name, direction, action, profile and enabled flag. The port, address and program details live in separate "filter" objects, which you reach by piping the rule into Get-NetFirewallPortFilter, Get-NetFirewallAddressFilter or Get-NetFirewallApplicationFilter.',
    parameters: [
      { name: '-Name', type: 'String[]', required: false, position: 0, pipelineInput: 'False', description: 'The internal unique rule name (often a GUID or a short ID). Supports wildcards.' },
      { name: '-DisplayName', type: 'String[]', required: false, pipelineInput: 'False', description: 'The friendly name you see in the Windows Defender Firewall console. Supports wildcards.' },
      { name: '-DisplayGroup', type: 'String[]', required: false, pipelineInput: 'False', description: 'Returns every rule in a named group, for example "Windows Remote Management" or "File and Printer Sharing".' },
      { name: '-Enabled', type: 'Enabled[]', required: false, pipelineInput: 'False', description: 'Filters on the rule state. Accepts True or False.' },
      { name: '-Direction', type: 'Direction[]', required: false, pipelineInput: 'False', description: 'Inbound (traffic coming to this machine) or Outbound (traffic leaving it).' },
      { name: '-Action', type: 'Action[]', required: false, pipelineInput: 'False', description: 'Allow or Block.' },
      { name: '-PolicyStore', type: 'String', required: false, pipelineInput: 'False', description: 'Which rule store to read. The default ActiveStore shows the combined result of local rules and Group Policy.' },
      { name: '-AssociatedNetFirewallProfile', type: 'CimInstance', required: false, pipelineInput: 'ByValue', description: 'Lets you pipe a profile object in (from Get-NetFirewallProfile) to list only the rules that apply to that profile.' },
    ],
    practicalExamples: [
      {
        title: 'Check Whether Remote Management Rules Are Open',
        description: 'Find out if WinRM is allowed through the firewall before you try Enter-PSSession.',
        code: `Get-NetFirewallRule -DisplayGroup "Windows Remote Management" | Select-Object DisplayName, Enabled, Profile`,
        illustrativeOutput: `DisplayName                         Enabled Profile
-----------                         ------- -------
Windows Remote Management (HTTP-In)   False Public
Windows Remote Management (HTTP-In)   False Domain, Private`,
        explanation: 'Both rules are off on this machine, so remote PowerShell would be blocked until WinRM is enabled (Enable-PSRemoting turns the rules on). The Profile column shows which network types each rule covers.',
      },
      {
        title: 'List Enabled Inbound Allow Rules',
        description: 'Review what the machine currently lets in from the network.',
        code: `Get-NetFirewallRule -Enabled True -Direction Inbound -Action Allow |
    Select-Object DisplayName, Profile, Direction, Action -First 5`,
        illustrativeOutput: `DisplayName                                                                Profile Direction Action
-----------                                                                ------- --------- ------
Wi-Fi Direct Spooler Use (In)                                               Public   Inbound  Allow
Core Networking - IPv6 (IPv6-In)                                               Any   Inbound  Allow
Delivery Optimization (UDP-In)                                                 Any   Inbound  Allow
Core Networking - Router Advertisement (ICMPv6-In)                             Any   Inbound  Allow
Core Networking - Destination Unreachable Fragmentation Needed (ICMPv4-In)     Any   Inbound  Allow`,
        explanation: 'Reviewing inbound allow rules is a core hardening task. Every rule here is a door into the machine, so anything you do not recognise deserves a closer look.',
      },
      {
        title: 'Count the Rules for One Profile',
        description: 'Pipe a profile into Get-NetFirewallRule to see only its rules.',
        code: `Get-NetFirewallProfile -Name Public | Get-NetFirewallRule | Measure-Object | Select-Object Count`,
        illustrativeOutput: `Count
-----
  595`,
        explanation: 'The profile object travels down the pipeline into -AssociatedNetFirewallProfile. The count will differ on your machine.',
      },
    ],
    commonMistakes: [
      'Looking for a Port or Program property on the rule. Those live in the filter objects: pipe the rule to Get-NetFirewallPortFilter or Get-NetFirewallApplicationFilter.',
      'Piping the whole rule list (hundreds of rules) into a port filter lookup and wondering why it is slow. Narrow with -DisplayGroup, -Enabled or -Direction first, which is the "filter left" habit.',
      'Using -DisplayName with a name that is slightly different. Names must match exactly unless you add a wildcard such as "*Remote Management*".',
    ],
    troubleshooting: 'If a command returns nothing, test the name with a wildcard first: Get-NetFirewallRule -DisplayName "*Remote*". To discover valid group names, run Get-NetFirewallRule | Select-Object -ExpandProperty DisplayGroup -Unique. If a rule looks enabled but traffic is still blocked, check the profile with Get-NetFirewallProfile and remember that a Block rule always beats an Allow rule.',
    relatedCommands: ['Get-NetFirewallProfile', 'Test-NetConnection', 'Test-WSMan'],
    relatedLessonPath: '/learn/chapter-13/firewall-profiles-and-rules',
    isEssentialPocketknife: false,
  },
  {
    name: 'Get-GPO',
    verb: 'Get',
    noun: 'GPO',
    module: 'GroupPolicy',
    purpose: 'Retrieve one or all Group Policy Objects from an Active Directory domain, including their status, version and timestamps.',
    syntax: 'Get-GPO [-Name] <String> [[-Domain] <String>] [[-Server] <String>]\nGet-GPO [-Guid] <Guid> [[-Domain] <String>] [[-Server] <String>]\nGet-GPO -All [[-Domain] <String>] [[-Server] <String>]',
    description:
      'A Group Policy Object (GPO) is a bundle of settings that Active Directory pushes to users and computers. Get-GPO reads those objects so you can list them, check whether they are enabled, and see when they last changed. It does not show the individual settings inside a GPO (use Get-GPOReport for that) and it does not show where the GPO is linked (use Get-GPInheritance). The cmdlet comes from the GroupPolicy module, which ships with the RSAT Group Policy Management tools or is present on domain controllers. It is read-only, so it is safe to use for auditing.',
    parameters: [
      { name: '-Name', type: 'String', required: true, position: 0, pipelineInput: 'ByValue', description: 'The display name of the GPO, for example "Default Domain Policy". Used instead of -Guid.' },
      { name: '-Guid', type: 'Guid', required: true, position: 0, pipelineInput: 'ByPropertyName', description: 'The unique ID of the GPO. Use it when two GPOs might share a similar name.' },
      { name: '-All', type: 'SwitchParameter', required: false, pipelineInput: 'False', description: 'Returns every GPO in the domain.' },
      { name: '-Domain', type: 'String', required: false, position: 1, pipelineInput: 'ByPropertyName', description: 'The domain to query, for example corp.example.com. Defaults to the domain of the current user.' },
      { name: '-Server', type: 'String', required: false, position: 2, pipelineInput: 'False', description: 'The domain controller to talk to, for example DC01. Handy when you suspect replication delay.' },
    ],
    practicalExamples: [
      {
        title: 'List Every GPO in the Lab Domain',
        description: 'Get a quick inventory with the fields that matter for an audit.',
        code: `Get-GPO -All -Domain corp.example.com |
    Sort-Object DisplayName |
    Select-Object DisplayName, GpoStatus, ModificationTime`,
        illustrativeOutput: `DisplayName                 GpoStatus          ModificationTime
-----------                 ---------          ----------------
Default Domain Controllers  AllSettingsEnabled 11/02/2026 09:14:05
Default Domain Policy       AllSettingsEnabled 11/02/2026 09:14:05
Workstation Hardening       AllSettingsEnabled 11/03/2026 16:40:22`,
        explanation: 'GpoStatus tells you whether the user or computer half of a GPO is disabled. ModificationTime helps you spot unexpected recent changes.',
      },
      {
        title: 'Inspect a Single GPO by Name',
        description: 'Check the version numbers that Group Policy uses to decide whether to re-download a policy.',
        code: `Get-GPO -Name "Workstation Hardening" -Server DC01 | Format-List DisplayName, Id, Owner, UserVersion, ComputerVersion`,
        illustrativeOutput: `DisplayName     : Workstation Hardening
Id              : 3f2a6c1e-8b7d-4c11-9a52-0d6b1e4f7a90
Owner           : CORP\\Domain Admins
UserVersion     : AD Version: 0, SysVol Version: 0
ComputerVersion : AD Version: 4, SysVol Version: 4`,
        explanation: 'If the AD Version and SysVol Version differ, the policy has not replicated fully, which is a classic reason why clients do not receive a change.',
      },
    ],
    commonMistakes: [
      'Running the command on a client that does not have the GroupPolicy module. Install the RSAT Group Policy Management tools or run it on DC01.',
      'Expecting Get-GPO to list the settings inside the policy. It only returns the object properties; use Get-GPOReport -ReportType Html for the settings.',
      'Forgetting -All and getting an error because -Name is required when you give no other selector.',
    ],
    troubleshooting: 'If you see "The term Get-GPO is not recognized", check Get-Module -ListAvailable GroupPolicy. On Windows 10 or 11 install the "RSAT: Group Policy Management Tools" optional feature. If the command works but returns old data, point -Server at a specific domain controller to rule out replication delay. NOTE: the GroupPolicy module is not installed on the machine used to verify this reference, so parameters were checked against the Microsoft documentation only.',
    relatedCommands: ['Invoke-GPUpdate', 'Get-GPResultantSetOfPolicy', 'Get-ADDomain'],
    relatedLessonPath: '/learn/chapter-13/gpo-rsop-and-scheduled-tasks',
    isEssentialPocketknife: false,
  },
  {
    name: 'Invoke-GPUpdate',
    verb: 'Invoke',
    noun: 'GPUpdate',
    module: 'GroupPolicy',
    purpose: 'Schedule an immediate or delayed Group Policy refresh on a local or remote computer, the PowerShell version of gpupdate.exe.',
    syntax: 'Invoke-GPUpdate [[-Computer] <String>] [[-RandomDelayInMinutes] <Int32>] [-Target <String>] [-Force] [-Boot] [-LogOff] [-Sync] [-AsJob]',
    description:
      'Computers normally refresh Group Policy on their own every 90 minutes (plus a random offset). Invoke-GPUpdate lets you trigger that refresh on demand, on your own machine or on a remote one, by creating a short-lived scheduled task that runs gpupdate. The most important detail for beginners: by default the refresh does not start straight away. The cmdlet adds a random delay (the -RandomDelayInMinutes default is 10 minutes) so that a script targeting many computers does not hit the domain controllers all at once. Add -RandomDelayInMinutes 0 when you want the refresh to begin now. By default only changed settings are processed; -Force re-applies all settings, like gpupdate /force.',
    parameters: [
      { name: '-Computer', type: 'String', required: false, position: 0, pipelineInput: 'ByValue', description: 'The computer to refresh, such as SRV-CORE01 or CORP\\CLIENT01. Leave it out to refresh the computer you are on.' },
      { name: '-RandomDelayInMinutes', type: 'Int32', required: false, position: 1, pipelineInput: 'False', description: 'How long to wait (plus a random offset) before the refresh starts. The default is 10 minutes. Use 0 to start immediately. The maximum is 44640 minutes (31 days).' },
      { name: '-Target', type: 'String', required: false, pipelineInput: 'False', description: 'Limits the refresh to User or Computer settings. Without it, both are refreshed.' },
      { name: '-Force', type: 'SwitchParameter', required: false, pipelineInput: 'False', description: 'Re-applies all policy settings, not only the changed ones, and does not ask for confirmation. Use it only when you are troubleshooting, because it creates extra load.' },
      { name: '-Boot', type: 'SwitchParameter', required: false, pipelineInput: 'False', description: 'Restarts the computer after the refresh, only if a policy extension (such as per-computer software installation) needs it. Plan this carefully.' },
      { name: '-LogOff', type: 'SwitchParameter', required: false, pipelineInput: 'False', description: 'Logs the current user off after the refresh, only if a policy extension (such as Folder Redirection) needs it.' },
      { name: '-AsJob', type: 'SwitchParameter', required: false, pipelineInput: 'False', description: 'Runs the cmdlet as a background job so your prompt returns immediately.' },
    ],
    practicalExamples: [
      {
        title: 'Refresh a Remote Client Right Now',
        description: 'Skip the default random delay and refresh only the computer half of the policy on CLIENT01.',
        code: `Invoke-GPUpdate -Computer CLIENT01 -Target Computer -RandomDelayInMinutes 0`,
        illustrativeOutput: `(No output on success. The refresh is scheduled on CLIENT01 and the changed computer settings are applied within moments.)`,
        explanation: 'Without -RandomDelayInMinutes 0, nothing would happen for roughly ten minutes, and many people wrongly decide the command failed. The remote machine must allow Remote Scheduled Tasks Management and WMI through its firewall.',
      },
      {
        title: 'Refresh Several Lab Machines in the Background',
        description: 'Loop over a list of computers and run each refresh as a job.',
        code: `$targets = "SRV-CORE01", "CLIENT01"
foreach ($pc in $targets) {
    Invoke-GPUpdate -Computer $pc -RandomDelayInMinutes 0 -AsJob
}
Get-Job | Wait-Job | Receive-Job`,
        illustrativeOutput: `(No output on success. Get-Job shows each job as Completed.)`,
        explanation: 'Jobs let the refreshes run in parallel. In a real environment keep the default delay (or a larger one) when you target hundreds of computers.',
      },
      {
        title: 'Force Re-Application While Troubleshooting',
        description: 'Re-apply every setting on the local machine after a policy change that did not seem to arrive.',
        code: `Invoke-GPUpdate -Force -RandomDelayInMinutes 0`,
        illustrativeOutput: `(No output on success. Run gpresult /r afterwards to confirm which GPOs applied.)`,
        explanation: '-Force is the equivalent of gpupdate /force. Reserve it for troubleshooting, not for routine scripts.',
      },
    ],
    commonMistakes: [
      'Not realising the default delay is 10 minutes and concluding the command did nothing. Add -RandomDelayInMinutes 0 when you want it now.',
      'Using -Force every time. It re-processes every setting and wastes domain controller and network resources.',
      'Adding -Boot or -LogOff casually. They can restart the machine or sign the user out if a policy extension requires it.',
    ],
    troubleshooting: 'If a remote refresh errors with "RPC server is unavailable" or "Access is denied", open the Remote Scheduled Tasks Management and Windows Management Instrumentation firewall groups on the target and make sure you have administrator rights there. To prove what actually applied, follow up with Get-GPResultantSetOfPolicy. NOTE: the GroupPolicy module is not installed on the machine used to verify this reference, so parameters were checked against the Microsoft documentation only.',
    relatedCommands: ['Get-GPO', 'Get-GPResultantSetOfPolicy', 'Register-ScheduledTask'],
    relatedLessonPath: '/learn/chapter-13/gpo-rsop-and-scheduled-tasks',
    isEssentialPocketknife: false,
  },
  {
    name: 'Get-GPResultantSetOfPolicy',
    verb: 'Get',
    noun: 'GPResultantSetOfPolicy',
    module: 'GroupPolicy',
    purpose: 'Create a Resultant Set of Policy (RSoP) report that shows which Group Policy settings actually applied to a user and computer, and which GPO won.',
    syntax: 'Get-GPResultantSetOfPolicy -ReportType <ReportType> -Path <String> [-Computer <String>] [-User <String>]',
    description:
      'When several GPOs configure the same setting, only one wins. Resultant Set of Policy (RSoP) is the final answer: the settings that really ended up on a machine and which GPO supplied each one. Get-GPResultantSetOfPolicy writes that answer to a file. You must tell it the format with -ReportType (Html is easiest to read, Xml is easiest to process with a script) and where to save it with -Path; both are required. Open the HTML file in a browser to read it. Run it from an elevated prompt if you want the computer settings, because a non-admin session may produce a report that is missing them.',
    parameters: [
      { name: '-ReportType', type: 'ReportType', required: true, pipelineInput: 'False', description: 'The file format: Html (for humans) or Xml (for scripts and comparisons).' },
      { name: '-Path', type: 'String', required: true, pipelineInput: 'False', description: 'The full path of the report file to create, for example C:\\Reports\\CLIENT01-rsop.html.' },
      { name: '-Computer', type: 'String', required: false, pipelineInput: 'False', description: 'The computer to report on. If you leave it out, the local computer is used.' },
      { name: '-User', type: 'String', required: false, pipelineInput: 'False', description: 'The user to report on, in DOMAIN\\user form. If you leave it out, the current user is used.' },
    ],
    practicalExamples: [
      {
        title: 'Create an HTML Report for the Local Machine',
        description: 'Produce a readable report and open it in the browser.',
        code: `New-Item -ItemType Directory -Path C:\\Reports -Force | Out-Null
Get-GPResultantSetOfPolicy -ReportType Html -Path C:\\Reports\\rsop-local.html
Start-Process C:\\Reports\\rsop-local.html`,
        illustrativeOutput: `(The cmdlet writes C:\\Reports\\rsop-local.html. The report lists applied GPOs, denied GPOs and each winning setting.)`,
        explanation: 'Always include both -ReportType and -Path. The report tells you the "Winning GPO" for each setting, which is how you solve conflicts between the domain GPO and an OU GPO.',
      },
      {
        title: 'Report on a Specific User and Computer (Lab)',
        description: 'Check what a lab user receives on CLIENT01 as an XML file for later comparison.',
        code: `Get-GPResultantSetOfPolicy -Computer CLIENT01 -User "CORP\\alice" -ReportType Xml -Path C:\\Reports\\alice-client01.xml`,
        illustrativeOutput: `(The cmdlet writes C:\\Reports\\alice-client01.xml.)`,
        explanation: 'The Xml format is ideal for storing a baseline and comparing it after a GPO change. The user must have logged on to that computer at least once.',
      },
    ],
    commonMistakes: [
      'Leaving out -ReportType or -Path. Both are required and the command fails without them.',
      'Running it in a normal (non-elevated) window and getting a report that is missing the computer settings.',
      'Treating the report as live. It describes the state at the moment it was created, so run Invoke-GPUpdate first if you just changed a policy.',
    ],
    troubleshooting: 'If the report is empty or errors out, the target computer may not be reachable over WMI, or the user may never have logged on there. As a quick cross-check, gpresult /r (summary) or gpresult /h report.html (HTML) gives similar information using a built-in tool. NOTE: the GroupPolicy module is not installed on the machine used to verify this reference, so parameters were checked against the Microsoft documentation only.',
    relatedCommands: ['Get-GPO', 'Invoke-GPUpdate', 'Start-Process'],
    relatedLessonPath: '/learn/chapter-13/gpo-rsop-and-scheduled-tasks',
    isEssentialPocketknife: false,
  },
  {
    name: 'Get-ScheduledTask',
    verb: 'Get',
    noun: 'ScheduledTask',
    module: 'ScheduledTasks',
    purpose: 'List Windows scheduled tasks and read their actions, triggers, principal and state.',
    syntax: 'Get-ScheduledTask [[-TaskName] <String[]>] [[-TaskPath] <String[]>] [-CimSession <CimSession[]>]',
    description:
      'Task Scheduler runs programs and scripts automatically at a set time, at logon, or at startup. Get-ScheduledTask shows you what is configured. Each task has a name, a folder-like path (for example \\Microsoft\\Windows\\Defrag\\), a state (Ready, Running, Disabled), and sub-objects: Actions (what runs), Triggers (when it runs) and Principal (which account it runs as). It is a favourite tool for defenders, because attackers who gain access often create a scheduled task to keep coming back (persistence). Reviewing tasks that run as SYSTEM or that call PowerShell is a good habit. The cmdlet is read-only. To see when a task last ran, pipe it to Get-ScheduledTaskInfo.',
    parameters: [
      { name: '-TaskName', type: 'String[]', required: false, position: 0, pipelineInput: 'ByPropertyName', description: 'The task name. Supports wildcards such as "*Update*".' },
      { name: '-TaskPath', type: 'String[]', required: false, position: 1, pipelineInput: 'ByPropertyName', description: 'The folder the task lives in, for example "\\Microsoft\\Windows\\Defrag\\". Remember the leading and trailing backslash.' },
      { name: '-CimSession', type: 'CimSession[]', required: false, pipelineInput: 'False', description: 'Runs the query on remote computers through a CIM session.' },
    ],
    practicalExamples: [
      {
        title: 'Find Tasks in One Folder',
        description: 'List the built-in disk defragmentation task and its state.',
        code: `Get-ScheduledTask -TaskPath "\\Microsoft\\Windows\\Defrag\\" | Select-Object TaskPath, TaskName, State`,
        illustrativeOutput: `TaskPath                   TaskName        State
--------                   --------        -----
\\Microsoft\\Windows\\Defrag\\ ScheduledDefrag Ready`,
        explanation: 'The trailing backslash on -TaskPath matters. Without it the path does not match.',
      },
      {
        title: 'See When a Task Last Ran and What It Returned',
        description: 'Pipe the task into Get-ScheduledTaskInfo for run history details.',
        code: `Get-ScheduledTask -TaskName ScheduledDefrag | Get-ScheduledTaskInfo | Format-List LastRunTime, LastTaskResult, NextRunTime`,
        illustrativeOutput: `LastRunTime    : 11/2/2026 12:17:06 PM
LastTaskResult : 0
NextRunTime    :`,
        explanation: 'A LastTaskResult of 0 means the last run succeeded. Any other number is an error code worth searching. An empty NextRunTime means the task is triggered by an event or idle state rather than a clock.',
      },
      {
        title: 'Hunt for Suspicious Tasks That Launch PowerShell (Defensive Audit)',
        description: 'Review enabled tasks whose action calls powershell.exe, so you can confirm each one is expected.',
        code: `Get-ScheduledTask |
    Where-Object { $_.State -ne "Disabled" -and $_.Actions.Execute -like "*powershell*" } |
    Select-Object TaskPath, TaskName, @{N="RunAs";E={$_.Principal.UserId}}, @{N="Arguments";E={$_.Actions.Arguments}}`,
        illustrativeOutput: `TaskPath TaskName          RunAs  Arguments
-------- --------          -----  ---------
\\        Nightly-Cleanup    SYSTEM -NoProfile -ExecutionPolicy RemoteSigned -File C:\\Scripts\\Cleanup.ps1`,
        explanation: 'Each hit should be a task you or your team created. Check who can edit the script file with Get-Acl, because a writable script run by SYSTEM is a privilege escalation risk.',
      },
    ],
    commonMistakes: [
      'Forgetting the backslashes in -TaskPath (use "\\Microsoft\\Windows\\Defrag\\", with a slash at the start and the end).',
      'Looking for the last run time on the task object. It is on Get-ScheduledTaskInfo, not on Get-ScheduledTask.',
      'Using Select-Object on the task and expecting to see the script path. It is nested: $_.Actions.Execute and $_.Actions.Arguments.',
    ],
    troubleshooting: 'If the list is huge, filter by -TaskPath or use Where-Object. Some tasks are only visible when you run the console as Administrator. If the task name looks odd (for example a long name ending in a SID), it was created per user by an installer, which is normal for browser and OneDrive updaters.',
    relatedCommands: ['Register-ScheduledTask', 'Get-Acl', 'Where-Object'],
    relatedLessonPath: '/learn/chapter-13/gpo-rsop-and-scheduled-tasks',
    isEssentialPocketknife: false,
  },
  {
    name: 'Register-ScheduledTask',
    verb: 'Register',
    noun: 'ScheduledTask',
    module: 'ScheduledTasks',
    purpose: 'Create a new scheduled task (or update an existing one) from an action, a trigger and a principal that you build first.',
    syntax: 'Register-ScheduledTask [-TaskName] <String> [[-TaskPath] <String>] [-Action] <CimInstance[]> [[-Trigger] <CimInstance[]>] [[-Settings] <CimInstance>] [[-Principal] <CimInstance>] [[-Description] <String>] [-Force]',
    description:
      'Register-ScheduledTask saves a task into Task Scheduler. It does not build the task for you, you assemble three small pieces first: New-ScheduledTaskAction (what to run), New-ScheduledTaskTrigger (when to run) and New-ScheduledTaskPrincipal (which account to run as, and with what privilege). Then you hand those objects to Register-ScheduledTask. This is the safe, repeatable way to automate a script. Security matters here: a task that runs as SYSTEM will run whatever is in the script file, so anyone who can edit that file can run code as SYSTEM. Always store the script in a folder that only administrators can write to, and use -ExecutionPolicy RemoteSigned (or a signed script with AllSigned) instead of bypassing the policy. Register-ScheduledTask has no -WhatIf, so practise in the lab and remove test tasks with Unregister-ScheduledTask.',
    parameters: [
      { name: '-TaskName', type: 'String', required: true, position: 0, pipelineInput: 'False', description: 'The name of the new task, for example Nightly-Cleanup.' },
      { name: '-TaskPath', type: 'String', required: false, position: 1, pipelineInput: 'False', description: 'The Task Scheduler folder to put the task in. Defaults to the root (\\). Use a custom folder like \\LabTasks\\ to keep your tasks together.' },
      { name: '-Action', type: 'CimInstance[]', required: true, position: 2, pipelineInput: 'False', description: 'One or more actions created with New-ScheduledTaskAction.' },
      { name: '-Trigger', type: 'CimInstance[]', required: false, position: 3, pipelineInput: 'False', description: 'One or more triggers created with New-ScheduledTaskTrigger (Daily, Weekly, AtStartup, AtLogOn, Once).' },
      { name: '-Settings', type: 'CimInstance', required: false, position: 4, pipelineInput: 'False', description: 'Extra behaviour such as run on battery or stop after a time limit, created with New-ScheduledTaskSettingsSet.' },
      { name: '-Principal', type: 'CimInstance', required: false, position: 5, pipelineInput: 'False', description: 'The account and privilege level, created with New-ScheduledTaskPrincipal. Cannot be combined with -User.' },
      { name: '-Description', type: 'String', required: false, pipelineInput: 'False', description: 'A human-readable note explaining why the task exists and who owns it.' },
      { name: '-Force', type: 'SwitchParameter', required: false, pipelineInput: 'False', description: 'Overwrites an existing task of the same name without asking.' },
    ],
    practicalExamples: [
      {
        title: 'Run a Cleanup Script Every Night as SYSTEM (Lab)',
        description: 'Build the action, trigger and principal, then register the task.',
        code: `$action    = New-ScheduledTaskAction -Execute "powershell.exe" -Argument '-NoProfile -ExecutionPolicy RemoteSigned -File "C:\\Scripts\\Cleanup.ps1"'
$trigger   = New-ScheduledTaskTrigger -Daily -At 3am
$principal = New-ScheduledTaskPrincipal -UserId "NT AUTHORITY\\SYSTEM" -LogonType ServiceAccount -RunLevel Highest
Register-ScheduledTask -TaskName "Nightly-Cleanup" -Action $action -Trigger $trigger -Principal $principal -Description "Lab: removes old temp files"`,
        illustrativeOutput: `TaskPath TaskName        State
-------- --------        -----
\\        Nightly-Cleanup Ready`,
        explanation: 'RemoteSigned lets local scripts run and requires downloaded scripts to be signed. Never use -ExecutionPolicy Bypass in a task that runs with high privilege. The script folder C:\\Scripts must only be writable by administrators (see the next example).',
      },
      {
        title: 'Check Who Can Edit the Script Before You Trust the Task',
        description: 'Verify that normal users cannot change the file the task runs.',
        code: `(Get-Acl C:\\Scripts\\Cleanup.ps1).Access |
    Where-Object { $_.FileSystemRights -match "Write|Modify|FullControl" } |
    Select-Object IdentityReference, FileSystemRights, AccessControlType`,
        illustrativeOutput: `IdentityReference          FileSystemRights AccessControlType
-----------------          ---------------- -----------------
NT AUTHORITY\\SYSTEM            FullControl             Allow
BUILTIN\\Administrators         FullControl             Allow`,
        explanation: 'Only SYSTEM and Administrators should appear. If BUILTIN\\Users or Everyone shows up with write access, tighten the folder permissions (for example with icacls) before you register the task.',
      },
      {
        title: 'Weekly Task With the Simple -User Form (Lab)',
        description: 'A shorter way to run a weekly job as SYSTEM, then remove the practice task.',
        code: `$action  = New-ScheduledTaskAction -Execute "powershell.exe" -Argument '-NoProfile -ExecutionPolicy RemoteSigned -File "C:\\Scripts\\Report.ps1"'
$trigger = New-ScheduledTaskTrigger -Weekly -DaysOfWeek Sunday -At 2am
Register-ScheduledTask -TaskName "Weekly-Report" -TaskPath "\\LabTasks\\" -Action $action -Trigger $trigger -User "NT AUTHORITY\\SYSTEM" -RunLevel Highest
Unregister-ScheduledTask -TaskName "Weekly-Report" -TaskPath "\\LabTasks\\" -Confirm:$false`,
        illustrativeOutput: `TaskPath    TaskName      State
--------    --------      -----
\\LabTasks\\ Weekly-Report Ready`,
        explanation: '-User and -RunLevel are an alternative to building a principal object. You cannot mix -User with -Principal in one command. The last line cleans up the lab task.',
      },
    ],
    commonMistakes: [
      'Using -ExecutionPolicy Bypass to make a script run. It disables a safety net for a task that may run as SYSTEM. Use RemoteSigned or sign the script.',
      'Leaving the script in a folder that normal users can edit. Anyone who can change the file controls what the task runs.',
      'Running the task as a personal admin account with a stored password. Prefer SYSTEM, a group managed service account, or a dedicated low-privilege service account.',
      'Forgetting -RunLevel Highest or admin rights when registering a task that needs elevation, then wondering why it fails silently.',
    ],
    troubleshooting: 'If registration fails with "Access is denied", open PowerShell as Administrator. If the task registers but does nothing, run Get-ScheduledTask -TaskName <name> | Get-ScheduledTaskInfo and look at LastTaskResult (0 means success), then run the script by hand with the same arguments. Check the path quoting inside -Argument: paths with spaces need their own double quotes inside the single-quoted string. Use Start-ScheduledTask to test a run on demand.',
    relatedCommands: ['Get-ScheduledTask', 'Get-Acl', 'Get-ExecutionPolicy'],
    relatedLessonPath: '/learn/chapter-13/gpo-rsop-and-scheduled-tasks',
    isEssentialPocketknife: false,
  },
  {
    name: 'Get-HotFix',
    verb: 'Get',
    noun: 'HotFix',
    module: 'Microsoft.PowerShell.Management',
    purpose: 'List the Windows updates (KB numbers) installed on the local or a remote computer.',
    syntax: 'Get-HotFix [[-Id] <String[]>] [-ComputerName <String[]>] [-Credential <PSCredential>]\nGet-HotFix [-Description <String[]>] [-ComputerName <String[]>] [-Credential <PSCredential>]',
    description:
      'Microsoft ships fixes as updates with names like KB5127648. Get-HotFix asks Windows which of those updates are installed, so you can answer questions such as "did this server get last month\'s security patch?" without opening Windows Update. Each result has HotFixID, Description (Update, Security Update, Hotfix), InstalledBy and InstalledOn. It is a read-only patch check, ideal for quick audits across your lab machines. Be aware that it reads the Win32_QuickFixEngineering list, which does not include every kind of update (for example, some feature updates or definition updates may be missing), so an empty answer is not absolute proof that something is not installed.',
    parameters: [
      { name: '-Id', type: 'String[]', required: false, position: 0, pipelineInput: 'False', description: 'One or more KB identifiers to look for, such as KB5127648.' },
      { name: '-Description', type: 'String[]', required: false, pipelineInput: 'False', description: 'Filters on the update type, for example "Security Update". Wildcards are allowed.' },
      { name: '-ComputerName', type: 'String[]', required: false, pipelineInput: 'ByPropertyName', description: 'The computers to query. The default is the local computer.' },
      { name: '-Credential', type: 'PSCredential', required: false, pipelineInput: 'False', description: 'A credential for the remote computer, from Get-Credential. Never type a password in a script.' },
    ],
    practicalExamples: [
      {
        title: 'Show the Three Most Recent Updates',
        description: 'A quick look at how fresh the patch level is.',
        code: `Get-HotFix | Sort-Object InstalledOn -Descending | Select-Object -First 3 Source, Description, HotFixID, InstalledBy, InstalledOn`,
        illustrativeOutput: `Source   Description     HotFixID  InstalledBy         InstalledOn
------   -----------     --------  -----------         -----------
CLIENT01 Security Update KB5127648 NT AUTHORITY\\SYSTEM 10/15/2026 12:00:00 AM
CLIENT01 Update          KB5127690 NT AUTHORITY\\SYSTEM 10/15/2026 12:00:00 AM
CLIENT01 Security Update KB5127647 NT AUTHORITY\\SYSTEM 10/14/2026 12:00:00 AM`,
        explanation: 'Sorting by InstalledOn puts the newest first. InstalledOn only has a date, so several updates share the same time of 12:00 AM.',
      },
      {
        title: 'Check Whether a Specific Patch Is Installed',
        description: 'Return a simple True or False for a KB you were told to deploy.',
        code: `[bool](Get-HotFix -Id KB5127648 -ErrorAction SilentlyContinue)`,
        illustrativeOutput: `True`,
        explanation: 'Get-HotFix writes an error when the KB is not found, so -ErrorAction SilentlyContinue turns "not installed" into an empty result that casts to False.',
      },
      {
        title: 'Compare Patch Levels Across Lab Servers',
        description: 'Query SRV-CORE01 and DC01 at once (lab, read-only).',
        code: `Get-HotFix -ComputerName SRV-CORE01, DC01 -Description "Security Update" |
    Group-Object Source |
    Select-Object Name, Count`,
        illustrativeOutput: `Name       Count
----       -----
SRV-CORE01    14
DC01          15`,
        explanation: 'Grouping by computer gives a count of security updates per server. A server with a clearly lower count is a patching gap to investigate. The remote machines must allow remote management (WMI/DCOM or WinRM depending on version).',
      },
    ],
    commonMistakes: [
      'Concluding a machine is unpatched because a KB is missing from the list. Some update types do not appear, so confirm with Windows Update history too.',
      'Typing the KB number without the "KB" prefix. Use KB5127648, not 5127648.',
      'Passing a plain password for -Credential. Use Get-Credential so the secret is never stored in the script.',
    ],
    troubleshooting: 'If a remote query fails with "RPC server is unavailable" or "Access is denied", check that the firewall allows Windows Management Instrumentation and that you are a local administrator on the target. If InstalledOn is empty for some updates, the update did not record a date, which is normal for a few older packages.',
    relatedCommands: ['Get-ComputerInfo', 'Get-Credential', 'Group-Object'],
    relatedLessonPath: '/learn/chapter-09/hands-on-admin-workout',
    isEssentialPocketknife: false,
  },
  {
    name: 'Write-Error',
    verb: 'Write',
    noun: 'Error',
    module: 'Microsoft.PowerShell.Utility',
    purpose: 'Report a non-terminating error to the error stream so callers can detect and handle a problem.',
    syntax: 'Write-Error [-Message] <String> [-Category <ErrorCategory>] [-ErrorId <String>] [-TargetObject <Object>] [-RecommendedAction <String>]\nWrite-Error -Exception <Exception> [-Message <String>] [-Category <ErrorCategory>]\nWrite-Error -ErrorRecord <ErrorRecord>',
    description:
      'Write-Error is how your own functions and scripts say "something went wrong". By default it creates a non-terminating error: the red message appears, the error is added to $Error, but the script keeps running. That is different from the throw keyword, which creates a terminating error that stops the current code path immediately unless it is caught. You can turn a Write-Error into a stopping error by adding -ErrorAction Stop, and then try/catch will catch it. Use Write-Error when a function should report a problem about one item and carry on with the next, and use throw (or -ErrorAction Stop) when continuing would be unsafe. The extra parameters (-Category, -ErrorId, -TargetObject) make the error searchable and easy to diagnose.',
    parameters: [
      { name: '-Message', type: 'String', required: true, position: 0, pipelineInput: 'ByValue', description: 'The text of the error, written for the person who will read it. Say what failed and on which item.' },
      { name: '-Category', type: 'ErrorCategory', required: false, pipelineInput: 'False', description: 'The error type, such as ResourceUnavailable, InvalidArgument or ObjectNotFound. Shows in CategoryInfo.' },
      { name: '-ErrorId', type: 'String', required: false, pipelineInput: 'False', description: 'A short identifier of your choice (for example DiskLow) that appears in FullyQualifiedErrorId and is easy to filter on.' },
      { name: '-TargetObject', type: 'Object', required: false, pipelineInput: 'False', description: 'The object that was being processed when the error happened, such as a path or computer name.' },
      { name: '-RecommendedAction', type: 'String', required: false, pipelineInput: 'False', description: 'A hint telling the user how to fix or avoid the problem.' },
      { name: '-Exception', type: 'Exception', required: true, pipelineInput: 'False', description: 'Builds the error from an existing .NET exception object instead of a message string (separate parameter set).' },
      { name: '-ErrorRecord', type: 'ErrorRecord', required: true, pipelineInput: 'False', description: 'Re-writes a full ErrorRecord, for example the $_ you caught in a catch block (separate parameter set).' },
    ],
    practicalExamples: [
      {
        title: 'Report a Problem With Useful Detail',
        description: 'Write an error from inside a function with a category, ID and target.',
        code: `function Test-Disk {
    [CmdletBinding()]
    param([string]$Drive = "C:")
    Write-Error "Drive $Drive is almost full" -Category ResourceUnavailable -ErrorId "DiskLow" -TargetObject $Drive
}
Test-Disk`,
        illustrativeOutput: `Test-Disk : Drive C: is almost full
At line:7 char:1
+ Test-Disk
+ ~~~~~~~~~
    + CategoryInfo          : ResourceUnavailable: (C::String) [Write-Error], WriteErrorException
    + FullyQualifiedErrorId : DiskLow,Test-Disk`,
        explanation: 'The ErrorId appears in FullyQualifiedErrorId, so your monitoring or a Where-Object filter can find this exact problem later.',
      },
      {
        title: 'Turn the Error Into a Stop You Can Catch',
        description: 'Combine Write-Error with -ErrorAction Stop and try/catch.',
        code: `try {
    Write-Error "Config file missing" -ErrorAction Stop
    Write-Output "This line never runs"
}
catch {
    "Caught: " + $_.Exception.Message
}`,
        illustrativeOutput: `Caught: Config file missing`,
        explanation: 'Without -ErrorAction Stop, try/catch would not see the error at all, because ordinary Write-Error is non-terminating and the next line would run.',
      },
    ],
    commonMistakes: [
      'Expecting Write-Error to stop the script. It does not unless you add -ErrorAction Stop or set $ErrorActionPreference = "Stop".',
      'Using Write-Host "ERROR: ..." for failures. Write-Host text cannot be caught, counted in $Error or redirected as an error.',
      'Confusing Write-Error with throw. Use throw when the script must stop right here; use Write-Error when it is fine to continue with the next item.',
    ],
    troubleshooting: 'If your catch block never runs, the error was non-terminating. Add -ErrorAction Stop to the call that produces the error (or to the Write-Error itself). Review recent errors with $Error[0] | Format-List * -Force, and capture them in a variable with -ErrorVariable myErr.',
    relatedCommands: ['Write-Warning', 'Write-Verbose', 'Write-Output'],
    relatedLessonPath: '/learn/chapter-14/error-handling-and-splatting',
    isEssentialPocketknife: false,
  },
  {
    name: 'Write-Warning',
    verb: 'Write',
    noun: 'Warning',
    module: 'Microsoft.PowerShell.Utility',
    purpose: 'Show a yellow WARNING message to the user without stopping the script or creating an error.',
    syntax: 'Write-Warning [-Message] <String>',
    description:
      'Write-Warning is for "this might be a problem, but I will carry on". It prints a message starting with WARNING: in yellow and sends it to the warning stream (stream 3), separate from normal output. That means a warning does not pollute the objects your function returns, so the pipeline stays clean. How it behaves is controlled by the $WarningPreference variable (default Continue, which shows it) and by the common -WarningAction parameter on advanced functions: SilentlyContinue hides it, Stop turns it into an error. You can also collect warnings with -WarningVariable. Use it for things like "the log folder was missing so I created it", not for real failures (use Write-Error) and not for general chatter (use Write-Verbose).',
    parameters: [
      { name: '-Message', type: 'String', required: true, position: 0, pipelineInput: 'ByValue', description: 'The warning text. Keep it short and say what the user should check.' },
      { name: '-WarningAction', type: 'ActionPreference', required: false, pipelineInput: 'False', description: 'A common parameter on the function that calls Write-Warning (not on Write-Warning itself): Continue, SilentlyContinue, Stop, Inquire.' },
      { name: '-WarningVariable', type: 'String', required: false, pipelineInput: 'False', description: 'A common parameter on the calling function that saves the warning messages in a variable name you choose (give the name without a dollar sign).' },
    ],
    practicalExamples: [
      {
        title: 'Warn Without Stopping',
        description: 'Show a warning when a setting is risky but allowed.',
        code: `function Remove-OldLogs {
    [CmdletBinding()]
    param([int]$Days = 0)
    if ($Days -lt 7) { Write-Warning "Keeping only $Days days of logs is very short." }
    "Cleanup finished"
}
Remove-OldLogs -Days 2`,
        illustrativeOutput: `WARNING: Keeping only 2 days of logs is very short.
Cleanup finished`,
        explanation: 'The warning appears in yellow, but the function still returns its normal output.',
      },
      {
        title: 'Hide or Capture Warnings From a Function',
        description: 'Use the common parameters on the caller to control the warning stream.',
        code: `Remove-OldLogs -Days 2 -WarningAction SilentlyContinue
Remove-OldLogs -Days 2 -WarningAction SilentlyContinue -WarningVariable warn | Out-Null
$warn`,
        illustrativeOutput: `Cleanup finished
Keeping only 2 days of logs is very short.`,
        explanation: 'The first call shows no warning. The second saves it in $warn (the variable still collects the text even though it is not shown) so you can write it to a report. Notice -WarningVariable takes the name without a dollar sign.',
      },
    ],
    commonMistakes: [
      'Using Write-Warning for real failures. Callers cannot catch it with try/catch; use Write-Error or throw for errors.',
      'Putting a warning in the success output with Write-Output. A warning belongs in the warning stream so it does not mix with data.',
      'Setting $WarningPreference to SilentlyContinue globally and forgetting about it, which hides every warning in the session.',
    ],
    troubleshooting: 'If you see no warning, check $WarningPreference (it should be Continue) and whether the caller passed -WarningAction SilentlyContinue. To save warnings to a file, redirect stream 3: .\\script.ps1 3> warnings.txt, or use Start-Transcript to record everything.',
    relatedCommands: ['Write-Error', 'Write-Verbose', 'Write-Host'],
    relatedLessonPath: '/learn/chapter-14/error-handling-and-splatting',
    isEssentialPocketknife: false,
  },
  {
    name: 'Write-Verbose',
    verb: 'Write',
    noun: 'Verbose',
    module: 'Microsoft.PowerShell.Utility',
    purpose: 'Print optional progress and diagnostic detail that appears only when the caller asks for it.',
    syntax: 'Write-Verbose [-Message] <String>',
    description:
      'Write-Verbose is your "talk to me while you work" tool. Messages are silent by default. They appear, prefixed with VERBOSE:, only when the function is run with the -Verbose switch or when $VerbosePreference is set to Continue. This lets you leave helpful trace messages in a script permanently and turn them on only when troubleshooting. The -Verbose switch is available on advanced functions, which means functions that have [CmdletBinding()] (or a param block with [Parameter()] attributes). In a plain script without that attribute, set $VerbosePreference = "Continue" instead. Verbose text goes to its own stream (stream 4), so it never ends up inside the data your function returns.',
    parameters: [
      { name: '-Message', type: 'String', required: true, position: 0, pipelineInput: 'ByValue', description: 'The text to show when verbose output is turned on, for example "Connecting to SRV-CORE01".' },
      { name: '-Verbose', type: 'SwitchParameter', required: false, pipelineInput: 'False', description: 'A common parameter on the calling advanced function (not on Write-Verbose itself) that turns the verbose messages on for that call.' },
      { name: '$VerbosePreference', type: 'ActionPreference', required: false, pipelineInput: 'False', description: 'A preference variable, not a parameter. SilentlyContinue is the default (hidden). Set it to Continue to show all verbose messages in the session.' },
    ],
    practicalExamples: [
      {
        title: 'Trace a Function With -Verbose',
        description: 'Add verbose messages, then switch them on only when needed.',
        code: `function Get-DiskInfo {
    [CmdletBinding()]
    param([string]$Drive = "C:")
    Write-Verbose "Querying drive $Drive"
    Get-PSDrive -Name $Drive.TrimEnd(":") | Select-Object Name, Used, Free
}
Get-DiskInfo -Verbose`,
        illustrativeOutput: `VERBOSE: Querying drive C:

Name       Used        Free
----       ----        ----
C    412345678912 98765432100`,
        explanation: 'Run Get-DiskInfo without -Verbose and the VERBOSE line disappears, but the data is identical. The numbers shown are illustrative.',
      },
      {
        title: 'Turn On Verbose for the Whole Session',
        description: 'Useful when a script has no CmdletBinding and no -Verbose switch.',
        code: `$VerbosePreference = "Continue"
Write-Verbose "Starting maintenance on SRV-CORE01"
$VerbosePreference = "SilentlyContinue"
Write-Verbose "This message is hidden"`,
        illustrativeOutput: `VERBOSE: Starting maintenance on SRV-CORE01`,
        explanation: 'Always set the preference back afterwards. Leaving it at Continue can flood the console and a transcript with noise from other commands.',
      },
    ],
    commonMistakes: [
      'Expecting Write-Verbose output to appear without -Verbose or $VerbosePreference = "Continue". It is hidden by default.',
      'Trying -Verbose on a plain function that has no [CmdletBinding()]. Add the attribute so the common parameters exist.',
      'Putting passwords or tokens into verbose messages. Verbose text can end up in transcripts and log files.',
    ],
    troubleshooting: 'If nothing prints, check $VerbosePreference and make sure the function is advanced ([CmdletBinding()]). Verbose from other cmdlets also appears when you set the preference to Continue, which can be a lot of text. To keep it in a file, use Start-Transcript or redirect stream 4 with 4> verbose.txt.',
    relatedCommands: ['Write-Warning', 'Write-Error', 'Start-Transcript'],
    relatedLessonPath: '/learn/chapter-14/advanced-functions-toolmaking',
    isEssentialPocketknife: false,
  },
  {
    name: 'Invoke-WebRequest',
    verb: 'Invoke',
    noun: 'WebRequest',
    module: 'Microsoft.PowerShell.Utility',
    purpose: 'Send an HTTP or HTTPS request and get back the full response: status code, headers and content.',
    syntax: 'Invoke-WebRequest [-Uri] <Uri> [-Method <WebRequestMethod>] [-Headers <IDictionary>] [-Body <Object>] [-ContentType <String>] [-OutFile <String>] [-UseBasicParsing] [-TimeoutSec <Int32>] [-Credential <PSCredential>]',
    description:
      'Invoke-WebRequest is PowerShell\'s web browser without the window. It fetches a URL and returns a response object with StatusCode, StatusDescription, Headers, Content and RawContent, so you can check whether a site is up, read its headers, scrape text, or download a file. In Windows PowerShell 5.1 the aliases iwr, curl and wget all point to this cmdlet (those aliases were removed in PowerShell 7+, where curl and wget run the real tools). Windows PowerShell 5.1 normally uses Internet Explorer\'s engine to parse HTML, which fails with an error on machines where IE was never set up (common on Server Core); adding -UseBasicParsing avoids that. PowerShell 7+ always uses basic parsing and ignores the switch. If you want parsed data from a JSON API, Invoke-RestMethod is usually the better choice.',
    parameters: [
      { name: '-Uri', type: 'Uri', required: true, position: 0, pipelineInput: 'False', description: 'The address to request, for example https://srv-core01.corp.example.com/health.' },
      { name: '-Method', type: 'WebRequestMethod', required: false, pipelineInput: 'False', description: 'The HTTP verb: Get (default), Head, Post, Put, Delete, Patch and others.' },
      { name: '-Headers', type: 'IDictionary', required: false, pipelineInput: 'False', description: 'A hashtable of request headers, such as @{ Accept = "application/json" }.' },
      { name: '-Body', type: 'Object', required: false, pipelineInput: 'ByValue', description: 'The data to send with Post or Put requests: a string, a hashtable (sent as form data) or JSON text.' },
      { name: '-OutFile', type: 'String', required: false, pipelineInput: 'False', description: 'Saves the response content to a file instead of showing it. This is how you download files.' },
      { name: '-UseBasicParsing', type: 'SwitchParameter', required: false, pipelineInput: 'False', description: 'Skips the Internet Explorer HTML engine. Needed on Windows PowerShell 5.1 when IE is not initialised. You lose ParsedHtml and similar DOM properties.' },
      { name: '-TimeoutSec', type: 'Int32', required: false, pipelineInput: 'False', description: 'How many seconds to wait before giving up, so a hung server does not freeze your script.' },
      { name: '-Credential', type: 'PSCredential', required: false, pipelineInput: 'False', description: 'A credential object for sites that need authentication. Create it with Get-Credential, never hard-code a password.' },
    ],
    practicalExamples: [
      {
        title: 'Check That an Internal Site Is Up',
        description: 'Request a page and look only at the status.',
        code: `$r = Invoke-WebRequest -Uri "https://srv-core01.corp.example.com/health" -UseBasicParsing -TimeoutSec 10
$r | Select-Object StatusCode, StatusDescription`,
        illustrativeOutput: `StatusCode StatusDescription
---------- -----------------
       200 OK`,
        explanation: 'A 200 means success. In Windows PowerShell 5.1, a 404 or 500 response throws an error instead of returning, so wrap the call in try/catch for monitoring scripts.',
      },
      {
        title: 'Read Response Headers Without Downloading the Page',
        description: 'Use the Head method to inspect server and security headers (lab, defensive).',
        code: `$r = Invoke-WebRequest -Uri "https://srv-core01.corp.example.com" -Method Head -UseBasicParsing
$r.Headers["Server"]
$r.Headers["Strict-Transport-Security"]`,
        illustrativeOutput: `Microsoft-IIS/10.0
max-age=31536000`,
        explanation: 'Checking for headers such as Strict-Transport-Security is a simple hardening review. A missing value comes back empty.',
      },
      {
        title: 'Download a File and Verify Its Hash',
        description: 'Save an installer to disk and compare its SHA256 with the value the vendor published.',
        code: `New-Item -ItemType Directory -Path C:\\LabDownloads -Force | Out-Null
Invoke-WebRequest -Uri "https://srv-core01.corp.example.com/tools/agent.msi" -OutFile C:\\LabDownloads\\agent.msi -UseBasicParsing
Get-FileHash C:\\LabDownloads\\agent.msi -Algorithm SHA256`,
        illustrativeOutput: `Algorithm       Hash                                                                   Path
---------       ----                                                                   ----
SHA256          9F2B...C41A                                                            C:\\LabDownloads\\agent.msi`,
        explanation: 'Download first, verify second, run last. Never pipe downloaded text straight into Invoke-Expression (iex), because that runs unchecked code from the internet.',
      },
    ],
    commonMistakes: [
      'Forgetting -UseBasicParsing on Windows PowerShell 5.1 and getting "The response content cannot be parsed because the Internet Explorer engine is not available".',
      'Piping downloaded content into Invoke-Expression. This runs whatever the server returns and is a classic way to get compromised. Save it, inspect it and check its hash.',
      'Expecting curl to be the real curl.exe on Windows PowerShell 5.1. There it is only an alias for Invoke-WebRequest, and curl options like -I do not work. Use curl.exe to run the real tool.',
      'Using it on a JSON API and then parsing .Content by hand. Invoke-RestMethod does that for you.',
    ],
    troubleshooting: 'If you get "The underlying connection was closed" or a TLS error on Windows PowerShell 5.1, the session may be trying an old protocol: run [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12 first. For certificate errors, fix the certificate or trust chain rather than disabling validation. When a request hangs, add -TimeoutSec. To see the real status of a failed call, catch the exception and read $_.Exception.Response.StatusCode.',
    relatedCommands: ['Invoke-RestMethod', 'Test-NetConnection', 'Out-File'],
    relatedLessonPath: '/learn/chapter-15/in-memory-cradles-and-evasion',
    isEssentialPocketknife: false,
  },
  {
    name: 'Invoke-RestMethod',
    verb: 'Invoke',
    noun: 'RestMethod',
    module: 'Microsoft.PowerShell.Utility',
    purpose: 'Call a REST web API and get the response back as PowerShell objects, with JSON and XML parsed automatically.',
    syntax: 'Invoke-RestMethod [-Uri] <Uri> [-Method <WebRequestMethod>] [-Headers <IDictionary>] [-Body <Object>] [-ContentType <String>] [-UseDefaultCredentials] [-Credential <PSCredential>] [-TimeoutSec <Int32>] [-UseBasicParsing]',
    description:
      'Invoke-RestMethod is built for APIs. Where Invoke-WebRequest hands you the raw web response, Invoke-RestMethod looks at the content type and converts it for you: JSON becomes real objects with properties you can pipe into Select-Object or Where-Object, and XML becomes an XML document. You do not need ConvertFrom-Json. That is why admins use it to talk to cloud services, monitoring tools and internal inventory systems. To send data, use -Method Post (or Put, Patch, Delete) with -Body, and set -ContentType application/json when the body is JSON text. The alias is irm (Windows PowerShell 5.1 and PowerShell 7+). PowerShell 7+ adds extras such as -Authentication and -Token for bearer tokens; in Windows PowerShell 5.1 you add an Authorization header yourself.',
    parameters: [
      { name: '-Uri', type: 'Uri', required: true, position: 0, pipelineInput: 'False', description: 'The API endpoint, for example https://api.github.com/repos/PowerShell/PowerShell.' },
      { name: '-Method', type: 'WebRequestMethod', required: false, pipelineInput: 'False', description: 'The HTTP verb. Get is the default; use Post, Put, Patch or Delete to change data.' },
      { name: '-Headers', type: 'IDictionary', required: false, pipelineInput: 'False', description: 'A hashtable of headers, such as @{ Accept = "application/json" }. Authorization headers go here in Windows PowerShell 5.1.' },
      { name: '-Body', type: 'Object', required: false, pipelineInput: 'ByValue', description: 'The data to send. Usually JSON text built with ConvertTo-Json.' },
      { name: '-ContentType', type: 'String', required: false, pipelineInput: 'False', description: 'Tells the server what the body is, for example application/json.' },
      { name: '-UseDefaultCredentials', type: 'SwitchParameter', required: false, pipelineInput: 'False', description: 'Sends your current Windows identity (Kerberos or NTLM), which suits internal APIs in the domain.' },
      { name: '-Credential', type: 'PSCredential', required: false, pipelineInput: 'False', description: 'A credential object from Get-Credential for APIs that use basic or Windows authentication.' },
      { name: '-TimeoutSec', type: 'Int32', required: false, pipelineInput: 'False', description: 'The number of seconds to wait before the request fails.' },
    ],
    practicalExamples: [
      {
        title: 'Read a Public JSON API',
        description: 'Fetch repository information from GitHub and pick out three fields.',
        code: `Invoke-RestMethod -Uri "https://api.github.com/repos/PowerShell/PowerShell" |
    Select-Object name, default_branch, open_issues_count`,
        illustrativeOutput: `name       default_branch open_issues_count
----       -------------- -----------------
PowerShell master                      4200`,
        explanation: 'No parsing step is needed: the JSON arrived as an object, so Select-Object works on its properties. The issue count is illustrative and changes daily.',
      },
      {
        title: 'Send JSON to an Internal API (Lab)',
        description: 'Post a small inventory record to a lab web service.',
        code: `$body = @{ computer = "CLIENT01"; ip = "192.168.56.30"; role = "workstation" } | ConvertTo-Json
Invoke-RestMethod -Uri "http://srv-core01.corp.example.com:8080/api/inventory" -Method Post -Body $body -ContentType "application/json" -UseDefaultCredentials`,
        illustrativeOutput: `id  computer ip            role
--  -------- --            ----
17  CLIENT01 192.168.56.30 workstation`,
        explanation: 'ConvertTo-Json builds the body, -ContentType tells the server how to read it, and -UseDefaultCredentials proves who you are without any password in the script. Use https for anything beyond a throwaway lab.',
      },
      {
        title: 'Handle API Errors Cleanly',
        description: 'Catch a failure and report the HTTP status instead of a wall of red text.',
        code: `try {
    Invoke-RestMethod -Uri "https://srv-core01.corp.example.com/api/status" -TimeoutSec 10 -ErrorAction Stop
}
catch {
    Write-Warning "API call failed: $($_.Exception.Message)"
}`,
        illustrativeOutput: `WARNING: API call failed: The remote server returned an error: (401) Unauthorized.`,
        explanation: 'HTTP errors such as 401 or 500 raise exceptions, so try/catch with -ErrorAction Stop is the right pattern. A 401 here means you need credentials.',
      },
    ],
    commonMistakes: [
      'Running ConvertFrom-Json on the result. Invoke-RestMethod already converted it; doing it again fails.',
      'Sending a hashtable as -Body and expecting JSON. Without ConvertTo-Json it is sent as form data. Convert first and set -ContentType application/json.',
      'Hard-coding an API key or password in the script. Read secrets from a secure store or prompt with Get-Credential.',
      'Expecting a status code from the result. Invoke-RestMethod returns the data only; use Invoke-WebRequest when you need StatusCode and headers.',
    ],
    troubleshooting: 'If you get a TLS or "connection closed" error in Windows PowerShell 5.1, run [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12 and try again. If the result looks like one long string instead of objects, the server sent the wrong Content-Type; pipe it through ConvertFrom-Json. A 403 from a public API often means a missing User-Agent or token. Use -Verbose to see the request that was sent.',
    relatedCommands: ['Invoke-WebRequest', 'ConvertTo-Json', 'ConvertFrom-Json'],
    relatedLessonPath: '/learn/chapter-15/in-memory-cradles-and-evasion',
    isEssentialPocketknife: false,
  },
  {
    name: 'Test-NetConnection',
    verb: 'Test',
    noun: 'NetConnection',
    module: 'NetTCPIP',
    purpose: 'Check whether a computer answers a ping and whether a specific TCP port is open, with optional route tracing.',
    syntax: 'Test-NetConnection [[-ComputerName] <String>] [-Port <Int32>] [-InformationLevel <String>] [-TraceRoute] [-Hops <Int32>]\nTest-NetConnection [[-ComputerName] <String>] [-CommonTCPPort] <String> [-InformationLevel <String>]',
    description:
      'Test-NetConnection is the all-in-one network check. Called with just a computer name it sends a ping and shows which network adapter and route were used. Add -Port and it tries a real TCP connection to that port, which is exactly what you need to answer "is the firewall blocking WinRM?" or "is the web server listening?". It returns an object with TcpTestSucceeded set to True or False, so it is easy to use in scripts. Add -TraceRoute to see each hop on the way. Test-NetConnection is technically a function in the NetTCPIP module, and it works on Windows PowerShell 5.1 and PowerShell 7+ on Windows. Use it only against systems you own or are allowed to test. For ordinary ping-style checks, Test-Connection is the alternative.',
    parameters: [
      { name: '-ComputerName', type: 'String', required: false, position: 0, pipelineInput: 'ByValue, ByPropertyName', description: 'The host name or IP address to test. If you leave it out, a Microsoft internet connectivity test host is used instead.' },
      { name: '-Port', type: 'Int32', required: false, pipelineInput: 'ByPropertyName', description: 'The TCP port to try, from 1 to 65535. Also available under the alias -RemotePort. Adds TcpTestSucceeded to the result.' },
      { name: '-CommonTCPPort', type: 'String', required: false, position: 1, pipelineInput: 'False', description: 'A shortcut name instead of a number: HTTP, RDP, SMB or WINRM.' },
      { name: '-InformationLevel', type: 'String', required: false, pipelineInput: 'False', description: 'Quiet returns only True or False. Detailed returns extra network information (needs an elevated prompt for some data). The default is Standard.' },
      { name: '-TraceRoute', type: 'SwitchParameter', required: false, pipelineInput: 'False', description: 'Lists every router (hop) between you and the target, so you can see where traffic stops.' },
      { name: '-Hops', type: 'Int32', required: false, pipelineInput: 'False', description: 'The maximum number of hops for -TraceRoute, from 1 to 120. The default is 30.' },
    ],
    practicalExamples: [
      {
        title: 'Is WinRM Reachable on the Domain Controller?',
        description: 'Test TCP port 5985 before blaming PowerShell remoting.',
        code: `Test-NetConnection -ComputerName DC01 -Port 5985`,
        illustrativeOutput: `ComputerName     : DC01
RemoteAddress    : 192.168.56.10
RemotePort       : 5985
InterfaceAlias   : Ethernet
SourceAddress    : 192.168.56.30
TcpTestSucceeded : True`,
        explanation: 'TcpTestSucceeded True means the port accepted a connection. If it is False, either nothing is listening or a firewall is dropping the traffic. Check the rules with Get-NetFirewallRule.',
      },
      {
        title: 'Return Just True or False for a Script',
        description: 'Check several ports on a lab server and build a tidy table.',
        code: `foreach ($port in 135, 445, 5985) {
    [pscustomobject]@{
        Port = $port
        Open = Test-NetConnection -ComputerName SRV-CORE01 -Port $port -InformationLevel Quiet -WarningAction SilentlyContinue
    }
}`,
        illustrativeOutput: `Port  Open
----  ----
 135  True
 445  True
5985 False`,
        explanation: '-InformationLevel Quiet gives a plain Boolean, which is ideal for if statements. -WarningAction SilentlyContinue hides the yellow "TCP connect failed" message for closed ports. Closed ports can take a few seconds to time out.',
      },
      {
        title: 'Trace the Route to Another Subnet',
        description: 'See each hop between CLIENT01 and SRV-CORE01.',
        code: `Test-NetConnection -ComputerName SRV-CORE01 -TraceRoute`,
        illustrativeOutput: `ComputerName           : SRV-CORE01
RemoteAddress          : 192.168.56.20
InterfaceAlias         : Ethernet
SourceAddress          : 192.168.56.30
PingSucceeded          : True
PingReplyDetails (RTT) : 1 ms
TraceRoute             : 192.168.56.20`,
        explanation: 'On a flat lab network there is only one hop. On a larger network each router appears on its own line, and a row of timeouts shows where traffic stops.',
      },
    ],
    commonMistakes: [
      'Treating PingSucceeded False as "the server is down". Many firewalls block ICMP on purpose. Test the real service with -Port.',
      'Forgetting -Port and then thinking the service is fine because the ping worked. A ping says nothing about a specific port.',
      'Testing a UDP service. Test-NetConnection only checks TCP ports.',
    ],
    troubleshooting: 'If TcpTestSucceeded is False, confirm the service is running on the target (Get-Service), that it listens on that port, and that the Windows firewall rule is enabled for the right profile (Get-NetFirewallRule). A name that does not resolve shows "Name resolution failed", so check DNS or use the IP address. Packet loss tools and VPNs can also change the route shown.',
    relatedCommands: ['Test-Connection', 'Get-NetFirewallRule', 'Test-WSMan'],
    relatedLessonPath: '/learn/chapter-15/offensive-recon-and-ad-enum',
    isEssentialPocketknife: false,
  },
  {
    name: 'Get-Acl',
    verb: 'Get',
    noun: 'Acl',
    module: 'Microsoft.PowerShell.Security',
    purpose: 'Read the security descriptor of a file, folder, registry key or other secured object: its owner and its access control list.',
    syntax: 'Get-Acl [[-Path] <String[]>] [-Audit]\nGet-Acl -LiteralPath <String[]> [-Audit]\nGet-Acl -InputObject <PSObject> [-Audit]',
    description:
      'Every file, folder and registry key in Windows has an Access Control List (ACL): a list of who may do what. Get-Acl reads it without changing anything. The object it returns has an Owner, a Group, the Sddl text form, and above all an Access collection with one entry per permission rule. Each entry shows the IdentityReference (user or group), the FileSystemRights (such as FullControl or ReadAndExecute), whether it is Allow or Deny, and whether it was inherited from a parent folder. Defenders use Get-Acl to find folders that ordinary users can write to, which is a common route to privilege escalation. To change permissions you would use Set-Acl, so Get-Acl is the safe look-before-you-touch step.',
    parameters: [
      { name: '-Path', type: 'String[]', required: false, position: 0, pipelineInput: 'ByValue, ByPropertyName', description: 'The file, folder or registry key to inspect. Wildcards are allowed. If you give no path, the current location is used.' },
      { name: '-LiteralPath', type: 'String[]', required: false, pipelineInput: 'ByValue, ByPropertyName', description: 'Like -Path but wildcards are not interpreted. Use it for names that contain brackets or other special characters.' },
      { name: '-InputObject', type: 'PSObject', required: true, pipelineInput: 'False', description: 'An existing object whose security descriptor you want, used instead of a path.' },
      { name: '-Audit', type: 'SwitchParameter', required: false, pipelineInput: 'False', description: 'Also returns the audit rules (SACL) that log access attempts. Needs an elevated prompt.' },
    ],
    practicalExamples: [
      {
        title: 'See Who Owns a File and Who Can Use It',
        description: 'Inspect the permissions on the hosts file.',
        code: `$acl = Get-Acl "$env:windir\\System32\\drivers\\etc\\hosts"
$acl | Format-List Owner, Group
$acl.Access | Select-Object IdentityReference, FileSystemRights, AccessControlType, IsInherited`,
        illustrativeOutput: `Owner : BUILTIN\\Administrators
Group : NT AUTHORITY\\SYSTEM

IdentityReference                 FileSystemRights AccessControlType IsInherited
-----------------                 ---------------- ----------------- -----------
NT AUTHORITY\\SYSTEM                    FullControl             Allow       False
NT AUTHORITY\\SYSTEM                    FullControl             Allow        True
BUILTIN\\Administrators                 FullControl             Allow        True
BUILTIN\\Users          ReadAndExecute, Synchronize             Allow        True`,
        explanation: 'Ordinary users can read the hosts file but cannot change it, which is what you want. Editing it would let an attacker redirect names, so it is a protected file.',
      },
      {
        title: 'Audit a Script Folder for Risky Write Access (Defensive)',
        description: 'Find files that non-administrators can modify.',
        code: `Get-ChildItem C:\\Scripts -File | ForEach-Object {
    $file = $_
    (Get-Acl $file.FullName).Access |
        Where-Object { $_.AccessControlType -eq "Allow" -and $_.FileSystemRights -match "Write|Modify|FullControl" -and $_.IdentityReference -match "Users|Everyone|Authenticated Users" } |
        Select-Object @{N="File";E={$file.Name}}, IdentityReference, FileSystemRights
}`,
        illustrativeOutput: `File         IdentityReference     FileSystemRights
----         -----------------     ----------------
Cleanup.ps1  BUILTIN\\Users         Modify, Synchronize`,
        explanation: 'A script that runs from a scheduled task as SYSTEM but is editable by Users lets any user run code as SYSTEM. If you find a hit, remove that permission and review who changed the file.',
      },
      {
        title: 'Save the Permissions as Text for a Baseline',
        description: 'Export the SDDL string so you can compare it later.',
        code: `(Get-Acl C:\\Scripts).Sddl | Out-File C:\\Scripts-acl-baseline.txt`,
        illustrativeOutput: `(No output. The file now contains one line starting with O:BAG:... that fully describes the folder permissions.)`,
        explanation: 'SDDL is the compact text form of the ACL. Comparing a stored baseline with a fresh Get-Acl later reveals unexpected permission changes.',
      },
    ],
    commonMistakes: [
      'Expecting the output to list each permission directly. The permissions are inside the Access property, so use (Get-Acl path).Access.',
      'Confusing Get-Acl with Set-Acl. Get-Acl only reads; permissions change only when you modify the object and pass it to Set-Acl.',
      'Using -Path with a name that contains square brackets and getting no result. Use -LiteralPath for those.',
    ],
    troubleshooting: 'If you see "Attempted to perform an unauthorized operation" or "Access is denied", you may not have permission to read the ACL, so try an elevated prompt. -Audit needs the "Manage auditing and security log" privilege, which means running as Administrator. Get-Acl also works on registry paths such as HKLM:\\SOFTWARE\\... because the registry is a PowerShell drive.',
    relatedCommands: ['Test-Path', 'Get-Content', 'Get-ScheduledTask'],
    relatedLessonPath: '/learn/chapter-15/offensive-recon-and-ad-enum',
    isEssentialPocketknife: false,
  },
  {
    name: 'Start-Transcript',
    verb: 'Start',
    noun: 'Transcript',
    module: 'Microsoft.PowerShell.Host',
    purpose: 'Record everything typed and displayed in the PowerShell session to a text file.',
    syntax: 'Start-Transcript [[-Path] <String>] [-Append] [-Force] [-NoClobber] [-IncludeInvocationHeader] [-WhatIf] [-Confirm]\nStart-Transcript [-LiteralPath] <String> [-Append] [-Force] [-NoClobber] [-IncludeInvocationHeader]\nStart-Transcript [-OutputDirectory] <String> [-Append] [-Force] [-NoClobber] [-IncludeInvocationHeader]',
    description:
      'Start-Transcript works like a flight recorder for your console. From the moment you run it until you run Stop-Transcript (or close the session), the commands you type and the text PowerShell prints are copied into a file with a header showing the user, machine and time. Admins use it to keep proof of what they changed, and defenders use it to review what happened on a machine. If you give no path, PowerShell creates a file in your Documents folder named PowerShell_transcript.<computer>.<random>.<timestamp>.txt. Security warning: a transcript is a plain text file and records whatever appears on screen, including secrets typed on a command line or printed by a command. Protect transcript folders with strict permissions (and check them with Get-Acl). Organisations can also switch transcription on with the Group Policy "Turn on PowerShell Transcription", which writes a transcript for every session into a central output directory, typically a protected network share with one sub-folder per day (YYYYMMDD).',
    parameters: [
      { name: '-Path', type: 'String', required: false, position: 0, pipelineInput: 'False', description: 'The full path of the transcript file. If it already exists it is overwritten unless you use -Append or -NoClobber.' },
      { name: '-LiteralPath', type: 'String', required: false, position: 0, pipelineInput: 'False', description: 'Like -Path but wildcard characters are taken literally.' },
      { name: '-OutputDirectory', type: 'String', required: false, position: 0, pipelineInput: 'False', description: 'A folder to write into. PowerShell chooses a unique file name for you, which avoids overwriting earlier transcripts.' },
      { name: '-Append', type: 'SwitchParameter', required: false, pipelineInput: 'False', description: 'Adds to the end of an existing file instead of replacing it.' },
      { name: '-NoClobber', type: 'SwitchParameter', required: false, pipelineInput: 'False', description: 'Refuses to overwrite an existing file. The command fails instead.' },
      { name: '-Force', type: 'SwitchParameter', required: false, pipelineInput: 'False', description: 'Allows writing to a read-only file by overriding the read-only attribute.' },
      { name: '-IncludeInvocationHeader', type: 'SwitchParameter', required: false, pipelineInput: 'False', description: 'Adds a timestamp line before each command, which makes the transcript much easier to read as an audit record.' },
    ],
    practicalExamples: [
      {
        title: 'Record a Maintenance Session',
        description: 'Capture a short admin task from start to finish.',
        code: `Start-Transcript -Path C:\\LabLogs\\maintenance-20261104.txt -IncludeInvocationHeader
Get-Service -Name Spooler
Stop-Transcript`,
        illustrativeOutput: `Transcript started, output file is C:\\LabLogs\\maintenance-20261104.txt

Status   Name               DisplayName
------   ----               -----------
Running  Spooler            Print Spooler

Transcript stopped, output file is C:\\LabLogs\\maintenance-20261104.txt`,
        explanation: 'The folder C:\\LabLogs must exist. Everything between Start and Stop, commands and output, is now in the file as proof of what you did.',
      },
      {
        title: 'Let PowerShell Name the File for You',
        description: 'Use -OutputDirectory so each session gets its own unique file.',
        code: `Start-Transcript -OutputDirectory C:\\LabLogs`,
        illustrativeOutput: `Transcript started, output file is C:\\LabLogs\\PowerShell_transcript.CLIENT01.a1B2c3D4.20261104091500.txt`,
        explanation: 'The name contains the computer name, a random piece and a timestamp, so transcripts never collide. This is the same style the Group Policy transcription feature uses.',
      },
      {
        title: 'Append to a Daily Log Without Overwriting',
        description: 'Keep adding sessions to one file per day.',
        code: `Start-Transcript -Path "C:\\LabLogs\\admin-$(Get-Date -Format yyyyMMdd).txt" -Append -IncludeInvocationHeader`,
        illustrativeOutput: `Transcript started, output file is C:\\LabLogs\\admin-20261104.txt`,
        explanation: '-Append keeps earlier sessions from that day. Remember to restrict who can read the folder, because the file may contain sensitive text.',
      },
    ],
    commonMistakes: [
      'Leaving a transcript running and forgetting about it. Always finish with Stop-Transcript.',
      'Storing transcripts in a folder every user can read. They may contain passwords or tokens that were typed or printed.',
      'Pointing -Path at a folder that does not exist. Create it first with New-Item -ItemType Directory.',
      'Overwriting yesterday\'s file by reusing the same name without -Append. Use -OutputDirectory or add a date to the name.',
    ],
    troubleshooting: 'If you see "Transcription has already been started", stop the current one first with Stop-Transcript. If the path fails, check that the folder exists and that you can write to it. Transcripts can be switched on by Group Policy, in which case the output goes to the configured directory, not your Documents folder, so look there when hunting for evidence. Keep sensitive values out of the console by using Read-Host -AsSecureString or Get-Credential rather than typing a password on the command line.',
    relatedCommands: ['Stop-Transcript', 'Out-File', 'Get-Acl'],
    relatedLessonPath: '/learn/chapter-16/powershell-auditing-and-logging',
    isEssentialPocketknife: false,
  },
  {
    name: 'Stop-Transcript',
    verb: 'Stop',
    noun: 'Transcript',
    module: 'Microsoft.PowerShell.Host',
    purpose: 'Stop recording the session and close the transcript file that Start-Transcript opened.',
    syntax: 'Stop-Transcript',
    description:
      'Stop-Transcript is the partner of Start-Transcript. It ends the recording, saves the file and prints its location. It has no parameters of its own, you simply run it. The transcript is also closed when the session ends, but stopping it on purpose is a good habit because it makes it obvious where the record ends and guarantees the file is flushed to disk. If no transcript is running, Stop-Transcript raises an error, which is harmless but can be hidden in scripts with -ErrorAction SilentlyContinue. Put it in a finally block so the transcript is closed even when your script fails.',
    parameters: [
      { name: '-ErrorAction', type: 'ActionPreference', required: false, pipelineInput: 'False', description: 'A common parameter. Use SilentlyContinue to suppress the error you get when no transcript is running. Stop-Transcript has no other parameters of its own.' },
    ],
    practicalExamples: [
      {
        title: 'Stop and Confirm the File Location',
        description: 'End a recording and see where it was saved.',
        code: `Stop-Transcript`,
        illustrativeOutput: `Transcript stopped, output file is C:\\LabLogs\\maintenance-20261104.txt`,
        explanation: 'Copy the path from this message, you will need it when you review or archive the file.',
      },
      {
        title: 'Always Close the Transcript, Even on Failure',
        description: 'Wrap a script in try/finally so the recording ends no matter what.',
        code: `Start-Transcript -OutputDirectory C:\\LabLogs | Out-Null
try {
    Get-Service -Name "DoesNotExist" -ErrorAction Stop
}
catch {
    Write-Warning "Task failed: $($_.Exception.Message)"
}
finally {
    Stop-Transcript | Out-Null
}`,
        illustrativeOutput: `WARNING: Task failed: Cannot find any service with service name 'DoesNotExist'.`,
        explanation: 'The finally block runs whether the try succeeds or fails, so you never leave a transcript open. Out-Null hides the start and stop messages.',
      },
    ],
    commonMistakes: [
      'Calling it when nothing is recording and thinking something is broken. The error is only telling you there is no active transcript.',
      'Forgetting it in scripts, so the transcript keeps growing until the host closes.',
      'Assuming it deletes or encrypts the file. It only closes it, so protect the file with permissions.',
    ],
    troubleshooting: 'If Stop-Transcript says the host is not transcribing, either you never started one in this session or it was started by a different session (for example by Group Policy, which you cannot stop yourself). If the file looks incomplete, make sure you stopped the transcript before reading it. Look for the file path in the "Transcript started" message printed at the beginning.',
    relatedCommands: ['Start-Transcript', 'Out-File', 'Write-Warning'],
    relatedLessonPath: '/learn/chapter-16/powershell-auditing-and-logging',
    isEssentialPocketknife: false,
  },
  {
    name: 'New-PSSessionConfigurationFile',
    verb: 'New',
    noun: 'PSSessionConfigurationFile',
    module: 'Microsoft.PowerShell.Core',
    purpose: 'Generate a .pssc session configuration file that describes a restricted PowerShell remoting endpoint, the foundation of Just Enough Administration (JEA).',
    syntax: 'New-PSSessionConfigurationFile [-Path] <String> [-SessionType <SessionType>] [-RunAsVirtualAccount] [-TranscriptDirectory <String>] [-RoleDefinitions <IDictionary>] [-LanguageMode <PSLanguageMode>] [-GroupManagedServiceAccount <String>] [-Author <String>] [-Description <String>]',
    description:
      'Just Enough Administration (JEA) lets a help desk member do one narrow job on a server, such as restarting the print spooler, without giving them a full administrator account. The .pssc file written by New-PSSessionConfigurationFile is one half of that setup: it describes the endpoint, for example "start from a locked-down session, run commands as a temporary virtual account, record a transcript of everything, and map this security group to these role capabilities". The cmdlet only writes the file. It does not create the endpoint, and it does not define which commands are allowed. You still need a role capability file (.psrc, made with New-PSRoleCapabilityFile) that lists the allowed commands, and you must register the endpoint with Register-PSSessionConfiguration before anyone can connect. Use this in a lab or with change approval, because it exposes a remoting endpoint.',
    parameters: [
      { name: '-Path', type: 'String', required: true, position: 0, pipelineInput: 'False', description: 'Where to write the .pssc file, for example C:\\JEA\\HelpDesk.pssc. The file name must end in .pssc.' },
      { name: '-SessionType', type: 'SessionType', required: false, pipelineInput: 'False', description: 'Empty (almost nothing loaded), Default (the normal PowerShell core commands) or RestrictedRemoteServer (only a handful of safe commands such as Get-Command and Exit-PSSession). JEA uses RestrictedRemoteServer.' },
      { name: '-RunAsVirtualAccount', type: 'SwitchParameter', required: false, pipelineInput: 'False', description: 'Runs the session as a temporary local account that exists only for that session. The user does not need admin rights themselves.' },
      { name: '-TranscriptDirectory', type: 'String', required: false, pipelineInput: 'False', description: 'A folder where a transcript of every session on this endpoint is saved. Essential for auditing JEA use.' },
      { name: '-RoleDefinitions', type: 'IDictionary', required: false, pipelineInput: 'False', description: 'A hashtable that maps security groups to role capabilities, for example @{ "CORP\\HelpDesk" = @{ RoleCapabilities = "HelpDeskMaintenance" } }.' },
      { name: '-LanguageMode', type: 'PSLanguageMode', required: false, pipelineInput: 'False', description: 'FullLanguage, ConstrainedLanguage, RestrictedLanguage or NoLanguage. Tighter modes limit what scripting features the user can run. RestrictedRemoteServer sessions default to NoLanguage.' },
      { name: '-GroupManagedServiceAccount', type: 'String', required: false, pipelineInput: 'False', description: 'Runs the session as a group managed service account instead of a virtual account, useful when the session must reach other servers on the network.' },
    ],
    practicalExamples: [
      {
        title: 'Create a Help Desk JEA Session File (Lab)',
        description: 'Write a locked-down .pssc that maps a group to a role and records transcripts.',
        code: `New-Item -ItemType Directory -Path C:\\JEA\\Transcripts -Force | Out-Null
New-PSSessionConfigurationFile -Path C:\\JEA\\HelpDesk.pssc -SessionType RestrictedRemoteServer -RunAsVirtualAccount -TranscriptDirectory C:\\JEA\\Transcripts -RoleDefinitions @{ "CORP\\HelpDesk" = @{ RoleCapabilities = "HelpDeskMaintenance" } } -Author "Lab Admin" -Description "Lab: help desk maintenance endpoint"`,
        illustrativeOutput: `(No output. The file C:\\JEA\\HelpDesk.pssc is created.)`,
        explanation: 'This file alone does nothing yet. It names a role called HelpDeskMaintenance that must exist as a .psrc file. Secure the transcript folder so that only administrators can read it.',
      },
      {
        title: 'Validate the File Before You Use It',
        description: 'Check that the .pssc is syntactically valid.',
        code: `Test-PSSessionConfigurationFile -Path C:\\JEA\\HelpDesk.pssc`,
        illustrativeOutput: `True`,
        explanation: 'Always test the file first. A typo here is far easier to fix than a broken endpoint on a production server.',
      },
      {
        title: 'The Remaining Steps for a Working Endpoint (Lab Only)',
        description: 'Create the role capability, register the endpoint, then verify what a user can do.',
        code: `$roleDir = "C:\\Program Files\\WindowsPowerShell\\Modules\\HelpDeskRoles\\RoleCapabilities"
New-Item -ItemType Directory -Path $roleDir -Force | Out-Null
New-PSRoleCapabilityFile -Path "$roleDir\\HelpDeskMaintenance.psrc" -VisibleCmdlets "Get-Service", @{ Name = "Restart-Service"; Parameters = @{ Name = "Name"; ValidateSet = "Spooler" } }
Register-PSSessionConfiguration -Name HelpDesk -Path C:\\JEA\\HelpDesk.pssc
Get-PSSessionCapability -ConfigurationName HelpDesk -Username "CORP\\alice"`,
        illustrativeOutput: `CommandType Name            Version Source
----------- ----            ------- ------
Function    Exit-PSSession
Function    Get-Command
Function    Get-FormatData
Function    Get-Help
Function    Measure-Object
Function    Out-Default
Function    Select-Object
Cmdlet      Get-Service
Cmdlet      Restart-Service`,
        explanation: 'Get-PSSessionCapability lists exactly what the user could run, so you can prove the endpoint is narrow. Registration needs an elevated prompt and restarts the WinRM service. Roll back with Unregister-PSSessionConfiguration -Name HelpDesk.',
      },
    ],
    commonMistakes: [
      'Thinking the .pssc file is enough. Without a .psrc role capability and Register-PSSessionConfiguration, nobody can use it and nothing is restricted.',
      'Skipping -TranscriptDirectory. Without transcripts you cannot audit what people did through the endpoint.',
      'Granting a role to a broad group such as Domain Users. Map only the small group that really needs the task.',
      'Allowing powerful commands such as Invoke-Expression or unrestricted Start-Process in the role file, which defeats the purpose of least privilege.',
    ],
    troubleshooting: 'If Test-PSSessionConfigurationFile fails, read the message: common causes are a missing .pssc extension or a malformed hashtable in -RoleDefinitions. If users connect but see almost no commands, the role capability file was not found: it must sit in a RoleCapabilities folder inside a valid PowerShell module on the module path. Use Get-PSSessionCapability to check what a given user receives, and read the transcripts in the TranscriptDirectory to see what happened.',
    relatedCommands: ['Enter-PSSession', 'Test-WSMan', 'Start-Transcript'],
    relatedLessonPath: '/learn/chapter-16/hardening-jea-and-threat-hunting',
    isEssentialPocketknife: false,
  },
];
