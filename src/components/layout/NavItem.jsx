import { Link } from "react-router-dom";

export default function NavItem({ to, children }) {
  return (
    <Link
      to={to}
      className="relative font-medium text-black/80 hover:text-black transition group"
    >
      {children}

      <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-black/60 transition-all group-hover:w-full" />
    </Link>
  );
}