import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import projectsService from "../services/projectsService";

export default function ProjectViewPage() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProject = async () => {
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

  const generateSummary = async () => {
    setSummaryLoading(true);
    try {
      const data = await projectsService.generateSummary(id);
      setProject((prev) => ({ ...prev, summary: data.summary }));
    } catch (err) {
      console.error("Error generating summary:", err);
    } finally {
      setSummaryLoading(false);
    }
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error)
    return <div className="text-red-600 text-center py-10">{error}</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-center mb-2">{project.name}</h1>
      <p className="text-center text-gray-600 mb-6">
        Date: {new Date(project.createdAt).toLocaleDateString()}
      </p>

      <div className="text-center mb-8">
        <button
          onClick={generateSummary}
          disabled={summaryLoading}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {summaryLoading ? "Generating..." : "Generate Summary"}
        </button>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Summary</h2>
        <p className="whitespace-pre-wrap bg-gray-100 p-4 rounded">
          {project.summary || "No summary generated yet."}
        </p>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Cleaned Data (Preview)</h2>
        <pre className="bg-gray-800 text-white text-sm p-4 rounded overflow-y-scroll max-h-72 whitespace-pre-wrap">
          {JSON.stringify(project.cleanedData.slice(0, 5), null, 2)}
        </pre>
      </div>
    </div>
  );
}
