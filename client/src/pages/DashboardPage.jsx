import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import projectsService from "../services/projectsService";

export default function DashboardPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await projectsService.getAllProjects();
        setProjects(data);
      } catch (err) {
        setError(err.message || "Error loading projects");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-600 text-center py-10">{error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-center mb-6">Your Projects</h1>

      {projects.length === 0 ? (
        <p className="text-center text-gray-600">
          You have no projects yet. Upload one to get started!
        </p>
      ) : (
        <ul className="space-y-4">
          {projects.map((project) => (
            <li
              key={project._id}
              className="bg-gray-100 p-4 rounded shadow-sm hover:shadow-md transition"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-semibold">{project.name}</h2>
                  <p className="text-gray-600">
                    Created: {new Date(project.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <Link
                  to={`/projects/${project._id}`}
                  className="text-blue-500 hover:underline"
                >
                  View →
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
