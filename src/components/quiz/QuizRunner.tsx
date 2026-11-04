import React, { useState } from 'react';
import { quizzes } from '../../data/quizzes';
import { chapters } from '../../data/chapters';
import { QuizQuestion } from '../../types';
import { Terminal } from 'lucide-react';
import { QuizResultsCard } from './QuizResultsCard';
import { QuizQuestionCard } from './QuizQuestionCard';

interface QuizRunnerProps {
  questions?: QuizQuestion[];
  title?: string;
  subtitle?: string;
}

const TYPE_LABELS: Record<string, string> = {
  all: 'All Questions',
  'multiple-choice': 'Architecture & Concepts',
  'command-completion': 'Cmdlet Syntax',
  'output-interpretation': 'Output Analysis',
  scenario: 'Real-World Scenarios',
};

export const QuizRunner: React.FC<QuizRunnerProps> = ({
  questions = quizzes,
  title = 'Interactive Mastery Drills',
  subtitle,
}) => {
  const [selectedType, setSelectedType] = useState<string>('all');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  const availableTypes = [
    'all',
    ...Array.from(new Set(questions.map((q) => q.type))),
  ];
  const filteredQuestions =
    selectedType === 'all'
      ? questions
      : questions.filter((q) => q.type === selectedType);
  const activeQuestion = filteredQuestions[currentIndex];
  const parentChapter = activeQuestion
    ? chapters.find((c) => c.id === activeQuestion.chapterId)
    : undefined;

  const resetState = (type = selectedType) => {
    setSelectedType(type);
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsSubmitted(false);
    setScore(0);
    setCompleted(false);
  };

  const handleSubmit = () => {
    if (selectedOption === null || !activeQuestion) return;
    setIsSubmitted(true);
    if (selectedOption === activeQuestion.correctAnswer) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < filteredQuestions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsSubmitted(false);
    } else {
      setCompleted(true);
    }
  };

  if (!activeQuestion) return null;

  return (
    <div className="clay-tray p-6 sm:p-9">
      <div className="pb-6 mb-7 border-b border-[rgba(56,49,57,0.1)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--dp-color-surface-compare)] text-[var(--dp-color-ink)] text-[0.75rem] font-extrabold uppercase tracking-wider mb-2">
            <Terminal className="w-3.5 h-3.5" />
            {title}
          </div>
          <h3 className="text-[1.45rem] font-extrabold text-[var(--dp-color-ink)] tracking-tight">
            {subtitle ||
              `Test Your Understanding (${filteredQuestions.length} Questions)`}
          </h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {availableTypes.map((t) => (
            <button
              key={t}
              type="button"
              aria-pressed={selectedType === t}
              onClick={() => resetState(t)}
              className={`px-3.5 py-2 min-h-11 rounded-full text-[0.8125rem] font-extrabold transition-all cursor-pointer ${
                selectedType === t
                  ? 'clay-btn-pink text-[var(--dp-color-ink)]'
                  : 'clay-well text-[var(--dp-color-ink-secondary)] hover:text-[var(--dp-color-ink)]'
              }`}
            >
              {TYPE_LABELS[t] || t}
            </button>
          ))}
        </div>
      </div>

      {completed ? (
        <QuizResultsCard
          score={score}
          total={filteredQuestions.length}
          onRestart={() => resetState()}
        />
      ) : (
        <QuizQuestionCard
          activeQuestion={activeQuestion}
          parentChapter={parentChapter}
          typeLabel={TYPE_LABELS[activeQuestion.type] || activeQuestion.type}
          currentIndex={currentIndex}
          totalQuestions={filteredQuestions.length}
          score={score}
          selectedOption={selectedOption}
          isSubmitted={isSubmitted}
          onSelectOption={setSelectedOption}
          onSubmit={handleSubmit}
          onNext={handleNext}
          onRestart={() => resetState()}
        />
      )}
    </div>
  );
};
