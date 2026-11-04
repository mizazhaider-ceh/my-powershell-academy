import type { LessonTeaching, TeachingMap } from '../../types';
import { TEACHING_A } from './teachingA';
import { TEACHING_B } from './teachingB';
import { TEACHING_C } from './teachingC';
import { TEACHING_D } from './teachingD';

export const TEACHING: TeachingMap = {
  ...TEACHING_A,
  ...TEACHING_B,
  ...TEACHING_C,
  ...TEACHING_D,
};

export function getLessonTeaching(lessonId: string): LessonTeaching | undefined {
  return TEACHING[lessonId];
}

export function countConceptDiagrams(): number {
  return Object.values(TEACHING).reduce((total, t) => total + t.diagrams.length, 0);
}
