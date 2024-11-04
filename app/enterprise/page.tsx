import React from "react";
import { Card } from "@/components/ui/card";
import { 
  Shield, 
  Settings, 
  Server, 
  Grid, 
  Lock,
  Activity,
  Gauge,
  Boxes,
  RefreshCw,
  LineChart,
  Sliders,
  Building2,
  Network,
  Cpu,
  Scale
} from "lucide-react";

export default function Enterprise() {
  const architectureFeatures = [
    {
      title: "Master Node",
      description: "Oversees the entire network, managing global state and coordination",
      icon: <Cpu className="w-6 h-6 text-purple-400" />
    },
    {
      title: "Parent Nodes",
      description: "Regional coordinators managing subsets of Child nodes",
      icon: <Network className="w-6 h-6 text-blue-400" />
    },
    {
      title: "Child Nodes",
      description: "Handle individual game instances or regions",
      icon: <Server className="w-6 h-6 text-green-400" />
    }
  ];

  const features = [
    {
      title: "Advanced Load Balancing",
      description: "Sophisticated resource allocation across nodes",
      icon: <Scale className="w-6 h-6 text-blue-400" />
    },
    {
      title: "Centralized Management",
      description: "Single dashboard for entire network control",
      icon: <Grid className="w-6 h-6 text-green-400" />
    },
    {
      title: "Enhanced Security",
      description: "Enterprise-grade access controls and monitoring",
      icon: <Lock className="w-6 h-6 text-yellow-400" />
    },
    {
      title: "Performance Monitoring",
      description: "Real-time metrics and analytics",
      icon: <Activity className="w-6 h-6 text-purple-400" />
    },
    {
      title: "Global Configuration",
      description: "Hierarchical settings management",
      icon: <Settings className="w-6 h-6 text-red-400" />
    },
    {
      title: "Region Management",
      description: "Geographical server organization",
      icon: <Boxes className="w-6 h-6 text-indigo-400" />
    }
  ];

  const benefits = [
    {
      title: "Limitless Scalability",
      description: "The Parent-Child-Master architecture enables truly unlimited scaling for massive multiplayer environments, with each layer optimizing communication and resource management.",
      icon: <RefreshCw className="w-8 h-8 text-blue-400" />
    },
    {
      title: "Advanced Coordination",
      description: "Hierarchical structure provides sophisticated load balancing, fault tolerance, and centralized management through the Master node.",
      icon: <Sliders className="w-8 h-8 text-green-400" />
    },
    {
      title: "Enterprise Performance",
      description: "Built for large-scale commercial games and MMOs with advanced management features and robust synchronization capabilities.",
      icon: <LineChart className="w-8 h-8 text-purple-400" />
    }
  ];

  return (
    <div className="min-h-screen">
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-black" />
        <div className="relative max-w-7xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Horizon Enterprise Edition
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Advanced Parent-Child-Master architecture designed for massive-scale deployments and enterprise environments
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Parent-Child-Master Architecture
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {architectureFeatures.map((feature, index) => (
              <Card key={index} className="p-6">
                <div className="mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-400">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-white text-center mb-8">
            Enterprise Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <p className="text-gray-300">
                While the Community Edition supports multi-server deployment through a peer-to-peer model, Enterprise Edition offers an advanced Parent-Child-Master architecture for enhanced control and scalability.
              </p>
              <p className="text-gray-300">
                This hierarchical structure is ideal for large-scale commercial games and MMOs that require sophisticated load balancing, fault tolerance, and centralized management capabilities.
              </p>
              <p className="text-gray-300">
                With dedicated enterprise support and advanced monitoring tools, the Enterprise Edition is designed for organizations that need production-grade reliability and performance at massive scale.
              </p>
            </div>
            <Card className="p-8">
              <div className="flex justify-center mb-6">
                <Building2 className="w-16 h-16 text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold text-white text-center mb-4">
                Enterprise Benefits
              </h3>
              <ul className="space-y-4 text-gray-300">
                <li className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-green-400" />
                  <span>Enterprise Support</span>
                </li>
                <li className="flex items-center gap-2">
                  <Server className="w-5 h-5 text-green-400" />
                  <span>Multi-Server Support</span>
                </li>
                <li className="flex items-center gap-2">
                  <Gauge className="w-5 h-5 text-green-400" />
                  <span>Advanced Monitoring</span>
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="p-6 transition-all duration-300 hover:-translate-y-1">
                <div className="mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-400">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Enterprise Dashboard
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8 mb-16">
            <Card className="p-4">
              <img 
                src="/dashboard/Horizon-Dashboard12.png" 
                alt="Network metrics and global latency monitoring"
                className="w-full rounded-lg shadow-lg"
              />
              <p className="text-gray-400 text-center mt-4">
                Advanced network metrics and global latency monitoring
              </p>
            </Card>
            <Card className="p-4">
              <img 
                src="/dashboard/Horizon-Dashboard3.png" 
                alt="Cluster management and performance monitoring"
                className="w-full rounded-lg shadow-lg"
              />
              <p className="text-gray-400 text-center mt-4">
                Real-time cluster management and performance monitoring
              </p>
            </Card>
            <Card className="p-4">
              <img 
                src="/dashboard/Horizon-Dashboard8.png" 
                alt="Backup and restore management"
                className="w-full rounded-lg shadow-lg"
              />
              <p className="text-gray-400 text-center mt-4">
                Comprehensive backup and restore management
              </p>
            </Card>
            <Card className="p-4">
              <img 
                src="/dashboard/Horizon-Dashboard10.png" 
                alt="Security monitoring and vulnerability scanning"
                className="w-full rounded-lg shadow-lg"
              />
              <p className="text-gray-400 text-center mt-4">
                Enterprise-grade security monitoring and vulnerability scanning
              </p>
            </Card>
          </div>
        </div>
      </section>


      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="p-8 transition-all duration-300 hover:-translate-y-1">
                <div className="flex justify-center mb-6">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-4 text-center">
                  {benefit.title}
                </h3>
                <p className="text-gray-400 text-center">
                  {benefit.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}