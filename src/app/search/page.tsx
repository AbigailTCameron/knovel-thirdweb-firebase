import type { Metadata } from "next";

import React from 'react'
import SearchWrapper from '@/components/search/SearchWrapper';

type SearchPageProps = {
  searchParams?: { q?: string | string[] };
};

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const rawQ = searchParams?.q;
  const q =
    typeof rawQ === "string"
      ? rawQ
      : Array.isArray(rawQ)
      ? rawQ[0]
      : "";

  const baseTitle = "Search - Knovel Protocol";

  return {
    title: {
      absolute: q ? `${q} - Knovel Protocol` : baseTitle,
    },
    description: q
      ? `Search results for "${q}" on Knovel Protocol.`
      : "Search books, authors, and community on Knovel Protocol."
  }
}

function SearchPage({}) {
  return <SearchWrapper />;
}

export default SearchPage