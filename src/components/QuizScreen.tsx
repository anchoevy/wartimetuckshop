/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, ArrowRight, Eye } from 'lucide-react';
import { Question } from '../types';

interface QuizScreenProps {
  currentQuestion: number;
  totalQuestions: number;
  question: Question;
  selectedOption: number | undefined;
  onSelectOption: (idx: number) => void;
  onPrev: () => void;
  onNext: () => void;
  onSubmit: () => void;
}

export default function QuizScreen({
  currentQuestion,
  totalQuestions,
  question,
  selectedOption,
  onSelectOption,
  onPrev,
  onNext,
  onSubmit,
}: QuizScreenProps) {
  const letters = ['A', 'B', 'C', 'D'];
  const progressPercentage = ((currentQuestion + 1) / totalQuestions) * 100;

  const isFirst = currentQuestion === 0;
  const isLast = currentQuestion === totalQuestions - 1;
  const hasSelected = selectedOption !== undefined;

  return (
    <div className="w-full">
      {/* Progress Section */}
      <div className="flex items-center gap-4 mb-8">
        <div className="flex-1 h-1.5 bg-paper-dark rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-accent"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <span className="text-xs font-mono tracking-widest text-ink-faded uppercase whitespace-nowrap">
          Question {currentQuestion + 1} of {totalQuestions}
        </span>
      </div>

      {/* Slide Animation for changing questions */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="flex flex-col gap-4"
        >
          {/* Question Prompt */}
          <h2 className="font-display text-base md:text-xl font-bold leading-normal text-ink mb-4">
            {question.question}
          </h2>

          {/* Options Grid */}
          <div className="flex flex-col gap-3.5 mb-6">
            {question.options.map((optionText, idx) => {
              const isSelected = selectedOption === idx;
              return (
                <button
                  key={idx}
                  onClick={() => onSelectOption(idx)}
                  className={`group flex items-start text-left gap-4 p-4 border rounded-xs cursor-pointer transition-all duration-200 outline-none ${
                    isSelected
                      ? 'bg-ink border-ink text-cream shadow-md'
                      : 'bg-cream border-border hover:bg-paper/40 hover:border-ink-faded text-ink'
                  }`}
                >
                  {/* Option Badge */}
                  <span
                    className={`flex items-center justify-center w-6 h-6 mt-0.5 text-xs font-display font-bold border-2 rounded-xs select-none flex-shrink-0 transition-colors duration-200 ${
                      isSelected
                        ? 'border-cream text-cream'
                        : 'border-border text-ink-faded group-hover:border-ink-faded group-hover:text-ink'
                    }`}
                  >
                    {letters[idx]}
                  </span>

                  <span className="text-sm md:text-base font-serif leading-relaxed font-normal">
                    {optionText}
                  </span>
                </button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Control Buttons */}
      <div className="flex justify-between items-center pt-4 border-t border-border/50">
        <div>
          {!isFirst && (
            <button
              onClick={onPrev}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-serif text-ink-faded border border-border bg-transparent rounded-xs cursor-pointer hover:bg-paper-dark hover:text-ink transition-colors duration-200"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back
            </button>
          )}
        </div>

        <div>
          {isLast ? (
            <button
              onClick={onSubmit}
              disabled={!hasSelected}
              className={`inline-flex items-center gap-2 px-6 py-3 font-serif text-sm font-semibold tracking-wide text-cream bg-accent border-2 border-accent rounded-xs cursor-pointer shadow-md hover:bg-accent/90 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-150 active:translate-y-0 ${
                !hasSelected ? 'opacity-40 cursor-not-allowed pointer-events-none' : ''
              }`}
            >
              <Eye className="w-4 h-4 animate-bounce" />
              See My Result
            </button>
          ) : (
            <button
              onClick={onNext}
              disabled={!hasSelected}
              className={`inline-flex items-center gap-1.5 px-6 py-3 font-serif text-sm font-semibold tracking-wide text-cream bg-ink border-2 border-ink rounded-xs cursor-pointer shadow-md hover:bg-accent hover:border-accent hover:shadow-lg hover:-translate-y-0.5 transition-all duration-150 active:translate-y-0 ${
                !hasSelected ? 'opacity-40 cursor-not-allowed pointer-events-none' : ''
              }`}
            >
              Next Question
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
