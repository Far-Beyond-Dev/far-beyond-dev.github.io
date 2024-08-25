"use client";
import { cn } from "@/app/components/lib/utils";
import { motion, MotionValue } from "framer-motion";
import React from "react";

const transition = {
  duration: 0,
  ease: "linear",
};

export const GoogleGeminiEffect = ({
  pathLengths,
  title,
  description,
  className,
}: {
  pathLengths: MotionValue[];
  title?: string;
  description?: string;
  className?: string;
}) => {
  return (
    <div className={cn("sticky top-80", className)}>
      <p className="text-lg md:text-7xl font-normal pb-4 text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-100 to-neutral-300">
        {title || `Build with Aceternity UI`}
      </p>
      <p className="text-xs md:text-xl font-normal text-center text-neutral-400 mt-4 max-w-lg mx-auto">
        {description ||
          `Scroll this component and see the bottom SVG come to life wow this
        works!`}
      </p>
      <div className="w-full h-[600] -top-60 md:-top-40  flex items-center justify-center bg-red-transparent absolute ">
            {/* <button className="font-bold bg-white rounded-full md:px-4 md:py-2 px-2 py-1 md:mt-24 mt-8 z-30 md:text-base text-black text-xs  w-fit mt-lg">
              <a href="/enterprise">
                      Go Enterprise
              </a>
            </button> */}
      </div>
      <svg
        width="1440"
        height="700"
        viewBox="0 0 1440 500"
        xmlns="http://www.w3.org/2000/svg"
        className=" absolute -top-60  md:-top-40 w-full"
      >
    <motion.path
      d="M0 663C150 660 220 690 300 660C380 630 450 610 520 580C600 540 630 500 690 480C740 460 780 490 800 500C820 510 830 510 850 500C870 490 880 470 900 480C920 490 930 510 950 520C970 530 1000 510 1030 530C1060 550 1080 530 1110 520C1140 510 1160 480 1200 480C1240 480 1280 510 1320 530C1360 550 1400 530 1440 520"
      stroke="#FF8C8C" // Updated color
      strokeWidth="2"
      fill="none"
      initial={{
        pathLength: 0,
      }}
      style={{
        pathLength: pathLengths[0],
      }}
      transition={transition}
    />
    <motion.path
      d="M0 587C150 580 250 590 310 570C370 540 420 510 460 510C500 510 530 530 570 530C610 530 640 500 680 490C720 480 750 500 780 510C810 520 850 530 880 510C910 490 940 470 960 460C980 450 1000 470 1020 490C1040 510 1060 520 1080 530C1100 540 1130 530 1160 520C1190 510 1220 490 1250 490C1280 490 1300 510 1320 520C1340 530 1360 540 1400 530C1440 520 1460 510 1480 490"
      stroke="#FFD700" // Updated color
      strokeWidth="2"
      fill="none"
      initial={{
        pathLength: 0,
      }}
      style={{
        pathLength: pathLengths[1],
      }}
      transition={transition}
    />
    <motion.path
      d="M0 514C120 500 200 510 270 500C340 490 410 470 460 460C500 450 540 470 580 470C620 470 650 450 680 440C710 430 740 450 780 460C820 470 850 450 880 440C910 430 940 450 970 460C1000 470 1030 460 1060 470C1090 480 1120 460 1150 450C1180 440 1210 420 1240 430C1270 440 1290 460 1330 470C1370 480 1400 470 1430 460C1460 450 1480 440 1500 430"
      stroke="#32CD32" // Updated color
      strokeWidth="2"
      fill="none"
      initial={{
        pathLength: 0,
      }}
      style={{
        pathLength: pathLengths[2],
      }}
      transition={transition}
    />
    <motion.path
      d="M0 438C100 430 180 450 230 440C280 430 330 420 370 410C420 400 470 420 510 420C550 420 590 400 630 390C670 380 710 400 750 410C790 420 830 400 870 390C910 380 950 400 990 410C1030 420 1070 400 1110 390C1150 380 1190 360 1230 370C1270 380 1310 400 1350 410C1390 420 1430 410 1470 400C1510 390 1550 380 1590 370"
      stroke="#00BFFF" // Updated color
      strokeWidth="2"
      fill="none"
      initial={{
        pathLength: 0,
      }}
      style={{
        pathLength: pathLengths[3],
      }}
      transition={transition}
    />
    <motion.path
      d="M0 364C140 350 250 360 300 370C350 380 400 390 450 400C500 410 540 420 590 420C640 420 680 400 720 390C760 380 800 400 840 410C880 420 920 400 960 390C1000 380 1040 400 1080 410C1120 420 1160 400 1200 390C1240 380 1280 360 1320 370C1360 380 1400 400 1440 410"
      stroke="#8A2BE2" // Updated color
      strokeWidth="2"
      fill="none"
      initial={{
        pathLength: 0,
      }}
      style={{
        pathLength: pathLengths[4],
      }}
      transition={transition}
    />
        <defs>
          <filter id="blurMe">
            <feGaussianBlur in="SourceGraphic" stdDeviation="5" />
          </filter>
        </defs>
      </svg>
    </div>
  );
};
