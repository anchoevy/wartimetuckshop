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

  const renderCardBlob = async (): Promise<Blob | null> => {
    if (!cardRef.current) return null;

    if (document.fonts && document.fonts.ready) {
      await document.fonts.ready;
    }
    await new Promise((resolve) => setTimeout(resolve, 120));

    const card = cardRef.current;
    const animated = card.querySelectorAll<HTMLElement>(
      '.animate-stamp-in, .transition-transform, .transition-all'
    );
    animated.forEach((el) => {
      el.style.animation = 'none';
      el.style.transition = 'none';
      el.style.opacity = '1';
    });

    try {
      return await domToBlob(card, {
        scale: 2,
        backgroundColor: '#fdf6e8',
        type: 'image/png',
      });
    } finally {
      animated.forEach((el) => {
        el.style.animation = '';
        el.style.transition = '';
        el.style.opacity = '';
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
    <div className="flex flex-col gap-2 sm:gap-3 animate-stamp-in">
      <p className="text-center font-serif italic text-[10px] sm:text-xs text-ink-faded uppercase tracking-widest">
        Your Food Personality is...
      </p>

      <div
        id="result-card"
        ref={cardRef}
        className="relative bg-cream border-2 border-border p-3 sm:p-5 rounded-sm"
        style={{ '--result-color': result.color } as CSSProperties}
      >
        <div className="relative mb-2 flex items-center justify-center bg-transparent h-24 sm:h-32 gap-1 sm:gap-2">
          {result.imgSrcs.map((src, idx) => (
            <img
              key={idx}
              src={src}
              alt={`${result.name} ${idx + 1}`}
              className={`${result.imgSrcs.length > 1 ? 'max-w-[48%]' : 'max-w-[80%]'} h-full max-h-full object-contain`}
              referrerPolicy="no-referrer"
            />
          ))}
        </div>

        <h2
          className="font-serif text-base sm:text-xl md:text-2xl font-extrabold text-center mb-1"
          style={{ color: result.color }}
        >
          {result.name}
        </h2>

        <div className="flex justify-center flex-wrap gap-1 mb-2">
          {result.traits.map((trait, i) => (
            <span
              key={i}
              className="font-serif text-[7.5px] sm:text-[9px] font-semibold uppercase tracking-widest px-1.5 py-0.5 border rounded-xs"
              style={{ color: result.color, borderColor: `${result.color}50`, backgroundColor: `${result.color}08` }}
            >
              {trait}
            </span>
          ))}
        </div>

        <p className="font-serif text-[10.5px] sm:text-[13px] leading-relaxed text-ink-light mb-2 text-center whitespace-pre-line">
          {result.description}
        </p>

        <div className="grid grid-cols-2 border border-border/80 rounded-xs overflow-hidden mb-2 text-center">
          <div className="p-2 sm:p-3 border-b border-r border-border/85 flex flex-col items-center gap-0.5">
            <span className="text-[7px] sm:text-[9px] font-sans font-bold text-accent uppercase tracking-widest">Core Strength</span>
            <span className="text-[9px] sm:text-[11px] font-serif text-ink-light font-medium leading-tight">{result.strength}</span>
          </div>
          <div className="p-2 sm:p-3 border-b border-border/85 flex flex-col items-center gap-0.5">
            <span className="text-[7px] sm:text-[9px] font-sans font-bold text-accent uppercase tracking-widest">Blindspot</span>
            <span className="text-[9px] sm:text-[11px] font-serif text-ink-light font-medium leading-tight">{result.weakness}</span>
          </div>
          <div className="p-2 sm:p-3 border-r border-border/85 flex flex-col items-center gap-0.5">
            <span className="text-[7px] sm:text-[9px] font-sans font-bold text-accent uppercase tracking-widest">Pairs With</span>
            <span className="text-[9px] sm:text-[11px] font-serif text-ink-light font-bold leading-tight" style={{ color: result.color }}>{result.pairs}</span>
          </div>
          <div className="p-2 sm:p-3 flex flex-col items-center gap-0.5">
            <span className="text-[7px] sm:text-[9px] font-sans font-bold text-accent uppercase tracking-widest">Clashes With</span>
            <span className="text-[9px] sm:text-[11px] font-serif text-ink-light font-medium leading-tight">{result.clashes}</span>
          </div>
        </div>

        <div className="bg-paper/30 border-l-2 border-accent/40 rounded-xs p-2 sm:p-3 mb-2">
          <p className="text-[6.5px] sm:text-[8px] font-sans font-bold text-accent uppercase tracking-widest mb-0.5">Food Fact</p>
          <p className="text-[9px] sm:text-[11px] font-serif text-ink-faded italic leading-relaxed">{result.fact}</p>
        </div>

        <div className="flex justify-between items-center pt-1.5 border-t border-border/60 text-[6.5px] sm:text-[8.5px] text-ink-faded italic">
          <span>TF-NUS Heritage Champions Programme</span>
          <span className="font-serif uppercase tracking-wider font-semibold">Wartime Tuckshop</span>
        </div>
      </div>

      {!isSharedResult && (
        <p className="text-center font-serif italic text-[8.5px] sm:text-[9px] text-ink-faded mt-0.5 leading-none">
          Save the stamp card to share on your social stories!
        </p>
      )}

      <div className="pt-2 sm:pt-3 border-t border-border/45 flex flex-col items-center gap-1.5 sm:gap-2">
        <button
          onClick={handleShareOrSave}
          disabled={isExporting}
          className="inline-flex items-center justify-center gap-1.5 w-full max-w-[280px] px-4 py-2 xs:py-2.5 sm:px-6 sm:py-3 font-serif text-[11px] xs:text-xs sm:text-sm font-bold tracking-wide text-cream bg-ink border border-ink rounded-xs cursor-pointer shadow-sm hover:bg-accent hover:border-accent hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 disabled:opacity-60 disabled:pointer-events-none"
        >
          <Share2 className="w-3.5 h-3.5" />
          {isExporting ? 'Preparing card...' : 'Share Stamp Card'}
        </button>

        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
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
            className="text-center text-[10px] sm:text-xs font-serif italic text-accent mt-0.5"
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
              Stamp Card Ready! ✦
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
