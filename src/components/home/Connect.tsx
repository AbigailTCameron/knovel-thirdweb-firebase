'use client'
import Image from 'next/image'
import React from 'react'
import { ConnectButton } from 'thirdweb/react'
import { client } from '@/lib/client'
import { useRouter } from 'next/navigation'
import { firebaseAuthClient } from '@/app/actions/firebaseauth'
import { generatePayload, isLoggedIn, login, logout } from '@/app/actions/login'

type Props = {}

function Connect({}: Props) {
  const router = useRouter(); 

  return (
    <div className="flex sm:flex-col sm:py-4 sm:space-y-10 items-center px-28 halfxl:px-10 md:px-4 space-x-8 md:space-x-2 sm:space-x-0">

        <div className="flex flex-col space-y-8 sm:space-y-4 py-4 w-2/5 sm:w-full text-white sm:items-center">
              <p className="text-4xl lg:text-3xl md:text-xl font-bold">Connect with a Community of Readers and Writers</p>

            <div className="flex space-x-2 md:space-x-0 items-center md:flex-col sm:flex-row sm:w-full sm:px-2 sm:space-x-4">
              <Image 
                className="w-fit h-fit halfxl:w-[90px] md:hidden sm:flex"
                src="/community.png"
                alt="knovel community"
                width={"235"}
                height={"105"}
                quality={100}        
              />
              <p className="font-extralight lg:text-sm md:text-xs">Join thousands of authors and readers on Knovel now to share your stories, discover new works, and earn rewards in a vibrant, decentralized ecosystem!</p>
            </div>

            <div className="relative text-center w-fit rounded-3xl bg-white/30 overflow-hidden font-semibold group hover:cursor-pointer text-white">
            <div className="absolute inset-0 w-fit h-full bg-gradient-to-r from-transparent via-white to-transparent opacity-50 animate-shine"></div>

              <ConnectButton 
                client={client}
                connectModal={{ 
                  size: "wide",
                  title: "Knovel Protocol ",
                  titleIcon: "/knovel-logo-white.png",
                }}
                connectButton={{
                  label: "Join",
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
                    },
                }}
                
                />
              </div>

        </div>

        <div className="flex w-3/5 h-full sm:w-full">
            <img 
              className="w-fit h-fit"
              src="/connect-img.png"
              alt=""
              width={"2741"}
              height={"1792"}      
            />
        </div>
    </div>
  )
}

export default Connect