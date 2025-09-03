import React, { useState } from 'react'
import Multidot from '../design/Multidot';
import ArrowRight from '../icons/ArrowRight';

type Props = {
  screen ?: number;
  setScreen ?: any;
  profileUrl ?: string; 
}

function Info({screen, setScreen, profileUrl}: Props) {
  const [bio, setBio] = useState("");
  return (
    <div className="flex flex-col w-full h-full items-center justify-center text-white">
    <div className='flex flex-col space-y-4 bg-[#131418] items-center justify-center w-1/4 h-fit shadow-2xl text-center inset-shadow shadow-white/50 rounded-lg p-8'>
      <p className='text-white text-xs font-semibold'>PROFILE INFORMATION</p>

      <p className='text-white'>Tell us about yourself</p>

      <div className="flex items-center space-x-2">
          <div className="w-[100px] h-[100px] rounded-full">
                {profileUrl ? (
                    <img
                      className="w-full h-full rounded-full"
                      src={profileUrl}
                      alt={`profile pic`}
                    />
                ) : (
                  <div className="flex hover:cursor-pointer text-white bg-[#2a2929] p-2 text w-full h-full rounded-full text-center items-center justify-center">
                    <p>Upload Photo</p>
                  </div>
                )}
          </div>

          <div className="bg-[#2a2929] rounded-2xl x-fit h-fit py-2 px-4">
            <p>Upload a photo</p>
          </div>
      </div>


       <p className='text-white/50 text-sm font-medium'>BIO</p>
      
       <textarea 
         id="bio" 
         name="bio" 
         placeholder={"enter short bio"} 
         value={bio}
         onChange={(e) => (
           setBio(e.target.value)
         )}
         className="focus:outline-none bg-inherit bg-gray-700 w-3/4 rounded-2xl p-2"
       />

       <div className='flex bg-[#262629] h-fit w-fit p-2 rounded-full hover:cursor-pointer'
        onClick={() => setScreen((prev:number) => prev + 1)}>
           <ArrowRight className="stroke-[#FFFFFF] size-6"/>
       </div>

       <Multidot selected={screen}/>

     </div></div>
  )
}

export default Info