import React, { useCallback, useEffect, useRef, useState } from 'react';
import PopOut from './PopOut';
import ReadHeader from './ReadHeader';
import { BookChapters, BookMetadata, EpubBook, EpubRendition } from '../../..';
import Footer from './Footer';
import { applyCustomTheme, calculateFontSize } from '../../../functions/read/fetch';


type Props = {
  chapters : BookChapters[];
  book ?: EpubBook;
  metadata ?: BookMetadata; 
  id: string;
  setShowChat: React.Dispatch<React.SetStateAction<boolean>>;
  theme: string; 
  setTheme: (theme: "dark" | "light") => void;
}

function Reader({chapters, book, metadata, id, setShowChat, theme, setTheme}: Props) {
  const STORAGE_KEY = `reader:${id}`; // optionally include userId too

  const viewerRef = useRef<HTMLDivElement | null>(null);
  const [locationHref, setLocationHref] = useState<string | null>(null);
  const [rendition, setRendition] = useState<EpubRendition | null>(null);
  const [currentHref, setCurrentHref] = useState<string | null>(null);
  const [mode, setMode] = useState<"paginated" | "scrolled-continuous">("paginated");
  const [highlightColor, setHighlightColor] = useState('yellow');
  const [showChapters, setShowChapters] = useState(false);
  const [fontSize, setFontSize] = useState(() => {
    if (typeof window !== 'undefined') {
      return calculateFontSize(window.innerWidth);
    }
    return 20;
  });

  const [currentCfi, setCurrentCfi] = useState<string | null>(null);
  const [progress, setProgress] = useState(0); // 0–1 accurate progress
  const [locationsReady, setLocationsReady] = useState(false);
  const locationsReadyRef = useRef(false);
  const [showSettings, setShowSettings] = useState(false);
  

  // Load saved reader settings once on mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;

    try {
      const saved = JSON.parse(raw) as {
        fontSize?: number;
        mode?: "paginated" | "scrolled-continuous";
        theme?: "dark" | "light";
        currentHref?: string | null;
        currentCfi?: string | null;
        highlightColor?: string;
        progress?: number;
      };

      if (saved.fontSize) setFontSize(saved.fontSize);
      if (saved.mode) setMode(saved.mode);
      if (saved.theme) setTheme(saved.theme);
      if (saved.highlightColor) setHighlightColor(saved.highlightColor);
      if (saved.currentHref) setLocationHref(saved.currentHref);
      if (saved.currentCfi) setCurrentCfi(saved.currentCfi);
      if (typeof saved.progress === "number") setProgress(saved.progress);
    } catch (e) {
      console.warn("Failed to parse reader settings", e);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [STORAGE_KEY, setTheme]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const payload = {
      fontSize,
      mode,
      theme,
      currentHref,
      currentCfi,
      highlightColor,
      progress
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }, [fontSize, mode, theme, currentHref, currentCfi, highlightColor, progress, STORAGE_KEY]);

  // 📍 Generate locations for accurate percentage
  useEffect(() => {
      if (!book?.locations) return;
      let cancelled = false;

      (async() => {
        try{
           await book.locations!.generate(1024);
           if(!cancelled){
            setLocationsReady(true);
            locationsReadyRef.current = true;
           }
        }catch(e){
          console.error("Failed to generate locations", e);
        }
      })();

      return () => {
        cancelled = true;
      };
  }, [book])

  // 💡 NEW: recompute progress whenever we know more (locations or current pos)
  useEffect(() => {
    if (!book) return;

    // Prefer precise CFI-based progress when locations are ready
    if (currentCfi && book.locations?.percentageFromCfi && locationsReady) {
      const pct = book.locations.percentageFromCfi(currentCfi);
      setProgress(pct);
      return;
    }

    // Fallback: chapter-based progress by href
    if (currentHref && chapters.length > 0) {
      const idx = chapters.findIndex((ch) => ch.href === currentHref);
      if (idx >= 0) {
        setProgress((idx + 1) / chapters.length);
      }
    }
  }, [locationsReady, currentCfi, currentHref, book, chapters]);


  // Initialize/recreate rendition when book or mode changes
  useEffect(() => {
    if (!book || !viewerRef.current || !book.renderTo) return;

    // Clean a rendition
    const r: EpubRendition | null = book.renderTo(viewerRef.current, {
      width: "100%",
      height: "100%",
      flow: mode, 
      spread: "auto",
    }) as EpubRendition;

    // Decide initial display target once
    const initialTarget =
      currentCfi ??
      locationHref ??
      (chapters.length > 0 ? chapters[0].href : undefined);
  
    // If we have a saved href, go there first
    if(initialTarget) {
      r.display(initialTarget);
    } else {
      r.display();
    }

    const handleRelocated = (...args: unknown[]) => {
      const location = args[0] as { start?: { href?: string; cfi?: string } } | undefined;
      const href = location?.start?.href ?? null;
      const cfi = location?.start?.cfi ?? null;

      setCurrentHref(href);      
      if (cfi) setCurrentCfi(cfi);
    };

    r.on("relocated", handleRelocated);
    setRendition(r);

    // Cleanup when component unmounts or dependencies change
    return () => {
      r.off?.("relocated", handleRelocated);
      r?.destroy?.();
      setRendition(null);
    };

  }, [book, mode, chapters, locationHref])

  // 2) Apply theme + font-size whenever they change
  useEffect(() => {
    if (!rendition) return;
    applyCustomTheme(rendition, fontSize, theme); // register + select + base styles
    rendition.themes?.fontSize(`${fontSize}px`);  // ensure text size is updated
  }, [rendition, fontSize, theme]);


  // 3) Highlight handler that always sees latest highlightColor
  useEffect(() => {
    if (!rendition) return;
    const handleSelected = (arg: unknown) => {
      const cfiRange = typeof arg === "string" ? arg : null;
      if (!cfiRange) return;

      rendition.annotations?.add(
        "highlight",
        cfiRange,
        {},
        null,
        "epub-highlight",
        {
          fill: highlightColor,
          "fill-opacity": 0.3,
          "mix-blend-mode": "multiply",
        }
      );
    };
    rendition.on("selected", handleSelected);
    return () => {
      rendition.off?.("selected", handleSelected);
    };
  }, [rendition, highlightColor]);

  useEffect(() => {
    if (!rendition) return;
    const handleReaderClick = () => {
      setShowSettings(false);
    };

    // epub.js will call this for clicks inside the iframe content
    rendition.on("click", handleReaderClick);

    return () => {
      rendition.off?.("click", handleReaderClick);
    };
  }, [rendition, setShowSettings]);


  const handleNext = () => {
     rendition?.next?.();
  }

  const handlePrev = () => {
    rendition?.prev?.();
  }


  // Inside Reader Component
  const handleCancel = useCallback(() => {
    setShowChapters(false);
  }, [setShowChapters]);

  const increaseFont = () => setFontSize((prev) => Math.min(prev + 2, 32));
  const decreaseFont = () => setFontSize((prev) => Math.max(prev - 2, 12));

  const toggleTheme = (next: "dark" | "light") => {
    setTheme(next);
  }

  const toggleMode = (next: "paginated" | "scrolled-continuous") => {
    setMode(next)  
  }

  const progressPercent = Math.round(progress * 100);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">

      <div className="flex-none h-fit transition-opacity duration-300 w-full">
         <ReadHeader 
           title={metadata?.title}
           setShowChapters={setShowChapters}
           showChapters={showChapters}
           bookId={id}
           theme={theme}
         />
       </div>

       <div className={`flex-1 min-h-0 flex flex-col
          rounded-xl w-full ${theme === "light" ? "bg-white" : "bg-transparent"}`}>
          <div 
            onCopyCapture={(e) => e.preventDefault()}
            onCutCapture={(e) => e.preventDefault()}
            onContextMenuCapture={(e) => e.preventDefault()}
            className={` flex-1 min-h-0 relative w-full select-none ${theme === "light" ? "bg-[#f9fafb]": "bg-transparent"}`}>
            <div ref={viewerRef} className={`w-full h-full overflow-y-auto ${theme === "light" ? "bg-[#f9fafb]": "bg-[#7F60F9]/5 backdrop-blur-lg border-r border-l border-[#7F60F9]/15 shadow-[0_0_40px_rgba(0,0,0,0.5)]"}`}></div>
          </div>

          <div className={`flex-none z-10 py-2 w-full rounded-b-xl ${theme === "light" ? "bg-[#f9fafb]" : "bg-[#7F60F9]/10 border-b border-r border-l border-[#7F60F9]/15"}`}>
            <Footer 
              setShowChat={setShowChat}
              handlePrev={handlePrev}
              handleNext={handleNext}
              handleIncreaseFontSize={increaseFont}
              handleDecreaseFontSize={decreaseFont}
              highlightColor={highlightColor}
              setHighlightColor={setHighlightColor}
              toggleTheme={toggleTheme}
              theme={theme}
              toggleMode={toggleMode}
              page={mode}
              progressPercent={progressPercent}
              showSettings={showSettings}
              setShowSettings={setShowSettings}
            />
          
          </div>

       
       </div>

      
     
      {showChapters && (
        <PopOut 
          currentHref={currentHref}
          chapters={chapters}
          onCancel={handleCancel}
          isOpen={showChapters}
          handleChapterChange={(href) => {
            if (!rendition) return;
              rendition.display(href);
              setCurrentHref(href);
            setShowChapters(false);
          }}
        />
      )}
     
    </div>
  )
}

export default Reader