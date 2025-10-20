import React, { useEffect, useState } from 'react'
import { fetchNft } from '../../../functions/nft/fetch';
import DisplayNft from '../nft/DisplayNft';
import type { NFT } from "thirdweb"; 


type Props = {
  userId: string;
  onLoadingChange?: (loading: boolean) => void; 
  onReady?: () => void;        
}
type OwnedNft = NFT & { quantityOwned: bigint };


function UserProf({userId, onLoadingChange, onReady}: Props) {
  const [nfts, setNfts] = useState<OwnedNft[]>([]);
  const [nftContract, setNftContract] = useState<any>(null); // type more strictly later


  // useEffect(() => {
  //   const fetchData = async () => {
  //     const result = await fetchNft(userId); // wait for the promise to resolve
  //     if (result?.nfts) setNfts(result.nfts);
  //     if (result?.contract) setNftContract(result.contract);
  //   };

  //   fetchData();
   
  // }, [userId])

  useEffect(() => {
    let alive = true;

    const fetchData = async () => {
      // If userId isn't ready yet, don't hang the boot overlay.
      if (!userId) { onReady?.(); return; }

      onLoadingChange?.(true);
      try {
        const result = await fetchNft(userId);
        if (!alive) return;
        if (result?.nfts) setNfts(result.nfts);
        if (result?.contract) setNftContract(result.contract);
      } finally {
        onLoadingChange?.(false);
        onReady?.(); // ✅ signal the first paint can happen
      }
    };

    fetchData();
    return () => { alive = false; };
  }, [userId]);


  return (
    <div className="flex sm:flex-col w-full h-full relative">
      <div className="flex w-full h-full flex-col px-10 lg:px-5 py-6">

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