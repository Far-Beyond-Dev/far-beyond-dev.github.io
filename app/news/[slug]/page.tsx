// app/news/[slug]/page.tsx
import { newsData } from '@/lib/news-data'
import NewsContent from './news-content'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'

type PageProps = {
  params: { 
    slug: string 
  }
}

export function generateMetadata({ params }: PageProps): Metadata {
  const news = newsData.find((n) => n.slug === params.slug)
  
  if (!news) {
    return { title: 'News Not Found' }
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

export default function NewsPage({ params }: PageProps) {
  const news = newsData.find((n) => n.slug === params.slug)
  
  if (!news) {
    notFound()
  }

  // For static builds, markdown content should be imported directly 
  // or included in the newsData rather than fetched
  return <NewsContent initialNews={news} slug={params.slug} />
}