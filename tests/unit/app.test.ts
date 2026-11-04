import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { chapters } from '../../src/data/chapters';
import { lessons } from '../../src/data/lessons';
import { commands } from '../../src/data/commands';
import { glossary } from '../../src/data/glossary';
import { quizzes } from '../../src/data/quizzes';
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

test('Quiz integrity: all 30 questions have valid correctAnswer and explanation', () => {
  assert.ok(quizzes.length >= 30, 'Expected at least 30 quiz questions');
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
