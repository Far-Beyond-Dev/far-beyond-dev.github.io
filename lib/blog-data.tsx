export type BlogPost = {
    slug: string
    title: string
    author: string
    date: string
    categories: string[]
    excerpt: string
    readingTime: number
    isFeatured?: boolean
    thumbnail?: string
  }
  
  export const blogData: BlogPost[] = [
    {
      slug: 'building-terraforge-1',
      title: 'Building Terraforge',
      author: 'Thiago Goulart',
      date: '2024-06-06',
      categories: ['Engineering', 'Performance', 'Architecture'],
      excerpt: 'Discover the journey of building TerraForge, a custom terrain generation engine for Horizon and Stars Beyond',
      readingTime: 35
    },
    {
      slug: 'horizon-rewrite',
      title: 'Horizon Core Rewrite',
      author: 'Tristan Poland',
      date: '2024-11-06',
      categories: ['Engineering', 'Performance', 'Architecture', 'Plugins'],
      excerpt: 'A technical deep-dive into the Horizon Core comprehensive rewrite',
      readingTime: 35
    }
  ]
