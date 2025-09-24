import Mint from '@/components/icons/Mint';
import XMark from '@/components/icons/XMark';
import React from 'react'

type Props = {
  onConfirm : Function;
  onCancel ?: () => void;
  userBalance: number;
}

function NftMint({onConfirm, onCancel, userBalance}: Props) {

  const handleConfirm = () => {
    onConfirm();
  }

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 backdrop-blur-md flex justify-center items-center z-50 text-base">
        <div className="relative flex flex-col w-1/5 xl:w-1/4 lg:w-2/5 sm:w-3/5 sm:p-4 h-fit bg-[#131418] border border-[#272831] text-white rounded-xl shadow-lg py-4 px-8 sm:text-sm">
            <XMark 
              onClick={onCancel} 
              className="hover:cursor-pointer hover:bg-[#1b1c22] hover:rounded-lg stroke-[#7c7a85] absolute right-3 top-4 size-6"
            />

            <div className="flex flex-col justify-center w-full h-full items-center">
              
                <div className="flex w-full h-full">
                  <video autoPlay	loop playsInline muted>
                    <source src="/golden.webm" type="video/webm" />
                  </video>
                </div>
                

                <div className="flex flex-col w-full h-full">
                    <div className="flex flex-col w-full text-center">
                        <p className='text-medium font-semibold'>Gold Early Access Medallion</p>
                    </div>
                    
                    <p className='text-sm font-light text-right'>Max Mint amount: 1</p>

                  <div className="w-full flex border-y border-[#272831] my-2">
                      <div className="flex w-full justify-between my-3">
                          <p>Total</p>
                          <p className='font-bold'>FREE</p>
                      </div>
                    
                  </div>

                  {userBalance > 0 ? (
                    <div className="bg-white/30 hover:cursor-not-allowed rounded-xl p-4 text-center text-lg w-full font-semibold">
                      <p>Already minted</p>
                    </div>

                  ) : (
                    <div onClick={handleConfirm} className="group flex items-center justify-center space-x-2 hover:cursor-pointer hover:bg-[#1b1c22] rounded-lg text-center text-lg w-full p-2 font-semibold">
                          <Mint className='size-7 group-hover:stroke-[#5D3FD3]'/>
                          <p>Mint</p>
                    </div>

                  )}
                  
                </div>
            </div>
        </div>
    </div>
  )
}

export default NftMint