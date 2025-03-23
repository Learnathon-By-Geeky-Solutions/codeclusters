import orderModel from "../models/orderModels.js";
import userModel from "../models/userModel.js";

//placing order using cod

const placeOrder = async (req, res) => {
  try {
    const { userId, items, amount, address } = req.body;

    const orderData = {
      userId,
      items,
      address,
      amount,
      paymentMethod: "COD",
      payment: false,
      date: Date.now(),
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    res.json({ success: true, message: "Order Placed" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//placing order using BKash

const placeOrderBkash = async (req, res) => {};

//All order data for admin
const allOrders = async (req, res) => {};

//User order data
const userOrders = async (req, res) => {};

//update order status
const updateStatus = async (req, res) => {};

export { placeOrder, allOrders, userOrders, updateStatus };
