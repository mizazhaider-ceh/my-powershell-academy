import React, { useState } from 'react';
import { Play, Cpu } from 'lucide-react';
import { SYSCALL_STEPS } from '../../../data/windowsInternalsData';

const RING_LAYERS = [
  { y: 10, h: 32, ty: 30, f: '#2563eb', op: 0.85, txt: 'User Processes (Notepad.exe, Chrome, PowerShell) - Ring 3' },
  { y: 48, h: 28, ty: 66, f: '#3b82f6', op: 0.55, txt: 'Subsystem DLLs (kernel32.dll, user32.dll - shared dialogs & APIs)' },
  { y: 82, h: 28, ty: 100, f: '#d97706', op: 0.9, txt: 'NTDLL.DLL - The Syscall Gate ⬇ User / Kernel Mode Boundary ⬇' },
  { y: 118, h: 32, ty: 138, f: '#7c3aed', op: 0.85, txt: 'Executive (ntoskrnl.exe): Memory · Process · I/O · Object Managers' },
  { y: 156, h: 26, ty: 173, f: '#059669', op: 0.85, txt: 'HAL (Hardware Abstraction Layer) + Device Drivers - Ring 0' },
  { y: 188, h: 24, ty: 204, f: '#334155', op: 1, txt: 'Physical Hardware (CPU Cores, RAM Chips, NVMe SSD, NIC)' },
];

export const SyscallAnimator: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const runAnimation = () => {
    if (isPlaying) return;
    setIsPlaying(true);
    setActiveStep(0);
    let step = 0;
    const interval = setInterval(() => {
      step += 1;
      if (step < SYSCALL_STEPS.length) {
        setActiveStep(step);
      } else {
        clearInterval(interval);
        setIsPlaying(false);
      }
    }, 1100);
  };

  const current = SYSCALL_STEPS[activeStep];

  return (
    <div className="my-6 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-5 shadow-xs space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-200 dark:border-stone-800">
        <div>
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-stone-900 dark:text-stone-100">
              Interactive Lab: The System Call (Syscall) Journey
            </span>
          </div>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
            Watch a file-save request travel from User Mode across the NTDLL.DLL gate into the Kernel and back.
          </p>
        </div>
        <button
          onClick={runAnimation}
          disabled={isPlaying}
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer self-start sm:self-auto"
        >
          <Play className="w-3.5 h-3.5 fill-white" />
          <span>{isPlaying ? 'Tracing Syscall...' : 'Animate Syscall'}</span>
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {SYSCALL_STEPS.map((st, idx) => (
          <button
            key={st.id}
            onClick={() => setActiveStep(idx)}
            className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
              activeStep === idx
                ? 'border-blue-600 bg-blue-600 text-white shadow-xs font-semibold'
                : 'border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950/60 text-stone-700 dark:text-stone-300 hover:border-blue-400'
            }`}
          >
            <div className="text-[11px] font-mono truncate">{st.short}</div>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
        <div className="lg:col-span-6 space-y-2">
          {SYSCALL_STEPS.map((st, idx) => {
            const isCurrent = activeStep === idx;
            return (
              <div
                key={st.id}
                onClick={() => setActiveStep(idx)}
                className={`p-3 rounded-xl border-2 transition-all duration-300 cursor-pointer flex items-center justify-between ${
                  isCurrent
                    ? `${st.color} scale-[1.02] shadow-sm`
                    : 'border-stone-200/70 dark:border-stone-800/70 bg-stone-50/50 dark:bg-stone-950/30 opacity-65'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className={`w-3 h-3 rounded-full transition-all ${
                      isCurrent ? 'bg-emerald-500 ring-4 ring-emerald-500/30 animate-pulse' : 'bg-stone-300 dark:bg-stone-700'
                    }`}
                  />
                  <span className="text-xs font-bold">{st.title}</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/5 dark:bg-white/5">{st.badge}</span>
              </div>
            );
          })}
        </div>

        <div className="lg:col-span-6 space-y-4">
          <div className="p-4 rounded-xl bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase tracking-wider text-blue-600 dark:text-blue-400 font-bold">
                Step {activeStep + 1} of 5
              </span>
              <span className="text-[11px] font-mono text-stone-500">{current.badge}</span>
            </div>
            <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100">{current.title}</h4>
            <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">{current.desc}</p>
          </div>

          <div className="p-3 rounded-xl bg-stone-100/70 dark:bg-stone-950/80 border border-stone-200 dark:border-stone-800">
            <svg viewBox="0 0 600 220" className="w-full h-auto" role="img" aria-label="Windows User Mode vs Kernel Mode Architecture">
              {RING_LAYERS.map((r) => (
                <g key={r.y}>
                  <rect x="20" y={r.y} width="560" height={r.h} rx="6" fill={r.f} opacity={r.op} />
                  <text x="300" y={r.ty} textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="bold">
                    {r.txt}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};
