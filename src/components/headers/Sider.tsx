import { usePathname, useRouter } from 'next/navigation';
import React from 'react'
import SettingsIcon from '../icons/SettingsIcon';
import HomeIcon from '../icons/HomeIcon';
import WorldIcon from '../icons/WorldIcon';
import Dashboard from '../icons/Dashboard';
import SearchIcon from '../icons/SearchIcon';
import People from '../icons/People';
import Bookmark from '../icons/Bookmark';
import BookmarkPage from '../icons/BookmarkPage';
import Bookmark1 from '../icons/Bookmark1';
import Pencil from '../icons/Pencil';
import BookmarkIcon from '../icons/BookmarkIcon';
import Lib from '../icons/Lib';
import NewPage from '../icons/NewPage';
import Notifications from '../icons/Notifications';

type Props = {
  setLoading: Function;
  userId ?: string;
  setSearchResults: Function;
}

function Sider({setLoading, userId, setSearchResults}: Props) {
  const pathname = usePathname(); 
  const router = useRouter();
    


  const handleExploreClick = () => {
    if(pathname !== '/explore'){
      setLoading(true); 
      router.push('/explore');
    }
  };

  const handleSettingsClick = () => {
    if(pathname !== '/settings'){
      setLoading(true);
      router.push('/settings');
    }
  };

  const handleHomeClick = () => {
    if(pathname !== '/explore'){
      setLoading(true); 
      router.push('/explore');
    }
  };


  const handleClickCommunity = () => {
    if(pathname !== '/community'){
      setLoading(true); 
      router.push('/community');
    }
  }

  const handleCreateClick = () => {
    if(pathname !== '/create'){
      setLoading(true); 
      router.push('/create');
    }
  };

  const handleReadingClick = () => {
    if(pathname !== `/readinglist/${userId}`){
      setLoading(true); 
      router.push(`/readinglist/${userId}`);
    }
  }

  const handlePublishClick = () => {
    if(pathname !== `/publish`){
      setLoading(true); 
      router.push(`/publish`);
    }
  }

  const handleDraftsClick = () => {
    if(pathname !== `/drafts/${userId}`){
      setLoading(true); 
      router.push(`/drafts/${userId}`);
    }
  };

  const handleCollectiblesClick = () => {
    if(pathname !== `/collection/${userId}`){
      setLoading(true); 
      router.push(`/collection/${userId}`);
    }
  }


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


        <div onClick={() => setSearchResults(true)} className='flex w-full py-2 px-2 space-x-2 items-center justify-center hover:cursor-pointer hover:bg-black'>
          <Notifications className='flex group-hover:basis-1/5'/>
          <p className='hidden group-hover:block group-hover:basis-4/5'>Notifications</p>
        </div> 


        <div onClick={handleSettingsClick} className="flex space-x-2 absolute sm:relative bottom-10 sm:bottom-auto sm:flex  hover:border hover:rounded-xl hover:border-white/50 p-1 hover:cursor-pointer">
            <SettingsIcon/>
            <p className='hidden group-hover:block group-hover:basis-4/5'>Settings</p>
        </div>
      </div>

    
    </div>
  )
}

export default Sider