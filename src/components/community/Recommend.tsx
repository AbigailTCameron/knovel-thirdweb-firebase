import React, { useEffect, useState } from 'react'
import { recommendedBooks } from '../../../functions/community/fetch';
import Recommendations from './Recommendations';

type Props = {
  userGenres: string[];
}

function Recommend({userGenres}: Props) {
  const [results, setResults] = useState([]);
  const [lastVisibleDoc, setLastVisibleDoc] = useState<any>(null); // Track last document
  

  const loadFeed = async() => {
    await recommendedBooks(userGenres, setResults, lastVisibleDoc, setLastVisibleDoc);
  }

  useEffect(() => {
    loadFeed();
  }, [])
  
  return (
    <div className="flex flex-col w-full h-fit space-y-1">
  
      <div className='bg-[#1b1c22] w-fit text-[#eeeef0] px-2 rounded-lg'>
         <p className="font-semibold">Recommended</p>
      </div>

      <Recommendations 
        results={results}
        loadMore={loadFeed}
      />

    </div>
  )
}

export default Recommend