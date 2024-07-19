"use client";
import React, { useState } from "react";
import { HoveredLink, Menu, MenuItem, ProductItem } from "./components/ui/navbar-menu";
import { cn } from "@/app/components/lib/utils";
import './styles.css';

export function NavbarDemo() {
  return (
    <div className="relative w-full flex items-center justify-center">
      <Navbar className="top-2"/>
      <p className="text-black dark:text-white">
        The Navbar will show on top of the page
      </p>
    </div>
  );
}

function Navbar({ className }: { className?: string }) {
  const [active, setActive] = useState<string | null>(null);
  return (
    <div
      className={cn("fixed top-10 inset-x-0 max-w-2xl mx-auto z-50", className)}
    >
      <Menu setActive={setActive} className="menuBlur">
        <HoveredLink href="/">Home</HoveredLink>
        <HoveredLink href="/enterprise">Enterprise</HoveredLink>
        <MenuItem setActive={setActive} active={active} item="Subsystems">
          <div className="  text-sm grid grid-cols-2 gap-10 p-4">
          <ProductItem
              title="PebbleVault"
              href="https://github.com/Stars-Beyond/PebbleVault"
              src="https://assets.aceternity.com/demos/algochurn.webp"
              description="PebbleVault is a high-performance database with spatial indexing"
            />
            <ProductItem
              title="TerraForge"
              href="https://github.com/Stars-Beyond/TerraForge"
              src="https://assets.aceternity.com/demos/tailwindmasterkit.webp"
              description="Lightspeed terrain generation at scale"
            />
            <ProductItem
              title="RecipieSmith"
              href="https://gomoonbeam.com"
              src="https://assets.aceternity.com/demos/Screenshot+2024-02-21+at+11.51.31%E2%80%AFPM.png"
              description="Highly flexable and scalable crafting system using PebbleVault"
            />
            <ProductItem
              title="SentientCore"
              href="https://userogue.com"
              src="https://assets.aceternity.com/demos/Screenshot+2024-02-21+at+11.47.07%E2%80%AFPM.png"
              description="Highly advanced lightweight server-side AIs"
            />
            
          </div>
        </MenuItem>
        <MenuItem setActive={setActive} active={active} item="Services">
          <div className="flex flex-col space-y-4 text-sm menuBlur">
            <HoveredLink href="#web-dev">Web Development</HoveredLink>
            <HoveredLink href="#interface-design">Interface Design</HoveredLink>
            <HoveredLink href="#seo">Search Engine Optimization</HoveredLink>
            <HoveredLink href="#branding">Branding</HoveredLink>
          </div>
        </MenuItem>
      </Menu>
    </div>
  );
}

export default Navbar