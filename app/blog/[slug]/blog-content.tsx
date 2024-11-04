"use client"

import { useEffect, useState } from 'react'
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote'
import { serialize } from 'next-mdx-remote/serialize'
import rehypePrism from 'rehype-prism-plus'
import remarkGfm from 'remark-gfm'
import { notFound } from 'next/navigation'
import { Clock, User } from 'lucide-react'
import { type BlogPost } from '@/lib/blog-data'

interface BlogContentProps {
  initialPost: BlogPost
  slug: string
}

export default function BlogContent({ initialPost, slug }: BlogContentProps) {
  const [mdxSource, setMdxSource] = useState<MDXRemoteSerializeResult | null>(null)
  const [post] = useState<BlogPost | null>(initialPost)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadPost() {
      try {
        const response = await fetch(`/blogs/${slug}.md`)
        if (!response.ok) {
          throw new Error('Blog post not found')
        }
        
        const text = await response.text()
        const mdxSource = await serialize(text, {
          mdxOptions: {
            remarkPlugins: [remarkGfm],
            rehypePlugins: [rehypePrism],
          }
        })
        
        setMdxSource(mdxSource)
      } catch (error) {
        console.error('Failed to load blog post:', error)
        notFound()
      } finally {
        setIsLoading(false)
      }
    }

    loadPost()
  }, [slug])

  if (isLoading) {
    return <BlogSkeleton />
  }

  if (!post || !mdxSource) {
    return notFound()
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
      <p className={`${className} my-4 leading-7`} {...props} />
    ),
    ul: ({ className, ...props }: React.HTMLAttributes<HTMLUListElement>) => (
      <ul className={`${className} list-disc list-inside my-4 space-y-2`} {...props} />
    ),
    ol: ({ className, ...props }: React.HTMLAttributes<HTMLOListElement>) => (
      <ol className={`${className} list-decimal list-inside my-4 space-y-2`} {...props} />
    ),
    li: ({ className, ...props }: React.HTMLAttributes<HTMLLIElement>) => (
      <li className={`${className} ml-4`} {...props} />
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
          <h1 className="text-4xl font-bold text-neutral-100 mb-4">
            {post.title}
          </h1>
          
          <div className="flex items-center gap-6 mb-6 text-neutral-400">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>{post.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{post.readingTime} min read</span>
            </div>
            <time>
              {new Date(post.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </time>
          </div>
          
          <div className="flex gap-2 flex-wrap mb-4">
            {post.categories.map(category => (
              <span 
                key={category}
                className="px-3 py-1 text-sm rounded-full bg-blue-500/10 text-blue-400"
              >
                {category}
              </span>
            ))}
          </div>
          
          <p className="text-lg text-neutral-400">
            {post.excerpt}
          </p>
        </div>

        <div className="prose prose-invert prose-neutral max-w-none">
            <MDXRemote {...mdxSource} components={components} />
        </div>
      </div>
    </div>
  )
}

function BlogSkeleton() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="animate-pulse">
          <div className="h-10 w-2/3 bg-neutral-800 rounded mb-4" />
          <div className="flex gap-4 mb-6">
            <div className="h-5 w-32 bg-neutral-800 rounded" />
            <div className="h-5 w-24 bg-neutral-800 rounded" />
            <div className="h-5 w-32 bg-neutral-800 rounded" />
          </div>
          <div className="flex gap-2 mb-4">
            <div className="h-6 w-20 bg-neutral-800 rounded-full" />
            <div className="h-6 w-24 bg-neutral-800 rounded-full" />
          </div>
          <div className="h-6 w-2/3 bg-neutral-800 rounded mb-8" />
          <div className="space-y-4">
            <div className="h-4 bg-neutral-800 rounded w-full" />
            <div className="h-4 bg-neutral-800 rounded w-5/6" />
            <div className="h-4 bg-neutral-800 rounded w-4/6" />
          </div>
        </div>
      </div>
    </div>
  )
}