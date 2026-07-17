import { useRef, useState, type CSSProperties } from 'react';
import { Share2, Copy, RotateCcw, Instagram, X } from 'lucide-react';
import { domToPng, domToCanvas } from 'modern-screenshot';
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

  const dataUrlToBlob = (dataUrl: string): Blob => {
    const parts = dataUrl.split(',');
    const mime = parts[0].match(/:(.*?);/)![1];
    const raw = atob(parts[1]);
    const len = raw.length;
    const buf = new Uint8Array(len);
    for (let i = 0; i < len; i++) buf[i] = raw.charCodeAt(i);
    return new Blob([buf], { type: mime });
  };

  const captureCard = async (): Promise<string | null> => {
    if (!resultRef.current) return null;

    if (document.fonts?.ready) await document.fonts.ready;
    await new Promise((r) => setTimeout(r, 500));

    const el = resultRef.current;

    const imgs = el.querySelectorAll('img');
    await Promise.all(Array.from(imgs).map((img) => {
      const i = img as HTMLImageElement;
      return (i.complete && i.naturalWidth > 0)
        ? Promise.resolve()
        : new Promise<void>((resolve) => { i.onload = () => resolve(); i.onerror = () => resolve(); });
    }));

    const animated = el.querySelectorAll<HTMLElement>('.animate-stamp-in, .transition-transform, .transition-all');
    animated.forEach((a) => { a.style.animation = 'none'; a.style.transition = 'none'; a.style.opacity = '1'; });

    const restorers: (() => void)[] = [];

    const cardW = el.offsetWidth;
    restorers.push(() => { el.style.width = ''; });
    el.style.width = cardW + 'px';

    const metaCells = el.querySelectorAll<HTMLElement>('.meta-cell');
    metaCells.forEach((c) => {
      const rect = c.getBoundingClientRect();
      if (rect.height > 0) {
        const origStyles = {
          height: c.style.height,
          minHeight: c.style.minHeight,
          width: c.style.width,
          display: c.style.display,
          whiteSpace: c.style.whiteSpace,
        };
        restorers.push(() => { Object.assign(c.style, origStyles); });
        c.style.height = rect.height + 'px';
        c.style.minHeight = rect.height + 'px';
        c.style.width = rect.width + 'px';
        c.style.display = 'table-cell';
        c.style.whiteSpace = 'nowrap';
      }
    });

    const gridEl = el.querySelector<HTMLElement>('.meta-grid');
    if (gridEl) {
      const rect = gridEl.getBoundingClientRect();
      if (rect.height > 0) {
        const origGStyles = {
          height: gridEl.style.height,
          display: gridEl.style.display,
          width: gridEl.style.width,
          tableLayout: gridEl.style.tableLayout,
        };
        restorers.push(() => { Object.assign(gridEl.style, origGStyles); });
        gridEl.style.height = rect.height + 'px';
        gridEl.style.width = rect.width + 'px';
        gridEl.style.display = 'table';
        gridEl.style.tableLayout = 'fixed';
      }
    }

    try {
      return await domToPng(el, { scale: 2, backgroundColor: '#fdf6e8' });
    } catch {
      try {
        const c = await domToCanvas(el, { scale: 2, backgroundColor: '#fdf6e8' });
        return c.toDataURL('image/png');
      } catch (e2) {
        console.error('captureCard failed:', e2);
        return null;
      }
    } finally {
      restorers.forEach((r) => r());
      animated.forEach((a) => { a.style.animation = ''; a.style.transition = ''; a.style.opacity = ''; });
    }
  };

  const handleShareOrSave = async () => {
    setIsExporting(true);
    triggerFeedback('Stamping your card...');

    try {
      const dataUrl = await captureCard();
      if (!dataUrl) throw new Error('Card rendering failed');

      const blob = dataUrlToBlob(dataUrl);
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

      setExportedImgUrl(dataUrl);
      setShowSaveModal(true);

      try {
        const a = document.createElement('a');
        a.download = `wartime-tuckshop-${result.id}.png`;
        a.href = dataUrl;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } catch (dlErr) {
        console.warn('Direct download prevented:', dlErr);
      }

      triggerFeedback('Stamp card ready! Tap and hold to save to Instagram.');
    } catch (error) {
      console.error(error);
      triggerFeedback('Could not generate card. Try taking a screenshot of this page!');
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
    } catch {
      triggerFeedback('Could not copy link.');
    }
    document.body.removeChild(textarea);
  };

  return (
    <div className="flex flex-col gap-3 animate-stamp-in">
      <p className="text-center font-serif italic text-[11px] sm:text-sm text-ink-faded uppercase tracking-[0.2em]">
        Your Food Personality is...
      </p>

      <div ref={resultRef} className="flex flex-col">
        <div
          className="relative bg-cream p-4 sm:p-6"
          style={{
            '--result-color': result.color,
            border: '3px double var(--color-border)',
          } as CSSProperties}
        >
          <h2 className="font-serif text-lg sm:text-2xl font-extrabold text-center text-ink tracking-tight mb-2 sm:mb-3 leading-tight">
            Wartime Tuckshop
          </h2>

          <div className="relative mb-3 flex items-center justify-center bg-transparent h-24 sm:h-32 gap-2 sm:gap-3">
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
                className="font-serif text-[8px] sm:text-[10px] font-semibold uppercase tracking-[0.15em] px-2 py-0.5 border rounded-sm whitespace-nowrap"
                style={{ color: result.color, borderColor: `${result.color}50`, backgroundColor: `${result.color}08` }}
              >
                {trait}
              </span>
            ))}
          </div>

          <p className="font-serif text-[11px] sm:text-[13px] leading-[1.7] text-ink-light mb-3 text-center whitespace-pre-line px-1">
            {result.description}
          </p>

          <div className="meta-grid mb-3 text-center bg-cream/50 border border-border/80 rounded-xs overflow-hidden" style={{ display: 'table', width: '100%', tableLayout: 'fixed' }}>
            <div style={{ display: 'table-row' }}>
              <div className="meta-cell border-b border-r border-border/85" style={{ display: 'table-cell', width: '50%', padding: 0 }}>
                <div className="flex flex-col h-full p-2 sm:p-2.5">
                  <span className="text-[7px] sm:text-[8px] font-sans font-bold text-accent uppercase tracking-[0.2em] leading-tight whitespace-nowrap text-center">Core Strength</span>
                  <div className="flex-1 flex items-center justify-center">
                    <span className="text-[9px] sm:text-[11px] font-serif text-ink-light leading-snug whitespace-normal text-center">{result.strength}</span>
                  </div>
                </div>
              </div>
              <div className="meta-cell border-b border-border/85" style={{ display: 'table-cell', width: '50%', padding: 0 }}>
                <div className="flex flex-col h-full p-2 sm:p-2.5">
                  <span className="text-[7px] sm:text-[8px] font-sans font-bold text-accent uppercase tracking-[0.2em] leading-tight whitespace-nowrap text-center">Natural Blindspot</span>
                  <div className="flex-1 flex items-center justify-center">
                    <span className="text-[9px] sm:text-[11px] font-serif text-ink-light leading-snug whitespace-normal text-center">{result.weakness}</span>
                  </div>
                </div>
              </div>
            </div>
            <div style={{ display: 'table-row' }}>
              <div className="meta-cell border-r border-border/85" style={{ display: 'table-cell', width: '50%', padding: 0 }}>
                <div className="flex flex-col h-full p-2 sm:p-2.5">
                  <span className="text-[7px] sm:text-[8px] font-sans font-bold text-accent uppercase tracking-[0.2em] leading-tight whitespace-nowrap text-center">Pairs Well With</span>
                  <div className="flex-1 flex items-center justify-center">
                    <span className="text-[9px] sm:text-[11px] font-serif font-bold leading-snug whitespace-pre-line text-center" style={{ color: result.color }}>{result.pairs}</span>
                  </div>
                </div>
              </div>
              <div className="meta-cell" style={{ display: 'table-cell', width: '50%', padding: 0 }}>
                <div className="flex flex-col h-full p-2 sm:p-2.5">
                  <span className="text-[7px] sm:text-[8px] font-sans font-bold text-accent uppercase tracking-[0.2em] leading-tight whitespace-nowrap text-center">Clashes With</span>
                  <div className="flex-1 flex items-center justify-center">
                    <span className="text-[9px] sm:text-[11px] font-serif text-ink-light leading-snug whitespace-pre-line text-center">{result.clashes}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-paper/40 border-l-2 border-accent/40 p-2.5 sm:p-3 mb-2">
            <p className="text-[7px] sm:text-[8px] font-sans font-bold text-accent uppercase tracking-[0.15em] mb-1">Food Fact</p>
            <p className="text-[9px] sm:text-[11px] font-serif text-ink-faded italic leading-[1.6]">{result.fact}</p>
          </div>

          <div className="flex justify-between items-center pt-2 border-t border-border/50 text-[6.5px] sm:text-[8px] text-ink-faded whitespace-nowrap overflow-hidden">
            <span>TF-NUS Heritage Champions Programme</span>
            <span className="font-serif uppercase tracking-wider font-semibold">Wartime Tuckshop</span>
          </div>
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
          className="inline-flex items-center justify-center gap-1.5 w-full px-5 py-3.5 sm:px-6 sm:py-3.5 min-h-[48px] font-serif text-sm xs:text-sm sm:text-sm font-bold tracking-wide text-cream bg-ink border border-ink rounded-sm cursor-pointer shadow-sm hover:bg-accent hover:border-accent hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 disabled:opacity-60 disabled:pointer-events-none"
        >
          <Share2 className="w-4 h-4" />
          {isExporting ? 'Preparing card...' : 'Share Stamp Card'}
        </button>

        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
          {!isSharedResult && (
            <button
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 font-serif text-[11px] xs:text-[11px] text-ink-faded hover:text-ink hover:underline cursor-pointer transition-colors duration-200 min-h-[40px]"
            >
              <Copy className="w-3 h-3" />
              Copy link
            </button>
          )}

          <button
            onClick={onRestart}
            className="inline-flex items-center gap-1.5 font-serif text-[11px] xs:text-[11px] text-ink-faded hover:text-ink hover:underline cursor-pointer transition-colors duration-200 min-h-[40px]"
          >
            <RotateCcw className="w-3 h-3" />
            {isSharedResult ? 'Take the Quiz' : 'Retake'}
          </button>

          <a
            href="https://www.instagram.com/wartime_tuckshop"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 font-serif text-[11px] xs:text-[11px] text-ink-faded hover:text-ink hover:underline transition-colors duration-200 min-h-[40px]"
          >
            <Instagram className="w-3 h-3" />
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
