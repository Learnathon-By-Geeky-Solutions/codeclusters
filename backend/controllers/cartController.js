import user from "../models/userModel.js";

// add products to cart
const addToCart = async (req, res) => {
  try {
    const { userId, itemId, size } = req.body;
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

//update products to cart
const updateToCart = async (req, res) => {
  try {
    const { userId, itemId, size, quantity } = req.body;
    const userData = await user.findById(userId);
    let cartData = await userData.cartData;
    cartData[itemId][size] = quantity;
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
    const { userId } = req.body;
    const userData = await user.findById(userId);
    let cartData = await userData.cartData;
    res.json({ success: true, cartData });
  } catch (error) {
    console.log("Error in get CartController", error);
    res.json({ success: false, message: error.message });
  }
};

export { addToCart, updateToCart, getUserCart };
