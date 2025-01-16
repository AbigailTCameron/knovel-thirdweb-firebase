'use client'
import React, { useEffect, useState } from 'react'
import { Book } from '../../..';
import StarRating from '../StarRating';
import { useRouter } from 'next/navigation';
import BookImage from './BookImage';
import FlowButton from '../buttons/FlowButton';
import FillBookmark from '../icons/FillBookmark';
import Bookmark from '../icons/Bookmark';
import { formatDate } from '../../../tools/formatDate';
import { fetchBookData, fetchBookmark, updateBookmarkData, updateRating } from '../../../functions/book/fetch';
import {FaStar} from "react-icons/fa";


type Props = {
  id ?: string
  userId ?: string;
  bookmarks : string[];
  userRating : number;
  setUserRating: Function;
}

function BookInfo({userId, id, bookmarks, userRating, setUserRating}: Props) {
  const router = useRouter();

  const [book, setBook] = useState<Book>();
  const [bookmark, setBookmark] = useState<boolean>(false); 
  const [error, setError] = useState<string>(''); 
  const [hoverRating, setHoverRating] = useState<number>(0); // Temporary hover rating


  const handleSaveRating = async(newRating: number) => {
    if (!userId || !id) return;
    setHoverRating(0);

    if (newRating === userRating) {
      await updateRating(userId, id, null, userRating);
      setUserRating(0);
    }else{
      await updateRating(userId, id, newRating, userRating);
      setUserRating(newRating);
    }
  };


  const handleBookmarkClick = async () => {
    const newBookmarkState = !bookmark;
    setBookmark(newBookmarkState); 

    if(id && userId){
      await updateBookmarkData(userId, id); 
    } 
  }

  useEffect(() => {
    if(id){
      fetchBookmark(bookmarks, id, setBookmark); 
      fetchBookData(id, router, setBook);
    }
  }, [id, bookmarks])


  if(error){
    return<p>Error fetching book information.</p>
  }


  return (
    <div className="w-full h-full flex halflg:flex-col px-14 py-10 xxl:px-16 halfxl:px-10 xsymd:py-4 overflow-hidden xxl:space-x-8 halflg:space-x-0 halflg:space-y-8">

        <div className="basis-1/3 halflgyhalflg:basis-1/4 ylg:basis-1/4 flex h-full w-full flex-col items-center halflg:justify-center space-y-3">
            <div className="flex w-full h-fit items-center justify-center">
              <BookImage 
                imageFile={book?.book_image}
              />
            </div>

            <div className="flex w-full items-center justify-center space-x-4">
                <div onClick={() => router.push(`/read/${id}`)} className="w-1/2 halflg:w-[200px] xsymd:w-[120px]">
                  <FlowButton 
                    title='Read'
                    buttonWidth='w-full'
                    buttonRadius='rounded-3xl'
                  />
                </div>
              
              <div onClick={handleBookmarkClick} className="flex hover:cursor-pointer">
                  {bookmark ? (
                    <div className="text-[#7F60F9]">
                        <FillBookmark className="size-10 sm:size-8"/>
                    </div>
                  ) : (
                    <div className="text-white">
                        <Bookmark className='size-10 sm:size-8'/>
                    </div>
                  )}
              </div>
              
            </div>

            <div className="flex text-5xl space-x-2 mt-2">
                {[1, 2, 3, 4, 5].map((value) => (
                      <FaStar key={value} 
                        className={`text-5xl ${
                          (hoverRating || userRating) >= value ? 'text-yellow-500' : 'text-gray-400'
                        } hover:text-yellow-500`}
                          onMouseEnter={() => setHoverRating(value)}
                          onMouseLeave={() => setHoverRating(0)}
                          onClick={() => handleSaveRating(value)}
                      />  
                ))}

            </div>
        </div>

        <div className="w-full h-full basis-2/3 halflgyhalflg:basis-3/4 ylg:basis-3/4 flex-col space-y-8 text-white overflow-y-auto">
            <div className="flex flex-col space-y-3">
                <p className="text-4xl ss:text-2xl font-bold">{book?.title}</p>
                <p className="text-xl font-medium">{book?.author}</p>
                <StarRating rating={book?.rating ?? 0}/> 

                <p className="font-light w-3/4 halflg:w-full">{book?.synopsis}</p>
                
                <div className="flex space-x-2">
                    <p>Genres:</p>

                    {book?.genres.map((genre, index) => (
                      <div key={index} className="flex space-x-1 font-light">
                        <p>{genre}</p>
                      </div>
                    ))}
                </div>
              
                <div className="flex space-x-1 text-sm font-extralight">
                    <p>Published:</p>
                    <p> {formatDate(book?.created_at)}</p>
                </div>
            </div>
            
            
        </div>
        
    </div>
  )
}

export default BookInfo