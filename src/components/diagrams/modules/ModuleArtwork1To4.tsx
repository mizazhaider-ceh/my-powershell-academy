import React from 'react';
import { ModulePalette } from './modulePalettes';

interface ModuleArtworkProps {
  moduleNumber: number;
  p: ModulePalette;
}

export const ModuleArtwork1To4: React.FC<ModuleArtworkProps> = ({ moduleNumber, p }) => {
  switch (moduleNumber) {
    case 1:
      return (
        <g>
          <rect x="44" y="32" width="124" height="104" rx="24" fill="#ffffff" fillOpacity="0.12" stroke={p.secondary} strokeWidth="2" />
          <rect x="60" y="48" width="92" height="72" rx="16" fill="#0f172a" fillOpacity="0.7" />
          <path d="M 74 68 Q 90 54, 106 68 T 138 68" fill="none" stroke={p.accent} strokeWidth="3" strokeLinecap="round" />
          <path d="M 74 86 Q 90 72, 106 86 T 138 86" fill="none" stroke={p.secondary} strokeWidth="3" strokeLinecap="round" />
          <path d="M 74 102 Q 90 88, 106 102 T 138 102" fill="none" stroke="#fde68a" strokeWidth="3" strokeLinecap="round" />
          <line x1="176" y1="84" x2="244" y2="84" stroke={p.accent} strokeWidth="3.5" strokeDasharray="5 4" />
          <circle cx="210" cy="84" r="9" fill={p.accent} />
          <g transform="translate(254, 34)">
            {[0, 1, 2].map((row) =>
              [0, 1, 2].map((col) => {
                const isActive = (row + col) % 2 === 0;
                return (
                  <rect
                    key={`${row}-${col}`}
                    x={col * 46}
                    y={row * 35}
                    width="38"
                    height="27"
                    rx="8"
                    fill={isActive ? p.accent : p.surface}
                    fillOpacity={isActive ? 0.9 : 0.85}
                    stroke="#ffffff"
                    strokeWidth="1.5"
                  />
                );
              })
            )}
          </g>
        </g>
      );
    case 2:
      return (
        <g>
          <ellipse cx="220" cy="108" rx="145" ry="40" fill="#60a5fa" fillOpacity="0.2" stroke={p.secondary} strokeWidth="2" />
          <ellipse cx="220" cy="88" rx="102" ry="28" fill="#3b82f6" fillOpacity="0.35" stroke="#ffffff" strokeWidth="1.8" />
          <polygon points="220,34 274,64 220,94 166,64" fill={p.accent} stroke="#ffffff" strokeWidth="2" />
          <circle cx="220" cy="64" r="10" fill="#0f172a" />
          <circle cx="96" cy="96" r="11" fill={p.surface} stroke="#ffffff" strokeWidth="2" />
          <circle cx="344" cy="96" r="11" fill={p.surface} stroke="#ffffff" strokeWidth="2" />
          <circle cx="220" cy="134" r="9" fill="#34d399" stroke="#ffffff" strokeWidth="1.5" />
        </g>
      );
    case 3:
      return (
        <g>
          <rect x="44" y="32" width="126" height="104" rx="24" fill={p.surface} stroke="#ffffff" strokeWidth="2" />
          <rect x="60" y="48" width="94" height="72" rx="16" fill="#0f172a" />
          <path d="M 78 68 L 96 82 L 78 96" fill="none" stroke={p.secondary} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
          <line x1="106" y1="96" x2="132" y2="96" stroke={p.accent} strokeWidth="5" strokeLinecap="round" />
          <path d="M 176 72 L 236 48 M 176 84 L 236 84 M 176 96 L 236 120" stroke={p.accent} strokeWidth="2.5" strokeDasharray="4 4" />
          <g transform="translate(246, 26)">
            <rect width="58" height="52" rx="15" fill={p.accent} stroke="#ffffff" strokeWidth="2" />
            <circle cx="29" cy="26" r="10" fill="#0f172a" />
          </g>
          <g transform="translate(322, 58)">
            <rect width="66" height="58" rx="16" fill="#34d399" stroke="#ffffff" strokeWidth="2" />
            <polygon points="33,14 50,29 33,44 16,29" fill="#064e3b" />
          </g>
          <g transform="translate(246, 90)">
            <rect width="58" height="52" rx="15" fill="#93c5fd" stroke="#ffffff" strokeWidth="2" />
            <rect x="17" y="16" width="24" height="20" rx="6" fill="#1e3a8a" />
          </g>
        </g>
      );
    case 4:
    default:
      return (
        <g>
          <rect x="76" y="34" width="288" height="102" rx="26" fill="#ffffff" fillOpacity="0.12" stroke="#ffffff" strokeOpacity="0.3" strokeWidth="2" />
          <rect x="102" y="54" width="84" height="16" rx="8" fill={p.secondary} />
          <rect x="102" y="78" width="66" height="16" rx="8" fill="#93c5fd" />
          <rect x="102" y="102" width="76" height="16" rx="8" fill="#34d399" />
          <circle cx="304" cy="74" r="22" fill={p.accent} stroke="#ffffff" strokeWidth="2" />
          <circle cx="304" cy="74" r="9" fill="#1e1b4b" />
          <circle cx="334" cy="104" r="14" fill="#fde68a" stroke="#ffffff" strokeWidth="1.5" />
          <circle cx="334" cy="104" r="5" fill="#1e1b4b" />
          <circle cx="224" cy="80" r="38" fill="#60a5fa" fillOpacity="0.28" stroke="#ffffff" strokeWidth="4" />
          <line x1="252" y1="108" x2="276" y2="132" stroke="#ffffff" strokeWidth="7" strokeLinecap="round" />
          <circle cx="224" cy="80" r="10" fill={p.accent} />
        </g>
      );
  }
};
