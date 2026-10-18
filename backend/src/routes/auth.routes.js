import express from "express";
import { googleCallback, getMe, logout } from "../controllers/auth.controller.js";
import passport from "../config/passport.config.js";
import verifyToken from "../middlewares/auth.middleware.js";

const router = express.Router();

// Start Google login
router.get(
    "/google",
    passport.authenticate("google", {
        scope: ["profile", "email"],
        session: false,
    })
);

// Handle Google's callback
router.get(
    "/google/callback",
    passport.authenticate("google", {
        session: false,
        failureRedirect: "http://localhost:5173/login",
    }),
    googleCallback
);


// Get the current user's profile
router.get("/me", verifyToken, getMe);

// Log out the user
router.post("/logout", logout);

export default router;