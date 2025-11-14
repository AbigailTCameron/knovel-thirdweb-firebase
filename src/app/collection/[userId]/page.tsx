import type { Metadata } from "next";
import React from 'react';
import CollectionPageClient from '@/components/collection/CollectionPageClient';

export const metadata: Metadata = {
  title: {
    absolute: "Collection"
  }
};
function Collection({}) {
  return <CollectionPageClient />
}

export default Collection