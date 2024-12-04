'use client';

import localFont from "next/font/local";
import { Header, Footer } from "@/components/layout";
import "./globals.css";
import { useEffect, useState } from "react";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

// Snow effect component
const Snowflake = ({ style }: { style: React.CSSProperties }) => (
  <div
    className="fixed pointer-events-none text-slate-200 opacity-60"
    style={style}
  >
    •
  </div>
);

const Snow = () => {
  const [snowflakes, setSnowflakes] = useState<Array<{ id: number; style: React.CSSProperties }>>([]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Generate initial snowflakes
    const initialSnowflakes = Array.from({ length: 50 }, (_, i) => createSnowflake(i));
    setSnowflakes(initialSnowflakes);

    // Add new snowflakes periodically
    const interval = setInterval(() => {
      setSnowflakes(prev => {
        const filtered = prev.filter(flake => 
          parseFloat(String(flake.style.top)) < window.innerHeight
        );
        return [...filtered, createSnowflake(Date.now())];
      });
    }, 300);

    return () => clearInterval(interval);
  }, []);

  function createSnowflake(id: number) {
    const initialX = Math.random() * 100;
    const size = Math.random() * 0.5 + 0.5;
    
    return {
      id,
      style: {
        left: `${initialX}vw`,
        top: '-5px',
        transform: 'translate(-50%, -50%)',
        fontSize: `${size}rem`,
        animation: `fall ${Math.random() * 3 + 2}s linear forwards`,
        transition: 'top 2s linear'
      }
    };
  }

  return (
    <>
      <style jsx global>{`
        @keyframes fall {
          to {
            top: 105vh;
          }
        }
      `}</style>
      {snowflakes.map(flake => (
        <Snowflake key={flake.id} style={flake.style} />
      ))}
    </>
  );
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): React.ReactNode {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased relative overflow-x-hidden`}
      >
        <div className="fixed inset-0 pointer-events-none z-50">
          <Snow />
        </div>
        <Snow />
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}