const jwt = require("jsonwebtoken");

const jwtMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Access denied. No token provided." });
    }
    const token = authHeader.split(" ")[1]; 
    const secretKey = process.env.JWT_SECRET || "your-secret-key";
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("JWT validation error:", error.message);
    res.status(401).json({ message: "Invalid or expired token.", error: error.message });
  }
};

module.exports = jwtMiddleware;
