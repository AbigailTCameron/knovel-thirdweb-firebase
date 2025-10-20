import React from 'react'
import TrashIcon from '../icons/TrashIcon'

type Props = {
  onConfirm : Function;
  onCancel ?: () => void;
  chapterTitle ?: string;
}

function DeleteChapter({onConfirm, onCancel, chapterTitle}: Props) {
  const handleConfirm = () => {
    onConfirm();
  }

  return (
        <div className="fixed top-0 left-0 right-0 bottom-0 bg-gray-900 bg-opacity-70 flex justify-center items-center z-50 text-base">
          <div className="flex flex-col w-[500px] sm:w-[300px] sm:p-4 h-fit bg-black/60 text-white rounded-xl shadow-lg p-6  sm:text-sm">
        
              <div className="flex items-center text-red-500 w-full mb-2">
                  <TrashIcon className="text-2xl sm:text-xl" />
                  <p className="text-2xl sm:text-xl font-semibold">Are you sure?</p>
              </div>

              <div className="mb-4 space-y-1 text-base sm:text-sm">
                  <p>You are about to delete this chapter <span className="font-semibold">'{chapterTitle}'.</span></p>

                  <p>Note that this action is permanent and you will not be able to recover it after deleting.
                  </p>
              </div>

          

              <div className="flex justify-center w-full space-x-2">
                  <button
                    className="px-2 py-3 w-5/12 text-white font-semibold bg-red-600 hover:bg-red-500 rounded-xl"
                    onClick={handleConfirm}
                  >
                    Delete
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

export default DeleteChapter