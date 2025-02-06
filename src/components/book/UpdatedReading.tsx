import React from 'react'

type Props = {}

function UpdatedReading({}: Props) {
  return (
    <div className="flex flex-col w-full overflow-hidden text-white">
      <p className="text-xl font-bold">Continue Reading:</p>

      <div className="flex w-full h-full items-center justify-center">
        <p>You have no updated books being read</p>
      </div>
    </div>
  )
}

export default UpdatedReading