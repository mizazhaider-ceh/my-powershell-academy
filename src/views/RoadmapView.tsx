import React from 'react';
import { Target, ArrowRight, Layers, Shield, Cpu, Server } from 'lucide-react';
import { chapters } from '../data/chapters';
import { ModuleIllustration } from '../components/diagrams/ModuleIllustration';

interface RoadmapViewProps {
  onNavigate: (path: string) => void;
}

interface Phase {
  number: number;
  title: string;
  subtitle: string;
  description: string;
  cushionClass: string;
  icon: React.ComponentType<{ className?: string }>;
  chapterNumbers: number[];
}

const PHASES: Phase[] = [
  {
    number: 1,
    title: 'Track 1: Windows Internals',
    subtitle: 'Modules 01 to 02 · How One Windows Machine Works',
    description:
      'NT kernel convergence, the Golden Rule of Least Privilege, living processes (PIDs, threads, handle tables, access tokens), 4 KB virtual memory paging, User Mode vs Kernel Mode syscalls through NTDLL.DLL, the 7 core system processes, and UEFI/GPT boot defenses.',
    cushionClass: 'clay-cushion-mint',
    icon: Cpu,
    chapterNumbers: [1, 2],
  },
  {
    number: 2,
    title: 'Track 2: Advanced Object Pipeline',
    subtitle: 'Modules 03 to 07 · How PowerShell Thinks in Objects',
    description:
      'PowerShell 5.1 vs 7.5, the Verb-SingularNoun law, the Self-Reliance Pocketknife (Get-Command, Get-Help, Get-Member), calculated properties, [PSCustomObject], ByValue vs ByPropertyName parameter binding, zero-indexed arrays, quotes, SecureString, and "Filter Left, Format Right".',
    cushionClass: 'clay-cushion-warm',
    icon: Layers,
    chapterNumbers: [3, 4, 5, 6, 7],
  },
  {
    number: 3,
    title: 'Track 3: Systems & Fleet Automation',
    subtitle: 'Modules 08 to 14 · Managing Many Windows Machines',
    description:
      'Navigate the Registry and OS as PSDrives, build a headless Windows Server Core host from scratch (configureCoreServerBasic.ps1), write .ps1 scripts with loops and Execution Policies, scale across servers via WinRM Remoting (ports 5985/5986), and manage Active Directory, DNS, GPO, and Scheduled Tasks.',
    cushionClass: 'clay-cushion-cool',
    icon: Server,
    chapterNumbers: [8, 9, 10, 11, 12, 13, 14],
  },
  {
    number: 4,
    title: 'Track 4: PowerShell for Ethical Hackers',
    subtitle: 'Modules 15 to 16 · Offensive Recon & Blue Team Defense',
    description:
      'Enumerate local privileges, unquoted service paths, and Active Directory Kerberoastable SPNs using native .NET [adsisearcher] without RSAT, decode -EncodedCommand cradles, trace how AMSI scans in-memory code, and lock down endpoints with Script Block Logging (Event ID 4104), CLM, and JEA.',
    cushionClass: 'clay-cushion-lavender',
    icon: Shield,
    chapterNumbers: [15, 16],
  },
];

export const RoadmapView: React.FC<RoadmapViewProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-[66rem] mx-auto px-3 sm:px-6 py-6 space-y-8">
      {/* PowerShell Deep Blue Header Cushion */}
      <header className="clay-cushion-pink p-7 sm:p-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-3 max-w-[38rem]">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full clay-pill text-[0.8125rem] font-mono font-extrabold text-[var(--dp-color-accent)]">
            <Target className="w-4 h-4" />
            <span>Step-by-Step Study Sequence · By Muhammad Izaz Haider</span>
          </div>
          <h1 className="text-[2rem] sm:text-[2.625rem] font-extrabold text-[var(--dp-color-ink)] leading-tight">
            Zero-to-Pro Engineering Roadmap
          </h1>
          <p className="text-[1.0625rem] text-[var(--dp-color-ink-secondary)] font-medium leading-relaxed">
            Follow these 4 progressive tracks from A to Z: start with how one
            Windows machine thinks, master the object pipeline, build headless
            servers and Active Directory domains, and finish with Ethical
            Hacking and Blue Team forensics.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            onNavigate(
              '/learn/chapter-01/windows-evolution-and-least-privilege'
            )
          }
          className="clay-btn-primary px-6 py-3.5 text-[0.9375rem] flex items-center gap-2 self-start md:self-auto cursor-pointer whitespace-nowrap"
        >
          <span>Begin Module 01</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </header>

      {/* Tracks Progression Inside Shared Tray */}
      <div className="clay-tray p-6 sm:p-10 space-y-10">
        {PHASES.map((phase) => {
          const Icon = phase.icon;
          const phaseChapters = chapters.filter((c) =>
            phase.chapterNumbers.includes(c.number)
          );

          return (
            <section key={phase.number} className="space-y-5">
              <div className={`${phase.cushionClass} p-6 space-y-2`}>
                <div className="flex items-center gap-2.5 text-[0.75rem] font-mono font-extrabold uppercase">
                  <Icon className="w-4 h-4" />
                  <span>{phase.subtitle}</span>
                </div>
                <h2 className="text-[1.5rem] font-extrabold">{phase.title}</h2>
                <p className="text-[0.9375rem] font-medium leading-relaxed">
                  {phase.description}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {phaseChapters.map((ch) => (
                  <div
                    key={ch.id}
                    onClick={() => onNavigate(`/learn/${ch.slug}`)}
                    className="clay-well p-5 rounded-[1.75rem] hover:bg-[#dbeafe] dark:hover:bg-white/5 transition-all cursor-pointer group flex flex-col justify-between gap-4 clay-card-interactive"
                  >
                    <div className="space-y-3">
                      <ModuleIllustration moduleNumber={ch.number} />
                      <div className="flex items-center justify-between text-[0.75rem] font-mono font-extrabold pt-1">
                        <span className="guide-num-badge">
                          Module {ch.number < 10 ? `0${ch.number}` : ch.number}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full clay-pill">
                          {ch.difficulty}
                        </span>
                      </div>
                      <h3 className="text-[1.125rem] font-extrabold group-hover:text-[var(--dp-color-accent)] transition-colors">
                        {ch.title}
                      </h3>
                      <p className="text-[0.875rem] text-[var(--dp-color-ink-secondary)] font-medium leading-relaxed">
                        {ch.subtitle}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-black/10 dark:border-white/10 flex items-center justify-between text-[0.78rem] font-mono font-extrabold">
                      <span>
                        {ch.lessons.length} lessons · {ch.estimatedMinutes} min
                      </span>
                      <span className="flex items-center gap-1 text-[var(--dp-color-accent)]">
                        <span>Open Module</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
};
