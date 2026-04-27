import { Link } from "react-router-dom";
import { useState } from "react";

// 🔥 Custom globe icon
const CustomGlobe = ({ className = "w-5 h-5" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 256 256"
    className={className}
    fill="currentColor"
  >
    <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,16a87.5,87.5,0,0,1,48,14.28V74L153.83,99.74,122.36,104l-.31-.22L102.38,90.92A16,16,0,0,0,79.87,95.1L58.93,126.4a16,16,0,0,0-2.7,8.81L56,171.44l-3.27,2.15A88,88,0,0,1,128,40ZM62.29,186.47l2.52-1.65A16,16,0,0,0,72,171.53l.21-36.23L93.17,104a3.62,3.62,0,0,0,.32.22l19.67,12.87a15.94,15.94,0,0,0,11.35,2.77L156,115.59a16,16,0,0,0,10-5.41l22.17-25.76A16,16,0,0,0,192,74V67.67A87.87,87.87,0,0,1,211.77,155l-16.14-14.76a16,16,0,0,0-16.93-3l-30.46,12.65a16.08,16.08,0,0,0-9.68,12.45l-2.39,16.19a16,16,0,0,0,11.77,17.81L169.4,202l2.36,2.37A87.88,87.88,0,0,1,62.29,186.47ZM185,195l-4.3-4.31a16,16,0,0,0-7.26-4.18L152,180.85l2.39-16.19L184.84,152,205,170.48A88.43,88.43,0,0,1,185,195Z"></path>
  </svg>
);

export default function Navbar() {
  const [openMenu, setOpenMenu] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="fixed top-0 left-0 w-full z-50">

      {/* ANNOUNCEMENT BAR */}
      <div className="relative w-full overflow-hidden bg-[var(--color-primary)] border-b border-[var(--color-border)]">

        {/* moving light sweep */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 animate-[move_7s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-white/50 to-transparent" />
        </div>

        {/* subtle pulse glow */}
        <div className="absolute inset-0 bg-white/10 animate-pulse opacity-30" />

        {/* content */}
        <div className="relative max-w-7xl mx-auto px-6 md:px-12 text-center text-sm py-2 text-[var(--color-text)] font-medium tracking-tight">
          Sign up and deposit for a shot at $25,000 in stock. Rules apply.
          <span className="ml-2 underline cursor-pointer hover:opacity-70 transition">
            Learn More
          </span>
        </div>

        {/* animation keyframes */}
        <style>{`
          @keyframes move {
            0% { transform: translateX(-140%); }
            50% { transform: translateX(0%); }
            100% { transform: translateX(140%); }
          }
        `}</style>
      </div>

      {/* NAVBAR */}
      <header className="bg-[var(--color-bg)] backdrop-blur-md text-[var(--color-text)] border-b border-[var(--color-border)] shadow-sm">

        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between h-16">

          {/* LOGO */}
          <Link to="/" className="flex items-center gap-2">
  <img
    src="/IMG_1495.jpeg"
    alt="NorthbridgeTr logo"
    className="w-10 h-10 object-contain"
  />

  <span className="text-xl font-semibold tracking-tight text-[var(--color-text)]">
    NorthbridgeTr
  </span>
</Link>

          {/* DESKTOP NAV */}
          <nav className="hidden lg:flex items-center gap-10 text-[15px]">

            {/* WHAT WE OFFER */}
            <div
              onMouseEnter={() => setOpenMenu("mission")}
              onMouseLeave={() => setOpenMenu(null)}
              className="relative"
            >
              <div className="cursor-pointer flex items-center gap-1 font-medium text-[var(--color-text)] hover:text-[var(--color-muted)] transition">
                <span>What We Offer</span>
                <svg
                  className="w-3 h-3 transition-transform"
                  style={{
                    transform: openMenu === "mission" ? "rotate(180deg)" : "rotate(0deg)"
                  }}
                  fill="none"
                  strokeWidth={2}
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* CRYPTO */}
            <div
              onMouseEnter={() => setOpenMenu("services")}
              onMouseLeave={() => setOpenMenu(null)}
              className="relative"
            >
              <div className="cursor-pointer flex items-center gap-1 font-medium text-[var(--color-text)] hover:text-[var(--color-muted)] transition">
                <span>Crypto</span>
                <svg
                  className="w-3 h-3 transition-transform"
                  style={{
                    transform: openMenu === "services" ? "rotate(180deg)" : "rotate(0deg)"
                  }}
                  fill="none"
                  strokeWidth={2}
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            <Link className="font-medium text-[var(--color-text)] hover:text-[var(--color-muted)] transition" to="/projects">
              Predict
            </Link>
            <Link className="font-medium text-[var(--color-text)] hover:text-[var(--color-muted)] transition" to="/testimonials">
              Strategies
            </Link>
            <Link className="font-medium text-[var(--color-text)] hover:text-[var(--color-muted)] transition" to="/contact">
              Gold
            </Link>
            <Link className="font-medium text-[var(--color-text)] hover:text-[var(--color-muted)] transition" to="/emag">
              Legend
            </Link>
            <Link className="font-medium text-[var(--color-text)] hover:text-[var(--color-muted)] transition" to="/emag">
              Learn
            </Link>
            <Link className="font-medium text-[var(--color-text)] hover:text-[var(--color-muted)] transition" to="/emag">
              Support
            </Link>
          </nav>

          {/* RIGHT SIDE */}
          <div className="hidden lg:flex items-center gap-3 pl-4 border-l border-[var(--color-border)]">

            <button className="text-[var(--color-text)] hover:text-[var(--color-muted)] transition">
              <CustomGlobe className="w-6 h-6" />
            </button>

            <Link
              to="/signin"
              className="px-4 py-2 text-sm font-medium text-[var(--color-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-hover)] rounded-full transition"
            >
              Sign in
            </Link>

           <Link
               to="/dashboard"
  className="px-4 py-2 text-sm font-semibold bg-[var(--color-primary)] text-black border border-[var(--color-border)] hover:opacity-90 rounded-full transition"
            >
              Get Started
            </Link>

          </div>

          {/* MOBILE BUTTON */}
          <button
            className="lg:hidden flex items-center justify-center h-10 w-10"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 256 256"
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="16"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="40" y1="64" x2="216" y2="64" />
              <line x1="40" y1="128" x2="216" y2="128" />
              <line x1="40" y1="192" x2="216" y2="192" />
            </svg>
          </button>

        </div>

        {/* MOBILE MENU */}
        {mobileOpen && (
          <div className="lg:hidden bg-[var(--color-bg)] border-t border-[var(--color-border)] p-6 space-y-5">
            <Link to="/projects" className="block font-medium">Our Projects</Link>
            <Link to="/testimonials" className="block font-medium">Testimonials</Link>
            <Link to="/contact" className="block font-medium">Contact</Link>
            <Link to="/emag" className="block font-medium">eMAG</Link>
          </div>
        )}

      </header>
    </div>
  );
}