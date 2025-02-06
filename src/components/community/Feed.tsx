import React, { useEffect, useState } from 'react'
import Recommendations from './Recommendations';
import { recommendedBooks } from '../../../functions/community/fetch';
import FeedHeader from './FeedHeader';
import UpdatedReading from '../book/UpdatedReading';
import Notifications from './Notifications';

type Props = {
  userGenres: string[];
  userId: string;
}

function Feed({userGenres, userId}: Props) {
  const [results, setResults] = useState([]);
  const [lastVisibleDoc, setLastVisibleDoc] = useState<any>(null); // Track last document



  const feeds = [
    {title: 'recommendations'},
    {title: 'reading'},
    {title: 'notifications'},

  ];

  const loadFeed = async() => {
    await recommendedBooks(userGenres, setResults, lastVisibleDoc, setLastVisibleDoc);
  }

  useEffect(() => {
    loadFeed();

  }, [])

  return (
    <div className="flex flex-col w-full h-full px-8 overflow-y-scroll">
        <div className="sticky top-0 w-full items-center justify-center z-40 backdrop-blur-md">
          <FeedHeader 
            feeds={feeds}
          />
        </div>

       
        <div className="flex w-full h-fit">
          <Recommendations 
            results={results}
            loadMore={loadFeed}
          />
        </div>

        <div className="flex w-full h-fit my-8">
          <UpdatedReading 
          
          />
        </div>

        <div className="flex w-full h-fit my-4">
          <Notifications 
            userId={userId}
          />
        </div>
       
    </div>
  )
}

export default Feed