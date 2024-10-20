---
title: Development - Getting Started
image: 
excerpt: Documentation for developers who want to start working on Horizon open source
---

# Contributing to the Horizon game server

## Project Structure

The Horizon project directory consists of several key components:

- `src/`: Contains source code for the Horizon server.
- `horizon-physics-engine/`: Additional modules or plugins for extended functionality.
- `BuntDB/`: Database-related files and configurations.
- Other configuration files and scripts for Docker and environment setup.

Lets take a look at `main.rs` file serves as the entry point for the server, initializing various subsystems, handling player connections, and setting up the server to listen for incoming connections.

## Table of Contents

1. [File Structure](#file-structure)
2. [Imports and Dependencies](#imports-and-dependencies)
3. [Modules](#modules)
4. [Player Connection Handling](#player-connection-handling)
5. [Main Function](#main-function)

## File Structure

The `main.rs` file is structured as follows:

1. Import statements for dependencies and modules.
2. Definition of the `on_connect` function to handle new player connections.
3. The `main` asynchronous function which sets up and runs the server.

## Imports and Dependencies

The file begins with necessary imports for the server to function:

```rust
use serde_json::Value;
use socketioxide::extract::{Data, SocketRef};
use std::sync::{Arc, Mutex};
use tokio::main;
use tracing::info;
use viz::{serve, Result, Router};
use PebbleVault;
use TerraForge;

use structs::*;
```

### Description

- **serde_json**: For handling JSON data.
- **socketioxide**: For managing Socket.IO connections.
- **std::sync**: For thread-safe data sharing.
- **tokio**: For asynchronous runtime.
- **tracing**: For logging.
- **viz**: For server routing and serving.
- **PebbleVault**: Custom database interactions.
- **TerraForge**: Custom terrain generation.

## Modules

The server functionality is split into several modules:

```rust
mod events;
mod macros;
mod structs;
mod subsystems;
```

- **events**: Custom event handling.
- **macros**: Macros used throughout the server.
- **structs**: Data structures used in the server.
- **subsystems**: Various subsystems (chat, game logic, etc.).

## Player Connection Handling

### `on_connect` Function

This function is triggered whenever a new player connects to the server. It authenticates the player and initializes necessary data and subsystems.

```rust
fn on_connect(socket: SocketRef, Data(data): Data<Value>, players: Arc<Mutex<Vec<Player>>>) {
    let player = Player {
        id: socket.id.to_string(),
        socket: socket.clone(),
        location: None, // Initialize with no location
    };
    
    players.lock().unwrap().push(player);
    
    info!("Socket.IO connected: {:?} {:?}", socket.ns(), socket.id);
    socket.emit("connected", true).ok();
    socket.emit("auth", data).ok();
    
    subsystems::chat::init(socket.clone());
    subsystems::game_logic::init();
    subsystems::leaderboard::init();
    subsystems::level_data::init();
    subsystems::logging::init();
    subsystems::notifications::init();
    subsystems::player_data::init(socket.clone());
    
    define_event!(socket, "test", events::test::main());
}
```

### Description

- **Player Initialization**: Creates a new `Player` instance with a unique ID and no initial location.
- **Player Authentication**: Authenticates the player and emits necessary events.
- **Subsystem Initialization**: Initializes various subsystems (chat, game logic, etc.).
- **Custom Event Registration**: Registers custom events for the server.

## Main Function

### `main` Function

The `main` function initializes the server, sets up database connections, and starts listening for incoming connections.

```rust
#[main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    subsystems::startup::main();

    TerraForge::main();
    
    println!("{}", PebbleVault::greet("Rust"));
    let db = PebbleVault::create_db();
    PebbleVault::create_spatial_index(db, "SpaceBody", "1");
    PebbleVault::create_galaxy(db, "Galaxy", "Artermis");
    PebbleVault::create_galaxy(db, "Galaxy", "Athena");
    PebbleVault::create_galaxy(db, "Galaxy", "Hades");
    PebbleVault::get_k_nearest_galaxies(db, "Artermis");

    let app = Router::new()
        .get("/", |_| async { Ok("Welcome to Horizon Server V: 0.3.0-318974-C") });

    info!("Starting server...");

    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000").await.unwrap();

    if let Err(e) = serve(listener, app).await {
        println!("{}", e);
    }

    Ok(())
}
```

### Description

- **Subsystem Startup**: Calls startup routines for necessary subsystems.
- **Database Setup**: Initializes the database and creates spatial indexes and galaxies.
- **Server Setup**: Configures the server to listen on `0.0.0.0:3000` and handles incoming connections.
- **API Endpoint**: Provides a simple API endpoint returning a welcome message.

## Contribution Guidelines

- Follow the project's coding standards and conventions.
- Submit pull requests for proposed changes or enhancements.
- Collaborate with the community on GitHub issues and discussions.