import React, { useState } from 'react';
import { LOOP_MOVES } from './learningLoopData';

/** The teaching method as five interactive moves. Used on both themes' home pages. */
export const LearningLoopSection: React.FC = () => {
  const [active, setActive] = useState(0);
  const move = LOOP_MOVES[active];
  const Artifact = move.Artifact;

  return (
    <section className="space-y-6 hx-reveal" aria-labelledby="loop-heading">
      <div className="max-w-[40rem] space-y-2">
        <h2 id="loop-heading" className="text-[1.75rem] sm:text-[2.25rem] font-bold leading-tight">
          Every lesson teaches in five moves
        </h2>
        <p className="text-[var(--dp-color-ink-secondary)]">
          The same loop runs through all 35 lessons, so you always know what comes next and why it works.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[17rem_1fr]">
        <div className="flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible" role="group" aria-label="Teaching moves">
          {LOOP_MOVES.map((m, i) => (
            <button
              key={m.id}
              type="button"
              aria-pressed={active === i}
              onClick={() => setActive(i)}
              className={`shrink-0 px-4 py-3 text-left text-[0.95rem] font-semibold cursor-pointer lg:w-full flex items-center gap-3 ${
                active === i ? 'clay-btn-pink' : 'clay-well'
              }`}
            >
              <span className="font-mono text-[0.75rem] opacity-70">{String(i + 1).padStart(2, '0')}</span>
              {m.verb}
            </button>
          ))}
        </div>

        <div className="clay-card p-5 sm:p-7 grid gap-6 md:grid-cols-2" role="region" aria-label={move.verb} key={move.id}>
          <div className="space-y-3">
            <h3 className="text-[1.3rem] font-bold leading-snug">{move.title}</h3>
            <p className="text-[0.95rem] text-[var(--dp-color-ink-secondary)] leading-relaxed">{move.body}</p>
          </div>
          <div className="clay-well p-4 sm:p-5">
            <Artifact />
          </div>
        </div>
      </div>
    </section>
  );
};
