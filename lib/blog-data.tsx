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
    }
  ]