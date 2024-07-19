"use client"
import React from 'react';
import Sparkles from './sparkles';
import Macbook from './macbook-scroll';
import { TracingBeam } from "./ui/tracing-beam";
import Card from './card-pin';
import Wires from './google-gemini';
import GlowCard from './card-glow';
import styled from 'styled-components';

const Grid = styled.div`
   display: grid;
   max-width: 1150px;
   grid-template-columns: repeat(3, 2fr);
   column-gap: 15px;
   row-gap: 15px;
  `

export function Content() {
  return (
    <TracingBeam className="px-6">
      <div className=" dark:bg-black bg-white  dark:bg-dot-white/[0.3] bg-dot-black/[0.2] relative grid items-start">
        <Sparkles/>

        <text className='text-5xl'>What is Horizon?</text>

        <br></br>
        <br></br>
        <br></br>
        <p>Horizon is a cutting-edge game server software designed to facilitate seamless interaction between your game clients through socket.io. It provides a scalable and customizable solution for hosting multiplayer games and managing real-time communication between players and a limitless number of game servers or Hosts.</p>
        <br></br>
        <br></br>
        <br></br>

        <Wires/>

        <br></br>
        <br></br>
        <br></br>
        <p>For enterprise customers, Horizon provides a robust and scalable solution tailored to meet the demands of large-scale deployments. Our pricing model ensures cost-effectiveness by allowing free license keys and free operation for multiple instances on a single server. Costs only apply when linking multiple physical servers, with fees based on the number of servers rather than the number of instances. This approach allows enterprises to efficiently manage resources and scale operations without incurring unnecessary expenses. Enterprise customers benefit from dedicated support, ensuring seamless deployment, optimal performance, and reliability across their game server infrastructure. Horizon's customizable synchronization parameters and centralized management simplify large-scale server operations, making it an ideal choice for enterprises seeking to deliver exceptional multiplayer gaming experiences.</p>
        <br></br>
        <br></br>
        <br></br>

        <text className='text-5xl'>Features</text>
        <br></br>
        <br></br>
        <br></br>
        <Grid>
          <GlowCard/>
          <GlowCard/>
          <GlowCard/>
          <GlowCard/>
          <GlowCard/>
          <GlowCard/>
          <GlowCard/>
          <GlowCard/>
          <GlowCard/>
        </Grid>
      </div>
    </TracingBeam>
  );
}

export default Content