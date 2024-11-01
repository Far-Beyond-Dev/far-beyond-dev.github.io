---
title: About Horizon
image:
tags: []
stability: stable
excerpt: A brief introduction to Horizon
---

# Getting started with Horizon

![horizon-server-high-resolution-logo-transparent](https://github.com/Far-Beyond-Dev/Horizon-Community-Edition/raw/main/branding/horizon-server-high-resolution-logo-transparent.png)

# Join Discord
[Far Beyond LLC Discrord](https://discord.gg/NM4awJWGWu)

# Table Of Contents

- [🚀 Introduction](#introduction)
  - [Synchronized Game Server Architecture](#synchronized-game-server-architecture)
    - [How it Works](#how-it-works)
    - [Benefits](#benefits)
    - [Implementation Details](#implementation-details)
    - [Event Propagation and Multicasting](#event-propagation-and-multicasting)
    - [Coordinate Management and Region Mapping](#coordinate-management-and-region-mapping)


# 🚀 Introduction

Horizon is a custom game server software designed to facilitate seamless interaction between Unreal Engine 5 (UE5) and client applications through socket.io. It provides a scalable and customizable solution for hosting multiplayer games and managing real-time communication between players and a limitless number of game servers or "Hosts".

## Synchronized Game Server Architecture

Horizon offers two distinct architectural models for game server synchronization:

---

## 1. Peer-to-Peer Model (Community Edition)

In the Community Edition, Horizon utilizes a peer-to-peer model for synchronizing multiple game server instances. This approach allows for efficient communication and coordination between servers without the need for a central authority.

### How it Works

- Each Horizon server instance operates as an equal peer in the network.
- Servers communicate directly with each other to share game state updates, player actions, and other relevant information.
- The peer-to-peer model enables horizontal scalability, allowing new server instances to be added seamlessly to the network.

### Benefits

- Decentralized architecture, reducing single points of failure.
- Lower operational complexity, ideal for smaller deployments or community-driven projects.
- Efficient resource utilization across all participating servers.

---

## 2. Parent-Child-Master Architecture (Enterprise Edition)

For larger-scale deployments and enterprise use cases, Horizon offers an advanced Parent-Child-Master architecture. This model provides enhanced control, scalability, and management capabilities.

### How it Works

- **Master Node**: Oversees the entire network, managing global state and coordination.
- **Parent Nodes**: Act as regional coordinators, managing a subset of Child nodes.
- **Child Nodes**: Handle individual game instances or regions, reporting to their Parent node.

This hierarchical structure allows for more sophisticated load balancing, fault tolerance, and centralized management as well as limitless scalability.

![Diagram](https://github.com/user-attachments/assets/96bdd2a1-e17a-44a2-b07b-04eacbdec4eb)
(Server PNG By FreePik)

### Benefits

- Highly scalable architecture suitable for massive multiplayer environments.
- Advanced load balancing and resource allocation capabilities.
- Centralized monitoring and management through the Master node.
- Enhanced fault tolerance and redundancy options.
---
## Choosing the Right Architecture

- The Peer-to-Peer model (Community Edition) is ideal for smaller projects, community servers, or deployments that prioritize simplicity and decentralization.
- The Parent-Child-Master architecture (Enterprise Edition) is designed for large-scale commercial games, MMOs, or any project requiring advanced management and scalability features.

Both architectures leverage Horizon's core strengths in real-time synchronization and efficient data propagation, ensuring a consistent and responsive gaming experience regardless of the chosen model.

---

## Implementation Details

#### Configuration

Administrators can fine-tune synchronization parameters via the `server-config.json` file, adjusting settings such as synchronization frequency and data prioritization to suit specific requirements.

#### Monitoring

Horizon provides built-in monitoring tools to track synchronization performance, allowing administrators to identify and address any potential bottlenecks or issues promptly.

## Event Propagation and Multicasting

Horizon implements a robust event propagation mechanism to facilitate communication between servers based on spatial proximity and event origin.

#### Multicast System

Events are multicast from the Parent node to Child nodes based on their geographical proximity and relevance to the event origin. This ensures that only necessary servers receive and process the events, optimizing network bandwidth and computational resources.

#### Propagation Distance

Each event carries a propagation distance parameter, allowing servers to determine whether they should propagate the event further or handle it locally based on their position relative to the event origin.

## Coordinate Management and Region Mapping

### Spatial Coordinates

Horizon uses a 64-bit floating-point coordinate system to manage server positions within a simulated universe. Each server instance covers a cubic light year, and coordinates are stored relativistically to avoid overflow issues.

### Region Mapping

Servers are organized into a grid-based region map, where each region corresponds to a specific set of spatial coordinates. This mapping enables efficient routing of events between servers, as servers can quickly determine which neighboring servers should receive specific events based on their region coordinates.