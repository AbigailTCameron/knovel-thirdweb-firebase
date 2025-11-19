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

type Props = {
  setLoading: Function;
  userId ?: string;
  setSearchResults: Function;
  setShowNotifications: Function;
  setSettingsPopup: Function;
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
          <img 
            onClick={handleExploreClick}
            className="w-full h-full"
            src="/knovel-logo-white.png"
            alt="knovel community"                
          />

      </div>

      <div className='group w-full bg-[#1e1f21] flex flex-col items-center justify-center my-6 rounded-xl text-sm'>

        <div onClick={handleHomeClick} className="flex w-full py-2 px-2 space-x-2 items-center justify-center hover:cursor-pointer hover:bg-black">
          <HomeIcon className='flex group-hover:basis-1/5'/>
          <p className='hidden group-hover:block group-hover:basis-4/5'>Home</p>
        </div>

        <div onClick={handleCollectiblesClick} className='flex w-full py-2 px-2 space-x-2 items-center justify-center hover:cursor-pointer hover:bg-black'>
          <Dashboard className='flex group-hover:basis-1/5'/>
          <p className='hidden group-hover:block group-hover:basis-4/5'>Collection</p>
        </div>

        <div onClick={handleCreateClick} className='flex w-full py-2 px-2 space-x-2 items-center justify-center hover:cursor-pointer hover:bg-black'>
          <Pencil className='flex group-hover:basis-1/5'/>
          <p className='hidden group-hover:block group-hover:basis-4/5'>Create</p>
        </div>

        <div onClick={handleDraftsClick} className='flex w-full py-2 px-2 space-x-2 items-center justify-center hover:cursor-pointer hover:bg-black'>
          <NewPage className='flex group-hover:basis-1/5'/>
          <p className='hidden group-hover:block group-hover:basis-4/5'>Drafts</p>
        </div>

        <div onClick={handlePublishClick} className='flex w-full py-2 px-2 space-x-2 items-center justify-center hover:cursor-pointer hover:bg-black'>
          <Lib className='flex group-hover:basis-1/5'/>
          <p className='hidden group-hover:block group-hover:basis-4/5'>Published</p>
        </div>

        <div onClick={handleReadingClick} className='flex w-full py-2 px-2 space-x-2 items-center justify-center hover:cursor-pointer hover:bg-black'>
          <BookmarkIcon className='flex group-hover:basis-1/5'/>
          <p className='hidden group-hover:block group-hover:basis-4/5'>Saved</p>
        </div>

        <div onClick={() => setSearchResults(true)} className='flex w-full py-2 px-2 space-x-2 items-center justify-center hover:cursor-pointer hover:bg-black'>
          <People className='flex group-hover:basis-1/5'/>
          <p className='hidden group-hover:block group-hover:basis-4/5'>Users</p>
        </div> 


        <div onClick={() => {
          if(!userId){
            onRequireWalletConnect?.();
            return;
          }
          setShowNotifications(true)
        }} className='flex w-full py-2 px-2 space-x-2 items-center justify-center hover:cursor-pointer hover:bg-black'>
          <Notifications className='flex group-hover:basis-1/5'/>
          <p className='hidden group-hover:block group-hover:basis-4/5'>Notifications</p>
        </div> 


        <div onClick={() => {
            if(!userId){
              onRequireWalletConnect?.();
              return;
            }
            setSettingsPopup(true);
            }} className="flex items-center space-x-2 absolute sm:relative bottom-10 sm:bottom-auto sm:flex  hover:border hover:rounded-xl hover:border-white/50 p-1 hover:cursor-pointer">
              <SettingsIcon/>
              <p className='hidden group-hover:block group-hover:basis-4/5'>Settings</p>
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