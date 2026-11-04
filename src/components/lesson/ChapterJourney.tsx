import React from 'react';
import { Check, Flag, Trophy } from 'lucide-react';
import type { Chapter } from '../../types';

interface ChapterJourneyProps {
  chapter: Chapter;
  completedIds: string[];
  onNavigate: (path: string) => void;
}

type StopState = 'done' | 'next' | 'todo';

/** Your route through a module: start, each lesson, then the module checkpoint. Reflects saved progress. */
export const ChapterJourney: React.FC<ChapterJourneyProps> = ({ chapter, completedIds, onNavigate }) => {
  const lessons = chapter.lessons;
  const doneCount = lessons.filter((l) => completedIds.includes(l.id)).length;
  const stops = lessons.length + 2;
  const progress = doneCount / (stops - 1);
  const nextIndex = lessons.findIndex((l) => !completedIds.includes(l.id));
  const allDone = nextIndex === -1;

  const stateOf = (i: number): StopState => {
    if (i === 0) return 'done';
    if (i === stops - 1) return allDone ? 'next' : 'todo';
    if (completedIds.includes(lessons[i - 1].id)) return 'done';
    return i - 1 === nextIndex ? 'next' : 'todo';
  };

  const firstLesson = lessons[0];
  const goToLesson = (slug: string) => onNavigate(`/learn/${chapter.slug}/${slug}`);

  return (
    <section className="clay-card p-6 sm:p-8 space-y-6" aria-labelledby="journey-heading">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="journey-heading" className="text-[1.375rem] sm:text-[1.5rem] font-bold">
          Your route through Module {chapter.number}
        </h2>
        <span className="font-mono text-[0.75rem] text-[var(--dp-color-ink-secondary)]">
          {doneCount} of {lessons.length} lessons complete
        </span>
      </div>

      <ol className="jr-route" style={{ '--n': stops, '--p': progress } as React.CSSProperties}>
        <li className="jr-stop" data-state="done">
          <button type="button" className="jr-node" onClick={() => goToLesson(firstLesson.slug)} aria-label="Start of module">
            <Flag className="w-4 h-4" />
          </button>
          <div className="jr-label">
            <b>Start here</b>
            <small>{chapter.estimatedMinutes} min in total</small>
          </div>
        </li>

        {lessons.map((lesson, i) => {
          const state = stateOf(i + 1);
          return (
            <li key={lesson.id} className="jr-stop" data-state={state}>
              <button
                type="button"
                className="jr-node"
                onClick={() => goToLesson(lesson.slug)}
                aria-label={`Lesson ${lesson.id}: ${lesson.title}${state === 'done' ? ' (complete)' : ''}`}
              >
                {state === 'done' ? <Check className="w-4 h-4" strokeWidth={3} /> : lesson.id}
              </button>
              <div className="jr-label">
                {state === 'next' && <span className="jr-tag mx-auto sm:mx-auto w-fit">Up next</span>}
                <b>{lesson.title}</b>
                <small>{lesson.estimatedMinutes} min</small>
              </div>
            </li>
          );
        })}

        <li className="jr-stop" data-state={stateOf(stops - 1)}>
          <button
            type="button"
            className="jr-node"
            onClick={() => document.getElementById('module-checkpoint')?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
            aria-label="Module checkpoint"
          >
            <Trophy className="w-4 h-4" />
          </button>
          <div className="jr-label">
            <b>Module checkpoint</b>
            <small>{allDone ? 'Ready for the next module' : 'Finish every quiz'}</small>
          </div>
        </li>
      </ol>
    </section>
  );
};
