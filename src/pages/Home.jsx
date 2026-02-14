import React from "react";
import HeroImage from "../assets/hero-banner.png";

export default function Home() {
  return (
    <div className="relative w-full h-screen">
      <img
        src={HeroImage}
        alt="Hero"
        className="w-full h-full object-cover"
      />

      <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-center items-center text-white bg-black bg-opacity-50">
        <h1 className="text-5xl font-bold mb-4">Hi, I'm Joel!</h1>
        <p className="text-xl">Welcome to my portfolio</p>
      </div>
    </div>
  );
}
