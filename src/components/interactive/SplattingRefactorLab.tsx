import React, { useState } from 'react';
import { Wand2, Shield, Search } from 'lucide-react';

const SPLAT_EXAMPLES = [
  {
    id: 'aduser',
    label: 'New-ADUser Provisioning',
    crampedOneLiner:
      'New-ADUser -Name "Sarah Chen" -SamAccountName "schen" -UserPrincipalName "schen@corp.internal" -Path "OU=Finance,DC=corp,DC=internal" -Department "Finance" -Enabled $true -ChangePasswordAtLogon $true',
    cleanSplat: `$UserParams = @{
    Name                  = 'Sarah Chen'
    SamAccountName        = 'schen'
    UserPrincipalName     = 'schen@corp.internal'
    Path                  = 'OU=Finance,DC=corp,DC=internal'
    Department            = 'Finance'
    Enabled               = $true
    ChangePasswordAtLogon = $true
}
New-ADUser @UserParams`,
  },
  {
    id: 'winevent',
    label: 'Get-WinEvent Security Audit (Event 4104)',
    crampedOneLiner:
      'Get-WinEvent -FilterHashtable @{LogName="Microsoft-Windows-PowerShell/Operational"; Id=4104; StartTime=(Get-Date).AddHours(-24)} -MaxEvents 50 -ErrorAction Stop',
    cleanSplat: `$Filter = @{
    LogName   = 'Microsoft-Windows-PowerShell/Operational'
    Id        = 4104
    StartTime = (Get-Date).AddHours(-24)
}
$WinEventParams = @{
    FilterHashtable = $Filter
    MaxEvents       = 50
    ErrorAction     = 'Stop'
}
Get-WinEvent @WinEventParams`,
  },
  {
    id: 'remoting',
    label: 'Invoke-Command Fleet Remoting',
    crampedOneLiner:
      'Invoke-Command -ComputerName "DC01","SRV02","SRV03" -ScriptBlock { Get-Service -Name WinRM } -Credential (Get-Credential) -ThrottleLimit 16 -ErrorAction Stop',
    cleanSplat: `$InvokeParams = @{
    ComputerName  = @('DC01', 'SRV02', 'SRV03')
    ScriptBlock   = { Get-Service -Name WinRM }
    Credential    = (Get-Credential)
    ThrottleLimit = 16
    ErrorAction   = 'Stop'
}
Invoke-Command @InvokeParams`,
  },
];

const ADSI_QUERIES = [
  {
    id: 'spn',
    title: 'Hunt Kerberoastable User Accounts (SPNs)',
    ldapFilter: '(&(objectCategory=person)(objectClass=user)(servicePrincipalName=*))',
    psCode: `([adsisearcher]'(&(objectCategory=person)(objectClass=user)(servicePrincipalName=*))').FindAll() | ForEach-Object { $_.Properties['samaccountname'] }`,
    defenseNote:
      'Finds service accounts with registered SPNs without needing the ActiveDirectory RSAT module. Defend with 25+ char passwords or Group Managed Service Accounts (gMSA).',
  },
  {
    id: 'admins',
    title: 'Enumerate High-Privilege AdminCount=1 Accounts',
    ldapFilter: '(&(objectCategory=person)(objectClass=user)(adminCount=1))',
    psCode: `([adsisearcher]'(&(objectCategory=person)(objectClass=user)(adminCount=1))').FindAll() | ForEach-Object { $_.Properties['distinguishedname'] }`,
    defenseNote:
      'Accounts protected by SDProp have adminCount=1 stamped in AD. Audit this list regularly for orphaned former admins.',
  },
  {
    id: 'dc',
    title: 'Locate All Domain Controllers via Native LDAP',
    ldapFilter: '(&(objectCategory=computer)(userAccountControl:1.2.840.113556.1.4.803:=8192))',
    psCode: `([adsisearcher]'(&(objectCategory=computer)(userAccountControl:1.2.840.113556.1.4.803:=8192))').FindAll()`,
    defenseNote:
      'Uses the LDAP bitwise AND matching rule (8192 = SERVER_TRUST_ACCOUNT) to identify Domain Controllers.',
  },
];

export const SplattingRefactorLab: React.FC = () => {
  const [splatIdx, setSplatIdx] = useState(0);
  const [adsiIdx, setAdsiIdx] = useState(0);

  const currentSplat = SPLAT_EXAMPLES[splatIdx];
  const currentAdsi = ADSI_QUERIES[adsiIdx];

  return (
    <div className="space-y-8">
      {/* Part 1: @Splatting Refactoring Tool */}
      <div className="space-y-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 text-[0.75rem] font-mono font-extrabold uppercase tracking-wider text-[var(--dp-color-accent)]">
            <Wand2 className="w-4 h-4" />
            <span>Module 14 Toolmaking · Clean Code Refactoring</span>
          </div>
          <h3 className="text-[1.375rem] font-extrabold text-[var(--dp-color-ink)]">
            Interactive <code className="font-mono">@Splatting</code> Hashtable
            Refactorer
          </h3>
          <p className="text-[0.9375rem] text-[var(--dp-color-ink-secondary)] font-medium">
            See how replacing cramped 200-character one-liners with a{' '}
            <code className="font-mono font-bold">@Params</code> hashtable
            eliminates fragile backticks (<code className="font-mono">`</code>)
            and makes scripts effortless to read.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {SPLAT_EXAMPLES.map((item, idx) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setSplatIdx(idx)}
              className={`px-4 py-2 rounded-full text-[0.8125rem] font-extrabold cursor-pointer ${
                splatIdx === idx ? 'clay-btn-primary' : 'clay-btn-secondary'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="clay-well p-5 space-y-2">
            <span className="text-[0.72rem] font-mono font-extrabold uppercase text-amber-700 dark:text-amber-300">
              Before: Hard-to-Read Horizontal One-Liner
            </span>
            <pre className="p-3.5 rounded-xl clay-card font-mono text-[0.78rem] overflow-x-auto whitespace-pre-wrap break-all">
              <code>{currentSplat.crampedOneLiner}</code>
            </pre>
          </div>

          <div className="p-5 rounded-[1.5rem] clay-terminal space-y-2">
            <span className="text-[0.72rem] font-mono font-extrabold uppercase text-[#a7f3d0]">
              After: Clean Production @Splatting (Notice @ instead of $)
            </span>
            <pre className="font-mono text-[0.78rem] text-[#fde68a] overflow-x-auto leading-relaxed">
              <code>{currentSplat.cleanSplat}</code>
            </pre>
          </div>
        </div>
      </div>

      {/* Part 2: Native [adsisearcher] LDAP Recon & Defense Builder */}
      <div className="pt-6 border-t border-black/10 dark:border-white/10 space-y-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 text-[0.75rem] font-mono font-extrabold uppercase tracking-wider text-[var(--dp-color-accent)]">
            <Search className="w-4 h-4" />
            <span>Module 15 &amp; 16 · Native .NET [adsisearcher] LDAP Lab</span>
          </div>
          <h3 className="text-[1.375rem] font-extrabold text-[var(--dp-color-ink)]">
            Zero-RSAT Active Directory LDAP Query Inspector
          </h3>
        </div>

        <div className="flex flex-wrap gap-2">
          {ADSI_QUERIES.map((q, idx) => (
            <button
              key={q.id}
              type="button"
              onClick={() => setAdsiIdx(idx)}
              className={`px-4 py-2 rounded-full text-[0.8125rem] font-extrabold cursor-pointer ${
                adsiIdx === idx ? 'clay-btn-primary' : 'clay-btn-secondary'
              }`}
            >
              {q.title}
            </button>
          ))}
        </div>

        <div className="clay-well p-5 space-y-3">
          <div className="p-4 rounded-[1rem] clay-terminal font-mono text-[0.8125rem] text-[#fde68a] overflow-x-auto">
            <code>PS C:\&gt; {currentAdsi.psCode}</code>
          </div>
          <div className="clay-cushion-lavender p-4 flex items-start gap-2.5 text-[0.875rem] font-medium">
            <Shield className="w-4 h-4 shrink-0 mt-0.5 text-[var(--dp-color-accent)]" />
            <span>
              <strong>Blue Team Defense Note:</strong> {currentAdsi.defenseNote}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
