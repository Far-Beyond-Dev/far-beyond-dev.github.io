# Developer Documentation - Overview

## 1. Overview

The Horizon Game Server is a sophisticated distributed system designed to manage communication and data transfer between multiple child servers and a master server. At its core, it operates within a "Region map" concept, where the master server keeps track of child server coordinates in a relative cubic light-year space. To ensure high precision, the server uses 64-bit floats for coordinate storage, allowing for vast virtual spaces without coordinate overflow issues.

Built with Rust, the server leverages the language's performance and safety features to create a robust and efficient game server. The choice of Rust provides benefits such as memory safety without garbage collection, concurrency without data races, and zero-cost abstractions, all of which are crucial for a high-performance game server.

## 2. Core Libraries and Tools

The server relies on several key libraries to achieve its functionality:

### 2.1 socketioxide
This library is used for WebSocket communication, providing a high-performance, asynchronous WebSocket server implementation. It allows for real-time, bidirectional communication between the server and clients, which is essential for responsive gameplay.

### 2.2 tokio
Tokio serves as the asynchronous runtime for the server. It provides the foundation for writing asynchronous code, managing tasks, and handling I/O operations efficiently. The use of tokio allows the server to handle numerous concurrent connections without blocking, significantly improving scalability.

### 2.3 serde_json
For JSON serialization and deserialization, the server employs serde_json. This library offers high-performance JSON handling, crucial for parsing and generating game state data, player information, and other JSON-formatted messages.

### 2.4 tracing
The tracing library is used for logging and debugging. It provides structured, event-based diagnostic information, allowing developers to easily track the flow of execution through the server and quickly identify issues.

### 2.5 mimalloc
On Linux systems, the server uses the mimalloc allocator. This high-performance memory allocator is particularly well-suited for concurrent systems, potentially offering better performance than the default system allocator.

## 3. Server Architecture

The server's architecture is modular and extensible, with its main entry point located in `main.rs`. This file is responsible for setting up the server, initializing various components, and beginning the listening process for incoming connections.

### 3.1 Main Function
The `main` function in `main.rs` serves as the entry point for the server. It performs several crucial setup tasks:

1. Initializes the logging system using `tracing`.
2. Sets up the socketioxide service for handling WebSocket connections.
3. Creates a shared data structure (`Arc<Mutex<Vec<Player>>>`) for managing connected players.
4. Defines event handlers for various socket events (e.g., connection, disconnection).
5. Creates and starts the HTTP server using the `viz` crate, which listens for incoming connections.

### 3.2 Modular Structure
The server's functionality is divided into several modules, each responsible for a specific aspect of the game server:

- `players.rs`: Manages player data and interactions.
- `chat.rs`: Handles in-game chat functionality.
- `game_logic.rs`: Implements core game mechanics.
- `leaderboard.rs`: Manages player rankings and scores.
- `notifications.rs`: Handles system-wide notifications.
- `plugin_manager.rs`: Manages the plugin system for extending server functionality.

This modular approach allows for easier maintenance, testing, and extension of the server's capabilities.

## 4. Player Management

Player management is a crucial aspect of the server, handled primarily by the module defined in `players.rs`. This module is responsible for managing the entire lifecycle of a player's interaction with the server.

### 4.1 Player Connection
When a new player connects, the `on_connect` function in `main.rs` is called. This function performs several important tasks:

1. Initializes a new `Player` struct with the connected socket and a unique ID.
2. Adds the player to the shared `players` vector.
3. Sets up event listeners for player-specific events (e.g., movement, chat messages).
4. Emits a series of events to the client to signal successful connection and authentication.

### 4.2 Player Data Structure
The `Player` struct, defined in `horizon_data_types.rs`, contains all relevant information about a player:

```rust
pub struct Player {
    pub socket: SocketRef,
    pub id: String,
    pub transform: Option<Transform>,
    pub health: f32,
    pub controlRotation: Option<Vec3D>,
    pub root_velocity: Option<Vec3D>,
    pub trajectory_path: Option<Vec<TrajectoryPoint>>,
    pub key_joints: Option<Vec<Vec3D>>,
    pub animation_state: Option<String>,
    pub is_active: bool,
    pub last_update: Instant,
}
```

This comprehensive structure allows the server to maintain a complete state for each player, including their position, health, movement data, and animation state.

### 4.3 Player Updates
The server continuously updates player information through various event handlers. For example, the `update_player_location` function processes incoming location updates from clients:

```rust
pub fn update_player_location(socket: SocketRef, data: Data<Value>, players: Arc<Mutex<Vec<Player>>>) {
    // Parse incoming data
    // Update player position, rotation, velocity, etc.
    // Broadcast updates to other players if necessary
}
```

This function parses the incoming JSON data, updates the player's state in the shared `players` vector, and optionally broadcasts the update to other players.

### 4.4 Player Disconnection
When a player disconnects, the `on_disconnect` function in `players.rs` is called. This function removes the player from the active players list and performs any necessary cleanup:

```rust
pub fn on_disconnect(socket: SocketRef, players: Arc<Mutex<Vec<Player>>>) {
    let mut players = players.lock().unwrap();
    players.retain(|p| p.socket.id != socket.id);
    println!("Player {} disconnected", socket.id);
}
```

## 5. Networking and Communication

The server utilizes WebSocket technology, implemented through the socketioxide library, to facilitate real-time communication with clients. This allows for efficient, bidirectional communication, essential for a responsive game experience.

### 5.1 WebSocket Setup
The WebSocket server is set up in the main function using socketioxide:

```rust
let (svc, io) = socketioxide::SocketIo::new_svc();
io.ns("/", move |socket: SocketRef, data: Data<Value>| {
    on_connect(socket, data, players_clone.clone())
});
```

This sets up a namespace ("/") and defines the `on_connect` function as the handler for new connections.

### 5.2 Event Handling
The server uses an event-driven model for handling various game events. Event handlers are registered for different types of events, such as player movement, chat messages, or game state updates.

For example, the chat system registers handlers for whisper and broadcast messages:

```rust
socket.on("whisper", |socket: SocketRef, Data(data): Data<Value>| async move {
    handle_whisper(socket, &data.recipient, &data.message);
});

socket.on("broadcast", |socket: SocketRef, Data(data): Data<Value>| async move {
    handle_broadcast(socket, &data.message);
});
```

### 5.3 Broadcast Functionality
The server implements a broadcast function to send messages to all connected clients:

```rust
pub fn broadcast_message(data: Data<Value>, players: Arc<Mutex<Vec<Player>>>) {
    let players = players.lock().unwrap();
    for player in &*players {
        player.socket.emit("broadcastMessage", data.0.clone()).ok();
    }
}
```

This function is used for server-wide announcements, game state updates, or other information that needs to be sent to all players simultaneously.

## 6. Actor System

One of the more complex aspects of the server is its actor system, defined in the `actors` module. This system provides a flexible and powerful way to represent and manage various entities within the game world.

### 6.1 Core Components

#### 6.1.1 Object Trait
The `Object` trait defines the basic properties and behaviors for all game objects:

```rust
pub trait Object {
    fn begin_play(&mut self);
    fn end_play(&mut self);
    fn tick(&mut self, delta_time: f32);
    fn get_name(&self) -> &str;
    fn set_name(&mut self, name: String);
    fn add_tag(&mut self, tag: String);
    fn has_tag(&self, tag: &str) -> bool;
    fn get_tags(&self) -> &[String];
}
```

This trait ensures that all game objects have consistent basic functionality.

#### 6.1.2 Component Trait
The `Component` trait allows for modular, attachable behaviors:

```rust
pub trait Component: Any + Object {
    fn as_any(&self) -> &dyn Any;
    fn as_any_mut(&mut self) -> &mut dyn Any;
}
```

Components can be added to actors to extend their functionality in a modular way.

#### 6.1.3 Actor Trait
The `Actor` trait extends `Object` with transform-related functionalities:

```rust
pub trait Actor: Object {
    fn get_transform(&self) -> Transform;
    fn set_transform(&mut self, transform: Transform);
    fn get_actor_location(&self) -> (f32, f32, f32);
    fn set_actor_location(&mut self, new_location: (f32, f32, f32));
    // ... other methods ...
}
```

This trait is central to the actor system, providing methods for manipulating an actor's position, rotation, and scale in the game world.

### 6.2 Specialized Actors

The server implements several specialized actor types:

#### 6.2.1 StaticProp
Represents non-interactive elements in the game world:

```rust
pub struct StaticProp {
    base: BaseActor,
}
```

#### 6.2.2 PlayerCharacter
Represents the user-controlled character:

```rust
struct PlayerCharacter {
    base: BaseActor,
    transform: Transform,
    health: f32,
}
```

These specialized actors build upon the base actor system, adding game-specific properties and behaviors.

## 7. Game Events and Logic

The server uses a custom `GameEvent` enum to represent various in-game occurrences. These events cover a wide range of possibilities, from player movements to item pickups and damage calculations.

### 7.1 GameEvent Enum
The `GameEvent` enum is defined as follows:

```rust
pub enum GameEvent {
    None,
    PlayerJoined(Player),
    PlayerLeft(Player),
    ChatMessage { sender: Player, content: String },
    ItemPickup { player: Player, item: ItemId },
    PlayerMoved { player: Player, new_position: Position },
    DamageDealt { attacker: Player, target: Player, amount: f32 },
    Custom(CustomEvent),
}
```

This comprehensive enum allows the server to represent and handle a wide variety of game events in a type-safe manner.

### 7.2 Event Processing
Game logic, handled in `game_logic.rs`, processes these events and applies the appropriate rules and mechanics. The `on_game_event` function is typically used to handle these events:

```rust
async fn on_game_event(&self, event: &GameEvent) {
    match event {
        GameEvent::PlayerJoined(player) => {
            // Handle player join logic
        },
        GameEvent::PlayerMoved { player, new_position } => {
            // Update player position and notify other players
        },
        // ... other event handlers ...
    }
}
```

This event-driven approach allows for clear separation of concerns and makes it easier to implement and modify game rules.

## 8. Plugin System

The Horizon Game Server implements a plugin system to allow for easy extension of server functionality. This system is managed by the `plugin_manager.rs` module.

### 8.1 Plugin Structure
Plugins are implemented as dynamic libraries (`.dll`, `.so`, or `.dylib` files) that can be loaded at runtime. Each plugin must implement certain traits and expose specific functions:

```rust
pub trait Plugin: Any + Debug + Send + Sync {
    fn on_load(&self);
    fn on_unload(&self);
    fn execute(&self);
    fn initialize(&self, context: &mut PluginContext);
    fn shutdown(&self, context: &mut PluginContext);
    fn on_enable(&self, context: &mut PluginContext);
    fn on_disable(&self, context: &mut PluginContext);
}
```

### 8.2 Plugin Loading
The `PluginManager` is responsible for loading, unloading, and managing plugins:

```rust
pub struct PluginManager {
    plugins: Arc<RwLock<HashMap<String, Box<dyn Plugin>>>>,
    libraries: Arc<RwLock<HashMap<String, Library>>>,
}
```

Plugins are loaded dynamically using the `libloading` crate:

```rust
pub unsafe fn load_plugin<P: AsRef<Path>>(&self, path: P) -> Result<(), String> {
    let lib = Library::new(path).map_err(|e| e.to_string())?;
    // ... load and initialize plugin ...
}
```

### 8.3 Plugin Execution
Loaded plugins can be executed through the `execute_plugin` method:

```rust
pub fn execute_plugin(&self, name: &str) {
    if let Some(plugin) = self.plugins.read().unwrap().get(name) {
        plugin.execute();
    }
}
```

This system allows for great flexibility in extending the server's functionality without modifying the core codebase.

## 9. Configuration and Environment

The server's configuration is flexible, utilizing environment variables and build-time options for various settings.

### 9.1 Environment Variables
Several environment variables can be used to configure the server:

- `LIBCLANG_PATH`: Specifies the path to the libclang library.
- `LD_LIBRARY_PATH`: Used for library searching on Unix-like systems.
- `LLVM_CONFIG_PATH`: Specifies the path to the llvm-config executable.

### 9.2 Build Configuration
The server uses a `build.rs` script for compile-time configuration. This script handles tasks such as:

- Detecting the target operating system and architecture.
- Finding and linking to the appropriate libraries (e.g., libclang).
- Setting up conditional compilation flags.

For example, the script includes logic to find the libclang library:

```rust
pub fn find(runtime: bool) -> Result<(PathBuf, String), String> {
    search_libclang_directories(runtime)?
        .iter()
        .rev()
        .max_by_key(|f| &f.2)
        .cloned()
        .map(|(path, filename, _)| (path, filename))
        .ok_or_else(|| "unreachable".into())
}
```

This allows the server to adapt to different build environments and target platforms.

## 10. Testing and Quality Assurance

Testing is an integral part of the Horizon Game Server's development process, ensuring reliability and performance across various scenarios.

### 10.1 Unit Testing
Unit tests are implemented throughout the codebase, typically in dedicated test modules. These tests use the `#[cfg(test)]` attribute to ensure they're only compiled during testing:

```rust
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_player_creation() {
        // Test player creation logic
    }

    #[test]
    fn test_game_event_handling() {
        // Test game event handling
    }
}
```

### 10.2 Mocking
The server implements a mock system for command execution, particularly useful for testing system interactions without actual command execution:

```rust
#[cfg(test)]
lazy_static::lazy_static! {
    pub static ref RUN_COMMAND_MOCK: std::sync::Mutex<
        Option<Box<dyn Fn(&str, &str, &[&str]) -> Option<String> + Send + Sync + 'static>>>,
    > = std::sync::Mutex::new(None);
}
```

This mocking system allows developers to simulate various command execution scenarios during testing, ensuring robust handling of external command interactions.

### 10.3 Integration Testing
Integration tests are implemented to verify the correct interaction between different modules of the server. These tests typically involve setting up a test server instance and simulating client connections and interactions:

```rust
#[tokio::test]
async fn test_player_connection_flow() {
    let (server, socket) = setup_test_server().await;
    
    // Simulate player connection
    let player = connect_test_player(&socket).await;
    
    // Verify player is correctly added to the server
    assert!(server.has_player(&player.id));
    
    // Simulate player disconnection
    disconnect_test_player(&socket, &player).await;
    
    // Verify player is removed from the server
    assert!(!server.has_player(&player.id));
}
```

### 10.4 Load Testing
The `PebbleVault` module includes load testing capabilities, particularly useful for stress-testing database operations and server performance under high load:

```rust
pub async fn run_load_test(
    vault_manager: &mut VaultManager<LoadTestData>,
    num_objects: usize,
    num_regions: usize,
    num_operations: usize
) -> Result<(), Box<dyn std::error::Error>> {
    // Generate test data
    let test_data = generate_test_data(num_objects, num_regions);
    
    // Perform operations
    for _ in 0..num_operations {
        let operation = choose_random_operation();
        perform_operation(vault_manager, operation, &test_data).await?;
    }
    
    // Verify results
    verify_test_results(vault_manager, &test_data).await?;
    
    Ok(())
}
```

These load tests are crucial for ensuring the server can handle the expected player load and data throughput in production environments.

## 11. Performance Optimization

Performance is a critical aspect of the Horizon Game Server, given its real-time nature and potential for high concurrent user loads. Several strategies are employed to optimize performance:

### 11.1 Asynchronous Programming
The server extensively uses Rust's async/await syntax and the tokio runtime to handle concurrent operations efficiently. This allows the server to handle many simultaneous connections without blocking:

```rust
async fn handle_player_action(player: &Player, action: PlayerAction) -> Result<(), GameError> {
    match action {
        PlayerAction::Move(position) => move_player(player, position).await,
        PlayerAction::Attack(target) => perform_attack(player, target).await,
        // ... other actions ...
    }
}
```

### 11.2 Memory Management
The use of Rust's ownership system and lifetime rules helps prevent common memory-related bugs. Additionally, the server uses the mimalloc allocator on Linux systems for improved memory allocation performance:

```rust
#[cfg(target_os = "linux")]
#[global_allocator]
static GLOBAL: mimalloc::MiMalloc = mimalloc::MiMalloc;
```

### 11.3 Data Structures
Careful consideration is given to the choice of data structures throughout the server. For example, the use of `HashMap` for quick player lookups and `Vec` for ordered collections where appropriate:

```rust
pub struct GameState {
    players: HashMap<PlayerId, Player>,
    game_objects: Vec<GameObject>,
    // ... other fields ...
}
```

### 11.4 Caching
The server implements caching mechanisms to reduce the load on databases and improve response times for frequently accessed data:

```rust
pub struct Cache<T> {
    data: RwLock<HashMap<String, (T, Instant)>>,
    ttl: Duration,
}

impl<T: Clone> Cache<T> {
    pub async fn get(&self, key: &str) -> Option<T> {
        let data = self.data.read().await;
        if let Some((value, timestamp)) = data.get(key) {
            if timestamp.elapsed() < self.ttl {
                return Some(value.clone());
            }
        }
        None
    }
    // ... other methods ...
}
```

## 12. Deployment

The deployment process for the Horizon Game Server is designed to be robust and scalable, accommodating various production environments.

### 12.1 Containerization
The server is containerized using Docker, allowing for consistent deployments across different environments:

```dockerfile
FROM rust:1.54 as builder
WORKDIR /usr/src/horizon
COPY . .
RUN cargo build --release

FROM debian:buster-slim
COPY --from=builder /usr/src/horizon/target/release/horizon /usr/local/bin/horizon
CMD ["horizon"]
```

### 12.2 Orchestration
Kubernetes is used for orchestrating the deployment of multiple server instances, allowing for easy scaling and management:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: horizon-server
spec:
  replicas: 3
  selector:
    matchLabels:
      app: horizon-server
  template:
    metadata:
      labels:
        app: horizon-server
    spec:
      containers:
      - name: horizon-server
        image: horizon-server:latest
        ports:
        - containerPort: 3000
```

### 12.3 Monitoring
Prometheus and Grafana are used for monitoring server performance and health:

```rust
use prometheus::{Registry, Counter, Gauge};

pub struct Metrics {
    registry: Registry,
    connected_players: Gauge,
    total_messages: Counter,
}

impl Metrics {
    pub fn new() -> Self {
        let registry = Registry::new();
        let connected_players = Gauge::new("connected_players", "Number of connected players").unwrap();
        let total_messages = Counter::new("total_messages", "Total number of messages processed").unwrap();
        
        registry.register(Box::new(connected_players.clone())).unwrap();
        registry.register(Box::new(total_messages.clone())).unwrap();
        
        Metrics {
            registry,
            connected_players,
            total_messages,
        }
    }
    
    // ... methods to update metrics ...
}
```

## 13. Future Development

The Horizon Game Server is an evolving project with several planned improvements and expansions:

### 13.1 Enhanced AI System
There are plans to implement a more sophisticated AI system for non-player characters (NPCs) and enemies:

```rust
pub trait AIController {
    fn decide_action(&self, world_state: &WorldState) -> AIAction;
    fn update(&mut self, delta_time: f32);
}

pub struct AdvancedAI {
    behavior_tree: BehaviorTree,
    perception_system: PerceptionSystem,
}

impl AIController for AdvancedAI {
    fn decide_action(&self, world_state: &WorldState) -> AIAction {
        let perceived_state = self.perception_system.analyze(world_state);
        self.behavior_tree.evaluate(perceived_state)
    }
    
    fn update(&mut self, delta_time: f32) {
        self.perception_system.update(delta_time);
    }
}
```

### 13.2 Improved Physics Engine
Work is underway to integrate a more advanced physics engine to support complex interactions and simulations:

```rust
pub struct PhysicsWorld {
    rigid_bodies: Vec<RigidBody>,
    constraints: Vec<Constraint>,
}

impl PhysicsWorld {
    pub fn step(&mut self, delta_time: f32) {
        // Perform collision detection
        let collisions = self.detect_collisions();
        
        // Resolve collisions and apply forces
        self.resolve_collisions(collisions);
        
        // Update positions and velocities
        for body in &mut self.rigid_bodies {
            body.update(delta_time);
        }
    }
    
    // ... other methods ...
}
```

### 13.3 Cross-Platform Client Support
Future development will focus on expanding client support to include mobile and console platforms, requiring adaptations to the networking and data serialization systems.