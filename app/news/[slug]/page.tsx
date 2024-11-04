// app/news/[slug]/page.tsx
import { newsData } from '@/lib/news-data'
import NewsContent from './news-content'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'

interface PageProps {
  params: { slug: string }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const news = newsData.find((n) => n.slug === params.slug)
  
  if (!news) {
    return {
      title: 'News Not Found'
    }
  }

  return {
    title: `${news.title} | Horizon News`,
    description: news.content,
  }
}

export function generateStaticParams() {
  return newsData.map((news) => ({
    slug: news.slug,
  }))
}

export default async function NewsPage({ params }: PageProps) {
  // Find the news item
  const news = newsData.find((n) => n.slug === params.slug)

  // If no news found, show 404
  if (!news) {
    notFound()
  }

  // Get the markdown content
  let mdContent
  try {
    // Attempting to get markdown content if it exists
    const response = await fetch(`/news/${params.slug}.md`)
    if (response.ok) {
      mdContent = await response.text()
    }
  } catch (error) {
    console.error('Error loading markdown:', error)
    // We'll continue without markdown content
  }

  // Combine the data
  const combinedNews = {
    ...news,
    markdownContent: mdContent || '' // If no markdown, use empty string
  }

  return <NewsContent initialNews={combinedNews} slug={params.slug} />
}