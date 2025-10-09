import React from 'react'
import GenreBooks from './GenreBooks';

type Props = {}

function Genre({}: Props) {

  const genres = [
    {genre: 'philosophy', title: 'Philosophy'},
    {genre: 'romance', title: 'Romance'},
    {genre: 'horror', title: 'Horror'},
    {genre: 'adventure', title: 'Adventure'},
    {genre: 'history', title: 'History'},
    {genre: 'classics', title: 'Classics'},
    {genre: '19th century', title: '19th Century'},
    {genre: 'mystery', title: 'Mystery'},
    {genre: 'children', title: 'Children'},
    {genre: 'politics', title: 'Politics/Political Science'}
  ];

  
  return (
    <div className='flex flex-col w-full h-full space-y-10 lg:space-y-10 py-20 halfxl:py-5 md:py-10'>
      {genres.map((genre) => (
        <GenreBooks key={genre.genre} title={genre.title} genre={genre.genre}/>
      ))}
    </div>
  )
}

export default Genre