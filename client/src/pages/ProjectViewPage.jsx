import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import projectsService from "../services/projectsService";
import FollowUpChat from "../components/FollowUpChat";
import BarChartComponent from "../components/charts/BarChartComponent";
import PieChartComponent from "../components/charts/PieChartComponent";
import LineChartComponent from "../components/charts/LineChartComponent";
import HistogramComponent from "../components/charts/HistogramComponent";

export default function ProjectViewPage() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [summaryLoading, setSummaryLoading] = useState(false);
  const [chartLoading, setChartLoading] = useState(false);

  // Fetch project info, including summary and chartData if present
  useEffect(() => {
    const fetchProject = async () => {
      setLoading(true);
      try {
        const data = await projectsService.getProjectById(id);
        setProject(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [id]);

  // Generate summary if missing
  useEffect(() => {
    if (!id || summaryLoading) return;

    // Don't generate if project already has summary
    if (project?.summary) return;

    setSummaryLoading(true);
    projectsService
      .generateSummary(id)
      .then((summary) => {
        console.log("Set summary:", summary);
        setProject((prev) => ({
          ...prev,
          summary: summary || "No summary generated.",
        }));
      })
      .catch(() => {
        setProject((prev) => ({
          ...prev,
          summary: "Failed to load summary.",
        }));
      })
      .finally(() => setSummaryLoading(false));
  }, [id, project?.summary, summaryLoading]);

  // Generate chart data if missing
  useEffect(() => {
    if (!project || chartLoading) return;

    if (
      !project.chartData ||
      !project.chartData.recommendedCharts ||
      project.chartData.recommendedCharts.length === 0
    ) {
      setChartLoading(true);
      projectsService
        .generateChartData(project._id)
        .then((res) => {
          setProject((prev) => ({ ...prev, chartData: res.chartData }));
        })
        .catch(() => {
          setProject((prev) => ({
            ...prev,
            chartData: null,
          }));
        })
        .finally(() => setChartLoading(false));
    }
  }, [project, chartLoading]);

  const downloadCleanedData = () => {
    if (!project) return;
    const blob = new Blob([JSON.stringify(project.cleanedData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${project.name || "cleaned_data"}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error)
    return <div className="text-red-600 text-center py-10">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-center mb-2">{project.name}</h1>
      <p className="text-center text-gray-600 mb-6">
        Date: {new Date(project.createdAt).toLocaleDateString()}
      </p>

      {/* Cleaned Data preview */}
      <div className="mb-4">
        <h2 className="flex justify-center text-xl font-semibold mb-2">
          Cleaned Data (Preview)
        </h2>
        <pre className="bg-gray-800 text-white text-sm p-4 rounded overflow-y-scroll max-h-72 whitespace-pre-wrap">
          {JSON.stringify(project.cleanedData.slice(0, 5), null, 2)}
        </pre>
      </div>

      {/* Summary section */}
      <div className="mb-8">
        <h2 className="flex justify-center text-xl font-semibold mb-2">
          Summary
        </h2>
        {summaryLoading ? (
          <div>Loading summary...</div>
        ) : (
          <p className="whitespace-pre-wrap bg-gray-100 p-4 rounded">
            {project.summary || "Pending summary generation."}
          </p>
        )}
      </div>

      {project.summary && (
        <div className="mb-8">
          <FollowUpChat projectId={id} summary={project.summary} />
        </div>
      )}

      {/* Chart section */}
      <div className="my-10 grid grid-cols-1 md:grid-cols-2 gap-8">
        {chartLoading && <div>Loading charts...</div>}
        {project.chartData?.recommendedCharts?.length > 0
          ? project.chartData.recommendedCharts.map((chart, idx) => {
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
            })
          : !chartLoading &&
            project.chartData && (
              <div className="text-center col-span-2">
                No charts available for this data.
              </div>
            )}
      </div>

      <div className="text-center mb-8">
        <button
          onClick={downloadCleanedData}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Download Full Cleaned Data
        </button>
      </div>
    </div>
  );
}
