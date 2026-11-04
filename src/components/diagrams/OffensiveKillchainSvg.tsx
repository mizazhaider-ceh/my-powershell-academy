import React from 'react';
import { Shield } from 'lucide-react';

const KILLCHAIN_BOXES = [
  { x: 15, y: 15, cx: 135, c: '#e11d48', t1: '1. Red Team: In-Memory Cradle', t2: 'IEX (New-Object Net.WebClient)...' },
  { x: 290, y: 15, cx: 410, c: '#d97706', t1: '2. De-Obfuscation in Engine', t2: 'Base64 -EncodedCommand Unpacked' },
  { x: 565, y: 15, cx: 685, c: '#2563eb', t1: '3. AMSI & Engine Execution', t2: 'AmsiScanBuffer() Inspects Payload' },
  { x: 15, y: 105, cx: 135, c: '#059669', t1: 'Defense 1: Constrained Language', t2: '$ExecutionContext.SessionState...' },
  { x: 290, y: 105, cx: 410, c: '#7c3aed', t1: 'Defense 2: Script Block (EID 4104)', t2: 'Logs Full De-Obfuscated Code!' },
  { x: 565, y: 105, cx: 685, c: '#0284c7', t1: 'Defense 3: JEA + Transcription', t2: 'Least-Privilege Role Endpoints' },
];

export const OffensiveKillchainSvg: React.FC = () => {
  return (
    <div className="my-6 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-5 shadow-xs space-y-3">
      <div className="flex items-center gap-2">
        <Shield className="w-4 h-4 text-rose-600 dark:text-rose-400" />
        <span className="text-xs font-bold uppercase tracking-wider text-stone-900 dark:text-stone-100">
          Red Team vs Blue Team: How PowerShell Attacks &amp; Defenses Collide
        </span>
      </div>
      <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 overflow-x-auto">
        <svg viewBox="0 0 820 190" className="w-full h-auto min-w-[580px]" role="img" aria-label="PowerShell Attack and Defense Pipeline">
          {KILLCHAIN_BOXES.map((b) => (
            <g key={b.t1}>
              <rect x={b.x} y={b.y} width="240" height="65" rx="10" fill={b.c} fillOpacity="0.12" stroke={b.c} strokeWidth="2" />
              <text x={b.cx} y={b.y + 25} textAnchor="middle" fill={b.c} fontSize="12" fontWeight="bold">
                {b.t1}
              </text>
              <text x={b.cx} y={b.y + 43} textAnchor="middle" fill="#64748b" fontSize="10" fontFamily="monospace">
                {b.t2}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
};
