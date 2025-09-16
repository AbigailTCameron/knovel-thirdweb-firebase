'use client'

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import initializeFirebaseClient from '@/lib/initFirebase';
import { onAuthStateChanged } from 'firebase/auth';
import { getUserProfile } from '../../../../functions/explore/fetch';
import BookInfo from '@/components/book/BookInfo';
import SpinLoader from '@/components/loading/SpinLoader';
import Sider from '@/components/headers/Sider';
import Top from '@/components/headers/Top';
import UserSearch from '@/components/explore/popup/UserSearch';
import Notifications from '@/components/community/Notifications';

const { auth } = initializeFirebaseClient();
function Book() {
  const params = useParams<{ id: string }>();

  const [currentUser, setCurrentUser] = useState(auth?.currentUser?.uid);
  const [profileUrl, setProfileUrl] = useState<string>(''); 
  const [bookmarks, setBookmarks] = useState<string[]>([]); 
  const [loading, setLoading] = useState(false);
  const [userRating, setUserRating] = useState<number>(0); 

  const [searchResults, setSearchResults] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

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

  return (
    <main className="flex w-screen h-screen overflow-hidden">
        <div className='flex w-fit border-r-[0.5px] border-white/50'>
          <Sider 
            setLoading={setLoading}
            userId={currentUser}
            setSearchResults={setSearchResults}
            setShowNotifications={setShowNotifications}
          />
        </div>

        <div className="flex flex-col w-full h-full overflow-y-scroll">
          <div className='flex flex-col w-full sticky top-0 z-20'>
              <Top 
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

        </div>

        {searchResults && (
            <UserSearch 
              setSearchResults={setSearchResults}
              userId={currentUser || ''}
            />
          )}

        {showNotifications && (
          <Notifications 
            setShowNotifications={setShowNotifications}
            userId={currentUser}
          />
        )}


        {/* ✅ Overlay with blur effect */}
        {loading && (
          <div className="absolute flex-col inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-black/40">
            <SpinLoader />
            <p className="text-lg text-white font-semibold">Fetching book info...</p>
          </div>
        )}

    </main>
  )
}

export default Book