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
    <div className="fixed top-0 left-0 right-0 bottom-0 bg-gray-900 bg-opacity-80 flex justify-center items-center z-50 text-base">
        <div className="relative flex flex-col w-3/5 sm:w-[300px] sm:p-4 h-fit bg-black/90 text-white rounded-xl shadow-lg py-10 px-16 sm:text-sm">
            <div className="flex flex-col mb-4 space-y-2 items-center text-center">
                  <p className='text-4xl font-extrabold'>KNOVEL'S EARLY ACCESS BADGES</p>
            </div>
            <XMark 
              onClick={onCancel} 
              className="hover:cursor-pointer stroke-white absolute right-3 top-3 size-5"
            />

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

                 <div className="w-full flex border-t border-b border-white my-2">
                    <div className="flex w-full text-lg justify-between my-3">
                        <p>Total</p>
                        <p>FREE</p>
                    </div>
                  
                 </div>

                 {userBalance > 0 ? (
                  <div className="bg-white/30 hover:cursor-not-allowed rounded-xl p-4 text-center text-lg w-full font-semibold">
                    <p>Already minted</p>
                  </div>

                 ) : (
                  <div onClick={handleConfirm} className="hover:cursor-pointer bg-[#5D3FD3] rounded-xl text-center text-lg w-full p-4 font-semibold">
                        <p>MINT</p>
                  </div>

                 )}
                
               </div>
            </div>
        </div>
    </div>
  )
}

export default NftMint