'use client'
import React, { useEffect, useState } from 'react'
import TrendingHeader from './TrendingHeader';
import TrendingBooks from './TrendingBooks';
import { Book } from '../../../..';
import { fetchBooks, fetchTopRated } from '../../../../functions/explore/fetch';

type Props = {}

function Trending({}: Props) {
  const [currentPage, setCurrentPage] = useState(0);
  const [books, setBooks] = useState<Book[]>([]);
  const [lastVisibleDoc, setLastVisibleDoc] = useState<any>(null); // Track last document

  const [currentPagination, setCurrentPagination] = useState(0);
  const booksPerPage = 5;


  const handlePreviousPage = () => {
    if (currentPagination > 0) {
      setCurrentPagination(currentPagination - 1);
    }
  };

  const handleNextPage = () => {
    if ((currentPagination + 1) * booksPerPage < books.length) {
      setCurrentPagination(currentPagination + 1);
    }
  };


  useEffect(() => {
    const fetchData = async () => {
      if(currentPage == 0){
          const initialDoc = await fetchBooks(lastVisibleDoc, setBooks);
          setLastVisibleDoc(initialDoc); // Initialize the last visible document
      }else if(currentPage == 1) {
          const initialDoc = await fetchTopRated(lastVisibleDoc, setBooks);
          setLastVisibleDoc(initialDoc); // Initialize the last visible document
      }
    }

    fetchData();

  }, [currentPage])

  const displayedBooks = books.slice(
    currentPagination * booksPerPage,
    (currentPagination + 1) * booksPerPage
  );

  return (
    <div className='text-white text-5xl w-full h-full space-y-4'>
        <TrendingHeader 
          setCurrentPage={setCurrentPage}
          currentPage={currentPage}
          setLastVisibleDoc={setLastVisibleDoc}
        />

        <div className="w-full flex-shrink-0 h-full">
            <TrendingBooks 
              books={displayedBooks}
              currentPagination={currentPagination} 
              booksPerPage={booksPerPage} 
            />

            <div className="flex justify-center space-x-4 mt-2">
                <button
                  className={`text-base px-4 py-1 bg-gray-800 text-white rounded-full ${currentPagination === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={handlePreviousPage}
                  disabled={currentPagination === 0}
                >
                  <p>Previous</p>
                </button>

                <button
                  className={`text-base px-4 py-1 bg-gray-800 text-white rounded-full ${ (currentPagination + 1) * booksPerPage >= books.length ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={handleNextPage}
                  disabled={(currentPagination + 1) * booksPerPage >= books.length}
                >
                  <p>Next</p>
                </button>
            </div>
        </div>
    
    </div>
  )
}

export default Trending