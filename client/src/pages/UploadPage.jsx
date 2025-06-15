import { useState } from "react";
import { useNavigate } from "react-router-dom";
import projectsService from "../services/projectsService";
import { SpinnerInfinity } from "spinners-react";

// UploadPage allows users to submit a CSV file and optional prompt for analysis
export default function UploadPage() {
  // State to store the file, project name, and optional prompt
  const [file, setFile] = useState(null);
  const [projectName, setProjectName] = useState("");
  const [prompt, setPrompt] = useState("");

  // UI states for drag interaction and loading spinner
  const [dragActive, setDragActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const navigate = useNavigate(); // Used to redirect user after upload

  // Handles form submit – sends file and info to backend
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload
    if (!file) {
      alert("Please select a CSV file to upload.");
      return;
    }

    setIsUploading(true); // Show loading spinner

    try {
      // Upload file to the backend with optional project name and prompt
      const project = await projectsService.upload(
        file,
        projectName || "Untitled Project",
        prompt || ""
      );
      // Redirect to dashboard view of that project
      navigate(`/dashboard/${project._id}`);
    } catch (err) {
      console.error("Upload failed", err);
      alert("Upload failed");
      setIsUploading(false); // Stop spinner
    }
  };

  // Highlight drop zone on drag over
  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  // Reset drop zone style when drag leaves
  const handleDragLeave = () => {
    setDragActive(false);
  };

  // When user drops a file, capture it
  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  // When user chooses a file from file picker
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <div className="flex justify-center py-4">
      <div className="bg-white rounded-lg shadow-md p-8 w-[80vw] max-w-2xl">
        {/* Show heading unless uploading */}
        {!isUploading && (
          <h1 className="text-3xl font-bold mb-6 text-center">
            Upload CSV File
          </h1>
        )}

        {/* If uploading, show spinner */}
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
          // Upload form
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

            {/* Drag-and-drop file zone */}
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

            {/* Only show upload button if a file is selected */}
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
