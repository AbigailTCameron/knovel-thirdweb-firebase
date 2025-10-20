import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation';
import StarRating from '../../StarRating';
import TrendBookImage from './TrendBookImage';
import { Book } from '../../../..';

type Props = {
  books: Book[]; 
  currentPagination: number;
  booksPerPage: number; 
}

function TrendingBooks({books, currentPagination, booksPerPage}: Props) {
  const router = useRouter();

  const handleBookClick = (bookId: string) => {
    router.push(`/book/${bookId}`);
  };

  const handleMouseEnter = (id: string) => router.prefetch(`/book/${id}`);
  
  return (
    <div className='grid grid-cols-2 sm:grid-cols-1 gap-2 w-full h-fit'>
        {books.map((book, index) => (
          <div 
            onMouseEnter={() => handleMouseEnter(book.id)}
            key={book.id} 
            className="flex w-full hover:cursor-pointer hover:bg-gradient-to-r from-[#7F60F9] to-[#6DDCFF] rounded-full p-0.5"
            onClick={() => handleBookClick(book.id)} 
          >
            <div className="flex space-x-2 rounded-full w-full bg-[#101014] items-center px-4 xl:px-8 lg:px-4 py-2">
              <div className="flex basis-2/12 lg:basis-full xs:basis-full space-x-3 ">
                  <p className="font-bold self-center"> {currentPagination * booksPerPage + index + 1}.</p>
                    <TrendBookImage 
                      bookUrl={book.book_image}
                    />
               
  
                  <div className="flex-col w-[200px] xl:w-[150px] sm:w-[100px] lg:grow xs:grow">
                    <p className="text-base halfxl:text-base sm:text-sm xs:text-base font-bold line-clamp-3">{book.title}</p>

                    <div className="flex space-x-1">
                          <p className="text-sm halfxl:text-xs">{book.author}</p>
                          {book.verified && (
                            <img 
                              className="w-[15px] h-[15px] halfxl:w-[15px] halfxl:h-[15px]"
                              src="/verified.png"
                              alt="verified"
                              width={"20"}
                              height={"20"}
                            />)}
                    </div>

                    <StarRating rating={book.rating}/>

                  </div>

              </div>

              <div className="flex flex-col basis-10/12 lg:hidden sm:flex w-full xs:hidden">
                  <div className="flex flex-wrap gap-1 overflow-hidden max-h-[80px] halflg:max-h-[60px] halflg:hidden">
                    {book?.genres?.map((genre, index) => (
                        <div 
                          key={index} 
                          className="text-white border-[0.5px] p-0.5 rounded-full"
                        >
                            <p className="text-xs">{genre}</p>
                        </div>
                    ))}
                  </div>
                <p className='text-sm ss:text-xs line-clamp-3 whitespace-normal text-wrap'>{book.synopsis}</p>

              </div>

            </div>
          
       
          </div>
        ))}
    </div>
  )
}

export default TrendingBooks