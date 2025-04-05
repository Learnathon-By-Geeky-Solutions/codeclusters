import express from "express";
import {
  addToCart,
  updateToCart,
  getUserCart,
} from "../controllers/cartController.js";
import userAuth from "../middleware/userAuth.js";

const cartRouter = express.Router();

cartRouter.post("/get", userAuth, getUserCart);
cartRouter.post("/add", userAuth, addToCart);
cartRouter.post("/update", userAuth, updateToCart);

export default cartRouter;
