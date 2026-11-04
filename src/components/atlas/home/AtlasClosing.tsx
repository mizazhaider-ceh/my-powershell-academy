import React from 'react';
import { ArrowRight } from 'lucide-react';
import { LastVisitedLesson } from '../../../utils/progress';
import { MagneticButton } from '../MagneticButton';

interface AtlasClosingProps {
  onNavigate: (path: string) => void;
  lastLesson: LastVisitedLesson | null;
  completedCount: number;
}

export const AtlasClosing: React.FC<AtlasClosingProps> = ({ onNavigate, lastLesson, completedCount }) => (
  <section className="ah-closing hx-reveal" aria-labelledby="closing-heading">
    <div className="space-y-5">
      <h2 id="closing-heading" className="text-[2rem] sm:text-[3rem] font-semibold leading-[1.02]">
        {lastLesson ? 'Pick up where you left off.' : 'Start with a single lesson.'}
      </h2>
      <p className="max-w-[34rem] text-[var(--dp-color-ink-secondary)] leading-relaxed">
        {lastLesson
          ? `You have completed ${completedCount} of 35 lessons. Next up: lesson ${lastLesson.lessonNumber}, ${lastLesson.lessonTitle}.`
          : 'Type every command yourself and let Tab complete your thoughts. Reading code makes you nod; typing code builds muscle memory that never leaves you.'}
      </p>
      <MagneticButton
        type="button"
        className="clay-btn-primary px-6 py-3 text-[0.95rem] inline-flex items-center gap-2 cursor-pointer"
        onClick={() =>
          onNavigate(
            lastLesson
              ? `/learn/${lastLesson.chapterId}/${lastLesson.lessonSlug}`
              : '/learn/chapter-01/windows-evolution-and-least-privilege',
          )
        }
      >
        {lastLesson ? 'Resume lesson' : 'Begin lesson 1-1'} <ArrowRight className="w-4 h-4" />
      </MagneticButton>
    </div>
    <div className="clay-well p-2 overflow-hidden">
      <img
        src="/assets/aistudio/image_2fc7720e.png"
        alt="PowerShell Academy electric blue dragon artwork"
        referrerPolicy="no-referrer"
        className="w-full h-auto object-cover ah-illu"
      />
    </div>
  </section>
);
