import React from 'react'
import Rect from './Rect'

type Props = {
  selected ?: number;
  setScreen : (value: number) => void;
}

function Multirect({selected, setScreen}: Props) {
  return (
    <div className='flex space-x-1 w-fit h-fit'>
      <Rect onClick={() => setScreen(0)} isSelected={selected == 0 ? true : false} />
      <Rect onClick={() => setScreen(1)} isSelected={selected == 1  ? true : false} />
    </div>
  )
}

export default Multirect