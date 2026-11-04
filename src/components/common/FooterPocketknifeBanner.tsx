import React, { useState } from 'react';
import { Copy, Check, Sparkles } from 'lucide-react';

const POCKETKNIFE_ONELINER =
  'Update-Help -Force; Get-Command *service*; Get-Help Get-Service -Examples; Get-Service | Get-Member';

export const FooterPocketknifeBanner: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const handleCopyPocketknife = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(POCKETKNIFE_ONELINER);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }
  };

  return (
    <div className="clay-cushion-pink p-6 sm:p-8 rounded-[2.25rem] grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
      <div className="lg:col-span-5 space-y-1.5">
        <div className="inline-flex items-center gap-2 text-[0.75rem] font-mono font-extrabold uppercase tracking-wider text-[var(--dp-color-accent)]">
          <Sparkles className="w-4 h-4" />
          <span>The Self-Reliance Pocketknife</span>
        </div>
        <h3 className="text-[1.25rem] sm:text-[1.4rem] font-extrabold text-[var(--dp-color-ink)] leading-snug">
          Memorize 4 Commands. Figure Out Anything Offline.
        </h3>
        <p className="text-[0.875rem] text-[var(--dp-color-ink-secondary)] font-medium leading-relaxed">
          Copy this one-liner into any Windows PowerShell 5.1 or PowerShell 7.5
          terminal to update your manual and X-ray live .NET objects.
        </p>
      </div>

      <div className="lg:col-span-7 space-y-3">
        <div className="p-3.5 sm:p-4 rounded-[1.25rem] clay-terminal flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono text-[0.78rem]">
          <code className="text-[#fde68a] font-bold break-all">
            PS&gt; {POCKETKNIFE_ONELINER}
          </code>
          <button
            type="button"
            onClick={handleCopyPocketknife}
            className="tap-target px-3.5 py-1.5 rounded-full bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-extrabold text-[0.75rem] inline-flex items-center justify-center gap-1.5 shrink-0 self-start sm:self-center cursor-pointer"
            aria-live="polite"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-300" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy 4 Commands</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
