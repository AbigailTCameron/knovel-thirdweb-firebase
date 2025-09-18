import React from 'react'
import GenreBooks from './GenreBooks';

type Props = {}

function Genre({}: Props) {

  const genres = [
    {genre: 'romance', title: 'Romance'},
    {genre: 'horror', title: 'Horror'},
    {genre: 'adventure', title: 'Adventure'},
    {genre: 'classics', title: 'Classics'},
    {genre: '19th century', title: '19th Century'},
    {genre: 'mystery', title: 'Mystery'},
    {genre: 'marriage', title: 'Marriage'}
  ];

  
  return (
    <div className='flex flex-col w-full h-full space-y-10 lg:space-y-10 py-20 md:py-16'>
      {genres.map((genre) => (
        <GenreBooks key={genre.genre} title={genre.title} genre={genre.genre}/>
      ))}
    </div>
  )
}

export default Genre