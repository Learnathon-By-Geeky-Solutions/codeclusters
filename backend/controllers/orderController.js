import orderModel from "../models/orderModels.js";
import userModel from "../models/userModel.js";
import mongoose from "mongoose";
import Stripe from "stripe";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import {
  isValidUserId,
  isValidItems,
  isValidAddress,
  isValidAmount,
} from "../utils/validateOrder.js";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  secure: true,
  tls: {
    rejectUnauthorized: true,
  },
});

const currency = "bdt";
const deliveryCharge = 100;

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const placeOrder = async (req, res) => {
  try {
    const userId = req.userId;

    const { items, amount, address } = req.body;
    if (!isValidUserId(userId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid userId" });
    }
    if (!isValidItems(items)) {
      return res.status(400).json({ success: false, message: "Invalid items" });
    }
    if (!isValidAmount(amount)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid amount" });
    }
    if (!isValidAddress(address)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or incomplete address" });
    }

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

    res.status(200).json({ success: true, message: "Order Placed" });
  } catch (error) {
    console.log("Error in placeOrder controller", error.message);
    res.json({ success: false, message: error.message });
  }
};

const placeOrderStripe = async (req, res) => {
  try {
    const userId = req.userId;

    const { items, amount, address } = req.body;
    const { origin } = req.headers;

    if (!isValidUserId(userId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid userId" });
    }
    if (!isValidItems(items)) {
      return res.status(400).json({ success: false, message: "Invalid items" });
    }
    if (!isValidAmount(amount)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid amount" });
    }
    if (!isValidAddress(address)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or incomplete address" });
    }
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

    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    const line_items = items.map((item) => ({
      price_data: {
        currency: currency,
        product_data: {
          name: item.name,
        },
        unit_amount: item.sellingPrice * 100,
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

    res.status(200).json({ success: true, session_url: session.url });
  } catch (error) {
    console.log("Error in stripe controller", error.message);
    res.json({ success: false, message: error.message });
  }
};
const makePaymentStripe = async (req, res) => {
  const userId = req.userId;
  const { item, amount, orderId } = req.body;
  const { origin } = req.headers;
  if (!item || typeof item !== "object") {
    return res.status(400).json({
      success: false,
      message: "Invalid item: Item must be an object",
    });
  }
  if (!isValidUserId(userId)) {
    return res.status(400).json({ success: false, message: "Invalid userId" });
  }

  if (!isValidAmount(amount)) {
    return res.status(400).json({ success: false, message: "Invalid amount" });
  }
  if (!mongoose.isValidObjectId(orderId)) {
    return res.status(400).json({ success: false, message: "Invalid orderId" });
  }
  try {
    const line_items = [
      {
        price_data: {
          currency: currency,
          product_data: {
            name: item.name,
          },
          unit_amount: item.sellingPrice * 100,
        },
        quantity: item.quantity,
      },
    ];
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
      success_url: `${origin}/verifyPayment?success=true&orderId=${orderId}`,
      cancel_url: `${origin}/verifyPayment?success=false&orderId=${orderId}`,
      line_items,
      mode: "payment",
    });
    res.status(200).json({ success: true, session_url: session.url });
  } catch (error) {
    console.log("Error in MakePaymentStripe controller", error.message);
    res.json({ success: false, message: error.message });
  }
};
const verifyStripe = async (req, res) => {
  const userId = req.userId;

  const { orderId, success } = req.body;

  if (!mongoose.isValidObjectId(userId)) {
    return res.status(400).json({ success: false, message: "Invalid userId" });
  }
  if (!mongoose.isValidObjectId(orderId)) {
    return res.status(400).json({ success: false, message: "Invalid orderId" });
  }
  try {
    if (success === "true") {
      await orderModel.findOneAndUpdate(
        { _id: { $eq: orderId } },
        { payment: true }
      );

      await userModel.findByIdAndUpdate(userId, { cartData: {} });

      res.status(200).json({ success: true });
    } else {
      orderModel.findOneAndDelete({ _id: { $eq: orderId } });
      res.status(200).json({ success: false });
    }
  } catch (error) {
    console.log("Error in verifyStripe controller", error.message);
    res.json({ success: false, message: error.message });
  }
};

const allOrders = async (req, res) => {
  const adminId = req.adminId;

  if (!mongoose.isValidObjectId(adminId)) {
    return res.status(400).json({ success: false, message: "Invalid userId" });
  }

  try {
    const {
      page = 1,
      limit = 20,
      status,
      paymentMethod,
      paymentStatus,
    } = req.query;
    const skip = (page - 1) * limit;
    let filter = {};
    if (status) {
      filter.status = { $in: status.split(",") };
    }
    if (paymentMethod) {
      filter.paymentMethod = { $in: paymentMethod.split(",") };
    }
    if (paymentStatus) {
      const paymentMap = {
        Done: true,
        Pending: false,
      };

      const booleanPayments = paymentStatus
        .split(",")
        .map((p) => paymentMap[p]);
      filter.payment = { $in: booleanPayments };
    }

    const orders = await orderModel
      .find(filter)
      .skip(skip)
      .sort({ _id: -1 })
      .limit(parseInt(limit));

    const totalOrders = await orderModel.countDocuments(filter);
    console.log(totalOrders);
    const totalPages = Math.ceil(totalOrders / limit);
    res.status(200).json({
      success: true,
      orders,
      totalOrders,
      totalPages,
      currentPage: parseInt(page),
    });
  } catch (error) {
    console.log("Error in allOrders controller", error.message);
    res.json({ success: false, message: error.message });
  }
};

const userOrders = async (req, res) => {
  try {
    const userId = req.userId;

    if (!mongoose.isValidObjectId(userId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid userId" });
    }
    const orders = await orderModel.find({ userId });

    res.json({ success: true, orders });
  } catch (error) {
    console.log("Error in userOrders controller", error.message);
    res.json({ success: false, message: error.message });
  }
};
const cancelOrder = async (req, res) => {
  const userId = req.userId;
  const { orderId } = req.body;

  if (!isValidUserId(userId)) {
    return res.status(400).json({ success: false, message: "Invalid userId" });
  }

  if (!mongoose.isValidObjectId(orderId)) {
    return res.status(400).json({ success: false, message: "Invalid orderId" });
  }

  try {
    const order = await orderModel.findById(orderId);

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    if (order.userId.toString() !== userId) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    if (
      order.status === "shipped" ||
      order.status === "Out for delivery" ||
      order.status === "delivered"
    ) {
      return res.status(400).json({
        success: false,
        message: "Cannot cancel order that is already shipped or delivered",
      });
    }

    if (order.cancelled) {
      return res
        .status(400)
        .json({ success: false, message: "Order is already cancelled" });
    }

    order.cancelled = true;
    await order.save();

    return res
      .status(200)
      .json({ success: true, message: "Order Cancellation is in process" });
  } catch (error) {
    console.error("Error in cancelOrder controller", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong" });
  }
};

const updateStatus = async (req, res) => {
  const adminId = req.adminId;

  if (!mongoose.isValidObjectId(adminId)) {
    return res.status(400).json({ success: false, message: "Invalid userId" });
  }

  try {
    const { orderId, status } = req.body;
    const allowedStatuses = [
      "Order placed",
      "Packing",
      "Shipped",
      "Out for delivery",
      "Delivered",
      "Cancelled",
    ];
    if (typeof orderId !== "string") {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Order ID" });
    }
    if (typeof status !== "string" || !allowedStatuses.includes(status)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid status value" });
    }
    const order = await orderModel.findByIdAndUpdate(orderId, { status });

    if (order) {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: order.address.email,
        subject: "Update about your order 📦",
        html: `
  <!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background-color: #f5f5f5;
    }
    .container {
      background-color: #ffffff;
      max-width: 600px;
      margin: 30px auto;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }
    .header {
      background-color: #4CAF50;
      color: white;
      padding: 30px 20px;
      text-align: center;
    }
    .header h1 {
      margin: 0 0 10px 0;
    }
    .content {
      padding: 20px 30px;
      color: #333;
    }
    .content p {
      margin-bottom: 10px;
    }
    .order-details {
      background-color: #f1f1f1;
      padding: 15px;
      border-radius: 6px;
      margin-top: 15px;
      line-height: 1.6;
      
    }
    .order-details span {
      font-weight: bold;
    }
    .status {
      font-size: 18px;
      color: #4CAF50;
      margin-top: 10px;
    }
    .footer {
      padding: 20px;
      text-align: center;
      font-size: 12px;
      color: #777;
      background-color: #f9f9f9;
      border-top: 1px solid #eee;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Order Tracking Update</h1>
      <p>Here’s the latest on your order!</p>
    </div>
    <div class="content">
      <p>Hello <strong>${order.address.email}</strong>,</p>
      <p>We’ve got an update on your order ID <strong>#${
        order._id
      }</strong>. Check the progress below:</p>
<table class="order-details" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f1f1f1; padding: 15px; border-radius: 6px; margin-top: 15px; line-height: 1.6;">
  <tr>
    <td><strong>Product:</strong></td>
    <td>${order.items[0].name}</td>
  </tr>
  <tr>
    <td><strong>Size:</strong></td>
    <td>${order.items[0].size}</td>
  </tr>
  <tr>
    <td><strong>Quantity:</strong></td>
    <td>${order.items[0].quantity}</td>
  </tr>
  <tr>
    <td><strong>Price:</strong></td>
    <td>৳${order.amount}</td>
  </tr>
  <tr>
    <td><strong>Oder Date:</strong></td>
    <td>${new Date(order.date).toLocaleDateString()}</td>
  </tr>
   <tr>
    <td><strong>Order Status:</strong></td>
    <td><h4 style="color:green">${status}</h4></td>
  </tr>
</table>

    </div>
    <div class="footer">
      <p>Need help? Contact our support team anytime.</p>
      <p>© ${new Date().getFullYear()} All rights reserved.</p>
    </div>
  </div>
</body>
</html>
  `,
      };

      await transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log("Error: ", error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });

      res.status(200).json({ success: true, message: "Status Updated" });
    }
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
  makePaymentStripe,
  cancelOrder,
};
