import React, { useState } from 'react';
import { Footprints, ChevronsDown } from 'lucide-react';
import type { LessonTeaching } from '../../types';

/** Watch an expert think aloud: why each move, the exact command, and what you should see. */
export const TeacherWorkedExample: React.FC<{ example: LessonTeaching['workedExample'] }> = ({ example }) => {
  const [visible, setVisible] = useState(1);
  const total = example.steps.length;
  const done = visible >= total;

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h3 className="text-[1.35rem] font-bold flex items-center gap-2">
          <Footprints className="w-5 h-5 text-[var(--dp-color-accent)]" />
          Worked example, thinking out loud
        </h3>
        <p className="text-[0.95rem] text-[var(--dp-color-ink-secondary)]">
          <span className="font-semibold text-[var(--dp-color-ink)]">Goal: </span>
          {example.goal}
        </p>
      </div>

      <ol className="tc-timeline" aria-label="Worked example steps">
        {example.steps.slice(0, visible).map((step, i) => (
          <li key={step.action} className="tc-step space-y-2" data-current={i === visible - 1}>
            <span className="tc-step-dot" aria-hidden="true">{i + 1}</span>
            <div className="tc-think">
              <span className="tc-label">Think</span>
              <p>{step.think}</p>
            </div>
            <div>
              <span className="tc-label">Do</span>
              <pre className="tc-code">{step.action}</pre>
            </div>
            {step.result && (
              <div>
                <span className="tc-label">See</span>
                <pre className="tc-code tc-result">{step.result}</pre>
              </div>
            )}
          </li>
        ))}
      </ol>

      {done ? (
        <div className="clay-cushion-mint p-4 tc-reveal text-[0.95rem] leading-relaxed">
          <span className="font-semibold">Takeaway: </span>
          {example.takeaway}
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setVisible((v) => v + 1)}
            className="clay-btn-primary px-4 py-2.5 text-[0.85rem] cursor-pointer"
          >
            Next step ({visible} of {total})
          </button>
          <button
            type="button"
            onClick={() => setVisible(total)}
            className="clay-btn-secondary px-4 py-2.5 text-[0.85rem] inline-flex items-center gap-1.5 cursor-pointer"
          >
            <ChevronsDown className="w-4 h-4" /> Show all
          </button>
        </div>
      )}
    </div>
  );
};
