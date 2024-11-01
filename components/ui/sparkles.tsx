import React, { useId, useMemo } from "react";
import { useEffect, useState, useCallback } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import type { Container, Engine, ISourceOptions } from "@tsparticles/engine";
import { loadSlim } from "@tsparticles/slim";
import { cn } from "@/lib/utils";
import { motion, useAnimation } from "framer-motion";

type ParticlesProps = {
  id?: string;
  className?: string;
  background?: string;
  particleSize?: number;
  minSize?: number;
  maxSize?: number;
  speed?: number;
  particleColor?: string;
  particleDensity?: number;
};

export const SparklesCore = (props: ParticlesProps) => {
  const {
    id,
    className,
    background,
    minSize,
    maxSize,
    speed,
    particleColor,
    particleDensity,
  } = props;
  
  const [init, setInit] = useState(false);
  const controls = useAnimation();
  const generatedId = useId();

  // Memoize the particle options to prevent unnecessary recalculations
  const options: ISourceOptions = useMemo(() => ({
    background: {
      color: {
        value: background || "#0d47a1",
      },
    },
    fullScreen: {
      enable: false,
      zIndex: 1,
    },
    fpsLimit: 60, // Limit FPS to improve performance
    interactivity: {
      events: {
        onClick: {
          enable: true,
          mode: "push",
        },
        onHover: {
          enable: false, // Disable hover effects for better performance
        },
        resize: {
          enable: true,
          delay: 500, // Add delay to resize events
        },
      },
      modes: {
        push: {
          quantity: 4,
        },
      },
    },
    particles: {
      number: {
        density: {
          enable: true,
          width: 400,
          height: 400,
        },
        value: particleDensity || 80, // Reduced particle count
      },
      color: {
        value: particleColor || "#ffffff",
      },
      move: {
        enable: true,
        speed: speed || 1,
        direction: "none",
        random: false,
        straight: false,
        outModes: {
          default: "out",
        },
      },
      opacity: {
        value: {
          min: 0.1,
          max: 0.5,
        },
        animation: {
          enable: true,
          speed: speed || 2,
          sync: false,
        },
      },
      size: {
        value: {
          min: minSize || 1,
          max: maxSize || 3,
        },
      },
      shape: {
        type: "circle",
      },
    },
    detectRetina: true,
  }), [background, minSize, maxSize, speed, particleColor, particleDensity]);

  useEffect(() => {
    initParticlesEngine(async (engine: Engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const particlesLoaded = useCallback(async (container?: Container) => {
    if (container) {
      await controls.start({
        opacity: 1,
        transition: {
          duration: 1,
        },
      });
    }
  }, [controls]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={controls} 
      className={cn("opacity-0", className)}
    >
      {init && (
        <Particles
          id={id || generatedId}
          className={cn("h-full w-full")}
          particlesLoaded={particlesLoaded}
          options={options}
        />
      )}
    </motion.div>
  );
};