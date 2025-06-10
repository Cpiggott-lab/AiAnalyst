const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/authMiddleware");
const multer = require("multer");
const upload = multer({ dest: "public/uploads" });

const {
  generateChartDataUniversal,
} = require("../controllers/AiChartDataPrompt");

const {
  uploadHandler,
  getAllProjects,
  getProjectById,
  deleteProject,
} = require("../controllers/CsvUploads");

const {
  generateSummary,
  askSummaryQuestion,
} = require("../controllers/AiSummaryPrompt");

// Upload CSV
router.post("/upload", verifyToken, upload.single("file"), uploadHandler);

// Get all projects
router.get("/", verifyToken, getAllProjects);

// Get one project
router.get("/:id", verifyToken, getProjectById);

// Delete project
router.delete("/:id", verifyToken, deleteProject);

// Generate summary
router.post("/:id/summary", verifyToken, generateSummary);

// Ask a follow-up question about a summary
router.post("/:id/question", verifyToken, askSummaryQuestion);

// Generating chart data
router.get("/:id/chartdata-universal", verifyToken, generateChartDataUniversal);

module.exports = router;
