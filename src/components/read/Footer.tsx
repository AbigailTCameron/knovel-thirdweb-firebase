import React, { useEffect, useRef, useState } from 'react'
import ArrowLeft from '../icons/ArrowLeft';
import ArrowRight from '../icons/ArrowRight';
import Chat from '../icons/Chat';
import WrenchIcon from '../icons/WrenchIcon';
import Mode from './Mode';
import ScrollOption from './ScrollOption';
import ProgressBar from './ProgressBar';

type Props = {
  handlePrev?: () => void;
  handleNext?: () => void;
  setShowChat: React.Dispatch<React.SetStateAction<boolean>>;
  handleIncreaseFontSize: () => void; // New prop
  handleDecreaseFontSize: () => void; // New prop
  setHighlightColor: (value: string) => void;
  highlightColor: string;
  toggleTheme: (theme: "light" | "dark") => void;
  toggleMode: (page: "paginated" | "scrolled-continuous") => void;
  theme: string;
  page: string;
  progressPercent: number;
  showSettings: boolean;
  setShowSettings: React.Dispatch<React.SetStateAction<boolean>>;
}

function Footer({handlePrev, handleNext, setShowChat, handleIncreaseFontSize, handleDecreaseFontSize, setHighlightColor, highlightColor, toggleTheme, theme, toggleMode, page, progressPercent, showSettings, setShowSettings}: Props) {
  const settingsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!showSettings) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (!settingsRef.current) return;
      const target = event.target as Node;
      if (!settingsRef.current.contains(target)) {
        setShowSettings(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showSettings, setShowSettings]);


  return (
    <div       
    className="relative flex w-full items-center justify-center space-x-4 h-fit">
        {showSettings && (
            <div 
            ref={settingsRef}
            className={`flex flex-col items-center absolute bottom-10 left-10 rounded-xl bg-[#1d242e] shadow-xl text-white p-6 space-y-4  ${theme === "light" && "bg-white"}`}>
              <ProgressBar 
                progressPercent={progressPercent}
                theme={theme}
              />
              <div className={`flex items-center rounded-xl backdrop-blur-md shadow-[0_0_20px_rgba(0,0,0,0.4)] ${theme === "light" ? "": "bg-slate-500 "}`}>

                <div 
                onClick={handleDecreaseFontSize}
                className={`px-8 h-[30px] flex items-center justify-center hover:cursor-pointer ${theme === "light" ? "hover:bg-[#7F60F9] hover:text-white text-slate-600" : "hover:bg-slate-800"} rounded-l-xl`}>
                  <p className={`text-base font-bold`}>-A</p>
                </div>

                <div onClick={handleIncreaseFontSize} 
                className={`px-8 h-[30px] flex items-center justify-center hover:cursor-pointer ${theme === "light" ? "hover:bg-[#7F60F9] hover:text-white text-slate-600" : "hover:bg-slate-800"} rounded-r-xl`}>
                  <p className="text-2xl font-bold">A+</p>
                </div>

              </div>
              <div className="flex space-x-6 items-center justify-center">
                <div onClick={() => setHighlightColor('red')} className={`${highlightColor === 'red' ? 'ring-2 ring-offset-2' : ''} w-[20px] h-[20px] rounded-full bg-red-500 hover:cursor-pointer`}> </div>
                <div onClick={() => setHighlightColor('yellow')} className={`${highlightColor === 'yellow' ? 'ring-2 ring-offset-2' : ''} w-[20px] h-[20px] rounded-full bg-yellow-200 hover:cursor-pointer`}> </div>
                <div onClick={() => setHighlightColor('blue')} className={`${highlightColor === 'blue' ? 'ring-2 ring-offset-2' : ''} w-[20px] h-[20px] rounded-full bg-blue-600 hover:cursor-pointer`}> </div>
              </div>

              <Mode 
                theme={theme}
                toggleTheme={toggleTheme}
              />


              <ScrollOption 
                page={page}
                toggleMode={toggleMode}
                theme={theme}
              />
            </div> 
        )}
      

        <div onClick={() => setShowSettings((prev) => !prev)} className="p-2 absolute left-2 rounded-xl hover:cursor-pointer">
          <WrenchIcon className={`size-6 fill-none ${theme === "light" ? "stroke-black" : "stroke-white"}`}/>
        </div>
        <div onClick={handlePrev} className={`p-2 ${theme === "light" ? "border border-black" : "bg-[#333438]"} rounded-xl hover:cursor-pointer`}>
          <ArrowLeft
            className={`size-6 ${theme === "light" ? "stroke-black" : "stroke-white"}`}
          />
        </div>

        <div onClick={handleNext} className={`p-2 ${theme === "light" ? "border border-black" : "bg-[#333438]"} rounded-xl hover:cursor-pointer`}>
          <ArrowRight
            className={` ${theme === "light" ? "stroke-black" : "stroke-white"} size-6`}
          />
        </div>

        <div onClick={() => setShowChat((prev: boolean) => !prev)} className={`p-2 absolute right-2 ${theme === "light" ? "bg-white" : "bg-[#333438]"} rounded-xl hover:cursor-pointer`}>
            <Chat 
              className={`${theme === "light" ? "stroke-[#7F60F9] fill-[#7F60F9]" : "stroke-white"} size-6`}
            />
        </div>

    </div>
  )
}

export default Footer