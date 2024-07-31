import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from './navbar';


const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Horizon Server',
  description: 'Horizon | Game Servers made Scalable',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className='dark' lang="en">
      <head>
        <meta name="robots" content="noindex, nofollow" />.
      </head>
      <Navbar/>
      <body className='dark'>{children}</body>
    </html>
  );
}
