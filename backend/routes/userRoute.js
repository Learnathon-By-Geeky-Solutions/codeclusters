import express from "express";
import {
  login,
  register,
  adminLogin,
  userInfo,
  changeAdminPassword,
} from "../controllers/userController.js";
import {
  forgotPassword,
  resetPassword,
  verifyOtp,
} from "../controllers/otpController.js";
import userAuth from "../middleware/userAuth.js";
import adminAuth from "../middleware/adminAuth.js";
const userRouter = express.Router();

userRouter.post("/register", register);
userRouter.post("/login", login);
userRouter.post("/admin", adminLogin);
userRouter.post("/admin/changePassword", adminAuth, changeAdminPassword);

userRouter.post("/forgotPassword", forgotPassword);
userRouter.post("/verify", verifyOtp);
userRouter.post("/resetPassword", resetPassword);
userRouter.post("/userInfo", userAuth, userInfo);
export default userRouter;
