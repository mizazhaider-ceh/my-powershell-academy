import React from 'react';
import type { LessonTeaching } from '../../types';
import { TeacherMisconceptions } from './TeacherMisconceptions';
import { TeacherWorkedExample } from './TeacherWorkedExample';
import { TeacherCheckpoints } from './TeacherCheckpoints';
import { TeacherChallenge } from './TeacherChallenge';

interface LessonTeacherPracticeProps {
  lessonId: string;
  teaching: LessonTeaching;
}

/** The teacher's studio: bust myths, watch a worked example, recall, then do it yourself. */
export const LessonTeacherPractice: React.FC<LessonTeacherPracticeProps> = ({ lessonId, teaching }) => (
  <section id="sec-studio" aria-label="Teacher's studio" className="clay-tray p-6 sm:p-10 space-y-12">
    <div className="space-y-1 pb-4 border-b border-black/10 dark:border-white/10">
      <span className="tc-label">Teacher&apos;s studio</span>
      <h2 className="text-[1.625rem] sm:text-[2rem] font-bold">Now make it yours</h2>
      <p className="max-w-[40rem] text-[var(--dp-color-ink-secondary)]">
        Understanding feels the same as recognising. These four steps turn one into the other.
      </p>
    </div>

    <TeacherMisconceptions items={teaching.misconceptions} />
    <TeacherWorkedExample example={teaching.workedExample} />
    <TeacherCheckpoints items={teaching.checkpoints} />
    <TeacherChallenge lessonId={lessonId} challenge={teaching.challenge} teachBack={teaching.teachBack} />
  </section>
);
