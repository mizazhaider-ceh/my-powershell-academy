import React from 'react';
import { ArrowLeft, Clock, Download, Printer } from 'lucide-react';
import { chapters } from '../data/chapters';
import { lessons } from '../data/lessons';
import { ModuleIllustration } from '../components/diagrams/ModuleIllustration';
import { ChapterLessonsList } from '../components/lesson/ChapterLessonsList';

interface ChapterViewProps {
  chapterId: string;
  onNavigate: (path: string) => void;
}

export const ChapterView: React.FC<ChapterViewProps> = ({
  chapterId,
  onNavigate,
}) => {
  const currentChapter = chapters.find(
    (c) => c.slug === chapterId || c.id === chapterId
  );

  if (!currentChapter) {
    return (
      <div className="max-w-[58rem] mx-auto px-4 py-16 text-center">
        <div className="clay-tray p-10 space-y-4">
          <h2 className="text-[1.75rem] font-extrabold">Module not found</h2>
          <p className="text-[1rem] opacity-85">
            The requested module &ldquo;{chapterId}&rdquo; does not exist.
          </p>
          <button
            type="button"
            onClick={() => onNavigate('/learn')}
            className="clay-btn-primary px-6 py-2.5 text-[0.875rem] cursor-pointer"
          >
            Return to All Modules
          </button>
        </div>
      </div>
    );
  }

  const currentIndex = chapters.findIndex((c) => c.id === currentChapter.id);
  const prevChapter = currentIndex > 0 ? chapters[currentIndex - 1] : null;
  const nextChapter =
    currentIndex < chapters.length - 1 ? chapters[currentIndex + 1] : null;

  const handleDownloadModulePlaybook = () => {
    const modNum =
      currentChapter.number < 10
        ? `0${currentChapter.number}`
        : `${currentChapter.number}`;
    const lines: string[] = [
      `<#`,
      `  ============================================================================`,
      `  POWERSHELL ACADEMY - MODULE ${modNum} LAB PLAYBOOK`,
      `  Title: ${currentChapter.title}`,
      `  Track: ${currentChapter.track}`,
      `  Created by Muhammad Izaz Haider`,
      `  ============================================================================`,
      `#>`,
      ``,
      `# Core Cmdlets Featured in Module ${modNum}: ${currentChapter.relatedCmdlets.join(', ')}`,
      ``,
    ];

    currentChapter.lessons.forEach((sub) => {
      lines.push(
        `# ----------------------------------------------------------------------------`
      );
      lines.push(`# Lesson ${sub.id}: ${sub.title}`);
      lines.push(`# ${sub.description}`);
      lines.push(
        `# ----------------------------------------------------------------------------`
      );
      const fullLesson = lessons.find(
        (l) => l.slug === sub.slug || l.id === sub.id
      );
      if (fullLesson?.codeExamples) {
        fullLesson.codeExamples.forEach((ex) => {
          lines.push(`# [${ex.title}]`);
          lines.push(ex.code);
          lines.push(``);
        });
      }
    });

    const blob = new Blob([lines.join('\n')], {
      type: 'text/plain;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Module-${modNum}-${currentChapter.slug}-Playbook.ps1`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <article className="max-w-[64rem] mx-auto px-3 sm:px-6 py-6 space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => onNavigate('/learn')}
          className="clay-pill px-4 py-2 inline-flex items-center gap-2 text-[0.8125rem] font-mono font-extrabold cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All 16 Modules</span>
        </button>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleDownloadModulePlaybook}
            className="clay-btn-primary px-4 py-2 text-[0.78rem] font-mono font-extrabold inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Module .ps1 Playbook</span>
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="clay-btn-secondary px-4 py-2 text-[0.78rem] font-mono font-extrabold inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Summary</span>
          </button>
        </div>
      </div>

      <header className="clay-cushion-pink p-7 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-7 items-center">
        <div className="lg:col-span-7 space-y-4">
          <div className="flex flex-wrap items-center gap-2 text-[0.8125rem] font-mono font-extrabold text-[var(--dp-color-accent)]">
            <span className="px-3 py-1 rounded-full clay-pill">
              Module{' '}
              {currentChapter.number < 10
                ? `0${currentChapter.number}`
                : currentChapter.number}
            </span>
            <span className="px-3 py-1 rounded-full clay-pill">
              {currentChapter.track}
            </span>
            <span className="px-3 py-1 rounded-full clay-pill">
              {currentChapter.difficulty}
            </span>
            <span className="px-3 py-1 rounded-full clay-pill flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{currentChapter.estimatedMinutes} min study</span>
            </span>
          </div>

          <h1 className="text-[1.875rem] sm:text-[2.375rem] font-extrabold text-[var(--dp-color-ink)] leading-tight">
            {currentChapter.title}
          </h1>
          <p className="text-[1.0625rem] font-extrabold text-[var(--dp-color-accent)]">
            {currentChapter.subtitle}
          </p>
          <p className="text-[1rem] text-[var(--dp-color-ink-secondary)] font-medium leading-relaxed">
            {currentChapter.description}
          </p>
        </div>

        <div className="lg:col-span-5">
          <div className="clay-card p-3 rounded-[1.75rem]">
            <ModuleIllustration moduleNumber={currentChapter.number} />
          </div>
        </div>
      </header>

      <ChapterLessonsList
        currentChapter={currentChapter}
        prevChapter={prevChapter}
        nextChapter={nextChapter}
        onNavigate={onNavigate}
      />
    </article>
  );
};
