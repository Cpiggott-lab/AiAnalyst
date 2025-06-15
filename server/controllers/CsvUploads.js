const fs = require("fs");
const Papa = require("papaparse");
const Project = require("../models/Project");
const { generateSummary } = require("./AiSummaryPrompt");

// Handles file upload and project creation
exports.uploadHandler = async (req, res) => {
  try {
    const filePath = req.file.path;
    const file = fs.readFileSync(filePath, "utf8");

    // Parse CSV using headers and skip empty lines
    const parsed = Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
    });

    // Clean data by removing empty rows
    const cleaned = parsed.data.filter((row) =>
      Object.values(row).some((val) => val !== "")
    );

    // Create new project in database
    const project = await Project.create({
      name: req.body.name || "Untitled Project",
      prompt: req.body.prompt || "",
      userId: req.user.id,
      rawData: parsed.data,
      cleanedData: cleaned,
      summary: "Summary is being generated...",
      chartData: {},
    });

    // Delete uploaded file from temp folder
    fs.unlinkSync(filePath);

    // Kick off summary generation in the background
    await generateSummary({
      projectId: project._id,
      userId: req.user.id,
      prompt: req.body.prompt,
    });

    res.json(project);
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: "Failed to upload project" });
  }
};

// Get all projects for the logged-in user with pagination
exports.getAllProjects = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    // Check that user is attached to the request
    if (!req.user || !req.user.id) {
      return res
        .status(401)
        .json({ error: "Unauthorized: User not found in request" });
    }

    // Fetch user's projects, sorted newest first
    const projects = await Project.find({ userId: req.user.id })
      .select("name prompt summary notes cleanedData createdAt")
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

// Get a single project by ID for the logged-in user
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

// Delete a project if user owns it
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    // Only allow deletion if user owns the project
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

// Add a note to a project if user owns it
exports.updateNote = async (req, res) => {
  try {
    const { note } = req.body;
    const project = await Project.findById(req.params.id);

    // Block update if user doesn't own the project
    if (!project || project.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    // Push new note with timestamp and optional creator email
    project.notes.push({
      text: note,
      createdAt: new Date(),
      createdBy: req.user?.email || "System",
    });

    await project.save();
    res.json({ message: "Note added", notes: project.notes });
  } catch (err) {
    console.error("Note update error:", err);
    res.status(500).json({ error: "Failed to update note" });
  }
};
