import React from 'react';
import { CodeTabs } from '@/components/ui/code-tabs';
import { motion } from 'framer-motion';

const CodeBlock = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-neutral-900/50 rounded-lg p-4 my-4 overflow-x-auto">
    <pre className="text-sm text-neutral-200">{children}</pre>
  </div>
);

const Feature = ({ title, description }: { title: string; description: string }) => (
  <motion.div 
    className="border border-neutral-800 rounded-lg p-4 bg-neutral-900/20"
    whileHover={{ scale: 1.02 }}
    transition={{ duration: 0.2 }}
  >
    <h3 className="text-lg font-semibold mb-2 text-blue-400">{title}</h3>
    <p className="text-sm text-neutral-400">{description}</p>
  </motion.div>
);

export default function TabsDemo() {
  const tabs = [
    {
      id: 'core',
      title: 'core.rs',
      content: (
        <div>
          <h2 className="text-2xl font-bold mb-6 text-blue-500">Core Engine</h2>
          
          <CodeBlock>
            {`// Entity Component System Architecture
pub struct World {
    entities: EntityRegistry,
    components: ComponentStorage,
    systems: SystemRegistry,
}

impl World {
    pub fn new() -> Self {
        World {
            entities: EntityRegistry::new(),
            components: ComponentStorage::new(),
            systems: SystemRegistry::new(),
        }
    }
    
    pub fn update(&mut self, dt: f32) {
        self.systems.update(dt, &mut self.entities, &mut self.components);
    }
}`}
          </CodeBlock>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
            <Feature
              title="Data-Oriented Design"
              description="Optimal cache utilization through thoughtful data layout and memory access patterns"
            />
            <Feature
              title="Zero-Cost Abstractions"
              description="Leveraging Rust's compile-time guarantees for maximum performance"
            />
            <Feature
              title="Hot Reloading"
              description="Dynamic system reloading for rapid development iteration"
            />
            <Feature
              title="Multi-threaded"
              description="Parallel system execution for optimal performance"
            />
          </div>
        </div>
      ),
    },
    {
      id: 'physics',
      title: 'physics.rs',
      content: (
        <div>
          <h2 className="text-2xl font-bold mb-6 text-blue-500">Physics Engine</h2>
          
          <CodeBlock>
            {`pub struct PhysicsWorld {
    bodies: Vec<RigidBody>,
    constraints: Vec<Constraint>,
    broadphase: DynamicBVH,
}

impl PhysicsWorld {
    pub fn step(&mut self, dt: f32) {
        self.update_broadphase();
        let contacts = self.detect_contacts();
        self.solve_constraints(&contacts, dt);
        self.integrate_velocities(dt);
    }
}`}
          </CodeBlock>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
            <Feature
              title="Continuous Detection"
              description="Advanced collision detection for fast-moving objects"
            />
            <Feature
              title="Constraint Solver"
              description="Robust constraint-based physics simulation"
            />
            <Feature
              title="Dynamic BVH"
              description="Efficient broad-phase collision detection"
            />
            <Feature
              title="GPU Acceleration"
              description="Hardware-accelerated physics computations"
            />
          </div>
        </div>
      ),
    },
    {
      id: 'networking',
      title: 'network.rs',
      content: (
        <div>
          <h2 className="text-2xl font-bold mb-6 text-blue-500">Networking</h2>
          
          <CodeBlock>
            {`pub struct NetworkManager {
    transport: Transport,
    replication: StateReplication,
    prediction: ClientPrediction,
}

impl NetworkManager {
    pub fn update(&mut self) {
        self.transport.poll_events();
        self.replication.sync_state();
        self.prediction.reconciliate();
    }
}`}
          </CodeBlock>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
            <Feature
              title="Client Prediction"
              description="Smooth gameplay through predictive input handling"
            />
            <Feature
              title="Delta Compression"
              description="Efficient state synchronization with minimal bandwidth"
            />
            <Feature
              title="Lag Compensation"
              description="Fair gameplay despite varying network conditions"
            />
            <Feature
              title="WebRTC Support"
              description="Modern networking with P2P capabilities"
            />
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4">
      <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-blue-400 to-violet-400 text-transparent bg-clip-text">
        Core Features
      </h2>
      <CodeTabs tabs={tabs} />
    </div>
  );
}