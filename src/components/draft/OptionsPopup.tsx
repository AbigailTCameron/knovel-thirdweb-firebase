import React from 'react'
import XMark from '../icons/XMark'

type Props = {
  showOptions: Function;
  handleNewChapter?: () => void; 
  setSynopsis: Function;
  setGenrePopup: Function;
}

function OptionsPopup({showOptions, handleNewChapter, setSynopsis, setGenrePopup}: Props) {
  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 backdrop-blur-md flex justify-center items-center z-50 text-base">
        <div className="relative flex flex-col w-1/3 halflg:w-2/3 ss:w-3/4 h-fit max-h-3/4 bg-[#131418] border border-[#272831] text-white rounded-xl shadow-lg py-4 px-4 sm:text-sm">

            <div className='flex justify-between'>
                <p className="text-xl font-bold mb-2">Options:</p>

                <XMark 
                  onClick={() => showOptions(false)}
                  className="hover:cursor-pointer hover:bg-[#1b1c22] hover:rounded-lg stroke-[#7c7a85] size-6"
                />
            </div>

  
            <div className='flex flex-col'>
                <div onClick={handleNewChapter} className="flex hover:cursor-pointer hover:bg-[#1b1c22] rounded-lg w-full py-3 px-2 font-semibold">
                        <p>Add New Chapter</p>
                </div>

                <div onClick={() => setSynopsis(true)} className="flex hover:cursor-pointer hover:bg-[#1b1c22] rounded-lg w-full py-3 px-2 font-semibold">
                        <p>Add/Update Synopsis</p>
                </div>

                <div onClick={() => setGenrePopup(true)} className="flex hover:cursor-pointer hover:bg-[#1b1c22] rounded-lg w-full py-3 px-2 font-semibold">
                        <p>Add/Update Genres</p>
                </div>
            </div>
         
        </div>
    </div>
  )
}

export default OptionsPopup