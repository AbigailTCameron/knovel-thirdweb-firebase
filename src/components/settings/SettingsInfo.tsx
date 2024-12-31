'use client'
import React, { useEffect, useState } from 'react'
import ProfilePhotoSettings from './ProfilePhotoSettings';
import { saveSettingsProfile } from '../../../functions/settings/fetch';

type Props = {
  userId ?: string
  profileUrl?: string
  setProfileUrl : Function
  oldFilePath : string;
  setOldFilePath : Function;
  name: string; 
  username: string
}

function SettingsInfo({userId, profileUrl, setProfileUrl, oldFilePath, setOldFilePath, name, username}: Props) {
  const [fullname, setFullname] = useState<string>('');
  const [newUsername, setNewUsername] = useState<string>('');
  const [usernameTaken, setusernameTaken] = useState<boolean>(false);


  const handleSaveProfile = () => {
    if(userId){
      saveSettingsProfile(userId, fullname, newUsername, setusernameTaken);
    }
  }


  return (
    <div className="flex flex-col items-center w-full h-full p-4 text-white">

      <p className="text-3xl sm:text-xl font-bold mb-2">Settings</p>

      <div className="bg-[#171717] w-1/2 lg:w-3/4 sm:w-full h-fit p-6 rounded-xl">
          <p className="font-bold text-xl sm:text-lg">Profile information</p>

          <p className='mt-4'>Profile</p>

          <ProfilePhotoSettings 
            profileUrl={profileUrl}
            userId={userId}       
            setProfileUrl={setProfileUrl}   
            oldFilePath={oldFilePath}
            setOldFilePath={setOldFilePath}
          />

          <div className="flex flex-col space-y-3 ss:space-y-2">
            <div className="flex flex-col">
              <p className="font-medium ss:text-sm">Display Name</p>
              <input 
                id="fullname" 
                name="fullname"  
                placeholder={name || "enter display name"} 
                value={fullname}  
                onChange={(e) => setFullname(e.target.value)}
                className="focus:outline-none bg-[#262629] border border-[#2d2d32] w-3/4 rounded-xl p-2"
              />
            </div>
          
            <div className="flex flex-col ">
              <p className='font-medium ss:text-sm'>Username</p>
              <input 
                id="username" 
                name="username" 
                placeholder={username || "enter username"} 
                value={newUsername}
                onChange={(e) => (
                  setNewUsername(e.target.value),
                  setusernameTaken(false)
                )}
                className="focus:outline-none bg-[#262629] border border-[#2d2d32] w-3/4 rounded-xl p-2"
              />
              {usernameTaken && <p className="text-red-500 text-sm">Username is already taken by another user.</p>}
            </div>
          

          </div>

          <div onClick={handleSaveProfile} className="flex text-center items-center mt-8 ss:mt-4 justify-center hover:cursor-pointer bg-white font-bold py-3 ss:py-2 rounded-3xl text-black w-1/4">
              <p>Save</p>
          </div>


      </div>
    
    </div>
  )
}

export default SettingsInfo