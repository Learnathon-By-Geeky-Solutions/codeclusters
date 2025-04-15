import asyncHandler from "express-async-handler";
import productModel from "../models/productModel.js";
import mongoose from "mongoose";

const addProduct = asyncHandler(async (req, res) => {
  const adminId = req.adminId;

  if (!mongoose.isValidObjectId(adminId)) {
    return res.status(400).json({ success: false, message: "Invalid userId" });
  }

  try {
    const {
      name,
      description,
      price,
      sellingPrice,
      category,
      subCategory,
      sizes,
      bestSeller,
    } = req.body;

    const image1 = req.files.image1?.[0];
    const image2 = req.files.image2?.[0];
    const image3 = req.files.image3?.[0];
    const image4 = req.files.image4?.[0];

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
      sellingPrice: Number(sellingPrice),
      image: imagesUrl,
      category,
      subCategory,
      size: JSON.parse(sizes),
      bestSeller: bestSeller,
      date: Date.now(),
    };

    const product = new productModel(productData);
    await product.save();

    res.status(200).json({ success: "true", message: "Product added" });
  } catch (error) {
    console.log("Error in addProduct controller", error.message);
    res.status(500).json({
      error: "Internal server error",
    });
  }
});

const updateProduct = asyncHandler(async (req, res) => {
  const adminId = req.adminId;

  if (!mongoose.isValidObjectId(adminId)) {
    return res.status(400).json({ success: false, message: "Invalid userId" });
  }

  try {
    const {
      productId,
      name,
      description,
      price,
      sellingPrice,
      category,
      subCategory,
      sizes,
      bestSeller,
    } = req.body;

    const productData = {
      name,
      description,
      price: Number(price),
      sellingPrice: Number(sellingPrice),
      category,
      subCategory,
      size: JSON.parse(sizes),
      bestSeller: bestSeller,
      date: Date.now(),
    };

    const updateProduct = await productModel.findByIdAndUpdate(
      productId,
      productData,
      {
        new: true,
      }
    );
    if (updateProduct) {
      res.status(200).json({ success: "true", message: "Product updated" });
    } else
      res
        .status(200)
        .json({ success: "false", message: "Product not updated" });
  } catch (error) {
    console.log("Error in updateProduct controller", error.message);
    res.status(500).json({
      error: "Internal server error",
    });
  }
});

const listProduct = asyncHandler(async (req, res) => {
  try {
    const { page = 1, limit = 20, category, subCategory, sort } = req.query;
    const skip = (page - 1) * limit;
    let filter = {};

    if (category) {
      filter.category = { $in: category.split(",") };
    }

    if (subCategory) {
      filter.subCategory = { $in: subCategory.split(",") };
    }

    let sortOption = {};
    if (sort === "lowHigh") sortOption.sellingPrice = 1;
    if (sort === "highLow") sortOption.sellingPrice = -1;

    const products = await productModel
      .find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(parseInt(limit));
    const totalProducts = await productModel.countDocuments(filter);

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

const removeProduct = asyncHandler(async (req, res) => {
  const adminId = req.adminId;

  if (!mongoose.isValidObjectId(adminId)) {
    return res.status(400).json({ success: false, message: "Invalid userId" });
  }

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
    });
  }
});

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

const searchProducts = asyncHandler(async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      search,
      category,
      subCategory,
      sort,
    } = req.query;
    const skip = (page - 1) * limit;

    const filter = { name: { $regex: search, $options: "i" } };

    if (!search) {
      return res.json({ success: false, message: "Search query is empty" });
    }

    if (category) {
      filter.category = { $in: category.split(",") };
    }

    if (subCategory) {
      filter.subCategory = { $in: subCategory.split(",") };
    }

    let sortOption = {};
    if (sort === "lowHigh") sortOption.price = 1;
    if (sort === "highLow") sortOption.price = -1;

    const totalProducts = await productModel.countDocuments(filter);
    const products = await productModel
      .find(filter)
      .sort(sortOption)
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
  updateProduct,
};
