import React, { useState } from 'react';
import { Terminal, Copy, Check, Sparkles, ShieldCheck, Filter, Layers } from 'lucide-react';
import { COMMAND_BUILDER_SCENARIOS } from '../../data/labScenarios';

export const CommandBuilderLab: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string>('services');
  const [useFilterLeft, setUseFilterLeft] = useState<boolean>(true);
  const [useWhere, setUseWhere] = useState<boolean>(true);
  const [useSelect, setUseSelect] = useState<boolean>(true);
  const [useSafeAction, setUseSafeAction] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const scenario =
    COMMAND_BUILDER_SCENARIOS.find((s) => s.id === selectedId) || COMMAND_BUILDER_SCENARIOS[0];

  const builtCommand = [
    scenario.baseCmd,
    useFilterLeft ? scenario.filterLeftFlag : '',
    useWhere ? scenario.whereClause : '',
    useSafeAction ? scenario.actionCmd : useSelect ? scenario.selectProps : '',
  ]
    .filter(Boolean)
    .join(' ');

  const visibleRows = useWhere ? scenario.rows.slice(0, 3) : scenario.rows;
  const colLimit = useSelect ? 3 : 4;

  const handleCopy = () => {
    navigator.clipboard.writeText(builtCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const stages = [
    { label: 'Stage 1 · Filter Left', status: useFilterLeft ? 'ON: Source Filter' : 'OFF: Pull Everything', active: useFilterLeft, cushion: 'clay-cushion-mint', icon: Filter, onClick: () => setUseFilterLeft(!useFilterLeft) },
    { label: 'Stage 2 · Pipeline Filter', status: useWhere ? 'ON: Where-Object' : 'OFF: No Where Filter', active: useWhere, cushion: 'clay-cushion-warm', icon: Layers, onClick: () => setUseWhere(!useWhere) },
    { label: 'Stage 3 · Shape Properties', status: useSelect && !useSafeAction ? 'ON: Select-Object' : 'OFF: Default View', active: useSelect && !useSafeAction, cushion: 'clay-cushion-cool', icon: Terminal, onClick: () => { setUseSelect(!useSelect); if (!useSelect) setUseSafeAction(false); } },
    { label: 'Stage 4 · Dry-Run Action', status: useSafeAction ? (scenario.supportsWhatIf ? 'ON: -WhatIf Safety' : 'ON: Export-Csv') : 'OFF: Read-Only', active: useSafeAction, cushion: 'clay-cushion-lavender', icon: ShieldCheck, onClick: () => setUseSafeAction(!useSafeAction) },
  ];

  return (
    <div className="clay-well p-4 sm:p-6 min-w-0 max-w-full">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 mb-5 border-b border-[rgba(15,23,42,0.08)]">
        <div>
          <div className="inline-flex items-center gap-2 text-[0.75rem] font-extrabold uppercase tracking-wider text-[var(--dp-color-accent)] mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            Interactive Live One-Liner Builder
          </div>
          <h3 className="text-[1.25rem] sm:text-[1.4rem] font-extrabold text-[var(--dp-color-ink)] tracking-tight">
            Toggle Pipeline Stages &amp; Watch the .NET Objects Change
          </h3>
        </div>

        <div className="flex flex-wrap gap-2 min-w-0">
          {COMMAND_BUILDER_SCENARIOS.map((s) => (
            <button
              key={s.id}
              type="button"
              aria-pressed={selectedId === s.id}
              onClick={() => setSelectedId(s.id)}
              className={`tap-target px-3.5 py-2 rounded-full text-[0.8125rem] font-extrabold transition-all cursor-pointer ${
                selectedId === s.id
                  ? 'clay-btn-pink'
                  : 'clay-chip-surface text-[var(--dp-color-ink-secondary)] hover:text-[var(--dp-color-ink)] shadow-sm'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 mb-5">
        {stages.map((st) => {
          const Icon = st.icon;
          return (
            <button
              key={st.label}
              type="button"
              aria-pressed={st.active}
              onClick={st.onClick}
              className={`p-3.5 rounded-[1.15rem] text-left transition-all cursor-pointer flex items-start justify-between gap-2 ${
                st.active ? st.cushion : 'clay-chip-surface text-[var(--dp-color-ink)]'
              }`}
            >
              <div>
                <div className="text-[0.75rem] font-extrabold uppercase tracking-wider text-[var(--dp-color-ink-secondary)]">{st.label}</div>
                <div className="text-[0.875rem] font-extrabold font-mono text-[var(--dp-color-ink)] mt-0.5">{st.status}</div>
              </div>
              <Icon className="w-4 h-4 text-[var(--dp-color-ink)] shrink-0 mt-0.5" />
            </button>
          );
        })}
      </div>

      <div className="clay-terminal p-4 sm:p-5 mb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-3 mb-3 border-b border-white/10">
          <div className="flex flex-wrap items-center gap-x-2 min-w-0">
            <span className="text-[0.75rem] font-mono font-bold text-[#93c5fd]">PS C:\Users\Izaz&gt;</span>
            <span className="text-[0.75rem] font-mono text-white/60">Emits: [{scenario.dotnetType}]</span>
          </div>
          <button
            onClick={handleCopy}
            className="tap-target self-start px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-white text-[0.75rem] font-extrabold inline-flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-[#a7f3d0]" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied' : 'Copy One-Liner'}
          </button>
        </div>

        <code className="block font-mono text-[0.9rem] sm:text-[1rem] text-[#f9e7a8] font-bold [overflow-wrap:anywhere] leading-[1.55]">
          {builtCommand}
        </code>

        <div className="mt-4 pt-3.5 border-t border-white/10">
          {useSafeAction && scenario.supportsWhatIf ? (
            <div className="font-mono text-[0.84rem] text-[#93c5fd] space-y-1">
              {visibleRows.map((r, i) => (
                <div key={i}>
                  What if: Performing the operation &quot;Action&quot; on target &quot;{Object.values(r)[0]} ({Object.values(r)[1]})&quot;.
                </div>
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-[0.8125rem] text-[#e2e8f0]">
                <thead>
                  <tr className="border-b border-white/15 text-[#93c5fd]">
                    {Object.keys(visibleRows[0] || {}).slice(0, colLimit).map((col) => (
                      <th key={col} className="pb-1.5 pr-4 font-extrabold">{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {visibleRows.map((row, idx) => (
                    <tr key={idx}>
                      {Object.entries(row).slice(0, colLimit).map(([k, val]) => (
                        <td key={k} className="py-1.5 pr-4">{val}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <p className="text-[0.875rem] text-[var(--dp-color-ink-secondary)] font-medium leading-[1.55]">
        <strong className="text-[var(--dp-color-ink)]">Why this matters:</strong> {scenario.explanation}
      </p>
    </div>
  );
};
