import { useState } from "react";
import { useNavigate } from "react-router-dom";
import projectsService from "../services/projectsService";

export default function UploadPage() {
  const [file, setFile] = useState(null);
  const [projectName, setProjectName] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("Please select a file before uploading.");
      return;
    }

    try {
      const project = await projectsService.upload(
        file,
        projectName || "Untitled Project"
      );
      navigate(`/projects/${project._id}`);
    } catch (err) {
      console.error("Upload failed", err);
      alert("Upload failed");
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <div className="flex justify-center py-16">
      <div className="bg-white rounded-lg shadow-md p-8 w-[80vw] max-w-2xl">
        <h1 className="text-3xl font-bold mb-6 text-center">Upload CSV File</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="Enter project name"
            className="w-full px-4 py-2 border border-gray-300 rounded-md text-black"
          />

          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`w-full border-2 border-dashed rounded-md p-6 text-center text-gray-600 cursor-pointer transition ${
              dragActive ? "bg-gray-100 border-blue-400" : "bg-gray-50"
            }`}
          >
            <p className="mb-2">
              {file ? (
                <span className="text-green-600 font-semibold">
                  {file.name}
                </span>
              ) : (
                "Drag & drop your CSV file here"
              )}
            </p>
            <label
              htmlFor="csv-upload"
              className="inline-block mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 cursor-pointer"
            >
              Choose File
            </label>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="hidden"
              id="csv-upload"
            />
          </div>

          {file && (
            <button
              type="submit"
              className="w-full bg-green-500 text-white px-6 py-3 rounded hover:bg-green-600 text-lg font-semibold"
            >
              Upload Project
            </button>
          )}
        </form>
      </div>
    </div>
  );
}
