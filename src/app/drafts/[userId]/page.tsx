'use client'
import React, { useEffect, useState } from 'react'
import ExploreHeader from '@/components/headers/ExploreHeader';
import DashboardSider from '@/components/dashboard/DashboardSider';
import initializeFirebaseClient from '@/lib/initFirebase';
import { getUserProfile } from '../../../../functions/explore/fetch';
import { onAuthStateChanged } from 'firebase/auth';
import UserListDrafts from '@/components/drafts/UserListDrafts';


type Props = {}
const { auth } = initializeFirebaseClient();

function UserDrafts({}: Props) {
  const [currentUser, setCurrentUser] = useState(auth?.currentUser?.uid);
  const [profileUrl, setProfileUrl] = useState<string>(''); 
  const [username, setUsername] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);


  useEffect(() => { 
    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, async(user) => {
       setCurrentUser(user?.uid);
       if(user){
         const data = await getUserProfile(user.uid, setProfileUrl);
         if(data){
          setUsername(data.username);
         }
         
       }else {
         setProfileUrl(''); 
       }
    })
    return () => unsubscribe(); 
  }, []);
  

  return (
    <main className="flex w-screen h-screen flex-col items-center">
        <div  className="sticky top-0 w-full z-50">
            <ExploreHeader profileUrl={profileUrl} />
        </div>
    
        <div className={`flex md:flex-col w-full h-full items-center space-x-2 p-4 overflow-hidden`}>
            <div className="flex basis-1/4 bg-[#171717] rounded-xl w-full h-full">
                <DashboardSider 
                  userId={currentUser}
                  setLoading={setLoading}
                  profileUrl={profileUrl}
                  username={username}
                />
            </div>

            <div className="flex basis-3/4 rounded-xl w-full h-full overflow-y-scroll">
                <UserListDrafts 
                  userId={currentUser || ''}
                  setLoading={setLoading}
                />
            </div>

        </div>
    </main>
  )
}

export default UserDrafts