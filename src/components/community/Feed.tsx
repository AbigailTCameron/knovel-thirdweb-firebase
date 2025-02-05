import React, { useEffect, useState } from 'react'
import Recommendations from './Recommendations';
import { recommendedBooks } from '../../../functions/community/fetch';
import FeedHeader from './FeedHeader';

type Props = {
  userGenres: string[];
}

function Feed({userGenres}: Props) {
  const [results, setResults] = useState([]);


  const feeds = [
    {title: 'recommendations'},
    {title: 'reading'},
    {title: 'notifications'},

  ];

  const loadFeed = async() => {
    await recommendedBooks(userGenres, setResults);
  }

  useEffect(() => {
    loadFeed();

  }, [])

  return (
    <div className="flex flex-col w-full h-full">
        <div className="sticky top-0 w-full items-center justify-center z-40">
          <FeedHeader 
            feeds={feeds}
          />
        </div>

       
        <div className="flex w-full h-fit">
          <Recommendations 
            results={results}
          />
        </div>
       
    </div>
  )
}

export default Feed