'use client'
import ExploreHeader from '@/components/headers/ExploreHeader'
import initializeFirebaseClient from '@/lib/initFirebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { getUserProfile } from '../../../../functions/explore/fetch';
import TipTapPub from '@/components/newchapter/TipTapPub';

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
        <ExploreHeader profileUrl={profileUrl}/>
      </div>

      <TipTapPub
        userId={currentUser|| ''}
        id={params.id}
      />
  </main>
  )
}

export default NewChapterPublished