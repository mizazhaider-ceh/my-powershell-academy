import { chapters } from '../data/chapters';
import { lessons } from '../data/lessons';
import { commands } from '../data/commands';
import { glossary } from '../data/glossary';

export interface SearchResult {
  id: string;
  type: 'chapter' | 'lesson' | 'command' | 'glossary';
  title: string;
  subtitle: string;
  badge: string;
  path: string;
}

export function searchAcademyIndex(rawQuery: string): SearchResult[] {
  const q = rawQuery.trim().toLowerCase();
  if (!q) return [];

  const matched: SearchResult[] = [];

  chapters.forEach((c) => {
    if (
      c.title.toLowerCase().includes(q) ||
      c.subtitle.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q) ||
      c.track.toLowerCase().includes(q) ||
      c.relatedCmdlets.some((cmd) => cmd.toLowerCase().includes(q))
    ) {
      matched.push({
        id: `ch-${c.id}`,
        type: 'chapter',
        title: `Module ${String(c.number).padStart(2, '0')}: ${c.title}`,
        subtitle: c.subtitle,
        badge: c.track,
        path: `/learn/${c.slug}`,
      });
    }
  });

  lessons.forEach((l) => {
    const parentChapter = chapters.find((c) => c.id === l.chapterId);
    const inSections = l.conceptSections.some(
      (s) =>
        s.heading.toLowerCase().includes(q) ||
        s.body.some((p) => p.toLowerCase().includes(q))
    );
    if (
      l.title.toLowerCase().includes(q) ||
      l.subtitle.toLowerCase().includes(q) ||
      l.summary.toLowerCase().includes(q) ||
      l.oneSentenceSummary.toLowerCase().includes(q) ||
      l.keyTerms.some((k) => k.toLowerCase().includes(q)) ||
      inSections ||
      l.codeExamples.some(
        (ex) =>
          ex.code.toLowerCase().includes(q) ||
          ex.title.toLowerCase().includes(q)
      )
    ) {
      matched.push({
        id: `les-${l.id}`,
        type: 'lesson',
        title: l.title,
        subtitle: parentChapter
          ? `Module ${String(parentChapter.number).padStart(2, '0')}: ${parentChapter.title}`
          : l.subtitle,
        badge: 'Lesson',
        path: `/learn/${l.chapterId}/${l.slug}`,
      });
    }
  });

  commands.forEach((cmd) => {
    if (
      cmd.name.toLowerCase().includes(q) ||
      cmd.purpose.toLowerCase().includes(q) ||
      cmd.description.toLowerCase().includes(q) ||
      cmd.module.toLowerCase().includes(q)
    ) {
      matched.push({
        id: `cmd-${cmd.name}`,
        type: 'command',
        title: cmd.name,
        subtitle: cmd.purpose,
        badge: cmd.isEssentialPocketknife ? 'Essential' : 'Cmdlet',
        path: `/commands/${encodeURIComponent(cmd.name)}`,
      });
    }
  });

  glossary.forEach((g) => {
    if (
      g.term.toLowerCase().includes(q) ||
      g.definition.toLowerCase().includes(q) ||
      g.category.toLowerCase().includes(q)
    ) {
      matched.push({
        id: `gl-${g.term}`,
        type: 'glossary',
        title: g.term,
        subtitle: g.definition,
        badge: 'Glossary',
        path: `/glossary?q=${encodeURIComponent(g.term)}`,
      });
    }
  });

  return matched.slice(0, 14);
}
