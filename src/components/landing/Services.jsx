import React from "react";

export default function Services() {
  return (
    <section className="w-full min-h-screen flex flex-col md:flex-row bg-[#eef2f5]">
      
      {/* LEFT: IMAGE */}
      <div className="w-full md:w-1/2 h-[60vh] md:h-auto">
        <img
          src="/IMG_1483.jpeg" // <-- replace with your image
          alt="Chain visual"
          className="w-full h-full object-cover"
        />
      </div>

      {/* RIGHT: CONTENT */}
       
      <div className="w-full md:w-1/2 flex items-center justify-center px-6 md:px-16 py-16">
        <div className="max-w-[520px]">


         
          
          {/* Small label */}
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
            <span className="text-lg">🪶</span>
            <span className="font-medium">Robinhood Crypto</span>
          </div>

          {/* Heading */}
          <h1 className="text-[36px] md:text-[42px] leading-[1.2] font-medium text-[#111]">
            Get started with Robinhood Crypto
            <br />
            Trade crypto 24/7
          </h1>

          {/* Description */}
          <p className="mt-6 text-gray-600 text-[16px] leading-relaxed">
            Start with as little as $1. Buy, sell, and transfer BTC, ETH,
            XRP, SOL, DOGE, SHIB, and more.
          </p>

          {/* Subtle link */}
          <p className="mt-4 text-sm text-gray-500 cursor-pointer hover:underline">
            Crypto Risk Disclosures
          </p>

          {/* CTA */}
          <button className="mt-8 px-8 py-3 rounded-full bg-black text-white font-medium hover:bg-gray-900 transition">
            Learn more
          </button>
        </div>
      </div>
    </section>
  );
}