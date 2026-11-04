import React, { useRef } from 'react';
import { useCountUp, useInView } from '../../utils/useInView';

export interface HomeStat {
  value: number;
  label: string;
}

const StatCell: React.FC<{ stat: HomeStat; active: boolean }> = ({ stat, active }) => {
  const shown = useCountUp(stat.value, active);
  return (
    <div className="space-y-1 px-5 py-4">
      <div className="hx-stat text-[2rem] sm:text-[2.5rem] font-bold leading-none tracking-tight">{shown}</div>
      <div className="text-[0.78rem] text-[var(--dp-color-ink-secondary)]">{stat.label}</div>
    </div>
  );
};

/** A row of count-up numbers. Hairline-divided, so it reads as data rather than decoration. */
export const HomeStatsStrip: React.FC<{ stats: HomeStat[] }> = ({ stats }) => {
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref);

  return (
    <div
      ref={ref}
      className="clay-card grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 divide-x divide-y lg:divide-y-0 divide-[var(--hx-line)]"
      role="list"
      aria-label="Platform at a glance"
    >
      {stats.map((stat) => (
        <div key={stat.label} role="listitem">
          <StatCell stat={stat} active={seen} />
        </div>
      ))}
    </div>
  );
};
