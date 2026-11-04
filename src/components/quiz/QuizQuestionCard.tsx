import React, { useId, useRef } from 'react';
import { RotateCcw, ArrowRight, HelpCircle } from 'lucide-react';
import { Chapter, QuizQuestion } from '../../types';
import { QuizOptionButton } from './QuizOptionButton';

interface QuizQuestionCardProps {
  activeQuestion: QuizQuestion;
  parentChapter?: Chapter;
  typeLabel: string;
  currentIndex: number;
  totalQuestions: number;
  score: number;
  selectedOption: string | null;
  isSubmitted: boolean;
  onSelectOption: (option: string) => void;
  onSubmit: () => void;
  onNext: () => void;
  onRestart: () => void;
}

export const QuizQuestionCard: React.FC<QuizQuestionCardProps> = ({
  activeQuestion,
  parentChapter,
  typeLabel,
  currentIndex,
  totalQuestions,
  score,
  selectedOption,
  isSubmitted,
  onSelectOption,
  onSubmit,
  onNext,
  onRestart,
}) => {
  const headingId = useId();
  const groupRef = useRef<HTMLDivElement>(null);
  const { options, correctAnswer } = activeQuestion;
  const selectedIndex = options.findIndex((option) => option === selectedOption);
  const tabStop = selectedIndex >= 0 ? selectedIndex : 0;
  const wasCorrect = selectedOption === correctAnswer;

  const choose = (idx: number) => {
    if (isSubmitted) return;
    onSelectOption(options[idx]);
    groupRef.current?.querySelectorAll<HTMLElement>('[role="radio"]')[idx]?.focus();
  };

  const onOptionKeyDown = (event: React.KeyboardEvent, idx: number) => {
    const last = options.length - 1;
    const next: Record<string, number> = {
      ArrowDown: idx === last ? 0 : idx + 1,
      ArrowRight: idx === last ? 0 : idx + 1,
      ArrowUp: idx === 0 ? last : idx - 1,
      ArrowLeft: idx === 0 ? last : idx - 1,
      Home: 0,
      End: last,
    };
    if (event.key in next) {
      event.preventDefault();
      choose(next[event.key]);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between text-[0.8125rem] font-extrabold text-[var(--dp-color-ink-secondary)] mb-2.5">
        <span>
          Question {currentIndex + 1} of {totalQuestions}
        </span>
        <span className="px-3 py-1 rounded-full clay-well font-mono text-[var(--dp-color-ink)]">
          Score: <strong>{score}</strong>
        </span>
      </div>
      <div className="w-full h-2.5 clay-well rounded-full overflow-hidden mb-7" aria-hidden="true">
        <div
          className="h-full bg-[var(--dp-color-accent)] transition-all duration-300 rounded-full"
          style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
        />
      </div>

      <div className="flex flex-wrap items-center gap-2.5 mb-3.5">
        <span className="px-3 py-1 rounded-full text-[0.75rem] font-extrabold uppercase tracking-wider bg-[var(--dp-color-surface-cool)] text-[var(--dp-color-ink)]">
          {typeLabel}
        </span>
        {parentChapter && (
          <span className="text-[0.8125rem] font-bold text-[var(--dp-color-ink-secondary)]">
            • Module {String(parentChapter.number).padStart(2, '0')}: {parentChapter.title}
          </span>
        )}
      </div>

      <h4 id={headingId} className="text-[1.2rem] sm:text-[1.35rem] font-extrabold text-[var(--dp-color-ink)] mb-5 leading-[1.35]">
        {activeQuestion.question}
      </h4>

      {activeQuestion.codeSnippet && (
        <div className="mb-6 clay-terminal p-4 font-mono text-[0.875rem] text-[#f9e7a8] overflow-x-auto">
          <code>{activeQuestion.codeSnippet}</code>
        </div>
      )}

      <div ref={groupRef} role="radiogroup" aria-labelledby={headingId} className="space-y-3 mb-7">
        {options.map((option, idx) => (
          <QuizOptionButton
            key={idx}
            option={option}
            idx={idx}
            isSelected={selectedOption === option}
            isCorrect={option === correctAnswer}
            isSubmitted={isSubmitted}
            tabIndex={idx === tabStop ? 0 : -1}
            onSelect={choose}
            onKeyDown={onOptionKeyDown}
          />
        ))}
      </div>

      <div role="status" aria-live="polite" aria-atomic="true">
        {isSubmitted && (
          <div className="p-5 rounded-[1.5rem] clay-cushion-warm mb-7">
            <div className="flex items-center gap-2 text-[0.8125rem] font-extrabold uppercase tracking-wider text-[var(--dp-color-ink)] mb-1.5">
              <HelpCircle className="w-4 h-4" aria-hidden="true" />
              {wasCorrect ? 'Correct. Why this is correct' : 'Not quite. Why this is correct'}
            </div>
            {!wasCorrect && <p className="sr-only">The correct answer is {correctAnswer}.</p>}
            <p className="text-[0.95rem] text-[var(--dp-color-ink)] font-medium leading-[1.6]">
              {activeQuestion.explanation}
            </p>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between pt-5 border-t border-[rgba(56,49,57,0.1)]">
        <button
          type="button"
          onClick={onRestart}
          className="clay-btn-secondary px-4 py-2.5 min-h-11 text-[0.8125rem] inline-flex items-center gap-1.5 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
          Reset Drill
        </button>
        {!isSubmitted ? (
          <button
            type="button"
            disabled={selectedOption === null}
            onClick={onSubmit}
            className="clay-btn-primary px-6 py-3 text-[0.9375rem] disabled:cursor-not-allowed cursor-pointer"
          >
            Check Answer
          </button>
        ) : (
          <button
            type="button"
            onClick={onNext}
            className="clay-btn-pink inline-flex items-center gap-2 px-6 py-3 text-[0.9375rem] cursor-pointer"
          >
            {currentIndex + 1 < totalQuestions ? 'Next Question' : 'View Results'}
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </button>
        )}
      </div>
    </div>
  );
};
