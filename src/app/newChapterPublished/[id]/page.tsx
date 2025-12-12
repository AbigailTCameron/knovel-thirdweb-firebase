'use client'
import ExploreHeader from '@/components/headers/ExploreHeader'
import initializeFirebaseClient from '@/lib/initFirebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { getUserProfile } from '../../../../functions/explore/fetch';
import TipTapPub from '@/components/newchapter/TipTapPub';
import SpinLoader from '@/components/loading/SpinLoader';
import Sider from '@/components/headers/Sider';
import Top from '@/components/headers/Top';
import MediumHeader from '@/components/headers/MediumHeader';
import UserSearch from '@/components/explore/popup/UserSearch';
import Notifications from '@/components/community/Notifications';
import SettingsPopup from '@/components/explore/popup/SettingsPopup';

type Props = {}
const { auth } = initializeFirebaseClient();

function NewChapterPublished({}: Props) {
  const router = useRouter();
  
  const [currentUser, setCurrentUser] = useState(auth?.currentUser?.uid);
  const [profileUrl, setProfileUrl] = useState<string>(''); 
  const [loading, setLoading] = useState(false);
  const params = useParams<{ id: string }>();
  const [searchResults, setSearchResults] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const [settingsPopup, setSettingsPopup] = useState<boolean>(false);
  const [filePath, setFilePath] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [booting, setBooting] = useState<boolean>(true);    
  

  useEffect(() => { 
    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, async(user) => {
      if (!user) {
        setCurrentUser(undefined);
        setBooting(false);

        router.replace("/explore"); // or "/"
        return;
      }

       setCurrentUser(user?.uid);
   
      const data = await getUserProfile(user.uid, setProfileUrl); 
      if(data){
        setFilePath(data.profilePicturePath);
        setUsername(data.username);
        setName(data.name);
      }   
      setBooting(false);
    })
    return () => unsubscribe(); 
  
  }, []);

  return (
    <div className="flex w-screen h-screen overflow-hidden bg-gradient-to-br from-[#7F60F9]/20 from-15% via-[#7F60F9]/10 via-20% to-[#000000] to-60%">
      <div className='flex w-fit md:hidden border-r-[0.5px] z-50 border-white/50'>
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

            <TipTapPub
              userId={currentUser|| ''}
              id={params.id}
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
      {booting || loading && (
        <div className="absolute flex-col inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-black/40">
          <SpinLoader />
          <p className="text-lg text-white font-semibold">Searching...</p>
        </div>
      )}
  </div>
  )
}

export default NewChapterPublished