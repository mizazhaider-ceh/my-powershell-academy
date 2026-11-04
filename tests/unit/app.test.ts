import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { chapters } from '../../src/data/chapters';
import { lessons } from '../../src/data/lessons';
import { commands } from '../../src/data/commands';
import { glossary } from '../../src/data/glossary';
import { quizzes } from '../../src/data/quizzes';
import { TEACHING, countConceptDiagrams } from '../../src/data/teaching';
import { THEMES, readStoredTheme } from '../../src/theme/themes';
import {
  buildLessonFlowchartData,
  extractPlainEnglishKeyTerms,
  decodeSyntaxForBeginners,
} from '../../src/utils/lessonPedagogy';
import {
  getProcessTreeNodes,
  getProcessLineageIds,
  getPipelinePacketsForStage,
  getRecommendedFlowchartTab,
} from '../../src/utils/flowchartModels';

function collectCodeFiles(dir: string): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const results: string[] = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...collectCodeFiles(fullPath));
    } else if (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx')) {
      results.push(fullPath);
    }
  }
  return results;
}

test('Modular file architecture: every file in src/components, src/views, and src/App.tsx is strictly under 200 lines', () => {
  const rootDir = process.cwd();
  const files = [
    path.join(rootDir, 'src/App.tsx'),
    ...collectCodeFiles(path.join(rootDir, 'src/components')),
    ...collectCodeFiles(path.join(rootDir, 'src/views')),
  ];
  assert.ok(files.length >= 60, 'Expected modular component and view structure');

  for (const file of files) {
    const content = fs.readFileSync(file, 'utf8');
    const lineCount = content.split('\n').length;
    const relPath = path.relative(rootDir, file);
    assert.ok(
      lineCount < 200,
      `Expected ${relPath} to be strictly under 200 lines, but found ${lineCount} lines`
    );
  }
});

test('Curriculum coverage: all 16 modules across 4 specialized engineering tracks are present', () => {
  assert.equal(chapters.length, 16, 'Expected exactly 16 modules');
  const tracks = new Set(chapters.map((c) => c.track));
  assert.ok(tracks.has('Windows Internals'), 'Must include Windows Internals track');
  assert.ok(tracks.has('Advanced Object Pipeline'), 'Must include Advanced Object Pipeline track');
  assert.ok(tracks.has('Systems & Fleet Automation'), 'Must include Systems & Fleet Automation track');
  assert.ok(tracks.has('PowerShell for Ethical Hackers'), 'Must include PowerShell for Ethical Hackers track');

  chapters.forEach((ch, idx) => {
    assert.equal(ch.number, idx + 1, `Module ${ch.id} should have number ${idx + 1}`);
    assert.ok(ch.title.length > 0, `Module ${ch.number} should have a title`);
    assert.ok(ch.lessons.length >= 2, `Module ${ch.number} should have at least 2 lessons`);
  });
});

test('Every lesson has a complete A-to-Z guide with beginner, intermediate and pro tiers', () => {
  lessons.forEach((lesson) => {
    const g = lesson.guide;
  assert.ok(g, `Lesson ${lesson.id} must have a guide`);
  assert.ok(g.oneSentence.length > 20, `Lesson ${lesson.id} guide needs a one-sentence version`);
  assert.ok(g.analogy.length > 40, `Lesson ${lesson.id} guide needs an analogy`);
    assert.ok(g.atoZSteps.length >= 5, `Lesson ${lesson.id} guide needs at least 5 A-to-Z steps`);
    assert.ok(g.wordsYouWillMeet.length >= 4, `Lesson ${lesson.id} guide needs vocabulary`);
    assert.ok(g.recap.length >= 3, `Lesson ${lesson.id} guide needs a recap`);
    for (const tier of [g.beginner, g.intermediate, g.pro]) {
      assert.ok(tier.commands.length >= 3, `Lesson ${lesson.id} each tier needs at least 3 commands`);
      tier.commands.forEach((c) => {
        assert.ok(c.code.trim() && c.whatItDoes.trim(), `Lesson ${lesson.id} command "${c.title}" needs code and explanation`);
        assert.ok(c.parts.length >= 1, `Lesson ${lesson.id} command "${c.title}" needs a piece-by-piece breakdown`);
      });
    }
  });
});

test('Lessons depth & dynamic SVG flowchart generation across all 35 lessons', () => {
  assert.equal(lessons.length, 35, 'Expected 35 comprehensive lessons across 16 modules');
  lessons.forEach((lesson) => {
    assert.ok(lesson.conceptSections.length >= 2, `Lesson ${lesson.id} must have multiple conceptSections`);
    assert.ok(lesson.codeExamples.length >= 1, `Lesson ${lesson.id} must have codeExamples`);
    assert.ok(lesson.knowledgeCheck.length >= 1, `Lesson ${lesson.id} must have knowledgeCheck questions`);

    const parentChapter = chapters.find((c) => c.id === lesson.chapterId);
    const flowchart = buildLessonFlowchartData(lesson, parentChapter);
    assert.equal(flowchart.stages.length, 4, `Lesson ${lesson.id} SVG flowchart must have 4 stages`);
    assert.ok(
      flowchart.objectBlueprint.members.length >= 4,
      `Lesson ${lesson.id} object blueprint must have at least 4 inspectable members`
    );

    const terms = extractPlainEnglishKeyTerms(lesson);
    assert.equal(terms.length, lesson.keyTerms.length, `Lesson ${lesson.id} must explain all keyTerms`);
  });
});

test('Interactive SVG Process Tree & Object Pipeline models validate lineage and stage filtering', () => {
  const normalNodes = getProcessTreeNodes('normal');
  assert.equal(normalNodes.length, 10, 'Normal Windows process tree should contain 10 core hierarchy nodes');

  const pwshLineage = getProcessLineageIds(normalNodes, 'proc-pwsh');
  assert.deepEqual(
    pwshLineage,
    ['proc-system', 'proc-smss', 'proc-winlogon', 'proc-explorer', 'proc-pwsh'],
    'pwsh.exe lineage must trace from System (PID 4) -> smss -> winlogon -> explorer -> pwsh'
  );

  const anomalyNodes = getProcessTreeNodes('anomaly');
  const suspiciousNodes = anomalyNodes.filter((n) => n.isSuspicious);
  assert.equal(suspiciousNodes.length, 3, 'Anomaly scenario should expose 3 suspicious process nodes');

  const stage0 = getPipelinePacketsForStage(0);
  const stage2 = getPipelinePacketsForStage(2);
  assert.equal(stage0.packets.length, 4, 'Stage 1 emits all 4 initial Process objects');
  assert.equal(stage2.packets.length, 3, 'Stage 3 retains the 3 surviving Process objects after filtering');

  const processLesson = lessons.find((l) => l.id === '1-2')!;
  const pipelineLesson = lessons.find((l) => l.id === '4-1')!;
  assert.equal(getRecommendedFlowchartTab(processLesson), 'processtree');
  assert.equal(getRecommendedFlowchartTab(pipelineLesson), 'pipeline');
});

test('Syntax bracket decoder explains optional, positional, and array parameters', () => {
  const rules = decodeSyntaxForBeginners('Get-Process [[-Name] <String[]>] [-FileVersionInfo]');
  assert.ok(rules.length >= 2, 'Should produce multiple syntax explanation rules');
});

test('Command reference: contains core cmdlets including Essential Pocketknife cmdlets', () => {
  assert.ok(commands.length >= 20, 'Expected at least 20 core commands');
  const essentials = commands.filter((c) => c.isEssentialPocketknife);
  assert.ok(essentials.length >= 4, 'Expected at least 4 Essential Pocketknife cmdlets');

  const helpCmd = commands.find((c) => c.name === 'Get-Help');
  assert.ok(helpCmd, 'Get-Help must be present in reference');
  assert.equal(helpCmd.isEssentialPocketknife, true, 'Get-Help must be marked isEssentialPocketknife');
});

test('Glossary: contains comprehensive definitions across all 7 categories', () => {
  assert.ok(glossary.length >= 25, 'Glossary should have at least 25 terms');
  const categories = new Set(glossary.map((g) => g.category));
  assert.ok(categories.has('Windows Internals'));
  assert.ok(categories.has('Core Concepts'));
  assert.ok(categories.has('Pipeline & Objects'));
  assert.ok(categories.has('Scripting & Functions'));
  assert.ok(categories.has('Administration & Remoting'));
  assert.ok(categories.has('Active Directory & Networking'));
  assert.ok(categories.has('Security & Ethical Hacking'));
});

test('Quiz integrity: all 72 questions have valid correctAnswer and explanation', () => {
  assert.ok(quizzes.length >= 72, 'Expected at least 72 quiz questions');
  quizzes.forEach((q) => {
    assert.ok(q.options.length >= 2, `Question ${q.id} has at least 2 options`);
    assert.ok(q.options.includes(q.correctAnswer), `Question ${q.id} correctAnswer must match one of its options`);
    assert.ok(q.explanation.length > 15, `Question ${q.id} has detailed explanation`);
  });
});

test('Zero academic slop, external institution mentions, or em dashes in data', () => {
  const combinedJson = JSON.stringify({ chapters, lessons, commands, glossary, quizzes }).toLowerCase();
  const forbiddenTerms = ['howest', 'pascal', '2627', 'institutional affiliation', 'syllabus pp', '—'];
  for (const term of forbiddenTerms) {
    assert.equal(
      combinedJson.includes(term),
      false,
      `Data must not contain forbidden term: "${term}"`
    );
  }
});

test('Link integrity: every hard-coded /learn/... path resolves to a real chapter or lesson', () => {
  const valid = new Set<string>();
  chapters.forEach((c) => valid.add(`/learn/${c.slug}`));
  lessons.forEach((l) => valid.add(`/learn/${l.chapterId}/${l.slug}`));

  const broken: string[] = [];
  for (const file of collectCodeFiles(path.join(process.cwd(), 'src'))) {
    const content = fs.readFileSync(file, 'utf8');
    for (const m of content.matchAll(/['"`](\/learn\/[a-z0-9-]+(?:\/[a-z0-9-]+)?)['"`]/g)) {
      if (!valid.has(m[1])) broken.push(`${path.relative(process.cwd(), file)}: ${m[1]}`);
    }
  }
  assert.deepEqual(broken, [], `Broken lesson links found:\n${broken.join('\n')}`);
});

test('Chapter lesson refs match real lesson ids and slugs', () => {
  chapters.forEach((c) =>
    c.lessons.forEach((ref) => {
      const real = lessons.find((l) => l.id === ref.id);
      assert.ok(real, `Chapter ${c.id} references missing lesson ${ref.id}`);
      assert.equal(real!.slug, ref.slug, `Lesson ${ref.id} slug mismatch`);
      assert.equal(real!.chapterId, c.id, `Lesson ${ref.id} chapter mismatch`);
    })
  );
});

test('Teaching layer: every lesson has complete expert-teacher scaffolding', () => {
  for (const lesson of lessons) {
    const t = TEACHING[lesson.id];
    assert.ok(t, `Lesson ${lesson.id} must have teaching content`);
    assert.ok(t.hook.length > 20, `${lesson.id} needs a curiosity hook`);
    assert.ok(t.mentalModel.length > 40, `${lesson.id} needs a mental model`);
    assert.ok(t.misconceptions.length >= 3, `${lesson.id} needs 3 misconceptions`);
    assert.ok(t.workedExample.steps.length >= 4, `${lesson.id} needs a worked example of 4+ steps`);
    assert.ok(t.checkpoints.length >= 3, `${lesson.id} needs 3 checkpoints`);
    assert.ok(t.challenge.hints.length >= 3 && t.challenge.solution.length > 5, `${lesson.id} needs a hinted challenge`);
    assert.ok(t.teachBack.length > 20, `${lesson.id} needs a teach-back prompt`);
    assert.ok(t.diagrams.length >= 1, `${lesson.id} needs at least one concept diagram`);
    for (const m of t.misconceptions) assert.ok(m.myth && m.truth && m.test, `${lesson.id} misconception is incomplete`);
    for (const s of t.workedExample.steps) assert.ok(s.think && s.action, `${lesson.id} worked example step is incomplete`);
  }
  assert.equal(Object.keys(TEACHING).length, lessons.length, 'No teaching entries for unknown lessons');
  assert.ok(countConceptDiagrams() >= lessons.length, 'Expected at least one diagram per lesson');
});

test('Concept diagrams are structurally valid so the renderers never break', () => {
  for (const [id, t] of Object.entries(TEACHING)) {
    for (const d of t.diagrams) {
      const where = `${id} "${d.title}"`;
      assert.ok(d.title && d.caption, `${where} needs a title and caption`);
      if (d.kind === 'layers') {
        assert.ok(d.layers.length >= 3, `${where} needs 3+ layers`);
        assert.ok(d.traceLabel.length > 0, `${where} needs a trace label`);
        for (const i of d.tracePath ?? []) assert.ok(i >= 0 && i < d.layers.length, `${where} tracePath index ${i} out of range`);
      } else if (d.kind === 'sequence') {
        assert.ok(d.actors.length >= 2 && d.messages.length >= 3, `${where} needs 2+ actors and 3+ messages`);
        for (const m of d.messages) {
          assert.ok(m.from >= 0 && m.from < d.actors.length, `${where} message from index out of range`);
          assert.ok(m.to >= 0 && m.to < d.actors.length, `${where} message to index out of range`);
        }
      } else if (d.kind === 'compare') {
        assert.ok(d.left.rows.length >= 2 && d.right.rows.length >= 2, `${where} needs 2+ rows per side`);
        assert.ok(d.verdict.length > 10, `${where} needs a verdict`);
      } else {
        const countNodes = (n: { children?: unknown[] }): number =>
          1 + (n.children ?? []).reduce<number>((sum, c) => sum + countNodes(c as { children?: unknown[] }), 0);
        assert.ok(countNodes(d.root) >= 3, `${where} needs 3+ nodes`);
      }
    }
  }
});

test('Teaching content has no em dashes or forbidden terms', () => {
  const json = JSON.stringify(TEACHING).toLowerCase();
  for (const term of ['howest', 'pascal', '2627', '—']) {
    assert.equal(json.includes(term), false, `Teaching data must not contain: "${term}"`);
  }
});

test('Theme registry offers Claymorphism and Atlas with distinct fonts', () => {
  assert.deepEqual(THEMES.map((t) => t.id), ['clay', 'atlas']);
  assert.notEqual(THEMES[0].fonts, THEMES[1].fonts);
  assert.equal(readStoredTheme(), 'clay', 'Claymorphism stays the default theme');
});
