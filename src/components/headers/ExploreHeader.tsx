'use client'
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import SearchIcon from '../icons/SearchIcon';
import { fetchSearchResults } from '../../../functions/explore/fetch';
import SearchResults from '../search/SearchResults';
import { ConnectButton } from 'thirdweb/react';
import { client } from '@/lib/client';
import { defineChain } from 'thirdweb'
import { generatePayload, isLoggedIn, login, logout } from '@/app/actions/login';
import { firebaseAuthClient, firebaseLogout } from '@/app/actions/firebaseauth';


type Props = {
  userId?: string;
  profileUrl : string;
  setLoading: Function
}

function ExploreHeader({profileUrl, setLoading, userId}: Props) {
  const router = useRouter();
  const pathname = usePathname(); 

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const camp = defineChain({
    id: 123420001114,
  });

  const handleSearch = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleExploreClick = () => {
    if(pathname !== '/explore'){
      setLoading(true); 
      router.push('/explore');
    }
  };

  const quickSearch = async() => {
    await fetchSearchResults(searchQuery, setSearchResults);
  }

  useEffect(() => {
    if (searchQuery) {
      quickSearch(); 
    } else {
      setSearchResults([]); // Clear search results when the search query is empty
    }
  }, [searchQuery]);

  useEffect(() => {
    router.prefetch('/dashboard'); // prefetch the dashboard page for faster loading
    router.prefetch('/settings'); 
    router.prefetch('/explore'); 
    router.prefetch('/community'); 
  }, [])


  return (
    <div className="relative flex justify-between z-40 w-full backdrop-blur-md text-white items-center font-mono text-sm py-2 px-6 md:p-4 sm:px-2 xs:px-1">
        <div className="flex w-[60px] h-fit hover:cursor-pointer">

          <img 
            onClick={handleExploreClick}
            className="w-full h-full"
            src="/knovel-logo-white.png"
            alt="knovel community"                
          />

        </div>


        <div className="relative w-1/2 items-center">
          <form onSubmit={handleSearch} className="flex items-center w-full bg-[#272831] rounded-3xl p-0.5">
              <div className="w-full flex bg-[#272831] rounded-3xl items-center px-2">
                  <SearchIcon className="size-5 md:size-4 sm:hidden stroke-[#7c7a85]"/>
                  <input 
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex justify-between py-2 bg-[#272831] text-white px-3 w-full h-full rounded-3xl focus:outline-none"
                    placeholder="Search books by title, genres, author..."
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
      
        <div className="flex border border-[#272831] rounded-xl px-2 items-center hover:cursor-pointer">

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
  )
}

export default ExploreHeader