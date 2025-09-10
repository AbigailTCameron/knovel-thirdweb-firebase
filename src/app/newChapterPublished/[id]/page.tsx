'use client'
import ExploreHeader from '@/components/headers/ExploreHeader'
import initializeFirebaseClient from '@/lib/initFirebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { getUserProfile } from '../../../../functions/explore/fetch';
import TipTapPub from '@/components/newchapter/TipTapPub';
import SpinLoader from '@/components/loading/SpinLoader';

type Props = {}
const { auth } = initializeFirebaseClient();

function NewChapterPublished({}: Props) {
  const [currentUser, setCurrentUser] = useState(auth?.currentUser?.uid);
  const [profileUrl, setProfileUrl] = useState<string>(''); 
  const [loading, setLoading] = useState(false);
  const params = useParams<{ id: string }>();

  useEffect(() => { 
    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, async(user) => {
       setCurrentUser(user?.uid);
       if(user){
          await getUserProfile(user.uid, setProfileUrl);    
       }else {
         setProfileUrl(''); 
       }
    })
    return () => unsubscribe(); 
  
  }, []);

  return (
    <main className="flex flex-col w-screen h-screen items-center">
      <div  className="sticky top-0 w-full z-50">
        <ExploreHeader 
          userId={currentUser}
          profileUrl={profileUrl}
          setLoading={setLoading}
        />
      </div>

      <TipTapPub
        userId={currentUser|| ''}
        id={params.id}
      />

      {/* ✅ Overlay with blur effect */}
      {loading && (
        <div className="absolute flex-col inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-black/40">
          <SpinLoader />
          <p className="text-lg text-white font-semibold">Searching...</p>
        </div>
      )}
  </main>
  )
}

export default NewChapterPublished