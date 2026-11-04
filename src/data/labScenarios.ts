export interface BugChallenge {
  id: string;
  moduleRef: string;
  title: string;
  scenario: string;
  brokenCode: string;
  brokenOutput: string;
  options: {
    id: string;
    label: string;
    code: string;
    isCorrect: boolean;
    explanation: string;
  }[];
  fixedOutput: string;
  takeaway: string;
}

export const BUG_CHALLENGES: BugChallenge[] = [
  {
    id: 'bug-gt-redirection',
    moduleRef: 'Module 07 · Comparison Operators',
    title: 'Bug #1: The Silent File-Creation Trap (> vs -gt)',
    scenario:
      'A junior admin tried to list all processes using more than 100 MB of WorkingSet memory, but nothing printed to the screen, and a strange file named "100MB" appeared in the current folder!',
    brokenCode: 'Get-Process | Where-Object { $_.WorkingSet > 100MB }',
    brokenOutput:
      '[No console output - PowerShell redirected objects into a text file named .\\100MB!]',
    options: [
      {
        id: 'opt-a',
        label: 'Replace > with -gt',
        code: 'Get-Process | Where-Object { $_.WorkingSet -gt 100MB }',
        isCorrect: true,
        explanation:
          'Correct! In PowerShell, > is the stream redirection operator (alias for Out-File). All comparison operators use hyphenated flags: -gt, -lt, -eq, -ne.',
      },
      {
        id: 'opt-b',
        label: 'Wrap 100MB in double quotes',
        code: 'Get-Process | Where-Object { $_.WorkingSet > "100MB" }',
        isCorrect: false,
        explanation:
          'Still broken! > is still the file redirection operator, and quoting "100MB" turns the 100MB byte multiplier into a plain string.',
      },
      {
        id: 'opt-c',
        label: 'Use == instead of >',
        code: 'Get-Process | Where-Object { $_.WorkingSet == 100MB }',
        isCorrect: false,
        explanation:
          'PowerShell does not use == for equality or > for comparison. Use -gt (Greater Than) or -ge (Greater Than or Equal).',
      },
    ],
    fixedOutput: `Handles  NPM(K)    PM(K)      WS(K)     CPU(s)     Id  ProcessName
-------  ------    -----      -----     ------     --  -----------
   1420      88   245120     312400      48.20   4192  pwsh
    980      64   189400     215800      19.05   2840  MsMpEng`,
    takeaway:
      'Never use >, <, or == inside Where-Object or if() conditions. Always use -gt, -lt, -ge, -le, -eq, and -ne.',
  },
  {
    id: 'bug-format-table-pipe',
    moduleRef: 'Module 07 · Filter Left, Format Right',
    title: 'Bug #2: Format-Table Destroying the Pipeline Before Export-Csv',
    scenario:
      'An engineer formatted a service report with Format-Table so it looked nice, then piped it to Export-Csv. When they opened the CSV in Excel, every row was garbage metadata!',
    brokenCode:
      'Get-Service | Select-Object Name, Status | Format-Table | Export-Csv .\\services.csv -NoTypeInformation',
    brokenOutput: `"ClassId2e4f51ef21dd47e99d3c952918aff9cd","pageHeaderEntry","pageFooterEntry"
"033ecb2bc07a4d43b5ef94ed5a35d280",,""`,
    options: [
      {
        id: 'opt-a',
        label:
          'Remove Format-Table so live ServiceController objects reach Export-Csv',
        code: 'Get-Service | Select-Object Name, Status | Export-Csv .\\services.csv -NoTypeInformation',
        isCorrect: true,
        explanation:
          'Spot on! Format-Table converts live .NET objects into internal layout instructions meant only for screen drawing. Format cmdlets must always be the very last stage, or omitted completely when exporting.',
      },
      {
        id: 'opt-b',
        label: 'Move Format-Table before Select-Object',
        code: 'Get-Service | Format-Table | Select-Object Name, Status | Export-Csv .\\services.csv',
        isCorrect: false,
        explanation:
          'Moving Format-Table earlier destroys the ServiceController objects even sooner!',
      },
      {
        id: 'opt-c',
        label: 'Add -AutoSize to Format-Table',
        code: 'Get-Service | Format-Table -AutoSize | Export-Csv .\\services.csv',
        isCorrect: false,
        explanation:
          '-AutoSize only adjusts screen column widths; it still emits internal formatting objects.',
      },
    ],
    fixedOutput: `"Name","Status"
"EventLog","Running"
"LanmanServer","Running"
"Spooler","Stopped"`,
    takeaway:
      'Rule of Thumb: "Format Right." Once you call Format-Table or Format-List, your original objects are gone.',
  },
  {
    id: 'bug-single-quotes',
    moduleRef: 'Module 06 · Strings & Variable Expansion',
    title: 'Bug #3: Literal Single Quotes Blocking Variable Expansion',
    scenario:
      'During a Server Core deployment script, the admin wanted to print the server name and current date, but the terminal literally printed "$ServerName booted at $(Get-Date)".',
    brokenCode:
      '$ServerName = "DC01-CORE"\nWrite-Output \'Server $ServerName booted at $(Get-Date)\'',
    brokenOutput: 'Server $ServerName booted at $(Get-Date)',
    options: [
      {
        id: 'opt-a',
        label: 'Switch outer quotes from single (\'...\') to double ("...")',
        code: '$ServerName = "DC01-CORE"\nWrite-Output "Server $ServerName booted at $(Get-Date)"',
        isCorrect: true,
        explanation:
          'Exactly! In PowerShell, single quotes (\'...\') are 100% literal strings. Double quotes ("...") enable variable interpolation ($ServerName) and subexpression evaluation ($(Get-Date)).',
      },
      {
        id: 'opt-b',
        label: 'Add a backtick before $ServerName inside single quotes',
        code: "Write-Output 'Server `$ServerName booted at $(Get-Date)'",
        isCorrect: false,
        explanation:
          'Inside single quotes, even the backtick (`) is treated as a literal character!',
      },
      {
        id: 'opt-c',
        label: 'Use Write-Host with single quotes',
        code: "Write-Host 'Server $ServerName booted at $(Get-Date)'",
        isCorrect: false,
        explanation:
          'Write-Host obeys the exact same quoting rules as Write-Output, single quotes are always literal.',
      },
    ],
    fixedOutput: 'Server DC01-CORE booted at 11/03/2026 23:45:12',
    takeaway:
      'Use single quotes (\'...\') for literal strings and double quotes ("...") whenever you need $Variable or $(SubExpression) expansion.',
  },
  {
    id: 'bug-ad-filter-left',
    moduleRef: 'Module 12 · Active Directory & Filter Left',
    title: 'Bug #4: Pulling Every AD User Over the Network Before Filtering',
    scenario:
      'An administrator wrote a script to find all users in the Finance department. In a large domain (think tens of thousands of users) it is slow and puts needless load on the Domain Controller, because every user object is sent to the workstation before most are thrown away. The numbers in this scenario are illustrative.',
    brokenCode:
      'Get-ADUser -Filter * -Properties Department | Where-Object { $_.Department -eq "Finance" }',
    brokenOutput:
      '[Illustrative: the Domain Controller sent all 50,000 user objects over the network to client RAM, and Where-Object then discarded 49,850 of them]',
    options: [
      {
        id: 'opt-a',
        label:
          'Push the Department filter directly into Get-ADUser -Filter (Filter Left)',
        code: 'Get-ADUser -Filter "Department -eq \'Finance\'" -Properties Department',
        isCorrect: true,
        explanation:
          'Correct! Passing the condition to -Filter makes the Domain Controller evaluate the query server-side and send only the matching objects across the wire. Department is not an indexed attribute by default, so the DC still has to scan, but it scans next to the data and returns far fewer objects than the broken version.',
      },
      {
        id: 'opt-b',
        label: 'Pipe to Select-Object -First 150 at the end',
        code: 'Get-ADUser -Filter * -Properties Department | Select-Object -First 150',
        isCorrect: false,
        explanation:
          'That just grabs the first 150 random users in Active Directory regardless of department!',
      },
      {
        id: 'opt-c',
        label: 'Replace Where-Object with ForEach-Object',
        code: 'Get-ADUser -Filter * | ForEach-Object { if ($_.Department -eq "Finance") { $_ } }',
        isCorrect: false,
        explanation:
          'This still downloads all 50,000 objects from the Domain Controller before filtering locally.',
      },
    ],
    fixedOutput: `DistinguishedName : CN=Sarah Chen,OU=Finance,DC=corp,DC=example,DC=com
Department        : Finance
Enabled           : True
SamAccountName    : schen`,
    takeaway:
      'Always check whether the source cmdlet supports -Filter (Get-ADUser, Get-CimInstance, Get-ChildItem) before falling back to Where-Object. Each cmdlet has its own filter syntax, so read its help.',
  },
  {
    id: 'bug-try-catch-erroraction',
    moduleRef: 'Module 14 · Error Handling & Toolmaking',
    title: 'Bug #5: Why Did try/catch Ignore a Failed Cmdlet?',
    scenario:
      'An engineer wrapped Get-Service "FakeService" inside a try/catch block, expecting the catch block to log a clean alert. Instead, red error text printed to the screen and catch never ran!',
    brokenCode:
      'try {\n  Get-Service -Name "NonExistentService"\n} catch {\n  Write-Warning "Service missing!"\n}',
    brokenOutput:
      "Get-Service : Cannot find any service with service name 'NonExistentService'. (Catch block was skipped!)",
    options: [
      {
        id: 'opt-a',
        label:
          'Add -ErrorAction Stop so the non-terminating error triggers catch {}',
        code: 'try {\n  Get-Service -Name "NonExistentService" -ErrorAction Stop\n} catch {\n  Write-Warning "Service missing!"\n}',
        isCorrect: true,
        explanation:
          'Spot on! Most PowerShell cmdlet errors are non-terminating by default so pipelines can continue. try/catch only catches terminating exceptions, adding -ErrorAction Stop promotes it so catch {} runs.',
      },
      {
        id: 'opt-b',
        label: 'Add finally {} instead of catch {}',
        code: 'try { Get-Service "NonExistentService" } finally { Write-Warning "Missing" }',
        isCorrect: false,
        explanation:
          'finally {} runs whether the command succeeded or failed, and still does not suppress the non-terminating error stream.',
      },
      {
        id: 'opt-c',
        label: 'Pipe Get-Service to Out-Null',
        code: 'try { Get-Service "NonExistentService" | Out-Null } catch { ... }',
        isCorrect: false,
        explanation:
          'Out-Null only discards Stream 1 (Success output); Stream 2 (Error output) still bypasses catch without -ErrorAction Stop.',
      },
    ],
    fixedOutput: 'WARNING: Service missing!',
    takeaway:
      'Always append -ErrorAction Stop to cmdlets inside a try {} block if you want catch {} to intercept failures.',
  },
  {
    id: 'bug-winrm-port-5985',
    moduleRef: 'Module 11 · WinRM & Remoting',
    title: 'Bug #6: Ping Works but WinRM Port 5985 Is Closed',
    scenario:
      'From CLIENT01 an admin runs Invoke-Command against the new lab VM SRV-CORE01 (192.168.56.20) and gets a WinRM connection error. Ping to the same address replies normally. A port test shows what is really wrong.',
    brokenCode: 'Test-NetConnection -ComputerName SRV-CORE01 -Port 5985',
    brokenOutput: `ComputerName     : SRV-CORE01
RemoteAddress    : 192.168.56.20
RemotePort       : 5985
PingSucceeded    : True
TcpTestSucceeded : False
WARNING: TCP connect to (192.168.56.20 : 5985) failed
[abridged output]`,
    options: [
      {
        id: 'opt-a',
        label:
          'On the SRV-CORE01 console, enable PowerShell Remoting so WinRM listens on 5985',
        code: 'Enable-PSRemoting -Force',
        isCorrect: true,
        explanation:
          'Correct! Ping uses ICMP, which is a different door from TCP 5985. Enable-PSRemoting starts the WinRM service, creates the HTTP listener on 5985 and enables the matching firewall exception. Run it on the VM itself, because remoting cannot be used to switch on remoting. It creates only the HTTP listener: HTTPS on 5986 needs a certificate and a separate listener. On a client edition of Windows it also refuses on a Public network profile unless you add -SkipNetworkProfileCheck.',
      },
      {
        id: 'opt-b',
        label: 'Allow ICMP echo requests in the firewall',
        code: "Enable-NetFirewallRule -DisplayName 'File and Printer Sharing (Echo Request - ICMPv4-In)'",
        isCorrect: false,
        explanation:
          'Ping already succeeds, so ICMP is not blocked. Opening a protocol that already works does nothing for TCP 5985, which has no listener or no firewall exception.',
      },
      {
        id: 'opt-c',
        label: 'Add SRV-CORE01 to TrustedHosts on CLIENT01',
        code: "Set-Item WSMan:\\localhost\\Client\\TrustedHosts -Value 'SRV-CORE01' -Force",
        isCorrect: false,
        explanation:
          'TrustedHosts only relaxes how the client authenticates, for example when connecting by IP address or to a workgroup machine. It does not start a listener or open a port, so TcpTestSucceeded stays False. It also weakens mutual authentication, so use it sparingly.',
      },
    ],
    fixedOutput: `ComputerName     : SRV-CORE01
RemoteAddress    : 192.168.56.20
RemotePort       : 5985
PingSucceeded    : True
TcpTestSucceeded : True
[abridged output]`,
    takeaway:
      'Test the real port, not just ping. Debug remoting from the outside in: name, port 5985, WinRM service, then PowerShell.',
  },
  {
    id: 'bug-firewall-profile-mismatch',
    moduleRef: 'Module 13 · Firewall Profiles & Rules',
    title: 'Bug #7: The Rule Says Enabled but the Port Stays Blocked',
    scenario:
      'On the standalone lab VM SRV-CORE01 an admin created an inbound rule for a test web app on TCP 8080 and confirmed it shows Enabled = True. From CLIENT01 the connection still times out.',
    brokenCode: `New-NetFirewallRule -DisplayName 'Lab Web 8080' -Direction Inbound -Protocol TCP -LocalPort 8080 -Action Allow -Profile Domain
Get-NetConnectionProfile | Select-Object InterfaceAlias, NetworkCategory`,
    brokenOutput: `[Rule created: Enabled = True, Profile = Domain]

InterfaceAlias NetworkCategory
-------------- ---------------
Ethernet                Public

[From CLIENT01: TcpTestSucceeded : False]`,
    options: [
      {
        id: 'opt-a',
        label:
          'Check the active profile, then make the rule apply to the profile the adapter is really on',
        code: `Set-NetConnectionProfile -InterfaceAlias 'Ethernet' -NetworkCategory Private
Set-NetFirewallRule -DisplayName 'Lab Web 8080' -Profile Private`,
        isCorrect: true,
        explanation:
          'Correct! A rule is only evaluated when the connection profile is in its Profile list. The adapter is classed as Public, so a Domain-only rule never applies. On this standalone lab VM, mark the lab network Private and scope the rule to Private. On a domain-joined server you would fix the cause instead (for example DNS pointing at DC01) so that Network Location Awareness detects the domain.',
      },
      {
        id: 'opt-b',
        label: 'Turn off the Public firewall profile',
        code: 'Set-NetFirewallProfile -Profile Public -Enabled False',
        isCorrect: false,
        explanation:
          'The port would open only because all inbound filtering on that profile is removed. That hides the real mistake and leaves the machine exposed on every untrusted network it joins.',
      },
      {
        id: 'opt-c',
        label: 'Enable the rule again',
        code: "Enable-NetFirewallRule -DisplayName 'Lab Web 8080'",
        isCorrect: false,
        explanation:
          'The rule is already Enabled. Enabled and active are different things: an enabled rule still does nothing while the connection profile is outside its Profile list.',
      },
    ],
    fixedOutput: `DisplayName  Enabled Profile
-----------  ------- -------
Lab Web 8080    True Private

InterfaceAlias NetworkCategory
-------------- ---------------
Ethernet                Private

[From CLIENT01: TcpTestSucceeded : True]`,
    takeaway:
      'When an enabled rule does not work, compare the rule Profile with Get-NetConnectionProfile before touching anything else.',
  },
  {
    id: 'bug-gpo-block-inheritance',
    moduleRef: 'Module 13 · GPO, LSDOU & Enforced',
    title: 'Bug #8: The Domain GPO Never Reaches the Server',
    scenario:
      'A GPO called Lab Baseline is linked at the domain root, corp.example.com. SRV-CORE01 sits in OU=Servers, where Block Inheritance was switched on long ago. The setting never arrives, and gpupdate /force changes nothing.',
    brokenCode: 'gpresult /r /scope computer',
    brokenOutput: `Applied Group Policy Objects
-----------------------------
    Servers Local Overrides

[abridged: Lab Baseline is missing. The domain link is not Enforced and OU=Servers blocks inheritance]`,
    options: [
      {
        id: 'opt-a',
        label:
          'Enforce the domain link so it overrides Block Inheritance on the OU',
        code: "Set-GPLink -Name 'Lab Baseline' -Target 'DC=corp,DC=example,DC=com' -Enforced Yes",
        isCorrect: true,
        explanation:
          'Correct! GPOs apply in the order Local, Site, Domain, OU, and the last one applied wins a conflict. Block Inheritance stops normal links from higher containers, but an Enforced link ignores it and also wins over lower GPOs. Use Enforced sparingly, because it removes the OU admin\'s ability to override the setting.',
      },
      {
        id: 'opt-b',
        label: 'Force a faster policy refresh',
        code: "Invoke-GPUpdate -Computer 'SRV-CORE01' -RandomDelayInMinutes 0 -Force",
        isCorrect: false,
        explanation:
          'A refresh only re-reads the GPOs that are in scope. It cannot add a GPO that inheritance rules have filtered out, so the result is the same, just sooner.',
      },
      {
        id: 'opt-c',
        label: 'Move the domain link to order 1',
        code: "Set-GPLink -Name 'Lab Baseline' -Target 'DC=corp,DC=example,DC=com' -Order 1",
        isCorrect: false,
        explanation:
          'Link order only ranks GPOs that are linked to the same container. It does not decide whether a blocked link is inherited into a child OU.',
      },
    ],
    fixedOutput: `Applied Group Policy Objects
-----------------------------
    Lab Baseline
    Servers Local Overrides

[abridged output after the next policy refresh]`,
    takeaway:
      'Inheritance shows what could apply and gpresult shows what did apply. Check Block Inheritance and Enforced before blaming the refresh.',
  },
  {
    id: 'bug-4104-wrong-log',
    moduleRef: 'Module 16 · Logging, AMSI & Threat Hunting',
    title: 'Bug #9: "No 4104 Events, So Nothing Suspicious Ran"',
    scenario:
      'An analyst hunts for a suspicious encoded PowerShell command on DC01. The query returns nothing, so the ticket says: AMSI would have blocked it and nothing is logged, case closed. Script Block Logging was enabled by policy last month.',
    brokenCode:
      "Get-WinEvent -FilterHashtable @{ LogName = 'Security'; Id = 4104 }",
    brokenOutput:
      'Get-WinEvent : No events were found that match the specified selection criteria.',
    options: [
      {
        id: 'opt-a',
        label:
          'Query the PowerShell Operational log, which is where event 4104 is written',
        code: "Get-WinEvent -FilterHashtable @{ LogName = 'Microsoft-Windows-PowerShell/Operational'; Id = 4104 } -MaxEvents 20",
        isCorrect: true,
        explanation:
          'Correct! Script block text (4104) is written to Microsoft-Windows-PowerShell/Operational. The Security log holds events such as 4688 and 4769. Also fix the conclusion: an empty result is not proof of safety. AMSI is a scanning interface rather than a log, it can miss or be bypassed, and logging only records activity that happened after the policy took effect.',
      },
      {
        id: 'opt-b',
        label: 'Turn AMSI on so the events get recorded',
        code: 'Set-MpPreference -DisableScriptScanning $false',
        isCorrect: false,
        explanation:
          'AMSI is not a log setting. Script scanning is normally already on, and AMSI verdicts are not what fills the 4104 log. Changing it does not recover past events, and a quiet AMSI never proves that nothing ran.',
      },
      {
        id: 'opt-c',
        label: 'Query the classic Windows PowerShell log instead',
        code: "Get-WinEvent -FilterHashtable @{ LogName = 'Windows PowerShell'; Id = 4104 }",
        isCorrect: false,
        explanation:
          'The classic Windows PowerShell log records engine lifecycle events such as 400 (engine started) and 403 (engine stopped). Script block text is not written there, so 4104 is absent.',
      },
    ],
    fixedOutput: `TimeCreated           Id LevelDisplayName Message
-----------           -- ---------------- -------
11/03/2026 22:14:09 4104 Warning          Creating Scriptblock text (1 of 1): IEX ([Text.Encoding]...
[illustrative output]`,
    takeaway:
      'Know which log holds which event ID, and treat "no events found" as a question about your query and your logging policy, not as proof that nothing happened.',
  },
];

export interface PresetScenario {
  id: string;
  label: string;
  baseCmd: string;
  dotnetType: string;
  filterLeftFlag: string;
  whereClause: string;
  selectProps: string;
  supportsWhatIf: boolean;
  actionCmd: string;
  rows: Array<Record<string, string>>;
  explanation: string;
}

export const COMMAND_BUILDER_SCENARIOS: PresetScenario[] = [
  {
    id: 'services',
    label: 'Windows Services (Get-Service)',
    baseCmd: 'Get-Service',
    dotnetType: 'System.ServiceProcess.ServiceController',
    filterLeftFlag: '-Name "w*"',
    whereClause: '| Where-Object { $_.Status -eq "Running" }',
    selectProps: '| Select-Object Name, Status, StartType -First 3',
    supportsWhatIf: true,
    actionCmd: '| Restart-Service -WhatIf',
    rows: [
      {
        Name: 'W32Time',
        Status: 'Running',
        StartType: 'Automatic',
        CanStop: 'True',
      },
      {
        Name: 'Winmgmt',
        Status: 'Running',
        StartType: 'Automatic',
        CanStop: 'True',
      },
      {
        Name: 'WinRM',
        Status: 'Running',
        StartType: 'Automatic',
        CanStop: 'True',
      },
      {
        Name: 'wuauserv',
        Status: 'Stopped',
        StartType: 'Manual',
        CanStop: 'False',
      },
    ],
    explanation:
      'Get-Service emits live ServiceController objects. Filtering left with -Name narrows the list immediately, and -WhatIf simulates restarting without touching production services.',
  },
  {
    id: 'processes',
    label: 'Processes & RAM (Get-Process)',
    baseCmd: 'Get-Process',
    dotnetType: 'System.Diagnostics.Process',
    filterLeftFlag: '-Name "pwsh", "svchost", "lsass"',
    whereClause: '| Where-Object { $_.WS -gt 20MB }',
    selectProps: '| Select-Object Id, ProcessName, WS -First 3',
    supportsWhatIf: true,
    actionCmd: '| Stop-Process -WhatIf',
    rows: [
      {
        Id: '712',
        ProcessName: 'lsass',
        WS: '28 MB',
        Path: 'C:\\Windows\\System32\\lsass.exe',
      },
      {
        Id: '1420',
        ProcessName: 'svchost',
        WS: '44 MB',
        Path: 'C:\\Windows\\System32\\svchost.exe',
      },
      {
        Id: '4892',
        ProcessName: 'pwsh',
        WS: '96 MB',
        Path: 'C:\\Program Files\\PowerShell\\7\\pwsh.exe',
      },
      {
        Id: '1104',
        ProcessName: 'svchost',
        WS: '11 MB',
        Path: 'C:\\Windows\\System32\\svchost.exe',
      },
    ],
    explanation:
      'Every running process in Windows has a Private Virtual Address Space and Working Set (WS). Inspecting Process objects lets you spot high memory usage or abnormal executable paths.',
  },
  {
    id: 'winevent',
    label: 'Blue Team Logs (Get-WinEvent)',
    baseCmd: 'Get-WinEvent',
    dotnetType: 'System.Diagnostics.Eventing.Reader.EventLogRecord',
    filterLeftFlag:
      '-FilterHashtable @{LogName="Microsoft-Windows-PowerShell/Operational"; Id=4104}',
    whereClause:
      '| Where-Object { $_.Message -match "Invoke-Expression|FromBase64String" }',
    selectProps: '| Select-Object TimeCreated, Id, LevelDisplayName -First 3',
    supportsWhatIf: false,
    actionCmd: '| Export-Csv .\\Suspicious4104.csv -NoTypeInformation',
    rows: [
      {
        TimeCreated: '2026-11-03 22:14:09',
        Id: '4104',
        LevelDisplayName: 'Warning',
        Message: 'IEX ([Text.Encoding]::UTF8.GetString(...))',
      },
      {
        TimeCreated: '2026-11-03 22:11:42',
        Id: '4104',
        LevelDisplayName: 'Warning',
        Message: 'FromBase64String("SQBFAFgA...")',
      },
      {
        TimeCreated: '2026-11-03 21:58:10',
        Id: '4104',
        LevelDisplayName: 'Information',
        Message: 'Get-Service | Where-Object Status -eq Running',
      },
    ],
    explanation:
      'Filter Left Rule in action: -FilterHashtable asks the Windows Event Log service for matching events only, so far fewer events are turned into objects than when you pull the whole log into Where-Object. Measure both with Measure-Command on your own machine.',
  },
];

export const LAB_UNIVERSE = {
  domain: 'corp.example.com',
  netbios: 'CORP',
  subnet: '192.168.56.0/24',
  switchName: 'LabNet',
  dnsServer: '192.168.56.10',
  hosts: {
    dc: { name: 'DC01', ip: '192.168.56.10' },
    core: { name: 'SRV-CORE01', ip: '192.168.56.20' },
    client: { name: 'CLIENT01', ip: '192.168.56.30' },
  },
} as const;

// Doubles every single-quote character (including the typographic ones that
// PowerShell also treats as quotes) and strips line breaks, so user input can
// never break out of a single-quoted PowerShell string.
const psQuote = (value: string): string =>
  value
    .replace(/[\r\n]+/g, ' ')
    .trim()
    .replace(/(['\u2018\u2019\u201A\u201B])/g, '$1$1');

export function generateServerCorePlaybookScript(params: {
  hostname: string;
  ipAddress: string;
  prefixLength: string;
  gateway: string;
  dnsServer: string;
  interfaceAlias: string;
  adminUser: string;
}): string {
  const host = psQuote(params.hostname) || LAB_UNIVERSE.hosts.core.name;
  const ip = psQuote(params.ipAddress) || LAB_UNIVERSE.hosts.core.ip;
  const dns = psQuote(params.dnsServer) || LAB_UNIVERSE.dnsServer;
  const alias = psQuote(params.interfaceAlias) || 'Ethernet';
  const admin = psQuote(params.adminUser) || 'LabAdmin';
  const gateway = psQuote(params.gateway);
  const parsedPrefix = Number.parseInt(params.prefixLength, 10);
  const prefix =
    Number.isInteger(parsedPrefix) && parsedPrefix >= 1 && parsedPrefix <= 32
      ? parsedPrefix
      : 24;
  const gatewayLine = gateway ? `\n        DefaultGateway = '${gateway}'` : '';

  return `#Requires -RunAsAdministrator
<#
  .SYNOPSIS
    Server Core baseline for a LAB VIRTUAL MACHINE ONLY.
  .DESCRIPTION
    Lab universe: domain ${LAB_UNIVERSE.domain} (${LAB_UNIVERSE.netbios}), virtual switch ${LAB_UNIVERSE.switchName},
    subnet ${LAB_UNIVERSE.subnet}, DC01 192.168.56.10, SRV-CORE01 192.168.56.20, CLIENT01 192.168.56.30.
    This script replaces the IP configuration, creates a local administrator and
    renames the computer. Never run it on a work, school or production machine.
    Run it from the VM console (not over remoting): changing the IP address drops
    a remote session.
  .EXAMPLE
    .\\configure-srv-core01.ps1 -WhatIf    # rehearse first: nothing is changed
#>
[CmdletBinding(SupportsShouldProcess, ConfirmImpact = 'High')]
param()

$ErrorActionPreference = 'Stop'
Write-Warning 'LAB VM ONLY. Rehearse with -WhatIf first. Do not run this on a real machine.'

# 0. Validate the host name before touching anything (NetBIOS limit: 15 characters)
if ('${host}' -notmatch '^[A-Za-z0-9-]{1,15}$') {
    throw 'The host name must be 1 to 15 letters, digits or hyphens.'
}

# 1. Choose the network adapter explicitly instead of taking "the first one"
$nic = Get-NetAdapter -Name '${alias}'
if ($nic.Status -ne 'Up') {
    throw "Adapter '$($nic.Name)' is $($nic.Status). Expected Up."
}
$ifIndex = $nic.ifIndex

# 2. Static IPv4 address. DHCP must be disabled first, otherwise New-NetIPAddress
#    can fail or leave the old DHCP address and gateway in place.
if ($PSCmdlet.ShouldProcess("$($nic.Name) (ifIndex $ifIndex)", 'Disable DHCP and set a static IPv4 address')) {
    Set-NetIPInterface -InterfaceIndex $ifIndex -Dhcp Disabled
    Get-NetIPAddress -InterfaceIndex $ifIndex -AddressFamily IPv4 -ErrorAction SilentlyContinue |
        Remove-NetIPAddress -Confirm:$false
    Get-NetRoute -InterfaceIndex $ifIndex -DestinationPrefix '0.0.0.0/0' -ErrorAction SilentlyContinue |
        Remove-NetRoute -Confirm:$false

    $ipSettings = @{
        InterfaceIndex = $ifIndex
        IPAddress      = '${ip}'
        PrefixLength   = ${prefix}${gatewayLine}
    }
    New-NetIPAddress @ipSettings | Out-Null

    # 3. DNS is a separate setting on the same interface
    Set-DnsClientServerAddress -InterfaceIndex $ifIndex -ServerAddresses '${dns}'
}

# 4. Dedicated local administrator. The password is typed at the prompt and
#    never stored in the script.
if (-not (Get-LocalUser -Name '${admin}' -ErrorAction SilentlyContinue)) {
    if ($PSCmdlet.ShouldProcess('${admin}', 'Create a local administrator')) {
        $Password = Read-Host -Prompt 'Enter password for the new administrator' -AsSecureString
        New-LocalUser -Name '${admin}' -Password $Password -FullName '${admin}' | Out-Null
        Add-LocalGroupMember -Group 'Administrators' -Member '${admin}'
    }
} else {
    Write-Verbose 'The local administrator already exists. Skipping.'
}

# 5. PowerShell Remoting. This creates the HTTP listener on 5985 only.
#    HTTPS on 5986 needs a certificate and a separate listener.
if ($PSCmdlet.ShouldProcess('WinRM', 'Enable-PSRemoting')) {
    Enable-PSRemoting -Force
}

# 6. Rename the computer. The new name is applied after a restart.
if ($env:COMPUTERNAME -ne '${host}') {
    if ($PSCmdlet.ShouldProcess($env:COMPUTERNAME, 'Rename the computer')) {
        Rename-Computer -NewName '${host}'
        Write-Warning 'Run Restart-Computer when you are ready. The new name applies after the restart.'
    }
}`;
}
