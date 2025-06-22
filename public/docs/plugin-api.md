---
title: Plugin Development Guide
image:
excerpt: Learn how Horizon's plugin API works
tags: ["basics", "tutorial", "Plugins"]
stability: stable
---

This guide walks through building plugins for the Horizon game server, covering the event system, plugin architecture, and practical examples.

## Table of Contents

1. [Plugin System Overview](#plugin-system-overview)
2. [Event Types and Architecture](#event-types-and-architecture)
3. [Setting Up Your First Plugin](#setting-up-your-first-plugin)
4. [Building a Chat Plugin](#building-a-chat-plugin)
5. [Movement Plugin with Validation](#movement-plugin-with-validation)
6. [Inter-Plugin Communication](#inter-plugin-communication)
7. [Testing and Debugging](#testing-and-debugging)
8. [Performance Considerations](#performance-considerations)
9. [Hot Reloading and Deployment](#hot-reloading-and-deployment)

## Plugin System Overview

Horizon's plugin system differs from traditional game server architectures by separating core infrastructure from game logic. The server handles connections, message routing, and plugin management while delegating all game-specific functionality to plugins.

Key characteristics:
- **Type-safe events** with compile-time checking
- **Zero unsafe code** required in plugins
- **Async/await** throughout the plugin API
- **Hot reloading** for development
- **Memory safety** through Rust's ownership system

Here's a minimal plugin to demonstrate the architecture:

```rust
use event_system::*;

pub struct GreeterPlugin {
    welcome_count: u32,
}

impl GreeterPlugin {
    pub fn new() -> Self {
        Self { welcome_count: 0 }
    }
}

#[async_trait]
impl SimplePlugin for GreeterPlugin {
    fn name(&self) -> &str { "greeter" }
    fn version(&self) -> &str { "1.0.0" }
    
    async fn register_handlers(&mut self, events: Arc<EventSystem>) -> Result<(), PluginError> {
        events.on_core("player_connected", |event: serde_json::Value| {
            println!("👋 Welcome to the server!");
            Ok(())
        }).await?;
        
        Ok(())
    }
}

create_simple_plugin!(GreeterPlugin);
```

Building this plugin requires only `cargo build --release`, producing a dynamic library that can be loaded at runtime.

## Event Types and Architecture

Horizon organizes events into three distinct categories:

### Core Events
Server infrastructure events including player connections, plugin lifecycle, and region management:

```rust
events.on_core("player_connected", |event: PlayerConnectedEvent| {
    println!("New player joined from {}", event.remote_addr);
    Ok(())
}).await?;

events.on_core("region_started", |event: RegionStartedEvent| {
    println!("Server region covering {:?} is online", event.bounds);
    Ok(())
}).await?;
```

### Client Events
Player-initiated actions organized by namespace:

```rust
// Chat system
events.on_client("chat", "message", |msg: ChatMessage| {
    println!("Player said: {}", msg.text);
    Ok(())
}).await?;

// Movement system
events.on_client("movement", "jump", |jump: JumpEvent| {
    println!("Player jumped {}m high!", jump.height);
    Ok(())
}).await?;
```

### Plugin Events
Inter-plugin communication for coordinated functionality:

```rust
// Combat plugin emits damage events
events.emit_plugin("combat", "damage_dealt", &DamageEvent {
    attacker: player1,
    target: player2,
    damage: 50,
}).await?;

// Health plugin responds to damage
events.on_plugin("combat", "damage_dealt", |dmg: DamageEvent| {
    println!("Reducing health by {}", dmg.damage);
    Ok(())
}).await?;
```

## Setting Up Your First Plugin

Create a new plugin crate:

```bash
cargo new --lib chat_plugin
cd chat_plugin
```

Configure `Cargo.toml` for dynamic library generation:

```toml
[package]
name = "chat_plugin"
version = "0.1.0"
edition = "2021"

[lib]
crate-type = ["cdylib"]

[dependencies]
event_system = { path = "../event_system" }
serde = { version = "1.0", features = ["derive"] }
serde_json = "1.0"
async-trait = "0.1"
tokio = { version = "1.0", features = ["full"] }
```

The `cdylib` crate type generates the dynamic library format required by Horizon's plugin loader.

## Building a Chat Plugin

This section demonstrates building a complete chat system with channels and message routing.

### Plugin Structure

```rust
// src/lib.rs
use event_system::*;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::sync::Arc;
use tokio::sync::RwLock;

pub struct ChatPlugin {
    name: String,
    channels: Arc<RwLock<HashMap<String, ChatChannel>>>,
    player_channels: Arc<RwLock<HashMap<PlayerId, String>>>,
}

#[derive(Debug, Clone)]
struct ChatChannel {
    name: String,
    members: Vec<PlayerId>,
    message_count: u32,
}

#[derive(Debug, Serialize, Deserialize)]
struct ChatMessage {
    player_id: PlayerId,
    message: String,
    channel: String,
}

#[derive(Debug, Serialize, Deserialize)]
struct JoinChannelRequest {
    player_id: PlayerId,
    channel: String,
}
```

### Plugin Implementation

```rust
impl ChatPlugin {
    pub fn new() -> Self {
        let mut channels = HashMap::new();
        channels.insert("general".to_string(), ChatChannel {
            name: "general".to_string(),
            members: Vec::new(),
            message_count: 0,
        });
        
        Self {
            name: "chat".to_string(),
            channels: Arc::new(RwLock::new(channels)),
            player_channels: Arc::new(RwLock::new(HashMap::new())),
        }
    }
}

#[async_trait]
impl SimplePlugin for ChatPlugin {
    fn name(&self) -> &str {
        &self.name
    }
    
    fn version(&self) -> &str {
        "1.0.0"
    }
    
    async fn register_handlers(&mut self, events: Arc<EventSystem>) -> Result<(), PluginError> {
        // Auto-join players to general channel
        let channels = self.channels.clone();
        events.on_core("player_connected", move |event: serde_json::Value| {
            println!("💬 New player connected, adding to general channel");
            Ok(())
        }).await?;
        
        // Handle chat messages
        let channels_for_chat = self.channels.clone();
        events.on_client("chat", "send_message", move |msg: ChatMessage| {
            let channels = channels_for_chat.clone();
            
            tokio::spawn(async move {
                let mut channels = channels.write().await;
                
                if let Some(channel) = channels.get_mut(&msg.channel) {
                    if channel.members.contains(&msg.player_id) {
                        channel.message_count += 1;
                        println!("💬 [{}] Player {}: {}", msg.channel, msg.player_id, msg.message);
                    } else {
                        println!("⚠️ Player {} not in channel {}", msg.player_id, msg.channel);
                    }
                }
            });
            
            Ok(())
        }).await?;
        
        // Handle channel joins
        let channels_for_join = self.channels.clone();
        let player_channels_for_join = self.player_channels.clone();
        
        events.on_client("chat", "join_channel", move |req: JoinChannelRequest| {
            let channels = channels_for_join.clone();
            let player_channels = player_channels_for_join.clone();
            
            tokio::spawn(async move {
                let mut channels = channels.write().await;
                let mut player_channels = player_channels.write().await;
                
                let channel = channels.entry(req.channel.clone()).or_insert_with(|| ChatChannel {
                    name: req.channel.clone(),
                    members: Vec::new(),
                    message_count: 0,
                });
                
                if !channel.members.contains(&req.player_id) {
                    channel.members.push(req.player_id);
                    player_channels.insert(req.player_id, req.channel.clone());
                    
                    println!("💬 Player {} joined channel '{}'", req.player_id, req.channel);
                }
            });
            
            Ok(())
        }).await?;
        
        Ok(())
    }
    
    async fn on_init(&mut self, context: Arc<dyn ServerContext>) -> Result<(), PluginError> {
        context.log(LogLevel::Info, "💬 Chat system is now online!");
        
        context.events().emit_plugin("chat", "service_online", &serde_json::json!({
            "plugin": "chat",
            "version": self.version(),
            "features": ["channels", "auto_join", "moderation"],
            "default_channel": "general"
        })).await.map_err(|e| PluginError::InitializationFailed(e.to_string()))?;
        
        Ok(())
    }
    
    async fn on_shutdown(&mut self, context: Arc<dyn ServerContext>) -> Result<(), PluginError> {
        let channels = self.channels.read().await;
        let total_messages = channels.values().map(|c| c.message_count).sum::<u32>();
        
        context.log(LogLevel::Info, 
            &format!("💬 Chat system shutting down. {} total messages processed", total_messages));
        
        Ok(())
    }
}

create_simple_plugin!(ChatPlugin);
```

### Building and Testing

Build the plugin:

```bash
cargo build --release
cp target/release/libchat_plugin.so ../horizon/plugins/
```

Test with WebSocket messages:

```json
{
  "namespace": "chat",
  "event": "join_channel",
  "data": {
    "player_id": "player-123",
    "channel": "general"
  }
}
```

```json
{
  "namespace": "chat", 
  "event": "send_message",
  "data": {
    "player_id": "player-123",
    "message": "Hello everyone!",
    "channel": "general"
  }
}
```

## Movement Plugin with Validation

This example demonstrates anti-cheat validation and state management:

```rust
use event_system::*;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::sync::Arc;
use tokio::sync::RwLock;

pub struct MovementPlugin {
    player_positions: Arc<RwLock<HashMap<PlayerId, PlayerPosition>>>,
    max_speed: f64,
}

#[derive(Debug, Clone)]
struct PlayerPosition {
    x: f64,
    y: f64, 
    z: f64,
    last_update: u64,
}

#[derive(Debug, Serialize, Deserialize)]
struct MoveRequest {
    player_id: PlayerId,
    target_x: f64,
    target_y: f64,
    target_z: f64,
}

impl MovementPlugin {
    pub fn new() -> Self {
        Self {
            player_positions: Arc::new(RwLock::new(HashMap::new())),
            max_speed: 10.0, // units per second
        }
    }
}

#[async_trait]
impl SimplePlugin for MovementPlugin {
    fn name(&self) -> &str { "movement" }
    fn version(&self) -> &str { "1.0.0" }
    
    async fn register_handlers(&mut self, events: Arc<EventSystem>) -> Result<(), PluginError> {
        let positions = self.player_positions.clone();
        let max_speed = self.max_speed;
        
        events.on_client("movement", "move_request", move |request: MoveRequest| {
            let positions = positions.clone();
            
            tokio::spawn(async move {
                let mut positions = positions.write().await;
                
                if let Some(current_pos) = positions.get(&request.player_id) {
                    let distance = ((request.target_x - current_pos.x).powi(2) + 
                                   (request.target_y - current_pos.y).powi(2) + 
                                   (request.target_z - current_pos.z).powi(2)).sqrt();
                    
                    let time_diff = (current_timestamp() - current_pos.last_update) as f64 / 1000.0;
                    let max_distance = max_speed * time_diff;
                    
                    if distance <= max_distance {
                        positions.insert(request.player_id, PlayerPosition {
                            x: request.target_x,
                            y: request.target_y,
                            z: request.target_z,
                            last_update: current_timestamp(),
                        });
                        
                        println!("✅ Player {} moved to ({:.1}, {:.1}, {:.1})", 
                                request.player_id, request.target_x, request.target_y, request.target_z);
                    } else {
                        println!("❌ Invalid movement from player {} - too fast! ({:.1} > {:.1})", 
                                request.player_id, distance, max_distance);
                    }
                } else {
                    // First movement
                    positions.insert(request.player_id, PlayerPosition {
                        x: request.target_x,
                        y: request.target_y,
                        z: request.target_z,
                        last_update: current_timestamp(),
                    });
                    
                    println!("📍 Initial position for player {}: ({:.1}, {:.1}, {:.1})", 
                            request.player_id, request.target_x, request.target_y, request.target_z);
                }
            });
            
            Ok(())
        }).await?;
        
        // Clean up on disconnect
        let positions_for_cleanup = self.player_positions.clone();
        events.on_core("player_disconnected", move |event: serde_json::Value| {
            if let Some(player_id_str) = event["player_id"].as_str() {
                println!("🧹 Cleaning up position data for disconnected player");
            }
            Ok(())
        }).await?;
        
        Ok(())
    }
}

create_simple_plugin!(MovementPlugin);
```

## Inter-Plugin Communication

Plugins coordinate through events. For example, adding moderation to the chat system:

### Emitting Events from Chat Plugin

```rust
// In chat message handler
tokio::spawn(async move {
    // Process message...
    
    // Notify other plugins
    let _ = events.emit_plugin("chat", "message_sent", &serde_json::json!({
        "player_id": msg.player_id,
        "message": msg.message,
        "channel": msg.channel,
        "timestamp": current_timestamp()
    })).await;
});
```

### Moderation Plugin Response

```rust
pub struct ModerationPlugin {
    banned_words: Vec<String>,
}

#[async_trait]
impl SimplePlugin for ModerationPlugin {
    async fn register_handlers(&mut self, events: Arc<EventSystem>) -> Result<(), PluginError> {
        let banned_words = self.banned_words.clone();
        
        events.on_plugin("chat", "message_sent", move |event: serde_json::Value| {
            let message = event["message"].as_str().unwrap_or("");
            let banned_words = banned_words.clone();
            
            tokio::spawn(async move {
                for word in &banned_words {
                    if message.to_lowercase().contains(word) {
                        println!("🚫 Detected inappropriate content from player {}", 
                                event["player_id"]);
                        // Could emit ban event, mute player, etc.
                        break;
                    }
                }
            });
            
            Ok(())
        }).await?;
        
        Ok(())
    }
}
```

## Testing and Debugging

### Unit Tests

```rust
#[cfg(test)]
mod tests {
    use super::*;
    use event_system::create_event_system;

    #[tokio::test]
    async fn test_chat_plugin() {
        let events = create_event_system();
        let mut plugin = ChatPlugin::new();
        
        plugin.register_handlers(events.clone()).await.unwrap();
        
        events.emit_client("chat", "send_message", &ChatMessage {
            player_id: PlayerId::new(),
            message: "Test message".to_string(),
            channel: "general".to_string(),
        }).await.unwrap();
        
        tokio::time::sleep(tokio::time::Duration::from_millis(100)).await;
    }
}
```

### Development Debug Output

Use `println!` for development debugging:

```rust
println!("🐛 DEBUG: Processing event {:?}", event);
```

### Error Handling Patterns

Always return `Ok(())` from event handlers unless the plugin should crash:

```rust
events.on_client("action", "risky_thing", |event: RiskyEvent| {
    match dangerous_operation(event) {
        Ok(result) => println!("Success: {:?}", result),
        Err(e) => println!("Error: {}, but continuing...", e),
    }
    Ok(()) // Continue processing other events
}).await?;
```

### Flexible Event Handling

Use `serde_json::Value` for unknown event structures:

```rust
events.on_client("unknown", "event", |event: serde_json::Value| {
    if let Some(event_type) = event["type"].as_str() {
        match event_type {
            "ping" => println!("Pong!"),
            "custom" => handle_custom_event(&event),
            _ => println!("Unknown event type: {}", event_type),
        }
    }
    Ok(())
}).await?;
```

## Performance Considerations

### Non-Blocking Event Handlers

Event handlers should return quickly. Use `tokio::spawn` for heavy operations:

```rust
events.on_client("heavy", "computation", |event: HeavyEvent| {
    tokio::spawn(async move {
        let result = expensive_computation(event).await;
        println!("Computation complete: {:?}", result);
    });
    
    Ok(()) // Return immediately
}).await?;
```

### Batching Database Operations

Collect updates and flush periodically:

```rust
let pending_updates = Arc::new(RwLock::new(Vec::new()));

// Collect updates
events.on_client("game", "score_update", move |event: ScoreEvent| {
    let updates = pending_updates.clone();
    tokio::spawn(async move {
        updates.write().await.push(event);
    });
    Ok(())
}).await?;

// Periodic flush
let updates_for_flush = pending_updates.clone();
tokio::spawn(async move {
    let mut interval = tokio::time::interval(Duration::from_secs(5));
    loop {
        interval.tick().await;
        let mut updates = updates_for_flush.write().await;
        if !updates.is_empty() {
            batch_save_scores(&updates).await;
            updates.clear();
        }
    }
});
```

## Hot Reloading and Deployment

### Development Workflow

Build and deploy changes without server restart:

```bash
# Build new version
cargo build --release

# Copy over existing plugin
cp target/release/libchat_plugin.so ../horizon/plugins/

# Server automatically detects change and reloads
```

The server performs these steps automatically:
1. Call `on_shutdown()` on the existing plugin
2. Unload the old version
3. Load the new version  
4. Call `register_handlers()` and `on_init()` on the new plugin

### Production Deployment

```bash
# Build optimized release
cargo build --release

# Strip symbols for smaller binary
strip target/release/libmy_plugin.so

# Deploy to server
scp target/release/libmy_plugin.so server:/path/to/horizon/plugins/
```

### Plugin Configuration

Create configuration files in the plugins directory:

```toml
# plugins/my_plugin.toml
[plugin]
enabled = true
auto_load = true
priority = 100

[settings]
max_players = 1000
feature_flags = ["advanced_features"]
```