import React from 'react';
import { ArrowRight, Compass, ShieldCheck, Terminal } from 'lucide-react';
import { chapters } from '../data/chapters';
import { START_PATHS, START_STEPS, SAFETY_LEVELS, TYPING_TIPS } from '../data/startGuide';
import { CodeBlock } from '../components/common/CodeBlock';

export const StartView: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => (
  <div className="max-w-[58rem] mx-auto px-3 sm:px-6 py-6 space-y-8">
    <header className="clay-cushion-pink p-7 sm:p-10 space-y-4">
      <span className="tc-label">Start here</span>
      <h1 className="text-[2rem] sm:text-[2.6rem] font-extrabold leading-tight">Your first ten minutes in PowerShell</h1>
      <p className="text-[1.05rem] leading-relaxed max-w-[42rem]">
        No setup, no virtual machines, nothing to install. Open the program that is already on your PC, run five small commands,
        and then pick the route that fits you.
      </p>
    </header>

    <ol className="space-y-5 list-none p-0">
      {START_STEPS.map((step, i) => (
        <li key={step.title}>
          <section className="clay-tray p-6 sm:p-8 space-y-4" aria-labelledby={`start-step-${i}`}>
            <div className="flex items-center gap-3">
              <span className="guide-num-badge" aria-hidden="true">{i + 1}</span>
              <h2 id={`start-step-${i}`} className="text-[1.35rem] sm:text-[1.6rem] font-bold">{step.title}</h2>
            </div>
            {step.body.map((p) => (
              <p key={p} className="text-[1.02rem] leading-relaxed">{p}</p>
            ))}
            {step.code && <CodeBlock code={step.code} output={step.output} title={step.title} />}
            {step.tip && (
              <p className="clay-cushion-lavender p-4 text-[0.93rem] leading-relaxed">
                <b>Good to know. </b>{step.tip}
              </p>
            )}
          </section>
        </li>
      ))}
    </ol>

    <section className="clay-tray p-6 sm:p-8 space-y-5" aria-labelledby="start-keys">
      <div className="flex items-center gap-2"><Terminal className="w-5 h-5" /><h2 id="start-keys" className="text-[1.35rem] font-bold">Six keys that save you hours</h2></div>
      <dl className="grid gap-3 sm:grid-cols-2">
        {TYPING_TIPS.map((t) => (
          <div key={t.key} className="clay-well p-4 space-y-1">
            <dt className="font-mono font-bold text-[0.92rem]">{t.key}</dt>
            <dd className="text-[0.93rem] leading-relaxed m-0">{t.what}</dd>
          </div>
        ))}
      </dl>
    </section>

    <section className="clay-tray p-6 sm:p-8 space-y-5" aria-labelledby="start-safety">
      <div className="flex items-center gap-2"><ShieldCheck className="w-5 h-5" /><h2 id="start-safety" className="text-[1.35rem] font-bold">Read the verb, know the risk</h2></div>
      <p className="text-[1rem] leading-relaxed">The first word of a command tells you what it will do. Check it before you press Enter.</p>
      <div className="grid gap-3 md:grid-cols-3">
        {SAFETY_LEVELS.map((level) => (
          <div key={level.label} className="clay-card p-5 space-y-2">
            <p className="font-bold">{level.label}</p>
            <p className="font-mono text-[0.8rem]">{level.verbs}</p>
            <p className="text-[0.92rem] leading-relaxed">{level.meaning}</p>
          </div>
        ))}
      </div>
    </section>

    <section className="space-y-5" aria-labelledby="start-paths">
      <div className="flex items-center gap-2"><Compass className="w-5 h-5" /><h2 id="start-paths" className="text-[1.5rem] font-bold">Choose your route</h2></div>
      <div className="grid gap-4 lg:grid-cols-3">
        {START_PATHS.map((path) => (
          <article key={path.id} className="clay-card p-6 space-y-3 flex flex-col">
            <h3 className="text-[1.15rem] font-bold">{path.name}</h3>
            <p className="text-[0.92rem] font-semibold">{path.who}</p>
            <p className="text-[0.92rem] leading-relaxed">{path.note}</p>
            <ul className="space-y-1.5 list-none p-0 mt-auto pt-2">
              {path.modules.map((n) => {
                const chapter = chapters.find((c) => c.number === n);
                return chapter ? (
                  <li key={n}>
                    <button
                      type="button"
                      onClick={() => onNavigate(`/learn/${chapter.slug}`)}
                      className="text-left text-[0.88rem] hover:underline cursor-pointer"
                    >
                      <b>Module {n}.</b> {chapter.title.split(':')[0]}
                    </button>
                  </li>
                ) : null;
              })}
            </ul>
          </article>
        ))}
      </div>
    </section>

    <div className="flex flex-wrap gap-3">
      <button type="button" onClick={() => onNavigate('/learn/chapter-03')} className="clay-btn-primary px-6 py-3 text-[0.95rem] cursor-pointer inline-flex items-center gap-2">
        Begin with module 3 <ArrowRight className="w-4 h-4" />
      </button>
      <button type="button" onClick={() => onNavigate('/lab-setup')} className="clay-btn-secondary px-6 py-3 text-[0.95rem] cursor-pointer">
        Build the practice lab
      </button>
    </div>
  </div>
);
