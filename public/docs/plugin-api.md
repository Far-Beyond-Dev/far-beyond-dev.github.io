---
title: Horizon Plugin API
image:
excerpt: Learn how Horizon's plugin API works
tags: ["basics", "tutorial", "Plugins"]
stability: stable
---

# Horizon Plugin System

The Horizon Plugin System provides an extensible framework for creating modular applications with dynamic plugin loading capabilities. This document provides a comprehensive overview of the system, implementation details, and best practices for plugin development.

# Overview

The Horizon Plugin System enables dynamic loading and management of plugins at runtime while maintaining type safety and proper lifecycle management. When you implement the plugin system, Horizon will automatically handle plugin discovery, dependency resolution, and code generation through its build script system.

The system offers several key advantages over traditional plugin architectures:

- Automatic plugin discovery and loading
- Type-safe plugin interfaces
- Comprehensive lifecycle management
- Cross-plugin dependency resolution
- Thread-safe plugin execution

# Prerequisites

Before implementing the Horizon Plugin System, ensure your project meets these requirements:

```toml
# Cargo.toml
[dependencies]
horizon-plugin-api = "0.1.0"
```

Your project must also follow a specific directory structure:

```toml
your-project/
├─ plugin-api/
│  ├─ build.rs          # Build script for plugin discovery
│  ├─ Cargo.toml        # Plugin API dependencies
│  ├─ src/
│  │  ├─ lib.rs         # Plugin API definitions
│  │  ├─ plugin_imports.rs  # Auto-generated imports
├─ plugins/
│  ├─ plugin_a/         # Individual plugin crates
│  │  ├─ Cargo.toml
│  │  ├─ src/
│  │  │  ├─ lib.rs
│  ├─ plugin_b/
```

# Plugin Architecture

## Core Components

The plugin system consists of several core components that work together:

### Plugin Trait

The Plugin trait defines the interface that all plugins must implement:

```rust
pub trait Plugin: Any + Send + Sync {
    /// Called when the plugin is first loaded
    fn on_load(&self);

    /// Called when the plugin is being unloaded
    fn on_unload(&self);

    /// Main execution point for the plugin
    fn execute(&self);
    
    /// Initialize plugin with provided context
    fn initialize(&self, context: &mut PluginContext);
    
    /// Cleanup when shutting down
    fn shutdown(&self, context: &mut PluginContext);

    /// Called when plugin is enabled
    fn on_enable(&self, context: &mut PluginContext);
    
    /// Called when plugin is disabled
    fn on_disable(&self, context: &mut PluginContext);
}
```

### Plugin Metadata

Each plugin includes metadata that describes its capabilities and requirements:

```rust
pub struct PluginMetadata {
    pub name: String,
    pub version: String,
    pub description: String,
    pub api_version: ApiVersion,
}

impl PluginMetadata {
    pub fn new(name: &str, version: &str, description: &str, api_version: ApiVersion) -> Self {
        Self {
            name: name.to_string(),
            version: version.to_string(),
            description: description.to_string(),
            api_version,
        }
    }
}
```

### Plugin Context

The PluginContext provides a shared environment for plugins to interact:

```rust
pub struct PluginContext {
    pub shared_state: Arc<RwLock<HashMap<String, Box<dyn Any + Send + Sync>>>>,
    pub events: EventBus,
}
```

# Plugin Manager

The PluginManager is the central component responsible for plugin lifecycle management. It handles loading, unloading, and state transitions for all plugins in the system.

## Creating a Plugin Manager

```rust
pub struct PluginManager {
    plugins: HashMap<String, (Pluginstate, Plugin)>
}

impl PluginManager {
    /// Create a new plugin manager instance
    pub fn new() -> PluginManager {
        PluginManager {
            plugins: HashMap::new(),
        }
    }
    
    /// Load a specific plugin
    pub fn load_plugin(mut self, name: String, plugin: Plugin) {
        self.plugins.insert(name, (Pluginstate::ACTIVE, plugin));
    }

    /// Unload a specific plugin
    pub fn unload_plugin(mut self, name: String) {
        self.plugins.remove(&name);
    }

    /// Get all loaded plugins
    pub fn get_plugins(self) -> HashMap<String, (Pluginstate, Plugin)> {
        self.plugins
    }

    /// Load all discovered plugins
    pub fn load_all(&mut self) -> HashMap<String, LoadedPlugin> {
        self.plugins = plugin_imports::load_plugins();
        
        let mut loaded_plugins = HashMap::new();
        for (name, (state, plugin)) in &self.plugins {
            if *state == Pluginstate::ACTIVE {
                loaded_plugins.insert(name.clone(), LoadedPlugin {
                    instance: plugin.clone(),
                });
            }
        }
        loaded_plugins
    }
}
```

## Plugin States

Plugins can exist in several states:

- ACTIVE: The plugin is loaded and running
- INACTIVE: The plugin is loaded but not executing
- UNLOADED: The plugin has been unloaded from memory

The system manages state transitions automatically based on your application's needs and plugin dependencies.

# Plugin Implementation

## Creating a Basic Plugin

Here's a complete example of a basic plugin implementation:

```rust
use horizon_plugin_api::{Plugin, PluginContext, PluginMetadata};

pub struct MyPlugin {
    metadata: PluginMetadata,
    state: Arc<RwLock<PluginState>>,
}

struct PluginState {
    initialized: bool,
    config: HashMap<String, String>,
}

impl MyPlugin {
    pub fn new() -> Self {
        Self {
            metadata: PluginMetadata::new(
                "my_plugin",
                "1.0.0",
                "A sample plugin implementation",
                ApiVersion::new(1, 0, 0)
            ),
            state: Arc::new(RwLock::new(PluginState {
                initialized: false,
                config: HashMap::new(),
            })),
        }
    }
    
    fn setup_resources(&self) -> Result<(), Box<dyn Error>> {
        // Initialize plugin resources
        Ok(())
    }
    
    fn cleanup_resources(&self) {
        // Clean up any allocated resources
    }
}

impl Plugin for MyPlugin {
    fn on_load(&self) {
        if let Err(e) = self.setup_resources() {
            log::error!("Failed to initialize plugin: {}", e);
            return;
        }
        
        let mut state = self.state.write().unwrap();
        state.initialized = true;
    }

    fn on_unload(&self) {
        self.cleanup_resources();
    }

    fn execute(&self) {
        // Main plugin logic
    }
    
    fn initialize(&self, context: &mut PluginContext) {
        // Set up plugin with provided context
        context.shared_state.write().unwrap().insert(
            "my_plugin.config".to_string(),
            Box::new(self.state.clone())
        );
    }
    
    fn shutdown(&self, context: &mut PluginContext) {
        // Clean up plugin state from context
        context.shared_state.write().unwrap().remove("my_plugin.config");
    }

    fn on_enable(&self, context: &mut PluginContext) {
        // Enable plugin functionality
    }
    
    fn on_disable(&self, context: &mut PluginContext) {
        // Disable plugin functionality
    }
}
```

## Plugin Dependencies

To enable cross-plugin dependencies, create a `.allow-imports` file in your plugin directory. The file should be empty - its presence alone signals to the build system that this plugin may depend on others.

When the `.allow-imports` file is present, the build system will:

1. Scan other plugins in the system
2. Update the plugin's Cargo.toml with appropriate dependencies
3. Generate necessary import statements

Example plugin with dependencies:

```rust
use horizon_plugin_api::Plugin;
use other_plugin::SomeFeature;

pub struct DependentPlugin {
    feature: Option<SomeFeature>,
}

impl Plugin for DependentPlugin {
    fn initialize(&self, context: &mut PluginContext) {
        // Access other plugin's functionality
        if let Some(feature) = context.get_shared_feature::<SomeFeature>("other_plugin.feature") {
            self.feature = Some(feature);
        }
    }
}
```

# Build System

## Build Script Operation

The build.rs script performs several key operations:

```rust
fn main() {
    let plugins_dir = Path::new("..").join("plugins");
    
    println!("cargo:warning=Looking for plugins in: {:?}", plugins_dir);
    
    if !plugins_dir.exists() {
        println!("cargo:warning=Plugins directory not found at {:?}", plugins_dir);
        return;
    }

    let plugin_paths = discover_plugins(&plugins_dir);
    println!("cargo:warning=Found {} plugins", plugin_paths.len());
    
    // Update main Cargo.toml
    if let Err(e) = update_cargo_toml(&plugin_paths) {
        println!("cargo:warning=Failed to update Cargo.toml: {}", e);
        std::process::exit(1);
    }
    
    // Update plugin Cargo.toml files
    if let Err(e) = update_plugin_cargo_tomls(&plugins_dir, &plugin_paths) {
        println!("cargo:warning=Failed to update plugin Cargo.toml files: {}", e);
        std::process::exit(1);
    }
    
    if let Err(e) = generate_plugin_files(&plugin_paths) {
        println!("cargo:warning=Failed to generate plugin files: {}", e);
        std::process::exit(1);
    }
}
```

The script generates a plugin_imports.rs file that looks like this:

```rust
// Auto-generated by build.rs
use std::collections::HashMap;

pub use plugin_a;
pub use plugin_a::*;
pub use plugin_a::Plugin as plugin_a_plugin;

pub use plugin_b;
pub use plugin_b::*;
pub use plugin_b::Plugin as plugin_b_plugin;

pub fn load_plugins() -> HashMap<String, (Pluginstate, Plugin)> {
    let plugins = crate::load_plugins!(
        plugin_a,
        plugin_b
    );
    plugins
}
```

## Plugin Discovery Process

The discovery process involves several steps:

1. Scanning the plugins directory for valid Rust crates
2. Validating crate structure and metadata
3. Checking for `.allow-imports` markers
4. Resolving dependencies between plugins
5. Generating necessary code and import statements

# Advanced Features

## Event System

Plugins can communicate using the built-in event system:

```rust
impl Plugin for MyPlugin {
    fn initialize(&self, context: &mut PluginContext) {
        // Subscribe to events
        context.events.subscribe("system.startup", |event| {
            println!("System startup event received: {:?}", event);
        });
    }

    fn execute(&self) {
        // Publish events
        self.context.events.publish("my_plugin.state_changed", MyEvent::new());
    }
}
```

## Plugin Hot-Reloading

The system supports hot-reloading of plugins during development:

```rust
impl PluginManager {
    pub fn reload_plugin(&mut self, name: &str) -> Result<(), PluginError> {
        if let Some((state, plugin)) = self.plugins.remove(name) {
            plugin.on_unload();
            
            // Load updated plugin
            let new_plugin = self.load_plugin_from_path(&format!("../plugins/{}", name))?;
            new_plugin.on_load();
            
            self.plugins.insert(name.to_string(), (state, new_plugin));
            Ok(())
        } else {
            Err(PluginError::NotFound)
        }
    }
}
```

# Debugging and Performance

## Debug Features

The system includes comprehensive debugging capabilities:

```rust
// Enable debug logging
#[cfg(debug_assertions)]
impl PluginManager {
    pub fn debug_info(&self) -> DebugInfo {
        DebugInfo {
            loaded_plugins: self.plugins.len(),
            active_plugins: self.plugins.values()
                .filter(|(state, _)| *state == Pluginstate::ACTIVE)
                .count(),
            memory_usage: self.calculate_memory_usage(),
        }
    }
}
```

## Performance Optimization

Consider these guidelines for optimal performance:

1. Use lazy loading for non-essential plugins
2. Implement efficient cleanup methods
3. Monitor cross-plugin dependencies
4. Profile plugin initialization and execution
5. Use appropriate thread synchronization primitives

The system provides tools for monitoring performance:

```rust
impl Plugin for MyPlugin {
    fn execute(&self) {
        let timer = std::time::Instant::now();
        
        // Plugin logic here
        
        if timer.elapsed() > Duration::from_millis(16) {
            log::warn!("Plugin execution exceeded frame budget");
        }
    }
}
```