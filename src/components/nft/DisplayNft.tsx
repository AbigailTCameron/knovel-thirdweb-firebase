import React, { useEffect } from 'react'
import { NFTMedia, NFTName, NFTProvider } from 'thirdweb/react'

type Props = {
  nfts: any[]; 
  nftContract: any;
}

function DisplayNft({nfts, nftContract}: Props) {

  useEffect(() => {
 
  }, [nfts, nftContract])

  return (
    <div className="w-full h-full grid grid-cols-4 gap-4">
      {nfts.map((nft, index) => (
         <NFTProvider key={index} tokenId={nft.id} contract={nftContract}>
            <div className="flex flex-col">
                <NFTMedia
                  className="h-fit w-full rounded-md"
                  controls={false}
                  requireInteraction={false}
                  mediaResolver={{
                    src: nft.metadata.animation_url,
                    poster:
                    nft.metadata.image,
                  }}
                />
                <NFTName className="px-2 font-bold text-white" />
            </div>

         </NFTProvider>
        
      ))}
         
    </div>
  )
}

export default DisplayNft