'use client'
import React, { useEffect, useState } from 'react'
import initializeFirebaseClient from '@/lib/initFirebase'
import { fetchUserNftBalance, getUserProfile, mintNft } from '../../../functions/explore/fetch'
import { onAuthStateChanged } from 'firebase/auth'
import ExploreHeader from '@/components/headers/ExploreHeader'
import TrendingCarousel from '@/components/explore/trending/TrendingCarousel'
import Trending from '@/components/explore/trending/Trending'
import Genre from '@/components/explore/genre/Genre'
import SpinLoader from '@/components/loading/SpinLoader'
import NftMint from '@/components/explore/popup/NftPopup'
import Butterfly from '@/components/loading/Butterfly'
import ClaimedNft from '@/components/explore/popup/ClaimedNfft'
import { ConnectButton, useActiveAccount } from 'thirdweb/react'
import { client } from '@/lib/client'
import { defineChain } from 'thirdweb'
import { generatePayload, isLoggedIn, login, logout } from '../actions/login'
import { firebaseAuthClient, firebaseLogout } from '../actions/firebaseauth'
import { useRouter } from 'next/navigation'


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

  const camp = defineChain({
    id: 123420001114,
  });

  useEffect(() => { 
     // Listen for authentication state changes
     const unsubscribe = onAuthStateChanged(auth, (user) => {
        setCurrentUser(user?.uid);
        if(user){
          getUserProfile(user.uid, setProfileUrl);
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

  if (loading) return <SpinLoader />;
  if (mintLoading) return <Butterfly />;

  return (
    <div className="flex w-screen min-h-screen flex-col items-center">
        <div className="sticky top-0 w-full z-50">
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
                    auth={{
                      getLoginPayload: async ({ address }) => {
                        return generatePayload({ address })
                      },
                      doLogin: async (params) => {
                        const result = await login(params); 
                        if(result && result.token) {
                          const {token} = result;
                          firebaseAuthClient(token, router);
                        }
                        
                      },
                      isLoggedIn: async () => {
                        const result = await isLoggedIn();
                        if(!result){
                          await logout();
                          await firebaseLogout(router); 
                          return false;
                        }
                        console.log("the result being returned is", result)
                        return result;
                      },
                      doLogout: async () => {
                        await logout();
                        await firebaseLogout(router); 
                      },
                    }}
              
                />
          </div>

          <ExploreHeader 
            userId={currentUser}
            profileUrl={profileUrl}
            setLoading={setLoading}
          />
        </div>

        <div className="flex flex-col w-full" style={{ height: '75vh' }}>
          {userBalance <= 0 && (
            <div onClick={() => setMintPopup(true)} className="flex items-center h-[40px] bg-[#5D3FD3] w-full text-center hover:cursor-pointer">
              <p className="w-full text-lg font-bold text-white text-center"> Claim your golden badge now!</p>
            </div>
          )}
        
          <TrendingCarousel 
            setMintPopup={setMintPopup}
          />
        </div>

        <div className="flex w-full h-full mt-20 halfxl:mt-10 px-20 xl:px-10 sm:px-2">
          <Trending />
        </div>

        <div className="w-full h-full">
          <Genre />
        </div>

        {mintPopup && (
          <NftMint 
            onCancel={() => setMintPopup(false)}
            onConfirm={mint}
            userBalance={userBalance}
          />
        )}

        {claimed && (
          <ClaimedNft 
            onCancel={() => setClaimed(false)}
          />
        )}

        
    </div>
  )
}

export default page