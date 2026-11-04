import React, { useState } from 'react';
import { TabList, tabPanelProps } from '../common/TabList';

export interface LoopMove {
  id: string;
  verb: string;
  title: string;
  body: string;
  Artifact: React.FC;
}

const Quote: React.FC<{ text: string; source: string }> = ({ text, source }) => (
  <figure className="space-y-3">
    <blockquote className="text-[1.15rem] leading-snug font-semibold">{text}</blockquote>
    <figcaption className="font-mono text-[0.75rem] text-[var(--dp-color-ink-secondary)]">{source}</figcaption>
  </figure>
);

const PictureIt: React.FC = () => (
  <Quote
    text="A pipeline is a conveyor belt of objects. Each machine inspects the object, maybe changes it, then hands the same object on."
    source="Real-life analogy, opening of lesson 5-1"
  />
);

const SayIt: React.FC = () => (
  <dl className="space-y-3">
    {[
      ['NTDLL.DLL', 'The bridge every program crosses to ask the kernel for help.'],
      ['Pipeline', 'A conveyor belt that carries whole objects, not text.'],
      ['Parameter binding', 'How PowerShell decides which slot an incoming object fits.'],
    ].map(([term, meaning]) => (
      <div key={term} className="grid gap-1 sm:grid-cols-[10rem_1fr] sm:gap-4">
        <dt className="font-mono text-[0.8rem] font-semibold text-[var(--dp-color-accent)]">{term}</dt>
        <dd className="text-[0.92rem] text-[var(--dp-color-ink-secondary)]">{meaning}</dd>
      </div>
    ))}
  </dl>
);

const LADDER = [
  { tier: 'Beginner', code: 'Get-Service | Select-Object -First 5' },
  { tier: 'Intermediate', code: "Get-Service | Where-Object Status -eq 'Running' | Sort-Object DisplayName" },
  { tier: 'Pro', code: 'Get-Service | Group-Object StartType | Select-Object Name, Count' },
];

const RunIt: React.FC = () => {
  const [tier, setTier] = useState(0);
  return (
    <div className="space-y-3">
      <TabList
        idPrefix="loop-tier"
        label="Difficulty tier"
        className="flex gap-2"
        tabs={LADDER.map((step, i) => ({ id: String(i), label: step.tier }))}
        activeId={String(tier)}
        onChange={(id) => setTier(Number(id))}
        tabClassName={(active) => `px-3 py-1.5 text-[0.8125rem] cursor-pointer ${active ? 'clay-btn-pink' : 'clay-btn-secondary'}`}
      />
      <pre {...tabPanelProps('loop-tier', String(tier))} className="clay-terminal p-4 text-[0.82rem] overflow-x-auto whitespace-pre-wrap font-mono" key={tier}>
        <span className="text-[#7aa2ff]">PS&gt; </span>
        {LADDER[tier].code}
      </pre>
    </div>
  );
};

const BreakIt: React.FC = () => (
  <div className="space-y-3 text-[0.9rem]">
    <pre className="clay-terminal p-4 font-mono text-[0.82rem] overflow-x-auto">
      <span className="text-[#7aa2ff]">PS&gt; </span>
      {'Get-Process | Where-Object { $_.WorkingSet > 100MB }'}
    </pre>
    <p className="text-[var(--dp-color-ink-secondary)]">
      Nothing prints, and a strange file named <code className="clay-code-inline">100MB</code> appears. In PowerShell{' '}
      <code className="clay-code-inline">&gt;</code> redirects output to a file. The comparison operator is{' '}
      <code className="clay-code-inline">-gt</code>.
    </p>
  </div>
);

const ProveIt: React.FC = () => {
  const [picked, setPicked] = useState<number | null>(null);
  const options = ['Compares two numbers', 'Redirects output into a file', 'Sends objects down the pipeline'];
  return (
    <div className="space-y-3">
      <p className="font-semibold">In PowerShell, what does the &gt; symbol do?</p>
      <div className="grid gap-2">
        {options.map((option, i) => (
          <button
            key={option}
            type="button"
            onClick={() => setPicked(i)}
            className={`clay-well px-3 py-2.5 text-left text-[0.88rem] cursor-pointer ${
              picked === i ? (i === 1 ? 'ring-2 ring-[var(--hx-good)]' : 'ring-2 ring-[var(--hx-bad)]') : ''
            }`}
          >
            {option}
          </button>
        ))}
      </div>
      {picked !== null && (
        <p className="text-[0.85rem]" role="status">
          {picked === 1
            ? 'Correct. Use -gt for greater than. Retrieving an answer teaches more than rereading it.'
            : 'Not quite. The > symbol redirects output into a file. Try again.'}
        </p>
      )}
    </div>
  );
};

export const LOOP_MOVES: LoopMove[] = [
  {
    id: 'picture',
    verb: 'Picture it',
    title: 'See the idea before the syntax',
    body: 'Every lesson opens with a real-life analogy and a diagram, so the concept has a shape before you meet a single command.',
    Artifact: PictureIt,
  },
  {
    id: 'say',
    verb: 'Say it',
    title: 'Plain English first, jargon second',
    body: 'Each new term is defined in one sentence you could say out loud to a friend. Acronyms are never left unexplained.',
    Artifact: SayIt,
  },
  {
    id: 'run',
    verb: 'Run it',
    title: 'A ladder from safe to professional',
    body: 'Commands climb from read-only beginner steps to production-grade pro moves, with every part of the command explained.',
    Artifact: RunIt,
  },
  {
    id: 'break',
    verb: 'Break it',
    title: 'Meet the traps on purpose',
    body: 'You break real commands in labs and learn why they fail. The mistakes that cost admins hours become things you spot instantly.',
    Artifact: BreakIt,
  },
  {
    id: 'prove',
    verb: 'Prove it',
    title: 'Retrieval beats rereading',
    body: 'Checkpoint questions, a hands-on challenge and a teach-back prompt make you produce the answer, which is what makes it stick.',
    Artifact: ProveIt,
  },
];
