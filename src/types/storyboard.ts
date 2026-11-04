/**
 * Storyboards: a short picture-story for each lesson's analogy, rendered as an animated
 * strip of icon panels. Icons come from a fixed whitelist so every name is guaranteed to render.
 */
export const STORY_ICONS = [
  'monitor', 'terminal', 'cpu', 'hard-drive', 'server', 'database', 'network', 'globe',
  'lock', 'key', 'shield-check', 'shield-alert', 'user', 'users', 'folder', 'file-text',
  'search', 'filter', 'workflow', 'layers', 'package', 'box', 'settings', 'wrench', 'bug',
  'bell', 'clock', 'mail', 'eye', 'zap', 'play', 'refresh', 'download', 'upload', 'trash',
  'check', 'x', 'warning', 'help', 'book', 'code', 'cloud', 'power', 'fingerprint', 'route',
  'git-branch', 'list', 'table', 'binary', 'puzzle', 'plug', 'link', 'sparkles', 'scissors',
  'tag', 'building', 'briefcase', 'container', 'send', 'inbox', 'utensils', 'truck', 'plane',
  'ticket', 'map', 'compass', 'flag', 'gauge', 'scale', 'clipboard', 'door-open', 'hotel',
] as const;

export type StoryIcon = (typeof STORY_ICONS)[number];

export interface StoryPanel {
  icon: StoryIcon;
  /** Three to six words under the icon. */
  caption: string;
  /** One or two plain sentences, shown when the panel is selected. */
  detail: string;
}

export interface Storyboard {
  /** The analogy in a few words, for example "The sushi conveyor belt". */
  title: string;
  /** Exactly four panels telling the lesson's analogy as a left-to-right story. */
  panels: StoryPanel[];
}

export type StoryboardMap = Record<string, Storyboard>;
