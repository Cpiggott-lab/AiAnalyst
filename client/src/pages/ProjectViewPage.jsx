import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import projectsService from "../services/projectsService";
import FollowUpChat from "../components/FollowUpChat";
import NotesSection from "../components/NotesSection";
import ChartGallery from "../components/ChartGallery";
import SummaryCard from "../components/SummaryCard";
import CleanedDataPreview from "../components/CleanedDataPreview";
import DownloadButton from "../components/DownloadButton";

export default function ProjectViewPage() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [summaryLoading, setSummaryLoading] = useState(false);
  const [chartLoading, setChartLoading] = useState(false);

  const [note, setNote] = useState("");
  const [notes, setNotes] = useState([]);
  const [noteSaving, setNoteSaving] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      setLoading(true);
      try {
        const data = await projectsService.getProjectById(id);
        setProject(data);
        setNotes(data.notes || []); // Load notes
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [id]);

  useEffect(() => {
    if (!id || summaryLoading || !project) return;
    if (project.summary) return;

    setSummaryLoading(true);
    projectsService
      .generateSummary(id)
      .then((summary) => {
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

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error)
    return <div className="text-red-600 text-center py-10">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-center mb-2">{project.name}</h1>
      <p className="text-center text-gray-600 mb-6">
        Date: {new Date(project.createdAt).toLocaleDateString()}
      </p>

      {/* Moved Note Section to Component */}
      <NotesSection projectId={project._id} initialNotes={project.notes} />

      {/* Summary Section Moved to component */}
      <SummaryCard summary={project.summary} loading={summaryLoading} />

      {/* Follow up AI chat */}
      {project.summary && (
        <div className="mb-8">
          <FollowUpChat projectId={id} summary={project.summary} />
        </div>
      )}

      {/* Moved Chart section to component  */}
      <ChartGallery
        charts={project.chartData?.recommendedCharts}
        loading={chartLoading}
      />

      {/* Cleaned data preview section */}
      <CleanedDataPreview cleanedData={project.cleanedData} />

      <DownloadButton
        data={project.cleanedData}
        filename={`${project.name || "cleaned_data"}.json`}
      />
    </div>
  );
}
