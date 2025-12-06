import React from 'react'
import GenreBooks from './GenreBooks';

type Props = {
  likedIds: Set<string>;
  finishedIds: Set<string>;
  followedAuthorIds: Set<string>;
  genreAffinity: Record<string, number>;
}

function Genre({likedIds, finishedIds, followedAuthorIds, genreAffinity}: Props) {  

  const baseGenres = [
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

  // Attach affinity score from the map
  const scored = baseGenres.map((g) => ({
    ...g,
    score: genreAffinity[g.genre] ?? 0,
  }));

  // Genres with >0 affinity
  const interesting = scored
    .filter((g) => g.score > 0)
    .sort((a, b) => b.score - a.score);
  
  // Top N user-affine genres
  const TOP_N = 5;
  const topGenres = interesting.slice(0, TOP_N);

  // Remaining (either low-score or zero-score), keep original order or sort as you like
  const remaining = scored.filter(
    (g) => !topGenres.some((tg) => tg.genre === g.genre)
  );

  const sortedGenres = [...topGenres, ...remaining];

  return (
    <div className='flex flex-col w-full h-full space-y-10 lg:space-y-10 py-20 halfxl:py-5 md:py-10'>
      {sortedGenres.map((genre) => (
        <GenreBooks 
          key={genre.genre} 
          title={genre.title} 
          genre={genre.genre}
          likedIds={likedIds}
          finishedIds={finishedIds}
          followedAuthorIds={followedAuthorIds}
        />
      ))}
    </div>
  )
}

export default Genre