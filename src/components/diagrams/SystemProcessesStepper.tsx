import React, { useState } from 'react';
import { Cpu, AlertTriangle } from 'lucide-react';
import { SYS_PROCS } from '../../data/diagramData';

export const SystemProcessesStepper: React.FC = () => {
  const [idx, setIdx] = useState(0);
  const current = SYS_PROCS[idx];

  return (
    <div className="my-6 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-5 shadow-xs space-y-4">
      <div className="flex items-center gap-2">
        <Cpu className="w-4 h-4 text-blue-600 dark:text-blue-400" />
        <span className="text-xs font-bold uppercase tracking-wider text-stone-900 dark:text-stone-100">
          Interactive Boot Lineup: The 7 Core Windows System Processes
        </span>
      </div>
      <p className="text-xs text-stone-500 dark:text-stone-400">
        Click each process in boot order to inspect its legitimate parent, path,
        and security role.
      </p>

      <div className="flex flex-wrap gap-2">
        {SYS_PROCS.map((p, i) => (
          <button
            key={p.name}
            onClick={() => setIdx(i)}
            className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer border ${
              idx === i
                ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                : 'bg-stone-50 dark:bg-stone-950 border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:border-blue-400'
            }`}
          >
            {i + 1}. {p.name}
          </button>
        ))}
      </div>

      <div className="p-4 rounded-xl bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-200 dark:border-stone-800 pb-2.5 font-mono text-xs">
          <span className="font-bold text-blue-600 dark:text-blue-400 text-sm">
            {current.name}
          </span>
          <div className="flex flex-wrap gap-3 text-[11px] text-stone-600 dark:text-stone-400">
            <span>
              PID: <strong>{current.pid}</strong>
            </span>
            <span>·</span>
            <span>
              Parent: <strong>{current.parent}</strong>
            </span>
            <span>·</span>
            <span>
              Path: <strong>{current.path}</strong>
            </span>
          </div>
        </div>
        <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed">
          {current.summary}
        </p>
      </div>

      <div className="p-3.5 rounded-xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 text-xs text-rose-900 dark:text-rose-200 flex items-start gap-2.5">
        <AlertTriangle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
        <div>
          <strong>The 3 Forensic Red Flags:</strong> Always check (1){' '}
          <strong>Parent Process</strong> (`services.exe` must be spawned by
          `wininit.exe`), (2) <strong>Image Path</strong> (must be
          `C:\Windows\System32`, never `C:\Temp` or `AppData`), and (3){' '}
          <strong>Spelling</strong> (`svch0st.exe` or `Isass.exe` with a capital
          i).
        </div>
      </div>
    </div>
  );
};
