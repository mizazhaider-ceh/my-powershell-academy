import React from 'react';

export const NotFoundView: React.FC<{ path: string; onNavigate: (path: string) => void }> = ({ path, onNavigate }) => (
  <div className="max-w-[44rem] mx-auto px-4 py-16">
    <div className="clay-tray p-8 sm:p-10 space-y-5 text-center">
      <p className="font-mono text-[0.85rem] opacity-75">404</p>
      <h1 className="text-[1.9rem] font-extrabold">That page is not here</h1>
      <p className="text-[1rem] leading-relaxed">
        Nothing lives at <code className="font-mono">{path}</code>. The link may be old or mistyped.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <button type="button" onClick={() => onNavigate('/')} className="clay-btn-primary px-6 py-3 text-[0.95rem] cursor-pointer">
          Go home
        </button>
        <button type="button" onClick={() => onNavigate('/learn')} className="clay-btn-secondary px-6 py-3 text-[0.95rem] cursor-pointer">
          Browse the curriculum
        </button>
      </div>
    </div>
  </div>
);
