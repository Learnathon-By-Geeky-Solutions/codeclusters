import orderModel from "../models/orderModels.js";
import userModel from "../models/userModel.js";
import mongoose from "mongoose";
import Stripe from "stripe";
import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();
// Configure email transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

//
const currency = "bdt";
const deliveryCharge = 100;

// gateway initialize
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

//placing order using cod

const placeOrder = async (req, res) => {
  try {
    const userId = req.userId;

    const { items, amount, address } = req.body;
    if (!mongoose.isValidObjectId(userId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid userId" });
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

    res.json({ success: true, message: "Order Placed" });
  } catch (error) {
    console.log("Error in placeOrder controller", error.message);
    res.json({ success: false, message: error.message });
  }
};

//placing order using Stripe

const placeOrderStripe = async (req, res) => {
  try {
    const userId = req.userId;

    const { items, amount, address } = req.body;
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
  const adminId = req.adminId;

  if (!mongoose.isValidObjectId(adminId)) {
    return res.status(400).json({ success: false, message: "Invalid userId" });
  }

  try {
    const { page = 1, limit = 20 } = req.query;
    const totalOrders = await orderModel.countDocuments();
    const totalPages = Math.ceil(totalOrders / limit);
    // Reverse the page logic: page 1 starts from the end
    const effectivePage = totalPages - parseInt(page) + 1;
    const skip = Math.max((effectivePage - 1) * limit, 0);
    const orders = await orderModel.find({}).skip(skip).limit(parseInt(limit));

    res.json({
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

//User order data
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

//update order status
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

      //------
      res.json({ success: true, message: "Status Updated" });
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
};
