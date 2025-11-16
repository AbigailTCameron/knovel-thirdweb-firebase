import type { Metadata } from "next";
import React from 'react'
import ExplorePageClient from "@/components/explore/ExplorePageClient";


export const metadata: Metadata = {
  title: {
    absolute: "Explore"
  },
  description: "Explore our catalogue of books."
};

function page({}) {

  return <ExplorePageClient />
}

export default page