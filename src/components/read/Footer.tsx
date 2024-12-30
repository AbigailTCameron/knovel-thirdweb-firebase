import React from 'react'
import ArrowLeft from '../icons/ArrowLeft';
import ArrowRight from '../icons/ArrowRight';
import Chat from '../icons/Chat';

type Props = {
  handlePrev?: () => void;
  handleNext?: () => void;
  setShowChat: Function;
}

function Footer({handlePrev, handleNext, setShowChat}: Props) {
  return (
    <div className="relative flex w-full items-center justify-center space-x-4 h-fit">
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