import React, { useEffect, useState } from 'react'
import { fetchUsernameResults, updateFollowList } from '../../../../../functions/community/fetch';
import { SearchedUser } from '../../../../..';
import { useRouter } from 'next/navigation';

type Props = {
  className ?: string;
  username: string;
  userId: string;
  author: string;
  tags: string[];
  imgSrc: string;
}

function AuthorCard({className, username, author, userId, tags, imgSrc}: Props) {
  const router = useRouter();
  const [usernameResults, setUsernameResults] = useState<SearchedUser[]>([]);
  

  const quickSearch = async() => {
    if(userId){
      await fetchUsernameResults(username, setUsernameResults, userId);
    }
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
      if (username) {
        quickSearch(); 
      } else {
        setUsernameResults([]); 
      }
  }, [username, userId]);


  return (
    <div className={`group relative flex flex-col hover:cursor-pointer ${className}`}>

      <div className='relative w-full h-full group-hover:hidden'>
          <img 
            className='w-full h-full block object-cover'
            src={imgSrc}
          />
          <div className='absolute bottom-0 flex flex-col self-center backdrop-blur-sm w-full items-center justify-center p-2 text-white'>
              <p className='text-3xl halfxl:text-xl ss:text-lg xs:text-base font-semibold'>
                {author}
              </p>

              <div className="flex space-x-2 font-semibold lg:hidden">
                {tags.map((tag) => (
                  <div className="bg-black/50 backdrop-blur-md rounded-full px-2 halfxl:px-1 py-1">
                      <p className="font-white halfxl:text-sm">{tag}</p>
                  </div>
                ))}
              </div>
          </div>

      </div>


      <div className='hidden scale-[0.9] group-hover:flex bg-white/10 backdrop-blur-md w-full h-full rounded-t-3xl shadow-xl shadow-white/20'>

          <div className='relative w-full h-full scale-[1.1]'>
              <img 
                className='w-full h-full block object-cover'
                src={imgSrc}
              />

              <div className='absolute bottom-0 flex flex-col self-center backdrop-blur-sm w-full items-center justify-center p-2 text-white'>
                  <p className='text-3xl halfxl:text-xl ss:text-lg xs:text-base font-semibold'>
                    {author}
                  </p>

                  <div className="flex space-x-2 font-semibold lg:hidden">
                    {tags.map((tag) => (
                      <div className="bg-black/50 backdrop-blur-md rounded-full px-2 halfxl:px-1 py-1">
                          <p className="font-white halfxl:text-sm">{tag}</p>
                      </div>
                    ))}
                  </div>
              </div>
          </div>

          {usernameResults.map((user) => (
            <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-4 ss:p-2 w-1/2 lg:w-3/4 ss:w-full space-y-2 rounded-2xl bg-white/20 backdrop-blur-md flex flex-col'>
    
                <div onClick={() => router.push(`/search?q=${encodeURIComponent(author)}`)} className="bg-black/60 backdrop-blur-md rounded-full px-4 py-3 sm:px-2 sm:py-1 text-center">
                      <p className="font-white font-bold sm:text-sm">Browse</p>
                </div>

                {user.isFollowing ? (
                  <div onClick={(e) => {
                    e.stopPropagation();
                    toggleFollow(user.id)
                  }} className="border-[0.1px] bg-[#0b0b0b] border-white/30 px-4 py-3 sm:px-2 sm:py-1 h-fit rounded-full text-center sm:text-sm">
                    <p className="font-white font-bold">following</p>
                  </div>
                ) : (
                  <div onClick={(e) => {
                    e.stopPropagation();
                    toggleFollow(user.id);
                    }}  className="bg-[#6244d9] px-4 py-3 sm:px-2 sm:py-1 h-fit rounded-full text-center sm:text-sm">
                     <p className="font-white font-bold">Follow</p>
                  </div> 
                )}

            </div>
          ))}

        
      </div>

    </div>
  )
}

export default AuthorCard