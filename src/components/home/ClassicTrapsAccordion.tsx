import React from 'react';
import { Plus } from 'lucide-react';

export const ClassicTrapsAccordion: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
      <details className="clay-disclosure p-5 group">
        <summary className="font-extrabold text-[1rem] cursor-pointer list-none flex items-center justify-between gap-3">
          <span>⚠️ The Date Format Trap: dd-mm-yyyy vs dd-MM-yyyy</span>
          <span className="w-7 h-7 rounded-full clay-well flex items-center justify-center shrink-0">
            <Plus className="w-4 h-4 text-[var(--dp-color-accent)]" />
          </span>
        </summary>
        <p className="mt-3 text-[0.9375rem] font-medium leading-relaxed">
          In <code>Get-Date -Format &apos;dd-MM-yyyy&apos;</code>, capital{' '}
          <code>MM</code> means Month while lowercase <code>mm</code> means
          minutes. Typing <code>dd-mm-yyyy</code> prints day-minutes-year!
        </p>
      </details>

      <details className="clay-disclosure p-5 group">
        <summary className="font-extrabold text-[1rem] cursor-pointer list-none flex items-center justify-between gap-3">
          <span>⚠️ The Filter Left Rule: -Filter vs Where-Object</span>
          <span className="w-7 h-7 rounded-full clay-well flex items-center justify-center shrink-0">
            <Plus className="w-4 h-4 text-[var(--dp-color-accent)]" />
          </span>
        </summary>
        <p className="mt-3 text-[0.9375rem] font-medium leading-relaxed">
          <code>-Filter</code> filters at the source before objects travel
          across memory or the network. Always check <code>Get-Help</code> to
          see if a cmdlet supports <code>-Filter</code> before defaulting to{' '}
          <code>Where-Object</code>.
        </p>
      </details>

      <details className="clay-disclosure p-5 group">
        <summary className="font-extrabold text-[1rem] cursor-pointer list-none flex items-center justify-between gap-3">
          <span>⚠️ Single Quotes vs Double Quotes Expansion Trap</span>
          <span className="w-7 h-7 rounded-full clay-well flex items-center justify-center shrink-0">
            <Plus className="w-4 h-4 text-[var(--dp-color-accent)]" />
          </span>
        </summary>
        <p className="mt-3 text-[0.9375rem] font-medium leading-relaxed">
          Double quotes <code>&quot;Hello $name&quot;</code> expand the variable
          value. Single quotes <code>&apos;Hello $name&apos;</code> print the
          literal characters <code>$name</code>.
        </p>
      </details>

      <details className="clay-disclosure p-5 group">
        <summary className="font-extrabold text-[1rem] cursor-pointer list-none flex items-center justify-between gap-3">
          <span>🚨 The 3 Classic Malware Process Red Flags</span>
          <span className="w-7 h-7 rounded-full clay-well flex items-center justify-center shrink-0">
            <Plus className="w-4 h-4 text-[var(--dp-color-accent)]" />
          </span>
        </summary>
        <p className="mt-3 text-[0.9375rem] font-medium leading-relaxed">
          Always check <strong>Parent</strong> (<code>services.exe</code> must
          be spawned by <code>wininit.exe</code>), <strong>Path</strong> (must
          live in <code>C:\Windows\System32</code>), and{' '}
          <strong>Spelling</strong> (<code>svch0st.exe</code> or{' '}
          <code>Isass.exe</code> are imposters).
        </p>
      </details>
    </div>
  );
};
