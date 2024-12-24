'use client'

import { useEffect, useState, memo } from 'react'
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote'
import { serialize } from 'next-mdx-remote/serialize'
import remarkGfm from 'remark-gfm'
import { notFound } from 'next/navigation'
import { usePathname } from 'next/navigation'

// Types
type StabilityType = 'stable' | 'in-dev' | 'experimental'

interface DocMetadata {
  title: string
  image?: string
  tags: string[]
  stability: StabilityType
  excerpt: string
}

interface DocContentProps {
  initialDoc: {
    title: string
    excerpt: string
    stability: StabilityType
    tags: string[]
    slug: string
  }
  slug: string
}

interface PrismWindow extends Window {
  Prism: {
    highlightAll: () => void
    manual: boolean
  }
}

declare global {
  interface Window extends PrismWindow {}
}

// Components
const LoadingSpinner = () => (
  <div className="flex justify-center items-center py-8">
    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
  </div>
)

const StabilityBadge = memo(({ stability }: { stability: StabilityType }) => {
  const colors = {
    stable: "bg-green-500/10 text-green-500 border-green-500/20",
    "in-dev": "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    experimental: "bg-red-500/10 text-red-500 border-red-500/20"
  } as const

  return (
    <span className={`px-2 py-1 text-xs rounded-md border ${colors[stability]}`}>
      {stability}
    </span>
  )
})

// Main Component
export default function DocContent({ initialDoc, slug }: DocContentProps) {
  const [mdxSource, setMdxSource] = useState<MDXRemoteSerializeResult | null>(null)
  const [metadata, setMetadata] = useState<DocMetadata | null>(initialDoc)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Highlight code when content changes
  useEffect(() => {
    if (mdxSource && window.Prism) {
      try {
        window.Prism.highlightAll()
      } catch (error) {
        console.error('Failed to highlight code:', error)
      }
    }
  }, [mdxSource])

  // Load document content
  useEffect(() => {
    const loadDoc = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const response = await fetch(`/docs/${slug}.md`)
        if (!response.ok) {
          throw new Error(
            response.status === 404 
              ? 'Document not found'
              : `Failed to load document (${response.status})`
          )
        }
        
        const text = await response.text()
        const normalizedText = text.replace(/\r\n/g, '\n')
        const match = normalizedText.match(/^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/)
        
        if (!match) {
          throw new Error('Invalid document format')
        }

        const [_, frontmatter, content] = match
        const metadata = parseYAML(frontmatter)
        
        const mdxSource = await serialize(content, {
          mdxOptions: {
            remarkPlugins: [remarkGfm],
            format: 'mdx'
          },
          parseFrontmatter: false,
        })
        
        setMetadata(metadata)
        setMdxSource(mdxSource)

        // Highlight code after content is loaded
        setTimeout(() => {
          if (window.Prism) {
            window.Prism.highlightAll()
          }
        }, 0)
      } catch (error) {
        console.error('Failed to load document:', error)
        setError(error instanceof Error ? error.message : 'Failed to load document')
        if (error instanceof Error && error.message === 'Document not found') {
          notFound()
        }
      } finally {
        setIsLoading(false)
      }
    }

    loadDoc()
  }, [slug])

  const components = {
    pre: ({ className, ...props }: React.HTMLAttributes<HTMLPreElement>) => {
      const languageMatch = className?.match(/language-(\w+)/)
      const language = languageMatch ? languageMatch[1] : ''
      
      return (
        <div className="relative group">
          {language && (
            <div className="absolute right-4 top-2 px-2 py-1 text-xs font-mono text-neutral-400 bg-neutral-900/80 rounded-md opacity-75 group-hover:opacity-100 transition-opacity">
              {language}
            </div>
          )}
          <pre 
            className={`${className} p-4 rounded-lg bg-neutral-950 overflow-x-auto`}
            {...props} 
          />
        </div>
      )
    },
    code: ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => {
      const isInline = !className?.includes('language-')
      return (
        <code 
          className={`${className} ${
            isInline 
              ? 'px-1 py-0.5 rounded-md text-orange-400 bg-neutral-950/50 font-mono text-sm' 
              : 'block text-sm'
          }`} 
          {...props} 
        />
      )
    },
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
    a: ({ className, href, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
      const isExternal = href?.startsWith('http')
      return (
        <a 
          className={`${className} text-blue-400 hover:text-blue-300 underline`}
          href={href}
          {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          {...props} 
        />
      )
    },
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

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (error) {
    return <div className="py-8 text-center text-red-500">{error}</div>
  }

  if (!metadata || !mdxSource) {
    return notFound()
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-8">
          <div className="flex justify-between items-start gap-4 mb-4">
            <h1 className="text-4xl font-bold text-neutral-100">
              {metadata.title}
            </h1>
            <StabilityBadge stability={metadata.stability} />
          </div>
          
          <div className="flex gap-2 flex-wrap mb-4">
            {metadata.tags.map(tag => (
              <span 
                key={tag}
                className="px-2 py-1 text-xs rounded-full bg-neutral-800 text-neutral-300"
              >
                {tag}
              </span>
            ))}
          </div>
          
          <p className="text-lg text-neutral-400">
            {metadata.excerpt}
          </p>
        </div>

        <div className="prose prose-invert prose-neutral max-w-none">
          <article className="min-w-full p-4 rounded-lg bg-neutral-900/50 border border-neutral-800">
            <MDXRemote {...mdxSource} components={components} />
          </article>
        </div>
      </div>
    </div>
  )
}

// YAML Parser
function parseYAML(yaml: string): DocMetadata {
  const lines = yaml.trim().split('\n')
  const result: Record<string, any> = {}

  for (const line of lines) {
    const [key, ...values] = line.split(':')
    const trimmedKey = key.trim()
    
    if (trimmedKey) {
      const value = values.join(':').trim()
      
      if (!value) {
        result[trimmedKey] = undefined
        continue
      }
      
      if (value === '[]') {
        result[trimmedKey] = []
        continue
      }
      
      if (value.startsWith('[') && value.endsWith(']')) {
        result[trimmedKey] = value
          .slice(1, -1)
          .split(',')
          .map(item => item.trim())
          .filter(Boolean)
        continue
      }
      
      result[trimmedKey] = value
    }
  }

  return {
    title: result.title || '',
    image: result.image,
    tags: Array.isArray(result.tags) ? result.tags : [],
    stability: (result.stability || 'experimental') as StabilityType,
    excerpt: result.excerpt || ''
  }
}