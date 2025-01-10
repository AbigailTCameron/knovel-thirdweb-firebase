'use client'
import React, { useEffect, useState } from 'react';
import ExploreHeader from '@/components/headers/ExploreHeader';
import { useParams } from 'next/navigation';
import initializeFirebaseClient from '@/lib/initFirebase';
import { onAuthStateChanged } from 'firebase/auth';
import { getUserProfile } from '../../../../../functions/explore/fetch';
import TipTapEdit from '@/components/edit/TipTapEdit';
import UploadingDraft from '@/components/loading/UploadingDraft';
import SpinLoader from '@/components/loading/SpinLoader';


type Props = {}
const { auth } = initializeFirebaseClient();

function Edit({}: Props) {
  const [currentUser, setCurrentUser] = useState(auth?.currentUser?.uid);
  const params = useParams<{ draftId: string, index: string }>();
  const [profileUrl, setProfileUrl] = useState<string>(''); 
  const [loading, setLoading] = useState(false); 
  const [uploading, setUploading] = useState(false);

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

  if(uploading){
    return(
      <div className="w-screen h-screen">
         <UploadingDraft />
      </div>
     
    )
  }


  if(loading){
    return(
      <SpinLoader />
    )
  }

  return (
    <main className="flex flex-col w-screen h-screen items-center">
      <div  className="sticky top-0 w-full z-50">
        <ExploreHeader 
          userId={currentUser}
          profileUrl={profileUrl}
          setLoading={setLoading}  
        />
      </div>

      <TipTapEdit 
        draftId={params.draftId}
        index={parseInt(params.index)}
        userId={currentUser || ''}
        setLoading={setUploading}
      />
    </main>
  )
}

export default Edit