import { LessonGuide } from '../../types';

export const GUIDES_PART_4: Record<string, LessonGuide> = {
  '10-1': {
    oneSentence:
      'A script is just saved commands in a .ps1 file, and Execution Policy is a seatbelt (RemoteSigned) that stops unknown scripts, not a firewall.',
    analogy:
      'A script is a recipe card. Instead of cooking from memory every night, you write the steps once and reuse the card forever. The Execution Policy is the kitchen rule that says "only cook from cards I trust". It is a seatbelt that stops accidents, not a locked door that stops a determined burglar. And typing `.\\` in front of a script name is like pointing at the exact card on your own counter instead of shouting a name and hoping the right one shows up.',
    plainEnglish: [
      'A `.ps1` file is just a plain text file full of PowerShell commands. Anything you can type at the prompt can be saved in a file and replayed a thousand times.',
      'PowerShell does not look in the current folder when you type a bare name like `script.ps1`; it only searches the folders in your PATH. To run a script that sits in the current folder you write `.\\script.ps1`, where `.\\` means "this folder". It is a small safety habit that stops a lookalike file in your working folder from being run by accident.',
      'Execution Policy is a safety setting that decides which scripts may run (for example only signed ones or only ones from your own machine). It is not a security boundary (anyone can bypass it from the command line), so never rely on it alone.',
    ],
    beforeYouStart: [
      'Windows PowerShell 5.1 or PowerShell 7 (a lab virtual machine is perfect for practice).',
      'A plain-text editor such as Notepad or Visual Studio Code. Avoid Word, it adds hidden formatting.',
      'A normal (non-elevated) PowerShell window. You will not need Administrator for this lesson.',
    ],
    atoZSteps: [
      {
        title: 'Step 1: Check the current policy',
        detail:
          'Run `Get-ExecutionPolicy -List`. Windows client usually shows `Restricted` (no scripts) and Windows Server shows `RemoteSigned`.',
      },
      {
        title: 'Step 2: Make a safe home for your scripts',
        detail:
          'Create a folder such as `C:\\Scripts` and move into it with `Set-Location`. Keeping scripts in one folder makes `.\\` easy to use.',
      },
      {
        title: 'Step 3: Write your first script',
        detail:
          'Save a text file called `hello.ps1` that contains one line: `Write-Output "Hello from PowerShell"`. The `.ps1` ending tells Windows it is a PowerShell script.',
      },
      {
        title: 'Step 4: Try to run it and read the error',
        detail:
          'Type `hello.ps1` and press Enter. PowerShell says the term is "not recognized" and hints at `.\\hello.ps1`, because it does not search the current folder. Now type `.\\hello.ps1`. On a Windows client you will probably see a different error: "running scripts is disabled on this system". That is the Execution Policy (`Restricted`) doing its job, and Step 5 fixes it.',
      },
      {
        title: 'Step 5: Loosen the seatbelt for yourself only',
        detail:
          'Run `Set-ExecutionPolicy RemoteSigned -Scope CurrentUser`. `RemoteSigned` allows your own scripts but demands a signature on downloaded ones. `-Scope CurrentUser` changes nothing for other people. To undo it later, run `Set-ExecutionPolicy Undefined -Scope CurrentUser`. If `Get-ExecutionPolicy -List` shows a value in `MachinePolicy` or `UserPolicy`, Group Policy controls it and your change will not win.',
      },
      {
        title: 'Step 6: Run it properly',
        detail: 'Type `.\\hello.ps1`. You should see your greeting. You have now written and run a real script.',
      },
      {
        title: 'Step 7: Treat downloaded scripts with suspicion',
        detail:
          'Open and read any script you download before running it. Windows marks internet downloads with a hidden "Zone" tag, and `Unblock-File` removes it only after you have checked the code.',
      },
    ],
    wordsYouWillMeet: [
      { word: '.ps1', meaning: 'The file extension for a PowerShell script.' },
      { word: 'Execution Policy', meaning: 'A safety setting that decides which scripts are allowed to run. It is a seatbelt, not a firewall.' },
      { word: 'RemoteSigned', meaning: 'Local scripts run freely, but scripts from the internet must carry a trusted digital signature.' },
      { word: 'Scope', meaning: 'Who a setting applies to: Process (this window), CurrentUser, or LocalMachine (everyone).' },
      { word: 'Mark of the Web', meaning: 'A hidden tag Windows puts on downloaded files so PowerShell knows they came from outside.' },
    ],
    beginner: {
      intro:
        'These commands only look at settings and files. Nothing here changes your computer, so run them freely.',
      commands: [
        {
          title: 'See every execution policy layer',
          code: 'Get-ExecutionPolicy -List',
          whatItDoes: 'Shows the policy at every scope. The first line that is not Undefined wins.',
          parts: [
            { part: 'Get-ExecutionPolicy', meaning: 'The cmdlet that reads the current policy. "Get" means read-only.' },
            { part: '-List', meaning: 'A switch that shows all scopes instead of just the winning one.' },
          ],
          sampleOutput:
            '        Scope ExecutionPolicy\n        ----- ---------------\nMachinePolicy       Undefined\n   UserPolicy       Undefined\n      Process       Undefined\n  CurrentUser       Undefined\n LocalMachine      Restricted',
          watchOut: 'MachinePolicy and UserPolicy come from Group Policy and beat everything else.',
        },
        {
          title: 'Find scripts in the current folder',
          code: 'Get-ChildItem -Path . -Filter *.ps1',
          whatItDoes: 'Lists every PowerShell script in the folder you are standing in.',
          parts: [
            { part: 'Get-ChildItem', meaning: 'Lists files and folders (the same idea as dir or ls).' },
            { part: '-Path .', meaning: 'The dot means "this folder".' },
            { part: '-Filter *.ps1', meaning: 'Only show names ending in .ps1. The star means "anything".' },
          ],
          sampleOutput: '    Directory: C:\\Scripts\n\nMode   LastWriteTime        Length Name\n----   -------------        ------ ----\n-a---  04/11/2026 09:12         38 hello.ps1',
        },
        {
          title: 'Read a script without running it',
          code: 'Get-Content -Path .\\hello.ps1',
          whatItDoes: 'Prints the text inside a script so you can check what it will do before you ever run it.',
          parts: [
            { part: 'Get-Content', meaning: 'Reads a text file and prints its lines.' },
            { part: '-Path', meaning: 'Says which file to read.' },
            { part: '.\\hello.ps1', meaning: 'The `.\\` means "in this folder", then the file name.' },
          ],
          sampleOutput: 'Write-Output "Hello from PowerShell"',
          watchOut: 'Reading a script is always safe. Running an unknown script is not, so read first.',
        },
      ],
    },
    intermediate: {
      intro:
        'Now you will create and run a script, and change the policy the careful way. Use a lab virtual machine for the settings change.',
      commands: [
        {
          title: 'Preview a policy change before making it',
          code: 'Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser -WhatIf',
          whatItDoes: 'Pretends to change your policy and tells you what would happen. Nothing is actually changed.',
          parts: [
            { part: 'Set-ExecutionPolicy', meaning: 'The cmdlet that changes the policy. "Set" means it can modify things.' },
            { part: '-ExecutionPolicy RemoteSigned', meaning: 'The policy you want: local scripts run, downloaded ones need a signature.' },
            { part: '-Scope CurrentUser', meaning: 'Applies only to you, not the whole machine.' },
            { part: '-WhatIf', meaning: 'A safety switch that shows the plan without doing it.' },
          ],
          sampleOutput: 'What if: Performing the operation "Set-ExecutionPolicy" on target "Policy: RemoteSigned".',
          watchOut: 'Remove -WhatIf to apply it. Never choose Unrestricted on a real server.',
        },
        {
          title: 'Create a script from the prompt and run it',
          code: 'Set-Content -Path .\\disk-report.ps1 -Value \'Get-PSDrive -PSProvider FileSystem | Select-Object Name, Used, Free\'\n.\\disk-report.ps1',
          whatItDoes: 'Writes a one-line script into a file, then runs it using the required `.\\` prefix.',
          parts: [
            { part: 'Set-Content', meaning: 'Writes text into a file, creating it if needed.' },
            { part: '-Value \'...\'', meaning: 'The text to save. Single quotes keep it exactly as typed.' },
            { part: 'Get-PSDrive -PSProvider FileSystem', meaning: 'Lists your drives (C:, D: and so on).' },
            { part: '|', meaning: 'The pipe. It passes the drives to the next command.' },
            { part: 'Select-Object Name, Used, Free', meaning: 'Keeps only the three columns you care about.' },
            { part: '.\\disk-report.ps1', meaning: 'Runs the script from the current folder.' },
          ],
          watchOut: 'This creates a file in your current folder. If the file already exists it is overwritten.',
        },
        {
          title: 'Give a script an input and a requirement',
          code: '#Requires -Version 5.1\nparam([string]$Name = "World")\n"Hello, $Name!"',
          whatItDoes: 'A tiny script (save it as greet.ps1) that needs PowerShell 5.1+, accepts a `-Name` input and greets that name. Run it as `.\\greet.ps1 -Name Sam`.',
          parts: [
            { part: '#Requires -Version 5.1', meaning: 'A special comment that stops the script early on a too-old PowerShell.' },
            { part: 'param(...)', meaning: 'Declares inputs the script accepts, like options on a cmdlet.' },
            { part: '[string]$Name = "World"', meaning: 'A text variable called Name. If you pass nothing it defaults to World.' },
            { part: '"Hello, $Name!"', meaning: 'Double quotes expand the variable inside the text.' },
          ],
          sampleOutput: 'Hello, Sam!',
        },
      ],
    },
    pro: {
      intro:
        'Professionals sign scripts, validate inputs, fail loudly and audit where files came from. Lab only: test changes on a virtual machine first.',
      commands: [
        {
          title: 'Check whether scripts are signed and trusted',
          code: 'Get-ChildItem -Path .\\*.ps1 | Get-AuthenticodeSignature | Select-Object Path, Status, SignerCertificate',
          whatItDoes: 'Checks the digital signature of each script. `Valid` means signed by a trusted publisher and unchanged.',
          parts: [
            { part: 'Get-ChildItem -Path .\\*.ps1', meaning: 'Finds every script in this folder.' },
            { part: 'Get-AuthenticodeSignature', meaning: 'Reads the signature of each file it receives.' },
            { part: 'Select-Object Path, Status, SignerCertificate', meaning: 'Keeps the file, its signature status and who signed it.' },
          ],
          sampleOutput: 'Path                       Status SignerCertificate\n----                       ------ -----------------\nC:\\Scripts\\hello.ps1   NotSigned',
          watchOut: 'Under AllSigned policy a NotSigned script will refuse to run.',
        },
        {
          title: 'A hardened script skeleton',
          code: '#Requires -Version 5.1\n[CmdletBinding(SupportsShouldProcess)]\nparam([Parameter(Mandatory)][ValidateScript({ Test-Path $_ })][string]$Path)\nSet-StrictMode -Version Latest\n$ErrorActionPreference = "Stop"\ntry {\n    Get-ChildItem -Path $Path | Measure-Object -Property Length -Sum\n} catch {\n    Write-Error "Failed on $Path : $($_.Exception.Message)"\n}',
          whatItDoes: 'A reusable template: demands a valid path, catches typos in variables, stops on errors and reports a clean message.',
          parts: [
            { part: '[CmdletBinding(SupportsShouldProcess)]', meaning: 'Gives your script built-in -Verbose and -WhatIf support.' },
            { part: '[Parameter(Mandatory)]', meaning: 'PowerShell asks for the value if the user forgets it.' },
            { part: '[ValidateScript({ Test-Path $_ })]', meaning: 'Rejects a path that does not exist before the script body runs.' },
            { part: 'Set-StrictMode -Version Latest', meaning: 'Turns typos like using an undefined variable into errors.' },
            { part: '$ErrorActionPreference = "Stop"', meaning: 'Makes every error stop and jump into the catch block.' },
            { part: 'try { } catch { }', meaning: 'Runs the risky part and handles any failure neatly.' },
          ],
          watchOut: 'Without "Stop", many errors are non-terminating and catch never fires.',
        },
        {
          title: 'Audit downloaded files and unblock after review',
          code: 'Get-ChildItem -Path .\\*.ps1 | Where-Object { Get-Item $_.FullName -Stream Zone.Identifier -ErrorAction SilentlyContinue }\nUnblock-File -Path .\\downloaded.ps1 -WhatIf',
          whatItDoes: 'Finds scripts that carry the hidden internet "Zone" tag, then previews unblocking one you have already read.',
          parts: [
            { part: 'Where-Object { ... }', meaning: 'Keeps only items for which the code inside returns something.' },
            { part: 'Get-Item -Stream Zone.Identifier', meaning: 'Looks for the hidden NTFS stream that marks a file as downloaded.' },
            { part: '-ErrorAction SilentlyContinue', meaning: 'Hides the error for files that have no tag.' },
            { part: 'Unblock-File -WhatIf', meaning: 'Would remove the tag; -WhatIf only previews it.' },
          ],
          watchOut: 'Unblock only after you have read the code. `-ExecutionPolicy Bypass` is a convenience, not a defence, because anyone can type it.',
        },
      ],
    },
    recap: [
      'A `.ps1` file is just saved commands. Read it with Get-Content before you run it.',
      'Run scripts in the current folder with `.\\name.ps1`; a bare name is only searched in PATH, so `.\\` makes the location explicit.',
      'Execution Policy is a seatbelt against accidents. Use `RemoteSigned` with `-Scope CurrentUser` and never rely on it as security.',
      'Pros add `param`, validation, StrictMode, try/catch and signatures to every script.',
    ],
  },

  '10-2': {
    oneSentence:
      'Every program is three building blocks: sequence (top to bottom), selection (if and else), and iteration (for, while, foreach) to repeat work.',
    analogy:
      'Control structures are like the rules of a board game turn. Sequence means "do the steps in order". Selection (`if`) is "if you land on a red square, draw a card, otherwise move on". Loops are "do this for each player at the table". Every script ever written is just these three ideas stacked together.',
    plainEnglish: [
      'Sequence means PowerShell runs lines from top to bottom. Selection means choosing a path with `if / elseif / else`. Iteration means repeating work with `foreach`, `for` or `while`.',
      'The most useful loop for admins is `foreach ($item in $collection)`. It takes a list (servers, files, users) and runs the same block once for every item.',
      'Inside text in double quotes, write `$($obj.Property)` to print a property. Plain `$obj.Property` inside quotes would only expand the variable, not the property.',
    ],
    beforeYouStart: [
      'You know how to open PowerShell and run a command.',
      'You understand variables like `$name = "web01"`.',
      'Everything in the beginner and intermediate tiers is safe to run on any computer.',
    ],
    atoZSteps: [
      {
        title: 'Step 1: Practise Sequence',
        detail: 'Type three lines in a row, such as `$a = 1`, `$a = $a + 1`, `$a`. They run top to bottom and the result is 2.',
      },
      {
        title: 'Step 2: Make a decision with if',
        detail: 'Write `if ($a -gt 1) { "bigger" } else { "not bigger" }`. The condition goes in round brackets, the action in curly braces.',
      },
      {
        title: 'Step 3: Learn the comparison words',
        detail: 'PowerShell uses `-eq`, `-ne`, `-gt`, `-lt`, `-ge`, `-le` instead of `==` or `>`. Memorise them, they are everywhere.',
      },
      {
        title: 'Step 4: Loop over a list',
        detail: 'Use `foreach ($n in "web01","web02") { "Checking $n" }`. The loop variable `$n` holds one item per turn.',
      },
      {
        title: 'Step 5: Count with for',
        detail: 'Use `for ($i = 1; $i -le 3; $i++) { $i }` when you need a counter. It has three parts: start, keep-going test, step.',
      },
      {
        title: 'Step 6: Wait with while',
        detail: 'Use `while (condition) { ... }` to repeat until something changes, such as a service reaching Running. Always make sure the condition can become false.',
      },
      {
        title: 'Step 7: Print properties properly',
        detail: 'Inside quotes use `"$($proc.Id)"`. The extra `$( )` is a subexpression and makes PowerShell evaluate the property.',
      },
    ],
    wordsYouWillMeet: [
      { word: 'Sequence', meaning: 'Running lines in order from top to bottom.' },
      { word: 'Selection', meaning: 'Choosing what to do with if, elseif, else or switch.' },
      { word: 'Iteration', meaning: 'Repeating work, also called looping.' },
      { word: 'Subexpression', meaning: 'The `$( )` wrapper that evaluates code inside a quoted string.' },
      { word: 'Collection', meaning: 'A group of items such as an array of server names.' },
      { word: '$_', meaning: 'The "current item" inside ForEach-Object and Where-Object script blocks.' },
    ],
    beginner: {
      intro: 'These examples only print text on screen. They cannot change your system, so experiment freely.',
      commands: [
        {
          title: 'Make a simple decision',
          code: '$n = 5\nif ($n -gt 3) { "big" } else { "small" }',
          whatItDoes: 'Stores 5 in a variable and prints "big" because 5 is greater than 3.',
          parts: [
            { part: '$n = 5', meaning: 'Creates a variable named n holding the number 5.' },
            { part: 'if ( ... )', meaning: 'Tests a condition that is either true or false.' },
            { part: '-gt', meaning: 'Means "greater than".' },
            { part: '{ } else { }', meaning: 'The first block runs when true, the else block when false.' },
          ],
          sampleOutput: 'big',
        },
        {
          title: 'Loop over a list',
          code: 'foreach ($name in "web01","web02","web03") { "Checking $name" }',
          whatItDoes: 'Repeats one message once for each server name in the list.',
          parts: [
            { part: 'foreach', meaning: 'The loop keyword: "for each item in this list".' },
            { part: '$name in "web01","web02","web03"', meaning: 'Each turn, $name holds the next item from a comma-separated list.' },
            { part: '{ "Checking $name" }', meaning: 'The block that runs every turn. The variable inside quotes is replaced by its value.' },
          ],
          sampleOutput: 'Checking web01\nChecking web02\nChecking web03',
        },
        {
          title: 'Count with a for loop',
          code: 'for ($i = 1; $i -le 3; $i++) { "Round $i" }',
          whatItDoes: 'Counts from 1 to 3 and prints a message each time.',
          parts: [
            { part: '$i = 1', meaning: 'The starting value of the counter.' },
            { part: '$i -le 3', meaning: 'Keep looping while i is less than or equal to 3.' },
            { part: '$i++', meaning: 'Add 1 to i after every turn.' },
          ],
          sampleOutput: 'Round 1\nRound 2\nRound 3',
          watchOut: 'If you forget `$i++` the loop never ends. Press Ctrl+C to stop it.',
        },
      ],
    },
    intermediate: {
      intro: 'Now you will loop over real objects (services, connections) and read their properties. Everything here is read-only.',
      commands: [
        {
          title: 'Loop over real services',
          code: 'foreach ($svc in (Get-Service | Where-Object Status -eq "Running" | Select-Object -First 3)) {\n    "Service $($svc.Name) is $($svc.Status)"\n}',
          whatItDoes: 'Takes three running services and prints one friendly sentence for each.',
          parts: [
            { part: '(Get-Service | Where-Object ... | Select-Object -First 3)', meaning: 'Builds the list: all services, filtered to Running, trimmed to three.' },
            { part: 'Where-Object Status -eq "Running"', meaning: 'Keeps only objects whose Status property equals Running.' },
            { part: '$($svc.Name)', meaning: 'A subexpression that prints the Name property inside the quotes.' },
          ],
          sampleOutput: 'Service Appinfo is Running\nService AudioEndpointBuilder is Running\nService Audiosrv is Running',
        },
        {
          title: 'If / elseif / else with a ping check',
          code: '$ok = Test-Connection -ComputerName localhost -Count 1 -Quiet\nif ($ok) { "Reachable" } elseif ((Get-Date).Hour -lt 6) { "Down at night - log it" } else { "Down - raise an alert" }',
          whatItDoes: 'Pings the local machine once and prints a message depending on the true/false result.',
          parts: [
            { part: 'Test-Connection', meaning: 'PowerShell\'s ping-style cmdlet. (`ping` itself is a separate program, ping.exe, not an alias of this cmdlet.) The target parameter is `-ComputerName` on Windows PowerShell 5.1; PowerShell 7 calls it `-TargetName` but still accepts `-ComputerName`.' },
            { part: '-Count 1', meaning: 'Send only one ping.' },
            { part: '-Quiet', meaning: 'Return only True or False instead of a full report.' },
            { part: 'if / elseif / else', meaning: 'Checks conditions in order and runs the first block that is true.' },
            { part: '(Get-Date).Hour -lt 6', meaning: 'A second test: is the current hour before 6 AM? It only runs if the first test was false.' },
          ],
          sampleOutput: 'Reachable',
        },
        {
          title: 'Wait in a while loop',
          code: '$tries = 0\nwhile ($tries -lt 3) {\n    $tries++\n    "Attempt $tries"\n    Start-Sleep -Seconds 1\n}',
          whatItDoes: 'Repeats three times with a one-second pause, the same pattern used to wait for a service or file.',
          parts: [
            { part: 'while ($tries -lt 3)', meaning: 'Tests first, then runs the block while tries is less than 3.' },
            { part: '$tries++', meaning: 'Adds 1 so the condition eventually becomes false.' },
            { part: 'Start-Sleep -Seconds 1', meaning: 'Pauses the script for one second.' },
          ],
          sampleOutput: 'Attempt 1\nAttempt 2\nAttempt 3',
          watchOut: 'Always give a while loop an exit (a counter or timeout) or it can run forever.',
        },
      ],
    },
    pro: {
      intro: 'Pros combine loops with error handling and safety switches so a failure on one item never ruins the whole run. Lab VM only for the last command.',
      commands: [
        {
          title: 'Switch with ranges and wildcards',
          code: '$free = 12\nswitch ($free) {\n    { $_ -lt 10 } { "Critical"; break }\n    { $_ -lt 20 } { "Warning"; break }\n    default       { "OK" }\n}',
          whatItDoes: 'Picks one label from several ranges. Cleaner than a long chain of elseif.',
          parts: [
            { part: 'switch ($free)', meaning: 'Compares the value against each case in the block.' },
            { part: '{ $_ -lt 10 }', meaning: 'A script-block case; $_ is the value being tested.' },
            { part: 'break', meaning: 'Stops after the first match so later cases are skipped.' },
            { part: 'default', meaning: 'Runs when nothing else matched.' },
          ],
          sampleOutput: 'Warning',
          watchOut: 'Without `break`, switch keeps testing and may print more than one result.',
        },
        {
          title: 'Resilient loop that collects results',
          code: '$results = foreach ($c in "localhost","bad-host") {\n    try {\n        $r = Test-Connection -ComputerName $c -Count 1 -ErrorAction Stop\n        [pscustomobject]@{ Computer = $c; Status = "Up" }\n    } catch {\n        [pscustomobject]@{ Computer = $c; Status = "Down" }\n    }\n}\n$results',
          whatItDoes: 'Checks each computer, never crashes on a bad one, and builds a tidy table of results.',
          parts: [
            { part: '$results = foreach (...) { }', meaning: 'Everything the loop outputs is collected into $results.' },
            { part: '-ErrorAction Stop', meaning: 'Turns an error into one that catch can handle.' },
            { part: 'try { } catch { }', meaning: 'Handles a failure and lets the loop continue.' },
            { part: '[pscustomobject]@{ ... }', meaning: 'Builds a custom object with named columns.' },
          ],
          sampleOutput: 'Computer  Status\n--------  ------\nlocalhost Up\nbad-host  Down',
        },
        {
          title: 'Bulk change with a safety preview',
          code: 'foreach ($s in "Spooler","Fax") {\n    Stop-Service -Name $s -WhatIf\n}',
          whatItDoes: 'Shows what would happen if each service in the list were stopped, without stopping anything.',
          parts: [
            { part: 'foreach ($s in ...)', meaning: 'Repeats the action for each service name.' },
            { part: 'Stop-Service -Name $s', meaning: 'Stops the named service. This changes the system.' },
            { part: '-WhatIf', meaning: 'Preview only. Nothing is stopped.' },
          ],
          sampleOutput: 'What if: Performing the operation "Stop-Service" on target "Print Spooler (Spooler)".',
          watchOut: 'Lab VM only. Remove -WhatIf only when you are sure. Looping a destructive command over many items multiplies mistakes.',
        },
      ],
    },
    recap: [
      'Every script is Sequence, Selection (`if/elseif/else`) and Iteration (`foreach`, `for`, `while`).',
      'Use comparison operators like `-eq`, `-gt`, `-lt` instead of symbols.',
      'Write `"$($obj.Property)"` to print a property inside quotes.',
      'Wrap risky loop bodies in try/catch and use -WhatIf before bulk changes.',
    ],
  },

  '11-1': {
    oneSentence:
      'A module is a pack of cmdlets you must first find, install, and import, and installed is not the same as imported.',
    analogy:
      'A module is a toolbox you add to your workshop. The PowerShell Gallery is the hardware store. To use a new tool you find it in the catalogue, buy and carry it home (install), then take it out of the cupboard and put it on the workbench (import). Having a toolbox in the garage does not mean it is open on your bench.',
    plainEnglish: [
      'PowerShell comes with core cmdlets. To manage other things (Active Directory, Azure, VMware, Microsoft 365) you add a module, which is a bundle of extra cmdlets.',
      'There are two separate steps: Installed (the files are on disk) and Imported (loaded into your current window). Modern PowerShell often auto-imports, but when that fails you do it yourself.',
      'The PowerShell Gallery is a public store anyone can publish to. Treat downloads like any software: check the publisher, and prefer installing for the current user in a lab first.',
    ],
    beforeYouStart: [
      'PowerShell 5.1 or 7 with internet access (for the Gallery steps).',
      'Optional: a lab VM. Installing a module is low-risk but still adds code to your machine.',
      'Tip: for Install-Module you may be asked to install the NuGet provider. Say Yes.',
    ],
    atoZSteps: [
      {
        title: 'Step 1: See what you already have',
        detail: 'Run `Get-Module -ListAvailable`. This lists every module installed on disk, loaded or not.',
      },
      {
        title: 'Step 2: Find a module',
        detail: 'Run `Find-Module -Name Pester`. This searches the online Gallery without installing anything.',
      },
      {
        title: 'Step 3: Install it',
        detail: 'Run `Install-Module -Name Pester -Scope CurrentUser`. CurrentUser needs no Administrator rights and affects only you.',
      },
      {
        title: 'Step 4: Confirm it is on disk',
        detail: 'Run `Get-Module -ListAvailable -Name Pester`. If you see it, the install worked.',
      },
      {
        title: 'Step 5: Import it',
        detail: 'Run `Import-Module Pester`. Now it is loaded into this window and `Get-Module` will show it.',
      },
      {
        title: 'Step 6: Discover its commands',
        detail: 'Run `Get-Command -Module Pester` to list every cmdlet the module added.',
      },
      {
        title: 'Step 7: Keep it tidy',
        detail: 'Use `Update-Module` to upgrade and `Uninstall-Module` to remove modules you no longer need.',
      },
    ],
    wordsYouWillMeet: [
      { word: 'Module', meaning: 'A package of related cmdlets, functions and help.' },
      { word: 'PowerShell Gallery', meaning: 'The official online store for PowerShell modules and scripts.' },
      { word: 'Installed', meaning: 'The module files are saved on your computer.' },
      { word: 'Imported', meaning: 'The module is loaded into your current PowerShell session.' },
      { word: 'PSModulePath', meaning: 'The list of folders where PowerShell looks for installed modules.' },
      { word: 'Repository', meaning: 'A source of modules, such as PSGallery.' },
    ],
    beginner: {
      intro: 'These commands only look at what exists. Nothing is downloaded or changed.',
      commands: [
        {
          title: 'List modules installed on this computer',
          code: 'Get-Module -ListAvailable | Select-Object -First 10 Name, Version',
          whatItDoes: 'Shows the first ten modules found on disk with their version numbers.',
          parts: [
            { part: 'Get-Module', meaning: 'Reads information about modules.' },
            { part: '-ListAvailable', meaning: 'Include modules that are installed but not loaded yet.' },
            { part: 'Select-Object -First 10 Name, Version', meaning: 'Keep just ten rows and two columns.' },
          ],
          sampleOutput: 'Name                             Version\n----                             -------\nCimCmdlets                       7.0.0.0\nMicrosoft.PowerShell.Archive     1.2.5\nMicrosoft.PowerShell.Diagnostics 7.0.0.0',
        },
        {
          title: 'See what is loaded right now',
          code: 'Get-Module',
          whatItDoes: 'Lists only modules imported into the current window.',
          parts: [{ part: 'Get-Module', meaning: 'With no parameters it shows modules that are already loaded.' }],
          sampleOutput: 'ModuleType Version Name                  ExportedCommands\n---------- ------- ----                  ----------------\nManifest   7.0.0.0 Microsoft.PowerShell.Management {Add-Content, Clear-Content...}\nScript     2.3.5   PSReadLine            {Get-PSReadLineKeyHandler...}',
          watchOut: 'A module in -ListAvailable but not in Get-Module is installed but not imported.',
        },
        {
          title: 'See which repositories you trust',
          code: 'Get-PSRepository',
          whatItDoes: 'Lists the places PowerShell can download modules from and whether they are trusted.',
          parts: [{ part: 'Get-PSRepository', meaning: 'Shows registered module sources such as PSGallery and their InstallationPolicy.' }],
          sampleOutput: 'Name      InstallationPolicy SourceLocation\n----      ------------------ --------------\nPSGallery Untrusted          https://www.powershellgallery.com/api/v2',
          watchOut: 'Untrusted just means PowerShell will ask you to confirm each install. That is a good thing.',
        },
      ],
    },
    intermediate: {
      intro: 'You will search the Gallery, rehearse an install safely, then import and explore a module.',
      commands: [
        {
          title: 'Search the Gallery',
          code: 'Find-Module -Name Pester | Select-Object Name, Version, Author, Description',
          whatItDoes: 'Looks up a module online and shows who published it and what it does. Nothing is installed.',
          parts: [
            { part: 'Find-Module', meaning: 'Searches the online repository.' },
            { part: '-Name Pester', meaning: 'The module name to look for. Wildcards like Az.* also work.' },
            { part: '|', meaning: 'Pipes the result into the next command.' },
            { part: 'Select-Object ...', meaning: 'Chooses the columns to show.' },
          ],
          watchOut: 'Check the Author and download count. Anyone can publish, and look-alike names exist.',
        },
        {
          title: 'Rehearse an install with -WhatIf',
          code: 'Install-Module -Name Pester -Scope CurrentUser -WhatIf',
          whatItDoes: 'Shows the install that would happen without downloading anything.',
          parts: [
            { part: 'Install-Module', meaning: 'Downloads a module from a repository and saves it on disk.' },
            { part: '-Scope CurrentUser', meaning: 'Install only for you, no Administrator needed.' },
            { part: '-WhatIf', meaning: 'Preview only.' },
          ],
          watchOut: 'Remove -WhatIf to install for real (lab VM first). AllUsers scope needs an elevated window.',
        },
        {
          title: 'Import and list the new commands',
          code: 'Import-Module -Name Pester\nGet-Command -Module Pester | Select-Object -First 8 Name, CommandType',
          whatItDoes: 'Loads the module into this window and shows a sample of the cmdlets it provides.',
          parts: [
            { part: 'Import-Module -Name Pester', meaning: 'Loads the installed module into the current session.' },
            { part: 'Get-Command -Module Pester', meaning: 'Lists every command that came from that module.' },
            { part: 'Select-Object -First 8', meaning: 'Shows just the first eight rows.' },
          ],
          watchOut: 'If Import-Module says the module was not found, it is not installed. Go back to Find and Install.',
        },
      ],
    },
    pro: {
      intro: 'Pros pin versions, know where modules live, audit what is installed and update deliberately. Test in a lab VM first.',
      commands: [
        {
          title: 'Pin an exact version',
          code: 'Install-Module -Name Pester -RequiredVersion 5.5.0 -Scope CurrentUser -WhatIf',
          whatItDoes: 'Previews installing one specific version so every machine and script behaves the same.',
          parts: [
            { part: '-RequiredVersion 5.5.0', meaning: 'Install exactly this version, not the newest.' },
            { part: '-Scope CurrentUser', meaning: 'Limits the change to your profile.' },
            { part: '-WhatIf', meaning: 'Preview only.' },
          ],
          watchOut: 'Use pinned versions in automation so a surprise update cannot break a scheduled job.',
        },
        {
          title: 'Show where PowerShell looks for modules',
          code: '$env:PSModulePath -split ";"',
          whatItDoes: 'Splits the module search path into one folder per line so you can see where modules live.',
          parts: [
            { part: '$env:PSModulePath', meaning: 'An environment variable listing module folders.' },
            { part: '-split ";"', meaning: 'Cuts the text at every semicolon into separate lines.' },
          ],
          sampleOutput: 'C:\\Users\\sam\\Documents\\PowerShell\\Modules\nC:\\Program Files\\PowerShell\\Modules\nC:\\Windows\\system32\\WindowsPowerShell\\v1.0\\Modules',
          watchOut: 'On Linux or macOS the separator is a colon, not a semicolon.',
        },
        {
          title: 'Audit modules installed from the Gallery',
          code: 'Get-InstalledModule | Sort-Object Name | Select-Object Name, Version, Repository, InstalledLocation',
          whatItDoes: 'Lists modules installed via Install-Module with their source and location so you can review what is on a machine.',
          parts: [
            { part: 'Get-InstalledModule', meaning: 'Shows only modules installed through PowerShellGet.' },
            { part: 'Sort-Object Name', meaning: 'Sorts the list alphabetically.' },
            { part: 'Select-Object ...', meaning: 'Chooses the columns for the audit.' },
          ],
        },
        {
          title: 'Preview an update',
          code: 'Update-Module -Name Pester -WhatIf',
          whatItDoes: 'Shows whether a newer version would be installed, without changing anything.',
          parts: [
            { part: 'Update-Module', meaning: 'Installs the newest version of an installed module.' },
            { part: '-Name Pester', meaning: 'Which module to update.' },
            { part: '-WhatIf', meaning: 'Preview only.' },
          ],
          watchOut: 'Updates install side by side. Old versions stay until you remove them with Uninstall-Module.',
        },
      ],
    },
    recap: [
      'Remember the lifecycle: Find, Install, check with `Get-Module -ListAvailable`, Import, then `Get-Command -Module`.',
      'Installed means on disk; Imported means loaded in this window.',
      'Install with `-Scope CurrentUser` and preview with `-WhatIf` first.',
      'Trust but verify: check author, pin versions and audit with `Get-InstalledModule`.',
    ],
  },

  '11-2': {
    oneSentence:
      'WinRM lets you run commands on other machines, Invoke-Command for one command and Enter-PSSession for an interactive session, over ports 5985 and 5986.',
    analogy:
      'Remote Desktop is like flying to a faraway office, sitting at a desk and doing the work in person. PowerShell Remoting is like phoning the office and giving a precise instruction. It is faster and lighter. `Enter-PSSession` is a private phone call to one office. `Invoke-Command` is a conference call that gives the same instruction to many offices (32 lines open at a time by default).',
    plainEnglish: [
      'PowerShell Remoting uses a service called WinRM (Windows Remote Management). It listens on TCP port 5985 (HTTP) and 5986 (HTTPS). With the normal domain sign-in (Kerberos) the messages are encrypted even on 5985. `Enable-PSRemoting` only creates the 5985 listener: HTTPS (5986) needs a certificate and a listener that you set up yourself, and adds certificate-based server identity.',
      '`Enter-PSSession` opens an interactive prompt on one computer. `Invoke-Command` sends a script block to one or many computers and returns the results as objects.',
      'The "double-hop" problem: your credentials can travel from your PC to server A but not onward from A to server B. This is a deliberate security design of Kerberos. CredSSP can bypass it, but it hands your real password to the remote server, so avoid it.',
    ],
    beforeYouStart: [
      'The lab: `CLIENT01` (192.168.56.30) managing `SRV-CORE01` (192.168.56.20) and `DC01` (192.168.56.10) on the `LabNet` switch, all joined to `corp.example.com`. Lab setup: see the Lab Setup page.',
      'An elevated PowerShell window on the target machine to enable remoting.',
      'Port 5985 reachable between them (firewall rules for WinRM).',
    ],
    atoZSteps: [
      {
        title: 'Step 1: Check WinRM on the target',
        detail: 'Run `Get-Service WinRM` on the server. If it is Stopped, remoting is not enabled yet.',
      },
      {
        title: 'Step 2: Enable remoting (lab only)',
        detail: 'In an elevated window on the target run `Enable-PSRemoting`. It starts WinRM and opens the firewall for private/domain networks. On a Windows client whose network is `Public` it stops with an error: switch the network to Private with `Set-NetConnectionProfile -NetworkCategory Private` (or, in the lab only, add `-SkipNetworkProfileCheck`).',
      },
      {
        title: 'Step 3: Test the connection',
        detail: 'From your workstation run `Test-NetConnection SRV-CORE01 -Port 5985`. `TcpTestSucceeded : True` means the door is open.',
      },
      {
        title: 'Step 4: Have a 1-to-1 conversation',
        detail: 'Run `Enter-PSSession -ComputerName SRV-CORE01`. The prompt changes to `[SRV-CORE01]: PS>`. Everything you type now runs there.',
      },
      {
        title: 'Step 5: Leave cleanly',
        detail: 'Type `Exit-PSSession` to come back to your own computer. Always exit so you do not run commands on the wrong machine.',
      },
      {
        title: 'Step 6: Go 1-to-many',
        detail: 'Use `Invoke-Command -ComputerName SRV-CORE01,DC01 -ScriptBlock { ... }` to run the same task on several servers in parallel (32 at a time by default; change it with `-ThrottleLimit`).',
      },
      {
        title: 'Step 7: Understand the double hop',
        detail: 'Your credentials do not forward from SRV-CORE01 to a third computer. Fix it with delegated trust (such as Kerberos constrained delegation) rather than opening up broad credential forwarding. CredSSP works but hands your real password to the middle server, so avoid it.',
      },
    ],
    wordsYouWillMeet: [
      { word: 'WinRM', meaning: 'Windows Remote Management, the service that carries PowerShell Remoting.' },
      { word: '5985 / 5986', meaning: 'The HTTP and HTTPS ports WinRM listens on.' },
      { word: 'PSSession', meaning: 'A remote PowerShell connection you can reuse.' },
      { word: 'ScriptBlock', meaning: 'A chunk of code inside { } that you send to run elsewhere.' },
      { word: 'Kerberos', meaning: 'The domain sign-in system that proves who you are without sending your password.' },
      { word: 'Double-hop', meaning: 'Credentials cannot be passed on from the first remote machine to a second one.' },
    ],
    beginner: {
      intro: 'These commands only check and look. They connect to nothing dangerous. Run them from CLIENT01 against the lab server SRV-CORE01.',
      commands: [
        {
          title: 'Is the WinRM service running here?',
          code: 'Get-Service -Name WinRM',
          whatItDoes: 'Shows whether the Windows Remote Management service is running on this computer.',
          parts: [
            { part: 'Get-Service', meaning: 'Reads the state of Windows services.' },
            { part: '-Name WinRM', meaning: 'The service we care about.' },
          ],
          sampleOutput: 'Status   Name               DisplayName\n------   ----               -----------\nRunning  WinRM              Windows Remote Management (WS-Manag...',
        },
        {
          title: 'Is the remoting door open on a server?',
          code: 'Test-NetConnection -ComputerName SRV-CORE01 -Port 5985',
          whatItDoes: 'Tries to reach the WinRM HTTP port and reports whether it answered.',
          parts: [
            { part: 'Test-NetConnection', meaning: 'A connectivity tester that does more than ping.' },
            { part: '-ComputerName SRV-CORE01', meaning: 'The target lab server.' },
            { part: '-Port 5985', meaning: 'The WinRM HTTP port to test. Port 5986 is HTTPS and only answers if you set up a certificate and listener.' },
          ],
          sampleOutput: 'ComputerName     : SRV-CORE01\nRemotePort       : 5985\nTcpTestSucceeded : True',
          watchOut: 'False usually means a firewall, a stopped WinRM service or a wrong name.',
        },
        {
          title: 'List the remoting commands',
          code: 'Get-Command -Name *-PSSession',
          whatItDoes: 'Lists the commands for creating, entering and removing remote sessions.',
          parts: [
            { part: 'Get-Command', meaning: 'Finds commands by name.' },
            { part: '*-PSSession', meaning: 'A wildcard: anything ending in -PSSession.' },
          ],
          sampleOutput: 'CommandType Name\n----------- ----\nCmdlet      Enter-PSSession\nCmdlet      Exit-PSSession\nCmdlet      Get-PSSession\nCmdlet      New-PSSession\nCmdlet      Remove-PSSession',
        },
      ],
    },
    intermediate: {
      intro: 'Time to actually connect. Use a lab network only and run the enable step on a throwaway VM.',
      commands: [
        {
          title: 'Preview enabling remoting',
          code: 'Enable-PSRemoting -WhatIf',
          whatItDoes: 'Shows the steps that would turn on WinRM and open the firewall, without doing them.',
          parts: [
            { part: 'Enable-PSRemoting', meaning: 'Starts WinRM, creates a listener and adds firewall rules.' },
            { part: '-WhatIf', meaning: 'Preview only.' },
          ],
          watchOut: 'Needs an elevated window. Do not run it for real on a machine you do not own. Remove -WhatIf only on your lab VM.',
        },
        {
          title: 'Open an interactive remote shell',
          code: 'Enter-PSSession -ComputerName SRV-CORE01\nHostname\nExit-PSSession',
          whatItDoes: 'Connects to SRV-CORE01, shows its host name to prove you are there, then leaves.',
          parts: [
            { part: 'Enter-PSSession', meaning: 'Starts a one-to-one interactive remote session.' },
            { part: '-ComputerName SRV-CORE01', meaning: 'Which computer to connect to.' },
            { part: 'Hostname', meaning: 'Runs on the remote computer and prints its name.' },
            { part: 'Exit-PSSession', meaning: 'Returns you to your own computer.' },
          ],
          sampleOutput: '[SRV-CORE01]: PS C:\\Users\\Administrator\\Documents> hostname\nSRV-CORE01',
          watchOut: 'Look at the prompt. If it shows [SRV-CORE01] your commands are running there.',
        },
        {
          title: 'Run one task on many servers',
          code: 'Invoke-Command -ComputerName SRV-CORE01,DC01 -ScriptBlock { Get-Service -Name WinRM | Select-Object Name, Status }',
          whatItDoes: 'Runs the same read-only query on two servers at once and returns each result tagged with the server name.',
          parts: [
            { part: 'Invoke-Command', meaning: 'Runs code on one or more remote computers (32 at a time by default).' },
            { part: '-ComputerName SRV-CORE01,DC01', meaning: 'A comma-separated list of targets.' },
            { part: '-ScriptBlock { ... }', meaning: 'The code that executes remotely.' },
          ],
          sampleOutput: 'Name  Status PSComputerName\n----  ------ --------------\nWinRM Running SRV-CORE01\nWinRM Running DC01',
        },
      ],
    },
    pro: {
      intro: 'Professionals reuse sessions, pass local variables safely, prefer HTTPS and watch TrustedHosts. Lab VMs only.',
      commands: [
        {
          title: 'Reuse a persistent session',
          code: '$s = New-PSSession -ComputerName SRV-CORE01\nInvoke-Command -Session $s -ScriptBlock { $x = 5 }\nInvoke-Command -Session $s -ScriptBlock { $x }\nRemove-PSSession $s',
          whatItDoes: 'Keeps one connection open so remote variables survive between commands, then closes it.',
          parts: [
            { part: 'New-PSSession', meaning: 'Creates a reusable remote connection stored in $s.' },
            { part: 'Invoke-Command -Session $s', meaning: 'Runs code inside that existing connection.' },
            { part: 'Remove-PSSession', meaning: 'Closes the connection and frees the server resources.' },
          ],
          sampleOutput: '5',
          watchOut: 'Always remove sessions you are done with, or they pile up on the server.',
        },
        {
          title: 'Pass a local value with $using and limit parallelism',
          code: '$min = 100MB\nInvoke-Command -ComputerName SRV-CORE01,DC01 -ThrottleLimit 16 -ScriptBlock {\n    Get-Process | Where-Object WorkingSet -gt $using:min | Select-Object -First 3 Name, WorkingSet\n}',
          whatItDoes: 'Sends a value from your computer into the remote script block and finds processes larger than 100 MB.',
          parts: [
            { part: '$min = 100MB', meaning: 'A local variable; MB is a built-in size multiplier.' },
            { part: '-ThrottleLimit 16', meaning: 'At most 16 computers are contacted at the same time (the default is 32).' },
            { part: '$using:min', meaning: 'Brings the local $min into the remote script block.' },
            { part: 'Where-Object WorkingSet -gt ...', meaning: 'Keeps processes using more memory than the limit.' },
          ],
          watchOut: 'Without $using:, the remote side sees an empty variable and the filter silently fails.',
        },
        {
          title: 'Connect over HTTPS with explicit credentials',
          code: '$cred = Get-Credential\nEnter-PSSession -ComputerName SRV-CORE01.corp.example.com -UseSSL -Credential $cred',
          whatItDoes: 'Connects over port 5986 so the server proves its identity with a certificate.',
          parts: [
            { part: 'Get-Credential', meaning: 'Pops up a secure prompt; the password is stored encrypted in memory.' },
            { part: '-UseSSL', meaning: 'Use the HTTPS listener on port 5986.' },
            { part: '-Credential $cred', meaning: 'Sign in as that account.' },
          ],
          watchOut: 'Needs an HTTPS listener and a valid certificate whose name matches the host, which `Enable-PSRemoting` does not create. Never type passwords into a script in plain text.',
        },
        {
          title: 'Audit the TrustedHosts list',
          code: 'Get-Item -Path WSMan:\\localhost\\Client\\TrustedHosts',
          whatItDoes: 'Shows which computers you have told WinRM to trust without Kerberos checks.',
          parts: [
            { part: 'Get-Item', meaning: 'Reads one item from a provider (like a drive).' },
            { part: 'WSMan:\\localhost\\Client\\TrustedHosts', meaning: 'The WinRM setting listing trusted non-domain hosts.' },
          ],
          watchOut: 'Needs an elevated window. TrustedHosts means "talk to this host without proving who it is", so someone could impersonate it and collect your credentials. Add single named hosts only, never "*", and remove them afterwards.',
        },
      ],
    },
    recap: [
      'Remoting uses WinRM on ports 5985 (HTTP, created by Enable-PSRemoting) and 5986 (HTTPS, needs a certificate and listener).',
      '`Enter-PSSession` is one server interactively; `Invoke-Command` is many servers in parallel (32 at a time by default).',
      'Use `$using:` to pass local variables and `Remove-PSSession` to clean up.',
      'The double-hop is a security feature. Solve it with delegation, not by weakening credentials (avoid CredSSP).',
      'When you get stuck: check the network profile (Public blocks Enable-PSRemoting), run Test-NetConnection on 5985, use the host name (Kerberos fails by IP), and treat TrustedHosts and HTTPS as the fallback with a security cost.',
    ],
  },

  '12-1': {
    oneSentence:
      'Active Directory holds users, groups, and OUs, and Test-ComputerSecureChannel -Repair fixes a machine that lost its domain trust without a rebuild.',
    analogy:
      'Active Directory is the company phone book and ID-badge office in one. Each person (user) has a record, groups are mailing lists that decide who may enter which room, and Organizational Units (OUs) are the filing drawers that keep it all tidy and tell the helpdesk who may manage what. PowerShell lets you update the whole book in seconds instead of editing one card at a time.',
    plainEnglish: [
      'Almost every company network keeps its users, computers and groups in Active Directory. The `ActiveDirectory` module gives you commands like `Get-ADUser`, `New-ADGroup` and `Get-ADOrganizationalUnit`.',
      'Reading is safe, creating is routine, and deleting is serious. Always preview changes with `-WhatIf`, and turn on OU protection against accidental deletion.',
      'If a workstation says "the trust relationship between this workstation and the primary domain failed", `Test-ComputerSecureChannel -Repair` can often fix it in one line.',
    ],
    beforeYouStart: [
      'A lab domain (`corp.example.com`, domain controller `DC01`) and a domain-joined admin machine such as `CLIENT01`. Never practise on a real company directory. Lab setup: see the Lab Setup page.',
      'The `ActiveDirectory` module (installed with RSAT or on a domain controller).',
      'A domain account with the right to read the directory. Creating objects needs more rights.',
    ],
    atoZSteps: [
      {
        title: 'Step 1: Check the module',
        detail: 'Run `Get-Module -ListAvailable ActiveDirectory`. If nothing appears, install the RSAT AD tools first.',
      },
      {
        title: 'Step 2: Read the domain',
        detail: 'Run `Get-ADDomain`. It tells you the domain name and its distinguished name (`DC=corp,DC=example,DC=com`).',
      },
      {
        title: 'Step 3: Look at the OUs',
        detail: 'Run `Get-ADOrganizationalUnit -Filter *` to see the drawers where users live.',
      },
      {
        title: 'Step 4: Find a user',
        detail: 'Run `Get-ADUser -Identity jdoe -Properties *` to see every attribute of one account.',
      },
      {
        title: 'Step 5: Create a user (preview first)',
        detail: 'Use `New-ADUser ... -WhatIf` and read the preview. Then remove -WhatIf in the lab only.',
      },
      {
        title: 'Step 6: Add the user to a group',
        detail: 'Use `Add-ADGroupMember` so permissions come from group membership, not from the person directly.',
      },
      {
        title: 'Step 7: Scale up with a CSV',
        detail: 'Use `Import-Csv` and `ForEach-Object` to create many users from a spreadsheet. A safe script checks whether each user already exists, avoids name collisions, previews with -WhatIf, and writes one result row per input row (see the pro tier).',
      },
    ],
    wordsYouWillMeet: [
      { word: 'Active Directory (AD)', meaning: 'Microsoft\'s central directory of users, computers and groups.' },
      { word: 'OU', meaning: 'Organizational Unit, a folder in AD used to organise and delegate control.' },
      { word: 'Distinguished Name', meaning: 'The full path of an object such as CN=Jane,OU=Sales,DC=corp,DC=example,DC=com.' },
      { word: 'SamAccountName', meaning: 'The short logon name, for example jdoe.' },
      { word: 'Secure channel', meaning: 'The secret trust between a computer and the domain.' },
    ],
    beginner: {
      intro: 'These commands only read from the directory. Run them against your lab domain.',
      commands: [
        {
          title: 'Read the domain details',
          code: 'Get-ADDomain | Select-Object Name, DNSRoot, DomainMode, PDCEmulator',
          whatItDoes: 'Shows the basic facts about the domain you are connected to.',
          parts: [
            { part: 'Get-ADDomain', meaning: 'Reads information about the current AD domain.' },
            { part: '|', meaning: 'Passes the result on.' },
            { part: 'Select-Object Name, DNSRoot, DomainMode, PDCEmulator', meaning: 'Keeps only these four properties.' },
          ],
          sampleOutput: 'Name       : CORP\nDNSRoot    : corp.example.com\nDomainMode : Windows2016Domain\nPDCEmulator: DC01.corp.example.com',
        },
        {
          title: 'List the OUs',
          code: 'Get-ADOrganizationalUnit -Filter * | Select-Object Name, DistinguishedName',
          whatItDoes: 'Lists every Organizational Unit and its full path.',
          parts: [
            { part: 'Get-ADOrganizationalUnit', meaning: 'Reads OUs from AD.' },
            { part: '-Filter *', meaning: 'Required. The star means "all".' },
            { part: 'Select-Object ...', meaning: 'Chooses the columns.' },
          ],
          sampleOutput: 'Name              DistinguishedName\n----              -----------------\nDomain Controllers OU=Domain Controllers,DC=corp,DC=example,DC=com\nSales             OU=Sales,DC=corp,DC=example,DC=com',
        },
        {
          title: 'Look up one user',
          code: 'Get-ADUser -Identity Administrator -Properties LastLogonDate, Enabled | Select-Object Name, SamAccountName, Enabled, LastLogonDate',
          whatItDoes: 'Finds one account and shows when it last logged on and whether it is enabled.',
          parts: [
            { part: 'Get-ADUser -Identity Administrator', meaning: 'Finds the account with that name.' },
            { part: '-Properties LastLogonDate, Enabled', meaning: 'Asks for extra fields; AD returns only a basic set by default.' },
            { part: 'Select-Object ...', meaning: 'Shows only the useful columns.' },
          ],
          watchOut: 'Avoid `-Properties *` on thousands of users; it is slow and returns a lot of data.',
        },
      ],
    },
    intermediate: {
      intro: 'You will filter, create and organise. Anything that changes the directory is previewed with -WhatIf. Lab domain only.',
      commands: [
        {
          title: 'Find users with a filter',
          code: 'Get-ADUser -Filter \'Department -eq "Sales"\' -Properties Department | Select-Object Name, SamAccountName, Department',
          whatItDoes: 'Asks the domain controller for only the Sales users instead of downloading everyone.',
          parts: [
            { part: '-Filter \'...\'', meaning: 'Runs the search on the server, which is fast. The whole filter is in single quotes so PowerShell does not expand variables like $true before AD sees them.' },
            { part: 'Department -eq "Sales"', meaning: 'A comparison: Department equals Sales. The value sits in double quotes inside the single-quoted filter.' },
            { part: '-Properties Department', meaning: 'Include the Department attribute in the results.' },
          ],
          watchOut: 'The Filter parameter uses its own syntax, not a script block. Prefer it over Where-Object, and keep the filter in single quotes.',
        },
        {
          title: 'Preview creating a user',
          code: 'New-ADUser -Name "Jane Doe" -SamAccountName jdoe -Path "OU=Sales,DC=corp,DC=example,DC=com" -AccountPassword (Read-Host "Temp password" -AsSecureString) -ChangePasswordAtLogon $true -Enabled $true -WhatIf',
          whatItDoes: 'Shows the user that would be created. Nothing is saved.',
          parts: [
            { part: 'New-ADUser', meaning: 'Creates a user account.' },
            { part: '-Path "OU=Sales,..."', meaning: 'The OU where the account should be created.' },
            { part: '(Read-Host ... -AsSecureString)', meaning: 'Prompts for the password and hides what you type.' },
            { part: '-Enabled $true', meaning: 'Turns the account on.' },
            { part: '-WhatIf', meaning: 'Preview only.' },
          ],
          watchOut: 'Never type real passwords into a script file. Remove -WhatIf only in your lab.',
        },
        {
          title: 'Preview adding a user to a group',
          code: 'Add-ADGroupMember -Identity "Sales-Team" -Members jdoe -WhatIf',
          whatItDoes: 'Shows that jdoe would be added to the Sales-Team group.',
          parts: [
            { part: 'Add-ADGroupMember', meaning: 'Adds members to an AD group.' },
            { part: '-Identity "Sales-Team"', meaning: 'The group to change.' },
            { part: '-Members jdoe', meaning: 'The account to add.' },
            { part: '-WhatIf', meaning: 'Preview only.' },
          ],
          watchOut: 'Adding someone to a privileged group like Domain Admins is a serious change. Always double check the group name.',
        },
      ],
    },
    pro: {
      intro: 'Pros bulk-provision from CSV, hunt stale accounts and repair domain trust. Lab domain only; keep -WhatIf until you are sure.',
      commands: [
        {
          title: 'Bulk create users from a CSV (safe, repeatable, preview)',
          code: '$initial = Read-Host "Initial password" -AsSecureString\n$results = foreach ($r in Import-Csv -Path .\\newusers.csv) {\n    $sam = $r.Sam\n    if ($sam -notmatch \'^[A-Za-z0-9._-]{1,20}$\') {\n        [pscustomobject]@{ Sam = $sam; Status = \'Failed\'; Detail = \'Bad SamAccountName\' }; continue\n    }\n    if (Get-ADUser -Filter "SamAccountName -eq \'$sam\'") {\n        [pscustomobject]@{ Sam = $sam; Status = \'Skipped\'; Detail = \'Already exists\' }; continue\n    }\n    try {\n        New-ADUser -Name $r.Name -SamAccountName $sam -Path $r.OU -AccountPassword $initial -ChangePasswordAtLogon $true -Enabled $true -WhatIf -ErrorAction Stop\n        [pscustomobject]@{ Sam = $sam; Status = \'WhatIf OK\'; Detail = \'\' }\n    } catch {\n        [pscustomobject]@{ Sam = $sam; Status = \'Failed\'; Detail = $_.Exception.Message }\n    }\n}\n$results | Export-Csv -Path .\\results.csv -NoTypeInformation\n$results',
          whatItDoes: 'Reads a spreadsheet and, for each row, validates the logon name, skips anyone who already exists (so running it twice is safe), previews the creation with -WhatIf, and records one result row per input row in results.csv.',
          parts: [
            { part: 'Import-Csv', meaning: 'Turns each CSV row into an object with column names as properties.' },
            { part: '$sam -notmatch \'^[A-Za-z0-9._-]{1,20}$\'', meaning: 'Rejects odd characters and names longer than the 20-character SamAccountName limit. It also keeps the filter below safe to build.' },
            { part: 'Get-ADUser -Filter "SamAccountName -eq \'$sam\'"', meaning: 'Checks for an existing account first. If one exists the row is skipped, so the script is idempotent.' },
            { part: 'New-ADUser ... -ChangePasswordAtLogon $true -WhatIf', meaning: 'Creates an enabled account with a prompt-supplied password that must be changed at first logon. -WhatIf makes this a preview.' },
            { part: 'try { } catch { }', meaning: 'A failure on one row is recorded and the loop continues.' },
            { part: 'Export-Csv', meaning: 'Saves the per-row results so you can audit what happened.' },
          ],
          watchOut: 'Needs columns Name, Sam and OU. Remove -WhatIf only in the lab after the results look right. If two people would get the same Sam, the second is skipped; the lesson shows how to generate jsmith2.',
        },
        {
          title: 'Find stale accounts',
          code: 'Search-ADAccount -AccountInactive -TimeSpan 90.00:00:00 -UsersOnly | Select-Object Name, LastLogonDate, Enabled',
          whatItDoes: 'Lists user accounts that have not logged on for 90 days. This is read-only.',
          parts: [
            { part: 'Search-ADAccount', meaning: 'A dedicated search for account states.' },
            { part: '-AccountInactive -TimeSpan 90.00:00:00', meaning: 'Inactive for 90 days (format days.hours:minutes:seconds).' },
            { part: '-UsersOnly', meaning: 'Skip computer accounts.' },
          ],
          watchOut: 'Disable stale accounts first and wait before deleting. Never delete in bulk without review.',
        },
        {
          title: 'Check the workstation trust',
          code: 'Test-ComputerSecureChannel -Verbose',
          whatItDoes: 'Tests whether this computer still has a working trust with its domain. Returns True or False.',
          parts: [
            { part: 'Test-ComputerSecureChannel', meaning: 'Checks the secure channel to a domain controller.' },
            { part: '-Verbose', meaning: 'Prints extra detail about the check.' },
          ],
          sampleOutput: 'True',
        },
        {
          title: 'Repair a broken trust (preview)',
          code: 'Test-ComputerSecureChannel -Repair -Credential (Get-Credential CORP\\Administrator) -WhatIf',
          whatItDoes: 'Previews resetting the computer\'s machine password with the domain so trust is restored.',
          parts: [
            { part: '-Repair', meaning: 'Tries to fix the secure channel instead of only testing it.' },
            { part: '-Credential (Get-Credential ...)', meaning: 'Prompts for a domain account with the right to reset the computer account.' },
            { part: '-WhatIf', meaning: 'Preview only.' },
          ],
          watchOut: 'Run it on the affected workstation, so you need a way to log on first (a local administrator account, or a cached domain logon). Typical causes are a snapshot rollback, or a reset or deleted computer object, not simply being switched off for a while. Remove -WhatIf only in your lab.',
        },
      ],
    },
    recap: [
      'The `ActiveDirectory` module manages users, groups and OUs with the `*-AD*` cmdlets.',
      'Use `-Filter` (in single quotes) and `-Properties` to search on the server and ask only for what you need.',
      'Always preview with `-WhatIf` and keep OU protection on.',
      'A broken domain trust can often be fixed with `Test-ComputerSecureChannel -Repair`, run on the affected computer.',
      'When you get stuck: check DNS first. The client\'s only DNS server should be 192.168.56.10 (DC01), and `Resolve-DnsName corp.example.com` should answer.',
    ],
  },

  '12-2': {
    oneSentence:
      'Promote a domain controller with Install-ADDSForest, manage its DNS zones and records, and apply Fine-Grained Password Policies to your admin groups.',
    analogy:
      'A forest is a small country, a domain is a city inside it, and Domain Controllers are the city halls that keep the official records. DNS is the postal system: without the correct address entries (SRV records), a laptop would never find the city hall. Fine-Grained Password Policies are special house rules for the most important buildings, such as stricter locks for the mayor\'s office.',
    plainEnglish: [
      'To build a new Active Directory you install the AD DS role and then promote the server to a Domain Controller. On a headless Server Core machine this is done entirely with PowerShell.',
      'Clients find Domain Controllers using DNS `SRV` records such as `_ldap._tcp.dc._msdcs.corp.example.com`. If DNS is broken, domain logon is broken.',
      'A Fine-Grained Password Policy (FGPP) lets you give admin groups a stricter policy (such as 20 characters) while normal users keep the default.',
    ],
    beforeYouStart: [
      'A lab Windows Server VM. Promoting a server to a Domain Controller is a big change; never do it on a production machine.',
      'A static IP address and a clear computer name for the future Domain Controller.',
      'An elevated PowerShell window and the `ActiveDirectory` and `DnsServer` modules (they come with the roles or RSAT).',
    ],
    atoZSteps: [
      {
        title: 'Step 1: Plan the names',
        detail: 'Use the lab domain name `corp.example.com` and the NetBIOS name `CORP`. Avoid `.local` in real life because it clashes with multicast DNS. Names are hard to change later.',
      },
      {
        title: 'Step 2: Install the role',
        detail: 'Run `Install-WindowsFeature AD-Domain-Services -IncludeManagementTools`. This only adds the files, it does not create a domain yet. First point the server\'s DNS client at itself (`Set-DnsClientServerAddress ... -ServerAddresses 192.168.56.10`), because the new DC will host the domain\'s DNS.',
      },
      {
        title: 'Step 3: Promote the server',
        detail: 'Run `Install-ADDSForest -DomainName corp.example.com -DomainNetbiosName CORP -InstallDns -SafeModeAdministratorPassword (Read-Host "DSRM password" -AsSecureString)`. Preview with `-WhatIf` first. The DSRM password is your recovery login, and the server restarts by itself when it finishes.',
      },
      {
        title: 'Step 4: Check the forest and DCs',
        detail: 'After the reboot run `Get-ADForest` and `Get-ADDomainController`. You should see your new domain.',
      },
      {
        title: 'Step 5: Prove DNS works',
        detail: 'Run `Resolve-DnsName -Type SRV _ldap._tcp.dc._msdcs.corp.example.com`. It should name your Domain Controller. If it does not, fix DNS before anything else: it is the most common cause of AD trouble.',
      },
      {
        title: 'Step 6: Manage DNS records',
        detail: 'Use `Get-DnsServerZone` and `Get-DnsServerResourceRecord` to inspect zones and records, and `Add-DnsServerResourceRecordA` to add one.',
      },
      {
        title: 'Step 7: Harden admin passwords',
        detail: 'Create an FGPP with `New-ADFineGrainedPasswordPolicy` and attach it to a group with `Add-ADFineGrainedPasswordPolicySubject`.',
      },
    ],
    wordsYouWillMeet: [
      { word: 'Forest', meaning: 'The top-level boundary of an Active Directory, containing one or more domains.' },
      { word: 'Domain Controller', meaning: 'A server that stores the directory and signs users in.' },
      { word: 'SRV record', meaning: 'A DNS record that says which server provides a service, such as LDAP.' },
      { word: 'DSRM', meaning: 'Directory Services Restore Mode, a recovery password for the DC.' },
      { word: 'FGPP', meaning: 'Fine-Grained Password Policy, a custom password rule for specific users or groups.' },
    ],
    beginner: {
      intro: 'These commands only read from an existing lab domain and DNS. Nothing changes.',
      commands: [
        {
          title: 'See the forest',
          code: 'Get-ADForest | Select-Object Name, ForestMode, Domains, GlobalCatalogs',
          whatItDoes: 'Shows the forest name, its functional level and the domains inside it.',
          parts: [
            { part: 'Get-ADForest', meaning: 'Reads forest information from AD.' },
            { part: 'Select-Object Name, ForestMode, Domains, GlobalCatalogs', meaning: 'Keeps just the useful facts.' },
          ],
          sampleOutput: 'Name           : corp.example.com\nForestMode     : Windows2016Forest\nDomains        : {corp.example.com}\nGlobalCatalogs : {DC01.corp.example.com}',
        },
        {
          title: 'List the Domain Controllers',
          code: 'Get-ADDomainController -Filter * | Select-Object Name, IPv4Address, Site, IsGlobalCatalog',
          whatItDoes: 'Lists every Domain Controller with its address and site.',
          parts: [
            { part: 'Get-ADDomainController', meaning: 'Reads information about DCs.' },
            { part: '-Filter *', meaning: 'Include all of them.' },
            { part: 'Select-Object ...', meaning: 'Chooses the columns.' },
          ],
          sampleOutput: 'Name IPv4Address   Site                  IsGlobalCatalog\n---- -----------   ----                  ---------------\nDC01 192.168.56.10 Default-First-Site-Name True',
        },
        {
          title: 'Find a DC through DNS',
          code: 'Resolve-DnsName -Name _ldap._tcp.dc._msdcs.corp.example.com -Type SRV',
          whatItDoes: 'Asks DNS the same question a client asks when it looks for a Domain Controller.',
          parts: [
            { part: 'Resolve-DnsName', meaning: 'PowerShell\'s DNS lookup tool.' },
            { part: '-Name _ldap._tcp.dc._msdcs.corp.example.com', meaning: 'The special SRV record name for DCs in corp.example.com.' },
            { part: '-Type SRV', meaning: 'Ask for a service record rather than an address.' },
          ],
          sampleOutput: 'Name                                    Type TTL Section NameTarget                Priority Weight Port\n----                                    ---- --- ------- ----------                -------- ------ ----\n_ldap._tcp.dc._msdcs.corp.example.com   SRV  600 Answer  DC01.corp.example.com     0        100    389',
          watchOut: 'No answer usually means a DNS problem, not an AD problem: check that the client\'s DNS server is 192.168.56.10.',
        },
      ],
    },
    intermediate: {
      intro: 'Work with DNS zones and password rules. Run these on your lab DNS server. Changes are previewed with -WhatIf.',
      commands: [
        {
          title: 'List DNS zones',
          code: 'Get-DnsServerZone | Select-Object ZoneName, ZoneType, IsDsIntegrated',
          whatItDoes: 'Shows every DNS zone the server hosts.',
          parts: [
            { part: 'Get-DnsServerZone', meaning: 'Reads zones from the DNS Server role.' },
            { part: 'Select-Object ZoneName, ZoneType, IsDsIntegrated', meaning: 'Show the name, type and whether it is stored in AD.' },
          ],
          sampleOutput: 'ZoneName                   ZoneType IsDsIntegrated\n--------                   -------- --------------\ncorp.example.com           Primary  True\n_msdcs.corp.example.com    Primary  True',
        },
        {
          title: 'Filter DNS records',
          code: 'Get-DnsServerResourceRecord -ZoneName corp.example.com -RRType A | Select-Object HostName, @{n="IP";e={$_.RecordData.IPv4Address}}',
          whatItDoes: 'Lists the host (A) records in corp.example.com with their IP addresses.',
          parts: [
            { part: 'Get-DnsServerResourceRecord', meaning: 'Reads records from a zone.' },
            { part: '-ZoneName corp.example.com -RRType A', meaning: 'The zone to read, limited to address records.' },
            { part: '@{n="IP";e={...}}', meaning: 'A calculated column named IP, taken from inside RecordData.' },
          ],
        },
        {
          title: 'Preview adding a DNS record',
          code: 'Add-DnsServerResourceRecordA -ZoneName corp.example.com -Name app01 -IPv4Address 192.168.56.50 -WhatIf',
          whatItDoes: 'Shows the DNS record that would map app01.corp.example.com to 192.168.56.50.',
          parts: [
            { part: 'Add-DnsServerResourceRecordA', meaning: 'Creates an A (name to IPv4) record.' },
            { part: '-ZoneName corp.example.com -Name app01', meaning: 'The zone and the host name to add.' },
            { part: '-IPv4Address 192.168.56.50', meaning: 'The address the name points to.' },
            { part: '-WhatIf', meaning: 'Preview only.' },
          ],
          watchOut: 'A wrong DNS record can send users to the wrong server. Remove -WhatIf only in the lab.',
        },
        {
          title: 'Read the default password policy',
          code: 'Get-ADDefaultDomainPasswordPolicy | Select-Object MinPasswordLength, ComplexityEnabled, LockoutThreshold',
          whatItDoes: 'Shows the domain-wide password rules that apply to ordinary users.',
          parts: [
            { part: 'Get-ADDefaultDomainPasswordPolicy', meaning: 'Reads the policy that applies to the whole domain.' },
            { part: 'Select-Object ...', meaning: 'Keeps the length, complexity and lockout settings.' },
          ],
          sampleOutput: 'MinPasswordLength ComplexityEnabled LockoutThreshold\n----------------- ----------------- ----------------\n               12              True                5',
        },
      ],
    },
    pro: {
      intro: 'Lab VM only. These are the real build and hardening commands, all previewed with -WhatIf. A forest promotion cannot be casually undone.',
      commands: [
        {
          title: 'Install the role and promote a lab DC',
          code: 'Install-WindowsFeature -Name AD-Domain-Services -IncludeManagementTools -WhatIf\nInstall-ADDSForest -DomainName corp.example.com -DomainNetbiosName CORP -InstallDns -SafeModeAdministratorPassword (Read-Host "DSRM password" -AsSecureString) -WhatIf',
          whatItDoes: 'Previews the two big steps of building a new domain: adding the role and promoting the server to the first DC. Before the real run, the server\'s own DNS client must point at itself (192.168.56.10).',
          parts: [
            { part: 'Install-WindowsFeature -Name AD-Domain-Services', meaning: 'Adds the AD DS role files.' },
            { part: '-IncludeManagementTools', meaning: 'Also installs the management tools and the AD module.' },
            { part: 'Install-ADDSForest', meaning: 'Creates a brand-new forest and domain on this server.' },
            { part: '-DomainName / -DomainNetbiosName', meaning: 'The DNS name and the short pre-Windows name.' },
            { part: '-InstallDns', meaning: 'Also installs DNS so clients can find the DC.' },
            { part: '-SafeModeAdministratorPassword', meaning: 'The DSRM recovery password, prompted as a hidden string.' },
          ],
          watchOut: 'Removing -WhatIf restarts the server and permanently changes it. Lab VM only; never type the DSRM password into a script.',
        },
        {
          title: 'Create a strict password policy',
          code: 'New-ADFineGrainedPasswordPolicy -Name "Admins-20" -Precedence 1 -MinPasswordLength 20 -ComplexityEnabled $true -LockoutThreshold 5 -LockoutDuration 00:30:00 -LockoutObservationWindow 00:30:00 -MinPasswordAge 1.00:00:00 -MaxPasswordAge 60.00:00:00 -PasswordHistoryCount 24 -ReversibleEncryptionEnabled $false -WhatIf',
          whatItDoes: 'Previews a policy that requires 20-character complex passwords for the people it is applied to. All the lockout, age and history settings are given explicitly so the policy is predictable.',
          parts: [
            { part: '-Name "Admins-20"', meaning: 'A friendly name for the policy.' },
            { part: '-Precedence 1', meaning: 'Lower numbers win if several policies apply.' },
            { part: '-MinPasswordLength 20', meaning: 'Passwords must have at least 20 characters.' },
            { part: '-LockoutThreshold 5 / -LockoutDuration / -LockoutObservationWindow', meaning: 'Lock the account after 5 wrong attempts, for 30 minutes, counted over a 30-minute window.' },
            { part: '-MinPasswordAge / -MaxPasswordAge / -PasswordHistoryCount', meaning: 'How often a password may be changed, when it expires, and how many old ones are remembered.' },
            { part: '-ReversibleEncryptionEnabled $false', meaning: 'Never store passwords in a reversible way.' },
          ],
          watchOut: 'Test with a lab group first; a policy this strict can lock out accounts that are not ready for it.',
        },
        {
          title: 'Apply the policy to a group',
          code: 'Add-ADFineGrainedPasswordPolicySubject -Identity "Admins-20" -Subjects "Domain Admins" -WhatIf',
          whatItDoes: 'Previews attaching the strict policy to the Domain Admins group.',
          parts: [
            { part: 'Add-ADFineGrainedPasswordPolicySubject', meaning: 'Links a policy to users or groups.' },
            { part: '-Identity "Admins-20"', meaning: 'The policy to attach.' },
            { part: '-Subjects "Domain Admins"', meaning: 'A group or user. Use a global security group, not an OU.' },
          ],
          watchOut: 'FGPP only works with users or global security groups, not with OUs.',
        },
        {
          title: 'Prove which policy a user gets',
          code: 'Get-ADUserResultantPasswordPolicy -Identity jdoe',
          whatItDoes: 'Shows the policy that actually applies to a user. An empty result means the default domain policy applies.',
          parts: [
            { part: 'Get-ADUserResultantPasswordPolicy', meaning: 'Works out the winning FGPP for an account.' },
            { part: '-Identity jdoe', meaning: 'The user to check.' },
          ],
          watchOut: 'No output is not an error; it means no FGPP applies to that user.',
        },
      ],
    },
    recap: [
      'Install the role with `Install-WindowsFeature`, then promote with `Install-ADDSForest` (lab only, DNS client pointing at itself first).',
      'Clients find Domain Controllers through DNS SRV records; check them with `Resolve-DnsName -Type SRV`. When stuck, check DNS first.',
      'Manage DNS with the `DnsServer` cmdlets and preview changes with `-WhatIf`.',
      'Use an FGPP on global security groups to give admins stricter passwords than everyone else.',
    ],
  },

  '13-1': {
    oneSentence:
      'The firewall has three profiles (Domain, Private, Public), and Enable-NetFirewallRule -DisplayGroup opens a whole function safely instead of guessing ports.',
    analogy:
      'The Windows Firewall is the security guard at a building. Network Location Awareness (NLA) tells the guard where the building is today: at the office (Domain), at home (Private) or in a coffee shop (Public), and each place has its own rule book. Instead of unlocking one random door after another, you tell the guard "let the cleaning team in", and a whole group of rules opens exactly the right doors.',
    plainEnglish: [
      'Every network adapter is placed in one of three profiles: `Domain`, `Private` or `Public`. Each profile has its own firewall settings, and the strictest is Public.',
      'Rules are collected into `DisplayGroup`s such as "Windows Remote Management". Enabling a group opens a defined bundle of rules in one step (not just one port), which beats guessing port numbers. Read what a group contains before you enable it.',
      'When something cannot connect, never turn the firewall off. Find the right rule, enable only that, scope it to the right profile and remote addresses.',
    ],
    beforeYouStart: [
      'A Windows lab machine. An elevated window is only needed to change rules, not to read them.',
      'Know which profile your network adapter is using (the first beginner command shows it).',
      'Be extra careful on remote machines: a bad firewall change can cut off your own connection. Use a lab VM with console access.',
    ],
    atoZSteps: [
      {
        title: 'Step 1: Find your profile',
        detail: 'Run `Get-NetConnectionProfile`. Note whether the adapter is `DomainAuthenticated`, `Private` or `Public`.',
      },
      {
        title: 'Step 2: Check the profile settings',
        detail: 'Run `Get-NetFirewallProfile`. See whether each profile is Enabled and what its inbound default is (usually Block).',
      },
      {
        title: 'Step 3: Find the rule group',
        detail: 'Run `Get-NetFirewallRule -DisplayGroup "Windows Remote Management"` to see the rules behind a feature.',
      },
      {
        title: 'Step 4: Look at the ports',
        detail: 'Pipe the rules into `Get-NetFirewallPortFilter` to see which protocol and ports they open.',
      },
      {
        title: 'Step 5: Preview enabling the group',
        detail: 'Use `Enable-NetFirewallRule -DisplayGroup "..." -WhatIf`, read the plan, then remove -WhatIf on your lab VM.',
      },
      {
        title: 'Step 6: Back up before big changes',
        detail: 'Export the firewall configuration so you can restore it if something goes wrong.',
      },
      {
        title: 'Step 7: Keep the firewall on',
        detail: 'Do not run `Set-NetFirewallProfile -Enabled False`. Open only what you need, and only for who needs it.',
      },
    ],
    wordsYouWillMeet: [
      { word: 'NLA', meaning: 'Network Location Awareness. It decides which firewall profile a network gets.' },
      { word: 'Profile', meaning: 'A set of firewall settings: Domain, Private or Public.' },
      { word: 'Inbound / Outbound', meaning: 'Traffic coming into the machine versus going out of it.' },
      { word: 'DisplayGroup', meaning: 'A named bundle of related firewall rules.' },
      { word: 'Port filter', meaning: 'The part of a rule that says which protocol and port it matches.' },
    ],
    beginner: {
      intro: 'These commands only read the firewall settings. Nothing is changed.',
      commands: [
        {
          title: 'Which profile is my network using?',
          code: 'Get-NetConnectionProfile | Select-Object Name, InterfaceAlias, NetworkCategory',
          whatItDoes: 'Shows each connected network and whether it is treated as Public, Private or Domain.',
          parts: [
            { part: 'Get-NetConnectionProfile', meaning: 'Reads the Network Location Awareness result for each adapter.' },
            { part: 'Select-Object Name, InterfaceAlias, NetworkCategory', meaning: 'Keeps the network name, adapter name and profile.' },
          ],
          sampleOutput: 'Name                 InterfaceAlias NetworkCategory\n----                 -------------- ---------------\ncorp.example.com     Ethernet       DomainAuthenticated',
        },
        {
          title: 'Is the firewall on for each profile?',
          code: 'Get-NetFirewallProfile | Select-Object Name, Enabled, DefaultInboundAction, DefaultOutboundAction',
          whatItDoes: 'Shows whether the firewall is enabled and what it does with traffic that matches no rule.',
          parts: [
            { part: 'Get-NetFirewallProfile', meaning: 'Reads the Domain, Private and Public profile settings.' },
            { part: 'DefaultInboundAction', meaning: 'What happens to incoming traffic with no matching rule. Block is the healthy default.' },
          ],
          sampleOutput: 'Name    Enabled DefaultInboundAction DefaultOutboundAction\n----    ------- -------------------- ---------------------\nDomain  True    Block                Allow\nPrivate True    Block                Allow\nPublic  True    Block                Allow',
        },
        {
          title: 'Look at a rule group',
          code: 'Get-NetFirewallRule -DisplayGroup "Windows Remote Management" | Select-Object DisplayName, Enabled, Profile, Direction',
          whatItDoes: 'Lists the rules in the group that controls remoting.',
          parts: [
            { part: 'Get-NetFirewallRule', meaning: 'Reads firewall rules.' },
            { part: '-DisplayGroup "Windows Remote Management"', meaning: 'Only rules that belong to that named group.' },
            { part: 'Select-Object ...', meaning: 'Chooses the columns.' },
          ],
          sampleOutput: 'DisplayName                                   Enabled Profile Direction\n-----------                                   ------- ------- ---------\nWindows Remote Management (HTTP-In)            True    Domain  Inbound',
          watchOut: 'Group names depend on the Windows display language. Use Get-NetFirewallRule | Select DisplayGroup, Group -Unique to see yours; the Group value (for example @FirewallAPI.dll,-30267 for Windows Remote Management) is language-neutral and works with `-Group`.',
        },
      ],
    },
    intermediate: {
      intro: 'You will search rules, inspect ports and preview opening a group safely. Use a lab VM.',
      commands: [
        {
          title: 'List the enabled inbound allow rules',
          code: 'Get-NetFirewallRule -Direction Inbound -Enabled True -Action Allow | Select-Object -First 10 DisplayName, Profile',
          whatItDoes: 'Shows which doors are currently open to incoming traffic.',
          parts: [
            { part: '-Direction Inbound', meaning: 'Only rules for traffic coming in.' },
            { part: '-Enabled True', meaning: 'Skip rules that are switched off.' },
            { part: '-Action Allow', meaning: 'Only rules that let traffic through.' },
            { part: 'Select-Object -First 10', meaning: 'Show the first ten so the list is manageable.' },
          ],
        },
        {
          title: 'See which ports a group opens',
          code: 'Get-NetFirewallRule -DisplayGroup "Windows Remote Management" | Get-NetFirewallPortFilter | Select-Object Protocol, LocalPort',
          whatItDoes: 'Shows the protocol and port numbers behind the rules in the group.',
          parts: [
            { part: 'Get-NetFirewallRule -DisplayGroup ...', meaning: 'Finds the rules of the group.' },
            { part: '|', meaning: 'Passes each rule on.' },
            { part: 'Get-NetFirewallPortFilter', meaning: 'Reads the port part of each rule it receives.' },
          ],
          sampleOutput: 'Protocol LocalPort\n-------- ---------\nTCP      5985',
        },
        {
          title: 'Preview enabling a rule group',
          code: 'Enable-NetFirewallRule -DisplayGroup "Remote Event Log Management" -WhatIf',
          whatItDoes: 'Shows which rules would be turned on so a remote admin can read event logs.',
          parts: [
            { part: 'Enable-NetFirewallRule', meaning: 'Turns existing rules on. It does not create new ones.' },
            { part: '-DisplayGroup "..."', meaning: 'Targets the whole bundle at once.' },
            { part: '-WhatIf', meaning: 'Preview only.' },
          ],
          watchOut: 'Needs an elevated window to run for real. Enabling a rule opens a port, so make sure you need the feature.',
        },
      ],
    },
    pro: {
      intro: 'Pros back up first, scope rules tightly, log dropped traffic and audit for overly open rules. Lab VM only for changes.',
      commands: [
        {
          title: 'Back up the firewall configuration',
          code: 'netsh advfirewall export "C:\\Backup\\firewall-before.wfw"',
          whatItDoes: 'Saves every firewall setting and rule to a file you can restore later.',
          parts: [
            { part: 'netsh advfirewall', meaning: 'The classic Windows tool for firewall settings.' },
            { part: 'export', meaning: 'Writes the current configuration to a file.' },
            { part: '"C:\\Backup\\firewall-before.wfw"', meaning: 'The path of the backup file. The folder must already exist.' },
          ],
          watchOut: 'Needs an elevated window. Restore with `netsh advfirewall import` if a change goes wrong.',
        },
        {
          title: 'Create a tightly scoped rule (preview)',
          code: 'New-NetFirewallRule -DisplayName "Lab - RDP from admin subnet" -Direction Inbound -Protocol TCP -LocalPort 3389 -RemoteAddress 192.168.56.0/24 -Profile Domain -Action Allow -WhatIf',
          whatItDoes: 'Previews a rule that allows Remote Desktop only from the lab subnet and only on the Domain profile.',
          parts: [
            { part: 'New-NetFirewallRule', meaning: 'Creates a brand-new firewall rule.' },
            { part: '-Protocol TCP -LocalPort 3389', meaning: 'The protocol and port to match.' },
            { part: '-RemoteAddress 192.168.56.0/24', meaning: 'Only this range of computers (the lab subnet) may connect.' },
            { part: '-Profile Domain', meaning: 'The rule applies only on the Domain profile.' },
            { part: '-Action Allow', meaning: 'Let matching traffic through.' },
          ],
          watchOut: 'Scoping to a remote address is the difference between a safe rule and an open door. Remove -WhatIf only in your lab.',
        },
        {
          title: 'Turn on logging of dropped packets (preview)',
          code: 'Set-NetFirewallProfile -Profile Domain,Private,Public -LogBlocked True -LogMaxSizeKilobytes 16384 -WhatIf',
          whatItDoes: 'Previews logging blocked connections so you can later see what the firewall refused.',
          parts: [
            { part: 'Set-NetFirewallProfile', meaning: 'Changes settings of a firewall profile.' },
            { part: '-Profile Domain,Private,Public', meaning: 'Apply to all three profiles.' },
            { part: '-LogBlocked True', meaning: 'Record blocked connections in the firewall log.' },
            { part: '-LogMaxSizeKilobytes 16384', meaning: 'Keep the log file to about 16 MB.' },
          ],
          watchOut: 'Never use this cmdlet with `-Enabled False` to "fix" connectivity. That blinds the whole machine.',
        },
        {
          title: 'Audit rules open to everyone',
          code: 'Get-NetFirewallRule -Direction Inbound -Enabled True -Action Allow |\n    Get-NetFirewallAddressFilter |\n    Where-Object { $_.RemoteAddress -eq "Any" } |\n    Select-Object -First 10 InstanceID',
          whatItDoes: 'Finds enabled inbound allow rules that accept traffic from any address, so you can review and tighten them.',
          parts: [
            { part: 'Get-NetFirewallAddressFilter', meaning: 'Reads the address part of each rule it receives.' },
            { part: 'Where-Object { $_.RemoteAddress -eq "Any" }', meaning: 'Keeps filters whose remote address is unrestricted.' },
            { part: 'InstanceID', meaning: 'The unique ID of the rule. Use Get-NetFirewallRule -Name to look up the full rule.' },
          ],
          watchOut: 'Many built-in rules are "Any" on purpose. Review before tightening, do not just disable.',
        },
      ],
    },
    recap: [
      'NLA assigns each adapter a Domain, Private or Public profile with separate rules.',
      'Enable rules by group (`-DisplayGroup`, or the language-neutral `-Group`) instead of guessing port numbers, and check what the group contains first.',
      'Back up first, scope rules by remote address and profile, and preview with `-WhatIf`.',
      'Never switch the firewall off to fix a connection problem.',
      'When you get stuck: the rule is enabled but the port is closed? Compare the NIC\'s profile (`Get-NetConnectionProfile`) with the rule\'s Profile. A rule for Domain,Private does nothing on a Public network.',
    ],
  },
};
