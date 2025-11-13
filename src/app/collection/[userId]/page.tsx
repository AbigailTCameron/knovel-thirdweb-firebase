'use client'
import initializeFirebaseClient from '@/lib/initFirebase';
import { onAuthStateChanged } from 'firebase/auth';
import React, { useEffect, useState } from 'react'
import { getUserProfile } from '../../../../functions/explore/fetch';
import UserProf from '@/components/profile/UserProf';
import Sider from '@/components/headers/Sider';
import Top from '@/components/headers/Top';
import UserSearch from '@/components/explore/popup/UserSearch';
import Notifications from '@/components/community/Notifications';
import SpinLoader from '@/components/loading/SpinLoader';
import SettingsPopup from '@/components/explore/popup/SettingsPopup';
import MediumHeader from '@/components/headers/MediumHeader';
import PageAnalytics from '@/components/analytics/PageAnalytics';

type Props = {}

const { auth } = initializeFirebaseClient();
function Collection({}: Props) {
  const [currentUser, setCurrentUser] = useState(auth?.currentUser?.uid);
  const [booting, setBooting] = useState(true);  
  const [profileUrl, setProfileUrl] = useState<string>(''); 
  const [searchResults, setSearchResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [settingsPopup, setSettingsPopup] = useState<boolean>(false);
  const [filePath, setFilePath] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  

  useEffect(() => { 
    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, async(user) => {
       setCurrentUser(user?.uid);
       if(user){
         const data = await getUserProfile(user.uid, setProfileUrl);   
         if(data){
          setFilePath(data.profilePicturePath);
          setUsername(data.username);
          setName(data.name);
         }   
       }else {
         setProfileUrl(''); 
       }
    })
    return () => unsubscribe(); 
  
  }, []);

  return (
    <div className="flex w-screen h-screen overflow-hidden">
        <PageAnalytics pageTitle="Collection" pagePath="/collection"/>

        <div className='flex md:hidden w-fit border-r-[0.5px] border-white/50'>
            <Sider 
              setLoading={setLoading}
              userId={currentUser}
              setSearchResults={setSearchResults}
              setShowNotifications={setShowNotifications}
              setSettingsPopup={setSettingsPopup}
            />
        </div>

        <div className="flex flex-col w-full h-full overflow-y-scroll">
            <div className='flex md:hidden flex-col w-full sticky top-0 z-20'>
                <Top 
                  profileUrl={profileUrl}
                  setLoading={setLoading}
                />
            </div>

            <div className="hidden md:flex w-full sticky top-0 z-40">
              <MediumHeader 
                setLoading={setLoading}
                userId={currentUser}
                setUserResults={setSearchResults}
                setShowNotifications={setShowNotifications}
                setSettingsPopup={setSettingsPopup}
              />

            </div>

            <div className='w-full flex flex-col p-4'>
              <UserProf 
                userId={currentUser || ''}
                onLoadingChange={setLoading}  
                onReady={() => setBooting(false)}
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

      {settingsPopup && (
        <SettingsPopup 
            setSettingsPopup={setSettingsPopup}
            userId={currentUser}
            profileUrl={profileUrl}
            setProfileUrl={setProfileUrl}
            oldFilePath={filePath}
            setOldFilePath={setFilePath}
            name={name}
            username={username}
        />
      )}

      {/* ✅ Overlay with blur effect */}
      {(booting || loading) && (
        <div className="absolute flex-col inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-black/40">
          <SpinLoader />
        </div>
      )}

    </div>
  )
}

export default Collection