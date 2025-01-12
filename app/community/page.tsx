"use client";

import React, { useState, useEffect } from "react";
import { Card } from '@/components/ui/card';
import { 
  Github, 
  MessageCircle, 
  Users, 
  Star, 
  BookOpen,
  Coffee,
  GitFork,
  Video,
  ArrowRight,
  Loader2,
  GitCommitHorizontal,
  AlertTriangle
} from "lucide-react";
import Link from "next/link";

const GITHUB_OWNER = 'Far-Beyond-Dev';
const GITHUB_REPO = 'Horizon-Community-Edition';
const MAX_RETRIES = 5;
const RETRY_DELAY = 45000; // 45 seconds
const PER_PAGE = 100; // Max items per GitHub API request
const INITIAL_RETRY_DELAY = 45000; // 45 seconds
const MAX_RETRY_DELAY = 300000; // 5 minutes
const CACHE_KEY = 'horizon-community-stats';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

interface Contributor {
  login: string;
  avatar_url: string;
  html_url: string;
  total_lines: number;
}

interface RepoStats {
  stars: number;
  forks: number;
  contributors: Contributor[];
  totalCommits: number;
  loading: boolean;
  error: string | null;
  lastUpdated?: number;
  isStale?: boolean;
}

interface Resource {
  title: string;
  description: string;
  icon: React.ReactNode;
  link: string;
}

interface Project {
  title: string;
  author: string;
  description: string;
  stars: number;
  forks: number;
  link: string;
}

interface GitHubRepo {
  name: string;
}

interface Week {
  a: number;
  d: number;
}

interface ContributorStats {
  weeks: Week[];
  author: {
    login: string;
  };
}

const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('en-US', {
    notation: num >= 10000 ? 'compact' : 'standard',
    maximumFractionDigits: 1
  }).format(num);
};

const getGitHubHeaders = (): HeadersInit => ({
  'Accept': 'application/vnd.github.v3+json',
  ...(process.env.NEXT_PUBLIC_GITHUB_TOKEN && {
    'Authorization': `token ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`
  })
});

const loadCachedStats = (): RepoStats | null => {
  if (typeof window === 'undefined') return null;
  
  try {
    const cached = window.localStorage.getItem(CACHE_KEY);
    if (cached) {
      const parsedStats = JSON.parse(cached);
      const now = Date.now();
      const isStale = now - parsedStats.lastUpdated > CACHE_DURATION;
      return {
        ...parsedStats,
        isStale,
        loading: false,
        error: null
      };
    }
  } catch (error) {
    console.warn('Failed to load cached stats:', error);
  }
  return null;
};

const saveStatsToCache = (stats: RepoStats) => {
  if (typeof window === 'undefined') return;
  
  try {
    const statsToCache = {
      ...stats,
      lastUpdated: Date.now(),
      loading: false,
      error: null
    };
    window.localStorage.setItem(CACHE_KEY, JSON.stringify(statsToCache));
  } catch (error) {
    console.warn('Failed to cache stats:', error);
  }
};

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const fetchWithRetry = async (url: string, headers: HeadersInit, maxRetries = MAX_RETRIES, onRetry: () => void) => {
  let lastError;
  let currentDelay = INITIAL_RETRY_DELAY;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await fetch(url, { headers });
      
      // Check for rate limit headers
      const rateLimitRemaining = Number(response.headers.get('x-ratelimit-remaining'));
      const rateLimitReset = Number(response.headers.get('x-ratelimit-reset'));
      
      if (rateLimitRemaining === 0) {
        const waitTime = (rateLimitReset * 1000) - Date.now();
        if (waitTime > 0) {
          console.log(`Rate limit exceeded. Waiting ${Math.ceil(waitTime / 1000)} seconds...`);
          await sleep(waitTime);
          continue;
        }
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // If we get a 202 or empty data, wait and retry
      if (response.status === 202 || (Array.isArray(data) && data.length === 0)) {
        console.log(`Attempt ${attempt + 1}: Got ${response.status} status or empty data. Waiting ${currentDelay/1000}s...`);
        onRetry();
        await sleep(currentDelay);
        currentDelay = Math.min(currentDelay * 2, MAX_RETRY_DELAY);
        continue;
      }
      
      return data;
    } catch (error) {
      console.warn(`Attempt ${attempt + 1} failed:`, error);
      lastError = error;
      
      if (attempt === maxRetries - 1) {
        throw lastError;
      }
      
      onRetry();
      await sleep(currentDelay);
      currentDelay = Math.min(currentDelay * 2, MAX_RETRY_DELAY);
    }
  }
  
  throw lastError;
};

async function getCommitCount(owner: string, repo: string, headers: HeadersInit): Promise<number> {
  try {
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/commits?per_page=1`, { headers });
    const linkHeader = response.headers.get('link');
    
    if (linkHeader) {
      const matches = linkHeader.match(/page=(\d+)>; rel="last"/);
      return matches ? parseInt(matches[1]) : 0;
    }
    
    const commits = await response.json();
    return Array.isArray(commits) ? commits.length : 0;
  } catch (error) {
    console.warn(`Failed to fetch commits for ${repo}:`, error);
    return 0;
  }
}

export default function Community() {
  const [repoStats, setRepoStats] = useState<RepoStats>({
    stars: 0,
    forks: 0,
    contributors: [],
    totalCommits: 0,
    loading: true,
    error: null
  });
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    // Try to load cached data on client-side mount
    const cachedData = loadCachedStats();
    if (cachedData) {
      setRepoStats(cachedData);
    }

    const fetchGitHubData = async () => {
      try {
        const headers = getGitHubHeaders();
        
        // Fetch repo data with rate limit handling
        const repoResponse = await fetch(`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}`, { headers });
        
        if (repoResponse.status === 403) {
          const rateLimitReset = Number(repoResponse.headers.get('x-ratelimit-reset'));
          const waitTime = (rateLimitReset * 1000) - Date.now();
          
          // Load cached data if available
          const cachedStats = loadCachedStats();
          if (cachedStats) {
            setRepoStats(prev => ({
              ...cachedStats,
              error: `Rate limit exceeded. Using cached data from ${new Date(cachedStats.lastUpdated!).toLocaleString()}. New data will be available in ${Math.ceil(waitTime / 60000)} minutes.`,
              isStale: true
            }));
            return;
          }
          
          throw new Error(`Rate limit exceeded. Please try again in ${Math.ceil(waitTime / 60000)} minutes.`);
        }

        if (!repoResponse.ok) {
          throw new Error(`Failed to fetch repo data: ${repoResponse.status}`);
        }

        const repoData = await repoResponse.json();

        // Fetch contributor stats with retry
        const statsData = await fetchWithRetry(
          `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/stats/contributors`,
          headers,
          MAX_RETRIES,
          () => setRetryCount(prev => prev + 1)
        ).catch(error => {
          console.warn('Failed to fetch contributor stats:', error);
          return [];
        });

        // Fetch org repos
        const orgReposResponse = await fetch(
          `https://api.github.com/orgs/${GITHUB_OWNER}/repos?per_page=${PER_PAGE}`,
          { headers }
        );

        if (!orgReposResponse.ok) {
          throw new Error(`Failed to fetch org repos: ${orgReposResponse.status}`);
        }

        const orgRepos = await orgReposResponse.json();

        // Count commits for all repos
        const commitCounts = await Promise.all(
          orgRepos.map((repo: GitHubRepo) => getCommitCount(GITHUB_OWNER, repo.name, headers))
        );
        const totalCommits = commitCounts.reduce((sum, count) => sum + count, 0);

        // Process contributor data
        const contributorLogins = Array.isArray(statsData) 
          ? statsData.map(stat => stat.author.login)
          : [];

        // Fetch detailed contributor info
        const contributorDetails = await Promise.all(
          contributorLogins.map(async (login) => {
            try {
              const response = await fetch(`https://api.github.com/users/${login}`, { headers });
              if (!response.ok) throw new Error(`Failed to fetch user data: ${response.status}`);
              return response.json();
            } catch (error) {
              console.warn(`Failed to fetch details for ${login}:`, error);
              return {
                login,
                avatar_url: `https://github.com/${login}.png`,
                html_url: `https://github.com/${login}`
              };
            }
          })
        );

        // Create complete contributor objects
        const contributorsWithStats = contributorDetails.map(contributor => {
          const stats = statsData.find((stat: ContributorStats) => stat.author.login === contributor.login);
          const totalLines = stats?.weeks.reduce((acc: number, week: Week) => acc + week.a + week.d, 0) ?? 0;

          return {
            login: contributor.login,
            avatar_url: contributor.avatar_url,
            html_url: contributor.html_url,
            total_lines: totalLines
          };
        });

        // Sort contributors by total lines changed
        const sortedContributors = contributorsWithStats.sort((a, b) => b.total_lines - a.total_lines);

        const newStats = {
          stars: repoData.stargazers_count,
          forks: repoData.forks_count,
          contributors: sortedContributors,
          totalCommits,
          loading: false,
          error: null
        };

        // Save to cache and update state
        saveStatsToCache(newStats);
        setRepoStats(newStats);

      } catch (error) {
        console.error('Error fetching GitHub data:', error);
        
        // Try to load cached data on error
        const cachedStats = loadCachedStats();
        if (cachedStats) {
          setRepoStats(prev => ({
            ...cachedStats,
            error: `Failed to fetch new data. Using cached data from ${new Date(cachedStats.lastUpdated!).toLocaleString()}.`,
            isStale: true
          }));
        } else {
          setRepoStats(prev => ({
            ...prev,
            loading: false,
            error: error instanceof Error ? error.message : 'Failed to load community data'
          }));
        }
      }
    };

    fetchGitHubData();
  }, [retryCount]);

  const totalLinesChanged = repoStats.contributors.reduce((acc, curr) => acc + curr.total_lines, 0);
  
  const stats = [
    { 
      label: "GitHub Stars", 
      value: formatNumber(repoStats.stars), 
      icon: <Star className="w-6 h-6" /> 
    },
    { 
      label: "Forks", 
      value: formatNumber(repoStats.forks), 
      icon: <GitFork className="w-6 h-6" /> 
    },
    { 
      label: "Total Commits", 
      value: formatNumber(repoStats.totalCommits), 
      icon: <GitCommitHorizontal className="w-6 h-6" /> 
    },
    { 
      label: "Contributors", 
      value: formatNumber(repoStats.contributors.length), 
      icon: <Users className="w-6 h-6" /> 
    },
    {
      label: "Lines Changed",
      value: formatNumber(totalLinesChanged),
      icon: <GitCommitHorizontal className="w-6 h-6" />
    }
  ];

  const resources: Resource[] = [
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

  const showcaseProjects: Project[] = [
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

  return (
    <div className="min-h-screen bg-gray-900">
      <section className="relative py-32 overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-900/20 to-black" />
        
        {/* Animated dot pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_50px_at_center,#ffffff08_98%,#3b82f620)] bg-[size:24px_24px]" />
        
        {/* Geometric lines */}
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(to right, #ffffff05 1px, transparent 1px),
                           linear-gradient(to bottom, #ffffff05 1px, transparent 1px)`,
          backgroundSize: '44px 44px'
        }} />

        {/* Glowing orb effect */}
        <div className="absolute left-1/4 -top-24 w-96 h-96 bg-blue-500 rounded-full opacity-10 blur-[128px] animate-pulse" />
        <div className="absolute right-1/4 -top-32 w-96 h-96 bg-purple-500 rounded-full opacity-10 blur-[128px] animate-pulse delay-700" />

        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative text-center">
            {/* Decorative elements */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
            
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">
              Join the Horizon Community
            </h1>
            
            {/* Animated line */}
            <div className="w-24 h-1 bg-blue-500/20 mx-auto mb-8 relative overflow-hidden">
              <div className="absolute inset-0 bg-blue-500 animate-[shimmer_2s_infinite]" />
            </div>
            
            <p className="text-xl text-gray-300/90 mb-8 max-w-2xl mx-auto leading-relaxed">
              Connect with developers, share your projects, and help shape the future of game server development.
            </p>
          </div>
        </div>

        {/* Animated particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-blue-500/20 rounded-full"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animation: `float ${10 + i * 5}s infinite linear`
              }}
            />
          ))}
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

      {/* Stats Section */}
      <section className="py-16 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {repoStats.isStale && (
            <div className="mb-8">
              <div className="flex items-center gap-2 text-yellow-400 bg-yellow-400/10 rounded-lg p-4">
                <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                <span>{repoStats.error}</span>
              </div>
            </div>
          )}

          {repoStats.loading && retryCount > 0 && (
            <div className="text-center text-gray-400 mb-8">
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Fetching contributor data... Attempt {retryCount} of {MAX_RETRIES}</span>
              </div>
              <div className="mt-2 text-sm">
                (Waiting {RETRY_DELAY/1000} seconds between attempts)
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="flex items-center justify-center">
                <div className="text-center">
                  <div className="flex justify-center mb-4 text-gray-400">
                    {stat.icon}
                  </div>
                  <div className="text-3xl font-bold text-white mb-2">
                    {repoStats.loading ? (
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
            {repoStats.loading && (
              <span className="block text-base font-normal text-gray-400 mt-2">
                Loading data... Attempt {retryCount + 1}/{MAX_RETRIES}
              </span>
            )}
          </h2>
          
          {repoStats.loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, index) => (
                <Card key={index} className="p-6 transition-all duration-300">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gray-800 animate-pulse" />
                    <div className="flex-1">
                      <div className="h-5 bg-gray-800 rounded w-1/2 mb-2 animate-pulse" />
                      <div className="h-4 bg-gray-800 rounded w-3/4 animate-pulse" />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : repoStats.error && !repoStats.isStale ? (
            <div className="text-center text-red-500">
              <p className="mb-4">{repoStats.error}</p>
              <button
                onClick={() => {
                  setRepoStats(prev => ({ ...prev, loading: true, error: null }));
                  setRetryCount(0);
                }}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-colors"
              >
                Retry Loading
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {repoStats.contributors.map((contributor) => (
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
                            <span>{formatNumber(contributor.total_lines)} lines changed</span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </a>
                ))}
              </div>
              
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
            </>
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
    </div>
  );
}