import PublishPageClient from "@/components/publish/PublishPageClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    absolute: "Your published books"
  }
};


function Publish({}) {
  return <PublishPageClient />
}

export default Publish