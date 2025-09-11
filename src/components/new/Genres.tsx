import React, { useState } from 'react'
import { genres } from '../../../bookGenres'
import Multidot from '../design/Multidot';
import ArrowRight from '../icons/ArrowRight';

type Props = {
  finishLoading: any;
  screen ?: number;
  selectedGenres: string[];
  setSelectedGenres: any;
}

function Genres({finishLoading, screen, selectedGenres, setSelectedGenres}: Props) {
  
  const toggleGenre = (genre: string) => {
    setSelectedGenres((prev: string[]) =>
      prev.includes(genre) ? prev.filter(g => g !== genre) : [...prev, genre]
    );
  };


  return (
    <div className="flex flex-col w-full h-full items-center justify-center text-white mt-4">
      <div className="flex flex-col w-1/2 h-fit bg-[#1b1c1e] rounded-xl p-6 text-white overflow-y-auto custom-scrollbar items-center justify-center">

           <p className="text-lg font-bold">Pick Your Favorite Genres</p>
           <p className="text-white/70 text-sm">Choose genres to curate your feed.</p>

          <div className={`flex flex-wrap gap-2 py-6 h-fit w-full`}>
              {genres.map((genre, index) => (
                  <div 
                    key={index} 
                    onClick={() => toggleGenre(genre)}
                    className={`px-4 py-2 border-[0.5px] border-white/50 text-sm rounded-xl hover:cursor-pointer 
                    ${selectedGenres.includes(genre) ? 'bg-purple-600 text-white' : ''}`}>
                    {genre}
                  </div>
              ))}
          </div>

          <div className="flex flex-col items-center justify-center space-y-2">
              <div className='flex bg-[#262629] h-fit w-fit p-2 rounded-full hover:cursor-pointer'
                onClick={finishLoading}
              >
                <ArrowRight className="stroke-[#FFFFFF] size-6"/>
              </div>

              <Multidot selected={screen}/>
          </div>

        

      </div>
    </div>
  )
}

export default Genres