import asyncHandler from "express-async-handler";
import validator from "validator";
import bcrypt from "bcrypt";
import user from "../models/userModel.js";
import generateToken from "../utils/generateJWT.js";
import admin from "../models/adminModel.js";
import mongoose from "mongoose";
//route for login
const login = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;

    const User = await user.findOne({ email });
    if (User) {
      const isPasswordCorrect = await bcrypt.compare(password, User.password);
      if (isPasswordCorrect) {
        res.status(201).json({
          success: true,
          _id: User._id,
          name: User.name,
          email: User.email,
          token: generateToken(User._id),
        });
      } else {
        res.status(200).json({
          error: "Password Incorrect",
          message: "Password Incorrect",
        });
      }
    } else {
      return res.json({ success: false, message: "User doesn't Exist" });
    }
  } catch (error) {
    console.log("Error in login controller", error.message);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
});

//route for register
const register = asyncHandler(async (req, res) => {
  try {
    const { name, email, password } = req.body;

    //checking user exist or not

    const check = await user.findOne({ email });
    if (check) {
      return res.json({ success: false, message: "User already Exist" });
    }

    //validating email & password
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Email is not valid" });
    }
    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Password should be more than 8 character",
      });
    }

    //hashing password

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new user({
      name,
      email,
      password: hashedPassword,
    });
    if (newUser) {
      await newUser.save();
      res.status(201).json({
        success: true,
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        token: generateToken(newUser._id),
      });
    } else {
      res.status(400).json({
        error: "Invalid user data",
      });
    }
  } catch (error) {
    console.log("Error in register controller", error.message);
    res.status(500).json({
      error: "Internal server error",
    });
  }
});

//route for adminLogin
const adminLogin = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;

    const Admin = await admin.findOne({ email });
    if (Admin) {
      const isPasswordCorrect = await bcrypt.compare(password, Admin.password);
      if (isPasswordCorrect) {
        const token = generateToken(Admin._id);
        res.status(201).json({
          success: true,
          token,
        });
      } else {
        res.status(200).json({
          error: "Password Incorrect",
          message: "Password Incorrect",
        });
      }
    } else {
      return res.json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.log("Error in adminLogin controller", error.message);
    res.status(500).json({
      error: "Internal server error",
    });
  }
});

//route for createDefaultAdmin
const createDefaultAdmin = asyncHandler(async () => {
  const salt = await bcrypt.genSalt(10);
  const existingAdmin = await admin.findOne({ email: process.env.ADMIN_EMAIL });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, salt);

    await admin.create({
      email: process.env.ADMIN_EMAIL,
      password: hashedPassword,
    });

    console.log("Default admin created");
  } else {
    console.log("Admin already exists");
  }
});

//route for changeAdminPassword
const changeAdminPassword = asyncHandler(async (req, res) => {
  const adminId = req.adminId;
  console.log(adminId);
  if (!mongoose.isValidObjectId(adminId)) {
    return res.status(400).json({ success: false, message: "Invalid userId" });
  }
  const { currentPassword, newPassword } = req.body;
  try {
    const Admin = await admin.findById(adminId); // Authenticated admin

    const isMatch = await bcrypt.compare(currentPassword, Admin.password);
    if (!isMatch)
      return res.json({
        success: false,
        message: "Incorrect current password",
      });

    const salt = await bcrypt.genSalt(10);
    Admin.password = await bcrypt.hash(newPassword, salt);
    await Admin.save();

    res.json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    console.log("Error in changeAdminPassword controller", error.message);
    res.status(500).json({
      error: "Internal server error",
    });
  }
});

const userInfo = asyncHandler(async (req, res) => {
  const userId = req.userId;

  try {
    const userData = await user.findById(userId).select("-password"); // omit password
    if (!userData) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      userProfile: {
        name: userData.name,
        email: userData.email,
      },
    });
  } catch (error) {
    console.log("Error in userInfo controller", error.message);
    res.status(500).json({
      error: "Internal server error",
    });
  }
});

export {
  login,
  register,
  adminLogin,
  userInfo,
  createDefaultAdmin,
  changeAdminPassword,
};
