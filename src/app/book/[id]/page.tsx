'use client'
import ExploreHeader from '@/components/headers/ExploreHeader'
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import initializeFirebaseClient from '@/lib/initFirebase';
import { onAuthStateChanged } from 'firebase/auth';
import { getUserProfile } from '../../../../functions/explore/fetch';
import BookInfo from '@/components/book/BookInfo';
import SpinLoader from '@/components/loading/SpinLoader';

const { auth } = initializeFirebaseClient();
function Book() {
  const params = useParams<{ id: string }>();

  const [currentUser, setCurrentUser] = useState(auth?.currentUser?.uid);
  const [profileUrl, setProfileUrl] = useState<string>(''); 
  const [bookmarks, setBookmarks] = useState<string[]>([]); 
  const [loading, setLoading] = useState(false);
  const [userRating, setUserRating] = useState<number>(0); 

  useEffect(() => { 
    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, async(user) => {
       setCurrentUser(user?.uid);
       if(user){
         const data = await getUserProfile(user.uid, setProfileUrl);
         if(data?.bookmark){
          setBookmarks(data.bookmark);
          const rated = data?.rated || [];
          const userRating = rated.find((rating: { bookId: string; rating: number }) => rating.bookId === params.id)?.rating;
          setUserRating(userRating ?? 0);
         }      
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
    <main className="flex w-screen h-screen flex-col items-center">
        <div  className="sticky top-0 w-full z-50">
          <ExploreHeader 
            userId={currentUser}
            profileUrl={profileUrl} 
            setLoading={setLoading}
          />
        </div>

        <BookInfo 
          userId={currentUser}
          id={params?.id}
          bookmarks={bookmarks}
          userRating={userRating}
          setUserRating={setUserRating}
        />    

    </main>
  )
}

export default Book