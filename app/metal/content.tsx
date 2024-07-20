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

      <p>
        To get started on Horizon Metal, contact our team using the form below and a member of our team will
        reach out whebn we are able to process your request.
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