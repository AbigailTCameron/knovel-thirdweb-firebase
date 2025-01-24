'use client'

import React from 'react';
import UserList from './UserList';

type Props = {
  count : number;
  searchResults: boolean;
  setSearchResults: Function;
}

function CommunityInfo({count, searchResults, setSearchResults}: Props) {

  return (
    <div className="flex w-screen h-full relative">
      {searchResults && (
        <div className="absolute z-10 w-1/3 h-full bg-[#0b0b0b] left-0 rounded-r-md">
          <UserList 
            setSearchResults={setSearchResults}
          />

        </div>
      )}
        <div className="flex flex-col text-white items-center mt-4">
            <p className="font-bold">placeholder</p>
        </div>
       

    </div>
  )
}

export default CommunityInfo