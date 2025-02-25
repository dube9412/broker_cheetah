// middleware/verifyToken.js (NEW FILE)
const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1]; // Bearer <token>

        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                return res.status(403).json({ success: false, message: 'Invalid token.' }); // Forbidden
            }
            req.user = user; // Attach the decoded user to the request object
            next();
        });
    } else {
        res.status(401).json({ success: false, message: 'Unauthorized.' }); // Unauthorized
    }
}

module.exports = verifyToken;