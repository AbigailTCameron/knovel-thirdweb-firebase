import React, { useEffect, useState } from 'react'
import { NFTMedia, NFTName, NFTProvider } from 'thirdweb/react'

type Props = {
  nfts: any[]; 
  nftContract: any;
}

function DisplayNft({nfts, nftContract}: Props) {
  const [isHovered, setIsHovered] = useState<boolean>(false);

  useEffect(() => {
 
  }, [nfts, nftContract])

  return (
    <div className="w-full h-full grid grid-cols-4">
      {nfts.map((nft, index) => (
         <NFTProvider key={index} tokenId={nft.id} contract={nftContract}>
            <div 
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)} 
              className="flex w-full h-fit p-2 flex-col border-2 border-gray-600/50 hover:shadow-lg hover:shadow-gray-800/50">
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
                {isHovered && (
                    <NFTName autoCapitalize="words" className="px-2 text-lg font-semibold text-white uppercase" />
                )}
            </div>

         </NFTProvider>
        
      ))}
         
    </div>
  )
}

export default DisplayNft