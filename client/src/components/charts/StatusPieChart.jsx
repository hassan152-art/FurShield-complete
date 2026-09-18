import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const STATUS_COLORS = {
  pending: "#F5C96A",
  confirmed: "#2E7D65",
  rescheduled: "#6B9BD1",
  completed: "#173F35",
  cancelled: "#FF8066",
  available: "#BFE8D5",
  adopted: "#FF8066",
  requested: "#F5C96A",
  processing: "#6B9BD1",
};

// Renders a donut chart from a { statusName: count } map, skipping zero counts.
export default function StatusPieChart({ counts, height = 240 }) {
  const data = Object.entries(counts)
    .filter(([, value]) => value > 0)
    .map(([name, value]) => ({ name, value }));

  if (data.length === 0) {
    return <p className="text-muted text-sm text-center py-16">Not enough data yet to chart.</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" innerRadius={50} outerRadius={82} paddingAngle={3}>
          {data.map((entry, i) => (
            <Cell key={i} fill={STATUS_COLORS[entry.name] || "#6B7771"} />
          ))}
        </Pie>
        <Tooltip />
        <Legend iconType="circle" wrapperStyle={{ fontSize: 12, textTransform: "capitalize" }} />
      </PieChart>
    </ResponsiveContainer>
  );
}
