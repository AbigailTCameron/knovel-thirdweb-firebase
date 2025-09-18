import React from 'react'

type Props = {
  imageFile : string;
}

function BookCover({imageFile}: Props) {

  return (
    <div className=" w-[200px] h-[320px] sm:w-[180px] sm:h-[270px] flex-shrink-0">

        {imageFile ? (
            <img
              className="z-10 p-0.5 w-full h-full group-hover:bg-gradient-to-r from-[#7F60F9] to-[#6DDCFF] rounded-xl object-cover" 
              src={imageFile}
              alt={imageFile}

            />
            ) : (
              <div className="flex bg-[#2a2929] items-center justify-center self-center rounded-xl w-full h-full text-white">
                <p>no book cover</p>
              </div>
        )}
    </div>
  )
}

export default BookCover