import React, { useState, useEffect } from 'react';
import { flushSync } from 'react-dom';
import { useTheme } from './theme/useTheme';
import { AtlasShell } from './components/atlas/AtlasShell';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { SearchModal } from './components/common/SearchModal';
import { HomeView } from './views/HomeView';
import { AtlasHomeView } from './views/AtlasHomeView';
import { RouteView } from './components/common/RouteView';
import { useRouteAnnouncer } from './utils/routeMeta';

export default function App() {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return (window.location.pathname || '/') + window.location.search;
  });

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { theme, setTheme, isDark, toggleMode } = useTheme();

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
    if (path === currentPath) return;

    const go = (behavior: ScrollBehavior) => {
      window.history.pushState(null, '', path);
      setCurrentPath(path);
      window.scrollTo({ top: 0, behavior });
    };

    // Atlas crossfades between routes with the View Transitions API when available.
    const doc = document as Document & {
      startViewTransition?: (update: () => void) => { finished: Promise<void> };
    };
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (theme === 'atlas' && doc.startViewTransition && !reduceMotion) {
      const root = document.documentElement;
      root.dataset.routeTransition = '';
      doc
        .startViewTransition(() => flushSync(() => go('instant')))
        .finished.finally(() => delete root.dataset.routeTransition);
      return;
    }

    go('smooth');
  };

  // Strip query string and hash before route matching; keep the query for views that use it.
  const cleanPath = currentPath.split(/[?#]/)[0].replace(/\/+$/, '') || '/';
  const queryParams = new URLSearchParams((currentPath.split('?')[1] || '').split('#')[0]);

  useRouteAnnouncer(cleanPath);

  const renderHome = () =>
    theme === 'atlas' ? <AtlasHomeView onNavigate={navigate} /> : <HomeView onNavigate={navigate} />;

  const renderRoute = () => (
    <div id="main-content" tabIndex={-1} className="outline-none">
      <RouteView cleanPath={cleanPath} queryParams={queryParams} onNavigate={navigate} home={renderHome()} />
    </div>
  );

  const searchModal = (
    <SearchModal
      isOpen={isSearchOpen}
      onClose={() => setIsSearchOpen(false)}
      onNavigate={navigate}
    />
  );

  if (theme === 'atlas') {
    return (
      <div className="font-sans antialiased">
        <a href="#main-content" className="skip-link">Skip to content</a>
        <AtlasShell
          currentPath={cleanPath}
          onNavigate={navigate}
          onOpenSearch={() => setIsSearchOpen(true)}
          isDark={isDark}
          onToggleTheme={toggleMode}
          theme={theme}
          onSelectTheme={setTheme}
        >
          {renderRoute()}
        </AtlasShell>
        {searchModal}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col font-sans antialiased">
      <a href="#main-content" className="skip-link">Skip to content</a>
      <Header
        currentPath={cleanPath}
        onNavigate={navigate}
        onOpenSearch={() => setIsSearchOpen(true)}
        isDark={isDark}
        onToggleTheme={toggleMode}
        theme={theme}
        onSelectTheme={setTheme}
      />

      <main className="flex-1">{renderRoute()}</main>

      <Footer onNavigate={navigate} />

      {searchModal}
    </div>
  );
}
