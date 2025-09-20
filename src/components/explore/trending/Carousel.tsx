import React, { useState } from 'react'
import FeaturedNft from './FeaturedNft';
import FeaturedBook from './FeaturedBook';
import Contest from './Contest';
import FeaturedAuthor from './FeaturedAuthor';

type Props = {
  setMintPopup: Function;
}

function Carousel({setMintPopup}: Props) {
  const [screen, setScreen] = useState<number>(0);
  
  return (
    <div className='w-full p-1 rounded-xl h-[50vh] lg:h-[35vh]'>
      <div className='flex w-full h-full items-center justify-center'>
        {screen == 0 ? (
          <FeaturedNft
            screen={screen} 
            setScreen={setScreen}
            setMintPopup={setMintPopup} 
            key="nft"
          />
        ) : screen === 1 ? (
          <FeaturedBook 
            screen={screen} 
            setScreen={setScreen}
            key="book"
          />

        ): screen === 2 ? ( 
          <FeaturedAuthor 
            key="author"
            screen={screen} 
            setScreen={setScreen}
          />

          ) : (
            <div></div>
          )
        }
    
      </div>
    </div>
  )
}

export default Carousel