"use client";
import React, { useState } from "react";
import { HoveredLink, Menu, MenuItem, ProductItem } from "./ui/navbar-menu";
import { cn } from "@/lib/utils";
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
        <MenuItem setActive={setActive} active={active} item="Services">
          <div className="flex flex-col space-y-4 text-sm menuBlur">
            <HoveredLink href="#web-dev">Web Development</HoveredLink>
            <HoveredLink href="#interface-design">Interface Design</HoveredLink>
            <HoveredLink href="#seo">Search Engine Optimization</HoveredLink>
            <HoveredLink href="#branding">Branding</HoveredLink>
          </div>
        </MenuItem>
        <MenuItem setActive={setActive} active={active} item="Pricing">
          <div className="flex flex-col space-y-4 text-sm menuBlur">
            <HoveredLink href="#hobby">Hobby</HoveredLink>
            <HoveredLink href="#individual">Individual</HoveredLink>
            <HoveredLink href="#team">Team</HoveredLink>
            <HoveredLink href="#enterprise">Enterprise</HoveredLink>
          </div>
        </MenuItem>
      </Menu>
    </div>
  );
}

export default Navbar