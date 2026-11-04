export interface ModulePalette {
  bgStart: string;
  bgEnd: string;
  accent: string;
  secondary: string;
  surface: string;
}

export const MODULE_PALETTES: Record<number, ModulePalette> = {
  1: { bgStart: '#0b192c', bgEnd: '#1e3a8a', accent: '#34d399', secondary: '#60a5fa', surface: '#dbeafe' },
  2: { bgStart: '#0f172a', bgEnd: '#1d4ed8', accent: '#fde68a', secondary: '#38bdf8', surface: '#e0f2fe' },
  3: { bgStart: '#172554', bgEnd: '#2563eb', accent: '#fbbf24', secondary: '#93c5fd', surface: '#fef3c7' },
  4: { bgStart: '#1e1b4b', bgEnd: '#1d4ed8', accent: '#f59e0b', secondary: '#60a5fa', surface: '#e0e7ff' },
  5: { bgStart: '#0f172a', bgEnd: '#2563eb', accent: '#60a5fa', secondary: '#fde68a', surface: '#dbeafe' },
  6: { bgStart: '#172554', bgEnd: '#3b82f6', accent: '#fcd34d', secondary: '#34d399', surface: '#ecfdf5' },
  7: { bgStart: '#0c192c', bgEnd: '#1d4ed8', accent: '#34d399', secondary: '#fcd34d', surface: '#d1fae5' },
  8: { bgStart: '#0f2942', bgEnd: '#1d4ed8', accent: '#38bdf8', secondary: '#a7f3d0', surface: '#e0f2fe' },
  9: { bgStart: '#0b132b', bgEnd: '#1e3a8a', accent: '#2dd4bf', secondary: '#60a5fa', surface: '#ccfbf1' },
  10: { bgStart: '#172554', bgEnd: '#2563eb', accent: '#fbbf24', secondary: '#93c5fd', surface: '#fef3c7' },
  11: { bgStart: '#0f172a', bgEnd: '#1e40af', accent: '#38bdf8', secondary: '#a7f3d0', surface: '#dbeafe' },
  12: { bgStart: '#0b192c', bgEnd: '#1d4ed8', accent: '#fde68a', secondary: '#60a5fa', surface: '#fef9c3' },
  13: { bgStart: '#172554', bgEnd: '#1e3a8a', accent: '#34d399', secondary: '#93c5fd', surface: '#d1fae5' },
  14: { bgStart: '#1e1b4b', bgEnd: '#2563eb', accent: '#fbbf24', secondary: '#c4b5fd', surface: '#ede9fe' },
  15: { bgStart: '#1e1b4b', bgEnd: '#1e3a8a', accent: '#f87171', secondary: '#93c5fd', surface: '#fee2e2' },
  16: { bgStart: '#0f172a', bgEnd: '#1e40af', accent: '#34d399', secondary: '#60a5fa', surface: '#dbeafe' },
};
