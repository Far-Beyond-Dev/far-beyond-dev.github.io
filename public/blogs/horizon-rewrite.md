# Evolution of Horizon: Plugins, Threading, and Simplification

# Introduction
In this deep dive, we'll explore how the Horizon game server evolved from a monolithic single-threaded architecture to a modern, multi-threaded system. We'll examine both the plugin system transformation and the core server architecture changes.

## The plugins system: A Complex Web of Traits

Our original plugin system was built around a complex hierarchy of traits, with `BaseAPI` at its core. This approach seemed elegant at first, offering a rich set of features through composition:

```rust
#[async_trait]
pub trait BaseAPI: Send + Sync {
    fn on_game_event(&self, event: &GameEvent);
    async fn on_game_tick(&self, delta_time: f64);
    fn get_config(&self) -> Option<&dyn PluginConfig> { None }
    fn get_logger(&self) -> Option<&dyn PluginLogger> { None }
    fn as_any(&self) -> &dyn Any;
}
```

Every plugin needed to implement multiple traits: `PluginConfig` for configuration, `PluginLogger` for logging, and `CommandHandler` for command processing. This led to verbose plugin implementations that often looked like this:

```rust
#[async_trait]
impl BaseAPI for MyPlugin {
    fn on_game_event(&self, event: &GameEvent) {
        // Handle events
    }
    
    async fn on_game_tick(&self, delta_time: f64) {
        // Handle tick
    }
    
    fn get_config(&self) -> Option<&dyn PluginConfig> {
        Some(&self.config)
    }
    
    fn get_logger(&self) -> Option<&dyn PluginLogger> {
        Some(&self.logger)
    }
}
```

### The Breaking Point: RPC and Custom Events

The system became even more complex when we added RPC support:

```rust
pub type RpcFunction = Arc<dyn Fn(&(dyn Any + Send + Sync)) -> Box<dyn Any + Send + Sync> + Send + Sync>;

#[async_trait]
pub trait RpcPlugin: Send + Sync {
    fn get_id(&self) -> Uuid;
    fn get_name(&self) -> String;
    fn register_rpc(&mut self, name: &str, func: RpcFunction);
    async fn call_rpc(&self, rpc_name: &str, params: &(dyn Any + Send + Sync)) 
        -> Option<Box<dyn Any + Send + Sync>>;
}
```

This complexity made plugin development a specialized skill rather than a straightforward task.

### The Solution: Embracing Simplicity

Our new system strips away the complexity in favor of a straightforward structure:

```rust
struct Plugin {
    name: String,
    version: Version,
    api_version: Version
}

struct PluginManager {
    plugins: HashMap<String,(Pluginstate,Plugin)>
}
```

#### Explicit State Management

Instead of implicit state through trait implementations, we now have clear, explicit states:

```rust
enum Pluginstate {
    ACTIVE,
    INACTIVE,
    CRASH,
}
```

This makes it immediately clear what state a plugin is in, which was previously buried in trait implementations.

#### Simplified Plugin Loading

The old system required complex async trait implementations for loading:

```rust
impl PluginContext {
    pub async fn register_rpc_plugin(&mut self, plugin: Arc<RwLock<dyn RpcPlugin>>) {
        let plugin_id = plugin.read().await.get_id();
        let mut shared_data = self.shared_data.write().await;
        shared_data.insert(format!("rpc_plugin_{}", plugin_id), Box::new(plugin));
    }
}
```

Now, it's straightforward:

```rust
pub fn load_all(socket: SocketRef, players: Arc<RwLock<Vec<Player>>>) {
    let plugins = plugin_imports::load_plugins(socket, players);
    let my_test_plugin = get_plugin!(test_plugin, plugins);
    let result = my_test_plugin.thing();
    println!("{}", result);
}
```

#### Type-Safe Plugin Access

Instead of complex trait bounds and dynamic dispatch, we use a simple macro:

```rust
macro_rules! get_plugin {
    ($name:ident, $plugins:expr) => {
        $plugins
            .get(stringify!($name))
            .map(|p| &p.instance as &dyn $name::Plugin_API)
            .expect(&format!("Plugin {} not found", stringify!($name)))
    };
}
```

This provides compile-time safety with minimal boilerplate.

#### The Impact on Plugin Development

Before:
```rust
pub struct MyPlugin {
    config: MyConfig,
    logger: MyLogger,
    rpc_handlers: HashMap<String, RpcFunction>,
    custom_events: Vec<CustomEvent>,
}

#[async_trait]
impl BaseAPI for MyPlugin {
    // Implement multiple required methods
}

impl PluginConfig for MyPlugin {
    // Implement config methods
}

impl PluginLogger for MyPlugin {
    // Implement logging methods
}

#[async_trait]
impl RpcPlugin for MyPlugin {
    // Implement RPC methods
}
```

After:
```rust
pub struct MyPlugin {
    name: String,
    version: Version,
}

impl PluginManager {
    fn load_plugin(&mut self, name: String, plugin: Plugin) {
        self.plugins.insert(name, (Pluginstate::ACTIVE, plugin));
    }
}
```

### Real-World Benefits

#### Versioning and Compatibility
Before, version compatibility was handled through trait implementations:
```rust
pub const PLUGIN_API_VERSION: ApiVersion = ApiVersion::new(0, 1, 0);
```

Now, it's a simple struct comparison:
```rust
struct Version {
    major: u16,
    minor: u16,
    hotfix: u16,
}
```

#### Plugin Management
The old system scattered plugin management across multiple traits and implementations. Now it's centralized:

```rust
impl PluginManager {
    fn new() -> PluginManager {
        let new_manager = PluginManager {
            plugins: HashMap::new(),
        };
        new_manager
    }
    
    fn load_plugin(&mut self, name: String, plugin: Plugin) {
        self.plugins.insert(name, (Pluginstate::ACTIVE, plugin));
    }
    
    fn unload_plugin(&mut self, name: String) {
        self.plugins.remove(&name);
    }
}
```

## Core Server Architecture Transformation

### The Original Server Architecture

The original server was monolithic:

```rust
async fn on_connect(socket: SocketRef, Data(data): Data<Value>, players: Arc<Mutex<Vec<Player>>>) {
    socket.emit("connected", &true).ok();
    let id = socket.id.as_str();
    
    // Single-threaded player management
    let player = Player::new(socket.clone(), Uuid::new_v4());
    players.lock().unwrap().push(player.clone());
}
```

Key limitations:
1. Single thread for all player connections
2. Mutex-based player list management
3. No separation of concerns
4. Limited scalability

### The New Multi-threaded Architecture

The new system introduces thread pools and better resource management:

```rust
#[derive(Clone)]
struct PlayerThreadPool {
    start_index: usize,
    end_index: usize,
    players: Arc<RwLock<Vec<Player>>>,
    sender: mpsc::Sender<PlayerMessage>,
    logger: Arc<HorizonLogger>,
}

struct HorizonServer {
    thread_pools: Arc<Vec<Arc<PlayerThreadPool>>>,
    runtime: Arc<Runtime>,
    logger: Arc<HorizonLogger>,
}
```

Key improvements:
1. Dedicated thread pools for player management
2. Message-based communication
3. Proper logging system
4. Better resource utilization

## Deep Dive: Architectural Changes

### 1. Player Management

Old approach:
```rust
let players: Arc<Mutex<Vec<Player>>> = Arc::new(Mutex::new(Vec::new()));

// Single lock for all operations
players.lock().unwrap().push(player);
```

New approach:
```rust
const PLAYERS_PER_POOL: usize = 1000;
const NUM_THREAD_POOLS: usize = 32;

enum PlayerMessage {
    NewPlayer(SocketRef, Value),
    RemovePlayer(Uuid),
}

// Multiple pools with message-based communication
impl HorizonServer {
    async fn handle_new_connection(&self, socket: SocketRef, data: Data<Value>) {
        match self.thread_pools.iter().find(|pool| {
            let players = pool.players.read().unwrap();
            players.len() < PLAYERS_PER_POOL
        }) {
            Some(selected_pool) => {
                selected_pool.sender
                    .send(PlayerMessage::NewPlayer(socket, data.0)).await?;
            }
            // ...
        }
    }
}
```

### 2. Plugin Integration

Old system:
```rust
async fn on_connect(socket: SocketRef, Data(data): Data<Value>, players: Arc<Mutex<Vec<Player>>>) {
    let all_plugins = plugins::plugins();
    
    for (ref name, ref plugin) in all_plugins.list.iter() {
        plugin.broadcast_game_event(
            &&plugin.get_plugin(), 
            plugin_api::GameEvent::PlayerJoined(player.clone())
        );
    }
}
```

New system:
```rust
impl PlayerThreadPool {
    async fn handle_message(msg: PlayerMessage, pool: &PlayerThreadPool) {
        match msg {
            PlayerMessage::NewPlayer(socket, data) => {
                let player = Player::new(socket.clone(), Uuid::new_v4());
                plugin_test_api::load_all(socket.clone(), pool.players.clone());
            }
            // ...
        }
    }
}
```

### 3. Logging and Error Handling

Old system:
```rust
println!("Welcome player {} to the game!", id);
println!("Player {} added to players list for socket id: {}", player.id, id);
```

New system:
```rust
log_info!(pool.logger, "CONNECTION", "Player {} connected successfully", 
    socket.id.as_str());
log_debug!(pool.logger, "PLAYER", "Player {} (UUID: {}) added to pool", 
    id, player.id);
```

### 4. Server Initialization

Old system:
```rust
#[main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let init_time = Instant::now();
    let players: Arc<Mutex<Vec<Player>>> = Arc::new(Mutex::new(Vec::new()));
    // ...
}
```

New system:
```rust
impl HorizonServer {
    fn new() -> Self {
        let runtime = Arc::new(Runtime::new().unwrap());
        let mut thread_pools = Vec::new();
        let logger = Arc::new(HorizonLogger::new());

        for i in 0..NUM_THREAD_POOLS {
            // Initialize thread pools
        }
        // ...
    }
}
```

## Lessons Learned

1. Simplicity Over Complexity
   - Removed unnecessary abstraction layers
   - Simplified plugin API

2. Message-Based Architecture
   - Replaced direct function calls
   - Better error handling

3. Resource Management
   - Thread pools for scalability
   - Better connection handling

5. Type Safety
   - Stronger compile-time guarantees
   - Clearer error messages

6. The original system demonstrated how feature creep can lead to unnecessary complexity:
   - Multiple interacting traits
   - Complex async patterns
   - Overly flexible extension points

7. The new system shows the benefits of simplification:
   - Clear, explicit states
   - Centralized management
   - Simpler plugin development workflow

8. Key takeaways:
   - Complex trait hierarchies often indicate design issues
   - Explicit state management is better than implicit
   - Simple structures are easier to maintain and understand


## Future Considerations

1. Further Performance Optimizations
   - Dynamic thread pool scaling
   - Better load balancing

2. Enhanced Monitoring
   - Metrics collection
   - Performance analytics

3. Plugin System Enhancements
   - Hot reloading improvements
   - Better version management


# Wrapping it up

This transformation represents a fundamental shift in both our plugin architecture and core server design. By moving from a single-threaded design to a multi-threaded architecture, we've created a more scalable and maintainable, and efficient system.

This rewrite wasn't just about improving individual components - it was about reimagining how a modern game server should handle concurrent operations and state management. By taking a holistic approach to both the core server and plugin architecture, we've created a more robust and scalable system that's ready for the demands of modern game development.