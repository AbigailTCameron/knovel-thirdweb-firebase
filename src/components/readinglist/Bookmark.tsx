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
    <div className="grid grid-cols-5 xxl:grid-cols-4 halfxl:grid-cols-3 sm:grid-cols-2 gap-4 sm:gap-1 w-full h-full">
      {bookDetails.map((bookmark, index) => (
        <div onClick={() => handleBookClick(bookmark.id)}  key={index} className="group relative col-span-1 hover:col-span-2 transition-all duration-300 ease-in-out flex space-x-2 extramini:space-x-1 cursor-pointer">

              <div className=" w-[250px] h-[400px] halflg:w-[180px] halflg:h-[270px] extramini:w-[150px] extramini:h-[240px] flex-shrink-0">
                <img 
                  className="z-10 p-0.5 w-full h-full group-hover:bg-gradient-to-r from-[#7F60F9] to-[#6DDCFF] rounded-3xl object-cover" 
                  src={bookmark.book_image} 
                  alt={bookmark.title}
                />
              </div>

              <div className="hidden group-hover:flex flex-col w-full px-2 text-white flex-1 space-y-2 max-h-[400px] sm:max-h-[270px]">
                <p className="text-2xl sm:text-xl font-bold flex-shrink-0">{bookmark?.title}</p>
                
                <div className="flex flex-col">
                    <div className="flex items-center space-x-1 flex-shrink-0">
                      <p className='text-lg md:text-lg sm:text-sm font-bold'>{bookmark.author}</p>
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
                </div>

                <p className="font-light ss:hidden text-xs overflow-hidden break-words text-ellipsis whitespace-normal text-wrap">{bookmark?.synopsis}</p>

                <div className="flex text-sm flex-wrap space-x-2 flex-shrink-0 xs:hidden">
                    <p>Genres:</p>

                    {bookmark?.genres.map((genre, index) => (
                      <div key={index} className="flex text-sm space-x-0.5 border-[0.5px] p-0.5 rounded-full font-light">
                        <p className="text-sm">{genre}</p>
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