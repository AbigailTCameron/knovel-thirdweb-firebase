import React from 'react'
import Profile from '../icons/Profile';

type Props = {
  userImage ?: string;
}

function ProfileHead({userImage}: Props) {
  return (
    <div className="">
      {userImage ? (
        <img 
         className="w-[70px] h-[70px] rounded-full"
         src={userImage}
       />
      ) : (
        <Profile 
          className="w-[60px] h-[60px] rounded-full"
        />
      )}
     

    </div>
  )
}

export default ProfileHead