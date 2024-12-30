import React, { Suspense } from 'react'
import Search from './Search'

type Props = {}

function SearchWrapper({}: Props) {
  return (
    <Suspense fallback={<p>Loading search results...</p>}>
      <Search />
    </Suspense>
  )
}

export default SearchWrapper