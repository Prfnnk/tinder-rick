'use client';

import localFont from 'next/font/local';
import './globals.css';

import Link from 'next/link';

import { ApolloWrapper } from './lib/Apollo Wrapper';

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
        <div className="wrapper min-h-screen w-full p-8 gap-16 sm:p-10">
          <header className="flex justify-between w-full mb-10">
            <Link href="/">Home</Link>
            <Link href="/liked">Liked</Link>
          </header>
          <ApolloWrapper>{children}</ApolloWrapper>
        </div>
      </body>
    </html>
  );
}
