export interface DemoProc {
  name: string;
  cpu: number;
  ws: number;
}

export type RowState = 'in' | 'dim' | 'gone' | 'hit';

export interface RowLayout {
  y: number;
  state: RowState;
}

export interface DemoStage {
  segment: string;
  count: number;
  note: string;
}

/** The objects Get-Process "emits". Real properties, not lines of text. */
export const DEMO_PROCS: DemoProc[] = [
  { name: 'msedge', cpu: 38, ws: 412 },
  { name: 'Code', cpu: 154, ws: 688 },
  { name: 'svchost', cpu: 12, ws: 64 },
  { name: 'chrome', cpu: 212, ws: 951 },
  { name: 'pwsh', cpu: 71, ws: 148 },
  { name: 'notepad', cpu: 3, ws: 22 },
  { name: 'Teams', cpu: 131, ws: 530 },
  { name: 'explorer', cpu: 64, ws: 190 },
];

export const CPU_THRESHOLD = 50;
export const TOP_COUNT = 3;

export const DEMO_STAGES: DemoStage[] = [
  {
    segment: 'Get-Process',
    count: 8,
    note: 'Get-Process emits 8 live process objects. Each one carries properties like Name, CPU and WorkingSet, not a line of text.',
  },
  {
    segment: `Where-Object CPU -gt ${CPU_THRESHOLD}`,
    count: 5,
    note: `Where-Object tests each object. Only the ones whose CPU property is greater than ${CPU_THRESHOLD} get through.`,
  },
  {
    segment: 'Sort-Object CPU -Descending',
    count: 5,
    note: 'Sort-Object reorders the survivors by that same property, highest first. No text parsing needed.',
  },
  {
    segment: `Select-Object -First ${TOP_COUNT}`,
    count: 3,
    note: `Select-Object -First ${TOP_COUNT} keeps the top ${TOP_COUNT} and drops the rest. That is the whole answer.`,
  },
];

/** Where every object sits, and how it looks, at each pipeline phase (0 to 3). */
export function layoutForPhase(phase: number): RowLayout[] {
  const passing = DEMO_PROCS.map((p, i) => ({ p, i })).filter(({ p }) => p.cpu > CPU_THRESHOLD);
  const ranked = [...passing].sort((a, b) => b.p.cpu - a.p.cpu);
  const failing = DEMO_PROCS.map((p, i) => ({ p, i })).filter(({ p }) => p.cpu <= CPU_THRESHOLD);

  // Once rows drop out, centre the survivors in the table so the result reads as deliberate.
  const visible = phase === 2 ? passing.length : phase === 3 ? TOP_COUNT : DEMO_PROCS.length;
  const offset = phase >= 2 ? (DEMO_PROCS.length - visible) / 2 : 0;

  return DEMO_PROCS.map((proc, index) => {
    const passes = proc.cpu > CPU_THRESHOLD;
    const rank = ranked.findIndex((r) => r.i === index);
    const failRank = failing.findIndex((f) => f.i === index);

    if (phase === 0) return { y: index, state: 'in' };
    if (phase === 1) return { y: index, state: passes ? 'in' : 'dim' };
    if (phase === 2) return passes ? { y: rank + offset, state: 'in' } : { y: passing.length + failRank, state: 'gone' };
    if (!passes) return { y: passing.length + failRank, state: 'gone' };
    return { y: rank + offset, state: rank < TOP_COUNT ? 'hit' : 'gone' };
  });
}
