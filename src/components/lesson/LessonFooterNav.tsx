import React from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Lesson as LessonType } from '../../types';

interface LessonFooterNavProps {
  currentLesson: LessonType;
  prevLesson: LessonType | null;
  nextLesson: LessonType | null;
  isLessonDone: boolean;
  onToggleLessonCompleted: () => void;
  onNavigate: (path: string) => void;
}

export const LessonFooterNav: React.FC<LessonFooterNavProps> = ({
  currentLesson,
  prevLesson,
  nextLesson,
  isLessonDone,
  onToggleLessonCompleted,
  onNavigate,
}) => {
  return (
    <>
      <div className="clay-card p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[0.75rem] font-mono font-extrabold uppercase tracking-wider text-[var(--dp-color-accent)] block">
            Track Your Mastery Progress
          </span>
          <p className="text-[0.95rem] font-bold text-[var(--dp-color-ink)]">
            {isLessonDone
              ? `Lesson ${currentLesson.id} is marked complete in your study log.`
              : `Finished reading and testing Lesson ${currentLesson.id}? Mark it complete:`}
          </p>
        </div>
        <button
          type="button"
          onClick={onToggleLessonCompleted}
          className={`px-6 py-3 rounded-full text-[0.875rem] font-extrabold inline-flex items-center gap-2 cursor-pointer shrink-0 transition-all ${
            isLessonDone ? 'clay-cushion-mint' : 'clay-btn-primary'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>
            {isLessonDone ? '✓ Lesson Completed' : 'Mark Lesson Complete'}
          </span>
        </button>
      </div>

      <footer className="flex items-center justify-between gap-4 pt-2">
        {prevLesson ? (
          <button
            type="button"
            onClick={() =>
              onNavigate(`/learn/${prevLesson.chapterId}/${prevLesson.slug}`)
            }
            className="clay-card clay-card-interactive flex items-center gap-3 p-5 text-left max-w-[48%] cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 shrink-0" />
            <div className="truncate">
              <span className="text-[0.75rem] font-mono uppercase opacity-75 block truncate">
                Previous · Lesson {prevLesson.id}
              </span>
              <span className="text-[0.9375rem] font-bold truncate block">
                {prevLesson.title}
              </span>
            </div>
          </button>
        ) : (
          <div />
        )}

        {nextLesson && (
          <button
            type="button"
            onClick={() =>
              onNavigate(`/learn/${nextLesson.chapterId}/${nextLesson.slug}`)
            }
            className="clay-cushion-pink clay-card-interactive flex items-center gap-3 p-5 text-right max-w-[48%] cursor-pointer"
          >
            <div className="truncate text-right">
              <span className="text-[0.75rem] font-mono uppercase font-bold block truncate">
                Next Step · Lesson {nextLesson.id}
              </span>
              <span className="text-[0.9375rem] font-bold truncate block">
                {nextLesson.title}
              </span>
            </div>
            <ArrowRight className="w-4 h-4 shrink-0" />
          </button>
        )}
      </footer>
    </>
  );
};
