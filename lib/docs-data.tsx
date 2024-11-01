// lib/docs-data.ts
export interface DocMetadata {
    title: string
    excerpt: string
    tags: string[]
    stability: 'stable' | 'in-dev' | 'experimental'
    slug: string
  }
  
  export const docsData: DocMetadata[] = [
    {
      title: "Getting Started",
      excerpt: "Quick start guide for Pulsar Engine development",
      tags: ["basics", "tutorial"],
      stability: "stable",
      slug: "getting-started"
    },
    {
      title: "Component Architecture",
      excerpt: "Understanding Pulsar's component-based architecture",
      tags: ["architecture", "core"],
      stability: "stable",
      slug: "component-architecture"
    },
    {
      title: "Physics System",
      excerpt: "Advanced physics simulation system with continuous collision detection",
      tags: ["physics", "core"],
      stability: "stable",
      slug: "physics"
    },
    {
      title: "Networking",
      excerpt: "Real-time multiplayer networking and state synchronization",
      tags: ["networking", "multiplayer"],
      stability: "in-dev",
      slug: "networking"
    },
    {
      title: "Asset Pipeline",
      excerpt: "Working with assets and resource management",
      tags: ["assets", "tools"],
      stability: "experimental",
      slug: "asset-pipeline"
    }
  ]