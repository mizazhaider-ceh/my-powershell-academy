import React from 'react';
import {
  CheckCircle2,
  XCircle,
  RotateCcw,
  ArrowRight,
  HelpCircle,
} from 'lucide-react';
import { Chapter, QuizQuestion } from '../../types';

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
      <div className="w-full h-2.5 clay-well rounded-full overflow-hidden mb-7">
        <div
          className="h-full bg-[var(--dp-color-accent)] transition-all duration-300 rounded-full"
          style={{
            width: `${((currentIndex + 1) / totalQuestions) * 100}%`,
          }}
        />
      </div>

      <div className="flex flex-wrap items-center gap-2.5 mb-3.5">
        <span className="px-3 py-1 rounded-full text-[0.75rem] font-extrabold uppercase tracking-wider bg-[var(--dp-color-surface-cool)] text-[var(--dp-color-ink)]">
          {typeLabel}
        </span>
        {parentChapter && (
          <span className="text-[0.8125rem] font-bold text-[var(--dp-color-ink-secondary)]">
            • Module {String(parentChapter.number).padStart(2, '0')}:{' '}
            {parentChapter.title}
          </span>
        )}
      </div>

      <h4 className="text-[1.2rem] sm:text-[1.35rem] font-extrabold text-[var(--dp-color-ink)] mb-5 leading-[1.35]">
        {activeQuestion.question}
      </h4>

      {activeQuestion.codeSnippet && (
        <div className="mb-6 clay-terminal p-4 font-mono text-[0.875rem] text-[#f9e7a8] overflow-x-auto">
          <code>{activeQuestion.codeSnippet}</code>
        </div>
      )}

      <div className="space-y-3 mb-7">
        {activeQuestion.options.map((option, idx) => {
          const isSelected = selectedOption === option;
          const isCorrect = option === activeQuestion.correctAnswer;
          let btnStyle =
            'clay-well text-[var(--dp-color-ink)] hover:bg-white/80';
          if (isSubmitted) {
            btnStyle = isCorrect
              ? 'clay-cushion-mint text-[var(--dp-color-ink)]'
              : isSelected
                ? 'clay-cushion-pink text-[var(--dp-color-ink)]'
                : 'clay-well text-[var(--dp-color-ink-secondary)] opacity-60';
          } else if (isSelected) {
            btnStyle =
              'clay-cushion-lavender text-[var(--dp-color-ink)] ring-2 ring-[var(--dp-color-ink)]';
          }

          return (
            <button
              key={idx}
              disabled={isSubmitted}
              onClick={() => onSelectOption(option)}
              className={`w-full flex items-center justify-between p-4 sm:p-4.5 rounded-[1.25rem] text-left transition-all cursor-pointer ${btnStyle}`}
            >
              <div className="flex items-center gap-3.5 pr-3">
                <span className="w-7 h-7 rounded-full bg-white/85 flex items-center justify-center text-[0.8125rem] font-extrabold font-mono text-[var(--dp-color-ink)] shrink-0 shadow-sm">
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="text-[0.9375rem] font-bold font-mono leading-[1.45]">
                  {option}
                </span>
              </div>
              {isSubmitted && isCorrect && (
                <CheckCircle2 className="w-5 h-5 text-[var(--dp-color-ink)] shrink-0" />
              )}
              {isSubmitted && isSelected && !isCorrect && (
                <XCircle className="w-5 h-5 text-[var(--dp-color-ink)] shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      {isSubmitted && (
        <div className="p-5 rounded-[1.5rem] clay-cushion-warm mb-7">
          <div className="flex items-center gap-2 text-[0.78rem] font-extrabold uppercase tracking-wider text-[var(--dp-color-ink)] mb-1.5">
            <HelpCircle className="w-4 h-4" />
            Why This Is Correct
          </div>
          <p className="text-[0.95rem] text-[var(--dp-color-ink)] font-medium leading-[1.6]">
            {activeQuestion.explanation}
          </p>
        </div>
      )}

      <div className="flex items-center justify-between pt-5 border-t border-[rgba(56,49,57,0.1)]">
        <button
          onClick={onRestart}
          className="clay-btn-secondary px-4 py-2.5 text-[0.8125rem] inline-flex items-center gap-1.5 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset Drill
        </button>
        {!isSubmitted ? (
          <button
            disabled={selectedOption === null}
            onClick={onSubmit}
            className="clay-btn-primary px-6 py-3 text-[0.9375rem] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            Check Answer
          </button>
        ) : (
          <button
            onClick={onNext}
            className="clay-btn-pink inline-flex items-center gap-2 px-6 py-3 text-[0.9375rem] cursor-pointer"
          >
            {currentIndex + 1 < totalQuestions
              ? 'Next Question'
              : 'View Results'}
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
