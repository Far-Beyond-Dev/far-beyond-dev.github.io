"use client"
import React from 'react';
import { TracingBeam } from "../components/ui/tracing-beam";
import styled from 'styled-components';
import { PageTitle } from '../components/page-title';
import { EnterpriseCards } from '../components/enterprise-cards';
import Newsletter from '../components/newsletter';
import ContactEnterprise from '../components/contact-enterprise';

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
      <PageTitle>Horizon Enterprise Edition</PageTitle>

      {/* Page Content */}
      <div className='pt-10 pb-10'>
        <h1 className='text-5xl'>Why Go Enterprise?</h1>
      </div>
      <p>
        For enterprise customers, Horizon provides a robust and scalable solution tailored to meet
        the demands of large-scale deployments. Our pricing model ensures cost-effectiveness
        by allowing free license keys and free operation for multiple instances on a single server.
      </p>
      <br></br>
      <p>
        Enterprise edition is needed when linking multiple physical servers, with fees based on the
        number of servers rather than the number of instances. This approach allows enterprises to
        efficiently manage resources and scale operations without incurring unnecessary expenses.
      </p>
      <br></br>
      <p>
        Enterprise-level customers benefit from dedicated support, ensuring seamless deployment,
        optimal performance, and reliability across their game server infrastructure. Horizon&apos;s
        customizable synchronization parameters and centralized management simplify large-scale server
        operations, making it an ideal choice for enterprises seeking to deliver exceptional
        multiplayer gaming experiences.
      </p>

      <div className='pt-20 pb-20'>
        <EnterpriseCards/>
      </div>

      <div className='pt-10 pb-10'>
        <h1 className='text-5xl'>Join us today!</h1>
        <ContactEnterprise/>
      </div>

    </TracingBeam>
    <div className='pt-10'>
      <Newsletter/>
    </div>
  </div>
  );
}

export default Content