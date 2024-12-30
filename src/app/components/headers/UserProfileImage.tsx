import React from 'react'
import Profile from '../icons/Profile'

type Props = {
  profileUrl: string;
  onClick ?:() => void;
}

function UserProfileImage({profileUrl, onClick}: Props) {
  return (
    <div onClick={onClick} className="rounded-full w-[50px] h-[50px]">
       {profileUrl ? (
            <img 
              className="rounded-full w-full h-full"
              src={profileUrl}
            />

        ) : (
          <Profile className=' stroke-white'/>
        )}
    </div>
  )
}

export default UserProfileImage