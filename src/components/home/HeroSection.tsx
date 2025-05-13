'use client'
import React, { useState, useEffect } from 'react'
import { ConnectButton } from 'thirdweb/react';
import { generatePayload, isLoggedIn, login, logout } from '@/app/actions/login';
import { defineChain } from 'thirdweb/chains';
import { useRouter } from 'next/navigation';
import { firebaseAuthClient, firebaseLogout } from '@/app/actions/firebaseauth';
import { client } from '@/lib/client';


function HeroSection({}) {
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);

  const router = useRouter();
  const camp = defineChain({
    id: 123420001114,
  });

  const handleMouseMove = (e: MouseEvent) => {
    setOffsetX((e.clientX / window.innerWidth) * 250 - 50);
    setOffsetY((e.clientY / window.innerHeight) * 250 - 50);
  };


  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="relative flex flex-col w-full h-full items-center justify-center text-white p-20 halfxl:px-18 xs:px-4 halfxl:py-10">
        <div className="absolute inset-0 bg-hero-pattern bg-cover bg-center bg-no-repeat filter blur z-0 bg-black opacity-70 transition-transform duration-400 ease-out"
         style={{
          transform: `translate(${offsetX / 20}px, ${offsetY / 20}px) rotateX(${offsetY / 50}deg) rotateY(${offsetX / 50}deg)`,
        }}
        ></div>

        <div className="relative z-10 flex flex-col space-y-16 largetall:space-y-8 xs:space-y-4 items-center transition-transform duration-400 ease-out"
         style={{
          transform: `translate(${offsetX / 10}px, ${offsetY / 10}px)`,
        }}
        >

          <p className="font-black text-center text-9xl md:text-8xl xs:text-7xl largetall:text-6xl bg-gradient-to-r from-white to-white/50 inline-block text-transparent bg-clip-text">Read. Write. Earn.</p>
          <p className="text-2xl largetall:text-lg xs:text-lg md:text-xl max-w-prose text-center">Empowering authors with decentralized technology, Knovel revolutionizes the way you create, share, and earn from your stories.</p>
        <div className="relative text-center rounded-3xl bg-white/30 overflow-hidden font-semibold group hover:cursor-pointer text-white">
          <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white to-transparent opacity-50 animate-shine"></div>

            <ConnectButton 
              client={client}
              chain={camp}
              connectModal={{ 
                size: "wide",
                title: "Knovel Protocol ",
                titleIcon: "/knovel-logo-white.png",
              }}
              connectButton={{
                label: "GET STARTED",
                style: {
                  padding: '30px 45px',
                  background: "transparent",
                  color: "white",
                  border: "none", 
                  fontWeight: "600",
                  cursor: "pointer"
                }
              }}
              auth={{
                getLoginPayload: async ({ address }) => generatePayload({ address }),
                doLogin: async (params) => {
                  const result = await login(params); 
                  if(result && result.token) {
                    const {token} = result;
                    firebaseAuthClient(token, router);
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
    
    </div>
  )
}

export default HeroSection