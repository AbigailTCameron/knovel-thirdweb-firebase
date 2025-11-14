"use client"
import React, { useEffect, useState } from 'react'
import initializeFirebaseClient from '@/lib/initFirebase';
import { useParams } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { getUserProfile } from '../../../functions/explore/fetch';
import PageAnalytics from '../analytics/PageAnalytics';
import Sider from '../headers/Sider';
import Top from '../headers/Top';
import MediumHeader from '../headers/MediumHeader';
import BookInfo from './BookInfo';
import UserSearch from '../explore/popup/UserSearch';
import Notifications from '../community/Notifications';
import SettingsPopup from '../explore/popup/SettingsPopup';
import SpinLoader from '../loading/SpinLoader';

type Props = {}
const { auth } = initializeFirebaseClient();

function BookPageClient({}: Props) {
    const params = useParams<{ id: string }>();
    const [booting, setBooting] = useState(true);           // NEW: blocks UI until BookInfo done
    const [pageOverlay, setPageOverlay] = useState(false); // generic overlay (you already had `loading`)
  
    const [currentUser, setCurrentUser] = useState(auth?.currentUser?.uid);
    const [profileUrl, setProfileUrl] = useState<string>(''); 
    const [bookmarks, setBookmarks] = useState<string[]>([]); 
    const [loading, setLoading] = useState(false);
    const [userRating, setUserRating] = useState<number>(0); 
  
    const [searchResults, setSearchResults] = useState(false);
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
            if(data?.bookmark){
            setBookmarks(data.bookmark);
            const rated = data?.rated || [];
            const userRating = rated.find((rating: { bookId: string; rating: number }) => rating.bookId === params.id)?.rating;
            setUserRating(userRating ?? 0);
            }   
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
    
    }, [params?.id]);

  return (
    <main className="flex w-screen h-screen overflow-hidden">
        <PageAnalytics pageTitle="Book" pagePath="/book" />

        <div className='flex w-fit md:hidden border-r-[0.5px] border-white/50'>
          <Sider 
            setLoading={setLoading}
            userId={currentUser}
            setSearchResults={setSearchResults}
            setShowNotifications={setShowNotifications}
            setSettingsPopup={setSettingsPopup}
          />
        </div>

        <div className="flex flex-col w-full h-full overflow-y-scroll">
          <div className='flex flex-col w-full md:hidden sticky top-0 z-20'>
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

          <BookInfo 
            userId={currentUser}
            id={params?.id}
            bookmarks={bookmarks}
            userRating={userRating}
            setUserRating={setUserRating}
            onLoadingChange={setPageOverlay}  // show/hide overlay for later re-fetches
            onReady={() => setBooting(false)}
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
        {loading && (
          <div className="absolute flex-col inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-black/40">
            <SpinLoader />
            <p className="text-lg text-white font-semibold">Fetching book info...</p>
          </div>
        )}

      {(booting || pageOverlay) && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center backdrop-blur-md bg-black/40">
          <SpinLoader />
          <p className="text-lg text-white font-semibold">{booting ? 'Loading book…' : 'Fetching book info…'}</p>
        </div>
      )}

    </main>
  )
 
}

export default BookPageClient