import React, { useState } from 'react'

type Props = {
  feeds: any[];
}

function FeedHeader({feeds}: Props) {
  const [selectedFeed, setSelectedFeed] = useState<string>('recommendations');

  return (
    <div className="flex items-center justify-center w-full h-full space-x-2 py-4  text-white">
       {feeds.map((feed, index) => (
          <div onClick={() => setSelectedFeed(feed.title)} key={index} 
            className={`text-sm p-1 px-2 hover:cursor-pointer rounded-xl 
            ${selectedFeed == feed.title ? 'bg-[#3f444e]' : 'border-[0.5px] border-white/50'}`}>
            <p className="text-white">{feed.title}</p>
          </div>
        ))}
    </div>
  )
}

export default FeedHeader