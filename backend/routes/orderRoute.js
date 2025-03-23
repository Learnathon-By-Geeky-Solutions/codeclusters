import express from "express";
import {
  allOrders,
  placeOrder,
  updateStatus,
  userOrders,
} from "../controllers/orderController.js";
import adminAuth from "../middleware/adminAuth.js";
import userAuth from "../middleware/userAuth.js";

const orderRouter = express.Router();

//admin features
orderRouter.post("list", adminAuth, allOrders);
orderRouter.post("status", adminAuth, updateStatus);

//payment features
orderRouter.post("/place", userAuth, placeOrder);

//user feature
orderRouter.post("/userorders", userAuth, userOrders);

export default orderRouter;
