import React from 'react';
import { ArrowLeft, Clock, ShieldAlert } from 'lucide-react';
import { PROJECTS } from '../data/projects';
import { CodeBlock } from '../components/common/CodeBlock';
import { useProjectChecklist } from '../utils/useProjectChecklist';
import { NotFoundView } from './NotFoundView';

export const ProjectDetailView: React.FC<{ projectId: string; onNavigate: (path: string) => void }> = ({ projectId, onNavigate }) => {
  const project = PROJECTS.find((p) => p.id === projectId);
  const { checks, toggle, done } = useProjectChecklist(projectId, project?.checklist.length ?? 0);
  if (!project) return <NotFoundView path={`/projects/${projectId}`} onNavigate={onNavigate} />;

  return (
    <article className="max-w-[58rem] mx-auto px-3 sm:px-6 py-6 space-y-8">
      <button type="button" onClick={() => onNavigate('/projects')} className="inline-flex items-center gap-2 text-[0.85rem] font-mono font-bold hover:underline cursor-pointer">
        <ArrowLeft className="w-4 h-4" /> All projects
      </button>

      <header className="clay-cushion-pink p-7 sm:p-10 space-y-4">
        <div className="flex flex-wrap items-center gap-2 text-[0.75rem] font-mono font-bold">
          <span className="clay-pill px-3 py-1">{project.level}</span>
          <span className="clay-pill px-3 py-1 flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{project.minutes} min</span>
        </div>
        <h1 className="text-[1.9rem] sm:text-[2.4rem] font-extrabold leading-tight">{project.title}</h1>
        <p className="text-[1.05rem] leading-relaxed">{project.scenario}</p>
      </header>

      <section className="grid gap-4 md:grid-cols-2" aria-label="Before you begin">
        <div className="clay-tray p-6 space-y-2">
          <h2 className="font-bold">You will need</h2>
          <ul className="pl-5 list-disc space-y-1 text-[0.95rem]">{project.needs.map((n) => <li key={n}>{n}</li>)}</ul>
        </div>
        <div className="clay-tray p-6 space-y-2">
          <h2 className="font-bold">You will be able to</h2>
          <ul className="pl-5 list-disc space-y-1 text-[0.95rem]">{project.outcomes.map((o) => <li key={o}>{o}</li>)}</ul>
        </div>
      </section>

      <p className="clay-cushion-lavender p-4 text-[0.92rem] flex items-start gap-2">
        <ShieldAlert className="w-4 h-4 mt-0.5 shrink-0" />
        <span>Run this only in your lab. Anything that changes a system defaults to -WhatIf, so you see the effect before you allow it.</span>
      </p>

      <ol className="space-y-5 list-none p-0">
        {project.steps.map((step, i) => (
          <li key={step.title}>
            <section className="clay-tray p-6 sm:p-8 space-y-4" aria-labelledby={`step-${i}`}>
              <div className="flex items-center gap-3">
                <span className="guide-num-badge" aria-hidden="true">{i + 1}</span>
                <h2 id={`step-${i}`} className="text-[1.25rem] sm:text-[1.45rem] font-bold">{step.title}</h2>
              </div>
              <p className="text-[1rem] leading-relaxed">{step.explain}</p>
              <CodeBlock code={step.code} title={step.title} />
              <p className="clay-cushion-mint p-4 text-[0.92rem] leading-relaxed"><b>What you should see. </b>{step.expect}</p>
            </section>
          </li>
        ))}
      </ol>

      <section className="clay-tray p-6 sm:p-8 space-y-3" aria-labelledby="final-script">
        <h2 id="final-script" className="text-[1.4rem] font-bold">The finished script</h2>
        <p className="text-[0.95rem] leading-relaxed">Everything above, assembled. Read it top to bottom before you run it.</p>
        <CodeBlock code={project.finalScript} title={`${project.id}.ps1`} showLineNumbers />
      </section>

      <section className="clay-tray p-6 sm:p-8 space-y-4" aria-labelledby="checklist">
        <div className="flex items-center justify-between gap-3">
          <h2 id="checklist" className="text-[1.4rem] font-bold">Did it work?</h2>
          <span className="font-mono text-[0.85rem] font-bold" aria-live="polite">{done} / {project.checklist.length}</span>
        </div>
        <ul className="space-y-2 list-none p-0">
          {project.checklist.map((item, i) => (
            <li key={item}>
              <label className="clay-well p-3 flex items-start gap-3 cursor-pointer text-[0.95rem]">
                <input type="checkbox" className="mt-1 w-4 h-4" checked={checks[i] ?? false} onChange={() => toggle(i)} />
                <span>{item}</span>
              </label>
            </li>
          ))}
        </ul>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="clay-tray-lavender p-6 space-y-3">
          <h2 className="font-bold text-[1.1rem]">If it goes wrong</h2>
          <dl className="space-y-3 text-[0.92rem]">
            {project.pitfalls.map((p) => (
              <div key={p.problem}><dt className="font-semibold">{p.problem}</dt><dd className="m-0 leading-relaxed">{p.fix}</dd></div>
            ))}
          </dl>
        </div>
        <div className="clay-tray p-6 space-y-3">
          <h2 className="font-bold text-[1.1rem]">Stretch goals</h2>
          <ul className="pl-5 list-disc space-y-1.5 text-[0.92rem]">{project.stretch.map((s) => <li key={s}>{s}</li>)}</ul>
        </div>
      </section>
    </article>
  );
};
