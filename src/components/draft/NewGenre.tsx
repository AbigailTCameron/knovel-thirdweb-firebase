import React from 'react'

type Props = {
  setGenre : Function
  onConfirm : Function;
  onCancel ?: () => void;
}

function NewGenre({setGenre, onConfirm, onCancel}: Props) {

  const handleConfirm = () => {
    onConfirm();
  }

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 bg-gray-900 bg-opacity-70 flex justify-center items-center z-50 text-base">
      <div className="flex flex-col w-[500px] sm:w-[300px] sm:p-4 h-fit bg-black/60 text-white rounded-xl shadow-lg p-6  sm:text-sm">
        <div className="mb-4 space-y-2">
            <p> Add new genre.</p>
            
            <input
              className="w-full focus:outline-none py-4 px-4 rounded-xl text-white bg-zinc-800"
              name="genre"
              placeholder='insert genre'
              onChange={(e) => setGenre(e.target.value)}
            />

        </div>
        <div className="flex justify-center w-full space-x-2">
              <button
                className="px-2 py-3 w-5/12 text-white font-semibold bg-zinc-800 rounded-xl"
                onClick={handleConfirm}
              >
                Confirm
              </button>
              <button 
                className="px-2 py-3 w-5/12 text-white font-semibold bg-zinc-800 hover:bg-zinc-400 rounded-xl"
                onClick={onCancel}
              >
                Cancel
              </button>
          </div>
      </div>

    </div>
  )
}

export default NewGenre