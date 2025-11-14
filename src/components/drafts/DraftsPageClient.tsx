"use client"
import { onAuthStateChanged } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import initializeFirebaseClient from '@/lib/initFirebase';
import { getUserProfile } from '../../../functions/explore/fetch';
import PageAnalytics from '../analytics/PageAnalytics';
import Sider from '../headers/Sider';
import Top from '../headers/Top';
import MediumHeader from '../headers/MediumHeader';
import UserListDrafts from './UserListDrafts';
import UserSearch from '../explore/popup/UserSearch';
import Notifications from '../community/Notifications';
import SettingsPopup from '../explore/popup/SettingsPopup';
import SpinLoader from '../loading/SpinLoader';

type Props = {}
const { auth } = initializeFirebaseClient();

function DraftsPageClient({}: Props) {
    const [currentUser, setCurrentUser] = useState(auth?.currentUser?.uid);
    const [profileUrl, setProfileUrl] = useState<string>(''); 
    const [username, setUsername] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [searchResults, setSearchResults] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [settingsPopup, setSettingsPopup] = useState<boolean>(false);
    const [filePath, setFilePath] = useState<string>('');
    const [name, setName] = useState<string>('');
    
    useEffect(() => { 
      // Listen for authentication state changes
      const unsubscribe = onAuthStateChanged(auth, async(user) => {
         setCurrentUser(user?.uid);
         if(user){
           const data = await getUserProfile(user.uid, setProfileUrl);
           if(data){
            setUsername(data.username);
            setFilePath(data.profilePicturePath);
            setName(data.name);
           }
           
         }else {
           setProfileUrl(''); 
         }
      })
      return () => unsubscribe(); 
    }, []);


  return (
    <main className="flex w-screen h-screen overflow-hidden">
      <PageAnalytics pageTitle="Drafts" pagePath="/drafts" />

      <div className='flex w-fit md:hidden border-r-[0.5px] border-white/50'>
          <Sider 
            setLoading={setLoading}
            userId={currentUser}
            setSearchResults={setSearchResults}
            setShowNotifications={setShowNotifications}
            setSettingsPopup={setSettingsPopup}
          />
      </div>

      <div className="flex flex-col w-full h-full relative">
         
          <div className='flex flex-col md:hidden w-full'>
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
           {loading && (
        <div className="absolute flex-col inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-black/40">
          <SpinLoader />
        </div>
      )}
    </main>
  )
}

export default DraftsPageClient