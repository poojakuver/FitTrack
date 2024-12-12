// authMiddleware.js
import jwt from "jsonwebtoken";

const JWT_SECRET = "aldkfj34e4wefkj";

export const verifyAdmin = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1]; // Get token from Authorization header

    if (!token) {
        return res.status(403).json({ error: "Access denied. No token provided." });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, JWT_SECRET);

        // Check if the user has admin privileges (assuming payload contains isAdmin)
        if (!decoded.isAdmin) {
            return res.status(403).json({ error: "Access denied. Admin privileges required." });
        }

        // Attach decoded payload to the request object
        req.user = decoded;

        // Proceed to the next middleware or route handler
        next();
    } catch (err) {
        return res.status(401).json({ error: "Invalid token." });
    }
};
