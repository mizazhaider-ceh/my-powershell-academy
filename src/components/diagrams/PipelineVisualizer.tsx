import React, { useState } from 'react';
import { Play, RotateCcw, ArrowRight, Layers, Sparkles } from 'lucide-react';
import { INITIAL_PROCESSES } from '../../data/diagramData';

const STAGE_TITLES = [
  'Step 1: Data Source (Get-Process)',
  'Step 2: Left Filtering (Where-Object Handles -gt 300)',
  'Step 3: Property Selection (Select-Object Name, Handles)',
];

export const PipelineVisualizer: React.FC = () => {
  const [stage, setStage] = useState<number>(0);
  const filterThreshold = 300;

  return (
    <div className="my-6 rounded-2xl border border-stone-200 dark:border-stone-800 bg-stone-50/70 dark:bg-stone-900/50 p-5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-4 border-b border-stone-200 dark:border-stone-800">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-900 dark:text-stone-100">
              Interactive Pipeline Stream Visualizer
            </span>
          </div>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
            Watch live .NET objects flow, evaluate conditions, and emit structured properties.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {stage < 2 ? (
            <button
              onClick={() => setStage(stage + 1)}
              className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Step Next ({stage + 1}/3)</span>
            </button>
          ) : (
            <button
              onClick={() => setStage(0)}
              className="px-3 py-1.5 rounded-lg bg-stone-200 dark:bg-stone-800 hover:bg-stone-300 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Stream</span>
            </button>
          )}
        </div>
      </div>

      <div className="mb-4 bg-stone-900 text-stone-100 p-3 rounded-xl font-mono text-xs flex flex-wrap items-center gap-2">
        <span className={`px-2 py-1 rounded transition-colors ${stage === 0 ? 'bg-blue-600 text-white font-bold ring-2 ring-blue-400/50' : 'text-blue-400'}`}>
          Get-Process
        </span>
        <span className="text-stone-500 font-bold">|</span>
        <span className={`px-2 py-1 rounded transition-colors ${stage === 1 ? 'bg-emerald-600 text-white font-bold ring-2 ring-emerald-400/50' : 'text-emerald-400'}`}>
          Where-Object Handles -gt {filterThreshold}
        </span>
        <span className="text-stone-500 font-bold">|</span>
        <span className={`px-2 py-1 rounded transition-colors ${stage === 2 ? 'bg-purple-600 text-white font-bold ring-2 ring-purple-400/50' : 'text-purple-400'}`}>
          Select-Object Name, Handles
        </span>
      </div>

      <div className="mb-4 text-xs font-mono text-stone-600 dark:text-stone-400 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
        <span className="font-semibold text-stone-800 dark:text-stone-200">{STAGE_TITLES[stage] || 'Pipeline Complete'}</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {INITIAL_PROCESSES.map((proc) => {
          const passesFilter = proc.handles > filterThreshold;
          let cardStateClass = 'border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/90';

          if (stage >= 1) {
            cardStateClass = passesFilter
              ? 'border-emerald-300 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/20'
              : 'border-stone-200 dark:border-stone-800 bg-stone-100/50 dark:bg-stone-950/30 opacity-40';
          }
          if (stage === 2 && passesFilter) {
            cardStateClass = 'border-purple-300 dark:border-purple-800 bg-purple-50/50 dark:bg-purple-950/20 ring-1 ring-purple-400/30';
          }

          return (
            <div key={proc.id} className={`p-3.5 rounded-xl border transition-all duration-300 font-mono text-xs ${cardStateClass}`}>
              <div className="flex items-center justify-between pb-2 border-b border-stone-200/60 dark:border-stone-800/60 mb-2">
                <span className="font-bold text-stone-900 dark:text-stone-100 truncate">{proc.name}</span>
                <span className="text-[10px] text-stone-600 dark:text-stone-400">PID {proc.id}</span>
              </div>

              <div className="space-y-1 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-stone-500">Handles:</span>
                  <span className={`font-semibold ${stage >= 1 && passesFilter ? 'text-emerald-600 dark:text-emerald-400' : ''}`}>
                    {proc.handles}
                  </span>
                </div>
                {stage < 2 && (
                  <div className="flex justify-between">
                    <span className="text-stone-500">WorkingSet:</span>
                    <span>{proc.wsMB} MB</span>
                  </div>
                )}
              </div>

              <div className="mt-2.5 pt-2 border-t border-stone-200/40 dark:border-stone-800/40 flex items-center justify-between text-[10px]">
                {stage === 0 && (
                  <span className="text-blue-500 flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5" /> Emitted by Get-Process
                  </span>
                )}
                {stage === 1 && (
                  <span className={passesFilter ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : 'text-stone-500'}>
                    {passesFilter ? `✓ Passed (${proc.handles} > ${filterThreshold})` : `✗ Dropped (${proc.handles} ≤ ${filterThreshold})`}
                  </span>
                )}
                {stage === 2 && (
                  <span className={passesFilter ? 'text-purple-600 dark:text-purple-400 font-semibold flex items-center gap-1' : 'text-stone-500'}>
                    {passesFilter ? (
                      <>
                        <ArrowRight className="w-3 h-3" /> Selected Object
                      </>
                    ) : (
                      'Discarded'
                    )}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 p-3 rounded-xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200/70 dark:border-blue-800/40 text-xs text-blue-900 dark:text-blue-200 flex items-start gap-2.5">
        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
        <p className="leading-relaxed">
          <strong>The Object Advantage:</strong> Notice how <code className="font-mono bg-blue-100 dark:bg-blue-900/50 px-1 py-0.5 rounded">Where-Object</code> evaluated the mathematical integer property <code className="font-mono bg-blue-100 dark:bg-blue-900/50 px-1 py-0.5 rounded">Handles -gt 300</code> without any string splitting or text regex. The pipeline streamed full objects, not text!
        </p>
      </div>
    </div>
  );
};
