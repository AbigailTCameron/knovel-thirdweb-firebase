'use client'

import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { Book } from '../../..';
import SearchIcon from '@/components/icons/SearchIcon';
import Back from '@/components/icons/Back';
import BookImageSearch from '@/components/search/BookImageSearch';
import { fetchSearchResults } from '../../../functions/explore/fetch';
import SpinLoader from '../loading/SpinLoader';

type Props = {}

function Search({}: Props) {
  const router = useRouter();
  const [newQuery, setNewQuery] = useState('');
  const searchParams = useSearchParams();
  const q = searchParams.get('q') || '';
  const [results, setResults] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);


  const handleSearch = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (newQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(newQuery.trim())}`);
    }
  };


  useEffect(() => {
    if (q) {
      setLoading(true);
      const searchBooks = async () => {
        await fetchSearchResults(q as string, setResults); 
        setLoading(false);
      };
      searchBooks();
    }
  }, [q]);

  if(loading){
    return(
      <SpinLoader />
    )
  }


  return (
    <main className="flex flex-col w-screen min-h-screen items-center text-white font-mono">
        <div className="flex relative items-center w-full justify-center my-8">
            <Link href="/explore" className="absolute left-10 text-white">
              <Back className="size-8 stroke-white" />
            </Link>

            <form onSubmit={handleSearch} className="flex w-1/2 bg-gradient-to-r from-[#6DDCFF] to-[#7F60F9] rounded-3xl p-0.5">
              <div className="w-full flex bg-black rounded-3xl items-center p-0.5 px-2">
                  <SearchIcon className="size-5 md:size-4 sm:hidden"/>
                  <input 
                    type="text"
                    value={newQuery}
                    onChange={(e) => setNewQuery(e.target.value)}
                    className="flex justify-between py-3 px-3 bg-black w-full h-full rounded-3xl focus:outline-none" 
                    placeholder="Search books, authors and community"
                  />

                  <button type="submit" className="p-2 bg-white text-black font-bold px-2 rounded-3xl">
                    Search
                  </button>
              </div>
            </form>

        </div>

        <div className="text-white text-2xl font-bold mb-4">
            <p>Search Results for "{q}"</p>
        </div>

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
    </main>
  )
}

export default Search