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
} from "lucide-react";
import Link from "next/link";

const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('en-US', {
    notation: num >= 10000 ? 'compact' : 'standard',
    maximumFractionDigits: 1
  }).format(num);
};

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
  loading: boolean;
  error: string | null;
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

const fetchWithRetry = async (url: string, headers: HeadersInit, maxRetries = 3, delay = 1000) => {
  let lastError;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await fetch(url, { headers });
      
      // If we get a 202, the stats are being computed - wait and retry
      if (response.status === 202) {
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      // If we get an empty array and it's not the final attempt, retry
      if (Array.isArray(data) && data.length === 0 && attempt < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      
      return data;
    } catch (error) {
      lastError = error;
      if (attempt === maxRetries - 1) {
        throw lastError;
      }
      await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, attempt))); // Exponential backoff
    }
  }
  
  throw lastError;
};

export default function Community() {
  const [repoStats, setRepoStats] = useState<RepoStats>({
    stars: 0,
    forks: 0,
    contributors: [],
    loading: true,
    error: null
  });

  useEffect(() => {
    const fetchGitHubData = async () => {
      try {
        const owner = 'Far-Beyond-Dev';
        const repo = 'Horizon-Community-Edition';
        const headers = {
          'Accept': 'application/vnd.github.v3+json',
          ...(process.env.NEXT_PUBLIC_GITHUB_TOKEN && {
            'Authorization': `token ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`
          })
        };

        // First fetch repo data and stats (stats might need retries)
        const [repoData, statsData] = await Promise.all([
          fetch(`https://api.github.com/repos/${owner}/${repo}`, { headers })
            .then(r => r.ok ? r.json() : Promise.reject(new Error(`Failed to fetch repo data: ${r.status}`))),
          
          fetchWithRetry(
            `https://api.github.com/repos/${owner}/${repo}/stats/contributors`,
            headers,
            3,
            2000
          ).catch(error => {
            console.warn('Failed to fetch contributor stats:', error);
            return [];
          })
        ]);

        // Get unique list of contributors from stats
        const contributorLogins = Array.isArray(statsData) 
          ? statsData.map(stat => stat.author.login)
          : [];

        // Fetch detailed user info for each contributor
        const contributorDetails = await Promise.all(
          contributorLogins.map(async (login) => {
            try {
              const response = await fetch(`https://api.github.com/users/${login}`, { headers });
              if (!response.ok) throw new Error(`Failed to fetch user data: ${response.status}`);
              return response.json();
            } catch (error) {
              console.warn(`Failed to fetch details for ${login}:`, error);
              // Return minimal user data if we can't get details
              return {
                login,
                avatar_url: `https://github.com/${login}.png`,
                html_url: `https://github.com/${login}`
              };
            }
          })
        );

        // Create complete contributor objects with stats
        const contributorsWithStats = contributorDetails.map(contributor => {
          const stats = Array.isArray(statsData) 
            ? statsData.find(stat => stat.author.login === contributor.login) 
            : null;
          const totalLines = stats?.weeks.reduce((acc, week) => acc + week.a + week.d, 0) ?? 0;

          return {
            login: contributor.login,
            avatar_url: contributor.avatar_url,
            html_url: contributor.html_url,
            total_lines: totalLines
          };
        });

        // Sort contributors by total lines changed, if available
        const sortedContributors = contributorsWithStats.sort((a, b) => b.total_lines - a.total_lines);

        setRepoStats({
          stars: repoData.stargazers_count,
          forks: repoData.forks_count,
          contributors: sortedContributors,
          loading: false,
          error: null
        });
      } catch (error) {
        console.error('Error fetching GitHub data:', error);
        setRepoStats(prev => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error.message : 'Failed to load community data'
        }));
      }
    };

    fetchGitHubData();
  }, []);

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
      label: "Contributors", 
      value: formatNumber(repoStats.contributors.length), 
      icon: <Users className="w-6 h-6" /> 
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
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black to-gray-900" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Join the Horizon Community
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Connect with developers, share your projects, and help shape the future of game server development.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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

      <section className="py-20 bg-black" id="contributors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Top Contributors
          </h2>
          
          {repoStats.loading ? (
            <div className="flex flex-col justify-center items-center py-12">
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-4" />
              <p className="text-gray-400">Loading contributor data...</p>
            </div>
          ) : repoStats.error ? (
            <div className="text-center text-red-500">
              {repoStats.error}
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
                  href="https://github.com/Far-Beyond-Dev/Horizon-Community-Edition/graphs/contributors"
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
                      <span>{project.forks}</span>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

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
              href="https://github.com/Far-Beyond-Dev/Horizon-Community-Edition"
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