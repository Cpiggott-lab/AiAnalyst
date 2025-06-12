import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import projectsService from "../services/projectsService";
import { SpinnerInfinity } from "spinners-react";

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

  // Loading spinner section
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
    <div className="bg-black flex flex-col items-center py-10 text-center h-full">
      <div className="bg-black rounded-lg shadow-md p-6 mb-1 w-[80vw]">
        <div className="max-w-4xl mx-auto px-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-white text-3xl font-bold text-center md:text-left">
            Projects
          </h1>

          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search projects..."
            className="bg-white w-full md:w-1/2 px-4 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
          />

          <button
            onClick={() => navigate("/upload")}
            className="bg-white text-black px-4 py-2 rounded hover:bg-gray-600 cursor-pointer"
          >
            + New
          </button>
        </div>
      </div>

      {filteredProjects.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6 w-[80vw]">
          <div className="max-w-4xl mx-auto px-4 text-gray-600">
            No projects match your search.
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-[80vw]">
          {filteredProjects.map((project) => (
            <div
              key={project._id}
              className="bg-white p-6 rounded-lg shadow-md border hover:shadow-lg transition"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="text-left">
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

              <div className="bg-black text-white text-xs rounded p-4 overflow-auto max-h-40 whitespace-pre-wrap mb-4 text-left">
                {project.cleanedData?.length > 0 ? (
                  <pre>
                    {JSON.stringify(project.cleanedData.slice(0, 3), null, 2)}
                  </pre>
                ) : (
                  <p>No cleaned data available.</p>
                )}
              </div>

              <div className="text-right">
                <Link
                  to={`/projects/${project._id}`}
                  className="text-blue-600 hover:underline font-medium"
                >
                  View →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
