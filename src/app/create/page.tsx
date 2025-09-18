'use client'
import React, { useEffect, useState } from 'react'
import initializeFirebaseClient from '@/lib/initFirebase';
import { onAuthStateChanged } from 'firebase/auth';
import { getUserProfile } from '../../../functions/explore/fetch';
import TipTapCreate from '@/components/create/TipTapCreate';
import Sider from '@/components/headers/Sider';
import Top from '@/components/headers/Top';
import SpinLoader from '@/components/loading/SpinLoader';
import UserSearch from '@/components/explore/popup/UserSearch';
import Notifications from '@/components/community/Notifications';


type Props = {}
const { auth } = initializeFirebaseClient();
function Create({}: Props) {
  const [currentUser, setCurrentUser] = useState(auth?.currentUser?.uid);
  const [profileUrl, setProfileUrl] = useState<string>(''); 
  const [name, setName] = useState<string>(''); 
  const [loading, setLoading] = useState(false);
  const [loadSave, setLoadingSave] = useState(false);
  const [username, setUsername] = useState<string>('');
  const [searchResults, setSearchResults] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  
  useEffect(() => { 
    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, async(user) => {
       setCurrentUser(user?.uid);
       if(user){
         const data = await getUserProfile(user.uid, setProfileUrl);
         if(data){
          setName(data.name); 
          setUsername(data.username);
         }
         
       }else {
         setProfileUrl(''); 
       }
    })
    return () => unsubscribe(); 
  }, []);

  return (
    <div className="flex w-screen h-screen overflow-hidden">

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

          <TipTapCreate 
            userId={currentUser}
            username={username}
            name={name}
            setLoading={setLoadingSave}
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
       {loadSave && (
        <div className="absolute flex-col inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-black/40">
          <SpinLoader />
          <p className="text-lg text-white font-semibold">Saving your draft...</p>
        </div>
      )}

        {/* ✅ Overlay with blur effect */}
        {loading && (
        <div className="absolute flex-col inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-black/40">
          <SpinLoader />
        </div>
      )}
    </div>
  )
}

export default Create