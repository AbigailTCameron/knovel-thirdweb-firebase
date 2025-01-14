'use client'
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react'
import SearchIcon from '../icons/SearchIcon';
import UserProfileImage from './UserProfileImage';
import AccountDropdown from '../explore/AccountDropdown';
import FilledNotifications from '../icons/FilledNotification';
import Notifications from '../icons/Notifications';
import { deleteNotif, fetchNotifications, fetchSearchResults, markNotificationAsRead } from '../../../functions/explore/fetch';
import { timeAgo } from '../../../tools/timeago';
import { Notification } from '../../..';
import SearchResults from '../search/SearchResults';


type Props = {
  userId?: string;
  profileUrl : string;
  setLoading: Function
}

function ExploreHeader({profileUrl, setLoading, userId}: Props) {
  const router = useRouter();
  const pathname = usePathname(); 
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [dropdown, setDropdown] = useState(false);
  const [newNotifications, setNewNotifications] = useState<boolean | null>(null); 
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchResults, setSearchResults] = useState([]);


  const handleSearch = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setDropdown(false);
    }

    if(notificationRef.current && !notificationRef.current.contains(event.target as Node)){
      setShowNotifications(false);
    }
  };

  const handleExploreClick = () => {
    if(pathname !== '/explore'){
      setLoading(true); 
      router.push('/explore');
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

  const handleNotificationClick = (notificationId: string) => {
    markNotificationAsRead(notificationId);
    loadNotifications(); // Refresh notifications
  };

  const loadNotifications = async () => {
    if(userId){
        const notifications = await fetchNotifications(userId);
        setNotifications(notifications);
        setNewNotifications(notifications.some((n) => !n.isRead));
    }
  
  };

  const deleteNotification = async(id: string) => {
    const { success } = await deleteNotif(id);
    if (success) {
      setNotifications((prevNotifications: any[]) =>
        prevNotifications.filter((notification) => notification.id !== id)
      );    } else {
      alert('Failed to delete notification. Please try again.');
    }
  }

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
    loadNotifications();
  }, [userId]);


  useEffect(() => {
    router.prefetch('/dashboard'); // prefetch the dashboard page for faster loading
    router.prefetch('/settings'); 
    router.prefetch('/explore'); 
    router.prefetch('/community'); 
  }, [])

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

 


  return (
    <div className="relative flex z-40 w-full backdrop-blur-md text-white items-center font-mono text-sm py-2 px-6 md:p-4 sm:px-2 xs:px-1">
        <div className="flex relative items-center basis-1/4 flex-grow hover:cursor-pointer">

            <img 
              onClick={handleExploreClick}
              className="w-1/6 lg:w-[90px] sm:w-[60px] h-full"
              src="/knovel-logo-white.png"
              alt="knovel community"                
            />

        </div>


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
      
        <div className="flex relative basis-1/4 items-center justify-between mx-4 halflg:mx-2">
            <div onClick={handleDashboardClick} className='flex xl:right-48 halfxl:hidden hover:cursor-pointer halflg:hidden'>
              dashboard
            </div>

            <div onClick={handleClickCommunity} className='flex xl:right-20 halfxl:right-1/2 halflg:hidden hover:cursor-pointer'>
              community
            </div>

            <div ref={notificationRef} className="hover:cursor-pointer halflg:absolute halflg:right-1/2 sm:right-3/4">
                {newNotifications ? (
                  <FilledNotifications onClick={() => setShowNotifications((prev) => !prev)} className="fill-red-500 size-6 xs:size-4" />
                ) : (
                  <Notifications onClick={() => setShowNotifications((prev) => !prev)} className="stroke-white size-6 xs:size-4" />
                )}

                {showNotifications && (
                    <div className="absolute w-full min-w-64 overflow-x-hidden right-0 mt-8 bg-[#1d242e] max-h-[75vh] rounded-lg shadow-xl z-50 overflow-y-auto">

                    {notifications.length > 0 ? (
                      <div>
                          {notifications.map((notification) => (
                        <div 
                          key={notification.id}                 
                          onClick={() => handleNotificationClick(notification.id)}
                          className="flex items-center w-full justify-center space-x-2 p-4 border-b-[0.5px] last:border-b-0"
                        >
                          {!notification.isRead && (
                            <div className="flex w-[5px] h-[5px] rounded-full bg-red-600">
                            </div>
                          )}
                            <div className="flex flex-col space-y-1">
                              <p>{notification.message}</p>
                              <div className="text-xs">{timeAgo(notification.createdAt)}</div>
                              <p onClick={() => deleteNotification(notification.id)} className="text-[12px] mt-1 hover:underline">delete</p>
                            </div>
                           
                        </div>
                      ))}
                      </div>
                    ) : (
                          <p className='p-2'>no new notifications</p>
                    )}
                    
                    
                    </div>
                )}
               
            </div>

          
            <div ref={dropdownRef} className="hover:cursor-pointer halflg:absolute halflg:right-0">
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
    </div>
  )
}

export default ExploreHeader