import React from 'react'

function FeaturedAuthor() {
  return (
    <div className="flex py-4 items-center w-full h-full justify-center px-36 halfxl:px-10 space-x-14 halflg:space-x-12 sm:space-x-6 ">
      <div className="flex flex-col w-1/2 space-y-5 text-white">
        <p className="font-black text-5xl halflg:text-3xl sm:text-lg bg-gradient-to-r from-white to-white/50 inline-block text-transparent bg-clip-text">Our Feautured author is Priscilla George.</p>
        <p className="text-xl halflg:text-lg sm:text-sm sm:line-clamp-4 font-light">She is the author of "Overcoming the Storm" and "Gracefully Broken".</p>
      </div>

      <div className="relative flex w-1/2 h-full items-center justify-center">
          <img
            className="rounded-full w-[600px] h-[600px] xl:w-[400px] xl:h-[400px] halflg:w-[300px] halflg:h-[300px] sm:w-[200px] sm:h-[200px] ss:w-[150px] ss:h-[150px] z-10"
            src="/pris.png" 
            alt=""
            width={"1200"}
            height={"1600"}
          />
      
      </div>

    </div>
  )
}

export default FeaturedAuthor