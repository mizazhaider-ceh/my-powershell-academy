import React, { useRef } from 'react';
import { X, Terminal, HelpCircle, Sparkles } from 'lucide-react';
import { useDialogFocus } from './useDialogFocus';

interface CheatSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CheatSheetModal: React.FC<CheatSheetModalProps> = ({ isOpen, onClose }) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  useDialogFocus(isOpen, dialogRef, onClose);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-12 sm:pt-16 px-4">
      <div
        className="fixed inset-0 bg-[#0f172a]/55 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cheat-sheet-title"
        className="relative w-full max-w-[52rem] clay-tray p-6 sm:p-8 max-h-[85vh] overflow-y-auto z-10"
      >
        <div className="flex items-start justify-between gap-4 pb-5 mb-6 border-b border-[rgba(15,23,42,0.1)]">
          <div>
            <div className="inline-flex items-center gap-2 text-[0.75rem] font-extrabold uppercase tracking-wider text-[var(--dp-color-accent)] mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              Instant Pocket Reference · Created by Muhammad Izaz Haider
            </div>
            <h2 id="cheat-sheet-title" className="text-[1.5rem] sm:text-[1.75rem] font-extrabold text-[var(--dp-color-ink)] tracking-tight">
              PowerShell Operators, Symbols &amp; Bracket Decoder
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="clay-btn-secondary px-3.5 py-2 min-h-11 text-[0.8125rem] inline-flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
            Close
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
          {/* Comparison Operators */}
          <div className="clay-well p-5">
            <h3 className="text-[1.05rem] font-extrabold text-[var(--dp-color-ink)] mb-3 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-[var(--dp-color-accent)]" />
              1. Comparison Operators (Never use = or &gt;)
            </h3>
            <p className="text-[0.84rem] text-[var(--dp-color-ink-secondary)] font-medium mb-3">
              In PowerShell, <code className="clay-code-inline">&gt;</code> redirects output to a file! Always use hyphenated operators:
            </p>
            <div className="space-y-2 text-[0.84rem]">
              {[
                { op: '-eq / -ne', desc: 'Equals / Not equals (case-insensitive by default)' },
                { op: '-gt / -ge', desc: 'Greater than / Greater than or equal to' },
                { op: '-lt / -le', desc: 'Less than / Less than or equal to' },
                { op: '-like', desc: 'Wildcard string match (uses * and ?, e.g. "Win*")' },
                { op: '-match', desc: 'Regular expression (Regex) pattern match' },
                { op: '-contains', desc: 'Checks if a collection contains an exact item' }
              ].map(item => (
                <div key={item.op} className="flex items-start justify-between gap-3 p-2 rounded-[0.85rem] clay-chip-surface">
                  <code className="font-mono font-extrabold text-[var(--dp-color-accent)] shrink-0">{item.op}</code>
                  <span className="text-[var(--dp-color-ink-secondary)] font-medium text-right">{item.desc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Punctuation & Pipeline Symbols */}
          <div className="clay-well p-5">
            <h3 className="text-[1.05rem] font-extrabold text-[var(--dp-color-ink)] mb-3 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-[var(--dp-color-accent)]" />
              2. Essential Symbols &amp; Punctuation
            </h3>
            <p className="text-[0.84rem] text-[var(--dp-color-ink-secondary)] font-medium mb-3">
              What every symbol means when reading a PowerShell one-liner:
            </p>
            <div className="space-y-2 text-[0.84rem]">
              {[
                { sym: '$_ or $PSItem', desc: 'The current object flowing through the pipeline right now' },
                { sym: '| (Pipe)', desc: 'Sends live .NET objects from Command A into Command B' },
                { sym: '@( ... )', desc: 'Explicit zero-indexed Array (list of items)' },
                { sym: '@{ Key = Val }', desc: 'Hashtable (key-value dictionary) or @Splatting table' },
                { sym: "'Single Quotes'", desc: 'Literal string - variables like $name are NOT expanded' },
                { sym: '"Double Quotes"', desc: 'Expandable string - variables & $(subexpressions) expand' }
              ].map(item => (
                <div key={item.sym} className="flex items-start justify-between gap-3 p-2 rounded-[0.85rem] clay-chip-surface">
                  <code className="font-mono font-extrabold text-[var(--dp-color-accent)] shrink-0">{item.sym}</code>
                  <span className="text-[var(--dp-color-ink-secondary)] font-medium text-right">{item.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Syntax Bracket Decoder */}
        <div className="clay-cushion-cool p-5">
          <h3 className="text-[1.05rem] font-extrabold text-[var(--dp-color-ink)] mb-2">
            3. How to Read Get-Help Syntax Brackets Cold
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
            <div className="p-3.5 rounded-[1.1rem] clay-chip-surface">
              <code className="font-mono font-extrabold text-[0.875rem] text-[var(--dp-color-accent)]">
                [-Name &lt;String&gt;]
              </code>
              <p className="text-[0.8125rem] text-[var(--dp-color-ink-secondary)] font-medium mt-1">
                <strong>Optional Parameter:</strong> Outer brackets wrap the whole parameter, so you can omit it.
              </p>
            </div>
            <div className="p-3.5 rounded-[1.1rem] clay-chip-surface">
              <code className="font-mono font-extrabold text-[0.875rem] text-[var(--dp-color-accent)]">
                [[-Name] &lt;String&gt;]
              </code>
              <p className="text-[0.8125rem] text-[var(--dp-color-ink-secondary)] font-medium mt-1">
                <strong>Positional &amp; Optional:</strong> Inner brackets around <code className="font-mono">-Name</code> mean you can pass the value without typing the parameter name.
              </p>
            </div>
            <div className="p-3.5 rounded-[1.1rem] clay-chip-surface">
              <code className="font-mono font-extrabold text-[0.875rem] text-[var(--dp-color-accent)]">
                &lt;String[]&gt;
              </code>
              <p className="text-[0.8125rem] text-[var(--dp-color-ink-secondary)] font-medium mt-1">
                <strong>Accepts an Array:</strong> The <code className="font-mono">[]</code> after the type means you can pass comma-separated values.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
