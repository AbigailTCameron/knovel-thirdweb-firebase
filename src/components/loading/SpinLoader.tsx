import React from 'react'

type Props = {}

function SpinLoader({}: Props) {
  return (
    <div className="flex w-screen h-screen items-center justify-center relative animate-spinSlow">
      <div className="w-[100px] h-1/2 bg-[#3547bb] border-4 opacity-[.97] border-[#4250bf] rounded-full absolute z-50"/>
    
      <div  className="w-[100px] h-1/2 bg-gradient-to-b from-[#98eb00] via-[#707bd2] to-[#98eb00] border-4 border-[#76e900] rotate-[30deg] rounded-full absolute z-40"/>

      <div  className="w-[100px] h-1/2 bg-gradient-to-b from-[#8d00ff] via-[#2d08f7] to-[#8d00ff] border-4 border-[#7a00fd] rotate-[60deg] rounded-full absolute z-30"/>

      <div  className="w-[100px] h-1/2 bg-gradient-to-b from-[#ff27f2] via-[#700de6] to-[#ff05e4] border-4 border-[#ff00db] rotate-[90deg] rounded-full absolute z-20"/>

      <div  className="w-[100px] h-1/2 bg-gradient-to-b from-[#ff8322] via-[#8a3c7f] to-[#fb5000] border-4 border-[#f95d0d] rotate-[120deg] rounded-full absolute z-10"/>
    </div>
  )
}

export default SpinLoader