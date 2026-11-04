import React from 'react';
import { ShieldCheck, Cpu, CheckCircle2 } from 'lucide-react';

const EDITION_COMPARISON = [
  {
    feature: 'Executable Name',
    ps51: 'powershell.exe (System32)',
    ps75: 'pwsh.exe (Program Files\\PowerShell\\7)',
  },
  {
    feature: '.NET Runtime Engine',
    ps51: '.NET Framework 4.8 (Windows-only)',
    ps75: 'Modern .NET 9 CLR (Windows, Linux, macOS)',
  },
  {
    feature: 'Pipeline Chain Operators',
    ps51: 'Only ; and | (&& and || fail!)',
    ps75: 'Supports &&, ||, ??, and ?: ternary',
  },
  {
    feature: 'Parallel Loop Execution',
    ps51: 'Requires Runspaces or Jobs',
    ps75: 'Built-in ForEach-Object -Parallel',
  },
  {
    feature: 'Remoting Transports',
    ps51: 'WinRM (WS-Man 5985 / 5986)',
    ps75: 'WinRM (WS-Man) + OpenSSH (Port 22)',
  },
];

const GOLDEN_RULES = [
  {
    num: '01',
    title: 'Filter Left, Format Right',
    desc: 'Use -Filter on the source cmdlet so only matching objects cross the network, and keep Format-Table at the very end.',
    color: 'clay-cushion-mint',
  },
  {
    num: '02',
    title: 'Inspect Objects with Get-Member First',
    desc: 'Never guess property names from screen headers. Pipe to Get-Member to see exact Properties and Methods.',
    color: 'clay-cushion-warm',
  },
  {
    num: '03',
    title: 'Dry-Run Destructive Actions with -WhatIf',
    desc: 'Before running Stop-Process, Remove-Item, or Set-ADUser in production, append -WhatIf to preview every target.',
    color: 'clay-cushion-cool',
  },
  {
    num: '04',
    title: 'Add -ErrorAction Stop Inside try/catch',
    desc: 'Standard cmdlet errors are non-terminating and skip catch {} unless you promote them with -ErrorAction Stop.',
    color: 'clay-cushion-lavender',
  },
];

export const EditionComparisonMatrix: React.FC = () => {
  return (
    <>
      <div className="space-y-4 pt-4 border-t border-black/10 dark:border-white/10">
        <div className="flex items-center gap-2 text-[0.8rem] font-mono font-extrabold uppercase tracking-wider text-[var(--dp-color-accent)]">
          <Cpu className="w-4 h-4" />
          <span>
            2 · Windows PowerShell 5.1 vs PowerShell 7.5 LTS Compatibility
            Matrix
          </span>
        </div>

        <div className="clay-well p-4 sm:p-5 overflow-x-auto">
          <table className="w-full text-left text-[0.875rem]">
            <thead className="font-mono text-[0.75rem] uppercase border-b border-black/10 dark:border-white/10 text-[var(--dp-color-accent)]">
              <tr>
                <th className="p-3 font-extrabold">Architecture Dimension</th>
                <th className="p-3 font-extrabold">
                  Windows PowerShell 5.1 (Built-In)
                </th>
                <th className="p-3 font-extrabold">
                  PowerShell 7.5 LTS (Modern Core)
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10 dark:divide-white/10">
              {EDITION_COMPARISON.map((row) => (
                <tr key={row.feature}>
                  <td className="p-3 font-extrabold">{row.feature}</td>
                  <td className="p-3 font-mono text-[0.82rem]">{row.ps51}</td>
                  <td className="p-3 font-mono text-[0.82rem] font-bold text-[var(--dp-color-accent)]">
                    {row.ps75}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="space-y-4 pt-2">
        <div className="flex items-center gap-2 text-[0.8rem] font-mono font-extrabold uppercase tracking-wider text-[var(--dp-color-accent)]">
          <ShieldCheck className="w-4 h-4" />
          <span>3 · The 4 Production Engineering Laws</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {GOLDEN_RULES.map((rule) => (
            <div key={rule.num} className={`${rule.color} p-5 space-y-2`}>
              <div className="flex items-center justify-between font-mono text-[0.75rem] font-extrabold">
                <span>LAW #{rule.num}</span>
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <h3 className="text-[1.05rem] font-extrabold leading-snug">
                {rule.title}
              </h3>
              <p className="text-[0.85rem] font-medium leading-relaxed">
                {rule.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
