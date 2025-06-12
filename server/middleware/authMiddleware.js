const jwt = require("jsonwebtoken");

function isAuthenticated(req, res, next) {
  const authHeader = req.headers.authorization;
  const token =
    authHeader && authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : req.cookies.token;

  if (!token) {
    console.error("Authentication failed: No token provided");
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error("Authentication failed: Invalid token", err);
    return res.status(401).json({ error: "Invalid token" });
  }
}

module.exports = isAuthenticated;
