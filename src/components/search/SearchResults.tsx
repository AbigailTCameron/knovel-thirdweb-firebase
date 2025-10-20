import { useRouter } from 'next/navigation'
import React from 'react'

type Props = {
  results?: any[]
}

function SearchResults({results}: Props) {
  const router = useRouter(); 

  return (
    <div className="flex flex-col w-full h-full space-y-1 py-2 text-white max-h-[50vh] overflow-y-auto">
      {results?.map((result) => (
        <div 
          onMouseEnter={() => router.prefetch(`/book/${result.id}`)}
          key={result.id} 
          onClick={() => router.push(`/book/${result.id}`)} 
          className="flex hover:bg-black hover:cursor-pointer px-2 py-1">
          <p className="text-lg">{result.title}</p>
        </div>
      ))}
    </div>
  )
}

export default SearchResults