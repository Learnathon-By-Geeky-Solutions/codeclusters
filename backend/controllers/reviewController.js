import asyncHandler from "express-async-handler";
import reviewModel from "../models/reviewModel.js";

// Get all reviews for a product
const getReviews = asyncHandler(async (req, res) => {
  try {
    const { productId } = req.body;
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

// Create a new review
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
      error: "Internal server error",
    });
  }
});

// Optional: Delete a review (if needed)
const deleteReviews = asyncHandler(async (req, res) => {
  try {
    const { productId, id } = req.body;
    const reviews = await Review.findByIdAndDelete(id);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }
    res.status(200).json({
      success: "true",
      reviews,
    });
  } catch (error) {
    console.log("Error in delete review controller", error.message);
    res.status(500).json({
      error: "Internal server error",
    });
  }
});
export { getReviews, addReviews, deleteReviews };
