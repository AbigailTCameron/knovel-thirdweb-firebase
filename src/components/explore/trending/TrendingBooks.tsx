import React from 'react'
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



  return (
    <div className='flex flex-col w-full h-fit space-y-2'>
        {books.map((book, index) => (
          <div 
            key={book.id} 
            className="flex items-center justify-center w-full space-x-3 hover:cursor-pointer hover:bg-gradient-to-r from-[#7F60F9] to-[#6DDCFF] rounded-full p-0.5"
            onClick={() => handleBookClick(book.id)} 
          >
            <div className="flex justify-center xs:justify-start rounded-full w-full bg-[#101014] items-center px-8 py-4">
              <div className="flex basis-3/12 space-x-3">
                  <p className="text-xl font-bold self-center"> {currentPagination * booksPerPage + index + 1}.</p>

                    <TrendBookImage 
                      bookUrl={book.book_image}
                    />
               
  
                  <div className="flex-col w-[250px] lg:w-[150px]">
                    <p className="text-lg halfxl:text-base sm:text-sm xs:text-base font-semibold line-clamp-3">{book.title}</p>

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

              <div className="flex basis-7/12 xs:hidden">
                <p className='text-sm line-clamp-3 whitespace-normal text-wrap'>{book.synopsis}</p>
              </div>

              <div className="flex flex-wrap basis-2/12 gap-1 ml-2 overflow-hidden max-h-[80px] halflg:max-h-[60px] halflg:hidden">
                {book?.genres?.map((genre, index) => (
                    <div 
                      key={index} 
                      className="text-white text-sm border-[0.5px] p-1 rounded-full"
                    >
                        <p className="text-xs">{genre}</p>
                    </div>
                ))}
              </div>


            </div>
          
       
          </div>
        ))}
    </div>
  )
}

export default TrendingBooks