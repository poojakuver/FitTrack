// authMiddleware.js
import jwt from "jsonwebtoken";

const JWT_SECRET = "aldkfj34e4wefkj";

export const verifyUser = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1]; // Extract token from Authorization header

    if (!token) {
        return res.status(403).json({ error: "Access denied. No token provided." });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, JWT_SECRET);

        // Attach decoded payload to the request object
        req.user = decoded;

        // Proceed to the next middleware or route handler
        next();
    } catch (err) {
        return res.status(401).json({ error: "Invalid token." });
    }
};
