import type { GlossaryItem } from '../types';

export const GLOSSARY_EXTRA: GlossaryItem[] = [
  // ==========================================================================
  // FUNDAMENTALS: WHERE YOU TYPE AND WHAT YOU TYPE
  // ==========================================================================
  {
    term: 'Terminal',
    category: 'Fundamentals',
    definition:
      'A terminal is the window where you type commands and read the answers as plain text.',
    detailedExplanation:
      'Old computers had a real screen-and-keyboard box called a terminal, and today the word means the program that imitates it. The terminal only shows text and sends your keystrokes along; the program that actually understands your commands is the shell running inside it. Windows Terminal, the classic blue PowerShell window and the VS Code panel are all terminals.',
    example: `You open Windows Terminal, see a blinking cursor, and type: Get-Date`,
    relatedTerms: ['Console', 'Shell', 'Prompt', 'Windows Terminal'],
    relatedLessonPath: '/learn/chapter-03/what-is-powershell',
  },
  {
    term: 'Console',
    category: 'Fundamentals',
    definition:
      'The console is the text-only window of a running program, where PowerShell prints its output and waits for your typing.',
    detailedExplanation:
      'People often say console, terminal and command line as if they were the same thing, and for a beginner that is fine. A small difference: the console is the window itself, while the shell is the program inside it that reads what you type. PowerShell even names its default host "ConsoleHost".',
    codeExample: `$Host.Name`,
    relatedTerms: ['Terminal', 'Shell', 'Windows Terminal'],
    relatedLessonPath: '/learn/chapter-03/what-is-powershell',
  },
  {
    term: 'Shell',
    category: 'Fundamentals',
    definition:
      'A shell is a program that reads the commands you type, runs them for you, and prints the result.',
    detailedExplanation:
      'It is called a shell because it wraps around the operating system and gives you a way to talk to it with words instead of mouse clicks. PowerShell, cmd.exe and bash are all shells. The window you type in is the terminal, but the shell is the brain that understands your command.',
    example: `PowerShell, cmd.exe and bash are three different shells that can all run in the same terminal window.`,
    codeExample: `$PSVersionTable.PSEdition`,
    relatedTerms: ['Terminal', 'cmd.exe', 'Bash', 'Command'],
    relatedLessonPath: '/learn/chapter-03/what-is-powershell',
  },
  {
    term: 'Prompt',
    category: 'Fundamentals',
    definition:
      'The prompt is the short text at the start of the line (like PS C:\\>) that tells you PowerShell is ready and which folder you are in.',
    detailedExplanation:
      'PS means you are in PowerShell, and the part after it is your current folder. You type your command right after the prompt and press Enter. Never type the prompt itself when you copy an example, only the command after it.',
    example: `PS C:\\Users\\Sam> Get-Date    (the prompt is "PS C:\\Users\\Sam>", the command is "Get-Date")`,
    codeExample: `prompt`,
    relatedTerms: ['Command', 'Enter (Running a Command)', 'Working Directory'],
    relatedLessonPath: '/learn/chapter-03/what-is-powershell',
  },
  {
    term: 'Command',
    category: 'Fundamentals',
    definition:
      'A command is one instruction you type to PowerShell, such as Get-Date, to make the computer do something.',
    detailedExplanation:
      'A command can be a cmdlet, a function, an alias, a script file or a normal program like ping.exe. Most commands can take extra information after their name, called parameters and arguments. PowerShell runs a command when you press Enter.',
    codeExample: `Get-Command Get-Date`,
    relatedTerms: ['Cmdlet (Verb-SingularNoun)', 'Parameter', 'Argument', 'Alias'],
    relatedLessonPath: '/learn/chapter-03/verb-noun-and-discovery',
  },
  {
    term: 'Parameter',
    category: 'Fundamentals',
    definition:
      'A parameter is a named option for a command, written with a dash like -Path, that changes how the command works.',
    detailedExplanation:
      'Think of a command as a vending machine and the parameters as its labelled buttons. Each parameter has a name and usually expects a value right after it. Get-Help shows you every parameter a command supports.',
    example: `In "Get-Date -Format yyyy" the parameter is -Format.`,
    codeExample: `Get-Date -Format yyyy`,
    relatedTerms: ['Argument', 'Switch Parameter', 'Command', 'Tab Completion'],
    relatedLessonPath: '/learn/chapter-03/help-and-self-reliance',
  },
  {
    term: 'Argument',
    category: 'Fundamentals',
    definition:
      'An argument is the actual value you hand to a parameter, such as the folder name you give to -Path.',
    detailedExplanation:
      'The parameter is the label and the argument is what you put in it. Beginners mix the two up all the time, and in everyday talk people often say argument for both. If you skip the parameter name, PowerShell can still match the value by its position.',
    example: `In "Get-Date -Format yyyy" the argument is yyyy. In "Get-ChildItem C:\\Windows" the argument is C:\\Windows.`,
    codeExample: `Get-ChildItem -Path C:\\Windows -Name`,
    relatedTerms: ['Parameter', 'Command', 'String'],
    relatedLessonPath: '/learn/chapter-03/help-and-self-reliance',
  },
  {
    term: 'Switch Parameter',
    category: 'Fundamentals',
    definition:
      'A switch parameter is an on/off option that needs no value: you either write it (on) or leave it out (off).',
    detailedExplanation:
      'Normal parameters expect a value after them, but a switch works like a light switch. -Recurse, -Force, -WhatIf and -Directory are common switches. Writing the switch turns the feature on for that one command.',
    example: `Adding -Directory to Get-ChildItem shows only folders.`,
    codeExample: `Get-ChildItem -Path C:\\Windows -Directory`,
    relatedTerms: ['Parameter', '-WhatIf', 'Argument'],
    relatedLessonPath: '/learn/chapter-03/help-and-self-reliance',
  },
  {
    term: 'Tab Completion',
    category: 'Fundamentals',
    definition:
      'Tab completion means pressing the Tab key to let PowerShell finish a command, parameter or file name for you.',
    detailedExplanation:
      'Type the first letters, press Tab, and PowerShell fills in the rest; press Tab again to cycle through other matches. It saves typing and, more importantly, prevents typos. Beginners should use it constantly.',
    example: `Type Get-Chi and press Tab: PowerShell completes it to Get-ChildItem.`,
    relatedTerms: ['Command', 'Parameter', 'Prompt'],
    relatedLessonPath: '/learn/chapter-03/verb-noun-and-discovery',
  },
  {
    term: 'Enter (Running a Command)',
    category: 'Fundamentals',
    definition:
      'Pressing the Enter key tells PowerShell to run the line you just typed.',
    detailedExplanation:
      'Nothing happens while you type; the command only runs once you press Enter. If the command is not finished (for example an open quote or bracket), PowerShell waits for more lines instead. To stop a command that is running too long, press Ctrl+C.',
    relatedTerms: ['Prompt', 'Command', 'Pipeline'],
    relatedLessonPath: '/learn/chapter-03/what-is-powershell',
  },
  {
    term: 'Comment',
    category: 'Fundamentals',
    definition:
      'A comment is a note for humans, starting with #, that PowerShell completely ignores.',
    detailedExplanation:
      'Use comments to explain why a line exists, or to switch a line off without deleting it. Everything from the # to the end of the line is skipped. Good comments explain the reason, not just repeat the command.',
    example: `# This line is only a note and does nothing`,
    codeExample: `Get-Date # everything after the hash sign is ignored`,
    relatedTerms: ['Script', '.ps1 File'],
    relatedLessonPath: '/learn/chapter-10/scripts-and-execution-policies',
  },
  {
    term: 'Wildcard',
    category: 'Fundamentals',
    definition:
      'A wildcard is a special character, like * or ?, that stands in for unknown letters when you match names.',
    detailedExplanation:
      'The star * matches any number of characters and the question mark ? matches exactly one. So *.txt means every file ending in .txt. Many cmdlets accept wildcards in their name parameters, which makes them a quick way to filter.',
    example: `Get-Service s* lists every service whose name starts with s.`,
    codeExample: `Get-ChildItem C:\\Windows\\*.exe`,
    relatedTerms: ['Regular Expression (Regex)', 'Path (Absolute vs. Relative)'],
    relatedLessonPath: '/learn/chapter-07/filter-left-and-where-object',
  },
  {
    term: 'Path (Absolute vs. Relative)',
    category: 'Fundamentals',
    definition:
      'A path is the address of a file or folder; an absolute path starts at the drive (C:\\...), a relative path starts from where you are now.',
    detailedExplanation:
      'C:\\Windows\\System32 works from anywhere, while .\\notes.txt means "the notes.txt file in the folder I am standing in". A single dot is the current folder and two dots are the parent folder. If a command says it cannot find a path, check which folder you are in first.',
    codeExample: `Get-Location; Resolve-Path .`,
    relatedTerms: ['Working Directory', 'Wildcard', 'Prompt'],
    relatedLessonPath: '/learn/chapter-08/psproviders-and-psdrives',
  },
  {
    term: 'Working Directory',
    category: 'Fundamentals',
    definition:
      'The working directory is the folder PowerShell is currently standing in, which relative paths are measured from.',
    detailedExplanation:
      'It is shown in your prompt and can be changed with Set-Location (alias cd). Every new window starts in some folder, often your user folder. Knowing it explains why the same relative path works in one window and fails in another.',
    codeExample: `Get-Location`,
    relatedTerms: ['Prompt', 'Path (Absolute vs. Relative)'],
    relatedLessonPath: '/learn/chapter-08/psproviders-and-psdrives',
  },
  {
    term: 'Environment Variable ($env:)',
    category: 'Fundamentals',
    definition:
      'An environment variable is a named setting Windows keeps for every program, such as your computer name or user name, read in PowerShell as $env:NAME.',
    detailedExplanation:
      'Windows fills in values like COMPUTERNAME, USERNAME and TEMP when you sign in. PowerShell exposes them through the env: drive, so $env:COMPUTERNAME gives you the machine name. They are handy in scripts because they work on every computer.',
    codeExample: `$env:COMPUTERNAME`,
    relatedTerms: ['Variable', 'Working Directory'],
    relatedLessonPath: '/learn/chapter-08/psproviders-and-psdrives',
  },
  {
    term: 'Script',
    category: 'Scripting & Functions',
    definition:
      'A script is a text file full of PowerShell commands that run one after another when you start it.',
    detailedExplanation:
      'Instead of retyping the same ten commands every day, you save them once and run the file. Scripts can also use variables, decisions and loops. A PowerShell script file ends in .ps1 and may be blocked until the execution policy allows it.',
    example: `A script called Backup.ps1 that copies your documents to a USB drive.`,
    relatedTerms: ['.ps1 File', 'Execution Policy (RemoteSigned)', 'Comment', 'Function'],
    relatedLessonPath: '/learn/chapter-10/scripts-and-execution-policies',
  },
  {
    term: '.ps1 File',
    category: 'Scripting & Functions',
    definition:
      'A .ps1 file is a PowerShell script saved as plain text with the .ps1 ending.',
    detailedExplanation:
      'You can create one in any text editor such as Notepad or VS Code. To run it from the current folder you type .\\name.ps1, because PowerShell does not run scripts from the current folder unless you say where it is. Double-clicking a .ps1 file usually opens it in an editor rather than running it, which is a safety feature.',
    example: `.\\Hello.ps1`,
    relatedTerms: ['Script', 'Execution Policy (RemoteSigned)', 'Path (Absolute vs. Relative)'],
    relatedLessonPath: '/learn/chapter-10/scripts-and-execution-policies',
  },
  {
    term: 'Function',
    category: 'Scripting & Functions',
    definition:
      'A function is a named block of commands that you write once and can run again by typing its name.',
    detailedExplanation:
      'It works like your own custom command. A function made in the console only lasts until you close the window, unless you save it in a script or module. Advanced functions add cmdlet-style features such as parameters and -WhatIf.',
    codeExample: `function Say-Hello { "Hello from my function" }; Say-Hello`,
    relatedTerms: ['Script', 'Module', 'Command'],
    relatedLessonPath: '/learn/chapter-14/advanced-functions-toolmaking',
  },
  {
    term: 'Administrator (Elevated) vs. Standard User',
    category: 'Security & Ethical Hacking',
    definition:
      'A standard window runs with limited rights, while an elevated (administrator) window runs with full rights to change the system.',
    detailedExplanation:
      'Even if your account is an administrator, programs start with limited rights until you choose Run as administrator. Elevation is needed for things like changing services or the firewall, but it also lets mistakes do more damage. Use the standard window whenever you can.',
    example: `Right-click PowerShell and choose "Run as administrator" to open an elevated window.`,
    codeExample: `([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)`,
    relatedTerms: ['UAC (User Account Control)', 'Execution Policy (RemoteSigned)'],
    relatedLessonPath: '/learn/chapter-01/windows-evolution-and-least-privilege',
  },
  {
    term: 'UAC (User Account Control)',
    category: 'Security & Ethical Hacking',
    definition:
      'UAC is the Windows pop-up that asks permission before a program is allowed to run with administrator rights.',
    detailedExplanation:
      'It stops programs from silently making big changes without you noticing. When it appears you must decide whether you trust the program asking. It is a key part of the least-privilege idea: do everyday work with small rights and elevate only when needed.',
    codeExample: `Get-ItemProperty HKLM:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Policies\\System | Select-Object EnableLUA`,
    relatedTerms: ['Administrator (Elevated) vs. Standard User', 'Registry'],
    relatedLessonPath: '/learn/chapter-01/windows-evolution-and-least-privilege',
  },
  {
    term: 'cmd.exe',
    category: 'Core Concepts',
    definition:
      'cmd.exe is the old Windows Command Prompt shell, which only handles plain text and a small set of older commands.',
    detailedExplanation:
      'It has been in Windows for decades and is still used by many tools and batch files. Unlike PowerShell, it passes text around, not objects. You can start it from PowerShell by typing cmd, and leave it again with exit.',
    example: `Typing "dir" works in both, but only PowerShell lets you then pick a property such as Length from the results.`,
    codeExample: `Get-Command cmd.exe | Select-Object Name, Source`,
    relatedTerms: ['Batch File', 'Shell', 'Bash', 'Object'],
    relatedLessonPath: '/learn/chapter-03/what-is-powershell',
  },
  {
    term: 'Batch File',
    category: 'Core Concepts',
    definition:
      'A batch file is a script for cmd.exe, saved with the .bat or .cmd ending, that runs a list of old-style commands.',
    detailedExplanation:
      'You will meet batch files in older installers and company login scripts. PowerShell can run them, but it cannot read their commands as objects. New work is normally written as .ps1 scripts, which are far more powerful.',
    example: `A file called setup.bat containing: echo Hello`,
    relatedTerms: ['cmd.exe', 'Script', '.ps1 File'],
    relatedLessonPath: '/learn/chapter-03/what-is-powershell',
  },
  {
    term: 'Bash',
    category: 'Core Concepts',
    definition:
      'Bash is the most popular shell on Linux and macOS, and it also passes plain text between commands.',
    detailedExplanation:
      'It plays the same role there that PowerShell plays on Windows. Many online tutorials show bash commands like ls or grep, and PowerShell has similar aliases and cmdlets (Get-ChildItem and Select-String). Windows can also run bash through WSL, but its syntax is different from PowerShell.',
    example: `The bash command "ls" lists files; in PowerShell the same job is done by Get-ChildItem (alias ls or dir).`,
    relatedTerms: ['Shell', 'cmd.exe', 'Alias'],
    relatedLessonPath: '/learn/chapter-03/what-is-powershell',
  },
  {
    term: 'Windows PowerShell 5.1 vs. PowerShell 7',
    category: 'Core Concepts',
    definition:
      'Windows PowerShell 5.1 is the older version built into Windows (powershell.exe), and PowerShell 7 is the newer, separately installed version (pwsh.exe).',
    detailedExplanation:
      'Version 5.1 only runs on Windows and is no longer receiving new features, but it is on every Windows computer. PowerShell 7 is open source, runs on Windows, Linux and macOS, and adds newer syntax such as && and ||. Most beginner commands work in both; the version table tells you which one you are in.',
    codeExample: `$PSVersionTable.PSVersion`,
    relatedTerms: ['ISE', 'Pipeline Chain Operators (&& and ||)', 'Module'],
    relatedLessonPath: '/learn/chapter-03/what-is-powershell',
  },
  {
    term: 'ISE',
    category: 'Core Concepts',
    definition:
      'The ISE (Integrated Scripting Environment) is the older Windows program with a script editor and a console in one window.',
    detailedExplanation:
      'It ships with Windows PowerShell 5.1 and is friendly for first scripts because it has colours and a Run button. It is no longer being developed and does not work with PowerShell 7. Visual Studio Code with the PowerShell extension is the modern replacement.',
    relatedTerms: ['Windows PowerShell 5.1 vs. PowerShell 7', 'Script', 'Windows Terminal'],
    relatedLessonPath: '/learn/chapter-03/what-is-powershell',
  },
  {
    term: 'Windows Terminal',
    category: 'Core Concepts',
    definition:
      'Windows Terminal is a modern Microsoft app that hosts PowerShell, cmd.exe and other shells in tabs inside one window.',
    detailedExplanation:
      'It is only the window, not a shell itself. You can open several tabs, each running a different shell, and it supports colours, copy and paste and nicer fonts. It comes with current versions of Windows 11 and can be installed on Windows 10.',
    relatedTerms: ['Terminal', 'Shell', 'ISE'],
    relatedLessonPath: '/learn/chapter-03/what-is-powershell',
  },
  {
    term: 'Pipeline Chain Operators (&& and ||)',
    category: 'Scripting & Functions',
    definition:
      'The && operator runs the second command only if the first one worked, and || runs the second only if the first one failed.',
    detailedExplanation:
      'They let you chain commands with a simple success check, similar to bash. They exist only in PowerShell 7 and newer; Windows PowerShell 5.1 shows a syntax error if you type them. In 5.1 you use if statements or semicolons instead.',
    example: `PowerShell 7 only:  Test-Path .\\a.txt && Write-Host "found it"   or   Test-Path .\\a.txt || Write-Host "missing"`,
    relatedTerms: ['Pipeline', 'Windows PowerShell 5.1 vs. PowerShell 7', 'Bash'],
    relatedLessonPath: '/learn/chapter-05/chaining-and-multiline',
  },

  // ==========================================================================
  // PIPELINE, OBJECTS AND OUTPUT
  // ==========================================================================
  {
    term: 'Pipe (|)',
    category: 'Pipeline & Objects',
    definition:
      'The pipe character | sends the output of the command on its left into the command on its right.',
    detailedExplanation:
      'It works like a conveyor belt between two machines. In PowerShell the things travelling along it are whole objects, not just text. You can pipe through as many commands as you like.',
    codeExample: `Get-Process | Sort-Object CPU -Descending | Select-Object -First 3 Name, CPU`,
    relatedTerms: ['Pipeline', 'Object', 'Pipeline Variable ($_)'],
    relatedLessonPath: '/learn/chapter-05/pipeline-mechanics-and-binding',
  },
  {
    term: 'Pipeline',
    category: 'Pipeline & Objects',
    definition:
      'A pipeline is a row of commands joined by pipes, where each one works on what the previous one produced.',
    detailedExplanation:
      'A typical pipeline gets something, filters it, picks the columns you care about and then shows or saves it. Objects flow through one at a time, so even huge lists use little memory. Breaking a long pipeline over several lines after a | keeps it readable.',
    codeExample: `Get-Service | Where-Object Status -eq 'Running' | Measure-Object`,
    relatedTerms: ['Pipe (|)', 'Object', 'Pipeline Variable ($_)'],
    relatedLessonPath: '/learn/chapter-05/pipeline-mechanics-and-binding',
  },
  {
    term: 'Pipeline Variable ($_)',
    category: 'Pipeline & Objects',
    definition:
      'Inside commands like Where-Object and ForEach-Object, $_ means the one item currently passing through the pipeline.',
    detailedExplanation:
      'PowerShell takes each object in turn and calls it $_ while your script block runs on it. You can then read its properties, like $_.Name. The longer name $PSItem means exactly the same thing.',
    codeExample: `1..3 | ForEach-Object { $_ * 2 }`,
    relatedTerms: ['Pipeline', 'Property', 'Object'],
    relatedLessonPath: '/learn/chapter-07/filter-left-and-where-object',
  },
  {
    term: 'Object',
    category: 'Pipeline & Objects',
    definition:
      'An object is a bundle of information (its properties) plus things it can do (its methods), such as one file or one process.',
    detailedExplanation:
      'When you run Get-Process, each row is not just text but a real process object with many hidden details. What you see on screen is only a short summary chosen for display. Get-Member shows everything an object really contains.',
    example: `One file is an object: it has a Name and a Length (properties) and can be deleted or copied (methods).`,
    codeExample: `(Get-Date).GetType().FullName`,
    relatedTerms: ['Property', 'Method', 'Type', 'Class', 'Instance'],
    relatedLessonPath: '/learn/chapter-04/objects-properties-methods',
  },
  {
    term: 'Property',
    category: 'Pipeline & Objects',
    definition:
      'A property is one piece of information stored inside an object, like the Name of a file or the Year of a date.',
    detailedExplanation:
      'You read a property with a dot after the object: (Get-Date).Year. Properties describe the object; they do not do anything. Select-Object lets you keep only the properties you want.',
    codeExample: `(Get-Date).Year`,
    relatedTerms: ['Object', 'Method', 'Pipeline Variable ($_)'],
    relatedLessonPath: '/learn/chapter-04/objects-properties-methods',
  },
  {
    term: 'Method',
    category: 'Pipeline & Objects',
    definition:
      'A method is an action an object can perform, written with a dot and round brackets, like .AddDays(1).',
    detailedExplanation:
      'Properties hold facts while methods do work, such as adding days to a date or making text uppercase. Methods always have brackets, even when they need no input. Be careful: some methods change things for real, such as .Delete() on a file.',
    codeExample: `(Get-Date).AddDays(1)`,
    relatedTerms: ['Object', 'Property', 'String'],
    relatedLessonPath: '/learn/chapter-04/objects-properties-methods',
  },
  {
    term: 'Stream',
    category: 'Pipeline & Objects',
    definition:
      'A stream is a separate channel that PowerShell uses for one kind of message, such as normal output, errors or warnings.',
    detailedExplanation:
      'There are several: output, error, warning, verbose, debug and information. Keeping them apart means a warning does not get mixed into the data you are piping. You can redirect a stream, for example 2> sends the error stream to a file.',
    codeExample: `Write-Output "this is data"; Write-Warning "this is a warning"`,
    relatedTerms: ['Redirection (>)', 'ErrorAction', 'Pipeline'],
    relatedLessonPath: '/learn/chapter-14/error-handling-and-splatting',
  },
  {
    term: 'Redirection (>)',
    category: 'Pipeline & Objects',
    definition:
      'Redirection sends output to a file instead of the screen, using > to overwrite or >> to add to the end.',
    detailedExplanation:
      'Be careful: a single > replaces everything already in that file. The number in front chooses the stream, for example 2> redirects errors only. Out-File and Set-Content do a similar job with more options.',
    example: `Get-Process > processes.txt   (saves the process list in processes.txt)`,
    relatedTerms: ['Stream', 'Pipeline', 'Path (Absolute vs. Relative)'],
    relatedLessonPath: '/learn/chapter-08/files-and-select-string',
  },
  {
    term: 'CSV',
    category: 'Pipeline & Objects',
    definition:
      'CSV (comma-separated values) is a plain text table where each line is a row and commas separate the columns.',
    detailedExplanation:
      'Excel can open CSV files, which makes them a popular way to move lists between programs. Export-Csv turns objects into a CSV file and Import-Csv turns the file back into objects. The first line holds the column names.',
    example: `Name,Id\nnotepad,4120\nchrome,9012`,
    codeExample: `Get-Process | Select-Object -First 3 Name, Id | ConvertTo-Csv -NoTypeInformation`,
    relatedTerms: ['JSON', 'Object', 'Redirection (>)'],
    relatedLessonPath: '/learn/chapter-04/formatting-and-custom-objects',
  },
  {
    term: 'JSON',
    category: 'Pipeline & Objects',
    definition:
      'JSON is a text format for storing structured data as named values inside curly braces, widely used by web services.',
    detailedExplanation:
      'It looks like { "Name": "Ana", "Age": 14 } and is easy for both people and programs to read. ConvertTo-Json turns PowerShell objects into JSON text, and ConvertFrom-Json turns JSON back into objects. Many settings files and web APIs use it.',
    codeExample: `@{ Name = 'Ana'; Age = 14 } | ConvertTo-Json`,
    relatedTerms: ['CSV', 'Hashtable', 'Object'],
    relatedLessonPath: '/learn/chapter-04/formatting-and-custom-objects',
  },
  {
    term: 'Regular Expression (Regex)',
    category: 'Pipeline & Objects',
    definition:
      'A regular expression is a short pattern, like \\d+ for a run of digits, used to find or check text.',
    detailedExplanation:
      'Wildcards are simple, while regular expressions can describe things such as phone numbers or dates. PowerShell uses them with -match, -replace and Select-String. They look cryptic at first, so test them on small samples.',
    example: `The pattern \\d+ matches 12345 inside "Order 12345".`,
    codeExample: `'Order 12345' -match '\\d+'; $Matches[0]`,
    relatedTerms: ['Wildcard', 'String'],
    relatedLessonPath: '/learn/chapter-08/files-and-select-string',
  },

  // ==========================================================================
  // VARIABLES AND TYPES
  // ==========================================================================
  {
    term: 'Variable',
    category: 'Scripting & Functions',
    definition:
      'A variable is a named box in memory that holds a value, and its name always starts with a dollar sign.',
    detailedExplanation:
      'You put something in with =, as in $name = "Sam", and use it later by typing the name. Variables disappear when you close the window unless a script recreates them. Variable names are not case sensitive, so $Name and $name are the same box.',
    codeExample: `$name = 'Sam'; "Hello $name"`,
    relatedTerms: ['String', 'Integer', 'Array', 'Hashtable', 'Type'],
    relatedLessonPath: '/learn/chapter-06/variables-arrays-and-types',
  },
  {
    term: 'String',
    category: 'Scripting & Functions',
    definition:
      'A string is a piece of text in quotes, like "hello".',
    detailedExplanation:
      'Double quotes let PowerShell swap in variable values ("Hi $name"), while single quotes keep every character exactly as typed. A string is an object too, so it has methods like .ToUpper() and properties like .Length. Numbers inside quotes are still strings.',
    codeExample: `'PowerShell'.ToUpper()`,
    relatedTerms: ['Variable', 'Method', 'Type', 'Coercion'],
    relatedLessonPath: '/learn/chapter-06/quotes-and-secure-io',
  },
  {
    term: 'Integer',
    category: 'Scripting & Functions',
    definition:
      'An integer is a whole number with no decimal part, like 7 or -250.',
    detailedExplanation:
      'PowerShell stores most whole numbers as the type Int32, which holds values from about minus 2 billion to plus 2 billion. Bigger numbers are switched to a larger type automatically. Numbers with a decimal point are a different type called Double.',
    codeExample: `(42).GetType().Name`,
    relatedTerms: ['Type', 'String', 'Cast (Type Conversion)'],
    relatedLessonPath: '/learn/chapter-06/variables-arrays-and-types',
  },
  {
    term: 'Boolean',
    category: 'Scripting & Functions',
    definition:
      'A boolean is a value that can only be True or False.',
    detailedExplanation:
      'In PowerShell they are written $true and $false. Comparisons such as 5 -gt 3 and tests such as Test-Path produce booleans, and if statements use them to decide what to do. Where-Object keeps an item only when its test gives True.',
    codeExample: `Test-Path C:\\Windows`,
    relatedTerms: ['Variable', 'Type', 'Script'],
    relatedLessonPath: '/learn/chapter-10/control-flow-and-loops',
  },
  {
    term: 'Array',
    category: 'Scripting & Functions',
    definition:
      'An array is an ordered list of values stored together in one variable.',
    detailedExplanation:
      'You can make one by separating values with commas. You reach an item by its position in square brackets, and counting starts at 0, so $colors[0] is the first one. Pipelines often return arrays, and .Count tells you how many items there are.',
    codeExample: `$colors = 'red','green','blue'; $colors.Count; $colors[0]`,
    relatedTerms: ['Variable', 'Hashtable', 'Object'],
    relatedLessonPath: '/learn/chapter-06/variables-arrays-and-types',
  },
  {
    term: 'Hashtable',
    category: 'Scripting & Functions',
    definition:
      'A hashtable is a list of key and value pairs, written @{ Key = Value }, where you look things up by key.',
    detailedExplanation:
      'It works like a phone book: you give the name (the key) and get the number (the value). It is handy for grouping settings and is also used for splatting parameters and building custom objects. Unlike an array, you find items by name, not by position.',
    codeExample: `$person = @{ Name = 'Ana'; Age = 14 }; $person['Name']`,
    relatedTerms: ['Array', 'Parameter Splatting (@params)', 'JSON', 'Variable'],
    relatedLessonPath: '/learn/chapter-06/variables-arrays-and-types',
  },
  {
    term: 'Type',
    category: 'Scripting & Functions',
    definition:
      'A type tells PowerShell what kind of thing a value is, such as text, a whole number or a date.',
    detailedExplanation:
      'The type decides what you can do with a value: you can add numbers, but adding a date to text makes little sense. Every value has one, and .GetType() reveals it. You can also write a type in square brackets, like [int] or [string].',
    codeExample: `(3.5).GetType().Name`,
    relatedTerms: ['Class', 'Cast (Type Conversion)', 'Coercion', 'Integer', 'String'],
    relatedLessonPath: '/learn/chapter-06/variables-arrays-and-types',
  },
  {
    term: 'Cast (Type Conversion)',
    category: 'Scripting & Functions',
    definition:
      'A cast is when you put a type in square brackets in front of a value to force it to become that type.',
    detailedExplanation:
      'For example [int]"42" turns the text 42 into the number 42, so you can do maths with it. If the value cannot be converted, such as [int]"abc", PowerShell shows an error. Putting a type before a variable, like [int]$age = 5, also locks that variable to the type.',
    codeExample: `[int]'42' + 1`,
    relatedTerms: ['Coercion', 'Type', 'Integer', 'String'],
    relatedLessonPath: '/learn/chapter-06/variables-arrays-and-types',
  },
  {
    term: 'Coercion',
    category: 'Scripting & Functions',
    definition:
      'Coercion is when PowerShell quietly converts a value to another type on its own so an operation can work.',
    detailedExplanation:
      'The rule is that the value on the left decides the type. So "5" + 5 gives the text 55, but 5 + "5" gives the number 10. It is helpful, but it can cause surprises, so use a cast when you want to be certain.',
    codeExample: `"5" + 5; 5 + "5"`,
    relatedTerms: ['Cast (Type Conversion)', 'Type', 'String', 'Integer'],
    relatedLessonPath: '/learn/chapter-06/variables-arrays-and-types',
  },
  {
    term: 'Class',
    category: 'Scripting & Functions',
    definition:
      'A class is the blueprint that describes what properties and methods a kind of object will have.',
    detailedExplanation:
      'Think of the blueprint of a house: it is not a house, but you can build many houses from it. System.DateTime is a class, and every date you work with was built from it. The static members of a class, such as [System.Math]::Sqrt(16), can be used without building an object first.',
    codeExample: `[System.Math]::Sqrt(16)`,
    relatedTerms: ['Instance', 'Object', 'Type'],
    relatedLessonPath: '/learn/chapter-04/objects-properties-methods',
  },
  {
    term: 'Instance',
    category: 'Scripting & Functions',
    definition:
      'An instance is one real object created from a class, like one actual house built from a blueprint.',
    detailedExplanation:
      'Each instance has its own values, so two dates created from the same class can hold different days. The word you will often see is "instantiate", which just means to create an instance. In PowerShell this is done with New-Object or with [ClassName]::new().',
    codeExample: `$sb = [System.Text.StringBuilder]::new(); $null = $sb.Append('Hi'); $sb.ToString()`,
    relatedTerms: ['Class', 'Object', 'Type'],
    relatedLessonPath: '/learn/chapter-04/objects-properties-methods',
  },
  {
    term: 'SecureString',
    category: 'Security & Ethical Hacking',
    definition:
      'A SecureString is a type that keeps sensitive text, such as a password, in a protected form in memory instead of plain readable text.',
    detailedExplanation:
      'It is used so that passwords are not left lying around as normal strings. Read-Host -AsSecureString asks for one without showing the letters on screen. Be careful: it protects the value in memory only, so never treat it as a full lock.',
    example: `$pw = Read-Host "Password" -AsSecureString    (typed letters appear as stars)`,
    codeExample: `$s = ConvertTo-SecureString 'demo' -AsPlainText -Force; $s.GetType().Name`,
    relatedTerms: ['Credential (PSCredential)', 'String', 'Type'],
    relatedLessonPath: '/learn/chapter-06/quotes-and-secure-io',
  },
  {
    term: 'Credential (PSCredential)',
    category: 'Security & Ethical Hacking',
    definition:
      'A credential is a user name and password bundled together so a command can sign in as that account.',
    detailedExplanation:
      'In PowerShell it is a PSCredential object whose password is stored as a SecureString. Get-Credential pops up a box asking you for the pair. Remoting and many admin commands accept it through a -Credential parameter.',
    example: `$cred = Get-Credential    (opens a box asking for user name and password)`,
    codeExample: `Get-Command Get-Credential | Select-Object Name, Source`,
    relatedTerms: ['SecureString', 'Remoting', 'Session (PSSession)'],
    relatedLessonPath: '/learn/chapter-06/quotes-and-secure-io',
  },

  // ==========================================================================
  // SAFETY, ERRORS AND SCRIPTING HABITS
  // ==========================================================================
  {
    term: '-WhatIf',
    category: 'Scripting & Functions',
    definition:
      'The -WhatIf switch makes a command only describe what it would do, without actually doing it.',
    detailedExplanation:
      'It is a rehearsal: you read the message, and only if it looks right do you run the command again without -WhatIf. Always rehearse first with commands that delete, stop or change things. Not every command supports it, so check with Get-Help.',
    codeExample: `Stop-Process -Id $PID -WhatIf`,
    relatedTerms: ['-Confirm', 'Switch Parameter', 'Idempotent'],
    relatedLessonPath: '/learn/chapter-07/select-sort-and-safety',
  },
  {
    term: '-Confirm',
    category: 'Scripting & Functions',
    definition:
      'The -Confirm switch makes a command stop and ask you yes or no before it makes each change.',
    detailedExplanation:
      'It gives you a safety brake on risky actions. Some dangerous commands ask on their own, and -Confirm forces the question on commands that normally would not. Answer N (or No) if you are not sure.',
    example: `Remove-Item .\\old.txt -Confirm   (asks before deleting)`,
    codeExample: `Get-Help Stop-Process -Parameter Confirm`,
    relatedTerms: ['-WhatIf', 'Switch Parameter'],
    relatedLessonPath: '/learn/chapter-07/select-sort-and-safety',
  },
  {
    term: 'ErrorAction',
    category: 'Scripting & Functions',
    definition:
      'The -ErrorAction parameter tells a command what to do when something goes wrong: show it, hide it, or stop completely.',
    detailedExplanation:
      'The common choices are Continue (the default), SilentlyContinue (hide the error), and Stop (turn it into a serious error you can catch with try and catch). Every cmdlet has this parameter. Use SilentlyContinue sparingly, because hiding errors hides problems.',
    codeExample: `Get-Item C:\\DoesNotExist -ErrorAction SilentlyContinue`,
    relatedTerms: ['Stream', 'Parameter', 'Script'],
    relatedLessonPath: '/learn/chapter-14/error-handling-and-splatting',
  },
  {
    term: 'Idempotent',
    category: 'Scripting & Functions',
    definition:
      'A script is idempotent when running it twice leaves the computer in exactly the same state as running it once.',
    detailedExplanation:
      'A good example is "make sure folder X exists": the second run finds it already there and does nothing. A bad example is "add a line to a file", which adds another copy every time. Idempotent scripts are safe to repeat after a failure.',
    example: `Idempotent: create the folder only if Test-Path says it is missing. Not idempotent: always append a line to a log.`,
    relatedTerms: ['-WhatIf', 'Script', 'Boolean'],
    relatedLessonPath: '/learn/chapter-14/error-handling-and-splatting',
  },

  // ==========================================================================
  // MODULES AND PACKAGES
  // ==========================================================================
  {
    term: 'Module',
    category: 'Core Concepts',
    definition:
      'A module is a package of related PowerShell commands that you can load to gain new abilities.',
    detailedExplanation:
      'Windows ships with many modules, and others add commands for things like Active Directory or Azure. PowerShell loads most modules automatically the first time you use one of their commands. Import-Module loads one by hand.',
    codeExample: `Get-Module -ListAvailable | Select-Object -First 5 Name, Version`,
    relatedTerms: ['PowerShell Gallery', 'NuGet', 'Cmdlet (Verb-SingularNoun)', 'Function'],
    relatedLessonPath: '/learn/chapter-11/module-lifecycle',
  },
  {
    term: 'PowerShell Gallery',
    category: 'Core Concepts',
    definition:
      'The PowerShell Gallery is the free online store where people share modules and scripts you can install with one command.',
    detailedExplanation:
      'Commands such as Find-Module and Install-Module talk to it. Anyone can publish there, so only install modules from authors you trust and read what they do. The Gallery is registered on your computer under the name PSGallery.',
    codeExample: `Get-PSRepository`,
    relatedTerms: ['Module', 'NuGet'],
    relatedLessonPath: '/learn/chapter-11/module-lifecycle',
  },
  {
    term: 'NuGet',
    category: 'Core Concepts',
    definition:
      'NuGet is a package system for downloading software parts, and PowerShell uses it behind the scenes to fetch modules.',
    detailedExplanation:
      'If PowerShell says it needs the NuGet provider before it can install a module, it means it needs this helper once. It is the delivery truck, and the PowerShell Gallery is the shop it delivers from. Accepting the prompt installs a small component.',
    relatedTerms: ['PowerShell Gallery', 'Module'],
    relatedLessonPath: '/learn/chapter-11/module-lifecycle',
  },

  // ==========================================================================
  // WINDOWS INTERNALS
  // ==========================================================================
  {
    term: 'Registry',
    category: 'Windows Internals',
    definition:
      'The registry is a big built-in database where Windows and programs keep their settings.',
    detailedExplanation:
      'It is organised like folders, called keys, that hold named values. PowerShell lets you browse it like a drive, for example HKLM: for machine-wide settings and HKCU: for the current user. Changing the wrong value can break Windows, so look first and change only what you understand.',
    codeExample: `Get-ItemProperty 'HKLM:\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion' | Select-Object ProductName`,
    relatedTerms: ['PSProvider & PSDrive', 'Service'],
    relatedLessonPath: '/learn/chapter-08/psproviders-and-psdrives',
  },
  {
    term: 'Service',
    category: 'Windows Internals',
    definition:
      'A service is a program that runs in the background without a window, often starting by itself when Windows starts.',
    detailedExplanation:
      'Printing, networking and updates all depend on services. Each has a name, a status such as Running or Stopped, and a start type. Get-Service lists them, and stopping or changing important ones needs administrator rights.',
    codeExample: `Get-Service | Select-Object -First 3 Name, Status`,
    relatedTerms: ['PID (Process ID)', 'Driver', 'Administrator (Elevated) vs. Standard User'],
    relatedLessonPath: '/learn/chapter-02/system-processes-and-service-accounts',
  },
  {
    term: 'PID (Process ID)',
    category: 'Windows Internals',
    definition:
      'A PID is the unique number Windows gives to each running program (process) so it can tell them apart.',
    detailedExplanation:
      'You use the PID to point at exactly one process, especially when several have the same name. The number changes every time the program starts. In PowerShell the variable $PID holds the PID of your own PowerShell window.',
    codeExample: `$PID; Get-Process -Id $PID | Select-Object Name, Id`,
    relatedTerms: ['Service', 'Process vs. Thread', 'Handle & Handle Table'],
    relatedLessonPath: '/learn/chapter-01/processes-threads-and-handles',
  },
  {
    term: 'Driver',
    category: 'Windows Internals',
    definition:
      'A driver is a small program that lets Windows talk to a piece of hardware, such as a graphics card or printer.',
    detailedExplanation:
      'Most drivers run in kernel mode, with very high privileges, so a faulty one can crash the whole computer. Their files usually end in .sys. This is why Windows checks that drivers are digitally signed.',
    codeExample: `Get-CimInstance Win32_SystemDriver | Select-Object -First 3 Name, State`,
    relatedTerms: ['Kernel', 'Service'],
    relatedLessonPath: '/learn/chapter-02/user-vs-kernel-mode-syscalls',
  },
  {
    term: 'Kernel',
    category: 'Windows Internals',
    definition:
      'The kernel is the core of Windows that controls the hardware, memory and every running program.',
    detailedExplanation:
      'Normal programs are not allowed to touch the hardware directly; they ask the kernel to do it. The kernel file on Windows is ntoskrnl.exe. Because the kernel is so powerful, it runs in a protected mode that user programs cannot enter.',
    codeExample: `Get-Item C:\\Windows\\System32\\ntoskrnl.exe | Select-Object Name, Length`,
    relatedTerms: ['Driver', 'System Call (Syscall)', 'PID (Process ID)'],
    relatedLessonPath: '/learn/chapter-02/user-vs-kernel-mode-syscalls',
  },
  {
    term: 'System Call (Syscall)',
    category: 'Windows Internals',
    definition:
      'A system call is a request from a normal program to the kernel asking it to do something the program is not allowed to do itself.',
    detailedExplanation:
      'Reading a file, opening a network connection and starting a process all end in system calls. The program hands the request over and waits for the kernel to answer. It is the official doorway between the limited user side and the powerful kernel side.',
    example: `When Notepad saves a file, it makes a system call asking the kernel to write the data to disk.`,
    relatedTerms: ['Kernel', 'Driver', 'Handle & Handle Table'],
    relatedLessonPath: '/learn/chapter-02/user-vs-kernel-mode-syscalls',
  },
  {
    term: 'Event Log',
    category: 'Security & Ethical Hacking',
    definition:
      'The event log is Windows built-in diary where the system and programs write down what happened and when.',
    detailedExplanation:
      'There are separate logs such as Application, System and Security. They are the first place to look when something crashes or when you need to know who signed in. Get-WinEvent reads them without changing anything.',
    codeExample: `Get-WinEvent -LogName Application -MaxEvents 3`,
    relatedTerms: ['Event ID', 'Service'],
    relatedLessonPath: '/learn/chapter-16/powershell-auditing-and-logging',
  },
  {
    term: 'Event ID',
    category: 'Security & Ethical Hacking',
    definition:
      'An Event ID is the number that labels the type of entry in an event log, such as 4624 for a successful sign-in.',
    detailedExplanation:
      'The same number always means the same kind of event for the same source, so you can search for it. For example 4104 records PowerShell script blocks and 4625 records a failed sign-in. Filtering by Event ID turns a huge log into a short list.',
    codeExample: `Get-WinEvent -FilterHashtable @{ LogName = 'Application' } -MaxEvents 3 | Select-Object Id, ProviderName`,
    relatedTerms: ['Event Log', 'Hashtable'],
    relatedLessonPath: '/learn/chapter-16/powershell-auditing-and-logging',
  },

  // ==========================================================================
  // NETWORKING
  // ==========================================================================
  {
    term: 'IP Address',
    category: 'Active Directory & Networking',
    definition:
      'An IP address is the number that identifies a computer on a network, like 192.168.1.20, in the same way a street address identifies a house.',
    detailedExplanation:
      'IPv4 addresses are four numbers from 0 to 255 separated by dots. Addresses beginning with 192.168 or 10 are private and only work inside your own network. Your IP address can change over time if it comes from DHCP.',
    codeExample: `Get-NetIPAddress -AddressFamily IPv4 | Select-Object IPAddress, PrefixLength, InterfaceAlias`,
    relatedTerms: ['Subnet', 'DHCP', 'DNS', 'Port'],
    relatedLessonPath: '/learn/chapter-12/ad-forests-dns-and-fgpp',
  },
  {
    term: 'Subnet',
    category: 'Active Directory & Networking',
    definition:
      'A subnet is a smaller group of IP addresses on one part of a network, such as 192.168.1.0/24.',
    detailedExplanation:
      'The number after the slash (the prefix length) says how many of the leading bits belong to the network. A /24 subnet holds 254 usable addresses. Computers on the same subnet can talk directly; to reach others they send traffic through a router.',
    example: `192.168.1.20 and 192.168.1.35 are on the same /24 subnet; 192.168.2.5 is on a different one.`,
    relatedTerms: ['IP Address', 'DHCP'],
    relatedLessonPath: '/learn/chapter-12/ad-forests-dns-and-fgpp',
  },
  {
    term: 'Port',
    category: 'Active Directory & Networking',
    definition:
      'A port is a numbered door on a computer, so that many programs can use the same network connection without mixing up their data.',
    detailedExplanation:
      'Ports run from 0 to 65535, and well-known services use fixed ones: 80 for web, 443 for secure web, 5985 for WinRM. A program that waits for connections is said to be listening on its port. Firewalls decide which ports are open.',
    codeExample: `Get-NetTCPConnection -State Listen | Select-Object -First 5 LocalAddress, LocalPort`,
    relatedTerms: ['IP Address', 'Firewall', 'WinRM (Windows Remote Management - Ports 5985 / 5986)'],
    relatedLessonPath: '/learn/chapter-13/firewall-profiles-and-rules',
  },
  {
    term: 'DNS',
    category: 'Active Directory & Networking',
    definition:
      'DNS (Domain Name System) is the network phone book that turns a name like example.com into an IP address.',
    detailedExplanation:
      'People remember names, computers need numbers, and DNS does the translating. Inside a company, Active Directory relies heavily on DNS to find domain controllers. If DNS is broken, sign-ins and remoting often fail even though the network is fine.',
    codeExample: `Resolve-DnsName localhost`,
    relatedTerms: ['IP Address', 'Domain', 'Domain Controller'],
    relatedLessonPath: '/learn/chapter-12/ad-forests-dns-and-fgpp',
  },
  {
    term: 'DHCP',
    category: 'Active Directory & Networking',
    definition:
      'DHCP is the service that automatically hands an IP address to each computer when it joins the network.',
    detailedExplanation:
      'Without it, someone would have to type an address into every device by hand. The address is lent for a limited time (a lease) and may change. Servers usually get fixed addresses so other computers can always find them.',
    codeExample: `Get-NetIPInterface -AddressFamily IPv4 | Select-Object InterfaceAlias, Dhcp`,
    relatedTerms: ['IP Address', 'Subnet', 'DNS'],
    relatedLessonPath: '/learn/chapter-12/ad-forests-dns-and-fgpp',
  },
  {
    term: 'Firewall',
    category: 'Active Directory & Networking',
    definition:
      'A firewall is software or hardware that blocks or allows network traffic based on rules.',
    detailedExplanation:
      'Windows includes Windows Defender Firewall with separate profiles for Domain, Private and Public networks. Rules can allow or block traffic by program, port or address. A blocked port is a very common reason why remoting or a web server cannot be reached.',
    codeExample: `Get-NetFirewallProfile | Select-Object Name, Enabled`,
    relatedTerms: ['Port', 'WinRM (Windows Remote Management - Ports 5985 / 5986)', 'IP Address'],
    relatedLessonPath: '/learn/chapter-13/firewall-profiles-and-rules',
  },

  // ==========================================================================
  // ACTIVE DIRECTORY
  // ==========================================================================
  {
    term: 'Domain',
    category: 'Active Directory',
    definition:
      'A domain is a group of computers, users and settings managed together from one central place by the same organisation.',
    detailedExplanation:
      'Instead of each computer having its own list of users, one shared directory knows everyone. You sign in once and can use any computer in the domain you are allowed to. A computer that is not in a domain is in a workgroup.',
    example: `A school network where your account works on every classroom computer is a domain, for example school.local.`,
    codeExample: `(Get-CimInstance Win32_ComputerSystem).PartOfDomain`,
    relatedTerms: ['Domain Controller', 'OU (Organizational Unit)', 'DNS'],
    relatedLessonPath: '/learn/chapter-12/ad-users-groups-and-ous',
  },
  {
    term: 'Domain Controller',
    category: 'Active Directory',
    definition:
      'A domain controller is the server that stores the directory of users and computers and checks passwords when people sign in.',
    detailedExplanation:
      'It is the gatekeeper of a domain. Most companies run at least two so that sign-ins still work if one fails. Because it controls access to everything, a domain controller is a favourite target and must be well protected.',
    codeExample: `$env:LOGONSERVER`,
    relatedTerms: ['Domain', 'Kerberos', 'LDAP', 'GPO (Group Policy Object)'],
    relatedLessonPath: '/learn/chapter-12/ad-users-groups-and-ous',
  },
  {
    term: 'OU (Organizational Unit)',
    category: 'Active Directory',
    definition:
      'An OU is a folder inside a domain used to group users and computers, for example a Sales OU.',
    detailedExplanation:
      'Admins use OUs to organise accounts and to apply settings (GPOs) to just one group. They can also hand someone the right to manage only that OU. Moving a user into a different OU changes which policies apply to them.',
    example: `OU=Sales,DC=contoso,DC=com is a Sales OU in the domain contoso.com.`,
    relatedTerms: ['Domain', 'DistinguishedName (DN)', 'GPO (Group Policy Object)'],
    relatedLessonPath: '/learn/chapter-12/ad-users-groups-and-ous',
  },
  {
    term: 'GPO (Group Policy Object)',
    category: 'Active Directory',
    definition:
      'A GPO is a bundle of settings that a domain automatically applies to the users or computers in an OU.',
    detailedExplanation:
      'With a GPO an admin can, for example, set a password rule or a desktop background on thousands of computers at once. Computers fetch their policies when they start and regularly after that. The Group Policy Object entry in this glossary explains the order in which policies are applied.',
    relatedTerms: ['OU (Organizational Unit)', 'Domain', 'Domain Controller'],
    relatedLessonPath: '/learn/chapter-13/gpo-rsop-and-scheduled-tasks',
  },
  {
    term: 'Kerberos',
    category: 'Active Directory',
    definition:
      'Kerberos is the ticket-based system a domain uses to prove who you are without sending your password across the network each time.',
    detailedExplanation:
      'After you sign in, the domain controller gives you a ticket, and you show that ticket to every server you use. It works like a wristband at a festival: you prove yourself once and then just show the band. Kerberos relies on correct DNS names and on all clocks being almost in sync.',
    relatedTerms: ['Domain Controller', 'Kerberos Double-Hop Problem', 'DNS'],
    relatedLessonPath: '/learn/chapter-11/winrm-and-remoting',
  },
  {
    term: 'LDAP',
    category: 'Active Directory',
    definition:
      'LDAP is the standard language programs use to search and read a directory such as Active Directory.',
    detailedExplanation:
      'When a tool asks "find all users in the Sales OU", it usually speaks LDAP to a domain controller. LDAP paths look like LDAP://OU=Sales,DC=contoso,DC=com. It normally uses port 389, or 636 when encrypted.',
    example: `A filter such as (&(objectClass=user)(department=Sales)) asks for all user accounts in the Sales department.`,
    relatedTerms: ['DistinguishedName (DN)', 'Domain Controller', 'Port'],
    relatedLessonPath: '/learn/chapter-12/ad-users-groups-and-ous',
  },
  {
    term: 'DistinguishedName (DN)',
    category: 'Active Directory',
    definition:
      'A DistinguishedName is the full unique address of an object in Active Directory, written from the object up to the domain.',
    detailedExplanation:
      'It is made of parts: CN is the common name, OU is an organizational unit and DC is a domain component. Reading it right to left takes you from the domain down to the object. Many AD commands accept or return DNs.',
    example: `CN=Ana Lee,OU=Sales,DC=contoso,DC=com`,
    relatedTerms: ['OU (Organizational Unit)', 'LDAP', 'Domain'],
    relatedLessonPath: '/learn/chapter-12/ad-users-groups-and-ous',
  },
  {
    term: 'SID (Security Identifier)',
    category: 'Security & Ethical Hacking',
    definition:
      'A SID is the unique number Windows uses internally to identify a user or group, even if the name changes.',
    detailedExplanation:
      'It looks like S-1-5-21-...-1001. Permissions are stored against the SID, not the name, so renaming an account does not lose its access. A deleted and re-created account gets a new SID, which is why it does not inherit the old one rights.',
    codeExample: `[Security.Principal.WindowsIdentity]::GetCurrent().User.Value`,
    relatedTerms: ['Domain', 'Credential (PSCredential)', 'Administrator (Elevated) vs. Standard User'],
    relatedLessonPath: '/learn/chapter-12/ad-users-groups-and-ous',
  },

  // ==========================================================================
  // REMOTING AND VIRTUALISATION
  // ==========================================================================
  {
    term: 'Remoting',
    category: 'Administration & Remoting',
    definition:
      'Remoting means running PowerShell commands on another computer across the network instead of sitting in front of it.',
    detailedExplanation:
      'Invoke-Command runs a command on one or many remote computers and sends the results back. Enter-PSSession gives you an interactive window on one machine. It relies on WinRM, so the remote computer must have it enabled and your account must be allowed.',
    example: `Invoke-Command -ComputerName Server01 -ScriptBlock { Get-Date }`,
    codeExample: `Get-Command Invoke-Command | Select-Object Name, Source`,
    relatedTerms: ['WinRM (Windows Remote Management - Ports 5985 / 5986)', 'Session (PSSession)', 'Credential (PSCredential)', 'Throttle (ThrottleLimit)'],
    relatedLessonPath: '/learn/chapter-11/winrm-and-remoting',
  },
  {
    term: 'Session (PSSession)',
    category: 'Administration & Remoting',
    definition:
      'A session is an open connection to another computer that you can keep and reuse for several commands.',
    detailedExplanation:
      'New-PSSession creates one and Enter-PSSession steps inside it. Variables and modules you load in a session stay there until you close it with Remove-PSSession. Reusing one is faster than reconnecting for every command.',
    codeExample: `Get-PSSession`,
    relatedTerms: ['Remoting', 'WinRM (Windows Remote Management - Ports 5985 / 5986)', 'Credential (PSCredential)'],
    relatedLessonPath: '/learn/chapter-11/winrm-and-remoting',
  },
  {
    term: 'Throttle (ThrottleLimit)',
    category: 'Administration & Remoting',
    definition:
      'A throttle limit caps how many computers a command talks to at the same time.',
    detailedExplanation:
      'Without a limit, one command aimed at hundreds of servers could overload your computer or the network. Invoke-Command has -ThrottleLimit, which defaults to 32. Lowering it makes a big job slower but gentler.',
    codeExample: `Get-Help Invoke-Command -Parameter ThrottleLimit`,
    relatedTerms: ['Remoting', 'Session (PSSession)'],
    relatedLessonPath: '/learn/chapter-11/winrm-and-remoting',
  },
  {
    term: 'Virtual Machine (VM)',
    category: 'Administration & Remoting',
    definition:
      'A virtual machine is a complete pretend computer that runs as a program inside a real one.',
    detailedExplanation:
      'It has its own virtual disk, memory and operating system, so you can safely practise on it without risking your real computer. Hyper-V, VirtualBox and VMware are programs that create them. Learners often use a VM for a practice server or a domain lab.',
    relatedTerms: ['ISO File', 'Snapshot (Checkpoint)'],
    relatedLessonPath: '/learn/chapter-09/headless-server-core-build',
  },
  {
    term: 'ISO File',
    category: 'Administration & Remoting',
    definition:
      'An ISO file is a single file that holds an exact copy of a disc, often used to install an operating system.',
    detailedExplanation:
      'Instead of burning a DVD you can attach the ISO to a virtual machine, which then behaves as if the disc were inserted. Microsoft offers Windows Server evaluation versions as ISO downloads. Checking the downloaded file matches the published checksum proves it was not damaged.',
    relatedTerms: ['Virtual Machine (VM)', 'Snapshot (Checkpoint)'],
    relatedLessonPath: '/learn/chapter-09/headless-server-core-build',
  },
  {
    term: 'Snapshot (Checkpoint)',
    category: 'Administration & Remoting',
    definition:
      'A snapshot, called a checkpoint in Hyper-V, is a saved point in time of a virtual machine that you can return to later.',
    detailedExplanation:
      'Take one before you try something risky, and if it goes wrong you roll the machine back in seconds. It is the safety net that makes practising dangerous commands reasonable. Do not leave many old snapshots around, because they use disk space and slow the machine.',
    example: `Take a checkpoint called "Clean install", break something while experimenting, then restore the checkpoint.`,
    relatedTerms: ['Virtual Machine (VM)', 'ISO File', '-WhatIf'],
    relatedLessonPath: '/learn/chapter-09/headless-server-core-build',
  },
];
