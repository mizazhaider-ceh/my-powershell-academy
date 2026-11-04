import React from 'react';
import { Bug, ShieldCheck, GitBranch, Server, Wand2, Zap, LucideIcon } from 'lucide-react';

interface LabsShowcaseProps {
  onNavigate: (path: string) => void;
}

const LABS: { icon: LucideIcon; title: string; blurb: string; skills: string[] }[] = [
  { icon: Bug, title: 'Fix Broken Scripts', blurb: 'Diagnose five real one-liners that fail silently, then repair them.', skills: ['Operators', 'Redirection'] },
  { icon: ShieldCheck, title: 'Base64 and Event 4104', blurb: 'Decode an encoded command and find its trace in the script block log.', skills: ['Logging', 'Blue team'] },
  { icon: GitBranch, title: 'Parameter Binding Tracer', blurb: 'Watch PowerShell decide which parameter each incoming object fits.', skills: ['Pipeline', 'ByValue'] },
  { icon: Server, title: 'Server Core .ps1 Builder', blurb: 'Assemble a headless Windows Server build script, one block at a time.', skills: ['Server Core', 'Networking'] },
  { icon: Wand2, title: 'Splatting and ADSI LDAP', blurb: 'Refactor long commands with splatting and query Active Directory natively.', skills: ['Splatting', 'LDAP'] },
  { icon: Zap, title: '.NET OutputType Flashcards', blurb: 'Speed drills on what each cmdlet really returns under the hood.', skills: ['Objects', 'Recall'] },
];

export const LabsShowcase: React.FC<LabsShowcaseProps> = ({ onNavigate }) => (
  <section className="space-y-6 hx-reveal" aria-labelledby="labs-heading">
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div className="max-w-[40rem] space-y-2">
        <h2 id="labs-heading" className="text-[1.75rem] sm:text-[2.25rem] font-bold leading-tight">
          Six labs where you do the work
        </h2>
        <p className="text-[var(--dp-color-ink-secondary)]">
          Reading builds recognition. These hands-on workbenches build the instinct, and they all run in your browser.
        </p>
      </div>
      <button type="button" onClick={() => onNavigate('/knowledge')} className="clay-btn-primary px-5 py-2.5 text-[0.88rem] cursor-pointer">
        Enter the labs
      </button>
    </div>

    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {LABS.map(({ icon: Icon, title, blurb, skills }) => (
        <button
          key={title}
          type="button"
          onClick={() => onNavigate('/knowledge')}
          className="clay-card clay-card-interactive p-5 text-left space-y-3 cursor-pointer"
        >
          <span className="clay-icon-tile inline-grid place-items-center w-10 h-10">
            <Icon className="w-5 h-5" />
          </span>
          <h3 className="text-[1.05rem] font-bold">{title}</h3>
          <p className="text-[0.88rem] leading-relaxed text-[var(--dp-color-ink-secondary)]">{blurb}</p>
          <div className="flex flex-wrap gap-1.5">
            {skills.map((s) => (
              <span key={s} className="clay-pill px-2.5 py-0.5 text-[0.75rem] font-mono">
                {s}
              </span>
            ))}
          </div>
        </button>
      ))}
    </div>
  </section>
);
