import { motion } from "framer-motion";

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
  return (
    <section className="relative w-full h-screen overflow-hidden bg-white">

      {/* OPTIONAL SUBTLE NOISE */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none mix-blend-soft-light"
        style={{
          backgroundImage:
            "url('https://grainy-gradients.vercel.app/noise.svg')",
        }}
      />

      {/* CONTAINER */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 w-full max-w-[1280px] mx-auto px-6 sm:px-10 xl:px-[84px] flex items-center h-full"
      >

        {/* LEFT */}
        <div className="
          w-full lg:w-[560px]
          flex flex-col
          justify-center lg:justify-start
          pt-[120px] lg:pt-[140px]
        ">

          {/* HEADLINE */}
          <motion.h1
            variants={item}
            className="
              text-[clamp(40px,5.2vw,64px)]
              leading-[1.05]
              tracking-[-1.2px]
              text-[#0B0B0B]
              max-w-[18ch]
            "
            style={{
              fontFamily: `"Playfair Display", serif`,
              fontWeight: 400,
            }}
          >
            Gear up your IRA
            <br />
            with a{" "}
            <span className="relative inline-block font-semibold text-[#0A0A0A] px-1">
              <span className="relative z-10">2% match</span>

              {/* SOFT MATCHED HIGHLIGHT */}
              <span
                className="
                  absolute inset-0
                  translate-y-[10%]
                  rounded-one
                "
                style={{
                  background: "linear-gradient(120deg, #f9f871 0%, #f9f871cc 100%)",
                  opacity: 0.75,
                }}
              />
            </span>
          </motion.h1>

          {/* SUBTEXT */}
          <motion.p
            variants={item}
            className="
              mt-[12px]
              text-[15.5px]
              leading-[24px]
              text-[#444]
              max-w-[480px]
            "
            style={{
              fontFamily: `"Inter", sans-serif`,
            }}
          >
            With Northbridge Crypto ($5/month), earn a 2% match when you transfer an account by April 30. Terms apply.
          </motion.p>

          {/* TRUST ROW */}
          <motion.div
            variants={item}
            className="mt-[14px] flex items-center gap-2 text-[13px] text-[#555]"
          >
            <span>✓ Instant setup</span>
            <span className="opacity-40">•</span>
            <span>✓ No hidden fees</span>
            <span className="opacity-40">•</span>
            <span>✓ Secure transfers</span>
          </motion.div>

          {/* DISCLAIMER */}
          <motion.div
            variants={item}
            className="mt-[10px] flex items-center gap-[8px] text-[12.5px] text-[#707070]"
          >
            <div className="w-[14px] h-[14px] border border-[#707070] rounded-full flex items-center justify-center text-[9px]">
              i
            </div>
            Subscription and limitations apply
          </motion.div>

          {/* CTA */}
          <motion.div variants={item} className="mt-[20px]">
            <button
              className="px-4 py-2 text-sm font-semibold bg-[var(--color-primary)] text-black border border-[var(--color-border)] hover:opacity-90 rounded-full transition"
            >
              Claim 2% match
            </button>
          </motion.div>

        </div>

        {/* RIGHT */}
        <div className="flex-1 relative flex items-center justify-end">

          {/* SOFT DEPTH GLOW */}
          <div className="absolute w-[420px] h-[420px] bg-black/5 blur-[120px] rounded-full right-[10%] top-[55%] -translate-y-1/2" />

          {/* IMAGE */}
<div className="
  relative
  w-[82vw] sm:w-[65vw] md:w-[55vw] lg:w-[42vw]
  max-w-[640px]
  aspect-square
  lg:translate-x-10
  flex items-center justify-center
">
  <motion.img
  initial={{ scale: 1.03, opacity: 0 }}
  animate={{ scale: 1, opacity: 1 }}
  transition={{ duration: 1, ease: "easeOut" }}
  src="/004EA30E-BE17-43DA-B4F6-385538998206.gif"
  alt="IRA investment illustration"
  className="w-full h-full object-contain mix-blend-screen"
/>
</div>

        </div>

      </motion.div>
    </section>
  );
}