import React from 'react'

type Props = {}

function Violet({}: Props) {
  return (
    <div className='w-[20px] h-[90px] absolute z-30'>
      <div className="w-full h-full bg-gradient-to-b from-[#8d00ff] via-[#2d08f7] to-[#8d00ff] border-4 border-[#7a00fd] rounded-full animate-spin2"/>

    </div>
  )
}

export default Violet