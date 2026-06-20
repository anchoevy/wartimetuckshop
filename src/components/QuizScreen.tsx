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
      <div className="flex items-center justify-between gap-4 mb-5 sm:mb-8">
        <div className="flex-1 max-w-[120px] xs:max-w-[160px] h-2 bg-paper-dark/60 rounded-xs overflow-hidden">
          <motion.div
            className="h-full bg-accent"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <span className="text-[10px] sm:text-xs font-mono tracking-[0.2em] text-ink-faded uppercase whitespace-nowrap">
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
          className="flex flex-col gap-3.5"
        >
          {/* Question Prompt - Highly readable bold journal serif */}
          <h2 className="font-serif text-[17px] xs:text-[19px] sm:text-2xl font-extrabold leading-relaxed text-ink mb-4 sm:mb-6 text-left">
            {question.question}
          </h2>

          {/* Options Grid */}
          <div className="flex flex-col gap-3 mb-5 sm:mb-7">
            {question.options.map((optionText, idx) => {
              const isSelected = selectedOption === idx;
              return (
                <button
                  key={idx}
                  onClick={() => onSelectOption(idx)}
                  className={`group flex items-center text-left gap-4 p-3.5 sm:p-4.5 border-2 rounded-xs cursor-pointer transition-all duration-200 outline-none w-full ${
                    isSelected
                      ? 'bg-ink border-ink text-cream shadow-md'
                      : 'bg-[#faf5eb] border-[#d4c3a3]/60 hover:bg-paper/40 hover:border-accent text-ink'
                  }`}
                >
                  {/* Option Badge */}
                  <span
                    className={`flex items-center justify-center w-7 h-7 text-xs font-serif font-bold border rounded-xs select-none flex-shrink-0 transition-colors duration-200 ${
                      isSelected
                        ? 'border-cream text-cream bg-transparent'
                        : 'border-[#d4c3a3] text-sepia bg-[#faf5eb] group-hover:border-accent group-hover:text-accent'
                    }`}
                  >
                    {letters[idx]}
                  </span>

                  <span className="text-xs xs:text-[13.5px] sm:text-[15px] font-serif leading-relaxed font-medium flex-1">
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
