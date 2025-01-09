import React from 'react'

function UploadingBook() {
  return (
    <div className="flex w-full h-full bg-black text-white items-center justify-center font-mono">
      <div className="flex items-center whitespace-nowrap">
        <div className="overflow-hidden w-[10ch] animate-typing text-5xl">
          <p className="inline-block">updating book...</p>
        </div>
        {/* Blinking Cursor */}
        <div className="animate-blink border-r-4 border-white h-[4rem]"></div>
      </div>
     
    </div>
  )
}

export default UploadingBook