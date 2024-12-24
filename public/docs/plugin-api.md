---
title: Horizon Plugin API
image:
excerpt: Learn how Horizon's plugin API works
tags: ["basics", "tutorial", "Plugins"]
stability: stable
---

# Horizon Plugin System

## Overview

The Horizon Plugin System provides a flexible architecture for extending server functionality through plugins. At its core, the system utilizes two primary traits - PluginConstruct for initialization and PluginAPI for functionality definition. This design allows for modular development while maintaining type safety and reliable state management.

## Core Concepts

Plugins in Horizon serve as modular components that can interact with the game server's core systems. Each plugin is constructed with access to existing plugins, allowing for inter-plugin communication and dependency management.

The PluginConstruct trait handles the initialization phase of plugins, providing shared methods for setup and structure definition. This trait ensures that plugins can safely initialize their state and declare any custom structures they introduce to the system. The plugin construction process includes state initialization, event handler registration, and setup of any necessary background processes.

The PluginAPI trait defines the interface that plugins expose to the rest of the system. This includes standard methods for handling player connections, managing game state, and processing events. Plugins can extend this base functionality by implementing additional methods specific to their purpose while maintaining compatibility with the core system.

## Implementation

Plugins in Horizon are implemented using Rust's trait system, providing a strong type-safe foundation. The system uses Arc and RwLock for thread-safe state management, allowing multiple parts of the system to access plugin data concurrently. Plugin state can be managed through static references with lazy initialization, ensuring efficient resource usage.

Event handling in plugins is managed through a socket-based system, allowing plugins to listen for and respond to various game events. Plugins can register custom event handlers and maintain their own state while interacting with the core server systems. The event system provides mechanisms for both synchronous and asynchronous event processing.

State management in plugins utilizes thread-safe data structures and proper locking strategies to maintain data consistency. Plugins can maintain their own internal state while also accessing shared server state through provided interfaces. This design allows for complex plugin behavior while preventing race conditions and ensuring data integrity.

## Best Practices

When developing plugins for Horizon, several best practices should be followed. State management should utilize appropriate thread-safe constructs and implement proper locking strategies. Event handlers should be implemented with consideration for concurrency and proper cleanup on disconnect. Error handling should be comprehensive, with proper error propagation and meaningful error messages.

Plugin initialization should be handled carefully, ensuring that all necessary resources are properly allocated and configured. Dependencies between plugins should be managed through the provided plugin HashMap, allowing for proper initialization order and resource sharing. Thread safety considerations should be paramount, with proper use of synchronization primitives and careful management of shared resources.

## Security Considerations

Plugin security is a critical consideration in the Horizon system. Plugins should validate all input data and implement appropriate access controls. Resource usage should be monitored and limited to prevent abuse. Error handling should be implemented in a way that prevents information leakage while providing useful debugging information when appropriate.

Thread safety is particularly important for security. Plugins should implement proper synchronization to prevent race conditions and data corruption. Access to shared resources should be carefully controlled and monitored. Proper cleanup procedures should be implemented to prevent resource leaks and maintain system stability.

## Example Implementation

Here's an example of a basic generic plugin implementation:

```rust
use horizon_plugin_api::{Plugin, Pluginstate, LoadedPlugin};
use parking_lot::RwLock;
use std::sync::Arc;
use std::collections::HashMap;

// Plugin state structure
struct PluginState {
    active: bool,
    data: String,
}

// Constructor trait implementation
impl PluginConstruct for Plugin {
    fn new(plugins: HashMap<String, (Pluginstate, Plugin)>) -> Plugin {
        let state = Arc::new(RwLock::new(PluginState {
            active: false,
            data: String::new(),
        }));
        
        Plugin {}
    }

    fn get_structs(&self) -> Vec<&str> {
        vec!["Plugin"]
    }
}

// Plugin API implementation
impl PluginAPI for Plugin {
    fn player_joined(&self, socket: SocketRef, player: Arc<RwLock<Player>>) {
        let mut state = self.state.write();
        state.active = true;
        
        setup_listeners(socket, player);
    }
}

// Helper functions
fn setup_listeners(socket: SocketRef, player: Arc<RwLock<Player>>) {
    socket.on("custom_event", move |socket: SocketRef, data: Value| {
        // Handle custom event
        println!("Received custom event: {:?}", data);
    });
}
```

## Future Development

The Horizon Plugin System is designed to be extensible and maintainable. Future developments will include, among others integration with [Horizon Link](https://horizon.farbeyond.dev/docs/horizon-link) to allow for easy event handling from the client