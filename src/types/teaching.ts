/**
 * Teaching layer: expert-teacher scaffolding that sits on top of every lesson.
 * Content lives in src/data/teaching; renderers live in src/components/lesson and
 * src/components/diagrams/concepts.
 */

export type DiagramTone = 'blue' | 'cyan' | 'green' | 'amber' | 'violet' | 'red';

/** A vertical stack of layers (architecture, privilege rings, protocol stacks). */
export interface LayerDiagram {
  kind: 'layers';
  title: string;
  caption: string;
  /** Layers are listed top to bottom. */
  layers: { label: string; sub: string; detail: string; tone: DiagramTone }[];
  /** Label for the animated trace button, for example "Trace a file save". */
  traceLabel: string;
  /** Optional order (indexes into layers) the trace visits. Defaults to top to bottom. */
  tracePath?: number[];
}

/** Who talks to whom, in order (remoting, authentication, syscalls). */
export interface SequenceDiagram {
  kind: 'sequence';
  title: string;
  caption: string;
  actors: { name: string; sub?: string; tone: DiagramTone }[];
  /** from and to are indexes into actors. from === to renders a self step. */
  messages: { from: number; to: number; label: string; detail: string }[];
}

/** Two approaches side by side (before and after, wrong and right, 5.1 and 7). */
export interface CompareDiagram {
  kind: 'compare';
  title: string;
  caption: string;
  left: { heading: string; tone: DiagramTone; rows: { label: string; value: string }[] };
  right: { heading: string; tone: DiagramTone; rows: { label: string; value: string }[] };
  verdict: string;
}

export interface TreeDiagramNode {
  label: string;
  sub?: string;
  detail: string;
  tone?: DiagramTone;
  children?: TreeDiagramNode[];
}

/** A hierarchy (Active Directory, process trees, registry, GPO inheritance). */
export interface TreeDiagram {
  kind: 'tree';
  title: string;
  caption: string;
  root: TreeDiagramNode;
}

export type ConceptDiagram = LayerDiagram | SequenceDiagram | CompareDiagram | TreeDiagram;

export interface TeachingMisconception {
  /** The wrong belief, written the way a learner would say it. */
  myth: string;
  /** The corrected understanding. */
  truth: string;
  /** A short command or observation the learner can run to see the truth. */
  test: string;
}

export interface TeachingStep {
  /** The reasoning an expert does in their head before acting. */
  think: string;
  /** The exact thing to type or do. */
  action: string;
  /** What the learner should see, when there is something to see. */
  result?: string;
}

export interface TeachingCheckpoint {
  question: string;
  hint: string;
  answer: string;
}

export interface TeachingChallenge {
  brief: string;
  /** Progressive hints, from gentle nudge to near-giveaway. */
  hints: string[];
  solution: string;
  /** Why the solution works, in plain English. */
  why: string;
}

export interface LessonTeaching {
  /** An opening question that makes the learner curious before any explanation. */
  hook: string;
  /** The single picture to hold in your head for the whole lesson. */
  mentalModel: string;
  misconceptions: TeachingMisconception[];
  workedExample: { goal: string; steps: TeachingStep[]; takeaway: string };
  checkpoints: TeachingCheckpoint[];
  challenge: TeachingChallenge;
  /** A Feynman-style prompt: explain it back in your own words. */
  teachBack: string;
  diagrams: ConceptDiagram[];
}

export type TeachingMap = Record<string, LessonTeaching>;
