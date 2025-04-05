import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const adminAuth = asyncHandler(async (req, res, next) => {
  try {
    const { token } = req.headers;
    if (!token) {
      return res.json({
        success: "false",
        msg: "Not Authorized! Login again!",
      });
    }
    const tokenDecoded = jwt.verify(token, process.env.JWT_SECRET);
    if (
      tokenDecoded.id !==
      process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD
    ) {
      return res.json({
        success: "false",
        msg: "Not Authorized! Login again!",
      });
    }
    next();
  } catch (error) {
    console.log("Error in adminAuth middleware", error.message);
    res.status(500).json({
      error: "Internal server error",
    });
  }
});

export default adminAuth;
