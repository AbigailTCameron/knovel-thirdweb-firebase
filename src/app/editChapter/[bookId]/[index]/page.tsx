'use client'
import React, { useEffect, useState } from 'react';
import ExploreHeader from '@/components/headers/ExploreHeader';
import { useParams } from 'next/navigation';
import initializeFirebaseClient from '@/lib/initFirebase';
import { onAuthStateChanged } from 'firebase/auth';
import { getUserProfile } from '../../../../../functions/explore/fetch';
import TipTapChapterEdit from '@/components/editChapter/TipTapChapterEdit';
import SpinLoader from '@/components/loading/SpinLoader';



type Props = {}
const { auth } = initializeFirebaseClient();

function EditChapter({}: Props) {
  const params = useParams<{ bookId: string, index: string }>();
  const [currentUser, setCurrentUser] = useState(auth?.currentUser?.uid);
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


  return (
    <main className="flex flex-col w-screen h-screen items-center">
      <div  className="sticky top-0 w-full z-50">
        <ExploreHeader 
          userId={currentUser}
          profileUrl={profileUrl}
          setLoading={setLoading}
        />
      </div>

      <TipTapChapterEdit 
        bookId={params?.bookId}
        index={parseInt(params.index)}
        userId={currentUser || ''}
      />

      {/* ✅ Overlay with blur effect */}
      {loading && (
        <div className="absolute flex-col inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-black/40">
          <SpinLoader />
        </div>
      )}
    </main>
  )
}

export default EditChapter