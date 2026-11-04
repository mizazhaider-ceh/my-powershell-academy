import React from 'react';
import { Compass } from 'lucide-react';
import type { LessonTeaching } from '../../types';
import { ConceptDiagram } from '../diagrams/concepts/ConceptDiagram';
import { STORYBOARDS } from '../../data/teaching/storyboards';
import { LessonStoryboard } from './LessonStoryboard';

interface LessonTeacherIntroProps {
  teaching: LessonTeaching;
  lessonId: string;
}

/** The teacher's opening: a curiosity hook, the one mental model, a picture story, then the concept diagrams. */
export const LessonTeacherIntro: React.FC<LessonTeacherIntroProps> = ({ teaching, lessonId }) => (
  <section id="sec-teacher" aria-label="Teacher's opening" className="space-y-5">
    <div className="clay-tray p-6 sm:p-9 grid gap-7 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] items-center">
      <div className="space-y-4">
        <span className="tc-label">Before we start</span>
        <p className="tc-hook">{teaching.hook}</p>
      </div>
      <div className="clay-cushion-lavender p-5 sm:p-6 space-y-2">
        <div className="flex items-center gap-2 font-semibold">
          <Compass className="w-4 h-4" />
          <span>The mental model</span>
        </div>
        <p className="text-[0.98rem] leading-relaxed">{teaching.mentalModel}</p>
      </div>
    </div>

    {STORYBOARDS[lessonId] && (
      <div className="clay-tray p-6 sm:p-8">
        <LessonStoryboard key={lessonId} storyboard={STORYBOARDS[lessonId]} />
      </div>
    )}

    {teaching.diagrams.map((diagram) => (
      <ConceptDiagram key={`${diagram.kind}-${diagram.title}`} diagram={diagram} />
    ))}
  </section>
);
