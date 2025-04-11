const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
    console.log("🔑 Authorization Header:", req.headers.authorization);
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ success: false, message: "Unauthorized: No token provided." });
    }

    const token = authHeader.split(" ")[1];
    console.log("🔑 Token received:", token);

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ success: false, message: "Invalid token." });
        }
        req.user = user;
        console.log("🔍 Token Verification Debugging:", { token, user: req.user });
        next();
    });
}

module.exports = verifyToken;
