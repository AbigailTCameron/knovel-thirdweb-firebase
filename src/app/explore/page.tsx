'use client'
import React, { useEffect, useState } from 'react'
import initializeFirebaseClient from '@/lib/initFirebase'
import { getUserProfile } from '../../../functions/explore/fetch'
import { onAuthStateChanged } from 'firebase/auth'
import ExploreHeader from '@/components/headers/ExploreHeader'
import TrendingCarousel from '@/components/explore/trending/TrendingCarousel'
import Trending from '@/components/explore/trending/Trending'
import Genre from '@/components/explore/genre/Genre'
import SpinLoader from '@/components/loading/SpinLoader'


type Props = {}

const { auth } = initializeFirebaseClient();

function page({}: Props) {
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
    return (
      <SpinLoader />
    )
  }

  return (
    <div className="flex w-screen min-h-screen flex-col items-center">
        <div  className="sticky top-0 w-full z-50">
          <ExploreHeader 
            profileUrl={profileUrl}
            setLoading={setLoading}
          />
        </div>

        <div className="flex w-full" style={{ height: '75vh' }}>
          <TrendingCarousel />
        </div>

        <div className="flex w-full h-full mt-20 halfxl:mt-10 px-20 xl:px-10 sm:px-2">
          <Trending />
        </div>

        <div className="w-full h-full">
          <Genre />
        </div>
    </div>
  )
}

export default page