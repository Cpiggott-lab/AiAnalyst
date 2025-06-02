const express = require("express");
const multer = require("multer");
const Papa = require("papaparse");
const fs = require("fs");
const Project = require("../models/Project");
const OpenAI = require("openai");
const verifyToken = require("../middleware/authMiddleware");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// CSV upload
router.post("/upload", verifyToken, upload.single("file"), async (req, res) => {
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
      summary: "Summary to be generated in future step",
    });

    fs.unlinkSync(filePath);
    res.json(project);
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: "Failed to upload project" });
  }
});

//Prompt summary generation
router.post("/:id/summary", verifyToken, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ error: "Project not found" });

    if (project.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: "Unauthorized access" });
    }

    const prompt = `
You are an AI analyst. Summarize the following data as if preparing a quick executive overview. Keep it clear, insightful, and concise.

Here is the data (in JSON format):

${JSON.stringify(project.cleanedData.slice(0, 50), null, 2)}
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4-1106-preview",
      messages: [
        { role: "system", content: "You are a helpful business analyst." },
        { role: "user", content: prompt },
      ],
      temperature: 0.4,
    });

    const summary =
      response.choices[0]?.message?.content || "No summary generated.";
    project.summary = summary;
    await project.save();

    res.json({ summary });
  } catch (err) {
    console.error("Summary generation error:", err);
    res.status(500).json({ error: "Failed to generate summary" });
  }
});

// GET all projects
router.get("/", verifyToken, async (req, res) => {
  try {
    const projects = await Project.find({ userId: req.user.id }).sort({
      createdAt: -1,
    });
    res.json(projects);
  } catch (err) {
    console.error("Error fetching projects:", err);
    res.status(500).json({ error: "Failed to fetch projects" });
  }
});

// GET single project by ID
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      userId: req.user.id, // scoped to the user
    });

    if (!project) return res.status(404).json({ error: "Project not found" });
    res.json(project);
  } catch (err) {
    console.error("Error fetching project:", err);
    res.status(500).json({ error: "Failed to fetch project" });
  }
});

module.exports = router;
