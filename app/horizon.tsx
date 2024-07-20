"use client"
import React from 'react';
import Sparkles from './components/sparkles';
import { TracingBeam } from "./components/ui/tracing-beam";
import Wires from './components/google-gemini';
import styled from 'styled-components';
import Features from './components/feature-cards';
import Newsletter from './components/newsletter';

const Grid = styled.div`
   display: grid;
   max-width: 1150px;
   grid-template-columns: repeat(3, 2fr);
   column-gap: 15px;
   row-gap: 15px;
  `

export function Content() {
  return (
    <div>
      <TracingBeam className="px-6">
      <div className=" dark:bg-black bg-white  dark:bg-dot-white/[0.3] bg-dot-black/[0.2] relative grid items-start">
        <Sparkles/>

        <h1 className='text-5xl'>What is Horizon?</h1>
        <p>Horizon is a cutting-edge game server software designed to facilitate seamless interaction between your game clients through socket.io. It provides a scalable and customizable solution for hosting multiplayer games and managing real-time communication between players and a limitless number of game servers or Hosts.</p>
        <br></br>
        <br></br>
        <br></br>

        <Wires/>

        <br></br>
        <br></br>
        <br></br>
        <br></br>

        <text className='text-5xl'>Benefits of Horizon</text>

        <Features/>
        
      </div>
    </TracingBeam>
    <div className='pt-10'>
        <Newsletter/>
    </div>
  </div>
  );
}

export default Content