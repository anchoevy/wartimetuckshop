/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState } from 'react';
import { Share2, Copy, RotateCcw, Instagram, X } from 'lucide-react';
import { domToBlob } from 'modern-screenshot';
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
  const [exportedImgUrl, setExportedImgUrl] = useState<string | null>(null);
  const [showSaveModal, setShowSaveModal] = useState<boolean>(false);

  const shareUrl = `${window.location.origin}${window.location.pathname}?result=${result.id}`;
  const shareText = `I'm ${result.name} ${result.emoji} on the Wartime Tuckshop quiz. Find out your WWII food personality here:`;

  const triggerFeedback = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(''), 3000);
  };

  // Renders the stamp card to a PNG blob. Waits for webfonts to finish
  // loading first — capturing before Lora/Playfair Display are ready is
  // a common cause of exports falling back to a system serif mid-render,
  // which throws off glyph widths and reads as squished/overlapping
  // letters (a kerning-looking bug that isn't really a kerning setting).
  //
  // Uses `modern-screenshot` rather than html2canvas. html2canvas works by
  // re-parsing every stylesheet's CSS text itself, and this project's
  // Tailwind v4 build emits modern syntax (nested rules, `@layer`,
  // `color-mix()` for the `/opacity` utilities) that html2canvas's parser
  // chokes on — when that happens it silently drops the whole sheet, so
  // the export comes out as unstyled, top-to-bottom stacked text instead
  // of the actual card. modern-screenshot instead walks the live DOM and
  // copies each element's already-resolved `getComputedStyle()` values, so
  // it doesn't care what CSS syntax produced them and the export matches
  // exactly what's on screen.
  const renderCardBlob = async (): Promise<Blob | null> => {
    if (!cardRef.current) return null;

    if (document.fonts && document.fonts.ready) {
      await document.fonts.ready;
    }
    // One extra frame so layout has fully settled after the font swap.
    await new Promise((resolve) => setTimeout(resolve, 60));

    return domToBlob(cardRef.current, {
      scale: 2, // Retina-quality export
      backgroundColor: '#fdf6e8',
      onCloneNode: (cloned) => {
        if (!(cloned instanceof HTMLElement)) return;

        cloned.style.boxShadow = 'none';

        // Strip transition/animation/hover classes and any in-flight
        // transform so the export isn't captured mid-animation.
        const animatedElements = cloned.querySelectorAll<HTMLElement>(
          '.animate-stamp-in, .transition-transform, .transition-all'
        );
        animatedElements.forEach((el) => {
          el.classList.remove('animate-stamp-in', 'transition-transform', 'transition-all', 'hover:scale-105');
          el.style.transform = 'none';
          el.style.animation = 'none';
          el.style.opacity = '1';
        });
      },
    });
  };

  // Single share/save action, used by the one primary button. On mobile,
  // this shares the actual card *image* through the native share sheet
  // (Web Share API Level 2 with files) — that's what makes "Instagram"
  // appear as a target with a Stories option, since a plain link/text
  // share never reaches the Stories composer. Wherever file-sharing isn't
  // supported (most desktop browsers), it falls back to downloading the
  // card and showing a preview the user can save manually.
  const handleShareOrSave = async () => {
    setIsExporting(true);
    triggerFeedback('Stamping your card...');

    try {
      const blob = await renderCardBlob();
      if (!blob) throw new Error('Card element not ready');

      const file = new File([blob], `wartime-tuckshop-${result.id}.png`, { type: 'image/png' });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({ files: [file], title: 'Wartime Tuckshop', text: shareText });
          setFeedback('');
          return;
        } catch (err) {
          // AbortError = user cancelled the share sheet, not a failure —
          // don't fall through to the download flow in that case.
          if ((err as Error)?.name === 'AbortError') {
            setFeedback('');
            return;
          }
        }
      }

      // Fallback: download the card and show a preview for manual saving.
      const blobUrl = URL.createObjectURL(blob);
      setExportedImgUrl(blobUrl);
      setShowSaveModal(true);

      try {
        const downloadLink = document.createElement('a');
        downloadLink.download = `wartime-tuckshop-${result.id}.png`;
        downloadLink.href = blobUrl;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      } catch (dlErr) {
        console.warn('Direct programmatic download prevented by sandbox constraints', dlErr);
      }

      triggerFeedback('Stamp card ready! Tap and hold to save to Instagram.');
    } catch (error) {
      console.error(error);
      triggerFeedback('Could not generate card. Try taking a screenshot!');
    } finally {
      setIsExporting(false);
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
            className="font-serif text-base xs:text-lg sm:text-xl md:text-2xl font-extrabold tracking-normal mb-0.5"
            style={{ color: result.color, letterSpacing: 'normal' }}
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

      {/* --- ACTIONS --- */}
      <div className="pt-2 sm:pt-3 border-t border-border/45 flex flex-col items-center gap-1.5 sm:gap-2">
        {/* Single primary action: shares the card image directly through
            the native share sheet where supported (Instagram then appears
            as a target with a Stories option), and otherwise downloads the
            card + shows a save-it-yourself preview — all in one button so
            there's no separate "save" affordance cluttering the row below. */}
        <button
          onClick={handleShareOrSave}
          disabled={isExporting}
          className="inline-flex items-center justify-center gap-1.5 w-full max-w-[280px] px-4 py-2 xs:py-2.5 sm:px-6 sm:py-3 font-serif text-[11px] xs:text-xs sm:text-sm font-bold tracking-wide text-cream bg-ink border border-ink rounded-xs cursor-pointer shadow-sm hover:bg-accent hover:border-accent hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 disabled:opacity-60 disabled:pointer-events-none"
        >
          <Share2 className="w-3.5 h-3.5" />
          {isExporting ? 'Preparing card...' : 'Share Stamp Card'}
        </button>

        {/* Secondary: small text links */}
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
          <button
            onClick={handleCopyLink}
            className="inline-flex items-center gap-1 font-serif text-[10px] xs:text-[11px] text-ink-faded hover:text-ink hover:underline cursor-pointer transition-colors duration-200"
          >
            <Copy className="w-2.5 h-2.5" />
            Copy link
          </button>

          <button
            onClick={onRestart}
            className="inline-flex items-center gap-1 font-serif text-[10px] xs:text-[11px] text-ink-faded hover:text-ink hover:underline cursor-pointer transition-colors duration-200"
          >
            <RotateCcw className="w-2.5 h-2.5" />
            Retake
          </button>

          <a
            href="https://www.instagram.com/wartime_tuckshop"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-serif text-[10px] xs:text-[11px] text-ink-faded hover:text-ink hover:underline transition-colors duration-200"
          >
            <Instagram className="w-2.5 h-2.5" />
            Follow us
          </a>
        </div>

        {/* Dynamic feedback indicator */}
        {feedback && (
          <motion.p
            initial={{ opacity: 0, y: 3 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-[10px] sm:text-xs font-serif italic text-accent mt-0.5"
          >
            {feedback}
          </motion.p>
        )}
      </div>

      {/* --- SAVE MODAL FALLBACK / PREVIEW --- */}
      {showSaveModal && exportedImgUrl && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 xs:p-4 bg-ink/75 backdrop-blur-[2px]"
        >
          <motion.div
            initial={{ scale: 0.95, y: 15 }}
            animate={{ scale: 1, y: 0 }}
            className="relative bg-cream border-2 border-border p-4 sm:p-5 rounded-md shadow-2xl max-w-xs sm:max-w-sm w-full text-center flex flex-col items-center gap-2.5"
          >
            <button
              onClick={() => setShowSaveModal(false)}
              className="absolute top-2 right-2 text-ink-faded hover:text-ink hover:bg-paper-dark/50 p-1.5 rounded-full cursor-pointer transition-colors duration-150"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
            
            <h3 className="font-serif text-sm sm:text-base font-extrabold text-ink tracking-tight mt-1.5">
              Stamp Card Ready! ✦
            </h3>
            
            <p className="font-serif text-[10px] sm:text-xs text-ink-light leading-normal px-2">
              If the automatic download didn't start, please <span className="text-accent font-bold">tap & hold</span> on mobile, or <span className="text-accent font-bold">right-click</span> on desktop to save the image below!
            </p>

            {/* Generated card preview */}
            <div className="border border-border/80 rounded-xs overflow-hidden shadow-md max-h-[42vh] flex justify-center bg-cream">
              <img
                src={exportedImgUrl}
                alt="Wartime Stamp Card"
                className="max-h-full w-auto object-contain"
                referrerPolicy="no-referrer"
              />
            </div>

            <button
              onClick={() => setShowSaveModal(false)}
              className="w-full py-2 font-serif text-xs font-bold text-cream bg-ink border border-ink rounded-xs hover:bg-accent hover:border-accent cursor-pointer shadow-sm transition-all duration-200"
            >
              Done
            </button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
