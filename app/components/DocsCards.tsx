"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useOutsideClick } from "@/hooks/use-outside-click";
import { marked } from "marked";
import Link from "next/link";
import Image from "next/image";

interface DocFile {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  firstImage?: string;
}

function parseFileContent(content: string): DocFile {
  const [, frontMatter, markdownContent] = content.split('---');
  const metadata = Object.fromEntries(
    frontMatter.trim().split('\n').map(line => line.split(': '))
  );

  const firstParagraph = markdownContent.trim().split('\n\n')[0];

  return {
    slug: '', // You'll need to set this elsewhere
    title: metadata.title || '',
    excerpt: metadata.excerpt || '',
    content: markdownContent.trim(),
    firstImage: metadata.image || undefined
  };
}

export function DocsCards({ docs }: { docs: DocFile[] }) {
  const [active, setActive] = useState<DocFile | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const id = useId();

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActive(null);
      }
    }

    if (active) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active]);

  useOutsideClick(ref, () => setActive(null));

  const filteredDocs = docs.filter((doc) =>
    doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderExcerpt = (content: string) => {
    const firstParagraph = content.split('\n\n')[0];
    return marked(firstParagraph);
  };

  return (
    <>
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search documentation..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 border border-gray-300 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 h-full w-full z-10"
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {active && (
          <div className="fixed inset-0 grid place-items-center z-[100]">
            <motion.button
              key={`button-${active.slug}-${id}`}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.05 } }}
              className="flex absolute top-2 right-2 lg:hidden items-center justify-center bg-white rounded-full h-6 w-6"
              onClick={() => setActive(null)}
            >
              <CloseIcon />
            </motion.button>
            <motion.div
              layoutId={`card-${active.slug}-${id}`}
              ref={ref}
              className="w-full max-w-[800px] h-fit max-h-[90%] flex flex-col bg-white dark:bg-neutral-900 sm:rounded-3xl overflow-hidden"
            >
              {active.firstImage && (
                <motion.div layoutId={`image-${active.slug}-${id}`} className="w-full h-60 relative">
                  <Image
                    src={active.firstImage}
                    alt={active.title}
                    layout="fill"
                    objectFit="cover"
                  />
                </motion.div>
              )}
              <div className="p-6 overflow-y-auto">
                <motion.h2
                  layoutId={`title-${active.slug}-${id}`}
                  className="text-2xl font-bold text-neutral-800 dark:text-neutral-100 mb-4"
                >
                  {active.title}
                </motion.h2>
                <motion.div
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="prose dark:prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: renderExcerpt(active.content) }}
                />
                <div className="mt-4 flex justify-between items-center">
                  <Link href={`/docs/${active.slug}`} className="inline-block text-blue-500 hover:underline">
                    Read full article
                  </Link>
                  <a href="https://discord.gg/your-discord-invite-link" target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600">
                    Join Discord
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <ul className="w-full space-y-4">
        {filteredDocs.map((doc) => (
          <motion.div
            layoutId={`card-${doc.slug}-${id}`}
            key={`card-${doc.slug}-${id}`}
            onClick={() => setActive(doc)}
            className="p-4 flex flex-col md:flex-row justify-between items-center hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-xl cursor-pointer"
          >
            <div className="flex-grow">
              <motion.h3
                layoutId={`title-${doc.slug}-${id}`}
                className="font-medium text-lg text-neutral-800 dark:text-neutral-200 text-left"
              >
                {doc.title}
              </motion.h3>
              <motion.p
                layoutId={`excerpt-${doc.slug}-${id}`}
                className="text-neutral-600 dark:text-neutral-400 text-left"
              >
                {doc.excerpt}
              </motion.p>
            </div>
            <Link 
              href={`/docs/${doc.slug}`}
              className="px-4 py-2 text-sm rounded-full font-bold bg-gray-100 hover:bg-blue-500 hover:text-white text-black mt-4 md:mt-0 ml-4"
              onClick={(e) => e.stopPropagation()}
            >
              Read More
            </Link>
          </motion.div>
        ))}
      </ul>
    </>
  );
}

const CloseIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4 text-black"
    >
      <path d="M18 6L6 18" />
      <path d="M6 6l12 12" />
    </svg>
  );
};