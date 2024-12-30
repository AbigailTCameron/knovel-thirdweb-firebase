import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation';
import { Book } from '../../../../..';
import StarRating from '../../StarRating';
import GenreImage from './GenreImage';
import { fetchBooksByGenre } from '../../../../../functions/explore/fetch';

type Props = {
  genre ?: string;
  title ?: string;
}

function BooksByGenre({genre, title}: Props) {
  const router = useRouter();
  const [books, setBooks] = useState<Book[]>([]);


  const handleBookClick = (bookId: string) => {
    router.push(`/book/${bookId}`);
  };

  useEffect(() => {
    const getBooks = async () => {
      fetchBooksByGenre(genre || '', setBooks);
    };

    getBooks();
  }, [genre]);


  return (
    <div className="flex flex-col text-white">
        <p className="text-4xl lg:text-3xl font-extrabold">{title}</p>
  
        <div className={`flex overflow-x-auto space-x-10 md:space-x-4 mt-8 lg:mt-4 custom-scrollbar`}>
            {books.map((book) => (
                <div key={book.id} className="group flex-shrink-0 flex h-[400px] md:h-full items-center hover:cursor-pointer" onClick={() => handleBookClick(book.id)} >
                  
                  <div className="flex bg-black h-full rounded-xl space-x-4 pr-2 items-center">
                      <div className="w-fit h-fit rounded-xl group-hover:bg-gradient-to-r from-[#7F60F9] to-[#6DDCFF]">
                        <GenreImage 
                          imageFile={book.book_image}
                        />
                      </div>
                  
                      <div className='hidden group-hover:block w-[300px] space-y-2'>
                          <p className='text-3xl md:text-2xl sm:text-xl font-bold'>{book.title}</p>
                        
                          <div className="flex items-center space-x-1">
                              <p className='text-xl md:text-lg sm:text-base font-bold'>{book.author}</p>
                              {book.verified && (
                                <img 
                                  src="/verified.png"
                                  alt="verified"
                                  width={"20"}
                                  height={"20"}
                                />
                              )}
                          </div>
                        
                      
                          <StarRating rating={book.rating}/> 
                          <p className='line-clamp-6 md:line-clamp-4 sm:line-clamp-3 sm:text-xs'>{book.synopsis}</p>
                      </div>
                  </div>

                </div>
            ))}
        </div>
      
    </div>
  )
}

export default BooksByGenre