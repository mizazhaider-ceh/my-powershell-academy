import type { StoryboardMap } from '../../types';

export const STORYBOARDS: StoryboardMap = {
  '1-1': {
    title: "Office building and master key",
    panels: [
      {
        icon: "building",
        caption: "One building underneath everything",
        detail: "The NT kernel is the building itself: the walls, locks and electricity that every edition of Windows shares.",
      },
      {
        icon: "users",
        caption: "Apartment or busy office",
        detail: "Windows 11 arranges the NT kernel for one person at a desk, while Windows Server arranges the same kernel to serve hundreds of users.",
      },
      {
        icon: "key",
        caption: "Master key stays in pocket",
        detail: "The Administrator account is the master key. The golden rule of least privilege says you sign in as a normal user and only use admin rights when a task truly needs them.",
      },
      {
        icon: "door-open",
        caption: "Open the door, put key back",
        detail: "When UAC asks for approval, you briefly use the master key for that one elevated task, then go back to your normal permissions.",
      },
    ],
  },
  '1-2': {
    title: "Recipe book and kitchen",
    panels: [
      {
        icon: "book",
        caption: "A program is a recipe book",
        detail: "An .exe file sitting on disk is only instructions. Nothing is running yet, just like a book on a shelf.",
      },
      {
        icon: "play",
        caption: "Cooking starts, a kitchen opens",
        detail: "When you launch the program, Windows creates a process: a running instance with its own private memory (the counters).",
      },
      {
        icon: "users",
        caption: "Cooks, pantry keys, ID badge",
        detail: "Threads are the cooks doing the work, handles are the keys to resources such as files, and the access token is the badge that says what this process may touch.",
      },
      {
        icon: "cpu",
        caption: "The CPU watches single cooks",
        detail: "The CPU scheduler never runs a whole process. It runs individual threads, one slice of time at a time.",
      },
    ],
  },
  '1-3': {
    title: "Tenants and storage unit",
    panels: [
      {
        icon: "hotel",
        caption: "Every tenant numbers rooms from 1",
        detail: "Each process gets its own virtual address space and believes it has the whole memory range to itself.",
      },
      {
        icon: "layers",
        caption: "The manager secretly maps rooms",
        detail: "The Memory Manager translates each process's virtual addresses into real locations in physical RAM.",
      },
      {
        icon: "hard-drive",
        caption: "Rare boxes go to storage",
        detail: "When RAM gets tight, memory pages that are rarely used can be moved to the page file on disk and brought back when needed.",
      },
      {
        icon: "shield-check",
        caption: "Tenants never see each other",
        detail: "Because each process only sees its own mappings, one process cannot read another one's memory by accident, and none of them notice the paging.",
      },
    ],
  },
  '2-1': {
    title: "Bank lobby and vault",
    panels: [
      {
        icon: "users",
        caption: "Customers wait in the lobby",
        detail: "Your apps run in user mode. They have limited access and cannot touch hardware or other processes directly.",
      },
      {
        icon: "clipboard",
        caption: "Fill out a request slip",
        detail: "An app asks for a privileged job through a system call. NTDLL.DLL is the teller that carries the slip into the kernel.",
      },
      {
        icon: "lock",
        caption: "Vault staff do the real work",
        detail: "Kernel mode (the Executive managers) can reach everything, so a crash there stops the whole machine with a blue screen, while a crashed app only closes itself.",
      },
      {
        icon: "ticket",
        caption: "A receipt comes back",
        detail: "The result returns to the app, often as a handle, a reference number that lets the app use the object it asked for.",
      },
    ],
  },
  '2-2': {
    title: "Stage play, fixed actors",
    panels: [
      {
        icon: "users",
        caption: "Same actors, same entrance order",
        detail: "Core Windows processes such as smss.exe, wininit.exe, services.exe and lsass.exe start in a predictable order on every healthy machine.",
      },
      {
        icon: "folder",
        caption: "Each wears the right costume",
        detail: "A real core process runs from its normal path, usually in the System32 folder. A copy running from another folder is a warning sign.",
      },
      {
        icon: "git-branch",
        caption: "Each takes orders from one director",
        detail: "The parent process matters. Many svchost.exe entries are normal, but each should have services.exe as its parent.",
      },
      {
        icon: "search",
        caption: "Wrong costume exposes the imposter",
        detail: "Knowing the normal name, path, parent and count lets you spot a lookalike (for example a slightly misspelled name) quickly with Get-Process or Get-CimInstance.",
      },
    ],
  },
  '2-3': {
    title: "Relay race with inspectors",
    panels: [
      {
        icon: "power",
        caption: "Power on, firmware runs first",
        detail: "UEFI firmware starts the machine and checks the hardware before any part of Windows loads.",
      },
      {
        icon: "fingerprint",
        caption: "Each runner shows genuine ID",
        detail: "Secure Boot verifies the signature of the boot loader, and Trusted Boot makes Windows verify the rest of its own startup files before using them.",
      },
      {
        icon: "shield-check",
        caption: "Security scanner arrives first",
        detail: "Early Launch Anti-Malware (ELAM) loads before other drivers so it can check them as they start.",
      },
      {
        icon: "clipboard",
        caption: "Scorekeeper records every handoff",
        detail: "Measured Boot records fingerprints of each boot step in the TPM. It is a witness that other tools can check later, and only then does the logon screen appear.",
      },
    ],
  },
  '3-1': {
    title: "Fax versus emailed spreadsheet",
    panels: [
      {
        icon: "file-text",
        caption: "Old tools pass plain text",
        detail: "Classic command line tools output text, so the next step has to re-read it and guess where the columns are, like re-typing a faxed spreadsheet.",
      },
      {
        icon: "table",
        caption: "PowerShell sends real rows",
        detail: "A PowerShell command outputs .NET objects, which have named properties (like Name or Id) arranged as real rows and columns.",
      },
      {
        icon: "filter",
        caption: "Next command sorts and filters",
        detail: "Because the data keeps its structure, Sort-Object and Where-Object can work on properties directly, with no text parsing.",
      },
      {
        icon: "refresh",
        caption: "Third time, write it down",
        detail: "DRY (Don't Repeat Yourself) means that when you do the same chore three times, you turn it into a script and let the computer repeat it.",
      },
    ],
  },
  '3-2': {
    title: "Library with one title rule",
    panels: [
      {
        icon: "book",
        caption: "Every title follows one rule",
        detail: "PowerShell cmdlet names use the pattern Verb-Noun, one approved verb then one thing, so names look alike and become guessable.",
      },
      {
        icon: "tag",
        caption: "A verb, then one thing",
        detail: "Get-Process, Stop-Service and New-LocalUser all say what they do and what they do it to.",
      },
      {
        icon: "search",
        caption: "Guess where to look",
        detail: "Because names are predictable, Get-Command with a verb or noun pattern helps you find a cmdlet you have never used.",
      },
      {
        icon: "mail",
        caption: "Nicknames chat, full names write",
        detail: "Aliases such as ls or % are fine when typing at the prompt, but saved scripts should use full cmdlet names so they stay clear for the next reader.",
      },
    ],
  },
  '3-3': {
    title: "Manual inside the box",
    panels: [
      {
        icon: "package",
        caption: "Every command has a manual",
        detail: "Get-Help shows the documentation for a cmdlet. The help files are downloaded with Update-Help, like fetching the manual that belongs in the box.",
      },
      {
        icon: "help",
        caption: "Jump to the picture pages",
        detail: "You do not memorize everything. Get-Help with the -Examples switch jumps straight to worked samples you can copy and adapt.",
      },
      {
        icon: "code",
        caption: "Read the little symbols",
        detail: "In the syntax section, square brackets mark optional parts, and a type such as <String> says what kind of value goes there.",
      },
      {
        icon: "check",
        caption: "Any new gadget becomes usable",
        detail: "Once you can read help, you can work out any cmdlet, including ones you have never seen before.",
      },
    ],
  },
  '4-1': {
    title: "A car on the table",
    panels: [
      {
        icon: "box",
        caption: "Every result is a real object",
        detail: "Output from a cmdlet is not just text. It is an object, like a car, that carries data and abilities with it.",
      },
      {
        icon: "gauge",
        caption: "Properties: colour, speed, fuel",
        detail: "Properties are readable facts about the object, such as the Name or Id of a process, which you read with a dot like $proc.Name.",
      },
      {
        icon: "power",
        caption: "Methods: start, stop, honk",
        detail: "Methods are actions the object can perform, for example a process object has a Kill() method.",
      },
      {
        icon: "eye",
        caption: "Get-Member is the X-ray",
        detail: "Piping an object to Get-Member lists all of its properties and methods, including ones the default display never shows.",
      },
    ],
  },
  '4-2': {
    title: "Shop window and back room",
    panels: [
      {
        icon: "monitor",
        caption: "The window shows a few items",
        detail: "PowerShell displays only a few default columns for each type of object. That is just what is shown on screen.",
      },
      {
        icon: "database",
        caption: "The back room holds everything",
        detail: "The full object still has many more properties. Select-Object * or Get-Member reveals what is behind the display.",
      },
      {
        icon: "sparkles",
        caption: "Format cmdlets only decorate",
        detail: "Format-Table and Format-List produce formatting instructions for the screen, not your data, so they belong at the very end of a pipeline.",
      },
      {
        icon: "briefcase",
        caption: "Pick goods, or box your own",
        detail: "Use Select-Object to choose real properties before moving data on, and [PSCustomObject] to build your own tidy object with exactly the properties you want.",
      },
    ],
  },
  '5-1': {
    title: "Sushi conveyor belt",
    panels: [
      {
        icon: "utensils",
        caption: "The chef loads plates on",
        detail: "The first command in a pipeline outputs objects (the plates), which travel to the next command.",
      },
      {
        icon: "tag",
        caption: "Plate is the right kind",
        detail: "ByValue binding: the next command accepts an input parameter of the same .NET type as the object, so the whole plate is taken.",
      },
      {
        icon: "link",
        caption: "Label matches the tray name",
        detail: "ByPropertyName binding: a property on the object has the same name as a parameter, such as Name, so that property fills the parameter.",
      },
      {
        icon: "x",
        caption: "No match means an error",
        detail: "If neither binding works, PowerShell reports that the input object cannot be bound to any parameters. Use Get-Help to see which pipeline input a parameter accepts.",
      },
    ],
  },
  '5-2': {
    title: "Cooking dinner, handing off",
    panels: [
      {
        icon: "send",
        caption: "Hand each ingredient onward",
        detail: "The pipe | passes the output objects of one command straight to the next command.",
      },
      {
        icon: "list",
        caption: "Step one, then step two",
        detail: "A semicolon ; runs commands one after another regardless of how the first one went.",
      },
      {
        icon: "check",
        caption: "Sauce only if pasta is done",
        detail: "&& runs the second command only if the first one succeeded. It is available in PowerShell 7 and later, not in Windows PowerShell 5.1.",
      },
      {
        icon: "warning",
        caption: "Pasta burned, order pizza",
        detail: "|| runs the second command only if the first one failed (PowerShell 7 and later). Long commands can also be split over lines so everyone can read them.",
      },
    ],
  },
  '6-1': {
    title: "Labelled boxes on a shelf",
    panels: [
      {
        icon: "box",
        caption: "Name the box, fill it",
        detail: "A variable such as $name is a labelled box. You assign a value with =, for example $name = 'Ava'.",
      },
      {
        icon: "list",
        caption: "A row of boxes from zero",
        detail: "An array holds many values in numbered slots, and counting starts at 0, so $items[0] is the first one.",
      },
      {
        icon: "puzzle",
        caption: "An egg tray takes only eggs",
        detail: "A data type such as [int] on a variable says what kind of value it may hold, which makes it strongly typed.",
      },
      {
        icon: "warning",
        caption: "The wrong kind is refused",
        detail: "If you try to store text that cannot be converted into a number in an [int] variable, PowerShell raises an error instead of silently accepting it.",
      },
    ],
  },
  '6-2': {
    title: "Mail merge and glass case",
    panels: [
      {
        icon: "mail",
        caption: "Double quotes fill the blanks",
        detail: "In a double-quoted string, PowerShell expands variables, so \"Dear $name\" becomes the real name inside.",
      },
      {
        icon: "file-text",
        caption: "Single quotes stay exactly as written",
        detail: "A single-quoted string is literal. $name inside it stays as the characters $name and nothing is swapped.",
      },
      {
        icon: "workflow",
        caption: "Output rides, Host just shouts",
        detail: "Write-Output sends objects down the pipeline for the next command. Write-Host only displays text on screen for people, so no command can pick it up.",
      },
      {
        icon: "lock",
        caption: "A PIN pad shows only dots",
        detail: "A SecureString keeps typed secrets hidden on screen, for example when you use Read-Host -AsSecureString.",
      },
    ],
  },
  '7-1': {
    title: "Warehouse sorts before shipping",
    panels: [
      {
        icon: "truck",
        caption: "Ship only the blue boxes",
        detail: "Filter left means using a cmdlet's own -Filter or similar parameter so the source does the selecting and only matching objects are returned.",
      },
      {
        icon: "package",
        caption: "Every box arrives, then checked",
        detail: "With Where-Object, every object is sent through the pipeline first, and PowerShell checks each one in your script after it arrives.",
      },
      {
        icon: "gauge",
        caption: "Fewer boxes means faster",
        detail: "Both give the same blue boxes, but filtering early moves far less data and usually runs much faster on large lists.",
      },
      {
        icon: "wrench",
        caption: "Sometimes you must check yourself",
        detail: "When the cmdlet has no parameter for the property you care about, Where-Object is still the right tool.",
      },
    ],
  },
  '7-2': {
    title: "Talent show then ranking",
    panels: [
      {
        icon: "scale",
        caption: "Let everyone perform, then rank",
        detail: "Sort-Object must receive all the objects before it can order them, for example by a property like CPU.",
      },
      {
        icon: "flag",
        caption: "Then pick the top three",
        detail: "Select-Object -First 3 takes only the first three objects of what it receives, so it should come after the sort.",
      },
      {
        icon: "warning",
        caption: "Picking first misses the winner",
        detail: "If you select the first three and then sort, you only sorted those three arbitrary objects, so the real top item may never appear.",
      },
      {
        icon: "eye",
        caption: "Rehearsal with the curtain closed",
        detail: "The -WhatIf switch shows what a command would do without actually changing anything, so you can check before running it for real.",
      },
    ],
  },
  '8-1': {
    title: "Universal TV remote",
    panels: [
      {
        icon: "settings",
        caption: "One remote, many devices",
        detail: "The same navigation commands, such as Set-Location (cd) and Get-ChildItem (dir), can work on more than the file system.",
      },
      {
        icon: "plug",
        caption: "An adapter teaches the remote",
        detail: "A PSProvider is the adapter that lets PowerShell treat a data store, such as the registry or environment variables, like folders and items.",
      },
      {
        icon: "tag",
        caption: "Labelled buttons: C:, HKLM:, Env:",
        detail: "A PSDrive is a named entry point to a provider. Remember the colon after the drive name.",
      },
      {
        icon: "database",
        caption: "Same buttons browse everything",
        detail: "With the same few commands you can walk through the registry, list environment variables in Env: and look at certificates in Cert:.",
      },
    ],
  },
  '8-2': {
    title: "Librarian and highlighter",
    panels: [
      {
        icon: "folder",
        caption: "The librarian finds by title",
        detail: "Get-ChildItem lists files and folders and can search for them by name or pattern.",
      },
      {
        icon: "layers",
        caption: "Catalogue first, check every floor",
        detail: "-Filter lets the file system do the matching, which is faster than checking every name afterwards. -Recurse searches all subfolders, not just the top one.",
      },
      {
        icon: "file-text",
        caption: "Print blank labelled folders in bulk",
        detail: "New-Item creates files or folders, and you can give it a list of names to create many in one command.",
      },
      {
        icon: "search",
        caption: "Highlighter reads inside every book",
        detail: "Select-String searches inside file contents for text or a pattern and reports the file, the line number and the matching line.",
      },
    ],
  },
  '9-1': {
    title: "Moving into a new house",
    panels: [
      {
        icon: "map",
        caption: "Read the street map first",
        detail: "Before configuring a server, read the network diagram to learn which subnet, gateway and DNS servers it should use.",
      },
      {
        icon: "tag",
        caption: "Put your name on the door",
        detail: "The hostname is the computer's name on the network. Rename-Computer sets it, and a restart finishes the change.",
      },
      {
        icon: "network",
        caption: "Claim a permanent street address",
        detail: "A static IP address (set with cmdlets such as New-NetIPAddress) does not change, and you also point the server at the DNS directory with Set-DnsClientServerAddress.",
      },
      {
        icon: "bell",
        caption: "Test the doorbell, keep a checklist",
        detail: "Test-NetConnection checks that the network path works, and putting all the steps in a script lets you set up many servers the same way.",
      },
    ],
  },
  '9-2': {
    title: "A day shift in the office",
    panels: [
      {
        icon: "users",
        caption: "Hand out visitor badges",
        detail: "Local user accounts are managed with cmdlets such as Get-LocalUser and New-LocalUser.",
      },
      {
        icon: "gauge",
        caption: "See which machines are busy",
        detail: "Get-Process shows the running processes and how much CPU and memory each one uses.",
      },
      {
        icon: "hard-drive",
        caption: "Check how full the cabinets are",
        detail: "Get-Volume and Get-PSDrive report disk size and free space, so you can catch a drive that is filling up.",
      },
      {
        icon: "clock",
        caption: "Stamp reports, print summaries",
        detail: "Get-Date formats timestamps, and results can be shown as plain text or exported as CSV with Export-Csv or as a web page with ConvertTo-Html.",
      },
    ],
  },
  '10-1': {
    title: "Recipe card and kitchen rule",
    panels: [
      {
        icon: "file-text",
        caption: "Write the recipe card once",
        detail: "A PowerShell script is a .ps1 file holding commands, so you write the steps once and reuse them.",
      },
      {
        icon: "shield-check",
        caption: "Cook only from trusted cards",
        detail: "The Execution Policy (for example RemoteSigned) decides which scripts PowerShell is willing to run, such as requiring a signature on downloaded scripts.",
      },
      {
        icon: "shield-alert",
        caption: "A seatbelt, not a locked door",
        detail: "Execution Policy helps prevent accidents but it is not a security boundary, because a determined person can run commands without a script file.",
      },
      {
        icon: "play",
        caption: "Point at the exact card",
        detail: "PowerShell does not run scripts from the current folder by name alone, so you type .\\script.ps1 to say exactly which file you mean.",
      },
    ],
  },
  '10-2': {
    title: "Board game turn rules",
    panels: [
      {
        icon: "list",
        caption: "Do the steps in order",
        detail: "Sequence is the default: a script runs one line after another from top to bottom.",
      },
      {
        icon: "git-branch",
        caption: "If red square, draw a card",
        detail: "Selection uses if, elseif and else to choose a path depending on whether a condition is true.",
      },
      {
        icon: "refresh",
        caption: "Do this for each player",
        detail: "A loop such as foreach repeats the same block of code for every item in a collection.",
      },
      {
        icon: "layers",
        caption: "Every script stacks these three",
        detail: "Sequence, selection and loops combine to build any script, from a small chore to a large tool.",
      },
    ],
  },
  '11-1': {
    title: "Toolbox from the hardware store",
    panels: [
      {
        icon: "cloud",
        caption: "Browse the hardware store",
        detail: "The PowerShell Gallery is the online catalogue of modules, and Find-Module searches it.",
      },
      {
        icon: "download",
        caption: "Buy it and carry it home",
        detail: "Install-Module downloads a module from the Gallery and stores it on your computer.",
      },
      {
        icon: "package",
        caption: "The toolbox waits in the cupboard",
        detail: "An installed module is available on disk, but its commands are not necessarily loaded into your current session yet.",
      },
      {
        icon: "wrench",
        caption: "Put it on the workbench",
        detail: "Import-Module loads the module into your session. Modern PowerShell can also load it automatically the first time you call one of its commands.",
      },
    ],
  },
  '11-2': {
    title: "Phone call or flight",
    panels: [
      {
        icon: "plane",
        caption: "Remote Desktop means flying there",
        detail: "Remote Desktop opens a full graphical session on the other computer, which is heavy because you carry the whole desktop across the network.",
      },
      {
        icon: "terminal",
        caption: "Remoting is a precise phone call",
        detail: "PowerShell Remoting sends only commands and returns results over the network, which is lighter and easy to script.",
      },
      {
        icon: "user",
        caption: "Enter-PSSession, a private call",
        detail: "Enter-PSSession opens an interactive session with one remote computer, so you type commands there as if you sat at it.",
      },
      {
        icon: "users",
        caption: "Invoke-Command, a conference call",
        detail: "Invoke-Command can send the same script block to many computers at once and collect the results.",
      },
    ],
  },
  '12-1': {
    title: "Company phone book and badges",
    panels: [
      {
        icon: "book",
        caption: "A phone book, one record each",
        detail: "Active Directory stores each user as an object with properties such as name, email and department.",
      },
      {
        icon: "users",
        caption: "Groups are mailing lists",
        detail: "Security groups collect users so permissions can be given to the group instead of to each person.",
      },
      {
        icon: "folder",
        caption: "OUs are the filing drawers",
        detail: "Organizational Units (OUs) organize objects and let you delegate who may manage which part of the directory.",
      },
      {
        icon: "zap",
        caption: "Update the whole book fast",
        detail: "With the ActiveDirectory module, cmdlets such as Get-ADUser and Set-ADUser can change many records in one pipeline.",
      },
    ],
  },
  '12-2': {
    title: "Country, city and city hall",
    panels: [
      {
        icon: "globe",
        caption: "A forest is a small country",
        detail: "A forest is the top-level boundary of Active Directory and contains one or more domains that share the same directory structure.",
      },
      {
        icon: "building",
        caption: "Domains are cities with halls",
        detail: "A domain is a city inside the country, and Domain Controllers are the city halls that hold copies of the official records.",
      },
      {
        icon: "mail",
        caption: "DNS is the postal system",
        detail: "Computers find a Domain Controller through DNS SRV records. Without correct records, a laptop cannot locate the domain.",
      },
      {
        icon: "key",
        caption: "Stricter locks for the mayor",
        detail: "Fine-Grained Password Policies apply different password rules to chosen users or groups, such as stricter ones for administrators.",
      },
    ],
  },
  '13-1': {
    title: "Guard who knows the location",
    panels: [
      {
        icon: "shield-check",
        caption: "A guard stands at the door",
        detail: "Windows Defender Firewall decides which network traffic is allowed in or out of the computer.",
      },
      {
        icon: "compass",
        caption: "The guard checks where we are",
        detail: "Network Location Awareness (NLA) assigns a network profile (Domain, Private or Public), and each profile can have its own rules.",
      },
      {
        icon: "users",
        caption: "Let the cleaning team in",
        detail: "Firewall rules belong to groups, so you can enable a whole group, for example with Enable-NetFirewallRule -DisplayGroup, instead of opening ports one by one.",
      },
      {
        icon: "door-open",
        caption: "Exactly the right doors open",
        detail: "Enabling a group opens only the traffic that group needs, which keeps the rest of the machine protected.",
      },
    ],
  },
  '13-2': {
    title: "Office rulebook and alarm clock",
    panels: [
      {
        icon: "clipboard",
        caption: "One rulebook for 5,000 desks",
        detail: "Group Policy applies settings such as screen lock time to many computers and users automatically.",
      },
      {
        icon: "layers",
        caption: "Several levels, closest one wins",
        detail: "Policies can come from the local computer, site, domain and OU levels. When they conflict, the one applied last (closest to the object) wins.",
      },
      {
        icon: "search",
        caption: "The inspector checks one desk",
        detail: "Resultant Set of Policy (RSoP), for example through gpresult, shows which settings are in force on one machine and which policy set them.",
      },
      {
        icon: "clock",
        caption: "Alarm clock starts the chore",
        detail: "A Scheduled Task runs a program or script at a set time, and cmdlets like Register-ScheduledTask create one.",
      },
    ],
  },
  '14-1': {
    title: "Delivery driver's rules",
    panels: [
      {
        icon: "truck",
        caption: "Blocked road, driver shrugs on",
        detail: "Many PowerShell errors are non-terminating: the command reports the problem and the script keeps going, so a failure can go unnoticed.",
      },
      {
        icon: "bell",
        caption: "If blocked, stop and call me",
        detail: "Try/Catch handles errors. Adding -ErrorAction Stop turns an error into one that Catch can handle, so you decide what happens.",
      },
      {
        icon: "lock",
        caption: "Always lock the van",
        detail: "A Finally block runs whether or not an error happened, which makes it the right place for cleanup such as closing connections.",
      },
      {
        icon: "clipboard",
        caption: "A clipboard of instructions",
        detail: "Splatting puts a command's parameters into a hashtable and passes it with @ so long commands stay tidy.",
      },
    ],
  },
  '14-2': {
    title: "Recipe card to appliance",
    panels: [
      {
        icon: "file-text",
        caption: "A handwritten recipe card",
        detail: "A basic function is a named block of code you can call again, which works but has few built-in features.",
      },
      {
        icon: "settings",
        caption: "Add a proper control panel",
        detail: "Adding [CmdletBinding()] and a param() block gives the function real parameters with types and validation, so it behaves like a cmdlet.",
      },
      {
        icon: "eye",
        caption: "Tell-me light and pretend button",
        detail: "[CmdletBinding()] enables -Verbose for progress messages, and SupportsShouldProcess adds -WhatIf so the function can preview its changes.",
      },
      {
        icon: "workflow",
        caption: "Handles ingredients one at a time",
        detail: "With pipeline input and a process block, the function receives each object from the pipeline in turn.",
      },
    ],
  },
  '15-1': {
    title: "Guard walks the building",
    panels: [
      {
        icon: "compass",
        caption: "Walk the building with a clipboard",
        detail: "Reconnaissance means gathering facts about a system. Here you do it as the defender, on your own lab machine only.",
      },
      {
        icon: "door-open",
        caption: "Which doors exist and open?",
        detail: "Built-in cmdlets such as Get-NetTCPConnection and Get-SmbShare show listening ports and shared folders, the doors a system exposes.",
      },
      {
        icon: "key",
        caption: "Who holds the keys?",
        detail: "Checking members of the local Administrators group with Get-LocalGroupMember shows who has the powerful keys.",
      },
      {
        icon: "shield-check",
        caption: "Fix weak spots before attackers",
        detail: "Closing unneeded ports, removing extra admin rights and fixing weak shares reduces what a real attacker could find.",
      },
    ],
  },
  '15-2': {
    title: "Mailroom and the AMSI clerk",
    panels: [
      {
        icon: "mail",
        caption: "Paper letters can be inspected",
        detail: "A script saved as a file on disk can be read and scanned by security tools before and after it runs.",
      },
      {
        icon: "zap",
        caption: "Spoken letters leave no paper",
        detail: "Fileless activity runs from memory or from a command string and may never be saved as a file, so there is nothing on disk to scan.",
      },
      {
        icon: "search",
        caption: "Learn to spot scrambled envelopes",
        detail: "Obfuscation hides the meaning of a command, for example with encoded text or split strings. Defenders learn to recognize these as warning signs.",
      },
      {
        icon: "eye",
        caption: "The clerk hears the real words",
        detail: "AMSI (the Antimalware Scan Interface) lets antivirus software inspect script content, usually after PowerShell has decoded it and just before it runs.",
      },
    ],
  },
  '16-1': {
    title: "Security camera and diary",
    panels: [
      {
        icon: "eye",
        caption: "A camera films every action",
        detail: "Script Block Logging records the code PowerShell runs in the event log (event ID 4104 in the PowerShell Operational log).",
      },
      {
        icon: "code",
        caption: "Even scrambled notes are filmed",
        detail: "The logged script block is usually the decoded code that actually ran, which helps investigators read obfuscated commands.",
      },
      {
        icon: "file-text",
        caption: "A diary of everything shown",
        detail: "Transcription writes the commands typed and the output displayed in a session to a text file.",
      },
      {
        icon: "search",
        caption: "Jump straight to the moment",
        detail: "Get-WinEvent with a filter such as FilterHashtable pulls out just the events you need instead of reading the whole log.",
      },
    ],
  },
  '16-2': {
    title: "Securing a power-tool workshop",
    panels: [
      {
        icon: "wrench",
        caption: "A workshop full of power tools",
        detail: "PowerShell is powerful, so hardening means reducing what it allows to what people actually need.",
      },
      {
        icon: "trash",
        caption: "Remove the old unguarded saw",
        detail: "PowerShell 2.0 lacks modern protections such as AMSI, so removing the optional Windows feature stops it being used to skip them.",
      },
      {
        icon: "lock",
        caption: "Put guards on dangerous machines",
        detail: "Constrained Language Mode limits PowerShell to a safer set of features, and it is typically enforced by an application control policy.",
      },
      {
        icon: "briefcase",
        caption: "A locked cabinet, not master key",
        detail: "JEA (Just Enough Administration) lets a helper connect to a restricted session with only the commands they need, instead of full administrator rights.",
      },
    ],
  },
};
