'use client'
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect } from 'react'
import SearchIcon from '../icons/SearchIcon';
import SettingsIcon from '../icons/SettingsIcon';
import Profile from '../icons/Profile';
import Dashboard from '../icons/Dashboard';
import HomeIcon from '../icons/HomeIcon';


type Props = {
  userId?: string;
  profileUrl : string;
  setLoading: Function;
  setSearchResults: Function;
}

function CommunityHeader({profileUrl, setLoading, userId, setSearchResults}: Props) {
  const router = useRouter();
  const pathname = usePathname(); 


  const handleExploreClick = () => {
    if(pathname !== '/explore'){
      setLoading(true); 
      router.push('/explore');
    }
  };


  const handleCommunityClick = () => {
    if(pathname !== '/community'){
      setLoading(true); 
      router.push('/community');
    }
  };

  const handleSettingsClick = () => {
    if(pathname !== '/settings'){
      setLoading(true);
      router.push('/settings');
    }
  };

  useEffect(() => {
    router.prefetch('/dashboard'); // prefetch the dashboard page for faster loading
    router.prefetch('/settings'); 
    router.prefetch('/explore'); 
    router.prefetch('/community'); 
  }, [])

  return (
    <div className="relative flex flex-col sm:flex-row z-40 w-full h-full sm:h-fit text-white items-center font-mono text-sm py-6 px-6 md:p-4 sm:px-2 xs:px-1">
        
        <div className="flex items-center justify-center">
             <div className="flex w-[70px] h-fit hover:cursor-pointer">
                  <img 
                    onClick={handleExploreClick}
                    className="w-full h-full"
                    src="/knovel-logo-white.png"
                    alt="knovel community"                
                  />

              </div>
        </div>
      

        <div className="flex flex-col sm:flex-row w-full h-1/2 space-y-4 sm:space-y-0 sm:space-x-2 items-center self-center place-content-center place-items-center justify-center">

              <div onClick={handleExploreClick} className="hover:cursor-pointer hover:rounded-xl p-1 hover:border hover:border-white/50">
                  <HomeIcon className="stroke-white"/>  
              </div>
              
              <div className="rounded-full w-[40px] h-[40px]">
                  {profileUrl ? (
                      <img 
                        className="rounded-full w-full h-full"
                        src={profileUrl}
                      />

                  ) : (
                    <Profile className=' stroke-white'/>
                  )}
              </div>

            <div onClick={() => setSearchResults(true)} className="hover:border hover:rounded-xl hover:border-white/50 hover:cursor-pointer">
              <SearchIcon className="size-8 p-1" />
            </div>

            <Dashboard 
              onClick={handleCommunityClick}
              className="size-8 hover:cursor-pointer hover:rounded-lg hover:border hover:border-white/50 p-1"
            />
        </div>


        <div onClick={handleSettingsClick} className="absolute sm:relative bottom-10 sm:bottom-auto sm:flex  hover:border hover:rounded-xl hover:border-white/50 p-1 hover:cursor-pointer">
          <SettingsIcon/>
        </div>
      
    </div>
  )
}

export default CommunityHeader