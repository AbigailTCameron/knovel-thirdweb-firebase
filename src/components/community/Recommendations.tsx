import React, { useRef } from 'react'
import { useRouter } from 'next/navigation'
import View from '../icons/View';

type Props = {
  results: any[];
  loadMore: () => void;
}

function Recommendations({results, loadMore}: Props) {
  const router = useRouter(); 
  const containerRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (!containerRef.current) return;
    
    const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;

    if (scrollLeft + clientWidth >= scrollWidth - 10) {
      loadMore(); // Load more books when reaching the end
    }
  };

  const handleMouseEnter = (id: string) => router.prefetch(`/book/${id}`);

  return (
    <div className="flex flex-col w-full overflow-hidden text-white space-y-2">
        {results.length == 0 ? (
          <div className="flex w-full h-full items-center justify-center">
           <p>You have no new recommendations.</p>
          </div>
        ) : (
          <div className="w-full">
            <div 
            ref={containerRef}
            onScroll={handleScroll} 
            className="flex w-full h-full space-x-4 halfxl:space-x-6 overflow-x-auto custom-scrollbar">
          
              {results.map((book) => (
                <div 
                  onMouseEnter={() => handleMouseEnter(book.id)}
                  onClick={() => router.push(`/book/${book.id}`)} 
                  key={book.id} 
                  className="flex w-full flex-col text-white hover:cursor-pointer"
                >
                  
                    <div className="flex w-[300px] halfxl:w-[200px] md:w-[150px] h-[240px] halfxl:h-[160px] md:h-[120px] rounded-md">
                        {book.authorProfile && (
                            <img 
                              className='w-full h-hull rounded-md'
                              src={book.authorProfile}
                            />
                        )}
                    </div>

                    <div className="flex -mt-[130px] ml-[10px] halfxl:-mt-[80px] md:-mt-[50px] w-[100px] halfxl:w-[80px] md:w-[50px] h-[160px] halfxl:h-[128px] md:h-[80px] border border-white rounded-xl">
                      <img 
                        className="w-full h-full rounded-xl"
                        src={book.book_image}
                      />
                    </div>

                    <div className="flex flex-col">
                      <p className="text-xl md:text-lg font-bold">{book.title}</p>

                      <div className='flex items-center space-x-1'>
                        <p className="font-medium md:text-sm">{book.author}</p>
                        {book.verified && (
                          <img 
                            className='w-[15px] h-[15px]'
                            src="/verified.png"
                          />
                        )}
                      </div>

                      <div className="flex items-center space-x-1 text-white/50 text-sm">
                        <View className="size-4"/>
                        <p>{book.views}</p>
                      </div>
                  </div>


                </div>
              ))}
            </div>   
          </div>

        )}

     
           
    </div>
    
  )
}

export default Recommendations