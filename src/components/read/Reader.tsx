import React, { useCallback, useEffect, useRef, useState } from 'react';
import { type Rendition} from 'epubjs';
import PopOut from './PopOut';
import ReadHeader from './ReadHeader';
import { BookChapters, BookMetadata } from '../../..';
import Footer from './Footer';
import { applyCustomTheme } from '../../../functions/read/fetch';


type Props = {
  chapters : BookChapters[];
  book : any;
  metadata ?: BookMetadata; 
  id: string;
  setShowChat: Function;
  showChat: boolean;
}

function Reader({chapters, book, metadata, id, setShowChat, showChat}: Props) {
  const [location, setLocation] = useState<string | number>(0);
  const [showChapters, setShowChapters] = useState(false);
  const containerRef = useRef(null);
  const renditionRef = useRef<Rendition | undefined>(undefined); 
  const screenWidth = window.innerWidth;
  const [highlightColor, setHighlightColor] = useState('yellow');
  const [fontSize, setFontSize] = useState(16); // Default font size in px




  useEffect(() => {
  
    const savedLocation = localStorage.getItem(`currentPage-${id}`);
    let initialLocationSet = false;

    if(book){
        book.opened.then(() => {
          const rendition = book.renderTo(containerRef.current, {
              flow: 'paginated',
              width: '100%',
              height: "100%"
          })

           // Apply the dynamic theme
          applyCustomTheme(rendition, screenWidth);

          // Listen for location changes
          rendition.on("locationChanged", (loc: React.SetStateAction<string | number>) => {
              if (!initialLocationSet) return; 
              setLocation(loc); 
              localStorage.setItem(`currentPage-${id}`, JSON.stringify(loc));
          })

          renditionRef.current = rendition;
          
            // Restore location if available
          if (savedLocation) {
              const parsedLocation = JSON.parse(savedLocation);
              rendition.display(parsedLocation.start) // Use `start` for precise positioning
              .then(() => {
                  initialLocationSet = true; // Mark location restoration as done
              })
              .catch((error: any) => {
                console.error("Error restoring location:", error);
                initialLocationSet = true; // Still mark it as done to avoid blocking
              });
          } else {
              rendition.display(location).then(() => {
                initialLocationSet = true; // Mark as initialized
              });
          }

        })
       
    }
      return () => {
          if(renditionRef.current){
            renditionRef.current.destroy()
          }
      };

  }, [id, screenWidth, showChat, book])

  const handleNext = () => {
    if (renditionRef.current) {
        renditionRef.current.next();
    }
  }

  const handlePrev = () => {
    if (renditionRef.current) {
      renditionRef.current.prev(); // Navigate to the previous page
    } 
  }

  // Inside Reader Component
const handleCancel = useCallback(() => {
  setShowChapters(false);
}, [setShowChapters]);

const handleIncreaseFontSize = () => {
  setFontSize((prev) => {
    const newSize = Math.min(prev + 2, 32); // Limit max font size to 32px
    if (renditionRef.current) {
      applyCustomTheme(renditionRef.current, newSize);
    }
    return newSize;
  });
};

const handleDecreaseFontSize = () => {
  setFontSize((prev) => {
    const newSize = Math.max(prev - 2, 12); // Limit min font size to 12px
    if (renditionRef.current) {
      applyCustomTheme(renditionRef.current, newSize);
    }
    return newSize;
  });
};
 
  return (
    <div className="w-full h-full flex flex-col items-center justify-center">

      <div className="h-[60px] flex transition-opacity duration-300 w-full">
         <ReadHeader 
           title={metadata?.title}
           setShowChapters={setShowChapters}
           showChapters={showChapters}
         />
       </div>

       <div className="flex flex-col bg-[#1e1e1e] rounded-xl w-full h-full">
          <div className=" relative flex w-full h-full bg-[#1e1e1e] px-2 ">
            <div ref={containerRef} className="w-full h-full bg-[#1e1e1e]"></div>
          
          </div>

          <div className="flex z-10 basis-1/12 py-2 bottom-0 w-full h-full">
            <Footer 
              highlightColor={highlightColor}
              setHighlightColor={setHighlightColor}
              setShowChat={setShowChat}
              handlePrev={handlePrev}
              handleNext={handleNext}
              handleIncreaseFontSize={handleIncreaseFontSize}
              handleDecreaseFontSize={handleDecreaseFontSize}
            />
          
          </div>

       
       </div>

      
     
      {showChapters && (
        <PopOut 
          chapters={chapters}
          onCancel={handleCancel}
          isOpen={showChapters}
          handleChapterChange={(href) => {
            if(renditionRef.current){
              renditionRef.current.display(href).catch((error) => {
                console.error("Error navigating to chapter:", error); 
              })
            }
            setShowChapters(false);
          }}
        />
      )}
     
    </div>
  )
}

export default Reader