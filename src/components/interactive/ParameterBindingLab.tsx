import React, { useState } from 'react';
import { GitMerge, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';

interface BindingCase {
  id: string;
  label: string;
  pipelineCode: string;
  sourceType: string;
  sourceProperties: string;
  targetCmdlet: string;
  byValueResult: string;
  byPropertyResult: string;
  winner: 'ByValue' | 'ByPropertyName' | 'Fails';
  traceSummary: string;
}

const BINDING_CASES: BindingCase[] = [
  {
    id: 'svc-byvalue',
    label: '1. Get-Service wuauserv | Stop-Service -WhatIf',
    pipelineCode: 'Get-Service -Name wuauserv | Stop-Service -WhatIf',
    sourceType: '[System.ServiceProcess.ServiceController]',
    sourceProperties: 'Name="wuauserv", Status="Running"',
    targetCmdlet: 'Stop-Service',
    byValueResult:
      'MATCH! Stop-Service -InputObject accepts [ServiceController] ByValue.',
    byPropertyResult: 'Skipped (ByValue already succeeded on Step 1).',
    winner: 'ByValue',
    traceSummary:
      'PowerShell always tries ByValue (exact .NET type match) FIRST. Because Get-Service emits a ServiceController object and Stop-Service -InputObject accepts ServiceController ByValue, it binds immediately without checking property names.',
  },
  {
    id: 'custom-byprop',
    label: '2. [PSCustomObject]@{ Name = "Spooler" } | Stop-Service -WhatIf',
    pipelineCode:
      '[PSCustomObject]@{ Name = "Spooler" } | Stop-Service -WhatIf',
    sourceType: '[System.Management.Automation.PSCustomObject]',
    sourceProperties: 'Name="Spooler"',
    targetCmdlet: 'Stop-Service',
    byValueResult:
      'NO MATCH - Stop-Service does not accept [PSCustomObject] ByValue.',
    byPropertyResult:
      'MATCH! Stop-Service -Name accepts [String] ByPropertyName, and the input object has a .Name property!',
    winner: 'ByPropertyName',
    traceSummary:
      'When Step 1 (ByValue) fails, PowerShell falls back to Step 2 (ByPropertyName). It inspects the incoming object’s properties, sees .Name = "Spooler", and binds it to Stop-Service -Name!',
  },
  {
    id: 'mismatch-fail',
    label: '3. [PSCustomObject]@{ ServiceName = "Spooler" } | Stop-Service',
    pipelineCode:
      '[PSCustomObject]@{ ServiceName = "Spooler" } | Stop-Service -WhatIf',
    sourceType: '[System.Management.Automation.PSCustomObject]',
    sourceProperties: 'ServiceName="Spooler" (No .Name property!)',
    targetCmdlet: 'Stop-Service',
    byValueResult: 'NO MATCH - [PSCustomObject] is not a ServiceController.',
    byPropertyResult:
      'FAIL - Stop-Service looks for a property named .Name, not .ServiceName.',
    winner: 'Fails',
    traceSummary:
      'If a CSV or custom object uses a column like ServiceName instead of Name, use Select-Object @{N="Name";E={$_.ServiceName}} to rename the property on the fly so ByPropertyName succeeds!',
  },
];

export const ParameterBindingLab: React.FC = () => {
  const [activeId, setActiveId] = useState(BINDING_CASES[0].id);
  const current =
    BINDING_CASES.find((c) => c.id === activeId) || BINDING_CASES[0];

  return (
    <div className="space-y-6">
      <div className="space-y-1.5">
        <div className="inline-flex items-center gap-2 text-[0.75rem] font-mono font-extrabold uppercase tracking-wider text-[var(--dp-color-accent)]">
          <GitMerge className="w-4 h-4" />
          <span>Module 05 Simulator · Trace-Command ParameterBinding</span>
        </div>
        <h3 className="text-[1.375rem] sm:text-[1.625rem] font-extrabold text-[var(--dp-color-ink)]">
          Interactive Parameter Binding Tracer (ByValue vs ByPropertyName)
        </h3>
        <p className="text-[0.9375rem] text-[var(--dp-color-ink-secondary)] font-medium leading-relaxed">
          Select a pipeline below to watch how PowerShell’s Parameter Binding
          engine tests <strong>Step 1: ByValue (Exact .NET Type)</strong> first,
          and falls back to <strong>Step 2: ByPropertyName</strong> second.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {BINDING_CASES.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setActiveId(item.id)}
            className={`px-4 py-2 rounded-full text-[0.8125rem] font-mono font-extrabold cursor-pointer ${
              activeId === item.id ? 'clay-btn-primary' : 'clay-btn-secondary'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="clay-well p-5 sm:p-7 space-y-5">
        <div className="p-4 rounded-[1.25rem] clay-terminal font-mono text-[0.85rem] text-[#fde68a] font-bold overflow-x-auto">
          PS C:\&gt; Trace-Command -Name ParameterBinding -Expression &#123;{' '}
          {current.pipelineCode} &#125; -PSHost
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
          <div className="clay-card p-4 space-y-2">
            <span className="text-[0.72rem] font-mono font-extrabold uppercase text-[var(--dp-color-accent)]">
              Incoming Object in Pipe
            </span>
            <div className="font-mono text-[0.82rem] font-extrabold break-all">
              {current.sourceType}
            </div>
            <div className="text-[0.8rem] font-mono text-[var(--dp-color-ink-secondary)]">
              Properties: {current.sourceProperties}
            </div>
          </div>

          <div
            className={`p-4 rounded-[1.5rem] space-y-2 ${
              current.winner === 'ByValue'
                ? 'clay-cushion-mint'
                : 'clay-card opacity-85'
            }`}
          >
            <div className="flex items-center justify-between text-[0.72rem] font-mono font-extrabold uppercase">
              <span>Attempt 1 · ByValue</span>
              {current.winner === 'ByValue' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              ) : (
                <XCircle className="w-4 h-4 opacity-60" />
              )}
            </div>
            <p className="text-[0.85rem] font-bold leading-relaxed">
              {current.byValueResult}
            </p>
          </div>

          <div
            className={`p-4 rounded-[1.5rem] space-y-2 ${
              current.winner === 'ByPropertyName'
                ? 'clay-cushion-mint'
                : current.winner === 'Fails'
                  ? 'clay-cushion-warm'
                  : 'clay-card opacity-85'
            }`}
          >
            <div className="flex items-center justify-between text-[0.72rem] font-mono font-extrabold uppercase">
              <span>Attempt 2 · ByPropertyName</span>
              {current.winner === 'ByPropertyName' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              ) : (
                <ArrowRight className="w-4 h-4 opacity-60" />
              )}
            </div>
            <p className="text-[0.85rem] font-bold leading-relaxed">
              {current.byPropertyResult}
            </p>
          </div>
        </div>

        <div className="clay-cushion-cool p-4 text-[0.9rem] font-medium leading-relaxed">
          <strong>Engineering Verdict ({current.winner}):</strong>{' '}
          {current.traceSummary}
        </div>
      </div>
    </div>
  );
};
