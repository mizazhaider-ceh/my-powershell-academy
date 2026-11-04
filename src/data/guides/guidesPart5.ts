import { LessonGuide } from '../../types';

export const GUIDES_PART_5: Record<string, LessonGuide> = {
  '13-2': {
    oneSentence:
      'Back up GPOs, force a refresh with Invoke-GPUpdate, read what really applies with Get-GPResultantSetOfPolicy, and automate upkeep with scheduled tasks.',
    analogy:
      'Imagine a company with 5,000 desks. Group Policy is the office rulebook that gets stamped onto every desk automatically: lock your screen after 10 minutes, no USB sticks, wallpaper must be the company logo. Rules come from several levels (head office, regional office, your floor) and the closest one wins an argument. RSoP is the inspector who walks up to one desk and tells you exactly which rule is in force and who wrote it. A Scheduled Task is the office alarm clock that starts a chore for you at 2 AM so you never have to remember.',
    plainEnglish: [
      'A Group Policy Object (GPO) is a bundle of settings that Active Directory pushes to many computers and users at once. You can list, back up, link and refresh them with the GroupPolicy module.',
      'Policies apply in the order Local, Site, Domain, OU (LSDOU). The last one applied wins a conflict, so the policy closest to the computer usually decides, unless a higher one is marked Enforced.',
      'When a setting is not behaving, do not guess. Generate a Resultant Set of Policy (RSoP) report to see the winning setting and the GPO that delivered it.',
      'A Scheduled Task runs a script on a timer. You build it from three pieces: an Action (what to run), a Trigger (when) and a Register step (save it into Windows).',
    ],
    beforeYouStart: [
      'A lab Active Directory domain (two virtual machines are enough) is best. Never practice edits on a production domain.',
      'The RSAT Group Policy Management tools installed on your admin machine (the GroupPolicy module).',
      'A domain account that is allowed to read GPOs. Creating or linking GPOs needs delegated rights or Domain Admin in your lab.',
      'An elevated PowerShell window for anything that registers tasks or writes under C:\\.',
    ],
    atoZSteps: [
      {
        title: 'Step 1: Check the GroupPolicy module exists',
        detail:
          'Run `Get-Module -ListAvailable GroupPolicy`. If nothing is returned, install RSAT Group Policy Management Tools first.',
      },
      {
        title: 'Step 2: Look at what GPOs you already have',
        detail:
          'Run `Get-GPO -All` and read the names and status. This is read-only and tells you what the domain is already enforcing.',
      },
      {
        title: 'Step 3: Take a safety backup',
        detail:
          'Before any change, run `Backup-Gpo -All -Path C:\\GPOBackups`. If an edit goes wrong you can restore in seconds with `Restore-GPO`.',
      },
      {
        title: 'Step 4: Prove which policy won',
        detail:
          'Use `Get-GPResultantSetOfPolicy -ReportType Html` to make a report for one computer, then open the HTML file in your browser and search for the setting.',
      },
      {
        title: 'Step 5: Push a refresh instead of waiting',
        detail:
          'Policies refresh roughly every 90 minutes on their own. `Invoke-GPUpdate -Computer SRV-CORE01 -Force -RandomDelayInMinutes 0` asks a remote machine to refresh right now (without `-RandomDelayInMinutes 0` it waits a random delay of up to 10 minutes). The target\'s firewall must allow Remote Scheduled Tasks Management and WMI.',
      },
      {
        title: 'Step 6: Build a scheduled task from three pieces',
        detail:
          'Make an Action with `New-ScheduledTaskAction`, a Trigger with `New-ScheduledTaskTrigger`, then save them with `Register-ScheduledTask`. Remember: the Action runs `powershell.exe` and your .ps1 goes in the arguments.',
      },
      {
        title: 'Step 7: Test and clean up in the lab',
        detail:
          'Run the task once with `Start-ScheduledTask`, read `Get-ScheduledTaskInfo`, then remove practice tasks with `Unregister-ScheduledTask`.',
      },
    ],
    wordsYouWillMeet: [
      { word: 'GPO', meaning: 'Group Policy Object. A named bundle of settings stored in Active Directory.' },
      { word: 'LSDOU', meaning: 'The order policies apply: Local, Site, Domain, Organizational Unit. Last one wins.' },
      { word: 'OU', meaning: 'Organizational Unit. A folder in Active Directory that holds users and computers.' },
      { word: 'RSoP', meaning: 'Resultant Set of Policy. The final combined settings a computer or user really ends up with.' },
      { word: 'Trigger', meaning: 'The "when" part of a scheduled task, such as daily at 2 AM or at startup.' },
      { word: 'Principal', meaning: 'The account a scheduled task runs as, such as SYSTEM.' },
    ],
    beginner: {
      intro:
        'These commands only read information. They show you what the policy tools and Task Scheduler already know, so you can look around safely.',
      commands: [
        {
          title: 'Is the GroupPolicy module installed?',
          code: 'Get-Module -ListAvailable GroupPolicy',
          whatItDoes: 'Checks whether the Group Policy cmdlets are available on this computer.',
          parts: [
            { part: 'Get-Module', meaning: 'Lists PowerShell modules (bundles of commands).' },
            { part: '-ListAvailable', meaning: 'Shows modules installed on disk, not only the ones already loaded.' },
            { part: 'GroupPolicy', meaning: 'The name of the module that holds Get-GPO, Backup-Gpo and friends.' },
          ],
          sampleOutput: 'ModuleType Version Name        ExportedCommands\n---------- ------- ----        ----------------\nManifest   1.0.0.0 GroupPolicy {Backup-GPO, Copy-GPO, Get-GPO...}',
          watchOut: 'No output means RSAT is missing, so the other GPO commands will not be recognised.',
        },
        {
          title: 'List the GPOs in the domain',
          code: 'Get-GPO -All | Select-Object DisplayName, GpoStatus, ModificationTime',
          whatItDoes: 'Shows every GPO with its name, whether it is enabled, and when it was last edited.',
          parts: [
            { part: 'Get-GPO -All', meaning: 'Reads every Group Policy Object in the current domain. Get means read-only.' },
            { part: '|', meaning: 'The pipe. Sends the GPOs to the next command.' },
            { part: 'Select-Object DisplayName, GpoStatus, ModificationTime', meaning: 'Keeps only three columns so the table is easy to read.' },
          ],
          sampleOutput: 'DisplayName               GpoStatus          ModificationTime\n-----------               ---------          ----------------\nDefault Domain Policy     AllSettingsEnabled 11/2/2026 9:14:03 AM\nSEC-Server-Hardening      AllSettingsEnabled 11/3/2026 4:20:41 PM',
          watchOut: 'Run it on a domain-joined machine with RSAT. On a standalone PC it fails because there is no domain to ask.',
        },
        {
          title: 'See which policies apply to this computer',
          code: 'gpresult /r /scope computer',
          whatItDoes: 'Prints a quick text summary of the GPOs that applied to this computer, with no changes made.',
          parts: [
            { part: 'gpresult', meaning: 'A built-in Windows program that reports the Resultant Set of Policy.' },
            { part: '/r', meaning: 'Show a short summary on screen.' },
            { part: '/scope computer', meaning: 'Only the computer half of policy. Use "user" for the user half.' },
          ],
          watchOut: 'Open an elevated window for the computer scope, otherwise Windows may say you lack permission.',
        },
        {
          title: 'Peek at the scheduled tasks on this PC',
          code: 'Get-ScheduledTask | Select-Object -First 10 TaskName, State',
          whatItDoes: 'Lists the first ten scheduled tasks and whether each is Ready, Running or Disabled.',
          parts: [
            { part: 'Get-ScheduledTask', meaning: 'Reads tasks from Windows Task Scheduler.' },
            { part: 'Select-Object -First 10', meaning: 'Stops after the first ten results so the screen stays tidy.' },
            { part: 'TaskName, State', meaning: 'The two columns you want to see.' },
          ],
          sampleOutput: 'TaskName                State\n--------                -----\nGoogleUpdateTaskUser    Ready\nOneDrive Standalone...  Ready',
        },
      ],
    },
    intermediate: {
      intro:
        'Now you will back up, report, and refresh. These commands write files or make machines re-read policy, so use your lab domain first.',
      commands: [
        {
          title: 'Back up every GPO before you edit anything',
          code: 'New-Item -ItemType Directory -Path C:\\GPOBackups -Force | Out-Null\nBackup-Gpo -All -Path C:\\GPOBackups',
          whatItDoes: 'Creates a backup folder and saves a copy of every GPO into it. This is your undo button.',
          parts: [
            { part: 'New-Item -ItemType Directory -Force', meaning: 'Makes the folder, and does not complain if it already exists.' },
            { part: '| Out-Null', meaning: 'Hides the confirmation text so only the backup results show.' },
            { part: 'Backup-Gpo -All', meaning: 'Exports every GPO in the domain.' },
            { part: '-Path C:\\GPOBackups', meaning: 'The folder where the backup files are written.' },
          ],
          watchOut: 'Store backups somewhere secure. GPO backups can contain sensitive settings such as scripts and security rules.',
        },
        {
          title: 'Build an HTML report for one computer',
          code: 'Get-GPResultantSetOfPolicy -Computer "SRV-CORE01" -ReportType Html -Path "C:\\Reports\\SRV-CORE01-RSoP.html"',
          whatItDoes: 'Calculates the final policy settings on SRV-CORE01 and saves a report you can open in a browser.',
          parts: [
            { part: 'Get-GPResultantSetOfPolicy', meaning: 'Calculates the Resultant Set of Policy (the final winning settings).' },
            { part: '-Computer "SRV-CORE01"', meaning: 'The target machine to analyse.' },
            { part: '-ReportType Html', meaning: 'Output a web page instead of XML.' },
            { part: '-Path', meaning: 'Where to save the report file. The folder must exist.' },
          ],
          watchOut: 'This cmdlet works on Windows PowerShell 5.1 only and needs remote admin rights on the target. If it fails in PowerShell 7, switch to the blue PowerShell 5.1 window.',
        },
        {
          title: 'Force a remote policy refresh',
          code: 'Invoke-GPUpdate -Computer "SRV-CORE01" -Force -RandomDelayInMinutes 0',
          whatItDoes: 'Tells SRV-CORE01 to re-read all policies right now instead of waiting for the normal cycle.',
          parts: [
            { part: 'Invoke-GPUpdate', meaning: 'The PowerShell version of gpupdate, but able to target a remote computer.' },
            { part: '-Computer "SRV-CORE01"', meaning: 'The machine to refresh.' },
            { part: '-Force', meaning: 'Reapply every setting, not just the ones that changed.' },
            { part: '-RandomDelayInMinutes 0', meaning: 'Skip the built-in random wait so it starts immediately.' },
          ],
          watchOut: 'A forced refresh can apply a bad policy instantly. Test on a lab or pilot OU first. Remote refresh also needs the target\'s firewall to allow Remote Scheduled Tasks Management and WMI (inbound); if it fails, test with `gpupdate /force` on the target itself.',
        },
      ],
    },
    pro: {
      intro:
        'Pro admins combine these cmdlets into repeatable, reviewable automation. Everything here changes the system, so it belongs on a lab domain first.',
      commands: [
        {
          title: 'Create a GPO and link it to an OU',
          code: 'New-GPO -Name "LAB-Server-Hardening" -Comment "Lab only" |\n  New-GPLink -Target "OU=Servers,DC=corp,DC=example,DC=com" -LinkEnabled No',
          whatItDoes: 'Creates a new empty GPO and links it to the Servers OU in a disabled state, so you can add settings and review before turning it on.',
          parts: [
            { part: 'New-GPO -Name ... -Comment ...', meaning: 'Creates a new Group Policy Object with a label.' },
            { part: '|', meaning: 'Pipes the new GPO straight into the link command.' },
            { part: 'New-GPLink -Target "OU=..."', meaning: 'Links the GPO to the OU or domain named by its distinguished name.' },
            { part: '-LinkEnabled No', meaning: 'Links it but keeps it switched off until you are ready.' },
          ],
          watchOut: 'New-GPO and New-GPLink have no -WhatIf, so double-check the OU path and use a lab domain. Undo with Remove-GPLink and Remove-GPO.',
        },
        {
          title: 'Register a nightly script as a scheduled task',
          code: '$action    = New-ScheduledTaskAction -Execute "powershell.exe" -Argument \'-NoProfile -ExecutionPolicy RemoteSigned -File "C:\\Scripts\\NightlyCleanup.ps1"\'\n$trigger   = New-ScheduledTaskTrigger -Daily -At 2:00AM\n$principal = New-ScheduledTaskPrincipal -UserId "NT AUTHORITY\\SYSTEM" -LogonType ServiceAccount -RunLevel Highest\nRegister-ScheduledTask -TaskName "Lab-NightlyCleanup" -Action $action -Trigger $trigger -Principal $principal',
          whatItDoes: 'Runs your cleanup script every night at 2 AM as SYSTEM, with no one logged in, using a task principal and the RemoteSigned policy (not Bypass).',
          parts: [
            { part: 'New-ScheduledTaskAction -Execute -Argument', meaning: 'Defines the program to launch. The .ps1 file goes inside -Argument with -File. Use RemoteSigned (or AllSigned with a signed script), never Bypass.' },
            { part: 'New-ScheduledTaskTrigger -Daily -At 2:00AM', meaning: 'Defines when the task fires.' },
            { part: 'New-ScheduledTaskPrincipal -UserId -LogonType -RunLevel', meaning: 'Defines who the task runs as and with what privileges. Pick the least privileged account that works.' },
            { part: 'Register-ScheduledTask -TaskName ... -Principal', meaning: 'Saves the task into Windows Task Scheduler with a name and that principal.' },
          ],
          watchOut: 'Run it elevated in a lab VM. Anything a SYSTEM task runs has full power, so keep C:\\Scripts writable only by Administrators (restrict the ACL), or any user who can edit the .ps1 can run code as SYSTEM.',
        },
        {
          title: 'Test the task, then remove it',
          code: 'Start-ScheduledTask -TaskName "Lab-NightlyCleanup"\nGet-ScheduledTaskInfo -TaskName "Lab-NightlyCleanup" | Select-Object LastRunTime, LastTaskResult\nUnregister-ScheduledTask -TaskName "Lab-NightlyCleanup" -Confirm:$false -WhatIf',
          whatItDoes: 'Starts the task once, checks whether it succeeded (0 means success), and previews the delete with -WhatIf.',
          parts: [
            { part: 'Start-ScheduledTask', meaning: 'Runs the task right now instead of waiting for the trigger.' },
            { part: 'Get-ScheduledTaskInfo', meaning: 'Reports last run time and the result code.' },
            { part: 'Unregister-ScheduledTask', meaning: 'Deletes the task from Task Scheduler.' },
            { part: '-WhatIf', meaning: 'Only shows what would be deleted. Remove it when you really want to delete.' },
          ],
          sampleOutput: 'LastRunTime           LastTaskResult\n-------------           --------------\n11/4/2026 3:50:02 AM                 0',
        },
        {
          title: 'Export every GPO to HTML for an audit',
          code: 'Get-GPOReport -All -ReportType Html -Path C:\\Reports\\AllGPOs.html',
          whatItDoes: 'Creates a single HTML document describing the settings and links of every GPO, handy for audits and change reviews.',
          parts: [
            { part: 'Get-GPOReport', meaning: 'Generates a settings report for GPOs (read-only).' },
            { part: '-All', meaning: 'Include every GPO in the domain.' },
            { part: '-ReportType Html', meaning: 'Output format is a web page.' },
            { part: '-Path', meaning: 'File to create. The folder must already exist.' },
          ],
        },
      ],
    },
    recap: [
      'GPOs apply in LSDOU order (Local, Site, Domain, OU) and the closest one wins unless a higher one is Enforced.',
      'Always run Backup-Gpo -All before editing, and prove results with Get-GPResultantSetOfPolicy HTML reports.',
      'Invoke-GPUpdate -Force -RandomDelayInMinutes 0 refreshes a machine on demand (the default random delay is up to 10 minutes), so use it carefully and test first.',
      'A scheduled task is Action + Trigger + Principal + Register. Run powershell.exe with -File and RemoteSigned, never the .ps1 directly and never Bypass.',
      'When you get stuck: run `gpresult /h C:\\Reports\\gp.html /f` on the target and read Applied and Denied GPOs.',
    ],
  },

  '14-1': {
    oneSentence:
      'Try/Catch only catches terminating errors, so add -ErrorAction Stop to turn silent failures into ones your script can handle, and use @Splatting to keep calls readable.',
    analogy:
      'Think of a script as a delivery driver following a route. Without error handling, a blocked road just makes the driver shrug and keep driving to the next stop, so the whole day goes wrong without anyone noticing. Try/Catch is giving the driver a rule: "If a road is blocked, stop and call me." Finally is the end-of-day rule: "No matter what happened, lock the van." Splatting is handing the driver a neat clipboard of instructions instead of shouting 12 details at them in one long sentence.',
    plainEnglish: [
      'PowerShell has two kinds of errors. Terminating errors stop everything and Try/Catch sees them. Non-terminating errors print red text and carry on, and Try/Catch silently ignores them by default.',
      'The fix is `-ErrorAction Stop`. It turns a non-terminating error into a terminating one so your Catch block really runs.',
      '`Finally` always runs, even after an error, which makes it perfect for cleanup such as closing sessions or deleting temp files.',
      'Splatting stores parameters in a hashtable (a list of name and value pairs) and passes them with `@` instead of `$`. Your commands become shorter and easier to read.',
    ],
    beforeYouStart: [
      'Any Windows machine with PowerShell 5.1 or 7. These lessons are safe to practice on your own PC.',
      'A text editor such as VS Code or the PowerShell ISE for multi-line examples.',
      'Basic comfort with variables like `$name` and with the pipe symbol |.',
    ],
    atoZSteps: [
      {
        title: 'Step 1: Cause a harmless error',
        detail:
          'Run `Get-Item C:\\DoesNotExist`. You get red text and nothing bad happens. This is a non-terminating error in action.',
      },
      {
        title: 'Step 2: Wrap it in Try/Catch without -ErrorAction',
        detail:
          'Put the same command inside `try { }` with a `catch { }` that prints a message. Surprise: sometimes your catch does not run. This is the classic trap.',
      },
      {
        title: 'Step 3: Add -ErrorAction Stop',
        detail:
          'Add `-ErrorAction Stop` to the command inside try. Now the error becomes terminating and your catch block fires.',
      },
      {
        title: 'Step 4: Read the error inside catch',
        detail:
          'Inside catch, `$_` (also `$PSItem`) is the error. Use `$_.Exception.Message` to print a friendly reason.',
      },
      {
        title: 'Step 5: Add a finally block',
        detail:
          'Add `finally { }` after catch for cleanup code that must always run, whether the command worked or failed.',
      },
      {
        title: 'Step 6: Tidy long commands with splatting',
        detail:
          'Put parameters in a hashtable such as `$params = @{ Path = "C:\\Temp"; Recurse = $true }` and call `Get-ChildItem @params`.',
      },
      {
        title: 'Step 7: Combine them',
        detail:
          'Use a splatted hashtable that already includes `ErrorAction = "Stop"` and run it inside try/catch. This is the pattern professional scripts use.',
      },
    ],
    wordsYouWillMeet: [
      { word: 'Terminating error', meaning: 'An error serious enough to stop the current command and trigger Catch.' },
      { word: 'Non-terminating error', meaning: 'An error that prints red text but lets the script continue.' },
      { word: '-ErrorAction', meaning: 'A common parameter that decides how a command reacts to errors (Stop, Continue, SilentlyContinue).' },
      { word: '$_ / $PSItem', meaning: 'Inside a catch block, the error that was just caught.' },
      { word: 'Hashtable', meaning: 'A list of key and value pairs written like @{ Name = "Value" }.' },
      { word: 'Splatting', meaning: 'Passing a hashtable as parameters using @name instead of $name.' },
    ],
    beginner: {
      intro:
        'These examples cause tiny, harmless errors on purpose so you can watch how PowerShell reacts. Nothing here changes your system.',
      commands: [
        {
          title: 'See a normal (non-terminating) error',
          code: 'Get-Item C:\\DoesNotExist',
          whatItDoes: 'Tries to read a file that is not there. PowerShell prints a red error and returns to the prompt.',
          parts: [
            { part: 'Get-Item', meaning: 'Reads a file, folder or other item. It never changes anything.' },
            { part: 'C:\\DoesNotExist', meaning: 'A path that does not exist, used to trigger an error on purpose.' },
          ],
          sampleOutput: 'Get-Item : Cannot find path \'C:\\DoesNotExist\' because it does not exist.',
        },
        {
          title: 'Catch it the right way',
          code: 'try {\n    Get-Item C:\\DoesNotExist -ErrorAction Stop\n}\ncatch {\n    "Caught: $($_.Exception.Message)"\n}',
          whatItDoes: 'Forces the error to be terminating so catch runs and prints a clean message.',
          parts: [
            { part: 'try { }', meaning: 'The block of code you want to watch for errors.' },
            { part: '-ErrorAction Stop', meaning: 'Turns a normal error into one that Try/Catch can catch.' },
            { part: 'catch { }', meaning: 'Code that runs only when an error happened.' },
            { part: '$_.Exception.Message', meaning: 'The readable error text from the caught error.' },
          ],
          sampleOutput: 'Caught: Cannot find path \'C:\\DoesNotExist\' because it does not exist.',
          watchOut: 'Remove -ErrorAction Stop and, for many cmdlets, the catch block never runs. This is the number one mistake.',
        },
        {
          title: 'Look at your current error setting',
          code: '$ErrorActionPreference',
          whatItDoes: 'Shows the default reaction to errors in this session. The default is Continue (print the error and keep going).',
          parts: [
            { part: '$ErrorActionPreference', meaning: 'A built-in variable that sets the default -ErrorAction for every command.' },
          ],
          sampleOutput: 'Continue',
        },
      ],
    },
    intermediate: {
      intro:
        'Now add cleanup with Finally, react to different error types, and use splatting to keep long commands readable.',
      commands: [
        {
          title: 'Try, Catch and Finally together',
          code: 'try {\n    $text = Get-Content "C:\\Temp\\settings.txt" -ErrorAction Stop\n    "Read $($text.Count) lines"\n}\ncatch {\n    Write-Warning "Could not read file: $($_.Exception.Message)"\n}\nfinally {\n    "Done. This line always runs."\n}',
          whatItDoes: 'Reads a file, warns clearly if that fails, and always prints the final message.',
          parts: [
            { part: 'Get-Content ... -ErrorAction Stop', meaning: 'Reads the file and makes any failure catchable.' },
            { part: 'Write-Warning', meaning: 'Prints a yellow warning message without stopping the script.' },
            { part: 'finally { }', meaning: 'Runs no matter what. Use it to close connections or delete temp files.' },
          ],
        },
        {
          title: 'Catch a specific kind of error',
          code: 'try {\n    Get-Item C:\\Missing -ErrorAction Stop\n}\ncatch [System.Management.Automation.ItemNotFoundException] {\n    "That path is missing."\n}\ncatch {\n    "Something else went wrong: $($_.Exception.Message)"\n}',
          whatItDoes: 'Gives a custom reply for the not-found case and a general reply for everything else.',
          parts: [
            { part: 'catch [Type]', meaning: 'Catches only errors of that exact .NET type. Square brackets name the type.' },
            { part: 'second catch { }', meaning: 'A catch-all that handles anything the first one did not.' },
          ],
          watchOut: 'Put the specific catch first. PowerShell uses the first one that matches.',
        },
        {
          title: 'Splat parameters from a hashtable',
          code: '$params = @{\n    Path        = "C:\\Windows\\System32"\n    Filter      = "*.dll"\n    ErrorAction = "SilentlyContinue"\n}\nGet-ChildItem @params | Select-Object -First 3 Name, Length',
          whatItDoes: 'Runs Get-ChildItem using a neat list of settings instead of one very long line.',
          parts: [
            { part: '@{ ... }', meaning: 'Creates a hashtable. Each line is Name = Value.' },
            { part: '$params', meaning: 'The variable that stores the hashtable.' },
            { part: '@params', meaning: 'The splat. It uses @ instead of $ so PowerShell spreads the pairs out as parameters.' },
            { part: 'ErrorAction = "SilentlyContinue"', meaning: 'Hides errors for unreadable files. Use sparingly, since silence hides real problems.' },
          ],
          watchOut: 'Writing $params instead of @params passes the whole hashtable as one value and the command fails.',
        },
      ],
    },
    pro: {
      intro:
        'Professional scripts fail loudly, clean up, log errors, and retry flaky steps. Run these in a lab folder first.',
      commands: [
        {
          title: 'Make the whole script stop on any error',
          code: 'Set-StrictMode -Version Latest\n$ErrorActionPreference = "Stop"',
          whatItDoes: 'Puts a script in strict mode: typos in variable names become errors, and every normal error becomes catchable.',
          parts: [
            { part: 'Set-StrictMode -Version Latest', meaning: 'Turns on stricter rules, for example using a variable that was never set is an error.' },
            { part: '$ErrorActionPreference = "Stop"', meaning: 'Makes Stop the default for every command in this scope.' },
          ],
          watchOut: 'Put these at the top of scripts, not in your everyday console, because they make interactive use noisy.',
        },
        {
          title: 'Retry a flaky operation',
          code: '$attempt = 0\ndo {\n    $attempt++\n    try {\n        Invoke-RestMethod -Uri "https://example.com/api/health" -TimeoutSec 5 -ErrorAction Stop\n        break\n    }\n    catch {\n        Write-Warning "Attempt $attempt failed: $($_.Exception.Message)"\n        Start-Sleep -Seconds (2 * $attempt)\n    }\n} while ($attempt -lt 3)',
          whatItDoes: 'Tries a web call up to three times, waiting a little longer after each failure.',
          parts: [
            { part: 'do { } while (...)', meaning: 'A loop that runs at least once and repeats while the condition is true.' },
            { part: 'break', meaning: 'Leaves the loop as soon as the call succeeds.' },
            { part: 'Start-Sleep -Seconds (2 * $attempt)', meaning: 'Pauses 2, then 4, then 6 seconds (a simple back-off).' },
            { part: '$attempt++', meaning: 'Adds 1 to the counter each loop.' },
          ],
          watchOut: 'Replace example.com with a service you own. Never retry actions that are not safe to repeat, such as payments.',
        },
        {
          title: 'Splat with remoting, logging and an error variable',
          code: '$invoke = @{\n    ComputerName  = "SRV-CORE01"\n    ScriptBlock   = { Get-Service -Name Spooler }\n    ErrorAction   = "Stop"\n    ErrorVariable = "remoteErr"\n}\ntry { Invoke-Command @invoke }\ncatch { Add-Content C:\\Logs\\errors.log "$(Get-Date -f s) $($remoteErr[0].Exception.Message)" }',
          whatItDoes: 'Runs a read-only remote check and writes any failure with a timestamp to a log file.',
          parts: [
            { part: 'ErrorVariable = "remoteErr"', meaning: 'Saves the error into $remoteErr (written without the $ in the hashtable).' },
            { part: 'Invoke-Command @invoke', meaning: 'Runs the script block on the remote computer using the splatted settings.' },
            { part: 'Add-Content', meaning: 'Appends a line to a log file, creating it if needed.' },
            { part: '$(Get-Date -f s)', meaning: 'A sortable timestamp placed inside the string.' },
          ],
          watchOut: 'The folder C:\\Logs must exist and the remote machine needs PowerShell Remoting enabled. Test against a lab server.',
        },
        {
          title: 'Add a safety net with throw and a cleanup block',
          code: 'function Remove-OldLogs {\n    param([string]$Path)\n    if (-not (Test-Path $Path)) { throw "Folder not found: $Path" }\n    try {\n        Get-ChildItem $Path -Filter *.log -ErrorAction Stop |\n            Where-Object LastWriteTime -lt (Get-Date).AddDays(-30) |\n            Remove-Item -WhatIf\n    }\n    finally { Write-Verbose "Cleanup check finished" }\n}',
          whatItDoes: 'Fails early with a clear message when the folder is missing and previews deleting logs older than 30 days.',
          parts: [
            { part: 'throw "..."', meaning: 'Creates your own terminating error with a message.' },
            { part: 'Where-Object LastWriteTime -lt (...)', meaning: 'Keeps only files last changed before the date 30 days ago.' },
            { part: 'Remove-Item -WhatIf', meaning: 'Shows what would be deleted without deleting. Remove -WhatIf only after you trust the output.' },
          ],
        },
      ],
    },
    recap: [
      'Try/Catch only sees terminating errors, so add -ErrorAction Stop to commands inside try.',
      'Use $_.Exception.Message in catch, and put cleanup code in finally because it always runs.',
      'Splatting (@params with a hashtable) makes long commands readable and reusable.',
      'Scripts should start with strict mode and Stop, retry only safe actions, and log failures.',
    ],
  },

  '14-2': {
    oneSentence:
      'Add [CmdletBinding()] and begin, process, and end blocks to make your own functions behave exactly like built-in cmdlets, complete with -Verbose and -WhatIf.',
    analogy:
      'A basic function is like a handwritten recipe card. An advanced function with [CmdletBinding()] is the same recipe turned into a professional kitchen appliance: it has a proper control panel (parameters), a "tell me what you are doing" light (-Verbose), a "pretend only" button (-WhatIf) and a conveyor belt that handles many ingredients one at a time (the pipeline).',
    plainEnglish: [
      'A function is a named block of code you can run again and again. Writing functions means you fix a bug in one place instead of ten.',
      'Adding `[CmdletBinding()]` above `param()` instantly gives your function the standard cmdlet extras such as -Verbose, -Debug, -ErrorAction and -WhatIf (when you enable it).',
      'To accept pipeline input, mark a parameter with `ValueFromPipeline` and place your work inside a `process { }` block so it runs once per item.',
      'Good tools validate input, explain themselves with comment-based help, and are saved in a module so teammates can import them.',
    ],
    beforeYouStart: [
      'You are comfortable with variables, `if` and `foreach`.',
      'VS Code (with the PowerShell extension) or the PowerShell ISE for writing multi-line functions.',
      'Execution policy that lets you load your own scripts (for example `Set-ExecutionPolicy RemoteSigned -Scope CurrentUser` on a lab or personal PC).',
    ],
    atoZSteps: [
      {
        title: 'Step 1: Write the smallest function',
        detail:
          'Type `function Say-Hello { "Hello" }` then run `Say-Hello`. You just created your own command.',
      },
      {
        title: 'Step 2: Add a parameter',
        detail:
          'Change it to `function Say-Hello { param([string]$Name) "Hello $Name" }` and run `Say-Hello -Name Sam`.',
      },
      {
        title: 'Step 3: Turn it into an advanced function',
        detail:
          'Put `[CmdletBinding()]` on the line above `param(...)`. Run `(Get-Command Say-Hello).Parameters.Keys` and notice the free common parameters.',
      },
      {
        title: 'Step 4: Add validation',
        detail:
          'Use `[Parameter(Mandatory)]` to demand a value, and `[ValidateSet("A","B")]` to allow only certain choices. PowerShell checks them for you.',
      },
      {
        title: 'Step 5: Accept pipeline input',
        detail:
          'Add `ValueFromPipeline` to the parameter and wrap your logic in `process { }` so it runs once per piped item.',
      },
      {
        title: 'Step 6: Add -WhatIf for risky tools',
        detail:
          'Use `[CmdletBinding(SupportsShouldProcess)]` and wrap the dangerous line in `if ($PSCmdlet.ShouldProcess($target, "Action")) { ... }`.',
      },
      {
        title: 'Step 7: Save it in a module',
        detail:
          'Put functions in a `.psm1` file, end with `Export-ModuleMember`, then `Import-Module .\\MyTools.psm1` to share your toolkit.',
      },
    ],
    wordsYouWillMeet: [
      { word: 'Function', meaning: 'A named, reusable block of PowerShell code.' },
      { word: '[CmdletBinding()]', meaning: 'An attribute that upgrades a function into an advanced function with cmdlet features.' },
      { word: 'param()', meaning: 'The block at the top of a function where you declare its inputs.' },
      { word: 'Begin / Process / End', meaning: 'Three blocks: run once at start, once per piped item, and once at the finish.' },
      { word: 'ShouldProcess', meaning: 'The mechanism behind -WhatIf and -Confirm.' },
      { word: 'Module', meaning: 'A .psm1 file that bundles functions so they can be imported.' },
    ],
    beginner: {
      intro:
        'You will write tiny functions that only print text or read information. Type each one into a console, press Enter, then call it by name.',
      commands: [
        {
          title: 'Your first function',
          code: 'function Get-Greeting {\n    param([string]$Name = "friend")\n    "Hello, $Name!"\n}\nGet-Greeting -Name "Sam"',
          whatItDoes: 'Defines a command called Get-Greeting that says hello to whoever you name.',
          parts: [
            { part: 'function Get-Greeting { }', meaning: 'Creates the command. Use the Verb-Noun naming style.' },
            { part: 'param([string]$Name = "friend")', meaning: 'One input called Name that must be text, with a default of "friend".' },
            { part: '"Hello, $Name!"', meaning: 'A string where $Name is replaced by its value, then output.' },
          ],
          sampleOutput: 'Hello, Sam!',
        },
        {
          title: 'List the functions you have defined',
          code: 'Get-ChildItem Function:\\ | Where-Object Name -like "Get-G*"',
          whatItDoes: 'Looks inside the Function drive (a list of all loaded functions) and shows those starting with Get-G.',
          parts: [
            { part: 'Function:\\', meaning: 'A PowerShell drive, like C:, that holds every function in memory.' },
            { part: 'Where-Object Name -like "Get-G*"', meaning: 'Keeps only names that match the pattern. The * is a wildcard.' },
          ],
          watchOut: 'Functions live only for the current session. Close the window and they vanish unless saved in a script or module.',
        },
        {
          title: 'See what a command accepts',
          code: 'Get-Help Get-Service -Parameter Name',
          whatItDoes: 'Shows how one parameter of a real cmdlet is described. Good tool-makers copy this clear style.',
          parts: [
            { part: 'Get-Help', meaning: 'Shows the built-in manual for a command.' },
            { part: 'Get-Service', meaning: 'The command whose help you want to read.' },
            { part: '-Parameter Name', meaning: 'Show just the details for the -Name parameter.' },
          ],
        },
      ],
    },
    intermediate: {
      intro:
        'Now upgrade to advanced functions: validation, -Verbose, and streaming pipeline input. These still only read data.',
      commands: [
        {
          title: 'An advanced function with validation and -Verbose',
          code: 'function Get-BigFile {\n    [CmdletBinding()]\n    param(\n        [Parameter(Mandatory)][string]$Path,\n        [ValidateRange(1,10000)][int]$MinMB = 100\n    )\n    Write-Verbose "Searching $Path for files over $MinMB MB"\n    Get-ChildItem $Path -File -Recurse -ErrorAction SilentlyContinue |\n        Where-Object Length -gt ($MinMB * 1MB)\n}\nGet-BigFile -Path C:\\Windows\\Temp -MinMB 5 -Verbose',
          whatItDoes: 'Finds big files in a folder, refuses bad inputs, and prints extra detail when you add -Verbose.',
          parts: [
            { part: '[CmdletBinding()]', meaning: 'Adds -Verbose, -ErrorAction and other common parameters for free.' },
            { part: '[Parameter(Mandatory)]', meaning: 'PowerShell asks for the value if you forget it.' },
            { part: '[ValidateRange(1,10000)]', meaning: 'Rejects numbers outside the range before your code runs.' },
            { part: 'Write-Verbose', meaning: 'Message that appears only when the caller uses -Verbose.' },
            { part: '1MB', meaning: 'A built-in size shortcut that equals 1,048,576 bytes.' },
          ],
        },
        {
          title: 'Process pipeline input one item at a time',
          code: 'function Get-ServiceSummary {\n    [CmdletBinding()]\n    param([Parameter(Mandatory, ValueFromPipeline)][string[]]$Name)\n    process {\n        foreach ($n in $Name) {\n            Get-Service -Name $n -ErrorAction SilentlyContinue |\n                Select-Object Name, Status\n        }\n    }\n}\n"Spooler","W32Time" | Get-ServiceSummary',
          whatItDoes: 'Lets you pipe service names into your own function and get a Name and Status result for each.',
          parts: [
            { part: 'ValueFromPipeline', meaning: 'Allows the parameter to receive items sent by the pipe.' },
            { part: 'process { }', meaning: 'Runs once for each piped item, so results stream out immediately.' },
            { part: '[string[]]', meaning: 'An array of text values. The brackets after string mean "many".' },
            { part: '"Spooler","W32Time" | ...', meaning: 'Two names piped into the function.' },
          ],
          sampleOutput: 'Name    Status\n----    ------\nSpooler Running\nW32Time Running',
          watchOut: 'Without a process block, only the last piped item is handled.',
        },
        {
          title: 'Add help text people can read',
          code: 'function Get-Uptime {\n    <#\n    .SYNOPSIS\n    Shows how long this PC has been running.\n    .EXAMPLE\n    Get-Uptime\n    #>\n    [CmdletBinding()]\n    param()\n    (Get-Date) - (Get-CimInstance Win32_OperatingSystem).LastBootUpTime\n}\nGet-Help Get-Uptime -Examples',
          whatItDoes: 'Adds comment-based help so Get-Help describes your function like a real cmdlet.',
          parts: [
            { part: '<# ... #>', meaning: 'A block comment. PowerShell reads the dot keywords inside as help.' },
            { part: '.SYNOPSIS / .EXAMPLE', meaning: 'Help sections that Get-Help shows.' },
            { part: 'Get-CimInstance Win32_OperatingSystem', meaning: 'Reads operating system facts including LastBootUpTime.' },
            { part: '(Get-Date) - (...)', meaning: 'Subtracting two dates gives a time span.' },
          ],
        },
      ],
    },
    pro: {
      intro:
        'Pro toolmakers add -WhatIf, begin/process/end structure, and modules. The examples that change things always preview first.',
      commands: [
        {
          title: 'Support -WhatIf and -Confirm',
          code: 'function Stop-LabProcess {\n    [CmdletBinding(SupportsShouldProcess, ConfirmImpact = "Medium")]\n    param([Parameter(Mandatory, ValueFromPipelineByPropertyName)][string]$Name)\n    process {\n        foreach ($p in Get-Process -Name $Name -ErrorAction SilentlyContinue) {\n            if ($PSCmdlet.ShouldProcess("$($p.Name) (PID $($p.Id))", "Stop process")) {\n                Stop-Process -Id $p.Id\n            }\n        }\n    }\n}\nStop-LabProcess -Name notepad -WhatIf',
          whatItDoes: 'Builds a safe stop-process tool. With -WhatIf it only reports what it would stop.',
          parts: [
            { part: 'SupportsShouldProcess', meaning: 'Turns on -WhatIf and -Confirm for your function.' },
            { part: '$PSCmdlet.ShouldProcess(target, action)', meaning: 'Returns false under -WhatIf (and prints the preview), true when it is safe to act.' },
            { part: 'ValueFromPipelineByPropertyName', meaning: 'Lets objects with a matching Name property be piped in.' },
            { part: 'Stop-Process -Id', meaning: 'The dangerous action, wrapped inside the safety check.' },
          ],
          watchOut: 'Test with a throwaway process such as Notepad in a lab VM. Never remove the ShouldProcess check from destructive tools.',
        },
        {
          title: 'Begin, Process and End blocks',
          code: 'function Measure-Names {\n    [CmdletBinding()]\n    param([Parameter(ValueFromPipeline)][string]$Name)\n    begin   { $count = 0; Write-Verbose "Starting" }\n    process { $count++ }\n    end     { "Received $count names" }\n}\n"a","b","c" | Measure-Names -Verbose',
          whatItDoes: 'Counts how many items were piped in, using setup before, work during and a summary after.',
          parts: [
            { part: 'begin { }', meaning: 'Runs once before any items arrive. Good for setup.' },
            { part: 'process { }', meaning: 'Runs once for every item.' },
            { part: 'end { }', meaning: 'Runs once after the last item. Good for summaries and cleanup.' },
            { part: '$count++', meaning: 'Adds one to the counter.' },
          ],
          sampleOutput: 'VERBOSE: Starting\nReceived 3 names',
        },
        {
          title: 'Package functions into a module',
          code: 'New-Item -ItemType Directory -Path "$HOME\\Documents\\PowerShell\\Modules\\LabTools" -Force | Out-Null\n"function Get-Hello { \'Hello from LabTools\' }`nExport-ModuleMember -Function Get-Hello" |\n    Set-Content "$HOME\\Documents\\PowerShell\\Modules\\LabTools\\LabTools.psm1"\nImport-Module LabTools -Force\nGet-Hello',
          whatItDoes: 'Creates a tiny module in your user Modules folder, imports it, and runs its function.',
          parts: [
            { part: '$HOME\\Documents\\PowerShell\\Modules', meaning: 'A folder PowerShell 7 searches automatically (Windows PowerShell 5.1 uses WindowsPowerShell instead).' },
            { part: '.psm1', meaning: 'The module file extension.' },
            { part: 'Export-ModuleMember -Function', meaning: 'Chooses which functions are visible to users.' },
            { part: 'Import-Module -Force', meaning: 'Loads (or reloads) the module into the session.' },
          ],
          watchOut: 'This writes files under your profile. For Windows PowerShell 5.1 use the WindowsPowerShell\\Modules folder instead.',
        },
      ],
    },
    recap: [
      '[CmdletBinding()] turns a function into an advanced function with -Verbose, -ErrorAction and more.',
      'Use ValueFromPipeline with a process block so your tool streams results one item at a time.',
      'Add SupportsShouldProcess to any tool that changes things so users can preview with -WhatIf.',
      'Save finished tools as a .psm1 module with comment-based help so others can reuse them.',
    ],
  },

  '15-1': {
    oneSentence:
      'Ethical hackers gather situational awareness with only built-in cmdlets and enumerate Active Directory with the .NET adsisearcher when the AD module is absent.',
    analogy:
      'Before a security guard tests a building, they walk around with a clipboard: Which doors exist? Which are unlocked? Who holds the keys? That is reconnaissance. In this lesson you play the defender doing the same walk on your own lab machine, using only tools already built into Windows, so you can find weak spots before a real attacker does.',
    plainEnglish: [
      'Situational awareness means knowing who you are, what rights you have, what is running and what is listening on the network. Attackers check this first, and so should defenders.',
      'Windows ships with everything needed: `whoami`, WMI/CIM, `Get-NetTCPConnection` and ADSI (Active Directory Service Interfaces, a built-in way to query a domain without installing tools).',
      'Typical weak spots include powerful privileges on normal accounts, services whose file paths contain spaces but no quotes (unquoted service paths), unexpected open ports, and service accounts with SPNs that can be targeted.',
      'Everything in this guide is for systems you own or have written permission to test. Use an isolated lab VM and treat every finding as a fix list, not a trophy.',
    ],
    beforeYouStart: [
      'A lab Windows VM (`CLIENT01` or `SRV-CORE01`), ideally joined to the lab domain `corp.example.com` that you control. Lab setup: see the Lab Setup page. Do not run domain queries on a network you do not own.',
      'Written permission, with a defined scope, if the machine belongs to anyone else. Unauthorised access is illegal in most countries (for example the CFAA in the US and the Computer Misuse Act in the UK). Never run any of this on a work machine.',
      'A standard (non-admin) PowerShell window first. Seeing what a normal user can see is the whole point.',
    ],
    atoZSteps: [
      {
        title: 'Step 1: Confirm your identity',
        detail:
          'Run `whoami /all`. Note your user, groups and the privileges list. This is the attacker view of your account.',
      },
      {
        title: 'Step 2: Read your privileges',
        detail:
          'Run `whoami /priv` and look for powerful entries such as `SeDebugPrivilege` or `SeImpersonatePrivilege`. Disabled is normal; flag any that should not be there.',
      },
      {
        title: 'Step 3: Audit services for risky paths',
        detail:
          'Use `Get-CimInstance Win32_Service` and filter for paths with spaces and no quotes. Each hit is a fix: add quotes and tighten folder permissions.',
      },
      {
        title: 'Step 4: Check what is listening',
        detail:
          'Run `Get-NetTCPConnection -State Listen`, then match the owning process. Any port you cannot explain is worth investigating.',
      },
      {
        title: 'Step 5: Look at the domain with ADSI',
        detail:
          'Use `[adsisearcher]` with an LDAP filter to list accounts that have Service Principal Names (SPNs). These are the accounts whose passwords must be long and strong.',
      },
      {
        title: 'Step 6: Write the fix list',
        detail:
          'For each finding note the owner and the fix: remove a privilege, quote a path, close a port, or give a service account a long random password (or a gMSA).',
      },
    ],
    wordsYouWillMeet: [
      { word: 'Recon', meaning: 'Short for reconnaissance: gathering information before acting.' },
      { word: 'Privilege', meaning: 'A specific right on a computer, such as the right to debug other processes.' },
      { word: 'Unquoted service path', meaning: 'A service file path with spaces and no quotes, which Windows can misinterpret.' },
      { word: 'ADSI', meaning: 'Active Directory Service Interfaces. A built-in .NET way to query a domain.' },
      { word: 'SPN', meaning: 'Service Principal Name. A label that ties a network service to an AD account.' },
      { word: 'LDAP filter', meaning: 'A search expression like (objectClass=user) used to query Active Directory.' },
    ],
    beginner: {
      intro:
        'Every command here is read-only and runs as a normal user. You are just asking Windows to describe itself.',
      commands: [
        {
          title: 'Who am I and what groups am I in?',
          code: 'whoami /groups',
          whatItDoes: 'Lists every security group your logon token belongs to, plus your integrity level.',
          parts: [
            { part: 'whoami', meaning: 'Built-in program that prints identity information.' },
            { part: '/groups', meaning: 'Switch that lists group memberships.' },
          ],
          sampleOutput: 'GROUP INFORMATION\n-----------------\nEveryone                       Well-known group S-1-1-0\nBUILTIN\\Users                  Alias            S-1-5-32-545',
        },
        {
          title: 'What special rights do I hold?',
          code: 'whoami /priv',
          whatItDoes: 'Prints your privileges and whether each is Enabled or Disabled.',
          parts: [
            { part: 'whoami /priv', meaning: 'Shows the token privileges, such as SeShutdownPrivilege.' },
          ],
          sampleOutput: 'Privilege Name                Description                    State\n============================= ============================== ========\nSeChangeNotifyPrivilege       Bypass traverse checking       Enabled',
          watchOut: 'Disabled does not always mean harmless. A holder of a powerful privilege can often enable it, so ask why it is assigned at all.',
        },
        {
          title: 'List the computer\'s listening ports',
          code: 'Get-NetTCPConnection -State Listen | Select-Object LocalAddress, LocalPort, OwningProcess',
          whatItDoes: 'Shows which TCP ports are open and waiting for connections, and which process id owns each.',
          parts: [
            { part: 'Get-NetTCPConnection', meaning: 'Reads the current TCP connections.' },
            { part: '-State Listen', meaning: 'Only ports that are waiting for incoming connections.' },
            { part: 'Select-Object ...', meaning: 'Keeps just the address, port and owner columns.' },
          ],
          sampleOutput: 'LocalAddress LocalPort OwningProcess\n------------ --------- -------------\n0.0.0.0            135           1096\n0.0.0.0            445              4',
        },
      ],
    },
    intermediate: {
      intro:
        'Here you combine tools with the pipeline to turn raw facts into an audit list. All queries are read-only.',
      commands: [
        {
          title: 'Match listening ports to program names',
          code: 'Get-NetTCPConnection -State Listen |\n  Select-Object LocalPort, @{n="Process";e={(Get-Process -Id $_.OwningProcess -ErrorAction SilentlyContinue).ProcessName}} |\n  Sort-Object LocalPort -Unique',
          whatItDoes: 'Adds the process name next to every listening port so you can spot ones that do not belong.',
          parts: [
            { part: '@{n="Process";e={...}}', meaning: 'A calculated property: n is the new column name and e is the code that fills it.' },
            { part: '$_.OwningProcess', meaning: 'The process id from the current row in the pipeline.' },
            { part: 'Get-Process -Id', meaning: 'Looks up the process by its id.' },
            { part: 'Sort-Object LocalPort -Unique', meaning: 'Orders by port and removes duplicate ports.' },
          ],
          watchOut: 'Run elevated in a lab to see process names for system services. A standard user sees blanks for some.',
        },
        {
          title: 'Audit for unquoted service paths',
          code: 'Get-CimInstance Win32_Service |\n  Where-Object { $_.PathName -like \'* *\' -and $_.PathName -notlike \'"*\' -and $_.PathName -notlike \'C:\\Windows\\*\' } |\n  Select-Object Name, StartName, PathName',
          whatItDoes: 'Finds services whose path has a space but is not wrapped in quotes. These are classic misconfigurations to fix.',
          parts: [
            { part: 'Get-CimInstance Win32_Service', meaning: 'Reads every Windows service with its file path.' },
            { part: '-like \'* *\'', meaning: 'Matches text that contains a space.' },
            { part: '-notlike \'"*\'', meaning: 'Excludes paths that already begin with a quote (they are safe).' },
            { part: 'StartName', meaning: 'The account the service runs as. LocalSystem means high power.' },
          ],
          watchOut: 'This is a rough filter: arguments with spaces can cause false positives. Verify each hit and fix by adding quotes and tightening folder permissions.',
        },
        {
          title: 'Query Active Directory with ADSI (no extra tools)',
          code: '$s = [adsisearcher]\'(&(objectCategory=user)(servicePrincipalName=*))\'\n$s.PageSize = 200\n[void]$s.PropertiesToLoad.AddRange(@("samaccountname","serviceprincipalname"))\n$s.FindAll() | ForEach-Object {\n    [pscustomobject]@{ User = $_.Properties["samaccountname"][0]; SPNs = $_.Properties["serviceprincipalname"].Count }\n}',
          whatItDoes: 'Lists user accounts that have SPNs and how many each has, using only built-in .NET.',
          parts: [
            { part: '[adsisearcher]\'filter\'', meaning: 'Creates a directory searcher from an LDAP filter string.' },
            { part: '(&(objectCategory=user)(servicePrincipalName=*))', meaning: 'LDAP filter meaning users AND with any SPN. The & means AND.' },
            { part: 'PropertiesToLoad.AddRange', meaning: 'Asks for only the attributes you need, which is faster and quieter.' },
            { part: 'FindAll()', meaning: 'Runs the search and returns the results.' },
          ],
          watchOut: 'Needs a domain-joined machine. Only run it in a domain you administer; defenders use this list to find service accounts needing strong passwords or gMSAs.',
        },
      ],
    },
    pro: {
      intro:
        'Pro defenders turn recon into repeatable, documented hygiene checks and fix what they find. These stay defensive and read-only unless a command is marked otherwise.',
      commands: [
        {
          title: 'Build a one-page local audit report',
          code: '$report = [ordered]@{\n    Host       = $env:COMPUTERNAME\n    User       = whoami\n    IsAdmin    = ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole("Administrators")\n    Listening  = (Get-NetTCPConnection -State Listen).Count\n    Services   = (Get-Service | Where-Object Status -eq "Running").Count\n}\n[pscustomobject]$report | ConvertTo-Json | Set-Content .\\audit-$($env:COMPUTERNAME).json',
          whatItDoes: 'Collects headline facts into one object and saves them as JSON so you can compare machines or dates.',
          parts: [
            { part: '[ordered]@{ }', meaning: 'A hashtable that keeps keys in the order you wrote them.' },
            { part: '[Security.Principal.WindowsPrincipal]...IsInRole', meaning: 'Checks whether you are running as an administrator.' },
            { part: 'ConvertTo-Json', meaning: 'Turns the object into JSON text.' },
            { part: 'Set-Content', meaning: 'Writes the text to a file in the current folder.' },
          ],
        },
        {
          title: 'Check who can write to a service folder',
          code: 'Get-Acl "C:\\Program Files\\Common Files" | Select-Object -ExpandProperty Access |\n  Where-Object { $_.FileSystemRights -match "Write|Modify|FullControl" } |\n  Select-Object IdentityReference, FileSystemRights, AccessControlType',
          whatItDoes: 'Shows who has write-style permissions on a folder. Normal users should not be able to write into program folders.',
          parts: [
            { part: 'Get-Acl', meaning: 'Reads the permissions (access control list) of a file or folder.' },
            { part: '-ExpandProperty Access', meaning: 'Unwraps the list of individual permission entries.' },
            { part: '-match "Write|Modify|FullControl"', meaning: 'Regular expression that keeps entries with write-like rights. The | means OR.' },
          ],
          watchOut: 'Seeing TrustedInstaller, SYSTEM and Administrators is normal. Seeing Users or Everyone with write rights is a finding to fix.',
        },
        {
          title: 'Fix an unquoted service path (lab VM only)',
          code: 'Set-ItemProperty -Path "HKLM:\\SYSTEM\\CurrentControlSet\\Services\\LabService" -Name ImagePath -Value \'"C:\\Program Files\\Lab App\\svc.exe"\' -WhatIf',
          whatItDoes: 'Previews wrapping a service file path in quotes, which closes the misconfiguration.',
          parts: [
            { part: 'Set-ItemProperty', meaning: 'Changes a registry value.' },
            { part: 'HKLM:\\SYSTEM\\CurrentControlSet\\Services\\LabService', meaning: 'The registry key that stores the service settings (LabService is a made-up lab name).' },
            { part: '-Name ImagePath -Value \'"..."\'', meaning: 'Sets the path text, with literal double quotes kept inside the single quotes.' },
            { part: '-WhatIf', meaning: 'Preview only. Nothing is changed.' },
          ],
          watchOut: 'Editing service registry keys can stop services from starting. Use a lab VM, take a checkpoint first, and only remove -WhatIf after you have verified the service name.',
        },
      ],
    },
    recap: [
      'Recon is just asking Windows to describe itself: identity, privileges, services, ports and directory data.',
      'Unquoted service paths, loose folder permissions and weak service accounts are the classic findings to fix.',
      'ADSI with an LDAP filter lets you query a domain using only built-in tools. Use it only where you have permission.',
      'Always finish with a fix list and test changes with -WhatIf on a lab VM first.',
      'Pair every technique with its detection: PowerShell recon shows up as 4104 (script block) and 4688 (process creation, command line only if enabled); Kerberoasting shows up on the DC as 4769 with RC4 (0x17), best caught with a honey-SPN account. Event 1644 is not a reliable recon detector.',
    ],
  },

  '15-2': {
    oneSentence:
      'Attackers run code straight from memory with IEX and hide it in Base64, but that is obfuscation, not encryption, and AMSI inspects it right before it runs.',
    analogy:
      'Imagine a sealed envelope arriving at a mailroom. A normal letter is written on paper that is filed away, so inspectors can read it. A "fileless" message is read aloud and never written down, so there is no paper to inspect. AMSI is a clever clerk standing at the reading desk who hears every sentence just before it is acted on, even if it was scrambled on the way in. This lesson helps you recognise the scrambled envelopes and see why the clerk often (but not always) catches them, so you keep other checks in place too.',
    plainEnglish: [
      '"Fileless" means code runs from memory instead of from a file on disk. One common building block is `Invoke-Expression` (alias `IEX`), which runs any text as PowerShell code.',
      '`-EncodedCommand` lets you pass a command as Base64 text. Base64 is not encryption, it is just a way of writing text with safe characters, and anyone can decode it in one line.',
      'AMSI (Antimalware Scan Interface) lets Windows Defender or other antivirus inspect script content after it is decoded, right before it runs. That is why simple scrambling usually does not hide anything from it. But AMSI is not a guarantee: it depends on the antivirus product and can be bypassed, so logging (4104), EDR and application control matter too.',
      'This guide is defensive. You learn how the pieces work with harmless text so you can recognise and investigate them, never how to hide a real payload.',
    ],
    beforeYouStart: [
      'A lab Windows VM with Microsoft Defender turned on. Do not disable protections.',
      'PowerShell 5.1 or 7. Run these examples only on a machine you own.',
      'An understanding that every example here uses harmless commands like `Get-Date`.',
    ],
    atoZSteps: [
      {
        title: 'Step 1: Meet Invoke-Expression safely',
        detail:
          'Run `Invoke-Expression "2 + 3"`. PowerShell treats the text as code and prints 5. Now you know why running IEX on text you did not write is risky.',
      },
      {
        title: 'Step 2: Encode a harmless command',
        detail:
          'Convert the text `Get-Date` to Base64 using `[Convert]::ToBase64String` with Unicode (UTF-16) bytes. Windows expects that exact encoding.',
      },
      {
        title: 'Step 3: Decode it back',
        detail:
          'Reverse it with `[Text.Encoding]::Unicode.GetString([Convert]::FromBase64String(...))` and see the original text. Base64 hides nothing from a defender.',
      },
      {
        title: 'Step 4: Run an encoded command harmlessly',
        detail:
          'Run `powershell -NoProfile -EncodedCommand <base64>` using the Get-Date text. The same method is how real scripts get launched, which is why defenders watch for it.',
      },
      {
        title: 'Step 5: Learn where AMSI sits',
        detail:
          'AMSI scans the final decoded text just before PowerShell executes it. Whatever layers of encoding were used, the real content still arrives at that checkpoint.',
      },
      {
        title: 'Step 6: Hunt for the patterns',
        detail:
          'Search logs and scripts for `-EncodedCommand`, `FromBase64String`, `DownloadString` and `IEX`. Pair that with Script Block Logging (next lesson) to read the decoded code.',
      },
    ],
    wordsYouWillMeet: [
      { word: 'IEX', meaning: 'Alias for Invoke-Expression. Runs a piece of text as PowerShell code.' },
      { word: 'Base64', meaning: 'A way of writing data as plain letters and numbers. It is encoding, not encryption.' },
      { word: '-EncodedCommand', meaning: 'A powershell.exe switch that accepts a Base64 string (UTF-16) as the command to run.' },
      { word: 'Fileless', meaning: 'Code that runs from memory and never needs to be saved as a file.' },
      { word: 'AMSI', meaning: 'Antimalware Scan Interface. Lets antivirus inspect script text just before it runs.' },
      { word: 'Download cradle', meaning: 'A one-liner that fetches text from the internet and runs it. A classic pattern defenders look for.' },
    ],
    beginner: {
      intro:
        'You will experiment with harmless text only, so you can see how these building blocks behave without any risk.',
      commands: [
        {
          title: 'Run text as code (harmless maths)',
          code: 'Invoke-Expression "2 + 3"',
          whatItDoes: 'Treats the text "2 + 3" as a PowerShell command and prints the answer.',
          parts: [
            { part: 'Invoke-Expression', meaning: 'Runs a text string as if you had typed it as code. Alias: IEX.' },
            { part: '"2 + 3"', meaning: 'The text to run. Here it is only arithmetic.' },
          ],
          sampleOutput: '5',
          watchOut: 'Never feed Invoke-Expression text from a source you do not trust. That is exactly how malicious one-liners work.',
        },
        {
          title: 'Check your PowerShell version and language mode',
          code: '$PSVersionTable.PSVersion\n$ExecutionContext.SessionState.LanguageMode',
          whatItDoes: 'Shows which PowerShell version you run and whether the language is limited (ConstrainedLanguage) or full.',
          parts: [
            { part: '$PSVersionTable.PSVersion', meaning: 'A built-in table of version facts.' },
            { part: '$ExecutionContext.SessionState.LanguageMode', meaning: 'The current language mode. FullLanguage is the default on normal PCs.' },
          ],
          sampleOutput: 'Major  Minor  Build  Revision\n-----  -----  -----  --------\n5      1      26100  1\nFullLanguage',
        },
        {
          title: 'Turn text into Base64',
          code: '[Convert]::ToBase64String([Text.Encoding]::Unicode.GetBytes("Get-Date"))',
          whatItDoes: 'Encodes the text "Get-Date" the way -EncodedCommand expects (UTF-16).',
          parts: [
            { part: '[Text.Encoding]::Unicode.GetBytes("...")', meaning: 'Turns the text into raw bytes using UTF-16, which Windows PowerShell requires.' },
            { part: '[Convert]::ToBase64String(...)', meaning: 'Converts those bytes to Base64 text.' },
          ],
          sampleOutput: 'RwBlAHQALQBEAGEAdABlAA==',
          watchOut: 'Using UTF-8 instead of Unicode gives a string that powershell.exe cannot read correctly.',
        },
      ],
    },
    intermediate: {
      intro:
        'Now decode, run and hunt. You will see that encoding is easy to reverse, which is exactly why defenders are not fooled by it.',
      commands: [
        {
          title: 'Decode a Base64 command back to text',
          code: '$b64 = "RwBlAHQALQBEAGEAdABlAA=="\n[Text.Encoding]::Unicode.GetString([Convert]::FromBase64String($b64))',
          whatItDoes: 'Reveals the hidden text behind a Base64 string. This is the first step when you investigate a suspicious command line.',
          parts: [
            { part: '$b64 = "..."', meaning: 'Stores the Base64 text in a variable.' },
            { part: '[Convert]::FromBase64String($b64)', meaning: 'Turns the Base64 text back into bytes.' },
            { part: '[Text.Encoding]::Unicode.GetString(...)', meaning: 'Reads those bytes as UTF-16 text.' },
          ],
          sampleOutput: 'Get-Date',
          watchOut: 'Only decode, do not run, anything you did not write. Read it first.',
        },
        {
          title: 'Run the encoded harmless command',
          code: 'powershell.exe -NoProfile -EncodedCommand RwBlAHQALQBEAGEAdABlAA==',
          whatItDoes: 'Starts a fresh PowerShell that decodes the Base64 and runs Get-Date.',
          parts: [
            { part: 'powershell.exe', meaning: 'Starts Windows PowerShell (use pwsh.exe for PowerShell 7).' },
            { part: '-NoProfile', meaning: 'Skips your profile script so the test is clean.' },
            { part: '-EncodedCommand <text>', meaning: 'Decodes the Base64 (UTF-16) text and runs it.' },
          ],
          sampleOutput: 'Wednesday, November 4, 2026 3:55:12 AM',
        },
        {
          title: 'Find PowerShell processes started with encoded commands',
          code: 'Get-CimInstance Win32_Process -Filter "Name=\'powershell.exe\' OR Name=\'pwsh.exe\'" |\n  Where-Object CommandLine -match "-e(nc|ncodedcommand)?\\s" |\n  Select-Object ProcessId, CommandLine',
          whatItDoes: 'Lists running PowerShell processes whose command line uses an encoded command, a simple triage check.',
          parts: [
            { part: 'Get-CimInstance Win32_Process', meaning: 'Reads running processes, including their full command line.' },
            { part: '-Filter "Name=\'...\'"', meaning: 'Asks WMI to return only PowerShell processes.' },
            { part: 'Where-Object CommandLine -match "..."', meaning: 'Keeps command lines that look like -e, -enc or -EncodedCommand.' },
          ],
          watchOut: 'Admin tools sometimes use encoded commands legitimately, so treat a hit as something to look at, not as proof of attack.',
        },
      ],
    },
    pro: {
      intro:
        'Pro defenders statically review scripts, read decoded content in logs, and confirm that AMSI-capable protection is on. Everything stays defensive and lab-safe.',
      commands: [
        {
          title: 'Scan a script for risky patterns before you run it',
          code: 'Select-String -Path .\\downloaded.ps1 -Pattern "Invoke-Expression|\\bIEX\\b|DownloadString|FromBase64String|-EncodedCommand" |\n  Select-Object LineNumber, Line',
          whatItDoes: 'Highlights lines that use the classic fileless building blocks so you can read them carefully first.',
          parts: [
            { part: 'Select-String -Path', meaning: 'Searches text files for a pattern, like grep.' },
            { part: '-Pattern "A|B|C"', meaning: 'A regular expression where | means OR.' },
            { part: '\\bIEX\\b', meaning: 'Matches IEX as a whole word only.' },
            { part: 'Select-Object LineNumber, Line', meaning: 'Shows where each hit is and its text.' },
          ],
          watchOut: 'A hit is a reason to review the code, not proof it is malicious. A clean scan is not proof that a script is safe.',
        },
        {
          title: 'Confirm Defender real-time protection is on',
          code: 'Get-MpComputerStatus | Select-Object AMServiceEnabled, RealTimeProtectionEnabled, AntivirusSignatureLastUpdated',
          whatItDoes: 'Shows whether Microsoft Defender and real-time protection are running. AMSI relies on a registered antimalware provider like this.',
          parts: [
            { part: 'Get-MpComputerStatus', meaning: 'Reads Defender health and status (read-only).' },
            { part: 'AMServiceEnabled', meaning: 'True when the Defender antimalware service is running.' },
            { part: 'RealTimeProtectionEnabled', meaning: 'True when files and scripts are scanned as they are used.' },
          ],
          sampleOutput: 'AMServiceEnabled RealTimeProtectionEnabled AntivirusSignatureLastUpdated\n----------------- ------------------------- ----------------------------\n             True                      True 11/4/2026 1:02:11 AM',
        },
        {
          title: 'Read decoded script content from the PowerShell log',
          code: 'Get-WinEvent -FilterHashtable @{ LogName = "Microsoft-Windows-PowerShell/Operational"; Id = 4104 } -MaxEvents 200 |\n  Where-Object Message -match "FromBase64String|DownloadString|Invoke-Expression" |\n  Select-Object TimeCreated, @{n="Snippet";e={$_.Message.Substring(0,[Math]::Min(200,$_.Message.Length))}}',
          whatItDoes: 'Searches recent Script Block Logging events (4104) for the fileless building blocks and shows the start of each script.',
          parts: [
            { part: 'Get-WinEvent -FilterHashtable', meaning: 'Fast, filtered reading of Windows event logs.' },
            { part: 'Id = 4104', meaning: 'The event that records the full text of a script block, after decoding.' },
            { part: '-MaxEvents 200', meaning: 'Reads only the newest 200 events.' },
            { part: '[Math]::Min(200, length)', meaning: 'Prevents an error on short messages by capping the text cut.' },
          ],
          watchOut: 'You only see events if Script Block Logging is enabled (next lesson). No events and no error is possible when it is off.',
        },
        {
          title: 'Trigger the harmless AMSI test string (lab VM, Defender on)',
          code: '"AMSI Test Sample: 7e72c3ce-861b-4339-8740-0ac1484c1386"',
          whatItDoes: 'Microsoft publishes this inert text so you can confirm that AMSI plus Defender catch content at run time without using any real malware.',
          parts: [
            { part: '"AMSI Test Sample: ..."', meaning: 'A documented test string that antimalware products treat as a detection.' },
          ],
          watchOut: 'Run it only in a lab VM. A detection or a blocked-script message means AMSI is working. Do not try to bypass it.',
        },
      ],
    },
    recap: [
      'Invoke-Expression runs text as code, so never run it on content you did not read and trust.',
      'Base64 and -EncodedCommand are only encoding. Anyone can decode them in one line.',
      'AMSI inspects script content after decoding, just before it runs, so simple obfuscation rarely hides it. It is one layer, not a guarantee, so keep logging, EDR and application control too.',
      'Defenders hunt for patterns in command lines and 4104 logs, and keep Defender real-time protection on.',
    ],
  },

  '16-1': {
    oneSentence:
      'Turn on Script Block Logging (Event ID 4104) and Module Logging, and Get-WinEvent finds the decoded payload an attacker thought was hidden.',
    analogy:
      'Script Block Logging is a security camera that films every PowerShell action inside the building and keeps the footage, even if the person scrambled their notes first. Transcription is the written diary of everything typed and shown on screen. Get-WinEvent is the fast video player that lets you jump to exactly the moment you need instead of watching all day.',
    plainEnglish: [
      'Windows can record PowerShell activity in the event log. The most valuable record is Event ID 4104, which stores the actual script text after it has been decoded.',
      'Because 4104 is written at run time, tricks like Base64 or string-splitting usually appear in plain form in the log, so obfuscation does not hide the code from this log (an attacker with enough access can still try to disable or clear logging, which is why you forward logs off the machine).',
      'Transcription saves a text file of every session (input and output), which is useful as an audit trail. Store these files somewhere users cannot edit.',
      '`Get-WinEvent -FilterHashtable` filters at the source, so it is much faster than loading every event and filtering afterwards.',
    ],
    beforeYouStart: [
      'A Windows machine where you may read event logs. Reading the PowerShell Operational log is possible for admins, and often for members of Event Log Readers.',
      'An elevated window for enabling logging with registry or Group Policy, and only on lab or approved systems.',
      'Disk space for logs and a protected place to send them (a central log server or SIEM is ideal).',
    ],
    atoZSteps: [
      {
        title: 'Step 1: Find the PowerShell log',
        detail:
          'Run `Get-WinEvent -ListLog "Microsoft-Windows-PowerShell/Operational"` and check it is enabled and how big it is.',
      },
      {
        title: 'Step 2: Check whether logging is switched on',
        detail:
          'Look in the policy registry key `HKLM:\\SOFTWARE\\Policies\\Microsoft\\Windows\\PowerShell\\ScriptBlockLogging` for `EnableScriptBlockLogging = 1`.',
      },
      {
        title: 'Step 3: Read your own activity',
        detail:
          'Run a harmless command like `Get-Date`, then query Event ID 4104 with `Get-WinEvent -FilterHashtable`. Your command appears in the log.',
      },
      {
        title: 'Step 4: Filter by time and keyword',
        detail:
          'Add `StartTime` to the hashtable and `Where-Object Message -match "keyword"` so you find the needle without reading the whole haystack.',
      },
      {
        title: 'Step 5: Turn on transcription for an audit trail',
        detail:
          'Use `Start-Transcript` for one session, or enable the transcription policy so every session writes a file to a protected share.',
      },
      {
        title: 'Step 6: Send logs to a safe place',
        detail:
          'A log on the same machine can be cleared by an intruder with admin rights. Forward events to a central collector and alert on Event ID 1102 (log cleared).',
      },
    ],
    wordsYouWillMeet: [
      { word: 'Event ID 4104', meaning: 'The event that holds the full text of a PowerShell script block.' },
      { word: 'Script Block Logging', meaning: 'A policy that records every script block PowerShell runs.' },
      { word: 'Transcription', meaning: 'A text file recording each session\'s commands and output.' },
      { word: 'Get-WinEvent', meaning: 'The modern cmdlet for reading Windows event logs.' },
      { word: 'FilterHashtable', meaning: 'A fast way to filter events by log, ID and time before they are loaded.' },
      { word: 'SIEM', meaning: 'A central system that collects and searches logs from many computers.' },
    ],
    beginner: {
      intro:
        'You will look at logs without changing anything. Reading the log is like looking at security footage: no risk, lots of insight.',
      commands: [
        {
          title: 'Inspect the PowerShell log',
          code: 'Get-WinEvent -ListLog "Microsoft-Windows-PowerShell/Operational" | Select-Object LogName, IsEnabled, RecordCount, MaximumSizeInBytes',
          whatItDoes: 'Shows whether the PowerShell log is on, how many events it holds, and its size limit.',
          parts: [
            { part: 'Get-WinEvent -ListLog', meaning: 'Lists log definitions instead of events.' },
            { part: '"Microsoft-Windows-PowerShell/Operational"', meaning: 'The log where script blocks (4104) are written.' },
            { part: 'Select-Object ...', meaning: 'Keeps only the useful columns.' },
          ],
          sampleOutput: 'LogName                                  IsEnabled RecordCount MaximumSizeInBytes\n-------                                  --------- ----------- ------------------\nMicrosoft-Windows-PowerShell/Operational      True        1842           15728640',
        },
        {
          title: 'Read the five newest PowerShell events',
          code: 'Get-WinEvent -LogName "Microsoft-Windows-PowerShell/Operational" -MaxEvents 5 | Select-Object TimeCreated, Id, LevelDisplayName',
          whatItDoes: 'Shows the latest five events with their time, ID and level.',
          parts: [
            { part: '-LogName', meaning: 'Which log to read.' },
            { part: '-MaxEvents 5', meaning: 'Stop after five events, newest first.' },
            { part: 'Id', meaning: 'The event number that tells you what kind of event it is.' },
          ],
          sampleOutput: 'TimeCreated           Id LevelDisplayName\n-----------           -- ----------------\n11/4/2026 3:51:07 AM 4104 Verbose',
        },
        {
          title: 'Is Script Block Logging turned on by policy?',
          code: 'Get-ItemProperty "HKLM:\\SOFTWARE\\Policies\\Microsoft\\Windows\\PowerShell\\ScriptBlockLogging" -ErrorAction SilentlyContinue',
          whatItDoes: 'Reads the policy key. If EnableScriptBlockLogging is 1, logging is enforced.',
          parts: [
            { part: 'Get-ItemProperty', meaning: 'Reads the values stored in a registry key.' },
            { part: 'HKLM:\\SOFTWARE\\Policies\\...', meaning: 'The local-machine policy location used by Group Policy.' },
            { part: '-ErrorAction SilentlyContinue', meaning: 'No red error if the key does not exist yet.' },
          ],
          watchOut: 'No output simply means the policy is not set. Note that 4104 events may still appear for suspicious-looking scripts even without the policy.',
        },
      ],
    },
    intermediate: {
      intro:
        'Now filter like an investigator. These are still read-only, and they show why the log is the defender\'s best friend.',
      commands: [
        {
          title: 'Fast filter for Event 4104 in the last hour',
          code: '$since = (Get-Date).AddHours(-1)\nGet-WinEvent -FilterHashtable @{ LogName = "Microsoft-Windows-PowerShell/Operational"; Id = 4104; StartTime = $since } -ErrorAction SilentlyContinue |\n  Select-Object TimeCreated, @{n="Script";e={$_.Properties[2].Value}}',
          whatItDoes: 'Returns the script text for every script block logged in the last hour.',
          parts: [
            { part: '-FilterHashtable @{ ... }', meaning: 'Filters inside Windows before events reach PowerShell, so it is very fast.' },
            { part: 'StartTime = $since', meaning: 'Only events after this time.' },
            { part: '$_.Properties[2].Value', meaning: 'The third event field, which holds the script block text for 4104.' },
            { part: '-ErrorAction SilentlyContinue', meaning: 'Prevents an error when no events match.' },
          ],
          watchOut: 'If nothing comes back, no matching events exist in that window. It is not necessarily a fault.',
        },
        {
          title: 'Search the log for a keyword',
          code: 'Get-WinEvent -FilterHashtable @{ LogName = "Microsoft-Windows-PowerShell/Operational"; Id = 4104 } -MaxEvents 500 |\n  Where-Object Message -match "Invoke-WebRequest|DownloadString" |\n  Select-Object TimeCreated, Id',
          whatItDoes: 'Finds recent script blocks that mention web download commands, a useful first threat-hunting query.',
          parts: [
            { part: '-MaxEvents 500', meaning: 'Limits the search to the newest 500 events for speed.' },
            { part: 'Where-Object Message -match "A|B"', meaning: 'Keeps events whose text matches A or B.' },
          ],
          watchOut: 'Many legitimate scripts download files. A match is a lead to investigate, not a verdict.',
        },
        {
          title: 'Record one session with a transcript',
          code: 'Start-Transcript -Path "$env:USERPROFILE\\Documents\\session-$(Get-Date -Format yyyyMMdd-HHmm).txt"\nGet-Date\nStop-Transcript',
          whatItDoes: 'Saves everything you type and see into a text file until you stop the transcript.',
          parts: [
            { part: 'Start-Transcript -Path', meaning: 'Begins recording the session to the given file.' },
            { part: '$(Get-Date -Format yyyyMMdd-HHmm)', meaning: 'Puts a timestamp in the file name so each session gets its own file.' },
            { part: 'Stop-Transcript', meaning: 'Stops recording and closes the file.' },
          ],
          watchOut: 'Transcripts can capture secrets typed on screen. Store them in a protected location and keep access limited.',
        },
      ],
    },
    pro: {
      intro:
        'Pro admins enable logging through policy, centralise the evidence and alert on tampering. These change settings, so use a lab VM or follow your change process.',
      commands: [
        {
          title: 'Turn on Script Block Logging (lab VM, elevated)',
          code: '$key = "HKLM:\\SOFTWARE\\Policies\\Microsoft\\Windows\\PowerShell\\ScriptBlockLogging"\nNew-Item -Path $key -Force -WhatIf\nSet-ItemProperty -Path $key -Name EnableScriptBlockLogging -Value 1 -Type DWord -WhatIf',
          whatItDoes: 'Previews creating the policy key and enabling Script Block Logging on one machine. In production, use Group Policy instead.',
          parts: [
            { part: 'New-Item -Path $key -Force', meaning: 'Creates the policy registry key (and parents) if needed.' },
            { part: 'Set-ItemProperty -Name EnableScriptBlockLogging -Value 1', meaning: 'Sets the policy value that switches logging on.' },
            { part: '-Type DWord', meaning: 'Stores the value as a number, which this policy requires.' },
            { part: '-WhatIf', meaning: 'Shows what would change without changing it. Remove it only in your lab.' },
          ],
          watchOut: 'Registry edits change security behaviour and expand log volume. Lab VM only. On a real network, use the GPO setting "Turn on PowerShell Script Block Logging" and size the log appropriately. Undo in the lab with `Remove-ItemProperty -Path $key -Name EnableScriptBlockLogging`.',
        },
        {
          title: 'Enlarge the PowerShell log so evidence is not overwritten',
          code: 'Limit-EventLog -LogName "Windows PowerShell" -MaximumSize 100MB -WhatIf\nwevtutil sl "Microsoft-Windows-PowerShell/Operational" /ms:268435456',
          whatItDoes: 'The first line previews resizing the classic log. The second sets the Operational log to 256 MB so 4104 events are kept longer.',
          parts: [
            { part: 'Limit-EventLog -MaximumSize 100MB -WhatIf', meaning: 'Previews a size change for a classic log (Windows PowerShell 5.1 only).' },
            { part: 'wevtutil sl', meaning: 'Built-in tool that sets log settings ("set-log").' },
            { part: '/ms:268435456', meaning: 'Maximum size in bytes (256 MB).' },
          ],
          watchOut: 'The wevtutil line really changes the setting and needs an elevated window. Do it on a lab VM first.',
        },
        {
          title: 'Hunt for a log being cleared',
          code: 'Get-WinEvent -FilterHashtable @{ LogName = "Security"; Id = 1102 } -MaxEvents 10 -ErrorAction SilentlyContinue |\n  Select-Object TimeCreated, Message',
          whatItDoes: 'Lists events recording that the Security log was cleared, a classic sign of someone covering their tracks.',
          parts: [
            { part: 'LogName = "Security"', meaning: 'The Windows Security log, which needs an elevated window to read.' },
            { part: 'Id = 1102', meaning: 'The event written when the audit log is cleared.' },
            { part: 'Select-Object TimeCreated, Message', meaning: 'Shows when it happened and the details.' },
          ],
          watchOut: 'Event 104 in the System log records clearing of other logs. Forward both to a central server so an intruder cannot erase the copy.',
        },
        {
          title: 'Export evidence for the investigation team',
          code: 'Get-WinEvent -FilterHashtable @{ LogName = "Microsoft-Windows-PowerShell/Operational"; Id = 4104; StartTime = (Get-Date).AddDays(-1) } |\n  Select-Object TimeCreated, MachineName, @{n="Script";e={$_.Properties[2].Value}} |\n  Export-Csv .\\4104-last24h.csv -NoTypeInformation',
          whatItDoes: 'Saves the last day of logged script blocks to a CSV file that can be reviewed or loaded into a SIEM.',
          parts: [
            { part: '(Get-Date).AddDays(-1)', meaning: 'The moment 24 hours ago.' },
            { part: 'Export-Csv', meaning: 'Writes the objects to a CSV file.' },
            { part: '-NoTypeInformation', meaning: 'Leaves out the extra type header line (not needed in PowerShell 7).' },
          ],
          watchOut: 'The CSV may contain sensitive script content such as server names or pasted secrets. Protect the file like any other evidence.',
        },
      ],
    },
    recap: [
      'Event ID 4104 stores the decoded script text, so Base64 or string tricks do not hide what really ran.',
      'Use Get-WinEvent -FilterHashtable to search quickly by log, ID and time.',
      'Transcripts give a session diary but must be stored securely because they can capture secrets.',
      'Forward logs to a central place and alert on 1102 and 104 so an intruder cannot quietly erase the evidence.',
      'Event 4688 (process creation) only carries the command line if you enable BOTH the audit policy "Audit Process Creation" and the setting "Include command line in process creation events".',
    ],
  },

  '16-2': {
    oneSentence:
      'Harden PowerShell by blocking the version 2 downgrade, locking .NET access with Constrained Language Mode, and giving admins only JEA role capabilities.',
    analogy:
      'Hardening PowerShell is like securing a workshop full of power tools. Removing PowerShell 2.0 is taking the old, unguarded saw out of the shop so no one can use it to skip the safety rules. Constrained Language Mode is putting guards on the dangerous machines so that only approved tasks can be done. JEA (Just Enough Administration) is giving a helper a locked cabinet with only the three tools they need for today\'s job and a visitor badge instead of the master key.',
    plainEnglish: [
      'PowerShell 2.0 is very old and has no AMSI, no Script Block Logging and no Constrained Language support. Attackers try to "downgrade" to it, so the best fix is to remove it.',
      'Constrained Language Mode (CLM) limits risky .NET features and type use. It is meant to be enforced by application control such as WDAC or AppLocker, not just set by a user.',
      'JEA lets someone administer a server with a small set of allowed commands, under a temporary virtual account, instead of giving them full Administrator rights.',
      'A JEA endpoint is built from a role capability file (what is allowed) and a session configuration file (who can connect and how). Everything is logged.',
    ],
    beforeYouStart: [
      'A lab Windows Server or Windows 10/11 VM (a checkpoint taken before you start is wise).',
      'An elevated PowerShell window. Nothing in this lesson should be tried first on production.',
      'Windows PowerShell 5.1 for the feature commands. PowerShell Remoting enabled for the JEA connection test.',
    ],
    atoZSteps: [
      {
        title: 'Step 1: Check your language mode',
        detail:
          'Run `$ExecutionContext.SessionState.LanguageMode`. FullLanguage is normal. ConstrainedLanguage means the session is restricted.',
      },
      {
        title: 'Step 2: Check whether PowerShell 2.0 is installed',
        detail:
          'Run `Get-WindowsOptionalFeature -Online -FeatureName MicrosoftWindowsPowerShellV2Root`. If State is Enabled, a downgrade path exists. On newer builds (Windows 11 24H2, Windows Server 2025) the feature no longer exists and the command returns nothing or an error, which means there is nothing to remove.',
      },
      {
        title: 'Step 3: Preview removing PowerShell 2.0',
        detail:
          'Use `Disable-WindowsOptionalFeature ... -WhatIf` first. Remove -WhatIf only in the lab, after checking that no legacy app needs it.',
      },
      {
        title: 'Step 4: Design a JEA role',
        detail:
          'Decide the exact commands a helpdesk user needs, for example `Restart-Service` for only the Spooler service. Write them in a role capability (.psrc) file.',
      },
      {
        title: 'Step 5: Create the session configuration',
        detail:
          'Use `New-PSSessionConfigurationFile` with `-SessionType RestrictedRemoteServer` and `-RunAsVirtualAccount`, mapping a group to your role.',
      },
      {
        title: 'Step 6: Register and test the endpoint',
        detail:
          'Register it with `Register-PSSessionConfiguration`, then check what a user can do using `Get-PSSessionCapability`, and connect with `Enter-PSSession -ConfigurationName`.',
      },
      {
        title: 'Step 7: Watch it and review it',
        detail:
          'JEA sessions can write transcripts. Review them regularly and tighten the role if anyone gets more access than needed.',
      },
    ],
    wordsYouWillMeet: [
      { word: 'PowerShell 2.0', meaning: 'A legacy engine without modern security. Attackers use it to dodge logging and AMSI.' },
      { word: 'CLM', meaning: 'Constrained Language Mode. A restricted PowerShell that blocks risky .NET operations.' },
      { word: 'WDAC / AppLocker', meaning: 'Application control tools that make Windows run only approved code and automatically enforce CLM.' },
      { word: 'JEA', meaning: 'Just Enough Administration. Limited, role-based remote admin sessions.' },
      { word: 'Role capability (.psrc)', meaning: 'A file listing the commands a role may use.' },
      { word: 'Virtual account', meaning: 'A temporary account JEA creates for one session, with only the rights needed.' },
    ],
    beginner: {
      intro:
        'Start by observing. These read-only commands show how locked down or open your machine is today.',
      commands: [
        {
          title: 'What language mode am I in?',
          code: '$ExecutionContext.SessionState.LanguageMode',
          whatItDoes: 'Prints FullLanguage, ConstrainedLanguage, RestrictedLanguage or NoLanguage.',
          parts: [
            { part: '$ExecutionContext', meaning: 'A built-in variable describing the current PowerShell engine.' },
            { part: '.SessionState.LanguageMode', meaning: 'The property that stores the language mode.' },
          ],
          sampleOutput: 'FullLanguage',
          watchOut: 'Typing a mode into a variable does not secure anything. Real enforcement comes from WDAC or AppLocker policy.',
        },
        {
          title: 'Is PowerShell 2.0 installed?',
          code: 'Get-WindowsOptionalFeature -Online -FeatureName MicrosoftWindowsPowerShellV2Root | Select-Object FeatureName, State',
          whatItDoes: 'Checks whether the old v2 engine is enabled on a Windows client.',
          parts: [
            { part: 'Get-WindowsOptionalFeature -Online', meaning: 'Reads optional Windows features on this running system.' },
            { part: '-FeatureName MicrosoftWindowsPowerShellV2Root', meaning: 'The feature that provides PowerShell 2.0.' },
            { part: 'Select-Object FeatureName, State', meaning: 'Shows only name and Enabled/Disabled.' },
          ],
          sampleOutput: 'FeatureName                       State\n-----------                       -----\nMicrosoftWindowsPowerShellV2Root Disabled',
          watchOut: 'Needs an elevated Windows PowerShell 5.1 window. On Windows Server use Get-WindowsFeature PowerShell-V2 instead. On newer builds (Windows 11 24H2, Windows Server 2025) the feature is gone, so the command may return nothing or an error. That is fine: there is nothing to disable.',
        },
        {
          title: 'List existing remoting endpoints',
          code: 'Get-PSSessionConfiguration | Select-Object Name, PSVersion, Permission',
          whatItDoes: 'Shows the PowerShell remoting endpoints on this machine, including any JEA ones.',
          parts: [
            { part: 'Get-PSSessionConfiguration', meaning: 'Lists registered session configurations (endpoints).' },
            { part: 'Select-Object Name, PSVersion, Permission', meaning: 'Name, engine version and who may connect.' },
          ],
          sampleOutput: 'Name              PSVersion Permission\n----              --------- ----------\nmicrosoft.powershell     5.1 BUILTIN\\Administrators AccessAllowed',
          watchOut: 'Needs an elevated window and PowerShell Remoting enabled (Enable-PSRemoting) on this machine.',
        },
      ],
    },
    intermediate: {
      intro:
        'Now you plan the hardening. Everything that changes something uses -WhatIf, so practise safely on a lab VM.',
      commands: [
        {
          title: 'Preview removing PowerShell 2.0',
          code: 'Disable-WindowsOptionalFeature -Online -FeatureName MicrosoftWindowsPowerShellV2Root -NoRestart -WhatIf',
          whatItDoes: 'Shows what would happen if you removed the PowerShell 2.0 engine, without removing it.',
          parts: [
            { part: 'Disable-WindowsOptionalFeature -Online', meaning: 'Turns off an optional Windows feature on this system.' },
            { part: '-FeatureName MicrosoftWindowsPowerShellV2Root', meaning: 'The feature to disable.' },
            { part: '-NoRestart', meaning: 'Do not reboot automatically.' },
            { part: '-WhatIf', meaning: 'Preview only. Remove it in the lab when ready.' },
          ],
          watchOut: 'A few very old applications need v2. Check dependencies, and use a checkpoint before the real change.',
        },
        {
          title: 'Test that downgrade is blocked',
          code: 'powershell.exe -Version 2 -NoProfile -Command "$PSVersionTable.PSVersion"',
          whatItDoes: 'Tries to start PowerShell 2.0. After hardening this should fail instead of printing a version.',
          parts: [
            { part: 'powershell.exe -Version 2', meaning: 'Asks Windows PowerShell to start the 2.0 engine.' },
            { part: '-NoProfile', meaning: 'Skips your profile for a clean test.' },
            { part: '-Command "..."', meaning: 'Runs the text as a command and exits.' },
          ],
          sampleOutput: 'Version v2.0.50727 of the .NET Framework is not installed and it is required to run version 2 of Windows PowerShell.',
          watchOut: 'If it prints a 2.0 version, a downgrade path exists and the attacker view is weaker than you think.',
        },
        {
          title: 'Find downgrade attempts in the logs',
          code: 'Get-WinEvent -FilterHashtable @{ LogName = "Windows PowerShell"; Id = 400 } -MaxEvents 200 -ErrorAction SilentlyContinue |\n  Where-Object Message -match "EngineVersion=2\\." |\n  Select-Object TimeCreated',
          whatItDoes: 'Looks for engine-start events that show PowerShell 2.0 was used, a strong downgrade-attack signal.',
          parts: [
            { part: 'LogName = "Windows PowerShell"', meaning: 'The classic PowerShell event log.' },
            { part: 'Id = 400', meaning: 'Engine started event, which includes the engine version.' },
            { part: '-match "EngineVersion=2\\."', meaning: 'Regular expression for a version starting with 2. The backslash makes the dot literal.' },
          ],
        },
      ],
    },
    pro: {
      intro:
        'Pro engineers build least-privilege endpoints and enforce language restrictions with policy. Build and test in a lab and keep a rollback plan.',
      commands: [
        {
          title: 'Create a JEA role capability',
          code: 'New-Item -ItemType Directory -Path "C:\\Program Files\\WindowsPowerShell\\Modules\\LabJea\\RoleCapabilities" -Force | Out-Null\nNew-PSRoleCapabilityFile -Path "C:\\Program Files\\WindowsPowerShell\\Modules\\LabJea\\RoleCapabilities\\SpoolerHelp.psrc" `\n  -VisibleCmdlets "Get-Service", @{ Name = "Restart-Service"; Parameters = @{ Name = "Name"; ValidateSet = "Spooler" } }',
          whatItDoes: 'Creates a role file that lets a helper view services and restart only the Spooler service.',
          parts: [
            { part: 'RoleCapabilities folder inside a module', meaning: 'JEA looks for .psrc files in this folder of a module on the module path.' },
            { part: 'New-PSRoleCapabilityFile -Path', meaning: 'Creates the .psrc role capability file.' },
            { part: '-VisibleCmdlets', meaning: 'The only cmdlets the role can see and use.' },
            { part: 'ValidateSet = "Spooler"', meaning: 'Limits Restart-Service so it works only for the Spooler service.' },
          ],
          watchOut: 'Never allow commands that can run arbitrary code or edit files freely (like Invoke-Expression or Set-Content with free paths). Those quietly turn JEA into full admin.',
        },
        {
          title: 'Build and register the JEA endpoint (lab VM)',
          code: 'New-PSSessionConfigurationFile -Path .\\LabJea.pssc -SessionType RestrictedRemoteServer -RunAsVirtualAccount `\n  -RoleDefinitions @{ "CORP\\GRP_Helpdesk" = @{ RoleCapabilities = "SpoolerHelp" } } `\n  -TranscriptDirectory "C:\\JeaTranscripts"\nRegister-PSSessionConfiguration -Name LabJea -Path .\\LabJea.pssc -Force -WhatIf',
          whatItDoes: 'Defines who may connect, which role they get, and where transcripts go, then previews registering the endpoint.',
          parts: [
            { part: '-SessionType RestrictedRemoteServer', meaning: 'Starts from a very limited session with only a few default commands.' },
            { part: '-RunAsVirtualAccount', meaning: 'Runs commands as a temporary virtual account rather than the caller\'s own rights. That account is a local administrator (domain-admin context on a DC), so keep the allow-list tiny. Narrow it with -RunAsVirtualAccountGroups.' },
            { part: '-RoleDefinitions @{ "CORP\\GRP_Helpdesk" = @{ ... } }', meaning: 'Maps a group to a role capability. Without it nobody gets any commands.' },
            { part: 'Register-PSSessionConfiguration -WhatIf', meaning: 'Previews creating the endpoint. Remove -WhatIf in the lab to really register it. Undo with Unregister-PSSessionConfiguration -Name LabJea.' },
          ],
          watchOut: 'Registering restarts the WinRM service, which drops existing remote sessions. Use a lab VM, and create the transcript folder first with strict permissions.',
        },
        {
          title: 'Prove what a user can really do',
          code: 'Get-PSSessionCapability -ConfigurationName LabJea -Username "CORP\\ihaider" | Select-Object -First 15 Name, CommandType',
          whatItDoes: 'Lists the commands available to a specific user in the JEA endpoint, so you can confirm they get just enough and no more.',
          parts: [
            { part: 'Get-PSSessionCapability', meaning: 'Reports the commands a user can run in a session configuration.' },
            { part: '-ConfigurationName LabJea', meaning: 'The endpoint to inspect.' },
            { part: '-Username "CORP\\ihaider"', meaning: 'The user (domain\\name) whose access you want to check. The user must be in the mapped group.' },
          ],
          sampleOutput: 'Name            CommandType\n----            -----------\nGet-Service           Cmdlet\nRestart-Service       Cmdlet',
        },
        {
          title: 'Connect as the helper and see the limits',
          code: 'Enter-PSSession -ComputerName SRV-CORE01 -ConfigurationName LabJea\nGet-Command\nRestart-Service -Name Spooler -WhatIf\nExit-PSSession',
          whatItDoes: 'Opens the restricted JEA session, lists the few allowed commands and previews an allowed action.',
          parts: [
            { part: 'Enter-PSSession -ConfigurationName LabJea', meaning: 'Connects to the JEA endpoint instead of the normal full endpoint.' },
            { part: 'Get-Command', meaning: 'Shows what this limited session lets you run.' },
            { part: 'Restart-Service -Name Spooler -WhatIf', meaning: 'Allowed command with a safe preview.' },
            { part: 'Exit-PSSession', meaning: 'Closes the remote session.' },
          ],
          watchOut: 'Run this as the helpdesk user, not as a Domain Admin. Using an admin account hides misconfigurations in the role.',
        },
      ],
    },
    recap: [
      'Remove PowerShell 2.0 where it exists (and verify with -Version 2) so attackers cannot downgrade past AMSI and logging. Newer builds such as Windows Server 2025 no longer include it, so an empty audit is a pass.',
      'Constrained Language Mode is truly enforced by application control such as WDAC or AppLocker, not by typing a variable, and it is not a boundary on its own.',
      'JEA gives people just enough commands with a virtual account instead of full administrator rights, but that virtual account is itself an administrator, so keep the allow-list tiny.',
      'Design roles with the smallest command list, test with Get-PSSessionCapability, and review transcripts.',
    ],
  },
};
