import React from 'react'
import ProfileHead from './ProfileHead'
import { updateFollowList } from '../../../functions/community/fetch';

type Props = {
  userId: string
  userImage ?: string;
  username ?: string;
  name ?: string;
  isFollowing : boolean;
  profileId: string;
  setIsFollowing: Function;
}

function ProfileTop({userId, userImage, name, username, isFollowing, profileId, setIsFollowing}: Props) {


  const toggleFollow = async () => {
    await updateFollowList(userId, profileId);
    setIsFollowing((prevState: boolean) => !prevState);
  }

  return (
    <div className="w-full h-full">
          <div className="flex space-x-2 w-full items-center lg:flex-col sm:flex-row">
              <ProfileHead 
                  userImage={userImage}
              />
              
              <div className="flex flex-col">
                  <p>{name}</p>
                  <p className="text-sm">@{username}</p>  
              </div>
           
              {isFollowing ? (
                  <div onClick={toggleFollow} className="hover:cursor-pointer border-[0.1px] bg-[#0b0b0b] border-white/30 px-6 py-1 rounded-xl">
                    <p>following</p>
                  </div>
                ) : (
                  <div onClick={toggleFollow} className="hover:cursor-pointer bg-[#7F60F9] px-4 py-2 h-fit rounded-xl">
                    <p className="text-sm font-bold">follow</p>
                  </div> 
              )}
          </div>
    </div>
  )
}

export default ProfileTop