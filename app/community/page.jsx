"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Card } from '@/components/ui/card';
import { 
  Github, MessageCircle, Users, Star, BookOpen,
  Coffee, GitFork, Video, ArrowRight, Loader2,
  GitCommitHorizontal, AlertTriangle 
} from "lucide-react";
import Link from "next/link";

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
    title: "Coming Soon!",
    description: "More resources are coming with the full release",
    icon: <Video className="w-6 h-6 text-blue-400" />,
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
  const [stats, setStats] = useState({
    stars: 0,
    forks: 0,
    contributors: [],
    totalCommits: 0,
    loading: true,
    error: null
  });

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
    fetchData();
    
    const interval = setInterval(() => {
      const cache = getCache();
      if (!cache || (!isCacheValid(cache) && canMakeApiCall(cache))) {
        fetchData();
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [fetchData]);

  const totalLinesChanged = stats.contributors.reduce((acc, curr) => acc + curr.total_lines, 0);

  const statsItems = [
    { 
      label: "GitHub Stars", 
      value: formatNumber(stats.stars), 
      icon: <Star className="w-6 h-6" /> 
    },
    { 
      label: "Forks", 
      value: formatNumber(stats.forks), 
      icon: <GitFork className="w-6 h-6" /> 
    },
    { 
      label: "Total Commits", 
      value: formatNumber(stats.totalCommits), 
      icon: <GitCommitHorizontal className="w-6 h-6" /> 
    },
    { 
      label: "Contributors", 
      value: formatNumber(stats.contributors.length), 
      icon: <Users className="w-6 h-6" /> 
    },
    {
      label: "Total Commits",
      value: formatNumber(totalLinesChanged),
      icon: <GitCommitHorizontal className="w-6 h-6" />
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Hero Section */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-900/20 to-black" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_50px_at_center,#ffffff08_98%,#3b82f620)] bg-[size:24px_24px]" />
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(to right, #ffffff05 1px, transparent 1px),
                           linear-gradient(to bottom, #ffffff05 1px, transparent 1px)`,
          backgroundSize: '44px 44px'
        }} />

        <div className="absolute left-1/4 -top-24 w-96 h-96 bg-blue-500 rounded-full opacity-10 blur-[128px] animate-pulse" />
        <div className="absolute right-1/4 -top-32 w-96 h-96 bg-purple-500 rounded-full opacity-10 blur-[128px] animate-pulse delay-700" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative text-center">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
            
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">
              Join the Horizon Community
            </h1>
            
            <div className="w-24 h-1 bg-blue-500/20 mx-auto mb-8 relative overflow-hidden">
              <div className="absolute inset-0 bg-blue-500 animate-[shimmer_2s_infinite]" />
            </div>
            
            <p className="text-xl text-gray-300/90 mb-8 max-w-2xl mx-auto leading-relaxed">
              Connect with developers, share your projects, and help shape the future of game server development.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {stats.error && (
            <div className="mb-8">
              <div className="flex items-center gap-2 text-yellow-400 bg-yellow-400/10 rounded-lg p-4">
                <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                <span>{stats.error}</span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            {statsItems.map((stat, index) => (
              <div key={index} className="flex items-center justify-center">
                <div className="text-center">
                  <div className="flex justify-center mb-4 text-gray-400">
                    {stat.icon}
                  </div>
                  <div className="text-3xl font-bold text-white mb-2">
                    {stats.loading ? (
                      <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                    ) : (
                      stat.value
                    )}
                  </div>
                  <div className="text-gray-400">
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contributors Section */}
      <section className="py-20 bg-black" id="contributors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Top Contributors
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {stats.loading ? (
              Array(6).fill(0).map((_, index) => (
                <Card key={index} className="p-6 transition-all duration-300">
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
                  <Card className="p-6 transition-all duration-300 transform hover:-translate-y-1 hover:bg-gray-800/50">
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
      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Community Resources
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Community Showcase
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {showcaseProjects.map((project, index) => (
              <Link 
                key={index}
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Card className="p-6 h-full transition-colors hover:bg-gray-800/50">
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {project.title}
                  </h3>
                  <p className="text-gray-400 mb-4">
                    by {project.author}
                  </p>
                  <p className="text-gray-300 mb-6">
                    {project.description}
                  </p>
                  <div className="flex items-center gap-6 text-gray-400">
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
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 bg-black">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-6">
            Start Contributing Today
          </h2>
          <p className="text-gray-300 mb-8">
            Whether you're fixing bugs, improving documentation, or sharing your projects, every contribution makes Horizon better for everyone.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a 
              href={`https://github.com/${GITHUB_OWNER}/${GITHUB_REPO}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-colors"
            >
              <Github className="w-5 h-5" /> View on GitHub
            </a>
            <button
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg text-white transition-colors"
            >
              <MessageCircle className="w-5 h-5" /> Join Discussion
            </button>
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%) }
          100% { transform: translateX(100%) }
        }
        @keyframes float {
          0% { transform: translate(0, 0) }
          50% { transform: translate(100px, -100px) rotate(180deg) }
          100% { transform: translate(0, 0) }
        }
      `}</style>
    </div>
  );
}