import XMark from '@/components/icons/XMark'
import React from 'react'

type Props = {
  onCancel ?: () => void;
}

function ClaimedNft({onCancel}: Props) {

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 bg-gray-900 bg-opacity-80 flex justify-center items-center z-50 text-base">
        <div className="relative flex flex-col w-3/5 sm:w-[300px] sm:p-4 h-fit bg-black/90 text-white rounded-xl shadow-lg py-10 px-16 sm:text-sm">
            <div className="flex flex-col mb-4 space-y-2 items-center text-center">
                  <p className='text-4xl font-extrabold'>This object has already been claimed.</p>
            </div>
            <XMark 
              onClick={onCancel} 
              className="hover:cursor-pointer stroke-white absolute right-3 top-3 size-5"
            />

        </div>
    </div>
  )
}

export default ClaimedNft