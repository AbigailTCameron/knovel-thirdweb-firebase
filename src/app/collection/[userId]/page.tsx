'use client'
import initializeFirebaseClient from '@/lib/initFirebase';
import { onAuthStateChanged } from 'firebase/auth';
import React, { useEffect, useState } from 'react'
import { getUserProfile } from '../../../../functions/explore/fetch';
import ExploreHeader from '@/components/headers/ExploreHeader';
import { useParams } from 'next/navigation';
import CommunityHeader from '@/components/headers/CommunityHeader';
import UserProf from '@/components/profile/UserProf';

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
    <div className="flex sm:flex-col w-screen h-screen overflow-hidden sm:overflow-y-auto">
        <div className="w-1/12 sm:w-full sm:h-fit sm:sticky sm:top-0 h-full z-50 border-r-[0.5px] border-white/50 flex-shrink-0">
          <CommunityHeader 
            userId={currentUser}
            profileUrl={profileUrl}
            setLoading={setLoading}
            setSearchResults={setSearchResults}
          />
        </div>

        <div className="flex-grow h-full sm:w-full overflow-hidden sm:overflow-y-auto">
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
  )
}

export default Collection