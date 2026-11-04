import React from 'react';
import { FlaskConical, Award, CheckCircle2 } from 'lucide-react';
import { quizQuestions } from '../data/quizzes';
import { QuizRunner } from '../components/quiz/QuizRunner';
import { PracticeLabsWorkbench } from '../components/interactive/PracticeLabsWorkbench';

interface KnowledgeViewProps {
  onNavigate: (path: string) => void;
}

export const KnowledgeView: React.FC<KnowledgeViewProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-[64rem] mx-auto px-3 sm:px-6 py-6 space-y-8">
      {/* PowerShell Deep Blue Header Cushion */}
      <header className="clay-cushion-pink p-7 sm:p-10 space-y-5">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full clay-pill text-[0.8125rem] font-mono font-extrabold text-[var(--dp-color-accent)]">
          <FlaskConical className="w-4 h-4" />
          <span>Interactive Practice &amp; Drills · By Muhammad Izaz Haider</span>
        </div>
        <h1 className="text-[2rem] sm:text-[2.625rem] font-extrabold text-[var(--dp-color-ink)] leading-tight">
          Systems, Pipeline &amp; Security Gauntlet
        </h1>
        <p className="text-[1.0625rem] text-[var(--dp-color-ink-secondary)] font-medium leading-relaxed">
          Master all 16 modules through hands-on troubleshooting labs, live
          UTF-16LE Base64 &amp; Event ID 4104 decoding, and our 72-question
          engineering gauntlet, covering Windows kernel rings, 4 KB paging,
          pipeline binding, Server Core deployment, and Ethical Hacking recon.
        </p>

        {/* 4 Core Mental Models */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
          <div className="clay-cushion-mint p-4 space-y-1">
            <span className="font-extrabold text-[0.9375rem] flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>1. Ring 3 vs Ring 0 &amp; Process Trees</span>
            </span>
            <p className="text-[0.8125rem] leading-relaxed font-medium">
              How NTDLL.DLL crosses into ntoskrnl.exe and how to spot imposter
              processes by parent, path, and spelling.
            </p>
          </div>
          <div className="clay-cushion-warm p-4 space-y-1">
            <span className="font-extrabold text-[0.9375rem] flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>2. Parameter Binding Sequence</span>
            </span>
            <p className="text-[0.8125rem] leading-relaxed font-medium">
              Why PowerShell tries ByValue (type match) first and ByPropertyName
              (property match) second.
            </p>
          </div>
          <div className="clay-cushion-cool p-4 space-y-1">
            <span className="font-extrabold text-[0.9375rem] flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>3. Filter Left, Format Right</span>
            </span>
            <p className="text-[0.8125rem] leading-relaxed font-medium">
              Why -Filter at the source beats Where-Object, and why Format-Table
              must stay at the very end.
            </p>
          </div>
          <div className="clay-cushion-lavender p-4 space-y-1">
            <span className="font-extrabold text-[0.9375rem] flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>4. Offensive Recon vs Blue Team Logging</span>
            </span>
            <p className="text-[0.8125rem] leading-relaxed font-medium">
              Why AMSI and Event ID 4104 defeat Base64 cradles, and how CLM and
              JEA lock down endpoints.
            </p>
          </div>
        </div>
      </header>

      {/* Interactive Diagnostic Labs & Red/Blue Team Decoder Workbench */}
      <PracticeLabsWorkbench />

      {/* Main Interactive 72-Question Quiz Runner */}
      <QuizRunner
        questions={quizQuestions}
        title="Complete 16-Module Mastery Drill Bank (72 Questions)"
        subtitle="Filter by question type below or test all 72 questions in sequence."
      />

      <div className="clay-card p-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-[0.8125rem] font-mono">
        <div className="flex items-center gap-2 font-extrabold">
          <Award className="w-4 h-4 text-[var(--dp-color-accent)]" />
          <span>72 Deep-Dive Questions + Interactive Labs · Created by Muhammad Izaz Haider</span>
        </div>
        <button
          type="button"
          onClick={() => onNavigate('/roadmap')}
          className="font-extrabold text-[var(--dp-color-accent)] underline cursor-pointer"
        >
          Review 16-Module Engineering Roadmap →
        </button>
      </div>
    </div>
  );
};
