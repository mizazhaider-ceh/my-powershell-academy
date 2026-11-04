import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Lesson as LessonType } from '../../types';
import { CodeBlock } from '../common/CodeBlock';
import { formatInlineRichText } from './formatInlineRichText';
import { LessonSyntaxSection } from './LessonSyntaxSection';

interface LessonCodeAndTrapsSectionProps {
  currentLesson: LessonType;
}

export const LessonCodeAndTrapsSection: React.FC<
  LessonCodeAndTrapsSectionProps
> = ({ currentLesson }) => {
  const { commandBreakdowns, codeExamples, mistakesAndTraps } = currentLesson;

  return (
    <>
      {commandBreakdowns && (
        <LessonSyntaxSection commandBreakdowns={commandBreakdowns} />
      )}

      {codeExamples && codeExamples.length > 0 && (
        <section
          id="sec-examples"
          aria-labelledby="lesson-examples-heading"
          className="clay-tray p-6 sm:p-10 space-y-6"
        >
          <div className="flex items-center gap-3">
            <span className="guide-num-badge">5</span>
            <div>
              <span className="text-[0.75rem] font-mono uppercase tracking-wider font-bold opacity-75 block">
                Type, Run &amp; Verify
              </span>
              <h2
                id="lesson-examples-heading"
                className="text-[1.5rem] sm:text-[1.75rem] font-bold"
              >
                Step-by-Step Commands &amp; Expected Output
              </h2>
            </div>
          </div>

          <div className="space-y-6">
            {codeExamples.map((ex, i) => (
              <div key={i} className="clay-well p-5 sm:p-6 space-y-3">
                <h3 className="text-[1.125rem] font-bold flex items-center gap-2.5">
                  <span className="px-2.5 py-0.5 rounded-full clay-btn-pink text-[#383139] font-mono text-[0.75rem]">
                    Example {i + 1}
                  </span>
                  <span>{ex.title}</span>
                </h3>
                {ex.description && (
                  <p className="text-[0.9375rem] opacity-90 leading-relaxed">
                    {formatInlineRichText(ex.description)}
                  </p>
                )}
                <CodeBlock
                  code={ex.code}
                  output={ex.output || ex.illustrativeOutput}
                  title={ex.title}
                  language="powershell"
                  showLineNumbers={true}
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {mistakesAndTraps && mistakesAndTraps.length > 0 && (
        <section
          id="sec-traps"
          aria-labelledby="lesson-mistakes-heading"
          className="clay-tray-lavender p-6 sm:p-10 space-y-6"
        >
          <div className="flex items-center gap-3">
            <span className="guide-num-badge">6</span>
            <div>
              <span className="text-[0.75rem] font-mono uppercase tracking-wider font-bold opacity-80 block">
                Debugging &amp; Trap Prevention
              </span>
              <h2
                id="lesson-mistakes-heading"
                className="text-[1.5rem] sm:text-[1.75rem] font-bold"
              >
                Common Mistakes &amp; The Exact Fix
              </h2>
            </div>
          </div>

          <div className="space-y-4">
            {mistakesAndTraps.map((cm, i) => (
              <div
                key={i}
                className="clay-card p-5 sm:p-6 grid grid-cols-1 md:grid-cols-3 gap-4"
              >
                <div className="space-y-1">
                  <span className="text-[0.75rem] font-mono font-bold uppercase flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>The Trap</span>
                  </span>
                  <p className="text-[0.9375rem] font-bold leading-relaxed">
                    {formatInlineRichText(cm.mistake)}
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="text-[0.75rem] font-mono font-bold uppercase opacity-75 block">
                    Why It Happens
                  </span>
                  <p className="text-[0.9375rem] opacity-90 leading-relaxed">
                    {formatInlineRichText(cm.cause)}
                  </p>
                </div>
                <div className="clay-cushion-mint p-4 rounded-[1.25rem] space-y-1">
                  <span className="text-[0.75rem] font-mono font-bold uppercase block">
                    ✅ The Correct Fix
                  </span>
                  <p className="text-[0.9375rem] font-semibold leading-relaxed">
                    {formatInlineRichText(cm.fix)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </>
  );
};
