import { blogData } from '@/lib/blog-data'
import BlogContent from './blog-content'
import { Metadata } from 'next'

// Type for the dynamic segment parameters
interface PageProps {
  params: {
    slug: string
  }
}

// Fix: Type the return value correctly
export async function generateStaticParams() {
  return blogData.map((post) => ({
    slug: post.slug,
  }))
}

export async function generateMetadata(
  props: PageProps
): Promise<Metadata> {
  const post = blogData.find((p) => p.slug === props.params.slug)
  if (!post) {
    return {
      title: 'Post Not Found',
      description: 'The requested blog post could not be found.',
    }
  }
  return {
    title: post.title,
    description: post.excerpt,
    authors: [{ name: post.author }],
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
    },
  }
}

// Page component
export default function BlogPage({
  params,
}: PageProps) {
  const post = blogData.find((p) => p.slug === params.slug)
  if (!post) {
    return null
  }
  return <BlogContent initialPost={post} slug={params.slug} />
}