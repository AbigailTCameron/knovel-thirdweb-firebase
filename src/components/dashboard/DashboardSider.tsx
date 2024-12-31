import React, { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation';
import ProfilePhoto from './ProfilePhoto';
import HomeIcon from '../icons/HomeIcon';
import SettingsIcon from '../icons/SettingsIcon';
import NewPage from '../icons/NewPage';
import BookIcon from '../icons/BookIcon';
import QueueList from '../icons/QueueList';

type Props = {
  userId ?: string
  setLoading : Function
  profileUrl?: string
  username ?: string
}

function DashboardSider({userId, setLoading, profileUrl, username}: Props) {
  const router = useRouter(); 
  const pathname = usePathname(); 

  const handleCreateClick = () => {
    if(pathname !== '/create'){
      setLoading(true); 
      router.push('/create');
    }
  };

  const handleDashboardClick = () => {
    if(pathname !== '/dashboard'){
      setLoading(true); 
      router.push('/dashboard');
    }
  };

  const handleDraftsClick = () => {
    if(pathname !== `/drafts/${userId}`){
      setLoading(true); 
      router.push(`/drafts/${userId}`);
    }
  };

  const handleSettingsClick = () => {
    if(pathname !== '/settings'){
      setLoading(true);
      router.push('/settings');
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

  useEffect(() => {
    if(userId){
      router.prefetch('/dashboard'); 
      router.prefetch('/settings'); 
      router.prefetch(`/drafts/${userId}`);
      router.prefetch('/create'); 
      router.prefetch(`/readinglist/${userId}`);
      router.prefetch(`/publish`);
    }
  }, [userId])

  return (
    <div className="relative flex flex-col h-full w-full px-14 lg:px-8 sm:px-4 ss:px-0">

        <ProfilePhoto 
          profileUrl={profileUrl}
        />

        <p className="text-center text-white/70 font-bold mb-8 md:mb-2 ss:text-sm">@{username}</p>

        <div onClick={handleCreateClick} className="flex items-center hover:cursor-pointer justify-center text-lg md:text-base font-bold w-full ss:w-fit ss:self-center h-fit p-2  bg-indigo-600 rounded-2xl text-white">
          <p>+ Create New Story</p>
        </div>

        <div className="flex flex-col md:flex-row my-8 md:my-4 h-full space-y-4 md:space-x-4 md:justify-center md:space-y-0 sm:py-2 ss:text-sm xs:hidden">
            <div onClick={handleDashboardClick} className="flex items-center space-x-2 text-[#a5a5a5] hover:cursor-pointer">
              <HomeIcon className="md:hidden"/>
              <p>Dashboard</p>
            </div>

            <div onClick={handleDraftsClick} className="flex items-center space-x-2 text-[#a5a5a5] hover:cursor-pointer">
              <NewPage className='md:hidden' />
              <p>Drafts</p>
            </div>

            <div onClick={handlePublishClick} className="flex items-center space-x-2 text-[#a5a5a5] hover:cursor-pointer">
              <BookIcon className="md:hidden" /> 
              <p>Published</p>
            </div>

            <div onClick={handleReadingClick} className="flex items-center space-x-2 text-[#a5a5a5] hover:cursor-pointer">
              <QueueList className="size-6 md:hidden"/> 
              <p>Reading List</p>
            </div>

        </div>

        <div className="bottom-8 absolute flex flex-col md:hidden space-y-3 text-[#a5a5a5]">

            <div onClick={handleSettingsClick} className="flex hover:cursor-pointer items-center space-x-2 sm:text-xl">
              <SettingsIcon /> 
              <p>Settings</p>
            </div>

        </div>
  
    </div>
  )
}

export default DashboardSider