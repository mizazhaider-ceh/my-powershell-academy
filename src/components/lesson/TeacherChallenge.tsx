import React, { useEffect, useState } from 'react';
import { Swords, PenLine } from 'lucide-react';
import type { LessonTeaching } from '../../types';

interface TeacherChallengeProps {
  lessonId: string;
  challenge: LessonTeaching['challenge'];
  teachBack: string;
}

const noteKey = (lessonId: string) => `ps_academy_teachback_${lessonId}`;

/** A hands-on challenge with progressive hints, then a teach-back note that is saved on this device. */
export const TeacherChallenge: React.FC<TeacherChallengeProps> = ({ lessonId, challenge, teachBack }) => {
  const [hintsShown, setHintsShown] = useState(0);
  const [solved, setSolved] = useState(false);
  const [note, setNote] = useState('');

  useEffect(() => {
    setHintsShown(0);
    setSolved(false);
    try {
      setNote(window.localStorage.getItem(noteKey(lessonId)) ?? '');
    } catch {
      setNote('');
    }
  }, [lessonId]);

  const saveNote = (value: string) => {
    setNote(value);
    try {
      window.localStorage.setItem(noteKey(lessonId), value);
    } catch {
      // Storage can be unavailable; the note simply will not persist.
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-4">
        <h3 className="text-[1.35rem] font-bold flex items-center gap-2">
          <Swords className="w-5 h-5 text-[var(--dp-color-accent)]" />
          Your challenge
        </h3>
        <p className="text-[0.98rem] leading-relaxed">{challenge.brief}</p>

        <ol className="space-y-2">
          {challenge.hints.slice(0, hintsShown).map((hint, i) => (
            <li key={hint} className="tc-reveal clay-well px-3.5 py-2.5 text-[0.9rem] flex gap-2">
              <span className="font-mono text-[0.72rem] opacity-60 mt-0.5">Hint {i + 1}</span>
              <span>{hint}</span>
            </li>
          ))}
        </ol>

        {solved ? (
          <div className="tc-reveal space-y-3">
            <div>
              <span className="tc-label">One solution</span>
              <pre className="tc-code">{challenge.solution}</pre>
            </div>
            <div className="clay-cushion-mint p-4 text-[0.92rem] leading-relaxed">
              <span className="font-semibold">Why it works: </span>
              {challenge.why}
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {hintsShown < challenge.hints.length && (
              <button
                type="button"
                onClick={() => setHintsShown((n) => n + 1)}
                className="clay-btn-secondary px-3.5 py-2 text-[0.82rem] cursor-pointer"
              >
                {hintsShown === 0 ? 'Stuck? Show a hint' : `Next hint (${hintsShown} of ${challenge.hints.length})`}
              </button>
            )}
            <button type="button" onClick={() => setSolved(true)} className="clay-btn-primary px-3.5 py-2 text-[0.82rem] cursor-pointer">
              I tried it, show the solution
            </button>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <h3 className="text-[1.35rem] font-bold flex items-center gap-2">
          <PenLine className="w-5 h-5 text-[var(--dp-color-accent)]" />
          Teach it back
        </h3>
        <p className="text-[0.98rem] leading-relaxed">{teachBack}</p>
        <textarea
          className="tc-note"
          value={note}
          onChange={(event) => saveNote(event.target.value)}
          placeholder="Write it in your own words. If you can explain it simply, you understand it."
          aria-label="Your teach-back explanation"
        />
        <p className="font-mono text-[0.72rem] opacity-60">
          {note.trim() ? `${note.trim().split(/\s+/).length} words, saved on this device` : 'Saved on this device as you type'}
        </p>
      </div>
    </div>
  );
};
