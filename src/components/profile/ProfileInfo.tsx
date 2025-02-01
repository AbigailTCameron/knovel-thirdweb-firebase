import React, { useEffect, useState } from 'react'
import UserList from '../community/UserList'
import { fetchProfileInfo } from '../../../functions/profile/fetch';
import ProfileTop from './ProfileTop';
import SearchIcon2 from '../icons/Search';
import ProfileBooks from './ProfileBooks';
import UserTokens from './UserTokens';
import RecommendedAuthors from './RecommendedAuthors';

type Props = {
  searchResults: boolean;
  setSearchResults: Function;
  userId: string;
  profileId: string;
}

function ProfileInfo({ searchResults, setSearchResults, userId, profileId}: Props) {
  const [userImage, setUserImage] = useState('');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [isFollowing, setIsFollowing] = useState(false); 
  const [books, setBooks] = useState<string[]>([]); 
  const [userGenres, setUserGenres] = useState<string[]>([]); 

  const getUser = async () => {
    await fetchProfileInfo(userId, profileId, setUserImage, setName, setUsername, setIsFollowing, setBooks, setUserGenres);
  };


  useEffect(() => {
    if(userId && profileId){
      getUser();
    }

  }, [profileId, userId])

  return (
    <div className="flex w-full h-full relative">
      {searchResults && (
        <div className="absolute z-10 w-1/3 h-full bg-[#0b0b0b] shadow-lg left-0 rounded-r-md">
          <UserList 
            setSearchResults={setSearchResults}
            userId={userId}
          />
        </div>
      )}

      <div className="relative flex flex-col text-white w-full h-full p-6 space-y-4">

          {/* Profile Header */}
          <div className="flex items-center justify-between w-full space-x-4">
           
              <div className="flex-grow w-3/4">

                <div className="bg-[#1b1c1e] w-4/5 p-2 rounded-xl">

                  <div className="flex items-center space-x-2 px-2">
                      <SearchIcon2 className="stroke-white size-5"/>
                      <p>Search user's books collection</p>
                  </div>

                </div>
            
              </div>

              <div className="flex-shrink-0 w-1/4 right-2">
                <ProfileTop 
                    userId={userId}
                    userImage={userImage}
                    username={username}
                    name={name}
                    isFollowing={isFollowing}
                    profileId={profileId}
                    setIsFollowing={setIsFollowing}
                />
              </div>
            
          </div>

          <div className="w-full h-1/2 space-y-2">
              <p className="font-semibold text-xl">Featured Books</p>
              <ProfileBooks 
                books={books}
              />
          </div>

          <div className="flex w-full h-1/2 space-x-4 overflow-hidden">
              <div className="flex basis-3/4 h-full">
                <UserTokens />  
              </div>

              <div className="flex basis-1/4 h-full bg-[#1c1e2a] rounded-xl p-2">
                  <RecommendedAuthors 
                    profileId={profileId}
                    userGenres={userGenres}
                    userId={userId}
                  />
              </div>

          </div> 
          
      </div>
       
    </div>
  )
}

export default ProfileInfo