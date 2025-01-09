import React from 'react'

type Props = {}

function Butterfly({}: Props) {
  return (
    <div className="w-screen h-screen">
      <img 
        src="/loading.gif"
        alt="butterfly loading"
      />
    </div>
  )
}

export default Butterfly