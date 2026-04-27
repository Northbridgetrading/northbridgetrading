export default function Button({ children, variant = "primary" }) {
  const base =
    "px-4 py-2 text-sm font-medium rounded-full transition";

  const styles = {
    primary:
      "bg-[#f9f871] text-black border border-black/10 hover:bg-[#f5f562]",
    ghost:
      "text-black/70 hover:text-black hover:bg-black/5",
    dark:
      "bg-black text-white hover:bg-black/80",
  };

  return (
    <button className={`${base} ${styles[variant]}`}>
      {children}
    </button>
  );
}