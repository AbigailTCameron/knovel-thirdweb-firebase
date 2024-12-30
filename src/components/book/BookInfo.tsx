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
import { fetchBookData, fetchBookmark, updateBookmarkData } from '../../../functions/book/fetch';


type Props = {
  id ?: string
  userId ?: string;
  bookmarks : string[];
}

function BookInfo({userId, id, bookmarks}: Props) {
  const router = useRouter();

  const [book, setBook] = useState<Book>();
  const [bookmark, setBookmark] = useState<boolean>(false); 
  const [error, setError] = useState<string>(''); 

  const handleBookmarkClick = async () => {
    const newBookmarkState = !bookmark;
    setBookmark(newBookmarkState); 

    if(id && userId){
      await updateBookmarkData(userId, newBookmarkState, bookmarks, id); 
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