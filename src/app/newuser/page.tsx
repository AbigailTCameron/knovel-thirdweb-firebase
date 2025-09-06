'use client'

import LandingHeader from '@/components/headers/LandingHeader';
import Info from '@/components/new/Info';
import Name from '@/components/new/Name'
import Username from '@/components/new/Username';
import React, { useState } from 'react'
import { newUpload } from '../../../functions/new/fetch';
import Genres from '@/components/new/Genres';
import { genres } from '../../../bookGenres';

type Props = {}

function NewUser({}: Props) {
  const [screen, setScreen] = useState<number>(0);
  const [fullname, setFullName] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [bio, setBio] = useState<string>('');
  const [profileUrl, setProfileUrl] = useState<string>(''); 
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  
  
  const [filename, setFilename] = useState<string>('');
  

  const getFormData = () => ({
    fullname,
    username,
    bio,
    profileUrl
  });

  const [formData, setFormData] = useState({
    fullname: "",
    username: "",
    bio: "",
    profileUrl: "", 
  });

  const updateForm = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const urlToFile = async (croppedImage: string) => {
    const response = await fetch(croppedImage);
    const blob = await response.blob();
    
    // Create a new File object
    const file = new File([blob], "croppedImage.jpg", { type: blob.type });
    return file;
  };

  const finishLoading = async () => {
    // // photo part 
    // urlToFile(profileUrl).then(async(file) => {
    //   const fileExt = file.name.split('.').pop()

    //   if(userId){
    //     const filePath = `${userId}/${filename}.${fileExt}`
    //     const newProfileUrl = await newUpload(filePath, file, userId);
    //   }
    // })
  }


  return (
    <div className="relative flex w-screen h-screen flex-col items-center overflow-x-hidden">
      <div className="sticky top-0 w-full z-50">
          <LandingHeader />
      </div>

      <p className="font-black mt-20 text-5xl bg-gradient-to-b from-white to-[#7F60F9] inline-block text-transparent bg-clip-text">Built for writers and readers.</p>

      <div className='absolute flex w-full h-full items-center justify-center'>
        {screen == 0 ? (
          <Name 
            screen={screen}
            setScreen={setScreen}
            fullname={fullname}
            setFullName={setFullName}
            />
          ) : screen === 1 ? (
          <Username 
            screen={screen}
            setScreen={setScreen}
            username={username}
            setUsername={setUsername}
          />
          ): screen === 2 ? ( 
            <Info 
              screen={screen}
              setScreen={setScreen}
              profileUrl={profileUrl}
              setProfileUrl={setProfileUrl}
              setFilename={setFilename}
            />
          ) : (
            <Genres 
              screen={screen}
              finishLoading={finishLoading}
              selectedGenres={selectedGenres}
              setSelectedGenres={setSelectedGenres}
            />
          )
        }
    
      </div>
    </div>
  )
}

export default NewUser