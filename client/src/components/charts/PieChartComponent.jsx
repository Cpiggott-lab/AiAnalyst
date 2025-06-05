// https://recharts.org/en-US/guide/getting-started

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const COLORS = [
  "#2563eb",
  "#60a5fa",
  "#818cf8",
  "#34d399",
  "#f59e42",
  "#f43f5e",
  "#a3e635",
  "#fbbf24",
  "#14b8a6",
];

export default function PieChartComponent({ data, nameKey, valueKey, title }) {
  return (
    <div className="bg-white rounded shadow p-4">
      {title && <h3 className="mb-2 font-semibold">{title}</h3>}
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={data}
            dataKey={valueKey}
            nameKey={nameKey}
            cx="50%"
            cy="50%"
            outerRadius={80}
            fill="#2563eb"
            label
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
