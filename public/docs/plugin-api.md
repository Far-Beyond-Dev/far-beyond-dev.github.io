---
title: Horizon Plugin API
image:
excerpt: Learn how Horizon's plugin API works
tags: ["basics", "tutorial", "Plugins"]
stability: stable
---

# Getting Started with Horizon Plugins

The Horizon Plugin System is designed to provide a flexible architecture for extending server functionality through plugins. At its core, the system utilizes two primary traits - PluginConstruct for initialization and PluginAPI for functionality definition. This design allows for modular development while maintaining type safety and reliable state management.

Plugins in Horizon are implemented through a clever use of Rust's trait system, providing a strong type-safe foundation to build on. The system uses Arc and RwLock for thread-safe state management, allowing multiple parts of the system to access plugin data concurrently. Plugin state can be managed through static references with lazy initialization, ensuring efficient resource usage, and simplifying usage.

When you first start developing for Horizon, understanding the plugin system is essential. Every plugin in Horizon builds upon the base Plugin struct by implementing two traits: PluginConstruct and PluginAPI. Let's walk through how to create your first plugin.

## Core Concepts

Plugins in Horizon serve as modular components that can interact with the game server's core systems. Each plugin is constructed with access to existing plugins, allowing for inter-plugin communication and dependency management.

The `PluginConstruct` trait handles the initialization phase of plugins, providing shared methods for setup and structure definition. This trait ensures that plugins can safely initialize their state and declare any custom structures they introduce to the system. The plugin construction process includes state initialization, event handler registration, and setup of any necessary background processes.

__***IMPORTANT:***__ This trait cannot be modified from the default, attepting to do so may result in compatability issues and/or compile errors.

The `PluginAPI` trait defines the interface that plugins expose to the rest of the system (mainly other plugins or a backend [see the "Custom Backends" documentation]). This trait can be entirely custom unlike the `PluginConstruct` trait.

## Implementation

Event handling in plugins is managed through a socket-based system, allowing plugins to listen for and respond to various game events. Plugins can register custom event handlers and maintain their own state while interacting with the core server systems. The event system provides mechanisms for both synchronous and asynchronous event processing.

State management in plugins utilizes thread-safe data structures and proper locking strategies to maintain data consistency. Plugins can maintain their own internal state while also accessing shared server state through provided interfaces. This design allows for complex plugin behavior while preventing race conditions and ensuring data integrity.

## Best Practices

When developing plugins for Horizon, several best practices should be followed:

- State management should utilize appropriate thread-safe constructs and implement proper locking strategies.
- Event handlers should be implemented with consideration for concurrency and proper cleanup on disconnect.
- Error handling should be comprehensive, with proper error propagation and meaningful error messages.
- Plugin initialization should be handled carefully, ensuring that all necessary resources are properly allocated and configured.
- Dependencies between plugins should be managed through the provided plugin HashMap, allowing for proper initialization order and resource sharing.
- Thread safety considerations should be paramount, with proper use of synchronization primitives and careful management of shared resources if your plugin uses multiple threads internally.

## Security Considerations

Plugin security is a critical consideration in the Horizon system. Plugins should validate all input data and implement appropriate access controls. Error handling should be implemented in a way that prevents information leakage while providing useful debugging information when appropriate (see Horizon Logger Docs).

Thread safety is particularly important for security. Plugins should implement proper synchronization to prevent race conditions and data corruption. Access to shared resources should be carefully controlled and monitored. Proper cleanup procedures should be implemented to prevent resource leaks and maintain system stability.

## Understanding the Basic Structure

The most important thing to understand is that you don't create your own structs when building a plugin. Instead, you implement the required traits on the Plugin struct that Horizon provides. Here's what a basic plugin implementation looks like:

```rust
use horizon_plugin_api::{Plugin, PluginAPI, PluginConstruct};
use std::collections::HashMap;

impl PluginConstruct for Plugin {
    fn new(plugins: HashMap<String, (Pluginstate, Plugin)>) -> Plugin {
        Plugin {}
    }

    fn get_structs(&self) -> Vec<&str> {
        vec![]  // We don't need custom structs for basic plugins
    }
}

impl PluginAPI for Plugin {
    fn player_joined(&self, socket: SocketRef, player: Arc<RwLock<Player>>) {
        println!("A new player has joined!");
    }
}
```

## Working with Player Events

When a player connects to your server, Horizon will call your plugin's player_joined function. This is where you set up any event listeners or initialize player-specific data. Here's how you might handle some basic player events:

__***IMPORTANT:***__ `player_joined` will eventually be moving to the PluginConstruct trait to expand the base shared API between all plugins.

```rust
impl PluginAPI for Plugin {
    fn player_joined(&self, socket: SocketRef, player: Arc<RwLock<Player>>) {
        // Get the player's ID for reference
        let player_id = player.read().id.clone();
        
        // Set up some basic event listeners
        socket.on("chat_message", move |data: Data<String>| {
            println!("Player {} sent message: {}", player_id, data.0);
        });
        
        socket.on("player_move", move |data: Data<Position>| {
            println!("Player {} moved to {:?}", player_id, data.0);
        });
    }
}
```

## Managing State in Your Plugin

Since plugins can't have their own structs, you might wonder how to manage state. The solution is to use Horizon's global state management through lazy_static. This approach is thread-safe and works well with Horizon's architecture. Here's an example:

```rust
use lazy_static::lazy_static;

lazy_static! {
    static ref PLAYER_POSITIONS: Arc<RwLock<HashMap<String, Position>>> = 
        Arc::new(RwLock::new(HashMap::new()));
}

impl PluginAPI for Plugin {
    fn player_joined(&self, socket: SocketRef, player: Arc<RwLock<Player>>) {
        let player_id = player.read().id.clone();
        
        // Store initial position
        PLAYER_POSITIONS.write().insert(player_id.clone(), Position::default());
        
        socket.on("player_move", move |data: Data<Position>| {
            // Update stored position
            PLAYER_POSITIONS.write().insert(player_id.clone(), data.0);
        });
    }
}
```

## Communicating with Other Plugins

One of the powerful features of Horizon is the ability for plugins to work together. When your plugin is created, it receives a HashMap of all other active plugins. This allows you to integrate with other plugins during initialization:

```rust
impl PluginConstruct for Plugin {
    fn new(plugins: HashMap<String, (Pluginstate, Plugin)>) -> Plugin {
        // Check if another plugin we want to work with exists
        if let Some((state, _)) = get_type_from_plugin(plugins, "combat_plugin", "MyStruct") {
            println!("Found combat plugin, we can work with it!");
        }
        
        Plugin {}
    }
}
```

## A Simple Chat Plugin Example

Let's put everything together in a simple chat plugin that demonstrates these concepts:

```rust
use horizon_plugin_api::{Plugin, PluginAPI, PluginConstruct};
use lazy_static::lazy_static;

lazy_static! {
    static ref ONLINE_PLAYERS: Arc<RwLock<HashSet<String>>> = 
        Arc::new(RwLock::new(HashSet::new()));
}

impl PluginConstruct for Plugin {
    fn new(plugins: HashMap<String, (Pluginstate, Plugin)>) -> Plugin {
        Plugin {}
    }

    fn get_structs(&self) -> Vec<&str> {
        vec![]
    }
}

impl PluginAPI for Plugin {
    fn player_joined(&self, socket: SocketRef, player: Arc<RwLock<Player>>) {
        let player_id = player.read().id.clone();
        
        // Track online players
        ONLINE_PLAYERS.write().insert(player_id.clone());
        
        // Set up chat handler
        socket.on("chat_message", move |data: Data<String>| {
            // Broadcast message to all players
            socket.broadcast().emit("chat_message", json!({
                "player": player_id,
                "message": data.0
            })).ok();
        });
        
        // Clean up when player leaves
        socket.on_disconnect(move |_| {
            ONLINE_PLAYERS.write().remove(&player_id);
        });
    }
}
```

***Remember:*** While Horizon's plugin system might seem restrictive at first, these limitations are intentional and help ensure that plugins remain maintainable, uniform, and performant. By working within these constraints and using the provided tools like lazy_static for state management, you can create powerful and efficient plugins.