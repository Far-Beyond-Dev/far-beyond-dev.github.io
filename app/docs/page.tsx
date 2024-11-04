// app/docs/page.tsx
"use client"

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { docsData } from '@/lib/docs-data'
import { Search, X } from 'lucide-react'

export default function DocsPage() {
  const [selectedTag, setSelectedTag] = useState('all')
  const [selectedStability, setSelectedStability] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  // Get unique tags
  const allTags = useMemo(() => {
    const tags = new Set(docsData.flatMap(doc => doc.tags))
    return Array.from(tags)
  }, [])

  // Filter docs based on selected filters and search
  const filteredDocs = useMemo(() => {
    return docsData.filter(doc => {
      const matchesTag = selectedTag === 'all' || doc.tags.includes(selectedTag)
      const matchesStability = selectedStability === 'all' || doc.stability === selectedStability
      const matchesSearch = searchQuery === '' || [
        doc.title,
        doc.excerpt,
        ...doc.tags
      ].some(text => 
        text.toLowerCase().includes(searchQuery.toLowerCase())
      )
      return matchesTag && matchesStability && matchesSearch
    })
  }, [selectedTag, selectedStability, searchQuery])

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="mb-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-neutral-100 to-neutral-400">
            Documentation
          </h1>
          <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
            Comprehensive guides and references for building with Pulsar Engine
          </p>
        </div>

        {/* Search and Filters */}
        <div className="space-y-4 mb-8">
          {/* Search */}
          <div className="relative max-w-2xl mx-auto">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-neutral-500" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search documentation..."
              className="block w-full pl-10 pr-10 py-2 bg-neutral-900 border border-neutral-800 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-neutral-100 placeholder-neutral-500"
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

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Select value={selectedTag} onValueChange={setSelectedTag}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Filter by tag" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tags</SelectItem>
                {allTags.map(tag => (
                  <SelectItem key={tag} value={tag}>{tag}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedStability} onValueChange={setSelectedStability}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Filter by stability" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Stability Levels</SelectItem>
                <SelectItem value="stable">Stable</SelectItem>
                <SelectItem value="in-dev">In Development</SelectItem>
                <SelectItem value="experimental">Experimental</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results count */}
        {(searchQuery || selectedTag !== 'all' || selectedStability !== 'all') && (
          <div className="text-center mb-8 text-neutral-400">
            Found {filteredDocs.length} document{filteredDocs.length === 1 ? '' : 's'}
          </div>
        )}

        {/* Documentation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocs.map((doc) => (
            <Link 
              key={doc.slug} 
              href={`/docs/${doc.slug}`}
              className="transition-all hover:scale-[1.02]"
            >
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start gap-4">
                    <CardTitle className="text-xl text-neutral-100">
                      {doc.title}
                    </CardTitle>
                    <StabilityBadge stability={doc.stability} />
                  </div>
                  {doc.tags.length > 0 && (
                    <div className="flex gap-2 flex-wrap mt-2">
                      {doc.tags.map(tag => (
                        <span 
                          key={tag}
                          className="px-2 py-1 text-xs rounded-full bg-neutral-800 text-neutral-300"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </CardHeader>
                <CardContent>
                  <p className="text-neutral-400">{doc.excerpt}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* No results state */}
        {filteredDocs.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-neutral-300 mb-2">
              No matching documents found
            </h3>
            <p className="text-neutral-400 mb-4">
              Try adjusting your search or filters
            </p>
            <button
              onClick={() => {
                setSearchQuery('')
                setSelectedTag('all')
                setSelectedStability('all')
              }}
              className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-neutral-100 transition-colors"
            >
              Reset all filters
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function StabilityBadge({ stability }: { stability: 'stable' | 'in-dev' | 'experimental' }) {
    const colors = {
      stable: "bg-green-500/10 text-green-500 border-green-500/20",
      "in-dev": "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
      experimental: "bg-red-500/10 text-red-500 border-red-500/20"
    } as const
    
    return (
      <span className={`px-2 py-1 text-xs rounded-md border ${colors[stability]}`}>
        {stability}
      </span>
    )
}