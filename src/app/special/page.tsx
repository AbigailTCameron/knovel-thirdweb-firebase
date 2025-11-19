'use client'

import ExploreHeader from '@/components/headers/ExploreHeader'
import React, { useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import initializeFirebaseClient from '@/lib/initFirebase';
import { fetchThemeResults, getUserProfile } from '../../../functions/explore/fetch';
import SpinLoader from '@/components/loading/SpinLoader';
import HalloweenLights from '@/components/lights/HalloweenLights';
import { Book } from '../../..';
import { useRouter } from 'next/navigation';
import BookImageSearch from '@/components/search/BookImageSearch';
import { Bokor } from 'next/font/google';



type Props = {}

const bokor = Bokor({
  subsets: ['latin'],
  weight: "400"
})

const { auth } = initializeFirebaseClient();
function Special({}: Props) {
  const router = useRouter();
  
  const [currentUser, setCurrentUser] = useState(auth?.currentUser?.uid);
  const [profileUrl, setProfileUrl] = useState<string>(''); 

  const [results, setResults] = useState<Book[]>([]);
  
  const [booting, setBooting] = useState(true);      // 🔑 block UI until first data ready
  const [loading, setLoading] = useState(false);

  const themes=["gothic", "horror", "thriller", "supernatural","mystery"];

  
  // 🔁 1) Persistent auth listener (like ExplorePageClient)
  useEffect(() => {
    setBooting(true);

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('Special page auth state changed:', user?.uid);
      setCurrentUser(user?.uid || undefined);

      if (user) {
        // you only need side-effect; function already sets profileUrl internally
        await getUserProfile(user.uid, setProfileUrl);
      } else {
        setProfileUrl('');
      }

      // We don't set booting false here yet; we let the books fetch control that
      // so the overlay only disappears once books are ready too.
    });

    return () => unsubscribe();
  }, []);


  // 📚 2) Fetch spooky theme results (independent of auth)
  useEffect(() => {
    let alive = true;

    (async () => {
      setBooting(true);
      setLoading(true);

      await fetchThemeResults(themes, (books: Book[]) => {
        if (!alive) return;
        setResults(books);
      });

      if (!alive) return;
      setLoading(false);
      setBooting(false); // 🔑 only when books are ready
    })();

    return () => {
      alive = false;
    };
  }, []); // run once on mount

  return (
    <div className="flex w-screen h-screen flex-col items-center">
      <div className="sticky top-0 w-full z-50">
          <ExploreHeader 
            userId={currentUser}
            profileUrl={profileUrl}
            setLoading={setLoading}
          />
      </div>

  
      <HalloweenLights className="fixed inset-0 -z-10"/>
    
      <div className="py-2 flex items-center text-center justify-center">
        <p className={`text-8xl sm:text-6xl font-extrabold text-white ${bokor.className}`}>Spooky Picks:</p>
      </div>

    <div className="grid grid-cols-5 2xl:grid-cols-4 halflg:grid-cols-3 sm:grid-cols-2 ss:grid-cols-1 ss:gap-8 gap-4 halflg:gap-2">
          {results.map((result) => (
            <div 
              onMouseEnter={() => router.prefetch(`/book/${result.id}`)}
              onClick={() => router.push(`/book/${result.id}`)} 
              key={result.id} 
              className="w-fit h-fit hover:cursor-pointer">
              <BookImageSearch imageFile={result?.book_image}/>
            </div>
          ))}
      </div>


      {/* ✅ Overlay with blur effect */}
      {(booting || loading) && (
        <div className="absolute flex-col inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-black/40">
          <SpinLoader />
          <p className="text-lg text-white font-semibold"> {booting ? 'Loading collection…' : 'Fetching books…'}</p>
        </div>
      )}

    </div>
  )
}

export default Special