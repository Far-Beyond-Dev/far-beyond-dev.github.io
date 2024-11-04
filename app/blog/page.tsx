"use client"

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, X, Clock, ArrowRight } from 'lucide-react'
import { blogData } from '@/lib/blog-data'

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('latest')

  const categories = useMemo(() => {
    const cats = new Set(blogData.flatMap(post => post.categories))
    return Array.from(cats)
  }, [])

  const filteredPosts = useMemo(() => {
    const posts = blogData.filter(post => {
      const matchesCategory = selectedCategory === 'all' || post.categories.includes(selectedCategory)
      const matchesSearch = searchQuery === '' || [
        post.title,
        post.excerpt,
        ...post.categories,
        post.author
      ].some(text => 
        text.toLowerCase().includes(searchQuery.toLowerCase())
      )
      return matchesCategory && matchesSearch
    })

    // Sort posts
    return posts.sort((a, b) => {
      if (sortBy === 'latest') {
        return new Date(b.date).getTime() - new Date(a.date).getTime()
      }
      // Add more sorting options if needed
      return 0
    })
  }, [selectedCategory, searchQuery, sortBy])

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header with Featured Post */}
        <div className="mb-16">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-neutral-900 p-8 md:p-12 mb-8">
            <div className="relative z-10">
              <div className="inline-block px-4 py-1 rounded-full bg-blue-500/10 text-blue-400 mb-4">
                Featured Post
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                Building Terraforge
              </h1>
              <p className="text-lg text-neutral-300 max-w-2xl mb-6">
                Discover the journey of building TerraForge, a custom terrain generation engine for Horizon and Stars Beyond
              </p>
              <div className="flex items-center gap-4 text-neutral-400">
                <span>Thiago Goulart</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  35 min read
                </span>
              </div>
            </div>
          </div>

          <div className="text-center max-w-2xl mx-auto">
            <p className="text-lg text-neutral-400">
              Insights, tutorials, and stories from the Horizon development team and community
            </p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-6 mb-12 pb-8 border-b border-neutral-800">
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-neutral-500" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles..."
                className="block w-full pl-10 pr-10 py-3 bg-neutral-900 border border-neutral-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-neutral-100 placeholder-neutral-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <X className="h-5 w-5 text-neutral-500 hover:text-neutral-300" />
                </button>
              )}
            </div>
          </div>

          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(category => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="latest">Latest First</SelectItem>
              <SelectItem value="popular">Most Popular</SelectItem>
              <SelectItem value="trending">Trending</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 gap-8">
          {filteredPosts.map((post) => (
            <Link 
              key={post.slug} 
              href={`/blog/${post.slug}`}
              className="block group"
            >
              <Card className="overflow-hidden hover:bg-neutral-900/50 transition-colors duration-300">
                <div className="flex flex-col md:flex-row gap-6 p-6">
                  <div className="w-full md:w-64 aspect-video rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20" />
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      {post.categories.map(category => (
                        <span 
                          key={category}
                          className="px-3 py-1 text-xs rounded-full bg-blue-500/10 text-blue-400"
                        >
                          {category}
                        </span>
                      ))}
                      <span className="text-neutral-500">•</span>
                      <span className="text-neutral-500 text-sm">
                        {new Date(post.date).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                    
                    <h2 className="text-2xl font-semibold mb-3 group-hover:text-blue-400 transition-colors">
                      {post.title}
                    </h2>
                    
                    <p className="text-neutral-400 mb-4 line-clamp-2">
                      {post.excerpt}
                    </p>

                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-neutral-800/50">
                      <div className="flex items-center gap-2">
                        <span className="text-neutral-300">{post.author}</span>
                        <span className="text-neutral-500">•</span>
                        <span className="text-neutral-500 flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {post.readingTime} min read
                        </span>
                      </div>
                      <span className="text-blue-500 flex items-center gap-1 group-hover:gap-2 transition-all">
                        Read more 
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>

        {/* No results state */}
        {filteredPosts.length === 0 && (
          <div className="text-center py-16 px-4 rounded-2xl bg-neutral-900/30 border border-neutral-800">
            <h3 className="text-xl font-medium text-neutral-300 mb-2">
              No articles found
            </h3>
            <p className="text-neutral-400 mb-6">
              Try adjusting your search or filters
            </p>
            <button
              onClick={() => {
                setSearchQuery('')
                setSelectedCategory('all')
                setSortBy('latest')
              }}
              className="px-6 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white transition-colors"
            >
              Reset all filters
            </button>
          </div>
        )}
      </div>
    </div>
  )
}