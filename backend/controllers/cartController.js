import user from "../models/userModel.js";
import mongoose from "mongoose";
// add products to cart
const addToCart = async (req, res) => {
  try {
    const userId = req.userId;
    const { itemId, size } = req.body;
    if (!mongoose.isValidObjectId(userId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid userId" });
    }

    const userData = await user.findById(userId);
    let cartData = await userData.cartData;
    if (cartData[itemId]) {
      if (cartData[itemId][size]) {
        cartData[itemId][size] += 1;
      } else {
        cartData[itemId][size] = 1;
      }
    } else {
      cartData[itemId] = {};
      cartData[itemId][size] = 1;
    }

    await user.findByIdAndUpdate(userId, { cartData });

    res.json({ success: true, message: "Added to cart" });
  } catch (error) {
    console.log("Error in add CartController", error);
    res.json({ success: false, message: error.message });
  }
};

const updateToCart = async (req, res) => {
  try {
    const userId = req.userId;
    const { itemId, size, quantity } = req.body;

    if (!mongoose.isValidObjectId(userId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid userId" });
    }

    const userData = await user.findById(userId);
    let cartData = userData.cartData || {};

    // Check if the item already exists in the cart
    if (!cartData[itemId]) {
      cartData[itemId] = {};
    }

    // Check if the size exists for the item in the cart
    if (!cartData[itemId][size]) {
      cartData[itemId][size] = 0;
    }

    // Update the quantity
    cartData[itemId][size] = quantity;

    // Save the updated cart data
    await user.findByIdAndUpdate(userId, { cartData });

    res.json({ success: true, message: "Cart updated" });
  } catch (error) {
    console.log("Error in update CartController", error);
    res.json({ success: false, message: error.message });
  }
};
// get cart data
const getUserCart = async (req, res) => {
  try {
    const userId = req.userId;
    if (!mongoose.isValidObjectId(userId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid userId" });
    }
    const userData = await user.findById(userId);
    let cartData = (await userData.cartData) || {};
    let name = userData.name;
    res.json({ success: true, cartData, name });
  } catch (error) {
    console.log("Error in get CartController", error);
    res.json({ success: false, message: error.message });
  }
};

export { addToCart, updateToCart, getUserCart };
