import React from 'react';
import Link from 'next/link';

interface TocItem {
  level: number;
  title: string;
  id: string;
}

interface TableOfContentsProps {
  toc: TocItem[];
}

export function TableOfContents({ toc }: TableOfContentsProps) {
  return (
    <nav className="toc">
      <h2 className="text-xl font-bold mb-4 text-white">Table of Contents</h2>
      <ul className="space-y-2">
        {toc.map((item, index) => (
          <li
            key={index}
            className={`${getIndentClass(item.level)}`}
          >
            <Link 
              href={`#${item.id}`}
              className="text-white no-underline hover:text-blue-300 transition-colors duration-200"
            >
              {item.title}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function getIndentClass(level: number): string {
  return `ml-${(level - 1) * 4}`;
}