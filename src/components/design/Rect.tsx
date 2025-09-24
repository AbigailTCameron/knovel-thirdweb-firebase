import React from 'react'

type Props = {
  isSelected ?: boolean;
  onClick ?: () => void;
}

function Rect({isSelected, onClick}: Props) {
  return (
    <div
        onClick={onClick}
        className={`rounded-full w-[30px] h-[10px] hover:cursor-pointer ${isSelected && "bg-white"} bg-[#262629]`}>
    </div>
  )
}

export default Rect