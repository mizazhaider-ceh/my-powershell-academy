import React, { useState } from 'react';
import { CheckCircle2, ChevronRight, Clock, Code2 } from 'lucide-react';
import { chapters } from '../../data/chapters';
import { TrackCategory } from '../../types';
import { ModuleIllustration } from '../diagrams/ModuleIllustration';

interface ModuleGridSectionProps {
  onNavigate: (path: string) => void;
  completedIds: string[];
}

export const ModuleGridSection: React.FC<ModuleGridSectionProps> = ({
  onNavigate,
  completedIds,
}) => {
  const [activeTrack, setActiveTrack] = useState<'All' | TrackCategory>('All');

  const filteredChapters =
    activeTrack === 'All'
      ? chapters
      : chapters.filter((ch) => ch.track === activeTrack);

  return (
    <div className="space-y-6 pt-4 border-t border-black/10 dark:border-white/10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <span className="text-[0.75rem] font-mono font-extrabold uppercase tracking-wider text-[var(--dp-color-accent)]">
            Step-by-Step Illustrated Curriculum · 16 Modules · 35 Deep-Dive Lessons
          </span>
          <h2 className="text-[1.75rem] sm:text-[2.125rem] font-extrabold leading-tight">
            Complete A-to-Z Study Sequence
          </h2>
          <p className="text-[0.9375rem] text-[var(--dp-color-ink-secondary)] font-medium max-w-[44rem]">
            Every module card includes a custom architecture visual, core
            cmdlet badges, and step-by-step lessons. Follow 01 to 16 in order or
            filter by track:
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {(
            [
              'All',
              'Windows Internals',
              'Advanced Object Pipeline',
              'Systems & Fleet Automation',
              'PowerShell for Ethical Hackers',
            ] as const
          ).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setActiveTrack(t)}
              className={`px-3.5 py-2 rounded-full text-[0.8125rem] font-extrabold cursor-pointer ${
                activeTrack === t
                  ? 'clay-btn-pink text-white'
                  : 'clay-btn-secondary'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Illustrated 16-Module Grid: Every Chapter Card Features Its Own Bespoke Illustration */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredChapters.map((ch) => {
          const doneInCh = ch.lessons.filter((sub) =>
            completedIds.includes(sub.id)
          ).length;
          return (
            <article
              key={ch.id}
              onClick={() => onNavigate(`/learn/${ch.slug}`)}
              className="clay-well p-5 sm:p-6 rounded-[2rem] hover:bg-[#e2ebfc] dark:hover:bg-white/5 transition-all cursor-pointer group flex flex-col justify-between gap-4 clay-card-interactive"
            >
              <div className="space-y-3.5">
                {/* Custom 3D Claymorphic Architectural Illustration for This Specific Module */}
                <ModuleIllustration moduleNumber={ch.number} />

                <div className="flex items-center justify-between gap-2 text-[0.75rem] font-mono font-extrabold pt-1">
                  <span className="flex items-center gap-2">
                    <span className="guide-num-badge">
                      {ch.number < 10 ? `0${ch.number}` : ch.number}
                    </span>
                    <span className="text-[var(--dp-color-accent)]">
                      {ch.track}
                    </span>
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full clay-pill text-[0.75rem]">
                    {ch.difficulty}
                  </span>
                </div>

                <h3 className="text-[1.22rem] font-extrabold leading-snug group-hover:text-[var(--dp-color-accent)] transition-colors">
                  {ch.title}
                </h3>
                <p className="text-[0.9rem] text-[var(--dp-color-ink-secondary)] font-medium leading-relaxed">
                  {ch.subtitle}
                </p>

                {/* Featured Cmdlets Preview */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {ch.relatedCmdlets.slice(0, 4).map((cmd) => (
                    <span
                      key={cmd}
                      className="px-2.5 py-0.5 rounded-full clay-card font-mono text-[0.72rem] font-extrabold text-[var(--dp-color-accent)] inline-flex items-center gap-1"
                    >
                      <Code2 className="w-3 h-3" />
                      {cmd}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3.5 border-t border-black/10 dark:border-white/10 flex items-center justify-between text-[0.8125rem] font-mono font-extrabold">
                <span className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 opacity-75" />
                  <span>
                    {ch.lessons.length} Lessons · {ch.estimatedMinutes} min
                  </span>
                  {doneInCh > 0 && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full clay-cushion-mint text-[0.7rem]">
                      <CheckCircle2 className="w-3 h-3" />
                      {doneInCh}/{ch.lessons.length}
                    </span>
                  )}
                </span>
                <span className="flex items-center gap-1 text-[var(--dp-color-accent)]">
                  <span>Open Module</span>
                  <ChevronRight className="w-4 h-4" />
                </span>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};
