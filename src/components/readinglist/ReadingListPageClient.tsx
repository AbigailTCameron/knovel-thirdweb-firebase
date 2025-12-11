"use client"
import React, { useEffect, useState } from 'react';
import initializeFirebaseClient from '@/lib/initFirebase'
import { onAuthStateChanged } from 'firebase/auth';
import { getUserProfile } from '../../../functions/explore/fetch';
import PageAnalytics from '../analytics/PageAnalytics';
import Sider from '../headers/Sider';
import Top from '../headers/Top';
import MediumHeader from '../headers/MediumHeader';
import Bookmark from './Bookmark';
import UserSearch from '../explore/popup/UserSearch';
import Notifications from '../community/Notifications';
import SettingsPopup from '../explore/popup/SettingsPopup';
import SpinLoader from '../loading/SpinLoader';
import { useParams, useRouter } from 'next/navigation';


const { auth } = initializeFirebaseClient();

function ReadingListPageClient({}) {
    const params = useParams<{ userId: string }>();
    const router = useRouter();
  
    const [currentUser, setCurrentUser] = useState(auth?.currentUser?.uid);
    const [profileUrl, setProfileUrl] = useState<string>(''); 
    const [username, setUsername] = useState<string>('');
    const [bookmarks, setBookmarks] = useState<string[]>([]); 
  
    const [loading, setLoading] = useState<boolean>(false);
    const [searchResults, setSearchResults] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [filePath, setFilePath] = useState<string>('');
    const [name, setName] = useState<string>('');
    const [settingsPopup, setSettingsPopup] = useState<boolean>(false);
    const [booting, setBooting] = useState<boolean>(true);    

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
            router.replace(`/readinglist/${user.uid}`);
            return;
          }

          const data = await getUserProfile(user.uid, setProfileUrl);
          if(data){
            setUsername(data.username);
            setBookmarks(data.bookmark);
            setFilePath(data.profilePicturePath);
            setName(data.name)
          }      
        setBooting(false)
      })
  
      return () => unsubscribe(); 
    
    }, []);

  return (
    <main className="flex w-screen h-screen overflow-hidden bg-gradient-to-br from-[#7F60F9]/20 from-15% via-[#7F60F9]/10 via-20% to-[#000000] to-60%">
      <PageAnalytics pageTitle="Reading List" pagePath="/readinglist" />

      <div className='flex w-fit md:hidden border-r-[0.5px] z-50 border-white/50'>
          <Sider 
            setLoading={setLoading}
            userId={currentUser}
            setSearchResults={setSearchResults}
            setShowNotifications={setShowNotifications}
            setSettingsPopup={setSettingsPopup}
          />
      </div>

      <div className="flex flex-col w-full h-full overflow-y-scroll">
          <div className='flex flex-col md:hidden w-full sticky top-0 z-20'>
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

          <div className='w-full flex flex-col p-4'>
            <Bookmark
                userId={currentUser}
                bookmarks={bookmarks}
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
          <p className="text-lg text-white font-semibold">Fetching...</p>
        </div>
      )}
  </main>
  )
}

export default ReadingListPageClient