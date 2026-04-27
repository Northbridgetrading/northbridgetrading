import React from "react";

export default function Projects() {
  const projects = [
  {
    title: "IMAGINING SUSTAINABLE MOBILITY",
    image:
      "/mads-eneqvist-J9jYy9S1zAk-unsplash.jpg",
  },
  {
    title: "ACCELERATE THE ENERGY TRANSITION",
    image:
      "/energyphoto.jpg",
  },
];

  return (
    <section className="w-full bg-[#f9e5e5] min-h-screen">
      {/* Header Section */}
      <div className="max-w-[1140px] mx-auto flex flex-col md:flex-row justify-between items-center px-6 md:px-0 py-[4.5rem]">
        {/* Left side title */}
        <h2 className="text-[2.75rem] leading-tight font-light uppercase text-[#e63946] tracking-wide w-full md:w-1/2">
          Our missions
        </h2>

        {/* Right side text + button */}
        <div className="mt-8 md:mt-0 md:w-1/2 text-[#1A0000] text-base leading-relaxed">
          <p>
            With our 5,000 employees, spread across more than 43 countries, we
            actively contribute to the transformation of citizens' living
            environment, infrastructure and mobility.
          </p>
          <button
            className="mt-8 px-6 py-2 border border-[#7d1f1f] text-[#7d1f1f] font-light uppercase tracking-wide hover:bg-[#7d1f1f] hover:text-white transition rounded-sm"
            aria-label="Our missions"
          >
            Our missions
          </button>
        </div>
      </div>

      {/* Split Panels */}
      <div className="h-screen flex flex-col md:flex-row">
        {projects.map((project, idx) => (
          <div
            key={idx}
            className="group relative flex-1 cursor-pointer transition-all duration-500 hover:flex-[1.5]"
          >
            {/* Background */}
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${project.image})` }}
            ></div>

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

            {/* Content */}
            <div className="relative z-10 h-full flex flex-col justify-end p-8 md:p-12 text-white">
              <h2 className="text-xl md:text-2xl font-semibold max-w-xs leading-snug">
                {project.title}
              </h2>

              <button
                aria-label={`Explore ${project.title}`}
                className="mt-6 w-10 h-10 border border-white flex items-center justify-center hover:bg-white hover:text-black transition rounded"
              >
                →
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}