import { Lesson, LessonGuide } from '../types';
import { LESSONS_PART_1 } from './lessonsPart1';
import { LESSONS_PART_2 } from './lessonsPart2';
import { GUIDES_PART_1 } from './guides/guidesPart1';
import { GUIDES_PART_2 } from './guides/guidesPart2';
import { GUIDES_PART_3 } from './guides/guidesPart3';
import { GUIDES_PART_4 } from './guides/guidesPart4';
import { GUIDES_PART_5 } from './guides/guidesPart5';

const GUIDES: Record<string, LessonGuide> = {
  ...GUIDES_PART_1,
  ...GUIDES_PART_2,
  ...GUIDES_PART_3,
  ...GUIDES_PART_4,
  ...GUIDES_PART_5,
};

export const LESSONS: Lesson[] = [...LESSONS_PART_1, ...LESSONS_PART_2].map((lesson) => ({
  ...lesson,
  guide: GUIDES[lesson.id],
}));
export const lessons = LESSONS;