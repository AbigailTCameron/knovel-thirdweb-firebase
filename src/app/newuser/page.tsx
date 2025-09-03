'use client'

import LandingHeader from '@/components/headers/LandingHeader';
import Info from '@/components/new/Info';
import Name from '@/components/new/Name'
import Username from '@/components/new/Username';
import React, { useState } from 'react'

type Props = {}

function NewUser({}: Props) {
  const [screen, setScreen] = useState<number>(0);
  const [fullname, setFullName] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [bio, setBio] = useState<string>('');

  const getFormData = () => ({
    fullname,
    username,
    bio
  });

  const [formData, setFormData] = useState({
    fullname: "",
    username: "",
    bio: "",
    profileUrl: ""
  });

  const updateForm = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

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
          ) :( 
            <Info 
            />
          )
        }
    
      </div>
    </div>
  )
}

export default NewUser