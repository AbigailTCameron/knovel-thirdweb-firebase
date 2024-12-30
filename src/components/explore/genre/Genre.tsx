'use client'
import React, { useState } from 'react'
import BooksByGenre from './BooksByGenre';


function Genre() {
  const genres = [
    {genre: 'romance', title: 'Romance'},
    {genre: 'horror', title: 'Horror'},
    {genre: 'adventure', title: 'Adventure'},
    {genre: 'classics', title: 'Classics'},
    {genre: 'marriage', title: 'Marriage'},
    {genre: 'regency', title: 'Regency'}

  ];

  return (
    <div className="w-full flex flex-col px-20 lg:px-12 sm:px-6 xs:px-2 py-32 md:py-16 space-y-24 lg:space-y-10 h-fit">
        {genres.map((genre) => (
            <BooksByGenre key={genre.genre} title={genre.title} genre={genre.genre} />
        ))}
    </div>
  )
}

export default Genre