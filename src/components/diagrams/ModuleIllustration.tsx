import React from 'react';
import { MODULE_PALETTES } from './modules/modulePalettes';
import { ModuleArtwork1To4 } from './modules/ModuleArtwork1To4';
import { ModuleArtwork5To8 } from './modules/ModuleArtwork5To8';
import { ModuleArtwork9To12 } from './modules/ModuleArtwork9To12';
import { ModuleArtwork13To16 } from './modules/ModuleArtwork13To16';

interface ModuleIllustrationProps {
  moduleNumber: number;
  className?: string;
}

export const ModuleIllustration: React.FC<ModuleIllustrationProps> = ({
  moduleNumber,
  className = '',
}) => {
  const p = MODULE_PALETTES[moduleNumber] || MODULE_PALETTES[1];

  const renderArtwork = () => {
    if (moduleNumber >= 1 && moduleNumber <= 4) {
      return <ModuleArtwork1To4 moduleNumber={moduleNumber} p={p} />;
    }
    if (moduleNumber >= 5 && moduleNumber <= 8) {
      return <ModuleArtwork5To8 moduleNumber={moduleNumber} p={p} />;
    }
    if (moduleNumber >= 9 && moduleNumber <= 12) {
      return <ModuleArtwork9To12 moduleNumber={moduleNumber} p={p} />;
    }
    return <ModuleArtwork13To16 moduleNumber={moduleNumber} p={p} />;
  };

  return (
    <div
      className={`w-full overflow-hidden rounded-[1.35rem] select-none shadow-inner ${className}`}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 440 168"
        className="w-full h-auto block"
        focusable="false"
      >
        <defs>
          <linearGradient
            id={`mod-clean-bg-${moduleNumber}`}
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor={p.bgStart} />
            <stop offset="100%" stopColor={p.bgEnd} />
          </linearGradient>
        </defs>

        <rect
          width="440"
          height="168"
          rx="20"
          fill={`url(#mod-clean-bg-${moduleNumber})`}
        />

        <circle cx="75" cy="32" r="64" fill={p.accent} fillOpacity="0.15" />
        <circle cx="370" cy="140" r="72" fill={p.secondary} fillOpacity="0.18" />

        <line x1="24" y1="24" x2="416" y2="24" stroke="#ffffff" strokeOpacity="0.08" strokeWidth="1" />
        <line x1="24" y1="144" x2="416" y2="144" stroke="#ffffff" strokeOpacity="0.08" strokeWidth="1" />

        {renderArtwork()}
      </svg>
    </div>
  );
};
