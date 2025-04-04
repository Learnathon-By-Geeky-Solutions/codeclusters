import asyncHandler from "express-async-handler";
import validator from "validator";
import bcrypt from "bcrypt";
import user from "../models/userModel.js";
import generateToken from "../utils/generateJWT.js";

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
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = generateToken(email + password);
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.log("Error in adminLogin controller", error.message);
    res.status(500).json({
      error: "Internal server error",
    });
  }
};

export { login, register, adminLogin };
