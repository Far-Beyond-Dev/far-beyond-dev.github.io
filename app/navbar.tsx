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
              src="https://upload.wikimedia.org/wikipedia/commons/7/71/Black.png"
              description="PebbleVault is a high-performance database with spatial indexing"
            />
            <ProductItem
              title="TerraForge"
              href="https://github.com/Stars-Beyond/TerraForge"
              src="https://upload.wikimedia.org/wikipedia/commons/7/71/Black.png"
              description="Lightspeed terrain generation at scale"
            />
            <ProductItem
              title="RecipieSmith (WIP)"
              href="https://github.com/Far-Beyond-Dev/RecipeSmith"
              src="https://upload.wikimedia.org/wikipedia/commons/7/71/Black.png"
              description="Highly flexable and scalable crafting system using PebbleVault"
            />
            <ProductItem
              title="SentientCore (TODO)"
              href="https://github.com/Far-Beyond-Dev/Horizon-Community-Edition/issues/48"
              src="https://upload.wikimedia.org/wikipedia/commons/7/71/Black.png"
              description="Highly advanced lightweight server-side AIs"
            />
            
          </div>
        </MenuItem>
        <HoveredLink href="./metal">Metal</HoveredLink>
      </Menu>
    </div>
  );
}

export default Navbar