import XMark from '@/components/icons/XMark';
import ProfilePhotoSettings from '@/components/settings/ProfilePhotoSettings';
import React, { useState } from 'react'
import { saveSettingsProfile } from '../../../../functions/settings/fetch';

type Props = {
  setSettingsPopup: Function;
  profileUrl?: string;
  userId ?: string;
  setProfileUrl : Function;
  oldFilePath : string;
  setOldFilePath : Function;
  name: string; 
  username: string
}

function SettingsPopup({setSettingsPopup, profileUrl, userId, setProfileUrl, oldFilePath, setOldFilePath, name, username}: Props) {
  const [fullname, setFullname] = useState<string>('');
  const [newUsername, setNewUsername] = useState<string>('');
  const [usernameTaken, setusernameTaken] = useState<boolean>(false);

  const handleSaveProfile = () => {
    if(userId){
      saveSettingsProfile(userId, fullname, newUsername, setusernameTaken);
    }
  }

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 backdrop-blur-md flex justify-center items-center z-50 text-base">
        <div className="relative flex flex-col w-1/3 xl:w-1/2 sm:w-3/4 h-fit max-h-3/4 bg-[#131418] border border-[#272831] text-white rounded-xl shadow-lg py-4 px-4 sm:text-sm">

            <div className='flex justify-between'>
                <p className="text-xl font-bold mb-2">Profile Information:</p>

                <XMark 
                  onClick={() => setSettingsPopup(false)}
                  className="hover:cursor-pointer hover:bg-[#1b1c22] hover:rounded-lg stroke-[#7c7a85] size-6"
                />
            </div>

            <ProfilePhotoSettings 
              profileUrl={profileUrl}
              userId={userId}       
              setProfileUrl={setProfileUrl}   
              oldFilePath={oldFilePath}
              setOldFilePath={setOldFilePath}
            />

            <div className="flex flex-col space-y-2">

                <div className="flex flex-col">
                  <p className="font-medium ss:text-sm">Display Name</p>
                  <input 
                    id="fullname" 
                    name="fullname"  
                    placeholder={name || "enter display name"} 
                    value={fullname}  
                    onChange={(e) => setFullname(e.target.value)}
                    className="focus:outline-none bg-[#262629] border border-[#2d2d32] w-full rounded-xl p-2"
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
                    className="focus:outline-none bg-[#262629] border border-[#2d2d32] w-full rounded-xl p-2"
                  />
                  {usernameTaken && <p className="text-red-500 text-sm">Username is already taken by another user.</p>}
                </div>
            </div>

            <div onClick={handleSaveProfile} className="flex my-2 items-center justify-center space-x-2 hover:cursor-pointer hover:bg-[#1b1c22] rounded-lg text-center text-lg w-full p-2 font-semibold">
              <p>Save</p>
            </div>


        </div>
    </div>
  )
}

export default SettingsPopup