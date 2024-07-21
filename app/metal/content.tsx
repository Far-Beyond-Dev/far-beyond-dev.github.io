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

  <div>
    <TracingBeam className="px-6">
      <PageTitle>Horizon Metal</PageTitle>

      {/* Page Content */}
      <div className='pt-10 pb-10'>
        <h1 className='text-5xl'>What is Horizon Metal?</h1>
      </div>
      <p>
        Horizon Metal is designed for clients who prefer an on-premesis setup taylored specifically to their needs.
        Metal clients recieve a set of servers that are designed and built by the Horizon team for their game.
        Pricing on Horizon metal setups very depending on the complexity of the configuration process and hardware requirements.
      </p>
      <br></br>

      <div class="flex justify-center items-center">
        <div className='stack'>
          <img className='align-center' alt='server-image-transparent' src='/server.png'/>
          <p className='text-center text-gray-500'>Image: Fujitsu - MediaWiki</p>
        </div>
      </div>

      <div className='pt-10 pb-10'>
        <h1 className='text-5xl'>Why use Horizon Metal?</h1>
      </div>
      <p>
        Horizon Metal is perfect for companies who dont want to spend time troubleshooting their Horizon setups.
        It is also useful if you want your hardware to be optimized specifically for your game. For example one of your subsystems
        may use CUDA for a massivly parelell set of tasks, We can figure out how to maximise players and minimise cost by running only
        the hardware you need in each physical server.
      </p>
      <br></br>
      
      <div className='pt-10 pb-10'>
        <h1 className='text-5xl'>Getting Started</h1>
      </div>
      <p>
        To get started on Horizon Metal, contact our team using the form below and a member of our team will
        reach out when we are able to process your request.
      </p>
      <br></br>

      <div className='pt-20'>
        <ContactMetal/>
      </div>


    </TracingBeam>
    <div className='pt-10'>
      <Newsletter/>
    </div>
  </div>
  );
}

export default Content