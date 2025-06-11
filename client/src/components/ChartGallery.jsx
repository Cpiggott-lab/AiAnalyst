import BarChartComponent from "./charts/BarChartComponent";
import PieChartComponent from "./charts/PieChartComponent";
import LineChartComponent from "./charts/LineChartComponent";
import HistogramComponent from "./charts/HistogramComponent";

export default function ChartGallery({ charts, loading }) {
  if (loading) {
    return <div className="text-center">Loading charts...</div>;
  }

  if (!charts || charts.length === 0) {
    return (
      <div className="text-center col-span-2">
        No charts available for this data.
      </div>
    );
  }

  return (
    <div className="my-10 grid grid-cols-1 md:grid-cols-2 gap-8">
      {charts.map((chart, idx) => {
        switch (chart.type) {
          case "bar":
            return (
              <BarChartComponent
                key={idx}
                data={chart.data}
                xKey="label"
                yKey="count"
                title={chart.title}
              />
            );
          case "pie":
            return (
              <PieChartComponent
                key={idx}
                data={chart.data}
                nameKey="label"
                valueKey="count"
                title={chart.title}
              />
            );
          case "line":
            return (
              <LineChartComponent
                key={idx}
                data={chart.data}
                xKey="date"
                yKey="value"
                title={chart.title}
              />
            );
          case "histogram":
            return (
              <HistogramComponent
                key={idx}
                data={chart.data}
                xKey="bin"
                yKey="count"
                title={chart.title}
              />
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
