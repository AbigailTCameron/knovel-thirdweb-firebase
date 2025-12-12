'use client'
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { formatDate } from '../../../tools/formatDate';
import Document from '../icons/Document';
import BookCover from './BookCover';
import { fetchDraftInfo } from '../../../functions/drafts/fetch';

type Props = {
  userId: string;
  setLoading: (value: boolean) => void;
}

function UserListDrafts({userId, setLoading}: Props) {
  const router = useRouter();
  const [drafts, setDrafts] = useState<any[]>([]);

  useEffect(() => {
    if(userId){
      fetchDraftInfo(userId, setDrafts); 
    }
  }, [userId, drafts])

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
        <div className="grid grid-cols-3 xl:grid-cols-2 md:grid-cols-1 gap-4 w-full h-fit">
              {drafts.map((draft, index) => (
                  <div 
                    onClick={() => (
                      setLoading(true),
                      router.push(`/draft/${userId}/${draft.draftId}`
                    ))}  
                    key={index} className="flex w-full h-[320px] lg:h-[270px] ss:h-[160px] space-x-4 hover:cursor-pointer border border-[#272831] rounded-xl overflow-y-hidden"
                  >  
                
                        <BookCover imageFile={draft.book_image}/>


                        <div className=" w-full text-white flex-1 py-3 lg:py-1 space-y-3 lg:space-y-1 overflow-y-scroll">

                          <div className='flex flex-col'>
                            <div className="flex flex-col w-full items-center justify-center space-x-2">
                              <p className="text-2xl sm:text-xl font-bold flex-shrink-0">{draft?.title}</p>
                            </div>
                            <p className="flex text-xs font-extralight">{formatDate(draft.created_at)}</p>
                          </div>

                          <div className='flex items-center space-x-2 text-sm'>
                            <p className='flex font-extralight'>Chapters: </p>
                            <div className='flex items-center justify-center bg-[#a5a5a5] rounded-2xl px-2'>
                                <p>{draft?.draft_chapters.length}</p>
                            </div>
                          </div>
                          
            
                            <p className="text-white text-sms overflow-hidden lg:line-clamp-2 break-words text-ellipsis whitespace-normal text-wrap"> <span className="font-semibold text-base lg:text-sm">Synopsis:</span> {draft?.synopsis}</p>


                            <div className="flex flex-wrap space-x-2 text-white">
                                <p className="text-white font-semibold halflg:text-sm">Genres:</p>
          
                                {draft?.genres.map((genre: string, index: any) => (
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

export default UserListDrafts