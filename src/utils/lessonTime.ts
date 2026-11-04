import type { Lesson, LessonTeaching } from '../types';

const READING_WPM = 140;
const MINUTES_PER_COMMAND = 1.5;
const SITTING_MINUTES = 45;

const wordsOf = (value: unknown): number =>
  JSON.stringify(value ?? '')
    .replace(/[{}[\]":,]/g, ' ')
    .split(/\s+/)
    .filter(Boolean).length;

const roundToFive = (minutes: number) => Math.max(10, Math.round(minutes / 5) * 5);

export interface LessonTimeEstimate {
  core: number;
  full: number;
  /** How many 45-minute sittings the core path needs. */
  sittings: number;
}

/**
 * An honest reading-plus-typing estimate. The authored `estimatedMinutes` field only counts the
 * original lesson text, so this counts what a learner actually meets on the page.
 */
export function estimateLessonTime(lesson: Lesson, teaching?: LessonTeaching): LessonTimeEstimate {
  const guide = lesson.guide;
  const coreWords =
    wordsOf([lesson.oneSentenceSummary, lesson.summary, lesson.learningObjectives, lesson.mistakesAndTraps]) +
    wordsOf(guide ? [guide.analogy, guide.plainEnglish, guide.atoZSteps, guide.beginner, guide.recap] : '') +
    wordsOf(teaching ?? '');
  const core =
    coreWords / READING_WPM +
    (guide?.beginner.commands.length ?? 0) * MINUTES_PER_COMMAND +
    (lesson.knowledgeCheck?.length ?? 0) +
    (lesson.tryItYourself?.length ?? 0) * 2;

  const extraWords =
    wordsOf([lesson.conceptSections, lesson.commandBreakdowns]) +
    wordsOf(guide ? [guide.intermediate, guide.pro] : '');
  const extraCommands =
    (lesson.codeExamples?.length ?? 0) +
    (guide ? guide.intermediate.commands.length + guide.pro.commands.length : 0);
  const full = core + extraWords / READING_WPM + extraCommands * MINUTES_PER_COMMAND;

  return {
    core: roundToFive(core),
    full: roundToFive(full),
    sittings: Math.max(1, Math.ceil(core / SITTING_MINUTES)),
  };
}
