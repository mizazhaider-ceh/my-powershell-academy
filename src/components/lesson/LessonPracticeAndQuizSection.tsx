import React from 'react';
import {
  CheckCircle2,
  XCircle,
  CheckSquare,
  Square,
  Award,
} from 'lucide-react';
import { Lesson as LessonType } from '../../types';
import { formatInlineRichText } from './formatInlineRichText';

interface LessonPracticeAndQuizSectionProps {
  currentLesson: LessonType;
  completedTasks: Record<number, boolean>;
  onToggleTask: (idx: number) => void;
  selectedAnswers: Record<number, number>;
  onSelectAnswer: (qIndex: number, optIdx: number) => void;
}

export const LessonPracticeAndQuizSection: React.FC<
  LessonPracticeAndQuizSectionProps
> = ({
  currentLesson,
  completedTasks,
  onToggleTask,
  selectedAnswers,
  onSelectAnswer,
}) => {
  const totalQuizCount = currentLesson.knowledgeCheck?.length || 0;
  const correctQuizCount = (currentLesson.knowledgeCheck || []).filter(
    (q, idx) => selectedAnswers[idx] === q.correctIndex
  ).length;

  return (
    <section id="sec-quiz" className="clay-tray p-6 sm:p-10 space-y-10">
      {currentLesson.tryItYourself &&
        currentLesson.tryItYourself.length > 0 && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <span className="guide-num-badge">7</span>
                <div>
                  <span className="text-[0.75rem] font-mono uppercase tracking-wider font-bold opacity-75 block">
                    Do Not Just Read - Type &amp; Verify
                  </span>
                  <h2 className="text-[1.5rem] font-bold">
                    Hands-On Terminal Checklist
                  </h2>
                </div>
              </div>
              <span className="px-3.5 py-1 rounded-full clay-pill text-[0.75rem] font-mono font-bold">
                {Object.values(completedTasks).filter(Boolean).length} /{' '}
                {currentLesson.tryItYourself.length} Verified
              </span>
            </div>

            <div className="space-y-3">
              {currentLesson.tryItYourself.map((task, i) => {
                const checked = !!completedTasks[i];
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => onToggleTask(i)}
                    className={`w-full text-left p-4 rounded-[1.375rem] transition-all flex items-start gap-3.5 cursor-pointer ${
                      checked ? 'clay-cushion-mint' : 'clay-well'
                    }`}
                  >
                    {checked ? (
                      <CheckSquare className="w-5 h-5 shrink-0 mt-0.5" />
                    ) : (
                      <Square className="w-5 h-5 shrink-0 mt-0.5 opacity-70" />
                    )}
                    <span className="text-[0.9375rem] leading-relaxed">
                      <strong className="font-mono mr-1.5">
                        Task {i + 1}:
                      </strong>
                      {formatInlineRichText(task)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

      {currentLesson.knowledgeCheck &&
        currentLesson.knowledgeCheck.length > 0 && (
          <div className="space-y-5 pt-4 border-t border-black/10 dark:border-white/10">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="space-y-0.5">
                <span className="text-[0.75rem] font-mono uppercase tracking-wider font-bold opacity-75 block">
                  ⚔️ Check Yourself · Wrong Answers Explain Themselves
                </span>
                <h2 className="text-[1.5rem] font-bold">
                  Lesson Mastery Gauntlet (
                  {currentLesson.knowledgeCheck.length} Questions)
                </h2>
              </div>
              <span className="px-3.5 py-1 rounded-full clay-pill text-[0.75rem] font-mono font-bold">
                Score: {correctQuizCount} / {totalQuizCount}
              </span>
            </div>

            <div className="space-y-5">
              {currentLesson.knowledgeCheck.map((kc, qIndex) => {
                const chosen = selectedAnswers[qIndex];
                const isAnswered = chosen !== undefined;

                return (
                  <div key={qIndex} className="clay-well p-5 sm:p-6 space-y-4">
                    <p className="text-[1.0625rem] font-bold leading-snug">
                      Q{qIndex + 1}. {kc.question}
                    </p>

                    <div className="space-y-2.5">
                      {kc.options.map((opt, optIdx) => {
                        const isThisSelected = chosen === optIdx;
                        const isThisCorrect = optIdx === kc.correctIndex;
                        let btnClass = 'clay-card hover:bg-[#dbeafe]/60';

                        if (isAnswered) {
                          if (isThisCorrect) {
                            btnClass = 'clay-cushion-mint font-bold';
                          } else if (isThisSelected && !isThisCorrect) {
                            btnClass = 'clay-cushion-pink font-bold';
                          } else {
                            btnClass = 'clay-card opacity-60';
                          }
                        }

                        return (
                          <button
                            key={optIdx}
                            type="button"
                            disabled={isAnswered}
                            onClick={() => onSelectAnswer(qIndex, optIdx)}
                            className={`w-full text-left p-4 rounded-[1.25rem] text-[0.9375rem] leading-relaxed flex items-center justify-between gap-3 cursor-pointer ${btnClass}`}
                          >
                            <div className="flex items-center gap-3">
                              <span className="w-6 h-6 rounded-full clay-well flex items-center justify-center font-mono text-[0.75rem] font-bold shrink-0">
                                {String.fromCharCode(65 + optIdx)}
                              </span>
                              <span>{opt}</span>
                            </div>
                            {isAnswered && isThisCorrect && (
                              <CheckCircle2 className="w-5 h-5 shrink-0" />
                            )}
                            {isAnswered && isThisSelected && !isThisCorrect && (
                              <XCircle className="w-5 h-5 shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {isAnswered && (
                      <div className="clay-cushion-warm p-4 rounded-[1.25rem] text-[0.9375rem] space-y-1">
                        <span className="font-mono font-extrabold uppercase tracking-wider text-[0.75rem] block">
                          Why:
                        </span>
                        <p className="leading-relaxed">{kc.explanation}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {totalQuizCount > 0 && correctQuizCount === totalQuizCount && (
              <div className="clay-cushion-mint p-6 text-center space-y-2">
                <div className="flex items-center justify-center gap-2 font-bold text-[1.125rem]">
                  <Award className="w-5 h-5" />
                  <span>
                    🏁 All {totalQuizCount} Correct! Lesson {currentLesson.id}{' '}
                    is yours.
                  </span>
                </div>
                <p className="text-[0.9375rem]">
                  You mastered the concepts, commands, and traps in this
                  section. Continue to the next lesson below!
                </p>
              </div>
            )}
          </div>
        )}
    </section>
  );
};
