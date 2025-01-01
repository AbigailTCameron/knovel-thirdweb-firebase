'use client'
import ExploreHeader from '@/components/headers/ExploreHeader'
import React, { useEffect, useState } from 'react'
import initializeFirebaseClient from '@/lib/initFirebase';
import { onAuthStateChanged } from 'firebase/auth';
import { getUserProfile } from '../../../functions/explore/fetch';
import TipTapCreate from '@/components/create/TipTapCreate';


type Props = {}
const { auth } = initializeFirebaseClient();
function Create({}: Props) {
  const [currentUser, setCurrentUser] = useState(auth?.currentUser?.uid);
  const [profileUrl, setProfileUrl] = useState<string>(''); 
  const [name, setName] = useState<string>(''); 

  useEffect(() => { 
    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, async(user) => {
       setCurrentUser(user?.uid);
       if(user){
         const data = await getUserProfile(user.uid, setProfileUrl);
         if(data){
          setName(data.name); 
         }
         
       }else {
         setProfileUrl(''); 
       }
    })
    return () => unsubscribe(); 
  }, []);


  return (
    <main className="flex flex-col w-screen h-screen items-center">
        <div  className="sticky top-0 w-full z-50">
            <ExploreHeader profileUrl={profileUrl} />
        </div>

        <TipTapCreate 
          userId={currentUser}
          name={name}
        />
    </main>
  )
}

export default Create