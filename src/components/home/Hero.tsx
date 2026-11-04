import React from 'react';
import {
  ArrowRight,
  Play,
  Layers,
  Lightbulb,
  BookmarkCheck,
} from 'lucide-react';
import { LastVisitedLesson } from '../../utils/progress';

interface HeroProps {
  onNavigate: (path: string) => void;
  completedCount: number;
  lastLesson: LastVisitedLesson | null;
}

export const Hero: React.FC<HeroProps> = ({
  onNavigate,
  completedCount,
  lastLesson,
}) => {
  return (
    <>
      <div className="clay-cushion-pink p-7 sm:p-11 lg:p-14 space-y-9">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          <div className="lg:col-span-6 space-y-5">
            <div className="inline-flex flex-wrap items-center gap-x-2 px-4 py-1.5 rounded-full clay-pill text-[0.8125rem] font-extrabold text-[var(--dp-color-accent)]">
              <span className="font-mono font-extrabold">&gt;_</span>
              <span>Created by Muhammad Izaz Haider</span>
              <span aria-hidden="true" className="hidden sm:inline">·</span>
              <span>Zero to Pro Masterclass</span>
            </div>

            <h1 className="clay-display-title text-[var(--dp-color-ink)]">
              <span className="block">Learn PowerShell.</span>
              <span className="block bg-gradient-to-r from-[#2563eb] via-[#1d4ed8] to-[#3b82f6] bg-clip-text text-transparent dark:from-[#60a5fa] dark:to-[#93c5fd]">
                Understand
              </span>
              <span className="block bg-gradient-to-r from-[#1d4ed8] via-[#2563eb] to-[#3b82f6] bg-clip-text text-transparent dark:from-[#60a5fa] dark:to-[#93c5fd]">
                Everything.
              </span>
            </h1>

            <p className="text-[1.0625rem] text-[var(--dp-color-ink-secondary)] font-medium leading-[1.68] max-w-[36rem]">
              Stop copy-pasting commands without knowing how they work. Master
              the{' '}
              <strong className="text-[var(--dp-color-ink)]">
                Windows NT kernel
              </strong>
              , the{' '}
              <strong className="text-[var(--dp-color-ink)]">
                .NET object pipeline
              </strong>
              , headless{' '}
              <strong className="text-[var(--dp-color-ink)]">
                Server Core &amp; Active Directory
              </strong>
              , and{' '}
              <strong className="text-[var(--dp-color-ink)]">
                Red/Blue Team security
              </strong>{' '}
              step by step.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                type="button"
                onClick={() =>
                  onNavigate(
                    '/learn/chapter-01/windows-evolution-and-least-privilege'
                  )
                }
                className="clay-btn-primary px-7 py-3.5 text-[0.95rem] flex items-center gap-2.5 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Start Learning</span>
              </button>

              <button
                type="button"
                onClick={() => onNavigate('/learn')}
                className="clay-btn-secondary px-7 py-3.5 text-[0.95rem] font-extrabold text-[var(--dp-color-ink)] flex items-center gap-2.5 cursor-pointer"
              >
                <Layers className="w-4 h-4 text-[var(--dp-color-accent)]" />
                <span>View Curriculum</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-6 relative">
            <div className="clay-card p-4 sm:p-6 rounded-[2.25rem] relative">
              <div className="clay-well p-2 overflow-hidden rounded-[1.75rem]">
                <img
                  src="/assets/aistudio/image_2fc7720e.png"
                  alt="PowerShell Academy Electric Blue Dragon Artwork"
                  referrerPolicy="no-referrer"
                  className="w-full h-auto rounded-[1.35rem] object-cover"
                />
              </div>
              <div className="mt-4 clay-pill px-5 py-3 flex flex-wrap items-center justify-between gap-3 text-[0.85rem] font-extrabold">
                <span className="flex items-center gap-2 text-[var(--dp-color-accent)]">
                  <Layers className="w-4 h-4" />
                  <span>PowerShell Academy</span>
                </span>
                <span className="text-[var(--dp-color-ink-secondary)]">
                  Created by Muhammad Izaz Haider
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="clay-card p-5 sm:px-7 sm:py-5 rounded-[1.75rem] flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
          <div className="w-14 h-14 rounded-2xl clay-well flex items-center justify-center shrink-0 shadow-inner">
            <Lightbulb className="w-7 h-7 text-amber-500 fill-amber-300/60" />
          </div>
          <div className="space-y-1">
            <h2 className="text-[1.125rem] font-extrabold text-[var(--dp-color-accent)]">
              My #1 Rule Before You Start
            </h2>
            <p className="text-[0.95rem] text-[var(--dp-color-ink-secondary)] font-medium leading-relaxed">
              Type every single command yourself and let the{' '}
              <kbd className="clay-keycap mx-1 text-[var(--dp-color-accent)]">
                Tab
              </kbd>{' '}
              key complete your thoughts. Reading code{' '}
              <strong className="text-[var(--dp-color-ink)]">
                makes you nod; typing code
              </strong>{' '}
              builds muscle memory that never leaves you.
            </p>
          </div>
        </div>
      </div>

      {lastLesson && (
        <div className="mt-4 clay-card p-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full clay-btn-pink flex items-center justify-center shrink-0">
              <BookmarkCheck className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="text-[0.75rem] font-mono font-extrabold uppercase tracking-wider text-[var(--dp-color-accent)] block">
                Continue Where You Left Off · {completedCount}/35 Lessons
                Completed
              </span>
              <span className="text-[0.95rem] font-extrabold text-[var(--dp-color-ink)]">
                Lesson {lastLesson.lessonNumber}: {lastLesson.lessonTitle}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() =>
              onNavigate(
                `/learn/${lastLesson.chapterId}/${lastLesson.lessonSlug}`
              )
            }
            className="clay-btn-primary px-5 py-2.5 text-[0.8125rem] inline-flex items-center gap-2 cursor-pointer self-start sm:self-auto shrink-0"
          >
            <span>Resume Lesson</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </>
  );
};
