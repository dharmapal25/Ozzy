import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import env from "../config/env.js";

// Create a JWT for the user
const createToken = (userId) => {
    return jwt.sign(
        { id: userId },
        env.JWT_SECRET,
        { expiresIn: "7d" }
    );
};


// Set the cookie and redirect after Google login
export const googleCallback = (req, res) => {
    const token = createToken(req.user._id);

    res.cookie("token", token, {
        httpOnly: true,
        secure: env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/api",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.redirect(`${env.FRONTEND_URL}/work`);
};

// Get the current user's profile
export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
            .select("-__v");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        return res.json({
            success: true,
            user,
        });


    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch user",
        });
    }
};

// Logout the user
export const logout = (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/api",
    });

    return res.json({
        success: true,
        message: "Logged out successfully",
    });
};