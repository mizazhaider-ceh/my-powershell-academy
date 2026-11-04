import React from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  CheckCircle2,
  ChevronRight,
  Code2,
} from 'lucide-react';
import { Chapter } from '../../types';
import { COMMANDS } from '../../data/commands';

const KNOWN_CMDLETS = new Set(COMMANDS.map((c) => c.name.toLowerCase()));

interface ChapterLessonsListProps {
  currentChapter: Chapter;
  prevChapter: Chapter | null;
  nextChapter: Chapter | null;
  onNavigate: (path: string) => void;
}

export const ChapterLessonsList: React.FC<ChapterLessonsListProps> = ({
  currentChapter,
  prevChapter,
  nextChapter,
  onNavigate,
}) => {
  return (
    <>
      <section className="clay-tray p-6 sm:p-10 space-y-8">
        <div className="space-y-4">
          <div className="flex items-center gap-2.5">
            <span className="guide-num-badge">1</span>
            <h2 className="text-[1.375rem] sm:text-[1.5rem] font-extrabold">
              What You Will Master in Module {currentChapter.number}
            </h2>
          </div>
          <ul className="space-y-2.5">
            {currentChapter.learningObjectives.map((obj, i) => (
              <li
                key={i}
                className="clay-well p-4 flex items-start gap-3 text-[0.9375rem] font-medium"
              >
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-1 text-[var(--dp-color-accent)]" />
                <span className="leading-relaxed">{obj}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="clay-cushion-warm p-5 space-y-2">
            <span className="text-[0.75rem] font-mono uppercase tracking-wider font-extrabold block">
              Recommended Prerequisites
            </span>
            <div className="flex flex-wrap gap-2 text-[0.875rem] font-semibold">
              {currentChapter.prerequisites.map((p, i) => (
                <span key={i}>{p}</span>
              ))}
            </div>
          </div>

          <div className="clay-cushion-mint p-5 space-y-2">
            <span className="text-[0.75rem] font-mono uppercase tracking-wider font-extrabold block">
              Core Cmdlets Featured
            </span>
            <div className="flex flex-wrap gap-2">
              {currentChapter.relatedCmdlets.map((cmd, i) =>
                KNOWN_CMDLETS.has(cmd.toLowerCase()) ? (
                  <button
                    key={i}
                    type="button"
                    onClick={() => onNavigate(`/commands/${cmd.toLowerCase()}`)}
                    className="clay-pill font-mono text-[0.75rem] font-extrabold px-3 py-1 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Code2 className="w-3.5 h-3.5 text-[var(--dp-color-accent)]" />
                    <span>{cmd}</span>
                  </button>
                ) : (
                  <span key={i} className="clay-pill font-mono text-[0.75rem] font-extrabold px-3 py-1">
                    {cmd}
                  </span>
                ),
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-black/10 dark:border-white/10">
          <div className="flex items-center gap-2.5">
            <span className="guide-num-badge">2</span>
            <h2 className="text-[1.375rem] sm:text-[1.5rem] font-extrabold">
              Step-by-Step Lessons ({currentChapter.lessons.length})
            </h2>
          </div>

          <div className="space-y-4">
            {currentChapter.lessons.map((lesson) => (
              <div
                key={lesson.id}
                onClick={() =>
                  onNavigate(`/learn/${currentChapter.slug}/${lesson.slug}`)
                }
                className="clay-well p-6 rounded-[1.75rem] hover:bg-[#dbeafe] dark:hover:bg-white/5 transition-all cursor-pointer group flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2.5 text-[0.75rem] font-mono font-extrabold">
                    <span className="px-2.5 py-0.5 rounded-full clay-pill text-[var(--dp-color-accent)]">
                      Lesson {lesson.id}
                    </span>
                    <span className="flex items-center gap-1 opacity-80">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{lesson.estimatedMinutes} min</span>
                    </span>
                  </div>
                  <h3 className="text-[1.25rem] font-extrabold group-hover:text-[var(--dp-color-accent)] transition-colors">
                    {lesson.title}
                  </h3>
                  <p className="text-[0.9375rem] text-[var(--dp-color-ink-secondary)] font-medium leading-relaxed">
                    {lesson.description}
                  </p>
                </div>

                <div className="shrink-0">
                  <span className="clay-btn-primary px-5 py-2.5 text-[0.8125rem] inline-flex items-center gap-1.5">
                    <span>Start Lesson</span>
                    <ChevronRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <nav
        id="module-checkpoint"
        aria-label="Module pagination"
        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
      >
        {prevChapter ? (
          <button
            type="button"
            onClick={() => onNavigate(`/learn/${prevChapter.slug}`)}
            className="clay-card p-5 text-left flex items-center gap-3 cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5 shrink-0 text-[var(--dp-color-accent)]" />
            <div>
              <span className="text-[0.75rem] font-mono uppercase opacity-75 block font-extrabold">
                Previous Module
              </span>
              <span className="font-extrabold text-[1rem]">
                Module {prevChapter.number}: {prevChapter.title}
              </span>
            </div>
          </button>
        ) : (
          <div />
        )}

        {nextChapter ? (
          <button
            type="button"
            onClick={() => onNavigate(`/learn/${nextChapter.slug}`)}
            className="clay-card p-5 text-right flex items-center justify-end gap-3 cursor-pointer"
          >
            <div>
              <span className="text-[0.75rem] font-mono uppercase opacity-75 block font-extrabold">
                Next Module
              </span>
              <span className="font-extrabold text-[1rem]">
                Module {nextChapter.number}: {nextChapter.title}
              </span>
            </div>
            <ArrowRight className="w-5 h-5 shrink-0 text-[var(--dp-color-accent)]" />
          </button>
        ) : (
          <div />
        )}
      </nav>
    </>
  );
};
