import React, { useState } from 'react';
import { Zap, ArrowRight } from 'lucide-react';
import { EditionComparisonMatrix } from './EditionComparisonMatrix';

interface PowerShellMasteryVaultProps {
  onNavigate: (path: string) => void;
}

const AUTOMATIC_VARS = [
  {
    variable: '$_ / $PSItem',
    title: 'Current Pipeline Object',
    meaning:
      'Represents the exact .NET object currently passing through Where-Object, ForEach-Object, or a calculated property.',
    example:
      'Get-Service | Where-Object { $_.Status -eq "Running" -and $_.CanStop }',
    output: 'Emits only running services that allow stopping.',
  },
  {
    variable: '$PSVersionTable',
    title: 'Engine & Edition Hashtable',
    meaning:
      'Reveals your exact PowerShell version (5.1 vs 7.5), PSEdition (Desktop vs Core), and underlying OS/CLR version.',
    example: '$PSVersionTable.PSVersion; $PSVersionTable.PSEdition',
    output: 'Major: 7, Minor: 5, Patch: 0 · PSEdition: Core',
  },
  {
    variable: '$?',
    title: 'Last Command Execution Status',
    meaning:
      'Boolean ($true or $false) indicating whether the very last command succeeded without any errors.',
    example: 'Test-Connection -ComputerName 10.0.0.1 -Count 1 -Quiet; $?',
    output: 'True (if reachable) or False (if unreachable)',
  },
  {
    variable: '$Error[0]',
    title: 'Most Recent ErrorRecord Object',
    meaning:
      'An array storing recent errors in the session. $Error[0] is the latest failure, complete with .Exception.Message and .InvocationInfo.',
    example: '$Error[0].Exception.GetType().FullName',
    output: 'System.Management.Automation.ItemNotFoundException',
  },
  {
    variable: '$LASTEXITCODE',
    title: 'Native Binary Exit Code',
    meaning:
      'Captures the integer exit code (0 = success, non-zero = error) returned by external native binaries like ping.exe, whoami.exe, or git.exe.',
    example: 'whoami /priv; if ($LASTEXITCODE -eq 0) { "Success" }',
    output: '0 (Success)',
  },
];

export const PowerShellMasteryVault: React.FC<PowerShellMasteryVaultProps> = ({
  onNavigate,
}) => {
  const [selectedVarIdx, setSelectedVarIdx] = useState(0);
  const currentVar = AUTOMATIC_VARS[selectedVarIdx];

  return (
    <section className="clay-tray p-6 sm:p-10 lg:p-12 space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-black/10 dark:border-white/10 pb-6">
        <div className="space-y-1.5 max-w-[44rem]">
          <span className="text-[0.75rem] font-mono font-extrabold uppercase tracking-wider text-[var(--dp-color-accent)] flex items-center gap-2">
            <Zap className="w-4 h-4" />
            <span>
              Deep-Dive Engineering Vault · Created by Muhammad Izaz Haider
            </span>
          </span>
          <h2 className="text-[1.75rem] sm:text-[2.125rem] font-extrabold leading-tight">
            Essential PowerShell Internals &amp; Production Rules
          </h2>
          <p className="text-[0.95rem] text-[var(--dp-color-ink-secondary)] font-medium leading-relaxed">
            Master the automatic variables, edition differences (5.1 vs 7.5),
            and production safety laws that separate copy-pasters from real
            systems engineers.
          </p>
        </div>

        <button
          type="button"
          onClick={() => onNavigate('/knowledge')}
          className="clay-btn-primary px-5 py-3 text-[0.85rem] inline-flex items-center gap-2 cursor-pointer self-start md:self-auto shrink-0"
        >
          <span>Open All 6 Interactive Labs</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-5 space-y-3">
          <span className="text-[0.75rem] font-mono font-extrabold uppercase tracking-wider text-[var(--dp-color-accent)] block">
            1 · Click an Automatic Variable to Inspect
          </span>
          <div className="space-y-2">
            {AUTOMATIC_VARS.map((item, idx) => (
              <button
                key={item.variable}
                type="button"
                onClick={() => setSelectedVarIdx(idx)}
                className={`w-full p-3.5 rounded-[1.25rem] text-left flex items-center justify-between gap-3 cursor-pointer transition-all ${
                  selectedVarIdx === idx
                    ? 'clay-btn-primary text-white'
                    : 'clay-well hover:bg-blue-500/10'
                }`}
              >
                <span className="font-mono font-extrabold text-[0.9rem]">
                  {item.variable}
                </span>
                <span className="text-[0.8rem] font-bold opacity-90">
                  {item.title}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-7 clay-well p-6 rounded-[1.75rem] space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="px-3.5 py-1 rounded-full clay-pill font-mono font-extrabold text-[0.875rem] text-[var(--dp-color-accent)]">
              {currentVar.variable}
            </span>
            <span className="text-[0.85rem] font-extrabold text-[var(--dp-color-ink-secondary)]">
              {currentVar.title}
            </span>
          </div>

          <p className="text-[0.95rem] font-medium leading-relaxed">
            {currentVar.meaning}
          </p>

          <div className="p-4 rounded-[1.25rem] clay-terminal font-mono text-[0.82rem] space-y-2">
            <div className="text-[#93c5fd] text-[0.72rem] uppercase font-extrabold">
              Live Terminal Example:
            </div>
            <pre className="text-[#fde68a] font-bold overflow-x-auto">
              <code>PS C:\&gt; {currentVar.example}</code>
            </pre>
            <div className="pt-2 border-t border-white/10 text-[#a7f3d0]">
              Result: {currentVar.output}
            </div>
          </div>
        </div>
      </div>

      <EditionComparisonMatrix />
    </section>
  );
};
