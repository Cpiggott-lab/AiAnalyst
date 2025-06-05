const fs = require("fs");
const path = require("path");
const Papa = require("papaparse");
const Project = require("../models/Project");

exports.uploadHandler = async (req, res) => {
  try {
    // console.log("req.file:", req.file);
    // console.log("req.body:", req.body);
    // console.log("req.user:", req.user);

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
