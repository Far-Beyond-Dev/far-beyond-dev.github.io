"use client";
import React, { useRef, useCallback } from "react";
import { SparklesCore } from "@/components/ui/sparkles";
import BentoGridThirdDemo from "@/components/blocks/features-section-demo-3";
import TabsDemo from "@/components/blocks/code-tabs";
import ConstructionOverlay from "./construction";
import Flipwords from "@/components/example/flip-words-demo";
import { Card } from "@/components/ui/card";
import { ArrowRight, Code, Globe, Zap, Shield, Users, Database, Cpu, Network, Lock, Terminal, Cloud, Gauge } from "lucide-react";

export default function Home() {
  const sparklesRef = useRef<HTMLDivElement | null>(null);
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

  const features = [
    {
      title: "Real-time Communication",
      description: "Built on Socket.io for lightning-fast, bidirectional communication",
      icon: <Globe className="w-6 h-6 text-blue-500" />
    },
    {
      title: "Scalable Architecture",
      description: "Handle thousands of concurrent connections with ease",
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
              <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-colors flex items-center gap-2">
                Get Started <ArrowRight className="w-4 h-4" />
              </button>
              <button className="px-6 py-3 border border-gray-700 hover:border-gray-600 rounded-lg text-gray-300 transition-colors flex items-center gap-2">
                View Documentation <Code className="w-4 h-4" />
              </button>
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

            {/* Code Demo Section */}
            <section className="py-20">
              <div className="max-w-7xl mx-auto px-4">
                <h2 className="text-3xl font-bold text-center text-white mb-12">
                  Simple to Implement
                </h2>
                <TabsDemo />
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
                  <button className="px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-colors flex items-center gap-2">
                    Start Building <ArrowRight className="w-5 h-5" />
                  </button>
                  <button className="px-8 py-4 border border-gray-700 hover:border-gray-600 rounded-lg text-gray-300 transition-colors flex items-center gap-2">
                    Contact Sales <Users className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}