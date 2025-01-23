'use client'

import React, { useEffect } from 'react';

type Props = {
  count : number;
  searchResults: boolean;
  usernameResults: any[];
}

function CommunityInfo({count, searchResults, usernameResults}: Props) {

  return (
    <div className="flex w-screen h-full justify-center">
      {searchResults && (
        <div>
        </div>
      )}
        <div className="flex flex-col text-white items-center mt-4">
            <p className="font-bold">Following</p>
            <p className="text-sm">{count}</p>
        </div>
       

    </div>
  )
}

export default CommunityInfo