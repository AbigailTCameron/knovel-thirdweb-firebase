import React from 'react'

type Props = {
  title ?: string;
  onConfirm : Function;
  onCancel ?: () => void;
}

function PublishPopup({title, onConfirm, onCancel}: Props) {
  const handleConfirm = () => {
    onConfirm();
  }

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 bg-gray-900 bg-opacity-70 flex justify-center items-center z-50 text-base">
      <div className="flex flex-col w-[500px] sm:w-[300px] sm:p-4 h-fit bg-black/60 text-white rounded-xl shadow-lg p-6  sm:text-sm">
            <div className="mb-4 space-y-2">
                  <p> You are about to publish your draft "{title}"</p>
                  <p className="font-light">Note: After publishing you can go back and add new chapters, edit title, genre and synopsis, however you will not be able to alter details of chapters already published.
                  </p>

            </div>
            <div className="flex justify-center w-full space-x-2">
                <button
                  className="px-2 py-3 w-5/12 text-white font-semibold bg-zinc-800 rounded-xl"
                  onClick={handleConfirm}
                >
                  Proceed
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

export default PublishPopup