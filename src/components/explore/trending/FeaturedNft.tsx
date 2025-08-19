import FlowButton from '@/components/buttons/FlowButton'
import React from 'react'

type Props = {
  setMintPopup: Function;
}

function FeaturedNft({setMintPopup}: Props) {
  return (
    <div className="flex w-full h-full justify-center px-20 halflg:px-6 items-center text-white py-4">
      <div className="flex flex-col w-1/2 space-y-4">
            <p className="font-black text-5xl halfxl:text-3xl sm:text-lg bg-gradient-to-r from-white to-white/50 inline-block text-transparent bg-clip-text">Early Access Golden Medallion</p>
            <p className="text-xl font-light halflg:hidden">We are thrilled to announce the launch of our exclusive “Early Access Golden Medallion” NFT—a special token of appreciation for our early adopters. 
                This limited-edition NFT not only commemorates your pioneering support but might also grants you unique perks and privileges in the future :)
            </p>

            <p className="text-xl font-light md:text-lg sm:text-sm"> Seize this opportunity to own a piece of our journey.</p>

            <div onClick={()=> setMintPopup(true)} className="w-1/3 lg:w-full">
                <FlowButton 
                  title='Claim now!'
                  buttonWidth='w-full'
                  buttonRadius='rounded-2xl'
                />
            </div>
      </div>


      <div className="w-fit">
         <img 
            className="z-10 w-[600px] h-[600px] lg:w-[500px] lg:h-[500px] md:w-[350px] md:h-[350px]"
            src="/gold-medallion.png"
            alt="Knovel Protocol early access badge"
          />
      </div>
         
    </div>
  )
}

export default FeaturedNft