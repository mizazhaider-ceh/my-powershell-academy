import React from 'react';
import { ArrowRight } from 'lucide-react';
import { LivePipeline } from '../../home/LivePipeline';
import { MagneticButton } from '../MagneticButton';

interface AtlasHeroProps {
  onNavigate: (path: string) => void;
}

const LINES: [string, string, boolean][] = [
  ['Learn PowerShell.', '0ms', false],
  ['Understand', '110ms', true],
  ['everything.', '220ms', true],
];

export const AtlasHero: React.FC<AtlasHeroProps> = ({ onNavigate }) => (
  <section className="ah-hero" aria-label="Introduction">
    <div className="ah-hero-copy">
      <p className="ah-status">
        <span className="ah-live-dot" aria-hidden="true" />
        Created by Muhammad Izaz Haider
        <span aria-hidden="true">/</span>
        Zero to Pro masterclass
      </p>

      <h1 className="ah-title" aria-label="Learn PowerShell. Understand everything.">
        {LINES.map(([text, delay, muted], i) => (
          <span key={text} className={`ah-line ${muted ? 'ah-muted' : ''}`} aria-hidden="true">
            <span style={{ '--d': delay } as React.CSSProperties}>
              {text}
              {i === LINES.length - 1 && <i className="ah-cursor" />}
            </span>
          </span>
        ))}
      </h1>

      <p className="ah-lede">
        Stop copy-pasting commands you cannot explain. Learn the Windows kernel, the .NET object pipeline, Server Core and
        Active Directory, and Red/Blue Team security, one clear idea at a time.
      </p>

      <div className="ah-actions">
        <MagneticButton
          type="button"
          className="clay-btn-primary px-6 py-3 text-[0.95rem] inline-flex items-center gap-2 cursor-pointer"
          onClick={() => onNavigate('/learn/chapter-01/windows-evolution-and-least-privilege')}
        >
          Start learning <ArrowRight className="w-4 h-4" />
        </MagneticButton>
        <button type="button" className="clay-btn-secondary px-5 py-3 text-[0.95rem] cursor-pointer" onClick={() => onNavigate('/learn')}>
          Browse the curriculum
        </button>
      </div>
      <p className="ah-hint">
        Press <kbd className="clay-keycap px-1.5">Ctrl</kbd> <kbd className="clay-keycap px-1.5">K</kbd> to search anything.
      </p>
    </div>

    <div className="ah-hero-demo">
      <LivePipeline />
    </div>
  </section>
);
