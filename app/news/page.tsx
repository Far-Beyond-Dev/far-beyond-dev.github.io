"use client"

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { newsData } from '@/lib/news-data'
import { Search, X, Calendar, ArrowRight } from 'lucide-react'

export default function NewsPage() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedImpact, setSelectedImpact] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [timeframe, setTimeframe] = useState('all')

  // Get unique categories
  const categories = useMemo(() => {
    const cats = new Set(newsData.map(news => news.category))
    return Array.from(cats)
  }, [])

  // Filter news based on selected filters and search
  const filteredNews = useMemo(() => {
    const now = new Date()
    const timeframeFilter = (date: string) => {
      const newsDate = new Date(date)
      switch (timeframe) {
        case 'week':
          return (now.getTime() - newsDate.getTime()) <= 7 * 24 * 60 * 60 * 1000
        case 'month':
          return now.getMonth() === newsDate.getMonth() && now.getFullYear() === newsDate.getFullYear()
        case 'quarter':
          return Math.floor(now.getMonth() / 3) === Math.floor(newsDate.getMonth() / 3) && 
                 now.getFullYear() === newsDate.getFullYear()
        default:
          return true
      }
    }

    return newsData.filter(news => {
      const matchesCategory = selectedCategory === 'all' || news.category === selectedCategory
      const matchesImpact = selectedImpact === 'all' || news.impactLevel === selectedImpact
      const matchesTimeframe = timeframeFilter(news.date)
      const matchesSearch = searchQuery === '' || 
        [news.title, news.content, ...news.highlights].some(text => 
          text.toLowerCase().includes(searchQuery.toLowerCase())
        )
      return matchesCategory && matchesImpact && matchesTimeframe && matchesSearch
    })
  }, [selectedCategory, selectedImpact, timeframe, searchQuery])

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-neutral-100 to-neutral-400">
              Project Updates
            </h1>
            <a 
              href="/rss"
              className="px-4 py-2 border border-neutral-800 rounded-lg hover:bg-neutral-800 transition-colors flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              RSS Feed
            </a>
          </div>
          <p className="text-lg text-neutral-400 max-w-2xl">
            Stay up to date with the latest developments, releases, and improvements to Horizon
          </p>
        </div>

        {/* Filters Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-neutral-500" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search updates..."
              className="block w-full pl-10 pr-10 py-2 bg-neutral-900 border border-neutral-800 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
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

          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="week">Past Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(category => (
                <SelectItem key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* News Grid */}
        <div className="space-y-6">
          {filteredNews.map((news) => (
            <Link 
              key={news.id}
              href={`/news/${news.slug}`}
            >
              <Card className="border-neutral-800 hover:border-neutral-700 transition-colors mt-5 mb-5">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm text-neutral-400">
                          {new Date(news.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                        <ImpactBadge impact={news.impactLevel} />
                      </div>
                      <CardTitle className="text-2xl text-neutral-100">
                        {news.title}
                      </CardTitle>
                    </div>
                    <span className="px-3 py-1 rounded-full text-sm bg-neutral-800 text-neutral-300 capitalize">
                      {news.category}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-neutral-400 mb-4">{news.content}</p>
                  {news.highlights.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-neutral-300">Highlights:</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-neutral-400">
                        {news.highlights.map((highlight, index) => (
                          <li key={index}>{highlight}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <div className="mt-4">
                    <span className="inline-flex items-center gap-2 text-blue-500 hover:text-blue-400 transition-colors">
                      Read more <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* No results state */}
        {filteredNews.length === 0 && (
          <div className="text-center py-12 bg-neutral-900/50 rounded-lg">
            <h3 className="text-lg font-medium text-neutral-300 mb-2">
              No updates found
            </h3>
            <p className="text-neutral-400 mb-4">
              Try adjusting your filters or search terms
            </p>
            <button
              onClick={() => {
                setSearchQuery('')
                setSelectedCategory('all')
                setTimeframe('all')
                setSelectedImpact('all')
              }}
              className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-neutral-100 transition-colors"
            >
              Reset filters
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function ImpactBadge({ impact }: { impact: 'major' | 'moderate' | 'minor' }) {
  const colors = {
    major: "bg-purple-500/10 text-purple-500 border-purple-500/20",
    moderate: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    minor: "bg-green-500/10 text-green-500 border-green-500/20"
  } as const
  
  return (
    <span className={`px-2 py-1 text-xs rounded-md border ${colors[impact]}`}>
      {impact}
    </span>
  )
} 