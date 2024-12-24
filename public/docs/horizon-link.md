---
title: Horizon Link Plugins
image: "https://openapi-generator.tech/img/mono-logo.svg"
tags: ["basics", "tutorial"]
stability: stable
excerpt: A brief introduction to Horizon's link protocol and plugins
---

# Horizon Link - An overview

## 1. What is a Horizon link plugin? 
Horizon link plugins are a special class of Horizon designed to change how all other pieces of code socket events effectivly acting as a socket middleware.

## 2. Why?
Horizon link plugins were developed as a method of putting amiddleman between players sending events and the server recieving them.
    
### Without link plugins
Horizon without a link system would look something like this:
    
![image](/docs/media/horizon-link/without-link-plugin.png)

### With the link plugin

Now lets see how link plugins make the system more versitile:

![image](/docs/media/horizon-link/with-link-plugin.png)

### Benefits

So why have this seemingly more complex system that appears to do the same thing? In order to see that, we will need to dive into how player packets are processed.

![image](/docs/media/horizon-link/full-link-protocol.png)

## 3. How does it work?

## 

```rust
mod thing;
```