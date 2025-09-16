'use client'
import initializeFirebaseClient from '@/lib/initFirebase';
import { onAuthStateChanged } from 'firebase/auth';
import React, { useEffect, useState } from 'react'
import { getUserProfile } from '../../../../functions/explore/fetch';
import { useParams } from 'next/navigation';
import UserProf from '@/components/profile/UserProf';
import Sider from '@/components/headers/Sider';
import Top from '@/components/headers/Top';
import UserSearch from '@/components/explore/popup/UserSearch';
import Notifications from '@/components/community/Notifications';

type Props = {}

const { auth } = initializeFirebaseClient();
function Collection({}: Props) {
  const params = useParams<{ id: string }>();

  const [currentUser, setCurrentUser] = useState(auth?.currentUser?.uid);
  const [profileUrl, setProfileUrl] = useState<string>(''); 
  const [searchResults, setSearchResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  

  useEffect(() => { 
    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, async(user) => {
       setCurrentUser(user?.uid);
       if(user){
         const data = await getUserProfile(user.uid, setProfileUrl);
         if(data){
          setName(data.name);
          setUsername(data.username);
         }      
       }else {
         setProfileUrl(''); 
       }
    })
    return () => unsubscribe(); 
  
  }, []);

  return (
    <div className="flex w-screen h-screen overflow-hidden">
        <div className='flex w-fit border-r-[0.5px] border-white/50'>
            <Sider 
              setLoading={setLoading}
              userId={currentUser}
              setSearchResults={setSearchResults}
              setShowNotifications={setShowNotifications}
            />
        </div>

        <div className="flex flex-col w-full h-full overflow-y-scroll">
            <div className='flex flex-col w-full sticky top-0 z-20'>
                <Top 
                  profileUrl={profileUrl}
                  setLoading={setLoading}
                />
            </div>
            <div className='w-full flex flex-col p-4'>

              <UserProf 
                searchResults={searchResults}
                setSearchResults={setSearchResults}
                userId={currentUser || ''}
                name={name}
                username={username}
                profileUrl={profileUrl}
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

    </div>
  )
}

export default Collection