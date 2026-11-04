import React, { useEffect, useState } from 'react';
import type { Storyboard } from '../../types/storyboard';
import { STORY_ICON_MAP } from './storyIcons';

const STEP_MS = 2600;

/** An analogy told as four icon panels. Plays once through, then the learner can click any panel. */
export const LessonStoryboard: React.FC<{ storyboard: Storyboard }> = ({ storyboard }) => {
  const [active, setActive] = useState(0);
  const [auto, setAuto] = useState(true);

  useEffect(() => {
    if (!auto) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (active >= storyboard.panels.length - 1) return;
    const timer = window.setTimeout(() => setActive((i) => i + 1), STEP_MS);
    return () => window.clearTimeout(timer);
  }, [active, auto, storyboard.panels.length]);

  const panel = storyboard.panels[active];

  return (
    <figure className="space-y-4" aria-label={`Picture story: ${storyboard.title}`}>
      <figcaption className="tc-label">In pictures: {storyboard.title}</figcaption>
      <div className="sb-strip" role="group" aria-label="Story panels">
        {storyboard.panels.map((p, i) => {
          const Icon = STORY_ICON_MAP[p.icon];
          return (
            <button
              key={p.caption}
              type="button"
              className="sb-panel"
              data-active={i === active}
              aria-pressed={i === active}
              onClick={() => {
                setAuto(false);
                setActive(i);
              }}
            >
              <span className="sb-step">{i + 1} / {storyboard.panels.length}</span>
              <span className="sb-icon"><Icon className="w-6 h-6" aria-hidden="true" /></span>
              <span className="sb-caption">{p.caption}</span>
            </button>
          );
        })}
      </div>
      <p className="text-[0.98rem] leading-relaxed min-h-[3rem]" aria-live="polite">{panel.detail}</p>
    </figure>
  );
};
