import React, { useState } from 'react'
import ArrowLeft from '../icons/ArrowLeft';
import ArrowRight from '../icons/ArrowRight';
import Chat from '../icons/Chat';
import WrenchIcon from '../icons/WrenchIcon';

type Props = {
  handlePrev?: () => void;
  handleNext?: () => void;
  setShowChat: Function;
  setHighlightColor: Function;
  highlightColor: string;
  handleIncreaseFontSize: () => void; // New prop
  handleDecreaseFontSize: () => void; // New prop
}

function Footer({handlePrev, handleNext, setShowChat, setHighlightColor, highlightColor, handleIncreaseFontSize, handleDecreaseFontSize}: Props) {
  const [showSettings, setShowSettings] = useState(false);

  
  return (
    <div className="relative flex w-full items-center justify-center space-x-4 h-fit">
        {showSettings && (
            <div className="absolute bottom-10 left-10 rounded-xl bg-[#1d242e] text-white p-6 space-y-4">
              <div className="flex items-center bg-slate-500 rounded-xl">

                <div 
                onClick={handleDecreaseFontSize}
                className="px-8 h-[30px] flex items-center justify-center hover:cursor-pointer hover:bg-slate-800 rounded-l-xl">
                  <p className="text-base font-bold">A</p>
                </div>

                <div onClick={handleIncreaseFontSize} className="px-8 h-[30px] flex items-center justify-center hover:cursor-pointer hover:bg-slate-800 rounded-r-xl">
                  <p className="text-2xl font-bold">A</p>
                </div>

              </div>

              <div className="flex space-x-6 items-center justify-center">
                <div onClick={() => setHighlightColor('red')} className={`${highlightColor === 'red' ? 'ring-2 ring-offset-2' : ''} w-[20px] h-[20px] rounded-full bg-red-500 hover:cursor-pointer`}> </div>
                <div onClick={() => setHighlightColor('yellow')} className={`${highlightColor === 'yellow' ? 'ring-2 ring-offset-2' : ''} w-[20px] h-[20px] rounded-full bg-yellow-200 hover:cursor-pointer`}> </div>
                <div onClick={() => setHighlightColor('blue')} className={`${highlightColor === 'blue' ? 'ring-2 ring-offset-2' : ''} w-[20px] h-[20px] rounded-full bg-blue-600 hover:cursor-pointer`}> </div>
              </div>
            </div> 
        )}
      


        <div onClick={() => setShowSettings((prev) => !prev)} className="p-2 absolute left-2 rounded-xl hover:cursor-pointer">
          <WrenchIcon className="size-6 stroke-white"/>
        </div>
        <div onClick={handlePrev} className="p-2 bg-[#333438] rounded-xl hover:cursor-pointer">
          <ArrowLeft
            className="stroke-[#FFFFFF] size-6"
          />
        </div>

        <div onClick={handleNext} className="p-2 bg-[#333438] rounded-xl hover:cursor-pointer">
          <ArrowRight
            className="stroke-[#FFFFFF] size-6"
          />
        </div>

        <div onClick={() => setShowChat((prev: boolean) => !prev)} className="p-2 absolute right-2 bg-[#333438] rounded-xl hover:cursor-pointer">
            <Chat 
              className="stroke-[#FFFFFF] size-6"
            />
        </div>

    </div>
  )
}

export default Footer