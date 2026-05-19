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

export default function TradingSection() {
  return (
    <section className="w-full min-h-screen bg-gradient-to-br from-[#060d18] via-[#0d1f35] to-[#1E4A7C] flex items-center justify-center overflow-hidden">
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        className="max-w-[1200px] w-full px-6 xl:px-[84px] flex flex-col md:flex-row items-center justify-between gap-16 py-24"
      >

        {/* LEFT: IMAGE */}
        <motion.div
          variants={item}
          className="relative w-full md:w-1/2 flex justify-center"
        >
          <div className="absolute inset-0 bg-[#1E4A7C]/30 blur-[80px] rounded-full scale-75" />
          <img
            src="/jakub-zerdzicki-h_H1KtjNOAk-unsplash.jpg"
            alt="Trading dashboard"
            className="relative z- w-[620px] max-w-full rounded-one shadow-[0_40px_80px_rgba(0,0,0,0.7)]"
            style={{
              transform: "perspective(1200px) rotateY(8deg)",
            }}
          />
        </motion.div>

        {/* RIGHT: CONTENT */}
        <div className="w-full md:w-1/2 text-white">

          {/* EYEBROW — yellow like Robinhood's green accent */}
          <motion.p
            variants={item}
            className="text- text-[15px] font-semibold mb-4"
          >
            Intuitive trading tools
          </motion.p>

          {/* HEADLINE */}
          <motion.h2
            variants={item}
            className="text-[clamp(32px,4vw,48px)] leading-[1.15] font-semibold text-white"
          >
            Build your strategy
            <br />
            and track market
            <br />
            trends, seamlessly
          </motion.h2>

          {/* SUBTEXT */}
          <motion.p
            variants={item}
            className="mt-5 text-white/60 text-[15.5px] leading-relaxed max-w-[460px]"
          >
            Trade stocks, options, crypto, and more on
            Northbridge Legend and the Northbridge app.
          </motion.p>

          {/* CTA */}
          <motion.div variants={item} className="mt-8">
            <button
              className="px-7 py-3 rounded-full text-sm font-semibold text-white transition-all duration-200 hover:opacity-90 hover:-translate-y-[2px]"
              style={{
                background: "#1E4A7C",
                border: "1px solid rgba(255,255,255,0.15)",
              }}
            >
              Learn more
            </button>
          </motion.div>

        </div>

      </motion.div>
    </section>
  );
}