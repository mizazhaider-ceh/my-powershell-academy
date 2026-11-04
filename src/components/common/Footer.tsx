import React from 'react';
import {
  Shield, Terminal, Cpu, BookOpen, Code2, FlaskConical,
  Target, BookMarked, User, ArrowUp,
} from 'lucide-react';
import { FooterPocketknifeBanner } from './FooterPocketknifeBanner';

interface FooterProps {
  onNavigate: (path: string) => void;
}

const FOOTER_TRACKS = [
  { path: '/learn/chapter-01', dot: 'bg-emerald-500', label: '1. Windows Internals (Mod 01 to 02)' },
  { path: '/learn/chapter-03', dot: 'bg-amber-500', label: '2. Object Pipeline (Mod 03 to 07)' },
  { path: '/learn/chapter-08', dot: 'bg-sky-500', label: '3. Fleet Automation (Mod 08 to 14)' },
  { path: '/learn/chapter-15', dot: 'bg-indigo-500', label: '4. Ethical Hackers (Mod 15 to 16)' },
];

const FOOTER_PAGES = [
  { path: '/learn', icon: BookOpen, label: 'Full 16-Module Curriculum' },
  { path: '/roadmap', icon: Target, label: 'Visual Engineering Roadmap' },
  { path: '/commands', icon: Code2, label: 'Interactive Cmdlet Library' },
  { path: '/knowledge', icon: FlaskConical, label: '6 Cyber Labs & 30-Q Gauntlet' },
  { path: '/glossary', icon: BookMarked, label: 'Plain-English Lexicon' },
  { path: '/about', icon: User, label: 'About Muhammad Izaz Haider' },
];

const ENVIRONMENTS = [
  { icon: Cpu, label: 'PS 5.1 & 7.5 LTS' },
  { icon: Shield, label: 'AMSI + EID 4104' },
  { icon: Terminal, label: 'Server Core 2025' },
];

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const scrollToTop = () =>
    window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });

  return (
    <footer className="max-w-[76rem] mx-auto px-3 sm:px-6 pb-12 pt-8">
      <div className="clay-tray p-7 sm:p-11 lg:p-12 space-y-10">
        <FooterPocketknifeBanner />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[0.875rem] clay-btn-primary flex items-center justify-center shrink-0">
                <Terminal className="w-5 h-5 text-white stroke-[2.5]" />
              </div>
              <div>
                <span className="font-extrabold text-[1.0625rem] block leading-tight text-[var(--dp-color-ink)]">
                  PowerShell Academy
                </span>
                <span className="text-[0.78rem] font-extrabold text-[var(--dp-color-accent)]">
                  Created by Muhammad Izaz Haider
                </span>
              </div>
            </div>

            <p className="text-[0.9rem] text-[var(--dp-color-ink-secondary)] font-medium leading-relaxed">
              A complete A-to-Z systems engineering and cybersecurity platform covering the Windows NT kernel, the .NET object pipeline, headless Windows Server Core &amp; Active Directory, and Red/Blue Team PowerShell operations.
            </p>

            <div className="flex flex-wrap gap-2 pt-1">
              <span className="px-3 py-1 rounded-full clay-pill font-mono text-[0.75rem] font-extrabold text-[var(--dp-color-accent)]">
                16 Modules · 35 Lessons
              </span>
              <span className="px-3 py-1 rounded-full clay-pill font-mono text-[0.75rem] font-extrabold">
                6 Interactive Cyber Labs
              </span>
            </div>
          </div>

          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-[0.78rem] font-mono font-extrabold uppercase tracking-wider text-[var(--dp-color-accent)]">
              A-to-Z Engineering Tracks
            </h4>
            <ul className="space-y-2.5 text-[0.9rem] font-bold">
              {FOOTER_TRACKS.map((track) => (
                <li key={track.path}>
                  <button
                    type="button"
                    onClick={() => onNavigate(track.path)}
                    className="tap-target hover:text-[var(--dp-color-accent)] text-left cursor-pointer transition-colors flex items-center gap-2"
                  >
                    <span className={`w-2 h-2 rounded-full ${track.dot} shrink-0`} />
                    <span>{track.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-[0.78rem] font-mono font-extrabold uppercase tracking-wider text-[var(--dp-color-accent)]">
              Essential Academy Pages
            </h4>
            <ul className="space-y-2 text-[0.9rem] font-bold">
              {FOOTER_PAGES.map((page) => {
                const Icon = page.icon;
                return (
                  <li key={page.path}>
                    <button
                      type="button"
                      onClick={() => onNavigate(page.path)}
                      className="tap-target hover:text-[var(--dp-color-accent)] inline-flex items-center gap-2 cursor-pointer transition-colors"
                    >
                      <Icon className="w-3.5 h-3.5 text-[var(--dp-color-accent)]" />
                      <span>{page.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-[0.78rem] font-mono font-extrabold uppercase tracking-wider text-[var(--dp-color-accent)]">
              Environments
            </h4>
            <div className="space-y-2.5 text-[0.82rem] font-mono font-bold">
              {ENVIRONMENTS.map(({ icon: Icon, label }) => (
                <div key={label} className="clay-well p-3 rounded-2xl flex items-center gap-2">
                  <Icon className="w-4 h-4 text-[var(--dp-color-accent)] shrink-0" />
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-black/10 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[0.82rem] font-mono font-extrabold">
          <div className="flex flex-wrap items-center gap-2 text-[var(--dp-color-ink)]">
            <span className="text-[var(--dp-color-accent)]">&gt;_</span>
            <span>Created by Muhammad Izaz Haider</span>
            <span aria-hidden="true">·</span>
            <span className="text-[var(--dp-color-ink-secondary)]">PowerShell Academy Masterclass</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[var(--dp-color-ink-secondary)] hidden md:inline">Press Ctrl+K to search anytime</span>
            <button
              type="button"
              onClick={scrollToTop}
              className="tap-target clay-btn-secondary px-4 py-2 text-[0.78rem] font-extrabold inline-flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5 text-[var(--dp-color-accent)]" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
