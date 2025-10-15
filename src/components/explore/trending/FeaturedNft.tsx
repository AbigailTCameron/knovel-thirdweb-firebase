import FlowButton from '@/components/buttons/FlowButton'
import Multirect from '@/components/design/Multirect';
import React from 'react'

type Props = {
  setMintPopup: Function;
}

function FeaturedNft({setMintPopup}: Props) {
  return (
    <div className="relative flex flex-col w-full h-full items-center justify-center text-white py-2">

      <div className="absolute top-2 bg-white/5 rounded-full p-1 my-1">
          <div className="bg-white/10 backdrop-blur-lg rounded-full px-2 halfxl:px-1 py-1">
              <p className="font-white font-bold halfxl:text-sm">Featured Launch</p>
          </div>
      </div>

      <div className="flex px-20 space-x-5">
        <div className='flex flex-col w-1/2 basis-2/3 space-y-2 justify-center text-center'>
            <p className="text-6xl text-[#db7210] font-semibold md:text-lg sm:text-sm" style={{ fontFamily: '"Old English Text MT", "Goudy Old Style", serif' }}>Golden Medallion</p>
            <p className="text-white text-xl">
                We are thrilled to announce the launch of our exclusive “Early Access Golden Medallion” NFT—a special token of appreciation for our early adopters. 
                This limited-edition NFT not only commemorates your pioneering support but might also grants you unique perks and privileges in the future :)
            </p>

            <div onClick={()=> setMintPopup(true)} className="flex w-fit self-center rounded-xl hover:cursor-pointer px-4 py-2 font-semibold bg-gradient-to-b from-[#532806] to-[#221711] border-[0.5px] border-[#ee6302]">
              <p>Claim Now</p>
            </div>
        </div>

          <div className='w-1/4 basis-1/3'>
              <img 
                className='w-full h-fit'
                src='/0.png'
              />
          </div>
      </div>





 
{/* 
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
      </div> */}
    </div>
  )
}

export default FeaturedNft