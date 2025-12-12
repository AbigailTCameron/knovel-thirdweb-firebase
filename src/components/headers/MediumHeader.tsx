import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import SearchIcon from '../icons/SearchIcon';
import SearchResults from '../search/SearchResults';
import Menu from '../icons/Menu';
import { fetchSearchResults } from '../../../functions/explore/fetch';
import SideMenu from './SideMenu';
import Image from 'next/image';

type Props = {
  userId ?: string;   
  setUserResults: (value: boolean) => void;
  setShowNotifications: (value: boolean) => void;
  setSettingsPopup: (value: boolean) => void;
  setLoading: (value: boolean) => void;
  onRequireWalletConnect?: () => void;
}

function MediumHeader({setLoading, setShowNotifications, setSettingsPopup, userId, setUserResults, onRequireWalletConnect}: Props) {
  const router = useRouter();
  const pathname = usePathname(); 
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [menu, showMenu] = useState(false);
  
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
    if (!searchQuery) return; 
    quickSearch();                  

  });


  return (
    <div className='flex w-full justify-between items-center backdrop-blur-md px-4 py-2 z-10'>

      <div className='flex space-x-2 items-center w-fit mr-2'>
          <Menu onClick={() => showMenu(true)} className='stroke-white size-6'/>
          <div className="flex w-[60px] h-fit hover:cursor-pointer">
              <Image 
                onClick={handleExploreClick}
                className="w-full h-full"
                src="/knovel-logo-white.png"
                alt="knovel community" 
                width={"500"}
                height={"500"}
              />
          </div>

      </div>
      
  
      <div className="relative grow items-center w-full">
          <form onSubmit={handleSearch} className="flex items-center bg-[#7F60F9]/20 backdrop-blur-lg border border-[#7F60F9]/15 w-full rounded-3xl p-0.5">
              <div className="w-full flex rounded-3xl items-center px-2">
                  <SearchIcon className="size-5 md:size-4 sm:hidden stroke-[#7c7a85]"/>
                  <input 
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex justify-between py-2 bg-inherit text-white px-3 w-full h-full rounded-3xl focus:outline-none" 
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

      {menu && (
     
          <SideMenu 
            setLoading={setLoading}
            userId={userId}
            setSearchResults={setUserResults}
            setShowNotifications={setShowNotifications}
            setSettingsPopup={setSettingsPopup}
            showMenu={showMenu}
            onRequireWalletConnect={onRequireWalletConnect}
          />
      
      )}

    </div>
  )
}

export default MediumHeader