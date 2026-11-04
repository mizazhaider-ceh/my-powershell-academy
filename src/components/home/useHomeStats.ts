import { useMemo } from 'react';
import { chapters } from '../../data/chapters';
import { lessons } from '../../data/lessons';
import { commands } from '../../data/commands';
import { quizzes } from '../../data/quizzes';
import { countConceptDiagrams } from '../../data/teaching';
import type { HomeStat } from './HomeStatsStrip';

const LAB_COUNT = 6;

/** The numbers shown on both home pages, derived from the real data so they never drift. */
export function useHomeStats(): HomeStat[] {
  return useMemo(
    () => [
      { value: chapters.length, label: 'Modules in four tracks' },
      { value: lessons.length, label: 'Lessons, A to Z' },
      { value: countConceptDiagrams(), label: 'Concept diagrams' },
      { value: commands.length, label: 'Cmdlets explained' },
      { value: LAB_COUNT, label: 'Hands-on labs' },
      { value: quizzes.length, label: 'Gauntlet questions' },
    ],
    [],
  );
}
