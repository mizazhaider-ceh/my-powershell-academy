import React, { useState, useEffect } from 'react';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { SearchModal } from './components/common/SearchModal';
import { HomeView } from './views/HomeView';
import { RoadmapView } from './views/RoadmapView';
import { LearnOverviewView } from './views/LearnOverviewView';
import { ChapterView } from './views/ChapterView';
import { LessonView } from './views/LessonView';
import { CommandsView } from './views/CommandsView';
import { KnowledgeView } from './views/KnowledgeView';
import { GlossaryView } from './views/GlossaryView';
import { AboutView } from './views/AboutView';

export default function App() {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return (window.location.pathname || '/') + window.location.search;
  });

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved = localStorage.getItem('powershell_academy_theme');
    if (saved) return saved === 'dark';
    return false; // Default to the luminous Royal Periwinkle Claymorphism light theme matching reference
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('powershell_academy_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('powershell_academy_theme', 'light');
    }
  }, [isDark]);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath((window.location.pathname || '/') + window.location.search);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navigate = (path: string) => {
    if (path !== currentPath) {
      window.history.pushState(null, '', path);
      setCurrentPath(path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  // Strip query string and hash before route matching; keep the query for views that use it.
  const cleanPath = currentPath.split(/[?#]/)[0].replace(/\/+$/, '') || '/';
  const queryParams = new URLSearchParams((currentPath.split('?')[1] || '').split('#')[0]);

  const renderRoute = () => {

    if (cleanPath === '/' || cleanPath === '') {
      return <HomeView onNavigate={navigate} />;
    }

    if (cleanPath === '/roadmap') {
      return <RoadmapView onNavigate={navigate} />;
    }

    if (cleanPath === '/learn') {
      return <LearnOverviewView onNavigate={navigate} />;
    }

    if (cleanPath.startsWith('/learn/')) {
      const parts = cleanPath.replace('/learn/', '').split('/');
      const chapterId = parts[0];
      const lessonSlug = parts[1];

      if (lessonSlug) {
        return (
          <LessonView
            chapterId={chapterId}
            lessonSlug={lessonSlug}
            onNavigate={navigate}
          />
        );
      }

      return <ChapterView chapterId={chapterId} onNavigate={navigate} />;
    }

    if (cleanPath === '/commands') {
      return <CommandsView onNavigate={navigate} />;
    }

    if (cleanPath.startsWith('/commands/')) {
      const cmdletName = decodeURIComponent(cleanPath.replace('/commands/', ''));
      return <CommandsView key={cmdletName} initialCmdlet={cmdletName} onNavigate={navigate} />;
    }

    if (cleanPath === '/knowledge') {
      return <KnowledgeView onNavigate={navigate} />;
    }

    if (cleanPath === '/glossary') {
      const glossaryQuery = queryParams.get('q') || '';
      return <GlossaryView key={glossaryQuery} initialQuery={glossaryQuery} onNavigate={navigate} />;
    }

    if (cleanPath === '/about') {
      return <AboutView onNavigate={navigate} />;
    }

    return <HomeView onNavigate={navigate} />;
  };

  return (
    <div className="min-h-screen flex flex-col font-sans antialiased">
      <Header
        currentPath={cleanPath}
        onNavigate={navigate}
        onOpenSearch={() => setIsSearchOpen(true)}
        isDark={isDark}
        onToggleTheme={toggleTheme}
      />

      <main className="flex-1">{renderRoute()}</main>

      <Footer onNavigate={navigate} />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={navigate}
      />
    </div>
  );
}
