'use client'

import React from 'react';
import UserList from './UserList';

type Props = {
  count : number;
  searchResults: boolean;
  setSearchResults: Function;
  userId: string;
}

function CommunityInfo({searchResults, setSearchResults, userId}: Props) {

  return (
    <div className="flex w-screen h-full relative">
      {searchResults && (
        <div className="absolute z-10 w-1/3 h-full bg-[#0b0b0b] shadow-lg left-0 rounded-r-md">
          <UserList 
            setSearchResults={setSearchResults}
            userId={userId}
          />
        </div>
      )}
        <div className="flex flex-col text-white items-center justify-center text-center w-full h-full mt-4">
            <p className="font-bold">Feed not curated</p>
        </div>
       

    </div>
  )
}

export default CommunityInfo