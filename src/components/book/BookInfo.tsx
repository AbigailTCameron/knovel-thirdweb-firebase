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
import { fetchBookData, fetchBookmark, fetchFinishedList, fetchLiked, updateBookmarkData, updateFinishedBookData, updateLikedBookData, updateRating } from '../../../functions/book/fetch';
import {FaStar} from "react-icons/fa";
import View from '../icons/View';
import Liked from '../icons/Liked';
import Check from '../icons/Check';



type Props = {
  id ?: string
  userId ?: string;
  bookmarks : string[];
  likes: string[];
  finishedList: string[];
  userRating : number;
  setUserRating: Function;
  onLoadingChange?: (loading: boolean) => void; // NEW
  onReady?: () => void;    
  onRequireWalletConnect?: () => void; 
  setShowConnect?: () => void;    
}

function BookInfo({userId, id, bookmarks, likes, finishedList, userRating, setUserRating, onLoadingChange, onReady, onRequireWalletConnect, setShowConnect}: Props) {
  const router = useRouter();

  const [book, setBook] = useState<Book>();
  const [bookmark, setBookmark] = useState<boolean>(false); 
  const [error, setError] = useState<string>(''); 
  const [hoverRating, setHoverRating] = useState<number>(0); // Temporary hover rating
  const [liked, setLiked] = useState<boolean>(false);
  const [finished, setFinished] = useState(false);

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
    if(!userId){
      onRequireWalletConnect?.();
      return;
    }

    const newBookmarkState = !bookmark;
    setBookmark(newBookmarkState); 

    if(id && userId){
      await updateBookmarkData(userId, id); 
    } 
  }


  const handleLikeClick = async () => {
    if(!userId){
      onRequireWalletConnect?.();
      return;
    }

    const newLikeState = !liked;
    setLiked(newLikeState); 

    if(id && userId){
      await updateLikedBookData(userId, id); 
    } 
  }

  const handleMarkFinished = async() => {
    if(!userId){
      onRequireWalletConnect?.();
      return;
    }

    const newState = !finished;
    setFinished(newState);


    if(id && userId){
      await updateFinishedBookData(userId, id); 
    } 
  }


  useEffect(() => {
    const run = async () => {
      if (!id) return;
      onLoadingChange?.(true);
      try {
        fetchBookmark(bookmarks, id, setBookmark);
        fetchLiked(likes, id, setLiked);
        fetchFinishedList(finishedList, id, setFinished)
        await fetchBookData(id, (data: Book) => setBook(data));
      } finally {
        onLoadingChange?.(false);
        onReady?.(); // signal that the book is ready to render
      }
    };
    run();
  }, [id, bookmarks, finishedList, likes]);


  const handleReadClick = async (id?: string) => {
    if (!id) return;

    // Fire-and-forget; don't block navigation
    fetch(`/api/books/${id}/views`, { 
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: userId ?? null,
      }),
    }).catch(() => {});

    router.push(`/read/${id}`);
  };



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
              <div 
                onMouseEnter={() => router.prefetch(`/read/${id}`)}
                onClick={() => handleReadClick(id)} 
                  className="w-1/2 halflg:w-[200px] xsymd:w-[120px] sm:w-fit">
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

              <div onClick={handleLikeClick} className="flex hover:cursor-pointer">
                {liked ? (
                  <Liked className='size-8 sm:size-8 stroke-[#7F60F9]'/>
                ): (
                  <Liked className='size-8 sm:size-8 stroke-white'/>
                )}
                
              </div>
              
            </div>

            <div className="flex text-5xl space-x-2 mt-2">
                {[1, 2, 3, 4, 5].map((value) => (
                      <FaStar key={value} 
                        className={`text-5xl sm:size-8 ${
                          (hoverRating || userRating) >= value ? 'text-yellow-500' : 'text-gray-400'
                        } hover:text-yellow-500`}
                          onMouseEnter={() => setHoverRating(value)}
                          onMouseLeave={() => setHoverRating(0)}
                          onClick={() => { 
                            if(!userId){
                              onRequireWalletConnect?.();
                              return;
                            }
                            handleSaveRating(value)
                          }}
                      />  
                ))}

            </div>
        </div>

        <div className="w-full h-full basis-2/3 halflgyhalflg:basis-3/4 ylg:basis-3/4 flex-col space-y-8 text-white overflow-y-auto">
            <div className="flex flex-col space-y-3">
                <p className="text-4xl ss:text-2xl font-bold">{book?.title}</p>
                <p className="text-xl font-medium">{book?.author}</p>

                <div className='flex space-x-3 text-white/80'>
                      <StarRating rating={book?.rating ?? 0}/> 
                      <div onClick={handleMarkFinished} className={`flex space-x-2 items-center border border-[#272831] ${finished && "border-green-500"} rounded-lg px-2 py-1 hover:cursor-pointer`}>
                        {finished ? (
                          <p>Already read</p>
                        ):(
                          <p>Mark as read</p>
                        )}
                        
                        <Check className={`stroke-white/80 ${finished && "stroke-green-500"} size-5`}/>
                      </div>
                </div>
                

                <div className="flex items-center space-x-1">
                  <View className="stroke-white size-5"/>
                  <p className="text-sm">{book?.views}</p>
                </div>

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