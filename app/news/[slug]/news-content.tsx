'use client'

import { useEffect, useState } from 'react'
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote'
import { serialize } from 'next-mdx-remote/serialize'
import rehypePrism from 'rehype-prism-plus'
import remarkGfm from 'remark-gfm'
import { notFound } from 'next/navigation'
import { Clock, Calendar } from 'lucide-react'

interface NewsMetadata {
  id: string
  slug: string
  title: string
  date: string
  category: 'release' | 'update' | 'announcement' | 'security' | 'community'
  content: string
  highlights: string[]
  impactLevel: 'major' | 'moderate' | 'minor'
  markdownContent?: string
}

interface NewsContentProps {
  initialNews: NewsMetadata
  slug: string
}

export default function NewsContent({ initialNews, slug }: NewsContentProps) {
  const [mdxSource, setMdxSource] = useState<MDXRemoteSerializeResult | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function processMarkdown() {
      try {
        if (initialNews.markdownContent) {
          const source = await serialize(initialNews.markdownContent, {
            mdxOptions: {
              remarkPlugins: [remarkGfm],
              rehypePlugins: [rehypePrism],
            }
          })
          setMdxSource(source)
        }
      } catch (error) {
        console.error('Failed to process markdown:', error)
      } finally {
        setIsLoading(false)
      }
    }

    processMarkdown()
  }, [initialNews.markdownContent])

  if (isLoading) {
    return <NewsSkeleton />
  }

  const components = {
    pre: ({ className, ...props }: React.HTMLAttributes<HTMLPreElement>) => (
      <pre className={`${className} p-4 rounded-lg bg-neutral-950 overflow-x-auto`} {...props} />
    ),
    code: ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => (
      <code className={`${className} px-1 py-0.5 rounded-md text-orange-400 bg-neutral-950`} {...props} />
    ),
    h1: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h1 className={`${className} text-3xl font-bold mt-8 mb-4`} {...props} />
    ),
    h2: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h2 className={`${className} text-2xl font-semibold mt-6 mb-3`} {...props} />
    ),
    h3: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h3 className={`${className} text-xl font-semibold mt-4 mb-2`} {...props} />
    ),
    p: ({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
      <p className={`${className} my-4 leading-7 text-neutral-300`} {...props} />
    ),
    ul: ({ className, ...props }: React.HTMLAttributes<HTMLUListElement>) => (
      <ul className={`${className} list-disc list-inside my-4 space-y-2`} {...props} />
    ),
    ol: ({ className, ...props }: React.HTMLAttributes<HTMLOListElement>) => (
      <ol className={`${className} list-decimal list-inside my-4 space-y-2`} {...props} />
    ),
    li: ({ className, ...props }: React.HTMLAttributes<HTMLLIElement>) => (
      <li className={`${className} ml-4 text-neutral-300`} {...props} />
    ),
    a: ({ className, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
      <a className={`${className} text-blue-400 hover:text-blue-300 underline`} {...props} />
    ),
    blockquote: ({ className, ...props }: React.HTMLAttributes<HTMLQuoteElement>) => (
      <blockquote className={`${className} border-l-4 border-neutral-700 pl-4 my-4 italic`} {...props} />
    ),
    table: ({ className, ...props }: React.TableHTMLAttributes<HTMLTableElement>) => (
      <div className="overflow-x-auto my-4">
        <table className={`${className} min-w-full border-collapse`} {...props} />
      </div>
    ),
    th: ({ className, ...props }: React.ThHTMLAttributes<HTMLTableHeaderCellElement>) => (
      <th className={`${className} border border-neutral-800 px-4 py-2 bg-neutral-900`} {...props} />
    ),
    td: ({ className, ...props }: React.TdHTMLAttributes<HTMLTableDataCellElement>) => (
      <td className={`${className} border border-neutral-800 px-4 py-2`} {...props} />
    ),
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-8">
          {/* Header */}
          <div className="flex flex-col gap-4 mb-8">
            <div className="flex items-center gap-4">
              <span className="px-3 py-1 rounded-full text-sm bg-neutral-800 text-neutral-300 capitalize">
                {initialNews.category}
              </span>
              <ImpactBadge impact={initialNews.impactLevel} />
            </div>
            
            <h1 className="text-4xl font-bold text-neutral-100">
              {initialNews.title}
            </h1>

            <div className="flex items-center gap-4 text-neutral-400">
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {new Date(initialNews.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>
          </div>

          {/* Content Preview */}
          <p className="text-lg text-neutral-400 mb-8">
            {initialNews.content}
          </p>

          {/* Highlights */}
          {initialNews.highlights.length > 0 && (
            <div className="mb-8 p-6 rounded-lg bg-neutral-900/50 border border-neutral-800">
              <h3 className="text-lg font-semibold mb-4">Highlights</h3>
              <ul className="space-y-2">
                {initialNews.highlights.map((highlight, index) => (
                  <li key={index} className="flex items-start gap-2 text-neutral-300">
                    <span className="text-blue-500">•</span>
                    {highlight}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Main Content */}
        {mdxSource && (
          <div className="prose prose-invert prose-neutral max-w-none">
            <article className="p-6 rounded-lg bg-neutral-900/50 border border-neutral-800">
              <MDXRemote {...mdxSource} components={components} />
            </article>
          </div>
        )}
      </div>
    </div>
  )
}

function ImpactBadge({ impact }: { impact: 'major' | 'moderate' | 'minor' }) {
  const colors = {
    major: "bg-purple-500/10 text-purple-500 border-purple-500/20",
    moderate: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    minor: "bg-green-500/10 text-green-500 border-green-500/20"
  } as const
  
  return (
    <span className={`px-2 py-1 text-xs rounded-md border ${colors[impact]}`}>
      {impact}
    </span>
  )
}

function NewsSkeleton() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="animate-pulse">
          <div className="flex gap-2 mb-4">
            <div className="h-6 w-24 bg-neutral-800 rounded-full" />
            <div className="h-6 w-24 bg-neutral-800 rounded-full" />
          </div>
          <div className="h-10 w-2/3 bg-neutral-800 rounded mb-4" />
          <div className="h-6 w-48 bg-neutral-800 rounded mb-8" />
          <div className="h-20 w-full bg-neutral-800 rounded mb-8" />
          <div className="p-6 bg-neutral-900/50 border border-neutral-800 rounded-lg mb-8">
            <div className="h-6 w-32 bg-neutral-800 rounded mb-4" />
            <div className="space-y-2">
              <div className="h-4 bg-neutral-800 rounded w-full" />
              <div className="h-4 bg-neutral-800 rounded w-5/6" />
              <div className="h-4 bg-neutral-800 rounded w-4/6" />
            </div>
          </div>
          <div className="p-6 bg-neutral-900/50 border border-neutral-800 rounded-lg">
            <div className="space-y-4">
              <div className="h-4 bg-neutral-800 rounded w-full" />
              <div className="h-4 bg-neutral-800 rounded w-5/6" />
              <div className="h-4 bg-neutral-800 rounded w-4/6" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}