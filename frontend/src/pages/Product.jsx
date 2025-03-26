/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { assets } from "../assets/assets";
import { ShopContext } from "../context/ShopContext";
import RelatedProducts from "../components/RelatedProducts";

const Product = () => {
  const { productId } = useParams();
  const { products, currency, addToCart, backendUrl, token, navigate } =
    useContext(ShopContext);
  const [productData, setProductData] = useState(false);
  const [image, setImage] = useState("");
  const [size, setSize] = useState("");
  const [activeTab, setActiveTab] = useState("description");
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({
    rating: 0,
    comment: "",
    username: "",
  });

  console.log("object ", token);
  const fetchProductData = async () => {
    const product = products.find((item) => item._id === productId);
    // console.log(product);
    if (product) {
      // console.log(product);
      setProductData(product);
      setImage(product.image[0]);
    }
  };
  // console.log("ProductData: ", productData);
  // console.log("ProductImage: ", image);

  const fetchReviews = async () => {
    // Simulated API call - replace with actual API endpoint
    try {
      const mockReviews = [
        {
          id: 1,
          username: "John Doe",
          rating: 4,
          comment: "Great product, really satisfied with the quality!",
          date: "2025-03-15",
        },
        {
          id: 2,
          username: "Jane Smith",
          rating: 5,
          comment: "Excellent value for money!",
          date: "2025-03-18",
        },
      ];
      setReviews(mockReviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };
  const handleClick = () => {
    addToCart(productData._id, size);
    if (!token) {
      navigate("/login");
    }
  };
  const handleReviewSubmit = (e) => {
    e.preventDefault();
    const review = {
      id: reviews.length + 1,
      ...newReview,
      date: new Date().toISOString().split("T")[0],
    };
    setReviews([...reviews, review]);
    setNewReview({ rating: 0, comment: "", username: "" });
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
  // Calculate average rating from reviews
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
            {productData.image.map((item, index) => (
              <img
                onClick={() => setImage(item)}
                src={`${backendUrl}/${item.replace(/\\/g, "/")}`}
                key={index}
                className="w-[24%] sm:w-full sm:mb-3 flex-shrink cursor-pointer"
              />
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
          <h1 className="font-medium text-2xl mt-2">{productData.name}</h1>
          <div className="flex items-center gap-1 mt-2">
            {renderStars(getAverageRating())}
            <p className="pl-2">({reviews.length})</p>
          </div>
          <p className="mt-5 text-3xl font-medium">
            {currency}
            {productData.price}
          </p>
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
                  key={index}
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
                  <div key={review.id} className="border-b pb-4">
                    <div className="flex justify-between">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{review.username}</p>
                        {renderStars(review.rating)}
                      </div>
                      <p className="text-sm text-gray-400">{review.date}</p>
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
                    placeholder="Your Name"
                    value={newReview.username}
                    onChange={(e) =>
                      setNewReview({ ...newReview, username: e.target.value })
                    }
                    className="border p-2 rounded"
                    required
                  />
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <img
                        key={star}
                        src={
                          star <= newReview.rating
                            ? assets.star_icon
                            : assets.star_dull_icon
                        }
                        onClick={() =>
                          setNewReview({ ...newReview, rating: star })
                        }
                        className="w-6 cursor-pointer"
                        alt=""
                      />
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
