import React from 'react'

type Props = {
  isSelected ?: boolean;
}

function Dot({isSelected}: Props) {
  return (
    <div 
      className={`rounded-full w-[10px] h-[10px] ${isSelected && "bg-white"} bg-[#262629]`}>
    </div>
  )
}

export default Dot