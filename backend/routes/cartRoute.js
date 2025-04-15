import express from "express";
import RateLimit from "express-rate-limit";
import {
  addToCart,
  updateToCart,
  getUserCart,
} from "../controllers/cartController.js";
import userAuth from "../middleware/userAuth.js";

const cartRouter = express.Router();

// set up rate limiter: maximum of 100 requests per 15 minutes
const limiter = RateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // max 100 requests per windowMs
});

cartRouter.post("/get", userAuth, getUserCart);
cartRouter.post("/add", userAuth, addToCart);
cartRouter.post("/update", userAuth, limiter, updateToCart);

export default cartRouter;
