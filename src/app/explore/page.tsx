'use client'
import React, { useEffect, useState } from 'react'
import initializeFirebaseClient from '@/lib/initFirebase'
import { fetchUserNftBalance, getUserProfile, mintNft } from '../../../functions/explore/fetch'
import { onAuthStateChanged } from 'firebase/auth'
import ExploreHeader from '@/components/headers/ExploreHeader'
import TrendingCarousel from '@/components/explore/trending/TrendingCarousel'
import Trending from '@/components/explore/trending/Trending'
import SpinLoader from '@/components/loading/SpinLoader'
import NftMint from '@/components/explore/popup/NftPopup'
import ClaimedNft from '@/components/explore/popup/ClaimedNfft'
import { ConnectButton, useActiveAccount } from 'thirdweb/react'
import { client } from '@/lib/client'
import { defineChain } from 'thirdweb'
import { generatePayload, isLoggedIn, login, logout } from '../actions/login'
import { firebaseAuthClient, firebaseLogout } from '../actions/firebaseauth'
import { useRouter } from 'next/navigation'
import Sider from '@/components/headers/Sider'
import Top from '@/components/headers/Top'
import Carousel from '@/components/explore/trending/Carousel'
import Genre from '@/components/explore/genre/Genre'
import UserSearch from '@/components/explore/popup/UserSearch'
import Recommendations from '@/components/community/Recommendations'
import { recommendedBooks } from '../../../functions/community/fetch'
import Recommend from '@/components/community/Recommend'
import Notifications from '@/components/community/Notifications'


type Props = {}

const { auth } = initializeFirebaseClient();

function page({}: Props) {
    const router = useRouter(); 
  
  const account = useActiveAccount();
  const [currentUser, setCurrentUser] = useState(auth?.currentUser?.uid);
  const [profileUrl, setProfileUrl] = useState<string>(''); 
  const [loading, setLoading] = useState(false);
  const [mintPopup, setMintPopup] = useState<boolean>(false);
  const [mintLoading, setMintLoading] = useState(false);
  const [userBalance, setUserBalance] = useState(0);
  const [claimed, setClaimed] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);


  const [genreOptions, setGenreOptions] = useState([]); 
  
  
  const camp = defineChain({
    id: 123420001114,
  });

  useEffect(() => { 
     // Listen for authentication state changes
     const unsubscribe = onAuthStateChanged(auth, async(user) => {
        setCurrentUser(user?.uid);
        if(user){
          const data = await getUserProfile(user.uid, setProfileUrl);
          if(data?.genres){
            setGenreOptions(data.genres);
           }   
        }else {
          setProfileUrl(''); 
        }
     })

     return () => unsubscribe(); 
   
  }, []);


  useEffect(() => {
    if (currentUser) {
      fetchUserNftBalance(currentUser, setUserBalance);
    }
  }, [currentUser]);

  useEffect(() => {
    if(!account){
      logoutPerm();
    }
  }, [account])

  const mint = async() => {
    if(currentUser && account){
      setMintLoading(true);
      await mintNft(currentUser, setClaimed, account); 
      setMintLoading(false);
    }
  }


  const logoutPerm = async() => {
    await logout();
    await firebaseLogout(router); 
  }

  useEffect(() => {
    if (claimed) {
      const timer = setTimeout(() => {
        setClaimed(false);
      }, 3000); // 3 seconds
  
      return () => clearTimeout(timer);
    }
  }, [claimed]);

  return (
    <div className="flex w-screen h-screen overflow-hidden">
    
      <div className='relative flex w-fit border-r-[0.5px] border-white/50'>
          <Sider 
            setLoading={setLoading}
            userId={currentUser}
            setSearchResults={setSearchResults}
            setShowNotifications={setShowNotifications}
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
              <div className='m-2'>
                  <Carousel 
                    setMintPopup={setMintPopup}
                  />
              </div>

              {genreOptions.length != 0 && (
                  <div className="flex w-full mt-5 halfxl:mt-10 sm:px-2">
                    <Recommend 
                      userGenres={genreOptions}
                    />
                  </div>
              )}

              <div className="flex w-full halfxl:mt-10 sm:px-2">
                 <Genre />
              </div>


              <div className="flex w-full mt-10 halfxl:mt-10 sm:px-2">
                <Trending />
              </div>


          </div>

      </div>

     
        {/* <div className="sticky top-0 w-full z-50">
          <div className="hidden">
                <ConnectButton
                  client={client}
                  chain={camp}
                  detailsButton={{
                    style: {
                      display: "none",
                      background: "transparent", // Transparent to allow the gradient effect
                      color: "white",
                      border: "none", // Remove any default border
                      fontWeight: "600",
                      cursor: "pointer",
                      zIndex: "10", // Ensure the text is above the gradient
                    }
                  }}
                />
          </div>

    
        </div> */}
      {/* <div className='flex flex-col basis-10/12'>

        <div className="flex flex-col w-full" style={{ height: '75vh' }}>
          {userBalance <= 0 && (
            <div onClick={() => setMintPopup(true)} className="flex items-center h-[40px] bg-[#5D3FD3] w-full text-center hover:cursor-pointer">
              <p className="w-full text-lg font-bold text-white text-center"> Claim your golden badge now!</p>
            </div>
          )}
        
        </div>



        {loading && (
        <div className="absolute flex-col inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-black/40">
          <SpinLoader />
        </div>
      )}

      </div> */}
        {mintPopup && (
          <NftMint 
            onCancel={() => setMintPopup(false)}
            onConfirm={mint}
            userBalance={userBalance}
          />
        )}

        {searchResults && (
            <UserSearch 
              setSearchResults={setSearchResults}
              userId={currentUser || ''}
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

export default page