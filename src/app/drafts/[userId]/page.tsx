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
import SettingsPopup from '@/components/explore/popup/SettingsPopup';
import MediumHeader from '@/components/headers/MediumHeader';


type Props = {}
const { auth } = initializeFirebaseClient();

function UserDrafts({}: Props) {
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

export default UserDrafts