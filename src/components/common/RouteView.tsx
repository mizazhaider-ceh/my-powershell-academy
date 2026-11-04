import React from 'react';
import { RoadmapView } from '../../views/RoadmapView';
import { LearnOverviewView } from '../../views/LearnOverviewView';
import { ChapterView } from '../../views/ChapterView';
import { LessonView } from '../../views/LessonView';
import { CommandsView } from '../../views/CommandsView';
import { KnowledgeView } from '../../views/KnowledgeView';
import { GlossaryView } from '../../views/GlossaryView';
import { AboutView } from '../../views/AboutView';
import { StartView } from '../../views/StartView';
import { LabSetupView } from '../../views/LabSetupView';
import { NotFoundView } from '../../views/NotFoundView';
import { ProjectsView } from '../../views/ProjectsView';
import { ProjectDetailView } from '../../views/ProjectDetailView';

interface RouteViewProps {
  cleanPath: string;
  queryParams: URLSearchParams;
  onNavigate: (path: string) => void;
  home: React.ReactNode;
}

/** Maps a clean URL path to its view. Unknown paths get a real 404 instead of the home page. */
export const RouteView: React.FC<RouteViewProps> = ({ cleanPath, queryParams, onNavigate, home }) => {
  if (cleanPath === '/' || cleanPath === '') return <>{home}</>;
  if (cleanPath === '/start') return <StartView onNavigate={onNavigate} />;
  if (cleanPath === '/lab-setup') return <LabSetupView onNavigate={onNavigate} />;
  if (cleanPath === '/roadmap') return <RoadmapView onNavigate={onNavigate} />;
  if (cleanPath === '/learn') return <LearnOverviewView onNavigate={onNavigate} />;

  if (cleanPath.startsWith('/learn/')) {
    const [chapterId, lessonSlug] = cleanPath.replace('/learn/', '').split('/');
    return lessonSlug ? (
      <LessonView chapterId={chapterId} lessonSlug={lessonSlug} onNavigate={onNavigate} />
    ) : (
      <ChapterView chapterId={chapterId} onNavigate={onNavigate} />
    );
  }

  if (cleanPath === '/commands') return <CommandsView onNavigate={onNavigate} />;
  if (cleanPath.startsWith('/commands/')) {
    const cmdletName = decodeURIComponent(cleanPath.replace('/commands/', ''));
    return <CommandsView key={cmdletName} initialCmdlet={cmdletName} onNavigate={onNavigate} />;
  }

  if (cleanPath === '/knowledge') return <KnowledgeView onNavigate={onNavigate} />;
  if (cleanPath === '/glossary') {
    const query = queryParams.get('q') || '';
    return <GlossaryView key={query} initialQuery={query} onNavigate={onNavigate} />;
  }
  if (cleanPath === '/about') return <AboutView onNavigate={onNavigate} />;
  if (cleanPath === '/projects') return <ProjectsView onNavigate={onNavigate} />;
  if (cleanPath.startsWith('/projects/')) {
    return <ProjectDetailView key={cleanPath} projectId={cleanPath.replace('/projects/', '')} onNavigate={onNavigate} />;
  }

  return <NotFoundView path={cleanPath} onNavigate={onNavigate} />;
};
