'use client'
import React, { useState } from 'react'
import ArrowRight from '../icons/ArrowRight'
import Multidot from '../design/Multidot';
import { checkUsername } from '../../../functions/new/fetch';

type Props = {
  screen ?: number;
  setScreen ?: any;
  username: string;
  setUsername: (val: string) => void;
}

function Username({screen, setScreen, username, setUsername}: Props) {
  const [usernameTaken, setUsernameTaken] = useState<boolean>(false);


  const handleCheckUsername = async() => {
      const taken = await checkUsername(username);
      if(taken){
        setUsernameTaken(true);
      }else{
        setUsernameTaken(false);
        setScreen((prev:number) => prev + 1)
      }
  }


  return (
    <div className="flex flex-col w-full h-full items-center justify-center text-white">
       <div className='flex flex-col space-y-4 bg-[#131418] items-center justify-center w-1/3 h-1/4 shadow-2xl text-center inset-shadow shadow-white/50 rounded-lg p-8'>
          <p className='text-white font-medium text-xl'>Choose a username</p>

          <input 
            id="username" 
            name="username" 
            placeholder={"enter username"} 
            value={username}
            onChange={(e) => (
              setUsername(e.target.value),
              setUsernameTaken(false)
            )}
            className="focus:outline-none bg-inherit border border-white w-3/4 rounded-full p-2"
          />

          {usernameTaken && (
            <p className="text-red-500 text-sm">Username is taken</p>
          )}

          <div className='flex bg-[#262629] h-fit w-fit p-2 rounded-full hover:cursor-pointer'
           onClick={handleCheckUsername}>
              <ArrowRight className="stroke-[#FFFFFF] size-6"/>
          </div>

          <Multidot selected={screen}/>

        </div>
    </div>
  )
}

export default Username