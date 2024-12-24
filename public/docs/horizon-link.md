---
title: Horizon Link Plugins
image: "https://openapi-generator.tech/img/mono-logo.svg"
tags: ["basics", "tutorial"]
stability: stable
excerpt: A brief introduction to Horizon's link protocol and plugins
---

# Horizon Link - An overview
<br></br>

## 1. What is a Horizon link plugin? 
Horizon link plugins are a special class of Horizon plugin designed to change how all other pieces of code socket events effectivly acting as a socket middleware.
<br></br>

## 2. Why?
Horizon link plugins were developed as a method of putting amiddleman between players sending events and the server recieving them.
<br></br>

### Without link plugins
Horizon without a link system would look something like this:
    
![image](/docs/media/horizon-link/without-link-plugin.png)
<br></br>

### With the link plugin

Now lets see how link plugins make the system more versitile:

![image](/docs/media/horizon-link/with-link-plugin.png)
<br></br>

### Benefits

So why have this seemingly more complex system that appears to do the same thing? In order to see that, we will need to dive into how player packets are processed.

![image](/docs/media/horizon-link/full-link-protocol.png)
<br></br>

## 3. How does it work?

Horizon link works as a standard plugin. All link plugins provide a single API endpoint: ``register event`` which horizon calls out to whenever it is asked to register an event listner either by internal code or a loading plugin. All link plugins **MUST** be called ``horizon_link`` in their cargo.toml file this means only one can be loaded at a time. Versions of Hoizon that are link-enabled **REQUIRE** a link plugin to be installed to compile. Any link plugin that fits your use case will satisfy it.
<br></br>

### how to create a listner via a link plugin
Creating a listener is exactly the same as other versions of horizon except with socet being replaced by ``listener``

```rust
use horizon_link::listener;

listner.on("connect", | socket: SocketRef, data: Value | {
    // Your code to handle the event here
});
```