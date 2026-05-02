import React from "react";

export default function Projects() {
  return (
    <section className="w-full min-h-screen bg-gradient-to-br from-[#0b0f14] via-[#1a1f24] to-[#3a3f44] flex items-center justify-center overflow-hidden">
      <div className="max-w-[1200px] w-full px-6 flex flex-col md:flex-row items-center justify-between gap-16">
        
        {/* LEFT: IMAGE */}
        <div className="relative w-full md:w-1/2 flex justify-center">
          <img
            src="/trading-ui.png" // replace with your image
            alt="Trading dashboard"
            className="
              w-[650px]
              max-w-full
              rounded-xl
              shadow-[0_40px_80px_rgba(0,0,0,0.6)]
              transform
              perspective-[1200px]
              rotate-y-[12deg]
            "
          />
        </div>

        {/* RIGHT: CONTENT */}
        <div className="w-full md:w-1/2 text-white">
          <h1 className="text-[40px] md:text-[44px] leading-[1.2] font-medium">
            <span className="text-[#C6FF00] font-semibold">
              Intuitive trading tools
            </span>
            <br />
            Build your strategy and track market trends, seamlessly
          </h1>

          <p className="mt-6 text-[#cfcfcf] text-[16px] leading-relaxed max-w-[480px]">
            Trade stocks, options, crypto, and more on Robinhood Legend and the
            Robinhood app.
          </p>

          <button className="mt-8 px-8 py-3 rounded-full bg-[#C6FF00] text-black font-semibold hover:translate-y-[-2px] hover:shadow-[0_10px_25px_rgba(198,255,0,0.4)] transition-all duration-200">
            Learn more
          </button>
        </div>
      </div>
    </section>
  );
}