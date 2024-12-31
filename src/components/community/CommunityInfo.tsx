'use client'

import React from 'react';
import Spline from '@splinetool/react-spline'; 

type Props = {}

function CommunityInfo({}: Props) {
  return (
    <div className="relative flex w-full h-full">
        <div className="absolute inset-0 w-full h-full">
            <Spline
              scene="https://prod.spline.design/PBQQBw8bfXDhBo7w/scene.splinecode" 
            />
        </div>

        <div className="absolute z-10 flex w-full h-full text-center items-center justify-center">
            <p className="font-black text-9xl xs:text-7xl bg-gradient-to-r from-[#7F60F9] via-[#c026d3] to-[#ec4899] inline-block text-transparent bg-clip-text">COMING SOON!</p>
        </div>
    </div>
  )
}

export default CommunityInfo