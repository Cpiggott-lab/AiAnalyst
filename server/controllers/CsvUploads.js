const fs = require("fs");
const Papa = require("papaparse");
const Project = require("../models/Project");
const { generateSummary } = require("./AiSummaryPrompt");
const { generateChartDataUniversal } = require("./AiChartDataPrompt");

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
      prompt: req.body.prompt || "", // Ensure prompt is correctly accessed
      userId: req.user.id,
      rawData: parsed.data,
      cleanedData: cleaned,
      summary: "Summary is being generated...",
      chartData: {},
    });

    fs.unlinkSync(filePath);

    // Trigger AI-based summary generation
    await generateSummary({
      projectId: project._id,
      userId: req.user.id,
      prompt: req.body.prompt, // Pass prompt correctly
    });

    // // Generate chart data
    // await generateChartDataUniversal({
    //   projectId: project._id,
    //   userId: req.user.id,
    // });

    res.json(project);
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: "Failed to upload project" });
  }
};
const mongoose = require("mongoose");

exports.getAllProjects = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;
    console.log("API response:", res.data); // log this

    if (!req.user || !req.user.id) {
      return res
        .status(401)
        .json({ error: "Unauthorized: User not found in request" });
    }

    console.log("Fetching projects for user:", req.user.id, "Page:", page);

    const projects = await Project.find({ userId: req.user.id })
      .select("name prompt summary notes createdAt")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Project.countDocuments({ userId: req.user.id });

    res.json({
      projects,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
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
