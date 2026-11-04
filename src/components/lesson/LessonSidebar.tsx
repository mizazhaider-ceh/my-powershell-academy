import React from 'react';
import { Chapter, Lesson as LessonType } from '../../types';

interface LessonSidebarProps {
  currentLesson: LessonType;
  parentChapter?: Chapter;
  onNavigate: (path: string) => void;
  onScrollToSection: (id: string) => void;
}

export const LessonSidebar: React.FC<LessonSidebarProps> = ({
  currentLesson,
  parentChapter,
  onNavigate,
  onScrollToSection,
}) => {
  const quickLinks = [
    { id: 'sec-overview', label: '1. Objectives & Terms' },
    ...(currentLesson.guide ? [{ id: 'sec-start', label: 'Start Here (A to Z)' }] : []),
    { id: 'sec-flowchart', label: '2. Visual Flowchart' },
    { id: 'sec-concepts', label: '3. Deep-Dive Guide' },
    ...(currentLesson.guide ? [{ id: 'sec-ladder', label: 'Beginner → Pro Commands' }] : []),
    ...(currentLesson.commandBreakdowns?.length
      ? [{ id: 'sec-syntax', label: '4. Cmdlet Syntax' }]
      : []),
    ...(currentLesson.codeExamples?.length
      ? [{ id: 'sec-examples', label: '5. Examples' }]
      : []),
    ...(currentLesson.mistakesAndTraps?.length
      ? [{ id: 'sec-traps', label: '6. Common Traps' }]
      : []),
    ...(currentLesson.knowledgeCheck?.length
      ? [{ id: 'sec-quiz', label: '7. Check Yourself' }]
      : []),
  ];

  return (
    <div className="space-y-3">
      <nav
        aria-label="Breadcrumb"
        className="flex flex-wrap items-center gap-2 text-[0.8125rem] font-mono font-bold px-2"
      >
        <button
          type="button"
          onClick={() => onNavigate('/learn')}
          className="hover:underline cursor-pointer opacity-80 hover:opacity-100"
        >
          All 16 Modules
        </button>
        <span aria-hidden="true">·</span>
        {parentChapter && (
          <>
            <button
              type="button"
              onClick={() => onNavigate(`/learn/${parentChapter.slug}`)}
              className="hover:underline truncate max-w-[16rem] sm:max-w-none cursor-pointer opacity-80 hover:opacity-100"
            >
              Module {parentChapter.number}: {parentChapter.title}
            </button>
            <span aria-hidden="true">·</span>
          </>
        )}
        <span className="px-2.5 py-0.5 rounded-full clay-btn-pink text-[#383139]">
          Lesson {currentLesson.id}
        </span>
      </nav>

      <nav
        aria-label="Lesson sections"
        className="clay-navbar px-3 py-2 flex items-center gap-1.5 overflow-x-auto text-[0.75rem] font-bold"
      >
        <span className="px-2.5 py-1 opacity-70 font-mono shrink-0">
          Jump to:
        </span>
        {quickLinks.map((link) => (
          <button
            key={link.id}
            type="button"
            onClick={() => onScrollToSection(link.id)}
            className="px-3 py-1.5 rounded-full clay-well hover:bg-[#dbeafe] transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            {link.label}
          </button>
        ))}
      </nav>
    </div>
  );
};
