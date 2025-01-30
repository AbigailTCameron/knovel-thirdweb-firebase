'use client'

import CommunityHeader from '@/components/headers/CommunityHeader'
import initializeFirebaseClient from '@/lib/initFirebase';
import { onAuthStateChanged } from 'firebase/auth';
import React, { useEffect, useState } from 'react'
import { getUserProfile } from '../../../../functions/explore/fetch';
import ProfileInfo from '@/components/profile/ProfileInfo';
import { useParams } from 'next/navigation';

type Props = {}
const { auth } = initializeFirebaseClient();

function Profile({}: Props) {
  const params = useParams<{ id: string }>();

  const [currentUser, setCurrentUser] = useState(auth?.currentUser?.uid);
  const [profileUrl, setProfileUrl] = useState<string>(''); 
  const [searchResults, setSearchResults] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => { 
    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
       setCurrentUser(user?.uid);
       if(user){
         getUserProfile(user.uid, setProfileUrl);
       }else {
         setProfileUrl(''); 
       }
    })

    return () => unsubscribe(); 
  
 }, []);


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

        <div className="flex-grow h-full">
          <ProfileInfo
             searchResults={searchResults}
             setSearchResults={setSearchResults}
             userId={currentUser || ''}
             profileId={params.id}
          />
        </div>

    </div>
  )
}

export default Profile