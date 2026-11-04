import React from 'react';

interface DiagramFrameProps {
  title: string;
  caption: string;
  controls?: React.ReactNode;
  children: React.ReactNode;
}

/** Shared chrome for every concept diagram: title, one-line caption, optional controls. */
export const DiagramFrame: React.FC<DiagramFrameProps> = ({ title, caption, controls, children }) => (
  <figure className="clay-card p-5 sm:p-6 space-y-5">
    <figcaption className="cd-head">
      <div className="space-y-1 min-w-0">
        <h3 className="text-[1.15rem] font-bold leading-snug">{title}</h3>
        <p className="text-[0.88rem] leading-relaxed text-[var(--dp-color-ink-secondary)] max-w-[44rem]">{caption}</p>
      </div>
      {controls && <div className="cd-controls">{controls}</div>}
    </figcaption>
    {children}
  </figure>
);

export const toneClass = (tone: string | undefined) => `cd-tone-${tone ?? 'blue'}`;
