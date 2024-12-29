'use client'
import { firebaseAuthClient } from '@/app/actions/firebaseauth'
import { generatePayload, isLoggedIn, login, logout } from '@/app/actions/login'
import { server } from '@/lib/server'
import { useRouter } from 'next/navigation'
import React from 'react'
import { arbitrumSepolia } from 'thirdweb/chains'
import { ConnectButton } from 'thirdweb/react'


type Props = {}

function LandingHeader({}: Props) {
  const router = useRouter(); 

  return (
    <div className="flex z-10 justify-between w-full backdrop-blur-md text-white items-center font-mono text-sm px-6 md:p-8 py-4 sm:py-4 sm:px-2 xs:py-8">
      <div className="flex w-[150px] h-fit">
        <img 
          src={"/knovel-logo-full.png"}
          className="w-full h-full"
        />
      </div>

      <div className="relative text-center rounded-3xl bg-white/30 overflow-hidden font-semibold group hover:cursor-pointer text-white">
        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white to-transparent opacity-50 animate-shine"></div>

          <ConnectButton 
            client={server}
            chain={arbitrumSepolia}
            connectModal={{ 
              size: "wide",
              title: "Knovel Protocol ",
              titleIcon: "/knovel-logo-white.png",
            }}
            connectButton={{
              label: "Sign in",
              style: {
                background: "transparent", // Transparent to allow the gradient effect
                color: "white",
                border: "none", // Remove any default border
                fontWeight: "600",
                cursor: "pointer",
                zIndex: "10", // Ensure the text is above the gradient
              }
            }}
            signInButton={{
              style: {
                background: "transparent", // Transparent to allow the gradient effect
                color: "white",
                border: "none", // Remove any default border
                fontWeight: "600",
                cursor: "pointer",
                zIndex: "10", // Ensure the text is above the gradient
              }
            }}
            auth={{
              getLoginPayload: async ({ address }) => generatePayload({ address }),
              doLogin: async (params) => {
                const token = await login(params); 
                if(token) {
                  firebaseAuthClient(token, router);
                }
                
              },
              isLoggedIn: async () => {
                return await isLoggedIn();
              },
              doLogout: async () => {
                await logout();
              },
            }}
          />



      </div>

    
  </div>
  )
}

export default LandingHeader