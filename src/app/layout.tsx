'use client';

// import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { useEffect, useState } from 'react';

import Link from 'next/link';

import { ApolloWrapper } from './lib/Apollo Wrapper';

// import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

// const client = new ApolloClient({
//   uri: 'https://rickandmortyapi.com/graphql',
//   cache: new InMemoryCache(),
// });

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

// export const metadata: Metadata = {
//   title: 'Tinder Date - Rick and Morty',
//   description: 'Tinder like App with Rick and Morty characters',
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [favourites, setFavourites] = useState(0);
  useEffect(() => {
    //TODO: make it global + add anim + add load more and pages layout
    const favArr = localStorage.getItem('favourites')
      ? JSON.parse(localStorage.getItem('favourites'))
      : [];
    setFavourites(favArr.length);
  }, []);
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="wrapper min-h-screen w-full h-screen p-8 gap-16 sm:p-10">
          <header className="flex justify-between w-full mb-10">
            <Link href="/">Home</Link>
            <Link href="/liked">Liked ({favourites})</Link>
            <Link href="/matched">Matched</Link>
          </header>
          <ApolloWrapper>{children}</ApolloWrapper>
        </div>
      </body>
    </html>
  );
}
