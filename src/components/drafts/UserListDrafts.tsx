'use client'
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { formatDate } from '../../../tools/formatDate';
import Document from '../icons/Document';
import BookCover from './BookCover';
import { fetchDraftInfo } from '../../../functions/drafts/fetch';

type Props = {
  userId: string;
  setLoading: Function;
}

function UserListDrafts({userId, setLoading}: Props) {
  const router = useRouter();
  const [drafts, setDrafts] = useState<any[]>([]);

  useEffect(() => {
    if(userId){
      fetchDraftInfo(userId, setDrafts); 
    }
  }, [userId])

  return (
    <div className="w-full h-full flex-col space-y-10 p-8 sm:p-2">

        {drafts.length === 0 && (
          <div className="w-full h-full flex flex-col items-center justify-center">

            <div onClick={() => router.push(`/create`)} className="bg-[#1f1f21] text-white rounded-2xl text-2xl space-x-2 flex items-center justify-center p-8 w-fit h-fit hover:cursor-pointer hover:scale-110">
              <p>+ Create a draft</p>
              <Document className="stroke-white"/>
            </div>            
          </div>
        )}
   
        {drafts.map((draft, index) => (
          <div 
            onClick={() => (
              setLoading(true),
              router.push(`/draft/${draft.draft_id}`
            ))}  
            key={index} className="flex w-full h-fit space-x-4 hover:cursor-pointer"
          >  
        
                <BookCover imageFile={draft.book_image}/>


                <div className=" w-full text-white flex-1 space-y-3">
                    <p className="text-4xl sm:text-xl font-bold">{draft?.title}</p>
                  
                    <div className="flex items-center space-x-1">
                        <p className='text-xl md:text-lg sm:text-sm font-bold'>{draft.author}</p>

                    </div>

                    <div className="flex space-x-1 text-sm font-extralight text-white mt-8">
                      <p>written:</p>
                      <p>{formatDate(draft.created_at)}</p>
                    </div>

                    <p className="font-light sm:text-xs">{draft?.synopsis}</p>
{/* 
                    <div className="flex space-x-2">
                        <p>Genres:</p>
  
                        {draft?.genres.map((genre, index) => (
                          <div key={index} className="flex space-x-1 font-light">
                            <p>{genre}</p>
                          </div>
                        ))}
                    </div> */}

              
                </div> 
              
          </div>
          
        ))}
    </div>
  )
}

export default UserListDrafts