import React, { useState } from 'react';
import { Lightbulb, Sparkles } from 'lucide-react';
import { PipelineVisualizer } from '../diagrams/PipelineVisualizer';
import { ObjectAnatomy } from '../diagrams/ObjectAnatomy';
import {
  SyscallAnimator,
  MalwareProcessHunter,
} from '../diagrams/WindowsInternalsWidgets';

const PIPELINE_STEPPER = [
  {
    step: '1 · Get-Service',
    command: 'Get-Service',
    summary:
      'PowerShell queries Windows and creates ~200 live service objects in memory. Each object carries Name, DisplayName, Status, CanStop, and dozens of hidden properties.',
  },
  {
    step: '2 · Where-Object',
    command: "Get-Service | Where-Object { $_.Status -eq 'Running' }",
    summary:
      'Each object is tested in turn as $_. Only objects where $_.Status equals Running survive in the stream. Non-matching objects are simply dropped, never deleted from Windows.',
  },
  {
    step: '3 · Select-Object',
    command:
      "Get-Service | Where-Object { $_.Status -eq 'Running' } | Select-Object Name, DisplayName",
    summary:
      'From each surviving object, you choose which property columns to project. No string splitting or fragile column guessing is ever needed.',
  },
  {
    step: '4 · Select -First 3',
    command:
      "Get-Service | Where-Object { $_.Status -eq 'Running' } | Select-Object -First 3",
    summary:
      'Order matters: always filter first, then take the first 3. If you put -First 3 before Where-Object, you only test 3 random services!',
  },
  {
    step: '5 · Act on Objects',
    command: 'Get-Process | Out-GridView -PassThru | Stop-Process -WhatIf',
    summary:
      'Because real objects flow through the pipe, you can pass them directly into action cmdlets like Stop-Process (and preview safely with -WhatIf).',
  },
];

export const PipelineWalkthroughSection: React.FC = () => {
  const [pipeStepIdx, setPipeStepIdx] = useState<number>(0);
  const [activeSandbox, setActiveSandbox] = useState<
    'none' | 'pipeline' | 'syscall' | 'hunter' | 'object'
  >('none');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Larger Item (7 cols): Interactive 5-Step Pipeline Stepper */}
      <div className="lg:col-span-7 clay-well p-6 sm:p-8 space-y-5">
        <div className="space-y-1">
          <span className="text-[0.75rem] font-mono font-extrabold uppercase tracking-wider text-[var(--dp-color-accent)]">
            Interactive Step-by-Step Walkthrough
          </span>
          <h2 className="text-[1.5rem] sm:text-[1.75rem] font-extrabold leading-tight">
            How the PowerShell Object Pipeline Works
          </h2>
          <p className="text-[0.9375rem] text-[var(--dp-color-ink-secondary)] font-medium leading-relaxed">
            In PowerShell, commands pass live <strong>.NET objects</strong>, not
            fragile lines of text. Click through the 5 stages below to see how a
            one-liner is built from left to right:
          </p>
        </div>

        <div
          className="flex flex-wrap gap-2"
          role="tablist"
          aria-label="Pipeline stages"
        >
          {PIPELINE_STEPPER.map((st, idx) => (
            <button
              key={st.step}
              type="button"
              role="tab"
              aria-selected={pipeStepIdx === idx}
              onClick={() => setPipeStepIdx(idx)}
              className={`px-3.5 py-2 rounded-full text-[0.8125rem] font-extrabold cursor-pointer transition-all ${
                pipeStepIdx === idx
                  ? 'clay-btn-pink text-white'
                  : 'clay-btn-secondary'
              }`}
            >
              {st.step}
            </button>
          ))}
        </div>

        <div className="clay-card p-5 space-y-3">
          <div className="p-3.5 rounded-[1rem] clay-terminal text-[#f9e7a8] font-mono font-bold text-[0.875rem] overflow-x-auto">
            <code>{PIPELINE_STEPPER[pipeStepIdx].command}</code>
          </div>
          <p className="text-[0.9375rem] font-medium leading-relaxed">
            {PIPELINE_STEPPER[pipeStepIdx].summary}
          </p>
        </div>

        <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-black/10 dark:border-white/10">
          <span className="text-[0.8125rem] font-extrabold text-[var(--dp-color-ink-secondary)]">
            Launch Deep-Dive Architecture Visualizers:
          </span>
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'pipeline', label: 'Object Pipeline' },
              { id: 'syscall', label: 'Syscall Tracer' },
              { id: 'hunter', label: 'Spot the Malware' },
              { id: 'object', label: 'Object X-Ray' },
            ].map((sb) => (
              <button
                key={sb.id}
                type="button"
                onClick={() =>
                  setActiveSandbox(
                    activeSandbox === sb.id
                      ? 'none'
                      : (sb.id as typeof activeSandbox)
                  )
                }
                className={`px-3 py-1.5 rounded-full text-[0.75rem] font-extrabold cursor-pointer ${
                  activeSandbox === sb.id
                    ? 'clay-btn-primary'
                    : 'clay-btn-secondary'
                }`}
              >
                {sb.label}
              </button>
            ))}
          </div>
        </div>

        {activeSandbox !== 'none' && (
          <div className="pt-2">
            {activeSandbox === 'pipeline' && <PipelineVisualizer />}
            {activeSandbox === 'syscall' && <SyscallAnimator />}
            {activeSandbox === 'hunter' && <MalwareProcessHunter />}
            {activeSandbox === 'object' && <ObjectAnatomy />}
          </div>
        )}
      </div>

      {/* Smaller Explanations Beside It (5 cols) */}
      <div className="lg:col-span-5 space-y-5">
        <div className="clay-cushion-warm p-6 space-y-2.5">
          <div className="flex items-center gap-2.5">
            <Lightbulb className="w-5 h-5 shrink-0" />
            <h3 className="text-[1.125rem] font-extrabold">
              💡 Golden Rule of Least Privilege
            </h3>
          </div>
          <p className="text-[0.9375rem] font-medium leading-relaxed">
            Log on as a standard user and only elevate when a specific task
            requires an administrative Access Token. Every program you launch
            inherits your security token!
          </p>
        </div>

        <div className="clay-cushion-mint p-6 space-y-3">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 shrink-0" />
            <h3 className="text-[1.125rem] font-extrabold">
              🧰 The Self-Reliance Pocketknife
            </h3>
          </div>
          <p className="text-[0.9375rem] font-medium leading-relaxed">
            You never need to memorize 4,000 cmdlets. Memorize these four
            commands and you can solve any Windows task offline:
          </p>
          <ul className="space-y-1.5 text-[0.875rem] font-mono">
            <li>
              <strong>1. Update-Help</strong> - download the manual first
            </li>
            <li>
              <strong>2. Get-Command *noun*</strong> - discover the cmdlet
            </li>
            <li>
              <strong>3. Get-Help &lt;cmd&gt; -Examples</strong> - read real
              examples
            </li>
            <li>
              <strong>4. Get-Member</strong> - X-ray properties &amp; methods
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
