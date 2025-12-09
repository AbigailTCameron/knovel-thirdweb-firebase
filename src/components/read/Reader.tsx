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
  const viewerRef = useRef<HTMLDivElement | null>(null);

  const [showChapters, setShowChapters] = useState(false);
  const [fontSize, setFontSize] = useState(() => {
    if (typeof window !== 'undefined') {
      return calculateFontSize(window.innerWidth);
    }
    // Fallback for SSR
    return 20;
  });

  const [rendition, setRendition] = useState<EpubRendition | null>(null);
  const [currentHref, setCurrentHref] = useState<string | null>(null);
  const [mode, setMode] = useState<"paginated" | "scrolled-doc">("paginated");
  const [highlightColor, setHighlightColor] = useState('yellow');



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
  
    // Display first chapter or default
    if (chapters.length > 0 && chapters[0].href) {
      r.display(chapters[0].href);
      //setCurrentHref(chapters[0].href);
    } else {
      r.display();
    }

    const handleRelocated = (...args: unknown[]) => {
      const location = args[0] as { start?: { href?: string } } | undefined;
      const href = location?.start?.href ?? null;
      setCurrentHref(href);               // ✅ OK: this is in a callback from epub.js
    };

    r.on("relocated", handleRelocated);

    setRendition(r);

    // Cleanup when component unmounts or dependencies change
    return () => {
      r.off?.("relocated", handleRelocated);
      r?.destroy?.();
      setRendition(null);
    };

  }, [book, mode, chapters])

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

const toggleMode = (next: "paginated" | "scrolled-doc") => {
  setMode(next)  
}
 
  return (
    <div className="w-full h-full flex flex-col items-center justify-center">

      <div className="h-[60px] flex transition-opacity duration-300 w-full">
         <ReadHeader 
           title={metadata?.title}
           setShowChapters={setShowChapters}
           showChapters={showChapters}
           bookId={id}
           theme={theme}
         />
       </div>

       <div className={`flex flex-col bg-[#1e1e1e] ${theme === "light" && "bg-white"} rounded-xl w-full h-full`}>
          <div className={`relative flex w-full h-full bg-[#1e1e1e] ${theme === "light" && "bg-white"} px-2`}>
            <div ref={viewerRef} className={`w-full h-full bg-[#1e1e1e] ${theme === "light" && "bg-white"}`}></div>
          </div>

          <div className="flex z-10 basis-1/12 py-2 bottom-0 w-full h-full">
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