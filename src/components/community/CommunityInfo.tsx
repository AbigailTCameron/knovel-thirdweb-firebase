'use client'

import React, { useEffect, useState } from 'react';
import { fetchUsernameResults } from '../../../functions/community/fetch';
import UserList from './UserList';

type Props = {
  count : number;
  searchResults: boolean;
  usernameResults: any[];
  setUsernameResults: Function;
  setSearchResults: Function;
}

function CommunityInfo({count, searchResults, usernameResults, setUsernameResults, setSearchResults}: Props) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleUsernameSearch = async () => {
    if (searchQuery.trim()) {
      await fetchUsernameResults(searchQuery.trim(), setUsernameResults);
    }
  };

  useEffect(() => {
    console.log("the username results", usernameResults);
  }, [usernameResults])

  return (
    <div className="flex w-screen h-full relative">
      {searchResults && (
        
        <div className="absolute z-10 w-1/3 h-full bg-[#1c202a] left-0 rounded-r-md">
          <UserList 
            usernameResults={usernameResults}
            setSearchResults={setSearchResults}
            handleUsernameSearch={handleUsernameSearch}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
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