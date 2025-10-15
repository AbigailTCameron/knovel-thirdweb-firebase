import React from 'react'
import AuthorCard from './authors/AuthorCard';

type Props = {
  userId: string;
}

function FeaturedAuthor({userId}: Props) {
  return (
    <div className=" flex flex-col w-full h-full items-center justify-center text-white">

      {/* <div className="bg-white/10 p-1 rounded-full">
        <div className="bg-white/20 backdrop-blur-sm rounded-full px-2 py-1">
            <p className="font-semibold">Authors</p>
        </div>
      </div> */}

    
      <p className="font-semibold text-3xl ss:text-xl py-1">Featured Authors</p>


     
     <div className='flex w-full h-full justify-between -space-x-10 xxl:-space-x-8 halfxl:-space-x-4 ss:space-x-0 overflow-visible'>
       <AuthorCard 
        className="flex flex-1"
        username={"oscarwilde"}
        userId={userId}
        author="Oscar Wilde"
        tags={["Gothic", "Horror"]}
        imgSrc="/oscar.png"
      />

      <AuthorCard 
        className="flex flex-1 z-10"
        username={"janeausten"}
        userId={userId}
        author="Jane Austen"
        tags={["Romance", "Victorian"]}
        imgSrc="/jane.png"
      />

      <AuthorCard 
        className="flex flex-1 z-20"
        username={"hgwells"}
        userId={userId}
        author="H.G. Wells"
        tags={["Sci-Fi", "Fantasy"]}
        imgSrc="/hgwells.png"
      />

      <AuthorCard 
        className="flex flex-1 sm:hidden"
        username={"charlesdickens"}
        userId={userId}
        author="Charles Dickens"
        tags={["Historical Fiction", "British"]}
        imgSrc="/charles.png"
      />
     </div>
    
    </div>
  )
}

export default FeaturedAuthor