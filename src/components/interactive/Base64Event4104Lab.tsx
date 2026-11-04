import React, { useState } from 'react';
import { ShieldAlert, Lock, Unlock, Terminal, RotateCcw } from 'lucide-react';

const SAMPLE_PAYLOADS = [
  {
    label: 'Recon: Check WhoAmI & Privileges',
    command: 'whoami /priv; Get-LocalGroupMember -Group "Administrators"',
  },
  {
    label: 'AD SPN Hunter (Kerberoasting Recon)',
    command:
      '([adsisearcher]"(&(objectCategory=user)(servicePrincipalName=*))").FindAll()',
  },
  {
    label: 'Blue Team Audit: Find Unsigned Scripts',
    command:
      'Get-ChildItem C:\\Scripts -Filter *.ps1 | Get-AuthenticodeSignature | Where-Object Status -ne "Valid"',
  },
];

function encodeUtf16LeBase64(text: string): {
  base64: string;
  hexPreview: string;
} {
  const bytes: number[] = [];
  for (let i = 0; i < text.length; i++) {
    const code = text.charCodeAt(i);
    bytes.push(code & 0xff);
    bytes.push((code >> 8) & 0xff);
  }
  let binary = '';
  for (const b of bytes) {
    binary += String.fromCharCode(b);
  }
  const base64 = typeof btoa !== 'undefined' ? btoa(binary) : '';
  const hexPreview = bytes
    .slice(0, 24)
    .map((b) => b.toString(16).padStart(2, '0').toUpperCase())
    .join(' ');
  return { base64, hexPreview };
}

export const Base64Event4104Lab: React.FC = () => {
  const [plainCommand, setPlainCommand] = useState(SAMPLE_PAYLOADS[0].command);
  const { base64, hexPreview } = encodeUtf16LeBase64(plainCommand);

  return (
    <div className="space-y-6">
      <div className="space-y-1.5">
        <div className="inline-flex items-center gap-2 text-[0.75rem] font-mono font-extrabold uppercase tracking-wider text-[var(--dp-color-accent)]">
          <ShieldAlert className="w-4 h-4" />
          <span>Module 15 &amp; 16 Cyber Lab · Red Team vs Blue Team</span>
        </div>
        <h3 className="text-[1.375rem] sm:text-[1.625rem] font-extrabold text-[var(--dp-color-ink)]">
          Live UTF-16LE <code className="font-mono">-EncodedCommand</code> &amp;
          Event ID 4104 Inspector
        </h3>
        <p className="text-[0.9375rem] text-[var(--dp-color-ink-secondary)] font-medium leading-relaxed">
          Why do Base64 PowerShell payloads always have so many{' '}
          <code className="font-mono font-bold">A</code> characters? Because
          Windows PowerShell’s <code className="font-mono">-EncodedCommand</code>{' '}
          requires <strong>UTF-16LE (Unicode)</strong> where every ASCII
          character is padded with a <code className="font-mono">0x00</code>{' '}
          null byte, and why Blue Teams still catch it via <strong>AMSI</strong>{' '}
          and <strong>Event ID 4104</strong>.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[0.75rem] font-mono font-extrabold uppercase text-[var(--dp-color-ink-secondary)] mr-1">
          Load Sample Script Block:
        </span>
        {SAMPLE_PAYLOADS.map((preset) => (
          <button
            key={preset.label}
            type="button"
            onClick={() => setPlainCommand(preset.command)}
            className={`px-3.5 py-1.5 rounded-full text-[0.78rem] font-extrabold cursor-pointer ${
              plainCommand === preset.command
                ? 'clay-btn-primary'
                : 'clay-btn-secondary'
            }`}
          >
            {preset.label}
          </button>
        ))}
        <button
          type="button"
          onClick={() => setPlainCommand(SAMPLE_PAYLOADS[0].command)}
          className="px-3 py-1.5 rounded-full text-[0.75rem] font-extrabold clay-pill inline-flex items-center gap-1 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-6 clay-well p-5 space-y-4">
          <label
            htmlFor="ps-plain-command"
            className="text-[0.78rem] font-mono font-extrabold uppercase tracking-wider text-[var(--dp-color-accent)] flex items-center gap-1.5"
          >
            <Unlock className="w-4 h-4" />
            <span>1. Plain-Text PowerShell Script Block</span>
          </label>
          <textarea
            id="ps-plain-command"
            rows={3}
            value={plainCommand}
            onChange={(e) => setPlainCommand(e.target.value)}
            className="w-full p-3.5 rounded-[1rem] clay-card font-mono text-[0.85rem] font-bold text-[var(--dp-color-ink)]"
            placeholder="Type any PowerShell command..."
          />

          <div className="space-y-1.5">
            <span className="text-[0.75rem] font-mono font-extrabold uppercase tracking-wider text-[var(--dp-color-ink-secondary)] block">
              2. UTF-16LE Byte Stream (First 12 Chars - Notice 00 Null Bytes):
            </span>
            <div className="p-3 rounded-[0.875rem] clay-card font-mono text-[0.78rem] font-bold text-[var(--dp-color-accent)] break-all">
              {hexPreview || '00'} ...
            </div>
          </div>
        </div>

        <div className="lg:col-span-6 p-5 rounded-[1.5rem] clay-terminal space-y-4 font-mono text-[0.8125rem]">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[#93c5fd] text-[0.75rem] uppercase tracking-wider font-extrabold">
              <span className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" />
                <span>3. Resulting -EncodedCommand String</span>
              </span>
              <span>[Convert]::ToBase64String</span>
            </div>
            <div className="p-3 rounded-[0.875rem] bg-black/30 text-[#fde68a] break-all font-bold">
              powershell.exe -NoProfile -EncodedCommand {base64}
            </div>
          </div>

          <div className="pt-3 border-t border-white/10 space-y-1.5">
            <div className="flex items-center justify-between text-[#a7f3d0] text-[0.75rem] uppercase tracking-wider font-extrabold">
              <span className="flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5" />
                <span>4. What Blue Team Sees (Event ID 4104 + AMSI)</span>
              </span>
              <span>De-obfuscated in RAM</span>
            </div>
            <div className="p-3 rounded-[0.875rem] bg-black/30 text-[#e2e8f0] space-y-1">
              <div className="text-[#93c5fd] text-[0.75rem]">
                LogName: Microsoft-Windows-PowerShell/Operational · EventID: 4104
              </div>
              <div className="text-[#a7f3d0] font-bold break-all">
                ScriptBlockText: {plainCommand}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
