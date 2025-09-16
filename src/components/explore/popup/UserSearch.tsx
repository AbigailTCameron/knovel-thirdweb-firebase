import XMark from '@/components/icons/XMark'
import React, { useEffect, useState } from 'react'
import { SearchedUser } from '../../../..';
import { useRouter } from 'next/navigation';
import Profile from '@/components/icons/Profile';
import { fetchUsernameResults, updateFollowList } from '../../../../functions/community/fetch';

type Props = {
  setSearchResults: Function;
  userId: string;
}

function UserSearch({setSearchResults, userId}: Props) {
    const router = useRouter(); 
    const [searchQuery, setSearchQuery] = useState('');
    const [usernameResults, setUsernameResults] = useState<SearchedUser[]>([]);

    const quickSearch = async() => {
      await fetchUsernameResults(searchQuery, setUsernameResults, userId);
    }

    const toggleFollow = async(user: string) => {
      await updateFollowList(userId, user);
  
      // Update the local state to reflect follow/unfollow changes
      setUsernameResults((prevResults) =>
        prevResults.map((u) =>
          u.id === user ? { ...u, isFollowing: !u.isFollowing } : u
        )
      );
    }

    useEffect(() => {
        if (searchQuery) {
          quickSearch(); 
        } else {
          setUsernameResults([]); 
        }
    }, [searchQuery]);

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 backdrop-blur-md flex justify-center items-center z-50 text-base">
        <div className="relative flex flex-col w-1/4 h-fit bg-[#131418] border border-[#272831] text-white rounded-xl shadow-lg py-4 px-4 sm:text-sm">

          <div className="w-full place-self-center self-center flex space-x-2">
              <div className="flex items-center justify-center w-full border border-[#272831] rounded-xl p-0.5">
                  <input 
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex py-3 px-3 bg-inherit w-full h-full text-white/70 rounded-3xl focus:outline-none" 
                    placeholder="Search username..."
                  />
              </div>

              <XMark 
                onClick={() => setSearchResults(false)}
                className="hover:cursor-pointer hover:bg-[#1b1c22] hover:rounded-lg stroke-[#7c7a85] size-6"
              />
            </div>

       

            {usernameResults.length > 0 ? (
              <div className="flex flex-col w-full mt-6 space-y-2">
                {usernameResults.map((user) => (
                  <div onClick={() => router.push(`/profile/${user.id}`)} key={user.id} className="flex text-white w-full items-center rounded-xl justify-center hover:cursor-pointer hover:bg-[#1b1c22] p-2">
                    <div className="w-full flex items-center justify-between">

                        <div className="flex space-x-4">
                            {user.profilePicture ? (
                                <img 
                                  src={user.profilePicture}
                                  className="w-[50px] h-[50px] rounded-full"
                                />
                            ) : (
                              <Profile className="w-[50px] h-[50px] rounded-full stroke-white"/>
                            )}
                          

                            <div className="flex flex-col mx-2">
                                  <div className="flex items-center space-x-2">
                                    <p className="">{user.name}</p>  
                                    {user.verified && (
                                      <img 
                                        className="w-[20px] h-[20px]"
                                        src="/verified.png"
                                      />
                                    )}
                                  </div>
                                  
                                  
                                  <p className="text-sm">@{user.username}</p>
                            </div>
                        </div>

                        {user.isFollowing ? (
                          <div onClick={(e) => {
                            e.stopPropagation();
                            toggleFollow(user.id)
                          }} className="border-[0.1px] bg-[#0b0b0b] border-white/30 px-6 py-1 rounded-xl">
                            <p>following</p>
                          </div>
                        ) : (
                          <div onClick={(e) => {
                            e.stopPropagation();
                            toggleFollow(user.id);
                            }} className="bg-[#7F60F9] px-4 py-2 h-fit rounded-xl">
                            <p className="text-sm font-bold">follow</p>
                          </div> 
                        )}

                      
                    </div>
                  </div>

                ))}
            
              </div>
            ) : (
              <div className="w-full items-center justify-center text-[#eeeef0] text-center">
                <p>No results found</p>
              </div>
            )}
        </div>
    </div>
  )
}

export default UserSearch