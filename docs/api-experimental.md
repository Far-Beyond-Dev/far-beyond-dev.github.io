---
title: Plugin API
image: 
tags: []
stability: experimental
excerpt: The Plugin API is an experimental feature of Horizon and is not recommended for use in production environments yet.
---

# 
> [!WARNING]
> The Plugin API is an experimental feature of Horizon and is not recommended for use in production environments. It may undergo significant changes in future releases.

![Experimental Feature](https://img.shields.io/badge/Status-Experimental-yellow)

## Table of Contents

- [🚀 Introduction](#introduction)
- [🔧 Implementation](#implementation)
  - [RPC System](#rpc-system)
  - [Event Handling](#event-handling)
  - [Logging System](#logging-system)
- [📈 Usage](#usage)
  - [Creating a Plugin](#creating-a-plugin)
  - [Registering a Plugin](#registering-a-plugin)
- [💻 Development](#development)
  - [Best Practices](#best-practices)
  - [Known Limitations](#known-limitations)
- [🐞 Troubleshooting](#troubleshooting)

<h2 align="center" id='introduction'> 🚀 Introduction </h2>

The Experimental Plugin API is a powerful new feature of Horizon that allows developers to extend the functionality of the server through custom plugins. This API leverages a Remote Procedure Call (RPC) system and event handling mechanism to provide a flexible and efficient way of adding new features to your Horizon server.

<h2 align="center" id='implementation'> 🔧 Implementation </h2>

### RPC System

The Plugin API utilizes an RPC (Remote Procedure Call) system to enable communication between the core server and plugins. This system allows plugins to register functions that can be called by the server or other plugins, providing a seamless way to extend server functionality.

#### Key Components:

- `RpcFunction`: A type alias for plugin-defined functions that can be called remotely.
- `RpcPlugin` trait: Defines the interface for RPC-enabled plugins.
- `RpcEnabledPlugin` struct: A concrete implementation of the `RpcPlugin` trait.

### Event Handling

The API includes an event handling system that allows plugins to respond to various game events. This system uses a publisher-subscriber model, where plugins can register for specific event types and receive notifications when those events occur.

#### Key Components:

- `GameEvent` enum: Represents different types of game events.
- `BaseAPI` trait: Defines methods for handling game events and ticks.
- `CustomEvent` struct: Handle event type and data for custom events.

### Logging system

The API has a logging system to provide a better debug and tracks the users actions for the specific plugin functionalities.

#### Key Components

- `GameEvent` enum: An robust logging system for `GameEvent` enum which notifies you about all events from the game.

<h2 align="center" id='usage'> 📈 Usage </h2>

### Creating a Plugin

To create a plugin using the Experimental Plugin API, follow these steps:

1. Implement the `RpcPlugin` trait for your plugin struct.
2. Define RPC functions that your plugin will expose.
3. Implement the `BaseAPI` trait to handle game events and ticks.

Example:

```rust
use plugin_api::{RpcPlugin, BaseAPI, GameEvent};

struct MyPlugin {
    // Plugin state
}

#[async_trait]
impl RpcPlugin for MyPlugin {
    // Implement required methods
}

#[async_trait]
impl BaseAPI for MyPlugin {
    async fn on_game_event(&self, event: &GameEvent) {
        // Handle game events
    }

    async fn on_game_tick(&self, delta_time: f64) {
        // Perform periodic tasks
    }
}
```

### Registering a Plugin

To register your plugin with the Horizon server:

1. Create an instance of your plugin.
2. Wrap it in an `Arc<RwLock<>>` for thread-safe sharing.
3. Use the `PluginContext::register_rpc_plugin` method to register your plugin.

Example:

```rust
let my_plugin = Arc::new(RwLock::new(MyPlugin::new()));
context.register_rpc_plugin(my_plugin).await;
```


<h2 align="center" id='examples'> 🎮 Examples </h2>

To illustrate the power and flexibility of the Experimental Plugin API, let's create two plugins: a Calculator Plugin and a Game Plugin. These examples will demonstrate how plugins can interact with each other and how game-specific logic can be separated from the core Horizon server.

> [!IMPORTANT]
> In Horizon, all game-specific server logic is implemented as plugins. This design choice allows for easier updates to the core Horizon code without affecting game-specific functionality.

### Calculator Plugin

First, let's create a simple Calculator Plugin that provides basic arithmetic operations:

```rust
use std::sync::Arc;
use tokio::sync::RwLock;
use async_trait::async_trait;
use plugin_api::{RpcPlugin, RpcFunction, BaseAPI, GameEvent, PluginContext};

struct CalculatorPlugin {
    id: Uuid,
    name: String,
    rpc_functions: HashMap<String, RpcFunction>,
}

impl CalculatorPlugin {
    fn new() -> Self {
        let mut plugin = Self {
            id: Uuid::new_v4(),
            name: "CalculatorPlugin".to_string(),
            rpc_functions: HashMap::new(),
        };

        plugin.register_rpc("add", Arc::new(CalculatorPlugin::add));
        plugin.register_rpc("subtract", Arc::new(CalculatorPlugin::subtract));
        plugin
    }

    fn add(params: &(dyn Any + Send + Sync)) -> Box<dyn Any + Send + Sync> {
        if let Some((a, b)) = params.downcast_ref::<(f64, f64)>() {
            Box::new(a + b)
        } else {
            Box::new(f64::NAN)
        }
    }

    fn subtract(params: &(dyn Any + Send + Sync)) -> Box<dyn Any + Send + Sync> {
        if let Some((a, b)) = params.downcast_ref::<(f64, f64)>() {
            Box::new(a - b)
        } else {
            Box::new(f64::NAN)
        }
    }
}

#[async_trait]
impl RpcPlugin for CalculatorPlugin {
    // Implement required methods (get_id, get_name, register_rpc, call_rpc)
}

#[async_trait]
impl BaseAPI for CalculatorPlugin {
    async fn on_game_event(&self, _event: &GameEvent) {
        // Calculator doesn't need to handle game events
    }

    async fn on_game_tick(&self, _delta_time: f64) {
        // Calculator doesn't need periodic updates
    }
}
```

### Game Plugin

Now, let's create a Game Plugin that uses the Calculator Plugin for some game logic:

```rust
use std::sync::Arc;
use tokio::sync::RwLock;
use async_trait::async_trait;
use plugin_api::{RpcPlugin, RpcFunction, BaseAPI, GameEvent, PluginContext, Player};

struct GamePlugin {
    id: Uuid,
    name: String,
    rpc_functions: HashMap<String, RpcFunction>,
    context: Arc<RwLock<PluginContext>>,
}

impl GamePlugin {
    fn new(context: Arc<RwLock<PluginContext>>) -> Self {
        let mut plugin = Self {
            id: Uuid::new_v4(),
            name: "GamePlugin".to_string(),
            rpc_functions: HashMap::new(),
            context,
        };

        plugin.register_rpc("calculate_damage", Arc::new(GamePlugin::calculate_damage));
        plugin
    }

    async fn calculate_damage(params: &(dyn Any + Send + Sync), context: &PluginContext) -> Box<dyn Any + Send + Sync> {
        if let Some((base_damage, armor)) = params.downcast_ref::<(f64, f64)>() {
            // Use the Calculator Plugin to compute the final damage
            if let Some(calculator_id) = context.get_rpc_plugin_id_by_name("CalculatorPlugin").await {
                if let Some(result) = context.call_rpc_plugin(calculator_id, "subtract", &(*base_damage, *armor)).await {
                    if let Some(final_damage) = result.downcast_ref::<f64>() {
                        return Box::new(final_damage.max(0.0)); // Ensure damage is not negative
                    }
                }
            }
        }
        Box::new(0.0) // Default to no damage if calculation fails
    }
}

#[async_trait]
impl RpcPlugin for GamePlugin {
    // Implement required methods (get_id, get_name, register_rpc, call_rpc)
}

#[async_trait]
impl BaseAPI for GamePlugin {
    async fn on_game_event(&self, event: &GameEvent) {
        match event {
            GameEvent::DamageDealt { attacker, target, amount } => {
                let context = self.context.read().await;
                if let Some(result) = self.call_rpc("calculate_damage", &(*amount, target.armor)).await {
                    if let Some(final_damage) = result.downcast_ref::<f64>() {
                        println!("Player {} dealt {} damage to Player {}", attacker.id, final_damage, target.id);
                        // Apply damage to target, update game state, etc.
                    }
                }
            },
            // Handle other game events...
            _ => {}
        }
    }

    async fn on_game_tick(&self, delta_time: f64) {
        // Implement game logic that needs to run every tick
        // For example: update positions, check for collisions, etc.
    }
}
```

### Registering and Using the Plugins

To use these plugins in your Horizon server:

```rust
async fn setup_plugins(context: &mut PluginContext) {
    // Register the Calculator Plugin
    let calculator_plugin = Arc::new(RwLock::new(CalculatorPlugin::new()));
    context.register_rpc_plugin(calculator_plugin.clone()).await;

    // Register the Game Plugin
    let game_plugin = Arc::new(RwLock::new(GamePlugin::new(Arc::new(RwLock::new(context.clone())))));
    context.register_rpc_plugin(game_plugin.clone()).await;

    // Register for game events
    let base_api: Arc<dyn BaseAPI> = game_plugin;
    context.register_for_custom_event("damage_dealt", base_api).await;
}
```

### Explanation

In this example, we've created two plugins:

1. **Calculator Plugin**: A utility plugin that provides basic arithmetic operations.
2. **Game Plugin**: Implements game-specific logic, such as damage calculation.

The Game Plugin uses the Calculator Plugin to perform damage calculations, demonstrating how plugins can interact with each other. This modular approach allows for:

- **Separation of Concerns**: Game logic is kept separate from utility functions and core server code.
- **Reusability**: The Calculator Plugin could be used by multiple game plugins or even different games.
- **Easier Maintenance**: Updates to the core Horizon server won't directly affect game-specific logic.
- **Flexibility**: New game features can be added or modified without changing the core server code.

By implementing all game-specific server logic as plugins, Horizon maintains a clear separation between its core functionality and game-specific features. This architecture allows developers to:

- Update the core Horizon code without breaking game functionality.
- Develop and test game features independently of the core server.
- Easily switch between different game modes or rulesets by loading different plugins.
- Share common functionality (like the Calculator Plugin) across multiple projects.

<h2 align="center" id='development'> 💻 Development </h2>

### Best Practices

- Keep plugin functionality modular and focused.
- Use appropriate error handling and logging within your plugins.
- Avoid blocking operations in event handlers and RPC functions.
- Test your plugins thoroughly before deployment.

### Known Limitations

- The API is still experimental and may change in future releases.
- Complex inter-plugin dependencies may lead to performance issues.
- There's currently no built-in versioning system for plugins.

<h2 align="center" id='troubleshooting'> 🐞 Troubleshooting </h2>

Common issues when working with the Experimental Plugin API:

- **Plugin Not Loading**: Ensure that your plugin is correctly registered with the `PluginContext`.
- **RPC Function Not Found**: Verify that the function name in `call_rpc` matches the registered name.
- **Type Mismatch Errors**: Check that the types used in RPC function signatures match the actual data being passed.

For more detailed troubleshooting and support, please refer to the [Horizon Troubleshooting Guide](troubleshooting.md) or join our community Discord server.

---

> [!NOTE]
> As this is an experimental feature, we encourage developers to provide feedback and report any issues they encounter while using the Plugin API. Your input is valuable in shaping the future of this feature!