import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const userAuth = asyncHandler(async (req, res, next) => {
  const { token } = req.headers;
  if (!token) {
    return res.json({
      success: "false",
      message: "Not Authorized! Login again!",
    });
  }

  try {
    const tokenDecoded = jwt.verify(token, process.env.JWT_SECRET);
    req.body.userId = tokenDecoded.id;
    next();
  } catch (error) {
    console.log("Error in userAuth middleware", error.message);
    res.status(500).json({
      error: "Internal server error",
      success: "false",
      message: error.message,
    });
  }
});

export default userAuth;
