import React, { useEffect, useState } from 'react';
import { Pause, Play } from 'lucide-react';
import { DEMO_PROCS, DEMO_STAGES, layoutForPhase } from './pipelineDemo';

const PHASE_MS = [2600, 2800, 2800, 3600];

/**
 * The hero moment: a real pipeline, step by step. Objects flow through
 * Get-Process, Where-Object, Sort-Object and Select-Object while a plain-English
 * caption explains each stage. Click any stage to scrub; reduced motion pauses it.
 */
export const LivePipeline: React.FC = () => {
  const [phase, setPhase] = useState(0);
  const [playing, setPlaying] = useState(
    () => !window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );

  useEffect(() => {
    if (!playing) return;
    const timer = window.setTimeout(() => setPhase((p) => (p + 1) % DEMO_STAGES.length), PHASE_MS[phase]);
    return () => window.clearTimeout(timer);
  }, [phase, playing]);

  const layout = layoutForPhase(phase);
  const stage = DEMO_STAGES[phase];

  return (
    <div className="hx-window" role="group" aria-label="Live demonstration of a PowerShell pipeline">
      <div className="hx-window-bar">
        <span className="hx-dot" style={{ background: '#ff5f57' }} />
        <span className="hx-dot" style={{ background: '#febc2e' }} />
        <span className="hx-dot" style={{ background: '#28c840' }} />
        <span className="ml-2">powershell</span>
        <button
          type="button"
          onClick={() => setPlaying((p) => !p)}
          aria-label={playing ? 'Pause demonstration' : 'Play demonstration'}
          className="tap-target ml-auto inline-flex items-center justify-center gap-1.5 rounded px-1.5 py-0.5 text-[0.75rem] hover:text-white cursor-pointer"
        >
          {playing ? <Pause className="w-3 h-3" aria-hidden="true" /> : <Play className="w-3 h-3" aria-hidden="true" />}
          {playing ? 'pause' : 'play'}
        </button>
      </div>

      <div className="hx-cmd" aria-label="The pipeline command, one stage per segment">
        <span className="text-[#5b8cff]">PS&gt;</span>
        {DEMO_STAGES.map((s, i) => (
          <React.Fragment key={s.segment}>
            <button
              type="button"
              className="hx-seg tap-target"
              data-active={phase === i}
              data-done={i < phase}
              aria-pressed={phase === i}
              onClick={() => {
                setPlaying(false);
                setPhase(i);
              }}
            >
              {s.segment}
            </button>
            {i < DEMO_STAGES.length - 1 && <span className="hx-pipe-char">|</span>}
          </React.Fragment>
        ))}
      </div>

      <div className="hx-table-head" aria-hidden="true">
        <span>Name</span>
        <span className="text-right">CPU</span>
        <span className="text-right">WS(MB)</span>
      </div>
      <div className="hx-table" aria-hidden="true">
        {DEMO_PROCS.map((proc, i) => (
          <div
            key={proc.name}
            className="hx-row"
            data-state={layout[i].state}
            style={{ '--y': layout[i].y } as React.CSSProperties}
          >
            <span className="hx-row-name">{proc.name}</span>
            <span>{proc.cpu}</span>
            <span>{proc.ws}</span>
          </div>
        ))}
      </div>

      <div className="hx-caption" aria-live="polite">
        <span key={phase} className="hx-count">
          {stage.count} objects
        </span>
        <p>{stage.note}</p>
      </div>
    </div>
  );
};
