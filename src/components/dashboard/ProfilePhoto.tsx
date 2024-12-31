import React from 'react';

type Props = {
  profileUrl ?: string; 
}

function ProfilePhoto({profileUrl}: Props) {
 
  return (
    <div className="w-full h-fit flex justify-center my-4 ss:my-2">

        <div className="w-[150px] h-[150px] md:w-[100px] md:h-[100px] ss:w-[70px] ss:h-[70px] rounded-full">
            {profileUrl ? (
              <img
              className={`w-full h-full rounded-full`}
              src={profileUrl}
              alt={`profile pic`}
              />
            ) : (
              <div className={`flex text-white bg-[#2a2929] w-full h-full rounded-full items-center justify-center`}>
                <p>no image</p>
              </div>
            )}
        </div>

    </div>
  )
}

export default ProfilePhoto