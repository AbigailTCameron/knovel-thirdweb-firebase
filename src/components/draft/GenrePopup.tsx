import React from 'react'
import XMark from '../icons/XMark'

type Props = {
  onCancel ?: () => void;
  setGenre : Function;
  genres: string[];
  handleRemoveGenre: Function;
  onConfirm : Function;
}

function GenrePopup({onCancel, setGenre, genres, handleRemoveGenre, onConfirm}: Props) {
  
  const handleConfirm = () => {
    onConfirm();
  }

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 backdrop-blur-md flex justify-center items-center z-50 text-base">
        <div className="relative flex flex-col w-1/5 sm:p-4 h-fit bg-[#131418] border border-[#272831] text-white rounded-xl shadow-lg py-4 px-4 sm:text-sm">

            <div className='flex justify-between'>
                <p className="text-xl font-bold mb-2">Genres:</p>

                <XMark 
                  onClick={onCancel} 
                  className="hover:cursor-pointer hover:bg-[#1b1c22] hover:rounded-lg stroke-[#7c7a85] size-6"
                />
            </div>

            <div className="w-full place-self-center self-center flex space-x-2 items-center">
              <div className="flex items-center justify-center w-full border border-[#272831] rounded-xl p-0.5">
                  <input 
                    type="text"
                    onChange={(e) => setGenre(e.target.value)}
                    className="flex py-3 px-3 bg-inherit w-full h-full text-white/70 rounded-3xl focus:outline-none" 
                    name="genre"
                    placeholder='insert genre'
                  />
              </div>

              <div onClick={handleConfirm} className='bg-[#1b1c22] hover:cursor-pointer px-2 rounded-lg'>
                <p>add</p>
              </div>

            </div>


            <div className="flex flex-col overflow-y-auto md:h-[50px] py-2">

              {genres?.map((genre, index) => (
                <div onClick={() => handleRemoveGenre(genre)} key={index} className="flex h-fit hover:cursor-pointer hover:bg-[#1b1c22] rounded-lg text-center text-lg w-full p-2 font-semibold">
                  {genre}
                </div>
              ))}
            </div>

        </div>
    </div>
  )
}

export default GenrePopup