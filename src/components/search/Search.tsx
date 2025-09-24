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
import SearchResults from './SearchResults';

type Props = {}

function Search({}: Props) {
  const router = useRouter();
  const [newQuery, setNewQuery] = useState('');
  const searchParams = useSearchParams();
  const q = searchParams.get('q') || '';
  const [results, setResults] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);


  const handleSearch = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (newQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(newQuery.trim())}`);
    }
  };

  const quickSearch = async() => {
    await fetchSearchResults(newQuery, setSearchResults);
  }

  useEffect(() => {
    if (newQuery) {
      quickSearch(); 
    } else {
      setSearchResults([]); 
    }
  }, [newQuery]);


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


  return (
    <main className="flex flex-col w-screen min-h-screen items-center text-white font-mono">
        <div className="flex relative items-center w-full justify-center my-8">
            <Link href="/explore" className="absolute left-10 text-white">
              <Back className="size-8 stroke-white" />
            </Link>
            
            <div className="relative w-1/2 items-center">
                <form onSubmit={handleSearch} className="flex w-full bg-[#272831] rounded-3xl p-0.5">
                  <div className="w-full flex bg-[#272831] rounded-3xl items-center px-2">
                      <SearchIcon className="size-5 md:size-4 sm:hidden stroke-[#7c7a85]"/>

                      <input 
                        type="text"
                        value={newQuery}
                        onChange={(e) => setNewQuery(e.target.value)}
                        className="flex justify-between py-2 bg-[#272831] px-3 w-full h-full rounded-3xl focus:outline-none" 
                        placeholder="Search books, authors and community"
                      />

                      <button type="submit" className="py-2 text-black font-bold px-2 rounded-3xl border-l border-[#7c7a85]">
                        <SearchIcon className="size-5 md:size-4 sm:hidden stroke-white"/>
                      </button>
                  </div>
                </form>

                {searchResults.length > 0 && (
                  <div className="absolute top-full w-full rounded-xl shadow-md bg-[#1d242e] mt-2">
                    <SearchResults results={searchResults}/>
                  </div>
                )}
            </div>


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

      {/* ✅ Overlay with blur effect */}
            {loading && (
        <div className="absolute flex-col inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-black/40">
          <SpinLoader />
          <p className="text-lg text-white font-semibold">Searching...</p>
        </div>
      )}

    </main>
  )
}

export default Search