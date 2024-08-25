"use client"
import React from 'react';
import { TracingBeam } from "../components/ui/tracing-beam";
import styled from 'styled-components';
import { PageTitle } from '../components/page-title';
import { EnterpriseCards } from '../components/enterprise-cards';
import Newsletter from '../components/newsletter';
import ContactMetal from '../components/contact-metal';

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
      <PageTitle>Horizon Metal</PageTitle>
      
      <section className="py-12">
        <h1 className="text-5xl font-extrabold mb-6">What is Horizon Metal?</h1>
        <p className="text-lg text-gray-700 dark:text-gray-300">
          Horizon Metal is designed for clients who prefer an on-premises setup tailored specifically to their needs.
          Metal clients receive a set of servers that are designed and built by the Horizon team for their game.
          Pricing on Horizon metal setups vary depending on the complexity of the configuration process and hardware requirements.
        </p>
      </section>

      <section className="py-12 flex flex-col items-center">
        <div className="max-w-2xl">
          <img className="w-full h-auto" alt="server-image-transparent" src="/server.png"/>
          <p className="text-center text-gray-500 mt-2">Image: Fujitsu - MediaWiki</p>
        </div>
      </section>

      <section className="py-12">
        <h2 className="text-5xl font-extrabold mb-6">Why use Horizon Metal?</h2>
        <p className="text-lg text-gray-700 dark:text-gray-300">
          Horizon Metal is perfect for companies who don&apos;t want to spend time troubleshooting their Horizon setups.
          It is also useful if you want your hardware to be optimized specifically for your game. For example, one of your subsystems
          may use CUDA for a massively parallel set of tasks. We can figure out how to maximize players and minimize cost by running only
          the hardware you need in each physical server.
        </p>
      </section>

      <section className="py-12">
        <h2 className="text-5xl font-extrabold mb-6">Getting Started</h2>
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
          To get started on Horizon Metal, contact our team using the form below and a member of our team will
          reach out when we are able to process your request.
        </p>
        <ContactMetal />
      </section>

    </TracingBeam>
  </div>
  );
}

export default Content