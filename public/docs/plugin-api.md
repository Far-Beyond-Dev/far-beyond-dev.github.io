---
title: Horizon Plugin API
image:
excerpt: Learn how Horizon's plugin API works
tags: ["basics", "tutorial", "Plugins"]
stability: stable
---

# Plugin-API

The easy and fast way to manage content. Let's take a closer look at the technical implementation of loading the plugins. 
## Table of Contents

1. [Entrypoint](#entrypoint)
2. [Overview of the Internal Loading Process](#loading-plugins)
3. [Technical Implementation and Points of Failure](#technical-implementation-and-points-of-failure)

# Entrypoint

When loading your plugins, Horizon will look at the `plugin-api` folder's `build.rs` script. This script runs at compile time to make your custom extensions accessible within Horizon. This entry point generates a `plugin_imports.rs` file, which acts as the interface for your extensions, pointing to and importing any valid plugins in the `/plugins` directory.

# The import Process

The plugin-loading process begins in `build.rs`, which searches the parent directory for a `plugins` directory. Once located, it scans for **valid** [Cargo crates](https://doc.rust-lang.org/cargo/guide/project-layout.html). The script then queries the crate's name, version, and complete relative path. This information is used to update `Cargo.toml` by adding the detected plugins as dependencies. Finally, the script auto-generates the `plugin_imports.rs` file in `plugin-api/src`.

### File Layouts


**Before** loading the plugins:

```
plugin-api/
├─ build.rs <-- Script responsible for scanning and loading plugins
├─ src/
plugins/
├─ plugin_a/ <-- Must be a valid rust crate
├─ plugin_b/

```


**After** loading the plugins:

```
plugin-api/
├─ build.rs <-- Script responsible for scanning and loading plugins
├─ src/
│  ├─ plugin_imports.rs <-- Auto-generated file containing plugin imports
plugins/
├─ plugin_a/
├─ plugin_b/
```


# Technical Implementation and Points of Failure

This section does not provide a comprehensive overview of the code but highlights the key operations and their implementations. Additionally, it will examine potential error scenarios that may arise.

## Plugin Discovery

```rust
fn discover_plugins(plugins_dir: &Path) -> Vec<(String, String, String)>
```

This function scans the `../plugin` directory. As indicated by its signature, the function does not return explicit errors; instead, it produces a `Vec` that may be empty or partially populated in case of issues. When successful, it returns a tuple containing the `crate name`, `version`, and `folder_name`.

### Potential Points of Failure

The function may produce partial results or an empty `Vec` under the following circumstances:

- The `plugin` directory is missing or inaccessible due to read errors.
- The final path component contains an invalid format (e.g., terminating with `...`).
- An entry within the directory is not recognized as a valid Rust crate.


#### Note
In this context, "failure" does not imply a program crash. The `plugin-api` may continue execution even if portions of the code encounter issues. Here, "failure" refers to any deviation from expected behaviour or incomplete processing.

## Updating `Cargo.toml`

```rust
fn update_cargo_toml(plugin_paths: &[(String, String, String)]) -> std::io::Result<()>
```

This function updates the `Cargo.toml` file within the current directory (i.e., `plugin-api`). The crate is responsible for automatically generating and maintaining the `Cargo.toml` file. The function is expected to fail only in cases of I/O-related errors, assuming no manual modifications have been made to the `Cargo.toml` file.


## Generating the `plugin_imports.rs` File

```rust
fn generate_plugin_files(plugin_paths: &[(String, String, String)]) -> std::io::Result<()>
```

This function is responsible for ensuring the creation of the `plugin_imports.rs` file within the `./src/` directory. While `generate_plugin_files` itself does not directly handle code generation, it guarantees the existence of the `./src/`directory. The core task of code generation is delegated to the `generate_imports_file` callback function, which performs the detailed work of creating the necessary import content. This function is susceptible to failures only due to I/O-related issues, such as insufficient permissions or underlying file system errors.
