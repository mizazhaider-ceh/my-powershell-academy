export type ThemeId = 'clay' | 'atlas';

export interface ThemeMeta {
  id: ThemeId;
  name: string;
  tagline: string;
  fonts: string;
  previewBackground: string;
  previewSurface: string;
  previewAccent: string;
  swatches: string[];
}

export const THEMES: ThemeMeta[] = [
  {
    id: 'clay',
    name: 'Claymorphism',
    tagline: 'Soft, tactile and friendly. Pillowy cobalt cushions.',
    fonts: 'Plus Jakarta Sans',
    previewBackground: 'linear-gradient(140deg, #dbe6ff 0%, #edf2fc 100%)',
    previewSurface: '#ffffff',
    previewAccent: 'linear-gradient(135deg, #2563eb, #1e40af)',
    swatches: ['#2563eb', '#c0efdc', '#f9e7a8', '#c5e5fb'],
  },
  {
    id: 'atlas',
    name: 'Atlas',
    tagline: 'Editorial and precise. Sidebar shell, flat hairline panels, one blue signal.',
    fonts: 'Geist, Geist Mono',
    previewBackground:
      'linear-gradient(90deg, #0b0c0f 0 28%, #101216 28% 100%)',
    previewSurface: 'rgba(255,255,255,0.06)',
    previewAccent: '#5b8cff',
    swatches: ['#0b0c0f', '#f4f5f7', '#5b8cff', '#22252b'],
  },
];

export const THEME_STORAGE_KEY = 'powershell_academy_visual_theme';
export const MODE_STORAGE_KEY = 'powershell_academy_theme';

/** The theme used on first visit, before the learner picks one. */
export const DEFAULT_THEME: ThemeId = 'atlas';

export function isThemeId(value: unknown): value is ThemeId {
  return THEMES.some((theme) => theme.id === value);
}

export function readStoredTheme(): ThemeId {
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    return isThemeId(saved) ? saved : DEFAULT_THEME;
  } catch {
    return DEFAULT_THEME;
  }
}

export function readStoredDarkMode(): boolean {
  try {
    return localStorage.getItem(MODE_STORAGE_KEY) === 'dark';
  } catch {
    return false;
  }
}

export function getThemeMeta(id: ThemeId): ThemeMeta {
  return THEMES.find((theme) => theme.id === id) ?? THEMES.find((theme) => theme.id === DEFAULT_THEME) ?? THEMES[0];
}
