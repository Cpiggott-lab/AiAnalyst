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

export default function DashboardWithPreviewPage() {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const { projectId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await projectsService.getAllProjects();
        setProjects(data.projects);
        setFilteredProjects(data.projects);
        if (projectId) {
          const match = data.projects.find((p) => p._id === projectId);
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

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    setFilteredProjects(
      projects.filter((p) => p.name.toLowerCase().includes(term))
    );
  };

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
      alert("Could not delete project.");
    }
  };

  useEffect(() => {
    if (!selectedProject) return;

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

  if (error) {
    return <div className="text-red-600 text-center py-10">{error}</div>;
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen">
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
              filteredProjects &&
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

        <main className="w-[80vw] overflow-y-auto p-6 bg-gray-50 text-black">
          {!selectedProject ? (
            <div className="text-black pt-8 rounded-xl text-center h-full flex items-start justify-center">
              Select a project from the sidebar.
            </div>
          ) : (
            <div className="w-full max-w-[1100px] mx-auto px-4">
              <h1 className="flex justify-center text-2xl font-bold mb-2">
                {selectedProject.name}
              </h1>
              <p className="flex justify-center text-sm mb-4">
                Date: {new Date(selectedProject.createdAt).toLocaleDateString()}
              </p>

              <NotesSection
                key={selectedProject._id}
                projectId={selectedProject._id}
                initialNotes={selectedProject.notes || []}
              />

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
