import React from 'react'
import { ConnectButton } from 'thirdweb/react';
import { client } from '@/lib/client';
import { useRouter } from 'next/navigation'
import { defineChain } from 'thirdweb/chains'
import { generatePayload, isLoggedIn, login, logout } from '@/app/actions/login';
import { firebaseAuthClient, firebaseLogout } from '@/app/actions/firebaseauth';
import HomeIcon from '../icons/HomeIcon';
import WorldIcon from '../icons/WorldIcon';
import SettingsIcon from '../icons/SettingsIcon';


type Props = {
  handleDashboardClick?: () => void;
  handleSettingsClick?: () => void;
  handleClickCommunity?: () => void;
}

function AccountDropdown({handleDashboardClick, handleSettingsClick, handleClickCommunity}: Props) {

  const router = useRouter(); 
  const camp = defineChain({
    id: 123420001114,
  });

  return (
    <div className="flex flex-col space-y-4 py-4 w-full text-sm font-medium text-[#e3e4e5]">
    
        <ConnectButton
          client={client}
          chain={camp}
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
            getLoginPayload: async ({ address }) => {
              return generatePayload({ address })
            },
            doLogin: async (params) => {
              const result = await login(params); 
              if(result && result.token) {
                const {token} = result;
                firebaseAuthClient(token, router);
              }
              
            },
            isLoggedIn: async () => {
              const result = await isLoggedIn();
                if(!result){
                  await logout();
                  await firebaseLogout(router); 
                  return false;
                }
              console.log("the result being returned is", result)
              return result;
            },
            doLogout: async () => {
              await logout();
              await firebaseLogout(router); 
            },
          }}
        />

        <div onClick={handleDashboardClick} className="flex items-center space-x-2 hover:cursor-pointer hover:bg-black px-3 py-3">
          <HomeIcon />
          <p>dashboard</p>
        </div>

        <div onClick={handleClickCommunity} className="hidden halflg:flex items-center space-x-2 hover:cursor-pointer hover:bg-black px-3 py-3">
          <WorldIcon />
          <p>community</p>
        </div>
    
        <div onClick={handleSettingsClick} className="flex items-center space-x-2 hover:cursor-pointer hover:bg-black px-3 py-3">
          <SettingsIcon />
          <p>Settings</p>
        </div>

    </div>
  )
}

export default AccountDropdown