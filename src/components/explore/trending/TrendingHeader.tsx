import React from 'react';

type PageProps = {
  setCurrentPage: (page: number) => void;
  currentPage: number;
}

function TrendingHeader({setCurrentPage, currentPage}: PageProps) {

  const handleClick = (page: number) => (event: React.MouseEvent) => {
    event.preventDefault(); 
    setCurrentPage(page);  
  };

  return (
    <div className="flex w-full text-xl text-white space-x-8 halflg:text-xl sm:text-base">
     
        <p onClick={handleClick(0)} className={`hover:cursor-pointer ${currentPage === 0 ? 'font-extrabold' : 'font-light text-gray-400'}`}>Trending</p>
        <p onClick={handleClick(1)} className={`hover:cursor-pointer ${currentPage === 1 ? 'font-extrabold' : 'font-light text-gray-400'}`}>Top Rated</p>
        {/* <p onClick={handleClick(2)} className={`hover:cursor-pointer ${currentPage === 2 ? 'font-extrabold' : 'font-light text-gray-400'}`}>New Releases</p>         */}
    </div>
  )
}

export default TrendingHeader