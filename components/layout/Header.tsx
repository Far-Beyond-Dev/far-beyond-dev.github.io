"use client"

import React from 'react';
import { IconBrandGithub } from "@tabler/icons-react";

const MobileNavLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <a
    href={href}
    className="block px-3 py-2 text-base font-medium text-neutral-300 hover:text-white hover:bg-neutral-800 rounded-md transition-colors"
  >
    {children}
  </a>
);

export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-sm bg-black/50 border-b border-neutral-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <a href="/">
            <div className="flex items-center gap-2">
              <img src="https://github.com/Far-Beyond-Dev/Horizon-Community-Edition/blob/main/branding/horizon-server-high-resolution-logo-white-transparent.png?raw=true" className='w-52'></img>
            </div>
          </a>

          {/* Navigation Links - Desktop */}
          <div className="hidden md:flex items-center gap-8">

            <a href="/enterprise" className="text-neutral-300 hover:text-neutral-100 transition-colors">
              Enterprise
            </a>
            <a href="/community" className="text-neutral-300 hover:text-neutral-100 transition-colors">
              Community
            </a>
            <a href="/docs" className="text-neutral-300 hover:text-neutral-100 transition-colors">
              Documentation
            </a>
            <a href="https://pulsar.farbeyond.dev/" className="text-neutral-300 hover:text-neutral-100 transition-colors">
              Pulsar
            </a>
          </div>

          {/* Call to Action Buttons */}
          <div className="flex items-center gap-4">
            <a 
              href="https://github.com/Far-Beyond-Pulsar/Pulsar-Engine" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-neutral-300 hover:text-neutral-100 transition-colors"
            >
              <IconBrandGithub className="w-5 h-5" />
            </a>
            <a href='https://github.com/Far-Beyond-Dev/Horizon-Community-Edition'>
              <button className="px-4 py-2 text-sm bg-neutral-800 hover:bg-neutral-700 text-neutral-100 rounded-lg transition-all">
                Get Started
              </button>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 text-neutral-300 hover:text-neutral-100"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-black/95 backdrop-blur-lg">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <MobileNavLink href="#features">Features</MobileNavLink>
            <MobileNavLink href="#docs">Documentation</MobileNavLink>
            <MobileNavLink href="#community">Community</MobileNavLink>
            <MobileNavLink href="#blog">Blog</MobileNavLink>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Header;