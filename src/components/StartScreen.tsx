/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Instagram, Compass } from 'lucide-react';
import { LOGO_PATH } from '../data';

interface StartScreenProps {
  onStart: () => void;
}

export default function StartScreen({ onStart }: StartScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center animate-fade-up">
      {/* Straight-up PNG Logo (made prominent with balanced scaling to satisfy negative space requirements) */}
      <div className="w-full max-w-[150px] xs:max-w-[200px] sm:max-w-[320px] md:max-w-[400px] drop-shadow-md flex justify-center mx-auto mt-1 mb-2.5 sm:mb-4">
        <img
          src={LOGO_PATH}
          alt="Wartime Tuckshop Logo"
          className="w-full h-auto object-contain hover:scale-[1.02] transition-transform duration-300 mx-auto"
          referrerPolicy="no-referrer"
        />
      </div>

      <div className="text-center max-w-lg mx-auto flex flex-col items-center px-1">
        <p className="font-serif italic text-[11px] xs:text-xs sm:text-base leading-relaxed text-ink-light mb-2.5 sm:mb-4.5 border-l-3 border-accent pl-3 sm:pl-4 text-left bg-paper/25 py-2 sm:py-3 pr-2 rounded-r-xs">
          Wartime Tuckshop is a food heritage project created under the TF-NUS Heritage Champions Programme. Through hands-on cooking workshops, we hope to share more about Singapore's WWII food heritage and stories.
        </p>

        <p className="font-serif text-[10.5px] xs:text-xs sm:text-[14px] leading-relaxed text-ink-faded mb-3 sm:mb-5 font-medium">
          Answer eight brief questions to discover which food character corresponds with your personality! 
        </p>

        <button
          id="start-btn"
          onClick={onStart}
          className="relative inline-flex items-center gap-2 px-8 py-2.5 sm:px-11 sm:py-4 font-serif text-xs xs:text-sm font-semibold tracking-wider text-cream bg-ink border border-ink rounded-xs cursor-pointer shadow-md hover:bg-accent hover:border-accent hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 w-full sm:w-auto justify-center"
        >
          <Compass className="w-4 h-4 animate-pulse" />
          Begin the Quiz
        </button>

        {/* Resources & Socials Section */}
        <div className="mt-4 sm:mt-7 pt-3 sm:pt-4 border-t border-border/50 w-full">
          <p className="text-[8.5px] xs:text-[9px] sm:text-[11px] font-serif uppercase tracking-widest text-ink-faded mb-1.5 sm:mb-2">Links & Resources</p>
          <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2.5">
            <a
              href="https://www.instagram.com/wartime_tuckshop"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-serif text-[8.5px] xs:text-[9.5px] sm:text-[11.5px] px-2.5 py-1 sm:px-3.5 sm:py-2 border border-border bg-transparent text-ink-faded hover:text-ink hover:bg-paper/50 hover:border-ink-faded rounded-xs transition-all duration-200"
            >
              <Instagram className="w-3 h-3 text-accent" />
              Follow Instagram
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
