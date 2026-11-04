export interface SubtopicRef {
  id: string;
  slug: string;
  title: string;
  description: string;
  estimatedMinutes: number;
}

export type TrackCategory =
  | 'Windows Internals'
  | 'Advanced Object Pipeline'
  | 'Systems & Fleet Automation'
  | 'PowerShell for Ethical Hackers';

export interface Chapter {
  id: string;
  number: number;
  slug: string;
  track: TrackCategory;
  title: string;
  subtitle: string;
  description: string;
  estimatedMinutes: number;
  prerequisites: string[];
  learningObjectives: string[];
  relatedCmdlets: string[];
  lessons: SubtopicRef[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Master';
  accentColor: string;
}

export interface CommandPart {
  code: string;
  label: string;
  colorClass: string;
}

export interface CodeExample {
  title: string;
  description: string;
  code: string;
  output?: string;
  illustrativeOutput?: string;
  explanation?: string;
}

export interface CommonMistake {
  mistake: string;
  consequence?: string;
  cause?: string;
  fix: string;
}

export interface CalloutNote {
  type: 'key' | 'try' | 'gotcha' | 'danger' | 'pro';
  title: string;
  body: string;
  content?: string;
}

export type InteractiveWidgetId =
  | 'syscall-animator'
  | 'malware-process-hunter'
  | 'mbr-byte-inspector'
  | 'virtual-memory-pager'
  | 'system-processes-stepper'
  | 'pipeline-visualizer'
  | 'object-anatomy'
  | 'cmdlet-anatomy-svg'
  | 'core-network-svg'
  | 'offensive-killchain-svg';

export interface FlowchartStageNode {
  id: string;
  stepNumber: number;
  label: string;
  sublabel: string;
  commandOrMechanism: string;
  inputType: string;
  outputType: string;
  plainEnglishSummary: string;
  kind: 'source' | 'transform' | 'filter' | 'security' | 'output';
}

export interface ObjectStructureMember {
  name: string;
  kind: 'property' | 'method' | 'noteproperty';
  dataType: string;
  sampleValue: string;
  plainEnglish: string;
}

export interface ObjectStructureBlueprint {
  typeName: string;
  friendlyTitle: string;
  layerOrNamespace: string;
  plainEnglishOverview: string;
  members: ObjectStructureMember[];
}

export interface LessonFlowchartData {
  pipelineTitle: string;
  pipelineSubtitle: string;
  stages: FlowchartStageNode[];
  objectBlueprint: ObjectStructureBlueprint;
}

export interface LessonConceptSection {
  heading: string;
  body: string[];
}

export interface LessonCommandBreakdown {
  cmdlet: string;
  aliases: string[];
  syntax: string;
  parameters: {
    name: string;
    type: string;
    description: string;
  }[];
  examples: string[];
}

export interface LessonMistake {
  mistake: string;
  cause: string;
  fix: string;
}

export interface LessonKnowledgeCheck {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface GuideCommandPart {
  part: string;
  meaning: string;
}

export interface GuideCommand {
  title: string;
  code: string;
  whatItDoes: string;
  parts: GuideCommandPart[];
  sampleOutput?: string;
  watchOut?: string;
}

export interface GuideTier {
  intro: string;
  commands: GuideCommand[];
}

export interface GuideStep {
  title: string;
  detail: string;
}

export interface GuideWord {
  word: string;
  meaning: string;
}

export interface LessonGuide {
  analogy: string;
  plainEnglish: string[];
  beforeYouStart: string[];
  atoZSteps: GuideStep[];
  wordsYouWillMeet: GuideWord[];
  beginner: GuideTier;
  intermediate: GuideTier;
  pro: GuideTier;
  recap: string[];
}

export interface Lesson {
  id: string;
  chapterId: string;
  slug: string;
  title: string;
  subtitle: string;
  estimatedMinutes: number;
  diagramId?: InteractiveWidgetId;
  secondaryDiagramId?: InteractiveWidgetId;
  oneSentenceSummary: string;
  summary: string;
  whyItMatters: string;
  learningObjectives: string[];
  keyTerms: string[];
  conceptSections: LessonConceptSection[];
  calloutNotes: CalloutNote[];
  commandBreakdowns: LessonCommandBreakdown[];
  codeExamples: CodeExample[];
  mistakesAndTraps: LessonMistake[];
  tryItYourself: string[];
  knowledgeCheck: LessonKnowledgeCheck[];
  guide?: LessonGuide;
}

export interface CommandParameter {
  name: string;
  type: string;
  required: boolean;
  position?: number;
  pipelineInput: 'ByValue' | 'ByPropertyName' | 'ByValue, ByPropertyName' | 'Both' | 'False';
  description: string;
}

export interface CommandEntry {
  name: string;
  verb: string;
  noun: string;
  module: string;
  purpose: string;
  syntax: string;
  description: string;
  parameters: CommandParameter[];
  practicalExamples: CodeExample[];
  commonMistakes: string[];
  troubleshooting: string;
  relatedCommands: string[];
  relatedLessonPath: string;
  isEssentialPocketknife: boolean;
}

export type GlossaryCategory =
  | 'Windows Internals'
  | 'Core Concepts'
  | 'Pipeline & Objects'
  | 'Scripting & Functions'
  | 'Administration & Remoting'
  | 'Active Directory & Networking'
  | 'Security & Ethical Hacking'
  | 'Fundamentals'
  | 'Objects & Pipeline'
  | 'Architecture & Remoting'
  | 'Active Directory'
  | 'Scripting & Toolmaking';

export interface GlossaryItem {
  id?: string;
  term: string;
  category: GlossaryCategory;
  definition: string;
  detailedExplanation?: string;
  example?: string;
  codeExample?: string;
  relatedTerms: string[];
  relatedLessonPath?: string;
}

export interface QuizQuestion {
  id: string;
  chapterId: string;
  type: 'multiple-choice' | 'command-completion' | 'output-interpretation' | 'scenario';
  question: string;
  codeSnippet?: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  relatedLessonPath?: string;
}
