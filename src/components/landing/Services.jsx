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

export default function CryptoSection() {
  return (
    <section
      className="w-full min-h-screen flex items-center bg-[#dde3e9]"
      style={{
        backgroundImage: "url('/IMG_1566.JPG')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        className="w-full max-w-[1200px] mx-auto px-10 xl:px-[84px] flex flex-col md:flex-row items-center justify-between gap-16 py-24"
      >

        {/* LEFT: CONTENT */}
        <div className="w-full md:w-1/2">

          {/* SMALL LABEL */}
          <motion.div
            variants={item}
            className="flex items-center gap-2 text-[14px] text-[#444] mb-6"
          >
            <span className="text-[16px]">₿</span>
            <span className="font-medium">Northbridge Crypto</span>
          </motion.div>

          {/* HEADLINE */}
          <motion.h2
            variants={item}
            className="text-[clamp(32px,3.8vw,46px)] leading-[1.2] font-medium text-[#111]"
            style={{ fontFamily: `'Geist Variable', sans-serif` }}
          >
            Get started with
            <br />
            Northbridge Crypto
            <br />
            Trade crypto 24/7
          </motion.h2>

          {/* DESCRIPTION */}
          <motion.p
            variants={item}
            className="mt-6 text-[#555] text-[15.5px] leading-relaxed max-w-[420px]"
            style={{ fontFamily: `'Geist Variable', sans-serif` }}
          >
            Start with as little as $1. Buy, sell, and transfer BTC, ETH,
            XRP, SOL, DOGE, SHIB, and more.
          </motion.p>

          {/* DISCLAIMER */}
          <motion.div
            variants={item}
            className="mt-4 flex items-center gap-2 text-[12.5px] text-[#888] cursor-pointer hover:text-[#555] transition"
          >
            <div className="w-[14px] h-[14px] border border-[#888] rounded-full flex items-center justify-center text-[9px]">
              i
            </div>
            Crypto Risk Disclosures
          </motion.div>

          {/* CTA */}
          <motion.div variants={item} className="mt-8">
            <button
              className="px-8 py-3 rounded-full text-[14px] font-semibold text-white bg-[#111] hover:bg-[#1E4A7C] transition-all duration-200"
            >
              Learn more
            </button>
          </motion.div>

        </div>

        {/* RIGHT: VIDEO */}
        <motion.div
          variants={item}
          className="relative w-full md:w-1/2 flex justify-center"
        >

          {/* Glow */}
          <div className="absolute inset-0 bg-[#1E4A7C]/20 blur-[80px] rounded-full scale-75" />

          <video
            autoPlay
            muted
            loop
            playsInline
            className="relative z-10 w-[420px] max-w-full -[28px] object-cover shadow-[0_40px_80px_rgba(0,0,0,0.35)]"
            style={{
              transform: "perspective(1200px) rotateY(-8deg)",
            }}
          >
            <source src="/d07073c6d12411de05d2cd6587111d4a_720w.mp4" type="video/mp4" />
          </video>

        </motion.div>

      </motion.div>
    </section>
  );
}