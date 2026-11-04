import React from 'react';
import { Terminal, Network } from 'lucide-react';
export { SystemProcessesStepper } from './SystemProcessesStepper';
export { OffensiveKillchainSvg } from './OffensiveKillchainSvg';

const CMDLET_PARTS = [
  { x: 10, w: 180, cx: 100, color: '#2563eb', top: 'Get-', bot: 'Approved Verb (Action)' },
  { x: 210, w: 190, cx: 305, color: '#059669', top: 'Process', bot: 'Singular Noun (Target)' },
  { x: 420, w: 180, cx: 510, color: '#7c3aed', top: '-Name', bot: 'Parameter (Option)' },
  { x: 620, w: 190, cx: 715, color: '#d97706', top: 'explorer', bot: 'Argument (Value)' },
];

const CORE_NET_NODES = [
  { x: 20, w: 220, cx: 130, color: '#2563eb', t1: 'WS2025-CORE-01', t2: 'IP: 192.168.153.210 /24', t3: 'Server Range: .200 - .250' },
  { x: 310, w: 200, cx: 410, color: '#059669', t1: 'pfSense Firewall / Router', t2: 'LAN: 192.168.153.1 /24', t3: 'Default Gateway + DNS Forwarder' },
  { x: 580, w: 220, cx: 690, color: '#7c3aed', t1: 'Admin Workstation (W11)', t2: 'IP: 192.168.153.10 /24', t3: 'Enter-PSSession / Invoke-Command' },
];

export const CmdletAnatomySvg: React.FC = () => (
  <div className="my-6 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-5 shadow-xs space-y-3">
    <div className="flex items-center gap-2">
      <Terminal className="w-4 h-4 text-blue-600 dark:text-blue-400" />
      <span className="text-xs font-bold uppercase tracking-wider text-stone-900 dark:text-stone-100">
        Visual Diagram: Reading a PowerShell Cmdlet Like a Sentence
      </span>
    </div>
    <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 overflow-x-auto">
      <svg viewBox="0 0 820 120" className="w-full h-auto min-w-[540px]" role="img" aria-label="PowerShell Cmdlet Anatomy">
        {CMDLET_PARTS.map((b) => (
          <g key={b.top}>
            <rect x={b.x} y="20" width={b.w} height="75" rx="12" fill={b.color} fillOpacity="0.12" stroke={b.color} strokeWidth="2" />
            <text x={b.cx} y="52" textAnchor="middle" fill={b.color} fontSize="18" fontWeight="bold" fontFamily="monospace">
              {b.top}
            </text>
            <text x={b.cx} y="76" textAnchor="middle" fill="#64748b" fontSize="11" fontWeight="bold">
              {b.bot}
            </text>
          </g>
        ))}
      </svg>
    </div>
  </div>
);

export const CoreNetworkSvg: React.FC = () => (
  <div className="my-6 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-5 shadow-xs space-y-3">
    <div className="flex items-center gap-2">
      <Network className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
      <span className="text-xs font-bold uppercase tracking-wider text-stone-900 dark:text-stone-100">
        Network Architecture: Headless Server Core on Virtual LAN (192.168.153.0/24)
      </span>
    </div>
    <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 overflow-x-auto">
      <svg viewBox="0 0 820 185" className="w-full h-auto min-w-[560px]" role="img" aria-label="Core Server Network Topology">
        {CORE_NET_NODES.map((n) => (
          <g key={n.t1}>
            <rect x={n.x} y="45" width={n.w} height="80" rx="12" fill={n.color} fillOpacity="0.12" stroke={n.color} strokeWidth="2" />
            <text x={n.cx} y="75" textAnchor="middle" fill={n.color} fontSize="14" fontWeight="bold">{n.t1}</text>
            <text x={n.cx} y="95" textAnchor="middle" fill="#64748b" fontSize="11" fontFamily="monospace">{n.t2}</text>
            <text x={n.cx} y="112" textAnchor="middle" fill="#64748b" fontSize="10">{n.t3}</text>
          </g>
        ))}
        <line x1="240" y1="85" x2="310" y2="85" stroke="#10b981" strokeWidth="2.5" />
        <text x="275" y="75" textAnchor="middle" fill="#10b981" fontSize="10" fontWeight="bold">GW &amp; DNS</text>
        <line x1="510" y1="85" x2="580" y2="85" stroke="#7c3aed" strokeWidth="2.5" />
        <text x="545" y="75" textAnchor="middle" fill="#7c3aed" fontSize="10" fontWeight="bold">WinRM 5985</text>
        <text x="410" y="160" textAnchor="middle" fill="#64748b" fontSize="11">
          Isolated Virtual LAN Segment (VMnet10 to 192.168.153.0/24): Servers live at .200 - .250 so they never collide with client workstations.
        </text>
      </svg>
    </div>
  </div>
);
