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
    <div className="text-center p-8">
      <h1 className="text-2xl font-semibold mb-6">Upload CSV</h1>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center gap-4"
      >
        <input
          type="text"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          placeholder="Enter project name"
          className="border px-4 py-2 rounded w-full max-w-md"
        />

        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-8 w-full max-w-md text-center transition-colors ${
            dragActive ? "bg-gray-100" : "bg-white"
          }`}
        >
          <p className="text-gray-500">
            {file ? file.name : "Drag & drop your CSV file here"}
          </p>
        </div>

        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="hidden"
          id="csv-upload"
        />
        <label
          htmlFor="csv-upload"
          className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-600"
        >
          Choose File
        </label>

        {file && (
          <button
            type="submit"
            className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
          >
            Upload
          </button>
        )}
      </form>
    </div>
  );
}
