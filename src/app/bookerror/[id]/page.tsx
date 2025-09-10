'use client'
import ExploreHeader from '@/components/headers/ExploreHeader'
import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation';
import { fetchBookError } from '../../../../functions/book/fetch';
import initializeFirebaseClient from '@/lib/initFirebase';
import { onAuthStateChanged } from 'firebase/auth';
import { getUserProfile } from '../../../../functions/explore/fetch';
import SpinLoader from '@/components/loading/SpinLoader';

type Props = {}

const { auth } = initializeFirebaseClient();
function BookError({}: Props) {
  const params = useParams<{ id: string }>();
  const router = useRouter();
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


  useEffect(() => {
    if(params.id){
      fetchBookError(params.id, router);  
    }
  }, [params.id])


  return (
    <main className="flex flex-col w-screen h-screen items-center">
        <div  className="sticky top-0 w-full z-50">
            <ExploreHeader 
              userId={currentUser}
              profileUrl={profileUrl}
              setLoading={setLoading}
            />
        </div>

        <div className="flex flex-col w-screen h-full text-white items-center justify-center space-y-10">
          <div className="flex flex-col items-center space-y-4">
              <p className="font-semibold text-5xl font-mono">PAGE NOT FOUND</p>

              <p>Sorry, the book you're looking for does not exist</p>
          </div>
       

          <div onClick={() => router.push(`/explore`) } className="bg-white px-4 py-2 hover:cursor-pointer text-black font-medium rounded-3xl">
            <p>Go home</p>
          </div>
        </div>

        {/* ✅ Overlay with blur effect */}
      {loading && (
        <div className="absolute flex-col inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-black/40">
          <SpinLoader />
          <p className="text-lg text-white font-semibold">Fetching...</p>
        </div>
      )}

    </main>
  )
}

export default BookError