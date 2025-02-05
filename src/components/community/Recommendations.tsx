import React, { useEffect, useState } from 'react'
import StarRating from '../StarRating'
import { useRouter } from 'next/navigation'

type Props = {
  results: any[]
}

function Recommendations({results}: Props) {
  const router = useRouter(); 

  return (
    <div className="flex flex-col w-full px-4 overflow-hidden text-white space-y-2">
        <p className="text-xl font-bold">You might like:</p>

        <div className="w-full">
              <div className="flex w-full h-full space-x-4 overflow-x-auto custom-scrollbar px-4 pr-36">
             
                {results.map((book) => (
                  <div onClick={() => router.push(`/book/${book.id}`)} key={book.id} className="flex w-full flex-col text-white hover:cursor-pointer">
                    
                      <div className="flex w-[300px] h-[240px] rounded-md">
                          {book.authorProfile && (
                              <img 
                                className='w-full h-hull rounded-md'
                                src={book.authorProfile}
                              />
                          )}
                      </div>

                      <div className="flex -mt-[130px] ml-[10px] w-[100px] h-[160px] border border-white rounded-xl">
                        <img 
                          className="w-full h-full rounded-xl"
                          src={book.book_image}
                        />
                      </div>

                      <div className="flex flex-col">
                        <p className="text-xl font-bold">{book.title}</p>

                        <div className='flex items-center space-x-1'>
                          <p className="font-medium">{book.author}</p>
                          {book.verified && (
                            <img 
                              className='w-[15px] h-[15px]'
                              src="/verified.png"
                            />
                          )}
                        </div>
                    </div>


                  </div>
                ))}
              </div>   
        </div>

           
    </div>
    
  )
}

export default Recommendations