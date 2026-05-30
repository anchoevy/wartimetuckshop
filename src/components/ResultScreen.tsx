/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState } from 'react';
import { Download, Share2, Copy, RotateCcw, Instagram } from 'lucide-react';
import html2canvas from 'html2canvas';
import { motion } from 'motion/react';
import { PersonalityResult } from '../types';

interface ResultScreenProps {
  result: PersonalityResult;
  onRestart: () => void;
}

export default function ResultScreen({ result, onRestart }: ResultScreenProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [feedback, setFeedback] = useState<string>('');
  const [isExporting, setIsExporting] = useState<boolean>(false);

  const shareUrl = `${window.location.origin}${window.location.pathname}?result=${result.id}`;
  const shareText = `I'm ${result.name} ${result.emoji} on the Wartime Tuckshop quiz. Find out your WWII food personality here:`;

  const triggerFeedback = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(''), 3000);
  };

  const handleSharePrimary = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Wartime Tuckshop',
          text: shareText,
          url: shareUrl,
        });
      } catch (err) {
        // User cancelled, ignore
      }
    } else {
      // Desktop / Web share fallback
      handleCopyLink();
    }
  };

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(shareUrl)
        .then(() => triggerFeedback('Link copied to clipboard.'))
        .catch(() => fallbackCopy());
    } else {
      fallbackCopy();
    }
  };

  const fallbackCopy = () => {
    const textarea = document.createElement('textarea');
    textarea.value = shareUrl;
    textarea.style.position = 'fixed'; // Avoid scrolling
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    try {
      document.execCommand('copy');
      triggerFeedback('Link copied to clipboard.');
    } catch (err) {
      triggerFeedback('Could not copy link.');
    }
    document.body.removeChild(textarea);
  };

  const handleSaveCard = async () => {
    if (!cardRef.current) return;
    setIsExporting(true);
    triggerFeedback('Stamping your card...');

    try {
      // Small timeout to give DOM a frame to refresh and stabilize
      await new Promise((resolve) => setTimeout(resolve, 300));

      const canvas = await html2canvas(cardRef.current, {
        scale: 2, // Retinal high-def export
        useCORS: true, // Allow cross-origin images 
        backgroundColor: '#fdf6e8', // Keep matching vintage background
        logging: false,
        onclone: (clonedDoc) => {
          // You can modify cloned elements here if needed before drawing
          const clonedCard = clonedDoc.getElementById('result-card');
          if (clonedCard) {
            clonedCard.style.boxShadow = 'none';
          }
        }
      });

      const blobUrl = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.download = `wartime-tuckshop-${result.id}.png`;
      downloadLink.href = blobUrl;
      downloadLink.click();
      
      triggerFeedback('Successfully saved! Share it on your Instagram Stories.');
    } catch (error) {
      console.error(error);
      triggerFeedback('Could not generate image. Try screenshotting instead!');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-stamp-in">
      <p className="text-center font-serif italic text-xs md:text-sm text-ink-faded uppercase tracking-widest">
        Your Resilient Food Spirit is...
      </p>

      {/* --- EXPORTABLE RESULT CARD --- */}
      <div
        id="result-card"
        ref={cardRef}
        className="relative bg-cream border-2 border-border p-6 md:p-8 rounded-sm overflow-hidden shadow-lg transition-transform duration-300"
        style={{ '--result-color': result.color } as React.CSSProperties}
      >
        {/* Decorative inner line */}
        <div className="absolute inset-1.5 border border-border/70 pointer-events-none rounded-xs" />

        {/* Transparent Image Box without Cropping - Maximized sizing */}
        <div className="relative overflow-hidden mb-6 rounded-xs h-80 md:h-[420px] flex items-center justify-center gap-4 md:gap-8 bg-transparent pt-2">
          {result.imgSrcs.map((src, idx) => (
            <img
              key={idx}
              src={src}
              alt={`${result.name} ${idx + 1}`}
              className={`${
                result.imgSrcs.length > 1 ? 'max-w-[48%] md:max-w-[50%]' : 'max-w-[95%] md:max-w-[90%]'
              } h-full max-h-full object-contain filter drop-shadow-md animate-fade-in hover:scale-105 transition-transform duration-300`}
              referrerPolicy="no-referrer"
            />
          ))}
        </div>

        {/* Name (Tagline omitted) */}
        <div className="text-center mb-4">
          <span className="text-4xl block leading-none mb-2 select-none">
            {result.emoji}
          </span>
          <h2 
            className="font-display text-3xl md:text-4xl font-extrabold tracking-tight mb-2"
            style={{ color: result.color }}
          >
            {result.name}
          </h2>
        </div>

        {/* Trait Tags */}
        <div className="flex justify-center flex-wrap gap-2 mb-6">
          {result.traits.map((trait, i) => (
            <span
              key={i}
              className="font-serif text-[10px] md:text-xs font-semibold uppercase tracking-widest px-3 py-1 border rounded-xs select-none"
              style={{ color: result.color, borderColor: result.color }}
            >
              {trait}
            </span>
          ))}
        </div>

        <div className="text-center text-xs text-sepia mb-4 select-none">— ✦ —</div>

        {/* Narrative Description */}
        <p className="font-serif text-sm md:text-base leading-relaxed text-ink-light mb-6 text-left">
          {result.description}
        </p>

        {/* Meta Grid (Characteristics) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 border border-border/80 rounded-xs overflow-hidden mb-6 text-left">
          <div className="p-3 border-b sm:border-b-0 sm:border-r border-border/85 flex flex-col gap-0.5">
            <span className="text-[10px] font-sans font-semibold text-ink-faded uppercase tracking-widest">
              Core Strength
            </span>
            <span className="text-xs md:text-sm font-serif text-ink-light font-medium">
              {result.strength}
            </span>
          </div>
          <div className="p-3 border-b border-border/85 sm:border-b-0 flex flex-col gap-0.5">
            <span className="text-[10px] font-sans font-semibold text-ink-faded uppercase tracking-widest">
              Natural Blindspot
            </span>
            <span className="text-xs md:text-sm font-serif text-ink-light font-medium">
              {result.weakness}
            </span>
          </div>
          <div className="p-3 border-t border-border/85 sm:border-r flex flex-col gap-0.5">
            <span className="text-[10px] font-sans font-semibold text-ink-faded uppercase tracking-widest">
              Pairs Well With
            </span>
            <span className="text-xs md:text-sm font-serif text-ink-light font-medium" style={{ color: result.color }}>
              {result.pairs}
            </span>
          </div>
          <div className="p-3 border-t border-border/85 flex flex-col gap-0.5">
            <span className="text-[10px] font-sans font-semibold text-ink-faded uppercase tracking-widest">
              Clashes With
            </span>
            <span className="text-xs md:text-sm font-serif text-ink-light font-medium">
              {result.clashes}
            </span>
          </div>
        </div>

        {/* Card Footer Credit */}
        <div className="flex justify-between items-center pt-3 border-t border-border/80 text-[9px] md:text-xs text-ink-faded italic">
          <span>TF-NUS Heritage Champions Programme</span>
          <span className="opacity-85 font-serif uppercase tracking-wider font-semibold text-[10px]">Wartime Tuckshop</span>
        </div>
      </div>

      {/* --- NON-DOWNLOADABLE CONTROL ACTIONS --- */}
      <div className="text-center pt-4 border-t border-border/60">
        <div className="flex flex-col items-center gap-4">
          {/* Primary Action Button */}
          <button
            onClick={handleSharePrimary}
            className="inline-flex items-center gap-2 px-10 py-3.5 font-serif text-sm font-bold tracking-wide text-cream bg-ink border-2 border-ink rounded-xs cursor-pointer shadow-md hover:bg-accent hover:border-accent hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
          >
            <Share2 className="w-4 h-4" />
            Share Results
          </button>

          {/* Interactive User Feedback Notification */}
          {feedback && (
            <motion.p
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs font-serif italic text-accent mt-1"
            >
              {feedback}
            </motion.p>
          )}
        </div>
      </div>

      {/* Take the quiz again section */}
      <div className="text-center mt-6 pt-6 border-t border-border/30">
        <button
          onClick={onRestart}
          className="inline-flex items-center gap-1.5 px-6 py-2.5 font-serif text-xs px-4 py-2 border border-border bg-transparent text-ink-faded hover:text-ink hover:bg-paper-dark hover:border-ink-faded rounded-xs cursor-pointer transition-colors duration-200"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Retake the Quiz
        </button>

        <div className="flex justify-center gap-4 mt-8">
          <a
            href="https://www.instagram.com/wartime_tuckshop"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-serif text-[11px] text-ink-faded hover:text-ink"
          >
            <Instagram className="w-3.5 h-3.5 text-accent" />
            Follow us
          </a>
        </div>
      </div>
    </div>
  );
}
