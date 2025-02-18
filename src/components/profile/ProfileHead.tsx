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
         className="w-[60px] h-[60px] lg:w-[40px] lg:h-[40px] rounded-full"
         src={userImage}
       />
      ) : (
        <Profile 
          className="w-[60px] h-[60px] lg:w-[40px] lg:h-[40px] rounded-full"
        />
      )}
     

    </div>
  )
}

export default ProfileHead