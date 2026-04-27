import React, { useRef, useEffect } from "react";
import { Link } from "react-router-dom";

const SERVICES = [
  {
    id: "industrial",
    title: "Industrial Engineering",
    video: "/industrial.mp4",
  },
  {
    id: "construction",
    title: "Construction Management",
    video: "/3992-176171691_medium.mp4",
  },
  {
    id: "mechanical",
    title: "Mechanical Systems",
    video: "/12543-239934681.mp4",
  },
  {
    id: "energy",
    title: "Energy Solutions",
    video: "/16261-270577517_medium.mp4",
  },
];

function ServiceCard({ service }) {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Intersection Observer to autoplay on scroll (for mobile)
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            video.play();
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.5 } // 50% visible
    );

    observer.observe(video);

    return () => {
      observer.unobserve(video);
    };
  }, []);

  return (
    <div className="relative group overflow-hidden">
      {/* Dark black frame behind video */}
      <div className="absolute top-2 left-2 w-full h-64 sm:h-72 bg-black"></div>

      {/* Video on top */}
      <div
        className="relative h-64 sm:h-72"
        onMouseEnter={() => videoRef.current?.play()}
        onMouseLeave={() => videoRef.current?.pause()}
      >
        <video
          ref={videoRef}
          src={service.video}
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
        />

        {/* Simple text overlay */}
        <div className="absolute bottom-3 left-3 text-white bg-black/50 px-2 py-1 text-sm font-medium rounded">
          {service.title}
          <Link
            to={`/services/${service.id}`}
            className="ml-2 underline text-xs hover:text-red-500"
          >
            Learn more →
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function Services() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto text-center mb-12 px-4">
        <h2 className="text-4xl font-light text-[#e63946] mb-6">
          OUR SERVICES
        </h2>
        <p className="text-lg text-[#1A0000] max-w-2xl mx-auto">
          Delivering excellence in engineering, construction, and mechanical
          services with precision-driven solutions for long-term impact.
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {SERVICES.map((service) => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>
    </section>
  );
}