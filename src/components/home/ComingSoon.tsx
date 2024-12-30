import React from 'react'


function ComingSoon() {
  return (
    <div className="h-full w-full grid grid-cols-2 lg:grid-rows-2 lg:h-fit px-28 xl:px-24 halfxl:px-10 lg:px-4 sm:px-2 py-10 md:py-4 sm:py-2 gap-4 sm:gap-2">

        <div className="flex flex-col lg:space-y-4 w-full justify-between bg-[#141414] row-span-2 lg:col-span-2 py-10 sm:py-4 px-8 sm:px-4">
            <p className="text-[#a5a5a5] font-mono sm:text-xs">INTERCHAIN ACCOUNTS</p>
            <div className="flex w-fit h-fit items-center justify-center text-white lg:hidden">
              <img 
                className="w-[700px] h-full"
                src="/interchain.png"
                alt=""
              />
            </div>
        
            <div className="flex flex-col space-y-10 -mt-10">
              <p className="text-6xl lg:text-4xl sm:text-xl font-black bg-gradient-to-r from-white to-white/40 text-transparent bg-clip-text">Authors get paid in native tokens for their content. </p>
              <p className="text-[#a5a5a5] text-sm sm:text-xs">COMING SOON</p>
            </div>
        
        </div>

        <div className="flex w-full bg-[#141414] py-10 px-4 sm:py-4">
            <div className="flex w-1/2 flex-col justify-between">
              <p className="text-[#a5a5a5] font-mono sm:text-xs">DECENTRALIZED EXCHANGE</p>
              <p className="text-5xl lg:text-4xl sm:text-base font-black bg-gradient-to-r from-white to-white/40 text-transparent bg-clip-text">Connect with Knovel storytellers. </p>
              <p className="text-[#a5a5a5] text-sm sm:text-xs">COMING SOON</p>
            </div>

            <div className="flex w-1/2 self-center lg:hidden">
              <img 
                  className="w-fit h-full"
                  src="/book.png"
                  alt=""
              />
            </div>
        
        </div>

        <div className="flex w-full bg-[#141414] py-10 px-4 sm:py-4 text-white">
            <div className="flex flex-col w-1/2 justify-between">
              <p className="text-[#a5a5a5] sm:text-xs font-mono">WEEKLY COMPETITIONS</p>
              <p className="text-5xl lg:text-4xl sm:text-base font-black bg-gradient-to-r from-white to-white/40 text-transparent bg-clip-text">Weekly community-led writing competitions. </p>
              <p className="text-[#a5a5a5] text-sm sm:text-xs">COMING SOON</p>
            </div>
            
            <div className="flex w-1/2 self-center lg:hidden">
              <img 
                className="w-[300px] h-full"
                src="/badge.png"
                alt=""
              />
            </div>
            
        </div>
  
    </div>
  )
}

export default ComingSoon