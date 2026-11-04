import React from 'react';
import type { Chapter } from '../../types';
import { ModuleIllustration } from '../diagrams/ModuleIllustration';

const DIFFICULTY_LEVEL: Record<Chapter['difficulty'], number> = {
  Beginner: 1,
  Intermediate: 2,
  Advanced: 3,
  Master: 4,
};

/** The module's key art plus four quick facts: lessons, time, difficulty and cmdlet count. */
export const ChapterKeyArt: React.FC<{ chapter: Chapter }> = ({ chapter }) => {
  const level = DIFFICULTY_LEVEL[chapter.difficulty];
  const hours = chapter.estimatedMinutes >= 90
    ? `${(chapter.estimatedMinutes / 60).toFixed(1)} h`
    : `${chapter.estimatedMinutes} min`;

  return (
    <div className="space-y-3">
      <div className="clay-card p-3 gl-art">
        <ModuleIllustration moduleNumber={chapter.number} />
      </div>
      <div className="gl-tiles">
        <div className="gl-tile">
          <b>{chapter.lessons.length}</b>
          <small>lessons</small>
        </div>
        <div className="gl-tile">
          <b>{hours}</b>
          <small>study time</small>
        </div>
        <div className="gl-tile">
          <span className="gl-dots" role="img" aria-label={`Difficulty ${level} of 4: ${chapter.difficulty}`}>
            {[1, 2, 3, 4].map((n) => (
              <i key={n} data-on={n <= level} />
            ))}
          </span>
          <small>{chapter.difficulty}</small>
        </div>
        <div className="gl-tile">
          <b>{chapter.relatedCmdlets.length}</b>
          <small>core cmdlets</small>
        </div>
      </div>
    </div>
  );
};
