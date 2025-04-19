const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    console.error("❌ Authorization header missing");
    return res.status(401).json({ success: false, message: "Authorization header missing" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    console.error("❌ Token missing from Authorization header");
    return res.status(401).json({ success: false, message: "Token missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "YOUR_SECRET_KEY");
    console.log("✅ Token successfully verified:", decoded);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("❌ Token verification failed:", error);
    return res.status(403).json({ success: false, message: "Invalid or expired token" });
  }
};
