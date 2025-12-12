import { usePathname, useRouter } from 'next/navigation';
import React, { useRef, useState } from 'react'
import SettingsIcon from '../icons/SettingsIcon';
import HomeIcon from '../icons/HomeIcon';
import Dashboard from '../icons/Dashboard';
import People from '../icons/People';
import Pencil from '../icons/Pencil';
import BookmarkIcon from '../icons/BookmarkIcon';
import Lib from '../icons/Lib';
import NewPage from '../icons/NewPage';
import Notifications from '../icons/Notifications';
import { ConnectEmbed } from 'thirdweb/react';
import { defineChain } from 'thirdweb';
import { client } from '@/lib/client';
import { generatePayload, isLoggedIn, login, logout } from '@/app/actions/login';
import { firebaseAuthClient, firebaseLogout } from '@/app/actions/firebaseauth';
import XMark from '../icons/XMark';
import Image from 'next/image';

type Props = {
  setLoading: (value: boolean) => void;
  userId ?: string;
  setSearchResults: (value: boolean) => void;
  setShowNotifications: (value: boolean) => void;
  setSettingsPopup: (value: boolean) => void;
}

function Sider({setLoading, userId, setSearchResults, setShowNotifications, setSettingsPopup}: Props) {
  const pathname = usePathname(); 
  const router = useRouter();
  const [showConnect, setShowConnect] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  

  const camp = defineChain({
    id: 123420001114,
  });


  const handleExploreClick = () => {
    if(pathname !== '/explore'){
      setLoading(true); 
      router.push('/explore');
    }
  };

  const handleHomeClick = () => {
    if(pathname !== '/explore'){
      setLoading(true); 
      router.push('/explore');
    }
  };


  const handleCreateClick = () => {
    if(!userId){
      onRequireWalletConnect?.();
      return;
    }

    if(pathname !== '/create'){
      setLoading(true); 
      router.push('/create');
    }
  };

  const handleReadingClick = () => {
    if(!userId){
      onRequireWalletConnect?.();
      return;
    }
    
    if(pathname !== `/readinglist/${userId}`){
      setLoading(true); 
      router.push(`/readinglist/${userId}`);
    }
  }

  const handlePublishClick = () => {
    if(!userId){
      onRequireWalletConnect?.();
      return;
    }

    if(pathname !== `/publish`){
      setLoading(true); 
      router.push(`/publish`);
    }
  }

  const handleDraftsClick = () => {
    if(!userId){
      onRequireWalletConnect?.();
      return;
    }

    if(pathname !== `/drafts/${userId}`){
      setLoading(true); 
      router.push(`/drafts/${userId}`);
    }
  };

  const handleCollectiblesClick = () => {
    if(!userId){
      onRequireWalletConnect?.();
      return;
    }

    if(pathname !== `/collection/${userId}`){
      setLoading(true); 
      router.push(`/collection/${userId}`);
    }
  }

  const onRequireWalletConnect = () => {
    setShowConnect(true);
  };


  return (
    <div className='w-full h-full flex flex-col text-white mx-4 my-4 items-center'>
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

      <div className='w-full flex flex-col items-center justify-center my-6 rounded-xl text-sm'>

        <div onClick={handleHomeClick} className="group relative flex w-full py-2 px-2 space-x-2 items-center justify-center rounded-xl hover:cursor-pointer hover:bg-[#7F60F9]/10 hover:backdrop-blur-lg hover:border hover:border-[#7F60F9]/15 hover:font-black">
          <HomeIcon className='size-8'/>
          <span className="pointer-events-none hidden group-hover:inline-block absolute left-full ml-3 top-1/2 -translate-y-1/2 whitespace-nowrap 
          rounded-md px-2 py-1 text-xs bg-black/80 text-white shadow-lg z-50">Home</span>
          {/* <p className='hidden flex-1 '>Home</p> */}
        </div>

        <div onClick={handleCollectiblesClick} className='group relative flex w-full py-2 px-2 space-x-2 items-center justify-center hover:cursor-pointer hover:bg-[#7F60F9]/10 hover:backdrop-blur-lg rounded-xl hover:border hover:border-[#7F60F9]/15 hover:font-black'>
          <Dashboard className='size-8'/>
          <span className="pointer-events-none hidden group-hover:inline-block absolute left-full ml-3 top-1/2 -translate-y-1/2 whitespace-nowrap 
          rounded-md px-2 py-1 text-xs bg-black/80 text-white shadow-lg z-90">Collection</span>
        </div>

        <div onClick={handleCreateClick} className='group relative flex w-full py-2 px-2 space-x-2 items-center justify-center hover:cursor-pointer hover:bg-[#7F60F9]/10 hover:backdrop-blur-lg rounded-xl hover:border hover:border-[#7F60F9]/15 hover:font-black'>
          <Pencil className='size-8'/>
          <span className="pointer-events-none hidden group-hover:inline-block absolute left-full ml-3 top-1/2 -translate-y-1/2 whitespace-nowrap 
          rounded-md px-2 py-1 text-xs bg-black/80 text-white shadow-lg z-50">Create</span>
        </div>

        <div onClick={handleDraftsClick} className='group relative flex w-full py-2 px-2 space-x-2 items-center justify-center hover:cursor-pointer hover:bg-[#7F60F9]/10 hover:backdrop-blur-lg rounded-xl hover:border hover:border-[#7F60F9]/15 hover:font-bold'>
          <NewPage className='size-8'/>
          <span className="pointer-events-none hidden group-hover:inline-block absolute left-full ml-3 top-1/2 -translate-y-1/2 whitespace-nowrap 
          rounded-md px-2 py-1 text-xs bg-black/80 text-white shadow-lg z-50">Drafts</span>
        </div>

        <div onClick={handlePublishClick} className='group relative flex w-full py-2 px-2 space-x-2 items-center justify-center hover:cursor-pointer hover:bg-[#7F60F9]/10 hover:backdrop-blur-lg rounded-xl hover:border hover:border-[#7F60F9]/15 hover:font-bold'>
          <Lib className='size-8'/>
          <span className="pointer-events-none hidden group-hover:inline-block absolute left-full ml-3 top-1/2 -translate-y-1/2 whitespace-nowrap 
          rounded-md px-2 py-1 text-xs bg-black/80 text-white shadow-lg z-50">Published</span>
        </div>

        <div onClick={handleReadingClick} className='group relative flex w-full py-2 px-2 space-x-2 items-center justify-center hover:cursor-pointer hover:bg-[#7F60F9]/10 hover:backdrop-blur-lg rounded-xl hover:border hover:border-[#7F60F9]/15 hover:font-bold'>
          <BookmarkIcon className='size-8'/>
          <span className="pointer-events-none hidden group-hover:inline-block absolute left-full ml-3 top-1/2 -translate-y-1/2 whitespace-nowrap 
          rounded-md px-2 py-1 text-xs bg-black/80 text-white shadow-lg z-50">To-read list</span>
        </div>

        <div onClick={() => setSearchResults(true)} className='group relative flex w-full py-2 px-2 space-x-2 items-center justify-center hover:cursor-pointer hover:bg-[#7F60F9]/10 hover:backdrop-blur-lg rounded-xl hover:border hover:border-[#7F60F9]/15 hover:font-bold'>
          <People className='size-8'/>
          <span className="pointer-events-none hidden group-hover:inline-block absolute left-full ml-3 top-1/2 -translate-y-1/2 whitespace-nowrap 
          rounded-md px-2 py-1 text-xs bg-black/80 text-white shadow-lg z-50">Users</span>
        </div> 


        <div onClick={() => {
          if(!userId){
            onRequireWalletConnect?.();
            return;
          }
          setShowNotifications(true)
        }} className='group flex relative w-full py-2 px-2 space-x-2 items-center justify-center hover:cursor-pointer hover:bg-[#7F60F9]/10 hover:backdrop-blur-lg rounded-xl hover:border hover:border-[#7F60F9]/15 hover:font-bold'>
          <Notifications className='size-8'/>
          <span className="pointer-events-none hidden group-hover:inline-block absolute left-full ml-3 top-1/2 -translate-y-1/2 whitespace-nowrap 
          rounded-md px-2 py-1 text-xs bg-black/80 text-white shadow-lg z-50">Notifications</span>
        </div> 


        <div onClick={() => {
            if(!userId){
              onRequireWalletConnect?.();
              return;
            }
            setSettingsPopup(true);
            }} className="group flex items-center space-x-2 absolute py-2 px-2 sm:relative bottom-10 sm:bottom-auto sm:flex  hover:border hover:rounded-xl hover:bg-[#7F60F9]/10 hover:backdrop-blur-lg rounded-xl hover:border-[#7F60F9]/15 hover:font-bold p-1 hover:cursor-pointer">
              <SettingsIcon />
              <span className="pointer-events-none hidden group-hover:inline-block absolute left-full ml-3 top-1/2 -translate-y-1/2 whitespace-nowrap 
              rounded-md px-2 py-1 text-xs bg-black/80 text-white shadow-lg z-50">Settings</span>
          </div>
        </div>

      {showConnect && (
        <div ref={dropdownRef} className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 backdrop-blur-md flex justify-center items-center z-50 text-base">
          <div className="relative bg-transparent rounded-lg shadow-lg p-0">
            <button
              onClick={() => setShowConnect(false)}
              className="absolute top-4 right-4 hover:bg-[#1b1c22] hover:stroke-slate-200 hover:rounded-lg text-2xl font-bold z-10"
              aria-label="Close"
            >
              <XMark className='stroke-[#7c7a85] size-6'/>
            </button>
            <ConnectEmbed 
              client={client}
              chain={camp}
              modalSize='wide'
              header={{ 
                title: "Knovel Protocol ",
                titleIcon: "/knovel-logo-white.png",
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
                    setShowConnect(false);
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
      )}

    </div>
  )
}

export default Sider