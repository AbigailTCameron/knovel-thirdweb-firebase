'use client'

import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation';
import React, { Suspense, useState } from 'react'
import SearchIcon from '@/components/icons/SearchIcon';
import Back from '@/components/icons/Back';
import SearchResults from '@/components/search/SearchResults';

type Props = {}

function Search({}: Props) {
  const router = useRouter();
  const [newQuery, setNewQuery] = useState('');
  const searchParams = useSearchParams();
  const q = searchParams.get('q') || '';

  const handleSearch = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (newQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(newQuery.trim())}`);
    }
  };


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

        <Suspense fallback={<p>Loading search results...</p>}>
          <SearchResults query={q}/>
        </Suspense>
    </main>
  )
}

export default Search