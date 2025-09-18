import React, { useEffect, useState } from 'react'
import { fetchNft } from '../../../functions/nft/fetch';
import DisplayNft from '../nft/DisplayNft';
import type { NFT } from "thirdweb"; 


type Props = {
  userId: string;
}
type OwnedNft = NFT & { quantityOwned: bigint };


function UserProf({userId}: Props) {
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
      <div className="flex w-full h-full flex-col px-10 py-6">

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