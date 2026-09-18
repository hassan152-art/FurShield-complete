export default function Button({ children, variant = "primary", className = "", ...props }) {
  const base = "inline-flex items-center justify-center gap-2 font-semibold rounded-full px-6 py-3 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-emerald text-white hover:bg-forest shadow-md hover:shadow-lg",
    secondary: "bg-coral text-white hover:brightness-95 shadow-md",
    outline: "border-2 border-emerald text-emerald hover:bg-emerald hover:text-white",
    ghost: "text-forest hover:bg-mint/50",
  };
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
