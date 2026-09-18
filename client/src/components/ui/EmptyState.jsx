export default function EmptyState({ title, description, action }) {
  return (
    <div className="text-center py-16 px-6 bg-sand/50 rounded-2xl">
      <p className="text-lg font-semibold text-forest">{title}</p>
      {description && <p className="text-muted mt-2">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
