import { blogData } from '@/lib/blog-data'
import BlogContent from './blog-content'

export default function BlogPage({
  params,
}: {
  params: { slug: string }
  searchParams: Record<string, string | string[] | undefined>
}) {
  const post = blogData.find((p) => p.slug === params.slug)
  
  if (!post) {
    return null
  }

  return <BlogContent initialPost={post} slug={params.slug} />
}

export const generateStaticParams = () => 
  blogData.map((post) => ({
    slug: post.slug,
  }))