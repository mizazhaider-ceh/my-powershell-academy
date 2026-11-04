import React from 'react';
import {
  Terminal,
  BookOpen,
  Target,
  Code2,
  Cpu,
  Flame,
  Layers,
  Server,
} from 'lucide-react';

interface AboutViewProps {
  onNavigate: (path: string) => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-[58rem] mx-auto px-3 sm:px-6 py-6 space-y-8">
      {/* Pink Creator Attribution Hero Cushion */}
      <div className="clay-cushion-pink p-7 sm:p-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        <div className="md:col-span-5">
          <div className="clay-card p-3">
            <div className="clay-well p-2">
              <img
                src="/assets/aistudio/image_2fc7720e.webp"
                alt="PowerShell Academy Mascot"
                referrerPolicy="no-referrer"
                className="w-full h-auto rounded-[1.25rem] object-cover"
              />
            </div>
          </div>
        </div>

        <div className="md:col-span-7 space-y-4 text-[var(--dp-color-ink)]">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full clay-pill text-[0.8125rem] font-mono font-extrabold text-[var(--dp-color-accent)]">
            <Terminal className="w-3.5 h-3.5" />
            <span>Created by Muhammad Izaz Haider</span>
          </div>

          <h1 className="text-[2rem] sm:text-[2.5rem] font-extrabold leading-tight">
            Why I Built PowerShell Academy
          </h1>

          <p className="text-[1rem] text-[var(--dp-color-ink-secondary)] font-medium leading-relaxed">
            When I started learning Windows administration and security, I
            noticed a frustrating gap: most guides either throw a list of
            disconnected PowerShell commands at you without explaining how the
            underlying Windows kernel works, or they treat PowerShell like an
            old 1980s text shell instead of a live .NET object engine.
          </p>
          <p className="text-[1rem] text-[var(--dp-color-ink-secondary)] font-medium leading-relaxed">
            I created <strong className="text-[var(--dp-color-ink)]">PowerShell Academy</strong> the exact way I wish
            someone had taught me, explaining every technical term and acronym in
            plain English first, starting with how a single Windows machine
            manages processes, threads, 4 KB virtual memory pages, NTDLL.DLL
            syscalls, and UEFI boot defenses, and building step-by-step into the
            Advanced Object Pipeline, headless Server Core builds, Active
            Directory, and PowerShell for Ethical Hackers.
          </p>
        </div>
      </div>

      {/* Shared Cream Tray: The 4 Engineering Tracks */}
      <section className="clay-tray p-6 sm:p-10 space-y-6">
        <h2 className="text-[1.625rem] font-bold">
          The 4 Deep-Dive Study Tracks
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="clay-cushion-mint p-6 space-y-2">
            <div className="flex items-center gap-2 text-[0.75rem] font-mono uppercase font-extrabold">
              <Cpu className="w-4 h-4" />
              <span>Track 1: Windows Internals (Modules 1 to 2)</span>
            </div>
            <p className="text-[0.9375rem] leading-relaxed">
              NT kernel convergence, the Golden Rule of Least Privilege,
              processes vs threads, 4 KB virtual memory paging, User Mode vs
              Kernel Mode syscalls across NTDLL.DLL, the 7 core system
              processes, service accounts, and UEFI/GPT boot defenses.
            </p>
          </div>

          <div className="clay-cushion-warm p-6 space-y-2">
            <div className="flex items-center gap-2 text-[0.75rem] font-mono uppercase font-extrabold">
              <Layers className="w-4 h-4" />
              <span>Track 2: Advanced Object Pipeline (Modules 3 to 7)</span>
            </div>
            <p className="text-[0.9375rem] leading-relaxed">
              PowerShell 5.1 vs 7.5, the Verb-SingularNoun law, my Self-Reliance
              Pocketknife (Get-Command, Get-Help, Get-Member), [PSCustomObject],
              ByValue vs ByPropertyName parameter binding, zero-indexed arrays,
              strong types, quotes, and &ldquo;Filter Left, Format Right&rdquo;.
            </p>
          </div>

          <div className="clay-cushion-cool p-6 space-y-2">
            <div className="flex items-center gap-2 text-[0.75rem] font-mono uppercase font-extrabold">
              <Server className="w-4 h-4" />
              <span>Track 3: Systems &amp; Fleet Automation (Modules 8 to 14)</span>
            </div>
            <p className="text-[0.9375rem] leading-relaxed">
              PSProviders &amp; Registry drives, headless Windows Server Core
              builds (configureCoreServerBasic.ps1), Execution Policies &amp;
              loops, WinRM Remoting (ports 5985/5986), Active Directory
              users/OUs/DNS/FGPP, Firewall DisplayGroups, RSoP, and
              [CmdletBinding()] toolmaking.
            </p>
          </div>

          <div className="clay-cushion-lavender p-6 space-y-2">
            <div className="flex items-center gap-2 text-[0.75rem] font-mono uppercase font-extrabold">
              <Flame className="w-4 h-4" />
              <span>Track 4: PowerShell for Ethical Hackers (Modules 15 to 16)</span>
            </div>
            <p className="text-[0.9375rem] leading-relaxed">
              Local privilege escalation recon, native .NET [adsisearcher]
              domain &amp; Kerberoasting SPN enumeration without RSAT, fileless
              IEX cradles, decoding -EncodedCommand UTF-16LE Base64, how
              amsi.dll works, Script Block Logging (Event ID 4104), Constrained
              Language Mode, and JEA.
            </p>
          </div>
        </div>

        {/* Navigation Quick Links */}
        <div className="pt-6 border-t border-black/10 dark:border-white/10 flex flex-wrap items-center justify-between gap-4">
          <div className="text-[0.875rem] font-mono font-bold">
            Created by <strong>Muhammad Izaz Haider</strong>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => onNavigate('/learn')}
              className="clay-btn-primary px-5 py-2.5 text-[0.8125rem] flex items-center gap-2 cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              <span>Explore All 16 Modules</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate('/commands')}
              className="clay-btn-secondary px-5 py-2.5 text-[0.8125rem] flex items-center gap-2 cursor-pointer"
            >
              <Code2 className="w-4 h-4" />
              <span>Cmdlet Reference</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate('/roadmap')}
              className="clay-btn-secondary px-5 py-2.5 text-[0.8125rem] flex items-center gap-2 cursor-pointer"
            >
              <Target className="w-4 h-4" />
              <span>Engineering Roadmap</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
