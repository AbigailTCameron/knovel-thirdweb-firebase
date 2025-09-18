'use client'
import ExploreHeader from '@/components/headers/ExploreHeader'
import React, { useEffect, useState } from 'react'
import DashboardSider from '@/components/dashboard/DashboardSider'
import initializeFirebaseClient from '@/lib/initFirebase';
import { onAuthStateChanged } from 'firebase/auth';
import { getUserProfile } from '../../../functions/explore/fetch';
import SettingsInfo from '@/components/settings/SettingsInfo';
import SpinLoader from '@/components/loading/SpinLoader';
import Sider from '@/components/headers/Sider';
import Notifications from '@/components/community/Notifications';
import UserSearch from '@/components/explore/popup/UserSearch';
import Top from '@/components/headers/Top';


type Props = {}
const { auth } = initializeFirebaseClient();

function Settings({}: Props) {
  const [currentUser, setCurrentUser] = useState(auth?.currentUser?.uid);
  const [profileUrl, setProfileUrl] = useState<string>(''); 
  const [username, setUsername] = useState<string>('');
  const [filePath, setFilePath] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [searchResults, setSearchResults] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [settingsPopup, setSettingsPopup] = useState<boolean>(false);
  

  const [loading, setLoading] = useState<boolean>(false);

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
          <div className='relative flex w-fit border-r-[0.5px] border-white/50'>
              <Sider 
                setLoading={setLoading}
                userId={currentUser}
                setSearchResults={setSearchResults}
                setShowNotifications={setShowNotifications}
                setSettingsPopup={setSettingsPopup}
              />

          </div>

          <div className="flex flex-col w-full h-full overflow-y-scroll">

              <div className='flex flex-col w-full sticky top-0 z-40'>
                <Top 
                  profileUrl={profileUrl}
                  setLoading={setLoading}
                />
              </div>

              <div className='w-full flex flex-col px-4'>
                  <div className="flex rounded-xl w-full h-full overflow-y-scroll">
                      <SettingsInfo 
                        userId={currentUser}
                        profileUrl={profileUrl}
                        setProfileUrl={setProfileUrl}
                        oldFilePath={filePath}
                        setOldFilePath={setFilePath}
                        name={name}
                        username={username}
                      />
                  </div>

              </div>


          </div>
    

      {showNotifications && (
        <Notifications 
          setShowNotifications={setShowNotifications}
          userId={currentUser}
        />
      )}

      {searchResults && (
        <UserSearch 
          setSearchResults={setSearchResults}
          userId={currentUser || ''}
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

export default Settings