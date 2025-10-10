import React, { useEffect, useState } from 'react'
import { fetchBooksByGenre } from '../../../../functions/explore/fetch';
import { Book } from '../../../..';
import GenreImage from './GenreImage';
import { useRouter } from 'next/navigation';
import StarRating from '@/components/StarRating';

type Props = {
  title ?: string;
  genre ?: string;
}

function GenreBooks({title, genre}: Props) {
  const router = useRouter();
  const [books, setBooks] = useState<Book[]>([]);
  

  useEffect(() => {
      const getBooks = async () => {
        fetchBooksByGenre(genre || '', setBooks);
      };
  
      getBooks();
    }, [genre]);


    const handleBookClick = (bookId: string) => {
      router.push(`/book/${bookId}`);
    };

  return (
    <div className='text-white w-full h-full overflow-x-hidden'>
      <p className="text-2xl font-extrabold">{title}</p>

      <div className={`flex w-full overflow-x-auto space-x-10 halflg:space-x-4 md:space-x-4 mt-4 halflg:mt-0 custom-scrollbar`}>

        {books.map((book) => (
          <div 
            key={book.id} 
            onClick={() => handleBookClick(book.id)}
            className="group flex-shrink-0 flex h-fit md:h-full items-center hover:cursor-pointer"  
          >
            <div className="flex bg-black h-full rounded-xl space-x-4 halflg:space-x-2 items-center">
              <div className="w-fit h-fit rounded-xl group-hover:bg-gradient-to-r from-[#7F60F9] to-[#6DDCFF]">
                  <GenreImage 
                    imageFile={book.book_image}
                  />
              </div>

              <div className='hidden group-hover:block w-[400px] halflg:max-h-[240px] space-y-2'>
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
                  <p className='line-clamp-6 halflg:line-clamp-5 md:line-clamp-4 sm:line-clamp-3 sm:text-xs whitespace-normal text-wrap'>{book.synopsis}</p>

              </div>
            </div>

          </div>
        ))}

      </div>
    </div>
  )
}

export default GenreBooks