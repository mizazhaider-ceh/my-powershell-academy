import React, { useState } from 'react';
import { Zap, CheckCircle2, RotateCw } from 'lucide-react';

interface SpeedCard {
  id: string;
  pipeline: string;
  question: string;
  correctType: string;
  choices: string[];
  explanation: string;
}

const SPEED_CARDS: SpeedCard[] = [
  {
    id: 'card-1',
    pipeline: 'Get-Service -Name WinRM',
    question: 'What exact .NET object type flows out of this command?',
    correctType: '[System.ServiceProcess.ServiceController]',
    choices: [
      '[System.ServiceProcess.ServiceController]',
      '[System.Diagnostics.Process]',
      '[System.String]',
    ],
    explanation:
      'Get-Service always emits live System.ServiceProcess.ServiceController objects with .Status, .Name, and .Stop() / .Start() methods.',
  },
  {
    id: 'card-2',
    pipeline: 'Get-Process | Format-Table -AutoSize',
    question: 'What flows out of Format-Table if you pipe it to another cmdlet?',
    correctType: '[Microsoft.PowerShell.Commands.Internal.Format.*]',
    choices: [
      '[System.Diagnostics.Process]',
      '[Microsoft.PowerShell.Commands.Internal.Format.*]',
      '[PSCustomObject]',
    ],
    explanation:
      'Format-Table destroys the original Process objects and emits internal formatting layout directives meant only for screen display.',
  },
  {
    id: 'card-3',
    pipeline: '(Get-Date).GetType().FullName',
    question: 'What .NET structure does Get-Date return?',
    correctType: '[System.DateTime]',
    choices: ['[System.String]', '[System.DateTime]', '[System.TimeSpan]'],
    explanation:
      'Get-Date emits a rich [System.DateTime] struct with methods like .AddDays(), .AddHours(), and properties like .DayOfWeek.',
  },
  {
    id: 'card-4',
    pipeline: 'Get-ChildItem C:\\Windows -File',
    question: 'What .NET object type represents each file in the FileSystem provider?',
    correctType: '[System.IO.FileInfo]',
    choices: [
      '[System.IO.FileInfo]',
      '[System.IO.DirectoryInfo]',
      '[System.String]',
    ],
    explanation:
      'Files are emitted as [System.IO.FileInfo] (with .Length, .Extension, .LastWriteTime), while folders are [System.IO.DirectoryInfo].',
  },
];

export const FlashcardSpeedDrills: React.FC = () => {
  const [cardIdx, setCardIdx] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);

  const card = SPEED_CARDS[cardIdx];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 text-[0.75rem] font-mono font-extrabold uppercase tracking-wider text-[var(--dp-color-accent)]">
            <Zap className="w-4 h-4" />
            <span>Active Recall Flashcards · Guess the .NET OutputType</span>
          </div>
          <h3 className="text-[1.375rem] font-extrabold text-[var(--dp-color-ink)]">
            What Object Is in the Pipe?
          </h3>
        </div>

        <button
          type="button"
          onClick={() => {
            setCardIdx((prev) => (prev + 1) % SPEED_CARDS.length);
            setPicked(null);
          }}
          className="clay-btn-secondary px-4 py-2 text-[0.8125rem] font-extrabold inline-flex items-center gap-2 cursor-pointer self-start sm:self-center"
        >
          <RotateCw className="w-3.5 h-3.5" />
          <span>
            Next Card ({cardIdx + 1}/{SPEED_CARDS.length})
          </span>
        </button>
      </div>

      <div className="clay-well p-6 space-y-5">
        <div className="p-4 rounded-[1.25rem] clay-terminal font-mono text-[0.9rem] text-[#fde68a] font-bold">
          PS C:\&gt; {card.pipeline} | Get-Member
        </div>

        <p className="text-[1rem] font-extrabold">{card.question}</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {card.choices.map((ch) => {
            const isSelected = picked === ch;
            const isRight = ch === card.correctType;
            return (
              <button
                key={ch}
                type="button"
                onClick={() => setPicked(ch)}
                className={`p-4 rounded-[1.25rem] font-mono text-[0.8125rem] font-extrabold text-left cursor-pointer transition-all ${
                  isSelected
                    ? isRight
                      ? 'clay-cushion-mint'
                      : 'clay-cushion-warm'
                    : 'clay-card'
                }`}
              >
                {ch}
              </button>
            );
          })}
        </div>

        {picked && (
          <div
            className={`p-4 rounded-[1.25rem] text-[0.9rem] font-medium flex items-start gap-2.5 ${
              picked === card.correctType
                ? 'clay-cushion-mint'
                : 'clay-cushion-warm'
            }`}
          >
            <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
            <span>{card.explanation}</span>
          </div>
        )}
      </div>
    </div>
  );
};
