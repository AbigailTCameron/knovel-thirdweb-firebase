'use client'
import React, { useState } from 'react'
import ArrowRight from '../icons/ArrowRight'
import Multidot from '../design/Multidot';

type Props = {
  screen : number;
  setScreen ?: any;
  fullname: string;
  setFullName: (val: string) => void;
}

function Name({screen, setScreen, fullname, setFullName}: Props) {

    const handleCheckName = async() => {
        if(fullname?.trim() !== ""){
          setScreen((prev:number) => prev + 1)
        }else{
          alert("Please enter a display name before continuing.");
        }
    }
  
  
  return (
    <div className="flex flex-col w-full h-full items-center justify-center text-white">
       <div className='flex flex-col space-y-4 bg-[#131418] items-center justify-center w-1/3 h-1/4 shadow-2xl text-center inset-shadow shadow-white/50 rounded-lg p-8'>
          <p className='text-white font-medium text-xl'>What's your display name?</p>

          <input 
            id="fullname" 
            name="fullname"  
            placeholder={"enter display name"} 
            value={fullname}  
            onChange={(e) => setFullName(e.target.value)}
            className="focus:outline-none bg-inherit border border-white w-3/4 rounded-full p-2"
          />

          <div 
          onClick={handleCheckName}
          className={`flex h-fit w-fit p-2 bg-[#262629] rounded-full hover:cursor-pointer`}
          >
              <ArrowRight className="stroke-[#FFFFFF] size-6"/>
          </div>

          <Multidot selected={screen}/>
        </div>

   
    </div>
  )
}

export default Name