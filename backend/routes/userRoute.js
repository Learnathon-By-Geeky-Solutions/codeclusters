import express from "express";
import { login, register, adminLogin } from "../controllers/userController.js";
import {
  forgotPassword,
  resetPassword,
  verifyOtp,
} from "../controllers/otpController.js";

const userRouter = express.Router();

userRouter.post("/register", register);
userRouter.post("/login", login);
userRouter.post("/admin", adminLogin);
userRouter.post("/forgotPassword", forgotPassword);
userRouter.post("/verify", verifyOtp);
userRouter.post("/resetPassword", resetPassword);
export default userRouter;
