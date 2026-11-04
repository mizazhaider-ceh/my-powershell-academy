import type { CommandEntry } from '../types';

export const COMMANDS_EXTRA_3: CommandEntry[] = [
  {
    name: 'ConvertTo-Html',
    verb: 'ConvertTo',
    noun: 'Html',
    module: 'Microsoft.PowerShell.Utility',
    purpose: `Turn objects from the pipeline into HTML text (a table or list) that you can save as a web report.`,
    syntax: `ConvertTo-Html [[-Property] <Object[]>] [[-Head] <String[]>] [[-Title] <String>] [[-Body] <String[]>] [-InputObject <PSObject>] [-As <String>] [-CssUri <Uri>] [-PostContent <String[]>] [-PreContent <String[]>]\nConvertTo-Html [-InputObject <PSObject>] [-As <String>] [-Fragment] [-PostContent <String[]>] [-PreContent <String[]>]`,
    description: `ConvertTo-Html reads objects and builds the HTML markup for them in memory, one table row per object and one column per property. It does NOT create a file. To save the result you pipe it into Out-File (or Set-Content). Use -Fragment when you only want the <table> part so you can glue several tables into one bigger page, and -CssUri or -Head when you want the report to look nicer than the plain default.`,
    parameters: [
      { name: '-InputObject', type: 'PSObject', required: false, pipelineInput: 'ByValue', description: `The objects to convert. Almost always you pipe them in instead of typing this parameter.` },
      { name: '-Property', type: 'Object[]', required: false, position: 0, pipelineInput: 'False', description: `Which properties become columns. Most people use Select-Object before ConvertTo-Html instead, which is easier to read.` },
      { name: '-Title', type: 'String', required: false, position: 2, pipelineInput: 'False', description: `The text that appears in the browser tab (the HTML <title> tag). The default is "HTML TABLE".` },
      { name: '-Head', type: 'String[]', required: false, position: 1, pipelineInput: 'False', description: `Your own content for the <head> section, for example an inline <style> block. If you use -Head, the -Title parameter is ignored.` },
      { name: '-CssUri', type: 'Uri', required: false, pipelineInput: 'False', description: `Adds a <link> tag that points to a style sheet (.css file) so you can style the table without writing HTML by hand.` },
      { name: '-Fragment', type: 'SwitchParameter', required: false, pipelineInput: 'False', description: `Output only the <table> element, without the <html>, <head> and <body> wrapper. Ideal when you build a page out of several tables.` },
      { name: '-As', type: 'String', required: false, pipelineInput: 'False', description: `Table (the default, one row per object) or List (one small table per object, good for objects with many properties).` },
      { name: '-PreContent / -PostContent', type: 'String[]', required: false, pipelineInput: 'False', description: `Text or HTML placed just before or after the table, for example a heading such as <h2>Disks</h2>.` },
    ],
    practicalExamples: [
      {
        title: `Save a Service Report as a Web Page`,
        description: `Select the columns you want, convert them to HTML with a title and a little inline CSS, then write the text to a file.`,
        code: `$style = '<style>table{border-collapse:collapse} th,td{border:1px solid #888;padding:4px 8px} th{background:#ddd}</style>'
Get-Service |
    Where-Object Status -eq 'Running' |
    Select-Object Name, DisplayName, Status |
    ConvertTo-Html -Head $style -PreContent '<h1>Running services</h1>' |
    Out-File -FilePath "$env:TEMP\\services.html" -Encoding utf8`,
        illustrativeOutput: `(No output on screen. The file now contains text like this:)
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<style>table{border-collapse:collapse} ...</style>
</head><body>
<h1>Running services</h1>
<table>
<colgroup><col/><col/><col/></colgroup>
<tr><th>Name</th><th>DisplayName</th><th>Status</th></tr>
<tr><td>Spooler</td><td>Print Spooler</td><td>Running</td></tr>`,
        explanation: `ConvertTo-Html only builds text. Out-File is the step that creates services.html. Open the file with Invoke-Item "$env:TEMP\\services.html" to see it in your browser. Because -Head is used, a -Title would have been ignored.`,
      },
      {
        title: `Build One Page from Several Tables with -Fragment`,
        description: `Create each table as a fragment, then wrap them all in one page using -Body.`,
        code: `$disks = Get-CimInstance Win32_LogicalDisk -Filter 'DriveType=3' |
    Select-Object DeviceID, @{N='FreeGB';E={[math]::Round($_.FreeSpace / 1GB, 1)}} |
    ConvertTo-Html -Fragment -PreContent '<h2>Disks</h2>'
$procs = Get-Process | Sort-Object WorkingSet64 -Descending | Select-Object -First 5 Name, Id |
    ConvertTo-Html -Fragment -PreContent '<h2>Top 5 processes</h2>'
ConvertTo-Html -Title 'CLIENT01 report' -Body "<h1>CLIENT01</h1>$disks$procs" |
    Out-File "$env:TEMP\\client01.html" -Encoding utf8`,
        illustrativeOutput: `(No output on screen. $disks holds fragment text like:)
<h2>Disks</h2>
<table>
<colgroup><col/><col/></colgroup>
<tr><th>DeviceID</th><th>FreeGB</th></tr>
<tr><td>C:</td><td>84.2</td></tr>
</table>`,
        explanation: `-Fragment gives you just the table, so you can combine several of them inside the -Body of a final ConvertTo-Html call that adds the page wrapper once.`,
      },
      {
        title: `Style the Report with an External Style Sheet`,
        description: `Point the page at a .css file with -CssUri so you do not paste CSS into every script.`,
        code: `Get-HotFix | Select-Object HotFixID, Description, InstalledOn |
    ConvertTo-Html -Title 'Installed updates' -CssUri 'style.css' |
    Out-File -FilePath 'C:\\Reports\\updates.html' -Encoding utf8`,
        illustrativeOutput: `(The head of updates.html contains:)
<head>
<title>Installed updates</title>
<link rel="stylesheet" type="text/css" href="style.css" />
</head>`,
        explanation: `The browser loads style.css when it opens the page. A relative name like style.css is looked up next to updates.html, so keep both files in the same folder (or use a full URL).`,
      },
    ],
    commonMistakes: [
      `Expecting a file to appear. ConvertTo-Html writes text to the pipeline only; add | Out-File -FilePath report.html to save it.`,
      `Putting Format-Table before ConvertTo-Html. Format-* cmdlets produce display instructions, not data objects, so you get odd columns. Use Select-Object to choose columns instead.`,
      `Using -Head and -Title together and wondering why the title never shows. When -Head is supplied, -Title is ignored, so put the <title> tag inside your -Head text.`,
    ],
    troubleshooting: `If the page opens but looks like plain unstyled text, check that the file really ends in .html and that your style sheet path is correct (a relative -CssUri is resolved by the browser, not by PowerShell). If special characters such as accents look wrong, add -Encoding utf8 to Out-File. The HTML produced by Windows PowerShell 5.1 is XHTML 1.0 style; PowerShell 7+ writes modern HTML5, so the first lines of the output differ between versions.`,
    relatedCommands: ['Out-File', 'Export-Csv', 'ConvertTo-Json', 'Format-Table'],
    relatedLessonPath: '/learn/chapter-09/hands-on-admin-workout',
    isEssentialPocketknife: false,
  },
  {
    name: 'Find-Module',
    verb: 'Find',
    noun: 'Module',
    module: 'PowerShellGet',
    purpose: `Search an online repository such as the PowerShell Gallery for modules, without installing anything.`,
    syntax: `Find-Module [[-Name] <String[]>] [-MinimumVersion <Version>] [-MaximumVersion <Version>] [-RequiredVersion <Version>] [-AllVersions] [-IncludeDependencies] [-Filter <String>] [-Tag <String[]>] [-Command <String[]>] [-Repository <String[]>] [-Credential <PSCredential>]`,
    description: `Find-Module is the "search the shop window" step of the module lifecycle. It contacts a repository (by default the PowerShell Gallery, called PSGallery) and returns a small object per module with its Name, Version, Repository and Description. Nothing is downloaded to disk and nothing is run. It needs internet access, and on Windows PowerShell 5.1 it may ask you to install the NuGet provider the first time.`,
    parameters: [
      { name: '-Name', type: 'String[]', required: false, position: 0, pipelineInput: 'ByPropertyName', description: `The module name to look for. Wildcards such as Posh-* are allowed.` },
      { name: '-Repository', type: 'String[]', required: false, pipelineInput: 'False', description: `Limit the search to one registered repository. Use Get-PSRepository to see what is registered (usually just PSGallery).` },
      { name: '-Tag', type: 'String[]', required: false, pipelineInput: 'False', description: `Find modules the author labelled with a tag, for example Security or ActiveDirectory.` },
      { name: '-Command', type: 'String[]', required: false, pipelineInput: 'False', description: `Find the module that provides a given cmdlet or function name. Handy when you remember a command but not its module.` },
      { name: '-Filter', type: 'String', required: false, pipelineInput: 'False', description: `Free text search against module names, descriptions and tags.` },
      { name: '-RequiredVersion', type: 'Version', required: false, pipelineInput: 'ByPropertyName', description: `Look for one exact version. Use -MinimumVersion or -MaximumVersion for a range, or -AllVersions to list every published version.` },
      { name: '-IncludeDependencies', type: 'SwitchParameter', required: false, pipelineInput: 'False', description: `Also return the other modules this module depends on.` },
    ],
    practicalExamples: [
      {
        title: `Look Up a Module by Name`,
        description: `Check that a module exists and see its latest version before installing it.`,
        code: `Find-Module -Name PSScriptAnalyzer | Select-Object Name, Version, Repository, Description`,
        illustrativeOutput: `Name              Version Repository Description
----              ------- ---------- -----------
PSScriptAnalyzer  1.22.0  PSGallery  PSScriptAnalyzer provides script analysis and checks for potential code defects...`,
        explanation: `Select-Object trims the result to the interesting columns. Version numbers change over time, so yours will differ.`,
      },
      {
        title: `Search by Tag or Keyword`,
        description: `Discover modules when you do not know the exact name.`,
        code: `Find-Module -Tag 'Pester' | Select-Object -First 5 Name, Version
Find-Module -Filter 'Azure Active Directory' | Select-Object -First 5 Name, Version`,
        illustrativeOutput: `Name                 Version
----                 -------
Pester               5.5.0
Pester.Extension     1.0.2`,
        explanation: `-Tag matches the labels the author chose; -Filter does a free text search. Always read the Description and the author before you trust a module.`,
      },
      {
        title: `Which Module Provides This Command?`,
        description: `Search the Gallery for the module that contains a specific command name.`,
        code: `Find-Module -Command 'Get-GitStatus' | Select-Object Name, Version, Author`,
        illustrativeOutput: `Name     Version Author
----     ------- ------
posh-git 1.1.0   dahlbyk`,
        explanation: `-Command searches the list of commands each module exports, which is easier than guessing the module name.`,
      },
    ],
    commonMistakes: [
      `Thinking Find-Module installs the module. It only searches; use Install-Module to download it.`,
      `Searching with a partial name and no wildcard. Find-Module -Name Posh returns nothing; use Posh* or -Filter Posh.`,
      `Confusing it with Get-Module. Find-Module looks online; Get-Module looks at what is already on your computer.`,
    ],
    troubleshooting: `If you see "Unable to resolve package source" or "No match was found for the specified search criteria", first check your internet connection and proxy. On Windows PowerShell 5.1 the PowerShell Gallery requires TLS 1.2, so run [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12 in the session and retry. If you are asked to install the NuGet provider, answer yes (it needs to be installed once, and for all users it requires an administrator prompt). Run Get-PSRepository to confirm PSGallery is registered.`,
    relatedCommands: ['Install-Module', 'Get-Module', 'Import-Module', 'Get-Command'],
    relatedLessonPath: '/learn/chapter-11/module-lifecycle',
    isEssentialPocketknife: false,
  },
  {
    name: 'Install-Module',
    verb: 'Install',
    noun: 'Module',
    module: 'PowerShellGet',
    purpose: `Download a module from a repository such as the PowerShell Gallery and install it on your computer.`,
    syntax: `Install-Module [-Name] <String[]> [-MinimumVersion <Version>] [-MaximumVersion <Version>] [-RequiredVersion <Version>] [-Repository <String[]>] [-Credential <PSCredential>] [-Scope <String>] [-AllowClobber] [-SkipPublisherCheck] [-Force] [-WhatIf] [-Confirm]`,
    description: `Install-Module downloads a module (and the modules it depends on) from a repository and copies it into a Modules folder where PowerShell can find it. With -Scope AllUsers (the default on Windows PowerShell 5.1) it installs into Program Files and needs an administrator prompt. With -Scope CurrentUser it installs into your own Documents folder and needs no admin rights. Installing code from the internet is a trust decision: the first time you use PSGallery you are asked to confirm that you trust the repository.`,
    parameters: [
      { name: '-Name', type: 'String[]', required: true, position: 0, pipelineInput: 'ByPropertyName', description: `The module (or modules) to install. This is the name you saw in Find-Module.` },
      { name: '-Scope', type: 'String', required: false, pipelineInput: 'False', description: `AllUsers (needs admin, everyone on the machine gets it) or CurrentUser (no admin, only you).` },
      { name: '-RequiredVersion', type: 'Version', required: false, pipelineInput: 'ByPropertyName', description: `Install one exact version. Use -MinimumVersion or -MaximumVersion for a range.` },
      { name: '-Repository', type: 'String[]', required: false, pipelineInput: 'False', description: `Which registered repository to download from. Defaults to the first one that has the module.` },
      { name: '-Force', type: 'SwitchParameter', required: false, pipelineInput: 'False', description: `Installs without the usual prompts (for example the untrusted repository question) and reinstalls if the module is already present. Use it deliberately.` },
      { name: '-AllowClobber', type: 'SwitchParameter', required: false, pipelineInput: 'False', description: `Allow the new module to hide commands that already have the same name from another module.` },
      { name: '-SkipPublisherCheck', type: 'SwitchParameter', required: false, pipelineInput: 'False', description: `Allow installing a newer version even when the publisher signature differs from the version already installed (the classic case is Pester on Windows PowerShell 5.1).` },
      { name: '-WhatIf', type: 'SwitchParameter', required: false, pipelineInput: 'False', description: `Show what would be installed without downloading anything.` },
    ],
    practicalExamples: [
      {
        title: `Install for Yourself Only (No Admin Needed)`,
        description: `Preview first with -WhatIf, then install into your own profile.`,
        code: `[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
Install-Module -Name PSScriptAnalyzer -Scope CurrentUser -WhatIf
Install-Module -Name PSScriptAnalyzer -Scope CurrentUser`,
        illustrativeOutput: `What if: Performing the operation "Install-Module" on target "Version '1.22.0' of module 'PSScriptAnalyzer'".

Untrusted repository
You are installing the modules from an untrusted repository. If you trust this repository, change its InstallationPolicy value by running the Set-PSRepository cmdlet. Are you sure you want to install the modules from 'PSGallery'?
[Y] Yes  [A] Yes to All  [N] No  [L] No to All  [S] Suspend  [?] Help (default is "N"):`,
        explanation: `The first line forces TLS 1.2 for this session only (needed on older Windows PowerShell 5.1 builds). -Scope CurrentUser avoids the admin prompt. The untrusted repository question is normal on first use; read it, then answer Y if you accept the risk.`,
      },
      {
        title: `Install a Specific Version`,
        description: `Pin an exact version so every machine in your lab gets the same one.`,
        code: `Install-Module -Name Pester -RequiredVersion 5.5.0 -Scope CurrentUser -SkipPublisherCheck -Force`,
        illustrativeOutput: `(Usually no output on success. Verify with:)
Get-Module -ListAvailable Pester | Select-Object Name, Version

Name   Version
----   -------
Pester 5.5.0
Pester 3.4.0`,
        explanation: `Windows PowerShell 5.1 ships with an older, Microsoft-signed Pester 3.4.0, so installing a newer one needs -SkipPublisherCheck. Both versions stay on disk; the newest is the one used by default.`,
      },
      {
        title: `Install Several Modules in One Command`,
        description: `Give -Name a list and preview the result first.`,
        code: `Install-Module -Name posh-git, PSReadLine -Scope CurrentUser -WhatIf`,
        illustrativeOutput: `What if: Performing the operation "Install-Module" on target "Version '1.1.0' of module 'posh-git'".
What if: Performing the operation "Install-Module" on target "Version '2.3.4' of module 'PSReadLine'".`,
        explanation: `-Name takes a list. Remove -WhatIf when the preview looks right. Note that RSAT tools such as the ActiveDirectory module are Windows features, not Gallery modules, so you cannot install them with Install-Module.`,
      },
    ],
    commonMistakes: [
      `Running with default scope from a non-admin prompt and getting an access denied error. Add -Scope CurrentUser or start PowerShell as Administrator.`,
      `Skipping the TLS 1.2 line on older Windows PowerShell 5.1 and getting "Unable to download from URI" or "No match was found" errors.`,
      `Using -Force just to silence prompts without reading them. The untrusted repository prompt is a real safety check, so install only modules you have looked at.`,
    ],
    troubleshooting: `On a fresh Windows PowerShell 5.1 you may be told that the NuGet provider is required; accept it (Install-PackageProvider -Name NuGet -MinimumVersion 2.8.5.201 -Force does the same thing by hand and needs internet access). If you get "A command with name X is already available", the new module clashes with an existing command; use -AllowClobber only if you understand which command will win. After installing, the module is not loaded yet: run Get-Module -ListAvailable <Name> to confirm it is on disk and Import-Module <Name> to load it (PowerShell also auto-loads it when you call one of its commands).`,
    relatedCommands: ['Find-Module', 'Get-Module', 'Import-Module', 'Get-ExecutionPolicy'],
    relatedLessonPath: '/learn/chapter-11/module-lifecycle',
    isEssentialPocketknife: false,
  },
  {
    name: 'Get-Module',
    verb: 'Get',
    noun: 'Module',
    module: 'Microsoft.PowerShell.Core',
    purpose: `List the modules that are loaded in your session, or all modules installed on the computer.`,
    syntax: `Get-Module [[-Name] <String[]>] [-All] [-FullyQualifiedName <ModuleSpecification[]>] [-Refresh]\nGet-Module [[-Name] <String[]>] -ListAvailable [-All] [-Refresh] [-PSSession <PSSession>] [-CimSession <CimSession>]`,
    description: `Get-Module answers two different questions. With no parameters it shows only the modules already imported into your current session. With -ListAvailable it searches every folder in $env:PSModulePath and shows everything that is installed, even if it is not loaded. Each result carries the module Name, Version, ModuleType and the commands it exports (ExportedCommands), so it is also a quick way to see which commands a module gives you.`,
    parameters: [
      { name: '-Name', type: 'String[]', required: false, position: 0, pipelineInput: 'ByValue', description: `Module name to look for. Wildcards are allowed, for example Net*.` },
      { name: '-ListAvailable', type: 'SwitchParameter', required: false, pipelineInput: 'False', description: `Show modules installed on disk, not just the ones currently loaded.` },
      { name: '-All', type: 'SwitchParameter', required: false, pipelineInput: 'False', description: `Include nested modules and every version found, not just the top level modules.` },
      { name: '-FullyQualifiedName', type: 'ModuleSpecification[]', required: false, pipelineInput: 'False', description: `Look for a module by name and version together, using a hashtable such as @{ModuleName='Pester';ModuleVersion='5.0.0'}.` },
      { name: '-Refresh', type: 'SwitchParameter', required: false, pipelineInput: 'False', description: `Refresh the cached list of installed modules. Use it with -ListAvailable right after installing something.` },
      { name: '-PSSession', type: 'PSSession', required: false, pipelineInput: 'False', description: `List the modules available in a remote session (needs -ListAvailable). Handy for checking a server before you import from it.` },
    ],
    practicalExamples: [
      {
        title: `What Is Loaded Right Now?`,
        description: `See the modules in your current session.`,
        code: `Get-Module | Select-Object Name, Version, ModuleType`,
        illustrativeOutput: `Name                       Version ModuleType
----                       ------- ----------
Microsoft.PowerShell.Management 3.1.0.0 Manifest
Microsoft.PowerShell.Utility    3.1.0.0 Manifest
PSReadline                      2.0.0   Script`,
        explanation: `Only imported modules appear. A module you installed but have not used yet will not be listed.`,
      },
      {
        title: `Is a Module Installed, and Which Versions?`,
        description: `Search the disk for a module and sort by version.`,
        code: `Get-Module -ListAvailable -Name Pester | Sort-Object Version -Descending | Select-Object Name, Version, Path`,
        illustrativeOutput: `Name   Version Path
----   ------- ----
Pester 5.5.0   C:\\Users\\Admin\\Documents\\WindowsPowerShell\\Modules\\Pester\\5.5.0\\Pester.psd1
Pester 3.4.0   C:\\Program Files\\WindowsPowerShell\\Modules\\Pester\\3.4.0\\Pester.psd1`,
        explanation: `-ListAvailable lists every version found on disk, including where each one lives. This is also how you check whether the ActiveDirectory module (RSAT) is installed on a machine.`,
      },
      {
        title: `Which Commands Does a Module Provide?`,
        description: `Peek inside a module's list of exported commands.`,
        code: `(Get-Module -ListAvailable -Name NetAdapter).ExportedCommands.Keys | Select-Object -First 5`,
        illustrativeOutput: `Disable-NetAdapter
Enable-NetAdapter
Get-NetAdapter
Rename-NetAdapter
Restart-NetAdapter`,
        explanation: `ExportedCommands is a dictionary; its Keys are the command names. Get-Command -Module NetAdapter gives a similar answer with more detail.`,
      },
    ],
    commonMistakes: [
      `Running Get-Module and concluding a module is not installed because it is missing from the list. Without -ListAvailable you only see loaded modules.`,
      `Forgetting -Refresh after installing a module in the same session and not seeing the new module immediately.`,
      `Expecting Get-Module -ListAvailable to search the internet. It searches only local folders; use Find-Module for the online Gallery.`,
    ],
    troubleshooting: `If a module you know you installed does not appear, look at $env:PSModulePath -split ';' to see which folders PowerShell searches; modules must sit in <folder>\\<ModuleName>\\ (and optionally a version subfolder). Installing with -Scope CurrentUser puts them under your Documents\\WindowsPowerShell\\Modules folder, which is only searched for your account. Modules for Windows PowerShell and PowerShell 7+ live in different folders, so a module visible in one shell may be missing from the other.`,
    relatedCommands: ['Import-Module', 'Find-Module', 'Install-Module', 'Get-Command'],
    relatedLessonPath: '/learn/chapter-11/module-lifecycle',
    isEssentialPocketknife: false,
  },
  {
    name: 'Import-Module',
    verb: 'Import',
    noun: 'Module',
    module: 'Microsoft.PowerShell.Core',
    purpose: `Load a module into the current session so its commands, functions and aliases become available.`,
    syntax: `Import-Module [-Name] <String[]> [-Global] [-Prefix <String>] [-Function <String[]>] [-Cmdlet <String[]>] [-Alias <String[]>] [-Force] [-PassThru] [-MinimumVersion <Version>] [-MaximumVersion <Version>] [-RequiredVersion <Version>] [-DisableNameChecking] [-NoClobber] [-Scope <String>] [-PSSession <PSSession>]`,
    description: `Import-Module reads an installed module and adds its commands to your current session. Since PowerShell 3.0 most modules also auto-load the first time you use one of their commands, so Import-Module is often optional. You still use it to load a specific version, add a prefix to avoid name clashes, reload a module you are editing (-Force), or use a module that lives on a remote machine through implicit remoting (-PSSession).`,
    parameters: [
      { name: '-Name', type: 'String[]', required: true, position: 0, pipelineInput: 'ByValue', description: `The module name (or the path to a .psd1 or .psm1 file) to load.` },
      { name: '-RequiredVersion', type: 'Version', required: false, pipelineInput: 'False', description: `Load exactly this version when several versions are installed. -MinimumVersion and -MaximumVersion give a range.` },
      { name: '-Force', type: 'SwitchParameter', required: false, pipelineInput: 'False', description: `Reload the module even if it is already loaded. Essential when you changed your own module's code.` },
      { name: '-PassThru', type: 'SwitchParameter', required: false, pipelineInput: 'False', description: `Return the module object so you can see what was loaded. Import-Module normally prints nothing.` },
      { name: '-Prefix', type: 'String', required: false, pipelineInput: 'False', description: `Add a prefix to the noun of every imported command, so Get-Thing becomes Get-ContosoThing. Use it to avoid clashes.` },
      { name: '-Function', type: 'String[]', required: false, pipelineInput: 'False', description: `Import only the named functions instead of everything the module exports.` },
      { name: '-PSSession', type: 'PSSession', required: false, pipelineInput: 'False', description: `Import the module from a remote session (implicit remoting). The commands appear locally but run on the remote computer.` },
    ],
    practicalExamples: [
      {
        title: `Load a Module and See What You Got`,
        description: `Import a module and immediately list some of its commands.`,
        code: `Import-Module -Name NetAdapter -PassThru | Select-Object Name, Version, ExportedCommands`,
        illustrativeOutput: `Name       Version ExportedCommands
----       ------- ----------------
NetAdapter 2.0.0.0 {Disable-NetAdapter, Enable-NetAdapter, Get-NetAdapter, Rename-NetAdapter...}`,
        explanation: `-PassThru returns the module object so you can see it loaded. Without it the command succeeds silently.`,
      },
      {
        title: `Import a Specific Version`,
        description: `When two versions are installed, choose which one to use.`,
        code: `Import-Module -Name Pester -RequiredVersion 5.5.0 -Force
Get-Module Pester | Select-Object Name, Version`,
        illustrativeOutput: `Name   Version
----   -------
Pester 5.5.0`,
        explanation: `Without -RequiredVersion, PowerShell loads the highest version it finds. -Force unloads any version already in the session first.`,
      },
      {
        title: `Use the ActiveDirectory Module from a Domain Controller (Implicit Remoting)`,
        description: `On a computer without RSAT, borrow the module from DC01 over a remoting session.`,
        code: `$session = New-PSSession -ComputerName DC01
Import-Module -Name ActiveDirectory -PSSession $session
Get-ADDomain | Select-Object DNSRoot, NetBIOSName`,
        illustrativeOutput: `DNSRoot          NetBIOSName
-------          -----------
corp.example.com CORP`,
        explanation: `The Get-AD* commands appear on your computer, but they actually run on DC01. Requires WinRM access to DC01 and permission to connect. Close the session with Remove-PSSession $session when you finish.`,
      },
    ],
    commonMistakes: [
      `Typing the cmdlet name instead of the module name, for example Import-Module Get-ADUser. The value must be a module name such as ActiveDirectory.`,
      `Assuming Import-Module installs anything. It only loads a module that is already on disk; use Install-Module (or add the Windows RSAT feature) first.`,
      `Editing your own module file and not seeing changes. Run Import-Module -Force to reload it.`,
    ],
    troubleshooting: `"The specified module 'X' was not loaded because no valid module file was found in any module directory" means the module is not installed in a folder listed in $env:PSModulePath. Check with Get-Module -ListAvailable X. If the module loads but its commands cannot run, check your execution policy (Get-ExecutionPolicy -List), because script modules (.psm1) are subject to it. A warning about unapproved verbs only means the module author used a non-standard verb; add -DisableNameChecking to hide it.`,
    relatedCommands: ['Get-Module', 'Install-Module', 'Find-Module', 'Get-ExecutionPolicy'],
    relatedLessonPath: '/learn/chapter-11/module-lifecycle',
    isEssentialPocketknife: false,
  },
  {
    name: 'Test-WSMan',
    verb: 'Test',
    noun: 'WSMan',
    module: 'Microsoft.WSMan.Management',
    purpose: `Check whether the WinRM service on a computer is running and answering requests.`,
    syntax: `Test-WSMan [[-ComputerName] <String>] [-Authentication <AuthenticationMechanism>] [-Port <Int32>] [-UseSSL] [-ApplicationName <String>] [-Credential <PSCredential>] [-CertificateThumbprint <String>]`,
    description: `Test-WSMan sends a tiny identification request to the WinRM (WS-Management) service on the target and prints the answer. If you get a reply, the WinRM listener is up and the network path (TCP 5985 for HTTP, 5986 for HTTPS) is open. It tests WinRM only, not full PowerShell remoting: a successful result does not prove that you are allowed to open a session, that a remoting endpoint is registered, or that your credentials will work. With no -Authentication the check is anonymous; set -Authentication and -Credential to also test that you can authenticate.`,
    parameters: [
      { name: '-ComputerName', type: 'String', required: false, position: 0, pipelineInput: 'ByValue', description: `The computer to test. If you leave it out, Test-WSMan tests the local computer.` },
      { name: '-Authentication', type: 'AuthenticationMechanism', required: false, pipelineInput: 'False', description: `How to authenticate, for example Default, Kerberos, Negotiate or Basic. Leave it out for a simple "is anyone listening" check.` },
      { name: '-Credential', type: 'PSCredential', required: false, pipelineInput: 'ByPropertyName', description: `Credentials to use when you also set -Authentication. Create them with Get-Credential.` },
      { name: '-UseSSL', type: 'SwitchParameter', required: false, pipelineInput: 'False', description: `Use HTTPS (port 5986) instead of HTTP (port 5985).` },
      { name: '-Port', type: 'Int32', required: false, pipelineInput: 'False', description: `Connect on a non-standard port if your listener does not use 5985 or 5986.` },
    ],
    practicalExamples: [
      {
        title: `Is WinRM Answering on a Server?`,
        description: `The quick door-knock before you try remoting.`,
        code: `Test-WSMan -ComputerName SRV-CORE01`,
        illustrativeOutput: `wsmid           : http://schemas.dmtf.org/wbem/wsman/identity/1/wsmanidentity.xsd
ProtocolVersion : http://schemas.dmtf.org/wbem/wsman/1/wsman.xsd
ProductVendor   : Microsoft Corporation
ProductVersion  : OS: 0.0.0 SP: 0.0 Stack: 3.0`,
        explanation: `Getting these four lines back means WinRM replied. The version numbers look odd (OS: 0.0.0) but that is normal.`,
      },
      {
        title: `Test Authentication as Well`,
        description: `Prove that your account can authenticate, not just that the port is open.`,
        code: `$cred = Get-Credential -Message 'Lab admin account (CORP)'
Test-WSMan -ComputerName SRV-CORE01 -Authentication Kerberos -Credential $cred`,
        illustrativeOutput: `wsmid           : http://schemas.dmtf.org/wbem/wsman/identity/1/wsmanidentity.xsd
ProtocolVersion : http://schemas.dmtf.org/wbem/wsman/1/wsman.xsd
ProductVendor   : Microsoft Corporation
ProductVersion  : OS: 0.0.0 SP: 0.0 Stack: 3.0`,
        explanation: `With -Authentication set, the request must be authenticated, so a success also proves that Kerberos and your credentials are accepted. Use the computer name, not an IP address, for Kerberos.`,
      },
      {
        title: `Check Many Machines and Report the Ones That Fail`,
        description: `Loop over a list and use -ErrorAction SilentlyContinue so a failure becomes $null instead of a red error.`,
        code: `'DC01', 'SRV-CORE01', 'CLIENT01' | ForEach-Object {
    $ok = [bool](Test-WSMan -ComputerName $_ -ErrorAction SilentlyContinue)
    [pscustomobject]@{ Computer = $_; WinRM = $ok }
}`,
        illustrativeOutput: `Computer   WinRM
--------   -----
DC01        True
SRV-CORE01  True
CLIENT01   False`,
        explanation: `A failed Test-WSMan writes an error and returns nothing, so [bool] turns that into False. The False on CLIENT01 here is an example; client machines often have WinRM turned off until you run Enable-PSRemoting.`,
      },
    ],
    commonMistakes: [
      `Treating a successful Test-WSMan as proof that Enter-PSSession or Invoke-Command will work. It only proves WinRM answers, not that you are authorised or that the endpoint exists.`,
      `Using an IP address together with Kerberos authentication. Kerberos needs the computer name; an IP forces NTLM and requires the machine to be in TrustedHosts for non-domain setups.`,
      `Forgetting that Test-WSMan is not a ping. A blocked ICMP does not matter here, but a blocked TCP 5985/5986 does.`,
    ],
    troubleshooting: `A typical failure reads "The client cannot connect to the destination specified in the request. Verify that the service on the destination is running and is accepting requests." Check in this order: can you resolve the name (Resolve-DnsName), is the port open (Test-NetConnection SRV-CORE01 -Port 5985), is the WinRM service running on the target (Get-Service WinRM), and has remoting been enabled (Enable-PSRemoting -Force on the target, lab only). Also check the firewall rule "Windows Remote Management (HTTP-In)" and, for client machines on a Public network profile, that the rule scope allows your address.`,
    relatedCommands: ['Test-NetConnection', 'Invoke-Command', 'Enter-PSSession', 'Get-Credential'],
    relatedLessonPath: '/learn/chapter-11/winrm-and-remoting',
    isEssentialPocketknife: false,
  },
  {
    name: 'Enter-PSSession',
    verb: 'Enter',
    noun: 'PSSession',
    module: 'Microsoft.PowerShell.Core',
    purpose: `Start an interactive one-to-one remote session so you can type commands as if you were sitting at another computer.`,
    syntax: `Enter-PSSession [-ComputerName] <String> [-Credential <PSCredential>] [-Port <Int32>] [-UseSSL] [-Authentication <AuthenticationMechanism>] [-ConfigurationName <String>] [-SessionOption <PSSessionOption>]\nEnter-PSSession [-Session] <PSSession>\nEnter-PSSession [-Id] <Int32>`,
    description: `Enter-PSSession connects over WinRM to one remote computer and changes your prompt to show the computer name, for example [SRV-CORE01]: PS C:\\Users\\Admin\\Documents>. Every command you type then runs on that remote computer until you leave with Exit-PSSession. It is designed for hands-on troubleshooting at the keyboard. It is interactive only, so never use it inside a script: use Invoke-Command there, which can also fan out to many computers at once.`,
    parameters: [
      { name: '-ComputerName', type: 'String', required: true, position: 0, pipelineInput: 'ByValue, ByPropertyName', description: `The single remote computer to connect to. Use its name (not an IP) in a domain so Kerberos works.` },
      { name: '-Credential', type: 'PSCredential', required: false, position: 1, pipelineInput: 'ByPropertyName', description: `A different account to connect with. Create it with Get-Credential. If omitted, your current Windows identity is used.` },
      { name: '-Session', type: 'PSSession', required: false, position: 0, pipelineInput: 'ByValue, ByPropertyName', description: `Enter an existing session made with New-PSSession instead of creating a new one. The session stays alive after you exit.` },
      { name: '-UseSSL', type: 'SwitchParameter', required: false, pipelineInput: 'False', description: `Connect over HTTPS (TCP 5986) instead of HTTP (5985). The remote computer needs a certificate-based listener.` },
      { name: '-Port', type: 'Int32', required: false, pipelineInput: 'False', description: `Use a non-standard WinRM port.` },
      { name: '-Authentication', type: 'AuthenticationMechanism', required: false, pipelineInput: 'False', description: `The sign-in method, such as Default, Kerberos, Negotiate or CredSSP. Most of the time you leave this alone.` },
      { name: '-ConfigurationName', type: 'String', required: false, pipelineInput: 'False', description: `Connect to a specific session configuration (endpoint), for example a restricted JEA endpoint. Defaults to Microsoft.PowerShell.` },
    ],
    practicalExamples: [
      {
        title: `Open an Interactive Session on a Server`,
        description: `Connect, run a command on the remote machine, then leave.`,
        code: `Enter-PSSession -ComputerName SRV-CORE01
$env:COMPUTERNAME
Get-Service -Name Spooler
Exit-PSSession`,
        illustrativeOutput: `[SRV-CORE01]: PS C:\\Users\\Admin\\Documents> $env:COMPUTERNAME
SRV-CORE01
[SRV-CORE01]: PS C:\\Users\\Admin\\Documents> Get-Service -Name Spooler

Status   Name      DisplayName
------   ----      -----------
Running  Spooler   Print Spooler
[SRV-CORE01]: PS C:\\Users\\Admin\\Documents> Exit-PSSession
PS C:\\Users\\Admin>`,
        explanation: `The prompt prefix [SRV-CORE01] tells you where your commands are running. After Exit-PSSession the prefix disappears and you are back on your own computer.`,
      },
      {
        title: `Connect with Different Credentials`,
        description: `Use another account, for example a lab admin account, without typing the password into the command.`,
        code: `$cred = Get-Credential -Message 'CORP lab admin'
Enter-PSSession -ComputerName CLIENT01 -Credential $cred`,
        illustrativeOutput: `[CLIENT01]: PS C:\\Users\\labadmin\\Documents>`,
        explanation: `Get-Credential pops up a secure box, so there is no password in your script or history. Your commands now run as that account on CLIENT01.`,
      },
      {
        title: `Reuse a Session You Already Created`,
        description: `Keep a session open, enter and leave it as often as you like.`,
        code: `$s = New-PSSession -ComputerName DC01
Enter-PSSession -Session $s
Exit-PSSession
Get-PSSession
Remove-PSSession $s`,
        illustrativeOutput: ` Id Name     ComputerName State  ConfigurationName     Availability
 -- ----     ------------ -----  -----------------     ------------
  1 Session1 DC01         Opened Microsoft.PowerShell     Available`,
        explanation: `Exiting a session made with -ComputerName closes it, but a session you created yourself with New-PSSession stays open until you remove it.`,
      },
    ],
    commonMistakes: [
      `Putting Enter-PSSession in a script. Scripts cannot "type" into the remote prompt; the lines after it still run on your local computer. Use Invoke-Command -ComputerName SRV-CORE01 -ScriptBlock { ... } instead.`,
      `Forgetting which prompt you are in and running a destructive command on the wrong computer. Always glance at the [computer] prefix.`,
      `Expecting to reach a second server from inside the session without extra setup. Your credentials are not passed on (the double-hop problem), so a command inside the session that touches another server may fail with access denied.`,
    ],
    troubleshooting: `"Connecting to remote server X failed ... WinRM cannot process the request" usually means WinRM is not enabled on the target, a firewall blocks TCP 5985, or you used an IP address (or a computer outside your domain) without adding it to TrustedHosts or using HTTPS. Run Test-WSMan -ComputerName X first, then Test-NetConnection X -Port 5985. If the error says Access is denied, your account is not in the Remote Management Users or Administrators group on the target. If a session seems stuck, press Ctrl+C or close the window; do not rely on typing exit inside scripts.`,
    relatedCommands: ['Exit-PSSession', 'Invoke-Command', 'Test-WSMan', 'Get-Credential'],
    relatedLessonPath: '/learn/chapter-11/winrm-and-remoting',
    isEssentialPocketknife: false,
  },
  {
    name: 'Exit-PSSession',
    verb: 'Exit',
    noun: 'PSSession',
    module: 'Microsoft.PowerShell.Core',
    purpose: `Leave an interactive remote session started with Enter-PSSession and return to your local prompt.`,
    syntax: `Exit-PSSession [<CommonParameters>]`,
    description: `Exit-PSSession takes you out of a remote session created with Enter-PSSession and puts you back in your own local PowerShell. It has no parameters of its own, only the common ones. If you started the session with -ComputerName, leaving it also closes the connection. If you entered an existing session object with -Session, that session stays open so you can enter it again. The shorter word exit does the same job inside an interactive remote session, and the shortcut is handy because many people type it by habit.`,
    parameters: [
      { name: '-ErrorAction', type: 'ActionPreference', required: false, pipelineInput: 'False', description: `A common parameter that decides what happens if the command hits an error. Exit-PSSession has no parameters of its own.` },
      { name: '-Verbose', type: 'SwitchParameter', required: false, pipelineInput: 'False', description: `A common parameter that prints extra detail while the command runs. Exit-PSSession has no parameters of its own.` },
    ],
    practicalExamples: [
      {
        title: `Return to Your Own Computer`,
        description: `The standard way out of Enter-PSSession.`,
        code: `Enter-PSSession -ComputerName SRV-CORE01
Exit-PSSession`,
        illustrativeOutput: `[SRV-CORE01]: PS C:\\Users\\Admin\\Documents> Exit-PSSession
PS C:\\Users\\Admin>`,
        explanation: `The [SRV-CORE01] part of the prompt disappears. Commands you type now run locally again.`,
      },
      {
        title: `Prove Where You Are Before and After`,
        description: `Use the computer name to be certain which machine you are on.`,
        code: `Enter-PSSession -ComputerName DC01
hostname
Exit-PSSession
hostname`,
        illustrativeOutput: `DC01
CLIENT01`,
        explanation: `The first hostname ran on DC01 inside the session. The second ran on your own computer (CLIENT01) after you left. A good habit before running anything risky.`,
      },
    ],
    commonMistakes: [
      `Calling Exit-PSSession when you are not in a remote session. It does nothing useful; it does not close your local PowerShell window (use exit for that).`,
      `Using it in a script to "close the connection". Scripts should use Invoke-Command or Remove-PSSession; Exit-PSSession is for interactive use only.`,
      `Assuming a session made with New-PSSession is gone after you exit. It stays open until you run Remove-PSSession.`,
    ],
    troubleshooting: `If the prompt still shows [computername] after Exit-PSSession, you may be inside a nested session (you entered a session from inside another one). Run Exit-PSSession again for each level. If the window is frozen because the remote side stopped responding, press Ctrl+C or close the window; the remote process times out by itself.`,
    relatedCommands: ['Enter-PSSession', 'Invoke-Command', 'Test-WSMan', 'Get-Credential'],
    relatedLessonPath: '/learn/chapter-11/winrm-and-remoting',
    isEssentialPocketknife: false,
  },
  {
    name: 'New-ADUser',
    verb: 'New',
    noun: 'ADUser',
    module: 'ActiveDirectory',
    purpose: `Create a new user account in Active Directory.`,
    syntax: `New-ADUser [-Name] <String> [-SamAccountName <String>] [-UserPrincipalName <String>] [-GivenName <String>] [-Surname <String>] [-Path <String>] [-AccountPassword <SecureString>] [-Enabled <Boolean>] [-ChangePasswordAtLogon <Boolean>] [-Department <String>] [-Title <String>] [-PassThru] [-WhatIf] [-Confirm]`,
    description: `Creates a user object in the domain. A new account is created DISABLED unless you pass -Enabled $true, and an account cannot be enabled while no password is set or the password does not meet the domain password policy. The password must be given as a SecureString (use Read-Host -AsSecureString or ConvertTo-SecureString), never as plain text. Use -Path to choose the Organizational Unit (OU) as a DistinguishedName; if you leave it out the user lands in the default Users container. LAB ONLY: run every example against a practice domain such as corp.example.com, and keep -WhatIf until you are happy.`,
    parameters: [
      { name: '-Name', type: 'String', required: true, position: 0, pipelineInput: 'False', description: `The common name of the object (the CN). This is the display name you see in AD Users and Computers, for example Ada Lovelace.` },
      { name: '-SamAccountName', type: 'String', required: false, pipelineInput: 'False', description: `The pre-Windows 2000 sign-in name (up to 20 characters), for example alovelace. If you omit it, the cmdlet may fall back to a name based on -Name.` },
      { name: '-UserPrincipalName', type: 'String', required: false, pipelineInput: 'False', description: `The modern sign-in name that looks like an email address, for example alovelace@corp.example.com.` },
      { name: '-Path', type: 'String', required: false, pipelineInput: 'False', description: `The DistinguishedName of the OU to create the user in, for example OU=Staff,DC=corp,DC=example,DC=com.` },
      { name: '-AccountPassword', type: 'SecureString', required: false, pipelineInput: 'False', description: `The starting password as a SecureString. Required if you want to enable the account.` },
      { name: '-Enabled', type: 'Boolean', required: false, pipelineInput: 'False', description: `Use $true to enable the account. The default for new accounts is disabled.` },
      { name: '-ChangePasswordAtLogon', type: 'Boolean', required: false, pipelineInput: 'False', description: `$true forces the user to choose a new password the first time they sign in.` },
      { name: '-PassThru', type: 'SwitchParameter', required: false, pipelineInput: 'False', description: `Return the new user object. By default New-ADUser prints nothing on success.` },
    ],
    practicalExamples: [
      {
        title: `Create an Enabled User (Lab Only, Preview with -WhatIf)`,
        description: `Prompt for a starting password securely and create a staff account.`,
        code: `$pw = Read-Host -Prompt 'Initial password (lab only)' -AsSecureString
New-ADUser -Name 'Ada Lovelace' -GivenName 'Ada' -Surname 'Lovelace' -SamAccountName 'alovelace' -UserPrincipalName 'alovelace@corp.example.com' -Path 'OU=Staff,DC=corp,DC=example,DC=com' -AccountPassword $pw -Enabled $true -ChangePasswordAtLogon $true -WhatIf`,
        illustrativeOutput: `What if: Performing the operation "New" on target "CN=Ada Lovelace,OU=Staff,DC=corp,DC=example,DC=com".`,
        explanation: `-WhatIf only prints what would happen. Remove it when you are sure. The password is held as a SecureString and never appears on screen. If the password breaks the policy, the real run will fail with a "password does not meet the length, complexity" error.`,
      },
      {
        title: `Create Several Users from a CSV File (Lab Only)`,
        description: `Read a list of new hires and create each account with splatting for readability.`,
        code: `$pw = Read-Host -Prompt 'Shared initial password (lab only)' -AsSecureString
Import-Csv -Path 'C:\\Lab\\newhires.csv' | ForEach-Object {
    $params = @{
        Name                  = "$($_.GivenName) $($_.Surname)"
        GivenName             = $_.GivenName
        Surname               = $_.Surname
        SamAccountName        = $_.SamAccountName
        UserPrincipalName     = "$($_.SamAccountName)@corp.example.com"
        Path                  = 'OU=Staff,DC=corp,DC=example,DC=com'
        AccountPassword       = $pw
        Enabled               = $true
        ChangePasswordAtLogon = $true
    }
    New-ADUser @params -WhatIf
}`,
        illustrativeOutput: `What if: Performing the operation "New" on target "CN=Grace Hopper,OU=Staff,DC=corp,DC=example,DC=com".
What if: Performing the operation "New" on target "CN=Alan Turing,OU=Staff,DC=corp,DC=example,DC=com".`,
        explanation: `The CSV should have the columns GivenName, Surname and SamAccountName. A hashtable plus @params avoids a huge one-line command. In a real environment give each user a unique password.`,
      },
      {
        title: `Why Is My New Account Disabled?`,
        description: `Create an account without a password and see the default state.`,
        code: `New-ADUser -Name 'Test Account' -SamAccountName 'ttest' -Path 'OU=Staff,DC=corp,DC=example,DC=com' -PassThru -WhatIf
# After a real (lab) run you can check the state:
Get-ADUser -Identity 'ttest' | Select-Object Name, Enabled`,
        illustrativeOutput: `Name         Enabled
----         -------
Test Account   False`,
        explanation: `With no password and no -Enabled $true the account exists but cannot sign in. To fix it you would set a password with Set-ADAccountPassword and then run Enable-ADAccount.`,
      },
    ],
    commonMistakes: [
      `Passing the password as a normal string. -AccountPassword needs a SecureString: use Read-Host -AsSecureString or Get-Credential.`,
      `Forgetting -Enabled $true and being surprised that the new user cannot sign in. New accounts are disabled by default.`,
      `Writing the -Path as an OU name (Staff) or a DNS name (corp.example.com/Staff). It must be a DistinguishedName such as OU=Staff,DC=corp,DC=example,DC=com.`,
    ],
    troubleshooting: `"Unable to contact the server" means Active Directory Web Services (port 9389) cannot be reached on a domain controller: check DNS, run Test-NetConnection DC01 -Port 9389, or add -Server DC01. "The specified account already exists" means that SamAccountName or UPN is already in use (names must be unique across the domain). "The server is unwilling to process the request" while creating with -Enabled $true is almost always a password that does not meet policy or a missing password. "Insufficient access rights" means your account lacks permission to create users in that OU. If the command is not recognised at all, the ActiveDirectory module (RSAT) is not installed on this computer.`,
    relatedCommands: ['Get-ADUser', 'Set-ADUser', 'Remove-ADUser', 'Import-Csv'],
    relatedLessonPath: '/learn/chapter-12/ad-users-groups-and-ous',
    isEssentialPocketknife: false,
  },
  {
    name: 'Set-ADUser',
    verb: 'Set',
    noun: 'ADUser',
    module: 'ActiveDirectory',
    purpose: `Change attributes of an existing Active Directory user.`,
    syntax: `Set-ADUser [-Identity] <ADUser> [-Department <String>] [-Title <String>] [-Office <String>] [-Description <String>] [-EmailAddress <String>] [-Enabled <Boolean>] [-Add <Hashtable>] [-Replace <Hashtable>] [-Remove <Hashtable>] [-Clear <String[]>] [-PassThru] [-WhatIf] [-Confirm]`,
    description: `Modifies one or more attributes on an existing user. Common attributes have their own parameters (-Department, -Title, -Office and so on). For any attribute that does not have a parameter, use -Replace @{attributeName='value'} to overwrite it, -Add to add a value to a multi-valued attribute, -Remove to take one value out, or -Clear to empty the attribute. The user is found with -Identity, which you can supply directly or pipe from Get-ADUser. LAB ONLY: preview with -WhatIf first.`,
    parameters: [
      { name: '-Identity', type: 'ADUser', required: true, position: 0, pipelineInput: 'ByValue', description: `The user to change: SamAccountName, DistinguishedName, SID or GUID. You can pipe a user object from Get-ADUser.` },
      { name: '-Department', type: 'String', required: false, pipelineInput: 'False', description: `Sets the Department attribute. Similar named parameters exist for -Title, -Office, -Description, -EmailAddress and -Manager.` },
      { name: '-Replace', type: 'Hashtable', required: false, pipelineInput: 'False', description: `Overwrites attributes by LDAP name, for example @{telephoneNumber='+32 555 0100'}. Use it for attributes with no dedicated parameter.` },
      { name: '-Clear', type: 'String[]', required: false, pipelineInput: 'False', description: `Empties the listed attributes, for example -Clear telephoneNumber.` },
      { name: '-Add / -Remove', type: 'Hashtable', required: false, pipelineInput: 'False', description: `Add or remove a single value in a multi-valued attribute such as proxyAddresses without touching the other values.` },
      { name: '-Enabled', type: 'Boolean', required: false, pipelineInput: 'False', description: `$true enables the account, $false disables it. (Enable-ADAccount and Disable-ADAccount do the same with clearer names.)` },
      { name: '-PassThru', type: 'SwitchParameter', required: false, pipelineInput: 'False', description: `Return the updated user object. By default the command prints nothing.` },
    ],
    practicalExamples: [
      {
        title: `Update a User's Department and Title (Lab Only)`,
        description: `Change two attributes, previewing first.`,
        code: `Set-ADUser -Identity 'alovelace' -Department 'Engineering' -Title 'Systems Engineer' -WhatIf`,
        illustrativeOutput: `What if: Performing the operation "Set" on target "CN=Ada Lovelace,OU=Staff,DC=corp,DC=example,DC=com".`,
        explanation: `Remove -WhatIf to make the change. Verify it afterwards with Get-ADUser alovelace -Properties Department, Title.`,
      },
      {
        title: `Set an Attribute That Has No Parameter`,
        description: `Use -Replace with a hashtable keyed by the LDAP attribute name.`,
        code: `Set-ADUser -Identity 'alovelace' -Replace @{telephoneNumber = '+32 555 0100'; physicalDeliveryOfficeName = 'Brussels'} -WhatIf
Set-ADUser -Identity 'alovelace' -Clear 'telephoneNumber' -WhatIf`,
        illustrativeOutput: `What if: Performing the operation "Set" on target "CN=Ada Lovelace,OU=Staff,DC=corp,DC=example,DC=com".
What if: Performing the operation "Set" on target "CN=Ada Lovelace,OU=Staff,DC=corp,DC=example,DC=com".`,
        explanation: `-Replace uses LDAP names, which are not always the same as the property names you see in Get-ADUser (for example Office is physicalDeliveryOfficeName). -Clear removes the value completely.`,
      },
      {
        title: `Bulk Update Users Found with Get-ADUser`,
        description: `Find users with a server-side filter, then pipe them into Set-ADUser.`,
        code: `Get-ADUser -Filter 'Department -eq "Sales"' -SearchBase 'OU=Staff,DC=corp,DC=example,DC=com' |
    Set-ADUser -Office 'Brussels' -WhatIf`,
        illustrativeOutput: `What if: Performing the operation "Set" on target "CN=Grace Hopper,OU=Staff,DC=corp,DC=example,DC=com".
What if: Performing the operation "Set" on target "CN=Alan Turing,OU=Staff,DC=corp,DC=example,DC=com".`,
        explanation: `The single-quoted filter is an AD filter string evaluated by the domain controller. Always read the -WhatIf list to check that you matched only the users you expect before removing -WhatIf.`,
      },
    ],
    commonMistakes: [
      `Using -Replace with a plain value instead of a hashtable. It must look like @{attribute='value'}.`,
      `Forgetting that Set-ADUser prints nothing on success and thinking nothing happened. Add -PassThru or check with Get-ADUser -Properties.`,
      `Piping Get-ADUser results that only include the 10 default properties and expecting to change or read others. The change itself works, but reading extra attributes still needs -Properties on Get-ADUser.`,
    ],
    troubleshooting: `"Cannot find an object with identity" means the -Identity value does not match any user: check spelling and that you used SamAccountName, not the display name. "A value for the attribute was not in the acceptable range of values" means the value has the wrong format for that attribute (for example a bad date or a number too long). "Insufficient access rights" means your account lacks delegated permission to edit that user. If a change seems not to appear on another domain controller, wait for replication or query the same one with -Server DC01.`,
    relatedCommands: ['Get-ADUser', 'New-ADUser', 'Remove-ADUser', 'Disable-ADAccount'],
    relatedLessonPath: '/learn/chapter-12/ad-users-groups-and-ous',
    isEssentialPocketknife: false,
  },
  {
    name: 'Remove-ADUser',
    verb: 'Remove',
    noun: 'ADUser',
    module: 'ActiveDirectory',
    purpose: `Delete a user account from Active Directory.`,
    syntax: `Remove-ADUser [-Identity] <ADUser> [-Server <String>] [-Credential <PSCredential>] [-WhatIf] [-Confirm]`,
    description: `DESTRUCTIVE. Removes the user object from the directory. Because the user's SID is deleted, group memberships, permissions on files and the mailbox link are lost; creating another account with the same name later does NOT restore them. If the AD Recycle Bin is enabled in your forest, a deleted account can be restored with Restore-ADObject, but do not count on it. The cmdlet asks for confirmation by default (high impact). LAB ONLY: always run it with -WhatIf first, and consider Disable-ADAccount instead when you are not sure the user is gone for good.`,
    parameters: [
      { name: '-Identity', type: 'ADUser', required: true, position: 0, pipelineInput: 'ByValue', description: `The user to delete: SamAccountName, DistinguishedName, SID or GUID. You can pipe in user objects from Get-ADUser.` },
      { name: '-WhatIf', type: 'SwitchParameter', required: false, pipelineInput: 'False', description: `Show which account would be deleted without deleting anything.` },
      { name: '-Confirm', type: 'SwitchParameter', required: false, pipelineInput: 'False', description: `Ask Yes/No before each delete. This cmdlet already prompts by default; -Confirm:$false suppresses the prompt and should be used only after a clean -WhatIf review.` },
      { name: '-Server', type: 'String', required: false, pipelineInput: 'False', description: `The domain controller to talk to, for example DC01. Useful when you want to be sure of where the change is made.` },
      { name: '-Credential', type: 'PSCredential', required: false, pipelineInput: 'False', description: `Run the delete as another account with sufficient rights.` },
    ],
    practicalExamples: [
      {
        title: `Preview the Deletion of One Account (Lab Only)`,
        description: `Check what would be deleted without touching anything.`,
        code: `Remove-ADUser -Identity 'tempuser' -WhatIf`,
        illustrativeOutput: `What if: Performing the operation "Remove" on target "CN=Temp User,OU=Temp,DC=corp,DC=example,DC=com".`,
        explanation: `The target line shows the full DistinguishedName. Confirm it is exactly the object you intended before you ever remove -WhatIf.`,
      },
      {
        title: `Look Before You Delete`,
        description: `Display the account details first, then preview the removal.`,
        code: `Get-ADUser -Identity 'tempuser' -Properties Description, WhenCreated, LastLogonDate |
    Select-Object Name, SamAccountName, Description, WhenCreated, LastLogonDate
Remove-ADUser -Identity 'tempuser' -WhatIf`,
        illustrativeOutput: `Name      SamAccountName Description         WhenCreated         LastLogonDate
----      -------------- -----------         -----------         -------------
Temp User tempuser       Lab test account    10/2/2026 9:15:00 AM
What if: Performing the operation "Remove" on target "CN=Temp User,OU=Temp,DC=corp,DC=example,DC=com".`,
        explanation: `A quick look at the description, creation date and last logon tells you whether this is really a throw-away account.`,
      },
      {
        title: `Preview Removing All Users in a Temporary OU`,
        description: `Pipe a filtered list into Remove-ADUser, still in preview mode.`,
        code: `Get-ADUser -Filter * -SearchBase 'OU=Temp,DC=corp,DC=example,DC=com' |
    Remove-ADUser -WhatIf`,
        illustrativeOutput: `What if: Performing the operation "Remove" on target "CN=Temp User,OU=Temp,DC=corp,DC=example,DC=com".
What if: Performing the operation "Remove" on target "CN=Test Account,OU=Temp,DC=corp,DC=example,DC=com".`,
        explanation: `With -Filter * and a narrow -SearchBase, every user in that OU is listed. Count them in the preview; only add -Confirm:$false after you have read and approved the whole list.`,
      },
    ],
    commonMistakes: [
      `Running without -WhatIf on a pipeline from Get-ADUser -Filter *. A wrong or missing -SearchBase can remove the whole domain's users.`,
      `Using -Confirm:$false by habit. That turns off your last safety prompt.`,
      `Deleting when disabling would do. Disable-ADAccount is reversible; a delete loses the SID and its permissions.`,
    ],
    troubleshooting: `"The operation could not be performed because the object is protected from accidental deletion" (or an Access Denied) means the object has ProtectedFromAccidentalDeletion set; unprotect it first with Set-ADObject -Identity <DN> -ProtectedFromAccidentalDeletion $false, then retry. "Cannot find an object with identity" means a wrong name or the object is already gone. "Insufficient access rights" means your account is not allowed to delete in that OU. If you removed an account by mistake, check whether the AD Recycle Bin is enabled: Get-ADOptionalFeature -Filter 'Name -eq "Recycle Bin Feature"'.`,
    relatedCommands: ['Get-ADUser', 'Disable-ADAccount', 'Set-ADUser', 'New-ADUser'],
    relatedLessonPath: '/learn/chapter-12/ad-users-groups-and-ous',
    isEssentialPocketknife: false,
  },
  {
    name: 'New-ADGroup',
    verb: 'New',
    noun: 'ADGroup',
    module: 'ActiveDirectory',
    purpose: `Create a new security or distribution group in Active Directory.`,
    syntax: `New-ADGroup [-Name] <String> [-GroupScope] <ADGroupScope> [-GroupCategory <ADGroupCategory>] [-Path <String>] [-SamAccountName <String>] [-DisplayName <String>] [-Description <String>] [-ManagedBy <ADPrincipal>] [-PassThru] [-WhatIf] [-Confirm]`,
    description: `Creates a group object. You must choose a scope: Global (collects users from one domain, the usual place to put people), DomainLocal (grants access to a resource in one domain, the usual place to assign permissions) or Universal (can hold members from any domain in the forest). The category is Security by default; a Security group can be used in permissions, a Distribution group is only for email lists. LAB ONLY: use -WhatIf first.`,
    parameters: [
      { name: '-Name', type: 'String', required: true, position: 0, pipelineInput: 'False', description: `The name of the group, for example SG-Helpdesk.` },
      { name: '-GroupScope', type: 'ADGroupScope', required: true, position: 1, pipelineInput: 'False', description: `DomainLocal, Global or Universal. Decides where the group can be used and who can be a member.` },
      { name: '-GroupCategory', type: 'ADGroupCategory', required: false, pipelineInput: 'False', description: `Security (default, can be used in permissions) or Distribution (email only).` },
      { name: '-Path', type: 'String', required: false, pipelineInput: 'False', description: `The DistinguishedName of the OU where the group will live, for example OU=Groups,DC=corp,DC=example,DC=com.` },
      { name: '-SamAccountName', type: 'String', required: false, pipelineInput: 'False', description: `The pre-Windows 2000 name of the group. Defaults to the -Name value if omitted.` },
      { name: '-Description', type: 'String', required: false, pipelineInput: 'False', description: `A short note explaining what the group is for. Future you will be grateful.` },
      { name: '-ManagedBy', type: 'ADPrincipal', required: false, pipelineInput: 'False', description: `The user or group that owns the group, shown in the Managed By tab.` },
    ],
    practicalExamples: [
      {
        title: `Create a Global Security Group (Lab Only)`,
        description: `The usual first step: a group that holds people from one department.`,
        code: `New-ADGroup -Name 'SG-Helpdesk' -GroupScope Global -GroupCategory Security -Path 'OU=Groups,DC=corp,DC=example,DC=com' -Description 'Helpdesk staff' -WhatIf`,
        illustrativeOutput: `What if: Performing the operation "New" on target "CN=SG-Helpdesk,OU=Groups,DC=corp,DC=example,DC=com".`,
        explanation: `Remove -WhatIf to create it for real. Add people afterwards with Add-ADGroupMember.`,
      },
      {
        title: `Create a Domain Local Group for a Resource`,
        description: `A group used to grant permission on a share, following the common accounts-global, permissions-domain-local pattern.`,
        code: `New-ADGroup -Name 'DL-Share-Finance-RW' -GroupScope DomainLocal -Path 'OU=Groups,DC=corp,DC=example,DC=com' -Description 'Read/write on the Finance share' -PassThru -WhatIf`,
        illustrativeOutput: `What if: Performing the operation "New" on target "CN=DL-Share-Finance-RW,OU=Groups,DC=corp,DC=example,DC=com".`,
        explanation: `You would put Global groups (for example SG-Finance) inside this DomainLocal group and then grant the DomainLocal group permissions on the folder. Category defaults to Security.`,
      },
      {
        title: `Create a Distribution List`,
        description: `A group for email only, which cannot be used for permissions.`,
        code: `New-ADGroup -Name 'DG-AllStaff' -GroupScope Universal -GroupCategory Distribution -Path 'OU=Groups,DC=corp,DC=example,DC=com' -WhatIf`,
        illustrativeOutput: `What if: Performing the operation "New" on target "CN=DG-AllStaff,OU=Groups,DC=corp,DC=example,DC=com".`,
        explanation: `Distribution groups are useful for mail systems like Exchange. A Distribution group cannot be placed on an access control list.`,
      },
    ],
    commonMistakes: [
      `Omitting -GroupScope. It is required and the command stops with a parameter error.`,
      `Creating a Distribution group and then trying to grant file permissions to it. Permissions need a Security group.`,
      `Putting everything in one giant Global group instead of planning scopes. Use Global for people and DomainLocal for permissions.`,
    ],
    troubleshooting: `"The specified group already exists" means the name (or SamAccountName) is taken, check with Get-ADGroup -Filter 'Name -like "SG-*"'. "Directory object not found" for the -Path means the OU path is wrong or the OU does not exist yet; verify with Get-ADOrganizationalUnit -Filter 'Name -eq "Groups"'. "Insufficient access rights" means you cannot create objects in that OU. Remember that a Global group can only contain members from its own domain, and a Universal group is replicated to the global catalog, so avoid constantly changing its membership.`,
    relatedCommands: ['Add-ADGroupMember', 'Get-ADGroupMember', 'New-ADUser', 'Get-ADUser'],
    relatedLessonPath: '/learn/chapter-12/ad-users-groups-and-ous',
    isEssentialPocketknife: false,
  },
  {
    name: 'Get-ADGroupMember',
    verb: 'Get',
    noun: 'ADGroupMember',
    module: 'ActiveDirectory',
    purpose: `List the members of an Active Directory group.`,
    syntax: `Get-ADGroupMember [-Identity] <ADGroup> [-Recursive] [-Server <String>] [-Credential <PSCredential>]`,
    description: `Returns the direct members of a group as light objects (users, computers and nested groups) with just a few properties such as name, SamAccountName, objectClass and distinguishedName. Add -Recursive to also expand nested groups and return the final users and computers; nested groups themselves are not returned in recursive mode. To see more details (department, email, enabled state), pipe the members into Get-ADUser -Properties.`,
    parameters: [
      { name: '-Identity', type: 'ADGroup', required: true, position: 0, pipelineInput: 'ByValue', description: `The group to read: name, SamAccountName, DistinguishedName, SID or GUID. You can pipe a group object in from Get-ADGroup.` },
      { name: '-Recursive', type: 'SwitchParameter', required: false, pipelineInput: 'False', description: `Also follow nested groups and return the real users and computers inside them.` },
      { name: '-Server', type: 'String', required: false, pipelineInput: 'False', description: `The domain controller to query, for example DC01.` },
      { name: '-Credential', type: 'PSCredential', required: false, pipelineInput: 'False', description: `Query with another account. Create it with Get-Credential.` },
    ],
    practicalExamples: [
      {
        title: `List the Direct Members of a Group`,
        description: `See who is in a group and what kind of objects they are.`,
        code: `Get-ADGroupMember -Identity 'SG-Helpdesk' | Select-Object Name, SamAccountName, objectClass`,
        illustrativeOutput: `Name         SamAccountName objectClass
----         -------------- -----------
Ada Lovelace alovelace      user
Grace Hopper ghopper        user
SG-Tier1     SG-Tier1       group`,
        explanation: `SG-Tier1 is a nested group, so its members are not shown here. objectClass tells you whether each entry is a user, group or computer.`,
      },
      {
        title: `Expand Nested Groups with -Recursive`,
        description: `Get every real user who ends up in the group, however deeply nested.`,
        code: `Get-ADGroupMember -Identity 'Domain Admins' -Recursive |
    Where-Object objectClass -eq 'user' |
    Get-ADUser -Properties Enabled, LastLogonDate |
    Select-Object Name, SamAccountName, Enabled, LastLogonDate`,
        illustrativeOutput: `Name          SamAccountName Enabled LastLogonDate
----          -------------- ------- -------------
Administrator Administrator     True 11/3/2026 8:02:00 AM
Ada Lovelace  alovelace         True 11/2/2026 4:48:00 PM`,
        explanation: `Auditing privileged groups is a classic use. -Recursive flattens the nesting and Get-ADUser adds the extra properties the member objects do not have.`,
      },
      {
        title: `Which Computers Are in a Group?`,
        description: `Groups can contain computer accounts too; filter by objectClass.`,
        code: `Get-ADGroupMember -Identity 'SG-Patch-Wave1' | Where-Object objectClass -eq 'computer' | Select-Object Name`,
        illustrativeOutput: `Name
----
SRV-CORE01
CLIENT01`,
        explanation: `Computers are returned with their name (their SamAccountName ends with a dollar sign). Useful for building a list of machines to run Invoke-Command against.`,
      },
    ],
    commonMistakes: [
      `Expecting department, email or enabled state in the output. Members are lightweight; pipe them to Get-ADUser -Properties for details.`,
      `Forgetting -Recursive and missing everyone who is only a member through a nested group.`,
      `Assuming nested groups still appear with -Recursive. In recursive mode you get the final users and computers, not the intermediate groups.`,
    ],
    troubleshooting: `"The size limit for this request was exceeded" or a "maximum number of results" warning happens on very large groups because Active Directory Web Services limits the answer (5000 by default). Query the group's member attribute through Get-ADGroup -Properties Member in chunks or use a different technique for huge groups. A "Cannot find an object with identity" error means a wrong group name. If members from another domain or trusted forest appear as a SID or error, the domain controller cannot resolve them; try -Server with a domain controller in that domain.`,
    relatedCommands: ['Add-ADGroupMember', 'New-ADGroup', 'Get-ADUser', 'Get-ADComputer'],
    relatedLessonPath: '/learn/chapter-12/ad-users-groups-and-ous',
    isEssentialPocketknife: false,
  },
  {
    name: 'Add-ADGroupMember',
    verb: 'Add',
    noun: 'ADGroupMember',
    module: 'ActiveDirectory',
    purpose: `Add users, computers or other groups as members of an Active Directory group.`,
    syntax: `Add-ADGroupMember [-Identity] <ADGroup> [-Members] <ADPrincipal[]> [-PassThru] [-Server <String>] [-Credential <PSCredential>] [-WhatIf] [-Confirm]`,
    description: `Adds one or more members to a group. Members can be given by SamAccountName, DistinguishedName, SID or GUID, or as objects returned by Get-ADUser, Get-ADComputer or Get-ADGroup. Adding someone who is already a member is not harmful: PowerShell raises an error for that member but keeps the group as is. The command prints nothing on success. LAB ONLY: preview with -WhatIf, especially for privileged groups.`,
    parameters: [
      { name: '-Identity', type: 'ADGroup', required: true, position: 0, pipelineInput: 'ByValue', description: `The group that receives the new members, by name, SamAccountName, DistinguishedName, SID or GUID.` },
      { name: '-Members', type: 'ADPrincipal[]', required: true, position: 1, pipelineInput: 'False', description: `One or more users, computers or groups to add. Give a comma separated list or a variable that holds objects.` },
      { name: '-PassThru', type: 'SwitchParameter', required: false, pipelineInput: 'False', description: `Return the group object after the change. Without it you get no output.` },
      { name: '-Server', type: 'String', required: false, pipelineInput: 'False', description: `The domain controller to make the change on.` },
      { name: '-WhatIf', type: 'SwitchParameter', required: false, pipelineInput: 'False', description: `Show what would be added without changing the group.` },
    ],
    practicalExamples: [
      {
        title: `Add Two Users to a Group (Lab Only)`,
        description: `Preview adding people by their sign-in names.`,
        code: `Add-ADGroupMember -Identity 'SG-Helpdesk' -Members 'alovelace', 'ghopper' -WhatIf`,
        illustrativeOutput: `What if: Performing the operation "Set" on target "CN=SG-Helpdesk,OU=Groups,DC=corp,DC=example,DC=com".`,
        explanation: `The target is the group because adding members modifies the group's member list. Remove -WhatIf when you are ready, then verify with Get-ADGroupMember.`,
      },
      {
        title: `Add Everyone from a Department`,
        description: `Find users with a filter and add them in one step.`,
        code: `$users = Get-ADUser -Filter 'Department -eq "Helpdesk"' -SearchBase 'OU=Staff,DC=corp,DC=example,DC=com'
$users | Select-Object -ExpandProperty SamAccountName
Add-ADGroupMember -Identity 'SG-Helpdesk' -Members $users -WhatIf`,
        illustrativeOutput: `alovelace
ghopper
What if: Performing the operation "Set" on target "CN=SG-Helpdesk,OU=Groups,DC=corp,DC=example,DC=com".`,
        explanation: `Printing the names first lets you check the list before you change anything. The -Members parameter accepts the user objects directly.`,
      },
      {
        title: `Add a Computer Account to a Group`,
        description: `Computers are added by their computer account name, which ends with a dollar sign.`,
        code: `Add-ADGroupMember -Identity 'SG-Patch-Wave1' -Members (Get-ADComputer -Identity 'SRV-CORE01') -WhatIf`,
        illustrativeOutput: `What if: Performing the operation "Set" on target "CN=SG-Patch-Wave1,OU=Groups,DC=corp,DC=example,DC=com".`,
        explanation: `Passing the object from Get-ADComputer avoids having to type SRV-CORE01$. If you pass a string you must include the dollar sign yourself, in single quotes ('SRV-CORE01$').`,
      },
    ],
    commonMistakes: [
      `Typing a computer name without the trailing dollar sign when passing a string. The computer's SamAccountName is SRV-CORE01$.`,
      `Using double quotes around a name that ends with $, which makes PowerShell try to expand a variable. Use single quotes.`,
      `Adding people to powerful groups such as Domain Admins without a -WhatIf and a change ticket.`,
    ],
    troubleshooting: `"The specified account name is already a member of the group" is harmless: that member was already there. "Cannot find an object with identity" means a name in -Members does not exist (check each name separately with Get-ADUser). "Insufficient access rights" means your account cannot modify that group; membership of privileged groups is often protected by AdminSDHolder. A Global group cannot take members from another domain, which shows as "A member could not be added to or removed from the local group because the member does not exist". Changes may take a moment to appear on other domain controllers because of replication.`,
    relatedCommands: ['Get-ADGroupMember', 'New-ADGroup', 'Get-ADUser', 'Get-ADComputer'],
    relatedLessonPath: '/learn/chapter-12/ad-users-groups-and-ous',
    isEssentialPocketknife: false,
  },
  {
    name: 'Disable-ADAccount',
    verb: 'Disable',
    noun: 'ADAccount',
    module: 'ActiveDirectory',
    purpose: `Disable a user or computer account so it can no longer sign in, without deleting it.`,
    syntax: `Disable-ADAccount [-Identity] <ADAccount> [-Server <String>] [-Credential <PSCredential>] [-WhatIf] [-Confirm]`,
    description: `Turns off the account by setting the "disabled" flag on it. Nothing is deleted: the SID, group memberships and attributes all stay, and Enable-ADAccount turns the account back on. This is the safe first step when someone leaves the company or a computer is retired. A disabled user cannot sign in with a new session, but existing sessions and issued Kerberos tickets may keep working until they expire. LAB ONLY: preview with -WhatIf.`,
    parameters: [
      { name: '-Identity', type: 'ADAccount', required: true, position: 0, pipelineInput: 'ByValue', description: `The account to disable: user, computer or service account, by SamAccountName, DistinguishedName, SID or GUID. Objects piped from Get-ADUser or Get-ADComputer work too.` },
      { name: '-Server', type: 'String', required: false, pipelineInput: 'False', description: `The domain controller to make the change on, for example DC01.` },
      { name: '-Credential', type: 'PSCredential', required: false, pipelineInput: 'False', description: `Make the change as another account.` },
      { name: '-WhatIf', type: 'SwitchParameter', required: false, pipelineInput: 'False', description: `Show what would be disabled without disabling anything.` },
      { name: '-Confirm', type: 'SwitchParameter', required: false, pipelineInput: 'False', description: `Ask for confirmation before disabling.` },
    ],
    practicalExamples: [
      {
        title: `Disable One User (Lab Only)`,
        description: `The standard first step when someone leaves.`,
        code: `Disable-ADAccount -Identity 'tempuser' -WhatIf`,
        illustrativeOutput: `What if: Performing the operation "Set" on target "CN=Temp User,OU=Temp,DC=corp,DC=example,DC=com".`,
        explanation: `Remove -WhatIf to disable the account. Undo it any time with Enable-ADAccount -Identity tempuser.`,
      },
      {
        title: `Disable Users Who Have Not Signed In for 90 Days`,
        description: `Find inactive user accounts and preview disabling them.`,
        code: `Search-ADAccount -AccountInactive -UsersOnly -TimeSpan 90.00:00:00 -SearchBase 'OU=Staff,DC=corp,DC=example,DC=com' |
    Disable-ADAccount -WhatIf`,
        illustrativeOutput: `What if: Performing the operation "Set" on target "CN=Old Account,OU=Staff,DC=corp,DC=example,DC=com".`,
        explanation: `Search-ADAccount does the finding, Disable-ADAccount does the change. Read the whole -WhatIf list carefully: service accounts that never sign in interactively can show up here.`,
      },
      {
        title: `Disable a Retired Computer Account`,
        description: `Computer accounts can be disabled too; pipe the computer object in.`,
        code: `Get-ADComputer -Identity 'CLIENT01' | Disable-ADAccount -WhatIf`,
        illustrativeOutput: `What if: Performing the operation "Set" on target "CN=CLIENT01,OU=Workstations,DC=corp,DC=example,DC=com".`,
        explanation: `Piping the computer object avoids typing the dollar sign. A disabled computer account breaks the machine's trust with the domain, so only do this for retired machines.`,
      },
    ],
    commonMistakes: [
      `Thinking disabled means deleted. The account and its permissions still exist and can be re-enabled.`,
      `Expecting an immediate lock-out. Existing sessions and Kerberos tickets can keep working until they expire; also reset the password and end sessions if it is urgent.`,
      `Disabling accounts from a Search-ADAccount list without reading it first. Service accounts and rarely used admin accounts can appear in that list.`,
    ],
    troubleshooting: `"Cannot find an object with identity" means the name is wrong; use SamAccountName for users and name with a dollar sign for computers (or pipe the object). "Insufficient access rights" means you lack permission on that account, which is typical for protected admin accounts. If an account re-enables itself, another process (an identity management tool or script) is probably setting the flag back; check Get-ADUser -Properties Enabled, whenChanged. To undo a mistake use Enable-ADAccount -Identity <name>.`,
    relatedCommands: ['Set-ADUser', 'Remove-ADUser', 'Get-ADUser', 'Get-ADComputer'],
    relatedLessonPath: '/learn/chapter-12/ad-users-groups-and-ous',
    isEssentialPocketknife: false,
  },
  {
    name: 'Get-ADComputer',
    verb: 'Get',
    noun: 'ADComputer',
    module: 'ActiveDirectory',
    purpose: `Query computer accounts in Active Directory.`,
    syntax: `Get-ADComputer -Filter <String> [-SearchBase <String>] [-SearchScope <ADSearchScope>] [-Properties <String[]>] [-ResultSetSize <Int32>] [-Server <String>]\nGet-ADComputer [-Identity] <ADComputer> [-Properties <String[]>]`,
    description: `Reads computer objects (workstations and servers) from the directory. By default you get only a few properties: DistinguishedName, DNSHostName, Enabled, Name, ObjectClass, ObjectGUID, SamAccountName, SID and UserPrincipalName. Ask for more with -Properties, for example OperatingSystem, LastLogonDate, IPv4Address or PasswordLastSet. Use -Filter so the domain controller does the filtering. The -Filter value is an AD filter string (single-quoted, for example 'Name -like "SRV*"'), not a PowerShell script block.`,
    parameters: [
      { name: '-Identity', type: 'ADComputer', required: true, position: 0, pipelineInput: 'ByValue', description: `One computer by name, SamAccountName (with the trailing $), DistinguishedName, SID or GUID.` },
      { name: '-Filter', type: 'String', required: true, pipelineInput: 'False', description: `An AD filter string evaluated on the domain controller. Use -Filter * to return everything (and be careful on big domains).` },
      { name: '-Properties', type: 'String[]', required: false, pipelineInput: 'False', description: `Extra attributes to return, for example OperatingSystem and LastLogonDate. Avoid -Properties * on large result sets.` },
      { name: '-SearchBase', type: 'String', required: false, pipelineInput: 'False', description: `The DistinguishedName of the OU to start searching from, for example OU=Servers,DC=corp,DC=example,DC=com.` },
      { name: '-SearchScope', type: 'ADSearchScope', required: false, pipelineInput: 'False', description: `Base, OneLevel or Subtree (the default). OneLevel looks only at the direct children of -SearchBase.` },
      { name: '-ResultSetSize', type: 'Int32', required: false, pipelineInput: 'False', description: `Limit how many objects are returned, which is a nice safety net while testing.` },
    ],
    practicalExamples: [
      {
        title: `Inspect One Computer`,
        description: `Look up a server and fetch its operating system and last sign-in.`,
        code: `Get-ADComputer -Identity 'SRV-CORE01' -Properties OperatingSystem, LastLogonDate, IPv4Address |
    Select-Object Name, OperatingSystem, IPv4Address, LastLogonDate`,
        illustrativeOutput: `Name       OperatingSystem                 IPv4Address   LastLogonDate
----       ---------------                 -----------   -------------
SRV-CORE01 Windows Server 2022 Standard    192.168.153.20 11/3/2026 7:55:00 AM`,
        explanation: `OperatingSystem, LastLogonDate and IPv4Address are not in the default set, so you must request them with -Properties.`,
      },
      {
        title: `List All Servers in an OU`,
        description: `Filter on the operating system name and limit the search to one OU.`,
        code: `Get-ADComputer -Filter 'OperatingSystem -like "*Server*"' -SearchBase 'OU=Servers,DC=corp,DC=example,DC=com' -Properties OperatingSystem |
    Select-Object Name, OperatingSystem | Sort-Object Name`,
        illustrativeOutput: `Name       OperatingSystem
----       ---------------
DC01       Windows Server 2022 Standard
SRV-CORE01 Windows Server 2022 Standard`,
        explanation: `The filter string uses double quotes inside single quotes. Because the filter runs on the domain controller, only matching computers travel over the network.`,
      },
      {
        title: `Find Stale Computer Accounts`,
        description: `Report computers that have not contacted the domain for 90 days (read-only).`,
        code: `$cutoff = (Get-Date).AddDays(-90)
Get-ADComputer -Filter 'LastLogonDate -lt $cutoff' -Properties LastLogonDate |
    Select-Object Name, LastLogonDate | Sort-Object LastLogonDate`,
        illustrativeOutput: `Name     LastLogonDate
----     -------------
OLDPC07  7/12/2026 10:21:00 AM
LABVM03  7/30/2026 2:04:00 PM`,
        explanation: `LastLogonDate is replicated only every 9 to 14 days, so treat it as an approximate value. Review the list before disabling anything with Disable-ADAccount.`,
      },
    ],
    commonMistakes: [
      `Using -Identity with a wildcard such as 'SRV*'. -Identity takes one exact object; use -Filter 'Name -like "SRV*"' instead.`,
      `Forgetting -Properties OperatingSystem and getting an empty column.`,
      `Running Get-ADComputer -Filter * -Properties * on a large domain, which downloads every attribute of every computer.`,
    ],
    troubleshooting: `If the command is not recognised, the ActiveDirectory module is missing; on Windows 10/11 install the RSAT: Active Directory Domain Services Tools capability, on a server install the RSAT-AD-PowerShell feature. "Unable to contact the server" means ADWS (TCP 9389) on a domain controller is unreachable: check DNS and try -Server DC01. "Cannot find an object with identity" means a typo in the name; computer SamAccountNames end with a dollar sign. A "The search filter cannot be recognized" error means the -Filter string is malformed: keep it in single quotes and use AD operators such as -eq, -like and -lt.`,
    relatedCommands: ['Get-ADUser', 'Disable-ADAccount', 'Add-ADGroupMember', 'Rename-Computer'],
    relatedLessonPath: '/learn/chapter-12/ad-users-groups-and-ous',
    isEssentialPocketknife: false,
  },
  {
    name: 'Get-ADForest',
    verb: 'Get',
    noun: 'ADForest',
    module: 'ActiveDirectory',
    purpose: `Show information about the Active Directory forest: its domains, functional level, global catalogs and the forest-wide master roles.`,
    syntax: `Get-ADForest [[-Identity] <ADForest>] [-Server <String>] [-Credential <PSCredential>]\nGet-ADForest [-Current <ADCurrentForestType>] [-Server <String>] [-Credential <PSCredential>]`,
    description: `A forest is the top-level boundary of Active Directory: one or more domains that share a schema and global catalog. Get-ADForest returns one object that describes it, including Name, RootDomain, ForestMode (the functional level), Domains, GlobalCatalogs, Sites, and the two forest-wide FSMO role holders, SchemaMaster and DomainNamingMaster. It is read-only and safe to run. Use it with Get-ADDomain and Get-ADDomainController to understand an environment you are new to.`,
    parameters: [
      { name: '-Identity', type: 'ADForest', required: false, position: 0, pipelineInput: 'ByValue', description: `The forest to read, by its DNS name (for example corp.example.com). If you leave it out, the forest of the computer or user is used.` },
      { name: '-Current', type: 'ADCurrentForestType', required: false, pipelineInput: 'False', description: `LocalComputer or LoggedOnUser: which forest counts as "current" when you do not give an identity.` },
      { name: '-Server', type: 'String', required: false, pipelineInput: 'False', description: `A domain controller to ask, for example DC01.` },
      { name: '-Credential', type: 'PSCredential', required: false, pipelineInput: 'False', description: `Use another account, for example when querying a trusted forest.` },
    ],
    practicalExamples: [
      {
        title: `Get the Basic Forest Facts`,
        description: `A first look at an environment.`,
        code: `Get-ADForest | Select-Object Name, RootDomain, ForestMode, Domains`,
        illustrativeOutput: `Name             RootDomain       ForestMode        Domains
----             ----------       ----------        -------
corp.example.com corp.example.com Windows2016Forest {corp.example.com}`,
        explanation: `ForestMode is the functional level, which limits which newer AD features you can use. A single-domain lab such as this shows one domain.`,
      },
      {
        title: `Who Holds the Forest-Wide Roles?`,
        description: `Find the schema master and domain naming master.`,
        code: `Get-ADForest | Select-Object SchemaMaster, DomainNamingMaster`,
        illustrativeOutput: `SchemaMaster      DomainNamingMaster
------------      ------------------
DC01.corp.example.com DC01.corp.example.com`,
        explanation: `These two roles exist once per forest. Knowing where they live matters before schema changes or when adding and removing domains.`,
      },
      {
        title: `List Global Catalog Servers and Sites`,
        description: `Expand the list properties to see all values.`,
        code: `(Get-ADForest).GlobalCatalogs
(Get-ADForest).Sites`,
        illustrativeOutput: `DC01.corp.example.com
Default-First-Site-Name`,
        explanation: `Wrapping the command in parentheses and using a property name returns just that property. Global catalogs answer forest-wide searches and sign-ins, so you want at least one per site.`,
      },
    ],
    commonMistakes: [
      `Mixing up forest and domain. A forest can hold several domains; Get-ADForest describes the whole forest, Get-ADDomain one domain.`,
      `Expecting SchemaMaster to be the same as the PDC emulator. The schema master is forest-wide; the PDC emulator, RID master and infrastructure master are per domain (see Get-ADDomain).`,
      `Reading the output list truncated with an ellipsis. Use Select-Object -ExpandProperty Domains or Format-List to see all values.`,
    ],
    troubleshooting: `If you run it from a computer that is not joined to the domain you will get "Unable to find a default server with Active Directory Web Services running": supply -Server DC01 (or -Identity corp.example.com) and, if needed, -Credential. If the module is missing, install RSAT (the RSAT-AD-PowerShell feature on a server, or the Active Directory Domain Services Tools capability on Windows 10/11). Make sure DNS on your computer points to a domain controller so the forest can be located.`,
    relatedCommands: ['Get-ADDomain', 'Get-ADDomainController', 'Get-ADUser', 'Get-ADComputer'],
    relatedLessonPath: '/learn/chapter-12/ad-forests-dns-and-fgpp',
    isEssentialPocketknife: false,
  },
  {
    name: 'Get-ADDomain',
    verb: 'Get',
    noun: 'ADDomain',
    module: 'ActiveDirectory',
    purpose: `Show information about an Active Directory domain: its names, functional level, container paths and per-domain FSMO role holders.`,
    syntax: `Get-ADDomain [[-Identity] <ADDomain>] [-Server <String>] [-Credential <PSCredential>]\nGet-ADDomain [-Current <ADCurrentDomainType>] [-Server <String>] [-Credential <PSCredential>]`,
    description: `Returns one object describing a domain. Useful properties include DNSRoot (corp.example.com), NetBIOSName (CORP), DistinguishedName (DC=corp,DC=example,DC=com), DomainMode (functional level), DomainSID, UsersContainer, ComputersContainer, ParentDomain and ChildDomains, and the three per-domain role holders: PDCEmulator, RIDMaster and InfrastructureMaster. It is read-only and often used to build -SearchBase strings without hard-coding the domain.`,
    parameters: [
      { name: '-Identity', type: 'ADDomain', required: false, position: 0, pipelineInput: 'ByValue', description: `The domain to read, by DNS name, NetBIOS name, DistinguishedName, SID or GUID. Omit it for your own domain.` },
      { name: '-Current', type: 'ADCurrentDomainType', required: false, pipelineInput: 'False', description: `LocalComputer or LoggedOnUser: which domain counts as "current" when no identity is given.` },
      { name: '-Server', type: 'String', required: false, pipelineInput: 'False', description: `A domain controller to ask, for example DC01.` },
      { name: '-Credential', type: 'PSCredential', required: false, pipelineInput: 'False', description: `Query with another account, handy for a different domain.` },
    ],
    practicalExamples: [
      {
        title: `Quick Domain Summary`,
        description: `See the names and functional level of your domain.`,
        code: `Get-ADDomain | Select-Object DNSRoot, NetBIOSName, DomainMode, DistinguishedName`,
        illustrativeOutput: `DNSRoot          NetBIOSName DomainMode         DistinguishedName
-------          ----------- ----------         -----------------
corp.example.com CORP        Windows2016Domain  DC=corp,DC=example,DC=com`,
        explanation: `The DistinguishedName is the root of the directory tree and the starting point for most -SearchBase values.`,
      },
      {
        title: `Find the Per-Domain Role Holders`,
        description: `See which domain controllers hold the three domain FSMO roles.`,
        code: `Get-ADDomain | Select-Object PDCEmulator, RIDMaster, InfrastructureMaster`,
        illustrativeOutput: `PDCEmulator           RIDMaster             InfrastructureMaster
-----------           ---------             --------------------
DC01.corp.example.com DC01.corp.example.com DC01.corp.example.com`,
        explanation: `The PDC emulator is also the time source for the domain, so it is the first server to check when clocks drift. In a one-DC lab all roles sit on DC01.`,
      },
      {
        title: `Build a SearchBase Without Hard-Coding the Domain`,
        description: `Reuse the domain's own DistinguishedName in other commands.`,
        code: `$base = (Get-ADDomain).DistinguishedName
Get-ADUser -Filter * -SearchBase "OU=Staff,$base" | Measure-Object | Select-Object Count`,
        illustrativeOutput: `Count
-----
   42`,
        explanation: `Your scripts then work in any domain without editing. Double quotes are used here because we want the variable expanded.`,
      },
    ],
    commonMistakes: [
      `Confusing it with Get-ADForest. A domain is one partition inside a forest.`,
      `Assuming PDCEmulator is a short name. It is a full DNS name of the domain controller.`,
      `Passing a computer name to -Identity. It expects the domain name (corp.example.com or CORP).`,
    ],
    troubleshooting: `"Unable to find a default server with Active Directory Web Services running" means your computer cannot find a domain controller: check that you are on the domain network or VPN, that DNS points to DC01, or pass -Server DC01. If you run it in a non-domain context, give -Identity corp.example.com plus -Credential. If the module is not found, install RSAT. If you only need the role holders and a list of controllers, Get-ADDomainController gives more per-server detail.`,
    relatedCommands: ['Get-ADForest', 'Get-ADDomainController', 'Get-ADUser', 'Get-ADComputer'],
    relatedLessonPath: '/learn/chapter-12/ad-forests-dns-and-fgpp',
    isEssentialPocketknife: false,
  },
  {
    name: 'Get-ADDomainController',
    verb: 'Get',
    noun: 'ADDomainController',
    module: 'ActiveDirectory',
    purpose: `List or locate domain controllers and see their roles, site and whether they are global catalogs.`,
    syntax: `Get-ADDomainController [[-Identity] <ADDomainController>] [-Server <String>] [-Credential <PSCredential>]\nGet-ADDomainController -Filter <String> [-Server <String>]\nGet-ADDomainController -Discover [-DomainName <String>] [-Service <ADDiscoverableService[]>] [-SiteName <String>] [-NextClosestSite] [-ForceDiscover]`,
    description: `Has three modes. With -Identity it returns one named domain controller. With -Filter it returns every controller that matches (use -Filter * for all of them). With -Discover it behaves like a DNS locator: it asks "which domain controller should a client use right now?" and can prefer a site or a service such as GlobalCatalog or PrimaryDC. Useful properties include HostName, IPv4Address, Site, IsGlobalCatalog, IsReadOnly, OperatingSystem and OperationMasterRoles (the FSMO roles that server holds).`,
    parameters: [
      { name: '-Identity', type: 'ADDomainController', required: false, position: 0, pipelineInput: 'ByValue', description: `One domain controller by name (DC01), DNS host name, DistinguishedName or GUID.` },
      { name: '-Filter', type: 'String', required: false, pipelineInput: 'False', description: `An AD filter string. Use -Filter * to list all domain controllers in the domain.` },
      { name: '-Discover', type: 'SwitchParameter', required: false, pipelineInput: 'False', description: `Locate a suitable controller through DNS instead of reading a specific one. Works like the locator a client uses.` },
      { name: '-Service', type: 'ADDiscoverableService[]', required: false, pipelineInput: 'False', description: `With -Discover: the kind of controller you need, such as GlobalCatalog, KDC, PrimaryDC, TimeService or ADWS.` },
      { name: '-DomainName', type: 'String', required: false, pipelineInput: 'False', description: `With -Discover: the domain to look in, for example corp.example.com.` },
      { name: '-SiteName', type: 'String', required: false, pipelineInput: 'False', description: `With -Discover: prefer controllers in this AD site.` },
      { name: '-Server', type: 'String', required: false, pipelineInput: 'False', description: `The domain controller to send the query to.` },
    ],
    practicalExamples: [
      {
        title: `List All Domain Controllers`,
        description: `Get a one-line summary of every DC in the domain.`,
        code: `Get-ADDomainController -Filter * | Select-Object Name, IPv4Address, Site, IsGlobalCatalog, IsReadOnly, OperatingSystem`,
        illustrativeOutput: `Name IPv4Address     Site                    IsGlobalCatalog IsReadOnly OperatingSystem
---- -----------     ----                    --------------- ---------- ---------------
DC01 192.168.153.10  Default-First-Site-Name            True      False Windows Server 2022 Standard`,
        explanation: `IsGlobalCatalog and IsReadOnly (RODC) are quick health and design checks. Your lab may show a different number of controllers.`,
      },
      {
        title: `Which Server Holds Which Role?`,
        description: `Ask a specific controller for the FSMO roles it holds.`,
        code: `Get-ADDomainController -Identity 'DC01' | Select-Object HostName, OperationMasterRoles`,
        illustrativeOutput: `HostName              OperationMasterRoles
--------              --------------------
DC01.corp.example.com {PDCEmulator, RIDMaster, InfrastructureMaster, SchemaMaster, DomainNamingMaster}`,
        explanation: `A one-controller lab holds all five roles. In real domains they are often spread out; this shows what a given server holds.`,
      },
      {
        title: `Find the Controller a Client Would Use`,
        description: `Use the locator to find a global catalog server for the domain.`,
        code: `Get-ADDomainController -Discover -DomainName 'corp.example.com' -Service GlobalCatalog |
    Select-Object HostName, Site, IPv4Address`,
        illustrativeOutput: `HostName              Site                    IPv4Address
--------              ----                    -----------
DC01.corp.example.com Default-First-Site-Name 192.168.153.10`,
        explanation: `-Discover queries DNS the way a client computer does, so it tells you which server would be chosen right now. If it fails but Get-ADDomainController -Filter * works, DNS locator records are the suspect.`,
      },
    ],
    commonMistakes: [
      `Combining -Discover with -Filter or -Identity. They are separate modes.`,
      `Assuming -Discover returns the same rich properties as -Identity. Discover results are lighter objects that mainly tell you where to connect.`,
      `Forgetting that OperationMasterRoles is blank for controllers that hold no roles. That is normal.`,
    ],
    troubleshooting: `"Unable to find a default server" or "Cannot find any domain controller" from -Discover almost always points to DNS: make sure the client's DNS server is DC01 (not a public resolver) and run nslookup -type=SRV _ldap._tcp.dc._msdcs.corp.example.com. "Unable to contact the server" in -Filter or -Identity mode means ADWS (TCP 9389) is not reachable on the target. If you are on a computer that is not domain joined, pass -Server and -Credential. If the command is not recognised, install the ActiveDirectory module through RSAT.`,
    relatedCommands: ['Get-ADDomain', 'Get-ADForest', 'Get-ADComputer', 'Test-Connection'],
    relatedLessonPath: '/learn/chapter-12/ad-forests-dns-and-fgpp',
    isEssentialPocketknife: false,
  },
];
