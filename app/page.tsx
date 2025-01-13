"use client";
import React, { useRef, useCallback } from "react";
import Link from "next/link";
import { SparklesCore } from "@/components/ui/sparkles";
import TabsDemo from "@/components/blocks/code-tabs";
import ConstructionOverlay from "./construction";
import Flipwords from "@/components/example/flip-words-demo";
import { Card } from "@/components/ui/card";
import { ArrowRight, Code, Globe, Shield, Users, Database, Star, ArrowUpRight } from "lucide-react";
import { newsData } from '@/lib/news-data';
import { blogData } from "@/lib/blog-data";

export default function Home() {
  const sparklesRef = useRef(null);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
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

  interface NewsCardProps {
    slug: string;
    date: string;
    title: string;
    description: string;
    tag: string;
  }

  const NewsCard = ({ slug, date, title, description, tag }: NewsCardProps) => (
    <Card className="p-6 hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-gray-950 to-gray-900 border border-gray-900">
      <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
        <time className="font-mono">{date}</time>
        <span className="px-2 py-1 rounded-full text-xs bg-blue-500/20 text-blue-400 font-medium">
          {tag}
        </span>
      </div>
      <h3 className="text-lg font-semibold mb-2 text-white/90">{title}</h3>
      <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
      <Link href={"/news/" + slug}>
        <button className="mt-4 flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors group">
          Read more <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </button>
      </Link>
    </Card>
  );

  const BlogCard = ({ slug, title, author, readingTime, excerpt }) => (
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group">
      <div className="h-48 bg-gradient-to-br from-blue-600/20 to-purple-600/20 group-hover:scale-105 transition-transform duration-500">
        <div className="w-full h-full bg-gradient-to-tr from-transparent to-white/5"></div>
      </div>
      <div className="p-6 bg-gradient-to-br from-gray-950 to-gray-900">
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
          <span className="font-medium text-gray-300">{author}</span>
          <span>•</span>
          <span className="font-mono">{readingTime} min read</span>
        </div>
        <h3 className="text-lg font-semibold mb-2 text-white/90 group-hover:text-white transition-colors">{title}</h3>
        <p className="text-gray-400 text-sm leading-relaxed">{excerpt}</p>
        <Link href={"/blog/" + slug}>
          <button className="mt-4 flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors group">
            Read more <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </Link>
      </div>
    </Card>
  );

  const TestimonialCard = ({ quote, author, role, company }) => (
    <Card className="p-6 bg-gradient-to-br from-gray-950 to-gray-900 border border-gray-900 hover:shadow-xl transition-all duration-300">
      <Star className="w-8 h-8 text-yellow-400 mb-4" />
      <blockquote className="text-lg mb-4 text-gray-300 italic">{quote}</blockquote>
      <div>
        <div className="font-semibold text-white">{author}</div>
        <div className="text-sm text-gray-400">{role} at {company}</div>
      </div>
    </Card>
  );

  const features = [
    {
      title: "Real-time Communication",
      description: "WebSocket connections with 12ms average latency, 99.99% uptime",
      specs: ["0.05ms avg latency", "0.2MB memory/conn", "Auto-reconnect", "Binary messaging"],
      codeExample: `// Example coming soon!`,
      icon: <Globe className="w-6 h-6 text-blue-400" />,
      gradient: "from-blue-600/20 to-blue-400/20"
    },
    {
      title: "Scalable Architecture",
      description: "Distributed mesh network supporting 14K+ connections on community edition and limitless concurrent connections on enterprise edition.",
      specs: ["14K+ concurrent users", "Auto-scaling mesh", "10s node discovery", "Zero-config clustering"],
      codeExample: `// Example coming soon!`,
      icon: <Database className="w-6 h-6 text-green-400" />,
      gradient: "from-green-600/20 to-green-400/20"
    },
    {
      title: "Secure by Design",
      description: "Automatic threat detection, and response.",
      specs: ["Rate limiting", "DDoS protection", "Anomaly detection", "End-to-end encryption"],
      codeExample: `// Example coming soon!`,
      icon: <Shield className="w-6 h-6 text-purple-400" />,
      gradient: "from-purple-600/20 to-purple-400/20"
    },
    {
      title: "Developer Friendly",
      description: "Type-safe APIs and extensive documentation, and examples",
      specs: ["OpenAPI specs", "User friendly docs", "VS Code extension (Soon!)", "Type safee API and plugins system"],
      codeExample: `// Example coming soon!`,
      icon: <Code className="w-6 h-6 text-yellow-400" />,
      gradient: "from-yellow-600/20 to-yellow-400/20"
    }
  ];

  const latestNews = newsData;
  const blogPosts = blogData;

  const testimonials = [
    // {
    //   quote: "Horizon has transformed how we handle multiplayer infrastructure. The performance gains and developer experience are unmatched.",
    //   author: "Emma Watson",
    //   role: "CTO",
    //   company: "GameCraft Studios"
    // },
    // {
    //   quote: "The plugin system is incredibly flexible, allowing us to customize everything while maintaining excellent performance.",
    //   author: "David Park",
    //   role: "Lead Engineer",
    //   company: "Virtual Worlds Inc"
    // },
    // {
    //   quote: "Supporting millions of players became manageable thanks to Horizon's scalable architecture.",
    //   author: "Maria Garcia",
    //   role: "Technical Director",
    //   company: "MetaVerse Games"
    // }
  ];

  return (
    <div className="dark min-h-screen flex flex-col">
      <ConstructionOverlay show={false} />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="min-h-screen relative flex items-center justify-center overflow-hidden bg-gradient-to-b from-transparent to-gray-900/30">
          <div ref={sparklesRef} className="absolute inset-0">
            {mounted && (
              <SparklesCore
                id="hero-sparkles"
                background="transparent"
                minSize={0.6}
                maxSize={1.4}
                particleDensity={35}
                className="w-full h-full"
                particleColor="#FFFFFF"
              />
            )}
          </div>
          <div className="relative z-10 min-w-full text-center px-4">
            <Flipwords />
            <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto font-light leading-relaxed">
              Horizon is a cutting-edge game server software designed to facilitate seamless interaction between your game clients through socket.io.
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/docs/about">
                <button className="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg text-white transition-all duration-300 flex items-center gap-2 hover:gap-3">
                  Get Started <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
              <Link href="/docs">
                <button className="px-6 py-3 border border-gray-700 hover:border-gray-500 rounded-lg text-gray-300 transition-all duration-300 flex items-center gap-2 hover:gap-3 hover:text-white">
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
              <h2 className="text-3xl lg:text-5xl lg:leading-tight max-w-5xl mx-auto text-center tracking-tight font-medium bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Built for Performance and Scale
              </h2>
              <p className="text-sm lg:text-base max-w-2xl my-4 mx-auto text-neutral-400 text-center font-light leading-relaxed">
                Horizon provides a scalable and customizable solution for hosting multiplayer games and managing real-time communication between players and a limitless number of game servers or Hosts.
              </p>

              <div className="max-w-7xl mx-auto mt-20 px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="text-center transform hover:scale-105 transition-transform duration-300">
                    <div className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent mb-2">62KB</div>
                    <div className="text-gray-400 font-light">RAM per Player</div>
                  </div>
                  <div className="text-center transform hover:scale-105 transition-transform duration-300">
                    <div className="text-4xl font-bold bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent mb-2">500μs</div>
                    <div className="text-gray-400 font-light">Avg startup Time</div>
                  </div>
                  <div className="text-center transform hover:scale-105 transition-transform duration-300">
                    <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent mb-2">2.7MB</div>
                    <div className="text-gray-400 font-light">Binary Size</div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto mt-16">
                {features.map((feature, index) => (
                  <Card key={index} className={`p-6 hover:shadow-xl transition-all duration-300 bg-gradient-to-br ${feature.gradient} border border-gray-800`}>
                    <div className="flex items-center gap-3 mb-4">
                      {feature.icon}
                      <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
                    </div>
                    <p className="text-gray-300 font-light leading-relaxed mb-4">{feature.description}</p>

                    <div className="grid grid-cols-2 gap-2 mb-4">
                      {feature.specs.map((spec, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-gray-400">
                          <div className="w-1 h-1 rounded-full bg-blue-400"></div>
                          {spec}
                        </div>
                      ))}
                    </div>

                    {/* <div className="bg-gray-900/50 rounded-lg p-4 font-mono text-sm text-gray-300 overflow-x-auto">
                      <pre className="whitespace-pre-wrap">{feature.codeExample}</pre>
                    </div> */}
                  </Card>
                ))}
              </div>
            </section>

            {/* Technical Specifications Section */}
            <section className="py-20 px-4 bg-gradient-to-b from-transparent to-gray-950/30">
              <div className="max-w-7xl mx-auto">
                <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-12">
                  Technical Specifications
                </h2>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Performance Metrics */}
                  <Card className="p-6 bg-gradient-to-br from-gray-950 to-gray-900 border border-gray-900">
                    <h3 className="text-lg font-semibold text-white mb-4">Performance Metrics</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Latency (p95)</span>
                        <span className="font-mono text-green-400">0.05ms</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Memory Usage</span>
                        <span className="font-mono text-green-400">0.2MB/conn</span>
                      </div>
                    </div>
                  </Card>

                  {/* System Requirements */}
                  <Card className="p-6 bg-gradient-to-br from-gray-950 to-gray-900 border border-gray-900">
                    <h3 className="text-lg font-semibold text-white mb-4">System Requirements</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">CPU</span>
                        <span className="font-mono text-blue-400">1+ cores (1 GHz+)</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">RAM</span>
                        <span className="font-mono text-blue-400">32MB+</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Storage</span>
                        <span className="font-mono text-blue-400">10MB+</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Network</span>
                        <span className="font-mono text-blue-400">4Kbps</span>
                      </div>
                    </div>
                  </Card>

                  {/* Supported Platforms */}
                  <Card className="p-6 bg-gradient-to-br from-gray-950 to-gray-900 border border-gray-900">
                    <h3 className="text-lg font-semibold text-white mb-4">Supported Platforms</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Server OS</span>
                        <span className="font-mono text-purple-400">Linux, Windows, MacOS</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Client SDKs (Soon!)</span>
                        <span className="font-mono text-purple-400">Unity, UE5, Godot, Bevy</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Languages</span>
                        <span className="font-mono text-purple-400">JS/TS, C#, C++, Rust, Go</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Protocols</span>
                        <span className="font-mono text-purple-400">WS/WSS, UDP Socket</span>
                      </div>
                    </div>
                  </Card>
                </div>

                {/* API Reference Preview */}
                <Card className="mt-8 p-6 bg-gradient-to-br from-gray-950 to-gray-900 border border-gray-900">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">API Reference Preview</h3>
                    <Link href="/docs/api">
                      <button className="text-blue-400 hover:text-blue-300 flex items-center gap-2 group">
                        View full API <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </button>
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                    <div className="p-3 bg-neutral-900/50 rounded-lg">
                      <code className="text-blue-400">HorizonServer</code>
                      <p className="text-gray-400 mt-1">Core server instance configuration and lifecycle management</p>
                    </div>
                    <div className="p-3 bg-neutral-900/50 rounded-lg">
                      <code className="text-blue-400">StateSync</code>
                      <p className="text-gray-400 mt-1">Real-time game state synchronization and delta compression</p>
                    </div>
                    <div className="p-3 bg-neutral-900/50 rounded-lg">
                      <code className="text-blue-400">Room</code>
                      <p className="text-gray-400 mt-1">Game room management and player session handling</p>
                    </div>
                  </div>
                </Card>
              </div>
            </section>

            {/* Latest News Section */}

            <section className="py-20 px-4">
              <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-12">
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Latest News</h2>
                  <Link href="/news" className="text-blue-400 hover:text-blue-300 flex items-center gap-2 group">
                    View all news <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {latestNews.slice(0, 3).map((news, index) => (
                    <NewsCard description={undefined} tag={undefined} key={index} {...news} />
                  ))}
                </div>
              </div>
            </section>

            {/* Blog Section */}
            <section className="py-20 px-4">
              <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-12">
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">From Our Blog</h2>
                  <Link href="/blog" className="text-blue-400 hover:text-blue-300 flex items-center gap-2 group">
                    View all posts <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {blogPosts.slice(0, 3).map((post, index) => (
                    <BlogCard key={index} {...post} />
                  ))}
                </div>
              </div>
            </section>

            {/* Testimonials Section */}
            {/* <section className="py-20 px-4">
              <div className="max-w-7xl mx-auto">
                <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-12">What Developers Say</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {testimonials.map((testimonial, index) => (
                    <TestimonialCard key={index} {...testimonial} />
                  ))}
                </div>
              </div>
            </section> */}

            {/* CTA Section */}
            <section className="py-20 px-4">
              <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-8">
                  Ready to Get Started?
                </h2>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/docs/about">
                    <button className="px-8 py-4 bg-blue-600 hover:bg-blue-500 rounded-lg text-white transition-all duration-300 flex items-center justify-center gap-2 hover:gap-3 w-full sm:w-auto">
                      Start Building <ArrowRight className="w-5 h-5" />
                    </button>
                  </Link>
                  <Link href="mailto:admin@farbeyond.dev">
                    <button className="px-8 py-4 border border-gray-700 hover:border-gray-500 rounded-lg text-gray-300 hover:text-white transition-all duration-300 flex items-center justify-center gap-2 hover:gap-3 w-full sm:w-auto">
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