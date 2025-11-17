import type { Metadata } from "next";
import React from 'react';
import CollectionPageClient from '@/components/collection/CollectionPageClient';

export const metadata: Metadata = {
  title: {
    absolute: "Collection",
  },
  description: "Exclusive collectibles our readers will treasure",
  openGraph: {
    title: "Collection",
    description: "exclusive collectibles our readers will treasure",
    images: [
      {
        url: "/gold-medallion.png",
        width: 630,
        height: 630,
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Knovel Protocol",
    description: "A social, self-publishing platform powered by the blockchain.",
    images: ["/gold-medallion.png"],
  }
};
function Collection({}) {
  return <CollectionPageClient />
}

export default Collection