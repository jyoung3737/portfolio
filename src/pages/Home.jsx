import { useEffect, useRef } from "react";
import hero from "../assets/banner.png";
import PacManGame from "../components/PacManGame";

export default function CompleteHome() {
  const heroRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!heroRef.current) return;
      const scrollY = window.scrollY;
      heroRef.current.style.transform = `translateY(${scrollY * 0.15}px)`;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 flex justify-center">
      {/* Site Container */}
      <div className="w-full max-w-[1000px] px-4">

        {/* HERO */}
        <header className="py-10">
          <div className="relative overflow-hidden rounded-3xl shadow-2xl">
            <img
              ref={heroRef}
              src={hero}
              alt="Hero"
              className="w-full h-[420px] sm:h-[480px] object-cover scale-105 transition-transform duration-[2000ms]"
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

            {/* Hero Content */}
            <div className="absolute inset-0 flex items-center justify-center text-center px-6">
              <div className="animate-fade-in-up">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 tracking-tight">
                  Hi, I'm Joel
                </h1>
                <p className="text-lg sm:text-xl text-white/90 mb-6">
                  Front-End Developer & UI Engineer
                </p>

                <a
                  href="#projects"
                  className="inline-flex items-center justify-center rounded-full bg-orange-500 px-6 py-3 font-medium text-white shadow-lg hover:bg-orange-400 transition"
                >
                  View My Work
                </a>
              </div>
            </div>
          </div>
        </header>

        {/* MAIN CONTENT */}
        <main className="pb-24 space-y-24">

          <section>
            <h2 className="text-2xl font-bold mb-4">About</h2>
            <p className="text-slate-300 leading-relaxed">
              I specialize in building polished, high-performance interfaces
              using React, Tailwind, and modern JavaScript.
            </p>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-bold mb-4">Arcade Demo</h2>
            <PacManGame />
          </section>

          <section id="projects">
            <h2 className="text-2xl font-bold mb-8">Featured Work</h2>

            <div className="grid gap-6 sm:grid-cols-2">
              {[1, 2, 3, 4].map((n) => (
                <div
                  key={n}
                  className="group relative overflow-hidden rounded-2xl bg-slate-900 shadow-lg transition hover:shadow-xl"
                >
                  <div className="h-48 bg-slate-800 group-hover:scale-105 transition-transform duration-500" />

                  <div className="p-5">
                    <h3 className="font-semibold text-lg mb-1">
                      Project Title {n}
                    </h3>
                    <p className="text-slate-400 text-sm">
                      Short description of the project.
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

        </main>

      </div>
    </div>
  );
}
