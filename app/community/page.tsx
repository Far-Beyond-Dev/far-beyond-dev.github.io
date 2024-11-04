"use client";
import React, { useState, useEffect } from "react";
import { Card } from '@/components/ui/card'
import { 
  Github,  
  MessageCircle, 
  Users, 
  Star, 
  BookOpen,
  Coffee,
  GitFork,
  Video,
  ArrowRight
} from "lucide-react";

// Utility function to format numbers
const formatNumber = (num: number): string => {
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k';
  }
  return num.toString();
};

interface Contributor {
  login: string;
  avatar_url: string;
  contributions: number;
  html_url: string;
}
  
interface RepoStats {
  stars: number;
  forks: number;
  contributors: Contributor[];
  loading: boolean;
  error: string | null;
}

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
        // Replace with your actual repo details
        const owner = 'Far-Beyond-Dev';
        const repo = 'Horizon-Community-Edition';
        
        // Fetch repository data
        const repoResponse = await fetch(
          `https://api.github.com/repos/${owner}/${repo}`,
          {
            headers: {
              'Accept': 'application/vnd.github.v3+json',
            }
          }
        );
        
        if (!repoResponse.ok) {
          throw new Error('Failed to fetch repository data');
        }
        
        const repoData = await repoResponse.json();

        // Fetch contributors
        const contributorsResponse = await fetch(
          `https://api.github.com/repos/${owner}/${repo}/contributors?per_page=18`,
          {
            headers: {
              'Accept': 'application/vnd.github.v3+json',
            }
          }
        );

        if (!contributorsResponse.ok) {
          throw new Error('Failed to fetch contributors data');
        }

        const contributorsData = await contributorsResponse.json();

        setRepoStats({
          stars: repoData.stargazers_count,
          forks: repoData.forks_count,
          contributors: contributorsData,
          loading: false,
          error: null
        });
      } catch (error) {
        setRepoStats(prev => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error.message : 'An error occurred'
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
    },
    // {
    //   title: "Video Tutorials",
    //   description: "Step-by-step video guides and walkthroughs",
    //   icon: <Video className="w-6 h-6 text-green-400" />,
    //   link: "#"
    // },
    // {
    //   title: "Blog Posts",
    //   description: "Latest updates, tips, and best practices",
    //   icon: <FileText className="w-6 h-6 text-purple-400" />,
    //   link: "#"
    // }
  ];

  const showcaseProjects = [
    {
      title: "Battle Royale Template",
      author: "GameStudio",
      description: "A complete battle royale game template built with Horizon",
      stars: 1200,
      forks: 280
    },
    {
      title: "MMO Starter Kit",
      author: "MMODevs",
      description: "Scalable MMO foundation with built-in features",
      stars: 850,
      forks: 160
    },
    {
      title: "Real-time Strategy Framework",
      author: "RTSEngine",
      description: "Framework for building RTS games with Horizon",
      stars: 620,
      forks: 95
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-black" />
        <div className="relative max-w-7xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              Join the Horizon Community
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Connect with developers, share your projects, and help shape the future of game server development.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-black">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="flex items-center justify-center">
                <div className="text-center">
                  <div className="flex justify-center mb-4 text-gray-400">
                    {stat.icon}
                  </div>
                  <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                  <div className="text-gray-400">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Resources Section */}
      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Community Resources
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {resources.map((resource, index) => (
              <a
                key={index}
                href={resource.link}
                className="group block"
              >
                <Card className="p-6 transition-colors">
                  <div className="mb-4">
                    {resource.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-gray-300 transition-colors">
                    {resource.title}
                  </h3>
                  <p className="text-gray-400 group-hover:text-gray-300 transition-colors">
                    {resource.description}
                  </p>
                </Card>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Contributors Section */}
      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Top Contributors
          </h2>
          {repoStats.loading ? (
            <div className="flex justify-center items-center py-12">
              
            </div>
          ) : repoStats.error ? (
            <div className="text-center text-red-400 py-8">
              {repoStats.error}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {repoStats.contributors.map((contributor) => (
                <a 
                  key={contributor.login}
                  href={contributor.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block group"
                >
                  <Card className="p-6 transition-all duration-300 transform hover:-translate-y-1">
                    <div className="flex items-center gap-4">
                      <img
                        src={contributor.avatar_url}
                        alt={contributor.login}
                        className="w-12 h-12 rounded-full ring-2 ring-gray-800 group-hover:ring-blue-500 transition-all"
                      />
                      <div>
                        <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors">
                          {contributor.login}
                        </h3>
                        <div className="mt-2 flex items-center gap-2 text-gray-400">
                          <Coffee className="w-4 h-4" />
                          <span>{contributor.contributions} contributions</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </a>
              ))}
            </div>
          )}
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
        </div>
      </section>

      {/* Project Showcase Section */}
      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Community Showcase
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {showcaseProjects.map((project, index) => (
              <Card key={index} className="p-6 transition-colors">
                <h3 className="text-xl font-semibold text-white mb-2">{project.title}</h3>
                <p className="text-gray-400 mb-4">by {project.author}</p>
                <p className="text-gray-300 mb-6">{project.description}</p>
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
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-black">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold text-white mb-6">
            Start Contributing Today
          </h2>
          <p className="text-gray-300 mb-8">
            Whether you&apos;re fixing bugs, improving documentation, or sharing your projects, every contribution makes Horizon better for everyone.
          </p>
          <div className="flex justify-center gap-4">
            <a href="https://github.com/Far-Beyond-Dev/Horizon-Community-Edition">
                <button className="px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-colors flex items-center gap-2">
                  <Github className="w-5 h-5" /> View on GitHub
                </button>
            </a>
            <button className="px-8 py-4 bg-purple-600 hover:bg-purple-700 rounded-lg text-white transition-colors flex items-center gap-2">
              <MessageCircle className="w-5 h-5" /> Join Discussion
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}