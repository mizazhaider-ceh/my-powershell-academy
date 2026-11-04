import type { TeachingMap } from '../../types';

export const TEACHING_C: TeachingMap = {
  // ==========================================================================
  // 8-1  PSProviders and PSDrives
  // ==========================================================================
  '8-1': {
    hook: `You already know how to walk through folders with cd and dir. What if I told you the very same two commands can walk into the Windows Registry, your environment variables and your certificate store? What would you want to look at first?`,
    mentalModel: `Imagine every data store on Windows wearing a folder costume. The provider is the tailor who sews the costume, and the drive is the name tag pinned to it (C:, HKLM:, Env:). Once everything looks like a folder, the same few verbs (cd, dir, Get-Item) work everywhere.`,
    misconceptions: [
      {
        myth: `HKLM: is a real disk drive, just like C:, with files sitting on it.`,
        truth: `HKLM: is a virtual drive. The Registry provider presents a database as if it were folders. Nothing is stored in a file called HKLM.`,
        test: `Get-PSDrive HKLM | Select-Object Name, Provider, Root   (the Root is HKEY_LOCAL_MACHINE, not a path on disk)`,
      },
      {
        myth: `Inside a registry key, the settings show up as child items, so Get-ChildItem will list them.`,
        truth: `Registry keys are the folders. The settings inside a key are called values, and PowerShell treats them as item properties. Use Get-ItemProperty to read them.`,
        test: `Get-ChildItem HKLM:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Run   (shows nothing or only subkeys), then Get-ItemProperty on the same path to see the values`,
      },
      {
        myth: `If I set $env:MY_SETTING = 'abc', Windows remembers it forever.`,
        truth: `The Env: drive in PowerShell edits the environment of the current process only. When you close the window, the change is gone. Permanent variables live in the registry and need a different command.`,
        test: `$env:MY_SETTING = 'abc'; powershell -NoProfile -Command '$env:MY_SETTING'   (the child process inherits it), then open a brand new window and check $env:MY_SETTING (empty)`,
      },
    ],
    workedExample: {
      goal: `Inspect one of the common places where programs start automatically for all users (the HKLM Run key), using only read-only navigation commands. Persistence has many other homes too, such as RunOnce, WOW6432Node, Startup folders, scheduled tasks and services.`,
      steps: [
        {
          think: `Before I go hunting, I want to know which data stores PowerShell can browse on this machine.`,
          action: `Get-PSProvider | Select-Object Name, Drives`,
          result: `A short list: Registry, Alias, Environment, FileSystem, Function, Variable (and Certificate on Windows). Each row shows the drives it exposes.`,
        },
        {
          think: `The Registry provider is the one I need. Which drive names does it give me?`,
          action: `Get-PSDrive -PSProvider Registry`,
          result: `Two rows: HKCU (root HKEY_CURRENT_USER) and HKLM (root HKEY_LOCAL_MACHINE).`,
        },
        {
          think: `I will cd into the key the same way I would cd into a folder. Note the colon after HKLM.`,
          action: `Set-Location HKLM:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion`,
          result: `Your prompt now reads PS HKLM:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion>. You are standing inside the registry.`,
        },
        {
          think: `Keys are folders, so I list the subkeys and then ask only for the names of the values inside Run.`,
          action: `Get-ChildItem | Select-Object -First 5 PSChildName; Get-Item .\\Run | Select-Object -ExpandProperty Property`,
          result: `First the names of five subkeys, then the names of the startup entries stored as values in Run.`,
        },
        {
          think: `Names are not enough. I want the actual command line each entry launches, so I read the values as item properties.`,
          action: `Get-ItemProperty .\\Run`,
          result: `One column per startup entry showing its command line, plus PSPath, PSParentPath, PSChildName and PSProvider (the provider's own bookkeeping).`,
        },
        {
          think: `I leave the registry before I run anything else. Standing in HKLM: by accident makes later file commands confusing.`,
          action: `Set-Location C:\\; Get-Location`,
          result: `The path shows C:\\ again.`,
        },
      ],
      takeaway: `You never learned a registry tool. You reused cd, Get-ChildItem and Get-Item. The only new idea was that keys are folders and values are properties.`,
    },
    checkpoints: [
      {
        question: `What is the difference between a PSProvider and a PSDrive?`,
        hint: `One is the translator, the other is the name you type.`,
        answer: `A PSProvider is the adapter that turns a data store into folders and items (for example Registry). A PSDrive is a named entry point created by a provider (for example HKLM: or HKCU:). One provider can expose several drives.`,
      },
      {
        question: `You type Set-Location HKLM and PowerShell says the path does not exist. What did you forget?`,
        hint: `Look at how C: is written.`,
        answer: `The colon. Drive names end with a colon (HKLM:). Without it PowerShell looks for a folder called HKLM in your current directory.`,
      },
      {
        question: `Which cmdlet shows the data stored inside a registry key, and why not Get-Content?`,
        hint: `Think about what a value is in the registry model.`,
        answer: `Get-ItemProperty. Registry values are item properties of the key, and a key has no file-style content, so Get-Content has nothing to read.`,
      },
    ],
    challenge: {
      brief: `Create a short drive called Startup that points straight at the HKLM Run key. Use it to list the startup value names, then remove the drive again. (This only affects your current PowerShell session.)`,
      hints: [
        `New-PSDrive builds new drives. It needs a name, a provider and a root.`,
        `The provider is Registry and the root is the full registry path starting with HKLM:\\SOFTWARE.`,
        `After creating it, Get-Item Startup:\\ returns the key, and its Property member holds the value names. Clean up with Remove-PSDrive.`,
      ],
      solution: `New-PSDrive -Name Startup -PSProvider Registry -Root 'HKLM:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Run' | Out-Null\n(Get-Item Startup:\\).Property\nRemove-PSDrive -Name Startup`,
      why: `A custom PSDrive is a session-only shortcut. Its root can be any path the provider understands, so the short name Startup: now behaves like a folder whose parent is the Run key. Nothing in the registry changed, and Remove-PSDrive deletes only the shortcut.`,
    },
    teachBack: `Explain PSProviders and PSDrives to a friend who only knows how to open folders in File Explorer. Why can the same dir command look inside the registry?`,
    diagrams: [
      {
        kind: 'tree',
        title: 'One session, many folder-shaped stores',
        caption: 'Providers sit under your session. Each one exposes drives, and each drive is browsed with the same commands.',
        root: {
          label: 'Your PowerShell session',
          sub: 'cd, dir, Get-Item',
          detail: 'Every provider plugs into the same set of navigation commands, so you learn them once.',
          tone: 'blue',
          children: [
            {
              label: 'FileSystem provider',
              sub: 'Disks and shares',
              detail: 'Exposes one drive per disk letter. PowerShell 7 also adds a Temp: drive (it does not exist in Windows PowerShell 5.1).',
              tone: 'cyan',
              children: [
                {
                  label: 'C: and D:',
                  sub: 'Folders and files',
                  detail: 'The drives you already know. Items are files, containers are folders.',
                  tone: 'cyan',
                },
              ],
            },
            {
              label: 'Registry provider',
              sub: 'Windows configuration',
              detail: 'Turns the registry database into keys (folders) with values (properties).',
              tone: 'amber',
              children: [
                {
                  label: 'HKLM:',
                  sub: 'HKEY_LOCAL_MACHINE',
                  detail: 'Settings that apply to the whole computer. Writing here usually needs an elevated shell.',
                  tone: 'amber',
                },
                {
                  label: 'HKCU:',
                  sub: 'HKEY_CURRENT_USER',
                  detail: 'Settings for the signed-in user. Normal users can edit their own hive.',
                  tone: 'amber',
                },
              ],
            },
            {
              label: 'Environment provider',
              sub: 'Env: drive',
              detail: 'Each environment variable appears as an item. Changes affect this process only.',
              tone: 'green',
            },
            {
              label: 'Certificate provider',
              sub: 'Cert: drive',
              detail: 'Certificate stores appear as folders, and each certificate appears as an item.',
              tone: 'violet',
            },
          ],
        },
      },
      {
        kind: 'compare',
        title: 'Same verbs, different vocabulary',
        caption: 'The Registry provider reuses folder commands, but values are not files.',
        left: {
          heading: 'FileSystem drive (C:)',
          tone: 'cyan',
          rows: [
            { label: 'Container', value: 'Folder' },
            { label: 'Leaf item', value: 'File' },
            { label: 'Read the data', value: 'Get-Content' },
            { label: 'Read the details', value: 'Get-ItemProperty (size, dates)' },
          ],
        },
        right: {
          heading: 'Registry drive (HKLM:)',
          tone: 'amber',
          rows: [
            { label: 'Container', value: 'Key' },
            { label: 'Leaf item', value: 'Value, seen as a property' },
            { label: 'Read the data', value: 'Get-ItemProperty' },
            { label: 'List children', value: 'Get-ChildItem (subkeys only)' },
          ],
        },
        verdict: `Navigation commands carry over. When you need the data inside a registry key, switch from Get-Content to Get-ItemProperty.`,
      },
    ],
  },

  // ==========================================================================
  // 8-2  File hunting, bulk creation, Select-String
  // ==========================================================================
  '8-2': {
    hook: `You need one error message buried somewhere in 4,000 log files. Would you open them one by one, or ask PowerShell to read them all and tell you which file, which line? And would it matter whether you filter early or late?`,
    mentalModel: `Think of Get-ChildItem as a librarian walking the shelves. With -Filter, you give the librarian a note saying only bring me books with this title, so unwanted books never leave the shelf. With Where-Object, the librarian carries every book to your desk and you throw most of them away.`,
    misconceptions: [
      {
        myth: `-Filter *.dll and Where-Object Name -like '*.dll' are the same thing written two ways.`,
        truth: `-Filter is applied by the provider while it reads the folder, so unwanted items are never created as objects. Where-Object runs afterwards in the pipeline on every item. The results match, but the speed does not.`,
        test: `Measure-Command { Get-ChildItem C:\\Windows\\System32 -Filter *.dll } versus Measure-Command { Get-ChildItem C:\\Windows\\System32 | Where-Object Name -like '*.dll' }`,
      },
      {
        myth: `Select-String just prints the matching lines of text, like findstr.`,
        truth: `Select-String returns MatchInfo objects with properties such as Filename, LineNumber, Line and Path. Because they are objects, you can group, sort and export them.`,
        test: `'alpha','beta' | Select-String 'a' | Get-Member   (TypeName is Microsoft.PowerShell.Commands.MatchInfo)`,
      },
      {
        myth: `I can hand New-Item a list of names and it will create all the files in one call.`,
        truth: `New-Item -Name accepts a single string, so an array fails with a binding error. To create several items, pipe the names into ForEach-Object, which runs one New-Item call per name.`,
        test: `'a.txt','b.txt','c.txt' | ForEach-Object { New-Item -Path $env:TEMP -Name $_ -ItemType File -WhatIf }   (three What if lines, nothing created). Passing the array straight to -Name fails with "Cannot convert System.Object[]".`,
      },
    ],
    workedExample: {
      goal: `Build a tiny log lab in your temp folder (lab use only), then find which files contain ERROR and how many times.`,
      steps: [
        {
          think: `I need safe practice data, and I never want to experiment inside real log folders. I will make a throwaway folder under the temp path.`,
          action: `$lab = Join-Path $env:TEMP 'LogLab'; New-Item -Path $lab -ItemType Directory -Force | Out-Null`,
          result: `No output. The folder now exists under your temp directory.`,
        },
        {
          think: `New-Item -Name takes one name per call, so I feed the three names to ForEach-Object, which runs the script block once per name ($_ is the current name). I give every file identical starter text with one INFO and one ERROR line.`,
          action: `$text = 'INFO: started' + [Environment]::NewLine + 'ERROR: timeout'; 'web01.log','db01.log','dc01.log' | ForEach-Object { New-Item -Path $lab -Name $_ -ItemType File -Value $text -Force | Out-Null }`,
          result: `Three .log files appear in the lab folder.`,
        },
        {
          think: `I make the data a bit more interesting by giving db01 a second error.`,
          action: `Add-Content -Path (Join-Path $lab 'db01.log') -Value 'ERROR: replication lag'`,
        },
        {
          think: `Names are matched with -Filter at the source. Then Select-String looks inside each file. Pipelines pass file objects, so I do not have to build paths by hand.`,
          action: `Get-ChildItem -Path $lab -Filter *.log -Recurse | Select-String -Pattern 'ERROR' | Select-Object Filename, LineNumber, Line`,
          result: `Four rows: web01.log line 2, db01.log lines 2 and 3, dc01.log line 2, each with its text.`,
        },
        {
          think: `A manager wants counts per file, and the results are objects, so Group-Object does the job.`,
          action: `Get-ChildItem -Path $lab -Filter *.log | Select-String -Pattern 'ERROR' | Group-Object Filename | Select-Object Count, Name`,
          result: `db01.log has Count 2, and the other two files have Count 1.`,
        },
        {
          think: `I clean up what I created. Preview with -WhatIf first, then run it for real because it is my own temp folder.`,
          action: `Remove-Item -Path $lab -Recurse -WhatIf; Remove-Item -Path $lab -Recurse`,
          result: `The preview names the folder, and then the folder is gone.`,
        },
      ],
      takeaway: `Filter by name early, search content second, then treat the matches as objects. The whole job was one pipeline with no loops and no text parsing.`,
    },
    checkpoints: [
      {
        question: `Get-ChildItem C:\\Windows -Filter *.dll finds only a few DLLs. Why, and what single switch fixes it?`,
        hint: `Which folders did the command look inside?`,
        answer: `Without -Recurse it only looks at the top folder, not subfolders such as System32. Add -Recurse (and usually -ErrorAction SilentlyContinue to skip access denied folders).`,
      },
      {
        question: `Which property of a MatchInfo object tells you the line number where the text was found?`,
        hint: `Pipe a match into Get-Member to see the list.`,
        answer: `LineNumber. Other useful properties are Filename, Path and Line.`,
      },
      {
        question: `Why is Get-ChildItem -Recurse | Where-Object Name -like '*.dll' the slowest of the four search styles?`,
        hint: `Count how many objects get created before filtering happens.`,
        answer: `Every file and folder on the whole tree becomes an object and travels through the pipeline before Where-Object throws most of them away. -Filter avoids that by letting the provider skip them.`,
      },
    ],
    challenge: {
      brief: `List the five largest files in C:\\Windows\\System32 whose names start with net and end in .dll. Show only Name and Length. Then prove with Measure-Command that your -Filter version is faster than a Where-Object version.`,
      hints: [
        `Use -Filter with a wildcard pattern that has both a prefix and an extension.`,
        `Sort-Object Length -Descending, then Select-Object -First 5 Name, Length.`,
        `Wrap each version in Measure-Command { ... } and compare the TotalMilliseconds values.`,
      ],
      solution: `Get-ChildItem -Path C:\\Windows\\System32 -Filter 'net*.dll' |\n  Sort-Object Length -Descending |\n  Select-Object -First 5 Name, Length\n\nMeasure-Command { Get-ChildItem C:\\Windows\\System32 -Filter 'net*.dll' }\nMeasure-Command { Get-ChildItem C:\\Windows\\System32 | Where-Object Name -like 'net*.dll' }`,
      why: `The wildcard goes to the file system provider, which only returns matching names. Sorting by Length works because every result is a FileInfo object with a numeric Length property. The timing difference shows the cost of creating objects you do not need.`,
    },
    teachBack: `Explain to a friend who only knows Ctrl+F in a text editor how PowerShell finds a word across thousands of files and tells you which file and line each match came from.`,
    diagrams: [
      {
        kind: 'compare',
        title: 'Where does the filtering happen?',
        caption: 'The same result can cost very different amounts of work depending on where you filter.',
        left: {
          heading: '-Filter *.dll',
          tone: 'green',
          rows: [
            { label: 'Who filters', value: 'The provider, at the source' },
            { label: 'Objects created', value: 'Only the matches' },
            { label: 'Speed', value: 'Fast' },
            { label: 'Pattern power', value: 'Simple wildcards only' },
          ],
        },
        right: {
          heading: 'Where-Object Name -like',
          tone: 'amber',
          rows: [
            { label: 'Who filters', value: 'The pipeline, afterwards' },
            { label: 'Objects created', value: 'Every item in the folder' },
            { label: 'Speed', value: 'Slower on big trees' },
            { label: 'Pattern power', value: 'Any property, any logic' },
          ],
        },
        verdict: `Use -Filter for names. Add Where-Object only when you need a rule that -Filter cannot express, such as size or date.`,
      },
      {
        kind: 'sequence',
        title: 'Anatomy of a content hunt',
        caption: 'Get-ChildItem hands file objects to Select-String, which opens each file and returns MatchInfo objects.',
        actors: [
          { name: 'You', sub: 'the pipeline', tone: 'blue' },
          { name: 'Get-ChildItem', sub: 'finds files', tone: 'cyan' },
          { name: 'FileSystem provider', sub: 'reads folders', tone: 'amber' },
          { name: 'Select-String', sub: 'reads contents', tone: 'green' },
        ],
        messages: [
          { from: 0, to: 1, label: 'Find *.log, recurse', detail: 'You give a path, a name filter and the recurse switch.' },
          { from: 1, to: 2, label: 'Walk folders', detail: 'The provider reads the directories and applies the -Filter pattern itself.' },
          { from: 2, to: 1, label: 'Matching FileInfo items', detail: 'Only files whose names match come back as objects.' },
          { from: 1, to: 3, label: 'Pipe the file objects', detail: 'Select-String receives each file path from the pipeline.' },
          { from: 3, to: 3, label: 'Scan each line', detail: 'It opens each file and tests every line against your pattern.' },
          { from: 3, to: 0, label: 'MatchInfo objects', detail: 'Each match carries Filename, LineNumber and Line, ready for Group-Object or Export-Csv.' },
        ],
      },
    ],
  },

  // ==========================================================================
  // 9-1  Headless Server Core build
  // ==========================================================================
  '9-1': {
    hook: `A brand new server boots and all you see is a blinking prompt. No desktop, no network settings window. How many commands do you think it takes to give that machine a name, an address and a way to find other computers?`,
    mentalModel: `Picture a new house that needs to join a street. It needs a front door that works (the adapter), a street number (IP and prefix), a road out of the neighbourhood (the gateway) and a phone book to look up names (DNS). You build from the bottom up and you check each piece before adding the next.`,
    misconceptions: [
      {
        myth: `Rename-Computer changes the name immediately, so $env:COMPUTERNAME will show the new name right away.`,
        truth: `The new name is only staged. Windows applies it at the next restart, so until then the old name is still in use.`,
        test: `Rename-Computer -NewName 'SRV-CORE01' -WhatIf   (preview only), then remember that on a real rename $env:COMPUTERNAME keeps the old name until a restart`,
      },
      {
        myth: `-PrefixLength 24 is a mysterious number. It has nothing to do with 255.255.255.0.`,
        truth: `The prefix length counts how many bits from the left are 1 in the subnet mask. 255.255.255.0 has 24 ones, so it is /24.`,
        test: `(('255.255.255.0'.Split('.') | ForEach-Object { [Convert]::ToString([int]$_, 2) }) -join '').TrimEnd('0').Length   (prints 24)`,
      },
      {
        myth: `Once New-NetIPAddress has run with a gateway, the server is fully set up for names too.`,
        truth: `Addressing and name resolution are separate settings. The DNS servers are set with Set-DnsClientServerAddress, and you must check both.`,
        test: `Get-NetIPConfiguration   (compare IPv4Address and IPv4DefaultGateway with DNSServer) and Get-DnsClientServerAddress -AddressFamily IPv4`,
      },
    ],
    workedExample: {
      goal: `Plan and verify the network setup for the lab VM SRV-CORE01 on the LabNet virtual switch (192.168.56.20/24, gateway 192.168.56.1 which is the host side of LabNet, DNS 192.168.56.10 on DC01). Steps that change settings are for a lab VM only.`,
      steps: [
        {
          think: `Before changing anything, I record where I am starting from. If it goes wrong, I want a before picture.`,
          action: `Get-NetIPConfiguration`,
          result: `Each adapter with its current IPv4 address, gateway and DNS server. Typically a DHCP address from the hypervisor on a new VM.`,
        },
        {
          think: `I must not guess the interface number. I pick the adapter that is Up and store its ifIndex in a variable. If the VM has more than one adapter, I choose by name instead, for example Get-NetAdapter -Name 'Ethernet', so I never configure the wrong one.`,
          action: `$ifIndex = (Get-NetAdapter | Where-Object Status -eq 'Up' | Select-Object -First 1).ifIndex; $ifIndex`,
          result: `A single number such as 4.`,
        },
        {
          think: `LAB VM ONLY. This changes the network, so I do it from the VM console, not over a remote session that would drop. A DHCP-enabled adapter can reject a manual address, so I turn DHCP off first.`,
          action: `Set-NetIPInterface -InterfaceIndex $ifIndex -Dhcp Disabled; New-NetIPAddress -InterfaceIndex $ifIndex -IPAddress 192.168.56.20 -PrefixLength 24 -DefaultGateway 192.168.56.1`,
          result: `A table showing the new address, prefix length 24 and the policy store.`,
        },
        {
          think: `LAB VM ONLY. DNS is its own setting. In the lab universe the DNS server is DC01 at 192.168.56.10. You build that server in module 12, so until then the setting is stored but nothing answers yet.`,
          action: `Set-DnsClientServerAddress -InterfaceIndex $ifIndex -ServerAddresses 192.168.56.10`,
        },
        {
          think: `I never trust a change I have not read back. One command shows address, gateway and DNS together.`,
          action: `Get-NetIPConfiguration -InterfaceIndex $ifIndex`,
          result: `IPv4Address 192.168.56.20, IPv4DefaultGateway 192.168.56.1, DNSServer 192.168.56.10.`,
        },
        {
          think: `The rename is last because it needs a restart. I preview it, apply it, then prove the gateway answers. Test-Connection prints an error if nothing replies, which is also an answer.`,
          action: `Rename-Computer -NewName 'SRV-CORE01' -WhatIf; Test-Connection 192.168.56.1 -Count 2`,
          result: `A preview line for the rename, then two ping replies from the gateway.`,
        },
      ],
      takeaway: `Read the current state, find the adapter by index, change one thing at a time and verify every change with the matching Get command. That order is exactly what you later save as a script.`,
    },
    checkpoints: [
      {
        question: `Why do you look up the ifIndex before running New-NetIPAddress?`,
        hint: `Think about machines with several adapters, some of them virtual.`,
        answer: `The cmdlet must know which network adapter to configure. Guessing can configure the loopback or a disconnected adapter, so you read the number of the active adapter with Get-NetAdapter.`,
      },
      {
        question: `What prefix length matches the mask 255.255.255.0, and what about 255.255.0.0?`,
        hint: `Count the 1 bits.`,
        answer: `255.255.255.0 is /24 and 255.255.0.0 is /16.`,
      },
      {
        question: `Which two Get commands verify the IP address and the DNS servers separately?`,
        hint: `Each Set or New command has a matching Get.`,
        answer: `Get-NetIPAddress -InterfaceIndex <n> -AddressFamily IPv4 for the address and prefix, and Get-DnsClientServerAddress -InterfaceIndex <n> -AddressFamily IPv4 for DNS.`,
      },
    ],
    challenge: {
      brief: `Write a read-only check that compares the current configuration with the plan (192.168.56.20, prefix 24, gateway 192.168.56.1, DNS 192.168.56.10) and prints PASS or FAIL for each item. It must not change anything.`,
      hints: [
        `Start with the ifIndex of the Up adapter, then gather the address, the default route and the DNS servers into variables.`,
        `The default gateway is the NextHop of the route to 0.0.0.0/0 (Get-NetRoute).`,
        `Build one PSCustomObject per check with Item, Expected, Actual and Result, and use -contains for lists.`,
      ],
      solution: `$ifIndex = (Get-NetAdapter | Where-Object Status -eq 'Up' | Select-Object -First 1).ifIndex\n$ip  = Get-NetIPAddress -InterfaceIndex $ifIndex -AddressFamily IPv4\n$gw = Get-NetRoute -InterfaceIndex $ifIndex -DestinationPrefix '0.0.0.0/0' -ErrorAction SilentlyContinue\n$dns = (Get-DnsClientServerAddress -InterfaceIndex $ifIndex -AddressFamily IPv4).ServerAddresses\n\n@(\n  [PSCustomObject]@{ Item = 'IP';      Expected = '192.168.56.20'; Actual = ($ip.IPAddress -join ','); Result = if ($ip.IPAddress -contains '192.168.56.20') { 'PASS' } else { 'FAIL' } }\n  [PSCustomObject]@{ Item = 'Prefix';  Expected = '24'; Actual = ($ip.PrefixLength -join ','); Result = if ($ip.PrefixLength -contains 24) { 'PASS' } else { 'FAIL' } }\n  [PSCustomObject]@{ Item = 'Gateway'; Expected = '192.168.56.1'; Actual = ($gw.NextHop -join ','); Result = if ($gw.NextHop -contains '192.168.56.1') { 'PASS' } else { 'FAIL' } }\n  [PSCustomObject]@{ Item = 'DNS';     Expected = '192.168.56.10'; Actual = ($dns -join ','); Result = if ($dns -contains '192.168.56.10') { 'PASS' } else { 'FAIL' } }\n) | Format-Table -AutoSize`,
      why: `Every value comes from a Get command, so nothing is changed. Using -contains handles adapters that report more than one value, and the PASS or FAIL column turns a visual check into something a script can repeat on every new server.`,
    },
    teachBack: `Explain to a friend who only uses the Wi-Fi settings window how a server with no screen gets its name, address, gateway and DNS, and why you check every step afterwards.`,
    diagrams: [
      {
        kind: 'layers',
        title: 'The connectivity ladder',
        caption: 'When a new server cannot reach a name, check from the bottom rung upward. A higher rung cannot work if a lower one is broken.',
        layers: [
          { label: 'DNS resolves names', sub: 'Set-DnsClientServerAddress', detail: 'Turns a name such as DC01 into an IP address. Fails if the DNS server is wrong or unreachable.', tone: 'violet' },
          { label: 'Gateway reachable', sub: 'DefaultGateway 192.168.56.1', detail: 'The way out of your subnet. Without it you can only talk to neighbours in 192.168.56.0/24.', tone: 'amber' },
          { label: 'IP address and prefix', sub: '192.168.56.20 /24', detail: 'Your street number and the size of your neighbourhood. The prefix decides who counts as local.', tone: 'green' },
          { label: 'Adapter is Up', sub: 'Get-NetAdapter, ifIndex', detail: 'The physical or virtual network card must be connected. Everything above depends on it.', tone: 'cyan' },
        ],
        traceLabel: 'Troubleshoot bottom up',
        tracePath: [3, 2, 1, 0],
      },
      {
        kind: 'compare',
        title: 'Rename-Computer: staged, then applied',
        caption: 'The name you typed and the name Windows is using are different for a short while.',
        left: {
          heading: 'Right after Rename-Computer',
          tone: 'amber',
          rows: [
            { label: '$env:COMPUTERNAME', value: 'Still the old name' },
            { label: 'New name', value: 'Staged, waiting' },
            { label: 'Network identity', value: 'Old name in use' },
            { label: 'Next action', value: 'Restart-Computer' },
          ],
        },
        right: {
          heading: 'After the restart',
          tone: 'green',
          rows: [
            { label: '$env:COMPUTERNAME', value: 'SRV-CORE01' },
            { label: 'New name', value: 'Active' },
            { label: 'Network identity', value: 'New name in use' },
            { label: 'Next action', value: 'Verify and continue' },
          ],
        },
        verdict: `Put the rename last in your script, or pass -Restart, so the machine never runs half renamed while you are still configuring it.`,
      },
      {
        kind: 'layers',
        title: 'From network card to settings',
        caption: 'Every network cmdlet points at one adapter by its ifIndex. Pick the right one first, switch DHCP off, and only then set the address and the DNS server.',
        layers: [
          { label: 'Network adapter (NIC)', sub: 'Get-NetAdapter', detail: 'The virtual card the hypervisor gives the VM. A VM with a NAT card and a LabNet card has two, so choose by Name and Status instead of taking the first one.', tone: 'cyan' },
          { label: 'ifIndex', sub: 'The number every cmdlet uses', detail: 'A small integer that identifies the adapter on this machine only. It is different on every computer, so read it, never copy it from a tutorial.', tone: 'blue' },
          { label: 'DHCP switched off', sub: 'Set-NetIPInterface -Dhcp', detail: 'Hypervisor adapters start with DHCP on. New-NetIPAddress can fail or leave two addresses on the card until DHCP is disabled.', tone: 'amber' },
          { label: 'IP address and gateway', sub: 'New-NetIPAddress', detail: 'Applied to the interface by -InterfaceIndex. In the lab this is 192.168.56.20 with prefix length 24.', tone: 'green' },
          { label: 'DNS servers', sub: 'Set-DnsClientServerAddress', detail: 'A separate setting on the same interface. In the lab it points at DC01, 192.168.56.10.', tone: 'violet' },
        ],
        traceLabel: 'Configure one adapter',
        tracePath: [0, 1, 2, 3, 4],
      },
    ],
  },

  // ==========================================================================
  // 9-2  Hands-on admin workout
  // ==========================================================================
  '9-2': {
    hook: `Your report file is named 04-10-2026 but today is 4 November. Is the clock broken, or did a single letter in your script just put the minutes where the month should be?`,
    mentalModel: `Think of an admin workout as a small factory line. Raw objects come in (users, disks, services), you shape them with Select-Object and calculated properties, then pick a packaging style at the end: plain text, spreadsheet or web page. The shaping is the skill, the packaging is a last step.`,
    misconceptions: [
      {
        myth: `In a date format, mm means month, so dd-mm-yyyy gives 04-11-2026.`,
        truth: `Lowercase mm is minutes. Uppercase MM is the month. At 05:10 on 4 November, dd-mm-yyyy prints 04-10-2026.`,
        test: `Get-Date -Format 'mm'; Get-Date -Format 'MM'   (the first is the minute, the second is the month)`,
      },
      {
        myth: `ConvertTo-Html creates an HTML file on my disk.`,
        truth: `It only converts objects into HTML text and sends that text down the pipeline. Out-File or Set-Content is what writes it to a file.`,
        test: `Get-Service | Select-Object -First 2 Name, Status | ConvertTo-Html | Select-Object -First 4   (text lines appear on screen, no file is created)`,
      },
      {
        myth: `I can pipe any custom object into New-LocalUser and PowerShell will work out what each property means.`,
        truth: `Binding ByPropertyName only works when a property name matches a parameter name that accepts pipeline input. Check which parameters qualify before you build the object.`,
        test: `Get-Help New-LocalUser -Parameter * | Select-Object Name, PipelineInput`,
      },
    ],
    workedExample: {
      goal: `Produce a dated disk report as CSV and HTML in your temp folder, with free space shown in readable units.`,
      steps: [
        {
          think: `File names with dates must sort correctly, so I use year first. And I use capital MM for the month.`,
          action: `$stamp = Get-Date -Format 'yyyy-MM-dd_HH-mm'; $stamp`,
          result: `Something like 2026-11-04_05-10.`,
        },
        {
          think: `Get-Volume gives sizes in bytes, which nobody wants to read. First I look at the raw data to see which properties I have.`,
          action: `Get-Volume | Where-Object DriveLetter | Select-Object DriveLetter, FileSystemLabel, FileSystem, HealthStatus, Size, SizeRemaining`,
          result: `One row per lettered volume with large byte counts.`,
        },
        {
          think: `A calculated property turns bytes into rounded gigabytes and a percentage. I save the result in a variable so both report types use the same data.`,
          action: `$report = Get-Volume | Where-Object DriveLetter | Select-Object DriveLetter, FileSystemLabel, @{Name='SizeGB'; Expression={[math]::Round($_.Size / 1GB, 1)}}, @{Name='FreeGB'; Expression={[math]::Round($_.SizeRemaining / 1GB, 1)}}, @{Name='PctFree'; Expression={[math]::Round(100 * $_.SizeRemaining / $_.Size, 0)}}`,
        },
        {
          think: `For a spreadsheet I want clean columns. In Windows PowerShell 5.1 the CSV gets a type header line unless I add -NoTypeInformation, so I add it (PowerShell 7 accepts it too).`,
          action: `$csv = Join-Path $env:TEMP "disks_$stamp.csv"; $report | Export-Csv -Path $csv -NoTypeInformation`,
          result: `A CSV file appears in your temp folder.`,
        },
        {
          think: `For a manager I want a web page. ConvertTo-Html only makes text, so I pipe it into Out-File.`,
          action: `$html = Join-Path $env:TEMP "disks_$stamp.html"; $report | ConvertTo-Html -Title "Disks $stamp" | Out-File -FilePath $html`,
          result: `An HTML file with a table of volumes.`,
        },
        {
          think: `I prove the files are valid by reading one back instead of assuming.`,
          action: `Import-Csv $csv | Format-Table -AutoSize; Test-Path $html`,
          result: `The table prints again from the CSV, and Test-Path returns True.`,
        },
      ],
      takeaway: `Shape the data once, then choose an output format. Dates go in file names year first with capital MM, and each Convert or Export step ends at a file only when you add the writer.`,
    },
    checkpoints: [
      {
        question: `Which format string gives 04-11-2026 for 4 November 2026, and what does the wrong version print at 05:10?`,
        hint: `Month is uppercase.`,
        answer: `dd-MM-yyyy gives 04-11-2026. The wrong dd-mm-yyyy prints 04-10-2026 at 05:10 because mm is minutes.`,
      },
      {
        question: `What is the difference between Out-File and Export-Csv?`,
        hint: `One saves what you would see on screen, the other saves properties as columns.`,
        answer: `Out-File writes the screen-style text representation to a file. Export-Csv writes each object property as a column, which is what Excel and later Import-Csv expect.`,
      },
      {
        question: `Why does the HTML report need a pipeline into Out-File?`,
        hint: `Which cmdlets write to disk?`,
        answer: `ConvertTo-Html only builds HTML text in memory. Out-File (or Set-Content) is the step that writes that text to a file.`,
      },
    ],
    challenge: {
      brief: `Export the five longest-running processes (oldest StartTime) to a CSV in your temp folder named oldest-processes-<yyyy-MM-dd>.csv. Include Name, Id and the runtime in hours rounded to one decimal.`,
      hints: [
        `Some system processes hide their StartTime, so first keep only processes where StartTime has a value.`,
        `Sort-Object StartTime puts the oldest first, then Select-Object -First 5.`,
        `Runtime is (Get-Date) - $_.StartTime. Use a calculated property with .TotalHours and [math]::Round.`,
      ],
      solution: `$stamp = Get-Date -Format 'yyyy-MM-dd'\nGet-Process -ErrorAction SilentlyContinue |\n  Where-Object { $_.StartTime } |\n  Sort-Object StartTime |\n  Select-Object -First 5 Name, Id, @{Name='RuntimeHours'; Expression={[math]::Round(((Get-Date) - $_.StartTime).TotalHours, 1)}} |\n  Export-Csv -Path (Join-Path $env:TEMP "oldest-processes-$stamp.csv") -NoTypeInformation`,
      why: `Subtracting two dates gives a TimeSpan, and TotalHours turns it into a number. The calculated property adds a column that does not exist on the process object, and the capital MM in the date format keeps the file name correct.`,
    },
    teachBack: `Explain to a friend who only knows how to save a file from Notepad why PowerShell has three different ways to save the same data, and when you pick each one.`,
    diagrams: [
      {
        kind: 'compare',
        title: 'One letter, two meanings',
        caption: 'Example moment: 4 November 2026 at 05:10. Case matters in .NET date format strings.',
        left: {
          heading: 'dd-MM-yyyy',
          tone: 'green',
          rows: [
            { label: 'dd', value: 'Day: 04' },
            { label: 'MM (uppercase)', value: 'Month: 11' },
            { label: 'yyyy', value: 'Year: 2026' },
            { label: 'Result', value: '04-11-2026' },
          ],
        },
        right: {
          heading: 'dd-mm-yyyy',
          tone: 'red',
          rows: [
            { label: 'dd', value: 'Day: 04' },
            { label: 'mm (lowercase)', value: 'Minute: 10' },
            { label: 'yyyy', value: 'Year: 2026' },
            { label: 'Result', value: '04-10-2026' },
          ],
        },
        verdict: `The wrong version still looks like a perfectly valid date, which is why this bug survives code reviews. Memorize: capital M for Month.`,
      },
      {
        kind: 'tree',
        title: 'Choosing the right writer',
        caption: 'The same objects can leave the pipeline in three shapes. Pick the one that matches your reader.',
        root: {
          label: 'Shaped objects',
          sub: 'Select-Object output',
          detail: 'After Where-Object and Select-Object, the data is ready. The last step decides the format.',
          tone: 'blue',
          children: [
            {
              label: 'Out-File',
              sub: 'Plain text .txt',
              detail: 'Saves the screen-style table as text. Good for a quick note, poor for further processing.',
              tone: 'cyan',
            },
            {
              label: 'Export-Csv',
              sub: 'Spreadsheet columns',
              detail: 'One column per property. Add -NoTypeInformation on Windows PowerShell 5.1 to skip the #TYPE line.',
              tone: 'green',
            },
            {
              label: 'ConvertTo-Html | Out-File',
              sub: 'Web page',
              detail: 'ConvertTo-Html builds the markup in memory, and Out-File saves it. Good for managers and audit folders.',
              tone: 'violet',
            },
          ],
        },
      },
    ],
  },

  // ==========================================================================
  // 10-1  Scripts and execution policies
  // ==========================================================================
  '10-1': {
    hook: `You save a script, type its name and PowerShell refuses to run it, even though the file is right there. Is PowerShell being awkward, or protecting you from something that bit people for decades?`,
    mentalModel: `Execution policy is a seatbelt, not a locked door. It stops an honest person from driving off by accident, such as double-clicking a script that came from the internet. It was never designed to stop someone who is already sitting in the driver seat.`,
    misconceptions: [
      {
        myth: `If I set the execution policy to Restricted, nobody can run scripts on this machine.`,
        truth: `Anyone with a shell can start a new PowerShell process with a different policy, so the policy only prevents accidents. Stopping attackers takes tools such as AppLocker or WDAC.`,
        test: `powershell.exe -NoProfile -ExecutionPolicy Bypass -Command Get-ExecutionPolicy   (prints Bypass in the new process)`,
      },
      {
        myth: `I can type hello.ps1 while I am in the same folder. The .\\ part is just a habit.`,
        truth: `PowerShell never searches the current folder for commands. The .\\ prefix says explicitly that you mean the file right here, which stops a planted file from hijacking a normal command name.`,
        test: `Set-Location $env:TEMP; Set-Content hello.ps1 'Write-Output hi'; hello.ps1   (error with a suggestion to use .\\hello.ps1), then .\\hello.ps1`,
      },
      {
        myth: `RemoteSigned means every script must be signed.`,
        truth: `Only scripts that carry the Mark of the Web (an NTFS stream called Zone.Identifier) need a trusted signature. Scripts you wrote locally run without one.`,
        test: `Get-Item .\\hello.ps1 -Stream *   (only the :$DATA stream for a local file; a downloaded one also lists Zone.Identifier)`,
      },
    ],
    workedExample: {
      goal: `See with your own eyes the two gates in front of a script: the .\\ rule and the Mark of the Web. Everything stays in your temp folder and no policy is changed.`,
      steps: [
        {
          think: `I need a harmless script to experiment with, in a folder where I cannot hurt anything.`,
          action: `Set-Location $env:TEMP; Set-Content -Path .\\hello.ps1 -Value 'Write-Output "Hello from a script"'`,
          result: `A one-line script hello.ps1 now exists in your temp folder.`,
        },
        {
          think: `First, the mistake everyone makes. I type only the name.`,
          action: `hello.ps1`,
          result: `An error saying the command was not found, with a suggestion that it exists in the current location and that PowerShell does not load commands from there by default.`,
        },
        {
          think: `Now I say explicitly that I mean this file. If my policy is Restricted I will see a policy error instead, which is the second gate.`,
          action: `.\\hello.ps1`,
          result: `Hello from a script (or a message that running scripts is disabled, if your policy is Restricted).`,
        },
        {
          think: `I will simulate a download by adding the stream Windows adds to internet files. ZoneId 3 means Internet.`,
          action: `Set-Content -Path .\\hello.ps1 -Stream Zone.Identifier -Value '[ZoneTransfer]','ZoneId=3'; Get-Item .\\hello.ps1 -Stream *`,
          result: `Two streams are listed: the normal :$DATA and Zone.Identifier.`,
        },
        {
          think: `I test RemoteSigned in a child process so my real policy is untouched. The script is unsigned and marked as downloaded, so it should be blocked.`,
          action: `powershell.exe -NoProfile -ExecutionPolicy RemoteSigned -File .\\hello.ps1`,
          result: `An error that the file is not digitally signed and cannot be run.`,
        },
        {
          think: `I have read the script and trust it, so I remove the mark instead of weakening the policy, and try again.`,
          action: `Unblock-File -Path .\\hello.ps1; powershell.exe -NoProfile -ExecutionPolicy RemoteSigned -File .\\hello.ps1`,
          result: `Hello from a script.`,
        },
      ],
      takeaway: `Two separate gates exist. The .\\ rule decides which file you mean. The policy decides whether PowerShell will run it, and for downloaded files that decision hangs on the Mark of the Web.`,
    },
    checkpoints: [
      {
        question: `What does PowerShell look for when you type just script.ps1, and why does it not look in the current folder?`,
        hint: `Think about someone planting a fake ping.bat.`,
        answer: `It searches the folders listed in $env:PATH, not the current folder. Skipping the current folder stops a malicious file placed there from running when you type a normal command name. Use .\\script.ps1 to run a file from the current folder.`,
      },
      {
        question: `Which policy lets you run your own unsigned scripts but blocks unsigned scripts from the internet?`,
        hint: `The name hints at where scripts come from.`,
        answer: `RemoteSigned. Local scripts run freely, and scripts with the Mark of the Web need a trusted signature or must be unblocked.`,
      },
      {
        question: `Why is execution policy not a security boundary?`,
        hint: `How many ways are there to start PowerShell?`,
        answer: `Anyone who can start PowerShell can choose another policy for their own process (for example -ExecutionPolicy Bypass) or paste code straight into the console. The policy protects against accidents, not against a determined user.`,
      },
    ],
    challenge: {
      brief: `Your policy is Restricted and you need to run a script you just wrote, once, without changing any saved setting. Show the one command that allows scripts for this PowerShell window only, then explain which scope ranks above it and which below.`,
      hints: [
        `Set-ExecutionPolicy has a -Scope parameter. One scope lasts only as long as the process.`,
        `Run Get-ExecutionPolicy -List to see all five scopes in order.`,
        `The scope you want is Process. MachinePolicy and UserPolicy (Group Policy) beat it, while CurrentUser and LocalMachine lose to it.`,
      ],
      solution: `Set-ExecutionPolicy -Scope Process -ExecutionPolicy RemoteSigned -Force\nGet-ExecutionPolicy -List\n.\\hello.ps1`,
      why: `The Process scope lives only in the current window and vanishes when it closes, so no permanent setting changes. Precedence is MachinePolicy, UserPolicy, Process, CurrentUser, then LocalMachine. If Group Policy defines a value, it wins and this command will not override it.`,
    },
    teachBack: `Explain to a friend who only double-clicks files why PowerShell makes you type .\\ before a script name and why a file downloaded from the internet is treated differently from one you wrote.`,
    diagrams: [
      {
        kind: 'layers',
        title: 'Which execution policy wins?',
        caption: 'Get-ExecutionPolicy -List shows five scopes. PowerShell reads them from the top and uses the first one that is defined.',
        layers: [
          { label: 'MachinePolicy', sub: 'Group Policy, whole computer', detail: 'Set by an administrator in a domain. Nothing below can override it.', tone: 'red' },
          { label: 'UserPolicy', sub: 'Group Policy, per user', detail: 'Also from Group Policy, but applied to the signed-in user.', tone: 'red' },
          { label: 'Process', sub: 'This window only', detail: 'Set with -Scope Process or -ExecutionPolicy on the command line. Disappears when the process ends.', tone: 'amber' },
          { label: 'CurrentUser', sub: 'Saved in your profile', detail: 'Applies to you only. Changing it does not need an elevated shell.', tone: 'green' },
          { label: 'LocalMachine', sub: 'Saved for all users', detail: 'The default scope for Set-ExecutionPolicy. Needs an elevated shell.', tone: 'cyan' },
        ],
        traceLabel: 'Find the winning policy',
        tracePath: [0, 1, 2, 3, 4],
      },
      {
        kind: 'compare',
        title: 'Seatbelt or locked door?',
        caption: 'Execution policy helps in the first column and does not help in the second.',
        left: {
          heading: 'Honest mistake',
          tone: 'green',
          rows: [
            { label: 'Who', value: 'A tired admin' },
            { label: 'Action', value: 'Double-clicks a downloaded .ps1' },
            { label: 'Policy effect', value: 'Blocked or warned' },
            { label: 'Outcome', value: 'Accident prevented' },
          ],
        },
        right: {
          heading: 'Deliberate attacker',
          tone: 'red',
          rows: [
            { label: 'Who', value: 'Someone with a shell' },
            { label: 'Action', value: 'Starts powershell -ExecutionPolicy Bypass' },
            { label: 'Policy effect', value: 'Skipped for that process' },
            { label: 'Real defence', value: 'AppLocker, WDAC, Constrained Language Mode' },
          ],
        },
        verdict: `Keep RemoteSigned as a safety habit, and build real protection with application control.`,
      },
    ],
  },

  // ==========================================================================
  // 10-2  Control flow
  // ==========================================================================
  '10-2': {
    hook: `Your script just ran one time too many and touched a server that does not exist. Where do you think the extra loop came from, and could a single character have caused it?`,
    mentalModel: `Every script is a road trip with three kinds of road signs: a straight road (sequence), a fork where you choose a direction (if/else) and a roundabout where you keep circling until the exit appears (loops). Master these three signs and any script is just a map made of them.`,
    misconceptions: [
      {
        myth: `for ($i = 0; $i -le $arr.Count; $i++) is fine. It just goes up to the last item.`,
        truth: `Arrays count from zero, so an array of 4 items has indexes 0 to 3. Using -le runs a fifth time with index 4, which does not exist and gives $null.`,
        test: `$arr = 'a','b','c','d'; for ($i = 0; $i -le $arr.Count; $i++) { "[$i] = $($arr[$i])" }   (the last line shows an empty value)`,
      },
      {
        myth: `If I change $x inside foreach ($x in $numbers), the original array changes too.`,
        truth: `The loop variable is a copy of each simple value. To change elements in place, loop with an index and assign to $numbers[$i].`,
        test: `$n = 1,2,3; foreach ($x in $n) { $x = $x * 10 }; $n   (still 1, 2, 3)`,
      },
      {
        myth: `if ($n = 5) tests whether $n equals 5.`,
        truth: `A single = assigns. It stores 5 in $n and the condition becomes true because 5 is a non-zero value. Comparison uses -eq.`,
        test: `$n = 3; if ($n = 5) { 'ran' }; $n   (prints ran, and $n is now 5)`,
      },
    ],
    workedExample: {
      goal: `Turn raw disk numbers into a health report with a decision for each drive, and then wait for a service with a safety timeout.`,
      steps: [
        {
          think: `I begin with the data. Some FileSystem drives (such as special ones) have no free space value, so I keep only those that do.`,
          action: `$drives = Get-PSDrive -PSProvider FileSystem | Where-Object { $null -ne $_.Free }`,
        },
        {
          think: `Before looping, I work out the logic for one item. Bytes become gigabytes, and I round so the number is readable.`,
          action: `$d = $drives | Select-Object -First 1; $freeGB = [math]::Round($d.Free / 1GB, 1); $freeGB`,
          result: `A number such as 369.7.`,
        },
        {
          think: `Now the decision. I order the tests from worst to best, because the first true branch wins and the rest are skipped.`,
          action: `if ($freeGB -lt 10) { $state = 'CRITICAL' } elseif ($freeGB -lt 25) { $state = 'WARNING' } else { $state = 'HEALTHY' }; $state`,
          result: `HEALTHY for a disk with plenty of space.`,
        },
        {
          think: `With the logic proven on one item, I wrap it in foreach. I use $() so the property is expanded inside the string.`,
          action: `foreach ($d in $drives) { $freeGB = [math]::Round($d.Free / 1GB, 1); if ($freeGB -lt 10) { $state = 'CRITICAL' } elseif ($freeGB -lt 25) { $state = 'WARNING' } else { $state = 'HEALTHY' }; Write-Output "$($d.Name): $freeGB GB free ($state)" }`,
          result: `One line per drive, for example C: 369.7 GB free (HEALTHY).`,
        },
        {
          think: `A while loop waits for a state change. A loop with no exit can hang a script forever, so I add a deadline. This only reads the service status and never starts anything.`,
          action: `$deadline = (Get-Date).AddSeconds(5); while ((Get-Service -Name Spooler).Status -ne 'Running' -and (Get-Date) -lt $deadline) { Start-Sleep -Seconds 1 }`,
          result: `Returns instantly if the Print Spooler is running, otherwise it gives up after 5 seconds.`,
        },
        {
          think: `After the loop I must still ask why it ended: success or timeout.`,
          action: `if ((Get-Service -Name Spooler).Status -eq 'Running') { 'Spooler is up' } else { 'Timed out waiting for Spooler' }`,
          result: `One of the two messages.`,
        },
      ],
      takeaway: `Prove the logic on one item, then wrap it in a loop. Order if/elseif tests from strictest to loosest, and give every while loop a way out.`,
    },
    checkpoints: [
      {
        question: `An array has 6 items. What are the first and last valid indexes, and which comparison belongs in the for loop?`,
        hint: `Counting starts at zero.`,
        answer: `0 and 5. Use $i -lt $arr.Count, never -le.`,
      },
      {
        question: `When do you pick for over foreach?`,
        hint: `Which loop gives you the position?`,
        answer: `When you need the index, for example to change an element in place with $arr[$i] = value. For simply reading each item, foreach is cleaner.`,
      },
      {
        question: `What does Test-Connection -ComputerName SRV01 -Count 1 -Quiet return, and why does that help in an if?`,
        hint: `It is not a table.`,
        answer: `A single $true or $false. An if statement needs a true or false value, so you can use the command directly as the condition.`,
      },
    ],
    challenge: {
      brief: `Given the servers localhost and 192.0.2.1 (a documentation address that should not answer), print one line per server saying ONLINE or OFFLINE, using a single ping each.`,
      hints: [
        `Put the names in an array and walk through them with foreach.`,
        `Test-Connection has a -Count and a -Quiet switch that return one true or false.`,
        `Use if ( ... ) { ... } else { ... } with the Test-Connection call as the condition.`,
      ],
      solution: `$servers = 'localhost', '192.0.2.1'\nforeach ($s in $servers) {\n  if (Test-Connection -ComputerName $s -Count 1 -Quiet) {\n    Write-Output "$s ONLINE"\n  } else {\n    Write-Output "$s OFFLINE"\n  }\n}`,
      why: `foreach gives you each name without any index arithmetic. -Quiet turns the ping into a boolean, which is exactly what if expects. The else branch handles the failure case, so the script always prints something for every server.`,
    },
    teachBack: `Explain to a friend who only knows how to follow a recipe how sequence, if/else and loops are enough to build any script, and why the choice between for and foreach matters.`,
    diagrams: [
      {
        kind: 'tree',
        title: 'Which loop do I need?',
        caption: 'Ask what you are repeating over, and the loop picks itself.',
        root: {
          label: 'I need to repeat something',
          sub: 'Start here',
          detail: 'First decide what drives the repetition: a collection, a position or a condition.',
          tone: 'blue',
          children: [
            {
              label: 'I have a collection',
              sub: 'foreach ($x in $list)',
              detail: 'Best for reading or processing each object. No counters, no off-by-one errors.',
              tone: 'green',
            },
            {
              label: 'I need the position',
              sub: 'for ($i = 0; ...)',
              detail: 'Use when you must change $arr[$i] in place or work with neighbouring items.',
              tone: 'cyan',
            },
            {
              label: 'I am waiting for a change',
              sub: 'while (condition)',
              detail: 'Loops until something becomes true. Always add a deadline or a maximum count.',
              tone: 'amber',
            },
          ],
        },
      },
      {
        kind: 'compare',
        title: 'The off-by-one trap',
        caption: 'Array of 4 items: valid indexes are 0, 1, 2 and 3.',
        left: {
          heading: '$i -lt $arr.Count',
          tone: 'green',
          rows: [
            { label: 'Last $i', value: '3' },
            { label: 'Passes', value: '4 (one per item)' },
            { label: 'Last value', value: 'The 4th item' },
            { label: 'Extra empty pass', value: 'None' },
          ],
        },
        right: {
          heading: '$i -le $arr.Count',
          tone: 'red',
          rows: [
            { label: 'Last $i', value: '4' },
            { label: 'Passes', value: '5 (one too many)' },
            { label: 'Last value', value: '$null (no such index)' },
            { label: 'Extra empty pass', value: 'Yes, and it can break logic' },
          ],
        },
        verdict: `Always compare with -lt against Count (or Length). Count is the number of items, and the last index is one less.`,
      },
    ],
  },

  // ==========================================================================
  // 11-1  Modules and the PowerShell Gallery
  // ==========================================================================
  '11-1': {
    hook: `You installed a module an hour ago, yet Get-Module does not list it. Did the install fail, or are you asking the wrong question?`,
    mentalModel: `A module is a book. The PowerShell Gallery is the online bookshop, your module folders are your bookshelf, and your session memory is the open book on your desk. Buying (Install-Module) puts it on the shelf. Opening (Import-Module) puts it on the desk. Get-Module only shows the desk unless you ask for the shelf.`,
    misconceptions: [
      {
        myth: `Get-Module shows everything installed on this computer.`,
        truth: `Get-Module alone shows only modules loaded into the current session. Add -ListAvailable to search the module folders on disk.`,
        test: `(Get-Module).Count; (Get-Module -ListAvailable).Count   (the second number is much larger)`,
      },
      {
        myth: `Install-Module also loads the module, so I can use its cmdlets straight away in an old window.`,
        truth: `Installing only copies files to disk. Modern PowerShell auto-imports a module when you call one of its cmdlets, but only if the module sits in a folder in $env:PSModulePath. Scripts should call Import-Module explicitly so the intent is clear.`,
        test: `Get-Module -Name NetAdapter   (usually empty), then Get-NetAdapter | Out-Null, then Get-Module -Name NetAdapter   (now it appears)`,
      },
      {
        myth: `Modules live in one place, and Windows PowerShell and PowerShell 7 share them.`,
        truth: `$env:PSModulePath lists several folders, and the two editions start with different personal and shared folders. A module installed for one edition may not be visible in the other.`,
        test: `$env:PSModulePath -split ';'   (run it in powershell.exe and again in pwsh.exe and compare)`,
      },
    ],
    workedExample: {
      goal: `Track down where a cmdlet comes from, load its module and browse the Gallery safely. (Gallery steps need internet access.)`,
      steps: [
        {
          think: `A cmdlet name is useless to me without knowing which module owns it. Get-Command tells me.`,
          action: `Get-Command -Name Get-NetAdapter | Select-Object Name, Source, Version`,
          result: `Source is the module name NetAdapter.`,
        },
        {
          think: `Is the module on the shelf (disk)? That is the -ListAvailable question, and ModuleBase shows the exact folder.`,
          action: `Get-Module -ListAvailable -Name NetAdapter | Select-Object Name, Version, ModuleBase`,
          result: `At least one row, with a path under C:\\WINDOWS\\system32\\WindowsPowerShell\\v1.0\\Modules.`,
        },
        {
          think: `Is it on the desk (loaded) right now? I load it explicitly and check again.`,
          action: `Import-Module -Name NetAdapter; Get-Module -Name NetAdapter | Select-Object Name, Version`,
          result: `The module is listed as loaded.`,
        },
        {
          think: `How big is the toolbox? I count the commands it provides, which tells me what I just gained.`,
          action: `Get-Command -Module NetAdapter | Measure-Object | Select-Object Count`,
          result: `A count of the module's cmdlets.`,
        },
        {
          think: `Now the bookshop. Searching is read-only. On a fresh Windows PowerShell 5.1 you may be asked to install the NuGet provider, which is fine in a lab. If the call fails with a TLS or connection error, older 5.1 builds may need TLS 1.2 switched on for the session first.`,
          action: `Find-Module -Name Posh-Git | Select-Object Name, Version, Repository`,
          result: `One row for Posh-Git from PSGallery.`,
        },
        {
          think: `I preview the install with -WhatIf and choose CurrentUser scope so no administrator rights are needed.`,
          action: `Install-Module -Name Posh-Git -Scope CurrentUser -WhatIf`,
          result: `A What if line, and nothing is installed.`,
        },
      ],
      takeaway: `Use the four questions in order: who owns this cmdlet, is it on disk, is it loaded, and is it available online. Each question has a different command.`,
    },
    checkpoints: [
      {
        question: `Which command lists modules installed on disk, and which lists those loaded in the session?`,
        hint: `One of them needs a switch.`,
        answer: `Get-Module -ListAvailable for the disk, and plain Get-Module for the current session.`,
      },
      {
        question: `Why use -Scope CurrentUser with Install-Module?`,
        hint: `Where does it write by default?`,
        answer: `The default writes to C:\\Program Files, which needs administrator rights. CurrentUser installs into your own profile folder and needs no elevation.`,
      },
      {
        question: `How can you see every folder PowerShell searches for modules?`,
        hint: `It is an environment variable.`,
        answer: `$env:PSModulePath -split ';' prints one folder per line.`,
      },
    ],
    challenge: {
      brief: `Write a snippet that takes a module name in a variable and prints one object showing whether it is installed, whether it is loaded, the highest installed version and its folder. Test it with NetTCPIP.`,
      hints: [
        `Get-Module -ListAvailable -Name $name may return several versions. Sort and take the newest.`,
        `A missing module gives $null. Cast the result to [bool] to make a true or false.`,
        `Finish with a [PSCustomObject]@{ ... } so the answer is one tidy row.`,
      ],
      solution: `$name = 'NetTCPIP'\n$installed = Get-Module -ListAvailable -Name $name | Sort-Object Version -Descending | Select-Object -First 1\n$loaded = Get-Module -Name $name\n[PSCustomObject]@{\n  Module    = $name\n  Installed = [bool]$installed\n  Loaded    = [bool]$loaded\n  Version   = $installed.Version\n  Folder    = $installed.ModuleBase\n}`,
      why: `Two different questions use two different commands, which is the whole lesson in one snippet. Sorting by Version handles side by side versions, and the cast turns $null or an object into a clean true or false.`,
    },
    teachBack: `Explain to a friend who only uses phone apps the difference between a module being downloaded, being saved on the computer and being opened in the current session.`,
    diagrams: [
      {
        kind: 'layers',
        title: 'Where a cmdlet can live',
        caption: 'A command is found in the first place that has it. Each move down the stack needs a different action from you.',
        layers: [
          { label: 'You type a cmdlet', sub: 'For example Get-NetAdapter', detail: 'PowerShell must find a command with that name before anything can run.', tone: 'blue' },
          { label: 'Session memory', sub: 'Get-Module', detail: 'Modules already imported. Their cmdlets run immediately.', tone: 'green' },
          { label: 'Module folders on disk', sub: 'Get-Module -ListAvailable', detail: 'Folders listed in $env:PSModulePath. PowerShell auto-imports from here when you call a cmdlet.', tone: 'cyan' },
          { label: 'PowerShell Gallery', sub: 'Find-Module, Install-Module', detail: 'The online repository. Nothing here runs until you install it to disk.', tone: 'violet' },
        ],
        traceLabel: 'Trace a missing cmdlet',
        tracePath: [0, 1, 2, 3],
      },
      {
        kind: 'tree',
        title: 'Your module bookshelf',
        caption: 'PowerShell checks each folder in $env:PSModulePath. The exact paths differ between Windows PowerShell 5.1 and PowerShell 7.',
        root: {
          label: '$env:PSModulePath',
          sub: 'Semicolon-separated list',
          detail: 'Every folder in this list is searched when you run Get-Module -ListAvailable or call an unknown cmdlet.',
          tone: 'blue',
          children: [
            {
              label: 'Your user Modules folder',
              sub: 'Documents\\PowerShell\\Modules',
              detail: 'Where Install-Module -Scope CurrentUser writes. In Windows PowerShell 5.1 the folder is Documents\\WindowsPowerShell\\Modules.',
              tone: 'green',
            },
            {
              label: 'Program Files Modules',
              sub: 'Shared for all users',
              detail: 'Where Install-Module -Scope AllUsers writes. Needs an elevated shell.',
              tone: 'amber',
            },
            {
              label: 'System32 Modules',
              sub: 'Built into Windows',
              detail: 'Ships with the operating system, for example NetTCPIP and Microsoft.PowerShell.LocalAccounts. You should not change it.',
              tone: 'cyan',
            },
          ],
        },
      },
      {
        kind: 'layers',
        title: 'A module from search to removal',
        caption: 'Five verbs cover the whole life of a module. Install and remove touch the disk, import and remove-from-session touch only your current window.',
        layers: [
          { label: 'Find', sub: 'Find-Module', detail: 'Searches the PowerShell Gallery. Read-only, but it needs internet and, on older Windows PowerShell 5.1 builds, TLS 1.2 and the NuGet provider.', tone: 'violet' },
          { label: 'Install', sub: 'Install-Module -Scope CurrentUser', detail: 'Copies the module files into a folder on $env:PSModulePath. Preview it with -WhatIf. CurrentUser needs no administrator rights.', tone: 'cyan' },
          { label: 'Import', sub: 'Import-Module', detail: 'Loads the module into the current session. Modern PowerShell does this automatically on the first call, but scripts should import explicitly.', tone: 'green' },
          { label: 'Update', sub: 'Update-Module', detail: 'Downloads a newer version beside the old one. Side-by-side versions are normal, so check Get-Module -ListAvailable afterwards.', tone: 'amber' },
          { label: 'Remove', sub: 'Remove-Module, Uninstall-Module', detail: 'Remove-Module only unloads it from this session. Uninstall-Module deletes the files from disk.', tone: 'red' },
        ],
        traceLabel: 'Follow a module through its life',
        tracePath: [0, 1, 2, 3, 4],
      },
    ],
  },

  // ==========================================================================
  // 11-2  WinRM and remoting
  // ==========================================================================
  '11-2': {
    hook: `You can type a command on your laptop and watch it run on fifty servers at once without opening a single remote desktop. What do you think has to happen behind the scenes before that first result comes back?`,
    mentalModel: `Remoting is a courier service with a reception desk. WinRM is the desk on the server that checks your ID and then hires a private worker (a remote PowerShell process) just for you. You hand the worker a note (your scriptblock), the worker does the job and mails back a photocopy of the results, not the original objects.`,
    misconceptions: [
      {
        myth: `Port 5985 is HTTP, so my remoting commands travel in clear text.`,
        truth: `WinRM encrypts the PowerShell payload at message level with the keys from Kerberos or NTLM authentication, even over HTTP. HTTPS on 5986 adds transport encryption and server identity checks, which matter most outside a domain.`,
        test: `Get-Item WSMan:\\localhost\\Service\\AllowUnencrypted   (elevated shell, WinRM running: the value is false by default)`,
      },
      {
        myth: `Objects returned from a remote server are the same live objects I would get locally, so I can call their methods.`,
        truth: `Results are serialized to XML and rebuilt on your side as deserialized copies. Properties survive but most methods do not.`,
        test: `Invoke-Command -ComputerName localhost -ScriptBlock { Get-Process -Id $PID } | Get-Member   (TypeName starts with Deserialized, needs remoting enabled on this machine)`,
      },
      {
        myth: `A variable I set on my workstation is available inside the remote scriptblock.`,
        truth: `The scriptblock runs in a different process on a different computer, so it cannot see your variables. Pass them with the $using: prefix or -ArgumentList.`,
        test: `$n = 'WinRM'; Invoke-Command -ComputerName localhost -ScriptBlock { "got: $n" }   (empty) versus { "got: $using:n" }`,
      },
    ],
    workedExample: {
      goal: `Reach a lab Server Core VM called SRV-CORE01 step by step, from "is the door open?" to a persistent session. Lab VM only: remoting must already be enabled, and the examples are read-only.`,
      steps: [
        {
          think: `Always test the door before knocking. Test-WSMan talks to the WinRM listener and fails fast when something is wrong.`,
          action: `Test-WSMan -ComputerName SRV-CORE01`,
          result: `XML-style output with ProductVendor and ProductVersion. An error here means a name, network or firewall problem, not a PowerShell problem.`,
        },
        {
          think: `If it fails, I check the exact port instead of guessing: 5985 is the default HTTP listener.`,
          action: `Test-NetConnection -ComputerName SRV-CORE01 -Port 5985`,
          result: `TcpTestSucceeded : True when the port is reachable.`,
        },
        {
          think: `For a single question I use the fan-out command even for one server, because it is non-interactive and easy to script.`,
          action: `Invoke-Command -ComputerName SRV-CORE01 -ScriptBlock { Get-Service -Name WinRM }`,
          result: `The service row, plus an extra PSComputerName column showing SRV-CORE01.`,
        },
        {
          think: `To explore, I want a prompt that feels like SSH. The prompt changes so I always know where my commands run.`,
          action: `Enter-PSSession -ComputerName SRV-CORE01; hostname; Exit-PSSession`,
          result: `Prompt becomes [SRV-CORE01]: PS C:\\Users\\...>, hostname prints the server name, and Exit-PSSession returns me home.`,
        },
        {
          think: `Now many servers at once, passing a local value in with $using:. Results are tagged with the server that sent them.`,
          action: `$svc = 'WinRM'; Invoke-Command -ComputerName SRV-CORE01, DC01 -ScriptBlock { Get-Service -Name $using:svc } | Select-Object PSComputerName, Name, Status`,
          result: `One row per server, with PSComputerName, Name and Status.`,
        },
        {
          think: `If I will run several commands, a persistent session avoids paying the connection cost and keeps remote variables alive. I always close it afterwards.`,
          action: `$s = New-PSSession -ComputerName SRV-CORE01; Invoke-Command -Session $s -ScriptBlock { $x = 5 }; Invoke-Command -Session $s -ScriptBlock { $x }; Remove-PSSession $s`,
          result: `The second call prints 5, because the session remembered $x.`,
        },
      ],
      takeaway: `Debug remoting from the outside in: name, port, WinRM service, then PowerShell. Use Enter-PSSession to explore and Invoke-Command to automate, and remember that variables and objects do not cross the wire unchanged.`,
    },
    checkpoints: [
      {
        question: `Which TCP port is WinRM over HTTP and which is WinRM over HTTPS?`,
        hint: `Both start with 598.`,
        answer: `5985 for HTTP and 5986 for HTTPS.`,
      },
      {
        question: `What is the difference between Enter-PSSession and Invoke-Command?`,
        hint: `One is a conversation, the other is a broadcast.`,
        answer: `Enter-PSSession opens an interactive one-to-one prompt on a single computer. Invoke-Command runs a scriptblock or script file on one or many computers at once (up to 32 at a time by default, set with -ThrottleLimit) and returns tagged results.`,
      },
      {
        question: `Inside a remote session on SRV-CORE01 you try to open \\\\DC01\\Share and get access denied. What is this called and what is a safe workaround?`,
        hint: `Count the hops from your workstation.`,
        answer: `The double-hop problem. Your credentials are not forwarded from SRV-CORE01 to a third machine. Copy from your workstation with a session (Copy-Item -ToSession), supply explicit credentials, or configure resource-based Kerberos constrained delegation. Avoid enabling CredSSP as a shortcut: it caches your credentials on the remote computer.`,
      },
    ],
    challenge: {
      brief: `Check the free space on C: for SRV-CORE01 and DC01 in one command. Pass a threshold of 20 GB from your workstation and return PSComputerName, FreeGB and a Low flag. Lab VMs only.`,
      hints: [
        `Invoke-Command accepts an array of computer names and one scriptblock.`,
        `Inside the scriptblock, the drive is available through Get-PSDrive -Name C and its Free property is in bytes.`,
        `Bring your local threshold into the scriptblock with $using:threshold and return a PSCustomObject.`,
      ],
      solution: `$threshold = 20\nInvoke-Command -ComputerName SRV-CORE01, DC01 -ScriptBlock {\n  $gb = [math]::Round((Get-PSDrive -Name C).Free / 1GB, 1)\n  [PSCustomObject]@{ FreeGB = $gb; Low = ($gb -lt $using:threshold) }\n} | Select-Object PSComputerName, FreeGB, Low`,
      why: `The scriptblock runs on each server at the same time (Invoke-Command talks to up to 32 computers at once by default). $using:threshold carries your local value across, and the returned objects are serialized back with the PSComputerName property added automatically, so you can tell the servers apart.`,
    },
    teachBack: `Explain to a friend who only knows Remote Desktop how PowerShell Remoting runs a command on a server without showing its screen, and why a file share on a third machine can still say access denied.`,
    diagrams: [
      {
        kind: 'sequence',
        title: 'The remoting handshake',
        caption: 'What happens between pressing Enter on Invoke-Command and seeing the first result. Domain scenario with Kerberos.',
        actors: [
          { name: 'Your workstation', sub: 'CLIENT01, PowerShell client', tone: 'blue' },
          { name: 'WinRM listener', sub: 'SRV-CORE01, HTTP port 5985', tone: 'cyan' },
          { name: 'Domain controller', sub: 'DC01, Kerberos KDC', tone: 'amber' },
          { name: 'wsmprovhost.exe', sub: 'Your remote PowerShell host', tone: 'green' },
        ],
        messages: [
          { from: 0, to: 2, label: 'Ask for a service ticket', detail: 'Using the server name, your workstation asks the domain controller for a Kerberos ticket proving who you are to SRV-CORE01. This is why names beat raw IP addresses.' },
          { from: 0, to: 1, label: 'Connect and authenticate', detail: 'The client opens a WS-Management connection on 5985 (HTTP) or 5986 (HTTPS) and presents the ticket. Session keys encrypt the payload.' },
          { from: 1, to: 1, label: 'Check you are allowed', detail: 'The listener verifies the ticket and confirms you are in Administrators or Remote Management Users (or another allowed group for the endpoint).' },
          { from: 1, to: 3, label: 'Start a remote host', detail: 'WinRM launches a wsmprovhost.exe process that runs as you and hosts a PowerShell runspace for this session.' },
          { from: 0, to: 3, label: 'Send the scriptblock', detail: 'Your command travels as serialized XML. The remote host runs it in its own session, so your local variables are not there unless you use $using:.' },
          { from: 3, to: 0, label: 'Return deserialized results', detail: 'Results are serialized back to XML, tagged with PSComputerName, and rebuilt as copies on your machine.' },
        ],
      },
      {
        kind: 'sequence',
        title: 'Why the second hop fails',
        caption: 'Kerberos proves you to the first server only. SRV-CORE01 has no credential to show the next server.',
        actors: [
          { name: 'Your workstation', sub: 'CLIENT01, hop 0', tone: 'blue' },
          { name: 'SRV-CORE01', sub: 'First hop', tone: 'cyan' },
          { name: 'DC01', sub: 'Second hop (a share)', tone: 'amber' },
        ],
        messages: [
          { from: 0, to: 1, label: 'Invoke-Command succeeds', detail: 'Your Kerberos ticket authenticates you to SRV-CORE01. The remote session runs as you, but only on that machine.' },
          { from: 1, to: 1, label: 'Copy-Item \\\\DC01\\...', detail: 'Inside the remote scriptblock you ask for a file on a third computer.' },
          { from: 1, to: 2, label: 'Request the share', detail: 'SRV-CORE01 contacts DC01, but it has no delegated credential of yours to present.' },
          { from: 2, to: 1, label: 'Access denied', detail: 'DC01 cannot tell who you are, so it refuses. This protects you if SRV-CORE01 were compromised.' },
          { from: 1, to: 0, label: 'Error returned to you', detail: 'You see the failure in your console. Safer fixes: copy from your workstation with -ToSession, pass explicit credentials or use constrained delegation.' },
        ],
      },
    ],
  },
};
