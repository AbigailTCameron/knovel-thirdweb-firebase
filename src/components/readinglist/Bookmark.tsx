'use client'
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { Book } from '../../..';
import StarRating from '../StarRating';
import { fetchBookDetails } from '../../../functions/readinglist/fetch';

type Props = {
  userId?: string;
  bookmarks?: string[];
}

function Bookmark({userId, bookmarks}: Props) {
  const router = useRouter();
  const [bookDetails, setBookDetails] = useState<Book[]>([]);

  const handleBookClick = (bookId: string) => {
    // Navigate to the book page using the book's ID
    router.push(`/book/${bookId}`);
  };

  useEffect(() => {
    if(bookmarks){
      fetchBookDetails(bookmarks, setBookDetails)
    }
    
  }, [bookmarks])

  return (
    <div className="w-full h-full flex-col space-y-10 p-8 sm:p-2">
      {bookDetails.map((bookmark, index) => (
        <div onClick={() => handleBookClick(bookmark.id)}  key={index} className="flex w-full h-fit space-x-4 hover:cursor-pointer">

              <div className=" w-[250px] h-[400px] sm:w-[180px] sm:h-[270px] flex-shrink-0">
                <img 
                  className="z-10 p-0.5 w-full h-full bg-white group-hover:bg-gradient-to-r from-[#7F60F9] to-[#6DDCFF] rounded-xl object-cover" 
                  src={bookmark.book_image} 
                  alt={bookmark.title}
                />
              </div>

              <div className=" w-full text-white flex-1 space-y-3 max-h-[400px] sm:max-h-[270px] flex flex-col">
                <p className="text-4xl sm:text-xl font-bold flex-shrink-0">{bookmark?.title}</p>
                
                <div className="flex items-center space-x-1 flex-shrink-0">
                  <p className='text-xl md:text-lg sm:text-sm font-bold'>{bookmark.author}</p>
                  {bookmark.verified && (
                    <Image 
                    src="/verified.png"
                    alt="verified"
                    width={"20"}
                    height={"20"}
                    />
                  )}
                </div>

                <StarRating rating={bookmark?.rating ?? 0}/> 

                <p className="font-light ss:hidden sm:text-xs overflow-hidden break-words text-ellipsis whitespace-normal text-wrap">{bookmark?.synopsis}</p>

                <div className="flex flex-wrap space-x-2 flex-shrink-0 xs:hidden">
                    <p>Genres:</p>

                    {bookmark?.genres.map((genre, index) => (
                      <div key={index} className="flex space-x-1 font-light">
                        <p>{genre}</p>
                      </div>
                    ))}
                </div>

             
              </div>
          
        </div>
      ))}
    </div>
  )
}

export default Bookmark