import jwt from "jsonwebtoken";
import env from "../config/env.js";


const verifyToken = (req, res, next) => {
  try {


    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token missing",
      });
    }


    const payload = jwt.verify(
      token,
      env.JWT_SECRET
    );

    // Store the user ID from the token
    req.user = {
      id: payload.id,
    };

    next();

    
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

export default verifyToken;