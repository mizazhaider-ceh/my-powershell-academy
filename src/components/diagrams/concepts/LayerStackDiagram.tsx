import React, { useEffect, useState } from 'react';
import { Play, Square } from 'lucide-react';
import type { LayerDiagram } from '../../../types';
import { DiagramFrame, toneClass } from './DiagramFrame';

const STEP_MS = 1000;

/** A stack of layers. Press the trace button to watch a request travel through them. */
export const LayerStackDiagram: React.FC<{ diagram: LayerDiagram }> = ({ diagram }) => {
  const path = diagram.tracePath ?? diagram.layers.map((_, i) => i);
  const [selected, setSelected] = useState(0);
  const [step, setStep] = useState<number | null>(null);

  useEffect(() => {
    if (step === null) return;
    if (step >= path.length) {
      const done = window.setTimeout(() => setStep(null), 900);
      return () => window.clearTimeout(done);
    }
    setSelected(path[step]);
    const next = window.setTimeout(() => setStep(step + 1), STEP_MS);
    return () => window.clearTimeout(next);
  }, [step, path]);

  const lit = step !== null && step < path.length ? path[step] : null;
  const layer = diagram.layers[selected];
  const tracing = step !== null;

  return (
    <DiagramFrame
      title={diagram.title}
      caption={diagram.caption}
      controls={
        <button
          type="button"
          onClick={() => setStep(tracing ? null : 0)}
          className="clay-btn-secondary px-3.5 py-2 text-[0.8rem] inline-flex items-center gap-2 cursor-pointer"
        >
          {tracing ? <Square className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          {tracing ? 'Stop trace' : diagram.traceLabel}
        </button>
      }
    >
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] items-start">
        <div className="cd-layers">
          {diagram.layers.map((l, i) => (
            <React.Fragment key={l.label}>
              {i > 0 && <div className="cd-connector" data-lit={lit !== null && (lit === i || lit === i - 1)} aria-hidden="true" />}
              <button
                type="button"
                aria-pressed={selected === i}
                className={`cd-layer ${toneClass(l.tone)}`}
                data-selected={selected === i}
                data-lit={lit === i}
                onClick={() => {
                  setStep(null);
                  setSelected(i);
                }}
              >
                <span className="min-w-0">
                  <span className="block text-[0.95rem] font-semibold leading-snug">{l.label}</span>
                  <span className="block text-[0.78rem] text-[var(--dp-color-ink-secondary)]">{l.sub}</span>
                </span>
                <span className="font-mono text-[0.68rem] opacity-50">{String(i + 1).padStart(2, '0')}</span>
              </button>
            </React.Fragment>
          ))}
        </div>

        <div key={selected} className={`cd-detail ${toneClass(layer.tone)}`} aria-live="polite">
          <div className="font-semibold text-[1rem]">{layer.label}</div>
          <div className="mb-2 text-[0.78rem] opacity-70">{layer.sub}</div>
          <p>{layer.detail}</p>
        </div>
      </div>
    </DiagramFrame>
  );
};
