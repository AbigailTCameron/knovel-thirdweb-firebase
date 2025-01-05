import React, { useEffect, useState } from 'react'
import { Book } from '../../..';
import Image from 'next/image';
import StarRating from '../StarRating';
import { useRouter } from 'next/navigation';
import Document from '../icons/Document';
import BookCover from '../drafts/BookCover';
import { fetchPublishInfo } from '../../../functions/publish/fetch';

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
   

      {published.map((publish, index) => (
        <div onClick={() => handleBookClick(publish.id)}  key={index} className="flex w-full h-fit space-x-4 hover:cursor-pointer">            
            <BookCover imageFile={publish.book_image}/>


            <div className=" w-full text-white flex-1 space-y-3">
                <p className="text-4xl sm:text-xl font-bold">{publish?.title}</p>
                
                <div className="flex items-center space-x-1">
                  <p className='text-xl md:text-lg sm:text-sm font-bold'>{publish.author}</p>
                  {publish.verified && (
                    <Image 
                    src="/verified.png"
                    alt="verified"
                    width={"20"}
                    height={"20"}
                    />
                  )}
                </div>

                <StarRating rating={publish?.rating ?? 0}/> 

                <p className="font-light sm:text-xs">{publish?.synopsis}</p>

                <div className="flex space-x-2 xs:hidden">
                    <p>Genres:</p>

                    {publish?.genres.map((genre, index) => (
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

export default PublishList