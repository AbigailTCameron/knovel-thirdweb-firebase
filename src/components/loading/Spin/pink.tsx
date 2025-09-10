import React from 'react'

type Props = {}

function Pink({}: Props) {
  return (
    <div className='w-[20px] h-[90px] absolute z-20'>
      <div  className="w-full h-full bg-gradient-to-b from-[#ff27f2] via-[#700de6] to-[#ff05e4] border-4 border-[#ff00db] rounded-full animate-spin3"/>
    </div>
  )
}

export default Pink