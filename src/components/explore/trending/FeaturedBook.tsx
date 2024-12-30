import React from 'react'


function FeaturedBook() {
  return (
    <div className="flex sm:flex-col sm:space-y-4 py-4 items-center w-full h-full justify-center px-20 halfxl:px-10 sm:px-4 space-x-20 halflg:space-x-12 sm:space-x-6 ">

        <div className="flex flex-col w-2/5 sm:w-full space-y-5 sm:space-y-3 text-white">
          <p className="font-black text-5xl halfxl:text-3xl sm:text-lg bg-gradient-to-r from-white to-white/50 inline-block text-transparent bg-clip-text">Our Feautured book for this week is A Room With A View by E.M. Forster.</p>
          <p className="text-xl halfxl:text-lg font-light md:hidden">A Room with a View is a 1908 novel by English writer E. M. Forster, about a young woman in the restrained culture of Edwardian-era England. Set in Italy and England, the story is both a romance and a humorous critique of English society at the beginning of the 20th century.</p>
          <p className="text-xl halfxl:text-lg sm:text-sm font-light">Delve into this world <span className="font-bold underline">here.</span> </p>
        </div>

        <div className="relative flex w-3/5 sm:w-4/5 h-fit bg-[#7F60F9]/50 rounded-2xl pl-6 pr-2 py-2">

              <img
                className="rounded-2xl z-10 w-full h-full"
                src="/featured-book.png" 
                alt="cover of 'The Long Way'"
              />
 
        </div>

    </div>
  )
}

export default FeaturedBook