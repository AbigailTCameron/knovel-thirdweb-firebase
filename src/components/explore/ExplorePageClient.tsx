"use client"

import initializeFirebaseClient from '@/lib/initFirebase'

import React, { useEffect, useState } from 'react'
import PageAnalytics from '../analytics/PageAnalytics'
import Sider from '../headers/Sider'
import Top from '../headers/Top'
import MediumHeader from '../headers/MediumHeader'
import Carousel from './trending/Carousel'
import Recommend from '../community/Recommend'
import Trending from './trending/Trending'
import Genre from './genre/Genre'
import NftMint from './popup/NftPopup'
import SpinLoader from '../loading/SpinLoader'
import UserSearch from './popup/UserSearch'
import SettingsPopup from './popup/SettingsPopup'
import ClaimedNft from './popup/ClaimedNfft'
import Notifications from '../community/Notifications'
import { useActiveAccount } from 'thirdweb/react'
import { fetchUserNftBalance, getUserProfile, mintNft } from '../../../functions/explore/fetch'
import { onAuthStateChanged, User } from 'firebase/auth'

type Props = {}

const { auth } = initializeFirebaseClient();

function ExplorePageClient({}: Props) {
  const account = useActiveAccount();
  const [booting, setBooting] = useState(true);      // 🔑 blocks UI until ready
  const [currentUser, setCurrentUser] = useState<string | undefined>(auth?.currentUser?.uid);
  const [profileUrl, setProfileUrl] = useState<string>(''); 
  const [filePath, setFilePath] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [genreOptions, setGenreOptions] = useState<string[]>([]);
  const [userBalance, setUserBalance] = useState(0);

  // existing popups/loaders…
  const [loading, setLoading] = useState(false);
  const [mintPopup, setMintPopup] = useState<boolean>(false);
  const [mintLoading, setMintLoading] = useState(false);
  const [claimed, setClaimed] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [settingsPopup, setSettingsPopup] = useState<boolean>(false);

  const waitForAuth = () =>
    new Promise<User|null>((resolve) => {
        const unsub = onAuthStateChanged(auth, (u) => {
          unsub();
          resolve(u);
        });
  });
    
  useEffect(() => { 
      let alive = true;

      (async() => {
        setBooting(true);

        // wait for auth to initialize first
        const u = await waitForAuth();
        if (!alive) return;

        setCurrentUser(u?.uid);

        if(u?.uid){
            // 2) fetch first-render data in parallel
            const [userData, _balance] = await Promise.all([
              getUserProfile(u.uid, setProfileUrl),      // returns userData (you already return it)
              fetchUserNftBalance(u.uid, setUserBalance) // this sets state internally too
            ]);

            if (!alive) return;

            if (userData) {
              setUsername(userData.username ?? '');
              setName(userData.name ?? '');
              setFilePath(userData.profilePicturePath ?? '');
              if (Array.isArray(userData.genres)) setGenreOptions(userData.genres);
            }
        }else{
            // not signed in — ensure defaults are clean
            setProfileUrl('');
            setUsername('');
            setName('');
            setGenreOptions([]);
        }
        // 3) release the UI
        setBooting(false);
      })();
    return () => { alive = false; };
    
  }, []);

  const mint = async() => {
    if(currentUser && account){
      setMintLoading(true);
      await mintNft(currentUser, setClaimed, account); 
      setMintLoading(false);
    }
  }

  useEffect(() => {
    if (claimed) {
      const timer = setTimeout(() => {
        setClaimed(false);
      }, 3000); // 3 seconds
  
      return () => clearTimeout(timer);
    }
  }, [claimed]);

  if (booting) {
    return (
      <div className="absolute flex-col inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-black/40">
        <SpinLoader />
        <p className="text-lg text-white font-semibold">Loading your Explore feed…</p>
      </div>
    );
  }

  return (
    <div className="flex w-screen h-screen overflow-hidden">
      <PageAnalytics pageTitle="Explore" pagePath="/explore"/>
    
      <div className='relative md:hidden flex w-fit border-r-[0.5px] border-white/50'>
          <Sider 
            setLoading={setLoading}
            userId={currentUser}
            setSearchResults={setSearchResults}
            setShowNotifications={setShowNotifications}
            setSettingsPopup={setSettingsPopup}
          />
      </div>
    
      <div className="flex flex-col w-full h-full overflow-y-scroll">

          <div className='md:hidden flex flex-col w-full sticky top-0 z-40'>
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

          <div className='w-full flex flex-col px-4'>
              <div className='m-2'>
                  <Carousel 
                    setMintPopup={setMintPopup}
                    userId={currentUser || ''}
                  />
              </div>

              {genreOptions.length != 0 && (
                  <div className="flex w-full mt-5 halfxl:mt-10 sm:px-2">
                    <Recommend 
                      userGenres={genreOptions}
                    />
                  </div>
              )}

              <div className="flex w-full mt-20 halfxl:mt-10 sm:px-2">
                <Trending />
              </div>


              <div className="flex w-full halfxl:mt-5 lg:mt-0 sm:px-2">
                 <Genre />
              </div>

          </div>

      </div>
   
      {mintPopup && (
        <NftMint 
          onCancel={() => setMintPopup(false)}
          onConfirm={mint}
          userBalance={userBalance}
        />
      )}

      {loading && (
        <div className="absolute flex-col inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-black/40">
          <SpinLoader />
        </div>
      )}

      {searchResults && (
        <UserSearch 
          setSearchResults={setSearchResults}
          userId={currentUser || ''}
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

      {claimed && (
        <ClaimedNft 
          onCancel={() => setClaimed(false)}
        />
      )}

      {mintLoading && (
        <div className="absolute flex-col inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-black/40">
          <SpinLoader />
          <p className="text-lg text-white font-semibold">Minting...</p>
        </div>
      )}

      {showNotifications && (
        <Notifications 
          setShowNotifications={setShowNotifications}
          userId={currentUser}
        />
      )}
        
    </div>
  )

}

export default ExplorePageClient