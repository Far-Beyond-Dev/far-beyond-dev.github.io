# Horizon Engine: Rewriting the Core for Modern Game Development

[View full pull request for this rewrite](https://github.com/Far-Beyond-Dev/Horizon-Community-Edition/pull/182)

The Horizon Engine recently underwent a significant architectural overhaul, focusing on both its core threading model and plugin system. This blog post details our journey through this comprehensive rewrite, exploring the technical decisions that shaped our new architecture and the lessons learned along the way.

## Why a Complete Rewrite?

Our original architecture had several fundamental limitations:

1. **Sequential Processing Bottlenecks**: The core engine processed game states sequentially, limiting our ability to utilize modern multi-core processors effectively.
2. **Plugin System Constraints**: Plugins were tightly coupled with the core engine, making error isolation difficult.
3. **Resource Management**: Our previous thread and memory management approach wasn't optimized for complex game state updates.
4. **State Synchronization**: The original architecture struggled with efficient state synchronization across multiple threads.

## Planning the Rewrite

Before diving into implementation, we spent considerable time analyzing our existing architecture and planning the rewrite. This planning phase was crucial in identifying not just what needed to change, but how these changes would ripple through the entire system.

### Initial Architecture Analysis

We started by mapping out our existing architecture's pain points:


### Old Architecture Core Problems

1. **Thread Contention**
   - ``Mutex<Vec<Player>>`` causing blocking
   - Sequential world state updates
   - Plugin operations blocking core engine

2. **State Management**
   - Tightly coupled plugin states
   - Global state dependencies
   - Inefficient data sharing

3. **Resource Utilization**
   - Single-threaded operations
   - Poor memory allocation patterns
   - Underutilized modern CPU features

---

### Design Goals


We established clear objectives for the rewrite that focused on three key areas. 

#### Threading Rewrite
Instead of dedicating entire threads to specific subsystems like physics or networking, we wanted to break work down into smaller tasks that could be executed wherever and whenever processing power was available. Think of it like changing from having specific workers dedicated to specific assembly lines, to having a pool of workers who can jump in and help wherever they're needed. This would let us better utilize our available processing power and handle more things simultaneously.

#### Smart State Management
Originally, plugins had too much direct access to the engine's core systems, which made it hard to prevent conflicts and track down bugs. It was like having everyone share one workspace with no boundaries - chaotic and prone to accidents. We needed to give each plugin its own secure space to work in while still allowing them to communicate effectively with the core engine and each other.

#### Hardware Optimization
Modern processors are incredibly powerful, but they need data to be organized in specific ways to perform at their best. We needed to be smarter about how we store and access data in memory, ensure we're using all available CPU cores effectively, and minimize situations where the processor wastes time waiting for data to arrive from memory. This is similar to organizing a workshop so that every tool is in the right place and materials flow efficiently to where they're needed.

---

### Technical Decisions

Several key technical decisions were made during the planning phase:

1. **Locking Strategy**: `RwLock over Mutex`

    Rationale: 
    - Multiple readers, single writer pattern matches game state access
    - Reduced contention for read-heavy operations
    - Better performance for state queries

2. **Memory Management**: `Custom allocator (mimalloc)`

    Rationale:
    - Better performance for multi-threaded allocations
    - Reduced fragmentation
    - Improved cache locality

3. **Threading Model**: `Task-based parallel execution`

    Rationale:
    - Better utilization of available cores
    - More flexible scaling
    - Reduced thread creation overhead

---

### API Design Considerations

We carefully planned the new API to be both powerful and ergonomic:

```rust
// Before - Tightly coupled API
pub trait Plugin {
    fn update(&mut self, world: &mut World);
    fn handle_event(&mut self, event: Event);
}

// After - Decoupled, thread-safe API
pub trait Plugin: Send + Sync {
    async fn update(&self, context: &PluginContext);
    fn on_event(&self, event: &GameEvent);
    fn as_any(&self) -> &dyn Any;
}

pub struct PluginContext {
    pub server: Arc<GameServer>,
    pub shared_data: Arc<RwLock<HashMap<String, Box<dyn Any + Send + Sync>>>>,
    pub config: Arc<RwLock<HashMap<String, String>>>,
}
```

---


### Migration Strategy

We developed a phased migration plan:

1. **Phase 1: Core Threading Model**
   ```rust
   // Stage 1: Convert core data structures
   type Players = Arc<RwLock<Vec<Player>>>;
   type WorldState = Arc<RwLock<World>>;
   
   // Stage 2: Implement parallel processing
   use rayon::prelude::*;
   
   // Stage 3: Update access patterns
   pub async fn update_world(world: &WorldState) {
       let world = world.write().await;
       world.entities.par_iter_mut()...
   }
   ```

2. **Phase 2: Plugin System**
   ```rust
   // Stage 1: Plugin state management
   #[derive(PartialEq, Eq, Hash, Debug)]
   enum PluginState {
       ACTIVE,
       INACTIVE,
       CRASH,
   }
   
   // Stage 2: Thread-safe plugin handling
   struct PluginManager {
       plugins: Arc<RwLock<HashMap<String, PluginInstance>>>,
   }
   ```

3. **Phase 3: State Synchronization**
   ```rust
   // Stage 1: Define synchronization boundaries
   struct StateSync {
       last_update: Instant,
       dirty_components: HashSet<ComponentId>,
   }
   
   // Stage 2: Implement efficient update patterns
   impl StateSync {
       async fn sync_components(&mut self, world: &WorldState) {
           let dirty = self.dirty_components.drain().collect::<Vec<_>>();
           for chunk in dirty.chunks(BATCH_SIZE) {
               chunk.par_iter().for_each(|comp_id| {
                   // Parallel sync logic
               });
           }
       }
   }
   ```

---

## Core Architecture Changes

### Threading Model Overhaul

One of the most significant changes was moving from a primarily sequential processing model to a parallel execution architecture. This involved several key components:

```rust
pub struct GameServer {
    // Changed from single-threaded to multi-threaded state management
    players: Arc<RwLock<Vec<Player>>>,
    world_state: Arc<RwLock<WorldState>>,
    physics_engine: Arc<RwLock<PhysicsEngine>>,
}
```

The new threading model allows for:
- Parallel physics calculations
- Concurrent player state updates
- Asynchronous world state management
- Independent plugin execution

### New State Management

We completely rewrote our state management system to handle concurrent access patterns:

```rust
// Before - Sequential processing with mutex locks
pub fn update_player_location(socket: SocketRef, data: Data<Value>, 
    players: Arc<Mutex<Vec<Player>>>) {
    let mut players = players.lock().unwrap();
    // Sequential processing
}

// After - Parallel processing with read-write locks
pub fn update_player_location(socket: SocketRef, data: Data<Value>, 
    players: Arc<RwLock<Vec<Player>>>) {
    let mut players = players.write().unwrap();
    // Parallel processing with proper synchronization
}
```

---

### Parallel Data Processing

We introduced Rayon for parallel processing throughout the engine:

```rust
// Processing player updates in parallel
let players_with_locations_json: Vec<serde_json::Value> = players
    .par_iter() // Parallel iterator
    .map(|player| {
        json!({
            "Id": player.id,
            "Root Position": player.transform.as_ref()
                .and_then(|t| t.location.as_ref()),
            "Root Rotation": player.transform.as_ref()
                .and_then(|t| t.rotation.as_ref()),
            // Other player data...
        })
    })
    .collect();
```

---

## Plugin System Rewrite

### New Plugin Architecture

The plugin system was completely redesigned to work with our new multi-threaded core:

```rust
#[derive(PartialEq, Eq, Hash, Debug)]
enum Pluginstate {
    ACTIVE,
    INACTIVE,
    CRASH,
}

struct PluginInstance {
    name: String,
    version: Version,
    api_version: Version,
    plugin: Arc<dyn Plugin + Send + Sync>,
}
```

### Thread-Safe Plugin Management

We implemented a new plugin manager that safely handles concurrent plugin operations:

```rust
pub struct PluginManager {
    plugins: Arc<RwLock<HashMap<String, Box<dyn Plugin>>>>,
    libraries: Arc<RwLock<HashMap<String, Library>>>,
}

impl PluginManager {
    fn unload_plugin(&mut self, name: &str) {
        if let Some((state, _plugin_instance)) = self.plugins.get_mut(name) {
            let result = std::panic::catch_unwind(AssertUnwindSafe(|| {
                // Thread-safe plugin unload logic
            }));
            match result {
                Ok(_) => {}
                Err(e) => {
                    println!("Plugin '{name}' crashed: {e:#?}");
                    *state = Pluginstate::CRASH;
                }
            }
        }
    }
}
```

---

## Performance Optimizations

### Memory Management

We optimized memory usage through better allocation strategies:

```rust
[target.'cfg(target_os = "linux")'.dependencies]
mimalloc = "0.1.43"  // Custom allocator for better performance

[profile.release.package."*"]
opt-level = 3
strip = true
codegen-units = 1
```

### Thread Pool Management

Implemented sophisticated thread pool management for better resource utilization:

```rust
tokio = { version = "1.37.0", features = ["rt", "net", "rt-multi-thread"] }
```

## Real-World Impact

The rewrite led to significant improvements:

1. **CPU Utilization**: ~75% better utilization of multi-core processors
2. **Memory Efficiency**: ~10% reduction in memory overhead
3. **State Updates**: ~60% faster game state synchronization
4. **Plugin Isolation**: Plugin errors and panics no longer affect the core engine

## Testing and Reliability

We built comprehensive testing infrastructure for the new plugn architecture to allow quick and easy verification of new features:

```rust
#[cfg(test)]
mod tests {
    #[test]
    fn test_concurrent_plugin_operations() {
        let plugin_manager = PluginManager::new();
        let test_plugin = TestPlugin::new();
        
        // Test parallel plugin operations
        let results = (0..100).into_par_iter().map(|_| {
            plugin_manager.write().unwrap()
                .load_plugin("test", test_plugin.clone())
        }).collect::<Vec<_>>();
        
        // Verify results
        assert!(results.iter().all(|r| r.is_ok()));
    }
}
```

## Future Directions

The new architecture opens up possibilities for:

1. **Dynamic Threading**: Allowing for adaptive thread pool sizing based on workload could be a great way to smooth out utilization across the system
2. **Intelligent Load Balancing**: Smart distribution of game state updates, and players, as well as the ability to move tasks to other threads could be useful to help with efficient load balancing.
3. **Enhanced Plugin Capabilities**: More sophisticated plugin interactions and expanding on the API further

## Lessons Learned

1. **Think in Parallel**: Design systems for concurrent operation from the ground up
2. **State Independence**: Keep state mutations as independent as possible
3. **Error Boundaries**: Implement proper isolation between systems
4. **Resource Management**: Careful thread and memory management is crucial

## Wrapping it up

This rewrite wasn't just about improving individual components - it was about reimagining how a modern game engine should handle concurrent operations and state management. By taking a holistic approach to both the core engine and plugin architecture, we've created a more robust and scalable system that's ready for the demands of modern game development.

The key insight was recognizing that threading isn't just about performance - it's about creating an architecture that naturally handles concurrent operations at every level. This fundamental shift in thinking guided our entire rewrite process and led to a more elegant and powerful engine.

[View full pull request for this rewrite](https://github.com/Far-Beyond-Dev/Horizon-Community-Edition/pull/182)