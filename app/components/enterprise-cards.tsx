"use client";
import Image from "next/image";
import React from "react";
import { WobbleCard } from "./ui/wobble-card";

export function EnterpriseCards() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 max-w-7xl mx-auto w-full">
      <WobbleCard
        containerClassName="col-span-1 lg:col-span-2 h-full bg-pink-800 min-h-[500px] lg:min-h-[300px]"
        className=""
      >
        <div className="max-w-xs">
          <h2 className="text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
            Horizon Dashboard Manages all your nodes
          </h2>
          <p className="mt-4 text-left w-60  text-base/6 text-neutral-200">
            Horizon Dashboard makes managing thousands of nodes simple
          </p>
        </div>
        <Image
          src="/dashboard/Horizon-Dashboard3.png"
          width={450}
          height={400}
          alt="linear demo image"
          className="absolute -right-4 lg:-right-[40%] filter -bottom-10 object-contain rounded-2xl"
        />
      </WobbleCard>
      <WobbleCard containerClassName="col-span-1 min-h-[300px]">
        <h2 className="max-w-80  text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">

        </h2>
        <p className="mt-4 max-w-[26rem] text-left  text-base/6 text-neutral-200">
          <ul className="list-disc">
            <li>One Dashboard</li>
            <li>Unlimited Servers</li>
            <li>Access Controls</li>
            <li>Audit Logs</li>
            <li>Central Configuration</li>
            <li>Node Groups</li>
            <li>Rolling Updates</li>
          </ul>
        </p>
      </WobbleCard>
      <WobbleCard containerClassName="col-span-1 lg:col-span-3 bg-blue-900 min-h-[500px] lg:min-h-[600px] xl:min-h-[300px]">
        <div className="max-w-sm">
          <h2 className="max-w-sm md:max-w-lg  text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
            Contact our team to get started today!
          </h2>
          <p className="mt-4 max-w-[26rem] text-left  text-base/6 text-neutral-200">
            Use Horizon Enterprise with Horizon Dashboard for unlimited players and nodes, all wrapped with our easy-to-use dashboard
          </p>
        </div>
        <Image
          src="/dashboard/Horizon-Dashboard12.png"
          width={550}
          height={550}
          alt="linear demo image"
          className="absolute -right-10 md:-right-[40%] lg:-right-[20%] -bottom-10 object-contain rounded-2xl"
        />
      </WobbleCard>
    </div>
  );
}
