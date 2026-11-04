import React from 'react';
import { ModulePalette } from './modulePalettes';

interface ModuleArtworkProps {
  moduleNumber: number;
  p: ModulePalette;
}

export const ModuleArtwork5To8: React.FC<ModuleArtworkProps> = ({ moduleNumber, p }) => {
  switch (moduleNumber) {
    case 5:
      return (
        <g>
          <rect x="38" y="34" width="94" height="100" rx="22" fill={p.surface} stroke="#ffffff" strokeWidth="2" />
          <polygon points="85,54 110,84 85,114 60,84" fill="#1d4ed8" />
          <path d="M 134 62 L 306 62" stroke={p.secondary} strokeWidth="6" strokeLinecap="round" />
          <rect x="198" y="44" width="36" height="36" rx="10" fill={p.secondary} stroke="#ffffff" strokeWidth="2" />
          <path d="M 134 108 L 306 108" stroke={p.accent} strokeWidth="6" strokeLinecap="round" />
          <circle cx="216" cy="108" r="17" fill={p.accent} stroke="#ffffff" strokeWidth="2" />
          <rect x="308" y="34" width="94" height="100" rx="22" fill="#a7f3d0" stroke="#ffffff" strokeWidth="2" />
          <circle cx="355" cy="84" r="24" fill="#065f46" />
          <path d="M 345 84 L 352 92 L 367 76" fill="none" stroke="#a7f3d0" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      );
    case 6:
      return (
        <g>
          {[0, 1, 2, 3].map((idx) => (
            <g key={idx} transform={`translate(${42 + idx * 44}, 42)`}>
              <rect width="36" height="86" rx="14" fill="#ffffff" fillOpacity="0.16" stroke="#ffffff" strokeWidth="1.5" />
              <circle cx="18" cy="32" r="10" fill={idx % 2 === 0 ? p.accent : p.secondary} />
              <rect x="10" y="54" width="16" height="18" rx="5" fill="#ffffff" fillOpacity="0.45" />
            </g>
          ))}
          <g transform="translate(256, 28)">
            <rect width="136" height="112" rx="26" fill={p.surface} stroke="#ffffff" strokeWidth="2.5" />
            <circle cx="68" cy="56" r="32" fill="#0f172a" stroke="#10b981" strokeWidth="3" />
            <circle cx="68" cy="50" r="8" fill={p.accent} />
            <path d="M 63 56 L 73 56 L 76 72 L 60 72 Z" fill={p.accent} />
          </g>
        </g>
      );
    case 7:
      return (
        <g>
          <circle cx="58" cy="54" r="13" fill="#f87171" />
          <circle cx="88" cy="46" r="14" fill={p.accent} stroke="#ffffff" strokeWidth="1.5" />
          <circle cx="66" cy="88" r="15" fill={p.accent} stroke="#ffffff" strokeWidth="1.5" />
          <circle cx="96" cy="112" r="12" fill="#94a3b8" />
          <circle cx="56" cy="122" r="11" fill="#fbbf24" />
          <polygon points="136,30 198,64 198,104 136,138" fill={p.secondary} stroke="#ffffff" strokeWidth="2" />
          <rect x="198" y="70" width="48" height="28" rx="8" fill="#fde68a" stroke="#ffffff" strokeWidth="1.5" />
          <circle cx="276" cy="84" r="14" fill={p.accent} stroke="#ffffff" strokeWidth="2" />
          <circle cx="314" cy="84" r="14" fill={p.accent} stroke="#ffffff" strokeWidth="2" />
          <path d="M368 38 L402 52 L402 86 C402 110 387 126 368 136 C349 126 334 110 334 86 L334 52 Z" fill={p.accent} stroke="#ffffff" strokeWidth="2" />
          <path d="M358 84 L365 92 L380 74" fill="none" stroke="#064e3b" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      );
    case 8:
    default:
      return (
        <g>
          <path d="M 88 84 L 154 46 M 88 84 L 154 84 M 88 84 L 154 122" stroke="#93c5fd" strokeWidth="3" />
          <path d="M 154 46 L 228 46 M 154 84 L 228 84 M 154 122 L 228 122" stroke="#93c5fd" strokeWidth="3" strokeDasharray="4 3" />
          <rect x="44" y="58" width="52" height="52" rx="16" fill={p.accent} stroke="#ffffff" strokeWidth="2" />
          {[30, 68, 106].map((y, i) => (
            <rect key={i} x="144" y={y} width="36" height="32" rx="10" fill={p.surface} stroke="#ffffff" strokeWidth="1.5" />
          ))}
          <polygon points="356,84 242,36 242,132" fill="#fde68a" fillOpacity="0.22" />
          <circle cx="248" cy="84" r="22" fill="#fde68a" stroke="#ffffff" strokeWidth="2.5" />
          <circle cx="356" cy="84" r="30" fill={p.secondary} stroke="#ffffff" strokeWidth="2.5" />
          <circle cx="356" cy="84" r="12" fill="#0f172a" />
        </g>
      );
  }
};
