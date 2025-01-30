import React, { useEffect, useState } from 'react'
import UserList from '../community/UserList'
import { fetchProfileInfo } from '../../../functions/profile/fetch';
import ProfileTop from './ProfileTop';
import SearchIcon2 from '../icons/Search';

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

  const getUser = async () => {
    await fetchProfileInfo(userId, profileId, setUserImage, setName, setUsername, setIsFollowing);
  };


  const toggleFollow = async (id: string) => {

  }

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

      <div className="relative flex flex-col text-white w-full h-full my-4 mx-6">

        

          <div className="flex items-center justify-between w-full space-x-4">
           
            <div className="flex-grow">

              <div className="bg-[#1c212a] w-3/4 p-2 rounded-xl">

                <div className="flex items-center space-x-2 px-2">
                    <SearchIcon2 className="stroke-white size-5"/>
                    <p>Search user's books collection</p>
                </div>

              </div>
           
     
            </div>

            <div className="flex-shrink-0">

              <ProfileTop 
                  userImage={userImage}
                  username={username}
                  name={name}
                  isFollowing={isFollowing}
                  profileId={profileId}
              />
            </div>
          

          </div>

        


          
      </div>
       
    </div>
  )
}

export default ProfileInfo