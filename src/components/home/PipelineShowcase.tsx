import React from 'react';
import { ArrowRight } from 'lucide-react';
import { LivePipeline } from './LivePipeline';

interface PipelineShowcaseProps {
  onNavigate: (path: string) => void;
}

const POINTS = [
  ['Objects, not text', 'Every command hands the next one real objects with named properties.'],
  ['Filter early', 'Where-Object keeps only what you need, so later steps do less work.'],
  ['Same shape all the way', 'Sort and Select work on any property, because every object has them.'],
];

/** A teaching moment beside the live demo: what to notice while the pipeline runs. */
export const PipelineShowcase: React.FC<PipelineShowcaseProps> = ({ onNavigate }) => (
  <section className="clay-tray p-6 sm:p-10 grid gap-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] items-center hx-reveal" aria-labelledby="showcase-heading">
    <div className="space-y-5">
      <h2 id="showcase-heading" className="text-[1.75rem] sm:text-[2.25rem] font-extrabold leading-tight">
        Watch a pipeline think
      </h2>
      <p className="text-[var(--dp-color-ink-secondary)] leading-relaxed">
        This is the single idea that makes PowerShell different. Click any stage of the command to scrub through it.
      </p>
      <ul className="space-y-3">
        {POINTS.map(([title, text]) => (
          <li key={title} className="clay-well p-3.5">
            <div className="font-semibold text-[0.95rem]">{title}</div>
            <div className="text-[0.85rem] text-[var(--dp-color-ink-secondary)]">{text}</div>
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={() => onNavigate('/learn/chapter-05/pipeline-mechanics-and-binding')}
        className="clay-btn-primary px-5 py-2.5 text-[0.88rem] inline-flex items-center gap-2 cursor-pointer"
      >
        Learn how the pipeline works <ArrowRight className="w-4 h-4" />
      </button>
    </div>
    <LivePipeline />
  </section>
);
