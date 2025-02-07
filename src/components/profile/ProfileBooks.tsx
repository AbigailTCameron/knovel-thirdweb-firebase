import React, { useEffect, useState } from 'react'
import { fetchBookProfileDetails } from '../../../functions/profile/fetch';
import { Book } from '../../..';
import Clock from '../icons/Clock';
import { formatDate } from '../../../tools/formatDate';
import View from '../icons/View';
import { useRouter } from 'next/navigation';

type Props = {
  books?: string[];
  bookQuery: string;
}

function ProfileBooks({books, bookQuery}: Props) {
  const router = useRouter();
  const [bookDetails, setBookDetails] = useState<Book[]>([]);


  useEffect(() => {
    if(books){
      fetchBookProfileDetails(books, setBookDetails)
    }
  }, [books])

  // ** Filter books based on the bookQuery **
  const filteredBooks = bookDetails.filter((book) =>
    book.title.toLowerCase().includes(bookQuery.toLowerCase()) // Case-insensitive search
  );


  return (
    <div className="flex space-x-6 overflow-x-auto custom-scrollbar pr-4">
        {filteredBooks.map((book, index) => (
          <div onClick={() => router.push(`/book/${book.id}`)} key={index} className="flex hover:cursor-pointer hover:border-white hover:border-[0.5px] rounded-3xl p-[1px]">
               <div className="relative w-[250px] h-[400px] sm:w-[180px] sm:h-[270px] flex-shrink-0">
                  <img 
                    className="z-10 p-0.5 w-full h-full group-hover:bg-gradient-to-r from-[#7F60F9] to-[#6DDCFF] rounded-3xl object-cover" 
                    src={book.book_image} 
                    alt={book.title}
                  />

                  <div className="flex flex-col absolute bottom-0 bg-[#1b1c1e] w-full h-1/3 rounded-b-3xl px-4 py-2 space-y-2">

                      <p className="text-lg font-semibold text-white">{book.title}</p>

                      <div className="flex items-center justify-between text-white/70">
                          <p className="text-sm">Price</p>

                          <div className='flex text-lg font-medium space-x-1 text-white'>
                            <img 
                              className='w-[20px] h-[30px]'
                              src={"/eth.png"}
                            />
                            <p>{(book.price).toFixed(2)}</p>
                            <p>{book.currency}</p>
                          </div>
                          
                      </div>

                      <div className="flex items-center justify-between my-1 text-white/70">
                          <div className="flex text-xs space-x-1 items-center">
                              <Clock 
                                className="stroke-white/70 size-3"
                              />
                              <p>{formatDate(book.created_at)}</p>
                          </div>

                          <div className="flex text-xs space-x-1">
                              <View 
                                className="stroke-white/70 size-4"
                              />
                              <p>{book.views}</p>
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