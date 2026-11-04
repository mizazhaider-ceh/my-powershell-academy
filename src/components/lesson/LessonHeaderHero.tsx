import React from 'react';
import { Clock, Lightbulb, BookOpen } from 'lucide-react';
import { Chapter, Lesson as LessonType } from '../../types';
import { PlainEnglishTermExplanation } from '../../utils/lessonPedagogy';
import { formatInlineRichText } from './formatInlineRichText';
import type { LessonTimeEstimate } from '../../utils/lessonTime';

interface LessonHeaderHeroProps {
  currentLesson: LessonType;
  parentChapter?: Chapter;
  plainEnglishTerms: PlainEnglishTermExplanation[];
  time?: LessonTimeEstimate;
}

export const LessonHeaderHero: React.FC<LessonHeaderHeroProps> = ({
  currentLesson,
  parentChapter,
  plainEnglishTerms,
  time,
}) => {
  return (
    <>
      <header className="clay-cushion-pink p-7 sm:p-10 space-y-5">
        <div className="flex flex-wrap items-center gap-2 text-[0.8125rem] font-mono font-bold text-[#383139]">
          <span className="px-3 py-1 rounded-full clay-pill">
            {parentChapter?.track || 'Advanced Object Pipeline'}
          </span>
          <span className="px-3 py-1 rounded-full clay-pill">
            Lesson {currentLesson.id}
          </span>
          <span className="px-3 py-1 rounded-full clay-pill flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>
              {time
                ? `${time.core} min core, ${time.full} min full${time.sittings > 1 ? ` (${time.sittings} sittings)` : ''}`
                : `${currentLesson.estimatedMinutes} min study`}
            </span>
          </span>
        </div>

        <div className="space-y-2">
          <h1 className="text-[2rem] sm:text-[2.625rem] font-bold text-[#383139] leading-[1.1]">
            {currentLesson.title}
          </h1>
          {currentLesson.subtitle && (
            <p className="text-[1.125rem] font-bold text-[#383139]/90">
              {currentLesson.subtitle}
            </p>
          )}
        </div>

        {currentLesson.oneSentenceSummary && (
          <div className="clay-cushion-warm p-5 sm:p-6 space-y-1.5">
            <span className="text-[0.8125rem] font-mono uppercase tracking-wider font-extrabold flex items-center gap-1.5">
              <Lightbulb className="w-4 h-4 shrink-0" />
              <span>The one-sentence version</span>
            </span>
            <p className="text-[1.0625rem] font-semibold leading-relaxed">
              {formatInlineRichText(currentLesson.oneSentenceSummary)}
            </p>
          </div>
        )}

        <p className="text-[1.0625rem] text-[#383139] leading-[1.68]">
          {formatInlineRichText(currentLesson.summary)}
        </p>
      </header>

      <section
        id="sec-overview"
        aria-labelledby="lesson-objectives-heading"
        className="clay-tray p-6 sm:p-10 space-y-8"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="guide-num-badge">1</span>
            <h2
              id="lesson-objectives-heading"
              className="text-[1.5rem] sm:text-[1.75rem] font-bold"
            >
              What You Will Master &amp; Why It Matters
            </h2>
          </div>

          <div className="clay-cushion-cool p-5 sm:p-6 space-y-2">
            <span className="text-[0.75rem] font-mono uppercase tracking-wider font-extrabold block">
              Real-world context
            </span>
            <p className="text-[1rem] leading-relaxed">
              {formatInlineRichText(currentLesson.whyItMatters)}
            </p>
          </div>

          <ul className="space-y-3 pt-1">
            {currentLesson.learningObjectives.map((obj, i) => (
              <li
                key={i}
                className="clay-well p-4 flex items-start gap-3.5 text-[1rem]"
              >
                <span className="w-6 h-6 rounded-full clay-btn-pink text-[#383139] font-mono text-[0.75rem] font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <span className="leading-relaxed">
                  {formatInlineRichText(obj)}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {plainEnglishTerms.length > 0 && (
          <div className="pt-6 border-t border-black/10 dark:border-white/10 space-y-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-[0.75rem] font-mono uppercase tracking-wider font-bold opacity-80">
                <BookOpen className="w-4 h-4" />
                <span>Beginner Vocabulary First · Zero Unexplained Jargon</span>
              </div>
              <h3 className="text-[1.25rem] sm:text-[1.375rem] font-bold">
                New Terms &amp; Acronyms Explained in Plain English
              </h3>
              <p className="text-[0.9375rem] opacity-85">
                Read these plain-English definitions first so every term and
                acronym in this lesson makes immediate sense:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {plainEnglishTerms.map((item, idx) => (
                <div key={idx} className="clay-well p-4 space-y-1">
                  <span className="font-mono text-[0.9375rem] font-bold block">
                    {item.term}
                  </span>
                  <p className="text-[0.875rem] opacity-90 leading-relaxed">
                    {item.plainEnglish}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </>
  );
};
