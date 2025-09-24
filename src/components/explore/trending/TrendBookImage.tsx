import React, { useEffect, useState } from 'react'

type Props = {
  bookUrl : string;
}

function TrendBookImage({bookUrl}: Props) {

  return (
    <div className="w-[70px] sm:w-[60px] h-[112px] sm:h-[96px] items-center justify-center">
      {bookUrl && (
        <img 
          className="p-0.5 bg-white rounded-xl object-cover w-full h-full" 
          src={bookUrl} 
          alt={bookUrl} 
        />
      )}
     
    </div>
  )
}

export default TrendBookImage