import { useCallback, useEffect, useState } from 'react';

const KEY = 'ps_academy_project_checks_v1';

type Store = Record<string, boolean[]>;

const read = (): Store => {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '{}') as Store;
  } catch {
    return {};
  }
};

/** Checklist ticks for one project, kept in localStorage so progress survives a reload. */
export function useProjectChecklist(projectId: string, length: number) {
  const load = useCallback(() => {
    const saved = read()[projectId] ?? [];
    return Array.from({ length }, (_, i) => !!saved[i]);
  }, [projectId, length]);

  const [checks, setChecks] = useState<boolean[]>(load);
  useEffect(() => setChecks(load()), [load]);

  const toggle = (index: number) => {
    setChecks((prev) => {
      const next = prev.map((v, i) => (i === index ? !v : v));
      try {
        localStorage.setItem(KEY, JSON.stringify({ ...read(), [projectId]: next }));
      } catch {
        // Storage can be blocked; the ticks then last for this visit only.
      }
      return next;
    });
  };

  return { checks, toggle, done: checks.filter(Boolean).length };
}
