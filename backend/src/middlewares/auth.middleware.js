import jwt from "jsonwebtoken";


// Verify the JWT without a database query
const verifyToken = (req, res, next) => {
  try {
    // Get the token from the cookie
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token missing",
      });
    }

    // Verify the token and read its payload
    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET
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