import React from 'react'
import ProfileHead from './ProfileHead'

type Props = {
  userImage ?: string;
  username ?: string;
  name ?: string;
  isFollowing : boolean;
  profileId: string;
}

function ProfileTop({userImage, name, username, isFollowing, profileId}: Props) {


  const toggleFollow = async (id: string) => {

  }

  return (
    <div className="w-full h-full">
          <div className="flex space-x-3 items-center">
              <ProfileHead 
                  userImage={userImage}
              />
              
              <div className="flex flex-col">
                  <p>{name}</p>
                  <p className="text-sm">@{username}</p>  
              </div>
           
              {isFollowing ? (
                  <div className="border-[0.1px] bg-[#0b0b0b] border-white/30 px-6 py-1 rounded-xl">
                    <p>following</p>
                  </div>
                ) : (
                  <div onClick={() => toggleFollow(profileId)} className="bg-[#7F60F9] px-4 py-2 h-fit rounded-xl">
                    <p className="text-sm font-bold">follow</p>
                  </div> 
              )}
          </div>
    </div>
  )
}

export default ProfileTop