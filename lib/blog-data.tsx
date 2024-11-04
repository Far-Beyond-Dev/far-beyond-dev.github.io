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
      slug: 'future-of-game-development',
      title: 'The Future of Game Development',
      author: 'Sarah Chen',
      date: '2024-03-28',
      categories: ['Technology', 'Game Development', 'Future'],
      excerpt: 'Explore the latest trends and technologies shaping the future of multiplayer game development, from cloud infrastructure to AI-powered gameplay.',
      readingTime: 8,
      isFeatured: true
    },
    {
      slug: 'scaling-multiplayer-games',
      title: 'Scaling Multiplayer Games: A Deep Dive',
      author: 'Marcus Rodriguez',
      date: '2024-03-25',
      categories: ['Engineering', 'Performance', 'Architecture'],
      excerpt: 'Learn the best practices and techniques for scaling your multiplayer game infrastructure to handle millions of concurrent players.',
      readingTime: 12
    },
    {
      slug: 'optimizing-realtime-communication',
      title: 'Optimizing Real-time Game Communication',
      author: 'Emma Wilson',
      date: '2024-03-22',
      categories: ['Networking', 'Performance', 'Tutorial'],
      excerpt: 'A comprehensive guide to optimizing network communication in real-time multiplayer games using Horizons advanced features.',
      readingTime: 10
    },
    {
      slug: 'securing-game-servers',
      title: 'Best Practices for Game Server Security',
      author: 'Alex Thompson',
      date: '2024-03-20',
      categories: ['Security', 'Best Practices'],
      excerpt: 'Essential security practices and implementations to protect your game servers and player data from common threats and vulnerabilities.',
      readingTime: 15
    },
    {
      slug: 'horizon-plugin-development',
      title: 'Creating Custom Plugins for Horizon',
      author: 'David Park',
      date: '2024-03-18',
      categories: ['Tutorial', 'Plugins', 'Development'],
      excerpt: 'Step-by-step guide to creating and implementing custom plugins to extend Horizons functionality for your specific game needs.',
      readingTime: 6
    },
    {
      slug: 'state-synchronization',
      title: 'Advanced State Synchronization Patterns',
      author: 'Maria Garcia',
      date: '2024-03-15',
      categories: ['Engineering', 'Architecture', 'Tutorial'],
      excerpt: 'Deep dive into implementing efficient state synchronization in multiplayer games using Horizons built-in features.',
      readingTime: 9
    },
    {
      slug: 'load-testing-game-servers',
      title: 'Comprehensive Guide to Load Testing',
      author: 'James Wilson',
      date: '2024-03-12',
      categories: ['Testing', 'Performance', 'Tutorial'],
      excerpt: 'Learn how to effectively test your game servers under various load conditions to ensure optimal performance at scale.',
      readingTime: 7
    },
    {
      slug: 'game-analytics-implementation',
      title: 'Implementing Game Analytics with Horizon',
      author: 'Lisa Chen',
      date: '2024-03-10',
      categories: ['Analytics', 'Tutorial', 'Best Practices'],
      excerpt: 'A practical guide to implementing and leveraging game analytics to improve player experience and game performance.',
      readingTime: 8
    },
    {
      slug: 'distributed-game-architecture',
      title: 'Building Distributed Game Architectures',
      author: 'Michael Brown',
      date: '2024-03-08',
      categories: ['Architecture', 'Engineering', 'Advanced'],
      excerpt: 'Advanced strategies for designing and implementing distributed game architectures for massive multiplayer experiences.',
      readingTime: 11
    },
    {
      slug: 'horizon-migration-guide',
      title: 'Migrating to Horizon: A Complete Guide',
      author: 'Sophie Taylor',
      date: '2024-03-05',
      categories: ['Migration', 'Tutorial', 'Getting Started'],
      excerpt: 'Step-by-step guide to migrating your existing game infrastructure to Horizon with minimal downtime.',
      readingTime: 13
    },
    {
      slug: 'automated-game-testing',
      title: 'Automated Testing for Game Servers',
      author: 'Ryan Johnson',
      date: '2024-03-02',
      categories: ['Testing', 'Automation', 'Best Practices'],
      excerpt: 'Implement robust automated testing strategies for your game servers to catch issues before they reach production.',
      readingTime: 9
    },
    {
      slug: 'websocket-optimization',
      title: 'WebSocket Performance Optimization',
      author: 'Emily Zhang',
      date: '2024-02-28',
      categories: ['Networking', 'Performance', 'Advanced'],
      excerpt: 'Advanced techniques for optimizing WebSocket connections in high-performance multiplayer games.',
      readingTime: 10
    }
  ]