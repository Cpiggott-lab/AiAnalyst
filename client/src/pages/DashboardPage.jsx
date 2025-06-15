import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import projectsService from "../services/projectsService";
import { SpinnerInfinity } from "spinners-react";
import FollowUpChat from "../components/FollowUpChat";
import NotesSection from "../components/NotesSection";
import ChartGallery from "../components/ChartGallery";
import SummaryCard from "../components/SummaryCard";
import CleanedDataPreview from "../components/CleanedDataPreview";
import DownloadButton from "../components/DownloadButton";
import { SidebarProvider } from "../components/ui/sidebar";
import UploadPage from "./UploadPage";

export default function DashboardWithPreviewPage() {
  // State variables for managing project list, selection, loading, etc.
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const { projectId } = useParams(); // Get project ID from URL
  const navigate = useNavigate(); // For redirecting

  // Fetch all projects on mount or when projectId changes
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await projectsService.getAllProjects(); // API call
        setProjects(data.projects);
        setFilteredProjects(data.projects);

        if (projectId) {
          const match = data.projects.find((p) => p._id === projectId);
          console.log("match", match);
          if (match) setSelectedProject(match);
        }
      } catch (err) {
        console.log("error", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [projectId]);

  // Search bar logic for filtering projects
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    setFilteredProjects(
      projects.filter((p) => p.name.toLowerCase().includes(term))
    );
  };

  // Delete project and update state
  const handleDelete = async (id) => {
    try {
      await projectsService.deleteProject(id);
      const updated = projects.filter((p) => p._id !== id);
      setProjects(updated);
      setFilteredProjects(updated);
      if (selectedProject && selectedProject._id === id) {
        setSelectedProject(null);
      }
    } catch (err) {
      console.error("Failed to delete project:", err);
    }
  };

  // Fetch summary and chart data for selected project
  useEffect(() => {
    if (!selectedProject) return;

    // If summary doesn't exist, generate it
    if (!selectedProject.summary) {
      projectsService
        .generateSummary(selectedProject._id)
        .then((summary) => {
          setSelectedProject((prev) => ({
            ...prev,
            summary: summary || "No summary generated.",
          }));
        })
        .catch(() => {
          setSelectedProject((prev) => ({
            ...prev,
            summary: "Failed to load summary.",
          }));
        });
    }

    // If chartData doesn't exist or is empty, generate it
    if (
      !selectedProject.chartData?.recommendedCharts ||
      selectedProject.chartData.recommendedCharts.length === 0
    ) {
      projectsService
        .generateChartData(selectedProject._id)
        .then((res) => {
          setSelectedProject((prev) => ({
            ...prev,
            chartData: res.chartData,
          }));
        })
        .catch(() => {
          setSelectedProject((prev) => ({ ...prev, chartData: null }));
        });
    }
  }, [selectedProject]);

  // Spinner while loading
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <SpinnerInfinity
          size={90}
          thickness={100}
          speed={100}
          color="#4F46E5"
          secondaryColor="#D1D5DB"
        />
      </div>
    );
  }

  // Error display
  if (error) {
    return <div className="text-red-600 text-center py-10">{error}</div>;
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen ">
        <div className="w-[20vw] bg-white text-black border-r flex-shrink-0 flex flex-col">
          <div className="p-4 border-b">
            <button
              onClick={() => navigate("/upload")}
              className="w-full mb-4 px-4 py-2 text-sm font-medium text-white bg-black rounded hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
              + New Project
            </button>

            <input
              type="text"
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Search projects..."
              className="w-full px-3 py-2 rounded border focus:outline-none"
            />
          </div>

          <div className="p-4 overflow-y-auto flex-1">
            {filteredProjects &&
              filteredProjects.map((project) => (
                <div
                  key={project._id}
                  className={`p-2 cursor-pointer rounded hover:bg-gray-200 ${
                    selectedProject?._id === project._id
                      ? "bg-gray-200 font-semibold"
                      : ""
                  }`}
                  onClick={() => setSelectedProject(project)}
                >
                  {project.name}
                </div>
              ))}
          </div>
        </div>

        <main className="flex w-[80vw] overflow-y-auto pt-0 mt-0 text-black bg-black">
          {!selectedProject ? (
            <div className="flex flex-col items-center justify-start w-[80vw] h-full bg-black pt-0 space-y-8">
              <div className="bg-white text-black rounded-lg shadow-md p-4 w-[80vw] max-w-2xl">
                <p className="text-lg text-center">
                  Select a project from the sidebar or upload a new project
                  below.
                </p>
              </div>
              <UploadPage />
            </div>
          ) : (
            <div className="w-full max-w-[1500px] mx-auto px-4 bg-black">
              <SummaryCard
                summary={selectedProject.summary}
                loading={!selectedProject.summary}
              />

              {selectedProject.summary && (
                <div className="mb-8">
                  <FollowUpChat
                    projectId={selectedProject._id}
                    summary={selectedProject.summary}
                  />
                </div>
              )}

              <ChartGallery
                charts={selectedProject.chartData?.recommendedCharts}
                loading={!selectedProject.chartData}
              />

              <NotesSection
                key={selectedProject._id}
                projectId={selectedProject._id}
                initialNotes={selectedProject.notes || []}
              />

              <CleanedDataPreview cleanedData={selectedProject.cleanedData} />

              <div className="flex flex-row gap-4 mt-8 justify-between">
                <DownloadButton
                  data={selectedProject.cleanedData}
                  filename={`${selectedProject.name || "cleaned_data"}.json`}
                />

                <div>
                  <div className="bg-red-500 text-red-800 px-4 py-2 rounded-l mb-4 hover:bg-red-700">
                    <button
                      onClick={() => handleDelete(selectedProject._id)}
                      className="text-white text-sm"
                    >
                      Delete Project
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </SidebarProvider>
  );
}
