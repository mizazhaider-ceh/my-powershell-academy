import React from 'react';
import { Layers } from 'lucide-react';
import { setLessonDepth, useLessonDepth } from '../../utils/lessonDepth';
import type { LessonTimeEstimate } from '../../utils/lessonTime';

/** Shown on the core path where the long reference sections would be, so nothing is silently missing. */
export const DepthNotice: React.FC<{ time: LessonTimeEstimate }> = ({ time }) => {
  const depth = useLessonDepth();
  if (depth === 'full') return null;

  return (
    <aside className="clay-cushion-lavender p-5 sm:p-6 flex flex-wrap items-center justify-between gap-4" aria-label="Hidden sections">
      <div className="flex items-start gap-3 min-w-0">
        <Layers className="w-5 h-5 mt-0.5 shrink-0" />
        <div className="space-y-1">
          <p className="font-semibold">You are on the core path.</p>
          <p className="text-[0.92rem] leading-relaxed">
            The full concept walkthrough, cmdlet syntax breakdown and extra worked examples are hidden. They add about{' '}
            {time.full - time.core} minutes. Turn them on when you want the whole picture.
          </p>
        </div>
      </div>
      <button type="button" onClick={() => setLessonDepth('full')} className="clay-btn-primary px-4 py-2.5 text-[0.85rem] cursor-pointer">
        Show full depth
      </button>
    </aside>
  );
};
