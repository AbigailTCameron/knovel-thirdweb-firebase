import React, { useState } from 'react'
import FeaturedNft from './FeaturedNft';
import FeaturedBook from './FeaturedBook';

type Props = {
  setMintPopup: Function;
}

function Carousel({setMintPopup}: Props) {
  const [screen, setScreen] = useState<number>(0);
  
  return (
    <div className='w-full p-1 rounded-xl h-full' style={{ height: '50vh' }}>
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
            <div></div>
          ) : (
            <div></div>
          )
        }
    
      </div>
    </div>
  )
}

export default Carousel