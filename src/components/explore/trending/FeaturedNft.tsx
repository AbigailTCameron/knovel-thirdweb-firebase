import FlowButton from '@/components/buttons/FlowButton'
import Multirect from '@/components/design/Multirect';
import React from 'react'

type Props = {
  setMintPopup: Function;
}

function FeaturedNft({setMintPopup}: Props) {
  return (
    <div className="flex flex-col rounded-2xl bg-gradient-to-b from-[#020618] via-[#30056b] to-[#020618] w-full h-full py-2 items-center justify-center text-white">

      <div className='flex px-10 w-full h-full items-center'>
          <div className="flex flex-col basis-2/5 w-full items-center py-4 justify-center">
              <div className="flex justify-center">
                <video className="w-fit h-fit" autoPlay loop playsInline muted>
                  <source src="/0.webm" type="video/webm" />
                </video>
              </div>
       
          </div>
        

          <div className="flex flex-col basis-3/5 space-y-4">
              <p className="font-black text-3xl halfxl:text-3xl sm:text-lg bg-gradient-to-r from-white to-white/50 inline-block text-transparent bg-clip-text">Early Access Golden Medallion</p>

              <p className="text-lg font-semibold md:text-lg sm:text-sm"> Seize this opportunity to own a piece of our journey.</p>

              <p className="font-light halflg:hidden">
                We are thrilled to announce the launch of our exclusive “Early Access Golden Medallion” NFT—a special token of appreciation for our early adopters. 
                This limited-edition NFT not only commemorates your pioneering support but might also grants you unique perks and privileges in the future :)
              </p>

              <div className="w-full flex flex-col space-x-2 items-end">
                  <div onClick={()=> setMintPopup(true)} className="flex w-fit lg:w-full">
                      <FlowButton 
                        title='Claim now!'
                        buttonWidth='w-full'
                        buttonRadius='rounded-2xl'
                      />
                  </div>
              </div>
          </div>
      </div>
    </div>
  )
}

export default FeaturedNft