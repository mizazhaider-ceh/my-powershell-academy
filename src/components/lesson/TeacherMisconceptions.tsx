import React, { useState } from 'react';
import { ShieldQuestion, CheckCircle2 } from 'lucide-react';
import type { TeachingMisconception } from '../../types';

/** Three beliefs beginners hold, each one you can bust with a command you run yourself. */
export const TeacherMisconceptions: React.FC<{ items: TeachingMisconception[] }> = ({ items }) => {
  const [busted, setBusted] = useState<Record<number, boolean>>({});
  const count = Object.values(busted).filter(Boolean).length;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="text-[1.35rem] font-bold flex items-center gap-2">
          <ShieldQuestion className="w-5 h-5 text-[var(--dp-color-accent)]" />
          Misconception busters
        </h3>
        <span className="font-mono text-[0.75rem] opacity-70">
          {count} of {items.length} busted
        </span>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {items.map((item, i) => {
          const open = !!busted[i];
          return (
            <div key={item.myth} className="clay-well p-4 space-y-3 flex flex-col">
              <div>
                <span className="tc-label">You might think</span>
                <p className={`text-[0.93rem] leading-snug ${open ? 'tc-myth' : 'font-medium'}`}>{item.myth}</p>
              </div>

              {open ? (
                <div className="tc-reveal space-y-3">
                  <div>
                    <span className="tc-label flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Actually
                    </span>
                    <p className="text-[0.93rem] leading-snug">{item.truth}</p>
                  </div>
                  <div>
                    <span className="tc-label">Prove it yourself</span>
                    <pre className="tc-code">{item.test}</pre>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setBusted((prev) => ({ ...prev, [i]: true }))}
                  className="clay-btn-secondary mt-auto px-3.5 py-2 text-[0.82rem] cursor-pointer self-start"
                >
                  Bust this myth
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
