import { LessonGuide } from '../../types';

export const GUIDES_PART_2: Record<string, LessonGuide> = {
  '3-2': {
    analogy:
      'Think of a cmdlet name as a tiny English sentence: a verb (what to do) followed by a single thing (what to do it to). "Get Process", "Stop Service", "New LocalUser". It is like a library where every book title follows one rule, so even in a library you have never visited you can guess where to look. Aliases such as `ls` or `%` are nicknames between friends: handy in conversation, but confusing in a formal letter (a saved script).',
    plainEnglish: [
      'Every real PowerShell command (a cmdlet) is named `Verb-Noun`, for example `Get-Service`. The verb comes from an official approved list, so you always see `Remove` and never `Delete`.',
      'The noun is always singular. You type `Get-Process` even when you expect 200 results, never `Get-Processes`.',
      '`Get-Command` is your search engine for commands. With the star wildcard `*` you can find a command by only knowing part of its name.',
      'Aliases are short nicknames (`dir`, `gps`, `?`). They are fine for quick typing at the prompt but hard to read later, so scripts should always use full names.',
    ],
    beforeYouStart: [
      'Windows PowerShell 5.1 or PowerShell 7 open in a normal (non-admin) window. Everything in the beginner tier is read-only.',
      'Finished lesson 3-1, so you know what a cmdlet and a parameter are.',
      'Get used to the Tab key. Type `Get-Pro` and press Tab to let PowerShell finish the word for you.',
    ],
    atoZSteps: [
      {
        title: 'Step 1: Read a cmdlet like a sentence',
        detail:
          'Look at `Get-Service -Name Spooler`. `Get` is the verb (the action), `Service` is the singular noun (the target), `-Name` is a parameter and `Spooler` is its argument (the value).',
      },
      {
        title: 'Step 2: Meet the approved verbs',
        detail:
          'Run `Get-Verb`. This is Microsoft\'s official list. Notice you will find Remove, New, Stop and Start, but not Delete or Create.',
      },
      {
        title: 'Step 3: Search with Get-Command',
        detail:
          'Run `Get-Command -Noun Service` to see every command that works with services. You did not need to remember a single name.',
      },
      {
        title: 'Step 4: Add wildcards',
        detail:
          'Use `*` to mean "anything here". `Get-Command *Firewall*` finds any command with the word Firewall in its name.',
      },
      {
        title: 'Step 5: Decode an alias',
        detail:
          'If you meet a strange short word like `gci`, run `Get-Alias -Name gci`. It reveals the real command, `Get-ChildItem`.',
      },
      {
        title: 'Step 6: Use full names in scripts',
        detail:
          'Type nicknames freely at the prompt, but write `Where-Object` and `ForEach-Object` in files you save. Your future self (and your teammates) will thank you.',
      },
    ],
    wordsYouWillMeet: [
      { word: 'Cmdlet', meaning: 'A built-in PowerShell command, always named Verb-Noun.' },
      { word: 'Verb', meaning: 'The action part of the name, such as Get, Set, New, Remove, Start or Stop.' },
      { word: 'Noun', meaning: 'The thing being acted on. It is always singular, for example Service.' },
      { word: 'Wildcard', meaning: 'The `*` symbol that stands for "any characters", used to search by partial name.' },
      { word: 'Alias', meaning: 'A short nickname for a command, such as `dir` for Get-ChildItem.' },
    ],
    beginner: {
      intro:
        'These commands only look things up. They are the "ask the library" tools, so nothing can break. Type them yourself and read the answers.',
      commands: [
        {
          title: 'List the approved verbs',
          code: 'Get-Verb | Sort-Object Verb | Select-Object -First 10',
          whatItDoes: 'Shows the first ten approved verbs in alphabetical order, so you can see which action words PowerShell allows.',
          parts: [
            { part: 'Get-Verb', meaning: 'Lists every verb Microsoft approves for cmdlet names.' },
            { part: '|', meaning: 'The pipe. It passes the results to the next command.' },
            { part: 'Sort-Object Verb', meaning: 'Sorts the list alphabetically by the Verb column.' },
            { part: 'Select-Object -First 10', meaning: 'Keeps only the first ten rows so the screen is not flooded.' },
          ],
          watchOut: 'Remove the last part to see the whole list (about 100 verbs). Remember: it is Remove, never Delete.',
        },
        {
          title: 'Look up one command by exact name',
          code: 'Get-Command -Name Get-Process',
          whatItDoes: 'Confirms that the command exists and tells you which module it comes from.',
          parts: [
            { part: 'Get-Command', meaning: 'Searches for commands. "Get" means it only reads.' },
            { part: '-Name', meaning: 'The parameter that says which command name to look for.' },
            { part: 'Get-Process', meaning: 'The argument: the name you are checking. Notice the singular noun.' },
          ],
          watchOut: 'If you type Get-Processes you will get an error. The noun is always singular.',
        },
        {
          title: 'Find every command about services',
          code: 'Get-Command -Noun Service',
          whatItDoes: 'Lists all commands whose noun is Service, such as Get-Service, Start-Service and Stop-Service.',
          parts: [
            { part: 'Get-Command', meaning: 'The command finder.' },
            { part: '-Noun Service', meaning: 'Filters the search to commands that act on the noun "Service".' },
          ],
          sampleOutput:
            'CommandType Name            Source\n----------- ----            ------\nCmdlet      Get-Service     Microsoft.PowerShell.Management\nCmdlet      New-Service     Microsoft.PowerShell.Management\nCmdlet      Restart-Service Microsoft.PowerShell.Management\nCmdlet      Set-Service     Microsoft.PowerShell.Management',
        },
      ],
    },
    intermediate: {
      intro:
        'Now you will combine verb, noun and wildcards to discover commands you have never heard of, and learn to decode aliases.',
      commands: [
        {
          title: 'Discover network inspection commands',
          code: 'Get-Command -Verb Get -Noun *Net* | Select-Object -First 10 Name, Source',
          whatItDoes: 'Finds read-only (Get) commands that have "Net" anywhere in the noun, then shows just their names and modules.',
          parts: [
            { part: '-Verb Get', meaning: 'Only commands that read information.' },
            { part: '-Noun *Net*', meaning: 'Any noun containing "Net". The stars mean "anything before or after".' },
            { part: 'Select-Object -First 10 Name, Source', meaning: 'Shows the first ten results with only two columns.' },
          ],
          watchOut: 'Some commands only exist once their module is installed (for example Active Directory tools on a server with RSAT).',
        },
        {
          title: 'Decode a nickname and find all nicknames',
          code: 'Get-Alias -Name dir\nGet-Alias -Definition Get-ChildItem',
          whatItDoes: 'The first line turns the nickname `dir` into its real command. The second line lists every nickname that points at Get-ChildItem.',
          parts: [
            { part: 'Get-Alias -Name dir', meaning: 'You know the nickname and want the real cmdlet.' },
            { part: 'Get-Alias -Definition Get-ChildItem', meaning: 'You know the cmdlet and want all of its nicknames.' },
          ],
          sampleOutput:
            'CommandType Name\n----------- ----\nAlias       dir -> Get-ChildItem\nAlias       gci -> Get-ChildItem\nAlias       ls -> Get-ChildItem',
          watchOut: 'Do not mix up -Name (the nickname) and -Definition (the full command name).',
        },
        {
          title: 'Which verbs are used the most?',
          code: 'Get-Command -CommandType Cmdlet |\n  Group-Object Verb |\n  Sort-Object Count -Descending |\n  Select-Object -First 5 Name, Count',
          whatItDoes: 'Counts how many cmdlets use each verb and shows the five most popular. It proves how consistent the naming law is.',
          parts: [
            { part: '-CommandType Cmdlet', meaning: 'Limits the search to real cmdlets (not functions or aliases).' },
            { part: 'Group-Object Verb', meaning: 'Puts cmdlets with the same verb into one bucket and counts them.' },
            { part: 'Sort-Object Count -Descending', meaning: 'Puts the biggest group first.' },
            { part: 'Select-Object -First 5 Name, Count', meaning: 'Keeps the top five with the verb name and its count.' },
          ],
          watchOut: 'The numbers change depending on which modules are installed on your machine.',
        },
      ],
    },
    pro: {
      intro:
        'Professionals audit naming, clean up aliases in scripts and look for commands that can be dry-run before they change anything.',
      commands: [
        {
          title: 'Audit a module for non-approved verbs',
          code: '$approved = (Get-Verb).Verb\nGet-Command -Module Microsoft.PowerShell.Utility -CommandType Cmdlet |\n  Where-Object { $_.Verb -notin $approved } |\n  Select-Object Name, Verb',
          whatItDoes: 'Compares each cmdlet verb in a module against the approved list. Nothing printed means every command obeys the law. Use the same idea on your own modules.',
          parts: [
            { part: '$approved = (Get-Verb).Verb', meaning: 'Stores just the verb names in a variable called $approved.' },
            { part: '-Module', meaning: 'Limits the search to one module.' },
            { part: 'Where-Object { $_.Verb -notin $approved }', meaning: 'Keeps only commands whose verb is not in the approved list. `$_` is the current command.' },
            { part: '-notin', meaning: 'An operator meaning "is not found inside this list".' },
          ],
        },
        {
          title: 'Find aliases hiding inside a script file',
          code: '$tokens = $null; $errors = $null\n$null = [System.Management.Automation.Language.Parser]::ParseFile("$PWD\\script.ps1", [ref]$tokens, [ref]$errors)\n$tokens |\n  Where-Object { $_.TokenFlags.HasFlag([System.Management.Automation.Language.TokenFlags]::CommandName) } |\n  ForEach-Object { $a = Get-Alias -Name $_.Text -ErrorAction SilentlyContinue; if ($a) { "$($_.Text) -> $($a.Definition)" } }',
          whatItDoes: 'Reads a .ps1 file without running it, finds every command word and reports the ones that are really aliases, so you can replace them with full names.',
          parts: [
            { part: '[...Parser]::ParseFile(path, [ref]$tokens, [ref]$errors)', meaning: 'PowerShell\'s own reader. It splits the file into tokens (words) and never executes it.' },
            { part: '[ref]', meaning: 'Lets the method write its results back into your variables.' },
            { part: 'TokenFlags.HasFlag(CommandName)', meaning: 'Keeps only tokens that sit in the command position of a line.' },
            { part: 'Get-Alias -Name $_.Text -ErrorAction SilentlyContinue', meaning: 'Checks if the word is an alias and stays quiet if it is not.' },
          ],
          watchOut: 'Change script.ps1 to a real file in your current folder. This reads the file only and is safe.',
        },
        {
          title: 'Find commands that support a dry run',
          code: 'Get-Command -Module Microsoft.PowerShell.Management -CommandType Cmdlet |\n  Where-Object { $_.Parameters.ContainsKey(\'WhatIf\') } |\n  Select-Object -First 8 Name',
          whatItDoes: 'Lists commands that have a -WhatIf switch, which previews a change without making it. Use this habit before running anything that removes or stops things.',
          parts: [
            { part: '$_.Parameters', meaning: 'The dictionary of all parameters a command accepts.' },
            { part: '.ContainsKey(\'WhatIf\')', meaning: 'True only when the command has a parameter named WhatIf.' },
            { part: 'Select-Object -First 8 Name', meaning: 'Shows eight command names.' },
          ],
          watchOut: 'Not every command supports -WhatIf. Always check before relying on it for risky commands.',
        },
      ],
    },
    recap: [
      'Every cmdlet is ApprovedVerb-SingularNoun: Get-Service, Remove-Item, never Get-Services or Delete-Item.',
      'Get-Verb shows the approved verbs and Get-Command finds commands by -Name, -Verb or -Noun, with `*` wildcards.',
      'Get-Alias -Name decodes a nickname; Get-Alias -Definition lists nicknames for a cmdlet.',
      'Use aliases when typing at the prompt, but write full cmdlet names in scripts.',
    ],
  },
  '3-3': {
    analogy:
      'Think of Get-Help as the instruction manual that came inside the box of every command. You would not memorize the manual of every gadget you own. You just know where to find it, and how to jump straight to the page with pictures (the examples). Once you can read the little symbols in the manual, you can use any gadget, even one you have never seen.',
    plainEnglish: [
      'PowerShell has thousands of commands, and nobody remembers them all. Professionals remember how to ask for help.',
      '`Get-Help` shows a short description. Add `-Examples` for real sample commands, `-Parameter` for one option, or `-Full` for everything.',
      'The syntax line uses symbols: `[ ]` means optional, `< >` is the type of value expected, and `[[-Name] <String>]` means the parameter name itself may be left out.',
      'Help text is downloaded separately. `Update-Help` fetches the newest version and works offline too with `Save-Help`.',
    ],
    beforeYouStart: [
      'PowerShell 5.1 or 7 open in a normal window. Beginner and intermediate commands only read.',
      'Know the Verb-Noun idea from lesson 3-2.',
      'Updating help (pro tier) needs an elevated window and internet, so use a lab machine.',
    ],
    atoZSteps: [
      {
        title: 'Step 1: Ask for the short help',
        detail: 'Run `Get-Help Get-Process`. Read the NAME, SYNOPSIS and SYNTAX sections. The synopsis is a one-line summary.',
      },
      {
        title: 'Step 2: Jump to the examples',
        detail: 'Run `Get-Help Get-Process -Examples`. Copy an example, change the values and learn by running it.',
      },
      {
        title: 'Step 3: Decode the syntax brackets',
        detail:
          'In the SYNTAX block, anything in `[ ]` is optional. `<String[]>` means "one or more text values". `[[-Name] <String[]>]` means you may even leave out the word -Name.',
      },
      {
        title: 'Step 4: Ask about one parameter',
        detail: 'Run `Get-Help Get-Service -Parameter Name` to see what it accepts, whether it is required and whether it takes pipeline input.',
      },
      {
        title: 'Step 5: Search when you do not know the name',
        detail: 'Wildcards work here too. `Get-Help *eventlog*` lists every help topic that mentions event logs.',
      },
      {
        title: 'Step 6: Read the concept topics',
        detail: 'Topics starting with `about_` explain ideas such as operators and pipelines. List them with `Get-Help about_*`.',
      },
      {
        title: 'Step 7: Keep help fresh',
        detail: 'On a lab machine, open an elevated window and run `Update-Help`. Without it you may only see a short stub.',
      },
    ],
    wordsYouWillMeet: [
      { word: 'Synopsis', meaning: 'A one-line summary of what a command does.' },
      { word: 'Syntax', meaning: 'The "grammar" line showing every way you can write the command.' },
      { word: 'Optional', meaning: 'Shown in square brackets `[ ]`. You can leave it out.' },
      { word: 'Parameter set', meaning: 'A group of parameters that belong together. Each syntax line is one set.' },
      { word: 'about_ topic', meaning: 'A help article explaining a concept, for example about_Pipelines.' },
    ],
    beginner: {
      intro: 'Reading help is always safe. These commands only display text, so run them as often as you like.',
      commands: [
        {
          title: 'Read the short help',
          code: 'Get-Help Get-Process',
          whatItDoes: 'Shows the name, a one-line summary, the syntax and the related commands for Get-Process.',
          parts: [
            { part: 'Get-Help', meaning: 'The command that shows help pages.' },
            { part: 'Get-Process', meaning: 'The topic you want help about.' },
          ],
          watchOut: 'If you only see a short stub, the help files are not downloaded yet. See Update-Help in the pro tier.',
        },
        {
          title: 'Show real examples',
          code: 'Get-Help Get-Process -Examples',
          whatItDoes: 'Prints only the sample commands with a short explanation. This is the fastest way to learn.',
          parts: [
            { part: 'Get-Help Get-Process', meaning: 'The help for Get-Process.' },
            { part: '-Examples', meaning: 'A switch that limits the output to the examples section.' },
          ],
        },
        {
          title: 'Ask about a single parameter',
          code: 'Get-Help Get-Service -Parameter Name',
          whatItDoes: 'Explains just the -Name parameter: its type, whether it is required, its position and if it accepts pipeline input.',
          parts: [
            { part: '-Parameter Name', meaning: 'Show help only for the parameter called Name (leave out the dash).' },
            { part: 'Accept pipeline input?', meaning: 'A line in the answer that tells you how objects can flow into this parameter.' },
          ],
          watchOut: 'Type the parameter name without the dash after -Parameter.',
        },
      ],
    },
    intermediate: {
      intro: 'Search the whole help system, read concept articles and inspect help objects with the pipeline.',
      commands: [
        {
          title: 'Search all help for a topic',
          code: 'Get-Help *eventlog* | Select-Object Name, Category',
          whatItDoes: 'Finds every help topic with "eventlog" in its name and shows what kind of topic it is.',
          parts: [
            { part: '*eventlog*', meaning: 'A wildcard search: any text, then eventlog, then any text.' },
            { part: 'Select-Object Name, Category', meaning: 'Shows two columns: the topic name and its type (Cmdlet, HelpFile and so on).' },
          ],
          watchOut: 'If nothing useful appears, update help first, or try Get-Command *eventlog* to find the commands.',
        },
        {
          title: 'Read the first lines of a concept topic',
          code: 'Get-Help about_Comparison_Operators | Out-String -Stream | Select-Object -First 25',
          whatItDoes: 'Opens an about_ article and prints only the first 25 lines so you can skim it without scrolling for ages.',
          parts: [
            { part: 'about_Comparison_Operators', meaning: 'The article about -eq, -ne, -gt and friends.' },
            { part: 'Out-String -Stream', meaning: 'Turns the text into one line at a time so it can be trimmed.' },
            { part: 'Select-Object -First 25', meaning: 'Keeps just the first 25 lines.' },
          ],
        },
        {
          title: 'Which parameters take pipeline input?',
          code: '(Get-Help Get-Service -Full).parameters.parameter |\n  Where-Object { $_.pipelineInput -like \'true*\' } |\n  Select-Object name, pipelineInput',
          whatItDoes: 'Reads the full help as an object and lists only the parameters that can receive data from a pipe.',
          parts: [
            { part: '(Get-Help ... -Full)', meaning: '-Full gives the complete help. Wrapping it in brackets lets you read its properties.' },
            { part: '.parameters.parameter', meaning: 'The list of parameters inside the help object.' },
            { part: 'Where-Object { $_.pipelineInput -like \'true*\' }', meaning: 'Keeps only parameters whose pipeline setting starts with "true".' },
          ],
          sampleOutput: 'name        pipelineInput\n----        -------------\nInputObject True (ByValue)\nName        True (ByPropertyName, ByValue)',
        },
      ],
    },
    pro: {
      intro:
        'Pro habits: keep help available offline, read parameter sets straight from the command, and write your own help so your scripts document themselves. Updating help changes files on the machine, so use a lab VM and an elevated window.',
      commands: [
        {
          title: 'Download help once, install it offline',
          code: 'Save-Help -Module Microsoft.PowerShell.Management -DestinationPath C:\\HelpCache -UICulture en-US\nUpdate-Help -SourcePath C:\\HelpCache -UICulture en-US -Force',
          whatItDoes: 'The first line downloads help files to a folder. The second line installs them from that folder, which is how air-gapped servers get help.',
          parts: [
            { part: 'Save-Help', meaning: 'Downloads help files without installing them.' },
            { part: '-DestinationPath', meaning: 'The folder to save to. The folder must already exist.' },
            { part: 'Update-Help -SourcePath', meaning: 'Installs help from a local or network folder instead of the internet.' },
            { part: '-Force', meaning: 'Allows updating more than once per day.' },
          ],
          watchOut: 'Update-Help writes into the Windows folder, so it needs an elevated window. Create C:\\HelpCache first. Test on a lab VM.',
        },
        {
          title: 'Read the syntax straight from the command',
          code: 'Get-Command Get-Service -Syntax\n(Get-Command Get-Service).ParameterSets | Select-Object Name, IsDefault',
          whatItDoes: 'Prints the compact syntax lines, then lists the parameter sets and which one is the default.',
          parts: [
            { part: '-Syntax', meaning: 'Shows only the syntax summary, no description.' },
            { part: '.ParameterSets', meaning: 'Each set is one valid combination of parameters.' },
            { part: 'IsDefault', meaning: 'True for the set PowerShell picks when it cannot tell which you meant.' },
          ],
          watchOut: 'You cannot mix parameters from different sets in the same command.',
        },
        {
          title: 'Give your own function built-in help',
          code: 'function Get-Hello {\n  <#\n  .SYNOPSIS\n  Says hello to a name.\n  .EXAMPLE\n  Get-Hello -Name Sam\n  #>\n  param([string]$Name = \'World\')\n  "Hello, $Name"\n}\nGet-Help Get-Hello -Examples',
          whatItDoes: 'Creates a tiny function with comment-based help, then reads that help exactly like help for a built-in command.',
          parts: [
            { part: '<# ... #>', meaning: 'A block comment. The dotted words inside become help sections.' },
            { part: '.SYNOPSIS / .EXAMPLE', meaning: 'Special keywords that Get-Help recognizes.' },
            { part: 'param([string]$Name = \'World\')', meaning: 'Declares the -Name parameter with a default value.' },
          ],
          sampleOutput: 'NAME\n    Get-Hello\n\n    -------------------------- EXAMPLE 1 --------------------------\n    Get-Hello -Name Sam',
          watchOut: 'The function only lives in your current session and disappears when you close the window.',
        },
      ],
    },
    recap: [
      'Get-Help <name> for the summary, -Examples for samples, -Parameter for one option and -Full for everything.',
      'In syntax, `[ ]` means optional and `<Type>` shows the kind of value expected.',
      'Search with wildcards (`Get-Help *topic*`) and read concept articles with `about_` topics.',
      'Update-Help (or Save-Help for offline) keeps help current; comment-based help documents your own scripts.',
    ],
  },
  '4-1': {
    analogy:
      'Think of every result in PowerShell as a real object on a table, like a car. A car has properties (colour, speed, fuel level) that you can read, and methods (start, stop, honk) that make it do something. `Get-Member` is the X-ray scanner that shows you everything about the car, including features that are not painted on the outside.',
    plainEnglish: [
      'In PowerShell almost everything is an object. A service, a process, a file and even a piece of text each have a type, properties (facts) and methods (actions).',
      'You read a property with a dot: `$service.Status`. You perform an action with a dot and brackets: `"hello".ToUpper()`.',
      'The screen only shows a few columns. The object usually carries many more facts that you cannot see until you scan it with `Get-Member`.',
      'Always scan before you filter or select. It tells you the exact property names to use.',
    ],
    beforeYouStart: [
      'PowerShell 5.1 or 7 in a normal window. Beginner commands only read.',
      'Know how the pipe `|` passes results to the next command (lesson 3).',
      'Remember: a property is a noun-like fact (Name), a method is a verb-like action (Kill).',
    ],
    atoZSteps: [
      {
        title: 'Step 1: Get one real object',
        detail: 'Run `Get-Service -Name Spooler`. That single row on screen is a whole object behind the scenes.',
      },
      {
        title: 'Step 2: Scan it with Get-Member',
        detail: 'Pipe it: `Get-Service -Name Spooler | Get-Member`. The first line, TypeName, tells you what kind of object it is.',
      },
      {
        title: 'Step 3: Read a property',
        detail: 'Wrap the command in brackets and add a dot: `(Get-Service -Name Spooler).Status`. You just read one fact.',
      },
      {
        title: 'Step 4: Meet a method',
        detail: 'Run `"powershell".ToUpper()`. The brackets after the name show it is an action, and it returns a new value.',
      },
      {
        title: 'Step 5: Filter by property',
        detail: 'Use a property name from Get-Member in `Where-Object`, for example `Where-Object Status -eq \'Running\'`.',
      },
      {
        title: 'Step 6: Look inside any variable',
        detail: 'Store an object in a variable and use `$var.PSObject.Properties` to see every property with its value.',
      },
    ],
    wordsYouWillMeet: [
      { word: 'Object', meaning: 'A thing with a type, facts (properties) and actions (methods).' },
      { word: 'Property', meaning: 'A fact about the object, such as Name or Status. Read with a dot.' },
      { word: 'Method', meaning: 'An action the object can perform, such as ToUpper() or Kill().' },
      { word: 'Class / Type', meaning: 'The blueprint an object is made from, for example System.Diagnostics.Process.' },
      { word: 'Get-Member', meaning: 'The cmdlet that lists all properties and methods of whatever you pipe in.' },
    ],
    beginner: {
      intro: 'These commands only read facts and inspect objects, so nothing is changed. Run them and compare what you see with what you expected.',
      commands: [
        {
          title: 'Read one property',
          code: '(Get-Date).DayOfWeek',
          whatItDoes: 'Gets the current date and time object and reads just its DayOfWeek property, giving a day name like Monday.',
          parts: [
            { part: 'Get-Date', meaning: 'Creates an object holding the current date and time.' },
            { part: '( )', meaning: 'Run the command first, then use its result.' },
            { part: '.DayOfWeek', meaning: 'A dot followed by a property name reads that one fact.' },
          ],
        },
        {
          title: 'X-ray a service object',
          code: 'Get-Service -Name Spooler | Get-Member -MemberType Property',
          whatItDoes: 'Lists every property a service object has (Name, Status, DisplayName and more) so you know what you can read or filter on.',
          parts: [
            { part: 'Get-Service -Name Spooler', meaning: 'Returns the Print Spooler service object.' },
            { part: 'Get-Member', meaning: 'Shows the members (properties and methods) of whatever arrives from the pipe.' },
            { part: '-MemberType Property', meaning: 'Shows only properties and hides methods.' },
          ],
          watchOut: 'Get-Member shows the shape of the data, not the values. Use Select-Object * to see values.',
        },
        {
          title: 'Call a method on text',
          code: '"powershell".ToUpper()',
          whatItDoes: 'Text is an object too. The ToUpper method returns the text in capital letters and does not change the original.',
          parts: [
            { part: '"powershell"', meaning: 'A string object (text).' },
            { part: '.ToUpper', meaning: 'The method name.' },
            { part: '()', meaning: 'Brackets mean "run this action now". Methods always need them, even when empty.' },
          ],
          sampleOutput: 'POWERSHELL',
        },
      ],
    },
    intermediate: {
      intro: 'Now you will use property names from Get-Member to filter, sort and discover methods, all without changing anything.',
      commands: [
        {
          title: 'Find the biggest memory users',
          code: 'Get-Process |\n  Where-Object { $_.WorkingSet64 -gt 200MB } |\n  Sort-Object WorkingSet64 -Descending |\n  Select-Object -First 5 Name, Id, WorkingSet64',
          whatItDoes: 'Keeps processes using more than 200 MB of memory, sorts the largest first and shows five of them.',
          parts: [
            { part: '$_', meaning: 'The current item moving down the pipeline.' },
            { part: '.WorkingSet64', meaning: 'A property holding the memory in use, in bytes.' },
            { part: '-gt 200MB', meaning: '"Greater than 200 megabytes". PowerShell understands the MB shortcut.' },
            { part: 'Sort-Object ... -Descending', meaning: 'Largest values first.' },
          ],
          watchOut: 'If nothing shows, lower the number, for example 50MB.',
        },
        {
          title: 'Find out the exact type of an object',
          code: '$svc = Get-Service -Name Spooler\n$svc.GetType().FullName\n$svc.Status',
          whatItDoes: 'Saves the object in a variable, asks it for its full type name and then reads its Status property.',
          parts: [
            { part: '$svc =', meaning: 'Puts the object into a variable called svc.' },
            { part: '.GetType().FullName', meaning: 'A method that returns the type, then a property that gives its long name.' },
            { part: '$svc.Status', meaning: 'Reads the Status property, such as Running or Stopped.' },
          ],
          sampleOutput: 'System.ServiceProcess.ServiceController\nRunning',
        },
        {
          title: 'Discover actions without running them',
          code: 'Get-Process |\n  Get-Member -MemberType Method |\n  Where-Object Name -in \'Kill\', \'Refresh\', \'WaitForExit\' |\n  Select-Object Name, Definition',
          whatItDoes: 'Lists some methods a process object has. It only describes them, it does not run them.',
          parts: [
            { part: '-MemberType Method', meaning: 'Shows only actions.' },
            { part: 'Where-Object Name -in ...', meaning: 'Keeps members whose Name is in the given list.' },
            { part: 'Definition', meaning: 'Shows how to call the method and what it returns.' },
          ],
          watchOut: 'Never call Kill() casually. It ends a process instantly with no questions asked.',
        },
      ],
    },
    pro: {
      intro:
        'Pro habits: prefer safe cmdlets over raw methods, use static members, and introspect objects in scripts. Keep experiments in a lab VM.',
      commands: [
        {
          title: 'Preview a dangerous action with -WhatIf',
          code: 'Get-Process -Name notepad -ErrorAction SilentlyContinue | Stop-Process -WhatIf',
          whatItDoes: 'Shows what would happen if Notepad processes were stopped, without stopping anything. Safer than calling the Kill() method yourself.',
          parts: [
            { part: '-ErrorAction SilentlyContinue', meaning: 'Hides the error if Notepad is not running.' },
            { part: 'Stop-Process', meaning: 'The cmdlet that ends a process, using the object from the pipe.' },
            { part: '-WhatIf', meaning: 'Shows "What if: ..." and does nothing.' },
          ],
          sampleOutput: 'What if: Performing the operation "Stop-Process" on target "notepad (4120)".',
          watchOut: 'Remove -WhatIf only in a lab, and only when you are sure which processes match.',
        },
        {
          title: 'Use static members that belong to the type',
          code: '[System.IO.Path]::Combine(\'C:\\Logs\', \'app.log\')\n[Math]::Round(3.14159, 2)',
          whatItDoes: 'Calls ready-made helper methods. The first builds a correct file path, the second rounds a number.',
          parts: [
            { part: '[System.IO.Path]', meaning: 'The type (blueprint) written in square brackets.' },
            { part: '::', meaning: 'Means "use a static member of the type itself", no object needed.' },
            { part: 'Combine(...)', meaning: 'Joins path pieces with the right backslash.' },
            { part: '[Math]::Round(x, 2)', meaning: 'Rounds to two decimal places.' },
          ],
          sampleOutput: 'C:\\Logs\\app.log\n3.14',
          watchOut: 'Discover these with `[System.IO.Path] | Get-Member -Static`.',
        },
        {
          title: 'Dump every property and its type',
          code: '$obj = Get-Service | Select-Object -First 1\n$obj.PSObject.Properties |\n  Select-Object Name, TypeNameOfValue, Value',
          whatItDoes: 'Lists each property of an object with its type and current value, which is perfect for exploring unknown data.',
          parts: [
            { part: '.PSObject', meaning: 'A hidden helper that exposes the object\'s structure.' },
            { part: '.Properties', meaning: 'The full list of properties, including ones hidden by the default view.' },
            { part: 'TypeNameOfValue', meaning: 'The data type each property holds.' },
          ],
        },
      ],
    },
    recap: [
      'Everything in PowerShell is an object with a type, properties (facts) and methods (actions).',
      'Read a property with `.Name` and call a method with `.Method()`.',
      'Pipe into Get-Member before you filter or select, it shows you the exact names.',
      'Prefer cmdlets with -WhatIf over raw methods like Kill(), and use `::` for static members.',
    ],
  },
  '4-2': {
    analogy:
      'Think of the PowerShell screen as a shop window. The shop owner arranges only a few nice items in the window (the default columns), but the whole stock sits in the back room (all the properties). Format cmdlets only decorate the window. If you need to carry the goods somewhere else, you must pick the real items from the back room first. And [PSCustomObject] lets you build your own tidy box of goods.',
    plainEnglish: [
      'What you see on screen is a formatted view. PowerShell hides many properties and picks a few columns for readability.',
      'The `Format-*` cmdlets (`Format-Table`, `Format-List`, `Format-Wide`) turn objects into display-only text. Use them last, never before exporting or sorting.',
      'A calculated property is a column you invent with `@{Name=...; Expression={...}}`, for example memory in MB or minutes a process has been running.',
      '`[PSCustomObject]@{...}` builds a clean object with exactly the properties you choose, which is the best way to create reports.',
    ],
    beforeYouStart: [
      'PowerShell 5.1 or 7 in a normal window. Nothing here changes the system.',
      'Be comfortable with `Select-Object` and the pipe from lesson 4-1.',
      'Know that `$_` means the current object in a pipeline block.',
    ],
    atoZSteps: [
      {
        title: 'Step 1: See the default view',
        detail: 'Run `Get-Service | Select-Object -First 3`. Notice only three columns appear.',
      },
      {
        title: 'Step 2: Reveal the hidden facts',
        detail: 'Run `Get-Service -Name Spooler | Format-List *`. The star shows every property, not just the default ones.',
      },
      {
        title: 'Step 3: Choose how to display',
        detail: 'Use `Format-Table` for columns, `Format-List` for one property per line, and `Format-Wide` for names in compact columns.',
      },
      {
        title: 'Step 4: Create a calculated property',
        detail: 'Inside `Select-Object`, add `@{Name=\'MemMB\'; Expression={ [math]::Round($_.WorkingSet64 / 1MB, 1) }}` to make a new column.',
      },
      {
        title: 'Step 5: Keep Format last',
        detail: 'Do your Where-Object, Sort-Object and Select-Object first. Add Format-Table only at the very end, only for your eyes.',
      },
      {
        title: 'Step 6: Build a custom object',
        detail: 'Write `[PSCustomObject]@{ Computer = $env:COMPUTERNAME; User = $env:USERNAME }` to create your own tidy record.',
      },
    ],
    wordsYouWillMeet: [
      { word: 'Formatting', meaning: 'Changing how objects look on screen without changing the objects.' },
      { word: 'Calculated property', meaning: 'A new column you define with a name and a code block that works it out.' },
      { word: 'Hashtable', meaning: 'A set of key = value pairs written as `@{ Key = Value }`.' },
      { word: '[PSCustomObject]', meaning: 'A way to create your own object with the properties you pick.' },
      { word: 'Expression', meaning: 'The code block `{ ... }` that calculates a value for each object.' },
    ],
    beginner: {
      intro: 'These commands only change how results look on screen. Nothing on your computer is modified.',
      commands: [
        {
          title: 'A tidy table',
          code: 'Get-Process | Select-Object -First 3 Name, Id | Format-Table -AutoSize',
          whatItDoes: 'Shows three processes in a neat table with columns sized to fit.',
          parts: [
            { part: 'Select-Object -First 3 Name, Id', meaning: 'Keeps three rows and two properties.' },
            { part: 'Format-Table', meaning: 'Displays objects as a table.' },
            { part: '-AutoSize', meaning: 'Makes columns just wide enough for the data.' },
          ],
        },
        {
          title: 'Reveal every hidden property',
          code: 'Get-Service -Name Spooler | Format-List *',
          whatItDoes: 'Shows every property of the service, one per line, including ones the normal view hides.',
          parts: [
            { part: 'Format-List', meaning: 'Displays one property per line.' },
            { part: '*', meaning: 'A wildcard meaning "all properties".' },
          ],
          watchOut: 'Format-List is for reading only. Do not pipe its output into other commands.',
        },
        {
          title: 'Compact names in columns',
          code: 'Get-Service | Select-Object -First 8 | Format-Wide -Property Name -Column 4',
          whatItDoes: 'Prints only the service names, four per row, to scan many names quickly.',
          parts: [
            { part: 'Format-Wide', meaning: 'Shows a single property in several columns.' },
            { part: '-Property Name', meaning: 'Which property to display.' },
            { part: '-Column 4', meaning: 'How many columns to use.' },
          ],
        },
      ],
    },
    intermediate: {
      intro: 'Make your own columns with calculated properties, and see why formatting must come last when you export data.',
      commands: [
        {
          title: 'How long has a process been running?',
          code: 'Get-Process -ErrorAction SilentlyContinue |\n  Where-Object StartTime |\n  Select-Object -First 5 Name,\n    @{Name = \'RunMinutes\'; Expression = { [math]::Round(((Get-Date) - $_.StartTime).TotalMinutes, 1) }}',
          whatItDoes: 'Subtracts each process start time from now to create a new RunMinutes column.',
          parts: [
            { part: 'Where-Object StartTime', meaning: 'Skips processes where the start time is blank.' },
            { part: '@{Name = ...; Expression = { ... }}', meaning: 'A hashtable describing the new column: its heading and how to compute it.' },
            { part: '(Get-Date) - $_.StartTime', meaning: 'Now minus start time gives a TimeSpan, a length of time.' },
            { part: '[math]::Round(x, 1)', meaning: 'Rounds to one decimal place.' },
          ],
          watchOut: 'Protected system processes may hide their start time without an elevated window.',
        },
        {
          title: 'Show memory in megabytes',
          code: 'Get-Process |\n  Sort-Object WorkingSet64 -Descending |\n  Select-Object -First 5 Name, @{n = \'MemMB\'; e = { [math]::Round($_.WorkingSet64 / 1MB, 1) }}',
          whatItDoes: 'Turns raw bytes into a friendly MemMB column for the five biggest memory users.',
          parts: [
            { part: 'n = / e =', meaning: 'Short forms of Name and Expression.' },
            { part: '$_.WorkingSet64 / 1MB', meaning: 'Divides bytes by one megabyte.' },
            { part: 'Sort-Object ... -Descending', meaning: 'Biggest first.' },
          ],
        },
        {
          title: 'Why Format-Table breaks exports',
          code: 'Get-Process | Select-Object -First 3 Name, Id | ConvertTo-Csv -NoTypeInformation',
          whatItDoes: 'Converts clean objects to CSV text in the window. Put Format-Table before this and you would get junk instead of real data.',
          parts: [
            { part: 'ConvertTo-Csv', meaning: 'Turns objects into comma-separated text without saving a file.' },
            { part: '-NoTypeInformation', meaning: 'Skips the type header line in Windows PowerShell 5.1 (harmless in 7).' },
          ],
          watchOut: 'Format-* cmdlets output display instructions, not data. Always keep them as the last step.',
        },
      ],
    },
    pro: {
      intro: 'Pro habits: output clean custom objects from your scripts so that anyone can sort, filter and export them.',
      commands: [
        {
          title: 'Build one custom object',
          code: '$report = [PSCustomObject]@{\n  ComputerName = $env:COMPUTERNAME\n  User         = $env:USERNAME\n  Checked      = Get-Date\n}\n$report',
          whatItDoes: 'Creates a single object with three named properties and displays it.',
          parts: [
            { part: '[PSCustomObject]', meaning: 'Turns the hashtable into a real object.' },
            { part: '@{ ... }', meaning: 'A hashtable of Name = value pairs, one per line.' },
            { part: '$env:COMPUTERNAME', meaning: 'Reads an environment variable.' },
          ],
        },
        {
          title: 'Turn many items into custom objects',
          code: '$rows = Get-Service | Where-Object Status -eq \'Running\' | ForEach-Object {\n  [PSCustomObject]@{\n    Name      = $_.Name\n    Display   = $_.DisplayName\n    StartType = $_.StartType\n  }\n}\n$rows | Sort-Object Name | Select-Object -First 5',
          whatItDoes: 'Builds one tidy object for each running service, stores the list and shows five rows.',
          parts: [
            { part: 'ForEach-Object { ... }', meaning: 'Runs the block once per service.' },
            { part: '$_', meaning: 'The current service.' },
            { part: '$rows =', meaning: 'Stores all the new objects as a list.' },
          ],
        },
        {
          title: 'Keep property order and convert to JSON',
          code: '$o = [ordered]@{ Host = $env:COMPUTERNAME; Time = (Get-Date).ToString(\'s\') }\n[PSCustomObject]$o | ConvertTo-Json',
          whatItDoes: 'Creates an object with properties in the order you wrote them, then converts it to JSON for APIs and logs.',
          parts: [
            { part: '[ordered]', meaning: 'Keeps the keys in the order written.' },
            { part: '.ToString(\'s\')', meaning: 'Formats the date as a sortable text like 2026-11-04T03:47:50.' },
            { part: 'ConvertTo-Json', meaning: 'Converts the object to JSON text.' },
          ],
        },
      ],
    },
    recap: [
      'The screen shows a formatted view; the real object often has many more properties.',
      'Format-Table, Format-List and Format-Wide are for display only and must come last.',
      'Calculated properties add your own columns with @{Name=...; Expression={...}}.',
      '[PSCustomObject]@{...} builds clean objects that are easy to sort, export and convert.',
    ],
  },
  '5-1': {
    analogy:
      'Imagine a sushi conveyor belt. The chef (the first command) puts whole plates (objects) on the belt, and the next person (the second command) picks up plates. But the picker only grabs a plate if it matches what they are looking for: either the whole plate is the right kind (ByValue), or the plate has a label that matches the picker\'s tray name (ByPropertyName). If neither matches, the plate rides past and you get an error.',
    plainEnglish: [
      'The pipe `|` sends whole objects, not text, from one command to the next. The second command must know which of its parameters should receive them.',
      'ByValue: PowerShell looks at the type of the incoming object. If it matches a parameter that accepts that type from the pipeline, it binds.',
      'ByPropertyName: if ByValue fails, PowerShell looks for a property on the incoming object whose name matches a parameter name (or its alias).',
      'That is why `"bits" | Get-Service` works but `"explorer" | Get-Process` fails. Get-Service accepts text ByValue for -Name, while Get-Process only accepts -Name ByPropertyName, and a plain string has no Name property.',
      'You never have to guess. `Get-Help <cmdlet> -Parameter *` tells you "Accept pipeline input?" for every parameter.',
    ],
    beforeYouStart: [
      'PowerShell 5.1 or 7 in a normal window. Beginner and intermediate tiers only read information.',
      'Know what an object and a property are (lesson 4-1).',
      'Know how to use Get-Help -Parameter from lesson 3-3.',
    ],
    atoZSteps: [
      {
        title: 'Step 1: Try a pipe that works',
        detail: 'Run `\'bits\' | Get-Service`. A text value flows into Get-Service and it finds the service.',
      },
      {
        title: 'Step 2: Try one that fails',
        detail: 'Run `\'explorer\' | Get-Process`. Read the red error: the input cannot be bound to any parameter. That is the lesson.',
      },
      {
        title: 'Step 3: Ask the help system why',
        detail: 'Run `Get-Help Get-Process -Parameter Name` and look at "Accept pipeline input?". It says ByPropertyName only.',
      },
      {
        title: 'Step 4: Give the object a matching property',
        detail: 'Build an object with a Name property: `[PSCustomObject]@{ Name = \'explorer\' } | Get-Process`. Now ByPropertyName succeeds.',
      },
      {
        title: 'Step 5: Rename when names differ',
        detail: 'Use a calculated property in Select-Object to rename a property so it matches the parameter name.',
      },
      {
        title: 'Step 6: Preview before changing',
        detail: 'When the second command changes things (Stop-Service, Remove-Item), add `-WhatIf` first to see what would be bound and changed.',
      },
    ],
    wordsYouWillMeet: [
      { word: 'Pipeline', meaning: 'The conveyor belt that passes objects from one command to the next.' },
      { word: 'Parameter binding', meaning: 'PowerShell\'s process of deciding which parameter receives the piped object.' },
      { word: 'ByValue', meaning: 'Binding by the object\'s type: "this whole thing is what I accept".' },
      { word: 'ByPropertyName', meaning: 'Binding by a property whose name matches a parameter name.' },
      { word: 'InputObject', meaning: 'The parameter many cmdlets use to receive whole objects ByValue.' },
    ],
    beginner: {
      intro: 'Everything here is read-only. You will see one command work, one fail on purpose (harmless) and how to ask help for the reason.',
      commands: [
        {
          title: 'A pipe that works (ByValue)',
          code: '\'bits\' | Get-Service',
          whatItDoes: 'Sends the text bits down the pipe. Get-Service accepts text for its -Name parameter by value, so it shows the BITS service.',
          parts: [
            { part: '\'bits\'', meaning: 'A string (text) object.' },
            { part: '|', meaning: 'The pipe.' },
            { part: 'Get-Service', meaning: 'Receives the text and treats it as a service name.' },
          ],
        },
        {
          title: 'A pipe that fails on purpose',
          code: '\'explorer\' | Get-Process',
          whatItDoes: 'Tries the same trick with processes. It errors because Get-Process -Name takes input only by property name, and text has no Name property.',
          parts: [
            { part: '\'explorer\'', meaning: 'A plain string with no properties named Name.' },
            { part: 'Get-Process', meaning: 'Has no parameter that accepts a string ByValue.' },
          ],
          sampleOutput:
            'Get-Process : The input object cannot be bound to any parameters for the command either because the command does not take pipeline input or the input and its properties do not match any of the parameters that take pipeline input.',
          watchOut: 'The error is harmless. Use `Get-Process -Name explorer` instead.',
        },
        {
          title: 'Ask help why',
          code: 'Get-Help Get-Process -Parameter Name',
          whatItDoes: 'Shows the -Name parameter details, including the line that explains how it accepts pipeline input.',
          parts: [
            { part: 'Get-Help', meaning: 'Shows help.' },
            { part: '-Parameter Name', meaning: 'Limit the answer to the -Name parameter.' },
            { part: 'Accept pipeline input?', meaning: 'Look here: "True (ByPropertyName)" means the incoming object needs a Name property.' },
          ],
        },
      ],
    },
    intermediate: {
      intro: 'Make binding work for you by giving objects the right property names, or renaming properties on the fly.',
      commands: [
        {
          title: 'Satisfy ByPropertyName with a custom object',
          code: '[PSCustomObject]@{ Name = \'explorer\' } | Get-Process',
          whatItDoes: 'Creates an object that has a Name property and pipes it. PowerShell matches the Name property to the -Name parameter.',
          parts: [
            { part: '[PSCustomObject]@{ Name = ... }', meaning: 'A tiny object with one property called Name.' },
            { part: '| Get-Process', meaning: 'Get-Process finds the Name property and binds its value to -Name.' },
          ],
        },
        {
          title: 'Rename a property so it matches',
          code: '[PSCustomObject]@{ Svc = \'bits\' } |\n  Select-Object @{n = \'Name\'; e = { $_.Svc }} |\n  Get-Service',
          whatItDoes: 'Our object calls the property Svc, which Get-Service does not know. A calculated property creates a Name copy, which binds correctly.',
          parts: [
            { part: '@{n = \'Name\'; e = { $_.Svc }}', meaning: 'Creates a new property called Name using the value of Svc.' },
            { part: 'Select-Object', meaning: 'Outputs a new object that contains the new Name property.' },
          ],
          watchOut: 'The parameter name must match exactly (or match one of its aliases).',
        },
        {
          title: 'Pipe a list of names',
          code: '\'bits\', \'spooler\', \'winrm\' | Get-Service | Select-Object Name, Status',
          whatItDoes: 'Sends three text values one after another. Each is bound ByValue to -Name, and then you keep just two columns.',
          parts: [
            { part: '\'bits\', \'spooler\', \'winrm\'', meaning: 'A comma-separated list (array) of strings.' },
            { part: 'Get-Service', meaning: 'Runs once for each name that arrives.' },
            { part: 'Select-Object Name, Status', meaning: 'Shows only those two properties.' },
          ],
        },
      ],
    },
    pro: {
      intro:
        'Pro habits: prove how binding happens, list every pipeline-capable parameter in code and always preview changing commands. Use a lab VM for the real run.',
      commands: [
        {
          title: 'Watch parameter binding live',
          code: 'Trace-Command -Name ParameterBinding -Expression { \'bits\' | Get-Service } -PSHost',
          whatItDoes: 'Prints a very detailed log showing which parameter PowerShell tried and which it chose. Great for debugging.',
          parts: [
            { part: 'Trace-Command', meaning: 'Turns on internal tracing for the code you give it.' },
            { part: '-Name ParameterBinding', meaning: 'Trace only the binding engine.' },
            { part: '-Expression { ... }', meaning: 'The command to trace.' },
            { part: '-PSHost', meaning: 'Write the trace to the console.' },
          ],
          watchOut: 'The output is very long and technical. Use it on a single small command.',
        },
        {
          title: 'List pipeline-capable parameters in code',
          code: '(Get-Command Stop-Service).Parameters.Values |\n  ForEach-Object {\n    $name = $_.Name\n    foreach ($a in $_.Attributes) {\n      if ($a -is [System.Management.Automation.ParameterAttribute] -and ($a.ValueFromPipeline -or $a.ValueFromPipelineByPropertyName)) {\n        [PSCustomObject]@{ Parameter = $name; ByValue = $a.ValueFromPipeline; ByPropertyName = $a.ValueFromPipelineByPropertyName; Set = $a.ParameterSetName }\n      }\n    }\n  }',
          whatItDoes: 'Reads Stop-Service\'s own metadata and reports which parameters can receive pipeline input and how.',
          parts: [
            { part: '(Get-Command Stop-Service).Parameters.Values', meaning: 'Every parameter definition for the command.' },
            { part: '.Attributes', meaning: 'Settings attached to each parameter.' },
            { part: 'ParameterAttribute', meaning: 'The attribute that stores the pipeline settings.' },
            { part: 'ValueFromPipeline / ...ByPropertyName', meaning: 'True when ByValue or ByPropertyName binding is allowed.' },
          ],
          watchOut: 'This only reads metadata. It does not stop anything.',
        },
        {
          title: 'Preview a changing pipeline with -WhatIf',
          code: 'Get-Service -Name Spooler | Stop-Service -WhatIf',
          whatItDoes: 'Pipes the service object into Stop-Service. The -WhatIf switch shows what would happen without stopping it.',
          parts: [
            { part: 'Get-Service -Name Spooler', meaning: 'Produces the service object.' },
            { part: 'Stop-Service', meaning: 'Receives the object ByValue through -InputObject.' },
            { part: '-WhatIf', meaning: 'Dry run only.' },
          ],
          sampleOutput: 'What if: Performing the operation "Stop-Service" on target "Print Spooler (Spooler)".',
          watchOut: 'Only remove -WhatIf on a lab VM. Stopping real services can break printing and other features.',
        },
      ],
    },
    recap: [
      'The pipeline passes whole objects, and the receiving command must bind them to a parameter.',
      'ByValue matches the object\'s type; ByPropertyName matches a property name to a parameter name.',
      '`\'bits\' | Get-Service` works but `\'explorer\' | Get-Process` fails because of how -Name is defined.',
      'Check `Get-Help <cmdlet> -Parameter *` or Trace-Command ParameterBinding, and use -WhatIf first.',
    ],
  },
  '5-2': {
    analogy:
      'Think of cooking dinner. A pipe `|` is like handing each ingredient straight to the next cook. A semicolon `;` is like saying "do step one, then step two" no matter how step one went. `&&` is "only start the sauce if the pasta is done" and `||` is "if the pasta burned, order pizza". And writing a long recipe on several lines is just good handwriting so everyone can read it.',
    plainEnglish: [
      'A pipe sends the objects from command A into command B. A semicolon just runs commands one after another and ignores the result of each.',
      '`&&` runs the next command only if the previous one succeeded. `||` runs the next only if it failed. These exist in PowerShell 7+ only. Windows PowerShell 5.1 (including Server Core) gives a parser error.',
      'In 5.1 you get the same effect with `if ($?) { ... }` and `if (-not $?) { ... }`.',
      'Long commands become easy to read when you break the line after a pipe `|`, a comma, or an opening bracket. No backtick is needed.',
    ],
    beforeYouStart: [
      'PowerShell 5.1 or 7. Run `$PSVersionTable.PSVersion` first, because `&&` and `||` need version 7 or later.',
      'A normal window is fine. Every command here only reads, apart from small variables.',
      'Know that `$?` is True when the last command succeeded.',
    ],
    atoZSteps: [
      {
        title: 'Step 1: Check your version',
        detail: 'Run `$PSVersionTable.PSVersion`. If the Major number is 7 or higher, `&&` and `||` will work.',
      },
      {
        title: 'Step 2: Run commands in a row with ;',
        detail: 'Type `Get-Date; whoami` and press Enter. Both run, in order, no matter what.',
      },
      {
        title: 'Step 3: Pipe when output should flow',
        detail: 'Use `|` when you want the result of the left command to become the input of the right one.',
      },
      {
        title: 'Step 4: Chain on success or failure (PowerShell 7)',
        detail: 'Use `A && B` to run B only if A succeeded and `A || B` to run B only if A failed.',
      },
      {
        title: 'Step 5: Do the same in 5.1',
        detail: 'Run A, then check `$?`: `A; if ($?) { B }` or `A; if (-not $?) { B }`.',
      },
      {
        title: 'Step 6: Make long commands readable',
        detail: 'Press Enter after a pipe symbol. PowerShell shows `>>` and waits for the rest. Press Enter twice on an empty line to run.',
      },
    ],
    wordsYouWillMeet: [
      { word: 'Semicolon (;)', meaning: 'Separates commands so they run one after another.' },
      { word: '&& and ||', meaning: 'Pipeline chain operators: run on success / run on failure (PowerShell 7+).' },
      { word: '$?', meaning: 'An automatic variable that is True if the previous command succeeded.' },
      { word: 'Continuation prompt', meaning: 'The `>>` you see when PowerShell is waiting for the rest of the command.' },
      { word: 'Splatting', meaning: 'Putting parameters in a hashtable and passing them with `@name`.' },
    ],
    beginner: {
      intro: 'These commands are all read-only. They show you the difference between running things one after another, and writing a command over several lines.',
      commands: [
        {
          title: 'Run three commands in a row',
          code: 'Get-Date; Get-Location; whoami',
          whatItDoes: 'Runs the three commands one after another and prints all three answers.',
          parts: [
            { part: 'Get-Date', meaning: 'Shows the current date and time.' },
            { part: ';', meaning: 'Means "then, whatever happened before".' },
            { part: 'Get-Location', meaning: 'Shows the folder you are in.' },
            { part: 'whoami', meaning: 'Shows your user name.' },
          ],
        },
        {
          title: 'Check whether && is available',
          code: '$PSVersionTable.PSVersion',
          whatItDoes: 'Shows your PowerShell version. Version 7 or higher supports `&&` and `||`, version 5.1 does not.',
          parts: [
            { part: '$PSVersionTable', meaning: 'A built-in table of version facts.' },
            { part: '.PSVersion', meaning: 'The property with the version number.' },
          ],
          watchOut: 'On Windows Server Core with Windows PowerShell 5.1, `&&` is a syntax error.',
        },
        {
          title: 'A readable multi-line pipeline',
          code: 'Get-Service |\n  Where-Object Status -eq \'Running\' |\n  Select-Object -First 5 Name, Status',
          whatItDoes: 'Lists five running services, with each step on its own line.',
          parts: [
            { part: '|', meaning: 'A pipe at the end of a line tells PowerShell the command continues.' },
            { part: 'Where-Object Status -eq \'Running\'', meaning: 'Keeps only services that are running.' },
            { part: 'Select-Object -First 5 Name, Status', meaning: 'Shows five rows and two columns.' },
          ],
          watchOut: 'If you press Enter after a line that does not end in a pipe or comma, PowerShell runs it right away.',
        },
      ],
    },
    intermediate: {
      intro: 'Learn to react to success and failure. The first two commands need PowerShell 7+, the third gives the 5.1 equivalent.',
      commands: [
        {
          title: 'Run something only on success (PowerShell 7+)',
          code: 'Get-Service -Name Spooler && Write-Output \'Spooler exists\'',
          whatItDoes: 'Looks up the Spooler service. If that works, the second command prints a message.',
          parts: [
            { part: 'Get-Service -Name Spooler', meaning: 'The first command. It succeeds if the service exists.' },
            { part: '&&', meaning: 'Run the right side only if the left side succeeded.' },
            { part: 'Write-Output \'...\'', meaning: 'Prints text.' },
          ],
          watchOut: 'Works only in PowerShell 7+. `&&` checks success, not the True/False value a command returns, so `Test-Path ... && ...` still continues when the path does not exist.',
        },
        {
          title: 'Run a fallback on failure (PowerShell 7+)',
          code: 'Get-Item C:\\NoSuchFolder -ErrorAction SilentlyContinue || Write-Output \'Folder not found\'',
          whatItDoes: 'Tries to read a folder that does not exist. Because that failed, the message after `||` runs.',
          parts: [
            { part: '-ErrorAction SilentlyContinue', meaning: 'Hides the red error but still counts as a failure.' },
            { part: '||', meaning: 'Run the right side only if the left side failed.' },
          ],
          sampleOutput: 'Folder not found',
        },
        {
          title: 'The Windows PowerShell 5.1 way',
          code: 'Get-Item C:\\NoSuchFolder -ErrorAction SilentlyContinue\nif (-not $?) { Write-Output \'Folder not found\' }',
          whatItDoes: 'Does the same job as `||` but works in every version by checking `$?` after the first command.',
          parts: [
            { part: '$?', meaning: 'True if the previous command succeeded.' },
            { part: '-not', meaning: 'Flips True to False.' },
            { part: 'if (...) { ... }', meaning: 'Runs the block only when the condition is true.' },
          ],
          sampleOutput: 'Folder not found',
        },
      ],
    },
    pro: {
      intro: 'In scripts, do not rely on chaining alone. Handle errors explicitly, check exit codes of programs and keep long commands clean with splatting.',
      commands: [
        {
          title: 'Catch errors properly',
          code: 'try {\n  Get-Item C:\\NoSuchFolder -ErrorAction Stop\n}\ncatch {\n  Write-Warning "Failed: $($_.Exception.Message)"\n}',
          whatItDoes: 'Turns the error into a stoppable one, then catches it and prints a friendly warning instead of a red wall of text.',
          parts: [
            { part: '-ErrorAction Stop', meaning: 'Makes the error terminating so catch can see it.' },
            { part: 'try { }', meaning: 'The code you want to attempt.' },
            { part: 'catch { }', meaning: 'Runs only if something inside try failed.' },
            { part: '$_.Exception.Message', meaning: 'The text of the error, available inside catch.' },
          ],
        },
        {
          title: 'Check the exit code of a program',
          code: 'ping.exe -n 1 127.0.0.1 | Out-Null\nif ($LASTEXITCODE -ne 0) { Write-Warning \'ping failed\' } else { Write-Output \'ping ok\' }',
          whatItDoes: 'Runs a classic Windows program and uses its exit code to decide what to do. External programs set `$LASTEXITCODE`, not just `$?`.',
          parts: [
            { part: 'ping.exe -n 1 127.0.0.1', meaning: 'Sends one ping to the local machine.' },
            { part: '| Out-Null', meaning: 'Throws away the text output.' },
            { part: '$LASTEXITCODE', meaning: 'The number the program returned. 0 normally means success.' },
          ],
          sampleOutput: 'ping ok',
        },
        {
          title: 'Split long commands with splatting',
          code: '$params = @{\n  Path        = \'C:\\Windows\'\n  Filter      = \'*.exe\'\n  ErrorAction = \'SilentlyContinue\'\n}\nGet-ChildItem @params | Select-Object -First 3 Name',
          whatItDoes: 'Stores the parameters in a hashtable, then passes them with `@params`, which keeps each option on its own line without backticks.',
          parts: [
            { part: '@{ Key = Value }', meaning: 'A hashtable of parameter names and values.' },
            { part: '@params', meaning: 'The @ (not $) tells PowerShell to unpack the hashtable into parameters.' },
            { part: 'Select-Object -First 3 Name', meaning: 'Shows just three names.' },
          ],
          watchOut: 'A backtick at the end of a line also continues a command, but a hidden space after it breaks the script. Splatting is safer.',
        },
      ],
    },
    recap: [
      'A pipe passes objects, a semicolon just runs the next command regardless.',
      '`&&` (on success) and `||` (on failure) work only in PowerShell 7+, not in Windows PowerShell 5.1.',
      'In 5.1 use `if ($?) { ... }`, try/catch with -ErrorAction Stop, and `$LASTEXITCODE` for programs.',
      'Break long lines after a pipe, a comma or with splatting for easy reading.',
    ],
  },
  '6-1': {
    analogy:
      'A variable is a labelled box on a shelf. You write a name on the box (`$name`) and put something inside. An array is a row of boxes numbered from zero: the first box is number 0, not 1. A data type is the kind of thing the box is allowed to hold: an egg tray only takes eggs, so a strongly-typed variable refuses to hold the wrong kind of value.',
    plainEnglish: [
      'A variable starts with `$`. You store something with `=` and read it later by typing the name again, for example `$name = \'Sam\'`.',
      'An array is an ordered list written with commas: `$list = 10, 20, 30`. Items are numbered from zero, so `$list[0]` is the first and `$list[-1]` is the last.',
      'Every value has a .NET type such as `Int32` (whole number), `String` (text), `DateTime`, or `Boolean`. A type in square brackets in front of a value or variable (a cast) forces that type: `[int]\'42\'`.',
      'Arrays can be passed straight to parameters that accept lists: `Get-Service -Name $names`. This is the clean way to work with many items at once.',
    ],
    beforeYouStart: [
      'PowerShell 5.1 or 7 in a normal window. Variables only live in your window and disappear when you close it.',
      'Know what an object and property are (lesson 4-1).',
      'Remember: counting starts at zero.',
    ],
    atoZSteps: [
      {
        title: 'Step 1: Create a variable',
        detail: 'Type `$name = \'PowerShell\'` and press Enter. Nothing prints because the value went into the box.',
      },
      {
        title: 'Step 2: Read it back',
        detail: 'Type `$name` on its own line. PowerShell shows what is inside.',
      },
      {
        title: 'Step 3: Make an array',
        detail: 'Type `$numbers = 10, 20, 30, 40`. The commas make a list of four items.',
      },
      {
        title: 'Step 4: Pick items by index',
        detail: 'Use `$numbers[0]` for the first, `$numbers[1]` for the second and `$numbers[-1]` for the last. Use `$numbers.Count` for the size.',
      },
      {
        title: 'Step 5: Check and force types',
        detail: 'Use `$value.GetType().Name` to see the type. Use a cast such as `[int]$text` to convert, for example text to a number.',
      },
      {
        title: 'Step 6: Pass an array to a parameter',
        detail: 'Create `$names = \'BITS\', \'Spooler\'` and run `Get-Service -Name $names`. One command handles both names.',
      },
      {
        title: 'Step 7: Make mistakes loud',
        detail: 'Use typed variables like `[int]$count = 5` and `Set-StrictMode -Version Latest` in scripts, so typos and wrong values are caught early.',
      },
    ],
    wordsYouWillMeet: [
      { word: 'Variable', meaning: 'A named box that holds a value, written with a leading `$`.' },
      { word: 'Array', meaning: 'An ordered list of items, written with commas.' },
      { word: 'Index', meaning: 'The position number of an item in an array, starting at 0.' },
      { word: 'Type', meaning: 'The kind of data, such as Int32, String or DateTime.' },
      { word: 'Cast', meaning: 'Putting a type in square brackets, like `[int]`, to convert or restrict a value.' },
    ],
    beginner: {
      intro: 'These commands only create small variables in your current window. They do not touch files or settings.',
      commands: [
        {
          title: 'Store and read a variable',
          code: '$name = \'PowerShell\'\n$name',
          whatItDoes: 'Puts the text PowerShell into a variable called name, then displays it.',
          parts: [
            { part: '$name', meaning: 'A variable. The `$` marks it as one.' },
            { part: '=', meaning: 'Assignment: puts the value on the right into the box on the left.' },
            { part: '\'PowerShell\'', meaning: 'Text in quotes (a string).' },
          ],
          sampleOutput: 'PowerShell',
        },
        {
          title: 'Make an array and pick items',
          code: '$numbers = 10, 20, 30, 40\n$numbers[0]\n$numbers[-1]',
          whatItDoes: 'Creates a list of four numbers, then shows the first (index 0) and the last (index -1).',
          parts: [
            { part: '10, 20, 30, 40', meaning: 'Commas create an array.' },
            { part: '[0]', meaning: 'Index zero is the first item.' },
            { part: '[-1]', meaning: 'A negative index counts from the end. -1 is the last item.' },
          ],
          sampleOutput: '10\n40',
          watchOut: 'There is no item at [4] here. The last valid index is Count minus 1.',
        },
        {
          title: 'Ask for the type',
          code: '$answer = 42\n$answer.GetType().Name',
          whatItDoes: 'Shows the .NET type PowerShell chose for the number 42.',
          parts: [
            { part: '.GetType()', meaning: 'A method that returns the type of the value.' },
            { part: '.Name', meaning: 'The short name of that type.' },
          ],
          sampleOutput: 'Int32',
        },
      ],
    },
    intermediate: {
      intro: 'Store real objects, pass lists to parameters and use casts. All of it is still read-only.',
      commands: [
        {
          title: 'Store objects in a variable',
          code: '$procs = Get-Process | Sort-Object WorkingSet64 -Descending | Select-Object -First 3\n$procs[0].Name\n$procs.Count',
          whatItDoes: 'Saves the three biggest memory users, then reads the name of the first one and how many were saved.',
          parts: [
            { part: '$procs =', meaning: 'Stores the whole result, a list of objects.' },
            { part: '$procs[0].Name', meaning: 'First item, then its Name property.' },
            { part: '.Count', meaning: 'The number of items in the array.' },
          ],
        },
        {
          title: 'Pass an array to a parameter',
          code: '$names = \'BITS\', \'Spooler\', \'WinRM\'\nGet-Service -Name $names | Select-Object Name, Status',
          whatItDoes: 'Looks up three services in one command by passing the whole list to -Name.',
          parts: [
            { part: '$names', meaning: 'An array of three strings.' },
            { part: '-Name $names', meaning: '-Name accepts a list (String[]), so each item is processed.' },
            { part: 'Select-Object Name, Status', meaning: 'Shows two columns.' },
          ],
        },
        {
          title: 'Why types matter',
          code: '$text = \'42\'\n[int]$text + 8\n$text + 8',
          whatItDoes: 'Shows the difference between text and numbers. Cast to a number and you get 50. Left as text, PowerShell glues the 8 on the end.',
          parts: [
            { part: '[int]$text', meaning: 'A cast: converts the text 42 into a real number.' },
            { part: '+', meaning: 'Adds numbers, but joins text.' },
          ],
          sampleOutput: '50\n428',
          watchOut: 'The left side decides the behaviour. `\'42\' + 8` is text joining, but `8 + \'42\'` gives 50.',
        },
      ],
    },
    pro: {
      intro: 'Pro habits: lock down types, use efficient lists and turn on strict mode so mistakes cannot hide. Try these in a lab session.',
      commands: [
        {
          title: 'A strongly typed variable',
          code: '[int]$count = 5\ntry { $count = \'abc\' } catch { Write-Output \'Cannot store text in an int variable\' }',
          whatItDoes: 'Declares $count as a whole number. Putting text in it throws an error, which the catch block reports.',
          parts: [
            { part: '[int]$count', meaning: 'The type in front of the variable name locks its type.' },
            { part: 'try { } catch { }', meaning: 'Attempts the assignment and handles the failure.' },
          ],
          sampleOutput: 'Cannot store text in an int variable',
        },
        {
          title: 'A fast list that can grow',
          code: '$list = [System.Collections.Generic.List[string]]::new()\n$list.Add(\'web01\')\n$list.Add(\'web02\')\n$list.Count',
          whatItDoes: 'Creates a typed list that only accepts strings and grows efficiently. Normal arrays with `+=` copy themselves each time, which is slow for large lists.',
          parts: [
            { part: '[System.Collections.Generic.List[string]]', meaning: 'A growable list type that holds strings.' },
            { part: '::new()', meaning: 'Creates a new empty list.' },
            { part: '.Add(\'web01\')', meaning: 'A method that appends an item.' },
          ],
          sampleOutput: '2',
        },
        {
          title: 'Catch typos with strict mode',
          code: 'Set-StrictMode -Version Latest\n$total = 5\nWrite-Output $totl\nSet-StrictMode -Off',
          whatItDoes: 'In strict mode, using a variable that was never set is an error, so a typo like $totl is caught instead of silently being empty.',
          parts: [
            { part: 'Set-StrictMode -Version Latest', meaning: 'Turns on the strictest checking for this session or script.' },
            { part: '$totl', meaning: 'A misspelled variable that was never created.' },
            { part: 'Set-StrictMode -Off', meaning: 'Switches checking off again for the session.' },
          ],
          sampleOutput: 'The variable \'$totl\' cannot be retrieved because it has not been set.',
          watchOut: 'Put Set-StrictMode at the top of your scripts. Only the lines inside that scope are affected.',
        },
      ],
    },
    recap: [
      'A variable is a named box starting with `$`; assign with `=`.',
      'Arrays are comma lists with zero-based indexes: `$a[0]` is first and `$a[-1]` is last.',
      'Every value has a .NET type. Check it with `.GetType()` and force it with a cast like `[int]`.',
      'Pass arrays to parameters, use typed lists in scripts and turn on Set-StrictMode to catch mistakes early.',
    ],
  },
};
