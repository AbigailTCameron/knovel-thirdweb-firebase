'use client'
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import ExploreHeader from '@/components/headers/ExploreHeader';
import { onAuthStateChanged } from 'firebase/auth';
import { getUserProfile } from '../../../../functions/explore/fetch';
import initializeFirebaseClient from '@/lib/initFirebase';
import TipTapNewDraft from '@/components/newchapter/TipTapNewChapter';


type Props = {}
const { auth } = initializeFirebaseClient();
function NewChapter({}: Props) {
  const [currentUser, setCurrentUser] = useState(auth?.currentUser?.uid);
  const params = useParams<{ id: string }>();
  const [profileUrl, setProfileUrl] = useState<string>(''); 


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

      <TipTapNewDraft 
        userId={currentUser || ''}
        id={params.id}
      />
    </main>
  )
}

export default NewChapter