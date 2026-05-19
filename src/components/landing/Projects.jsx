import { motion } from "framer-motion";

const item = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.1 },
  },
};

export default function WhyNorthbridge() {
  return (
    <section className="relative w-full bg-[#f4f6f8] overflow-hidden">
      <div className="flex flex-col lg:flex-row min-h-[75vh]">

        {/* LEFT IMAGE PANEL */}
        <div className="w-full lg:w-1/2 relative h-64 sm:h-96 lg:h-auto">
          <img
            src="/bruno-thethe-qyhLjwn6Gpc-unsplash.jpg"
            alt="Why Northbridge"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-transparent" />
        </div>

        {/* RIGHT TEXT */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="w-full lg:w-1/2 flex flex-col justify-center px-10 md:px-16 xl:px-20 py-16"
        >

          {/* EYEBROW */}
          <motion.p
            variants={item}
            className="text-[12px] font-semibold tracking-widest uppercase text-[#1E4A7C] mb-4"
          >
            Why Northbridge
          </motion.p>

          {/* HEADLINE */}
          <motion.h2
            variants={item}
            className="text-[clamp(32px,3.8vw,48px)] leading-[1.15] font-semibold text-[#111]"
            style={{ fontFamily: `'Geist Variable', sans-serif` }}
          >
            Why
            <br />
            NorthbridgeMrkts?
          </motion.h2>

          {/* DESCRIPTION */}
          <motion.p
            variants={item}
            className="mt-6 text-[#555] text-[15.5px] leading-relaxed max-w-[460px]"
            style={{ fontFamily: `'Geist Variable', sans-serif` }}
          >
            At NorthbridgeMrkts, innovation meets impact. Work on
            cutting-edge engineering projects, collaborate with brilliant
            minds, and push the boundaries of technology. Your ideas will
            shape solutions that matter.
          </motion.p>

          {/* TRUST ROW */}
          <motion.div
            variants={item}
            className="mt-6 flex items-center gap-3 text-[13px] text-[#888]"
          >
            <span>✓ Trusted platform</span>
            <span className="opacity-40">•</span>
            <span>✓ Expert team</span>
            <span className="opacity-40">•</span>
            <span>✓ Proven results</span>
          </motion.div>

          {/* CTA */}
          <motion.div variants={item} className="mt-8">
            <button
              className="px-8 py-3 rounded-full text-[14px] font-semibold text-white transition-all duration-200 hover:opacity-90 hover:-translate-y-[2px]"
              style={{ background: "#1E4A7C" }}
            >
              Come aboard
            </button>
          </motion.div>

        </motion.div>

      </div>
    </section>
  );
}