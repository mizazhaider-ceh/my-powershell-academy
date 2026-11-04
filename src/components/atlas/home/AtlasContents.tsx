import React, { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { chapters } from '../../../data/chapters';
import { TrackCategory } from '../../../types';
import { ModuleIllustration } from '../../diagrams/ModuleIllustration';

interface AtlasContentsProps {
  onNavigate: (path: string) => void;
  completedIds: string[];
}

const TRACKS: TrackCategory[] = [
  'Windows Internals',
  'Advanced Object Pipeline',
  'Systems & Fleet Automation',
  'PowerShell for Ethical Hackers',
];

const pad = (n: number) => String(n).padStart(2, '0');

/** The curriculum as a table of contents. Hovering a module previews it on the right. */
export const AtlasContents: React.FC<AtlasContentsProps> = ({ onNavigate, completedIds }) => {
  const [activeId, setActiveId] = useState(chapters[0].id);
  const active = chapters.find((c) => c.id === activeId) ?? chapters[0];

  return (
    <section className="space-y-8 hx-reveal" aria-labelledby="contents-heading">
      <div className="max-w-[40rem] space-y-2">
        <h2 id="contents-heading" className="text-[1.75rem] sm:text-[2.5rem] font-semibold leading-tight">
          The curriculum, start to finish
        </h2>
        <p className="text-[var(--dp-color-ink-secondary)]">
          Sixteen modules in four tracks. Follow them in order, or jump straight to what you need.
        </p>
      </div>

      <div className="ah-contents">
        <div className="space-y-10">
          {TRACKS.map((track, t) => {
            const modules = chapters.filter((c) => c.track === track);
            const minutes = modules.reduce((sum, c) => sum + c.estimatedMinutes, 0);
            return (
              <div key={track}>
                <div className="ah-track-head">
                  <span className="font-mono text-[0.75rem] text-[var(--a-ink-3)]">track {pad(t + 1)}</span>
                  <h3 className="text-[1.1rem] font-semibold">{track}</h3>
                  <span className="ml-auto font-mono text-[0.75rem] text-[var(--a-ink-3)]">
                    {modules.length} modules, {Math.round(minutes / 60)} h
                  </span>
                </div>
                {modules.map((chapter) => {
                  const done = chapter.lessons.filter((l) => completedIds.includes(l.id)).length;
                  return (
                    <button
                      key={chapter.id}
                      type="button"
                      className="ah-row"
                      data-active={activeId === chapter.id}
                      onClick={() => onNavigate(`/learn/${chapter.slug}`)}
                      onMouseEnter={() => setActiveId(chapter.id)}
                      onFocus={() => setActiveId(chapter.id)}
                    >
                      <span className="ah-row-index">{pad(chapter.number)}</span>
                      <span className="ah-row-main">
                        <span className="ah-row-title">{chapter.title}</span>
                        <span className="ah-row-sub">
                          {chapter.lessons.length} lessons, {chapter.estimatedMinutes} min, {chapter.difficulty}
                        </span>
                      </span>
                      <span className="ah-dots" aria-label={`${done} of ${chapter.lessons.length} lessons completed`}>
                        {chapter.lessons.map((l) => (
                          <i key={l.id} data-done={completedIds.includes(l.id)} />
                        ))}
                      </span>
                      <ArrowUpRight className="ah-row-arrow w-4 h-4" />
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>

        <aside className="ah-preview" aria-live="polite">
          <div className="clay-card p-4 space-y-4" key={active.id}>
            <ModuleIllustration moduleNumber={active.number} className="ah-illu" />
            <div className="space-y-2">
              <span className="font-mono text-[0.75rem] text-[var(--a-ink-3)]">module {pad(active.number)}</span>
              <h3 className="text-[1.15rem] font-semibold leading-snug">{active.subtitle}</h3>
              <p className="text-[0.88rem] leading-relaxed text-[var(--dp-color-ink-secondary)]">
                {active.learningObjectives[0]}
              </p>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {active.relatedCmdlets.slice(0, 4).map((cmd) => (
                <code key={cmd} className="clay-code-inline px-2 py-0.5 text-[0.75rem]">
                  {cmd}
                </code>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
};
