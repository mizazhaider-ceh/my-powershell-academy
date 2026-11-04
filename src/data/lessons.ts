import { Lesson } from '../types';
import { LESSONS_PART_1 } from './lessonsPart1';
import { LESSONS_PART_2 } from './lessonsPart2';

export const LESSONS: Lesson[] = [...LESSONS_PART_1, ...LESSONS_PART_2];
export const lessons = LESSONS;
