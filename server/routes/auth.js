const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const isAuthenticated = require("../middleware/authMiddleware");

const router = express.Router();

// Register
router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = await User.create({ email, passwordHash });
    console.log(newUser);
    const { passwordHash: _, ...userData } = newUser.toObject();
    res.status(201).json({ message: "User created", user: userData });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        isAdmin: user.isAdmin || false,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
      })
      .json({
        message: "Login successful",
        token,
        user: {
          _id: user._id,
          email: user.email,
          isAdmin: user.isAdmin || false,
        },
      });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Authenticated user check
router.get("/me", isAuthenticated, (req, res) => {
  res.json(req.user);
});

module.exports = router;
