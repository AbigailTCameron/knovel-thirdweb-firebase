'use client'
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import ExploreHeader from '@/components/headers/ExploreHeader';
import { onAuthStateChanged } from 'firebase/auth';
import { getUserProfile } from '../../../../functions/explore/fetch';
import initializeFirebaseClient from '@/lib/initFirebase';
import TipTapNewDraft from '@/components/newchapter/TipTapNewChapter';
import AddingNewChapter from '@/components/loading/AddingNewChapter';


type Props = {}
const { auth } = initializeFirebaseClient();
function NewChapter({}: Props) {
  const [currentUser, setCurrentUser] = useState(auth?.currentUser?.uid);
  const params = useParams<{ id: string }>();
  const [profileUrl, setProfileUrl] = useState<string>(''); 
  const [loading, setLoading] = useState(false);


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

  if(loading){
    return(
      <div className="w-screen h-screen">
          <AddingNewChapter />
      </div>
  
    )
  }



  return (
    <main className="flex flex-col w-screen h-screen items-center">
      <div  className="sticky top-0 w-full z-50">
        <ExploreHeader profileUrl={profileUrl}/>
      </div>

      <TipTapNewDraft 
        userId={currentUser || ''}
        id={params.id}
        setLoading={setLoading}
      />
    </main>
  )
}

export default NewChapter