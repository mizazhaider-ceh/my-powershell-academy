import type { TeachingMap } from '../../types';

export const TEACHING_D: TeachingMap = {
  // ==========================================================================
  // 12-1  Active Directory users, groups, OUs and trust channel repair
  // ==========================================================================
  '12-1': {
    hook: `Your domain has 20,000 users and each one has over a hundred attributes. So why does Get-ADUser show you almost nothing about them until you ask? And what quietly breaks when a restored VM wakes up and says its domain trust failed?`,
    mentalModel: `Picture Active Directory as a huge filing cabinet in a head office. Each drawer is an OU, each folder is an object, and every folder has a long address written from the folder outwards (CN, then OU, then DC). Get-ADUser is a clerk who hands you only the cover sheet unless you name the pages you want, and every computer carries a secret handshake word (its machine password) that must match the office copy.`,
    misconceptions: [
      {
        myth: `Get-ADUser shows me everything about a user, so if Department is empty the user has no department.`,
        truth: `Get-ADUser returns only a small default set of properties (about ten) to keep the network light. Department, Title, Mail, PasswordLastSet and many more exist but only come back when you name them in -Properties.`,
        test: `Run: Get-ADUser -Identity $env:USERNAME | Select-Object Name, Department  (Department is blank). Then: Get-ADUser -Identity $env:USERNAME -Properties Department | Select-Object Name, Department  (now it is filled in).`,
      },
      {
        myth: `An OU is just a big group, so I can give an OU permission to a file share.`,
        truth: `An OU is a container used to organize objects, link Group Policy and delegate administration. It is not a security principal, so it cannot appear in a permission list. Security groups hold members and are what you use for access.`,
        test: `Run: Get-ADOrganizationalUnit -Filter * | Select-Object Name, DistinguishedName and compare with Get-ADGroup -Filter * | Select-Object Name, GroupScope, SID. Only groups have a SID you can put on a permission list.`,
      },
      {
        myth: `When a PC says the trust relationship with the domain failed, the only fix is to unjoin it, reboot, rejoin and reboot again.`,
        truth: `The computer's machine account password just got out of sync with the domain controller (for example after a snapshot revert). Test-ComputerSecureChannel -Repair with admin credentials resets it online, with no unjoin.`,
        test: `On the affected machine run Test-ComputerSecureChannel (it returns True or False). If it returns False, run Test-ComputerSecureChannel -Repair -Credential (Get-Credential) and test again.`,
      },
    ],
    workedExample: {
      goal: `Safely find stale user accounts in a lab domain and prepare to disable them, without changing anything yet.`,
      steps: [
        {
          think: `Before I query AD I check that the module is even on this machine, so I do not blame the domain for a missing tool.`,
          action: `Get-Module -ListAvailable ActiveDirectory | Select-Object Name, Version`,
          result: `One row for ActiveDirectory. If it is empty, install RSAT or run this on a domain controller.`,
        },
        {
          think: `I need LastLogonDate, which is not a default property, so I ask for exactly that property. I filter on the server instead of pulling every user.`,
          action: `Get-ADUser -Filter 'Enabled -eq $true' -Properties LastLogonDate | Select-Object Name, SamAccountName, LastLogonDate | Sort-Object LastLogonDate | Select-Object -First 10`,
          result: `The ten enabled users with the oldest sign-in dates. Remember LastLogonDate comes from a value that is only replicated every 9 to 14 days, so treat it as approximate.`,
        },
        {
          think: `AD has a purpose-built search for inactive accounts, so I use it rather than hand-rolling date maths.`,
          action: `Search-ADAccount -AccountInactive -UsersOnly -TimeSpan 90.00:00:00 | Select-Object Name, SamAccountName, LastLogonDate, Enabled`,
          result: `Accounts with no sign-in for 90 days. Read the list with a human eye before doing anything to it.`,
        },
        {
          think: `Disabling is reversible, deleting is not. I rehearse the change with -WhatIf so I see exactly which objects would be touched.`,
          action: `Search-ADAccount -AccountInactive -UsersOnly -TimeSpan 90.00:00:00 | Disable-ADAccount -WhatIf`,
          result: `One "What if: Performing the operation Set-ADUser on target ..." line per account, and nothing actually changes.`,
        },
        {
          think: `The DistinguishedName tells me where an account lives. I read it left to right: most specific first, domain last.`,
          action: `Get-ADUser -Identity $env:USERNAME | Select-Object -ExpandProperty DistinguishedName`,
          result: `Something like CN=Izaz Haider,OU=Engineering,OU=Staff,DC=corp,DC=example,DC=com, which reads: user, inside Engineering, inside Staff, in corp.example.com.`,
        },
      ],
      takeaway: `Ask for the properties you need, let the domain controller filter, rehearse every change with -WhatIf, and read a DistinguishedName from leaf to root.`,
    },
    checkpoints: [
      {
        question: `Why is Get-ADUser -Filter * -Properties * a bad idea on a domain with 50,000 users?`,
        hint: `Count what travels over the network: how many objects, and how many attributes per object.`,
        answer: `It asks the domain controller to send every user with every attribute, which is megabytes of LDAP data. Filter on the server and request only the properties you really need, for example -Properties Department, LastLogonDate.`,
      },
      {
        question: `Given CN=Izaz Haider,OU=Engineering,OU=Staff,DC=corp,DC=example,DC=com, which OU directly contains the user, and what is the domain's DNS name?`,
        hint: `A DistinguishedName reads from the most specific part to the broadest part.`,
        answer: `The user sits directly in OU=Engineering (which is inside OU=Staff). The domain is corp.example.com, built from the three DC parts.`,
      },
      {
        question: `Test-ComputerSecureChannel returns False on a VM that was restored from an old snapshot. What is your next command and what does it need?`,
        hint: `The fix has the word Repair in it, and AD must trust whoever asks for it.`,
        answer: `Run Test-ComputerSecureChannel -Repair -Credential (Get-Credential) in an elevated console, supplying a domain account allowed to reset the computer account. You need a way to sign in first, such as a local administrator or a cached logon. It re-syncs the machine password without unjoining or an extra reboot. Being offline for a long time is not the usual cause: the domain controller keeps the current and previous machine password, so the trust breaks after a rollback past those, or after the computer object is reset or deleted.`,
      },
    ],
    challenge: {
      brief: `Lab domain, read-only. In OU=Engineering,OU=Staff,DC=corp,DC=example,DC=com, list enabled users whose password has not been changed for 90 days. Show Name, SamAccountName and PasswordLastSet, oldest first, and fetch as little data as possible.`,
      hints: [
        `You need a date that is 90 days ago and a server-side filter, not Where-Object.`,
        `PasswordLastSet is not a default property, so it must go into -Properties. Limit the search area with -SearchBase.`,
        `Store (Get-Date).AddDays(-90) in $cutoff first, then use -Filter { Enabled -eq $true -and PasswordLastSet -lt $cutoff } and finish with Sort-Object and Select-Object. Keep only plain variables like $cutoff inside the filter block, because expressions such as $obj.Property do not work there.`,
      ],
      solution: `$cutoff = (Get-Date).AddDays(-90)\nGet-ADUser -SearchBase 'OU=Engineering,OU=Staff,DC=corp,DC=example,DC=com' -Filter { Enabled -eq $true -and PasswordLastSet -lt $cutoff } -Properties PasswordLastSet |\n  Sort-Object PasswordLastSet |\n  Select-Object Name, SamAccountName, PasswordLastSet`,
      why: `-SearchBase and -Filter make the domain controller do the narrowing, and -Properties PasswordLastSet fetches the single extra attribute you need. Nothing is modified, so it is safe to run and re-run.`,
    },
    teachBack: `Explain to a friend who only knows Windows File Explorer folders why Active Directory has OUs and groups, why they are not the same thing, and why a PowerShell query only shows part of a user unless you ask for more.`,
    diagrams: [
      {
        kind: 'tree',
        title: `A domain, its OUs and a DistinguishedName`,
        caption: `Read any object's DistinguishedName from the leaf up to the domain root. Every OU you pass is one level of the path.`,
        root: {
          label: `corp.example.com (domain)`,
          sub: `DC=corp,DC=example,DC=com`,
          detail: `The top of this branch of the directory. Every DistinguishedName ends with the domain parts DC=corp,DC=example,DC=com.`,
          tone: 'blue',
          children: [
            {
              label: `OU=Staff`,
              sub: `container for people`,
              detail: `A container that organizes objects. You can link Group Policy to it and delegate admin rights on it.`,
              tone: 'cyan',
              children: [
                {
                  label: `OU=Engineering`,
                  sub: `child OU`,
                  detail: `A child OU inside Staff. Its DN is OU=Engineering,OU=Staff,DC=corp,DC=example,DC=com.`,
                  tone: 'cyan',
                  children: [
                    {
                      label: `User: Izaz Haider`,
                      sub: `CN=Izaz Haider,OU=...`,
                      detail: `The full DN is CN=Izaz Haider,OU=Engineering,OU=Staff,DC=corp,DC=example,DC=com. CN means common name.`,
                      tone: 'green',
                    },
                    {
                      label: `Group: GRP_Eng_Admins`,
                      sub: `security group`,
                      detail: `A security group lives in the OU too, but it is what you use for permissions. The OU itself cannot be on a permission list.`,
                      tone: 'amber',
                    },
                  ],
                },
              ],
            },
            {
              label: `OU=Servers`,
              sub: `container for machines`,
              detail: `A separate branch so server hardening policy can be linked here without touching staff.`,
              tone: 'violet',
              children: [
                {
                  label: `Computer: SRV-CORE01`,
                  sub: `machine account`,
                  detail: `Every domain-joined computer has its own account and its own password that rotates about every 30 days.`,
                  tone: 'red',
                },
              ],
            },
          ],
        },
      },
      {
        kind: 'sequence',
        title: `How a trust failure happens and is repaired`,
        caption: `The computer and the domain controller share a secret. A snapshot revert rewinds the computer's copy, and -Repair makes both sides agree again.`,
        actors: [
          { name: `Workstation`, sub: `domain-joined PC`, tone: 'cyan' },
          { name: `Domain Controller`, sub: `holds the account`, tone: 'blue' },
          { name: `You (admin)`, sub: `PowerShell`, tone: 'green' },
        ],
        messages: [
          {
            from: 0,
            to: 1,
            label: `Sign in with machine secret`,
            detail: `At logon the PC proves it is itself by using its machine account password over the secure channel.`,
          },
          {
            from: 1,
            to: 1,
            label: `Compare with stored copy`,
            detail: `The PC's copy was rewound by a snapshot revert (or the computer object was reset), so the DC's stored copy and the PC's copy do not match.`,
          },
          {
            from: 1,
            to: 0,
            label: `Reject: trust failed`,
            detail: `The user sees the message about the trust relationship between this workstation and the primary domain.`,
          },
          {
            from: 2,
            to: 0,
            label: `Test-ComputerSecureChannel`,
            detail: `Run locally as admin. It returns False, which confirms the secure channel is broken.`,
          },
          {
            from: 2,
            to: 0,
            label: `Run it again with -Repair`,
            detail: `You pass domain credentials with -Credential so AD allows the password reset.`,
          },
          {
            from: 0,
            to: 1,
            label: `Reset the machine password`,
            detail: `The PC asks the DC to set a new shared password and stores the same value locally.`,
          },
          {
            from: 1,
            to: 0,
            label: `Secure channel restored`,
            detail: `Test-ComputerSecureChannel now returns True. No unjoin and no rejoin were needed.`,
          },
        ],
      },
    ],
  },

  // ==========================================================================
  // 12-2  Forests, domain controllers, DNS and fine-grained password policies
  // ==========================================================================
  '12-2': {
    hook: `You join a new PC to corp.example.com and nobody types in the address of a domain controller. So how does the PC find one? And how can Domain Admins need 20 characters while everyone else needs 12 in the same domain?`,
    mentalModel: `Think of DNS as the phone book that Active Directory cannot live without: SRV records are the "who answers for this service" entries that point a PC to a domain controller. Password policy is house rules, where the Default Domain Policy is the rule for everyone and a Password Settings Object (PSO) is a special wing with its own rules, where the lowest precedence number gets served first.`,
    misconceptions: [
      {
        myth: `DNS is just for websites. Active Directory has its own way of finding domain controllers.`,
        truth: `Clients locate domain controllers by asking DNS for SRV records such as _ldap._tcp.dc._msdcs.corp.example.com. If those records are missing or wrong, domain join and logon break even though the DCs are healthy. DNS is the most common cause of Active Directory trouble, so check it first.`,
        test: `Run: Resolve-DnsName -Name _ldap._tcp.dc._msdcs.corp.example.com -Type SRV | Select-Object NameTarget, Port, Priority. You will see the DC host names the client would use.`,
      },
      {
        myth: `I will link my strict password policy to the Admins OU so everyone in it gets it.`,
        truth: `A Fine-Grained Password Policy (a PSO) can only apply to users or global security groups, never to an OU. If you need an OU's people covered, put them in a security group and attach the PSO to that group.`,
        test: `Run: Get-ADFineGrainedPasswordPolicy -Filter * | Select-Object Name, Precedence, AppliesTo. AppliesTo lists users and groups only, never an OU.`,
      },
      {
        myth: `Precedence 100 is more important than precedence 1 because the number is bigger.`,
        truth: `The lowest precedence number wins. Precedence 1 beats precedence 100. A PSO linked directly to a user also beats PSOs that reach the user only through a group.`,
        test: `Run: Get-ADUserResultantPasswordPolicy -Identity someuser | Select-Object Name, Precedence. It prints the single policy that actually wins for that user.`,
      },
    ],
    workedExample: {
      goal: `Prove, using read-only commands, how a client finds a domain controller and which password policy really applies to one user.`,
      steps: [
        {
          think: `First I want the big picture of this domain: its DNS name, its mode and who holds the PDC Emulator role.`,
          action: `Get-ADDomain | Select-Object DNSRoot, NetBIOSName, DomainMode, PDCEmulator`,
          result: `One row, for example corp.example.com, CORP and the host name of the PDC Emulator (DC01 in the lab).`,
        },
        {
          think: `A client never hard-codes a DC. I ask DNS for the same SRV record a client would ask for.`,
          action: `Resolve-DnsName -Name '_ldap._tcp.dc._msdcs.corp.example.com' -Type SRV | Select-Object NameTarget, Port, Priority, Weight`,
          result: `One row per DC, on port 389. Lower Priority is tried first, and Weight shares load between equals.`,
        },
        {
          think: `DNS gives the candidates, but which DC would this machine actually pick? The locator can tell me, and it also reports the AD site.`,
          action: `Get-ADDomainController -Discover -DomainName corp.example.com | Select-Object HostName, Site, IPv4Address`,
          result: `The DC chosen for your site, with its IP address.`,
        },
        {
          think: `Now passwords. I list every PSO sorted by precedence so I read them in the order AD would consider them.`,
          action: `Get-ADFineGrainedPasswordPolicy -Filter * | Sort-Object Precedence | Select-Object Name, Precedence, MinPasswordLength, AppliesTo`,
          result: `Your PSOs, lowest number first. AppliesTo shows the users and groups each one covers.`,
        },
        {
          think: `Do not guess. Ask AD to compute the winner for a specific user.`,
          action: `Get-ADUserResultantPasswordPolicy -Identity ihaider | Select-Object Name, Precedence, MinPasswordLength`,
          result: `The one winning PSO. If nothing is returned, no PSO applies and the default domain policy is used.`,
        },
        {
          think: `For the no-PSO case, or to compare, I read the default domain policy.`,
          action: `Get-ADDefaultDomainPasswordPolicy | Select-Object MinPasswordLength, ComplexityEnabled, LockoutThreshold`,
          result: `The baseline every user gets unless a PSO says otherwise.`,
        },
      ],
      takeaway: `DNS SRV records are how clients find domain controllers, and Get-ADUserResultantPasswordPolicy ends every password policy argument by showing the actual winner.`,
    },
    checkpoints: [
      {
        question: `User Sam is in GRP_A (PSO precedence 5) and GRP_B (PSO precedence 20). Which PSO applies? What changes if the precedence 20 PSO is also linked directly to Sam's user account?`,
        hint: `Lowest number wins among group links, but there is one link type that beats all group links.`,
        answer: `With only group links the precedence 5 PSO wins. A PSO linked directly to the user account beats PSOs that arrive through groups, so the precedence 20 PSO would win for Sam.`,
      },
      {
        question: `Which DNS record type lets a client find a domain controller, and why is a plain A record not enough?`,
        hint: `The client does not know a host name yet. It knows only a service and a domain.`,
        answer: `SRV records. They map a service name (like _ldap._tcp.dc._msdcs.corp.example.com) to host names and ports. An A record only maps a known name to an IP address, so it cannot tell a client which servers offer a service.`,
      },
      {
        question: `Which cmdlet shows the Schema Master and which shows the PDC Emulator?`,
        hint: `One role is forest-wide, the other is domain-wide.`,
        answer: `Get-ADForest shows SchemaMaster (and DomainNamingMaster). Get-ADDomain shows PDCEmulator, RIDMaster and InfrastructureMaster. Get-ADDomainController shows which roles one particular DC holds.`,
      },
    ],
    challenge: {
      brief: `Lab domain only. Plan a strict password policy for service admins: a PSO named PSO-SvcAdmins with precedence 5, 20 character minimum, complexity on, 5 bad attempts lock for 30 minutes. Attach it to the global security group GRP_ServiceAdmins. Use a splatted hashtable, rehearse with -WhatIf first, then show how you would verify a member's effective policy.`,
      hints: [
        `Put every parameter in a hashtable and splat it with @, then add WhatIf = $true to rehearse.`,
        `The cmdlet needs the lockout values (threshold, duration, observation window) as well as password age, history count and reversible encryption settings. Durations are TimeSpans such as '00:30:00' or '60.00:00:00'.`,
        `After creating the PSO, use Add-ADFineGrainedPasswordPolicySubject -Identity PSO-SvcAdmins -Subjects GRP_ServiceAdmins, then Get-ADUserResultantPasswordPolicy -Identity <member>.`,
      ],
      solution: `$pso = @{\n  Name                        = 'PSO-SvcAdmins'\n  Precedence                  = 5\n  MinPasswordLength           = 20\n  ComplexityEnabled           = $true\n  LockoutThreshold            = 5\n  LockoutDuration             = '00:30:00'\n  LockoutObservationWindow    = '00:30:00'\n  MinPasswordAge              = '1.00:00:00'\n  MaxPasswordAge              = '60.00:00:00'\n  PasswordHistoryCount        = 24\n  ReversibleEncryptionEnabled = $false\n  WhatIf                      = $true\n}\nNew-ADFineGrainedPasswordPolicy @pso\n\n# Remove WhatIf from $pso to create it for real, then:\nAdd-ADFineGrainedPasswordPolicySubject -Identity 'PSO-SvcAdmins' -Subjects 'GRP_ServiceAdmins' -WhatIf\nGet-ADUserResultantPasswordPolicy -Identity 'ihaider' | Select-Object Name, Precedence, MinPasswordLength`,
      why: `Splatting keeps all the settings readable in one place, and -WhatIf lets you check the plan without touching the directory. Attaching the PSO to a global security group (not an OU) is what AD requires, and the resultant-policy cmdlet proves which policy a person really gets.`,
    },
    teachBack: `Explain to a friend who only knows that "the network just works" how a PC finds a domain controller using DNS, and how two different password rules can live in the same domain without fighting.`,
    diagrams: [
      {
        kind: 'tree',
        title: `Forest, domains and where the roles live`,
        caption: `Some roles exist once per forest and some once per domain. Knowing which is which tells you which cmdlet to ask.`,
        root: {
          label: `Forest: corp.example.com`,
          sub: `Get-ADForest`,
          detail: `The security and schema boundary. All domains in a forest share one schema and one Global Catalog.`,
          tone: 'violet',
          children: [
            {
              label: `Forest-wide roles`,
              sub: `exactly one of each`,
              detail: `The Schema Master (who may change the schema) and Domain Naming Master (who adds or removes domains) exist once in the whole forest.`,
              tone: 'amber',
            },
            {
              label: `Domain: corp.example.com`,
              sub: `Get-ADDomain`,
              detail: `The administrative and replication unit that holds users, groups and computers, plus the default password policy.`,
              tone: 'blue',
              children: [
                {
                  label: `Domain-wide roles`,
                  sub: `PDC, RID, Infrastructure`,
                  detail: `One PDC Emulator, one RID Master and one Infrastructure Master per domain. Get-ADDomain names the holders.`,
                  tone: 'cyan',
                },
                {
                  label: `Domain controllers`,
                  sub: `Get-ADDomainController`,
                  detail: `Every DC holds a writable copy of the domain. A DC can hold several roles, and a Global Catalog server holds a partial copy of every domain.`,
                  tone: 'green',
                },
              ],
            },
          ],
        },
      },
      {
        kind: 'sequence',
        title: `A client finds a domain controller`,
        caption: `DNS SRV records, not hard-coded addresses, are the glue that makes domain join and logon work.`,
        actors: [
          { name: `Client PC`, sub: `CLIENT01 joining the domain`, tone: 'cyan' },
          { name: `DNS server`, sub: `usually a DC`, tone: 'amber' },
          { name: `Domain Controller`, sub: `DC01`, tone: 'blue' },
        ],
        messages: [
          {
            from: 0,
            to: 1,
            label: `Ask for SRV record`,
            detail: `The client asks for _ldap._tcp.dc._msdcs.corp.example.com. This is the question Resolve-DnsName -Type SRV lets you repeat by hand.`,
          },
          {
            from: 1,
            to: 0,
            label: `Reply: host and port`,
            detail: `DNS answers with host names, ports, priorities and weights, for example DC01.corp.example.com on port 389.`,
          },
          {
            from: 0,
            to: 1,
            label: `Ask for A record`,
            detail: `The SRV answer gives a name, so the client now needs the IP address of that host.`,
          },
          {
            from: 1,
            to: 0,
            label: `Reply: IP address`,
            detail: `An A record turns DC01.corp.example.com into 192.168.56.10, an address the client can connect to.`,
          },
          {
            from: 0,
            to: 2,
            label: `LDAP ping and logon`,
            detail: `The client contacts the DC, which tells it its site info, then Kerberos and LDAP take over.`,
          },
          {
            from: 2,
            to: 2,
            label: `Apply the password policy`,
            detail: `When a password is set, the DC uses the winning PSO if there is one, otherwise the Default Domain Policy.`,
          },
        ],
      },
    ],
  },

  // ==========================================================================
  // 13-1  Windows Defender Firewall: profiles, rules and DisplayGroups
  // ==========================================================================
  '13-1': {
    hook: `Remote management is failing and the quickest fix seems to be switching the firewall off. What if you could open exactly the right door, and only on the right kind of network, with one command?`,
    mentalModel: `Picture the firewall as three rulebooks (Domain, Private, Public) kept in one filing cabinet. A doorman called NLA looks at each network cable or Wi-Fi link, decides which rulebook applies to it, and then every visitor is checked against that rulebook: block rules first, then allow rules, and anyone not on the list is turned away.`,
    misconceptions: [
      {
        myth: `Turning the firewall off is a harmless quick test, because I will turn it back on afterwards.`,
        truth: `Switching a profile off removes inbound filtering for every program and port on that network, not just the one you are testing. It is also usually unnecessary: Test-NetConnection tells you whether a single port is reachable.`,
        test: `Run: Get-NetFirewallProfile | Select-Object Name, Enabled, DefaultInboundAction. Then test one port instead of the whole firewall: Test-NetConnection -ComputerName SRV-CORE01 -Port 5985.`,
      },
      {
        myth: `I enabled the rule group, so the port is open from everywhere.`,
        truth: `Every rule has a Profile and often a remote address scope. A rule limited to Domain does nothing while the network is classed as Public, and the built-in Public version of some rules only allows the local subnet.`,
        test: `Run: Get-NetFirewallRule -DisplayGroup 'Windows Remote Management' | Select-Object DisplayName, Enabled, Profile. Then add: | Get-NetFirewallAddressFilter | Select-Object InstanceID, RemoteAddress.`,
      },
      {
        myth: `The whole computer has one firewall profile, and I pick it in the firewall settings.`,
        truth: `Each network connection gets its own category. Network Location Awareness assigns Domain when it can reach and authenticate to a domain controller on that network, Public by default for unknown networks, and Private only when an admin sets it.`,
        test: `Run: Get-NetConnectionProfile | Select-Object InterfaceAlias, NetworkCategory. A laptop with Ethernet at the office and Wi-Fi at home can show different values per adapter.`,
      },
    ],
    workedExample: {
      goal: `Prepare a Server Core machine for remote management (WinRM) by opening the right firewall rules, without ever disabling the firewall.`,
      steps: [
        {
          think: `The right rule set depends on the network category, so I check which profile each adapter is really in.`,
          action: `Get-NetConnectionProfile | Select-Object InterfaceAlias, NetworkCategory, IPv4Connectivity`,
          result: `One row per connection. A server on the corporate LAN should say DomainAuthenticated. Public means NLA could not confirm the domain.`,
        },
        {
          think: `Next I see the posture of the three profiles. I want to know the defaults, not guess them.`,
          action: `Get-NetFirewallProfile | Select-Object Name, Enabled, DefaultInboundAction, DefaultOutboundAction`,
          result: `Domain, Private and Public, usually Enabled True, inbound Block, outbound Allow.`,
        },
        {
          think: `Instead of memorizing port numbers I look at the built-in group for what I need.`,
          action: `Get-NetFirewallRule -DisplayGroup 'Windows Remote Management' | Select-Object DisplayName, Enabled, Profile, Direction`,
          result: `A few inbound rules, with their profiles. Some are Domain,Private and one is Public only.`,
        },
        {
          think: `Scope matters. I peek at the remote address filters so I know who is allowed in.`,
          action: `Get-NetFirewallRule -DisplayGroup 'Windows Remote Management' | Get-NetFirewallAddressFilter | Select-Object InstanceID, RemoteAddress`,
          result: `Typically Any for the Domain and Private rules and LocalSubnet for the Public one.`,
        },
        {
          think: `This changes state, so I rehearse first.`,
          action: `Enable-NetFirewallRule -DisplayGroup 'Windows Remote Management' -WhatIf`,
          result: `One "What if" line per rule in the group. Remove -WhatIf in your lab to apply it for real.`,
        },
        {
          think: `The proof is a real connection attempt from another machine, not the fact that the rule says Enabled.`,
          action: `Test-NetConnection -ComputerName SRV-CORE01 -Port 5985 | Select-Object ComputerName, RemotePort, TcpTestSucceeded`,
          result: `TcpTestSucceeded True means the firewall door is open and the WinRM listener is answering.`,
        },
      ],
      takeaway: `Check the profile, enable the matching DisplayGroup, and prove it with Test-NetConnection. You never need to switch the firewall off. A DisplayGroup is a bundle of several rules (it may open more than one port or protocol), and its name is localised, so on a non-English system use the language-neutral -Group value that Get-NetFirewallRule shows.`,
    },
    checkpoints: [
      {
        question: `A server sits on the corporate LAN and can reach a domain controller. Which profile does NLA normally assign and why?`,
        hint: `One profile is chosen automatically when authentication to AD succeeds.`,
        answer: `The Domain profile, because NLA can authenticate to a domain controller on that network. Private is only chosen by an admin and Public is the default for unknown networks.`,
      },
      {
        question: `You ran Enable-NetFirewallRule -DisplayGroup 'Windows Remote Management' but Test-NetConnection -Port 5985 still fails from another subnet. Name two likely causes.`,
        hint: `Think about profile and scope on the firewall side, and about the service itself.`,
        answer: `The NIC may be on the Public profile, where the WinRM rule is limited to the local subnet. Or the WinRM listener or service is not running (Enable-PSRemoting configures it). A routing or network firewall problem is also possible.`,
      },
      {
        question: `One rule allows inbound TCP 8443 and another rule blocks inbound TCP 8443, both on the same profile. What happens to a connection?`,
        hint: `Which type of rule is checked first?`,
        answer: `The connection is blocked. Explicit block rules override allow rules when both match.`,
      },
    ],
    challenge: {
      brief: `Lab only. Open inbound TCP 8443 for an internal web app, but only on the Domain and Private profiles and only from the 192.168.56.0/24 network. Use a splatted hashtable, rehearse with -WhatIf, then show how to verify the rule and how to remove it.`,
      hints: [
        `New-NetFirewallRule has a -RemoteAddress parameter and a -Profile parameter that accepts more than one value.`,
        `Build the hashtable with Direction, Protocol, LocalPort, RemoteAddress, Profile and Action, plus WhatIf = $true for the rehearsal.`,
        `Verify with Get-NetFirewallRule -DisplayName ... | Get-NetFirewallPortFilter, and clean up with Remove-NetFirewallRule -DisplayName ... (try -WhatIf first).`,
      ],
      solution: `$rule = @{\n  DisplayName   = 'Lab Portal 8443 (subnet only)'\n  Direction     = 'Inbound'\n  Protocol      = 'TCP'\n  LocalPort     = 8443\n  RemoteAddress = '192.168.56.0/24'\n  Profile       = 'Domain', 'Private'\n  Action        = 'Allow'\n  WhatIf        = $true\n}\nNew-NetFirewallRule @rule\n\n# Lab only: remove WhatIf from $rule to create it, then check and clean up\nGet-NetFirewallRule -DisplayName 'Lab Portal 8443 (subnet only)' | Get-NetFirewallPortFilter\nRemove-NetFirewallRule -DisplayName 'Lab Portal 8443 (subnet only)' -WhatIf`,
      why: `The rule opens exactly one port, on trusted profiles, for one network. That is far safer than disabling the firewall, and the WhatIf rehearsal plus a named rule makes it easy to audit and remove.`,
    },
    teachBack: `Explain to a friend who only knows "the firewall blocks stuff" how Windows decides which rulebook to use on a network, and why opening one named group of rules is better than turning the firewall off.`,
    diagrams: [
      {
        kind: 'compare',
        title: `Which profile will I get?`,
        caption: `NLA looks at each connection on its own. Profile choice drives which rules are active, so the same server can behave differently on different networks.`,
        left: {
          heading: `Domain profile`,
          tone: 'green',
          rows: [
            { label: `Assigned when`, value: `NLA authenticates to a domain controller` },
            { label: `Who chooses`, value: `Windows, automatically` },
            { label: `Typical use`, value: `Corporate LAN, servers` },
            { label: `Management rules`, value: `Enabled groups apply here` },
          ],
        },
        right: {
          heading: `Public profile`,
          tone: 'red',
          rows: [
            { label: `Assigned when`, value: `Network is unknown or untrusted` },
            { label: `Who chooses`, value: `Default if nothing else fits` },
            { label: `Typical use`, value: `Cafe or hotel Wi-Fi` },
            { label: `Management rules`, value: `Most are off or local subnet only` },
          ],
        },
        verdict: `Private sits in the middle: an admin marks a trusted home or lab network as Private with Set-NetConnectionProfile. Always check Get-NetConnectionProfile before blaming a rule.`,
      },
      {
        kind: 'layers',
        title: `How an inbound connection is judged`,
        caption: `A simplified view of the order of checks. This is why one block rule can undo ten allow rules.`,
        traceLabel: `Trace a connection to port 8443`,
        layers: [
          {
            label: `Incoming connection`,
            sub: `TCP to port 8443`,
            detail: `A packet arrives on a specific network adapter and asks to open a connection.`,
            tone: 'blue',
          },
          {
            label: `NLA picks the profile`,
            sub: `Domain, Private or Public`,
            detail: `The category of that adapter's network decides which set of rules is active for this packet.`,
            tone: 'cyan',
          },
          {
            label: `Block rules checked`,
            sub: `explicit blocks win`,
            detail: `If any enabled block rule matches the port, program or address, the connection is dropped and allow rules are not consulted.`,
            tone: 'red',
          },
          {
            label: `Allow rules checked`,
            sub: `profile, port, scope`,
            detail: `An enabled allow rule must match the profile, the port and the remote address scope. Rules for another profile do not count.`,
            tone: 'green',
          },
          {
            label: `Default inbound action`,
            sub: `usually Block`,
            detail: `If nothing matched, the profile's default applies. For inbound traffic that default is normally Block.`,
            tone: 'amber',
          },
        ],
      },
    ],
  },

  // ==========================================================================
  // 13-2  Group Policy, RSoP and scheduled tasks
  // ==========================================================================
  '13-2': {
    hook: `Fifteen GPOs are linked across your domain and one setting is behaving oddly on a single server. How do you prove which GPO won, and how do you make the server pick up changes right now?`,
    mentalModel: `Imagine a stack of transparent sheets laid on a desk, one for Local, then Site, Domain and each OU from the top down. Each sheet can write over what is below it, so when you look down from above you see the topmost writing: the closest OU wins, unless a sheet below is marked Enforced. Scheduled tasks are the alarm clock on that desk: an action, a trigger and a registration.`,
    misconceptions: [
      {
        myth: `A GPO linked at the domain is the boss, so it beats a GPO linked to an OU.`,
        truth: `Policies apply in the order Local, Site, Domain, then OUs from parent to child, and the last one applied wins a conflict. So the OU normally beats the domain. An Enforced link flips that: the higher-level enforced GPO wins.`,
        test: `Run: Get-GPInheritance -Target 'OU=Servers,DC=corp,DC=example,DC=com' | Select-Object -ExpandProperty GpoLinks | Select-Object DisplayName, Order, Enforced. Link order and Enforced explain the result.`,
      },
      {
        myth: `Invoke-GPUpdate applies the policy on the remote server immediately.`,
        truth: `For a remote computer, Invoke-GPUpdate schedules the refresh with a random delay of up to 10 minutes by default so many machines do not hit the DC at once. Use -RandomDelayInMinutes 0 for an immediate refresh.`,
        test: `Run: Get-Help Invoke-GPUpdate -Parameter RandomDelayInMinutes and read the default value.`,
      },
      {
        myth: `Get-GPO -All shows me which GPOs are applied to this server.`,
        truth: `Get-GPO lists the GPO objects that exist in the domain, applied or not. Which ones actually applied, and which setting won, is a Resultant Set of Policy question answered by Get-GPResultantSetOfPolicy or gpresult.`,
        test: `Compare Get-GPO -All | Measure-Object with gpresult /r /scope computer on the target server. The second list shows only applied GPOs.`,
      },
    ],
    workedExample: {
      goal: `Answer "why does this server have the wrong setting?" with evidence, then refresh policy, without editing any GPO.`,
      steps: [
        {
          think: `I want to know what links apply to the server's OU and in what order, before I open any report.`,
          action: `Get-GPInheritance -Target 'OU=Servers,DC=corp,DC=example,DC=com' | Select-Object -ExpandProperty GpoLinks | Select-Object DisplayName, Order, Enabled, Enforced`,
          result: `The GPOs linked directly at that OU. Lowest Order number is processed last, so it wins conflicts inside this OU.`,
        },
        {
          think: `Inheritance only tells me what could apply. The RSoP report tells me what did apply, so I generate it for this server.`,
          action: `Get-GPResultantSetOfPolicy -Computer 'SRV-CORE01' -ReportType Html -Path 'C:\\Reports\\SRV-CORE01-RSoP.html'`,
          result: `An HTML file listing each applied GPO and, for each setting, the Winning GPO. The path folder must already exist.`,
        },
        {
          think: `Before anyone edits the culprit, I take a backup so I can roll back quickly.`,
          action: `Backup-Gpo -Name 'SEC-Server-Hardening' -Path 'C:\\GPOBackups'`,
          result: `A backup folder with a GUID name plus a manifest. Restore later with Restore-GPO.`,
        },
        {
          think: `After the fix I want the server to refresh now, not in 10 minutes, and I want all settings reapplied.`,
          action: `Invoke-GPUpdate -Computer 'SRV-CORE01' -RandomDelayInMinutes 0 -Force`,
          result: `The command returns quickly. The remote machine then runs the refresh.`,
        },
        {
          think: `I verify on the target itself with the built-in tool, because the machine is the source of truth.`,
          action: `gpresult /r /scope computer`,
          result: `The list of applied Computer Configuration GPOs, now including the corrected policy.`,
        },
      ],
      takeaway: `Inheritance shows what could apply, RSoP shows what did apply and who won, and a backup plus a forced refresh makes the change safe and fast.`,
    },
    checkpoints: [
      {
        question: `The Domain GPO sets account lockout to 10 minutes and a GPO on the Servers OU sets it to 5 minutes. A server in that OU gets which value, and what changes if the Domain GPO link is Enforced?`,
        hint: `Think of the sheets of paper: who is applied last?`,
        answer: `The OU value (5 minutes), because the OU GPO is applied after the Domain GPO. With the Domain link Enforced, the Domain GPO wins and the server gets 10 minutes.`,
      },
      {
        question: `Why might Invoke-GPUpdate -Computer SRV01 not change anything for several minutes, and how do you avoid that?`,
        hint: `A default parameter value spreads out refresh requests.`,
        answer: `The default RandomDelayInMinutes is 10 for remote refreshes, so the machine refreshes at a random time within that window. Use -RandomDelayInMinutes 0 (and -Force to reapply everything).`,
      },
      {
        question: `Name the three scheduled task building blocks, which question each answers, and the executable you use to run a .ps1.`,
        hint: `One is what, one is when and one puts them together.`,
        answer: `New-ScheduledTaskAction answers what to run, New-ScheduledTaskTrigger answers when, and Register-ScheduledTask saves them under a name and account. Task Scheduler runs executables, so the action is powershell.exe or pwsh.exe with -File script.ps1 in the arguments.`,
      },
    ],
    challenge: {
      brief: `Lab machine only, in an elevated console. Register a task named Lab-Hello that runs in about 2 minutes and appends the current date to a file called lab-task.txt in your temp folder. Start it manually, check its result, then remove the task.`,
      hints: [
        `You need an action that runs powershell.exe with -NoProfile -Command and a one-time trigger set with -Once -At.`,
        `Register-ScheduledTask takes -TaskName, -Action and -Trigger. Get-ScheduledTaskInfo shows LastRunTime and LastTaskResult.`,
        `Start-ScheduledTask runs it now, and Unregister-ScheduledTask -TaskName Lab-Hello -Confirm:$false removes it.`,
      ],
      solution: `$action  = New-ScheduledTaskAction -Execute 'powershell.exe' -Argument '-NoProfile -Command "Get-Date | Out-File (Join-Path $env:TEMP ''lab-task.txt'') -Append"'\n$trigger = New-ScheduledTaskTrigger -Once -At (Get-Date).AddMinutes(2)\nRegister-ScheduledTask -TaskName 'Lab-Hello' -Action $action -Trigger $trigger -Description 'Lab only'\n\nStart-ScheduledTask -TaskName 'Lab-Hello'\nGet-ScheduledTask -TaskName 'Lab-Hello' | Get-ScheduledTaskInfo | Select-Object LastRunTime, LastTaskResult\nGet-Content (Join-Path $env:TEMP 'lab-task.txt')\n\nUnregister-ScheduledTask -TaskName 'Lab-Hello' -Confirm:$false`,
      why: `The action says what to launch, the trigger says when, and registering joins them under a name. LastTaskResult 0 means success. Cleaning up with Unregister-ScheduledTask keeps your lab tidy.`,
    },
    teachBack: `Explain to a friend who only knows "settings on my own PC" how thousands of computers end up with the same settings from Group Policy, why the closest OU usually wins, and how a scheduled task is built from an action and a trigger.`,
    diagrams: [
      {
        kind: 'layers',
        title: `GPO processing order (LSDOU)`,
        caption: `Policies are applied from the top of this list to the bottom. Later layers overwrite earlier ones, so the bottom layer is the one that normally wins.`,
        traceLabel: `Trace policy application`,
        layers: [
          {
            label: `L: Local policy`,
            sub: `applied first`,
            detail: `The local Group Policy on the machine itself. It is the weakest layer because everything below can overwrite it.`,
            tone: 'blue',
          },
          {
            label: `S: Site GPOs`,
            sub: `linked to the AD site`,
            detail: `GPOs linked to the Active Directory site the computer belongs to, useful for location-specific settings.`,
            tone: 'cyan',
          },
          {
            label: `D: Domain GPOs`,
            sub: `Default Domain Policy`,
            detail: `Applies to every user and computer in the domain, and holds domain-wide settings such as the default password policy.`,
            tone: 'green',
          },
          {
            label: `OU: parent OU GPOs`,
            sub: `for example Servers`,
            detail: `GPOs linked to the outer OU. Within one container, the link with the lowest Order number is applied last and wins.`,
            tone: 'amber',
          },
          {
            label: `OU: child OU GPOs`,
            sub: `for example Servers\\Web`,
            detail: `Applied last, so these settings normally win. Enforced links and Block Inheritance can change that outcome.`,
            tone: 'violet',
          },
        ],
      },
      {
        kind: 'compare',
        title: `Normal inheritance and Enforced`,
        caption: `The same two GPOs, the same conflicting setting, but the Enforced flag changes who wins.`,
        left: {
          heading: `Normal link`,
          tone: 'cyan',
          rows: [
            { label: `Domain GPO sets`, value: `Screen lock 15 minutes` },
            { label: `OU GPO sets`, value: `Screen lock 5 minutes` },
            { label: `Order applied`, value: `Domain first, OU last` },
            { label: `Winner`, value: `OU GPO: 5 minutes` },
          ],
        },
        right: {
          heading: `Domain link Enforced`,
          tone: 'amber',
          rows: [
            { label: `Domain GPO sets`, value: `Screen lock 15 minutes` },
            { label: `OU GPO sets`, value: `Screen lock 5 minutes` },
            { label: `Enforced flag`, value: `Higher level cannot be overridden` },
            { label: `Winner`, value: `Domain GPO: 15 minutes` },
          ],
        },
        verdict: `Closest wins by default. Use Enforced sparingly for rules that must never be overridden, and use RSoP to confirm the real winner.`,
      },
    ],
  },

  // ==========================================================================
  // 14-1  Error handling and splatting
  // ==========================================================================
  '14-1': {
    hook: `You wrapped a failing command in try/catch, yet PowerShell printed a red error and your catch block never ran. Is PowerShell broken, or is it doing exactly what it was designed to do?`,
    mentalModel: `Picture a conveyor belt with a quality inspector. Most errors are a red sticky note on one item while the belt keeps moving (non-terminating). Only a stop-the-line alarm (terminating) sends control to your catch block. -ErrorAction Stop is how you tell the inspector: for this command, treat every sticky note as a stop-the-line alarm.`,
    misconceptions: [
      {
        myth: `try/catch catches every red error message that PowerShell prints.`,
        truth: `catch only sees terminating errors. Most cmdlet errors are non-terminating by default, so the red text appears and the script carries on. Add -ErrorAction Stop to turn them into terminating errors.`,
        test: `Run try { Get-Item C:\\NoSuchFile.txt } catch { 'Caught' } (no Caught, only red text). Then run it with -ErrorAction Stop and see Caught print.`,
      },
      {
        myth: `finally only runs when something went wrong.`,
        truth: `finally runs every time: after success, after a caught error and even after an uncaught terminating error. It is the right place to close files, connections and temporary state.`,
        test: `Run try { 'all good' } finally { 'cleanup ran' } and see both lines appear even though there was no error.`,
      },
      {
        myth: `$params and @params are the same thing, just two styles.`,
        truth: `$params passes the whole hashtable as one value to the first positional parameter. @params splats it, unpacking each key as a parameter name and each value as its argument.`,
        test: `Run function Show { param($Name, $Age) "$Name / $Age" }; $p = @{ Name = 'Ana'; Age = 30 }; Show $p; Show @p. The first prints System.Collections.Hashtable and a blank age, the second prints Ana / 30.`,
      },
    ],
    workedExample: {
      goal: `Process a list of files so one missing file does not stop the loop, and report a clear message for each failure.`,
      steps: [
        {
          think: `First I watch the default behavior. I need to know whether this error is terminating before I decide how to handle it.`,
          action: `try { Get-Item -Path 'C:\\Nope\\a.txt' } catch { 'Caught' }`,
          result: `Red error text only. 'Caught' does not appear because the error is non-terminating.`,
        },
        {
          think: `I add -ErrorAction Stop so this specific command converts its failure into a terminating error.`,
          action: `try { Get-Item -Path 'C:\\Nope\\a.txt' -ErrorAction Stop } catch { 'Caught' }`,
          result: `Caught, and no red text.`,
        },
        {
          think: `A useful catch tells me why. The ErrorRecord is in $_, and its Exception.Message is the plain-English reason.`,
          action: `try { Get-Item -Path 'C:\\Nope\\a.txt' -ErrorAction Stop } catch { $_.Exception.Message }`,
          result: `Cannot find path 'C:\\Nope\\a.txt' because it does not exist.`,
        },
        {
          think: `For many items, try/catch goes inside the loop so each item is judged on its own and the rest keep going.`,
          action: `$paths = 'C:\\Windows\\notepad.exe', 'C:\\Nope\\a.txt', 'C:\\Windows\\explorer.exe'\nforeach ($p in $paths) {\n  try { Get-Item -Path $p -ErrorAction Stop | Select-Object Name, Length }\n  catch { Write-Warning "Skipped '$p': $($_.Exception.Message)" }\n}`,
          result: `Two file rows and one yellow warning in the middle. The loop never stopped.`,
        },
        {
          think: `I repeat -ErrorAction Stop on every call. Since the options are the same each time, a splat hashtable keeps them in one place.`,
          action: `$common = @{ ErrorAction = 'Stop' }\ntry { Get-Item -Path 'C:\\Nope\\a.txt' @common } catch { Write-Warning $_.Exception.Message } finally { 'Finished checking' }`,
          result: `A warning with the reason, then Finished checking, because finally always runs.`,
        },
      ],
      takeaway: `Decide per command: add -ErrorAction Stop where you want catch to run, put try/catch inside loops, read $_.Exception.Message, and keep shared options in a splat hashtable.`,
    },
    checkpoints: [
      {
        question: `Why does try { Get-Service NoSuchService } catch { 'Failed' } not print Failed?`,
        hint: `Think about what kind of error Get-Service raises by default.`,
        answer: `Get-Service writes a non-terminating error by default, so PowerShell prints the red message and continues. catch only runs for terminating errors. Adding -ErrorAction Stop fixes it.`,
      },
      {
        question: `Inside a catch block, which automatic variable holds the error and which property gives the readable reason?`,
        hint: `It is a single character variable, and the reason lives on its Exception.`,
        answer: `$_ (also $PSItem) holds the ErrorRecord, and $_.Exception.Message is the readable reason. $Error[0] is the most recent error too.`,
      },
      {
        question: `You have $opts = @{ Name = 'explorer'; ErrorAction = 'SilentlyContinue' }. Write the correct call to Get-Process and explain the symbol.`,
        hint: `You define with a dollar sign. How do you unpack?`,
        answer: `Get-Process @opts. The @ unpacks each hashtable key into a parameter (-Name explorer -ErrorAction SilentlyContinue). Using $opts would pass the hashtable as one value instead.`,
      },
    ],
    challenge: {
      brief: `Write a script that reads the first line of three files, one of which is missing. Use a splatted hashtable for the shared Get-Content options, catch only the "path not found" case with a specific message, catch anything else generically, and use finally to print how many files were processed.`,
      hints: [
        `Create a hashtable with ErrorAction = 'Stop' and TotalCount = 1, then splat it onto Get-Content.`,
        `A missing path raises [System.Management.Automation.ItemNotFoundException], so you can write a typed catch before a general catch.`,
        `Increment a counter in the loop (outside the try or in finally) and print it after the loop or in finally.`,
      ],
      solution: `$opts  = @{ ErrorAction = 'Stop'; TotalCount = 1 }\n$files = 'C:\\Windows\\win.ini', 'C:\\Nope\\missing.txt', 'C:\\Windows\\System32\\drivers\\etc\\hosts'\n$count = 0\nforeach ($f in $files) {\n  try {\n    Get-Content -Path $f @opts\n  } catch [System.Management.Automation.ItemNotFoundException] {\n    Write-Warning "Not found: $f"\n  } catch {\n    Write-Warning "Unexpected error for '$f': $($_.Exception.Message)"\n  } finally {\n    $count++\n  }\n}\n"Processed $count files"`,
      why: `-ErrorAction Stop makes missing paths terminating so catch runs. The typed catch handles the one error you expect, the generic catch is your safety net, and finally runs for each file so the counter is always correct.`,
    },
    teachBack: `Explain to a friend who only knows "a program either works or crashes" why PowerShell has two kinds of errors, why try/catch needs -ErrorAction Stop, and how splatting replaces long lines of backticks.`,
    diagrams: [
      {
        kind: 'sequence',
        title: `Where an error goes`,
        caption: `The same failing command behaves very differently depending on -ErrorAction. Follow the messages to see why catch only runs for terminating errors.`,
        actors: [
          { name: `try block`, sub: `your command`, tone: 'blue' },
          { name: `Cmdlet`, sub: `Get-Item`, tone: 'cyan' },
          { name: `Error stream`, sub: `red text`, tone: 'red' },
          { name: `catch block`, sub: `your handler`, tone: 'green' },
          { name: `finally block`, sub: `always runs`, tone: 'amber' },
        ],
        messages: [
          {
            from: 0,
            to: 1,
            label: `Run Get-Item on a bad path`,
            detail: `Your code calls the cmdlet inside try, with or without -ErrorAction Stop.`,
          },
          {
            from: 1,
            to: 2,
            label: `Default: write error, go on`,
            detail: `Without Stop the error is non-terminating: red text goes to the error stream and the script continues. catch is skipped.`,
          },
          {
            from: 1,
            to: 3,
            label: `With Stop: terminating`,
            detail: `-ErrorAction Stop promotes the failure to a terminating error, so PowerShell jumps straight to catch.`,
          },
          {
            from: 3,
            to: 3,
            label: `Read $_.Exception.Message`,
            detail: `$_ is the ErrorRecord. Log it, warn the user, or choose a fallback.`,
          },
          {
            from: 3,
            to: 4,
            label: `Handler done`,
            detail: `Control moves on to finally once catch finishes.`,
          },
          {
            from: 4,
            to: 4,
            label: `Cleanup always runs`,
            detail: `finally runs after success, after a handled error and after an unhandled terminating error. Close files and sessions here.`,
          },
        ],
      },
      {
        kind: 'compare',
        title: `Terminating or not?`,
        caption: `The two error kinds decide whether catch ever runs. Most cmdlet failures are the left column until you promote them.`,
        left: {
          heading: `Non-terminating error`,
          tone: 'amber',
          rows: [
            { label: `Default for`, value: `Most cmdlet failures` },
            { label: `What you see`, value: `Red text, script goes on` },
            { label: `Does catch run?`, value: `No` },
            { label: `Make it stop`, value: `-ErrorAction Stop` },
          ],
        },
        right: {
          heading: `Terminating error`,
          tone: 'red',
          rows: [
            { label: `Raised by`, value: `throw, parse errors, -ErrorAction Stop` },
            { label: `What you see`, value: `Execution jumps away` },
            { label: `Does catch run?`, value: `Yes, then finally` },
            { label: `Read the reason`, value: `$_.Exception.Message` },
          ],
        },
        verdict: `If a catch block never fires, suspect a non-terminating error first and add -ErrorAction Stop to that one command.`,
      },
      {
        kind: 'compare',
        title: `Backticks versus splatting`,
        caption: `The command is identical. Only the way parameters are passed changes, and splatting is easier to read, edit and reuse.`,
        left: {
          heading: `Backtick line continuation`,
          tone: 'red',
          rows: [
            { label: `Fragile`, value: `A space after the backtick breaks it` },
            { label: `Editing`, value: `Hard to comment out one line` },
            { label: `Reuse`, value: `Copy and paste the whole line` },
            { label: `Dynamic`, value: `Cannot add parameters conditionally` },
          ],
        },
        right: {
          heading: `Splatting with @params`,
          tone: 'green',
          rows: [
            { label: `Robust`, value: `A hashtable of key and value pairs` },
            { label: `Editing`, value: `Comment out or change one line` },
            { label: `Reuse`, value: `Pass the same table to many calls` },
            { label: `Dynamic`, value: `Add keys with if statements` },
          ],
        },
        verdict: `Define with a dollar sign ($params = @{...}) and splat with an at sign (Cmdlet @params).`,
      },
    ],
  },

  // ==========================================================================
  // 14-2  Advanced functions and toolmaking
  // ==========================================================================
  '14-2': {
    hook: `Native cmdlets accept pipeline input, show -Verbose output and honor -WhatIf. What is the smallest change that turns your own function into something that behaves like one of them?`,
    mentalModel: `Think of an advanced function as a small factory with a front desk. The front desk (the PowerShell parameter binder) checks the order form, rejects bad entries, and hands each piped item to your assembly line one at a time. begin is opening the factory, process is the assembly line that runs once per item, and end is closing up.`,
    misconceptions: [
      {
        myth: `If I mark a parameter ValueFromPipeline, my function handles every piped item automatically.`,
        truth: `Without a process block your code runs once, in the end block, and only sees the last item. Put the per-item logic inside process { } so it runs once for each object.`,
        test: `Run function Show-Name { param([Parameter(ValueFromPipeline)]$Name) $Name }; 'a','b','c' | Show-Name. Only c appears. Wrap $Name in process { } and a, b and c all appear.`,
      },
      {
        myth: `Adding [CmdletBinding()] gives me -WhatIf for free.`,
        truth: `-WhatIf and -Confirm exist only when you write [CmdletBinding(SupportsShouldProcess)], and they only protect an action you wrap in if ($PSCmdlet.ShouldProcess(target, action)) { ... }.`,
        test: `Define function Test-It { [CmdletBinding()] param() 'hi' } then run Test-It -WhatIf. You get "A parameter cannot be found that matches parameter name 'WhatIf'".`,
      },
      {
        myth: `Function names are just labels, so Fetch-Report or Do-Stuff is fine.`,
        truth: `Public commands should be Verb-SingularNoun with an approved verb. Approved verbs keep your tools predictable and discoverable, and Import-Module warns when a module exports an unapproved verb.`,
        test: `Run Get-Verb | Where-Object Verb -eq 'Fetch' (no result), then Get-Verb | Where-Object Verb -eq 'Get' to see the approved alternative and its group.`,
      },
    ],
    workedExample: {
      goal: `Build a small read-only tool, Test-LabPort, that accepts server names from the pipeline, validates the port, supports -Verbose and returns clean objects.`,
      steps: [
        {
          think: `I begin with the contract: an approved verb, a Mandatory pipeline parameter and a validated port. Help text goes first so Get-Help works on day one.`,
          action: `function Test-LabPort {\n  <#\n    .SYNOPSIS\n    Tests whether a TCP port answers on one or more computers.\n    .EXAMPLE\n    'localhost' | Test-LabPort -Port 5985 -Verbose\n  #>\n  [CmdletBinding()]\n  param(\n    [Parameter(Mandatory, ValueFromPipeline, ValueFromPipelineByPropertyName)]\n    [ValidateNotNullOrEmpty()]\n    [string[]]$ComputerName,\n\n    [ValidateRange(1, 65535)]\n    [int]$Port = 5985\n  )`,
          result: `Nothing runs yet. The parameter block alone gives you -Verbose, -ErrorAction and validation.`,
        },
        {
          think: `begin runs once, so it is the place for one-off setup and a verbose message that confirms the settings.`,
          action: `  begin {\n    Write-Verbose "Testing port $Port"\n  }`,
          result: `Quiet by default, and visible only when the caller passes -Verbose.`,
        },
        {
          think: `Per-item work goes into process. I loop over $ComputerName because a parameter can bind an array, and I output an object instead of text.`,
          action: `  process {\n    foreach ($c in $ComputerName) {\n      Write-Verbose "Checking $c"\n      $ok = Test-NetConnection -ComputerName $c -Port $Port -InformationLevel Quiet -WarningAction SilentlyContinue\n      [pscustomobject]@{ ComputerName = $c; Port = $Port; Open = $ok }\n    }\n  }`,
          result: `One object per computer. They can be sorted, filtered or exported later.`,
        },
        {
          think: `end is for a summary or cleanup. I keep it simple and close the function.`,
          action: `  end {\n    Write-Verbose 'Done'\n  }\n}`,
          result: `The function is defined in your session.`,
        },
        {
          think: `Time to prove it, using the pipeline, -Verbose and a bad port to see validation fire.`,
          action: `'localhost', '127.0.0.1' | Test-LabPort -Port 5985 -Verbose\nTest-LabPort -ComputerName localhost -Port 70000`,
          result: `Two result objects with VERBOSE lines, then a validation error saying 70000 does not belong to the range 1 to 65535.`,
        },
        {
          think: `The last check is documentation, because a tool without help is only half finished.`,
          action: `Get-Help Test-LabPort -Examples`,
          result: `Your own EXAMPLE text, rendered like a Microsoft cmdlet.`,
        },
      ],
      takeaway: `Parameter attributes validate and bind, begin/process/end handle the stream, Write-Verbose gives quiet diagnostics, and comment-based help makes the tool self-documenting.`,
    },
    checkpoints: [
      {
        question: `What is the difference between begin, process and end when 3 names are piped in?`,
        hint: `Count how many times each block runs.`,
        answer: `begin runs once before the first item, process runs three times (once per item) and end runs once after the last item.`,
      },
      {
        question: `What two things must be present for -WhatIf to actually protect a risky action in your function?`,
        hint: `One goes in the attribute and one goes around the action.`,
        answer: `[CmdletBinding(SupportsShouldProcess)] to expose -WhatIf and -Confirm, and a call such as if ($PSCmdlet.ShouldProcess($target, 'Action')) { ... } wrapped around the risky command.`,
      },
      {
        question: `What does [ValidateSet('Dev','Lab','Prod')] give you besides rejecting bad values?`,
        hint: `Think of what happens when you press Tab on the command line.`,
        answer: `It also enables Tab completion of those exact values and shows them in help, so the allowed choices are discoverable.`,
      },
    ],
    challenge: {
      brief: `Write Get-LabFileAge, an advanced function that takes file paths from the pipeline (and by property name from Get-ChildItem output), requires a non-empty Path, has an -OlderThanDays parameter limited to 1 to 3650, writes verbose messages and returns the Name and age in days of files older than the limit. It must be read-only.`,
      hints: [
        `Use [Parameter(Mandatory, ValueFromPipeline, ValueFromPipelineByPropertyName)] and the alias attribute [Alias('FullName')] on the Path parameter so Get-ChildItem output binds.`,
        `Put the per-file logic in process { }, using Get-Item -LiteralPath and compare LastWriteTime with (Get-Date).AddDays(-$OlderThanDays).`,
        `Return [pscustomobject]@{ Name = ...; AgeDays = ... } and use Write-Verbose for diagnostics instead of Write-Host.`,
      ],
      solution: `function Get-LabFileAge {\n  <#\n    .SYNOPSIS\n    Lists files older than a given number of days.\n    .EXAMPLE\n    Get-ChildItem C:\\Windows\\Logs -File | Get-LabFileAge -OlderThanDays 30 -Verbose\n  #>\n  [CmdletBinding()]\n  param(\n    [Parameter(Mandatory, ValueFromPipeline, ValueFromPipelineByPropertyName)]\n    [Alias('FullName')]\n    [ValidateNotNullOrEmpty()]\n    [string[]]$Path,\n\n    [ValidateRange(1, 3650)]\n    [int]$OlderThanDays = 30\n  )\n  begin   { $limit = (Get-Date).AddDays(-$OlderThanDays) }\n  process {\n    foreach ($p in $Path) {\n      Write-Verbose "Checking $p"\n      $item = Get-Item -LiteralPath $p -ErrorAction Stop\n      if ($item.LastWriteTime -lt $limit) {\n        [pscustomobject]@{ Name = $item.Name; AgeDays = [int]((Get-Date) - $item.LastWriteTime).TotalDays }\n      }\n    }\n  }\n}`,
      why: `The alias lets objects from Get-ChildItem bind by property name, begin computes the cutoff once, and process checks each file separately. Validation, -Verbose and help all come from the attributes, with no state changed.`,
    },
    teachBack: `Explain to a friend who only knows simple scripts how an advanced function differs from a plain one, what begin, process and end are for, and why -WhatIf needs both an attribute and a check inside your code.`,
    diagrams: [
      {
        kind: 'layers',
        title: `What PowerShell wraps around your function`,
        caption: `Your logic sits at the bottom of the stack. Everything above it is provided for free by attributes, which is why advanced functions behave like compiled cmdlets.`,
        traceLabel: `Trace one piped value`,
        layers: [
          {
            label: `Pipeline input`,
            sub: `'SRV01' | Test-LabPort`,
            detail: `Objects arrive one at a time from the command on the left of the pipe.`,
            tone: 'blue',
          },
          {
            label: `Parameter binder`,
            sub: `ValueFromPipeline`,
            detail: `PowerShell matches each incoming object to a parameter by value or by property name, and prompts for Mandatory parameters that are missing.`,
            tone: 'cyan',
          },
          {
            label: `Validation attributes`,
            sub: `ValidateSet and Range`,
            detail: `Bad values are rejected before your code starts, with a clear error and Tab completion for ValidateSet.`,
            tone: 'amber',
          },
          {
            label: `Common parameters`,
            sub: `Verbose, ErrorAction`,
            detail: `[CmdletBinding()] adds -Verbose, -Debug, -ErrorAction, -WarningAction and more, which Write-Verbose and friends respect.`,
            tone: 'violet',
          },
          {
            label: `ShouldProcess guard`,
            sub: `WhatIf and Confirm`,
            detail: `With SupportsShouldProcess, your code asks permission before a risky action, and -WhatIf makes the answer a dry run.`,
            tone: 'red',
          },
          {
            label: `Your process block`,
            sub: `runs once per item`,
            detail: `Finally your code runs for this single object, and returns a result object to the next stage.`,
            tone: 'green',
          },
        ],
      },
      {
        kind: 'sequence',
        title: `begin, process and end in time`,
        caption: `With three names piped in, process runs three times while begin and end each run once.`,
        actors: [
          { name: `Pipeline`, sub: `'A','B','C'`, tone: 'blue' },
          { name: `begin`, sub: `once`, tone: 'cyan' },
          { name: `process`, sub: `once per item`, tone: 'green' },
          { name: `end`, sub: `once`, tone: 'amber' },
        ],
        messages: [
          {
            from: 0,
            to: 1,
            label: `Pipeline starts`,
            detail: `Before any item arrives, begin runs once for setup such as opening a connection or computing a cutoff date.`,
          },
          {
            from: 0,
            to: 2,
            label: `Item A arrives`,
            detail: `process runs with the first object bound to your parameter.`,
          },
          {
            from: 0,
            to: 2,
            label: `Item B arrives`,
            detail: `process runs again, with fresh values for the parameters.`,
          },
          {
            from: 0,
            to: 2,
            label: `Item C arrives`,
            detail: `A third run of process. Results flow downstream immediately, they are not held until the end.`,
          },
          {
            from: 0,
            to: 3,
            label: `Input is exhausted`,
            detail: `After the last item, end runs once for totals and cleanup.`,
          },
        ],
      },
    ],
  },
};
