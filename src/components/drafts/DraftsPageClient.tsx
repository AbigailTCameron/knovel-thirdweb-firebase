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
import { useParams, useRouter } from 'next/navigation';

const { auth } = initializeFirebaseClient();

function DraftsPageClient({}) {
    const router = useRouter();
    const params = useParams<{ userId: string }>();

  
    const [currentUser, setCurrentUser] = useState(auth?.currentUser?.uid);
    const [profileUrl, setProfileUrl] = useState<string>(''); 
    const [username, setUsername] = useState<string>('');
    const [booting, setBooting] = useState(true);
    const [loading, setLoading] = useState<boolean>(false);
    const [searchResults, setSearchResults] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [settingsPopup, setSettingsPopup] = useState<boolean>(false);
    const [filePath, setFilePath] = useState<string>('');
    const [name, setName] = useState<string>('');
    
    useEffect(() => { 
      // Listen for authentication state changes
      const unsubscribe = onAuthStateChanged(auth, async(user) => {
        const routeUserId = params?.userId;

        if (!user) {
          setCurrentUser(undefined);
          setBooting(false);

          router.replace("/explore"); // or "/"
          return;
        }

        setCurrentUser(user?.uid);

        // ❌ Logged in but trying to view someone else’s drafts → redirect to their own drafts
        if (routeUserId && routeUserId !== user.uid) {
          router.replace(`/drafts/${user.uid}`);
          return;
        }

    
        const data = await getUserProfile(user.uid, setProfileUrl);
        if(data){
        setUsername(data.username);
        setFilePath(data.profilePicturePath);
        setName(data.name);
        }
           
        setBooting(false);
      })
      return () => unsubscribe(); 
    }, []);


  return (
    <main className="flex w-screen h-screen overflow-hidden bg-gradient-to-br from-[#7F60F9]/20 from-15% via-[#7F60F9]/10 via-20% to-[#000000] to-60%">
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
        {booting || loading && (
        <div className="absolute flex-col inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-black/40">
          <SpinLoader />
        </div>
      )}
    </main>
  )
}

export default DraftsPageClient