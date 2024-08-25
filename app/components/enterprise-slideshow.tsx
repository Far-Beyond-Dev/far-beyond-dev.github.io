"use client";
import { motion } from "framer-motion";
import React from "react";
import { ImagesSlider } from "./ui/images-slider";

export function EnterpriseSlides() {
  const images = [
    "/dashboard/Horizon-Dashboard3.png",
    "/dashboard/Horizon-Dashboard.png",
    "/dashboard/Horizon-Dashboard4.png",
    "/dashboard/Horizon-Dashboard5.png",
    "/dashboard/Horizon-Dashboard6.png",
    "/dashboard/Horizon-Dashboard7.png",
    "/dashboard/Horizon-Dashboard8.png",
    "/dashboard/Horizon-Dashboard9.png",
    "/dashboard/Horizon-Dashboard10.png",
    "/dashboard/Horizon-Dashboard11.png",
    "/dashboard/Horizon-Dashboard12.png",
    "/dashboard/Horizon-Dashboard13.png",
    "/dashboard/Horizon-Dashboard14.png",
    "/dashboard/Horizon-Dashboard15.png",
    "/dashboard/Horizon-Dashboard16.png"
  ];
  return (
    <ImagesSlider className="h-[27rem]" images={images}>
      <motion.div
        initial={{
          opacity: 0,
          y: -80,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.6,
        }}
        className="z-50 flex flex-col justify-center items-center"
      >
        {/* <motion.p className="font-bold text-xl md:text-6xl text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 py-4">
          The hero section slideshow <br /> nobody asked for
        </motion.p>
        <button className="px-4 py-2 backdrop-blur-sm border bg-emerald-300/10 border-emerald-500/20 text-white mx-auto text-center rounded-full relative mt-4">
          <span>Join now →</span>
          <div className="absolute inset-x-0  h-px -bottom-px bg-gradient-to-r w-3/4 mx-auto from-transparent via-emerald-500 to-transparent" />
        </button> */}
      </motion.div>
    </ImagesSlider>
  );
}