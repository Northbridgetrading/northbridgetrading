import { useState } from "react";

export default function Dropdown({ label, children }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button className="font-medium text-black/80 hover:text-black transition">
        {label}
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-3 bg-white border border-black/10 shadow-lg rounded-xl p-4 min-w-[200px]">
          {children}
        </div>
      )}
    </div>
  );
}