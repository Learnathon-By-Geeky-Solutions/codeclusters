import asyncHandler from "express-async-handler";
import reviewModel from "../models/reviewModel.js";

const getReviews = asyncHandler(async (req, res) => {
  try {
    const { productId } = req.query;
    const reviews = await reviewModel.find({ productId: productId });
    res.status(200).json({
      success: "true",
      reviews,
    });
  } catch (error) {
    console.log("Error in review controller", error.message);
    res.status(500).json({
      error: "Internal server error",
    });
  }
});

const addReviews = asyncHandler(async (req, res) => {
  try {
    const { productId, email, rating, comment } = req.body;
    const review = new reviewModel({
      productId,
      email,
      rating,
      comment,
    });
    const savedReview = await review.save();
    res.status(200).json({
      success: "true",
      savedReview,
    });
  } catch (error) {
    console.log("Error in add review controller", error.message);
    res.status(500).json({
      message: error.message,
    });
  }
});

export { getReviews, addReviews };
