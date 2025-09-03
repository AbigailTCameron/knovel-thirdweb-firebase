import React from 'react'
import Dot from './Dot'

type Props = {
  selected ?: number;
}

function Multidot({selected}: Props) {
  return (
    <div className='flex space-x-1'>
      <Dot isSelected={selected == 0 ? true : false} />
      <Dot isSelected={selected == 1  ? true : false} />
      <Dot isSelected={selected == 2 ? true: false}/>
    </div>
  )
}

export default Multidot