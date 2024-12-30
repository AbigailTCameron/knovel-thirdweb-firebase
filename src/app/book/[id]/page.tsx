'use client'
import ExploreHeader from '@/components/headers/ExploreHeader'
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import initializeFirebaseClient from '@/lib/initFirebase';
import { onAuthStateChanged } from 'firebase/auth';
import { getUserProfile } from '../../../../functions/explore/fetch';
import BookInfo from '@/components/book/BookInfo';
import { User } from '../../../..';

const { auth } = initializeFirebaseClient();
function Book() {
  const params = useParams<{ id: string }>();

  const [currentUser, setCurrentUser] = useState(auth?.currentUser?.uid);
  const [profileUrl, setProfileUrl] = useState<string>(''); 
  //const [userDetails, setUserDetails] = useState(); 
  const [bookmarks, setBookmarks] = useState<string[]>([]); 

  useEffect(() => { 
    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, async(user) => {
       setCurrentUser(user?.uid);
       if(user){
         const data = await getUserProfile(user.uid, setProfileUrl);
         if(data?.bookmark){
          setBookmarks(data.bookmark);
         }      
       }else {
         setProfileUrl(''); 
       }
    })
    return () => unsubscribe(); 
  
  }, []);
  
  return (
    <main className="flex w-screen h-screen flex-col items-center">
        <div  className="sticky top-0 w-full z-50">
          <ExploreHeader profileUrl={profileUrl} />
        </div>

        <BookInfo 
          userId={currentUser}
          id={params?.id}
          bookmarks={bookmarks}
        />    

    </main>
  )
}

export default Book