"use client";
import React, { useRef, useCallback, useState, useEffect } from "react";
import Link from "next/link";
import { SparklesCore } from "@/components/ui/sparkles";
import TabsDemo from "@/components/blocks/code-tabs";
import ConstructionOverlay from "./construction";
import Flipwords from "@/components/example/flip-words-demo";
import { Card } from "@/components/ui/card";
import { ArrowRight, Code, Globe, Shield, Users, Database, Star, BookOpen, FileText, Calendar, Clock } from "lucide-react";
import { newsData } from '@/lib/news-data';

export default function Home() {
  const sparklesRef = useRef(null);
  const [mounted, setMounted] = useState(false);
  const [blogPosts, setBlogPosts] = useState([]);
  const [docsData, setDocsData] = useState([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Fetch blog and docs data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [blogResponse, docsResponse] = await Promise.all([
          fetch('https://horizon.farbeyond.dev/blog/blog-index.json'),
          fetch('https://horizon.farbeyond.dev/docs/blog-index.json')
        ]);
        
        const blogData = await blogResponse.json();
        const docsData = await docsResponse.json();
        
        setBlogPosts(blogData);
        setDocsData(docsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleScroll = useCallback(() => {
    if (!sparklesRef.current) return;
    const rect = sparklesRef.current.getBoundingClientRect();
    const isVisible = rect.top < window.innerHeight && rect.bottom >= 0;
    sparklesRef.current.style.willChange = isVisible ? 'transform' : 'auto';
  }, []);

  React.useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Helper function to clean excerpt text
  const cleanExcerpt = (excerpt) => {
    return excerpt
      .replace(/\n/g, ' ')
      .replace(/\*/g, '')
      .replace(/#{1,6}/g, '')
      .replace(/\[.*?\]\(.*?\)/g, '')
      .trim()
      .substring(0, 150) + (excerpt.length > 150 ? '...' : '');
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Latest News Component
  const NewsCard = ({ slug, date, title, description, tag }) => (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
        <Calendar className="w-4 h-4" />
        <time>{date}</time>
        <span className="px-2 py-1 rounded-full text-xs bg-blue-500/10 text-blue-500">
          {tag}
        </span>
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-gray-400 text-sm">{description}</p>
      <Link href={"/news/"+slug}>
        <button className="mt-4 flex items-center gap-2 text-blue-500 hover:text-blue-400 transition-colors">
          Read more  <ArrowRight className="w-4 h-4" />
        </button>
      </Link>
    </Card>
  );

  // Blog Preview Component
  const BlogCard = ({ slug, title, date, excerpt, readingTime, categories, tags }) => (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="h-48 bg-gradient-to-br from-blue-500/20 to-purple-500/20 relative">
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 rounded-full text-xs bg-blue-500/20 text-blue-300 backdrop-blur-sm">
            {categories?.[0] || 'Engineering'}
          </span>
        </div>
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex flex-wrap gap-1">
            {tags?.slice(0, 3).map((tag, index) => (
              <span key={index} className="px-2 py-1 rounded text-xs bg-black/30 text-white backdrop-blur-sm">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="p-6">
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
          <Calendar className="w-4 h-4" />
          <span>{formatDate(date)}</span>
          <span>•</span>
          <Clock className="w-4 h-4" />
          <span>{readingTime} min read</span>
        </div>
        <h3 className="text-lg font-semibold mb-2 text-white">{title}</h3>
        <p className="text-gray-400 text-sm">{cleanExcerpt(excerpt)}</p>
        <Link href={"/blog/posts/"+slug}>
          <button className="mt-4 flex items-center gap-2 text-blue-500 hover:text-blue-400 transition-colors">
            Read more  <ArrowRight className="w-4 h-4" />
          </button>
        </Link>
      </div>
    </Card>
  );

  // Documentation Card Component
  const DocsCard = ({ slug, title, excerpt, readingTime, tags, stability }) => (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="h-32 bg-gradient-to-br from-green-500/20 to-blue-500/20 relative">
        <div className="absolute top-4 left-4">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-green-400" />
            <span className="px-2 py-1 rounded-full text-xs bg-green-500/20 text-green-300 backdrop-blur-sm">
              {stability}
            </span>
          </div>
        </div>
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex flex-wrap gap-1">
            {tags?.slice(0, 3).map((tag, index) => (
              <span key={index} className="px-2 py-1 rounded text-xs bg-black/30 text-white backdrop-blur-sm">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="p-6">
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
          <BookOpen className="w-4 h-4" />
          <span>Documentation</span>
          <span>•</span>
          <Clock className="w-4 h-4" />
          <span>{readingTime} min read</span>
        </div>
        <h3 className="text-lg font-semibold mb-2 text-white">{title}</h3>
        <p className="text-gray-400 text-sm">{cleanExcerpt(excerpt)}</p>
        <Link href={"/docs/entries/"+slug}>
          <button className="mt-4 flex items-center gap-2 text-green-500 hover:text-green-400 transition-colors">
            Read docs  <ArrowRight className="w-4 h-4" />
          </button>
        </Link>
      </div>
    </Card>
  );

  // Testimonial Component
  const TestimonialCard = ({ quote, author, role, company }) => (
    <Card className="p-6">
      <Star className="w-8 h-8 text-yellow-500 mb-4" />
      <blockquote className="text-lg mb-4">{quote}</blockquote>
      <div>
        <div className="font-semibold">{author}</div>
        <div className="text-sm text-gray-400">{role} at {company}</div>
      </div>
    </Card>
  );

  const features = [
    {
      title: "Real-time Communication",
      description: "Built on Socket.io for lightning-fast, bidirectional communication",
      icon: <Globe className="w-6 h-6 text-blue-500" />
    },
    {
      title: "Scalable Architecture",
      description: "Handle infinite concurrent connections with multiple servers in a mesh",
      icon: <Database className="w-6 h-6 text-green-500" />
    },
    {
      title: "Secure by Design",
      description: "Enterprise-grade security with built-in protection against common threats",
      icon: <Shield className="w-6 h-6 text-purple-500" />
    },
    {
      title: "Developer Friendly",
      description: "Comprehensive API and extensive documentation",
      icon: <Code className="w-6 h-6 text-yellow-500" />
    }
  ];

  const latestNews = newsData;

  const testimonials = [
    {
      quote: "Horizon has transformed how we handle multiplayer infrastructure. The performance gains and developer experience are unmatched.",
      author: "Emma Watson",
      role: "CTO",
      company: "GameCraft Studios"
    },
    {
      quote: "The plugin system is incredibly flexible, allowing us to customize everything while maintaining excellent performance.",
      author: "David Park",
      role: "Lead Engineer",
      company: "Virtual Worlds Inc"
    },
    {
      quote: "Supporting millions of players became manageable thanks to Horizon's scalable architecture.",
      author: "Maria Garcia",
      role: "Technical Director",
      company: "MetaVerse Games"
    }
  ];

  return (
    <div className="dark min-h-screen flex flex-col">
      <ConstructionOverlay show={false} />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="min-h-screen relative flex items-center justify-center overflow-hidden">
          <div ref={sparklesRef} className="absolute inset-0">
            {mounted && (
              <SparklesCore
                id="hero-sparkles"
                background="transparent"
                minSize={0.6}
                maxSize={1.4}
                particleDensity={30}
                className="w-full h-full"
                particleColor="#FFFFFF"
              />
            )}
          </div>
          <div className="relative z-10 min-w-full text-center px-4">
            <Flipwords />   
            <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
              Horizon is a cutting-edge game server software designed to facilitate seamless interaction between your game clients through socket.io.
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/docs/about">
                <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-colors flex items-center gap-2">
                  Get Started <ArrowRight className="w-4 h-4" />
                </button>
              </Link>

              <Link href="/docs">
                <button className="px-6 py-3 border border-gray-700 hover:border-gray-600 rounded-lg text-gray-300 transition-colors flex items-center gap-2">
                  View Documentation <Code className="w-4 h-4" />
                </button>
              </Link>
            </div>
          </div>
        </section>

        {mounted && (
          <>
            {/* Features Section */}
            <section id="features" className="py-20 px-4">
              <h4 className="text-3xl lg:text-5xl lg:leading-tight max-w-5xl mx-auto text-center tracking-tight font-medium text-black dark:text-white">
                Built for Performance and Scale
              </h4>
              <p className="text-sm lg:text-base max-w-2xl my-4 mx-auto text-neutral-500 text-center font-normal dark:text-neutral-300">
                Horizon provides a scalable and customizable solution for hosting multiplayer games and managing real-time communication between players and a limitless number of game servers or Hosts.
              </p>
              
              <div className="max-w-7xl mx-auto mt-20 px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-blue-500 mb-2">62KB</div>
                    <div className="text-gray-400">RAM per Player</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-green-500 mb-2">500μs</div>
                    <div className="text-gray-400">Avg startup Time</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-purple-500 mb-2">2.7MB</div>
                    <div className="text-gray-400">Binary Size</div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto mt-16">
                {features.map((feature, index) => (
                  <Card key={index} className="p-6">
                    <div className="mb-4">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                    <p className="text-gray-400">{feature.description}</p>
                  </Card>
                ))}
              </div>
            </section>

            {/* Latest News Section */}
            <section className="py-20 px-4">
              <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-12">
                  <h2 className="text-3xl font-bold">Latest News</h2>
                  <Link href="/news" className="text-blue-500 hover:text-blue-400 flex items-center gap-2">
                    View all news <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {latestNews.map((news, index) => (
                    <NewsCard key={index} {...news} />
                  ))}
                </div>
              </div>
            </section>

            {/* Blog Section */}
            <section className="py-20 px-4">
              <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-12">
                  <h2 className="text-3xl font-bold">From Our Blog</h2>
                  <Link href="/blog" className="text-blue-500 hover:text-blue-400 flex items-center gap-2">
                    View all posts <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
                {loading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="text-gray-400 mt-4">Loading latest blog posts...</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {blogPosts.slice(0, 3).map((post, index) => (
                      <BlogCard key={index} {...post} />
                    ))}
                  </div>
                )}
              </div>
            </section>

            {/* Documentation Section */}
            <section className="py-20 px-4">
              <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-12">
                  <h2 className="text-3xl font-bold">Documentation</h2>
                  <Link href="/docs" className="text-green-500 hover:text-green-400 flex items-center gap-2">
                    View all docs <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
                {loading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto"></div>
                    <p className="text-gray-400 mt-4">Loading documentation...</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {docsData.map((doc, index) => (
                      <DocsCard key={index} {...doc} />
                    ))}
                  </div>
                )}
              </div>
            </section>

            {/* CTA Section */}
            <section className="py-20">
              <div className="max-w-4xl mx-auto text-center px-4">
                <h2 className="text-3xl font-bold text-white mb-6">
                  Ready to Get Started?
                </h2>
                <p className="text-gray-400 mb-8">
                  Join thousands of developers building the next generation of multiplayer games with Horizon.
                </p>
                <div className="flex gap-4 justify-center">
                  <Link href="/docs/about">
                    <button className="px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-colors flex items-center gap-2">
                      Start Building <ArrowRight className="w-5 h-5" />
                    </button>
                  </Link>

                  <Link href="mailto:admin@farbeyond.dev">
                    <button className="px-8 py-4 border border-gray-700 hover:border-gray-600 rounded-lg text-gray-300 transition-colors flex items-center gap-2">
                      Contact Sales <Users className="w-5 h-5" />
                    </button>
                  </Link>
                </div>
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}