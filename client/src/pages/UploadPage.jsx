import { useState } from "react";
import { useNavigate } from "react-router-dom";
import projectsService from "../services/projectsService";
import { SpinnerInfinity } from "spinners-react";

export default function UploadPage() {
  const [file, setFile] = useState(null);
  const [projectName, setProjectName] = useState("");
  const [prompt, setPrompt] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("Please select a file before uploading.");
      return;
    }

    setIsUploading(true);

    try {
      const project = await projectsService.upload(
        file,
        projectName || "Untitled Project",
        prompt || "" // Optional prompt
      );
      navigate(`/dashboard/${project._id}`);
    } catch (err) {
      console.error("Upload failed", err);
      alert("Upload failed");
      setIsUploading(false);
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
    <div className="flex justify-center py-4">
      <div className="bg-white rounded-lg shadow-md p-8 w-[80vw] max-w-2xl">
        {!isUploading && (
          <h1 className="text-3xl font-bold mb-6 text-center">
            Upload CSV File
          </h1>
        )}

        {isUploading ? (
          <div className="flex flex-col justify-center items-center h-80 space-y-4">
            <p className="text-lg font-semibold text-gray-600">Uploading...</p>
            <SpinnerInfinity
              size={90}
              thickness={100}
              speed={100}
              color="#4F46E5"
            />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="Enter project name"
              className="w-full px-4 py-2 border border-gray-300 rounded-md text-black"
            />

            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="What would you like AiAnalyst to analyze or summarize? (Optional, it will return a standard Executive Summary if left blank)"
              className="w-full px-4 py-2 border border-gray-300 rounded-md text-black"
              rows={4}
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
                className="inline-block mt-2 bg-black text-white px-4 py-2 rounded hover:bg-gray-600 cursor-pointer"
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
                className="w-full px-6 py-3 bg-green-500 text-white rounded text-lg font-semibold hover:bg-green-600"
              >
                Upload Project
              </button>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
