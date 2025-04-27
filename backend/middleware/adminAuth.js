import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const adminAuth = asyncHandler(async (req, res, next) => {
  const { token } = req.headers;
  if (!token) {
    return res.json({
      success: "false",
      message: "Not Authorized! Login again!",
    });
  }
  try {
    const tokenDecoded = jwt.verify(token, process.env.JWT_SECRET);
    req.adminId = tokenDecoded.id;

    next();
  } catch (error) {
    console.log("Error in adminAuth middleware", error.message);
    res.status(500).json({
      error: "Internal server error",
    });
  }
});

export default adminAuth;
