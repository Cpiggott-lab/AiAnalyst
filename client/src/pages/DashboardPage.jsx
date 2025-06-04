import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import projectsService from "../services/projectsService";

export default function DashboardPage() {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await projectsService.getAllProjects();
        setProjects(data);
        setFilteredProjects(data);
      } catch (err) {
        setError(err.message || "Error loading projects");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleDelete = async (id) => {
    try {
      await projectsService.deleteProject(id);
      setProjects((prev) => prev.filter((p) => p._id !== id));
      setFilteredProjects((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error("Failed to delete project:", err);
      alert("Could not delete project.");
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = projects.filter((project) =>
      project.name.toLowerCase().includes(term)
    );
    setFilteredProjects(filtered);
  };

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-600 text-center py-10">{error}</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">
        <h1 className="text-3xl font-bold text-center md:text-left">
          Your Projects
        </h1>

        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Search projects..."
          className="w-full md:w-1/2 px-4 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
        />

        <button
          onClick={() => navigate("/upload")}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          + New Project
        </button>
      </div>

      {filteredProjects.length === 0 ? (
        <p className="text-center text-gray-600">
          No projects match your search.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project._id}
              className="bg-white p-6 rounded shadow-sm border hover:shadow-md transition"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-semibold">{project.name}</h2>
                  <p className="text-gray-600 text-sm">
                    Created: {new Date(project.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(project._id)}
                  className="text-red-500 text-sm hover:underline"
                >
                  Delete
                </button>
              </div>

              <div className="bg-gray-900 text-white text-xs rounded p-4 overflow-auto max-h-40 whitespace-pre-wrap mb-4">
                {project.cleanedData?.length > 0 ? (
                  <pre>
                    {JSON.stringify(project.cleanedData.slice(0, 3), null, 2)}
                  </pre>
                ) : (
                  <p>No cleaned data available.</p>
                )}
              </div>

              <Link
                to={`/projects/${project._id}`}
                className="inline-block text-blue-600 hover:underline font-medium"
              >
                View →
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
