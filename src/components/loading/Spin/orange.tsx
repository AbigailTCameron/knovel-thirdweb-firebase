import React from 'react'

type Props = {}

function Orange({}: Props) {
  return (
    <div className='w-[20px] h-[90px] absolute z-10'>
        <div className="w-full h-full bg-gradient-to-b from-[#ff8322] via-[#8a3c7f] to-[#fb5000] border-4 border-[#f95d0d] rounded-full animate-spin4"/>
    </div>
  )
}

export default Orange