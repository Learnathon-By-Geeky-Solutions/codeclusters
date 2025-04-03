import orderModel from "../models/orderModels.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();

//
const currency = "bdt";
const deliveryCharge = 100;

// gateway initialize
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

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
    console.log("Error in placeOrder controller", error.message);
    res.json({ success: false, message: error.message });
  }
};

//placing order using Stripe

const placeOrderStripe = async (req, res) => {
  try {
    const { userId, items, amount, address } = req.body;
    const { origin } = req.headers;
    const orderData = {
      userId,
      items,
      address,
      amount,
      paymentMethod: "Stripe",
      payment: false,
      date: Date.now(),
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    const line_items = items.map((item) => ({
      price_data: {
        currency: currency,
        product_data: {
          name: item.name,
        },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    }));
    line_items.push({
      price_data: {
        currency: currency,
        product_data: {
          name: "Delivery charges",
        },
        unit_amount: deliveryCharge * 100,
      },
      quantity: 1,
    });

    const session = await stripe.checkout.sessions.create({
      success_url: `${origin}/verifyPayment?success=true&orderId=${newOrder._id}`,
      cancel_url: `${origin}/verifyPayment?success=false&orderId=${newOrder._id}`,
      line_items,
      mode: "payment",
    });

    res.json({ success: true, session_url: session.url });
  } catch (error) {
    console.log("Error in stripe controller", error.message);
    res.json({ success: false, message: error.message });
  }
};

// verify Stripe
const verifyStripe = async (req, res) => {
  const { userId, orderId, success } = req.body;
  try {
    if (success === "true") {
      await orderModel.findByIdAndUpdate(orderId, { payment: true });
      await userModel.findByIdAndUpdate(userId, { cartData: {} });

      res.json({ success: true });
    } else {
      await orderModel.findByIdAndDelete(orderId);
      res.json({ success: false });
    }
  } catch (error) {
    console.log("Error in verifyStripe controller", error.message);
    res.json({ success: false, message: error.message });
  }
};

//placing order using ssl

const placeOrderSsl = async (req, res) => {};

//All order data for admin
const allOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});

    res.json({ success: true, orders });
  } catch (error) {
    console.log("Error in allOrders controller", error.message);
    res.json({ success: false, message: error.message });
  }
};

//User order data
const userOrders = async (req, res) => {
  try {
    const { userId } = req.body;

    const orders = await orderModel.find({ userId });

    res.json({ success: true, orders });
  } catch (error) {
    console.log("Error in userOrders controller", error.message);
    res.json({ success: false, message: error.message });
  }
};

//update order status
const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    await orderModel.findByIdAndUpdate(orderId, { status });
    res.json({ success: true, message: "Status Updated" });
  } catch (error) {
    console.log("Error in updateStatus controller", error.message);
    res.json({ success: false, message: error.message });
  }
};

export {
  placeOrder,
  allOrders,
  userOrders,
  updateStatus,
  placeOrderStripe,
  verifyStripe,
};
