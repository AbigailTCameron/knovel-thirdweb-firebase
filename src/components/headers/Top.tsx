import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react'
import SearchIcon from '../icons/SearchIcon';
import SearchResults from '../search/SearchResults';
import { ConnectButton } from 'thirdweb/react';
import { client } from '@/lib/client';
import { defineChain } from 'thirdweb'
import { generatePayload, isLoggedIn, login, logout } from '@/app/actions/login';
import { firebaseAuthClient, firebaseLogout } from '@/app/actions/firebaseauth';
import { fetchSearchResults } from '../../../functions/explore/fetch';


type Props = {
  profileUrl : string;
}

function Top({profileUrl}: Props) {
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);
  
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

  const quickSearch = async() => {
    await fetchSearchResults(searchQuery, setSearchResults);
  }

  useEffect(() => {
    if (!searchQuery) return; 
    quickSearch();                  

  });


  return (
    <div className='flex w-full justify-between items-center backdrop-blur-md px-4 py-2 z-30'>
         <div className="relative items-center basis-2/4 lg:basis-3/4 md:basis-full md:w-full">
            <form onSubmit={handleSearch} className="flex items-center bg-[#272831] w-full rounded-3xl p-0.5">
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

            {searchQuery && searchResults.length > 0 && (
              <div className="absolute top-full w-full rounded-xl shadow-md bg-[#1d242e] mt-2">
                <SearchResults results={searchResults}/>
              </div>
            )}

        </div>

        <div ref={dropdownRef} className="flex md:hidden border border-[#272831] rounded-xl px-2 items-center hover:cursor-pointer">

            <ConnectButton
              client={client}
              chain={camp}
              connectModal={{ 
                size: "wide",
                title: "Knovel Protocol ",
                titleIcon: "/knovel-logo-white.png",
              }}
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
              connectButton={{
                label: "Sign in",
                style: {
                  background: "transparent", // Transparent to allow the gradient effect
                  color: "white",
                  border: "none", // Remove any default border
                  fontWeight: "600",
                  cursor: "pointer",
                  zIndex: "10", // Ensure the text is above the gradient
                }
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

export default Top