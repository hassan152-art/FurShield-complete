export default function Badge({ children, tone = "mint" }) {
  const tones = {
    mint: "bg-mint text-forest",
    coral: "bg-coral/15 text-coral",
    golden: "bg-golden/25 text-forest",
  };
  return (
    <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full ${tones[tone]}`}>
      {children}
    </span>
  );
}
