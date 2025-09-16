'use client'
import React, { useEffect, useState } from 'react'
import initializeFirebaseClient from '@/lib/initFirebase';
import { getUserProfile } from '../../../../functions/explore/fetch';
import { onAuthStateChanged } from 'firebase/auth';
import UserListDrafts from '@/components/drafts/UserListDrafts';
import SpinLoader from '@/components/loading/SpinLoader';
import Sider from '@/components/headers/Sider';
import Top from '@/components/headers/Top';
import UserSearch from '@/components/explore/popup/UserSearch';
import Notifications from '@/components/community/Notifications';


type Props = {}
const { auth } = initializeFirebaseClient();

function UserDrafts({}: Props) {
  const [currentUser, setCurrentUser] = useState(auth?.currentUser?.uid);
  const [profileUrl, setProfileUrl] = useState<string>(''); 
  const [username, setUsername] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  
  useEffect(() => { 
    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, async(user) => {
       setCurrentUser(user?.uid);
       if(user){
         const data = await getUserProfile(user.uid, setProfileUrl);
         if(data){
          setUsername(data.username);
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

      <div className="flex flex-col w-full h-full relative">
         
          <div className='flex flex-col w-full'>
            <Top 
              profileUrl={profileUrl}
              setLoading={setLoading}
            />
          </div>

          <div className="flex rounded-xl w-full h-full overflow-y-scroll my-4">
                <UserListDrafts 
                  userId={currentUser || ''}
                  setLoading={setLoading}
                />
          </div>


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
        </div>
      )}
    </main>
  )
}

export default UserDrafts