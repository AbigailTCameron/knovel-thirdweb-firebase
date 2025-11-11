import React, { useEffect, useState } from 'react'
import { Book } from '../../..';
import Image from 'next/image';
import StarRating from '../StarRating';
import { useRouter } from 'next/navigation';
import Document from '../icons/Document';
import BookCover from '../drafts/BookCover';
import { fetchPublishInfo } from '../../../functions/publish/fetch';
import { formatDate } from '../../../tools/formatDate';

type Props = {
  userId: string;
}

function PublishList({userId}: Props) {
  const router = useRouter();
  const [published, setPublished] = useState<Book[]>([]);

  useEffect(() => {
    if(userId){
      fetchPublishInfo(userId, setPublished); 
    }
  }, [userId])

  const handleBookClick = (bookId: string) => {
    router.push(`/editPublish/${bookId}`)
  };




  return (
    <div className="w-full h-full flex-col space-y-10 p-8 sm:p-2">

      {published.length === 0 && (
        <div className="w-full h-full flex flex-col items-center justify-center">

          <div onClick={() => router.push(`/create`)} className="bg-[#1f1f21] text-white rounded-2xl text-2xl space-x-2 flex items-center justify-center p-8 w-fit h-fit hover:cursor-pointer hover:scale-110">
            <p>+ Create a new story</p>
            <Document className="stroke-white"/>
          </div>            
        </div>
      )}
   
    <div className="grid grid-cols-3 xl:grid-cols-2 md:grid-cols-1 gap-4 w-full h-fit">
      {published.map((publish, index) => (
        <div onClick={() => handleBookClick(publish.id)}  key={index}  className="flex w-full h-[320px] lg:h-[270px] ss:h-[160px] space-x-4 hover:cursor-pointer border border-[#272831] rounded-xl overflow-y-hidden">            
            <BookCover imageFile={publish.book_image}/>

            <div className=" w-full text-white flex-1 py-3 lg:py-1 space-y-3 lg:space-y-1 overflow-y-scroll">
                  <div className='flex flex-col'>
                    <div className="flex w-full items-center space-x-2">
                      <p className='flex text-sm font-extralight'>Published {index + 1}: </p>
                      <p className="text-2xl sm:text-xl font-bold flex-shrink-0">{publish?.title}</p>
                    </div>
                    <p className="flex text-xs font-extralight">{formatDate(publish.created_at)}</p>
                  </div>


                  <div className='flex items-center space-x-2 text-sm'>
                    <p className='flex font-extralight'>Chapters: </p>
                    <div className='flex items-center justify-center bg-[#a5a5a5] rounded-2xl px-2'>
                        <p>{publish?.chapters.length}</p>
                    </div>
                  </div>

                  <StarRating rating={publish?.rating ?? 0}/> 

                  <p className="text-white text-sms overflow-hidden lg:line-clamp-2 break-words text-ellipsis whitespace-normal text-wrap"> <span className="font-semibold text-base lg:text-sm">Synopsis:</span> {publish?.synopsis}</p>

                  <div className="flex flex-wrap space-x-2 text-white">
                      <p className="text-white font-semibold halflg:text-sm">Genres:</p>

                      {publish?.genres.map((genre: string, index: any) => (
                        <div key={index} className="flex text-sm halflg:text-xs space-x-0.5 border-[0.5px] p-0.5 rounded-full font-light break-words">
                          <p>{genre}</p>
                        </div>
                      ))}
                  </div>
            </div>

        </div>
      ))}
    </div>


    </div>
  )
}

export default PublishList