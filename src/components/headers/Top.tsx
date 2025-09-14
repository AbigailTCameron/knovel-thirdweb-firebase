import { usePathname, useRouter } from 'next/navigation';
import React, { useRef, useState } from 'react'
import SearchIcon from '../icons/SearchIcon';
import SearchResults from '../search/SearchResults';
import { ConnectButton } from 'thirdweb/react';
import { client } from '@/lib/client';
import { defineChain } from 'thirdweb'
import UserProfileImage from './UserProfileImage';
import AccountDropdown from '../explore/AccountDropdown';

type Props = {
  profileUrl : string;
  setLoading: Function;
}

function Top({profileUrl, setLoading}: Props) {
  const router = useRouter();
  const pathname = usePathname(); 
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [dropdown, setDropdown] = useState(false);
  

  const camp = defineChain({
    id: 123420001114,
  });
  

  const handleSearch = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleDashboardClick = () => {
    if(pathname !== '/dashboard'){
      setLoading(true); 
      router.push('/dashboard');
    }
  };

  const handleSettingsClick = () => {
    if(pathname !== '/settings'){
      setLoading(true);
      router.push('/settings');
    }
  };

  const handleClickCommunity = () => {
    if(pathname !== '/community'){
      setLoading(true); 
      router.push('/community');
    }
  }


  return (
    <div className='relative flex w-full items-center px-4 py-1 z-10'>
         <div className="relative items-center basis-2/4">
            <form onSubmit={handleSearch} className="flex items-center w-full bg-gradient-to-r from-[#6DDCFF] to-[#7F60F9] rounded-3xl p-0.5">
                <div className="w-full flex bg-black rounded-3xl items-center p-1">
                    <SearchIcon className="size-5 md:size-4 sm:hidden"/>
                    <input 
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="flex justify-between py-3 px-3 bg-black w-full h-full rounded-3xl focus:outline-none" 
                      placeholder="Search books by title, genres, author..."
                    />

                    <button type="submit" className="py-3 bg-white text-black font-bold px-4 rounded-3xl">
                      Search
                    </button>
                </div>
            </form>

            {searchResults.length > 0 && (
              <div className="absolute top-full w-full rounded-xl shadow-md bg-[#1d242e] mt-2">
                <SearchResults results={searchResults}/>
              </div>
            )}

        </div>

        <div className="hidden">
            <ConnectButton
              client={client}
              chain={camp}
              detailsButton={{
                style: {
                  display: "none",
                  background: "transparent", // Transparent to allow the gradient effect
                  color: "white",
                  border: "none", // Remove any default border
                  fontWeight: "600",
                  cursor: "pointer",
                  zIndex: "10", // Ensure the text is above the gradient
                }
              }}
            />
        </div>

        <div ref={dropdownRef} className="absolute right-0 hover:cursor-pointer">
            <UserProfileImage 
              profileUrl={profileUrl}
              onClick={() => setDropdown((prev) => !prev)}
            />
          
            {dropdown && (
              <div className="absolute min-w-64 right-0 mt-6 bg-[#1d242e] rounded-lg shadow-xl z-50">
                <AccountDropdown 
                  handleDashboardClick={handleDashboardClick}
                  handleSettingsClick={handleSettingsClick}
                  handleClickCommunity={handleClickCommunity}
                />
              </div>
            )}
        </div>
      
    </div>
  )
}

export default Top