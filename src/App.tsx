/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import StartScreen from './components/StartScreen';
import QuizScreen from './components/QuizScreen';
import ResultScreen from './components/ResultScreen';
import { quizData, personalities } from './data';
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
    <div className="flex justify-center items-start min-h-screen px-4 py-8 md:py-16">
      <div 
        className="relative bg-cream border-2 border-border p-6 md:p-12 w-full max-w-2xl rounded-sm shadow-xl"
        style={{
          boxShadow: `
            inset 0 0 0 4px var(--color-cream),
            inset 0 0 0 6px var(--color-border),
            0 12px 40px rgba(30, 20, 10, 0.15)
          `
        }}
      >
        {/* Vintage corner ornaments */}
        <span className="absolute top-2 left-2.5 text-sepia text-xs font-serif pointer-events-none select-none">✦</span>
        <span className="absolute top-2 right-2.5 text-sepia text-xs font-serif pointer-events-none select-none">✦</span>
        <span className="absolute bottom-2 left-2.5 text-sepia text-xs font-serif pointer-events-none select-none">✦</span>
        <span className="absolute bottom-2 right-2.5 text-sepia text-xs font-serif pointer-events-none select-none">✦</span>

        {/* Global Tuckshop Header - shown on all screens as the title card */}
        <header className="text-center mb-8 animate-fade-down">
          <p className="font-serif text-[10px] md:text-xs tracking-[0.2em] uppercase text-accent font-bold mb-2">
            Singapore WWII Heritage Project
          </p>

          <div className="flex items-center gap-3 my-2 text-[#b08040] select-none">
            <div className="flex-1 h-[1px] bg-border" />
            <span className="text-[10px] md:text-xs">✦</span>
            <div className="flex-1 h-[1px] bg-border" />
          </div>

          <h1 className="font-display text-3xl md:text-5xl font-extrabold tracking-tight text-ink mt-2 mb-1">
            Wartime Tuckshop
          </h1>
          <p className="font-serif italic text-sm md:text-base text-ink-faded font-medium">
            Discover Your WWII Food Personality
          </p>

          <div className="flex items-center gap-3 my-2 text-[#b08040] select-none">
            <div className="flex-1 h-[1px] bg-border" />
            <span className="text-[10px] md:text-xs">✦</span>
            <div className="flex-1 h-[1px] bg-border" />
          </div>

          <p className="font-serif text-[10px] italic text-ink-faded mt-1">
            A project under the TF-NUS Heritage Champions Programme
          </p>
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
