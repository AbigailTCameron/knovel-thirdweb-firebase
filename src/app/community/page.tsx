'use client'

import ExploreHeader from '@/components/headers/ExploreHeader'
import React, { useEffect, useState } from 'react';
import initializeFirebaseClient from '@/lib/initFirebase';
import { onAuthStateChanged } from 'firebase/auth';
import { getUserProfile } from '../../../functions/explore/fetch';
import CommunityInfo from '@/components/community/CommunityInfo';
import SpinLoader from '@/components/loading/SpinLoader';

type Props = {}
const { auth } = initializeFirebaseClient();
function Community({}: Props) {
  const [currentUser, setCurrentUser] = useState(auth?.currentUser?.uid);
  const [profileUrl, setProfileUrl] = useState<string>(''); 
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

  if(loading){
    return(
      <SpinLoader />
    )
  }

  return (
    <div className="flex w-screen h-screen flex-col items-center">
        <div  className="sticky top-0 w-full z-50">
          <ExploreHeader 
            profileUrl={profileUrl}
            setLoading={setLoading}
          />
        </div>

        <div className="flex w-full h-full">
          <CommunityInfo />
        </div>
       
    </div>
  )
}

export default Community