import React from 'react';
import { Compass, Rocket, Lightbulb } from 'lucide-react';
import { LessonGuide } from '../../types';
import { formatInlineRichText } from './formatInlineRichText';

export const LessonStartHere: React.FC<{ guide: LessonGuide }> = ({ guide }) => (
  <section
    id="sec-start"
    aria-labelledby="lesson-start-heading"
    className="clay-tray p-6 sm:p-10 space-y-8"
  >
    <div className="flex items-center gap-3">
      <span className="guide-num-badge">
        <Compass className="w-5 h-5" />
      </span>
      <div>
        <span className="text-[0.75rem] font-mono uppercase tracking-wider font-bold opacity-75 block">
          Absolute Beginner? Start Here
        </span>
        <h2 id="lesson-start-heading" className="text-[1.5rem] sm:text-[1.75rem] font-bold">
          The Lesson from A to Z, in Plain English
        </h2>
      </div>
    </div>

    <div className="clay-cushion-warm p-5 sm:p-6 space-y-2">
      <span className="text-[0.8125rem] font-mono font-extrabold uppercase tracking-wider flex items-center gap-2">
        <Lightbulb className="w-4 h-4" /> Real-Life Analogy
      </span>
      <p className="text-[1.0625rem] leading-[1.75]">{formatInlineRichText(guide.analogy)}</p>
    </div>

    <div className="space-y-3 text-[1.0625rem] leading-[1.75]">
      {guide.plainEnglish.map((p, i) => (
        <p key={i}>{formatInlineRichText(p)}</p>
      ))}
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <div className="clay-well p-5 space-y-2">
        <span className="text-[0.75rem] font-mono font-bold uppercase tracking-wider opacity-80 block">
          Before You Start
        </span>
        <ul className="space-y-1.5 text-[0.9375rem] leading-relaxed list-disc pl-5">
          {guide.beforeYouStart.map((b, i) => (
            <li key={i}>{formatInlineRichText(b)}</li>
          ))}
        </ul>
      </div>
      <div className="clay-well p-5 space-y-2">
        <span className="text-[0.75rem] font-mono font-bold uppercase tracking-wider opacity-80 block">
          Words You Will Meet
        </span>
        <dl className="space-y-1.5 text-[0.9375rem] leading-relaxed">
          {guide.wordsYouWillMeet.map((w, i) => (
            <div key={i}>
              <dt className="inline font-bold font-mono">{w.word}</dt>
              <dd className="inline"> &mdash; {formatInlineRichText(w.meaning)}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>

    <div className="space-y-4">
      <span className="text-[0.75rem] font-mono font-bold uppercase tracking-wider opacity-80 flex items-center gap-2">
        <Rocket className="w-4 h-4" /> Follow These Steps in Order
      </span>
      <ol className="space-y-3">
        {guide.atoZSteps.map((s, i) => (
          <li key={i} className="clay-card p-4 sm:p-5 flex gap-4">
            <span className="guide-num-badge shrink-0">{i + 1}</span>
            <div className="space-y-1">
              <h3 className="font-bold text-[1.0625rem]">{s.title.replace(/^Step\s*\d+\s*:\s*/i, '')}</h3>
              <p className="text-[0.9375rem] leading-relaxed opacity-90">{formatInlineRichText(s.detail)}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  </section>
);

