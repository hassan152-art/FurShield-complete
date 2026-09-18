export default function Card({ children, className = "" }) {
  return (
    <div className={`bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200 p-6 ${className}`}>
      {children}
    </div>
  );
}
