import React from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';

interface QuizOptionButtonProps {
  option: string;
  idx: number;
  isSelected: boolean;
  isCorrect: boolean;
  isSubmitted: boolean;
  tabIndex: number;
  onSelect: (idx: number) => void;
  onKeyDown: (event: React.KeyboardEvent, idx: number) => void;
}

export const QuizOptionButton: React.FC<QuizOptionButtonProps> = ({
  option,
  idx,
  isSelected,
  isCorrect,
  isSubmitted,
  tabIndex,
  onSelect,
  onKeyDown,
}) => {
  let btnStyle = 'clay-well text-[var(--dp-color-ink)]';
  if (isSubmitted) {
    btnStyle = isCorrect
      ? 'clay-cushion-mint text-[var(--dp-color-ink)]'
      : isSelected
        ? 'clay-cushion-pink text-[var(--dp-color-ink)]'
        : 'clay-well text-[var(--dp-color-ink-secondary)] opacity-80';
  } else if (isSelected) {
    btnStyle = 'clay-cushion-lavender text-[var(--dp-color-ink)] ring-2 ring-[var(--dp-color-ink)]';
  }

  return (
    <button
      type="button"
      role="radio"
      aria-checked={isSelected}
      aria-disabled={isSubmitted}
      tabIndex={tabIndex}
      onClick={() => onSelect(idx)}
      onKeyDown={(event) => onKeyDown(event, idx)}
      className={`quiz-option w-full flex items-center justify-between p-4 sm:p-4.5 rounded-[1.25rem] text-left transition-all ${isSubmitted ? 'cursor-default' : 'cursor-pointer'} ${btnStyle}`}
    >
      <div className="flex items-center gap-3.5 pr-3">
        <span
          aria-hidden="true"
          className="w-7 h-7 rounded-full clay-chip-surface flex items-center justify-center text-[0.8125rem] font-extrabold font-mono text-[var(--dp-color-ink)] shrink-0 shadow-sm"
        >
          {String.fromCharCode(65 + idx)}
        </span>
        <span className="text-[0.9375rem] font-bold font-mono leading-[1.45]">{option}</span>
      </div>
      {isSubmitted && isCorrect && (
        <>
          <CheckCircle2 className="w-5 h-5 text-[var(--dp-color-ink)] shrink-0" aria-hidden="true" />
          <span className="sr-only">Correct answer</span>
        </>
      )}
      {isSubmitted && isSelected && !isCorrect && (
        <>
          <XCircle className="w-5 h-5 text-[var(--dp-color-ink)] shrink-0" aria-hidden="true" />
          <span className="sr-only">Your answer, incorrect</span>
        </>
      )}
    </button>
  );
};
