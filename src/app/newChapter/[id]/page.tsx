'use client'
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth';
import { getUserProfile } from '../../../../functions/explore/fetch';
import initializeFirebaseClient from '@/lib/initFirebase';
import TipTapNewDraft from '@/components/newchapter/TipTapNewChapter';
import SpinLoader from '@/components/loading/SpinLoader';
import Sider from '@/components/headers/Sider';
import UserList from '@/components/community/UserList';
import Top from '@/components/headers/Top';


type Props = {}
const { auth } = initializeFirebaseClient();
function NewChapter({}: Props) {
  const [currentUser, setCurrentUser] = useState(auth?.currentUser?.uid);
  const params = useParams<{ id: string }>();
  const [profileUrl, setProfileUrl] = useState<string>(''); 
  const [loading, setLoading] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [searchResults, setSearchResults] = useState(false);


  useEffect(() => { 
    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, async(user) => {
       setCurrentUser(user?.uid);
       if(user){
          await getUserProfile(user.uid, setProfileUrl);    
       }else {
         setProfileUrl(''); 
       }
    })
    return () => unsubscribe(); 
  
  }, []);


  return (
    <main className="flex w-screen h-screen overflow-hidden">
      <div className='flex w-fit border-r-[0.5px] border-white/50'>
          <Sider 
            setLoading={setLoading}
            userId={currentUser}
            setSearchResults={setSearchResults}
          />
      </div>

      <div className="flex flex-col w-full h-full relative">
          {searchResults && (
            <div className="absolute z-50 w-1/3 sm:w-3/4 h-full bg-[#0b0b0b] shadow-lg left-0 rounded-r-md">
              <UserList 
                setSearchResults={setSearchResults}
                userId={currentUser || ''}
              />
            </div>
          )}

          <div className='flex flex-col w-full'>
            <Top 
              profileUrl={profileUrl}
              setLoading={setLoading}
            />
          </div>

          <TipTapNewDraft 
            userId={currentUser || ''}
            id={params.id}
            setLoading={setPublishing}
          />

      </div>


      {/* ✅ Overlay with blur effect */}
      {loading && (
        <div className="absolute flex-col inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-black/40">
          <SpinLoader />
        </div>
      )}

      {publishing && (
        <div className="absolute flex-col inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-black/40">
          <SpinLoader />
          <p className="text-lg text-white font-semibold">Saving...</p>
        </div>
      )}
    </main>
  )
}

export default NewChapter