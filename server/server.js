const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const cors = require("cors");

// Load global middleware first
const allowedOrigins = [
  process.env.CLIENT_URL,
  "http://localhost:5173",
  "https://aianalyst.netlify.app",
];
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // must be true to allow cookies
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
