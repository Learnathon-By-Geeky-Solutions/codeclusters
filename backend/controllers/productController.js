import { json } from "express";
import asyncHandler from "express-async-handler";
import productModal from "../models/productModal.js";

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

    console.log(productData);

    const product = new productModal(productData);
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
const listProduct = asyncHandler(async (req, res) => {
  try {
    const products = await productModal.find({});
    res.status(200).json({
      success: "true",
      products,
    });
  } catch (error) {
    console.log("Error in listProduct controller", error.message);
    res.status(500).json({
      error: "Internal server error",
      message: "",
    });
  }
});

// function for remove product
const removeProduct = asyncHandler(async (req, res) => {
  try {
    await productModal.findByIdAndDelete(req.body.id);
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
    const product = await productModal.findById(productId);
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

export { addProduct, listProduct, removeProduct, singleProduct };
