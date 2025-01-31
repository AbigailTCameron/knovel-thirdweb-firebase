import React, { useEffect, useState } from 'react'
import { fetchBookProfileDetails } from '../../../functions/profile/fetch';
import { Book } from '../../..';
import Clock from '../icons/Clock';
import { timeAgo } from '../../../tools/timeago';
import { formatDate } from '../../../tools/formatDate';
import View from '../icons/View';

type Props = {
  books?: string[];

}

function ProfileBooks({books}: Props) {
  const [bookDetails, setBookDetails] = useState<Book[]>([]);


  useEffect(() => {
    
    if(books){
      fetchBookProfileDetails(books, setBookDetails)
    }
    
  }, [books])


  return (
    <div className="flex space-x-6 overflow-x-auto">
        {bookDetails.map((book, index) => (
          <div key={index} className="flex">
               <div className="relative w-[250px] h-[400px] sm:w-[180px] sm:h-[270px] flex-shrink-0">
                  <img 
                    className="z-10 p-0.5 w-full h-full group-hover:bg-gradient-to-r from-[#7F60F9] to-[#6DDCFF] rounded-3xl object-cover" 
                    src={book.book_image} 
                    alt={book.title}
                  />

                  <div className="flex flex-col absolute bottom-0 bg-[#1b1c1e] w-full h-1/3 rounded-b-3xl px-4 py-4 space-y-2">

                    <p className="text-lg font-semibold">{book.title}</p>

                    <div>
                      <p className="text-sm">Price</p>
                    </div>

                    <div className="flex justify-between">
                      <div className="flex text-xs space-x-1 items-center">
                          <Clock 
                            className="stroke-white size-3"
                          />
                          <p>{formatDate(book.created_at)}</p>
                      </div>

                      <div className="flex text-xs">
                        <View 
                          className="stroke-white size-4"
                        />
                      </div>
                    </div>
                   
                  </div>
              </div>
          </div>
        ))}
    </div>
  )
}

export default ProfileBooks