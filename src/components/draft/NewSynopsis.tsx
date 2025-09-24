import React from 'react'
import XMark from '../icons/XMark';

type Props = {
  setNewSynopsis : Function; 
  onConfirm : Function;
  onCancel ?: () => void;
}

function NewSynopsis({setNewSynopsis, onConfirm, onCancel}: Props) {
  const handleConfirm = () => {
    onConfirm();
  }


  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 backdrop-blur-md flex justify-center items-center z-50 text-base">
       <div className="relative flex flex-col w-1/3 md:w-2/3 max-h-[50vh] sm:p-4 h-fit bg-[#131418] border border-[#272831] text-white rounded-xl shadow-lg py-4 px-4 sm:text-sm">
     
          <div className='flex justify-between'>
              <p className="text-xl font-bold mb-2">Add a new synopsis::</p>

              <XMark 
                onClick={onCancel} 
                className="hover:cursor-pointer hover:bg-[#1b1c22] hover:rounded-lg stroke-[#7c7a85] size-6"
              />
          </div>

          <div className="mb-4 space-y-2">
              <input
                className="w-full focus:outline-none py-4 px-4 rounded-xl text-white bg-zinc-800"
                name="genre"
                placeholder='edit synopsis'
                onChange={(e) => setNewSynopsis(e.target.value)}
              />
        </div>

          <div className="flex justify-center w-full space-x-2">
              <button
                className="flex items-center justify-center space-x-2 hover:cursor-pointer hover:bg-[#1b1c22] hover:text-[#5D3FD3] rounded-lg text-center text-lg w-full p-2 font-semibold"
                onClick={handleConfirm}
              >
                Confirm
              </button>
          </div>
       </div>
    </div>
  )
}

export default NewSynopsis