import type { Metadata } from "next";
import React from 'react'
import CreatePageClient from '@/components/create/CreatePageClient';


export const metadata: Metadata = {
  title: {
    absolute: "Create"
  }
};
function Create({}) {
 
  return <CreatePageClient />
}

export default Create