import React from 'react';
import { Clock, Hammer } from 'lucide-react';
import { PROJECTS } from '../data/projects';

export const ProjectsView: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => (
  <div className="max-w-[58rem] mx-auto px-3 sm:px-6 py-6 space-y-8">
    <header className="clay-cushion-pink p-7 sm:p-10 space-y-4">
      <span className="tc-label">Projects</span>
      <h1 className="text-[2rem] sm:text-[2.6rem] font-extrabold leading-tight">Build the scripts admins actually write</h1>
      <p className="text-[1.05rem] leading-relaxed max-w-[42rem]">
        Short lessons teach one idea at a time. These projects put the ideas together into a finished script that you build
        step by step in your lab, with a checklist to prove it works. Every change defaults to a preview with -WhatIf.
      </p>
    </header>

    <div className="grid gap-5 md:grid-cols-2">
      {PROJECTS.map((project) => (
        <article key={project.id} className="clay-card p-6 sm:p-7 space-y-4 flex flex-col">
          <div className="flex flex-wrap items-center gap-2 text-[0.75rem] font-mono font-bold">
            <span className="clay-pill px-3 py-1 flex items-center gap-1"><Hammer className="w-3.5 h-3.5" />{project.level}</span>
            <span className="clay-pill px-3 py-1 flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{project.minutes} min</span>
          </div>
          <h2 className="text-[1.3rem] font-bold leading-snug">{project.title}</h2>
          <p className="text-[0.95rem] leading-relaxed">{project.scenario}</p>
          <ul className="space-y-1.5 pl-5 list-disc text-[0.9rem]">
            {project.outcomes.slice(0, 3).map((o) => <li key={o}>{o}</li>)}
          </ul>
          <button
            type="button"
            onClick={() => onNavigate(`/projects/${project.id}`)}
            className="clay-btn-primary px-5 py-2.5 text-[0.9rem] cursor-pointer mt-auto self-start"
          >
            Start this project
          </button>
        </article>
      ))}
    </div>
  </div>
);
