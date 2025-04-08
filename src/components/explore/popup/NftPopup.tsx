import CloseIcon from '@/components/icons/CloseIcon';
import XMark from '@/components/icons/XMark';
import React from 'react'

type Props = {
  setTitle : Function; 
  onConfirm : Function;
  onCancel ?: () => void;
}

function NftMint({setTitle, onConfirm, onCancel}: Props) {

  const handleConfirm = () => {
    onConfirm();
  }

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 bg-gray-900 bg-opacity-80 flex justify-center items-center z-50 text-base">
        <div className="relative flex flex-col w-3/5 sm:w-[300px] sm:p-4 h-fit bg-black/90 text-white rounded-xl shadow-lg py-10 px-16 sm:text-sm">
            <div className="flex flex-col mb-4 space-y-2 items-center text-center">
                  <p className='text-4xl font-extrabold'>KNOVEL'S EARLY ACCESS BADGES</p>
            </div>
            <XMark className="hover:cursor-pointer stroke-white absolute right-4 top-2 size-6"/>

            <div className="flex justify-center w-full h-full space-x-2 items-center">
              
                <div className="flex w-3/5 h-full">
                  <video width="800" height="800" autoPlay	loop playsInline muted>
                    <source src="/golden.webm" type="video/webm" />
                  </video>
                </div>
                

               <div className="flex flex-col w-2/5 h-full">
                  <div className="flex flex-col w-full text-center">
                      <p className='text-2xl font-semibold'>Gold Early Access Medallion</p>
                      <p className='text-4xl text-center my-8'>1</p>
                  </div>
                  
                  <p className='text-sm font-light text-right'>Max Mint amount: 1</p>

                 <div className="flex justify-between border-t border-b border-whit my-4">
                    <p>Total</p>
                    <p>FREE</p>
                 </div>

                 <div className="bg-[#5D3FD3] rounded-xl text-center text-lg w-full p-2 font-semibold">
                    <p>MINT</p>
                 </div>
               </div>
            </div>
        </div>
    </div>
  )
}

export default NftMint