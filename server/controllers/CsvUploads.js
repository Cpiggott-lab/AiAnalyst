const fs = require("fs");
const path = require("path");
const Papa = require("papaparse");
const Project = require("../models/Project");
const { generateSummary } = require("./AiSummaryPrompt");

exports.uploadHandler = async (req, res) => {
  try {
    const filePath = req.file.path;
    const file = fs.readFileSync(filePath, "utf8");

    const parsed = Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
    });

    const cleaned = parsed.data.filter((row) =>
      Object.values(row).some((val) => val !== "")
    );

    const project = await Project.create({
      name: req.body.name || "Untitled Project",
      userId: req.user.id,
      rawData: parsed.data,
      cleanedData: cleaned,
      summary: "Summary is being generated...",
      chartData: {},
    });

    fs.unlinkSync(filePath);

    // Trigger AI-based summary generation
    await generateSummary({ projectId: project._id, userId: req.user.id }); // Pass project ID and user ID directly

    res.json(project);
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: "Failed to upload project" });
  }
};

exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find({ userId: req.user.id }).sort({
      createdAt: -1,
    });
    res.json(projects);
  } catch (err) {
    console.error("Error fetching projects:", err);
    res.status(500).json({ error: "Failed to fetch projects" });
  }
};

exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!project) return res.status(404).json({ error: "Project not found" });
    res.json(project);
  } catch (err) {
    console.error("Error fetching project:", err);
    res.status(500).json({ error: "Failed to fetch project" });
  }
};
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    if (project.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: "Project deleted successfully" });
  } catch (err) {
    console.error("Error deleting project:", err);
    res.status(500).json({ error: "Failed to delete project" });
  }
};
exports.updateNote = async (req, res) => {
  try {
    const { note } = req.body;
    const project = await Project.findById(req.params.id);

    if (!project || project.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    project.notes.push({
      text: note,
      createdAt: new Date(),
      createdBy: req.user?.email || "System", // Optional
    });

    await project.save();
    res.json({ message: "Note added", notes: project.notes });
  } catch (err) {
    console.error("Note update error:", err);
    res.status(500).json({ error: "Failed to update note" });
  }
};
