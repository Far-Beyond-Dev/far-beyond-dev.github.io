'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface Doc {
  slug: string;
  title: string;
}

interface DocsListProps {
  docs: Doc[];
}

export function DocsList({ docs }: DocsListProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredDocs = docs.filter(doc =>
    doc.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <input
        type="text"
        placeholder="Search docs..."
        className="w-1/2 p-2 mb-4 mx-96 border rounded"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <ul className="space-y-2 min-h-screen">
        {filteredDocs.map((doc) => (
          <li key={doc.slug}>
            <Link href={`/docs/${doc.slug}`} className="text-blue-500 hover:underline">
              {doc.title}
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}