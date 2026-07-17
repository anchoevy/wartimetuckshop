import { useRef, useState, type CSSProperties } from 'react';
import { Share2, Copy, RotateCcw, Instagram, X } from 'lucide-react';
import { domToBlob } from 'modern-screenshot';
import { motion } from 'motion/react';
import { PersonalityResult } from '../types';

interface ResultScreenProps {
  result: PersonalityResult;
  onRestart: () => void;
  isSharedResult?: boolean;
}

export default function ResultScreen({ result, onRestart, isSharedResult }: ResultScreenProps) {
  const resultRef = useRef<HTMLDivElement>(null);
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

  const renderCardBlob = async (): Promise<Blob | null> => {
    if (!resultRef.current) return null;

    if (document.fonts && document.fonts.ready) {
      await document.fonts.ready;
    }
    await new Promise((resolve) => setTimeout(resolve, 120));

    const el = resultRef.current;
    const animated = el.querySelectorAll<HTMLElement>(
      '.animate-stamp-in, .transition-transform, .transition-all'
    );
    animated.forEach((a) => {
      a.style.animation = 'none';
      a.style.transition = 'none';
      a.style.opacity = '1';
    });

    try {
      return await domToBlob(el, {
        scale: 2,
        backgroundColor: '#fdf6e8',
        type: 'image/png',
      });
    } finally {
      animated.forEach((a) => {
        a.style.animation = '';
        a.style.transition = '';
        a.style.opacity = '';
      });
    }
  };

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
          if ((err as Error)?.name === 'AbortError') {
            setFeedback('');
            return;
          }
        }
      }

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
    textarea.style.position = 'fixed';
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
    <div className="flex flex-col gap-3 animate-stamp-in">
      <p className="text-center font-serif italic text-[11px] sm:text-sm text-ink-faded uppercase tracking-[0.2em]">
        Your Food Personality is...
      </p>

      <div
        ref={resultRef}
        className="relative bg-cream border border-border p-4 sm:p-6"
        style={{ '--result-color': result.color } as CSSProperties}
      >
        <h2 className="font-serif text-lg sm:text-2xl font-extrabold text-center text-ink tracking-tight mb-2 sm:mb-3 leading-tight">
          Wartime Tuckshop
        </h2>
        <div className="relative mb-3 flex items-center justify-center bg-transparent h-28 sm:h-36 gap-2 sm:gap-3">
          {result.imgSrcs.map((src, idx) => (
            <img
              key={idx}
              src={src}
              alt={`${result.name} ${idx + 1}`}
              className={`${result.imgSrcs.length > 1 ? 'max-w-[45%]' : 'max-w-[75%]'} h-full max-h-full object-contain`}
              referrerPolicy="no-referrer"
            />
          ))}
        </div>

        <h2
          className="font-serif text-lg sm:text-2xl md:text-3xl font-extrabold text-center mb-2 tracking-tight"
          style={{ color: result.color }}
        >
          {result.name}
        </h2>

        <div className="flex justify-center flex-wrap gap-1.5 mb-3">
          {result.traits.map((trait, i) => (
            <span
              key={i}
              className="font-serif text-[8px] sm:text-[10px] font-semibold uppercase tracking-[0.15em] px-2 py-0.5 border rounded-sm"
              style={{ color: result.color, borderColor: `${result.color}50`, backgroundColor: `${result.color}08` }}
            >
              {trait}
            </span>
          ))}
        </div>

        <p className="font-serif text-[11px] sm:text-[13px] leading-[1.7] text-ink-light mb-3 text-center whitespace-pre-line px-1">
          {result.description}
        </p>

        <div className="grid grid-cols-2 border border-border/80 mb-3 text-center divide-x divide-border/80">
          <div className="p-2.5 sm:p-3 border-b border-border/80 flex flex-col items-center gap-1">
            <span className="text-[6.5px] sm:text-[8px] font-sans font-bold text-accent uppercase tracking-[0.2em]">Strength</span>
            <span className="text-[9px] sm:text-[11px] font-serif text-ink-light leading-tight">{result.strength}</span>
          </div>
          <div className="p-2.5 sm:p-3 border-b border-border/80 flex flex-col items-center gap-1">
            <span className="text-[6.5px] sm:text-[8px] font-sans font-bold text-accent uppercase tracking-[0.2em]">Blindspot</span>
            <span className="text-[9px] sm:text-[11px] font-serif text-ink-light leading-tight">{result.weakness}</span>
          </div>
          <div className="p-2.5 sm:p-3 flex flex-col items-center gap-1">
            <span className="text-[6.5px] sm:text-[8px] font-sans font-bold text-accent uppercase tracking-[0.2em]">Pairs With</span>
            <span className="text-[9px] sm:text-[11px] font-serif font-bold leading-tight" style={{ color: result.color }}>{result.pairs}</span>
          </div>
          <div className="p-2.5 sm:p-3 flex flex-col items-center gap-1">
            <span className="text-[6.5px] sm:text-[8px] font-sans font-bold text-accent uppercase tracking-[0.2em]">Clashes With</span>
            <span className="text-[9px] sm:text-[11px] font-serif text-ink-light leading-tight">{result.clashes}</span>
          </div>
        </div>

        <div className="bg-paper/40 border-l-2 border-accent/40 p-2.5 sm:p-3 mb-2">
          <p className="text-[6.5px] sm:text-[8px] font-sans font-bold text-accent uppercase tracking-[0.15em] mb-1">Food Fact</p>
          <p className="text-[9px] sm:text-[11px] font-serif text-ink-faded italic leading-[1.6]">{result.fact}</p>
        </div>

        <div className="flex justify-center pt-2 border-t border-border/50 text-[6.5px] sm:text-[8px] text-ink-faded">
          <span>TF-NUS Heritage Champions Programme</span>
        </div>
      </div>

      {!isSharedResult && (
        <p className="text-center font-serif italic text-[9px] sm:text-[10px] text-ink-faded -mt-1 leading-none">
          Save the stamp card to share on your social stories!
        </p>
      )}

      <div className="pt-2.5 sm:pt-3 border-t border-border/45 flex flex-col items-center gap-2 sm:gap-2.5">
        <button
          onClick={handleShareOrSave}
          disabled={isExporting}
          className="inline-flex items-center justify-center gap-1.5 w-full max-w-[280px] px-4 py-2.5 xs:py-3 sm:px-6 sm:py-3.5 font-serif text-[11px] xs:text-xs sm:text-sm font-bold tracking-wide text-cream bg-ink border border-ink rounded-sm cursor-pointer shadow-sm hover:bg-accent hover:border-accent hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 disabled:opacity-60 disabled:pointer-events-none"
        >
          <Share2 className="w-3.5 h-3.5" />
          {isExporting ? 'Preparing card...' : 'Share Stamp Card'}
        </button>

        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
          {!isSharedResult && (
            <button
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1 font-serif text-[10px] xs:text-[11px] text-ink-faded hover:text-ink hover:underline cursor-pointer transition-colors duration-200"
            >
              <Copy className="w-2.5 h-2.5" />
              Copy link
            </button>
          )}

          <button
            onClick={onRestart}
            className="inline-flex items-center gap-1 font-serif text-[10px] xs:text-[11px] text-ink-faded hover:text-ink hover:underline cursor-pointer transition-colors duration-200"
          >
            <RotateCcw className="w-2.5 h-2.5" />
            {isSharedResult ? 'Take the Quiz' : 'Retake'}
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

        {feedback && (
          <motion.p
            initial={{ opacity: 0, y: 3 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-[10px] sm:text-xs font-serif italic text-accent"
          >
            {feedback}
          </motion.p>
        )}
      </div>

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
              Stamp Card Ready!
            </h3>

            <p className="font-serif text-[10px] sm:text-xs text-ink-light leading-normal px-2">
              If the automatic download didn't start, please <span className="text-accent font-bold">tap & hold</span> on mobile, or <span className="text-accent font-bold">right-click</span> on desktop to save the image below!
            </p>

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
