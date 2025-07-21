"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { SparklesCore } from "@/components/ui/sparkles";
import { Card } from '@/components/ui/card';
import { 
  Github, MessageCircle, Users, Star, BookOpen,
  Coffee, GitFork, Video, ArrowRight, Loader2,
  GitCommitHorizontal, AlertTriangle, Code
} from "lucide-react";

const GITHUB_OWNER = 'Far-Beyond-Dev';
const GITHUB_REPO = 'Horizon';
const CACHE_KEY = 'horizon-community-stats';
const CACHE_DURATION = 24 * 60 * 60 * 1000;
const API_COOLDOWN = 60 * 1000;

const resources = [
  {
    title: "Documentation",
    description: "Comprehensive guides and API references",
    icon: <BookOpen className="w-6 h-6 text-blue-400" />,
    link: "/docs"
  },
  {
    title: "GitHub Repository",
    description: "Source code, issues, and contributions",
    icon: <Github className="w-6 h-6 text-green-400" />,
    link: "https://github.com/Far-Beyond-Dev/Horizon"
  },
  {
    title: "Coming Soon",
    description: "More resources coming with the full release",
    icon: <Video className="w-6 h-6 text-purple-400" />,
    link: ""
  }
];

const showcaseProjects = [
  {
    title: "Battle Royale Template",
    author: "Far Beyond Community",
    description: "A complete battle royale game template built with Horizon",
    stars: 0,
    forks: 0,
    link: "https://github.com/Far-Beyond-Dev/Battle-Royale-Template"
  },
  {
    title: "MMO Starter Kit",
    author: "Far Beyond Community", 
    description: "Scalable MMO foundation with built-in features",
    stars: 0,
    forks: 0,
    link: "https://github.com/Far-Beyond-Dev/MMO-Starter-Kit"
  },
  {
    title: "Real-time Strategy Framework",
    author: "Far Beyond Community",
    description: "Framework for building RTS games with Horizon",
    stars: 0,
    forks: 0,
    link: "https://github.com/Far-Beyond-Dev/Real-time-Strategy-Framework"
  }
];

const getCache = () => {
  if (typeof window === 'undefined') return null;
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    return cached ? JSON.parse(cached) : null;
  } catch {
    return null;
  }
};

const setCache = (data) => {
  if (typeof window === 'undefined') return;
  const entry = {
    timestamp: Date.now(),
    lastApiCall: Date.now(),
    data: {
      ...data,
      lastUpdated: Date.now()
    }
  };
  localStorage.setItem(CACHE_KEY, JSON.stringify(entry));
};

const updateLastApiCall = (cache) => {
  if (!cache) return;
  const updatedCache = {
    ...cache,
    lastApiCall: Date.now()
  };
  localStorage.setItem(CACHE_KEY, JSON.stringify(updatedCache));
};

const isCacheValid = (cache) => {
  if (!cache || !cache.timestamp) return false;
  return Date.now() - cache.timestamp < CACHE_DURATION;
};

const canMakeApiCall = (cache) => {
  if (!cache || !cache.lastApiCall) return true;
  return Date.now() - cache.lastApiCall > API_COOLDOWN;
};

const formatNumber = (num) => {
  return new Intl.NumberFormat('en-US', {
    notation: num >= 10000 ? 'compact' : 'standard',
    maximumFractionDigits: 1
  }).format(num);
};

export default function Community() {
  const sparklesRef = useRef(null);
  const [mounted, setMounted] = useState(false);
  const [stats, setStats] = useState({
    stars: 0,
    forks: 0,
    contributors: [],
    totalCommits: 0,
    loading: true,
    error: null
  });

  const handleScroll = useCallback(() => {
    if (!sparklesRef.current) return;
    const rect = sparklesRef.current.getBoundingClientRect();
    const isVisible = rect.top < window.innerHeight && rect.bottom >= 0;
    sparklesRef.current.style.willChange = isVisible ? 'transform' : 'auto';
  }, []);

  const fetchData = useCallback(async () => {
    const cache = getCache();
    
    if (cache && isCacheValid(cache)) {
      setStats({ ...cache.data, loading: false });
      if (!canMakeApiCall(cache)) {
        return;
      }
    }

    updateLastApiCall(cache);

    try {
      const headers = {
        'Accept': 'application/vnd.github.v3+json',
        ...(process.env.NEXT_PUBLIC_GITHUB_TOKEN && {
          'Authorization': `token ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`
        })
      };

      const responses = await Promise.all([
        fetch(`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}`, { headers }),
        fetch(`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contributors`, { headers })
      ]);

      if (!responses.every(r => r.ok)) {
        const rateLimitExceeded = responses.some(r => r.status === 403);
        if (rateLimitExceeded && cache) {
          setStats({
            ...cache.data,
            loading: false,
            error: 'Rate limit exceeded. Using cached data.',
          });
          return;
        }
        throw new Error('Failed to fetch data');
      }

      const [repoData, contributorsData] = await Promise.all(
        responses.map(r => r.json())
      );

      const contributors = contributorsData.map((c) => ({
        login: c.login,
        avatar_url: c.avatar_url,
        html_url: c.html_url,
        total_lines: c.contributions
      }));

      const newStats = {
        stars: repoData.stargazers_count,
        forks: repoData.forks_count,
        contributors,
        totalCommits: repoData.size,
        loading: false,
        error: null
      };

      setStats(newStats);
      setCache(newStats);
      
    } catch (error) {
      console.error('Error fetching data:', error);
      if (cache) {
        setStats({
          ...cache.data,
          loading: false,
          error: 'Failed to fetch new data. Using cached data.'
        });
      } else {
        setStats(prev => ({
          ...prev,
          loading: false,
          error: 'Failed to fetch data'
        }));
      }
    }
  }, []);

  useEffect(() => {
    setMounted(true);
    fetchData();
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    const interval = setInterval(() => {
      const cache = getCache();
      if (!cache || (!isCacheValid(cache) && canMakeApiCall(cache))) {
        fetchData();
      }
    }, 60000);

    return () => {
      setMounted(false);
      window.removeEventListener('scroll', handleScroll);
      clearInterval(interval);
    };
  }, [fetchData, handleScroll]);

  const totalLinesChanged = stats.contributors.reduce((acc, curr) => acc + curr.total_lines, 0);

  return (
    <div className="dark min-h-screen flex flex-col">
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="min-h-screen relative flex items-center justify-center overflow-hidden">
          <div ref={sparklesRef} className="absolute inset-0">
            {/* {mounted && (
              <SparklesCore
                id="community-sparkles"
                background="transparent"
                minSize={0.6}
                maxSize={1.4}
                particleDensity={30}
                className="w-full h-full"
                particleColor="#FFFFFF"
              />
            )} */}
          </div>
          <div className="relative z-10 min-w-full text-center px-4">
            <h1 className="text-4xl md:text-7xl lg:text-8xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-80 mb-6">
              Join the Community
            </h1>
            
            <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
              Connect with developers, share your projects, and help shape the future of game server development.
            </p>

            <div className="flex gap-4 justify-center">
              <a 
                href={`https://github.com/${GITHUB_OWNER}/${GITHUB_REPO}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-colors flex items-center gap-2"
              >
                <Github className="w-4 h-4" /> View on GitHub
              </a>
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
            {/* Stats Section */}
            <section className="py-20 px-4">
              <div className="max-w-7xl mx-auto">
                {stats.error && (
                  <div className="mb-12 text-center">
                    <div className="inline-flex items-center gap-2 text-orange-400 bg-orange-500/10 rounded-lg p-4 border border-orange-500/20">
                      <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                      <span>{stats.error}</span>
                    </div>
                  </div>
                )}

                <h4 className="text-3xl lg:text-5xl lg:leading-tight max-w-5xl mx-auto text-center tracking-tight font-medium text-black dark:text-white">
                  Built by the Community
                </h4>
                <p className="text-sm lg:text-base max-w-2xl my-4 mx-auto text-neutral-500 text-center font-normal dark:text-neutral-300">
                  Horizon is developed openly with contributions from developers around the world.
                </p>

                <div className="max-w-7xl mx-auto mt-20 px-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-blue-500 mb-2">
                        {stats.loading ? (
                          <Loader2 className="w-8 h-8 animate-spin mx-auto" />
                        ) : (
                          formatNumber(stats.stars)
                        )}
                      </div>
                      <div className="text-gray-400 flex items-center justify-center gap-2">
                        <Star className="w-4 h-4" />
                        GitHub Stars
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-green-500 mb-2">
                        {stats.loading ? (
                          <Loader2 className="w-8 h-8 animate-spin mx-auto" />
                        ) : (
                          formatNumber(stats.forks)
                        )}
                      </div>
                      <div className="text-gray-400 flex items-center justify-center gap-2">
                        <GitFork className="w-4 h-4" />
                        Forks
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-purple-500 mb-2">
                        {stats.loading ? (
                          <Loader2 className="w-8 h-8 animate-spin mx-auto" />
                        ) : (
                          formatNumber(stats.contributors.length)
                        )}
                      </div>
                      <div className="text-gray-400 flex items-center justify-center gap-2">
                        <Users className="w-4 h-4" />
                        Contributors
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-orange-500 mb-2">
                        {stats.loading ? (
                          <Loader2 className="w-8 h-8 animate-spin mx-auto" />
                        ) : (
                          formatNumber(totalLinesChanged)
                        )}
                      </div>
                      <div className="text-gray-400 flex items-center justify-center gap-2">
                        <GitCommitHorizontal className="w-4 h-4" />
                        Total Commits
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Contributors Section */}
            <section className="py-20 px-4">
              <div className="max-w-7xl mx-auto">
                <h2 className="text-3xl font-bold text-center mb-4">Top Contributors</h2>
                <p className="text-gray-400 text-center mb-16 max-w-2xl mx-auto">
                  Meet the developers who are building the future of game server technology.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {stats.loading ? (
                    Array(6).fill(0).map((_, index) => (
                      <Card key={index} className="p-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-gray-800 animate-pulse" />
                          <div className="flex-1">
                            <div className="h-5 bg-gray-800 rounded w-1/2 mb-2 animate-pulse" />
                            <div className="h-4 bg-gray-800 rounded w-3/4 animate-pulse" />
                          </div>
                        </div>
                      </Card>
                    ))
                  ) : (
                    stats.contributors.map((contributor) => (
                      <a 
                        key={contributor.login}
                        href={contributor.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block group"
                      >
                        <Card className="p-6 transition-all duration-300 hover:bg-gray-800/50">
                          <div className="flex items-center gap-4">
                            <img
                              src={contributor.avatar_url}
                              alt={contributor.login}
                              className="w-12 h-12 rounded-full ring-2 ring-gray-800 group-hover:ring-blue-500 transition-all"
                              loading="lazy"
                            />
                            <div>
                              <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors">
                                {contributor.login}
                              </h3>
                              <div className="mt-2 flex items-center gap-2 text-gray-400">
                                <Coffee className="w-4 h-4" />
                                <span>{formatNumber(contributor.total_lines)} commits</span>
                              </div>
                            </div>
                          </div>
                        </Card>
                      </a>
                    ))
                  )}
                </div>
                
                {!stats.loading && (
                  <div className="text-center mt-12">
                    <a
                      href={`https://github.com/${GITHUB_OWNER}/${GITHUB_REPO}/graphs/contributors`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      View all contributors <ArrowRight className="w-4 h-4" />
                    </a>
                  </div>
                )}
              </div>
            </section>

            {/* Resources Section */}
            <section className="py-20 px-4">
              <div className="max-w-7xl mx-auto">
                <h2 className="text-3xl font-bold text-center mb-4">Community Resources</h2>
                <p className="text-gray-400 text-center mb-16 max-w-2xl mx-auto">
                  Everything you need to get started with Horizon development.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {resources.map((resource, index) => (
                    <Link
                      key={index}
                      href={resource.link}
                      className={`block ${!resource.link && 'pointer-events-none'}`}
                    >
                      <Card className="p-6 h-full transition-colors hover:bg-gray-800/50">
                        <div className="mb-4">
                          {resource.icon}
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-2">
                          {resource.title}
                        </h3>
                        <p className="text-gray-400">
                          {resource.description}
                        </p>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            </section>

            {/* Showcase Section */}
            <section className="py-20 px-4">
              <div className="max-w-7xl mx-auto">
                <h2 className="text-3xl font-bold text-center mb-4">Community Showcase</h2>
                <p className="text-gray-400 text-center mb-16 max-w-2xl mx-auto">
                  Discover projects built by the Horizon community.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {showcaseProjects.map((project, index) => (
                    <a 
                      key={index}
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Card className="p-6 h-full transition-colors hover:bg-gray-800/50">
                        <h3 className="text-xl font-semibold text-white mb-2">
                          {project.title}
                        </h3>
                        <p className="text-gray-400 mb-4 text-sm">
                          by {project.author}
                        </p>
                        <p className="text-gray-300 mb-6">
                          {project.description}
                        </p>
                        <div className="flex items-center gap-6 text-gray-400 text-sm">
                          <div className="flex items-center gap-2">
                            <Star className="w-4 h-4" />
                            <span>{project.stars}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <GitFork className="w-4 h-4" />
                            <span>{project.forks}</span>
                          </div>
                        </div>
                      </Card>
                    </a>
                  ))}
                </div>
              </div>
            </section>

            {/* CTA Section */}
            <section className="py-20">
              <div className="max-w-4xl mx-auto text-center px-4">
                <h2 className="text-3xl font-bold text-white mb-6">
                  Start Contributing Today
                </h2>
                <p className="text-gray-400 mb-8">
                  Whether you're fixing bugs, improving documentation, or sharing your projects, every contribution makes Horizon better for everyone.
                </p>
                <div className="flex gap-4 justify-center">
                  <a 
                    href={`https://github.com/${GITHUB_OWNER}/${GITHUB_REPO}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-colors flex items-center gap-2"
                  >
                    <Github className="w-5 h-5" /> View on GitHub
                  </a>
                  <Link href="/docs">
                    <button className="px-8 py-4 border border-gray-700 hover:border-gray-600 rounded-lg text-gray-300 transition-colors flex items-center gap-2">
                      Read Documentation <ArrowRight className="w-5 h-5" />
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