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
        <div className="sticky top-0 w-full z-50">
          <CommunityHeader 
            userId={currentUser}
            profileUrl={profileUrl}
            setLoading={setLoading}
          />
        </div>

        <div className="flex w-full h-full">
          <CommunityInfo 
            count={count}
          />
        </div>
       
    </div>
  )
}

export default Community