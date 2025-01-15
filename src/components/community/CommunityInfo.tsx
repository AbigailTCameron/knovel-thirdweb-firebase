'use client'

import React from 'react';

type Props = {
  count : number;
}

function CommunityInfo({count}: Props) {
  return (
    <div className="flex w-screen h-full justify-center">
        <div className="flex flex-col text-white items-center mt-4">
            <p className="font-bold">Following</p>
            <p className="text-sm">{count}</p>
        </div>
       

    </div>
  )
}

export default CommunityInfo