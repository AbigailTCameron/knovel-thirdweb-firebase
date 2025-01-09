'use client'
import ExploreHeader from '@/components/headers/ExploreHeader'
import React, { useEffect, useState } from 'react'
import initializeFirebaseClient from '@/lib/initFirebase'
import { onAuthStateChanged } from 'firebase/auth';
import { getUserProfile } from '../../../functions/explore/fetch';
import DashboardSider from '@/components/dashboard/DashboardSider';
import DashboardInfo from '@/components/dashboard/DashboardInfo';
import Butterfly from '@/components/loading/Butterfly';

const { auth } = initializeFirebaseClient();
function Dashboard() {
  const [currentUser, setCurrentUser] = useState(auth?.currentUser?.uid);
  const [profileUrl, setProfileUrl] = useState<string>(''); 
  const [username, setUsername] = useState<string>('');
  const [draftsLength, setDraftsLength] = useState<number>(); 
  const [publishedLength, setPublishedLength] = useState<number>(); 
  const [bookmarkLength, setBookmarkLength] = useState<number>(); 

  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => { 
    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, async(user) => {
       setCurrentUser(user?.uid);
       if(user){
         const data = await getUserProfile(user.uid, setProfileUrl);
         if(data){
          setUsername(data.username);
          setDraftsLength(data.drafts.length);
          setPublishedLength(data.published.length);
          setBookmarkLength(data.bookmark.length);
         }      
       }else {
         setProfileUrl(''); 
       }
    })
    return () => unsubscribe(); 
  
  }, []);

  if(loading){
    return(
      <Butterfly />
    )
  }

  return (
    <main className="flex w-screen h-screen flex-col items-center">
        <div className="sticky top-0 w-full z-50">
            <ExploreHeader profileUrl={profileUrl}/>
        </div>
    
        <div className="flex md:flex-col w-full h-full items-center space-x-2 p-4 overflow-hidden">
            <div className="flex basis-1/4 bg-[#171717] rounded-xl w-full h-full ss:h-fit">
                <DashboardSider 
                  userId={currentUser}
                  setLoading={setLoading}
                  profileUrl={profileUrl}
                  username={username}
                />
            </div>

            <div className="flex basis-3/4 rounded-xl w-full h-full overflow-y-scroll">
                <DashboardInfo
                  userId={currentUser}
                  setLoading={setLoading}
                  draftsLength={draftsLength}
                  publishedLength={publishedLength}
                  bookmarkLength={bookmarkLength}
                />
            </div>
        </div>
    </main>
  )
}

export default Dashboard