import React from 'react';
import { HelpCircle } from 'lucide-react';
import { LessonCommandBreakdown } from '../../types';
import { decodeSyntaxForBeginners } from '../../utils/lessonPedagogy';

interface LessonSyntaxSectionProps {
  commandBreakdowns: LessonCommandBreakdown[];
}

export const LessonSyntaxSection: React.FC<LessonSyntaxSectionProps> = ({
  commandBreakdowns,
}) => {
  if (!commandBreakdowns || commandBreakdowns.length === 0) return null;

  return (
    <section
      id="sec-syntax"
      aria-labelledby="lesson-syntax-heading"
      className="clay-tray p-6 sm:p-10 space-y-6"
    >
      <div className="flex items-center gap-3">
        <span className="guide-num-badge">4</span>
        <div>
          <span className="text-[0.75rem] font-mono uppercase tracking-wider font-bold opacity-75 block">
            Command Anatomy &amp; Syntax Decoder
          </span>
          <h2
            id="lesson-syntax-heading"
            className="text-[1.5rem] sm:text-[1.75rem] font-bold"
          >
            Cmdlet Syntax &amp; How to Read the Brackets
          </h2>
        </div>
      </div>

      <div className="space-y-6">
        {commandBreakdowns.map((cb, idx) => {
          const syntaxHelp = decodeSyntaxForBeginners(cb.syntax);
          return (
            <div key={idx} className="clay-well p-6 space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-mono text-[1.25rem] font-bold">
                  {cb.cmdlet}
                </span>
                {cb.aliases && cb.aliases.length > 0 && (
                  <span className="px-3 py-1 rounded-full clay-pill text-[0.75rem] font-mono font-bold">
                    Aliases: {cb.aliases.join(', ')} (use full name in scripts)
                  </span>
                )}
              </div>

              <div className="p-4 rounded-[1rem] bg-[#141b36] text-[#e8e4d4] font-mono text-[0.875rem] overflow-x-auto">
                {cb.syntax}
              </div>

              <div className="clay-cushion-mint p-5 space-y-2.5">
                <span className="text-[0.75rem] font-mono font-extrabold uppercase tracking-wider flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4" />
                  <span>Reading Syntax: The Decoder Ring</span>
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[0.875rem]">
                  {syntaxHelp.map((rule, rIdx) => (
                    <div key={rIdx} className="space-y-0.5">
                      <code className="font-mono font-bold block">
                        {rule.token}
                      </code>
                      <p className="leading-relaxed">{rule.meaning}</p>
                    </div>
                  ))}
                </div>
              </div>

              {cb.parameters.length > 0 && (
                <div className="space-y-2.5">
                  <span className="text-[0.75rem] font-mono uppercase tracking-wider font-bold opacity-80 block">
                    Parameters You Will Use:
                  </span>
                  {cb.parameters.map((param, pIdx) => (
                    <div
                      key={pIdx}
                      className="clay-card p-4 rounded-[1.25rem] flex flex-col sm:flex-row sm:items-baseline gap-1.5 sm:gap-4"
                    >
                      <span className="font-mono text-[0.9375rem] font-bold min-w-[11rem]">
                        {param.name}{' '}
                        <span className="opacity-70 font-normal text-[0.75rem]">
                          &lt;{param.type}&gt;
                        </span>
                      </span>
                      <span className="text-[0.9375rem] leading-relaxed">
                        {param.description}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
