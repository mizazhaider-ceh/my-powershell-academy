import type { TeachingMap } from '../../types';

export const TEACHING_B: TeachingMap = {
  // ==========================================================================
  // 3-1 What PowerShell Actually Is
  // ==========================================================================
  '3-1': {
    hook: `You have two blue PowerShell windows open on the same PC, and one of them understands && while the other throws a syntax error. How can the "same" tool behave so differently?`,
    mentalModel: `Think of PowerShell as a restaurant kitchen, not a vending machine. The window you type into (console, VS Code, ISE) is just the dining room. The engine behind the swing door does the cooking, and it hands you whole dishes (objects), never loose ingredients (text). Windows PowerShell 5.1 and PowerShell 7 are two different kitchens that happen to share a street address.`,
    misconceptions: [
      {
        myth: `I installed PowerShell 7, so Windows PowerShell 5.1 is gone and replaced.`,
        truth: `They install side by side. 5.1 is powershell.exe and ships with Windows. 7 is pwsh.exe and is a separate install. Both keep working.`,
        test: `Run: Get-Command powershell, pwsh -ErrorAction SilentlyContinue | Select-Object Name, Source`,
      },
      {
        myth: `PowerShell is just cmd.exe with longer command names. It still prints text.`,
        truth: `Commands output live .NET objects. The text on screen is only a picture of those objects, and the objects carry far more data than you see.`,
        test: `Run: Get-Date | Get-Member -MemberType Property. Every line is a real property, not a text column.`,
      },
      {
        myth: `If my script works on my laptop, it will work on any Windows server.`,
        truth: `A fresh Server Core install boots to a command prompt (SConfig opens automatically on Server 2022 and later), and you type powershell to start Windows PowerShell 5.1. Anything 7-only (&&, ||, ternary ?:, ForEach-Object -Parallel) fails there unless you install 7 yourself. Always know which edition you are in.`,
        test: `Run: $PSVersionTable.PSEdition. Desktop means 5.1, Core means 7 or newer.`,
      },
    ],
    workedExample: {
      goal: `Work out which PowerShell engine you are in, prove that it really passes objects, and see what other engines are installed.`,
      steps: [
        {
          think: `Before I run anything important I always ask which engine this is, because features differ between editions.`,
          action: `$PSVersionTable.PSEdition; $PSVersionTable.PSVersion`,
          result: `Desktop plus 5.1.x in Windows PowerShell, or Core plus 7.x in pwsh.`,
        },
        {
          think: `Now I check whether the other engine exists on this machine.`,
          action: `Get-Command powershell, pwsh -ErrorAction SilentlyContinue | Select-Object Name, Source`,
          result: `powershell.exe lives under System32\\WindowsPowerShell. pwsh.exe appears only if PowerShell 7 is installed.`,
        },
        {
          think: `I want proof of the object idea. A date is a perfect small object.`,
          action: `Get-Date | Get-Member -MemberType Property | Select-Object -First 5 Name, Definition`,
          result: `Properties such as Date, Day, DayOfWeek, each with a data type in the Definition column.`,
        },
        {
          think: `If it is an object, I can ask it a question with a dot instead of slicing text.`,
          action: `(Get-Date).DayOfWeek`,
          result: `A day name such as Wednesday, with no text parsing at all.`,
        },
        {
          think: `Last, I confirm which host window I am typing into, since ISE only runs 5.1.`,
          action: `$Host.Name`,
          result: `ConsoleHost in a console or Windows Terminal. The ISE reports Windows PowerShell ISE Host.`,
        },
      ],
      takeaway: `Edition check first, then trust the objects. Two quick commands tell you which engine you are in and what it can do.`,
    },
    checkpoints: [
      {
        question: `Which property of $PSVersionTable tells you whether you are in Windows PowerShell or PowerShell 7?`,
        hint: `One of two words: Desktop or Core.`,
        answer: `PSEdition. Desktop is Windows PowerShell 5.1 and Core is PowerShell 7 and newer. PSVersion gives the exact number.`,
      },
      {
        question: `State the DRY rule in your own words and say when you would apply it.`,
        hint: `DRY stands for Don't Repeat Yourself. Think about how many times you did the task by hand.`,
        answer: `If you catch yourself doing the same manual task about three times, write it as a script so the computer repeats it without typos.`,
      },
      {
        question: `Why can you not run PowerShell 7 code inside the Windows PowerShell ISE?`,
        hint: `Think about which engine the ISE was built on.`,
        answer: `The ISE is tied to the Windows PowerShell 5.1 engine and was never updated for 7. Use VS Code with the PowerShell extension for 7.`,
      },
    ],
    challenge: {
      brief: `Find out which PowerShell you are running and write down the answer: run the two lines from the worked example and report the edition (Desktop or Core) and the version number.`,
      hints: [
        `Nearly done for you. Type these two lines, pressing Enter after each: $PSVersionTable.PSEdition and then $PSVersionTable.PSVersion. Desktop means Windows PowerShell 5.1, Core means PowerShell 7 or newer.`,
        `If a line prints nothing, check the spelling and that $PSVersionTable starts with a dollar sign. It is a built-in variable, so you never create it yourself.`,
        `Extension (the hard version): print one sentence such as "Running Core 7.4.1 on Win32NT" from the live values. Put the values inside a double-quoted string and wrap each one in $( ), for example "$($PSVersionTable.PSEdition)". Windows PowerShell 5.1 has no Platform key, so expect that part to be blank there.`,
      ],
      solution: `$PSVersionTable.PSEdition\n$PSVersionTable.PSVersion\n\nExtension:\n"Running $($PSVersionTable.PSEdition) $($PSVersionTable.PSVersion) on $($PSVersionTable.Platform)"`,
      why: `$PSVersionTable describes the engine you are in, so reading its PSEdition and PSVersion answers the question. The extension shows that double quotes expand variables and that $( ) lets you read a property inside the string. Nothing here is 7-only, and the empty Platform in 5.1 is a reminder that the two editions differ.`,
    },
    teachBack: `Explain to a friend who only knows cmd.exe why PowerShell passes objects instead of text, and why having both powershell.exe and pwsh.exe on one PC is normal.`,
    diagrams: [
      {
        kind: 'layers',
        title: 'What happens when you press Enter',
        caption: `The window you type into is only the top layer. The engine and .NET do the real work, and Windows answers at the bottom.`,
        traceLabel: 'Trace Get-Process',
        layers: [
          {
            label: 'Host window',
            sub: 'Console, VS Code, ISE',
            detail: `The host shows your prompt and prints results. It does not run your command itself.`,
            tone: 'blue',
          },
          {
            label: 'PowerShell engine',
            sub: 'powershell.exe or pwsh.exe',
            detail: `The engine parses the line, finds the cmdlet and binds its parameters. 5.1 and 7 are different engines.`,
            tone: 'cyan',
          },
          {
            label: 'Cmdlet',
            sub: 'Get-Process',
            detail: `A small .NET program with one job. It asks the layer below for data and returns objects.`,
            tone: 'green',
          },
          {
            label: '.NET runtime',
            sub: 'Framework 4.x or modern .NET',
            detail: `Supplies classes such as System.Diagnostics.Process. This is why 5.1 (Framework) and 7 (modern .NET) differ.`,
            tone: 'amber',
          },
          {
            label: 'Windows APIs',
            sub: 'Processes, services, registry',
            detail: `The operating system holds the real facts. The .NET classes translate them into objects you can use.`,
            tone: 'violet',
          },
        ],
      },
      {
        kind: 'compare',
        title: 'Two kitchens, one street address',
        caption: `Same language family, different engines. Knowing which one you are in prevents most surprise errors.`,
        left: {
          heading: 'Windows PowerShell 5.1',
          tone: 'amber',
          rows: [
            { label: 'Program', value: 'powershell.exe' },
            { label: 'Runs on', value: '.NET Framework 4.x' },
            { label: 'Where', value: 'Built into Windows, Windows only' },
            { label: 'Updates', value: 'Security fixes only' },
          ],
        },
        right: {
          heading: 'PowerShell 7',
          tone: 'green',
          rows: [
            { label: 'Program', value: 'pwsh.exe' },
            { label: 'Runs on', value: 'Modern .NET' },
            { label: 'Where', value: 'Separate install, cross-platform' },
            { label: 'Extras', value: '&&, ||, ternary, -Parallel' },
          ],
        },
        verdict: `Write for 5.1 if the target is a bare server. Use 7 on your own machine, but never assume the server has it.`,
      },
    ],
  },

  // ==========================================================================
  // 3-2 Verb-Noun, singular nouns, discovery
  // ==========================================================================
  '3-2': {
    hook: `You have never touched DNS in PowerShell, yet you can find the right command in ten seconds without a search engine. What pattern are you relying on?`,
    mentalModel: `Picture a library where every book title follows the same sentence: an action word, then one thing. Because the shelf labels are predictable, you can walk in blind, guess the label and find the book. Verb-Noun is that label system, and Get-Command is the card catalogue.`,
    misconceptions: [
      {
        myth: `Nouns are plural when the command returns many things, so the list of services must be Get-Services.`,
        truth: `The noun is always singular, even when 300 items come back. The command is Get-Service. The cmdlet name names the kind of thing, not the count.`,
        test: `Run: Get-Command Get-Services -ErrorAction SilentlyContinue (nothing), then Get-Service | Measure-Object (many).`,
      },
      {
        myth: `Any sensible verb works, so Delete-Item or Create-User should exist.`,
        truth: `Only approved verbs are used by Microsoft. It is Remove, never Delete, and New, never Create.`,
        test: `Run: Get-Verb -Verb Remove, Delete. Only Remove comes back, because Delete is not an approved verb.`,
      },
      {
        myth: `Aliases such as ls and dir are just fine inside scripts I will share.`,
        truth: `Aliases are great at the prompt but fragile in scripts. They can differ between systems and are harder to read. Write the full cmdlet name in saved code.`,
        test: `Run: Get-Alias -Name ls, dir, gci. All three point to Get-ChildItem on Windows.`,
      },
    ],
    workedExample: {
      goal: `You must inspect the local DNS cache but you do not know the command. Find it from the pattern alone.`,
      steps: [
        {
          think: `Looking at something is a read-only action, so the verb is Get. The topic is DNS.`,
          action: `Get-Command -Verb Get -Noun *Dns*`,
          result: `A list of Get-Dns* commands, including Get-DnsClientCache and Get-DnsClientServerAddress.`,
        },
        {
          think: `The word Cache matches what I want. I will read its help examples rather than guess syntax.`,
          action: `Get-Help Get-DnsClientCache -Examples`,
          result: `One or two short examples, with a description of what the cmdlet returns.`,
        },
        {
          think: `This cmdlet only reads data, so it is safe to run. I limit the output to keep it tidy.`,
          action: `Get-DnsClientCache | Select-Object -First 3 Entry, Type, Data`,
          result: `Three cached names with their record type and data.`,
        },
        {
          think: `I also want to see its short nickname, if any, so I can recognize it in other people's code.`,
          action: `Get-Alias -Definition Get-DnsClientCache -ErrorAction SilentlyContinue`,
          result: `Usually nothing. Not every cmdlet has an alias, and that is fine.`,
        },
      ],
      takeaway: `Pick the verb for what you want to do, guess the noun, and let Get-Command with wildcards prove it. You never needed to memorize the name.`,
    },
    checkpoints: [
      {
        question: `Which command lists every approved verb?`,
        hint: `Its name follows the same pattern it teaches.`,
        answer: `Get-Verb. It shows the approved verbs and their group, such as Common or Lifecycle.`,
      },
      {
        question: `You know the alias gsv but not the real command. Which command resolves it?`,
        hint: `Name goes with the nickname you have.`,
        answer: `Get-Alias -Name gsv returns Get-Service. Use -Definition when you have the full cmdlet name and want its nicknames.`,
      },
      {
        question: `Write a command that finds every cmdlet that creates something related to firewalls.`,
        hint: `Creating uses the verb New. Use a wildcard on the noun.`,
        answer: `Get-Command -Verb New -Noun *Firewall*`,
      },
    ],
    challenge: {
      brief: `Use discovery to find the cmdlet that restarts a Windows service. You only need to read the name it prints. Do not run the cmdlet.`,
      hints: [
        `Nearly done for you: Get-Command -Verb Restart -Noun *Service*. Type it exactly and read the Name column. The verb is Restart, and the asterisks mean "anything before or after".`,
        `If the list is empty, check that you typed the dash before Verb and Noun. Each parameter name starts with a dash.`,
        `Extension (the hard version): confirm the cmdlet supports the -WhatIf safety switch without running it. Get-Command returns an object with a Parameters dictionary, so (Get-Command Restart-Service).Parameters.ContainsKey('WhatIf') answers True or False.`,
      ],
      solution: `Get-Command -Verb Restart -Noun *Service*\n\nExtension:\n(Get-Command Restart-Service).Parameters.ContainsKey('WhatIf')`,
      why: `The verb-noun law lets you search by meaning, so Get-Command finds Restart-Service from the verb and a wildcard noun. The extension works because command metadata exposes a Parameters dictionary, so you can check for -WhatIf support without ever restarting a service.`,
    },
    teachBack: `Explain to a friend who only knows bash commands like ls and grep why PowerShell command names look so long, and how that helps them find commands they have never seen.`,
    diagrams: [
      {
        kind: 'tree',
        title: 'Approved verbs come in families',
        caption: `Microsoft groups approved verbs by purpose. Knowing the family narrows your guess to a handful of words.`,
        root: {
          label: 'Approved verbs',
          sub: 'See Get-Verb',
          detail: `About 100 verbs are approved so that a verb means the same thing in every module.`,
          tone: 'blue',
          children: [
            {
              label: 'Common',
              sub: 'Get Set New Remove',
              detail: `The everyday verbs. Remove is the approved word for delete, and New is the word for create.`,
              tone: 'green',
            },
            {
              label: 'Lifecycle',
              sub: 'Start Stop Restart',
              detail: `Verbs that change the running state of something, such as a service or a job.`,
              tone: 'cyan',
            },
            {
              label: 'Diagnostic',
              sub: 'Test Measure Trace',
              detail: `Verbs that check or measure. Test-Path and Test-Connection return answers without changing anything.`,
              tone: 'amber',
            },
            {
              label: 'Data',
              sub: 'Export Import Convert',
              detail: `Verbs that move or reshape information, such as Export-Csv and ConvertTo-Json.`,
              tone: 'violet',
            },
            {
              label: 'Security',
              sub: 'Grant Block Protect',
              detail: `Verbs about access and protection, such as Grant and Unblock.`,
              tone: 'red',
            },
          ],
        },
      },
      {
        kind: 'sequence',
        title: 'What happens when you type ls',
        caption: `An alias is a lookup, not a program. PowerShell swaps the nickname for the real cmdlet before anything runs.`,
        actors: [
          { name: 'You', sub: 'at the prompt', tone: 'blue' },
          { name: 'PowerShell', sub: 'command lookup', tone: 'cyan' },
          { name: 'Alias table', sub: 'Get-Alias', tone: 'amber' },
          { name: 'Get-ChildItem', sub: 'real cmdlet', tone: 'green' },
        ],
        messages: [
          { from: 0, to: 1, label: 'ls C:\\Windows', detail: `You type a nickname. PowerShell does not know a cmdlet called ls.` },
          { from: 1, to: 2, label: 'Is ls an alias?', detail: `PowerShell checks its alias table on Windows before looking elsewhere.` },
          { from: 2, to: 1, label: 'Yes: Get-ChildItem', detail: `The table maps the nickname to the full cmdlet name.` },
          { from: 1, to: 3, label: 'Run with C:\\Windows', detail: `Your arguments are passed along unchanged to the real cmdlet.` },
          { from: 3, to: 0, label: 'File and folder objects', detail: `The result is the same objects you would get from typing Get-ChildItem in full.` },
        ],
      },
    ],
  },

  // ==========================================================================
  // 3-3 Help and self-reliance
  // ==========================================================================
  '3-3': {
    hook: `You are on a locked-down server with no internet and no one to ask. Which three commands could make you completely self-sufficient?`,
    mentalModel: `Imagine a Swiss Army knife with three blades. Get-Command finds the tool, Get-Help reads the manual for it, and Get-Member inspects what it produces. You do not memorize thousands of tools. You carry the knife that opens any of them.`,
    misconceptions: [
      {
        myth: `Square brackets in a syntax block mean the value inside is optional.`,
        truth: `It depends on what is bracketed. [-Name] means only the parameter NAME may be left out (positional). The value after it is still required unless the whole thing is wrapped in outer brackets.`,
        test: `Run both: Stop-Process -Id $PID -WhatIf, then Stop-Process $PID -WhatIf. Both work because -Id is positional.`,
      },
      {
        myth: `Several SYNTAX blocks means the help file is repeating itself or is broken.`,
        truth: `Each block is a parameter set: one valid way to call the cmdlet. You choose one block and cannot mix parameters from two blocks.`,
        test: `Run: (Get-Command Stop-Process).ParameterSets | Select-Object Name`,
      },
      {
        myth: `Help on a fresh Windows install is complete and Get-Help -Full is the first thing to read.`,
        truth: `A fresh install ships only help stubs until you run Update-Help. In Windows PowerShell 5.1 that needs an elevated session and an internet connection; newer PowerShell 7 versions add a -Scope CurrentUser option so you do not need admin rights (check with Get-Help Update-Help -Parameter Scope). Even then, read -Examples first. It is the quickest route to working code.`,
        test: `Run: Get-Help Get-Process -Examples and compare how short it is next to Get-Help Get-Process -Full.`,
      },
    ],
    workedExample: {
      goal: `Learn how to show only the last five lines of a text file, using nothing but built-in help.`,
      steps: [
        {
          think: `I suspect Get-Content reads files, so I ask the manual for working examples before reading anything long.`,
          action: `Get-Help Get-Content -Examples`,
          result: `Several short examples, some using -Tail or -TotalCount.`,
        },
        {
          think: `I spotted -Tail. I want its exact details: type, position and whether it is required.`,
          action: `Get-Help Get-Content -Parameter Tail`,
          result: `The parameter description, with Required? false and Position? named.`,
        },
        {
          think: `Named means I must type -Tail. A read-only file that always exists on Windows is a safe test target.`,
          action: `Get-Content -Path C:\\Windows\\System32\\drivers\\etc\\hosts -Tail 5`,
          result: `The last five lines of the hosts file, mostly comments.`,
        },
        {
          think: `Not sure about the type? If I wanted a list of files, the <String[]> bracket on -Path would tell me.`,
          action: `Get-Help Get-Content -Parameter Path`,
          result: `Path is <String[]> and accepts a comma separated list.`,
        },
      ],
      takeaway: `Examples first, parameter details second. You went from not knowing the answer to a working command with no web browser.`,
    },
    checkpoints: [
      {
        question: `Why is Update-Help the first command to run on a new server?`,
        hint: `Think about what Windows ships to keep the installation small.`,
        answer: `Windows includes only help stubs. Update-Help downloads the full help files so Get-Help works offline (Windows PowerShell 5.1 needs an elevated session for this). On a server with no internet, run Save-Help on a connected machine and point Update-Help -SourcePath at the saved folder.`,
      },
      {
        question: `In the syntax Get-Process [[-Name] <String[]>], what does <String[]> tell you?`,
        hint: `Look at the empty square brackets attached to the type.`,
        answer: `The parameter accepts an array, so you can pass a comma separated list such as -Name explorer, pwsh.`,
      },
      {
        question: `How do you list every conceptual help topic and read the one about comparison operators?`,
        hint: `Conceptual topics start with a fixed prefix.`,
        answer: `Get-Help about_* lists them, and Get-Help about_Comparison_Operators opens that topic.`,
      },
    ],
    challenge: {
      brief: `Use Get-Help to read about one parameter: what type of value does Get-Service -Name expect, and is it required? You only need to read the answer, not run Get-Service.`,
      hints: [
        `Nearly done for you: Get-Help Get-Service -Parameter Name. Type it exactly. The type is in the angle brackets on the first line, and the Required? line answers the second question.`,
        `Read down to the line that starts with Accept pipeline input?. On a machine where Update-Help has not been run, that line can be missing or out of date, which is one more reason to update help first.`,
        `Extension (the hard version): decide whether Get-Service accepts pipeline input for -Name, and which kind (ByValue or ByPropertyName), then write the exact command and the answer.`,
      ],
      solution: `Get-Help Get-Service -Parameter Name\nThe type is String[] (a list of names) and Required? is false.\n\nExtension: with updated help, the line Accept pipeline input? shows True (ByPropertyName, ByValue).`,
      why: `The -Parameter switch gives just the details you need instead of the whole help page. Reading the type, the required flag and the pipeline input line is the foundation of the next chapter on parameter binding.`,
    },
    teachBack: `Explain to a friend who only knows web searching how you can learn any new PowerShell command offline, and what the square and angle brackets in a syntax block are telling you.`,
    diagrams: [
      {
        kind: 'compare',
        title: 'Decoding a syntax block',
        caption: `Four tiny patterns explain almost every bracket you will ever see. Read them left to right as a sentence.`,
        left: {
          heading: 'What you see',
          tone: 'amber',
          rows: [
            { label: 'Pattern 1', value: '[-ComputerName <String[]>]' },
            { label: 'Pattern 2', value: '-Id <Int32[]>' },
            { label: 'Pattern 3', value: '[-Name] <String[]>' },
            { label: 'Pattern 4', value: '<String> vs <String[]>' },
          ],
        },
        right: {
          heading: 'What it means',
          tone: 'green',
          rows: [
            { label: 'Pattern 1', value: 'Whole parameter is optional' },
            { label: 'Pattern 2', value: 'Mandatory: you must supply it' },
            { label: 'Pattern 3', value: 'Positional: -Name may be omitted' },
            { label: 'Pattern 4', value: 'One value vs a comma list' },
          ],
        },
        verdict: `Outer square brackets mean optional. Brackets around only the name mean positional. Empty brackets on a type mean a list.`,
      },
      {
        kind: 'sequence',
        title: 'Where help text comes from',
        caption: `Get-Help reads local files. If they are only stubs, Update-Help is the step that fills them from Microsoft.`,
        actors: [
          { name: 'You', sub: 'admin prompt', tone: 'blue' },
          { name: 'PowerShell', sub: 'Get-Help, Update-Help', tone: 'cyan' },
          { name: 'Local help files', sub: 'on disk', tone: 'amber' },
          { name: 'Microsoft help servers', sub: 'internet', tone: 'violet' },
        ],
        messages: [
          { from: 0, to: 1, label: 'Get-Help Stop-Process', detail: `On a fresh install you ask for help right away.` },
          { from: 1, to: 2, label: 'Read local help', detail: `PowerShell looks in the help files stored on this computer.` },
          { from: 2, to: 1, label: 'Only a stub found', detail: `Fresh installs hold just syntax and a short summary, no examples.` },
          { from: 0, to: 1, label: 'Update-Help -Force', detail: `In Windows PowerShell 5.1 run it in an elevated session. It contacts Microsoft for the full text, so the machine needs internet access.` },
          { from: 1, to: 3, label: 'Download help packages', detail: `Needs internet once. You can also save help to a share for offline servers with Save-Help.` },
          { from: 3, to: 2, label: 'Full help stored', detail: `After this, Get-Help -Examples works offline.` },
        ],
      },
    ],
  },

  // ==========================================================================
  // 4-1 Everything is an object
  // ==========================================================================
  '4-1': {
    hook: `Get-Process shows about eight columns. So where are the other sixty or so facts about each process hiding?`,
    mentalModel: `The screen is a shop window. The object is the whole warehouse behind it. A class is the blueprint for a kind of item, an object is one real item built from it, properties are labels on the item (read them), and methods are buttons on the item (press them).`,
    misconceptions: [
      {
        myth: `The columns I see on screen are everything the command returned.`,
        truth: `PowerShell shows a small default set of properties so the table fits. The object itself carries many more.`,
        test: `Run: Get-Process -Id $PID | Format-List *. Compare it with the plain Get-Process table.`,
      },
      {
        myth: `Properties and methods are the same thing, so I can call a property with parentheses.`,
        truth: `Properties are facts and are read without parentheses. Methods are actions and need parentheses, even when empty.`,
        test: `Run: (Get-Date).Year then (Get-Date).AddDays(1). Then run (Get-Date).AddDays without parentheses to see the signatures.`,
      },
      {
        myth: `Get-Process | Get-Member shows me information about each running process.`,
        truth: `Get-Member describes the TYPE of object coming through, one block per distinct type. It lists the blueprint, not the values.`,
        test: `Run: Get-ChildItem C:\\Windows | Get-Member. You will see two TypeName blocks, DirectoryInfo and FileInfo.`,
      },
    ],
    workedExample: {
      goal: `Find which property holds the memory a process is using, read it, convert it to megabytes and try a method.`,
      steps: [
        {
          think: `I do not guess property names from column headers. I ask the object. Memory tools usually have Working in the name.`,
          action: `Get-Process -Id $PID | Get-Member -Name *Working*`,
          result: `WorkingSet, WorkingSet64, MaxWorkingSet, MinWorkingSet and the PeakWorkingSet variants.`,
        },
        {
          think: `WorkingSet64 is a 64 bit number in bytes, and the Definition column says it is read only, so I can only read it.`,
          action: `(Get-Process -Id $PID).WorkingSet64`,
          result: `A large whole number of bytes.`,
        },
        {
          think: `Bytes are hard to read. PowerShell understands the MB unit, so I divide and round.`,
          action: `[math]::Round((Get-Process -Id $PID).WorkingSet64 / 1MB, 1)`,
          result: `A number such as 95.4, which is megabytes.`,
        },
        {
          think: `Now a method. Strings have many. I use a harmless one and check the parentheses rule.`,
          action: `'pwsh'.ToUpper()`,
          result: `PWSH. Without the parentheses PowerShell would print the method signature instead.`,
        },
        {
          think: `Last, I list a type's methods to see what actions exist before I ever need them.`,
          action: `Get-Process -Id $PID | Get-Member -MemberType Method | Select-Object -First 6 Name`,
          result: `Methods such as Close, Kill, Refresh and WaitForExit.`,
        },
      ],
      takeaway: `Get-Member first, then dot notation. You never guessed a name, and you never needed to parse the table.`,
    },
    checkpoints: [
      {
        question: `What is the difference between a class and an object?`,
        hint: `Think of a car blueprint versus a car on the road.`,
        answer: `A class is the blueprint (for example System.Diagnostics.Process). An object is one live instance of it, such as the process for notepad.exe.`,
      },
      {
        question: `Which line is correct for reading the process ID of $p: $p.Id or $p.Id()? And for stopping it: $p.Kill or $p.Kill()?`,
        hint: `Facts versus actions.`,
        answer: `$p.Id (a property, no parentheses) and $p.Kill() (a method, parentheses required).`,
      },
      {
        question: `What does the TypeName line at the top of Get-Member output tell you?`,
        hint: `It is the name of the blueprint.`,
        answer: `The exact .NET class of the objects in the pipeline, such as System.Diagnostics.Process. It tells you which properties and methods exist.`,
      },
    ],
    challenge: {
      brief: `Find out when the PowerShell window you are typing in was started. The property is called StartTime, and you read it with a dot.`,
      hints: [
        `Nearly done for you: (Get-Process -Id $PID).StartTime. Type it exactly. $PID is a built-in variable holding the ID of your own shell, so this asks about the window you are in.`,
        `If you do not know a property name, ask the object: Get-Process -Id $PID | Get-Member -Name *Time*. StartTime is in that list.`,
        `Extension (the hard version): also show how many minutes ago it started as a rounded number. Subtract the start time from (Get-Date) to get a TimeSpan object, which has a TotalMinutes property, and round it with [math]::Round.`,
      ],
      solution: `(Get-Process -Id $PID).StartTime\n\nExtension:\n[math]::Round(((Get-Date) - (Get-Process -Id $PID).StartTime).TotalMinutes, 1)`,
      why: `Asking the object beats guessing, and a property is read with a dot and no parentheses. In the extension both values are real DateTime objects, so subtraction returns a TimeSpan that already knows its TotalMinutes. No text parsing is involved.`,
    },
    teachBack: `Explain to a friend who only knows spreadsheets why Get-Process is more like a table of live cars than a printout, and how Get-Member shows you the hidden columns.`,
    diagrams: [
      {
        kind: 'tree',
        title: 'Anatomy of a Process object',
        caption: `One blueprint, three kinds of members. PowerShell also bolts on extra members so the display looks friendly.`,
        root: {
          label: 'System.Diagnostics.Process',
          sub: 'The class (TypeName)',
          detail: `The blueprint. Each running process becomes one object built from this class.`,
          tone: 'blue',
          children: [
            {
              label: 'Properties',
              sub: 'Facts you read',
              detail: `Examples: Id, Name, StartTime and WorkingSet64. Read with a dot and no parentheses.`,
              tone: 'green',
            },
            {
              label: 'Methods',
              sub: 'Actions you call',
              detail: `Examples: Kill(), Refresh() and WaitForExit(). Always called with parentheses.`,
              tone: 'amber',
            },
            {
              label: 'Added by PowerShell',
              sub: 'Alias and Script members',
              detail: `Shortcuts like WS (an alias of WorkingSet) and calculated ones like CPU. They exist to make output friendlier.`,
              tone: 'violet',
            },
            {
              label: 'Events',
              sub: 'Notifications',
              detail: `Things the object can announce, such as Exited. You will meet these in advanced scripting.`,
              tone: 'cyan',
            },
          ],
        },
      },
      {
        kind: 'compare',
        title: 'The shop window and the warehouse',
        caption: `What a default table shows is a tiny slice of what the object really holds.`,
        left: {
          heading: 'What the table shows',
          tone: 'amber',
          rows: [
            { label: 'Columns', value: 'About 8 default columns' },
            { label: 'Names', value: 'Display headers like NPM(K)' },
            { label: 'Purpose', value: 'Fit on your screen' },
            { label: 'Methods', value: 'Not visible at all' },
          ],
        },
        right: {
          heading: 'What the object holds',
          tone: 'green',
          rows: [
            { label: 'Members', value: 'About 70 properties, 19 methods' },
            { label: 'Names', value: 'Real names like WorkingSet64' },
            { label: 'Purpose', value: 'Everything you can script' },
            { label: 'Find them', value: 'Get-Member or Format-List *' },
          ],
        },
        verdict: `Never copy a column header into a script. Ask Get-Member for the real property name.`,
      },
    ],
  },

  // ==========================================================================
  // 4-2 Formatting and custom objects
  // ==========================================================================
  '4-2': {
    hook: `Your CSV export from a nicely formatted table is full of strange columns like pageHeaderEntry. What did Format-Table do to your data?`,
    mentalModel: `Format-Table is a photographer. Before the shutter clicks you have real people (objects). After it, you only have a flat picture, and you cannot ask a photograph to dance. Select-Object is a tailor: it keeps real, usable data and trims it to the shape you want. Put the camera at the very end.`,
    misconceptions: [
      {
        myth: `Format-Table just makes output prettier. I can still export or sort after it.`,
        truth: `Format-* turns your objects into formatting instructions for the screen. Anything after it receives those instructions, not your data.`,
        test: `Run: Get-Process | Format-Table Name, Id | Get-Member | Select-Object -First 3. The TypeName is a Microsoft.PowerShell.Commands.Internal.Format type.`,
      },
      {
        myth: `Select-Object Name, Id gives me the same Process objects, just with fewer columns.`,
        truth: `It makes a trimmed copy that carries only the properties you chose, with a new type name starting with Selected. Methods like Kill() are gone from the copy.`,
        test: `Run: Get-Process | Select-Object Name, Id | Get-Member | Select-Object -First 3. TypeName starts with Selected.`,
      },
      {
        myth: `A hashtable is the same as a custom object. I can export a hashtable as a table.`,
        truth: `A hashtable is one object holding keys. Casting it with [PSCustomObject] makes its keys real properties, which is what exports, sorts and tables need.`,
        test: `Run: @{ Name = 'a' } | ConvertTo-Csv -NoTypeInformation (hashtable columns like Keys and Values) then [PSCustomObject]@{ Name = 'a' } | ConvertTo-Csv -NoTypeInformation (a Name column).`,
      },
    ],
    workedExample: {
      goal: `Build a top 3 memory report with a friendly megabytes column that stays exportable, then prove why Format-Table must come last.`,
      steps: [
        {
          think: `I need a column that does not exist yet: megabytes. A calculated property builds it for me inside Select-Object.`,
          action: `Get-Process | Sort-Object WorkingSet64 -Descending | Select-Object -First 3 Name, Id, @{ Name = 'MemMB'; Expression = { [math]::Round($_.WorkingSet64 / 1MB, 1) } }`,
          result: `Three rows with Name, Id and a new MemMB column. Inside Expression, $_ is the current process.`,
        },
        {
          think: `Because Select-Object kept real objects, I can send them to CSV or JSON text without opening a file.`,
          action: `Get-Process | Sort-Object WorkingSet64 -Descending | Select-Object -First 3 Name, Id, @{ Name = 'MemMB'; Expression = { [math]::Round($_.WorkingSet64 / 1MB, 1) } } | ConvertTo-Csv -NoTypeInformation`,
          result: `Clean CSV text with a Name, Id, MemMB header.`,
        },
        {
          think: `Now the trap. I replace Select-Object with Format-Table and try the same CSV conversion.`,
          action: `Get-Process | Format-Table Name, Id | ConvertTo-Csv -NoTypeInformation | Select-Object -First 2`,
          result: `A header of formatting properties such as pageHeaderEntry and shapeInfo. Not process data.`,
        },
        {
          think: `When I need a new object from scratch, I use a custom object so every key becomes a property.`,
          action: `[PSCustomObject]@{ Computer = $env:COMPUTERNAME; PowerShell = $PSVersionTable.PSVersion.ToString() }`,
          result: `A one row table with Computer and PowerShell columns.`,
        },
        {
          think: `I check that my custom object is a first class citizen by sending it through another cmdlet.`,
          action: `[PSCustomObject]@{ Computer = $env:COMPUTERNAME; Edition = $PSVersionTable.PSEdition } | ConvertTo-Json`,
          result: `JSON text with both properties.`,
        },
      ],
      takeaway: `Shape data with Select-Object or [PSCustomObject]. Draw it with Format-* only at the very end, for human eyes.`,
    },
    checkpoints: [
      {
        question: `Which cmdlet shows every property value of one object, one per line?`,
        hint: `Think of the list formatter with a wildcard.`,
        answer: `Format-List * (or fl *). For example Get-Process -Id $PID | Format-List *.`,
      },
      {
        question: `In a calculated property, what do Name (or Label) and Expression do?`,
        hint: `One is for the column title, the other is the recipe.`,
        answer: `Name sets the column title. Expression is a script block that computes the value, using $_ for the current object.`,
      },
      {
        question: `You need the output as both a nice screen table and a CSV file. In what order do you do it?`,
        hint: `Formatting destroys objects, so what must happen first?`,
        answer: `Use Select-Object and export first (Export-Csv). To see a table, run a separate command with Format-Table at the end.`,
      },
    ],
    challenge: {
      brief: `List the 5 largest files directly in your Windows folder (not subfolders) as objects with two properties: Name and SizeKB (rounded to 1 decimal), then show them with the largest first. Keep the result exportable.`,
      hints: [
        `Get-ChildItem -File lists files only. Sort by the Length property, biggest first.`,
        `Select-Object can add a calculated property. Divide Length by 1KB and round it.`,
        `Order the pipeline: Get-ChildItem, then Sort-Object Length -Descending, then Select-Object -First 5 with Name and the calculated SizeKB.`,
      ],
      solution: `Get-ChildItem -Path $env:windir -File | Sort-Object Length -Descending | Select-Object -First 5 Name, @{ Name = 'SizeKB'; Expression = { [math]::Round($_.Length / 1KB, 1) } }`,
      why: `Sorting happens on the real Length number before slicing. The calculated property builds a friendly column without changing the files. No Format-* cmdlet is used, so the result can still be exported.`,
    },
    teachBack: `Explain to a friend who only knows Excel why you cannot filter or export a PowerShell table after Format-Table, and how Select-Object solves the problem.`,
    diagrams: [
      {
        kind: 'sequence',
        title: 'Why the CSV turned into gibberish',
        caption: `Format-Table replaces your data with drawing instructions. Everything downstream only ever sees the instructions.`,
        actors: [
          { name: 'Get-Process', sub: 'source', tone: 'green' },
          { name: 'Format-Table', sub: 'screen layout', tone: 'amber' },
          { name: 'Export-Csv', sub: 'file writer', tone: 'cyan' },
          { name: 'CSV file', sub: 'result', tone: 'red' },
        ],
        messages: [
          { from: 0, to: 1, label: 'Process objects', detail: `Real objects with every property and method flow in.` },
          { from: 1, to: 1, label: 'Build display layout', detail: `The process data is replaced with layout records for the screen.` },
          { from: 1, to: 2, label: 'Format records', detail: `Export-Csv receives layout records, not processes. The data is already gone.` },
          { from: 2, to: 3, label: 'Columns like shapeInfo', detail: `The file is filled with columns that describe formatting, not your processes.` },
        ],
      },
      {
        kind: 'compare',
        title: 'Select-Object or Format-Table?',
        caption: `Both can show chosen columns. Only one keeps usable data.`,
        left: {
          heading: 'Select-Object',
          tone: 'green',
          rows: [
            { label: 'Output', value: 'Real (trimmed) objects' },
            { label: 'After it', value: 'Sort, filter, export' },
            { label: 'Calculated', value: '@{ Name=...; Expression={...} }' },
            { label: 'Use for', value: 'Shaping data' },
          ],
        },
        right: {
          heading: 'Format-Table',
          tone: 'red',
          rows: [
            { label: 'Output', value: 'Layout instructions' },
            { label: 'After it', value: 'Only Out-Host or Out-File' },
            { label: 'Options', value: '-AutoSize, -Wrap' },
            { label: 'Use for', value: 'Last step, human eyes' },
          ],
        },
        verdict: `Format Right: put Format-* at the very end of the line, and never feed it into another data cmdlet.`,
      },
    ],
  },

  // ==========================================================================
  // 5-1 Pipeline mechanics and parameter binding
  // ==========================================================================
  '5-1': {
    hook: `"spooler" | Get-Service works, but "explorer" | Get-Process throws a red error. Both feed a string to a cmdlet that wants a name, so what is different?`,
    mentalModel: `The pipeline is a conveyor belt with a quality inspector at the next station. The inspector looks at each item and asks two questions in order: "Is this exactly the kind of thing I accept?" (ByValue), and if not, "Does it have a label that matches one of my slots?" (ByPropertyName). If both answers are no, the item is rejected.`,
    misconceptions: [
      {
        myth: `The first command finishes completely, then hands the full list to the next command.`,
        truth: `Objects stream one at a time. The second command can start working on object 1 while the first is still producing object 2.`,
        test: `Run: 1..3 | ForEach-Object { Write-Host "first $_"; $_ } | ForEach-Object { Write-Host "second $_" }. The messages interleave.`,
      },
      {
        myth: `Any value can be piped into any cmdlet, as long as it makes sense to me.`,
        truth: `The next cmdlet must declare a parameter that accepts pipeline input, either ByValue (matching type) or ByPropertyName (matching property name). Otherwise you get a binding error.`,
        test: `Run: 'explorer' | Get-Process. It fails because a plain string has no Name property and Get-Process -Name is not ByValue.`,
      },
      {
        myth: `ByPropertyName only works if the incoming object is the right type, like a real Process.`,
        truth: `Any object works if it has a property whose name matches a parameter that accepts ByPropertyName. Even a custom object you invented.`,
        test: `Run: [PSCustomObject]@{ Name = 'explorer' } | Get-Process. It returns the explorer process.`,
      },
    ],
    workedExample: {
      goal: `Predict, then prove, which pipelines will bind and fix the one that fails.`,
      steps: [
        {
          think: `Strings go into Get-Service in tutorials all the time. I test it first because it should work.`,
          action: `'spooler' | Get-Service`,
          result: `The Spooler service appears.`,
        },
        {
          think: `Now the same idea with Get-Process. I expect a problem but I want to see the message.`,
          action: `'explorer' | Get-Process`,
          result: `A red error: the input object cannot be bound to any parameters for the command.`,
        },
        {
          think: `Do not guess. Help lists how each cmdlet accepts pipeline input for its Name parameter.`,
          action: `Get-Help Get-Process -Parameter Name; Get-Help Get-Service -Parameter Name`,
          result: `Get-Process shows (ByPropertyName). Get-Service shows (ByPropertyName, ByValue).`,
        },
        {
          think: `So Get-Process needs an object that has a Name property. I can invent one.`,
          action: `[PSCustomObject]@{ Name = 'explorer' } | Get-Process`,
          result: `The explorer process is returned this time.`,
        },
        {
          think: `For more certainty I can watch the binding engine decide. (Preview: Trace-Command is an advanced debugging tool, so treat its output as optional reading and skip this step if it looks overwhelming.)`,
          action: `Trace-Command -Name ParameterBinding -PSHost -Expression { 'spooler' | Get-Service }`,
          result: `Verbose lines mentioning a ByValue binding of the string to Name.`,
        },
      ],
      takeaway: `Do not guess a pipeline. Read the pipeline input line in help, and use ByPropertyName with a matching property if ByValue does not apply.`,
    },
    checkpoints: [
      {
        question: `In what order does PowerShell try to bind a piped object to parameters?`,
        hint: `Type match comes before name match.`,
        answer: `First ByValue (the object's type fits a parameter), then ByPropertyName (a property name matches a parameter name).`,
      },
      {
        question: `What does -PassThru do on Out-GridView?`,
        hint: `Without it, Out-GridView is a dead end window.`,
        answer: `It adds OK and Cancel buttons and sends the rows you selected back into the pipeline for the next cmdlet.`,
      },
      {
        question: `How do you check what a parameter accepts from the pipeline without opening a web page?`,
        hint: `Use Get-Help with a switch that picks one parameter.`,
        answer: `Get-Help <Cmdlet> -Parameter <Name> and read the Accept pipeline input? line.`,
      },
    ],
    challenge: {
      brief: `Make Get-Process return your own PowerShell window by sending it a custom object instead of typing the name after Get-Process. Then say which kind of binding was used, ByValue or ByPropertyName.`,
      hints: [
        `Nearly done for you: [PSCustomObject]@{ Name = 'powershell' } | Get-Process. Replace powershell with pwsh if you are in PowerShell 7. It is the same pattern as step 4 of the worked example.`,
        `The custom object has a property called Name, and Get-Process has a parameter called Name that accepts ByPropertyName only, so the property value is passed to -Name.`,
        `Extension (the hard version): do not type the process name at all. Build the object from the live value with (Get-Process -Id $PID).Name, so the line works in any edition.`,
      ],
      solution: `[PSCustomObject]@{ Name = 'powershell' } | Get-Process\n\nExtension:\n[PSCustomObject]@{ Name = (Get-Process -Id $PID).Name } | Get-Process\nThis binds ByPropertyName because Get-Process -Name does not accept strings ByValue.`,
      why: `The custom object has a property called Name, which matches the parameter name. PowerShell reads that property's value and passes it to -Name.`,
    },
    teachBack: `Explain to a friend who only knows copy and paste why some pipelines fail with a binding error, and how you can predict that before you run them.`,
    diagrams: [
      {
        kind: 'sequence',
        title: 'How a piped object finds its parameter',
        caption: `The binder is the quiet middleman. It tries a type match first and a name match second, and rejects the object if neither fits.`,
        actors: [
          { name: 'Upstream cmdlet', sub: 'sends objects', tone: 'green' },
          { name: 'Parameter binder', sub: 'the matchmaker', tone: 'amber' },
          { name: 'Downstream cmdlet', sub: 'receives', tone: 'cyan' },
        ],
        messages: [
          { from: 0, to: 1, label: 'Emits one object', detail: `The object is placed on the pipeline. Only one object travels at a time.` },
          { from: 1, to: 1, label: 'Try ByValue', detail: `Does any parameter accept pipeline input whose type matches this object?` },
          { from: 1, to: 1, label: 'Else try ByPropertyName', detail: `Does the object have a property with the same name as such a parameter?` },
          { from: 1, to: 2, label: 'Bind and run', detail: `On a match the value is bound to that parameter and the cmdlet processes it.` },
          { from: 1, to: 0, label: 'No match: error', detail: `If neither rule matches you see: the input object cannot be bound to any parameters.` },
        ],
      },
      {
        kind: 'compare',
        title: 'Same parameter name, different rules',
        caption: `Both cmdlets have a Name parameter, but only one accepts a bare string from the pipeline.`,
        left: {
          heading: 'Get-Service -Name',
          tone: 'green',
          rows: [
            { label: 'Type', value: 'String[]' },
            { label: 'Pipeline input', value: 'ByPropertyName, ByValue' },
            { label: "'spooler' | ...", value: 'Works (ByValue)' },
            { label: 'Object with Name', value: 'Works (ByPropertyName)' },
          ],
        },
        right: {
          heading: 'Get-Process -Name',
          tone: 'amber',
          rows: [
            { label: 'Type', value: 'String[]' },
            { label: 'Pipeline input', value: 'ByPropertyName only' },
            { label: "'explorer' | ...", value: 'Fails (no Name on a string)' },
            { label: 'Object with Name', value: 'Works (ByPropertyName)' },
          ],
        },
        verdict: `The cmdlet's own help decides. Always check the Accept pipeline input line before you pipe.`,
      },
      {
        kind: 'layers',
        title: 'The four binding passes',
        caption: `Simplified from about_Parameter_Binding. The binder prefers exact matches, and only when every exact attempt fails does it try converting (coercing) the value to a type the parameter accepts.`,
        layers: [
          {
            label: 'Pass 1: ByValue, exact type',
            sub: 'No conversion',
            detail: `Is there a pipeline parameter whose type matches the incoming object, or a type it derives from? A Process object piped to Stop-Process lands in -InputObject this way.`,
            tone: 'green',
          },
          {
            label: 'Pass 2: ByPropertyName',
            sub: 'No conversion',
            detail: `Does the object have a property with the same name as a pipeline parameter, and is its value already the right type? A custom object with a Name property can bind to Get-Process -Name here.`,
            tone: 'cyan',
          },
          {
            label: 'Pass 3: ByValue + coercion',
            sub: 'Convert the whole object',
            detail: `Can PowerShell convert the object to the parameter's type, for example the string '42' into the number 42? If yes, the converted value is bound.`,
            tone: 'amber',
          },
          {
            label: 'Pass 4: Name + coercion',
            sub: 'Convert the property value',
            detail: `Same as pass 2, but the matching property's value is converted when the types differ. A string property can bind to an integer parameter this way.`,
            tone: 'violet',
          },
          {
            label: 'No match: binding error',
            sub: 'Cannot be bound',
            detail: `If all four passes fail you see: The input object cannot be bound to any parameters for the command. Read the help line Accept pipeline input? to see what the parameter wants.`,
            tone: 'red',
          },
        ],
        traceLabel: 'Follow one object through the passes',
        tracePath: [0, 1, 2, 3, 4],
      },
    ],
  },

  // ==========================================================================
  // 5-2 Chaining and multi-line
  // ==========================================================================
  '5-2': {
    hook: `You paste ipconfig /flushdns && gpupdate /force into a server window and get a parser error. The very same line worked on your laptop. What is the server missing?`,
    mentalModel: `A pipe is a conveyor belt: goods move from one station to the next. A semicolon is a to-do list: do this, then that, with no goods passed. && and || are traffic lights: they look at whether the last step ended in success or failure, then decide whether to continue.`,
    misconceptions: [
      {
        myth: `A semicolon and a pipe do the same job, they just separate commands.`,
        truth: `A pipe passes the output objects of the first command to the second. A semicolon runs them one after the other and passes nothing.`,
        test: `Run: Get-Date ; Get-Member. Get-Member complains because it received no input. Then run Get-Date | Get-Member.`,
      },
      {
        myth: `&& and || work in every version of PowerShell I use.`,
        truth: `They only exist in PowerShell 7 and newer. Windows PowerShell 5.1 does not understand them and raises a parser error.`,
        test: `Run: powershell -NoProfile -Command "Test-Path C:\\Windows && 'ok'". You see the token && is not a valid statement separator.`,
      },
      {
        myth: `&& runs the second command only if the first one printed True, and || only if it printed False.`,
        truth: `They test success or failure of the first command (whether it errored or exited with 0), not what it printed. Test-Path C:\\Nope prints False but succeeded, so || will not run.`,
        test: `In PowerShell 7 run: Test-Path C:\\Nope || 'fallback ran'. Nothing is printed after False, because the command itself succeeded.`,
      },
    ],
    workedExample: {
      goal: `Chain commands safely, first in PowerShell 7 and then with a 5.1 compatible version, and format a long pipeline cleanly.`,
      steps: [
        {
          think: `Semicolons work everywhere, so I start with the portable form to see independent steps.`,
          action: `Write-Output 'Step 1'; Get-Date; Write-Output 'Step 3'`,
          result: `Three outputs, one after another. Each is independent.`,
        },
        {
          think: `In PowerShell 7, I want a follow up that only happens if a native command succeeded. cmd /c exit gives me a clear exit code.`,
          action: `cmd /c exit 0 && Write-Output 'previous step succeeded'`,
          result: `previous step succeeded (PowerShell 7 only).`,
        },
        {
          think: `For a fallback on failure I use ||. Exit code 1 means failure.`,
          action: `cmd /c exit 1 || Write-Output 'fallback: previous step failed'`,
          result: `fallback: previous step failed (PowerShell 7 only).`,
        },
        {
          think: `On a 5.1 server I cannot use &&, so I check the success flag $? myself.`,
          action: `cmd /c exit 0; if ($?) { Write-Output 'previous step succeeded' }`,
          result: `previous step succeeded, and it works in both 5.1 and 7.`,
        },
        {
          think: `For readability I end each line with a pipe, so PowerShell knows the command continues and I avoid fragile backticks.`,
          action: `Get-Service |\n    Where-Object Status -eq 'Running' |\n    Sort-Object DisplayName |\n    Select-Object -First 5 Name, DisplayName`,
          result: `Five running services, printed from a clean multi-line pipeline.`,
        },
      ],
      takeaway: `Use ; for portability and if ($?) in 5.1. Reserve && and || for 7 only, and break lines after a pipe.`,
    },
    checkpoints: [
      {
        question: `Which separator is safe in both Windows PowerShell 5.1 and PowerShell 7 to run two independent commands?`,
        hint: `It is a punctuation mark you see in many programming languages.`,
        answer: `The semicolon ;. Each command runs regardless of whether the previous one succeeded.`,
      },
      {
        question: `Why is breaking a line right after a pipe safer than using a backtick?`,
        hint: `Think about an invisible character that may follow a backtick.`,
        answer: `After a pipe PowerShell knows the command is unfinished. A backtick must be the very last character, and a hidden trailing space after it breaks the command.`,
      },
      {
        question: `On a 5.1 server, how do you write: run B only if A succeeded?`,
        hint: `The automatic variable for the last command's success.`,
        answer: `A; if ($?) { B }`,
      },
    ],
    challenge: {
      brief: `Write one line that works in Windows PowerShell 5.1 and PowerShell 7: run cmd /c exit 1, and print "failed" only if it failed, otherwise print "worked". Use no && or ||.`,
      hints: [
        `The automatic variable $? holds True when the previous command succeeded.`,
        `You need an if with an else. Run the command first, then test $?.`,
        `cmd /c exit 1; if ($?) { 'worked' } else { 'failed' }`,
      ],
      solution: `cmd /c exit 1; if ($?) { 'worked' } else { 'failed' }`,
      why: `The native command sets the success flag by its exit code. Because 1 means failure, $? is false and the else branch prints failed. It uses only syntax that exists in 5.1 and 7.`,
    },
    teachBack: `Explain to a friend who knows bash why && works on your laptop but not on a fresh Windows server, and what you would use instead.`,
    diagrams: [
      {
        kind: 'compare',
        title: 'Which operator works where',
        caption: `Know the version before you choose the separator. The server may be older than your laptop.`,
        left: {
          heading: 'Windows PowerShell 5.1',
          tone: 'amber',
          rows: [
            { label: 'A | B', value: 'Pipes objects' },
            { label: 'A ; B', value: 'Runs both, always' },
            { label: 'A && B', value: 'Parser error' },
            { label: 'Conditional', value: 'A; if ($?) { B }' },
          ],
        },
        right: {
          heading: 'PowerShell 7',
          tone: 'green',
          rows: [
            { label: 'A | B', value: 'Pipes objects' },
            { label: 'A ; B', value: 'Runs both, always' },
            { label: 'A && B', value: 'B only if A succeeded' },
            { label: 'A || B', value: 'B only if A failed' },
          ],
        },
        verdict: `The semicolon and if ($?) are portable. && and || are 7 only.`,
      },
      {
        kind: 'sequence',
        title: 'How && and || decide',
        caption: `The operator does not read your output. It reads the success flag the previous command left behind.`,
        actors: [
          { name: 'Command A', sub: 'runs first', tone: 'blue' },
          { name: 'Success flag $?', sub: 'True or False', tone: 'amber' },
          { name: '&& or ||', sub: 'the decider', tone: 'violet' },
          { name: 'Command B', sub: 'maybe runs', tone: 'green' },
        ],
        messages: [
          { from: 0, to: 1, label: 'Finishes, sets flag', detail: `Success is True. An error, or a native exit code other than 0, makes it False.` },
          { from: 2, to: 1, label: 'Reads the flag', detail: `The operator checks the flag. It ignores any text or True and False that A printed.` },
          { from: 2, to: 3, label: '&& and flag is True', detail: `With &&, B runs only when A succeeded.` },
          { from: 2, to: 3, label: '|| and flag is False', detail: `With ||, B runs only when A failed. This makes a handy fallback.` },
        ],
      },
      {
        kind: 'compare',
        title: 'Truth table: ; | && ||',
        caption: `What happens to command B in each case. The deciding fact is whether A succeeded ($? is True), not what A printed. The && and || rows need PowerShell 7.`,
        left: {
          heading: 'A succeeds ($? True)',
          tone: 'green',
          rows: [
            { label: 'A ; B', value: 'B runs' },
            { label: 'A | B', value: "B receives A's objects" },
            { label: 'A && B (7)', value: 'B runs' },
            { label: 'A || B (7)', value: 'B is skipped' },
          ],
        },
        right: {
          heading: 'A fails ($? False)',
          tone: 'red',
          rows: [
            { label: 'A ; B', value: 'B runs anyway' },
            { label: 'A | B', value: 'B runs but gets no objects' },
            { label: 'A && B (7)', value: 'B is skipped' },
            { label: 'A || B (7)', value: 'B runs' },
          ],
        },
        verdict: `Test-Path on a missing folder prints False but still counts as a success, so A || B does not fire. To act on a False result, use if (-not (Test-Path $p)) { ... }.`,
      },
    ],
  },

  // ==========================================================================
  // 6-1 Variables, arrays, types
  // ==========================================================================
  '6-1': {
    hook: `Why does "50" + "50" give you 5050, and why does asking for the last item of a list use a negative number?`,
    mentalModel: `A variable is a labeled box on a shelf. The label starts with a $ and the box holds a real object, not just text. An array is a row of numbered lockers that start at 0, and a type like [int] is a lock on the box that only lets whole numbers in.`,
    misconceptions: [
      {
        myth: `Arrays start counting at 1, so the first item is $a[1].`,
        truth: `Arrays are zero-indexed. The first item is [0], and negative numbers count from the end, so [-1] is the last.`,
        test: `Run: $a = 'x','y','z'; $a[0]; $a[-1]`,
      },
      {
        myth: `If I type "50", PowerShell knows it is a number, so "50" + "50" is 100.`,
        truth: `Quoted values are strings. The + operator on two strings joins them, so you get 5050. Cast with [int] to do math.`,
        test: `Run: '50' + '50'; [int]'50' + [int]'50'; '50'.GetType().Name`,
      },
      {
        myth: `$arr += 'new' adds an item to the same array in place.`,
        truth: `Arrays have a fixed size. += builds a brand new array and points the variable at it, so other variables that pointed to the old array do not change.`,
        test: `Run: $a = 1,2; $b = $a; $a += 3; $a.Count; $b.Count (gives 3 and 2).`,
      },
    ],
    workedExample: {
      goal: `Store a list of service names, read items by index, feed the list to a cmdlet and see strong typing stop a mistake.`,
      steps: [
        {
          think: `I want one variable for several names. The comma builds an array. No $ is needed on the right unless I read another variable.`,
          action: `$targets = 'wuauserv', 'bits', 'Spooler'`,
          result: `No output. The array is now stored in $targets.`,
        },
        {
          think: `I check first, last and count to make sure I understand zero based indexes.`,
          action: `$targets[0]; $targets[-1]; $targets.Count`,
          result: `wuauserv, Spooler and 3.`,
        },
        {
          think: `The -Name parameter is <String[]>, so I can pass the whole array without a loop.`,
          action: `Get-Service -Name $targets`,
          result: `Three rows, one per service.`,
        },
        {
          think: `Now the string versus number trap. I save text and compare with a cast.`,
          action: `$qty = '50'; $qty + $qty; [int]$qty + [int]$qty`,
          result: `5050 and then 100.`,
        },
        {
          think: `Last, I lock a variable to a type so a wrong value is rejected early.`,
          action: `[int]$port = 443; $port = 'https'`,
          result: `An error that the value https cannot be converted to type Int32. $port is still 443.`,
        },
      ],
      takeaway: `Arrays start at 0, a list can be passed straight to a String[] parameter, and a type cast turns silent bugs into loud errors.`,
    },
    checkpoints: [
      {
        question: `For $s = 'a','b','c','d', what do $s[1], $s[-1] and $s[0..1] return?`,
        hint: `Start at zero, and negatives count backwards.`,
        answer: `'b', 'd' and the pair 'a','b'.`,
      },
      {
        question: `Do you write Remove-Variable -Name $ip or -Name ip?`,
        hint: `Think about what the $ means to PowerShell when it appears.`,
        answer: `-Name ip. The $ would read the value of the variable. The cmdlets want the variable's name, without the $.`,
      },
      {
        question: `Read-Host returns the typed text. What type is it, and how do you get a number from it?`,
        hint: `It is always the same, no matter what you type.`,
        answer: `A string. Cast it, for example [int]$count = Read-Host 'How many'.`,
      },
    ],
    challenge: {
      brief: `Create an array of three server names and print the first one and the last one. You only need square brackets with numbers inside them.`,
      hints: [
        `Nearly done for you: $servers = 'DC01','SRV-CORE01','CLIENT01' and then $servers[0] and $servers[-1], each on its own line. Index 0 is the first item and -1 is the last.`,
        `If you see the whole list printed, you probably typed $servers without brackets. If you see an error, check that the commas are between quoted names with no stray spaces inside the quotes.`,
        `Extension (the hard version): use an array of five names. Print the last two on one line with a slice and -join, then show how many days remain until 31 December this year by casting text to a date. A slice uses two dots: $servers[-2..-1]. Subtracting two dates gives a TimeSpan with a Days property.`,
      ],
      solution: `$servers = 'DC01','SRV-CORE01','CLIENT01'\n$servers[0]\n$servers[-1]\n\nExtension:\n$servers = 'DC01','DC02','SQL01','WEB01','APP01'\n$servers[-2..-1] -join ', '\n([datetime]"12/31/$((Get-Date).Year)" - (Get-Date)).Days`,
      why: `Indexes start at 0 and negative numbers count back from the end, so [-1] reaches the last item without knowing the length. In the extension, [-2..-1] is a slice from the second last to the last item, and -join turns it into one line. Casting to [datetime] creates a real date, so subtraction returns a TimeSpan with a Days property.`,
    },
    teachBack: `Explain to a friend who only knows Excel cells why a PowerShell variable is a box with a type, and why counting from zero feels odd at first but makes the last item easy to reach.`,
    diagrams: [
      {
        kind: 'layers',
        title: 'An array is a row of numbered lockers',
        caption: `Each slot has two addresses: a positive number from the front and a negative number from the back.`,
        traceLabel: 'Walk the array',
        layers: [
          {
            label: '[0] and [-4]',
            sub: 'DC01',
            detail: `The first item. From the back, it is the fourth from the end.`,
            tone: 'blue',
          },
          {
            label: '[1] and [-3]',
            sub: 'DC02',
            detail: `The second item. A slice like [0..1] returns the first two.`,
            tone: 'cyan',
          },
          {
            label: '[2] and [-2]',
            sub: 'SQL01',
            detail: `The third item. Its negative address counts from the end.`,
            tone: 'green',
          },
          {
            label: '[3] and [-1]',
            sub: 'WEB01',
            detail: `The last item. [-1] is the easy way to reach it without knowing the length.`,
            tone: 'amber',
          },
          {
            label: 'Count = 4',
            sub: 'Fixed size',
            detail: `The Count tells you how many lockers exist. Adding with += builds a new, longer array.`,
            tone: 'violet',
          },
        ],
      },
      {
        kind: 'compare',
        title: 'Untyped box or locked box',
        caption: `A type cast on the left of the variable locks the box. A cast on the value just converts that one value.`,
        left: {
          heading: 'No type lock',
          tone: 'amber',
          rows: [
            { label: 'Code', value: "$port = '443'" },
            { label: 'Holds', value: 'A string' },
            { label: "$port + 1", value: "'4431' (joined text)" },
            { label: 'Later', value: 'Accepts anything' },
          ],
        },
        right: {
          heading: 'Locked with [int]',
          tone: 'green',
          rows: [
            { label: 'Code', value: '[int]$port = 443' },
            { label: 'Holds', value: 'A 32-bit integer' },
            { label: '$port + 1', value: '444 (real math)' },
            { label: 'Later', value: 'Wrong values are rejected' },
          ],
        },
        verdict: `Cast data you read from users or files. A locked type turns a quiet bug into a clear error message.`,
      },
    ],
  },

  // ==========================================================================
  // 6-2 Quotes, output streams, SecureString
  // ==========================================================================
  '6-2': {
    hook: `You print a message with Write-Host, send it to a file, and the file is empty. Where did your text go?`,
    mentalModel: `Think of PowerShell output as six separate pipes in the wall. Write-Output uses the main pipe that other commands can connect to. Write-Host is a person shouting in the room: everyone present hears it, but it does not enter the main pipe (it goes into a side pipe called the Information stream). Double quotes are a mail merge that fills in names, and single quotes are a stamp that prints exactly what is carved.`,
    misconceptions: [
      {
        myth: `Single and double quotes are interchangeable in PowerShell.`,
        truth: `Double quotes expand variables and $( ) expressions. Single quotes are literal and print the characters exactly as typed.`,
        test: `Run: $n = 'Ana'; "Hi $n"; 'Hi $n'`,
      },
      {
        myth: `Write-Host is the same as Write-Output, only with colors.`,
        truth: `Write-Output sends objects down the pipeline. Write-Host writes to the screen via the information stream and does not return a value you can capture or pipe.`,
        test: `Run: $r = Write-Host 'hi'; $null -eq $r (True) and $s = Write-Output 'hi'; $s (hi).`,
      },
      {
        myth: `Read-Host -AsSecureString just hides the typing and gives me back normal text.`,
        truth: `It returns a System.Security.SecureString object, not a string. Cmdlets that accept it use it safely, and you cannot print it as readable text.`,
        test: `Run: $p = Read-Host 'Pw' -AsSecureString; $p.GetType().Name; "$p".`,
      },
    ],
    workedExample: {
      goal: `Build a message that includes an object property, see how quote choice changes it, and prove that Write-Host output cannot be captured.`,
      steps: [
        {
          think: `I need a real object with a property. The current process is always available.`,
          action: `$p = Get-Process -Id $PID`,
          result: `No output. $p now holds a Process object.`,
        },
        {
          think: `I try the obvious double quoted message and watch for the dot trap.`,
          action: `"PID is $p.Id"`,
          result: `PID is System.Diagnostics.Process (pwsh).Id (or (powershell) in 5.1). Only $p expanded, .Id stayed text.`,
        },
        {
          think: `Wrapping the expression in $( ) tells PowerShell to evaluate the whole property first.`,
          action: `"PID is $($p.Id)"`,
          result: `PID is followed by the real number.`,
        },
        {
          think: `As a control, single quotes should freeze everything exactly as typed.`,
          action: `'PID is $($p.Id)'`,
          result: `PID is $($p.Id) printed literally.`,
        },
        {
          think: `Last, I capture each kind of output in a variable to see which one the pipeline kept.`,
          action: `$kept = Write-Output "PID is $($p.Id)"; $lost = Write-Host "PID is $($p.Id)"; "kept=[$kept] lost=[$lost]"`,
          result: `Write-Host prints once on screen, then the summary shows kept holds the text and lost is empty.`,
        },
      ],
      takeaway: `Use double quotes with $( ) for dynamic text, Write-Output for data, and keep Write-Host for visual status only.`,
    },
    checkpoints: [
      {
        question: `What does 'Server is $name' print when $name = 'DC01'?`,
        hint: `Which quotes are literal?`,
        answer: `Server is $name, exactly as typed. Single quotes never expand.`,
      },
      {
        question: `Why should you cast what Read-Host returns when you ask for a number?`,
        hint: `What data type does Read-Host always give back?`,
        answer: `It always returns a string. A cast such as [int] gives you a number you can compare and calculate with.`,
      },
      {
        question: `Why is hardcoding a password in a .ps1 file dangerous?`,
        hint: `Think about where scripts end up.`,
        answer: `Scripts get copied, committed to Git and logged. A prompt such as Read-Host -AsSecureString or Get-Credential keeps the password out of the file.`,
      },
    ],
    challenge: {
      brief: `Prompt for a username (visible) and write a one-line greeting that includes the length of the name, for example "Hello Ana, your name has 3 letters". Do it so the greeting can be captured in a variable and sent to a file if needed. Do not hardcode anything.`,
      hints: [
        `Read-Host gives you a string. Store it in a variable.`,
        `Inside double quotes, a property or method call needs $( ). The length of a string is its Length property.`,
        `Emit the final line with Write-Output, not Write-Host, so it travels down the pipeline.`,
      ],
      solution: `$name = Read-Host 'Your name'\nWrite-Output "Hello $name, your name has $($name.Length) letters"`,
      why: `$name expands directly because it is a plain variable. $($name.Length) needs the subexpression because it is a property. Write-Output keeps the message in the success stream, so you can capture it or pipe it to Out-File.`,
    },
    teachBack: `Explain to a friend who only knows print statements why a message can appear on screen and still be missing from a file, and how you would collect a password without leaving it in plain text.`,
    diagrams: [
      {
        kind: 'layers',
        title: 'The six output streams',
        caption: `PowerShell keeps different kinds of messages apart. Only the Success stream carries your data down the pipeline.`,
        traceLabel: 'Trace Write-Host',
        tracePath: [5],
        layers: [
          { label: '1 Success', sub: 'Write-Output', detail: `The normal output stream. Objects here flow to the next cmdlet and can be captured in variables.`, tone: 'green' },
          { label: '2 Error', sub: 'Write-Error', detail: `Error records. They do not go into the pipeline unless you redirect them.`, tone: 'red' },
          { label: '3 Warning', sub: 'Write-Warning', detail: `Yellow cautions that do not stop the script.`, tone: 'amber' },
          { label: '4 Verbose', sub: 'Write-Verbose', detail: `Extra detail, shown only when you add -Verbose.`, tone: 'cyan' },
          { label: '5 Debug', sub: 'Write-Debug', detail: `Developer detail, shown when debugging is turned on.`, tone: 'violet' },
          { label: '6 Information', sub: 'Write-Host', detail: `Write-Host sends text here for people to read. It is not the Success stream, so it never reaches Out-File through the pipe.`, tone: 'blue' },
        ],
      },
      {
        kind: 'compare',
        title: 'Double quotes versus single quotes',
        caption: `Same characters, different promise. Choose the quote by whether you want expansion.`,
        left: {
          heading: 'Double quotes',
          tone: 'green',
          rows: [
            { label: 'Variables', value: 'Expanded' },
            { label: '$($obj.Prop)', value: 'Evaluated' },
            { label: 'Literal $', value: 'Needs a backtick escape' },
            { label: 'Use for', value: 'Dynamic text' },
          ],
        },
        right: {
          heading: 'Single quotes',
          tone: 'amber',
          rows: [
            { label: 'Variables', value: 'Printed as typed' },
            { label: '$($obj.Prop)', value: 'Printed as typed' },
            { label: 'Literal $', value: 'No escape needed' },
            { label: 'Use for', value: 'Fixed text, paths, regex' },
          ],
        },
        verdict: `When in doubt, use single quotes. Reach for double quotes when you truly want a variable inside.`,
      },
    ],
  },

  // ==========================================================================
  // 7-1 Filter left and Where-Object
  // ==========================================================================
  '7-1': {
    hook: `Two commands give the same answer, but one lets the source do the sorting and the other drags every object across the network before throwing most of them away. Which one, and why?`,
    mentalModel: `Imagine sorting mail. You can ask the post office to send only your letters (filter at the source), or let the whole truck arrive at your house and sort it on your table (Where-Object). Filter left means: let the source do the sorting whenever it can, and keep the table inspector for conditions the source cannot handle.`,
    misconceptions: [
      {
        myth: `Where-Object and -Filter are just two ways to write the same thing, so speed is the same.`,
        truth: `-Filter is applied by the provider, before objects are created and before they cross the network. Where-Object builds every object first, then throws most away.`,
        test: `Run: Measure-Command { Get-ChildItem $env:windir\\System32 -Filter *.dll | Out-Null } and compare with the same using Where-Object Name -like '*.dll'. The source filter is faster.`,
      },
      {
        myth: `-like 'Windows' finds anything containing the word Windows.`,
        truth: `-like needs wildcards. Without * it behaves like an equality test on the entire value.`,
        test: `Run: 'Windows Update' -like 'Windows' (False), then 'Windows Update' -like '*Windows*' (True).`,
      },
      {
        myth: `$_ is the whole list of objects, so I can ask for its count inside Where-Object.`,
        truth: `$_ (or $PSItem) is only the ONE current object that is passing the inspector. The scriptblock runs once for each object.`,
        test: `Run: 1..5 | Where-Object { $_ -gt 3 }. It returns 4 and 5, each tested alone.`,
      },
    ],
    workedExample: {
      goal: `Find running services that start automatically, first by filtering in the pipeline, then by filtering at the source.`,
      steps: [
        {
          think: `Get-Service can filter by name at the source. I narrow by name first and keep the list small.`,
          action: `Get-Service -Name 'Win*'`,
          result: `Only services whose name starts with Win.`,
        },
        {
          think: `Get-Service has no -Filter for status. I need Where-Object, and one condition can use the short syntax.`,
          action: `Get-Service -Name 'Win*' | Where-Object Status -eq 'Running'`,
          result: `Only the running ones from that shorter list.`,
        },
        {
          think: `Two conditions need the scriptblock form. $_ is the current service and -and joins the tests.`,
          action: `Get-Service -Name 'Win*' | Where-Object { $_.Status -eq 'Running' -and $_.StartType -eq 'Automatic' }`,
          result: `Running services that also start automatically.`,
        },
        {
          think: `Win32_Service supports a real -Filter. This filters at the source, before objects exist.`,
          action: `Get-CimInstance -ClassName Win32_Service -Filter "State='Running' AND StartMode='Auto'" | Select-Object -First 5 Name, State, StartMode`,
          result: `Five matching services, with State Running and StartMode Auto.`,
        },
        {
          think: `Finally I confirm that the counts agree, since both are valid views of the same system state.`,
          action: `(Get-CimInstance -ClassName Win32_Service -Filter "State='Running' AND StartMode='Auto'").Count`,
          result: `A number that is close to, but may differ from, the Get-Service count because I narrowed by name before.`,
        },
      ],
      takeaway: `Filter at the source if the cmdlet allows it. Use Where-Object for the remainder, and use the scriptblock form for compound conditions.`,
    },
    checkpoints: [
      {
        question: `Why does PowerShell write -gt instead of >?`,
        hint: `Think about what > already means in a command shell.`,
        answer: `In shells, > redirects output to a file. Using -gt, -lt, -eq avoids accidentally creating or overwriting files inside conditions.`,
      },
      {
        question: `What is the difference between -eq and -ceq?`,
        hint: `One letter in front.`,
        answer: `-eq ignores case ('A' -eq 'a' is True). -ceq is case-sensitive ('A' -ceq 'a' is False).`,
      },
      {
        question: `When must you use the { $_ } form instead of the short Where-Object Property -op Value syntax?`,
        hint: `Think about how many tests you are combining.`,
        answer: `When combining more than one condition with -and or -or, or when the test uses a calculation on $_.`,
      },
    ],
    challenge: {
      brief: `List the running processes whose working set is over 100 MB and whose name does NOT start with 'svchost'. Show only the Name and Id of the first five, using one pipeline with correct ordering.`,
      hints: [
        `Where-Object with two conditions needs the scriptblock form. You can combine the tests with -and.`,
        `PowerShell understands the MB unit: 100MB is 104857600. Use -gt with WorkingSet64. For the name, -notlike with a wildcard works.`,
        `Order the pipeline: filter first, then Select-Object -First 5 Name, Id. You can sort by WorkingSet64 before the select if you want the biggest.`,
      ],
      solution: `Get-Process | Where-Object { $_.WorkingSet64 -gt 100MB -and $_.Name -notlike 'svchost*' } | Sort-Object WorkingSet64 -Descending | Select-Object -First 5 Name, Id`,
      why: `Get-Process has no filter for memory, so Where-Object is the right tool. -notlike with a wildcard is the opposite of -like. Filtering comes before sorting and selecting, so the result is correct.`,
    },
    teachBack: `Explain to a friend who sorts mail at home why you ask the post office to filter first, and what $_ means when Where-Object checks each letter on the conveyor belt.`,
    diagrams: [
      {
        kind: 'compare',
        title: 'Filter left or filter right',
        caption: `Where the filtering happens decides how much data moves and how many objects get built.`,
        left: {
          heading: 'Filter left (-Filter)',
          tone: 'green',
          rows: [
            { label: 'Who filters', value: 'The source or provider' },
            { label: 'Objects built', value: 'Only the matches' },
            { label: 'Network', value: 'Small result over the wire' },
            { label: 'Syntax', value: "Provider text: \"State='Running'\"" },
          ],
        },
        right: {
          heading: 'Filter right (Where-Object)',
          tone: 'amber',
          rows: [
            { label: 'Who filters', value: 'PowerShell, in the pipeline' },
            { label: 'Objects built', value: 'Every object, then discarded' },
            { label: 'Network', value: 'Everything crosses the wire' },
            { label: 'Syntax', value: 'PowerShell: { $_.State -eq ... }' },
          ],
        },
        verdict: `Use -Filter when it exists. Use Where-Object for the tests the source cannot do.`,
      },
      {
        kind: 'compare',
        title: 'The funnel (illustrative numbers)',
        caption: `Same question, 100,000 rows at the source, 3 rows wanted. All counts here are illustrative, invented to show the shape of the funnel. Measure your own data with Measure-Command and .Count.`,
        left: {
          heading: 'Filter left (-Filter)',
          tone: 'green',
          rows: [
            { label: 'Rows at the source', value: '100,000 (illustrative)' },
            { label: 'Rows that travel', value: '400 (illustrative)' },
            { label: 'Where-Object receives', value: '400, keeps 3 (illustrative)' },
            { label: 'Objects built', value: 'About 400' },
          ],
        },
        right: {
          heading: 'Filter right only',
          tone: 'red',
          rows: [
            { label: 'Rows at the source', value: '100,000 (illustrative)' },
            { label: 'Rows that travel', value: '100,000 (illustrative)' },
            { label: 'Where-Object receives', value: '100,000, keeps 3 (illustrative)' },
            { label: 'Objects built', value: 'About 100,000' },
          ],
        },
        verdict: `Both funnels end with the same 3 rows. The difference is how many rows were moved and turned into objects on the way, which is where the time goes.`,
      },
      {
        kind: 'tree',
        title: 'Operator families',
        caption: `Every operator starts with a hyphen. They sort into four families, so you can pick the right one quickly.`,
        root: {
          label: 'Operators',
          sub: 'Hyphen style',
          detail: `PowerShell avoids > and = in conditions because shells use them for redirection and assignment.`,
          tone: 'blue',
          children: [
            {
              label: 'Compare',
              sub: '-eq -ne -gt -ge -lt -le',
              detail: `Test equality or order. Add a c in front (-ceq) for case-sensitive, or an i for explicit case-insensitive.`,
              tone: 'green',
            },
            {
              label: 'Text patterns',
              sub: '-like -match',
              detail: `-like uses * wildcards. -match uses regular expressions. -notlike and -notmatch are the opposites.`,
              tone: 'cyan',
            },
            {
              label: 'Collections',
              sub: '-in -contains',
              detail: `Check membership. $x -in $list reads item first, while $list -contains $x reads list first.`,
              tone: 'amber',
            },
            {
              label: 'Logic',
              sub: '-and -or -not -xor',
              detail: `Combine tests. Use parentheses to make the grouping clear when you mix and and or.`,
              tone: 'violet',
            },
          ],
        },
      },
    ],
  },

  // ==========================================================================
  // 7-2 Select, sort, safety
  // ==========================================================================
  '7-2': {
    hook: `You ask for the three biggest memory users and the answer comes back with three tiny processes. The command ran with no error. What did the pipeline quietly do wrong?`,
    mentalModel: `A pipeline is an assembly line where every station decides what continues. Sort lines up all the products by size, and Select -First takes the first few off the line. If you take the first three BEFORE sorting, you simply kept whatever arrived first. And -WhatIf is a rehearsal: the actors walk through the show, but the curtain never rises.`,
    misconceptions: [
      {
        myth: `The order of Sort-Object and Select-Object -First does not matter, as long as both are there.`,
        truth: `Select -First 3 before Sort keeps the first three in default order, then sorts only those three. Sort first, then slice.`,
        test: `Run both: Get-Process | Select-Object -First 3 | Sort-Object WorkingSet64 -Descending versus Get-Process | Sort-Object WorkingSet64 -Descending | Select-Object -First 3.`,
      },
      {
        myth: `-WhatIf works on every cmdlet, and it runs the command then rolls it back.`,
        truth: `It runs nothing. It only prints what would happen, and only for cmdlets that support ShouldProcess (the ones that change something).`,
        test: `Run: (Get-Command Get-Process).Parameters.ContainsKey('WhatIf') (False) and (Get-Command Stop-Process).Parameters.ContainsKey('WhatIf') (True).`,
      },
      {
        myth: `Select-Object -Property Status gives me the plain value Running.`,
        truth: `It returns a small object that still has a Status property. -ExpandProperty strips the wrapper and gives the raw value.`,
        test: `Run: (Get-Service Spooler | Select-Object -Property Status).GetType().Name then (Get-Service Spooler | Select-Object -ExpandProperty Status).GetType().Name.`,
      },
    ],
    workedExample: {
      goal: `Find the three biggest memory users the right way, get plain values out, and rehearse a dangerous command safely.`,
      steps: [
        {
          think: `Sort everything first, then slice. That ordering guarantees the top three are truly the biggest.`,
          action: `Get-Process | Sort-Object WorkingSet64 -Descending | Select-Object -First 3 Name, Id, WorkingSet64`,
          result: `Three processes with the largest WorkingSet64 values.`,
        },
        {
          think: `For contrast, I try the reverse order to see the silent mistake with my own eyes.`,
          action: `Get-Process | Select-Object -First 3 Name, Id, WorkingSet64 | Sort-Object WorkingSet64 -Descending`,
          result: `Three processes that happened to be first in the list, sorted among themselves. Usually small ones.`,
        },
        {
          think: `If I want only the names as plain text for another command, I expand the property.`,
          action: `Get-Process | Sort-Object WorkingSet64 -Descending | Select-Object -First 3 -ExpandProperty Name`,
          result: `Three plain process names, with no column header or object wrapper.`,
        },
        {
          think: `Before stopping anything I rehearse with -WhatIf. The target may not exist, so I quiet the lookup.`,
          action: `Get-Process -Name notepad -ErrorAction SilentlyContinue | Stop-Process -WhatIf`,
          result: `If Notepad is running: What if: Performing the operation "Stop-Process" on target "notepad (ID)". Nothing is stopped.`,
        },
        {
          think: `I verify that the cmdlet really supports the switch rather than assuming.`,
          action: `(Get-Command Stop-Process).Parameters.Keys -contains 'WhatIf'`,
          result: `True.`,
        },
      ],
      takeaway: `Filter, then Sort, then Select. And rehearse with -WhatIf before any Stop, Remove or Set command touches a real system.`,
    },
    checkpoints: [
      {
        question: `Write the correct pipeline order for: the 5 largest files in a folder, as a list of names.`,
        hint: `Source, filter, sort, slice, output.`,
        answer: `Get-ChildItem -File | Sort-Object Length -Descending | Select-Object -First 5 -ExpandProperty Name`,
      },
      {
        question: `What is the difference between -WhatIf and -Confirm?`,
        hint: `One simulates, the other asks.`,
        answer: `-WhatIf prints what would happen and does nothing. -Confirm really runs but asks yes or no before each change.`,
      },
      {
        question: `How can you tell from Get-Help whether a cmdlet supports -WhatIf?`,
        hint: `Look at the SYNTAX block.`,
        answer: `If the syntax lists [-WhatIf] and [-Confirm], the cmdlet supports them. Cmdlets that only read data usually do not.`,
      },
    ],
    challenge: {
      brief: `Write a pipeline that safely previews stopping only the first two running services in alphabetical DisplayName order. Nothing may actually stop.`,
      hints: [
        `Filter to running services first with Where-Object, then sort by DisplayName.`,
        `Take the first two with Select-Object -First 2 after the sort.`,
        `Finish with Stop-Service and the -WhatIf switch, so it only prints what would happen.`,
      ],
      solution: `Get-Service | Where-Object Status -eq 'Running' | Sort-Object DisplayName | Select-Object -First 2 | Stop-Service -WhatIf`,
      why: `Filter, sort, slice, then act. The Select-Object output still carries the service objects, so Stop-Service binds them by value. -WhatIf makes PowerShell report the two stops without performing them.`,
    },
    teachBack: `Explain to a friend who sorts a deck of cards why you must sort the whole deck before you take the top three, and why a rehearsal switch like -WhatIf is worth typing every time.`,
    diagrams: [
      {
        kind: 'compare',
        title: 'Same commands, different answer',
        caption: `The commands are identical. Only the order changes, and the answer is no longer the one you asked for.`,
        left: {
          heading: 'Select first, then sort',
          tone: 'red',
          rows: [
            { label: 'Step 1', value: 'Take first 3 in default order' },
            { label: 'Step 2', value: 'Sort only those 3' },
            { label: 'Result', value: 'Random small processes' },
            { label: 'Errors shown', value: 'None, silently wrong' },
          ],
        },
        right: {
          heading: 'Sort first, then select',
          tone: 'green',
          rows: [
            { label: 'Step 1', value: 'Sort all processes by memory' },
            { label: 'Step 2', value: 'Take the first 3' },
            { label: 'Result', value: 'The true top 3' },
            { label: 'Errors shown', value: 'None, and correct' },
          ],
        },
        verdict: `Slice last. Anything that needs to see every object (sorting, grouping) must run before you cut the list down.`,
      },
      {
        kind: 'sequence',
        title: 'What -WhatIf really does',
        caption: `The cmdlet asks PowerShell for permission before every change. With -WhatIf, the answer is always "just describe it".`,
        actors: [
          { name: 'You', sub: 'at the prompt', tone: 'blue' },
          { name: 'Stop-Process', sub: 'the cmdlet', tone: 'amber' },
          { name: 'PowerShell engine', sub: 'ShouldProcess check', tone: 'violet' },
          { name: 'Real process', sub: 'untouched', tone: 'green' },
        ],
        messages: [
          { from: 0, to: 1, label: 'Stop-Process -WhatIf', detail: `You hand the cmdlet its target and the dry-run switch.` },
          { from: 1, to: 2, label: 'May I stop this target?', detail: `Cmdlets that change things ask the engine before acting. This question is called ShouldProcess.` },
          { from: 2, to: 1, label: 'Describe only', detail: `With -WhatIf the engine answers that the action should be reported, not performed.` },
          { from: 1, to: 0, label: 'What if: ... on target', detail: `You see the exact operation and target it would have used. Nothing happened.` },
          { from: 1, to: 3, label: 'No call is made', detail: `The real process is never contacted, so it keeps running.` },
        ],
      },
    ],
  },
};
