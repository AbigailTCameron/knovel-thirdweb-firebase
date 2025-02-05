'use client'

import React, { useEffect, useState } from 'react';
import initializeFirebaseClient from '@/lib/initFirebase';
import { onAuthStateChanged } from 'firebase/auth';
import { getUserProfile } from '../../../functions/explore/fetch';
import CommunityInfo from '@/components/community/CommunityInfo';
import SpinLoader from '@/components/loading/SpinLoader';
import CommunityHeader from '@/components/headers/CommunityHeader';

type Props = {}
const { auth } = initializeFirebaseClient();
function Community({}: Props) {
  const [currentUser, setCurrentUser] = useState(auth?.currentUser?.uid);
  const [profileUrl, setProfileUrl] = useState<string>(''); 
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState<number>(0);
  const [searchResults, setSearchResults] = useState(false);
  const [genreOptions, setGenreOptions] = useState([]); 

  useEffect(() => { 
    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, async(user) => {
       setCurrentUser(user?.uid);
       if(user){
         const data = await getUserProfile(user.uid, setProfileUrl);
         if(data?.genres){
          setGenreOptions(data.genres);
         }     
       }else {
         setProfileUrl(''); 
       }
    })

    return () => unsubscribe(); 
  
 }, []);

  if(loading){
    return(
      <SpinLoader />
    )
  }

  return (
    <div className="flex w-screen h-screen overflow-hidden">
        <div className="w-1/12 max-w-[150px] h-full z-50 border-r-[0.5px] border-white/50 flex-shrink-0">
          <CommunityHeader 
            userId={currentUser}
            profileUrl={profileUrl}
            setLoading={setLoading}
            setSearchResults={setSearchResults}
          />
        </div>

        <div className="w-full h-full">
          <CommunityInfo 
            count={count}
            searchResults={searchResults}
            setSearchResults={setSearchResults}
            userId={currentUser || ''}
            userGenres={genreOptions}
            setUserGenres={setGenreOptions}
          />
        </div>
       
    </div>
  )
}

export default Community