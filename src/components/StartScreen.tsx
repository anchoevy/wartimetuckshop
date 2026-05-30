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
      {/* Straight-up PNG Logo (made prominent with minimized negative space) */}
      <div className="w-full max-w-[390px] md:max-w-[480px] drop-shadow-xs flex justify-center mx-auto -mt-4 mb-2">
        <img
          src={LOGO_PATH}
          alt="Wartime Tuckshop Logo"
          className="w-full h-auto object-contain hover:scale-[1.02] transition-transform duration-300 mx-auto"
          referrerPolicy="no-referrer"
        />
      </div>

      <div className="text-center max-w-lg mx-auto">
        <p className="font-serif italic text-sm md:text-base leading-relaxed text-ink-light mb-5 border-l-4 border-accent pl-4 text-left bg-paper/20 py-2.5 pr-2 rounded-r-xs">
          Wartime Tuckshop is an food heritage project created under the TF-NUS Heritage Champions Programme. Through hands-on cooking workshops, we hope to share more about Singapore's WWII food heritage and stories.
        </p>

        <p className="font-serif text-sm leading-relaxed text-ink-faded mb-6 font-medium">
          Answer eight brief questions to discover which food character corresponds with your personality! 
        </p>

        <button
          id="start-btn"
          onClick={onStart}
          className="relative inline-flex items-center gap-2 px-10 py-4 font-serif text-base font-medium tracking-wide text-cream bg-ink border-2 border-ink rounded-xs cursor-pointer shadow-md hover:bg-accent hover:border-accent hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 w-full sm:w-auto justify-center"
        >
          <Compass className="w-4 h-4 animate-pulse" />
          Begin the Quiz
        </button>

        {/* Resources & Socials Section */}
        <div className="mt-10 pt-6 border-t border-border/60">
          <p className="text-xs font-serif uppercase tracking-widest text-ink-faded mb-3">Links & Resources</p>
          <div className="flex flex-wrap justify-center gap-3">
            <a
              href="https://www.instagram.com/wartime_tuckshop"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-serif text-xs px-4 py-2 border border-border bg-transparent text-ink-faded hover:text-ink hover:bg-paper/50 hover:border-ink-faded rounded-xs transition-all duration-200"
            >
              <Instagram className="w-4 h-4 text-accent" />
              Follow Instagram
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
