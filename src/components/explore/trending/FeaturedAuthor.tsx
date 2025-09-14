import Multirect from '@/components/design/Multirect';
import React from 'react'

type Props = {
  screen : number;
  setScreen ?: any;
}

function FeaturedAuthor({screen, setScreen}: Props) {
  return (
    <div className="flex flex-col rounded-2xl w-full h-full py-2 px-4 items-center justify-center text-white">
        <div className='flex w-full h-full items-center'>

          <div className="w-full flex basis-2/5 h-full items-center justify-center">
              <img
                className="w-fit h-full xl:w-[400px] xl:h-[400px] halflg:w-[300px] halflg:h-[300px] sm:w-[200px] sm:h-[200px] ss:w-[150px] ss:h-[150px]"
                src="/pris.png" 
                alt=""
                width={"1200"}
                height={"1600"}
              />
          
          </div>


          <div className="flex flex-col basis-3/5 space-y-5 text-white">
            <p className="font-black text-5xl halflg:text-3xl sm:text-lg bg-gradient-to-r from-white to-white/50 inline-block text-transparent bg-clip-text">Our Feautured author is Priscilla George.</p>
            <p className="text-xl halflg:text-lg sm:text-sm sm:line-clamp-4 font-light">She is the author of "Overcoming the Storm" and "Gracefully Broken".</p>
          </div>
        </div>

        <Multirect 
          setScreen={setScreen}
          selected={screen}
        />
    </div>
  )
}

export default FeaturedAuthor