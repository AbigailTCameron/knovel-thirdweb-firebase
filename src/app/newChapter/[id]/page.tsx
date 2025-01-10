'use client'
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import ExploreHeader from '@/components/headers/ExploreHeader';
import { onAuthStateChanged } from 'firebase/auth';
import { getUserProfile } from '../../../../functions/explore/fetch';
import initializeFirebaseClient from '@/lib/initFirebase';
import TipTapNewDraft from '@/components/newchapter/TipTapNewChapter';
import AddingNewChapter from '@/components/loading/AddingNewChapter';
import SpinLoader from '@/components/loading/SpinLoader';


type Props = {}
const { auth } = initializeFirebaseClient();
function NewChapter({}: Props) {
  const [currentUser, setCurrentUser] = useState(auth?.currentUser?.uid);
  const params = useParams<{ id: string }>();
  const [profileUrl, setProfileUrl] = useState<string>(''); 
  const [loading, setLoading] = useState(false);
  const [publishing, setPublishing] = useState(false);


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

  if(publishing){
    return(
      <div className="w-screen h-screen">
          <AddingNewChapter />
      </div>
  
    )
  }

  if(loading){
    return(
      <SpinLoader />
    )
  }



  return (
    <main className="flex flex-col w-screen h-screen items-center">
      <div  className="sticky top-0 w-full z-50">
        <ExploreHeader 
          userId={currentUser}
          profileUrl={profileUrl}
          setLoading={setLoading}  
        />
      </div>

      <TipTapNewDraft 
        userId={currentUser || ''}
        id={params.id}
        setLoading={setPublishing}
      />
    </main>
  )
}

export default NewChapter