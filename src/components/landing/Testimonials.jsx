import React, { useEffect, useRef } from "react";

export default function Protection() {
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          ref.current.classList.add("opacity-100", "translate-y-0");
        }
      },
      { threshold: 0.2 }
    );

    if (ref.current) observer.observe(ref.current);

    return () => observer.disconnect();
  }, []);

  return (
    <section className="bg-[#0b0802] text-white py-28 md:py-36 px-6">
      <div
        ref={ref}
        className="max-w-6xl mx-auto text-center opacity-0 translate-y-12 transition-all duration-1000 ease-out"
      >
        <h2 className="text-4xl md:text-5xl font-medium tracking-tighter mb-20 md:mb-24">
          Northbridge Protection Guarantee
        </h2>

        {/* First Row - Two big icons (exactly like your image) */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-20 md:gap-28 mb-20 md:mb-24">
          {/* Cube Icon */}
          <div>
            <svg
              viewBox="0 0 140 140"
              className="w-32 h-32 md:w-40 md:h-40 mx-auto"
              fill="none"
              stroke="#fff"
              strokeWidth="1.8"
              strokeLinejoin="round"
            >
              <path d="M35 45 L70 30 L105 45 L105 80 L70 95 L35 80 Z" />
              <path d="M35 45 L70 60 L105 45" />
              <path d="M70 30 L70 60" />
              <path d="M70 60 L35 80" />
              <path d="M70 60 L105 80" />
            </svg>
          </div>

          {/* Swirly Rose Icon */}
          <div>
            <svg
              viewBox="0 0 140 140"
              className="w-32 h-32 md:w-40 md:h-40 mx-auto"
              fill="none"
              stroke="#fff"
              strokeWidth="1.8"
            >
              <path d="M70 25 Q45 40 38 62 Q45 85 62 98 Q70 105 85 92 Q105 75 98 50 Q90 32 70 25 Z" />
              <path d="M70 35 Q52 48 50 65 Q55 80 70 88 Q85 80 90 65 Q88 48 70 35 Z" />
              <circle cx="70" cy="62" r="9" strokeWidth="1.5" />
            </svg>
          </div>
        </div>

        {/* Second Row - Two more icons (appears when you scroll down) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 max-w-3xl mx-auto">
          <div className="flex flex-col items-center">
            <svg viewBox="0 0 100 100" className="w-20 h-20 mb-6" fill="none" stroke="#fff" strokeWidth="2">
              <circle cx="50" cy="50" r="32" />
              <path d="M38 50 L46 58 L65 40" strokeLinecap="round" strokeLinejoin="round" strokeWidth="6" />
            </svg>
            <p className="text-gray-400 text-[15px] max-w-[260px]">
              We work hard to keep your information secure.
            </p>
          </div>

          <div className="flex flex-col items-center">
            <svg viewBox="0 0 100 100" className="w-20 h-20 mb-6" fill="none" stroke="#fff" strokeWidth="2">
              <rect x="22" y="35" width="56" height="45" rx="8" />
              <path d="M30 35 V25 C30 18 38 13 50 13 C62 13 70 18 70 25 V35" />
            </svg>
            <p className="text-gray-400 text-[15px] max-w-[260px]">
              We protect your account from unauthorized access.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}