import express from "express";
import { addReviews, getReviews } from "../controllers/reviewController.js";
import userAuth from "../middleware/userAuth.js";
const reviewRouter = express.Router();

reviewRouter.get("/allReview", getReviews);
reviewRouter.post("/addReview", userAuth, addReviews);

export default reviewRouter;
