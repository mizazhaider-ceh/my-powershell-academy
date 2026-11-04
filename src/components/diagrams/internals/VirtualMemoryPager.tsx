import React, { useState } from 'react';
import { Layers } from 'lucide-react';
import { VirtualMemoryMappingSvg } from './VirtualMemoryMappingSvg';

const INITIAL_PAGES = [
  'ntoskrnl.exe (4KB)',
  'lsass.exe (4KB)',
  'explorer.exe (4KB)',
  'powershell.exe (4KB)',
];

export const VirtualMemoryPager: React.FC = () => {
  const [ramPages, setRamPages] = useState<string[]>(INITIAL_PAGES);
  const [diskPages, setDiskPages] = useState<string[]>([]);
  const [statusMsg, setStatusMsg] = useState<string>(
    'Each process sees contiguous 4 KB virtual pages. Physical RAM currently has 4/8 slots free.'
  );

  const openHeavyApps = () => {
    const newPages = [
      'Chrome Tab #1 (4KB)',
      'Chrome Tab #2 (4KB)',
      'VS Code (4KB)',
      'Discord (4KB)',
    ];
    const combined = [...ramPages, ...newPages];
    if (combined.length <= 8) {
      setRamPages(combined);
      setStatusMsg('RAM is now full (8/8 slots occupied by 4 KB pages).');
    } else {
      const overflow = combined.slice(8);
      setRamPages(combined.slice(0, 8));
      setDiskPages([...diskPages, ...overflow]);
      setStatusMsg('RAM filled up! Overflow pages moved to pagefile.sys.');
    }
  };

  const addMemoryPressure = () => {
    if (ramPages.length === 0) return;
    const evicted = ramPages[1] || ramPages[0];
    const remaining = ramPages.filter((_, i) => i !== (ramPages[1] ? 1 : 0));
    setRamPages([...remaining, 'GameEngine.exe (4KB)']);
    setDiskPages([...diskPages, `${evicted} [Paged Out]`]);
    setStatusMsg(
      `Memory Manager paged out "${evicted}" to C:\\pagefile.sys on disk to make room for active threads!`
    );
  };

  const resetMemory = () => {
    setRamPages(INITIAL_PAGES);
    setDiskPages([]);
    setStatusMsg('Memory reset to clean baseline.');
  };

  return (
    <div className="my-6 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-5 shadow-xs space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-200 dark:border-stone-800">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-stone-900 dark:text-stone-100">
              Interactive Simulator: 4 KB Virtual Memory Pages &amp; Disk Paging
            </span>
          </div>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
            Fill physical RAM and watch the Kernel Memory Manager swap inactive 4 KB pages out to disk.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={openHeavyApps}
            className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold cursor-pointer"
          >
            + Open Apps
          </button>
          <button
            onClick={addMemoryPressure}
            className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold cursor-pointer"
          >
            🔥 Add RAM Pressure
          </button>
          <button
            onClick={resetMemory}
            className="px-3 py-1.5 rounded-lg bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 text-xs font-semibold cursor-pointer"
          >
            Reset
          </button>
        </div>
      </div>

      <VirtualMemoryMappingSvg />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50/60 dark:bg-stone-950/60">
          <div className="flex justify-between text-xs font-mono font-bold mb-2">
            <span className="text-blue-600 dark:text-blue-400">Physical RAM (8 Slots Max)</span>
            <span>{ramPages.length} / 8 Pages</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {Array.from({ length: 8 }).map((_, idx) => {
              const page = ramPages[idx];
              return (
                <div
                  key={idx}
                  className={`p-2 rounded-lg border font-mono text-[0.75rem] truncate ${
                    page
                      ? 'border-blue-500/40 bg-blue-500/10 text-blue-900 dark:text-blue-200 font-semibold'
                      : 'border-dashed border-stone-300 dark:border-stone-800 text-stone-400'
                  }`}
                >
                  {page || `Empty Slot #${idx + 1}`}
                </div>
              );
            })}
          </div>
        </div>

        <div className="p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50/60 dark:bg-stone-950/60">
          <div className="flex justify-between text-xs font-mono font-bold mb-2">
            <span className="text-amber-600 dark:text-amber-400">Disk Pagefile (C:\pagefile.sys)</span>
            <span>{diskPages.length} Paged Out</span>
          </div>
          {diskPages.length === 0 ? (
            <div className="h-32 flex items-center justify-center text-xs font-mono text-stone-400 border border-dashed border-stone-300 dark:border-stone-800 rounded-lg">
              No pages swapped to disk yet
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {diskPages.map((dp, i) => (
                <div
                  key={i}
                  className="p-2 rounded-lg border border-amber-500/40 bg-amber-500/10 text-amber-900 dark:text-amber-200 font-mono text-[0.75rem] truncate"
                >
                  {dp}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="text-xs font-mono text-stone-600 dark:text-stone-300 bg-blue-50/60 dark:bg-blue-950/30 p-3 rounded-xl border border-blue-200/60 dark:border-blue-900/50">
        💡 {statusMsg}
      </div>
    </div>
  );
};
