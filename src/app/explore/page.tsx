'use client'
import { server } from '@/lib/server'
import React from 'react'
import { arbitrumSepolia } from 'thirdweb/chains'
import { ConnectButton } from 'thirdweb/react'
import { generatePayload, isLoggedIn, login, logout } from '../actions/login'
import { firebaseAuthClient } from '../actions/firebaseauth'
import { useRouter } from 'next/navigation'

type Props = {}

function page({}: Props) {
  const router = useRouter();

  return (
    <div>
      <ConnectButton
        client={server}
        chain={arbitrumSepolia}
        detailsButton={{
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
  )
}

export default page