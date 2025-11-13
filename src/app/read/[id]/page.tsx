'use client'

import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import ExploreHeader from '@/components/headers/ExploreHeader';
import { BookChapters, BookMetadata } from '../../../..';
import initializeFirebaseClient from '@/lib/initFirebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { getUserProfile } from '../../../../functions/explore/fetch';
import { fetchBookInfo } from '../../../../functions/read/fetch';
import Reader from '@/components/read/Reader';
import SpinLoader from '@/components/loading/SpinLoader';
import CommentSection from '@/components/read/CommentSection';
import UsernamePopup2 from '@/components/read/UsernamePopup';
import PageAnalytics from '@/components/analytics/PageAnalytics';


type Props = {}
const { auth } = initializeFirebaseClient();
function Read({}: Props) {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [booting, setBooting] = useState(true);  

  const [currentUser, setCurrentUser] = useState(auth?.currentUser?.uid);
  const [profileUrl, setProfileUrl] = useState<string>(''); 

  const [chapters, setChapters] = useState<BookChapters[]>([])
  const [book, setBook] = useState();
  const [metadata, setMetadata] = useState<BookMetadata>(); 
  const [authorId, setAuthorId] = useState<string>('');

  const [showChat, setShowChat] = useState(false);
  const [usernamePopup, setUsernamePopup] = useState<boolean>(false);
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');

  const waitForAuth = () =>
    new Promise<User | null>((resolve) => {
      const unsub = onAuthStateChanged(auth, (u) => {
        unsub();
        resolve(u);
      });
    });

  useEffect(() => { 
    let alive = true;

    (async() => {
        // guard: need an id to fetch the book
        if (!params?.id) {
          setBooting(false);
          return;
        }

        setBooting(true);
        setLoading(true);

        // Kick off both in parallel:
        // - Book fetch (chapters + metadata)
        const bookP = fetchBookInfo(
          params.id,
          router,
          (chs:BookChapters[]) => { if (alive) setChapters(chs) },
          (bk:any)  => { if (alive) setBook(bk) },
          (md: BookMetadata)  => { if (alive) setMetadata(md) },
          (aid:string) => { if (alive) setAuthorId(aid) }
        );

        // - First auth tick + profile
        const user = await waitForAuth();
        if (!alive) return;

        setCurrentUser(user?.uid);
        if(user?.uid){
            const data = await getUserProfile(user.uid, setProfileUrl);
            if (alive && data) {
              setUsername(data.username ?? '');
              setName(data.name ?? '');
            }
        }else{
          setProfileUrl('');
        }

        // Wait for the book data to complete
        await bookP;
        if (!alive) return;

        setLoading(false);
        setBooting(false);

    })();
    return () => { alive = false; };
  
 }, [params?.id, router]);

  return (
    <div className="flex w-screen h-screen flex-col items-center">
      <PageAnalytics pageTitle="Read" pagePath="/read" />

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
      {(booting || loading) && (
        <div className="absolute flex-col inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-black/40">
          <SpinLoader />
          <p className="text-lg text-white font-semibold"> {booting ? 'Loading book…' : 'Fetching book…'}</p>
        </div>
      )}

    </div>
  )
}

export default Read