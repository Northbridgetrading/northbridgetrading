import { motion } from "framer-motion";

export default function Projects() {
  const fadeUp = {
    initial: { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: "easeInOut" },
  };

  return (
    <section className="relative w-full bg-white overflow-hidden pt-20 lg:pt-0">

      {/* TOP HERO-LIKE SECTION */}
      <div className="flex flex-col lg:flex-row min-h-[75vh]">
        {/* LEFT IMAGE PANEL */}
        <div className="w-full lg:w-6/12 relative h-64 sm:h-96 lg:h-[75vh] order-1 lg:order-1">
          <img
            src="bruno-thethe-qyhLjwn6Gpc-unsplash.jpg"
            alt="Zettatone Innovation"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent"></div>
          <div className="absolute top-1/2 right-0 w-[20px] h-[60px] bg-black translate-x-1/2 -translate-y-1/2"></div>
        </div>

        {/* RIGHT TEXT */}
        <div className="w-full lg:w-6/12 flex flex-col justify-center z-10 order-2 lg:order-2">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 md:px-12 py-12 sm:py-16 md:py-20">

            <motion.h1
              {...fadeUp}
              className="text-[2.75rem] sm:text-[3rem] md:text-[3.5rem] font-light tracking-wide uppercase leading-tight text-[#e63946]"
            >
              Why  NorthbridgeMrkts?
            </motion.h1>

            <motion.p
              {...fadeUp}
              className="mt-6 text-base sm:text-lg leading-relaxed text-[#1A0000] max-w-lg"
            >
              At NorbridgeMrkts, innovation meets impact. Work on cutting-edge engineering projects, collaborate with brilliant minds, and push the boundaries of technology. Your ideas will shape solutions that matter.
            </motion.p>

            <motion.div
              {...fadeUp}
              className="mt-8 flex flex-col sm:flex-row gap-4 items-start sm:items-center"
            >
              <button
                className="px-6 py-2 border border-[#7d1f1f] text-[#7d1f1f] font-light tracking-wide uppercase rounded-sm transition hover:bg-[#7d1f1f] hover:text-white"
                aria-label="See Projects"
              >
                Come aboard
              </button>
            </motion.div>

          </div>
        </div>
      </div>

      

 
    </section>
  );
}