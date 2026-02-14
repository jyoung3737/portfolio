// src/pages/Home.jsx
import React from "react";
import { motion } from "framer-motion";
import HeroImage from "../assets/hero-banner.png"; // Your PNG image

export default function Home() {
  return (
    <div className="relative w-full h-[70vh] md:h-[80vh] lg:h-screen overflow-hidden">
  {/* Hero Image */}
  <img
    src={HeroImage}
    alt="Hero"
    className="w-full h-full object-cover"
  />

  {/* Overlay text */}
  <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-center items-center text-white bg-black bg-opacity-50 px-4">
    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-center">
      Hi, I'm Joel!
    </h1>
    <p className="text-lg sm:text-xl md:text-2xl text-center">Welcome to my portfolio</p>
    <button className="mt-6 px-6 py-3 bg-blue-600 rounded hover:bg-blue-700 transition">
      View Projects
    </button>
  </div>
</div>

  );
}
