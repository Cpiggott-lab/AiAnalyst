import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function BarChartComponent({ data, xKey, yKey, title }) {
  return (
    <div className="bg-white rounded shadow p-4">
      {title && <h3 className="mb-2 font-semibold">{title}</h3>}

      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <XAxis dataKey={xKey} /> {/* Bottom labels (e.g., categories) */}
          <YAxis /> {/* Left axis (numeric scale) */}
          <Tooltip /> {/* Shows value info on hover */}
          <Bar dataKey={yKey} fill="#2563eb" /> {/* Bars using yKey values */}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
