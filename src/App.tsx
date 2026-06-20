/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import StartScreen from './components/StartScreen';
import QuizScreen from './components/QuizScreen';
import ResultScreen from './components/ResultScreen';
import { quizData, personalities, LOGO_PATH } from './data';
import { PersonalityResult } from './types';

export default function App() {
  const [screen, setScreen] = useState<'start' | 'quiz' | 'result'>('start');
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<(number | undefined)[]>(
    Array(quizData.length).fill(undefined)
  );
  const [result, setResult] = useState<PersonalityResult | null>(null);

  // Read URL query parameter on load to support direct result loading/sharing
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sharedResultId = params.get('result');
    if (sharedResultId) {
      const matchedResult = personalities.find((p) => p.id === sharedResultId);
      if (matchedResult) {
        setResult(matchedResult);
        setScreen('result');
      }
    }
  }, []);

  const handleStartQuiz = () => {
    setCurrentQuestion(0);
    setUserAnswers(Array(quizData.length).fill(undefined));
    setResult(null);
    setScreen('quiz');
  };

  const handleSelectOption = (optionIdx: number) => {
    const nextAnswers = [...userAnswers];
    nextAnswers[currentQuestion] = optionIdx;
    setUserAnswers(nextAnswers);
  };

  const handlePrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleNext = () => {
    if (userAnswers[currentQuestion] !== undefined && currentQuestion < quizData.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handleSubmit = () => {
    // Check if all questions are answered
    if (userAnswers.some((ans) => ans === undefined)) {
      return;
    }

    // Tally matching categories (0=Tapioca, 1=Ragi Roti, 2=Lemak, 3=Ikan Bilis)
    const scoreTally = [0, 0, 0, 0];
    userAnswers.forEach((selectedIdx, qIdx) => {
      if (selectedIdx !== undefined) {
        const personalityIdx = quizData[qIdx].map[selectedIdx];
        scoreTally[personalityIdx]++;
      }
    });

    // Check for a tie. If there is a tie, award "Wartime Rojak" (index 4)
    const maxVal = Math.max(...scoreTally);
    const tiedCount = scoreTally.filter((score) => score === maxVal).length;

    let finalIdx: number;
    if (tiedCount > 1) {
      finalIdx = 4; // Wartime Rojak (Rarer/mystery option)
    } else {
      finalIdx = scoreTally.indexOf(maxVal);
    }

    const calculatedResult = personalities[finalIdx];
    setResult(calculatedResult);
    setScreen('result');

    // Update browser URL query parameter quietly without a full page reload
    const newUrl = `${window.location.pathname}?result=${calculatedResult.id}`;
    window.history.replaceState(null, '', newUrl);
  };

  const handleRestartQuiz = () => {
    setScreen('start');
    setCurrentQuestion(0);
    setUserAnswers(Array(quizData.length).fill(undefined));
    setResult(null);

    // Remove URL parameters
    window.history.replaceState(null, '', window.location.pathname);
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-1.5 xs:p-2 sm:p-4 md:p-8 bg-paper-dark/30 transition-all duration-300">
      <div 
        className={`relative bg-cream border-2 border-border rounded-sm w-full max-w-md shadow-xl transition-all duration-300 flex flex-col justify-between ${
          screen === 'start'
            ? 'p-4 xs:p-5 sm:p-6'
            : screen === 'result'
              ? 'p-2.5 xs:p-3 sm:p-4'
              : 'p-4 xs:p-5'
        }`}
        style={{
          boxShadow: `
            inset 0 0 0 3px var(--color-cream),
            inset 0 0 0 4px var(--color-border),
            0 12px 36px rgba(30, 20, 10, 0.14)
          `
        }}
      >
        {/* Vintage corner ornaments */}
        <>
          <span className="absolute top-1.5 left-2 text-sepia text-[10px] sm:text-xs font-serif pointer-events-none select-none">✦</span>
          <span className="absolute top-1.5 right-2 text-sepia text-[10px] sm:text-xs font-serif pointer-events-none select-none">✦</span>
          <span className="absolute bottom-1.5 left-2 text-sepia text-[10px] sm:text-xs font-serif pointer-events-none select-none">✦</span>
          <span className="absolute bottom-1.5 right-2 text-sepia text-[10px] sm:text-xs font-serif pointer-events-none select-none">✦</span>
        </>
 
        {/* Global Tuckshop Header - Centered and elegant across all pages, dynamically sized to prevent scroll */}
        <header className={`text-center animate-fade-down flex flex-col items-center ${
          screen === 'result'
            ? 'mb-1.5 sm:mb-2.5'
            : 'mb-3.5 sm:mb-6 md:mb-8'
        }`}>
          <p className="font-serif text-[8px] xs:text-[9.5px] sm:text-xs tracking-[0.25em] uppercase text-accent font-bold leading-none mb-0.5 sm:mb-1.5 text-[#a34839]">
            Singapore WWII Heritage Project
          </p>

          <div className="w-full flex items-center gap-1 select-none opacity-40 my-0.5 xs:my-1">
            <div className="flex-1 h-[0.5px] bg-border" />
            <span className="text-[6.5px] sm:text-[8px] text-[#b08040]">✦</span>
            <div className="flex-1 h-[0.5px] bg-border" />
          </div>

          <h1 className={`font-serif font-extrabold tracking-tight text-ink leading-tight ${
            screen === 'result' ? 'text-xl xs:text-2xl sm:text-3xl mt-0' : 'text-3xl sm:text-4xl md:text-5xl mt-0.5'
          }`}>
            Wartime Tuckshop
          </h1>
          {screen !== 'result' && (
            <p className="font-serif italic text-[10.5px] xs:text-xs sm:text-sm text-ink-faded font-semibold leading-normal m-0">
              Discover Your WWII Food Personality
            </p>
          )}
        </header>

        {/* Action Screens Container */}
        <main className="relative">
          {screen === 'start' && <StartScreen onStart={handleStartQuiz} />}

          {screen === 'quiz' && (
            <QuizScreen
              currentQuestion={currentQuestion}
              totalQuestions={quizData.length}
              question={quizData[currentQuestion]}
              selectedOption={userAnswers[currentQuestion]}
              onSelectOption={handleSelectOption}
              onPrev={handlePrev}
              onNext={handleNext}
              onSubmit={handleSubmit}
            />
          )}

          {screen === 'result' && result && (
            <ResultScreen result={result} onRestart={handleRestartQuiz} />
          )}
        </main>
      </div>
    </div>
  );
}
