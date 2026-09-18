export default function Spinner({ label = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-3 text-muted">
      <div className="w-8 h-8 border-4 border-mint border-t-emerald rounded-full animate-spin" />
      <span>{label}</span>
    </div>
  );
}
