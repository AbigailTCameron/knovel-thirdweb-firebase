import React, { useEffect, useState } from 'react'
import UserList from '../community/UserList'
import { fetchNft } from '../../../functions/nft/fetch';
import Profile from '../icons/Profile';
import DisplayNft from '../nft/DisplayNft';
import type { NFT } from "thirdweb"; 


type Props = {
  searchResults: boolean;
  setSearchResults: Function;
  userId: string;
  name : string;
  username: string;
  profileUrl : string;
}
type OwnedNft = NFT & { quantityOwned: bigint };


function UserProf({searchResults, setSearchResults, userId, name, username, profileUrl}: Props) {
  const [nfts, setNfts] = useState<OwnedNft[]>([]);
  const [nftContract, setNftContract] = useState<any>(null); // type more strictly later


  useEffect(() => {
    const fetchData = async () => {
      const result = await fetchNft(userId); // wait for the promise to resolve
      if (result?.nfts) setNfts(result.nfts);
      if (result?.contract) setNftContract(result.contract);
    };

    fetchData();
   
  }, [userId])


  return (
    <div className="flex sm:flex-col w-full h-full relative">
       {searchResults && (
        <div className="absolute z-10 w-1/3 lg:w-1/2 sm:w-3/4 h-full bg-[#0b0b0b] shadow-lg left-0 rounded-r-md">
          <UserList 
            setSearchResults={setSearchResults}
            userId={userId}
          />
        </div>
      )}
      <div className="flex w-full h-full flex-col px-10 py-6">
          <div className="flex items-center justify-between text-white w-full h-fit">
            <div className="flex items-center space-x-4">
                <p className="text-5xl font-semibold">{name}</p>
                <p className="text-4xl font-light">{username}</p>
            </div>
          
          </div>

          <div className="flex w-full h-full">
            <DisplayNft 
              nfts={nfts}
              nftContract={nftContract}
            />

          </div>        

      </div>
    </div>
  )
}

export default UserProf