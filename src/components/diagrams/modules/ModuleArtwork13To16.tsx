import React from 'react';
import { ModulePalette } from './modulePalettes';

interface ModuleArtworkProps {
  moduleNumber: number;
  p: ModulePalette;
}

export const ModuleArtwork13To16: React.FC<ModuleArtworkProps> = ({ moduleNumber, p }) => {
  switch (moduleNumber) {
    case 13:
      return (
        <g>
          <rect x="48" y="28" width="36" height="112" rx="10" fill="#f87171" stroke="#ffffff" strokeWidth="2" />
          <line x1="48" y1="64" x2="84" y2="64" stroke="#ffffff" strokeWidth="2" />
          <line x1="48" y1="102" x2="84" y2="102" stroke="#ffffff" strokeWidth="2" />
          <path d="M 96 84 L 164 84" stroke={p.accent} strokeWidth="5" strokeLinecap="round" />
          <path d="M214 30 L256 46 L256 86 C256 114 238 132 214 142 C190 132 172 114 172 86 L172 46 Z" fill={p.accent} stroke="#ffffff" strokeWidth="2.5" />
          <path d="M201 86 L211 96 L230 74" fill="none" stroke="#064e3b" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
          <g transform="translate(296, 36)">
            <rect width="96" height="96" rx="24" fill={p.surface} stroke="#ffffff" strokeWidth="2" />
            <circle cx="48" cy="48" r="28" fill="#1e3a8a" />
            <path d="M 48 32 V 48 L 60 56" fill="none" stroke="#fde68a" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        </g>
      );
    case 14:
      return (
        <g>
          <g transform="translate(116, 78)">
            <circle r="42" fill={p.accent} stroke="#ffffff" strokeWidth="2.5" />
            <circle r="18" fill="#1e1b4b" />
          </g>
          <g transform="translate(178, 112)">
            <circle r="26" fill={p.secondary} stroke="#ffffff" strokeWidth="2" />
            <circle r="10" fill="#1e1b4b" />
          </g>
          <g transform="translate(246, 32)">
            <rect width="144" height="104" rx="24" fill={p.surface} stroke="#ffffff" strokeWidth="2" />
            <rect x="20" y="20" width="46" height="28" rx="8" fill="#1d4ed8" />
            <rect x="76" y="20" width="48" height="28" rx="8" fill="#3b82f6" />
            <rect x="20" y="58" width="104" height="26" rx="8" fill="#10b981" />
          </g>
        </g>
      );
    case 15:
      return (
        <g>
          <g transform="translate(118, 84)">
            <circle r="52" fill="#0f172a" stroke={p.accent} strokeWidth="2.5" />
            <circle r="34" fill="none" stroke={p.accent} strokeOpacity="0.5" strokeWidth="1.5" strokeDasharray="4 3" />
            <circle r="16" fill="none" stroke={p.accent} strokeOpacity="0.5" strokeWidth="1.5" />
            <line x1="0" y1="0" x2="36" y2="-36" stroke={p.accent} strokeWidth="3.5" strokeLinecap="round" />
            <circle cx="22" cy="-22" r="5" fill="#fde68a" />
            <circle cx="-18" cy="14" r="4" fill={p.accent} />
          </g>
          <line x1="176" y1="84" x2="246" y2="84" stroke={p.accent} strokeWidth="3" strokeDasharray="5 4" />
          <g transform="translate(254, 34)">
            <rect width="126" height="100" rx="22" fill={p.surface} stroke="#ffffff" strokeWidth="2" />
            <rect x="28" y="22" width="70" height="56" rx="12" fill="#0f172a" stroke="#1d4ed8" strokeWidth="2" />
            <circle cx="48" cy="50" r="8" fill={p.accent} />
            <circle cx="78" cy="50" r="8" fill="#38bdf8" />
          </g>
        </g>
      );
    case 16:
    default:
      return (
        <g>
          <g transform="translate(46, 36)">
            <rect width="124" height="96" rx="22" fill={p.surface} stroke="#ffffff" strokeWidth="2" />
            <rect x="24" y="54" width="14" height="24" rx="5" fill="#3b82f6" />
            <rect x="46" y="38" width="14" height="40" rx="5" fill="#1d4ed8" />
            <rect x="68" y="24" width="14" height="54" rx="5" fill="#10b981" />
            <rect x="90" y="44" width="14" height="34" rx="5" fill="#60a5fa" />
          </g>
          <path d="M312 22 L364 42 L364 88 C364 120 342 140 312 150 C282 140 260 120 260 88 L260 42 Z" fill={p.accent} stroke="#ffffff" strokeWidth="2.5" />
          <circle cx="312" cy="84" r="22" fill="#064e3b" />
          <path d="M303 84 L310 91 L323 76" fill="none" stroke="#a7f3d0" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      );
  }
};
