import React, { useEffect, useState } from 'react'
import FeaturedNft from './FeaturedNft';
import FeaturedAuthor from './FeaturedAuthor';
import Multirect from '@/components/design/Multirect';
import FeaturedCollection from './FeaturedCollection';

type Props = {
  setMintPopup: Function;
  userId: string;
}

function Carousel({setMintPopup, userId}: Props) {
  const [screen, setScreen] = useState<number>(0);
  const [swipeDirection, setSwipeDirection] = useState('left'); 

  useEffect(() => {
    const interval = setInterval(() => {
      setSwipeDirection('left');
      setScreen((prevPage) => (prevPage + 1) % 2);
    }, 10000); 

    return () => clearInterval(interval); 
  }, [])
  
  return (
    <div className='relative flex flex-col w-full p-1 rounded-xl h-[50vh] xxl:h-[45vh] xl:h-[40vh] lg:h-[35vh] halflg:h-[30vh] ss:h-[25vh]'>
      <div className={`flex flex-col w-full h-full items-center justify-center transition-transform duration-700 ease-in-out`}>
        {screen == 0 ? (
          <FeaturedCollection
            key="collection"
          />
        ) :(
            <FeaturedAuthor 
            key="author"
            userId={userId}
          />
        )}

          <div className="absolute bottom-0 z-20">
            <Multirect 
              setScreen={setScreen}
              selected={screen}
            />
          </div>
    
      </div>

    </div>
  )
}

export default Carousel