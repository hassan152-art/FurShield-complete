// A smooth wave shape used to transition between a light section and a dark
// gradient section (navbar underline, footer top edge) — echoes the flowing
// "go with the flow" wave motif using the FurShield palette instead of purple.
export default function WaveDivider({ fill = "#173F35", flip = false, className = "" }) {
  return (
    <svg
      viewBox="0 0 1440 100"
      preserveAspectRatio="none"
      className={`w-full block ${flip ? "rotate-180" : ""} ${className}`}
      aria-hidden="true"
    >
      <path
        d="M0,40 C240,100 480,0 720,35 C960,70 1200,10 1440,45 L1440,100 L0,100 Z"
        fill={fill}
      />
    </svg>
  );
}
