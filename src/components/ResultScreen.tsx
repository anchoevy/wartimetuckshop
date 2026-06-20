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
    <div className="flex flex-col gap-1.5 sm:gap-3 animate-stamp-in">
      <p className="text-center font-serif italic text-[10px] sm:text-xs text-ink-faded uppercase tracking-widest mb-0.5">
        Your Food Personality is...
      </p>

      {/* --- EXPORTABLE RESULT CARD --- */}
      <div
        id="result-card"
        ref={cardRef}
        className="relative bg-cream border-2 border-border p-2 xs:p-2.5 sm:p-5 md:p-6 rounded-sm shadow-md transition-transform duration-300"
        style={{ '--result-color': result.color } as React.CSSProperties}
      >
        {/* Decorative inner line */}
        <div className="absolute inset-1 border border-border/60 pointer-events-none rounded-xs" />

        {/* Transparent Image Box without Cropping - Sized larger, while keeping extremely space-efficient */}
        <div 
          className={`relative mb-1.5 sm:mb-2.5 rounded-xs flex items-center justify-center bg-transparent pt-0.5 ${
            result.id === 'ikan-bilis'
              ? 'h-24 xs:h-28 sm:h-36 md:h-44 scale-[1.08] gap-0.5 sm:gap-1'
              : 'h-20 xs:h-24 sm:h-32 md:h-40 gap-2'
          }`}
        >
          {result.imgSrcs.map((src, idx) => (
            <img
              key={idx}
              src={src}
              alt={`${result.name} ${idx + 1}`}
              className={`${
                result.imgSrcs.length > 1 ? 'max-w-[48%]' : 'max-w-[95%]'
              } h-full max-h-full object-contain filter drop-shadow-md animate-stamp-in hover:scale-105 transition-transform duration-300`}
              referrerPolicy="no-referrer"
            />
          ))}
        </div>

        {/* Name (Tagline and emoji omitted for compact elegance) */}
        <div className="text-center mb-0.5">
          <h2 
            className="font-serif text-base xs:text-lg sm:text-xl md:text-2xl font-extrabold tracking-tight mb-0.5"
            style={{ color: result.color }}
          >
            {result.name}
          </h2>
        </div>

        {/* Trait Tags */}
        <div className="flex justify-center flex-wrap gap-1 mb-1.5 sm:mb-2">
          {result.traits.map((trait, i) => (
            <span
              key={i}
              className="font-serif text-[7.5px] xs:text-[8.5px] sm:text-[10px] md:text-[11px] font-semibold uppercase tracking-widest px-1.5 py-0.5 border rounded-xs select-none"
              style={{ color: result.color, borderColor: `${result.color}50`, backgroundColor: `${result.color}08` }}
            >
              {trait}
            </span>
          ))}
        </div>

        <div className="text-center text-[8px] sm:text-xs text-sepia mb-1 select-none leading-none">— ✦ —</div>

        {/* Narrative Description */}
        <p className="font-serif text-[10.5px] xs:text-[11.5px] sm:text-[13px] md:text-sm leading-relaxed text-ink-light mb-1.5 sm:mb-2.5 text-center px-1 whitespace-pre-line">
          {result.description}
        </p>

        {/* Meta Grid (Characteristics) - 2 Columns on all devices, dynamically centered to prevent weird gaps */}
        <div className="grid grid-cols-2 border border-border/80 rounded-xs overflow-hidden mb-1.5 sm:mb-2.5 text-center bg-cream/50">
          <div className="p-1.5 xs:p-2 sm:p-3 border-b border-r border-border/85 flex flex-col items-center justify-center gap-0.5">
            <span className="text-[7.5px] xs:text-[8.5px] sm:text-[10px] font-sans font-bold text-accent uppercase tracking-widest leading-none">
              Core Strength
            </span>
            <span className="text-[9.5px] xs:text-[10px] sm:text-[11.5px] md:text-xs font-serif text-ink-light font-medium leading-tight text-center">
              {result.strength}
            </span>
          </div>
          <div className="p-1.5 xs:p-2 sm:p-3 border-b border-border/85 flex flex-col items-center justify-center gap-0.5">
            <span className="text-[7.5px] xs:text-[8.5px] sm:text-[10px] font-sans font-bold text-accent uppercase tracking-widest leading-none">
              Natural Blindspot
            </span>
            <span className="text-[9.5px] xs:text-[10px] sm:text-[11.5px] md:text-xs font-serif text-ink-light font-medium leading-tight text-center">
              {result.weakness}
            </span>
          </div>
          <div className="p-1 xs:p-1.5 sm:p-2 border-r border-border/85 flex flex-col items-center justify-center gap-0.5">
            <span className="text-[7.5px] xs:text-[8.5px] sm:text-[10px] font-sans font-bold text-accent uppercase tracking-widest leading-none">
              Pairs Well With
            </span>
            <span className="text-[9.5px] xs:text-[10px] sm:text-[11.5px] md:text-xs font-serif text-ink-light font-bold leading-tight text-center" style={{ color: result.color }}>
              {result.pairs}
            </span>
          </div>
          <div className="p-1 xs:p-1.5 sm:p-2 flex flex-col items-center justify-center gap-0.5">
            <span className="text-[7.5px] xs:text-[8.5px] sm:text-[10px] font-sans font-bold text-accent uppercase tracking-widest leading-none">
              Clashes With
            </span>
            <span className="text-[9.5px] xs:text-[10px] sm:text-[11.5px] md:text-xs font-serif text-ink-light font-medium leading-tight text-center">
              {result.clashes}
            </span>
          </div>
        </div>

        {/* Historical Fact Box */}
        <div className="bg-paper/30 border border-dashed border-[#d4c3a3] rounded-xs p-1.5 xs:p-2 sm:p-3 text-center mb-1.5 sm:mb-2.5">
          <p className="text-[6.5px] xs:text-[7.5px] sm:text-[8.5px] font-sans font-bold text-accent uppercase tracking-widest leading-none mb-1">
            Food Fact
          </p>
          <p className="text-[9px] xs:text-[10px] sm:text-[11.5px] font-serif text-ink-faded italic leading-relaxed text-center px-1">
            {result.fact}
          </p>
        </div>

        {/* Card Footer Credit */}
        <div className="flex justify-between items-center pt-1.5 border-t border-border/80 text-[6.5px] xs:text-[7.5px] sm:text-[9.5px] text-ink-faded italic">
          <span>TF-NUS Heritage Champions Programme</span>
          <span className="opacity-85 font-serif uppercase tracking-wider font-semibold text-[7px] xs:text-[8px] sm:text-[9.5px]">Wartime Tuckshop</span>
        </div>
      </div>

      {/* Hint/Disclaimer text above buttons */}
      <p className="text-center font-serif italic text-[8.5px] xs:text-[9px] text-ink-faded mt-0.5 sm:mt-1 leading-none select-none">
        Save the stamp card to share on your social stories!
      </p>

      {/* --- NON-DOWNLOADABLE CONTROL ACTIONS --- */}
      {/* Streamlined Horizontal Flex layout on mobile to combine actions, preventing page overflow */}
      <div className="pt-2 sm:pt-3 border-t border-border/45">
        <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-3">
          <button
            onClick={handleSharePrimary}
            className="inline-flex items-center gap-1 px-3 py-1.5 xs:px-4 xs:py-2 sm:px-6 sm:py-3.5 font-serif text-[10px] xs:text-xs font-bold tracking-wide text-cream bg-ink border border-ink rounded-xs cursor-pointer shadow-sm hover:bg-accent hover:border-accent hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
          >
            <Share2 className="w-3 h-3" />
            Share Results
          </button>

          <button
            onClick={handleSaveCard}
            disabled={isExporting}
            className="inline-flex items-center gap-1 px-3 py-1.5 xs:px-4 xs:py-2 sm:px-6 sm:py-3.5 font-serif text-[10px] xs:text-xs font-bold tracking-wide text-ink border border-border bg-transparent rounded-xs cursor-pointer hover:bg-paper-dark hover:border-ink-faded hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 disabled:opacity-50"
          >
            <Download className="w-3 h-3 text-accent animate-bounce" />
            {isExporting ? 'Saving...' : 'Save Stamp Card'}
          </button>

          <button
            onClick={onRestart}
            className="inline-flex items-center gap-0.5 px-2 py-1.5 xs:px-3 xs:py-2 sm:px-4 sm:py-3 font-serif text-[9px] xs:text-xs border border-border bg-transparent text-ink-faded hover:text-ink hover:bg-paper-dark hover:border-ink-faded rounded-xs cursor-pointer transition-colors duration-200"
          >
            <RotateCcw className="w-2.5 h-2.5" />
            Retake
          </button>

          <a
            href="https://www.instagram.com/wartime_tuckshop"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-2 py-1 font-serif text-[10px] xs:text-xs text-ink-faded hover:text-ink hover:underline border border-transparent hover:border-border/60 rounded-xs transition-all duration-200"
          >
            <Instagram className="w-3 h-3 text-accent" />
            Follow us
          </a>
        </div>

        {/* Dynamic feedback indicator */}
        {feedback && (
          <motion.p
            initial={{ opacity: 0, y: 3 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-[10px] sm:text-xs font-serif italic text-accent mt-1.5"
          >
            {feedback}
          </motion.p>
        )}
      </div>
    </div>
  );
}
