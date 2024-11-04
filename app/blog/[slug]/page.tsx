import { blogData } from '@/lib/blog-data'
import BlogContent from './blog-content'
  
interface PageProps {
    params: { slug: string }
}

// This ensures all possible blog routes are generated at build time
export async function generateStaticParams() {
    const paths = blogData.map((post) => ({
        slug: post.slug,
    }))
    
    return paths
}

// Metadata generation for each blog post
export async function generateMetadata({ params }: PageProps) {
    const post = blogData.find((p) => p.slug === params.slug)
    
    if (!post) {
        return {
            title: 'Post Not Found',
            description: 'The requested blog post could not be found.'
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

export default function BlogPage({ params }: PageProps) {
    const post = blogData.find((p) => p.slug === params.slug)

    if (!post) {
        return null
    }

    return <BlogContent initialPost={post} slug={params.slug} />
}