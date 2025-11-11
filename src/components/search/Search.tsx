'use client'

import Link from 'next/link';
import initializeFirebaseClient from '@/lib/initFirebase'
import { useRouter, useSearchParams } from 'next/navigation';
import { ConnectButton } from 'thirdweb/react';
import React, { useEffect, useRef, useState } from 'react'
import { Book } from '../../..';
import SearchIcon from '@/components/icons/SearchIcon';
import Back from '@/components/icons/Back';
import BookImageSearch from '@/components/search/BookImageSearch';
import { fetchSearchResults, getUserProfile } from '../../../functions/explore/fetch';
import SpinLoader from '../loading/SpinLoader';
import SearchResults from './SearchResults';
import { client } from '@/lib/client';
import { defineChain } from 'thirdweb';
import { generatePayload, isLoggedIn, login, logout } from '@/app/actions/login';
import { firebaseAuthClient, firebaseLogout } from '@/app/actions/firebaseauth';
import { onAuthStateChanged, User } from 'firebase/auth';

type Props = {}

const { auth } = initializeFirebaseClient();

function Search({}: Props) {
  const camp = defineChain({
    id: 123420001114,
  });

  const router = useRouter();
  const [booting, setBooting] = useState(true);  
  const [loading, setLoading] = useState(false);

  const [newQuery, setNewQuery] = useState('');
  const searchParams = useSearchParams();
  const q = searchParams.get('q') || '';
  const [results, setResults] = useState<Book[]>([]);
  const [searchResults, setSearchResults] = useState<Book[]>([]);
  const [profileUrl, setProfileUrl] = useState<string>(''); 

  const activeReq = useRef(0);
  
  const waitForAuth = () =>
    new Promise<User|null>((resolve) => {
        const unsub = onAuthStateChanged(auth, (u) => {
          unsub();
          resolve(u);
        });
    });


  useEffect(() => {
    let alive = true;

    (async() => {
        setBooting(true);
        setLoading(true);

        // kick off param search early (if q exists)
        const reqId = ++activeReq.current;

        const searchP = q
        ? fetchSearchResults(q, (books: Book[]) => {
            if (alive && activeReq.current === reqId) setResults(books);
          })
        : Promise.resolve();

        const user = await waitForAuth();
        if (!alive) return;

         if(user?.uid){
          getUserProfile(user.uid, setProfileUrl);
         }else{
          setProfileUrl('');
        }

        await searchP;
        if (!alive) return;

        setLoading(false);
        setBooting(false);
    })();
    return () => { alive = false; };
  }, [])

  useEffect(() => {
    let alive = true;
    if (!q) {
      setResults([]);
      return;
    }
    setLoading(true);
    const reqId = ++activeReq.current;

    (async () => {
      await fetchSearchResults(q, (books: Book[]) => {
        if (alive && activeReq.current === reqId) setResults(books);
      });
      if (!alive) return;
      setLoading(false);
    })();

    return () => { alive = false; };
  }, [q]);

  // type-ahead search for the input (debounced)
  useEffect(() => {
    let alive = true;
    if (!newQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const t = setTimeout(() => {
      (async () => {
        await fetchSearchResults(newQuery.trim(), (books: Book[]) => {
          if (alive) setSearchResults(books);
        });
      })();
    }, 250);
    return () => { alive = false; clearTimeout(t); };
  }, [newQuery]);
    


  const handleSearch = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (newQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(newQuery.trim())}`);
    }
  };

  return (
    <main className="flex flex-col w-screen min-h-screen items-center text-white font-mono">
        <div className="flex relative items-center w-full justify-center my-8">
            <Link href="/explore" className="absolute left-10 text-white">
              <Back className="size-8 stroke-white" />
            </Link>
            
            <div className="relative w-1/2 items-center">
                <form onSubmit={handleSearch} className="flex w-full bg-[#272831] rounded-3xl p-0.5">
                  <div className="w-full flex bg-[#272831] rounded-3xl items-center px-2">
                      <SearchIcon className="size-5 md:size-4 sm:hidden stroke-[#7c7a85]"/>

                      <input 
                        type="text"
                        value={newQuery}
                        onChange={(e) => setNewQuery(e.target.value)}
                        className="flex justify-between py-2 bg-[#272831] px-3 w-full h-full rounded-3xl focus:outline-none" 
                        placeholder="Search books, authors and community"
                      />

                      <button type="submit" className="py-2 text-black font-bold px-2 rounded-3xl border-l border-[#7c7a85]">
                        <SearchIcon className="size-5 md:size-4 sm:hidden stroke-white"/>
                      </button>
                  </div>
                </form>

                {searchResults.length > 0 && (
                  <div className="absolute top-full w-full rounded-xl shadow-md bg-[#1d242e] mt-2">
                    <SearchResults results={searchResults}/>
                  </div>
                )}
            </div>

            <div className="hidden border border-[#272831] rounded-xl px-2 items-center hover:cursor-pointer">
    
                <ConnectButton
                  client={client}
                  chain={camp}
                  detailsButton={{
                    style: {
                      background: "transparent", // Transparent to allow the gradient effect
                      color: "white",
                      border: "none", // Remove any default border
                      fontWeight: "600",
                      cursor: "pointer",
                      zIndex: "10", // Ensure the text is above the gradient
                    },
                    connectedAccountAvatarUrl:`${profileUrl}`,
                    showBalanceInFiat: "USD",
                  }}
                  detailsModal={{
                    connectedAccountAvatarUrl:`${profileUrl}`,
                    showBalanceInFiat: "USD"
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
                      return await isLoggedIn();
                    },
                    doLogout: async () => {
                      await logout();
                      await firebaseLogout(router); 
                    },
                  }}
                />
            </div>


        </div>

        <div className="text-white text-2xl font-bold mb-4 extramini:text-center">
            <p>Search Results for "{q}"</p>
        </div>

        <div className="text-white px-4 xl:px-2">
            {results.length > 0 ? (
                <div className="grid grid-cols-5 2xl:grid-cols-4 halflg:grid-cols-3 extramini:grid-cols-2 gap-4 halflg:gap-2">
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
            ) : (
              <p>No results found</p>
            )}
        </div>

      {/* ✅ Overlay with blur effect */}
      {(booting || loading) && (
        <div className="absolute flex-col inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-black/40">
          <SpinLoader />
          <p className="text-lg text-white font-semibold">{booting ? 'Loading search…' : 'Searching…'}</p>
        </div>
      )}

    </main>
  )
}

export default Search