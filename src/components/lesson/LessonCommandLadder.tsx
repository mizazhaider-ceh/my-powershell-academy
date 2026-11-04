import React, { useState } from 'react';
import { Sprout, Wrench, Crown, Flag } from 'lucide-react';
import { GuideCommand, GuideTier, LessonGuide } from '../../types';
import { CodeBlock } from '../common/CodeBlock';
import { formatInlineRichText } from './formatInlineRichText';

type TierKey = 'beginner' | 'intermediate' | 'pro';

const TIERS: { key: TierKey; label: string; hint: string; icon: React.ReactNode }[] = [
  { key: 'beginner', label: 'Beginner', hint: 'Safe, read-only first steps', icon: <Sprout className="w-4 h-4" /> },
  { key: 'intermediate', label: 'Intermediate', hint: 'Pipelines, filters & real admin work', icon: <Wrench className="w-4 h-4" /> },
  { key: 'pro', label: 'Pro', hint: 'Scripts, automation & hardening', icon: <Crown className="w-4 h-4" /> },
];


const CommandCard: React.FC<{ command: GuideCommand; index: number }> = ({ command, index }) => (
  <div className="clay-well p-5 sm:p-6 space-y-4">
    <h4 className="text-[1.125rem] font-bold flex items-center gap-2.5">
      <span className="px-2.5 py-0.5 rounded-full clay-btn-pink text-[#383139] font-mono text-[0.75rem]">
        #{index + 1}
      </span>
      <span>{command.title}</span>
    </h4>
    <CodeBlock code={command.code} output={command.sampleOutput} title={command.title} language="powershell" />
    <p className="text-[0.9375rem] leading-relaxed">
      <strong>What it does:</strong> {formatInlineRichText(command.whatItDoes)}
    </p>
    {command.parts.length > 0 && (
      <div className="clay-cushion-mint p-4 space-y-2">
        <span className="text-[0.75rem] font-mono font-extrabold uppercase tracking-wider block">
          Piece by piece
        </span>
        <ul className="space-y-1.5 text-[0.9375rem] leading-relaxed">
          {command.parts.map((p, i) => (
            <li key={i} className="flex flex-col sm:flex-row sm:gap-3">
              <code className="font-mono font-bold text-[0.875rem] sm:min-w-[11rem] sm:max-w-[14rem] break-words">
                {p.part}
              </code>
              <span>{formatInlineRichText(p.meaning)}</span>
            </li>
          ))}
        </ul>
      </div>
    )}
    {command.watchOut && (
      <div className="clay-cushion-lavender p-4 text-[0.9375rem] leading-relaxed">
        <strong>âš ï¸ Watch out:</strong> {formatInlineRichText(command.watchOut)}
      </div>
    )}
  </div>
);

const TierPanel: React.FC<{ tier: GuideTier }> = ({ tier }) => (
  <div className="space-y-5">
    <p className="text-[1rem] leading-relaxed opacity-90">{formatInlineRichText(tier.intro)}</p>
    {tier.commands.map((c, i) => (
      <CommandCard key={i} command={c} index={i} />
    ))}
  </div>
);

export const LessonCommandLadder: React.FC<{ guide: LessonGuide }> = ({ guide }) => {
  const [active, setActive] = useState<TierKey>('beginner');

  return (
    <section
      id="sec-ladder"
      aria-labelledby="lesson-ladder-heading"
      className="clay-tray p-6 sm:p-10 space-y-6"
    >
      <div className="flex items-center gap-3">
        <span className="guide-num-badge">
          <Flag className="w-5 h-5" />
        </span>
        <div>
          <span className="text-[0.75rem] font-mono uppercase tracking-wider font-bold opacity-75 block">
            Beginner â†’ Intermediate â†’ Pro
          </span>
          <h2 id="lesson-ladder-heading" className="text-[1.5rem] sm:text-[1.75rem] font-bold">
            The Command Ladder: Every Command Explained
          </h2>
        </div>
      </div>

      <div role="tablist" aria-label="Skill level" className="flex flex-wrap gap-2">
        {TIERS.map((t) => (
          <button
            key={t.key}
            type="button"
            role="tab"
            aria-selected={active === t.key}
            onClick={() => setActive(t.key)}
            className={`px-4 py-2 rounded-full text-[0.875rem] font-bold flex items-center gap-2 cursor-pointer transition-colors ${
              active === t.key ? 'clay-btn-primary' : 'clay-well hover:bg-[#dbeafe]'
            }`}
          >
            {t.icon}
            <span>{t.label}</span>
          </button>
        ))}
      </div>
      <p className="text-[0.8125rem] font-mono opacity-75">
        {TIERS.find((t) => t.key === active)?.hint}
      </p>

      <div role="tabpanel">
        <TierPanel tier={guide[active]} />
      </div>

      <div className="clay-cushion-cool p-5 space-y-2">
        <span className="text-[0.75rem] font-mono font-extrabold uppercase tracking-wider block">
          Quick Recap
        </span>
        <ul className="list-disc pl-5 space-y-1 text-[0.9375rem] leading-relaxed">
          {guide.recap.map((r, i) => (
            <li key={i}>{formatInlineRichText(r)}</li>
          ))}
        </ul>
      </div>
    </section>
  );
};
