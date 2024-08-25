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
    <div className="min-h-screen">
      <TracingBeam className="px-6">
        <div className="dark:bg-black bg-white dark:bg-dot-white/[0.3] bg-dot-black/[0.2] relative">
          <Sparkles />
          
          <section className="py-12">
            <h1 className="text-5xl font-extrabold mb-6">What is Horizon?</h1>
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
              Horizon is a cutting-edge game server software designed to facilitate seamless interaction between your game
              clients through socket.io. It provides a scalable and customizable solution for hosting multiplayer games and
              managing real-time communication between players and a limitless number of game servers or Hosts.
            </p>
          </section>

          <section className="py-12">
            <Wires />
          </section>

          <section className="py-12">
            <h2 className="text-5xl font-extrabold mb-8">Benefits of Horizon</h2>
            <Features />
          </section>
          
        </div>
      </TracingBeam>
    </div>
  );
}

export default Content