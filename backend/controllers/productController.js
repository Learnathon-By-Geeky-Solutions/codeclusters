import { json } from "express";
import asyncHandler from "express-async-handler";
import productModel from "../models/productModel.js";

// function for add product
const addProduct = asyncHandler(async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      subCategory,
      sizes,
      bestSeller,
    } = req.body;

    const image1 = req.files.image1 && req.files.image1[0];
    const image2 = req.files.image2 && req.files.image2[0];
    const image3 = req.files.image3 && req.files.image3[0];
    const image4 = req.files.image4 && req.files.image4[0];

    const images = [image1, image2, image3, image4].filter(
      (item) => item !== undefined
    );
    let imagesUrl = images.map((item) => {
      let result = item.path;
      return result;
    });

    const productData = {
      name,
      description,
      price: Number(price),
      image: imagesUrl,
      category,
      subCategory,
      size: JSON.parse(sizes),
      bestSeller: bestSeller === "true" ? true : false,
      date: Date.now(),
    };

    // console.log(productData);

    const product = new productModel(productData);
    await product.save();

    res.status(200).json({ success: "true", message: "Product added" });

    // console.log(imagesUrl);
  } catch (error) {
    console.log("Error in addProduct controller", error.message);
    res.status(500).json({
      error: "Internal server error",
    });
  }
});

// function for list product
// const listProduct = asyncHandler(async (req, res) => {
//   try {
//     const products = await productModel.find({});
//     res.status(200).json({
//       success: "true",
//       products,
//     });
//   } catch (error) {
//     console.log("Error in listProduct controller", error.message);
//     res.status(500).json({
//       error: "Internal server error",
//       message: "",
//     });
//   }
// });

// new api for pagenation
const listProduct = asyncHandler(async (req, res) => {
  try {
    const { page = 1, limit = 20, category, subCategory, sort } = req.query;
    const skip = (page - 1) * limit;
    let filter = {};

    // Apply category filter if selected
    if (category) {
      filter.category = { $in: category.split(",") };
    }

    // Apply subcategory filter if selected
    if (subCategory) {
      filter.subCategory = { $in: subCategory.split(",") };
    }

    let sortOption = {};
    if (sort === "lowHigh") sortOption.price = 1;
    if (sort === "highLow") sortOption.price = -1;

    const products = await productModel
      .find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(parseInt(limit));
    const totalProducts = await productModel.countDocuments(filter);
    console.log(totalProducts);

    res.status(200).json({
      success: true,
      products,
      totalProducts,
      totalPages: Math.ceil(totalProducts / limit),
      currentPage: parseInt(page),
    });
  } catch (error) {
    console.log("Error in listProduct controller", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

// function for remove product
const removeProduct = asyncHandler(async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.body.id);
    res.status(200).json({
      success: "true",
      message: "Product removed",
    });
  } catch (error) {
    console.log("Error in removeProduct controller", error.message);
    res.status(500).json({
      error: "Internal server error",
      error: "Internal server error",
    });
  }
});

// function for single product
const singleProduct = asyncHandler(async (req, res) => {
  try {
    const { productId } = req.body;
    const product = await productModel.findById(productId);
    res.status(200).json({
      success: "true",
      product,
    });
  } catch (error) {
    console.log("Error in singleProduct controller", error.message);
    res.status(500).json({
      error: "Internal server error",
    });
  }
});

//function for search product

const searchProducts = asyncHandler(async (req, res) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const skip = (page - 1) * limit;

    if (!search) {
      return res.json({ success: false, message: "Search query is empty" });
    }

    //search by product by name
    const filter = { name: { $regex: search, $options: "i" } };
    const totalProducts = await productModel.countDocuments(filter);
    const products = await productModel
      .find(filter)
      .skip(skip)
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      products,
      totalProducts,
      totalPages: Math.ceil(totalProducts / limit),
      currentPage: parseInt(page),
    });
  } catch (error) {
    console.log("Error in searchProducts controller", error.message);
    res.status(500).json({
      error: "Internal server error",
      message: "Internal server error",
    });
  }
});

export {
  addProduct,
  listProduct,
  removeProduct,
  singleProduct,
  searchProducts,
};
