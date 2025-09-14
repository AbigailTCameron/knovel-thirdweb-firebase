import React from 'react'
import Rect from './Rect'

type Props = {
  selected ?: number;
  setScreen ?: any;
}

function Multirect({selected, setScreen}: Props) {
  return (
    <div className='flex space-x-1 w-fit h-fit'>
      <Rect onClick={() => setScreen(0)} isSelected={selected == 0 ? true : false} />
      <Rect onClick={() => setScreen(1)} isSelected={selected == 1  ? true : false} />
      <Rect onClick={() => setScreen(2)} isSelected={selected == 2 ? true: false}/>
      <Rect onClick={() => setScreen(3)} isSelected={selected == 3 ? true: false}/>
    </div>
  )
}

export default Multirect