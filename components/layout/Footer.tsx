import React from 'react';
import SocialLinks from './SocialLinks';
import { Heart } from 'lucide-react'

const FooterLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <a href={href} className="text-neutral-400 hover:text-neutral-100 transition-colors">
    {children}
  </a>
);

const FooterSection = ({ 
  title, 
  links 
}: { 
  title: string; 
  links: Array<{ href: string; label: string; }> 
}) => (
  <div>
    <h3 className="text-neutral-100 font-semibold mb-4">{title}</h3>
    <ul className="space-y-3">
      {links.map(({ href, label }) => (
        <li key={href}>
          <FooterLink href={href}>{label}</FooterLink>
        </li>
      ))}
    </ul>
  </div>
);

export const Footer = () => {
  return (
    <footer className="border-t border-neutral-800 pt-16 pb-8">
      <div className="container mx-auto px-4">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <img src="https://github.com/Far-Beyond-Dev/Horizon-Community-Edition/blob/main/branding/horizon-server-high-resolution-logo-white-transparent.png?raw=true" className='w-60'></img>
            </div>
            <p className="text-sm text-neutral-400 pr-4">
              The game server of the future! Scale your servers as far as you want easily!
            </p>
            <SocialLinks />
          </div>
      
          {/* Resources Section */}
          <FooterSection 
            title="Resources" 
            links={[
              { href: "/docs", label: "Documentation" },
              { href: "/learn", label: "Learn" },
              { href: "/examples", label: "Examples" },
              { href: "/showcase", label: "Showcase" },
              { href: "/blog", label: "Blog" }
            ]} 
          />
      
          {/* Community Section */}
          <FooterSection 
            title="Community" 
            links={[
              { href: "https://discord.gg/NM4awJWGWu", label: "Discord Server" },
              { href: "https://github.com/orgs/Far-Beyond-Dev/discussions", label: "GitHub Discussions" },
              { href: "https://github.com/Far-Beyond-Dev/Horizon-Community-Edition/compare", label: "Contribute" },
              { href: "https://github.com/orgs/Far-Beyond-Dev/projects/8", label: "Roadmap" },
              { href: "https://github.com/Far-Beyond-Dev/Horizon-Community-Edition/releases", label: "Release Notes" }
            ]} 
          />
      
          {/* Company Section */}
          <FooterSection 
            title="Company (Links coming soon!)" 
            links={[
              { href: "#about", label: "About" },
              { href: "#careers", label: "Careers" },
              { href: "#privacy", label: "Privacy Policy" },
              { href: "#terms", label: "Terms of Service" },
              { href: "#contact", label: "Contact" }
            ]} 
          />
        </div>
      
        {/* Bottom Bar */}
        <div className="pt-8 mt-8 border-t border-neutral-800">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-neutral-400 text-sm">
              © 2024 Pulsar Engine. All rights reserved.
            </div>
            <FooterLove></FooterLove>
            <div className="flex gap-6 text-sm">
              <FooterLink href="https://www.githubstatus.com/">Status</FooterLink>
              <span className="text-neutral-700">•</span>
              <FooterLink href="https://github.com/Far-Beyond-Dev/Horizon-Community-Edition/issues">Support</FooterLink>
              <span className="text-neutral-700">•</span>
              <FooterLink href="https://github.com/Far-Beyond-Dev/Horizon-Community-Edition/security">Security</FooterLink>
            </div>
          </div>
        </div>
      </div>
  </footer>
  );
};

const FooterLove = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 text-center text-gray-400">
      <p>Made with <Heart className="w-4 h-4 inline-block text-red-500" /> by the Horizon community</p>
    </div>
  )
}


export default Footer;