import React, { useEffect, useState } from 'react'
import { getRecommendedAuthors } from '../../../functions/profile/fetch';
import { SearchedUser } from '../../..';
import { updateFollowList } from '../../../functions/community/fetch';

type Props = {
  profileId :string;
  userGenres: string[];
  userId: string;
}

function RecommendedAuthors({profileId, userGenres, userId}: Props) {
  const [recommendedAuthors, setRecommendedAuthors] = useState<SearchedUser[]>([]);
  const [isFollowing, setIsFollowing] = useState(false); 

  const toggleFollow = async (user: string) => {
    await updateFollowList(userId, user);
    //setIsFollowing((prevState: boolean) => !prevState);
    setRecommendedAuthors((prevResults) =>
      prevResults.map((u) =>
        u.id === user ? { ...u, isFollowing: !u.isFollowing } : u
      )
    );
  }


  useEffect(() => {
    const fetchRecommendations = async () => {
      await getRecommendedAuthors(userId, profileId, userGenres, setRecommendedAuthors);
    };
  
    if (profileId && userGenres.length > 0) fetchRecommendations();
  }, [profileId, userGenres]);

  return (
    <div className="w-full h-full">
      <p className="font-semibold px-2">You might also like:</p>

      <div className="flex flex-col w-full h-full overflow-y-auto custom-scrollbar space-y-4 p-4 pb-8">
          {recommendedAuthors.map((author) => (
            <div key={author.id} className="flex space-x-2 justify-between">

              <div className="flex space-x-1">
                <img 
                  src={author.profilePicture} 
                  className="w-10 h-10 rounded-full" 
                  alt={author.name} 
                />

                <div className="flex flex-col">
                  <p className="text-sm">{author.name}</p>
                  <p className="text-xs text-white/70">@{author.username}</p>
                </div>
              </div>

              {author.isFollowing ? (
                <div onClick={() => toggleFollow(author.id)} className="hover:cursor-pointer border-[0.1px] bg-[#0b0b0b] border-white/30 px-6 py-1 rounded-xl">
                  <p>following</p>
                </div>
              ) : (
                <div onClick={() => toggleFollow(author.id)} className="hover:cursor-pointer bg-[#7F60F9] px-4 py-2 h-fit rounded-xl">
                  <p className="text-sm font-bold">follow</p>
                </div> 
              )}
            </div>
          ))}
      </div>
     
    </div>
  )
}

export default RecommendedAuthors