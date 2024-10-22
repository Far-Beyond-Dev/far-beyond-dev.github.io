'use client';

import React from 'react';
import Link from 'next/link';

interface TocItem {
  level: number;
  title: string;
}

interface TableOfContentsProps {
  toc: TocItem[];
}

export function TableOfContents({ toc }: TableOfContentsProps) {
  return (
    <nav className="toc">
      <h2 className="text-xl font-bold mb-2">Table of Contents</h2>
      <ul className="space-y-1">
        {toc.map((heading, index) => (
          <li key={index} style={{ marginLeft: `${(heading.level - 1) * 0.5}rem` }}>
            <Link href={`#${heading.title.toLowerCase().replace(/\s+/g, '-')}`} className="text-blue-500 hover:underline">
              {heading.title}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}