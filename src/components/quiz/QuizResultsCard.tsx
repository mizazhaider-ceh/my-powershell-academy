import React from 'react';
import { Award, RotateCcw } from 'lucide-react';

interface QuizResultsCardProps {
  score: number;
  total: number;
  onRestart: () => void;
}

export const QuizResultsCard: React.FC<QuizResultsCardProps> = ({
  score,
  total,
  onRestart,
}) => {
  return (
    <div className="py-6 sm:py-10 text-center">
      <div className="w-16 h-16 rounded-full clay-cushion-mint flex items-center justify-center mx-auto mb-5 text-[var(--dp-color-ink)]">
        <Award className="w-8 h-8" />
      </div>
      <h4 className="text-[1.75rem] font-extrabold text-[var(--dp-color-ink)] mb-2">
        🏁 Drill Session Complete!
      </h4>
      <p className="text-[var(--dp-color-ink-secondary)] text-[1.0625rem] font-medium max-w-md mx-auto mb-6">
        You scored{' '}
        <span className="text-[var(--dp-color-ink)] font-mono font-extrabold">
          {score}
        </span>{' '}
        out of{' '}
        <span className="text-[var(--dp-color-ink)] font-mono font-extrabold">
          {total}
        </span>{' '}
        ({Math.round((score / total) * 100)}%).
      </p>

      <div className="max-w-lg mx-auto p-5 rounded-[1.5rem] clay-cushion-warm mb-7 text-[0.95rem] text-[var(--dp-color-ink)] font-medium leading-[1.6]">
        {score / total >= 0.85
          ? 'Outstanding! You have a rock-solid grasp of Windows internals, the .NET object pipeline, and enterprise PowerShell automation.'
          : score / total >= 0.65
          ? 'Solid foundation! Review the explanations on any missed questions and walk through the interactive lesson checklists.'
          : 'Take your time walking through the single-column lesson guides and diagrams, then run this drill again to lock in the concepts.'}
      </div>

      <button
        type="button"
        onClick={onRestart}
        className="clay-btn-primary inline-flex items-center gap-2 px-6 py-3.5 text-[0.9375rem] cursor-pointer"
      >
        <RotateCcw className="w-4 h-4" />
        Restart Drill
      </button>
    </div>
  );
};
