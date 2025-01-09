'use client'
import React, { useEffect, useState } from 'react';
import ExploreHeader from '@/components/headers/ExploreHeader';
import { useParams } from 'next/navigation';
import initializeFirebaseClient from '@/lib/initFirebase';
import { onAuthStateChanged } from 'firebase/auth';
import { getUserProfile } from '../../../../../functions/explore/fetch';
import TipTapChapterEdit from '@/components/editChapter/TipTapChapterEdit';



type Props = {}
const { auth } = initializeFirebaseClient();

function EditChapter({}: Props) {
  const params = useParams<{ bookId: string, index: string }>();
  const [currentUser, setCurrentUser] = useState(auth?.currentUser?.uid);
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

      <TipTapChapterEdit 
        bookId={params?.bookId}
        index={parseInt(params.index)}
        userId={currentUser || ''}
      />
    </main>
  )
}

export default EditChapter