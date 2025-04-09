/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { assets } from "../assets/assets";
import { ShopContext } from "../context/ShopContext";
import { UserContext } from "../context/UserContext";
import RelatedProducts from "../components/RelatedProducts";
import axios from "axios";
import { toast } from "react-toastify";

const Product = () => {
  const { productId } = useParams();
  const { products, currency, addToCart, backendUrl, token, navigate } =
    useContext(ShopContext);
  const { user } = useContext(UserContext);

  const [productData, setProductData] = useState(false);
  const [image, setImage] = useState("");
  const [size, setSize] = useState("");
  const [activeTab, setActiveTab] = useState("description");
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({
    rating: 0,
    comment: "",
    email: user?.email || "",
  });
  const offPrice = productData
    ? ((productData.price - productData.sellingPrice) * 100) / productData.price
    : 0;
  const fetchProductData = async () => {
    const product = products.find((item) => item._id === productId);
    if (product) {
      setProductData(product);
      setImage(product.image[0]);
    }
  };

  const fetchReviews = async () => {
    try {
      const res = await axios.get(
        `${backendUrl}/api/review/allReview?productId=${productId}`
      );
      setReviews(res.data.reviews || []);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  const handleClick = () => {
    addToCart(productData._id, size);
    toast.success("Product Added!");
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    // Prepare review data for the API
    if (newReview.comment.length < 10) {
      return toast.error("Comment must be greater than 10 Character");
    }
    if (newReview.rating < 1) {
      return toast.error("You must have provide a rating");
    }

    const reviewData = {
      productId,
      rating: newReview.rating,
      comment: newReview.comment,
      email: user?.email || newReview.email, // Use user's email if available
    };
    console.log(reviewData);
    try {
      const res = await axios.post(
        `${backendUrl}/api/review/addReview`,
        reviewData,
        {
          headers: { token }, // Include token if your API requires authentication
        }
      );

      if (res.data.success) {
        // Add the new review to the state (assuming the API returns the created review)
        const createdReview = {
          ...reviewData,
          _id: res.data.savedReview._id, // Use the ID from the backend response
          date: new Date().toLocaleString(), // Add date locally if not returned
        };
        setReviews([...reviews, createdReview]);
        setNewReview({ rating: 0, comment: "", email: user?.email || "" });
        toast.success("Review submitted successfully!"); // Optional feedback
      } else {
        toast.error(res.data.message || "Failed to submit review");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Error submitting review");
    }
  };

  useEffect(() => {
    fetchProductData();
    fetchReviews();
  }, [productId, products]);

  const renderStars = (rating) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <img
            key={star}
            src={star <= rating ? assets.star_icon : assets.star_dull_icon}
            alt=""
            className="w-3.5"
          />
        ))}
      </div>
    );
  };

  const getAverageRating = () => {
    if (reviews.length === 0) return 0;
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return Math.round(total / reviews.length);
  };

  return productData ? (
    <div className="border-t2 pt-10 transition-opacity ease-in duration-500 opacity-100">
      {/* Product data */}
      <div className="flex gap-12 sm:gap-12 flex-col sm:flex-row">
        {/* Product images */}
        <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">
          <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.5%] w-full">
            {productData.image.map((item) => (
              <button
                onClick={() => setImage(item)}
                type="button"
                key={item}
                className="p-0 bg-transparent border-0"
              >
                <img
                  alt="productPhoto"
                  src={`${backendUrl}/${item.replace(/\\/g, "/")}`}
                  className="w-[24%] sm:w-full sm:mb-3 flex-shrink cursor-pointer"
                />
              </button>
            ))}
          </div>
          <div className="w-full sm:w-[80%]">
            <img
              className="w-full h-auto"
              src={`${backendUrl}/${image.replace(/\\/g, "/")}`}
              alt=""
            />
          </div>
        </div>

        {/* Product Info */}
        <div className="flex-1">
          <h1 className="flex flex-row gap-1 items-center font-medium text-2xl mt-2">
            {productData.name}
            {productData.bestSeller === true ? (
              <img className="h-6 w-6" src={assets.best_seller} alt="" />
            ) : null}
          </h1>
          <div className="flex items-center gap-1 mt-2">
            {renderStars(getAverageRating())}
            <p className="pl-2">({reviews.length})</p>
          </div>

          <div className="mt-5 text-3xl font-medium">
            {currency}
            {productData.sellingPrice &&
            productData.sellingPrice !== productData.price
              ? productData.sellingPrice
              : productData.price}
            <p
              className={`text-xl flex flex-col font-medium text-red-500 ${
                productData.sellingPrice &&
                productData.sellingPrice !== productData.price
                  ? ""
                  : "hidden"
              }`}
            >
              <del>
                {" "}
                {currency}
                {productData.price}
              </del>
              <span className=" mt-5 text-sm text-green-700">
                {Math.ceil(offPrice)}% Off!! Save {currency}
                {productData.price - productData.sellingPrice}
                {" !"}
              </span>
            </p>
          </div>
          <p className="mt-5 text-gray-500 md:w-4/5">
            {productData.description}
          </p>
          <div className="flex flex-col gap-4 my-8">
            <p>Select Size</p>
            <div className="flex gap-2">
              {productData.size.map((item, index) => (
                <button
                  onClick={() => setSize(item)}
                  className={`border py-2 px-4 bg-gray-100 ${
                    item === size ? "border-orange-500" : ""
                  }`}
                  key={item}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
          <div className="relative group inline-block">
            <button
              disabled={!size}
              onClick={handleClick}
              className={`text-white text-sm my-8 px-8 py-3 
    ${
      size.length === 0
        ? "bg-gray-400 cursor-not-allowed "
        : "bg-black hover:bg-gray-700"
    }`}
            >
              ADD TO CART
              {!size && (
                <span className="absolute w-full left-1/2 transform -translate-x-1/2 -top-1 bg-black text-white text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
                  Select size
                </span>
              )}
            </button>
          </div>
          <hr className="mt-8 sm:w-4/5" />
          <div className="text-sm text-gray-500 mt-5 flex flex-col gap-1">
            <p>100% Original Product</p>
            <p>Cash on delivery is available</p>
            <p>Easy return and exchange policy within 7 days</p>
          </div>
        </div>
      </div>

      {/* Description and Review section */}
      <div className="mt-20">
        <div className="flex">
          <button
            onClick={() => setActiveTab("description")}
            className={`border px-5 py-3 text-sm ${
              activeTab === "description" ? "font-bold bg-gray-100" : ""
            }`}
          >
            Description
          </button>
          <button
            onClick={() => setActiveTab("reviews")}
            className={`border px-5 py-3 text-sm ${
              activeTab === "reviews" ? "font-bold bg-gray-100" : ""
            }`}
          >
            Reviews ({reviews.length})
          </button>
        </div>

        <div className="border p-6">
          {activeTab === "description" ? (
            <div className="flex flex-col gap-4 text-sm text-gray-500">
              <p>{productData.description}</p>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {/* Reviews List */}
              <div className="flex flex-col gap-4">
                {reviews.map((review) => (
                  <div key={review._id} className="border-b pb-4">
                    <div className="flex justify-between">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{review.email}</p>
                        {renderStars(review.rating)}
                      </div>
                      <p className="text-sm text-gray-400">
                        {review.date
                          ? review.date
                          : new Date(review.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <p className="text-gray-500 mt-2">{review.comment}</p>
                  </div>
                ))}
              </div>

              {/* Add Review Form */}
              <div className="mt-6">
                <h3 className="font-medium mb-4">Add Your Review</h3>
                <form
                  onSubmit={handleReviewSubmit}
                  className="flex flex-col gap-4"
                >
                  <input
                    type="text"
                    placeholder="Your Email"
                    value={user?.email || newReview.email}
                    onChange={(e) =>
                      setNewReview({ ...newReview, email: e.target.value })
                    }
                    className="border p-2 rounded"
                    required
                    disabled={!!user?.email} // Disable if user email is available
                  />
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        className="p-0 bg-transparent border-0"
                        key={star}
                        onClick={() =>
                          setNewReview({ ...newReview, rating: star })
                        }
                      >
                        <img
                          src={
                            star <= newReview.rating
                              ? assets.star_icon
                              : assets.star_dull_icon
                          }
                          className="w-6 cursor-pointer"
                          alt=""
                        />
                      </button>
                    ))}
                  </div>
                  <textarea
                    placeholder="Write your review..."
                    value={newReview.comment}
                    onChange={(e) =>
                      setNewReview({ ...newReview, comment: e.target.value })
                    }
                    className="border p-2 rounded h-24"
                    required
                  />
                  <button
                    type="submit"
                    onClick={() => (token ? null : navigate("/login"))}
                    className="bg-black text-white px-6 py-2 w-fit rounded hover:bg-gray-800"
                  >
                    Submit Review
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>

      <RelatedProducts
        category={productData.category}
        subCategory={productData.subCategory}
      />
    </div>
  ) : (
    <div className="opacity-0"></div>
  );
};

export default Product;
