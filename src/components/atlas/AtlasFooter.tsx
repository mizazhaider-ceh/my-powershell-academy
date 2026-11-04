import React from 'react';
import { ArrowUp } from 'lucide-react';

interface AtlasFooterProps {
  onNavigate: (path: string) => void;
}

export const AtlasFooter: React.FC<AtlasFooterProps> = ({ onNavigate }) => (
  <footer className="atlas-footer">
    <span>PowerShell Academy. Created by Muhammad Izaz Haider.</span>
    <span className="flex flex-wrap items-center gap-x-4 gap-y-1">
      {[
        ['/learn', 'Curriculum'],
        ['/commands', 'Cmdlets'],
        ['/knowledge', 'Labs'],
        ['/glossary', 'Glossary'],
      ].map(([path, label]) => (
        <button key={path} type="button" className="tap-target hover:text-[var(--dp-color-ink)] cursor-pointer" onClick={() => onNavigate(path)}>
          {label}
        </button>
      ))}
      <button
        type="button"
        className="tap-target inline-flex items-center justify-center gap-1 hover:text-[var(--dp-color-ink)] cursor-pointer"
        onClick={() => window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })}
      >
        <ArrowUp className="w-3 h-3" aria-hidden="true" /> Top
      </button>
    </span>
  </footer>
);
