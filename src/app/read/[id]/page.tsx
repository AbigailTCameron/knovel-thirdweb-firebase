'use client'

import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import ExploreHeader from '@/components/headers/ExploreHeader';
import { BookChapters, BookMetadata } from '../../../..';
import initializeFirebaseClient from '@/lib/initFirebase';
import { onAuthStateChanged } from 'firebase/auth';
import { getUserProfile } from '../../../../functions/explore/fetch';
import { fetchBookInfo } from '../../../../functions/read/fetch';
import Reader from '@/components/read/Reader';
import SpinLoader from '@/components/loading/SpinLoader';
import CommentSection from '@/components/read/CommentSection';
import UsernamePopup2 from '@/components/read/UsernamePopup';


type Props = {}
const { auth } = initializeFirebaseClient();
function Read({}: Props) {
  const params = useParams<{ id: string }>();
  const [currentUser, setCurrentUser] = useState(auth?.currentUser?.uid);
  const [profileUrl, setProfileUrl] = useState<string>(''); 
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [chapters, setChapters] = useState<BookChapters[]>([])
  const [book, setBook] = useState();
  const [metadata, setMetadata] = useState<BookMetadata>(); 
  const [showChat, setShowChat] = useState(false);
  const [authorId, setAuthorId] = useState<string>('');
  const [usernamePopup, setUsernamePopup] = useState<boolean>(false);
  const [username, setUsername] = useState('');
  const [name, setName] = useState('')


  useEffect(() => { 
    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, async(user) => {
       setCurrentUser(user?.uid);
       if(user){
        const data = await getUserProfile(user.uid, setProfileUrl);
        if(data){
          setUsername(data.username);
          setName(data.name);
        }
       }else {
         setProfileUrl(''); 
       }
    })

    return () => unsubscribe(); 
  
 }, []);

  useEffect(() => {
    if(params.id){
      const fetchBook = async() => {
        await fetchBookInfo(params.id, router, setChapters, setBook, setMetadata, setAuthorId); 
      }
      fetchBook();
    }
  }, [params.id]);


  return (
    <div className="flex w-screen h-screen flex-col items-center">
      <div className="sticky top-0 w-full z-50">
          <ExploreHeader 
            userId={currentUser}
            profileUrl={profileUrl}
            setLoading={setLoading}
          />
      </div>

      <div className="flex w-full h-full overflow-x-hidden">
          <div className={`${showChat ? 'w-[49%] sm:hidden' : 'w-[100%]'} flex items-center justify-center h-full px-4 py-1`}>
            <Reader 
                chapters={chapters}
                book={book}
                metadata={metadata}
                id={params.id}
                setShowChat={setShowChat}
                showChat={showChat}
            />
          </div>

          {usernamePopup && (
            <UsernamePopup2 
              onCancel={() => setUsernamePopup(false)}
              onConfirm={() => router.push('/settings')}
            />
          )}

    
          {showChat && (
            <div className={`${showChat ? 'grow w-[50%] sm:w-full' : 'hidden'} h-full z-10`}>
              <CommentSection 
                title={metadata?.title || ''}
                profileUrl={profileUrl}
                userId={currentUser|| ''}
                bookId={params.id}
                authorId={authorId}
                setShowChat={setShowChat}
                username={username}
                name={name}
                setUsernamePopup={setUsernamePopup}
              />
          </div>
          )}

      </div>
      

         {/* ✅ Overlay with blur effect */}
      {loading && (
        <div className="absolute flex-col inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-black/40">
          <SpinLoader />
          <p className="text-lg text-white font-semibold">Fetching book...</p>
        </div>
      )}

    </div>
  )
}

export default Read