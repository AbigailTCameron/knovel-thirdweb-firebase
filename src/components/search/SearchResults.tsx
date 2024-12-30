import React, { useEffect, useState } from 'react'
import { Book } from '../../..';
import { useRouter } from 'next/navigation';
import BookImageSearch from './BookImageSearch';
import { fetchSearchResults } from '../../../functions/explore/fetch';

type Props = {
  query : string;
}

function SearchResults({query}: Props) {
  const router = useRouter();
  const [results, setResults] = useState<Book[]>([]);

  useEffect(() => {
    if (query) {
      const searchBooks = async () => {
        await fetchSearchResults(query, setResults); 
      };
      searchBooks();
    }
  }, [query]);

  return (
    <div className="text-white px-4 xl:px-2">
    {results.length > 0 ? (
        <div className="grid grid-cols-5 2xl:grid-cols-4 halflg:grid-cols-3 sm:grid-cols-2 ss:grid-cols-1 ss:gap-8 gap-4 halflg:gap-2">
            {results.map((result) => (
              <div onClick={() => router.push(`/book/${result.id}`)} key={result.id} className="w-fit h-fit hover:cursor-pointer">
                <BookImageSearch imageFile={result?.book_image}/>
              </div>
            ))}
        </div>
    ) : (
      <p>No results found</p>
    )}
</div>
  )
}

export default SearchResults