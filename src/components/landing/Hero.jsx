import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export default function Hero() {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handleChange = () => setPrefersReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return (
    <section className="relative w-full h-screen overflow-hidden">

      {/* BACKGROUND IMAGE */}
      <div
        className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-700 ${
          imageLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ backgroundImage: "url('/IMG_1532.JPG')" }}
      />
      
      <img 
        src="/IMG_1532.JPG" 
        className="hidden" 
        onLoad={() => setImageLoaded(true)} 
        alt="" 
      />

      {/* DARK OVERLAY */}
      <div className="absolute inset-0 bg-black/50" />

      {/* CONTAINER */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        transition={{ 
          staggerChildren: prefersReducedMotion ? 0 : 0.08 
        }}
        className="relative z-10 w-full max-w-[1280px] mx-auto px-6 sm:px-10 xl:px-[84px] flex items-center justify-center h-full"
      >

        {/* CENTER BLOCK */}
        <div className="
          w-full max-w-[700px]
          flex flex-col
          items-center
          text-center
          pt-[120px] lg:pt-[140px]
        ">

          {/* HEADLINE */}
          <motion.h1
            variants={item}
            className="
              text-[clamp(36px,9vw,120px)]
              leading-[1.0]
              tracking-[-2px]
              text-white
            "
            style={{
              fontFamily: `"Playfair Display", serif`,
              fontWeight: 700,
            }}
          >
            Trade All
            <br />
            in One Place
          </motion.h1>

          {/* SUBTEXT */}
          <motion.p
            variants={item}
            className="
              mt-[16px]
              text-[17px]
              leading-[26px]
              font-semibold
              text-white
              max-w-[560px]
            "
          >
            Manage your portfolio on Robinhood: stocks, ETFs, crypto, options, futures, and prediction markets. Get started with as little as $1.
          </motion.p>

          {/* CTA */}
          <motion.div variants={item} className="mt-[28px]">
            <button
              className="px-7 py-3 text-[15px] font-semibold rounded-full hover:brightness-110 transition"
              style={{ backgroundColor: "var(--color-primary)", color: "#000000" }}
            >
              Get started
            </button>
          </motion.div>

        </div>

      </motion.div>
    </section>
  );
}