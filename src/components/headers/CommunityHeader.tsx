'use client'
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react'
import UserProfileImage from './UserProfileImage';
import AccountDropdown from '../explore/AccountDropdown';
import FilledNotifications from '../icons/FilledNotification';
import Notifications from '../icons/Notifications';
import { deleteNotif, fetchNotifications, markNotificationAsRead } from '../../../functions/explore/fetch';
import { timeAgo } from '../../../tools/timeago';
import { Notification } from '../../..';
import SearchIcon from '../icons/SearchIcon';


type Props = {
  userId?: string;
  profileUrl : string;
  setLoading: Function
}

function CommunityHeader({profileUrl, setLoading, userId}: Props) {
  const router = useRouter();
  const pathname = usePathname(); 
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);

  const [dropdown, setDropdown] = useState(false);
  const [newNotifications, setNewNotifications] = useState<boolean | null>(null); 
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');


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

  const handleUsernameSearch = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (searchQuery.trim()) {
      router.push(`/usernamesearch?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

 


  return (
    <div className="relative flex z-40 w-full backdrop-blur-md text-white items-center font-mono text-sm py-2 px-6 md:p-4 sm:px-2 xs:px-1">
        <div className="flex w-[90px] h-fit hover:cursor-pointer">

            <img 
              onClick={handleExploreClick}
              className="w-full h-full"
              src="/knovel-logo-white.png"
              alt="knovel community"                
            />

        </div>

        <div className="flex w-full items-center justify-center">
          <div className="w-1/2">
              <form onSubmit={handleUsernameSearch} className="flex items-center w-full bg-gradient-to-r from-[#6DDCFF] to-[#7F60F9] rounded-3xl p-0.5">
                    <div className="w-full flex bg-black rounded-3xl items-center p-1">
                        <SearchIcon className="size-5 md:size-4 sm:hidden"/>
                        <input 
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="flex justify-between py-3 px-3 bg-black w-full h-full rounded-3xl focus:outline-none" 
                          placeholder="Find other community members via username..."
                        />

                        <button type="submit" className="py-3 bg-white text-black font-bold px-4 rounded-3xl">
                          Search
                        </button>
                    </div>
              </form>
          </div>
        </div>
      
        <div className="flex absolute right-2 items-center justify-between space-x-10 mx-4 halflg:mx-2">

            <div ref={notificationRef} className="hover:cursor-pointer">
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

            <div ref={dropdownRef} className="hover:cursor-pointer">
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

export default CommunityHeader