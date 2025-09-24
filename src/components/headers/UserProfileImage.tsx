import React from 'react'

type Props = {
  profileUrl: string;
  onClick ?:() => void;
}

function UserProfileImage({profileUrl, onClick}: Props) {
  return (
    <div onClick={onClick} className="rounded-full w-[35px] h-[35px]">
       {profileUrl && (
            <img 
              className="rounded-full w-full h-full"
              src={profileUrl}
            />
        )}
    </div>
  )
}

export default UserProfileImage