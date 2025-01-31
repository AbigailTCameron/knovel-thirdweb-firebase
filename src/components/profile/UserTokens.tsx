import React from 'react'

type Props = {}

function UserTokens({}: Props) {
  return (
    <div className="flex flex-col space-y-2 w-full h-full">
      <p className="font-semibold text-xl">Top Tokens</p>
      <div className="flex w-full h-full bg-[#1b1c1e] rounded-xl text-center justify-center items-center">
        <p>No tokens created yet</p>
      </div>
    </div>
  )
}

export default UserTokens