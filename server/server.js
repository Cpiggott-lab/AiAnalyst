const dotenv = require("dotenv");
dotenv.config();
const logger = require("morgan");
const express = require("express");
const cors = require("cors");

const app = express();
app.use(logger("dev"));
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");

// Load global middleware first
if (!process.env.CLIENT_URL)
  throw new Error("CLIENT_URL is not set in .env file");

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(cookieParser());

// Routes
const authRoutes = require("./routes/auth");
const projectRoutes = require("./routes/project");

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);

// Root route
app.get("/", (req, res) => {
  res.send("Backend is running!");
});

// Mongo connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
