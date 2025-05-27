const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const authRoutes = require("./routes/auth");

require("dotenv").config();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);

// Root route
app.get("/", (req, res) => {
  res.send("Backend is running!");
});

// Load User model
const User = require("./models/User");

// Test user until I build the actual user input
app.post("/api/test-user", async (req, res) => {
  try {
    const testUser = await User.create({
      email: "test@example.com",
      password: "123456",
    });
    res.json(testUser);
  } catch (err) {
    console.error("Error creating user:", err);
    res.status(500).json({ error: "Failed to create user" });
  }
});

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
