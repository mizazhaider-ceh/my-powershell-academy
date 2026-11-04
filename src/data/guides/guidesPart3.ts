import { LessonGuide } from '../../types';

export const GUIDES_PART_3: Record<string, LessonGuide> = {
  '6-2': {
    oneSentence:
      'Double quotes expand variables, single quotes do not, Write-Host only talks to the screen, and passwords should use Read-Host -AsSecureString or Get-Credential.',
    analogy:
      'Double quotes are like a mail-merge letter: PowerShell opens the envelope and swaps "Dear $name" for "Dear Izaz". Single quotes are like a letter sealed in a glass case: you see exactly what is written, and nothing inside is ever swapped. Write-Output puts a parcel on the conveyor belt so the next machine can pick it up; Write-Host is someone shouting across the room: people hear it, but the next machine on the conveyor belt never receives it. SecureString is a PIN pad that shows dots instead of numbers.',
    plainEnglish: [
      'Inside "double quotes" PowerShell replaces `$variables` with their values. Inside single quotes it prints every character as-is. Same text, very different result.',
      'To print a property inside double quotes you need the `$()` wrapper: `"$($proc.Id)"`. Without it PowerShell only expands `$proc` and leaves `.Id` as plain text.',
      '`Write-Output` sends data down the pipeline so you can save it or pass it on. `Write-Host` shows text on the screen through the Information stream, not the pipeline, so piping it into a file gives you an empty file.',
      'Never type passwords as plain text. `Read-Host -AsSecureString` hides what you type and keeps the password in a protected SecureString (better than plain text, but not strong encryption).',
    ],
    beforeYouStart: [
      'PowerShell 5.1 or 7 on any Windows machine, running in a normal (non-elevated) window.',
      'You have finished the variables lesson, so `$name = "Izaz"` makes sense to you.',
      'Use only made-up passwords for practice. Never type a real password into a lab exercise.',
    ],
    atoZSteps: [
      {
        title: 'Step 1: Make a variable',
        detail: 'Type `$name = "Izaz"` and press Enter. Nothing prints, but PowerShell now remembers the word Izaz under the name `$name`.',
      },
      {
        title: 'Step 2: Compare the two kinds of quotes',
        detail: 'Run `"Hello $name"` and then `\'Hello $name\'`. The first prints Hello Izaz, the second prints Hello $name. That is the whole trap in two lines.',
      },
      {
        title: 'Step 3: Print a property with $()',
        detail: 'Run `$proc = Get-Process -Id $PID` and then `"ID: $($proc.Id)"`. Try it again without the `$()` and see the odd result, so you recognise it when it happens by accident.',
      },
      {
        title: 'Step 4: Prove Write-Host output skips the pipeline',
        detail: 'Pipe `Write-Output` and `Write-Host` into `Out-File` in turn and look at the file sizes. Only Write-Output puts text in the file.',
      },
      {
        title: 'Step 5: Ask for numbers the safe way',
        detail: '`Read-Host` always returns text. Put `[int]` in front (`[int]$count = Read-Host "How many"`) so PowerShell treats the answer as a real number.',
      },
      {
        title: 'Step 6: Ask for a password the safe way',
        detail: 'Use `Read-Host "Password" -AsSecureString` or `Get-Credential`. Type a fake password, see the dots, and notice the value is never shown on screen.',
      },
    ],
    wordsYouWillMeet: [
      { word: 'Expandable string', meaning: 'A string in double quotes where PowerShell replaces $variables with their values.' },
      { word: 'Literal string', meaning: 'A string in single quotes that is printed exactly as typed.' },
      { word: 'Subexpression $()', meaning: 'A wrapper that tells PowerShell to evaluate the code inside first, then insert the result into the string.' },
      { word: 'Output stream', meaning: 'A numbered channel for messages. The Success stream feeds the pipeline; Write-Host uses the Information stream.' },
      { word: 'SecureString', meaning: 'A password type that is hidden on screen and protected in memory (not strong encryption).' },
      { word: 'PSCredential', meaning: 'A package holding a user name plus a SecureString password, used by -Credential parameters.' },
    ],
    beginner: {
      intro:
        'These commands only print text and read information. Nothing is changed on your computer, so experiment freely and compare the outputs side by side.',
      commands: [
        {
          title: 'Double quotes versus single quotes',
          code: '$name = "Izaz"\n"Hello $name"\n\'Hello $name\'',
          whatItDoes: 'Stores a name in a variable, then prints it once with double quotes (expanded) and once with single quotes (literal).',
          parts: [
            { part: '$name = "Izaz"', meaning: 'Creates a variable called name that holds the text Izaz.' },
            { part: '"Hello $name"', meaning: 'Double quotes: PowerShell swaps $name for its value.' },
            { part: '\'Hello $name\'', meaning: 'Single quotes: everything inside is frozen text, so $name is NOT replaced.' },
          ],
          sampleOutput: 'Hello Izaz\nHello $name',
          watchOut: 'If you ever see a literal $variable in your output, check that you did not use single quotes.',
        },
        {
          title: 'Show why $() is needed for properties',
          code: '$proc = Get-Process -Id $PID\n"Wrong: $proc.Id"\n"Right: $($proc.Id)"',
          whatItDoes: 'Gets the process running your PowerShell window and prints its ID the wrong way and the right way.',
          parts: [
            { part: '$PID', meaning: 'Automatic variable holding the process ID of the current PowerShell window.' },
            { part: 'Get-Process -Id', meaning: 'Finds one running process by its numeric ID.' },
            { part: '"Wrong: $proc.Id"', meaning: 'Only $proc is expanded; ".Id" is printed as plain text after it.' },
            { part: '$($proc.Id)', meaning: 'The subexpression operator: evaluate $proc.Id first, then insert just the number.' },
          ],
          sampleOutput: 'Wrong: System.Diagnostics.Process (pwsh).Id\nRight: 8820',
          watchOut: 'Your process ID and process name will differ from the sample.',
        },
        {
          title: 'Write-Output versus Write-Host on screen',
          code: 'Write-Output "Server Ready"\nWrite-Host "Server Ready" -ForegroundColor Green',
          whatItDoes: 'Prints the same words two ways. They look alike on screen, but only the first one travels down the pipeline.',
          parts: [
            { part: 'Write-Output', meaning: 'Puts the text on the pipeline (Success stream). If nothing catches it, PowerShell shows it on screen.' },
            { part: 'Write-Host', meaning: 'Shows text on screen through the Information stream, so it does not travel down the pipeline.' },
            { part: '-ForegroundColor Green', meaning: 'Colours the Write-Host text. Handy for human-friendly status messages.' },
          ],
          sampleOutput: 'Server Ready\nServer Ready',
        },
      ],
    },
    intermediate: {
      intro:
        'Now we use these ideas to build real output: files, typed input and formatted report lines. File examples write only to your TEMP folder.',
      commands: [
        {
          title: 'Prove Write-Host output does not reach a file',
          code: '$f = Join-Path $env:TEMP "status.txt"\nWrite-Host "Server Ready" | Out-File $f\n(Get-Item $f).Length\nWrite-Output "Server Ready" | Out-File $f\n(Get-Item $f).Length',
          whatItDoes: 'Writes to a test file twice. The first length is 0 because Write-Host sent nothing down the pipe; the second length is greater than 0.',
          parts: [
            { part: 'Join-Path $env:TEMP "status.txt"', meaning: 'Builds a safe file path inside your TEMP folder.' },
            { part: '| Out-File $f', meaning: 'Saves whatever arrives through the pipeline into the file (overwrites an existing file).' },
            { part: '(Get-Item $f).Length', meaning: 'Reads the file size in bytes, so you can see whether anything was saved.' },
          ],
          watchOut: 'Out-File overwrites the file each time. Using a TEMP path keeps this experiment away from your real files.',
        },
        {
          title: 'Turn typed input into a real number',
          code: '[int]$count = Read-Host "How many servers"\n$count + 1\n$count.GetType().Name',
          whatItDoes: 'Asks you for a number, converts it from text to an integer, then proves the type by doing maths on it.',
          parts: [
            { part: 'Read-Host "How many servers"', meaning: 'Shows a prompt and waits for you to type something. The answer always comes back as text.' },
            { part: '[int]', meaning: 'A type cast: force the value to become a whole number.' },
            { part: '$count + 1', meaning: 'Adds one. If $count were still text, "5" + 1 would behave very differently.' },
            { part: '.GetType().Name', meaning: 'Asks the value what type it is. You should see Int32.' },
          ],
          sampleOutput: '6\nInt32',
          watchOut: 'Typing letters instead of a number makes the cast fail with an error. Real scripts validate input first.',
        },
        {
          title: 'Build a report line per object with $()',
          code: 'Get-Service | Where-Object Status -eq "Running" | Select-Object -First 3 | ForEach-Object { "Service $($_.Name) is $($_.Status)" }',
          whatItDoes: 'Takes the first three running services and prints a friendly sentence for each one.',
          parts: [
            { part: 'Where-Object Status -eq "Running"', meaning: 'Keeps only services whose Status equals Running.' },
            { part: 'Select-Object -First 3', meaning: 'Stops after three objects so the output stays short.' },
            { part: 'ForEach-Object { ... }', meaning: 'Runs the code in braces once for every object on the pipeline.' },
            { part: '$_', meaning: 'The current object. That is why we need $($_.Name) inside the double quotes.' },
          ],
          sampleOutput: 'Service Appinfo is Running\nService AudioEndpointBuilder is Running\nService Audiosrv is Running',
        },
      ],
    },
    pro: {
      intro:
        'Pro habits: never keep passwords as plain text, never hard-code them, and always dry-run commands that create accounts. Use a lab VM and fake passwords only.',
      commands: [
        {
          title: 'Prompt for a password the secure way',
          code: '$securePwd = Read-Host "Enter lab password" -AsSecureString\n$securePwd.GetType().FullName\n$securePwd.Length',
          whatItDoes: 'Hides your typing, stores the answer as a SecureString and shows the type and the length of the password you entered.',
          parts: [
            { part: 'Read-Host -AsSecureString', meaning: 'Masks the keystrokes and returns a protected SecureString instead of text.' },
            { part: '$securePwd', meaning: 'Variable holding the SecureString. Printing it only shows its type name, never the password.' },
            { part: '.GetType().FullName', meaning: 'Confirms the object really is System.Security.SecureString.' },
          ],
          sampleOutput: 'System.Security.SecureString\n12',
          watchOut: 'Do not name your own variable $pwd. That is a built-in automatic variable holding your current folder.',
        },
        {
          title: 'Collect a user name and password with Get-Credential',
          code: '$cred = Get-Credential -UserName "LAB\\svc-demo" -Message "Lab only: use a fake password"\n$cred.UserName\n$cred.Password.GetType().Name',
          whatItDoes: 'Opens the standard credential dialog and returns a PSCredential object you can hand to any cmdlet that has a -Credential parameter.',
          parts: [
            { part: 'Get-Credential', meaning: 'Shows a secure prompt for a user name and password.' },
            { part: '-UserName', meaning: 'Pre-fills the user name so the operator only types the password.' },
            { part: '-Message', meaning: 'Text shown in the prompt, useful to explain why access is requested.' },
            { part: '$cred.Password', meaning: 'The password stays a SecureString inside the credential object.' },
          ],
          sampleOutput: 'LAB\\svc-demo\nSecureString',
        },
        {
          title: 'Dry-run creating a local user with a SecureString',
          code: '$securePwd = Read-Host "Password for lab user" -AsSecureString\nNew-LocalUser -Name "LabDemo01" -Password $securePwd -Description "Lab only" -WhatIf',
          whatItDoes: 'Shows what New-LocalUser WOULD do without creating the account. The password is passed as a SecureString, never as plain text.',
          parts: [
            { part: 'New-LocalUser', meaning: 'Creates a local Windows account.' },
            { part: '-Password $securePwd', meaning: 'Requires a SecureString, which is why we prompt with -AsSecureString first.' },
            { part: '-Description', meaning: 'A note that explains what the account is for.' },
            { part: '-WhatIf', meaning: 'Dry run: prints what would happen and changes nothing.' },
          ],
          sampleOutput: 'What if: Performing the operation "Create" on target "LabDemo01".',
          watchOut: 'Removing -WhatIf creates a real account. Only do that on a lab VM from an elevated window.',
        },
        {
          title: 'Save a credential encrypted for your own account only',
          code: '$path = Join-Path $env:TEMP "lab.cred.xml"\nGet-Credential -Message "Lab only" | Export-Clixml -Path $path\n$restored = Import-Clixml -Path $path\n$restored.UserName',
          whatItDoes: 'Saves a credential to disk with the password encrypted (Windows DPAPI), then reads it back for automation scripts.',
          parts: [
            { part: 'Export-Clixml', meaning: 'Saves an object to an XML file. For credentials, the password part is encrypted.' },
            { part: 'Import-Clixml', meaning: 'Loads the object back into a variable.' },
            { part: '$restored.UserName', meaning: 'Shows the user name to prove the credential came back intact.' },
          ],
          watchOut: 'Only the same user on the same machine can decrypt the file. Delete it when the lab is finished and never commit it to source control.',
        },
      ],
    },
    recap: [
      'Double quotes expand variables; single quotes keep text literal.',
      'Use `"$($obj.Property)"` whenever you put a property or expression inside double quotes.',
      'Write-Output feeds the pipeline; Write-Host shows text on screen (Information stream) without feeding the pipeline, so never use it to return data.',
      'Read-Host returns text, so cast numbers with `[int]` and always use `-AsSecureString` for passwords.',
    ],
  },
  '7-1': {
    oneSentence:
      'Filter as early as you can, because -Filter works inside the cmdlet at the source while Where-Object tests each object after it has already arrived.',
    analogy:
      'Imagine a warehouse that ships parcels to your house. "Filter Left" is telling the warehouse "only send me the blue boxes" so only blue boxes ever travel. Where-Object is the opposite: the warehouse sends you every box on a truck and you stand in the driveway checking each label yourself. Both give you blue boxes, but one wastes a lot of fuel. Where-Object is still essential when the warehouse cannot sort by the thing you care about.',
    plainEnglish: [
      'Many cmdlets have a parameter that filters at the source, before the data is created or sent over the network (`-Filter` on `Get-ChildItem`, `Get-CimInstance` and `Get-ADUser`; `-FilterHashtable` on `Get-WinEvent`). The syntax differs by cmdlet. That is usually the fastest option, so try it first.',
      '`Where-Object` is the flexible backup. It looks at each object going by, stored for a moment in `$_`, and keeps the object only if your condition is true.',
      'PowerShell uses `-eq`, `-gt`, `-lt` instead of `=`, `>`, `<` because `>` already means "redirect to a file" in command shells.',
      'Combine tests with `-and`, `-or` and `-not`, and match text with `-like` (wildcards) or `-match` (regular expressions).',
    ],
    beforeYouStart: [
      'PowerShell 5.1 or 7 on Windows. A normal window is fine; everything in this guide is read-only.',
      'You know how the pipeline `|` passes objects from one command to the next.',
      'For the Active Directory example you need a domain-joined lab machine with RSAT installed. It is optional.',
    ],
    atoZSteps: [
      {
        title: 'Step 1: Try a simple comparison',
        detail: 'Type `5 -gt 3` and press Enter. PowerShell answers True. Then try `5 -lt 3` for False. These True/False answers are what filters use.',
      },
      {
        title: 'Step 2: Filter at the source first',
        detail: 'Run `Get-ChildItem C:\\Windows\\System32 -Filter *.dll`. The `-Filter` is applied by the file system itself, so it is quick.',
      },
      {
        title: 'Step 3: Use Where-Object when the source cannot filter',
        detail: '`Get-Service` has no switch for "only running". Pipe it: `Get-Service | Where-Object Status -eq "Running"`.',
      },
      {
        title: 'Step 4: Learn $_ with a scriptblock',
        detail: 'Rewrite the same filter as `Get-Service | Where-Object { $_.Status -eq "Running" }`. The braces hold your test and `$_` is the object being inspected right now.',
      },
      {
        title: 'Step 5: Combine conditions',
        detail: 'Add `-and`: `{ $_.Status -eq "Running" -and $_.StartType -eq "Automatic" }`. Both parts must be true for an object to stay.',
      },
      {
        title: 'Step 6: Measure the difference',
        detail: 'Wrap a -Filter command and a Where-Object command in `Measure-Command` and compare TotalMilliseconds. Seeing the gap makes Filter Left stick.',
      },
    ],
    wordsYouWillMeet: [
      { word: 'Filter Left', meaning: 'The rule of filtering as early (as far left) in the command as possible.' },
      { word: '$_ / $PSItem', meaning: 'The automatic variable holding the one object currently being inspected.' },
      { word: 'Comparison operator', meaning: 'A test like -eq, -ne, -gt, -lt, -like or -match that returns True or False.' },
      { word: 'Wildcard', meaning: 'The * symbol, meaning "anything here", used with -like and -Filter.' },
      { word: 'Regex', meaning: 'Regular expression: a mini language for describing text patterns, used with -match.' },
      { word: 'Scriptblock', meaning: 'Code wrapped in { } that Where-Object runs once per object.' },
    ],
    beginner: {
      intro: 'Read-only commands that show you True/False tests and the two ways to filter. Run them as many times as you like.',
      commands: [
        {
          title: 'Meet the comparison operators',
          code: '5 -gt 3\n"apple" -eq "APPLE"\n"apple" -ceq "APPLE"',
          whatItDoes: 'Runs three tests. Greater-than works on numbers; -eq ignores letter case; -ceq (case-sensitive equal) does not.',
          parts: [
            { part: '-gt', meaning: 'Greater than. PowerShell uses this instead of the > symbol.' },
            { part: '-eq', meaning: 'Equal to. Case-insensitive for text by default.' },
            { part: '-ceq', meaning: 'Case-sensitive equal. The leading c means case-sensitive.' },
          ],
          sampleOutput: 'True\nTrue\nFalse',
        },
        {
          title: 'Filter at the source with -Filter',
          code: 'Get-ChildItem -Path C:\\Windows\\System32 -Filter *.dll | Select-Object -First 5 Name, Length',
          whatItDoes: 'Lists DLL files in System32 using the file system own filter, then shows only the first five names and sizes.',
          parts: [
            { part: 'Get-ChildItem', meaning: 'Lists files and folders (aliases: dir, ls, gci).' },
            { part: '-Filter *.dll', meaning: 'Asks the file system to return only names ending in .dll. This is Filter Left in action.' },
            { part: 'Select-Object -First 5 Name, Length', meaning: 'Keeps the first five objects and only the Name and Length columns.' },
          ],
          watchOut: 'This only searches the top of System32, not subfolders. Recursion is covered in a later lesson.',
        },
        {
          title: 'Filter with Where-Object (simple form)',
          code: 'Get-Service | Where-Object Status -eq "Running"',
          whatItDoes: 'Lists only the services that are currently running.',
          parts: [
            { part: 'Get-Service', meaning: 'Returns every Windows service as an object.' },
            { part: 'Where-Object Status -eq "Running"', meaning: 'Keeps objects whose Status property equals the word Running.' },
            { part: '|', meaning: 'The pipeline: hands each service from the left command to the right one.' },
          ],
          sampleOutput: 'Status   Name               DisplayName\n------   ----               -----------\nRunning  Appinfo            Application Information\nRunning  AudioEndpointBu... Windows Audio Endpoint Builder',
        },
      ],
    },
    intermediate: {
      intro: 'Real admin filtering: several conditions, wildcards, regex and the source-side filter that keeps work on the server where it belongs.',
      commands: [
        {
          title: 'Two conditions with a scriptblock and $_',
          code: 'Get-Service | Where-Object { $_.Status -eq "Running" -and $_.StartType -eq "Automatic" }',
          whatItDoes: 'Shows services that are running AND set to start automatically.',
          parts: [
            { part: '{ ... }', meaning: 'The scriptblock holding your test. It runs once for every service.' },
            { part: '$_', meaning: 'The service currently being inspected.' },
            { part: '-and', meaning: 'Both sides must be True for the service to be kept.' },
            { part: '$_.StartType', meaning: 'A second property of the same object, read with a dot.' },
          ],
        },
        {
          title: 'Wildcards and regex together',
          code: 'Get-Service | Where-Object { $_.Name -match "^W" -and $_.DisplayName -like "*Update*" }',
          whatItDoes: 'Finds services whose name starts with W and whose display name contains the word Update.',
          parts: [
            { part: '-match "^W"', meaning: 'Regex test. The ^ means "at the start", so the name must begin with W.' },
            { part: '-like "*Update*"', meaning: 'Wildcard test. The * on both sides means "contains".' },
            { part: '-and', meaning: 'Combines the two tests.' },
          ],
          watchOut: '-like needs a * to behave like "contains". Without it, -like works just like -eq.',
        },
        {
          title: 'Filter Left on WMI/CIM',
          code: 'Get-CimInstance -ClassName Win32_Service -Filter "State=\'Running\' AND StartMode=\'Auto\'" | Select-Object -First 5 Name, State, StartMode',
          whatItDoes: 'Asks Windows itself for only running, automatic services, so fewer objects are created in the first place.',
          parts: [
            { part: 'Get-CimInstance -ClassName Win32_Service', meaning: 'Reads the Windows services class through CIM.' },
            { part: '-Filter "..."', meaning: 'A WQL query condition evaluated by the source. It uses single = and AND, not PowerShell operators.' },
            { part: 'Select-Object -First 5', meaning: 'Keeps the output short for practice.' },
          ],
          watchOut: 'Inside -Filter you must use the source language (WQL here), not -eq or -and.',
        },
      ],
    },
    pro: {
      intro: 'Prove the speed claim with measurements, and use source filters on big data stores such as event logs and Active Directory. All commands here are read-only.',
      commands: [
        {
          title: 'Measure Filter Left versus Where-Object',
          code: 'Measure-Command { Get-ChildItem C:\\Windows\\System32 -Filter *.dll } | Select-Object TotalMilliseconds\nMeasure-Command { Get-ChildItem C:\\Windows\\System32 | Where-Object Name -like "*.dll" } | Select-Object TotalMilliseconds',
          whatItDoes: 'Times the same search done at the source and in the pipeline so you can see the difference with your own eyes.',
          parts: [
            { part: 'Measure-Command { ... }', meaning: 'Runs the code in braces and reports how long it took.' },
            { part: '-Filter *.dll', meaning: 'Source-side filtering.' },
            { part: 'Where-Object Name -like "*.dll"', meaning: 'Pipeline filtering after every item has been created.' },
            { part: 'Select-Object TotalMilliseconds', meaning: 'Shows just the elapsed time in milliseconds.' },
          ],
          watchOut: 'The first run can be slower because of file caching. Run each twice and compare the second result.',
        },
        {
          title: 'Check membership with -in',
          code: '$wanted = "Spooler", "W32Time", "BITS"\nGet-Service | Where-Object { $_.Name -in $wanted } | Select-Object Name, Status',
          whatItDoes: 'Checks a whole watch-list of service names in one line, a pattern used in monitoring scripts.',
          parts: [
            { part: '$wanted = "A","B","C"', meaning: 'An array: a list of values separated by commas.' },
            { part: '-in $wanted', meaning: 'True when the left value appears anywhere in the list.' },
            { part: 'Select-Object Name, Status', meaning: 'Shows just the two columns you care about.' },
          ],
        },
        {
          title: 'Filter the event log at the source',
          code: 'Get-WinEvent -FilterHashtable @{ LogName = "System"; Level = 2; StartTime = (Get-Date).AddDays(-1) } -MaxEvents 5 | Select-Object TimeCreated, Id, ProviderName',
          whatItDoes: 'Pulls only the latest five System-log errors from the last 24 hours without loading the whole log.',
          parts: [
            { part: '-FilterHashtable @{ ... }', meaning: 'A dictionary of conditions applied by the event log service itself.' },
            { part: 'Level = 2', meaning: 'Event level 2 means Error.' },
            { part: '(Get-Date).AddDays(-1)', meaning: 'A date one day ago, used as the start time.' },
            { part: '-MaxEvents 5', meaning: 'Stops after five results.' },
          ],
          watchOut: 'If no events match, Get-WinEvent writes a "No events were found" error. That is normal, not a failure.',
        },
        {
          title: 'Filter Left in Active Directory',
          code: 'Get-ADUser -Filter "Department -eq \'IT\'" -Properties Department | Select-Object Name, Department',
          whatItDoes: 'Asks the domain controller for only IT users instead of downloading every account and filtering locally.',
          parts: [
            { part: 'Get-ADUser', meaning: 'Reads user accounts from Active Directory (needs the ActiveDirectory module/RSAT).' },
            { part: '-Filter "Department -eq \'IT\'"', meaning: 'Filter written as a string. It runs on the domain controller.' },
            { part: '-Properties Department', meaning: 'Requests the Department attribute, which is not returned by default.' },
          ],
          watchOut: 'Lab domain only. Never use -Filter * | Where-Object on a large production domain.',
        },
      ],
    },
    recap: [
      'Filter Left: use the cmdlet own filter parameter (`-Filter`, `-FilterHashtable` and so on) first; it is usually much faster, especially over a network. Measure it with Measure-Command.',
      'Where-Object checks each object in turn through `$_`; keep it for properties the source cannot filter.',
      'PowerShell uses -eq, -ne, -gt, -ge, -lt, -le, -like, -match, -in because > and = already have other jobs.',
      'Combine tests with -and, -or and -not, and remember -like needs a * wildcard.',
    ],
  },
  '7-2': {
    oneSentence:
      'Sort before you Select -First N, and preview anything destructive with -WhatIf or -Confirm so a mistake stays on paper.',
    analogy:
      'Think of a talent show. If you pick the first three contestants who walk in and THEN ask which is the best singer, you will never meet the real winner. You must let everybody perform and rank them first, then pick the top three. And -WhatIf is the rehearsal before the live show: the stagehands walk through every move, but the curtain never opens.',
    plainEnglish: [
      'The order of pipeline stages matters. Sort first, then take the top few with `Select-Object -First`. If you slice first, you only sort a random handful.',
      'A good default order is: Get, Filter, Sort, Select, Output.',
      '`Select-Object -Property` keeps columns inside an object. `-ExpandProperty` pulls out the raw value itself, which is what you want when feeding plain text to another command.',
      '`-WhatIf` is a dry run for commands that support it (check `Get-Help` for `[-WhatIf]`). `-Confirm` asks you to approve each change. `-Verbose` explains what the command is doing.',
    ],
    beforeYouStart: [
      'PowerShell 5.1 or 7 on Windows.',
      'You can filter with `Where-Object` (previous lesson).',
      'For -WhatIf practice, a lab VM or your own PC is fine. -WhatIf changes nothing, but never remove it on a production server without a review.',
    ],
    atoZSteps: [
      {
        title: 'Step 1: Sort a list',
        detail: 'Run `Get-Process | Sort-Object WorkingSet64 -Descending`. The biggest memory users appear first.',
      },
      {
        title: 'Step 2: Take the top of the list',
        detail: 'Add `| Select-Object -First 3 Name, WorkingSet64`. Now you have the top 3 memory users, because sorting came first.',
      },
      {
        title: 'Step 3: Break it on purpose',
        detail: 'Swap the order: `Get-Process | Select-Object -First 3 | Sort-Object WorkingSet64 -Descending`. Notice the answer is just three alphabetical processes. This is the ordering trap.',
      },
      {
        title: 'Step 4: Extract a raw value',
        detail: 'Compare `Get-Service Spooler | Select-Object Status` with `... | Select-Object -ExpandProperty Status`. The second gives plain text, not a table.',
      },
      {
        title: 'Step 5: Dry-run a risky command',
        detail: 'Run `Get-Process -Name notepad -ErrorAction SilentlyContinue | Stop-Process -WhatIf`. Read the "What if:" lines. Nothing was stopped.',
      },
      {
        title: 'Step 6: Make it a habit',
        detail: 'Before any Stop-, Remove-, Set- or New- command in a real environment, run it once with -WhatIf, read the target list, then run it for real.',
      },
    ],
    wordsYouWillMeet: [
      { word: 'Sort-Object', meaning: 'Reorders objects by one or more properties (alias: sort).' },
      { word: 'Select-Object', meaning: 'Picks columns or slices rows such as the first or last few (alias: select).' },
      { word: '-ExpandProperty', meaning: 'Returns the raw value of one property instead of a wrapper object.' },
      { word: '-WhatIf', meaning: 'A dry-run switch that shows what would happen without doing it.' },
      { word: '-Confirm', meaning: 'A switch that asks for a yes/no answer before each change.' },
      { word: 'Descending', meaning: 'Largest first, newest first, or Z to A.' },
    ],
    beginner: {
      intro: 'All read-only. You will sort, slice and extract values, and see why the order of stages matters.',
      commands: [
        {
          title: 'Top 3 memory users (the right way)',
          code: 'Get-Process | Sort-Object WorkingSet64 -Descending | Select-Object -First 3 Name, WorkingSet64',
          whatItDoes: 'Ranks every process by memory (largest first), then keeps only the top three.',
          parts: [
            { part: 'Sort-Object WorkingSet64 -Descending', meaning: 'Sorts by the memory property, biggest first.' },
            { part: 'Select-Object -First 3', meaning: 'Keeps only the first three objects after sorting.' },
            { part: 'Name, WorkingSet64', meaning: 'The two columns to display.' },
          ],
          sampleOutput: 'Name        WorkingSet64\n----        ------------\nmsedge        812646400\nchrome        604225536\nSearchHost    311296000',
          watchOut: 'WorkingSet64 is in bytes, so the numbers look large.',
        },
        {
          title: 'Just the first few rows',
          code: 'Get-Service | Select-Object -First 5 Name, Status',
          whatItDoes: 'Shows the first five services and only the Name and Status columns, handy for a quick peek.',
          parts: [
            { part: 'Select-Object', meaning: 'Chooses which columns and which rows to keep.' },
            { part: '-First 5', meaning: 'Only the first five objects. -Last 5 would give the final five.' },
            { part: 'Name, Status', meaning: 'Only these properties are kept.' },
          ],
        },
        {
          title: 'Get the raw value of one property',
          code: 'Get-Service -Name Spooler | Select-Object -ExpandProperty Status',
          whatItDoes: 'Returns just the word describing the Print Spooler state instead of a table with a Status column.',
          parts: [
            { part: 'Get-Service -Name Spooler', meaning: 'Finds the single service called Spooler.' },
            { part: '-ExpandProperty Status', meaning: 'Pulls the value out of the Status property and drops the object wrapper.' },
          ],
          sampleOutput: 'Running',
        },
      ],
    },
    intermediate: {
      intro: 'Ordering, uniqueness and your first safe dry-run. Read the output carefully: a wrong order gives no error, only a wrong answer.',
      commands: [
        {
          title: 'See the ordering trap with your own eyes',
          code: '# WRONG: slices before sorting\nGet-Process | Select-Object -First 3 | Sort-Object WorkingSet64 -Descending | Select-Object Name\n# RIGHT: sorts everything first\nGet-Process | Sort-Object WorkingSet64 -Descending | Select-Object -First 3 | Select-Object Name',
          whatItDoes: 'Runs both orders. The wrong one returns three alphabetical processes; the right one returns the real top three.',
          parts: [
            { part: '# ...', meaning: 'A comment. PowerShell ignores everything after the # on that line.' },
            { part: 'Select-Object -First 3 | Sort-Object', meaning: 'Slice first, sort second: you sorted only three random items.' },
            { part: 'Sort-Object ... | Select-Object -First 3', meaning: 'Sort first, slice second: the correct top three.' },
          ],
          watchOut: 'No error appears for the wrong version. Only your result is wrong.',
        },
        {
          title: 'List the unique values in a column',
          code: 'Get-Service | Select-Object -ExpandProperty StartType | Select-Object -Unique',
          whatItDoes: 'Shows each start type once (for example Automatic, Manual, Disabled) rather than hundreds of repeats.',
          parts: [
            { part: '-ExpandProperty StartType', meaning: 'Returns the raw start type value for every service.' },
            { part: 'Select-Object -Unique', meaning: 'Removes duplicates so each value is shown only once.' },
          ],
          sampleOutput: 'Manual\nAutomatic\nDisabled',
        },
        {
          title: 'Dry-run stopping a process',
          code: 'Get-Process -Name notepad -ErrorAction SilentlyContinue | Stop-Process -WhatIf',
          whatItDoes: 'Pretends to stop every Notepad. It prints what would be stopped and ends nothing.',
          parts: [
            { part: '-ErrorAction SilentlyContinue', meaning: 'Hides the red error if Notepad is not running.' },
            { part: 'Stop-Process', meaning: 'Ends running processes. This is a destructive cmdlet.' },
            { part: '-WhatIf', meaning: 'Turns the command into a simulation.' },
          ],
          sampleOutput: 'What if: Performing the operation "Stop-Process" on target "notepad (4812)".',
          watchOut: 'If Notepad is not open there is no output at all. Open Notepad and run it again to see the message.',
        },
      ],
    },
    pro: {
      intro: 'Make safety part of your scripts: prompts, session-wide dry-runs and your own functions that support -WhatIf. Use a lab VM for anything that deletes.',
      commands: [
        {
          title: 'Ask before each change with -Confirm',
          code: 'Get-Process -Name notepad -ErrorAction SilentlyContinue | Stop-Process -Confirm',
          whatItDoes: 'Prompts Yes / No for each Notepad process before it is stopped.',
          parts: [
            { part: 'Stop-Process', meaning: 'Ends the process objects that arrive from the pipeline.' },
            { part: '-Confirm', meaning: 'Forces an interactive prompt with options like [Y] Yes, [N] No, [A] Yes to All.' },
          ],
          watchOut: 'Answering Y really stops Notepad. Save your work first.',
        },
        {
          title: 'Turn on dry-run mode for the whole session',
          code: '$WhatIfPreference = $true\nGet-ChildItem $env:TEMP -Filter *.tmp | Remove-Item\n$WhatIfPreference = $false',
          whatItDoes: 'Makes every cmdlet in the session behave as if -WhatIf was typed. The delete is only simulated; the last line switches normal mode back on.',
          parts: [
            { part: '$WhatIfPreference', meaning: 'A built-in preference variable. True means all state-changing cmdlets only simulate.' },
            { part: 'Remove-Item', meaning: 'Deletes files. Safe here only because the preference is on.' },
            { part: '$WhatIfPreference = $false', meaning: 'Returns to normal. Forgetting this means later commands never run for real.' },
          ],
          watchOut: 'Always reset the variable afterwards, or your next real command will silently do nothing.',
        },
        {
          title: 'Build your own function that supports -WhatIf',
          code: 'function Remove-OldLog {\n  [CmdletBinding(SupportsShouldProcess)]\n  param([string]$Path, [int]$Days = 30)\n  Get-ChildItem $Path -Filter *.log |\n    Where-Object LastWriteTime -lt (Get-Date).AddDays(-$Days) |\n    Remove-Item\n}\nRemove-OldLog -Path C:\\Logs -Days 30 -WhatIf',
          whatItDoes: 'Defines a cleanup function that gets -WhatIf and -Confirm for free, then dry-runs it on a log folder.',
          parts: [
            { part: '[CmdletBinding(SupportsShouldProcess)]', meaning: 'Turns on -WhatIf and -Confirm for your function.' },
            { part: 'param(...)', meaning: 'Declares the inputs: a folder path and a number of days.' },
            { part: 'Where-Object LastWriteTime -lt (Get-Date).AddDays(-$Days)', meaning: 'Keeps files older than the chosen number of days.' },
            { part: 'Remove-Item', meaning: 'Inherits the -WhatIf you pass to the function, so nothing is deleted.' },
          ],
          watchOut: 'Test with a lab folder. Remove -WhatIf only after you have read the list of files it would delete.',
        },
      ],
    },
    recap: [
      'Order your pipeline: Get, Filter, Sort, Select. Select -First before Sort gives wrong answers silently.',
      '`-ExpandProperty` returns a raw value; `-Property` keeps an object with columns.',
      '-WhatIf simulates a change, -Confirm asks first, -Verbose explains what is happening.',
      'Run every Stop-, Remove-, Set- or New- command with -WhatIf first.',
    ],
  },
  '8-1': {
    oneSentence:
      'PowerShell treats the registry, environment variables, and even Active Directory like drives, so cd and Get-ChildItem work inside HKLM:, Env:, and AD:.',
    analogy:
      'Think of a universal TV remote. Whether you are controlling a TV, a speaker or a lamp, the same buttons (up, down, select) work. A PSProvider is the little adapter that teaches the remote how to talk to a device, and a PSDrive is the labelled button on the remote (C:, HKLM:, Env:). Once you know the file buttons (`cd`, `dir`), you can browse the Registry, environment variables and certificates too.',
    plainEnglish: [
      'A PSProvider is a plug-in that makes a data store look like folders and items. A PSDrive is a named entrance to it, such as `C:`, `HKLM:`, `Env:` or `Cert:`.',
      'That means `Get-ChildItem`, `Set-Location` and `Get-ItemProperty` work on files, the Registry, environment variables and more.',
      'Registry keys behave like folders; registry values are called properties, so you read them with `Get-ItemProperty`.',
      'You can create your own shortcut drives with `New-PSDrive`. They only last for your current session unless you add `-Persist` for network drives.',
    ],
    beforeYouStart: [
      'PowerShell 5.1 or 7 on Windows, normal window for reading.',
      'You understand `cd` and `dir` (Set-Location and Get-ChildItem).',
      'Be careful in the Registry. Reading is safe; changing or deleting can break Windows. Practice writes only on a lab VM.',
    ],
    atoZSteps: [
      {
        title: 'Step 1: See the adapters',
        detail: 'Run `Get-PSProvider`. You will see FileSystem, Registry, Environment, Variable, Alias, Function and Certificate.',
      },
      {
        title: 'Step 2: See the drives',
        detail: 'Run `Get-PSDrive`. Notice that `C:` and `HKLM:` are both in the list. Each drive belongs to one provider.',
      },
      {
        title: 'Step 3: Browse environment variables',
        detail: 'Run `Get-ChildItem Env:` to list them, then `$env:COMPUTERNAME` to read one.',
      },
      {
        title: 'Step 4: Step into the Registry',
        detail: 'Run `Set-Location HKLM:\\SOFTWARE\\Microsoft` and then `Get-ChildItem`. You are listing registry keys like folders. Use `Set-Location C:\\` to return.',
      },
      {
        title: 'Step 5: Read registry values',
        detail: 'Use `Get-ItemProperty` on a key such as the `Run` key to see some of the programs that start with Windows (it is only one of several startup locations, along with RunOnce, Startup folders, scheduled tasks and services). Security teams check these keys for suspicious startup entries.',
      },
      {
        title: 'Step 6: Build a shortcut drive',
        detail: 'Create `New-PSDrive -Name Run -PSProvider Registry -Root HKLM:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Run`, use it, then remove it with `Remove-PSDrive`.',
      },
    ],
    wordsYouWillMeet: [
      { word: 'PSProvider', meaning: 'The adapter that exposes a data store (files, Registry, certificates) as folders and items.' },
      { word: 'PSDrive', meaning: 'A named drive from a provider, for example C:, HKLM:, Env: or Cert:.' },
      { word: 'HKLM / HKCU', meaning: 'Registry hives: HKEY_LOCAL_MACHINE (whole computer) and HKEY_CURRENT_USER (your account).' },
      { word: 'Registry key / value', meaning: 'A key is like a folder; a value (property) is a named setting inside it.' },
      { word: 'Environment variable', meaning: 'A named setting such as COMPUTERNAME or PATH that programs can read.' },
      { word: 'Certificate store', meaning: 'The place Windows keeps certificates, browsed with the Cert: drive.' },
    ],
    beginner: {
      intro: 'Read-only exploration. You are just looking at what drives PowerShell already has.',
      commands: [
        {
          title: 'List the providers',
          code: 'Get-PSProvider',
          whatItDoes: 'Shows every provider plug-in loaded and the drives each one supplies.',
          parts: [{ part: 'Get-PSProvider', meaning: 'Lists provider adapters such as FileSystem, Registry, Environment and Certificate.' }],
          sampleOutput: 'Name          Capabilities                      Drives\n----          ------------                      ------\nRegistry      ShouldProcess, Transactions       {HKLM, HKCU}\nEnvironment   ShouldProcess                     {Env}\nFileSystem    Filter, ShouldProcess, Credentials {C, D}',
        },
        {
          title: 'List the drives',
          code: 'Get-PSDrive | Select-Object Name, Provider, Root',
          whatItDoes: 'Shows every drive, which provider owns it and where it points.',
          parts: [
            { part: 'Get-PSDrive', meaning: 'Lists all PowerShell drives, including non-disk ones like Env: and HKLM:.' },
            { part: 'Select-Object Name, Provider, Root', meaning: 'Keeps three useful columns.' },
          ],
        },
        {
          title: 'Browse environment variables',
          code: 'Get-ChildItem Env: | Select-Object -First 5\n$env:COMPUTERNAME',
          whatItDoes: 'Lists the first five environment variables, then reads one directly.',
          parts: [
            { part: 'Get-ChildItem Env:', meaning: 'Lists items in the Env: drive, the same command you use for files.' },
            { part: '$env:COMPUTERNAME', meaning: 'Shortcut for reading a single environment variable; the colon points to the Env: drive.' },
          ],
          sampleOutput: 'Name            Value\n----            -----\nALLUSERSPROFILE C:\\ProgramData\nAPPDATA         C:\\Users\\izaz\\AppData\\Roaming\n...\nWORKSTATION01',
        },
      ],
    },
    intermediate: {
      intro: 'Navigate the Registry and read values, such as startup entries and Windows version details. Still read-only.',
      commands: [
        {
          title: 'Walk into the Registry and back',
          code: 'Push-Location HKLM:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\nGet-ChildItem | Select-Object -First 5 Name\nPop-Location',
          whatItDoes: 'Moves into a registry location, lists a few subkeys, then returns to where you were.',
          parts: [
            { part: 'Push-Location', meaning: 'Like cd, but remembers where you came from.' },
            { part: 'Get-ChildItem', meaning: 'Lists the keys under the current registry location.' },
            { part: 'Pop-Location', meaning: 'Goes back to the remembered folder.' },
          ],
        },
        {
          title: 'Review startup programs',
          code: 'Get-ItemProperty HKLM:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Run\nGet-ItemProperty HKCU:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Run',
          whatItDoes: 'Prints programs set to launch at logon for all users and for you (two common startup locations, not the complete list). Defenders review these keys when checking for unwanted persistence.',
          parts: [
            { part: 'Get-ItemProperty', meaning: 'Reads the values (properties) stored in a key.' },
            { part: 'HKLM:\\...\\Run', meaning: 'Run key for every user on this computer.' },
            { part: 'HKCU:\\...\\Run', meaning: 'Run key for only the current user.' },
          ],
          watchOut: 'An empty result is normal. Unknown entries deserve investigation, but not every unfamiliar name is harmful.',
        },
        {
          title: 'Read one registry value',
          code: 'Get-ItemPropertyValue -Path "HKLM:\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion" -Name ProductName',
          whatItDoes: 'Returns the Windows edition name stored in the Registry as a plain value.',
          parts: [
            { part: 'Get-ItemPropertyValue', meaning: 'Returns only the raw value (no table).' },
            { part: '-Path', meaning: 'The registry key. Quotes protect the space in "Windows NT".' },
            { part: '-Name ProductName', meaning: 'The value to read.' },
          ],
          sampleOutput: 'Windows 11 Pro',
        },
      ],
    },
    pro: {
      intro: 'Pro habits: shortcut drives, certificate audits, dry-run writes and remote registry checks. Use a lab VM for anything that writes.',
      commands: [
        {
          title: 'Find certificates expiring soon',
          code: 'Get-ChildItem Cert:\\LocalMachine\\My | Where-Object NotAfter -lt (Get-Date).AddDays(90) | Select-Object Subject, NotAfter, Thumbprint',
          whatItDoes: 'Checks the machine certificate store and lists certificates that expire in the next 90 days.',
          parts: [
            { part: 'Cert:\\LocalMachine\\My', meaning: 'Certificate drive: the computer personal certificate store.' },
            { part: 'Where-Object NotAfter -lt (Get-Date).AddDays(90)', meaning: 'Keeps certificates whose expiry date is before 90 days from now.' },
            { part: 'Thumbprint', meaning: 'The unique fingerprint used to identify a certificate.' },
          ],
          watchOut: 'This only reads. An empty list means nothing expires within 90 days.',
        },
        {
          title: 'Create and remove a shortcut PSDrive',
          code: 'New-PSDrive -Name Run -PSProvider Registry -Root HKLM:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Run | Out-Null\nGet-ItemProperty Run:\nRemove-PSDrive -Name Run',
          whatItDoes: 'Makes a short drive called Run: that points deep into the Registry, reads it, then deletes the shortcut.',
          parts: [
            { part: 'New-PSDrive -Name Run', meaning: 'Creates a drive with the name Run.' },
            { part: '-PSProvider Registry -Root ...', meaning: 'Says which provider to use and the location the drive opens at.' },
            { part: 'Remove-PSDrive', meaning: 'Deletes only the shortcut, never the registry data.' },
          ],
          watchOut: 'The drive exists only in the current session and disappears when you close the window.',
        },
        {
          title: 'Dry-run creating a registry key',
          code: 'New-Item -Path "HKCU:\\Software\\LabDemo" -WhatIf',
          whatItDoes: 'Shows that New-Item would create a registry key under your user hive. Nothing is created.',
          parts: [
            { part: 'New-Item', meaning: 'Creates a new item; in the Registry, an item is a key.' },
            { part: '-Path "HKCU:\\Software\\LabDemo"', meaning: 'Where the key would be created, inside your own hive.' },
            { part: '-WhatIf', meaning: 'Simulation only.' },
          ],
          sampleOutput: 'What if: Performing the operation "Create Key" on target "Item: HKCU\\Software\\LabDemo".',
          watchOut: 'Writing registry values can break software. Practice real writes only on a lab VM and inside HKCU.',
        },
        {
          title: 'Audit the Run key on a remote lab server',
          code: 'Invoke-Command -ComputerName SRV-CORE01 -ScriptBlock { Get-ItemProperty HKLM:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Run }',
          whatItDoes: 'Runs the same read-only registry check on another computer using PowerShell remoting.',
          parts: [
            { part: 'Invoke-Command', meaning: 'Runs code on one or more remote computers.' },
            { part: '-ComputerName SRV-CORE01', meaning: 'The lab server to query. Replace with your own machine name.' },
            { part: '-ScriptBlock { ... }', meaning: 'The code that runs on the remote machine.' },
          ],
          watchOut: 'Needs WinRM remoting enabled and admin rights on the target. Only use machines you are authorised to administer.',
        },
      ],
    },
    recap: [
      'A provider is an adapter; a PSDrive is a named entrance to it.',
      'The same commands (cd, dir, Get-ItemProperty) work on files, the Registry, Env:, Cert: and AD:.',
      'Keys are folders; values are properties. Read them with Get-ItemProperty or Get-ItemPropertyValue.',
      'Reading is safe. Always use -WhatIf and a lab VM before writing to the Registry.',
    ],
  },
  '8-2': {
    oneSentence:
      'Get-ChildItem -Filter narrows at the source and -Recurse reaches subfolders, New-Item creates files in bulk, and Select-String searches inside them.',
    analogy:
      'Imagine a huge library. Get-ChildItem is the librarian who finds books by title on the shelf. Adding -Filter makes the librarian use the catalogue instead of walking every aisle; adding -Recurse makes them check every floor, not just the front desk. New-Item is the person who prints blank labelled folders in bulk. Select-String is a highlighter that reads inside every book for one phrase and tells you the book, the page and the exact line.',
    plainEnglish: [
      '`Get-ChildItem -Filter *.dll` is fast because the file system does the filtering. Without `-Recurse` it only looks in the top folder; with `-Recurse` it searches every subfolder.',
      'Piping everything through `Where-Object` is slower because every file is turned into an object first.',
      '`New-Item` creates folders (`-ItemType Directory`) and files (`-ItemType File`). With a list of names and a loop you can create dozens of files in seconds.',
      '`Select-String` searches inside text files and returns objects with `Filename`, `LineNumber` and `Line`, so you can count, group or export your hits.',
    ],
    beforeYouStart: [
      'PowerShell 5.1 or 7. A normal window is fine for all examples.',
      'All practice files are created in your TEMP folder, so nothing important is touched.',
      'Some Windows folders deny access, so we use `-ErrorAction SilentlyContinue` on deep searches.',
    ],
    atoZSteps: [
      {
        title: 'Step 1: Search one folder',
        detail: 'Run `Get-ChildItem C:\\Windows\\System32 -Filter *.dll | Select-Object -First 5 Name`. You get DLL names from the top folder only.',
      },
      {
        title: 'Step 2: Search every subfolder',
        detail: 'Add `-Recurse`, plus `-ErrorAction SilentlyContinue` to hide access-denied noise. Always keep `-Filter` with `-Recurse`; it is the fast combination.',
      },
      {
        title: 'Step 3: Make a practice folder',
        detail: 'Create `$env:TEMP\\Lab` with `New-Item -ItemType Directory`. It is your safe sandbox.',
      },
      {
        title: 'Step 4: Create files in bulk',
        detail: 'Use `1..5 | ForEach-Object { New-Item ... -Name "file$_.txt" }` to create five files. Swap the numbers for `Get-Content names.txt` to make 150 from a list.',
      },
      {
        title: 'Step 5: Search inside files',
        detail: 'Run `Select-String -Path ... -Pattern "text"` against one file. Look at the Filename, LineNumber and Line columns.',
      },
      {
        title: 'Step 6: Search a whole tree, then clean up',
        detail: 'Pipe `Get-ChildItem -Recurse` into `Select-String`. When you finish, remove the lab folder with `Remove-Item -Recurse -WhatIf` first, and only then for real.',
      },
    ],
    wordsYouWillMeet: [
      { word: '-Filter', meaning: 'A source-side name filter on Get-ChildItem; fast because the file system does the work.' },
      { word: '-Recurse', meaning: 'Also look inside every subfolder.' },
      { word: '-ItemType', meaning: 'Tells New-Item what to create: File or Directory.' },
      { word: 'Select-String', meaning: 'PowerShell version of grep: searches text inside files (alias: sls).' },
      { word: 'MatchInfo', meaning: 'The object Select-String returns, holding Filename, LineNumber and Line.' },
      { word: 'Regex pattern', meaning: 'A text pattern such as "error|fail" used by Select-String by default.' },
    ],
    beginner: {
      intro: 'Read-only search practice on built-in Windows files. Nothing is created or changed.',
      commands: [
        {
          title: 'Find DLL files in one folder',
          code: 'Get-ChildItem -Path C:\\Windows\\System32 -Filter *.dll | Select-Object -First 5 Name, Length',
          whatItDoes: 'Lists the first five DLL files in System32 with their sizes in bytes.',
          parts: [
            { part: 'Get-ChildItem -Path', meaning: 'Lists items in the given folder.' },
            { part: '-Filter *.dll', meaning: 'Fast filter: only names ending in .dll.' },
            { part: 'Select-Object -First 5 Name, Length', meaning: 'Keeps five rows and two columns.' },
          ],
          watchOut: 'No -Recurse means subfolders are not searched.',
        },
        {
          title: 'Read the top of a text file',
          code: 'Get-Content -Path C:\\Windows\\System32\\drivers\\etc\\hosts | Select-Object -First 10',
          whatItDoes: 'Shows the first ten lines of the Windows hosts file, a small text file that exists on every PC.',
          parts: [
            { part: 'Get-Content', meaning: 'Reads a text file line by line (aliases: gc, cat).' },
            { part: '-Path', meaning: 'The file to read.' },
            { part: 'Select-Object -First 10', meaning: 'Stops after ten lines.' },
          ],
        },
        {
          title: 'Search inside one file',
          code: 'Select-String -Path C:\\Windows\\System32\\drivers\\etc\\hosts -Pattern "localhost"',
          whatItDoes: 'Prints every line in the hosts file that contains the word localhost, with file name and line number.',
          parts: [
            { part: 'Select-String', meaning: 'Searches inside files for text.' },
            { part: '-Path', meaning: 'The file (or wildcard path) to search.' },
            { part: '-Pattern "localhost"', meaning: 'The text or regex to look for.' },
          ],
          watchOut: 'If no line contains the word, there is simply no output.',
        },
      ],
    },
    intermediate: {
      intro: 'Deep searches, bulk creation and searching across a folder tree. Created files live only in your TEMP folder.',
      commands: [
        {
          title: 'Fast deep search',
          code: 'Get-ChildItem -Path C:\\Windows\\System32\\drivers -Filter *.sys -Recurse -ErrorAction SilentlyContinue | Select-Object -First 10 FullName',
          whatItDoes: 'Searches every subfolder for driver files using the fast source filter and shows the first ten paths.',
          parts: [
            { part: '-Filter *.sys', meaning: 'File system level filter for driver files.' },
            { part: '-Recurse', meaning: 'Include all subfolders.' },
            { part: '-ErrorAction SilentlyContinue', meaning: 'Hides errors about folders you are not allowed to open.' },
            { part: 'FullName', meaning: 'The full path of each file.' },
          ],
          watchOut: 'Hiding errors also hides real problems. Remove it if a result seems to be missing.',
        },
        {
          title: 'Create a practice folder and five files in bulk',
          code: 'New-Item -Path "$env:TEMP\\Lab" -ItemType Directory -Force | Out-Null\n1..5 | ForEach-Object { New-Item -Path "$env:TEMP\\Lab" -Name "file$_.txt" -ItemType File -Value "ERROR test line $_" -Force } | Select-Object Name',
          whatItDoes: 'Makes a Lab folder in TEMP, then creates file1.txt to file5.txt, each containing one line of text.',
          parts: [
            { part: 'New-Item -ItemType Directory', meaning: 'Creates a folder. -Force avoids an error if it already exists.' },
            { part: '1..5', meaning: 'The range operator: the numbers 1 to 5.' },
            { part: 'ForEach-Object { ... }', meaning: 'Runs the block once per number; $_ holds the current number.' },
            { part: '-Name "file$_.txt"', meaning: 'Double quotes expand $_, producing file1.txt, file2.txt and so on.' },
            { part: '-Value', meaning: 'The text placed inside the new file.' },
          ],
          sampleOutput: 'Name\n----\nfile1.txt\nfile2.txt\nfile3.txt\nfile4.txt\nfile5.txt',
          watchOut: 'This creates real files. They are in TEMP and can be removed with the cleanup command in the pro section.',
        },
        {
          title: 'Search a folder tree for text',
          code: 'Get-ChildItem -Path "$env:TEMP\\Lab" -Filter *.txt -Recurse | Select-String -Pattern "ERROR" | Select-Object Filename, LineNumber, Line',
          whatItDoes: 'Finds every line containing ERROR in the lab files and shows where it was found.',
          parts: [
            { part: 'Get-ChildItem ... -Filter *.txt -Recurse', meaning: 'Finds the text files to search.' },
            { part: '| Select-String -Pattern "ERROR"', meaning: 'Searches inside each file that arrives through the pipeline.' },
            { part: 'Filename, LineNumber, Line', meaning: 'Properties of the match object: which file, which line number, and the text of the line.' },
          ],
          sampleOutput: 'Filename  LineNumber Line\n--------  ---------- ----\nfile1.txt          1 ERROR test line 1\nfile2.txt          1 ERROR test line 2',
        },
      ],
    },
    pro: {
      intro: 'Pro habits: summarise findings, export evidence, use searches defensively to find careless secrets, and always dry-run deletions.',
      commands: [
        {
          title: 'Count matches per file',
          code: 'Get-ChildItem -Path "$env:TEMP\\Lab" -Filter *.txt -Recurse | Select-String -Pattern "ERROR" | Group-Object Filename | Sort-Object Count -Descending | Select-Object Count, Name',
          whatItDoes: 'Groups the matches by file and ranks the files with the most hits first.',
          parts: [
            { part: 'Group-Object Filename', meaning: 'Puts matches that share a file name into groups and counts them.' },
            { part: 'Sort-Object Count -Descending', meaning: 'Biggest group first.' },
            { part: 'Select-Object Count, Name', meaning: 'Shows the hit count and the file name.' },
          ],
        },
        {
          title: 'Export hits to a CSV report',
          code: 'Get-ChildItem -Path "$env:TEMP\\Lab" -Filter *.txt -Recurse | Select-String -Pattern "ERROR" | Select-Object Path, LineNumber, Line | Export-Csv -Path "$env:TEMP\\hits.csv" -NoTypeInformation',
          whatItDoes: 'Saves search findings to a spreadsheet-friendly CSV file you can attach to a ticket.',
          parts: [
            { part: 'Select-Object Path, LineNumber, Line', meaning: 'Chooses which match properties become CSV columns.' },
            { part: 'Export-Csv -Path', meaning: 'Writes objects to a CSV file.' },
            { part: '-NoTypeInformation', meaning: 'Skips an extra type header line in Windows PowerShell 5.1 (harmless in 7).' },
          ],
          watchOut: 'Export-Csv overwrites an existing file with the same name.',
        },
        {
          title: 'Defensive check for hard-coded passwords',
          code: 'Get-ChildItem -Path C:\\inetpub -Filter *.config -Recurse -ErrorAction SilentlyContinue | Select-String -Pattern "password\\s*=" -List | Select-Object Path, LineNumber',
          whatItDoes: 'Lists configuration files that appear to contain a password setting, so you can move the secret to a safer place. It reports only the location, not the secret.',
          parts: [
            { part: '-Pattern "password\\s*="', meaning: 'Regex: the word password, optional spaces (\\s*), then an equals sign.' },
            { part: '-List', meaning: 'Reports only the first match per file.' },
            { part: 'Select-Object Path, LineNumber', meaning: 'Deliberately leaves out the Line so secrets are not printed to the screen or logs.' },
          ],
          watchOut: 'Only scan systems you are authorised to audit. Do not copy or share any secrets you find; report them instead.',
        },
        {
          title: 'Clean up the lab folder safely',
          code: 'Remove-Item -Path "$env:TEMP\\Lab" -Recurse -WhatIf\nRemove-Item -Path "$env:TEMP\\Lab" -Recurse -Confirm',
          whatItDoes: 'First previews the deletion, then deletes the lab folder after you answer a confirmation prompt.',
          parts: [
            { part: 'Remove-Item -Recurse', meaning: 'Deletes a folder and everything inside it.' },
            { part: '-WhatIf', meaning: 'Preview only.' },
            { part: '-Confirm', meaning: 'Asks before deleting.' },
          ],
          watchOut: 'Double-check the path before confirming. Deleted files do not go to the Recycle Bin.',
        },
      ],
    },
    recap: [
      'Use `-Filter` with `-Recurse` for fast deep searches; avoid pulling every file into Where-Object.',
      '`New-Item -ItemType Directory` makes folders and `-ItemType File` makes files; combine with `ForEach-Object` for bulk creation.',
      '`Select-String` returns objects with Filename, LineNumber and Line, so you can group and export results.',
      'Preview deletions with `-WhatIf` and keep practice files in TEMP.',
    ],
  },
  '9-1': {
    oneSentence:
      'Building a Core server is always the same three moves: rename it, give it a static IP and gateway on your LAN, and point DNS at pfSense, checking after every step.',
    analogy:
      'Setting up a new server is like moving into a new house. First you read the street map (the network diagram), then you put your name on the door (hostname), claim a permanent street address (static IP), and write down the phone number of the directory service (DNS). Finally you test the doorbell and keep a checklist (your script) so the next 50 houses take two minutes each.',
    plainEnglish: [
      'Windows Server Core has no desktop, only a text window. PowerShell is the main tool to configure it.',
      'A server needs a fixed (static) IP address, so clients and firewalls can always find it. A /24 prefix is the same as the mask 255.255.255.0.',
      'The adapter is chosen by its `ifIndex` number (see `Get-NetAdapter`). The IP is set with `New-NetIPAddress`, and DNS with `Set-DnsClientServerAddress`.',
      'A new computer name only takes effect after a restart. After every change, verify it with a matching Get- command.',
    ],
    beforeYouStart: [
      'LAB VM ONLY: these commands rename the computer and change its IP address. Never paste them on your own PC or on a production server.',
      'A Windows Server Core virtual machine in a lab network. Never practice on a production server.',
      'The lab plan: server IP `192.168.153.210`, prefix `/24`, gateway and DNS `192.168.153.1`. Adjust the numbers to match your own lab.',
      'An elevated PowerShell session on the server. On Server Core, type `powershell` at the prompt.',
    ],
    atoZSteps: [
      {
        title: 'Step 1: Start PowerShell',
        detail: 'At the Server Core command prompt type `powershell` (or choose option 15 in `sconfig`). Optional: while the VM still has internet, run `Update-Help -Force` once to get offline help (Windows PowerShell 5.1 needs the elevated window for this).',
      },
      {
        title: 'Step 2: Check the current name',
        detail: 'Run `$env:COMPUTERNAME`. Factory names look like WIN-8K49A2L. You will replace this with a clear name.',
      },
      {
        title: 'Step 3: Find your network card',
        detail: 'Run `Get-NetAdapter` and note the `ifIndex` and Name of the adapter on your lab network (Status Up). A VM can have several adapters (for example NAT plus host-only), so choose by Name or ifIndex instead of just taking the first one.',
      },
      {
        title: 'Step 4: Plan before you type',
        detail: 'Write down the IP, prefix length, gateway and DNS on paper or in a comment. Typos here can cut you off from the server.',
      },
      {
        title: 'Step 5: Dry-run, then apply',
        detail: 'Run `Rename-Computer`, `Set-NetIPInterface`, `New-NetIPAddress` and `Set-DnsClientServerAddress` first with `-WhatIf`. Lab VM NICs usually start on DHCP, so DHCP must be switched off on the adapter before a static address is added. When the preview looks right, remove `-WhatIf` and run them for real in the lab.',
      },
      {
        title: 'Step 6: Verify everything',
        detail: 'Use `Get-NetIPConfiguration`, `Get-DnsClientServerAddress` and `Test-Connection 192.168.153.1 -Count 2` to confirm the IP, DNS and gateway work.',
      },
      {
        title: 'Step 7: Restart and save the script',
        detail: 'In the lab VM only, run `Restart-Computer` to finish the rename, then save all the commands as `configureCoreServerBasic.ps1` so you can repeat the build.',
      },
    ],
    wordsYouWillMeet: [
      { word: 'Server Core', meaning: 'A Windows Server install with no desktop GUI: smaller, faster to patch and harder to attack.' },
      { word: 'ifIndex', meaning: 'The number that identifies a network adapter, used by the NetTCPIP cmdlets.' },
      { word: 'Static IP', meaning: 'An address you set by hand that never changes, unlike DHCP.' },
      { word: 'PrefixLength', meaning: 'How many bits are the network part. /24 equals subnet mask 255.255.255.0.' },
      { word: 'Default gateway', meaning: 'The router address your server uses to reach other networks.' },
      { word: 'DNS server', meaning: 'The service that turns names like server01 into IP addresses.' },
    ],
    beginner: {
      intro: 'Read-only checks you can run on any Windows computer. Learn what your current network looks like before changing anything.',
      commands: [
        {
          title: 'What is this computer called?',
          code: '$env:COMPUTERNAME\nhostname',
          whatItDoes: 'Prints the current computer name in two ways.',
          parts: [
            { part: '$env:COMPUTERNAME', meaning: 'Reads the COMPUTERNAME environment variable.' },
            { part: 'hostname', meaning: 'A small Windows program that prints the same name.' },
          ],
          sampleOutput: 'WIN-8K49A2L\nWIN-8K49A2L',
        },
        {
          title: 'List the network adapters and ifIndex',
          code: 'Get-NetAdapter | Select-Object Name, ifIndex, Status, LinkSpeed',
          whatItDoes: 'Shows every network card, its ifIndex number and whether it is connected (Up).',
          parts: [
            { part: 'Get-NetAdapter', meaning: 'Lists the physical and virtual network adapters.' },
            { part: 'ifIndex', meaning: 'The adapter number you will use in later commands.' },
            { part: 'Status', meaning: 'Up means connected; Disconnected means no link.' },
          ],
          sampleOutput: 'Name      ifIndex Status LinkSpeed\n----      ------- ------ ---------\nEthernet        4 Up     1 Gbps',
        },
        {
          title: 'See the whole network configuration',
          code: 'Get-NetIPConfiguration',
          whatItDoes: 'Shows IP address, default gateway and DNS servers for each adapter in one tidy summary.',
          parts: [{ part: 'Get-NetIPConfiguration', meaning: 'A summary view of IPv4/IPv6 address, gateway and DNS together.' }],
          sampleOutput: 'InterfaceAlias       : Ethernet\nIPv4Address          : 192.168.153.210\nIPv4DefaultGateway   : 192.168.153.1\nDNSServer            : 192.168.153.1',
        },
      ],
    },
    intermediate: {
      intro: 'The real build steps, each one previewed with -WhatIf first. Use a lab VM only: removing -WhatIf changes the name and network settings for real.',
      commands: [
        {
          title: 'Store the lab adapter in a variable',
          code: '$nic = Get-NetAdapter -Name "Ethernet"\n$nic.Name\n$nic.ifIndex',
          whatItDoes: 'Selects your lab network adapter by name and remembers it so later commands do not need the number typed by hand. Run `Get-NetAdapter` first to see the real adapter names.',
          parts: [
            { part: 'Get-NetAdapter -Name "Ethernet"', meaning: 'Picks one adapter by its name. Replace "Ethernet" with the name shown on your lab network.' },
            { part: '$nic =', meaning: 'Stores the adapter in a variable.' },
            { part: '$nic.ifIndex', meaning: 'Reads the ifIndex property from the variable.' },
          ],
          watchOut: 'Do not just take the first adapter that is Up: a VM with NAT plus host-only adapters has several. Check that $nic.Name is the adapter on the lab network.',
        },
        {
          title: 'Dry-run renaming the server',
          code: 'Rename-Computer -NewName "SRV-CORE01" -WhatIf',
          whatItDoes: 'Shows what the rename would do. A real rename needs a restart to finish.',
          parts: [
            { part: 'Rename-Computer', meaning: 'Changes the computer name.' },
            { part: '-NewName "SRV-CORE01"', meaning: 'The new name. Keep it 15 characters or fewer and use letters, numbers and hyphens.' },
            { part: '-WhatIf', meaning: 'Preview only.' },
          ],
          sampleOutput: 'What if: Performing the operation "Rename-Computer" on target "Rename computer from WIN-8K49A2L to SRV-CORE01".',
          watchOut: 'Without -WhatIf this changes the real name after the next restart. Never rename a domain controller or production server casually.',
        },
        {
          title: 'Dry-run switching off DHCP, then the static IP and DNS',
          code: 'Set-NetIPInterface -InterfaceIndex $nic.ifIndex -Dhcp Disabled -WhatIf\nNew-NetIPAddress -InterfaceIndex $nic.ifIndex -IPAddress 192.168.153.210 -PrefixLength 24 -DefaultGateway 192.168.153.1 -WhatIf\nSet-DnsClientServerAddress -InterfaceIndex $nic.ifIndex -ServerAddresses 192.168.153.1 -WhatIf',
          whatItDoes: 'Previews turning DHCP off, then assigning the static address, subnet, gateway and DNS server to the chosen adapter.',
          parts: [
            { part: 'Set-NetIPInterface -Dhcp Disabled', meaning: 'Stops the adapter from taking an address from DHCP. Without this step, New-NetIPAddress can fail on an adapter that is still on DHCP.' },
            { part: '-InterfaceIndex $nic.ifIndex', meaning: 'Selects the adapter by its number.' },
            { part: '-IPAddress / -PrefixLength 24', meaning: 'The address and the /24 subnet (255.255.255.0).' },
            { part: '-DefaultGateway', meaning: 'The router the server uses to leave its network.' },
            { part: 'Set-DnsClientServerAddress -ServerAddresses', meaning: 'Sets which DNS server(s) the adapter asks.' },
          ],
          watchOut: 'A wrong IP can lock you out of a remote server. If the adapter already has an IPv4 address from DHCP, the DHCP step above removes the lease, and an old static address can be removed with Remove-NetIPAddress. Always do this from the lab VM console, never over the network connection you are changing.',
        },
      ],
    },
    pro: {
      intro: 'Turn the build into a safe, repeatable script, then verify it locally and remotely. Lab VM only.',
      commands: [
        {
          title: 'Wrap the build in a reusable function',
          code: 'function Set-CoreServerBasic {\n  [CmdletBinding(SupportsShouldProcess)]\n  param(\n    [Parameter(Mandatory)][string]$NewName,\n    [Parameter(Mandatory)][string]$IPAddress,\n    [int]$PrefixLength = 24,\n    [Parameter(Mandatory)][string]$Gateway,\n    [Parameter(Mandatory)][string[]]$Dns,\n    [string]$AdapterName = "Ethernet"\n  )\n  $nic = Get-NetAdapter -Name $AdapterName\n  Rename-Computer -NewName $NewName\n  Set-NetIPInterface -InterfaceIndex $nic.ifIndex -Dhcp Disabled\n  New-NetIPAddress -InterfaceIndex $nic.ifIndex -IPAddress $IPAddress -PrefixLength $PrefixLength -DefaultGateway $Gateway\n  Set-DnsClientServerAddress -InterfaceIndex $nic.ifIndex -ServerAddresses $Dns\n}\nSet-CoreServerBasic -NewName SRV-CORE01 -IPAddress 192.168.153.210 -Gateway 192.168.153.1 -Dns 192.168.153.1 -WhatIf',
          whatItDoes: 'Packages rename, DHCP-off, IP and DNS into one function for a named adapter. Because it supports -WhatIf, you can preview the whole build before applying it. LAB VM ONLY.',
          parts: [
            { part: '[CmdletBinding(SupportsShouldProcess)]', meaning: 'Adds -WhatIf and -Confirm, passed on to the cmdlets inside.' },
            { part: '[Parameter(Mandatory)]', meaning: 'PowerShell insists on a value instead of guessing.' },
            { part: '[string]$AdapterName = "Ethernet"', meaning: 'Names the adapter to configure, so the function never guesses which of several adapters you meant.' },
            { part: '[string[]]$Dns', meaning: 'Allows more than one DNS server.' },
            { part: 'Set-CoreServerBasic ... -WhatIf', meaning: 'Calls the function in preview mode.' },
          ],
          watchOut: 'Save it as configureCoreServerBasic.ps1 and test in a lab VM. Only remove -WhatIf when the preview is correct.',
        },
        {
          title: 'Verify the build with pass/fail checks',
          code: '$ifIndex = (Get-NetAdapter -Name "Ethernet").ifIndex\n$ip = Get-NetIPAddress -InterfaceIndex $ifIndex -AddressFamily IPv4\nif ($ip.IPAddress -eq "192.168.153.210" -and $ip.PrefixLength -eq 24) { "IP OK" } else { "IP MISMATCH" }\nTest-Connection 192.168.153.1 -Count 2 -Quiet',
          whatItDoes: 'Checks that the IP and prefix match the plan, then tests whether the gateway answers. Read-only.',
          parts: [
            { part: 'Get-NetIPAddress -AddressFamily IPv4', meaning: 'Reads the IPv4 settings of the adapter.' },
            { part: 'if (...) { } else { }', meaning: 'Prints OK or MISMATCH based on the test.' },
            { part: 'Test-Connection -Count 2 -Quiet', meaning: 'Sends two pings and returns only True or False.' },
          ],
          sampleOutput: 'IP OK\nTrue',
          watchOut: 'Some firewalls block ping, so False does not always mean the gateway is down.',
        },
        {
          title: 'Verify remotely over WinRM',
          code: 'Test-WSMan -ComputerName 192.168.153.210\nInvoke-Command -ComputerName 192.168.153.210 -ScriptBlock { $env:COMPUTERNAME; Get-NetIPConfiguration }',
          whatItDoes: 'Confirms PowerShell remoting responds, then reads the name and network configuration from the server without logging in at its console.',
          parts: [
            { part: 'Test-WSMan', meaning: 'Checks that the Windows Remote Management service answers.' },
            { part: 'Invoke-Command -ComputerName', meaning: 'Runs the code block on the remote server.' },
            { part: '-ScriptBlock { ... }', meaning: 'The commands to run there, separated by a semicolon.' },
          ],
          watchOut: 'Requires remoting enabled on the server and an account with admin rights. Only use servers you are authorised to manage.',
        },
      ],
    },
    recap: [
      'Plan first (IP, /24, gateway, DNS), then change, then verify with Get- commands.',
      'Find the adapter with `Get-NetAdapter`; use ifIndex in `New-NetIPAddress` and `Set-DnsClientServerAddress`.',
      'Rename-Computer finishes only after a restart.',
      'Use -WhatIf first, do it in a lab, and save the build as a reusable script.',
    ],
  },
  '9-2': {
    oneSentence:
      'A real admin workout means creating users from a custom object, reading disks and dates, and exporting reports to TXT, CSV, and HTML.',
    analogy:
      'Think of this lesson as a day shift in a small office. You hand out visitor badges (local users), check which machines are busy (processes), look at how full the filing cabinets are (disks), stamp every report with the correct date, and print summaries as a plain note, a spreadsheet or a web page. Each task is small, but together they are what every admin does daily.',
    plainEnglish: [
      'Local user accounts are managed with `Get-LocalUser`, `New-LocalUser` and `Remove-LocalUser`. Passwords must be SecureStrings.',
      'A `[PSCustomObject]` with `Name`, `Description` and `Password` can be piped into `New-LocalUser`, because the cmdlet accepts those properties by name.',
      'In `Get-Date -Format`, capital `MM` means month and lowercase `mm` means minutes. Mixing them up puts the wrong number in your file names.',
      '`Out-File` saves text, `Export-Csv` saves a spreadsheet, and `ConvertTo-Html | Out-File` saves a web page. `ConvertTo-` only converts in memory.',
    ],
    beforeYouStart: [
      'A lab Windows machine or Server Core VM. Creating users needs an elevated window, so use the lab only.',
      'PowerShell 5.1 or 7. The LocalAccounts module comes with Windows PowerShell 5.1; in PowerShell 7 it works on current Windows.',
      'Fake passwords only. Prompt for them with `Read-Host -AsSecureString` (never type a password inside the script). A SecureString hides the typing and protects the value in memory, but it is not strong encryption. Reports in this guide are written to your TEMP folder.',
    ],
    atoZSteps: [
      {
        title: 'Step 1: Look at existing users',
        detail: 'Run `Get-LocalUser`. Note which accounts are enabled. Never change the built-in Administrator or Guest accounts during practice.',
      },
      {
        title: 'Step 2: Get the date format right',
        detail: 'Run `Get-Date -Format "dd-MM-yyyy"`, then try `"dd-mm-yyyy"` and see minutes where the month should be. Capital M means Month.',
      },
      {
        title: 'Step 3: Inspect disks',
        detail: 'Use `Get-Volume` for drive letters and free space and `Get-Disk` for the physical disks.',
      },
      {
        title: 'Step 4: Check a process runtime',
        detail: 'Use `Get-Process explorer` and calculate how long it has been running from its `StartTime`.',
      },
      {
        title: 'Step 5: Export a report three ways',
        detail: 'Save the same service list as a CSV, then as an HTML page. Open each file to see the difference.',
      },
      {
        title: 'Step 6: Dry-run the account creation',
        detail: 'Build a `[PSCustomObject]` for the new user and pipe it to `New-LocalUser -WhatIf`. Only in the lab, remove -WhatIf to create it for real, then delete it with `Remove-LocalUser`.',
      },
    ],
    wordsYouWillMeet: [
      { word: 'Local user', meaning: 'An account that exists only on this computer, not in Active Directory.' },
      { word: 'ByPropertyName', meaning: 'A way for a cmdlet to take values from properties of piped objects that share its parameter names.' },
      { word: 'PSCustomObject', meaning: 'A small object you build yourself with named properties.' },
      { word: 'Volume', meaning: 'A formatted partition, usually with a drive letter such as C:.' },
      { word: 'Calculated property', meaning: 'A custom column made with @{ Name=...; Expression={...} }.' },
      { word: 'Export-Csv', meaning: 'Saves objects as rows and columns in a comma-separated file.' },
    ],
    beginner: {
      intro: 'Read-only checks on users, dates and disks. Nothing is changed.',
      commands: [
        {
          title: 'List local users',
          code: 'Get-LocalUser | Select-Object Name, Enabled, LastLogon',
          whatItDoes: 'Shows every local account, whether it is enabled and when it last signed in.',
          parts: [
            { part: 'Get-LocalUser', meaning: 'Lists local user accounts.' },
            { part: 'Select-Object Name, Enabled, LastLogon', meaning: 'Keeps three useful columns.' },
          ],
          sampleOutput: 'Name               Enabled LastLogon\n----               ------- ---------\nAdministrator        False\nGuest                False\nizaz                  True 03/11/2026 08:12:00',
        },
        {
          title: 'The Month versus Minute date trap',
          code: 'Get-Date -Format "dd-MM-yyyy"\nGet-Date -Format "dd-mm-yyyy"',
          whatItDoes: 'Prints today with the correct month, then again with minutes where the month should be.',
          parts: [
            { part: 'Get-Date -Format', meaning: 'Formats the current date and time using a pattern.' },
            { part: 'dd / yyyy', meaning: 'Day with two digits / year with four digits.' },
            { part: 'MM', meaning: 'Capital: the month.' },
            { part: 'mm', meaning: 'Lowercase: the minutes. This is the trap.' },
          ],
          sampleOutput: '03-11-2026\n03-47-2026',
          watchOut: 'Use HH for 24-hour time and hh for 12-hour time.',
        },
        {
          title: 'List volumes and free space',
          code: 'Get-Volume | Select-Object DriveLetter, FileSystemLabel, SizeRemaining, Size',
          whatItDoes: 'Shows each volume with its free space and total size in bytes.',
          parts: [
            { part: 'Get-Volume', meaning: 'Lists volumes (partitions).' },
            { part: 'SizeRemaining / Size', meaning: 'Free bytes and total bytes.' },
          ],
          sampleOutput: 'DriveLetter FileSystemLabel SizeRemaining         Size\n----------- --------------- -------------         ----\nC           Windows           63421849600 255381819392',
        },
      ],
    },
    intermediate: {
      intro: 'Turn raw data into readable, saved reports with calculated columns and exports. Output goes to your TEMP folder.',
      commands: [
        {
          title: 'Disk space in gigabytes and percent free',
          code: 'Get-Volume | Where-Object DriveLetter | Select-Object DriveLetter, @{ n = "SizeGB"; e = { [math]::Round($_.Size / 1GB, 1) } }, @{ n = "FreeGB"; e = { [math]::Round($_.SizeRemaining / 1GB, 1) } }, @{ n = "PctFree"; e = { [math]::Round(100 * $_.SizeRemaining / $_.Size) } }',
          whatItDoes: 'Lists drives that have a letter, with size and free space in GB and a percentage.',
          parts: [
            { part: 'Where-Object DriveLetter', meaning: 'Keeps only volumes that have a drive letter.' },
            { part: '@{ n = "..."; e = { ... } }', meaning: 'A calculated property: n is the column name and e is the formula.' },
            { part: '$_.Size / 1GB', meaning: 'Converts bytes to gigabytes. 1GB is a built-in size constant.' },
            { part: '[math]::Round(x, 1)', meaning: 'Rounds to one decimal place.' },
          ],
        },
        {
          title: 'How long has a process been running?',
          code: 'Get-Process -Name explorer | Select-Object Name, Id, StartTime, @{ n = "RunMinutes"; e = { [math]::Round(((Get-Date) - $_.StartTime).TotalMinutes) } }',
          whatItDoes: 'Subtracts the process start time from the current time to show its runtime in minutes.',
          parts: [
            { part: 'Get-Process -Name explorer', meaning: 'Finds the Windows Explorer process.' },
            { part: '(Get-Date) - $_.StartTime', meaning: 'Subtracting two dates gives a time span.' },
            { part: '.TotalMinutes', meaning: 'Time span in minutes as one number.' },
          ],
          watchOut: 'On Server Core there may be no explorer process. Use another name, such as svchost, if it is not found.',
        },
        {
          title: 'Export running services to CSV with a dated file name',
          code: '$stamp = Get-Date -Format "yyyy-MM-dd_HH-mm"\nGet-Service | Where-Object Status -eq "Running" | Select-Object Name, DisplayName, Status | Export-Csv -Path "$env:TEMP\\services_$stamp.csv" -NoTypeInformation',
          whatItDoes: 'Saves running services as a CSV whose name contains the date and time, so reports never overwrite each other.',
          parts: [
            { part: 'yyyy-MM-dd_HH-mm', meaning: 'Year, Month, Day, 24-hour Hour, Minute: note the capital MM and lowercase mm.' },
            { part: 'Export-Csv -NoTypeInformation', meaning: 'Writes a clean CSV without the extra type header line in Windows PowerShell 5.1.' },
            { part: '"$env:TEMP\\services_$stamp.csv"', meaning: 'Double quotes expand both the TEMP folder and the stamp variable.' },
          ],
        },
        {
          title: 'Export the same data as an HTML report',
          code: 'Get-Service | Select-Object Name, DisplayName, Status | ConvertTo-Html -Title "Service Audit" | Out-File -FilePath "$env:TEMP\\services.html"',
          whatItDoes: 'Builds an HTML table in memory and saves it as a web page you can open in a browser.',
          parts: [
            { part: 'ConvertTo-Html -Title', meaning: 'Converts objects to HTML text. It does not save anything by itself.' },
            { part: 'Out-File', meaning: 'Saves that HTML text to disk.' },
          ],
          watchOut: 'There is no Export-Html cmdlet. Remember ConvertTo- then Out-File.',
        },
      ],
    },
    pro: {
      intro: 'Account management and audits as a pro does them: SecureString passwords, dry-runs first and review of who has admin rights. Lab VM only.',
      commands: [
        {
          title: 'Dry-run creating a user from a PSCustomObject',
          code: '$securePwd = Read-Host "Lab password" -AsSecureString\n$newUser = [PSCustomObject]@{ Name = "AuditLab01"; Description = "Lab auditor"; Password = $securePwd }\n$newUser | New-LocalUser -WhatIf',
          whatItDoes: 'Packs the account details into an object and pipes it to New-LocalUser, which reads Name, Description and Password by property name. -WhatIf only previews.',
          parts: [
            { part: '[PSCustomObject]@{ ... }', meaning: 'Builds an object with named properties.' },
            { part: '$newUser | New-LocalUser', meaning: 'Pipeline binding ByPropertyName: matching property names fill the parameters.' },
            { part: '-WhatIf', meaning: 'Preview mode: no account is created.' },
          ],
          sampleOutput: 'What if: Performing the operation "Create" on target "AuditLab01".',
          watchOut: 'Removing -WhatIf creates a real account. Use a lab VM, an elevated window and a fake password.',
        },
        {
          title: 'Bulk-create users from a CSV (preview)',
          code: 'Import-Csv -Path .\\newusers.csv | ForEach-Object {\n  $pw = Read-Host "Password for $($_.Name)" -AsSecureString\n  New-LocalUser -Name $_.Name -Description $_.Description -Password $pw -WhatIf\n}',
          whatItDoes: 'Reads a list of users from a CSV file, asks for each password securely and previews each account creation.',
          parts: [
            { part: 'Import-Csv', meaning: 'Reads a CSV file into objects, one per row.' },
            { part: '$_.Name', meaning: 'The Name column of the current row.' },
            { part: '"Password for $($_.Name)"', meaning: 'The subexpression operator inserts the property into the prompt text.' },
          ],
          watchOut: 'Never store passwords in the CSV. The CSV needs columns named Name and Description for this example.',
        },
        {
          title: 'Dry-run deleting a lab account',
          code: 'Remove-LocalUser -Name "AuditLab01" -WhatIf',
          whatItDoes: 'Previews removing the practice account created earlier.',
          parts: [
            { part: 'Remove-LocalUser', meaning: 'Deletes a local account.' },
            { part: '-Name', meaning: 'The exact account name to remove.' },
            { part: '-WhatIf', meaning: 'Shows what would be deleted without deleting.' },
          ],
          watchOut: 'Deleting an account is permanent. Double-check the name before removing -WhatIf.',
        },
        {
          title: 'Audit who is a local administrator',
          code: 'Get-LocalGroupMember -Group "Administrators" | Select-Object Name, ObjectClass, PrincipalSource',
          whatItDoes: 'Lists every account in the local Administrators group, so you can spot anyone who should not have that power. Read-only.',
          parts: [
            { part: 'Get-LocalGroupMember', meaning: 'Lists members of a local group.' },
            { part: '-Group "Administrators"', meaning: 'The group to inspect.' },
            { part: 'PrincipalSource', meaning: 'Shows whether the member is local, domain, or Microsoft account.' },
          ],
          sampleOutput: 'Name                    ObjectClass PrincipalSource\n----                    ----------- ---------------\nSRV-CORE01\\Administrator User        Local\nLAB\\Domain Admins       Group       ActiveDirectory',
        },
      ],
    },
    recap: [
      '`Get-LocalUser`, `New-LocalUser` and `Remove-LocalUser` manage local accounts; passwords must be SecureStrings.',
      'Piping a `[PSCustomObject]` to `New-LocalUser` works because of ByPropertyName binding.',
      'In date formats, `MM` is month and `mm` is minutes.',
      'Use `Export-Csv` for spreadsheets, `ConvertTo-Html | Out-File` for web pages and `-WhatIf` before every account change.',
    ],
  },
};
