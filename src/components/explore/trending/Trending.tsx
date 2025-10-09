'use client'
import React, { useEffect, useState } from 'react'
import TrendingHeader from './TrendingHeader';
import TrendingBooks from './TrendingBooks';
import { Book } from '../../../..';
import { fetchBooks, fetchTopRated } from '../../../../functions/explore/fetch';

type Props = {}

function Trending({}: Props) {
  const [currentPage, setCurrentPage] = useState(0); // 0 = Newest, 1 = Top Rated
  const [books, setBooks] = useState<Book[]>([]);

  const [currentPagination, setCurrentPagination] = useState(0);
  const [booksPerPage, setBooksPerPage] = useState(10); // default

  
  // ✅ Adjust booksPerPage based on screen width
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 640) { // Tailwind 'sm' breakpoint (640px)
        setBooksPerPage(5);
      } else {
        setBooksPerPage(10);
      }
    };

    // Initial check
    handleResize();
    // Listen for resize
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);


  const handlePreviousPage = () => {
    if (currentPagination > 0) {
      setCurrentPagination((prev) => prev - 1);
    }
  };

  const handleNextPage = () => {
    if ((currentPagination + 1) * booksPerPage < books.length) {
      setCurrentPagination((prev) => prev + 1);
    }
  };


  useEffect(() => {
    const fetchData = async () => {
      if(currentPage == 0){
          await fetchBooks(setBooks);
      }else if(currentPage == 1) {
          await fetchTopRated(setBooks);
      }
      setCurrentPagination(0); // 🔑 reset to first page when category changes
    }
    fetchData();
  }, [currentPage])
  

  const displayedBooks = books.slice(
    currentPagination * booksPerPage,
    (currentPagination + 1) * booksPerPage
  );


  return (
    <div className='text-white w-full h-full space-y-4'>
        <TrendingHeader 
          setCurrentPage={setCurrentPage}
          currentPage={currentPage}

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