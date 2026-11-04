import React, { useState } from 'react';
import { Brain, Lightbulb, Eye, Check } from 'lucide-react';
import type { LessonTeaching } from '../../types';

/** Retrieval practice: try to answer first, use the hint if stuck, then check yourself. */
export const TeacherCheckpoints: React.FC<{ items: LessonTeaching['checkpoints'] }> = ({ items }) => {
  const [hints, setHints] = useState<Record<number, boolean>>({});
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const [recalled, setRecalled] = useState<Record<number, boolean>>({});
  const got = Object.values(recalled).filter(Boolean).length;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="text-[1.35rem] font-bold flex items-center gap-2">
          <Brain className="w-5 h-5 text-[var(--dp-color-accent)]" />
          Checkpoints: say it before you see it
        </h3>
        <span className="font-mono text-[0.75rem] opacity-70">
          {got} of {items.length} recalled
        </span>
      </div>
      <p className="text-[0.92rem] text-[var(--dp-color-ink-secondary)]">
        Answer out loud or on paper first. Pulling the answer from memory is what makes it stick.
      </p>

      <div className="grid gap-3">
        {items.map((item, i) => (
          <div key={item.question} className="clay-well p-4 space-y-3">
            <p className="font-semibold leading-snug">
              <span className="font-mono text-[0.75rem] opacity-60 mr-2">Q{i + 1}</span>
              {item.question}
            </p>

            {hints[i] && (
              <p className="tc-reveal text-[0.9rem] flex gap-2 text-[var(--dp-color-ink-secondary)]">
                <Lightbulb className="w-4 h-4 mt-0.5 shrink-0 text-[var(--hx-warm)]" />
                {item.hint}
              </p>
            )}
            {answers[i] && (
              <div className="tc-reveal clay-cushion-lavender p-3 text-[0.92rem] leading-relaxed whitespace-pre-line">{item.answer}</div>
            )}

            <div className="flex flex-wrap gap-2">
              {!hints[i] && !answers[i] && (
                <button
                  type="button"
                  onClick={() => setHints((p) => ({ ...p, [i]: true }))}
                  className="clay-btn-secondary px-3 py-1.5 text-[0.78rem] cursor-pointer"
                >
                  Give me a hint
                </button>
              )}
              {!answers[i] ? (
                <button
                  type="button"
                  onClick={() => setAnswers((p) => ({ ...p, [i]: true }))}
                  className="clay-btn-secondary px-3 py-1.5 text-[0.78rem] inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" /> Reveal answer
                </button>
              ) : (
                <button
                  type="button"
                  aria-pressed={!!recalled[i]}
                  onClick={() => setRecalled((p) => ({ ...p, [i]: !p[i] }))}
                  className={`px-3 py-1.5 text-[0.78rem] inline-flex items-center gap-1.5 cursor-pointer ${
                    recalled[i] ? 'clay-btn-pink' : 'clay-btn-secondary'
                  }`}
                >
                  <Check className="w-3.5 h-3.5" /> {recalled[i] ? 'I recalled it' : 'I got it right'}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
