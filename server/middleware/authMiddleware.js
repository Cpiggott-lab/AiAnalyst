const jwt = require("jsonwebtoken");

// Middleware to check if the request is coming from a logged in user
function isAuthenticated(req, res, next) {
  const authHeader = req.headers.authorization;

  // Get token from http request or check for cookie
  const token =
    authHeader && authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1] //
      : req.cookies.token; // Or get it from cookies if header is missing

  // If no token is found return error
  if (!token) {
    console.error("Authentication failed: No token provided");
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    // Verify the token with secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the decoded user info to the request
    req.user = decoded;

    // Allow continue
    next();
  } catch (err) {
    // If invalid token.
    console.error("Authentication failed: Invalid token", err);
    return res.status(401).json({ error: "Invalid token" });
  }
}

module.exports = isAuthenticated;
