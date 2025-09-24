import React, { useEffect, useState } from 'react'
import FeaturedNft from './FeaturedNft';
import FeaturedBook from './FeaturedBook';
import Contest from './Contest';
import FeaturedAuthor from './FeaturedAuthor';

type Props = {
  setMintPopup: Function;
}

function Carousel({setMintPopup}: Props) {
  const [screen, setScreen] = useState<number>(0);
  const [swipeDirection, setSwipeDirection] = useState('left'); 

  useEffect(() => {
    const interval = setInterval(() => {
      setSwipeDirection('left');
      setScreen((prevPage) => (prevPage + 1) % 3);
    }, 8000); 

    return () => clearInterval(interval); 
  }, [])
  
  return (
    <div className='w-full p-1 rounded-xl h-[50vh] lg:h-[35vh]'>
      <div className={`flex w-full h-full items-center justify-center transition-transform duration-700 ease-in-out`}>
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

        ): ( 
          <FeaturedAuthor 
            key="author"
            screen={screen} 
            setScreen={setScreen}
          />

          )}
    
      </div>
    </div>
  )
}

export default Carousel