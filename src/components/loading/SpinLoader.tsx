import React from 'react'
import Blue from './Spin/blue'
import Lime from './Spin/lime'
import Violet from './Spin/violet'
import Pink from './Spin/pink'
import Orange from './Spin/orange'

type Props = {}

function SpinLoader({}: Props) {
  return (
    <div className="flex w-screen h-screen items-center justify-center relative">
      <Blue />
      <Lime />
      <Violet />
      <Pink />
      <Orange />
    </div>
  )
}

export default SpinLoader