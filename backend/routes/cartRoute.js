import express from "express";
import RateLimit from "express-rate-limit";
import {
  addToCart,
  updateToCart,
  getUserCart,
} from "../controllers/cartController.js";
import userAuth from "../middleware/userAuth.js";

const cartRouter = express.Router();

const limiter = RateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

cartRouter.post("/get", userAuth, limiter, getUserCart);
cartRouter.post("/add", userAuth, limiter, addToCart);
cartRouter.post("/update", userAuth, limiter, updateToCart);

export default cartRouter;
