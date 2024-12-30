import React, { useEffect, useRef } from 'react';
import { BookChapters } from '../../..';
import Menu from '../icons/Menu';

type Props = {
  onCancel?: () => void;
  chapters?: BookChapters[];
  isOpen: boolean;
  handleChapterChange: (href: string) => void;
};

function PopOut({ onCancel, chapters, isOpen, handleChapterChange }: Props) {
  const popOutRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popOutRef.current && !popOutRef.current.contains(event.target as Node)) {
        onCancel?.(); // Call onCancel when clicking outside
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onCancel]);

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed top-0 left-0 w-full h-full bg-black/80 z-40"
          onClick={onCancel} // Close menu on overlay click
        />
      )}

      {/* PopOut */}
      <div
        className={`fixed top-0 left-0 h-full bg-black text-white z-50 transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ width: '33.33vw' }} // Take 1/3 of the viewport width
      >
        <div
          ref={popOutRef}
          className="flex flex-col h-full bg-black/80 text-white rounded-r-xl shadow-lg sm:text-sm overflow-y-auto"
        >
          {/* Menu Header */}
          <div
            onClick={onCancel}
            className="hover:cursor-pointer flex w-full h-fit items-center space-x-2 my-4 px-4"
          >
            <Menu className="size-4" />
            <p className="">CHAPTERS</p>
          </div>

          {/* Chapter List */}
          <div className="flex flex-col w-full h-full divide-y divide-slate-400 space-y-4 text-white/70">
            {chapters?.map((chapter, index) => (
              <div
                onClick={() => handleChapterChange(chapter.href)}
                className="flex flex-col w-full h-full justify-center hover:cursor-pointer px-4"
                key={index}
              >
                <p>{chapter.title}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default PopOut;