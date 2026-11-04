import React from 'react';
import { ModulePalette } from './modulePalettes';

interface ModuleArtworkProps {
  moduleNumber: number;
  p: ModulePalette;
}

export const ModuleArtwork9To12: React.FC<ModuleArtworkProps> = ({ moduleNumber, p }) => {
  switch (moduleNumber) {
    case 9:
      return (
        <g>
          {[30, 68, 106].map((y, idx) => (
            <g key={idx} transform={`translate(44, ${y})`}>
              <rect width="176" height="30" rx="10" fill="#0f172a" stroke={p.secondary} strokeWidth="1.5" />
              <circle cx="20" cy="15" r="5" fill={p.accent} />
              <circle cx="36" cy="15" r="5" fill={p.secondary} />
              <rect x="56" y="11" width="68" height="8" rx="4" fill="#1e3a8a" />
              <rect x="136" y="11" width="24" height="8" rx="4" fill={p.accent} fillOpacity="0.7" />
            </g>
          ))}
          <line x1="228" y1="84" x2="278" y2="84" stroke={p.accent} strokeWidth="3" strokeDasharray="4 3" />
          <g transform="translate(336, 84)">
            <circle r="48" fill={p.surface} stroke="#ffffff" strokeWidth="2.5" />
            <ellipse rx="48" ry="18" fill="none" stroke="#1d4ed8" strokeWidth="2" />
            <ellipse rx="18" ry="48" fill="none" stroke="#1d4ed8" strokeWidth="2" />
            <circle r="10" fill="#0f172a" />
          </g>
        </g>
      );
    case 10:
      return (
        <g>
          <g transform="translate(46, 38)">
            <rect width="86" height="92" rx="22" fill={p.surface} stroke="#ffffff" strokeWidth="2" />
            <path d="M 31 44 V 32 A 12 12 0 0 1 55 32 V 44" fill="none" stroke="#1e3a8a" strokeWidth="4.5" strokeLinecap="round" />
            <rect x="23" y="42" width="40" height="32" rx="10" fill="#1d4ed8" />
            <circle cx="43" cy="58" r="5" fill={p.accent} />
          </g>
          <polygon points="216,36 264,84 216,132 168,84" fill={p.accent} stroke="#ffffff" strokeWidth="2.5" />
          <circle cx="216" cy="84" r="10" fill="#0f172a" />
          <circle cx="344" cy="84" r="42" fill="none" stroke="#34d399" strokeWidth="8" strokeDasharray="190 40" strokeLinecap="round" />
          <circle cx="344" cy="84" r="18" fill="#a7f3d0" />
        </g>
      );
    case 11:
      return (
        <g>
          <circle cx="92" cy="84" r="58" fill="none" stroke={p.accent} strokeOpacity="0.3" strokeWidth="2" strokeDasharray="4 4" />
          <g stroke={p.accent} strokeWidth="2.5">
            <line x1="126" y1="68" x2="262" y2="34" />
            <line x1="132" y1="84" x2="262" y2="84" />
            <line x1="126" y1="100" x2="262" y2="134" />
          </g>
          <circle cx="92" cy="84" r="40" fill={p.surface} stroke="#ffffff" strokeWidth="2.5" />
          <circle cx="92" cy="84" r="18" fill="#1d4ed8" />
          <circle cx="92" cy="84" r="7" fill="#fde68a" />
          {[20, 68, 116].map((y, idx) => (
            <g key={idx} transform={`translate(264, ${y})`}>
              <rect width="126" height="32" rx="12" fill={idx === 1 ? p.secondary : p.surface} stroke="#ffffff" strokeWidth="1.8" />
              <circle cx="20" cy="16" r="6" fill="#0f172a" />
              <rect x="36" y="12" width="64" height="8" rx="4" fill="#1e3a8a" fillOpacity="0.65" />
            </g>
          ))}
        </g>
      );
    case 12:
    default:
      return (
        <g>
          <line x1="220" y1="48" x2="116" y2="108" stroke="#fde68a" strokeWidth="3" />
          <line x1="220" y1="48" x2="220" y2="108" stroke="#fde68a" strokeWidth="3" />
          <line x1="220" y1="48" x2="324" y2="108" stroke="#fde68a" strokeWidth="3" />
          <polygon points="220,18 262,48 220,78 178,48" fill={p.accent} stroke="#ffffff" strokeWidth="2.5" />
          <circle cx="220" cy="48" r="8" fill="#0f172a" />
          {[76, 180, 284].map((x, idx) => (
            <g key={idx} transform={`translate(${x}, 98)`}>
              <rect width="80" height="46" rx="14" fill={idx === 1 ? '#a7f3d0' : '#dbeafe'} stroke="#ffffff" strokeWidth="2" />
              <circle cx="26" cy="23" r="8" fill="#1d4ed8" />
              <circle cx="54" cy="23" r="8" fill="#3b82f6" />
            </g>
          ))}
        </g>
      );
  }
};
