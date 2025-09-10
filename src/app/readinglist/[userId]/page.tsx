'use client'
import React, { useEffect, useState } from 'react'
import ExploreHeader from '@/components/headers/ExploreHeader'
import DashboardSider from '@/components/dashboard/DashboardSider'
import initializeFirebaseClient from '@/lib/initFirebase'
import { onAuthStateChanged } from 'firebase/auth'
import { getUserProfile } from '../../../../functions/explore/fetch'
import Bookmark from '@/components/readinglist/Bookmark'
import SpinLoader from '@/components/loading/SpinLoader'

type Props = {}
const { auth } = initializeFirebaseClient();

function Readinglist({}: Props) {
  const [currentUser, setCurrentUser] = useState(auth?.currentUser?.uid);
  const [profileUrl, setProfileUrl] = useState<string>(''); 
  const [username, setUsername] = useState<string>('');
  const [bookmarks, setBookmarks] = useState<string[]>([]); 

  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => { 
    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, async(user) => {
       setCurrentUser(user?.uid);
       if(user){
        const data = await getUserProfile(user.uid, setProfileUrl);
        if(data){
         setUsername(data.username);
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
          <ExploreHeader 
            userId={currentUser}
            profileUrl={profileUrl}
            setLoading={setLoading}
          />
        </div>

        <div className="flex w-full h-full md:flex-col items-center space-x-2 p-4 overflow-hidden">
          <div className="flex basis-1/4 bg-[#171717] rounded-xl w-full h-full">
            <DashboardSider 
              userId={currentUser}
              setLoading={setLoading}
              profileUrl={profileUrl}
              username={username}
            />
          </div>

          <div className="flex basis-3/4 rounded-xl w-full h-full overflow-y-scroll">
            <Bookmark
              userId={currentUser}
              bookmarks={bookmarks}
            />
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

export default Readinglist