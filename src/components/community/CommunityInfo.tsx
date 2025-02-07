'use client'

import React, { useEffect, useState } from 'react';
import UserList from './UserList';
import { genres } from '../../../bookGenres';
import FlowButton from '../buttons/FlowButton';
import { updateGenres } from '../../../functions/community/fetch';
import Feed from './Feed';
import { fetchNotifications } from '../../../functions/explore/fetch';

type Props = {
  searchResults: boolean;
  setSearchResults: Function;
  userId: string;
  userGenres: string[]; 
  setUserGenres: Function;

}

function CommunityInfo({searchResults, setSearchResults, userId, userGenres, setUserGenres}: Props) {
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);


  const toggleGenre = (genre: string) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter(g => g !== genre) : [...prev, genre]
    );
  };

  const saveGenres = async () => {
    const newGenres = selectedGenres.length === 0 ? genres : selectedGenres;
    await updateGenres(userId, newGenres);  
    setUserGenres(newGenres);   
  };

  const loadNotifications = async () => {
    if(userId){
        await fetchNotifications(userId, setNotifications);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, [userId]);


  return (
    <div className="flex w-full h-full relative">
      {searchResults && (
        <div className="absolute z-50 w-1/3 h-full bg-[#0b0b0b] shadow-lg left-0 rounded-r-md">
          <UserList 
            setSearchResults={setSearchResults}
            userId={userId}
          />
        </div>
      )}

      <div className="flex w-full h-full">

          {userGenres.length == 0 && notifications.length == 0 ? (
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-1/2 h-1/2 bg-[#1b1c1e] rounded-xl p-6 text-white overflow-y-auto custom-scrollbar">
                  <p className="text-lg font-bold">Pick Your Favorite Genres</p>
                  <p className="text-white/70 text-sm">Choose genres to curate your feed.</p>

                  <div className={`flex flex-wrap gap-2 py-6 h-fit w-full`}>
                    {genres.map((genre, index) => (
                        <div 
                          key={index} 
                          onClick={() => toggleGenre(genre)}
                          className={`px-4 py-2 border-[0.5px] border-white/50 text-sm rounded-xl hover:cursor-pointer 
                          ${selectedGenres.includes(genre) ? 'bg-purple-600 text-white' : ''}`}>
                          {genre}
                        </div>
                    ))}
                  </div>

                  <div onClick={saveGenres}>
                      <FlowButton 
                        title='Save Preferences'
                        buttonWidth='w-fit'
                        buttonRadius='rounded-xl'
                      />
                  </div>
              </div>
            </div>
          ) : (
            <div className="flex w-full h-full">
              <Feed 
                userGenres={userGenres}
                userId={userId}
                notifications={notifications}
                setNotifications={setNotifications}
              />
            </div>
          )}
      </div>
       
       

    </div>
  )
}

export default CommunityInfo