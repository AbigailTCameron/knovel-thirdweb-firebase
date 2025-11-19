'use client'

import { useRouter } from 'next/navigation'
import React from 'react'


type Props = {}

function LandingHeader({}: Props) {
  const router = useRouter(); 

  return (
    <div className="flex z-10 justify-between w-full backdrop-blur-md text-white items-center font-mono text-sm px-6 md:p-8 py-4 sm:py-4 sm:px-2 xs:py-8">
      <div className="flex w-[150px] h-fit">
        <img 
          src={"/knovel-logo-full.png"}
          className="w-full h-full"
        />
      </div>

      <div onClick={() => router.push('/explore')} className="relative text-center rounded-3xl bg-white/30 overflow-hidden font-semibold group hover:cursor-pointer text-white">
        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white to-transparent opacity-50 animate-shine"></div>

          <p className="bg-transparent font-semibold px-6 py-4">Explore</p>
      </div>

    
  </div>
  )
}

export default LandingHeader