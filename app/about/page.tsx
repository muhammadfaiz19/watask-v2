"use client";
import React from "react";

import { SparklesCore } from "@/components/ui/sparkles";
import { HoverEffect } from "@/components/ui/card-hover-effect";

// List of Technologies (no export here)
const technologies = [
  {
    title: "Next.js",
    description: "A React framework for building fast and scalable web applications.",
    link: "https://nextjs.org/",
  },
  {
    title: "TypeScript",
    description: "A strongly typed programming language for JavaScript.",
    link: "https://www.typescriptlang.org/",
  },
  {
    title: "Express.js",
    description: "A fast, unopinionated, minimalist web framework for Node.js.",
    link: "https://expressjs.com/",
  },
  {
    title: "MongoDB",
    description: "A NoSQL database for modern applications.",
    link: "https://www.mongodb.com/",
  },
  {
    title: "Hero UI",
    description: "A UI library that provides beautiful, customizable components for Next.js apps.",
    link: "https://www.heroui.com/",
  },
  {
    title: "Aceternity UI",
    description: "A customizable design system built for scalable and modern applications.",
    link: "https://ui.aceternity.com/",
  },
];

const AboutPage: React.FC = () => {
  return (
    <>
      {/* Hero Section */}
      <div className="h-screen w-full bg-black flex items-center justify-center">
        <div className="h-[40rem] w-full max-w-[60rem] bg-black flex flex-col items-center justify-center overflow-hidden rounded-md">
          <h1 className="md:text-7xl text-5xl lg:text-9xl font-bold text-center text-white relative z-20">
            WaTask
          </h1>
          <div className="w-[40rem] h-40 relative">
            {/* Gradients */}
            <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-[2px] w-3/4 blur-sm" />
            <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-px w-3/4" />
            <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-[5px] w-1/4 blur-sm" />
            <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-px w-1/4" />

            {/* Core component */}
            <SparklesCore
              background="transparent"
              className="w-full h-full"
              maxSize={1}
              minSize={0.4}
              particleColor="#FFFFFF"
              particleDensity={1200}
            />

            {/* Radial Gradient to prevent sharp edges */}
            <div className="absolute inset-0 w-full h-full bg-black [mask-image:radial-gradient(350px_200px_at_top,transparent_20%,white)]" />
          </div>
        </div>
      </div>

      {/* Technology Section */}
      <div className="min-h-screen w-full bg-gradient-to-b from-black to-gray-900 flex items-center justify-center px-4">
        <div className="max-w-6xl mx-auto text-white">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
            Technology Stack
          </h2>
          <HoverEffect items={technologies} />
        </div>
      </div>
    </>
  );
};

export default AboutPage;
