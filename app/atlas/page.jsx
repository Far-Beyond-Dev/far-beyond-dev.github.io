"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { SparklesCore } from "@/components/ui/sparkles";
import { Card } from "@/components/ui/card";
import { 
  ArrowRight, Code, Server, Network, Shield, Users, Database, 
  Activity, Globe2, Zap, Cpu, Monitor, Layers, Route, Loader2
} from "lucide-react";

export default function Atlas() {
  const sparklesRef = useRef(null);
  const [mounted, setMounted] = useState(false);

  const handleScroll = useCallback(() => {
    if (!sparklesRef.current) return;
    const rect = sparklesRef.current.getBoundingClientRect();
    const isVisible = rect.top < window.innerHeight && rect.bottom >= 0;
    sparklesRef.current.style.willChange = isVisible ? 'transform' : 'auto';
  }, []);

  useEffect(() => {
    setMounted(true);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      setMounted(false);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  const features = [
    {
      title: "Dynamic Server Management",
      description: "Automatically start, stop, and monitor game server instances based on player movement and activity",
      icon: <Server className="w-6 h-6 text-blue-500" />
    },
    {
      title: "Seamless Player Experience", 
      description: "Prepare game servers as players approach new regions, ensuring smooth transitions",
      icon: <Users className="w-6 h-6 text-green-500" />
    },
    {
      title: "State Synchronization",
      description: "Preemptively serialize and sync player state via delta compression to new servers",
      icon: <Database className="w-6 h-6 text-purple-500" />
    },
    {
      title: "WebSocket Proxy",
      description: "Act as connection manager and proxy, routing players to appropriate server instances",
      icon: <Network className="w-6 h-6 text-orange-500" />
    }
  ];

  return (
    <div className="dark min-h-screen flex flex-col">
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="min-h-screen relative flex items-center justify-center overflow-hidden">
          <div ref={sparklesRef} className="absolute inset-0">
            {mounted && (
              <SparklesCore
                id="atlas-sparkles"
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
            <div className="flex justify-center mb-8">
              <img 
                src="https://raw.githubusercontent.com/Far-Beyond-Dev/Horizon-Atlas/main/branding/logo-no-background.png" 
                alt="Horizon Atlas Logo" 
                className="max-h-52 w-auto opacity-90"
              />
            </div>
            
            <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
              A connection orchestrator for Horizon Game Server instances. Manage server lifecycles, monitor performance, and route players seamlessly across your game world.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link href="/docs">
                <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-colors flex items-center gap-2">
                  Get Started <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
              <a 
                href="https://github.com/Far-Beyond-Dev/Horizon-Atlas" 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-6 py-3 border border-gray-700 hover:border-gray-600 rounded-lg text-gray-300 transition-colors flex items-center gap-2"
              >
                View on GitHub <Code className="w-4 h-4" />
              </a>
            </div>

            {/* Status Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm font-medium">Early Development Phase</span>
            </div>
          </div>
        </section>

        {mounted && (
          <>
            {/* Features Section */}
            <section id="features" className="py-20 px-4">
              <h4 className="text-3xl lg:text-5xl lg:leading-tight max-w-5xl mx-auto text-center tracking-tight font-medium text-black dark:text-white">
                Connection Orchestration at Scale
              </h4>
              <p className="text-sm lg:text-base max-w-2xl my-4 mx-auto text-neutral-500 text-center font-normal dark:text-neutral-300">
                Atlas provides intelligent server lifecycle management, seamless player routing, and stateless proxy architecture for massive multiplayer worlds.
              </p>
              
              <div className="max-w-7xl mx-auto mt-20 px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-blue-500 mb-2">20:10</div>
                    <div className="text-gray-400">Atlas to Server Ratio</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-green-500 mb-2">100%</div>
                    <div className="text-gray-400">Encryption Offload</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-purple-500 mb-2">∞</div>
                    <div className="text-gray-400">Concurrent Players</div>
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

            {/* Architecture Diagram Section */}
            <section className="py-20 px-4">
              <div className="max-w-7xl mx-auto">
                <h2 className="text-3xl font-bold text-center mb-4">Architecture Overview</h2>
                <p className="text-gray-400 text-center mb-16 max-w-2xl mx-auto">
                  Atlas operates as a stateless proxy cluster that maintains server state and routes players intelligently across your game world infrastructure.
                </p>
                
                {/* Connection Flow Diagram - Horizontal Layout */}
                <Card className="p-8 mb-16">
                  <h3 className="text-xl font-semibold text-white mb-8 text-center">Connection Flow</h3>
                  
                  <div className="flex items-center justify-between max-w-6xl mx-auto">
                    {/* Game Clients */}
                    <div className="flex-1 text-center">
                      <div className="bg-blue-500/10 rounded-lg px-4 py-6 border border-blue-500/20">
                        <Users className="w-10 h-10 text-blue-400 mx-auto mb-3" />
                        <h4 className="font-semibold text-white text-lg mb-2">Game Clients</h4>
                        <p className="text-sm text-gray-400">Encrypted WebSocket connections</p>
                        
                        {/* Client instances */}
                        <div className="flex justify-center gap-2 mt-4">
                          <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                          <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                          <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Arrow Right */}
                    <div className="px-6">
                      <ArrowRight className="w-8 h-8 text-gray-400" />
                    </div>
                    
                    {/* Atlas Cluster */}
                    <div className="flex-1 text-center">
                      <div className="bg-orange-500/10 rounded-lg px-4 py-6 border border-orange-500/20">
                        <Network className="w-10 h-10 text-orange-400 mx-auto mb-3" />
                        <h4 className="font-semibold text-white text-lg mb-2">Atlas Cluster</h4>
                        <p className="text-sm text-gray-400 mb-4">Stateless proxy handling encryption</p>
                        
                        {/* Atlas instances */}
                        <div className="flex justify-center gap-2">
                          <div className="bg-gray-800/50 rounded px-2 py-1 text-xs">
                            <Monitor className="w-3 h-3 inline mr-1 text-orange-400" />
                            Atlas 1
                          </div>
                          <div className="bg-gray-800/50 rounded px-2 py-1 text-xs">
                            <Monitor className="w-3 h-3 inline mr-1 text-orange-400" />
                            Atlas 2
                          </div>
                          <div className="bg-gray-800/50 rounded px-2 py-1 text-xs">
                            <Monitor className="w-3 h-3 inline mr-1 text-orange-400" />
                            Atlas 3
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Arrow Right */}
                    <div className="px-6">
                      <ArrowRight className="w-8 h-8 text-gray-400" />
                    </div>
                    
                    {/* Game Servers */}
                    <div className="flex-1 text-center">
                      <div className="bg-green-500/10 rounded-lg px-4 py-6 border border-green-500/20">
                        <Server className="w-10 h-10 text-green-400 mx-auto mb-3" />
                        <h4 className="font-semibold text-white text-lg mb-2">Game Servers</h4>
                        <p className="text-sm text-gray-400 mb-4">Horizon instances handling logic</p>
                        
                        {/* Game server instances */}
                        <div className="flex justify-center gap-2">
                          <div className="bg-gray-800/50 rounded px-2 py-1 text-xs">
                            <Database className="w-3 h-3 inline mr-1 text-green-400" />
                            Server 1
                          </div>
                          <div className="bg-gray-800/50 rounded px-2 py-1 text-xs">
                            <Database className="w-3 h-3 inline mr-1 text-green-400" />
                            Server 2
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Player Journey Example */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <Card className="p-6">
                    <h3 className="text-xl font-semibold text-white mb-6">Player Journey Example</h3>
                    <div className="space-y-4">
                      {[
                        { step: 1, color: "blue", text: "Player connects to solar system A on node 5648", icon: <Globe2 className="w-4 h-4" /> },
                        { step: 2, color: "green", text: "Player explores and eventually disconnects", icon: <Activity className="w-4 h-4" /> },
                        { step: 3, color: "purple", text: "Player state and coordinates saved to disk", icon: <Database className="w-4 h-4" /> },
                        { step: 4, color: "orange", text: "Atlas queries shard directory on reconnect", icon: <Route className="w-4 h-4" /> },
                        { step: 5, color: "red", text: "Player routed to current node for their region", icon: <Zap className="w-4 h-4" /> }
                      ].map((item, index) => (
                        <div key={index} className="flex gap-4">
                          <div className={`flex-shrink-0 w-8 h-8 rounded-full bg-${item.color}-500/20 flex items-center justify-center text-${item.color}-400 text-sm font-mono`}>
                            {item.step}
                          </div>
                          <div className="flex items-center gap-2 pt-1">
                            <div className={`text-${item.color}-400`}>{item.icon}</div>
                            <p className="text-gray-300">{item.text}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                  
                  <Card className="p-6">
                    <h3 className="text-xl font-semibold text-white mb-6">Key Benefits</h3>
                    <div className="space-y-4">
                      {[
                        { icon: <Layers className="w-5 h-5 text-blue-400" />, title: "Cluster State Management", desc: "Maintains bounds and connection info of all server instances" },
                        { icon: <Globe2 className="w-5 h-5 text-green-400" />, title: "Spatial Integration", desc: "Integrates with spatial object save system for routing" },
                        { icon: <Zap className="w-5 h-5 text-purple-400" />, title: "Dynamic Assignment", desc: "No assumption that nodes always run the same regions" },
                        { icon: <Shield className="w-5 h-5 text-orange-400" />, title: "Load Offloading", desc: "Handles encryption/decryption to reduce server load" }
                      ].map((benefit, index) => (
                        <div key={index} className="flex gap-3">
                          <div className="flex-shrink-0">{benefit.icon}</div>
                          <div>
                            <h4 className="font-semibold text-white text-sm mb-1">{benefit.title}</h4>
                            <p className="text-gray-400 text-sm">{benefit.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              </div>
            </section>

            {/* Performance Benefits */}
            <section className="py-20 px-4">
              <div className="max-w-7xl mx-auto">
                <h2 className="text-3xl font-bold text-center mb-4">Performance & Scalability</h2>
                <p className="text-gray-400 text-center mb-16 max-w-2xl mx-auto">
                  Atlas enables unprecedented scalability by decoupling connection management from game logic processing.
                </p>
                
                <Card className="p-8">
                  <div className="text-center mb-8">
                    <Shield className="w-12 h-12 mx-auto text-blue-400 mb-4" />
                    <h3 className="text-2xl font-bold text-white mb-4">Encryption & Decryption Offloading</h3>
                    <p className="text-gray-300 max-w-3xl mx-auto">
                      Atlas handles all WebSocket encryption and decryption, freeing game servers to focus entirely on game logic and enabling higher concurrent player counts.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h4 className="font-semibold text-red-400 mb-4 flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                        Without Atlas
                      </h4>
                      <div className="space-y-2 text-sm text-gray-300">
                        <div className="flex items-center gap-2">
                          <Cpu className="w-4 h-4 text-red-400" />
                          <span>Game servers handle encryption/decryption</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Activity className="w-4 h-4 text-red-400" />
                          <span>Higher CPU usage per connection</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-red-400" />
                          <span>Limited concurrent players per server</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Server className="w-4 h-4 text-red-400" />
                          <span>Scaling requires more game servers</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-green-400 mb-4 flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                        With Atlas
                      </h4>
                      <div className="space-y-2 text-sm text-gray-300">
                        <div className="flex items-center gap-2">
                          <Shield className="w-4 h-4 text-green-400" />
                          <span>Atlas handles all encryption/decryption</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Zap className="w-4 h-4 text-green-400" />
                          <span>Game servers focus purely on game logic</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-green-400" />
                          <span>Higher concurrent player capacity</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Network className="w-4 h-4 text-green-400" />
                          <span>Independent scaling of proxy layer</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </section>

            {/* Monitoring & Observability */}
            <section className="py-20 px-4">
              <div className="max-w-7xl mx-auto">
                <h2 className="text-3xl font-bold text-center mb-4">Real-time Monitoring</h2>
                <p className="text-gray-400 text-center mb-16 max-w-2xl mx-auto">
                  Built-in observability tools help you understand player movement patterns and server performance across your entire game world.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <Card className="p-6">
                    <Activity className="w-8 h-8 text-blue-400 mb-4" />
                    <h3 className="text-lg font-semibold text-white mb-3">Player Flow Analytics</h3>
                    <p className="text-gray-400 text-sm mb-4">Track player movement between regions and identify high-traffic zones that need additional server capacity.</p>
                    <div className="bg-gray-800/30 rounded p-3 text-xs font-mono">
                      <div className="text-green-400">Region A → B: 147 players/min</div>
                      <div className="text-yellow-400">Region C load: 89%</div>
                    </div>
                  </Card>
                  
                  <Card className="p-6">
                    <Monitor className="w-8 h-8 text-green-400 mb-4" />
                    <h3 className="text-lg font-semibold text-white mb-3">Server Health Metrics</h3>
                    <p className="text-gray-400 text-sm mb-4">Monitor CPU, memory, and connection counts across all Atlas instances and game servers.</p>
                    <div className="bg-gray-800/30 rounded p-3 text-xs font-mono">
                      <div className="text-blue-400">Atlas-01: 234 active connections</div>
                      <div className="text-green-400">Memory: 2.1GB / 8GB</div>
                    </div>
                  </Card>
                  
                  <Card className="p-6">
                    <Route className="w-8 h-8 text-purple-400 mb-4" />
                    <h3 className="text-lg font-semibold text-white mb-3">Connection Routing</h3>
                    <p className="text-gray-400 text-sm mb-4">Visualize how players are distributed across server instances and identify routing inefficiencies.</p>
                    <div className="bg-gray-800/30 rounded p-3 text-xs font-mono">
                      <div className="text-purple-400">Avg routing time: 12ms</div>
                      <div className="text-orange-400">Queue depth: 3 connections</div>
                    </div>
                  </Card>
                </div>
              </div>
            </section>

            {/* Configuration & Management */}
            <section className="py-20 px-4 bg-black">
              <div className="max-w-7xl mx-auto">
                <h2 className="text-3xl font-bold text-center mb-4">Configuration Management</h2>
                <p className="text-gray-400 text-center mb-16 max-w-2xl mx-auto">
                  Atlas provides flexible configuration options for different deployment scenarios and scaling requirements.
                </p>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <Card className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Layers className="w-6 h-6 text-blue-400" />
                      <h3 className="text-xl font-semibold text-white">Deployment Modes</h3>
                    </div>
                    <div className="space-y-4">
                      <div className="border-l-2 border-blue-400 pl-4">
                        <h4 className="font-medium text-white mb-1">Single Region</h4>
                        <p className="text-sm text-gray-400">Deploy Atlas alongside game servers for low-latency local routing</p>
                      </div>
                      <div className="border-l-2 border-green-400 pl-4">
                        <h4 className="font-medium text-white mb-1">Multi-Region</h4>
                        <p className="text-sm text-gray-400">Distribute Atlas instances across geographic regions for global coverage</p>
                      </div>
                      <div className="border-l-2 border-purple-400 pl-4">
                        <h4 className="font-medium text-white mb-1">Hybrid Cloud</h4>
                        <p className="text-sm text-gray-400">Mix on-premise and cloud deployments with intelligent failover</p>
                      </div>
                    </div>
                  </Card>
                  
                  <Card className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Cpu className="w-6 h-6 text-green-400" />
                      <h3 className="text-xl font-semibold text-white">Resource Planning</h3>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center py-2 px-3 bg-gray-800/30 rounded">
                        <span className="text-sm text-gray-300">Atlas Instance</span>
                        <span className="text-sm text-blue-400">2 vCPU, 4GB RAM</span>
                      </div>
                      <div className="flex justify-between items-center py-2 px-3 bg-gray-800/30 rounded">
                        <span className="text-sm text-gray-300">Concurrent Players</span>
                        <span className="text-sm text-green-400">1,000+ per instance</span>
                      </div>
                      <div className="flex justify-between items-center py-2 px-3 bg-gray-800/30 rounded">
                        <span className="text-sm text-gray-300">Network Overhead</span>
                        <span className="text-sm text-purple-400">&lt; 5% latency impact</span>
                      </div>
                      <div className="flex justify-between items-center py-2 px-3 bg-gray-800/30 rounded">
                        <span className="text-sm text-gray-300">Recommended Ratio</span>
                        <span className="text-sm text-orange-400">1:10 Atlas:Server</span>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gray-900/50">
              <div className="max-w-4xl mx-auto text-center px-4">
                <h2 className="text-3xl font-bold text-white mb-6">
                  Ready to Scale Your Game World?
                </h2>
                <p className="text-gray-400 mb-8">
                  Horizon Atlas will enable massive, persistent worlds with seamless player experiences. Stay tuned for development updates.
                </p>
                <div className="flex gap-4 justify-center">
                  <Link href="/community">
                    <button className="px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-colors flex items-center gap-2">
                      Join Community <Users className="w-5 h-5" />
                    </button>
                  </Link>
                  <Link href="/docs">
                    <button className="px-8 py-4 border border-gray-700 hover:border-gray-600 rounded-lg text-gray-300 transition-colors flex items-center gap-2">
                      View Documentation <ArrowRight className="w-5 h-5" />
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