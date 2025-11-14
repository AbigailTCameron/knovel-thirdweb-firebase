import type { Metadata } from "next";
import ReadingListPageClient from '@/components/readinglist/ReadingListPageClient'
import React from 'react'


type Props = {}

export const metadata: Metadata = {
  title: {
    absolute: "Your reading list"
  }
};

function Readinglist({}: Props) {

  return <ReadingListPageClient />
}

export default Readinglist