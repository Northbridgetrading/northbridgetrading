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
        backgroundImage: "url('/IMG_1566.JPG')",   // ← Put your image path here
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

        {/* RIGHT: CRYPTO TICKER CARDS */}
        <motion.div
          variants={item}
          className="w-full md:w-1/2 flex flex-col gap-3"
        >
          {[
            { name: "Bitcoin", ticker: "BTC", change: "+2.4%", price: "$62,340", up: true },
            { name: "Ethereum", ticker: "ETH", change: "+1.1%", price: "$3,210", up: true },
            { name: "Solana", ticker: "SOL", change: "-0.8%", price: "$142.50", up: false },
            { name: "Dogecoin", ticker: "DOGE", change: "+5.2%", price: "$0.182", up: true },
            { name: "XRP", ticker: "XRP", change: "-1.3%", price: "$0.524", up: false },
          ].map((coin) => (
            <div
              key={coin.ticker}
              className="flex items-center justify-between px-5 py-4 rounded-xl bg-white/60 backdrop-blur-sm border border-white/80 hover:bg-white transition-all duration-200"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#1E4A7C]/10 flex items-center justify-center text-[13px] font-bold text-[#1E4A7C]">
                  {coin.ticker[0]}
                </div>
                <div>
                  <p className="text-[14px] font-semibold text-[#111]">{coin.name}</p>
                  <p className="text-[12px] text-[#888]">{coin.ticker}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[14px] font-semibold text-[#111]">{coin.price}</p>
                <p className={`text-[12px] font-medium ${coin.up ? "text-green-500" : "text-red-400"}`}>
                  {coin.change}
                </p>
              </div>
            </div>
          ))}
        </motion.div>

      </motion.div>
    </section>
  );
}