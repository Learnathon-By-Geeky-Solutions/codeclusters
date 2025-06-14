import express from "express";
import RateLimit from "express-rate-limit";
import {
  allOrders,
  placeOrder,
  placeOrderStripe,
  updateStatus,
  userOrders,
  verifyStripe,
  makePaymentStripe,
  cancelOrder,
} from "../controllers/orderController.js";
import adminAuth from "../middleware/adminAuth.js";
import userAuth from "../middleware/userAuth.js";

const orderRouter = express.Router();

const limiter = RateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

orderRouter.post("/list", adminAuth, limiter, allOrders);
orderRouter.post("/status", adminAuth, limiter, updateStatus);

orderRouter.post("/place", userAuth, limiter, placeOrder);
orderRouter.post("/cancelOrder", userAuth, limiter, cancelOrder);
orderRouter.post("/stripe", userAuth, limiter, placeOrderStripe);
orderRouter.post("/makePaymentStripe", userAuth, makePaymentStripe);

//user feature
orderRouter.post("/userorders", userAuth, limiter, userOrders);

orderRouter.post("/verifyStripe", userAuth, limiter, verifyStripe);

export default orderRouter;
