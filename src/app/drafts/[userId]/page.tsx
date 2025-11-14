import type { Metadata } from "next";
import DraftsPageClient from '@/components/drafts/DraftsPageClient'
import React from 'react'


export const metadata: Metadata = {
  title: {
    absolute: "Your drafts"
  }
};

function UserDrafts({}) {
  return <DraftsPageClient />
}

export default UserDrafts