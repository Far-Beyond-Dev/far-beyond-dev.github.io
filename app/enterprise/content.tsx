"use client"
import React from 'react';
import { TracingBeam } from "../components/ui/tracing-beam";
import styled from 'styled-components';
import { PageTitle } from '../components/page-title';
import { EnterpriseCards } from '../components/enterprise-cards';
import { EnterpriseSlides } from '../components/enterprise-slideshow'
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
    <div className=" text-gray-100 min-h-screen">
      <TracingBeam className="px-6">
        <PageTitle>Horizon Enterprise Edition</PageTitle>

        {/* Why Go Enterprise Section */}
        <section className="py-12">
          <h1 className="text-5xl font-extrabold mb-8">Why Go Enterprise?</h1>
          <div className="space-y-6 text-lg text-gray-300">
            <p>
              For enterprise customers, Horizon provides a robust and scalable solution tailored to meet
              the demands of large-scale deployments. Our pricing model ensures cost-effectiveness
              by allowing free license keys and free operation for multiple instances on a single server.
            </p>
            <p>
              Enterprise edition is needed when linking multiple physical servers, with fees based on the
              number of servers rather than the number of instances. This approach allows enterprises to
              efficiently manage resources and scale operations without incurring unnecessary expenses.
            </p>
            <p>
              Enterprise-level customers benefit from dedicated support, ensuring seamless deployment,
              optimal performance, and reliability across their game server infrastructure. Horizon&apos;s
              customizable synchronization parameters and centralized management simplify large-scale server
              operations, making it an ideal choice for enterprises seeking to deliver exceptional
              multiplayer gaming experiences.
            </p>
          </div>
        </section>

        {/* Dashboard Benefits Section */}
        <section className="py-12">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-extrabold text-gray-100 sm:text-4xl mb-6">
              Empower Your Enterprise with Our Advanced Dashboard
            </h2>
            
        {/* Enterprise Cards Section */}
        <section className="py-12">
          <EnterpriseCards />
        </section>
            <p className="text-xl text-gray-300 mb-10">
              Exclusively available to our enterprise customers, our cutting-edge dashboard provides unparalleled control and insight into your Horizon deployment.
            </p>
            <ul className="space-y-10">
              <li className="flex">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-100">Streamlined Module Management</h3>
                  <p className="mt-2 text-base text-gray-400">
                    Enable or disable modules with ease, allowing you to tailor Horizon to your specific needs. Our intelligent system ensures smooth recompilation, minimizing downtime and maximizing efficiency.
                  </p>
                </div>
              </li>
              <li className="flex">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-100">Granular Configuration Control</h3>
                  <p className="mt-2 text-base text-gray-400">
                    Fine-tune every aspect of your Horizon installation with our intuitive configuration interface. From security settings to performance optimizations, take full control of your environment.
                  </p>
                </div>
              </li>
              <li className="flex">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-100">Real-time Insights and Analytics</h3>
                  <p className="mt-2 text-base text-gray-400">
                    Gain valuable insights into your system&apos;s performance with our comprehensive analytics. Monitor resource usage, track user activities, and make data-driven decisions to optimize your operations.
                  </p>
                </div>
              </li>
            </ul>
            <div className="mt-10">
              <a href="#contact-sales" className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition duration-150 ease-in-out">
                Contact Sales for Enterprise Access
              </a>
            </div>
          </div>
        </section>

        {/* Enterprise Slides Section */}
        <section className="py-12">
          <EnterpriseSlides />
        </section>


        {/* Join Us Section */}
        <section className="py-12">
          <h1 className="text-5xl font-extrabold mb-8">Join us today!</h1>
          <ContactEnterprise />
        </section>

      </TracingBeam>
    </div>
  );
}

export default Content;