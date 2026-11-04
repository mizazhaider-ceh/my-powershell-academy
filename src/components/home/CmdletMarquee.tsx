import React from 'react';
import { commands } from '../../data/commands';

interface CmdletMarqueeProps {
  onNavigate: (path: string) => void;
}

const Row: React.FC<{ names: string[]; reverse?: boolean; onNavigate: (path: string) => void }> = ({
  names,
  reverse,
  onNavigate,
}) => (
  <div className="hx-marquee" data-dir={reverse ? 'reverse' : undefined}>
    <div className="hx-marquee-track">
      {[...names, ...names].map((name, i) => {
        const [verb, ...rest] = name.split('-');
        return (
          <button
            key={`${name}-${i}`}
            type="button"
            aria-hidden={i >= names.length}
            tabIndex={i >= names.length ? -1 : 0}
            onClick={() => onNavigate(`/commands/${encodeURIComponent(name)}`)}
            className="tap-target clay-pill px-3.5 py-1.5 font-mono text-[0.82rem] whitespace-nowrap cursor-pointer"
          >
            <span className="text-[var(--dp-color-accent)] font-semibold">{verb}</span>
            <span>-{rest.join('-')}</span>
          </button>
        );
      })}
    </div>
  </div>
);

/** Two counter-scrolling rows of every cmdlet in the reference. Pauses on hover and focus. */
export const CmdletMarquee: React.FC<CmdletMarqueeProps> = ({ onNavigate }) => {
  const names = commands.map((c) => c.name);
  const half = Math.ceil(names.length / 2);

  return (
    <section className="space-y-5 hx-reveal" aria-labelledby="marquee-heading">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="space-y-1">
          <h2 id="marquee-heading" className="text-[1.75rem] sm:text-[2.25rem] font-bold leading-tight">
            {commands.length} cmdlets, each explained to the last parameter
          </h2>
          <p className="text-[var(--dp-color-ink-secondary)]">Pick any one to see its syntax, pipeline binding and common traps.</p>
        </div>
        <button type="button" onClick={() => onNavigate('/commands')} className="tap-target clay-btn-secondary px-4 py-2 text-[0.85rem] cursor-pointer">
          Open the cmdlet library
        </button>
      </div>
      <div className="space-y-3">
        <Row names={names.slice(0, half)} onNavigate={onNavigate} />
        <Row names={names.slice(half)} reverse onNavigate={onNavigate} />
      </div>
    </section>
  );
};
