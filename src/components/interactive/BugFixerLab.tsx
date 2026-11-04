import React, { useState } from 'react';
import { Bug, CheckCircle2, AlertTriangle, Sparkles } from 'lucide-react';
import { BUG_CHALLENGES } from '../../data/labScenarios';

export const BugFixerLab: React.FC = () => {
  const [selectedBugIdx, setSelectedBugIdx] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [solvedBugs, setSolvedBugs] = useState<string[]>([]);

  const currentBug = BUG_CHALLENGES[selectedBugIdx];
  const chosenOption = currentBug.options.find(
    (o) => o.id === selectedOptionId
  );

  const handleSelectOption = (optId: string, isCorrect: boolean) => {
    setSelectedOptionId(optId);
    if (isCorrect && !solvedBugs.includes(currentBug.id)) {
      setSolvedBugs((prev) => [...prev, currentBug.id]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-black/10 dark:border-white/10 pb-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 text-[0.75rem] font-mono font-extrabold uppercase tracking-wider text-[var(--dp-color-accent)]">
            <Bug className="w-4 h-4" />
            <span>Interactive Diagnostic Lab · Real-World Troubleshooting</span>
          </div>
          <h3 className="text-[1.375rem] sm:text-[1.625rem] font-extrabold text-[var(--dp-color-ink)]">
            Fix the Broken PowerShell Script
          </h3>
          <p className="text-[0.9375rem] text-[var(--dp-color-ink-secondary)] font-medium">
            Diagnose why each production one-liner failed and select the fix to
            inspect the live corrected output.
          </p>
        </div>

        <div className="clay-pill px-4 py-2 text-[0.8125rem] font-mono font-extrabold text-[var(--dp-color-accent)] shrink-0 self-start sm:self-center">
          Bugs Fixed: {solvedBugs.length} / {BUG_CHALLENGES.length}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {BUG_CHALLENGES.map((bug, idx) => {
          const isSolved = solvedBugs.includes(bug.id);
          const isActive = idx === selectedBugIdx;
          return (
            <button
              key={bug.id}
              type="button"
              onClick={() => {
                setSelectedBugIdx(idx);
                setSelectedOptionId(null);
              }}
              className={`px-4 py-2 rounded-full text-[0.8125rem] font-extrabold flex items-center gap-2 cursor-pointer transition-all ${
                isActive ? 'clay-btn-primary' : 'clay-btn-secondary'
              }`}
            >
              {isSolved && <CheckCircle2 className="w-3.5 h-3.5" />}
              <span>Bug #{idx + 1}</span>
            </button>
          );
        })}
      </div>

      <div className="clay-well p-5 sm:p-7 space-y-5">
        <div className="space-y-2">
          <span className="text-[0.75rem] font-mono font-extrabold uppercase tracking-wider text-[var(--dp-color-accent)]">
            {currentBug.moduleRef}
          </span>
          <h4 className="text-[1.25rem] font-extrabold text-[var(--dp-color-ink)]">
            {currentBug.title}
          </h4>
          <p className="text-[0.95rem] text-[var(--dp-color-ink-secondary)] font-medium leading-relaxed">
            {currentBug.scenario}
          </p>
        </div>

        <div className="p-4 rounded-[1.25rem] clay-terminal space-y-2 font-mono text-[0.82rem]">
          <div className="flex items-center justify-between text-[#93c5fd] text-[0.72rem] uppercase tracking-wider font-extrabold">
            <span>❌ Broken Command</span>
            <span>Status: Bug Detected</span>
          </div>
          <pre className="text-[#fde68a] font-bold overflow-x-auto whitespace-pre-wrap">
            <code>PS C:\&gt; {currentBug.brokenCode}</code>
          </pre>
          <div className="pt-2 border-t border-white/10 text-[#fca5a5]">
            {currentBug.brokenOutput}
          </div>
        </div>

        <div className="space-y-2.5">
          <span className="text-[0.78rem] font-mono font-extrabold uppercase tracking-wider text-[var(--dp-color-ink-secondary)] block">
            Choose the Correct Engineering Fix:
          </span>
          <div className="grid grid-cols-1 gap-3">
            {currentBug.options.map((opt) => {
              const isSelected = selectedOptionId === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => handleSelectOption(opt.id, opt.isCorrect)}
                  className={`p-4 rounded-[1.25rem] text-left transition-all cursor-pointer border ${
                    isSelected
                      ? opt.isCorrect
                        ? 'clay-cushion-mint border-emerald-500/40'
                        : 'clay-cushion-warm border-amber-500/40'
                      : 'clay-card border-transparent'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="font-extrabold text-[0.9375rem]">
                      {opt.label}
                    </span>
                    {isSelected && (
                      <span className="text-[0.75rem] font-mono font-extrabold px-2.5 py-0.5 rounded-full bg-black/10">
                        {opt.isCorrect ? '✓ FIXED' : '✗ STILL BROKEN'}
                      </span>
                    )}
                  </div>
                  <code className="block font-mono text-[0.8125rem] opacity-90 break-all whitespace-pre-wrap">
                    {opt.code}
                  </code>
                </button>
              );
            })}
          </div>
        </div>

        {chosenOption && (
          <div
            className={`p-5 rounded-[1.25rem] space-y-3 ${
              chosenOption.isCorrect
                ? 'clay-cushion-mint'
                : 'clay-cushion-warm'
            }`}
          >
            <div className="flex items-center gap-2 font-extrabold text-[1rem]">
              {chosenOption.isCorrect ? (
                <>
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                  <span>Why This Fix Works</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-5 h-5 shrink-0" />
                  <span>Why That Still Fails</span>
                </>
              )}
            </div>
            <p className="text-[0.9375rem] font-medium leading-relaxed">
              {chosenOption.explanation}
            </p>

            {chosenOption.isCorrect && (
              <div className="p-4 rounded-[1rem] clay-terminal text-[#a7f3d0] font-mono text-[0.8125rem] overflow-x-auto space-y-1.5">
                <div className="text-[0.7rem] uppercase tracking-wider text-[#93c5fd] font-bold">
                  ✓ Verified Output After Fix:
                </div>
                <pre className="whitespace-pre">{currentBug.fixedOutput}</pre>
              </div>
            )}

            <div className="pt-2 border-t border-black/10 text-[0.85rem] font-extrabold flex items-center gap-2">
              <Sparkles className="w-4 h-4 shrink-0" />
              <span>Golden Takeaway: {currentBug.takeaway}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
