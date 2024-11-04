// lib/news-data.ts

export type NewsItem = {
    id: string
    slug: string
    title: string
    date: string
    category: 'release' | 'update' | 'announcement' | 'security' | 'community'
    content: string
    highlights: string[]
    impactLevel: 'major' | 'moderate' | 'minor'
  }
  
  export const newsData: NewsItem[] = [
    {
      id: "horizon-ce-000011",
      slug: "horizon-0-0-11-release-candidate",
      title: "Horizon 0.0.11 Release Candidate Now Available",
      date: "2024-03-28",
      category: "release",
      content: "We're excited to announce the release candidate for Horizon 0.0.11 This version brings performance improvements and new features that will enhance your game development experience.",
      highlights: [
        "Expanding the horizon plugin api",
        "PebbleVault Rewrite",
      ],
      impactLevel: "major"
    },
  ]