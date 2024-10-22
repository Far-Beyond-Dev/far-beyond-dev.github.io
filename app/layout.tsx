import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from './navbar';
import Link from 'next/link';

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
      <footer className="bg-black text-white py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="flex items-start space-x-4">
          <img 
            src="https://avatars.githubusercontent.com/u/169021527" 
            alt="Horizon Logo" 
            className="w-16 h-16 rounded-full"
          />
          <div>
            <h3 className="text-lg font-semibold mb-1">About Horizon</h3>
            <h4 className="text-sm mb-4 text-gray-500 dark:text-gray-400">A Far Beyond Project</h4>
            <p className="text-gray-400 text-sm">
              Cutting-edge game server software for seamless multiplayer experiences.
            </p>
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2">
            {/* <li><Link href="/features" className="text-gray-400 hover:text-blue-400 transition-colors">Features</Link></li> */}
            {/* <li><Link href="/pricing" className="text-gray-400 hover:text-blue-400 transition-colors">Pricing</Link></li> */}
            <li><Link href="https://github.com/Far-Beyond-Dev/Horizon-Community-Edition/wiki" className="text-gray-400 hover:text-blue-400 transition-colors">Documentation</Link></li>
            <li><Link href="https://stars-beyond.com/blog/" className="text-gray-400 hover:text-blue-400 transition-colors">Blog</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-4">Community</h3>
          <ul className="space-y-2">
            <li><a href="https://github.com/Far-Beyond-Dev" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-400 transition-colors">GitHub</a></li>
            <li><a href="https://discord.gg/NM4awJWGWu" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-400 transition-colors">Discord</a></li>
            <li><a href="https://x.com/farbeyondstudio" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-400 transition-colors">Twitter</a></li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-4">Contact</h3>
          <p className="text-gray-400 text-sm mb-2">Email: support@stars-beyond.com</p>
          {/* <p className="text-gray-400 text-sm">Phone: +1 (123) 456-7890</p> */}
        </div>
      </div>
      <div className="border-t border-gray-800 mt-8 pt-8 text-center">
        <p className="text-gray-400 text-sm">
          © {new Date().getFullYear()} Far Beyond LLC. All rights reserved.
        </p>
      </div>
    </div>
    </footer>
    </html>
  );
}
