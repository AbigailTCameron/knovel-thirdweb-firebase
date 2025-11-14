import PublishPageClient from "@/components/publish/PublishPageClient";
import type { Metadata } from "next";
import React from 'react'


type Props = {}

export const metadata: Metadata = {
  title: {
    absolute: "Your published books"
  }
};


function Publish({}: Props) {
  return <PublishPageClient />
}

export default Publish