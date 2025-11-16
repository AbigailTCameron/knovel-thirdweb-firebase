import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThirdwebProvider } from "thirdweb/react";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Knovel Protocol",
    template: "%s - Knovel Protocol"
  },
  description: "A social, self-publishing, platform powered by the blockchain.",
  keywords:["knovel", "web3 publishing", "on-chain books", "self-publishing", "blockchain books"],
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Knovel Protocol",
    title: "Knovel Protocol",
    description: "A social, self-publishing platform powered by the blockchain.",
    images: [
      {
        url: "/opengraph-image.png",
         width: 1200,
        height: 630,
        alt: "Knovel Protocol – A social, self-publishing platform powered by the blockchain."
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Knovel Protocol",
    description: "A social, self-publishing platform powered by the blockchain.",
    images: ["/opengraph-image.png"],
  }
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThirdwebProvider>
         {children} 
        </ThirdwebProvider>
        
      </body>
    </html>
  );
}
