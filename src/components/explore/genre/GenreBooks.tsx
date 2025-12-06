import React, { useEffect, useState } from 'react'
import { fetchBooksByGenre } from '../../../../functions/explore/fetch';
import { Book } from '../../../..';
import GenreImage from './GenreImage';
import { useRouter } from 'next/navigation';
import StarRating from '@/components/StarRating';

type Props = {
  title ?: string;
  genre ?: string;
  likedIds: Set<string>;
  finishedIds: Set<string>;
  followedAuthorIds: Set<string>;
}

function GenreBooks({title, genre, likedIds, finishedIds, followedAuthorIds}: Props) {
  const router = useRouter();
  const [books, setBooks] = useState<Book[]>([]);
  const [showRow, setShowRow] = useState(true);

  const TRENDING_THRESHOLD = 0;  // tiny but > 0
  const MIN_INTERESTING = 3;       // require at least 3 good ones
  
  useEffect(() => {
      const getBooks = async () => {
        fetchBooksByGenre(genre || '', (rawBooks: Book[]) => {

          const reRanked = [...rawBooks].sort((a, b) => {
            const scoreA = computePersonalScore(a);
            const scoreB = computePersonalScore(b);
            return scoreB - scoreA;
          });

          // Filter to "interesting" books by trendingScore
          const interesting = reRanked.filter((b) =>
              typeof (b as any).trendingScore === "number" &&
              (b as any).trendingScore >= TRENDING_THRESHOLD
          );

          if (interesting.length < MIN_INTERESTING) {
            // Not enough good content in this genre → hide row
            setShowRow(false);
            setBooks([]);
          } else {
            setShowRow(true);
            setBooks(interesting);
          }

        });
      };
  
      getBooks();
    }, [genre, likedIds, finishedIds, followedAuthorIds]);

    /**
     * adjust the score per book with user-specific signals:
     * Has the user liked it? → boost.
     * Has the user finished it? → slight boost if you want to surface rereads, or downrank if you want to surface new stuff.
     * Is the author someone they follow? → boost.
     * @param book 
     * @returns 
     */
    const computePersonalScore = (book: Book): number => {
      const base = typeof book.trendingScore === "number" ? book.trendingScore : 0;

      let bonus = 0;

      if (likedIds.has(book.id)) bonus += 2.0;
      if (finishedIds.has(book.id)) bonus += 1.0;
      if (followedAuthorIds.has(book.authorId)) bonus += 1.5;

      return base + bonus;
    };


    const handleBookClick = (bookId: string) => {
      router.push(`/book/${bookId}`);
    };

    const handleMouseEnter = (id: string) => router.prefetch(`/book/${id}`);

  if (!showRow) {
    // 🔥 Completely skip rendering this row
    return null;
  }


  return (
    <div className='text-white w-full h-full overflow-x-hidden'>
      <p className="text-2xl font-extrabold">{title}</p>

      <div className={`flex w-full overflow-x-auto space-x-10 halflg:space-x-4 md:space-x-4 mt-4 halflg:mt-0 custom-scrollbar`}>

        {books.map((book) => (
          <div 
            onMouseEnter={() => handleMouseEnter(book.id)}
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