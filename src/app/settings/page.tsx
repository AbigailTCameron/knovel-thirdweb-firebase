'use client'
import ExploreHeader from '@/components/headers/ExploreHeader'
import React, { useEffect, useState } from 'react'
import DashboardSider from '@/components/dashboard/DashboardSider'
import initializeFirebaseClient from '@/lib/initFirebase';
import { onAuthStateChanged } from 'firebase/auth';
import { getUserProfile } from '../../../functions/explore/fetch';
import SettingsInfo from '@/components/settings/SettingsInfo';
import SpinLoader from '@/components/loading/SpinLoader';


type Props = {}
const { auth } = initializeFirebaseClient();

function Settings({}: Props) {
  const [currentUser, setCurrentUser] = useState(auth?.currentUser?.uid);
  const [profileUrl, setProfileUrl] = useState<string>(''); 
  const [username, setUsername] = useState<string>('');
  const [filePath, setFilePath] = useState<string>('');
  const [name, setName] = useState<string>('');

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
    <main className="flex w-screen h-screen flex-col items-center">
        <div className="sticky top-0 w-full z-50">
            <ExploreHeader 
              userId={currentUser}
              profileUrl={profileUrl}
              setLoading={setLoading}
            />
        </div>

        <div className="flex md:flex-col w-full h-full items-center space-x-2 p-4 overflow-hidden">
            <div className="flex basis-1/4 bg-[#171717] rounded-xl w-full h-full">
                <DashboardSider 
                  userId={currentUser}
                  setLoading={setLoading}
                  profileUrl={profileUrl}
                  username={username}
                />
            </div>

            <div className="flex basis-3/4 rounded-xl w-full h-full overflow-y-scroll">
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