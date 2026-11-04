import React, { useEffect, useState } from 'react';
import { RotateCcw, Play } from 'lucide-react';
import type { SequenceDiagram as SequenceDiagramData } from '../../../types';
import { DiagramFrame, toneClass } from './DiagramFrame';

const STEP_MS = 1100;

/** Actors across the top, messages down the page. Press play to reveal them in order. */
export const SequenceDiagram: React.FC<{ diagram: SequenceDiagramData }> = ({ diagram }) => {
  const n = diagram.actors.length;
  const total = diagram.messages.length;
  const [shown, setShown] = useState(total);
  const [selected, setSelected] = useState(0);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!playing) return;
    if (shown >= total) {
      setPlaying(false);
      return;
    }
    const timer = window.setTimeout(() => {
      setShown(shown + 1);
      setSelected(shown);
    }, STEP_MS);
    return () => window.clearTimeout(timer);
  }, [playing, shown, total]);

  const message = diagram.messages[selected];
  const centre = (i: number) => ((i + 0.5) / n) * 100;
  const finished = shown >= total && !playing;

  return (
    <DiagramFrame
      title={diagram.title}
      caption={diagram.caption}
      controls={
        <button
          type="button"
          onClick={() => {
            setShown(0);
            setSelected(0);
            setPlaying(true);
          }}
          className="clay-btn-secondary px-3.5 py-2 text-[0.8rem] inline-flex items-center gap-2 cursor-pointer"
        >
          {finished ? <Play className="w-3.5 h-3.5" /> : <RotateCcw className="w-3.5 h-3.5" />}
          {finished ? 'Play step by step' : 'Restart'}
        </button>
      }
    >
      <div className="cd-seq" style={{ '--n': n } as React.CSSProperties}>
        <div className="cd-seq-inner">
          <div className="cd-actors">
            {diagram.actors.map((actor) => (
              <div key={actor.name} className={`cd-actor ${toneClass(actor.tone)}`}>
                {actor.name}
                {actor.sub && <small>{actor.sub}</small>}
              </div>
            ))}
          </div>

          <div className="cd-msgs">
            {diagram.messages.map((m, i) => {
              const self = m.from === m.to;
              const left = Math.min(m.from, m.to);
              const span = Math.abs(m.to - m.from);
              return (
                <button
                  key={`${m.label}-${i}`}
                  type="button"
                  className="cd-msg"
                  data-shown={i < shown}
                  data-selected={selected === i}
                  data-dir={m.to < m.from ? 'left' : 'right'}
                  onClick={() => setSelected(i)}
                  aria-label={`Step ${i + 1}: ${m.label}`}
                >
                  {!self && (
                    <span className="cd-msg-line" style={{ left: `${centre(left)}%`, width: `${(span / n) * 100}%` }} />
                  )}
                  <span
                    className="cd-msg-label"
                    style={{
                      left: self ? `calc(${centre(m.from)}% + 0.9rem)` : `${centre(left) + (span / n) * 50}%`,
                      transform: self ? 'none' : 'translateX(-50%)',
                      maxWidth: `${(Math.max(span, 1.4) / n) * 100}%`,
                    }}
                  >
                    <span className="font-mono opacity-60 mr-1">{i + 1}</span>
                    {m.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div key={selected} className="cd-detail cd-tone-blue" aria-live="polite">
        <div className="mb-1 text-[0.78rem] opacity-70">
          Step {selected + 1} of {total}: {diagram.actors[message.from].name} to {diagram.actors[message.to].name}
        </div>
        <p>{message.detail}</p>
      </div>
    </DiagramFrame>
  );
};
