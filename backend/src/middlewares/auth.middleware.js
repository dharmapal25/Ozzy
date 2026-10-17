import jwt from "jsonwebtoken";

export const authenticateUser = async (req, res, next) => {
    try {
        // Direct cookie 
        const token = req.cookies?.token;

        // Token exist 
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Access Denied: No token provided in cookies",
            });
        }

        // Token verify 
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Decoded payload userId set in the req.user 
        req.user = decoded;

        next();

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token",
            error: error.message,
        });
    }
};