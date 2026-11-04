import React, { useEffect, useState } from 'react';
import { Chapter, Lesson as LessonType } from '../../types';
import { setLessonDepth, useLessonDepth } from '../../utils/lessonDepth';
import type { LessonTimeEstimate } from '../../utils/lessonTime';

interface LessonSidebarProps {
  currentLesson: LessonType;
  parentChapter?: Chapter;
  onNavigate: (path: string) => void;
  onScrollToSection: (id: string) => void;
  hasTeaching?: boolean;
  progress?: number;
  time?: LessonTimeEstimate;
}

interface Link {
  id: string;
  label: string;
  full?: boolean;
}

export const LessonSidebar: React.FC<LessonSidebarProps> = ({
  currentLesson,
  parentChapter,
  onNavigate,
  onScrollToSection,
  hasTeaching = false,
  progress = 0,
  time,
}) => {
  const depth = useLessonDepth();
  const [active, setActive] = useState('sec-overview');

  const allLinks: Link[] = [
    { id: 'sec-overview', label: 'Goals & terms' },
    ...(currentLesson.guide ? [{ id: 'sec-start', label: 'Start here' }] : []),
    ...(hasTeaching ? [{ id: 'sec-teacher', label: "Teacher's opening" }] : []),
    { id: 'sec-flowchart', label: 'Visual explorer' },
    { id: 'sec-concepts', label: 'Deep dive', full: true },
    ...(currentLesson.guide ? [{ id: 'sec-ladder', label: 'Commands' }] : []),
    ...(currentLesson.commandBreakdowns?.length ? [{ id: 'sec-syntax', label: 'Syntax', full: true }] : []),
    ...(currentLesson.codeExamples?.length ? [{ id: 'sec-examples', label: 'Examples', full: true }] : []),
    ...(currentLesson.mistakesAndTraps?.length ? [{ id: 'sec-traps', label: 'Traps' }] : []),
    ...(hasTeaching ? [{ id: 'sec-studio', label: "Teacher's studio" }] : []),
    ...(currentLesson.knowledgeCheck?.length ? [{ id: 'sec-quiz', label: 'Check yourself' }] : []),
  ];
  const links = allLinks.filter((link) => depth === 'full' || !link.full);
  const linkKey = links.map((l) => l.id).join('|');

  useEffect(() => {
    const visible = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => (entry.isIntersecting ? visible.add(entry.target.id) : visible.delete(entry.target.id)));
        const first = linkKey.split('|').find((id) => visible.has(id));
        if (first) setActive(first);
      },
      { rootMargin: '-25% 0px -60% 0px' },
    );
    linkKey.split('|').forEach((id) => {
      const node = document.getElementById(id);
      if (node) observer.observe(node);
    });
    return () => observer.disconnect();
  }, [linkKey, currentLesson.id]);

  return (
    <>
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-[0.8125rem] font-mono font-bold px-2 -mb-4">
        <button type="button" onClick={() => onNavigate('/learn')} className="hover:underline cursor-pointer opacity-80 hover:opacity-100">
          All 16 Modules
        </button>
        <span aria-hidden="true">/</span>
        {parentChapter && (
          <>
            <button
              type="button"
              onClick={() => onNavigate(`/learn/${parentChapter.slug}`)}
              className="hover:underline truncate max-w-[16rem] sm:max-w-none cursor-pointer opacity-80 hover:opacity-100"
            >
              Module {parentChapter.number}: {parentChapter.title}
            </button>
            <span aria-hidden="true">/</span>
          </>
        )}
        <span className="px-2.5 py-0.5 rounded-full clay-pill">Lesson {currentLesson.id}</span>
      </nav>

      <div className="lj-bar">
        <nav className="lj-links" aria-label="Lesson sections">
          {links.map((link) => (
            <button
              key={link.id}
              type="button"
              className="lj-link"
              aria-current={active === link.id ? 'true' : undefined}
              onClick={() => onScrollToSection(link.id)}
            >
              {link.label}
            </button>
          ))}
        </nav>
        <div className="lj-depth" role="group" aria-label="Lesson depth">
          <button type="button" aria-pressed={depth === 'core'} onClick={() => setLessonDepth('core')} title="The guided route">
            Core{time ? ` ${time.core} min` : ''}
          </button>
          <button type="button" aria-pressed={depth === 'full'} onClick={() => setLessonDepth('full')} title="Everything, including the reference sections">
            Full{time ? ` ${time.full} min` : ''}
          </button>
        </div>
        <div className="lj-progress" role="progressbar" aria-label="Reading progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress)}>
          <i style={{ width: `${progress}%` }} />
        </div>
      </div>
    </>
  );
};
