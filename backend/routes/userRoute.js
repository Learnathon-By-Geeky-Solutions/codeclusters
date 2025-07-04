import express from "express";
import {
  login,
  register,
  adminLogin,
  userInfo,
  changeAdminPassword,
  googleLogin,
} from "../controllers/userController.js";
import {
  forgotPassword,
  resetPassword,
  verifyEmail,
  verifyOtp,
} from "../controllers/otpController.js";
import userAuth from "../middleware/userAuth.js";
import adminAuth from "../middleware/adminAuth.js";
const userRouter = express.Router();

userRouter.post("/register", register);
userRouter.post("/login", login);
userRouter.post("/googleLogin", googleLogin);
userRouter.post("/admin", adminLogin);
userRouter.post("/admin/changePassword", adminAuth, changeAdminPassword);

userRouter.post("/forgotPassword", forgotPassword);
userRouter.post("/verifyEmail", verifyEmail);
userRouter.post("/verify", verifyOtp);
userRouter.post("/resetPassword", resetPassword);
userRouter.post("/userInfo", userAuth, userInfo);
export default userRouter;
