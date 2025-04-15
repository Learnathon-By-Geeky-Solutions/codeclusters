import asyncHandler from "express-async-handler";
import validator from "validator";
import crypto from "crypto";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import OTP from "../models/otp.js";
import user from "../models/userModel.js";

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

const generateOTP = () => {
  try {
    return crypto.randomInt(100000, 999999).toString();
  } catch (error) {
    console.log("Error in otp controller generate otp", error.message);
    res.status(500).json({
      error: "Internal server error",
    });
  }
};

const storeOTP = async (email, otp, otpFor) => {
  const expiry = new Date(Date.now() + 2 * 60 * 1000);
  try {
    await OTP.findOneAndUpdate(
      { email },
      { otp, expiry, verified: false, otpFor },
      { upsert: true, new: true }
    );
  } catch (error) {
    console.log("Error in otp controller store otp", error.message);
    res.status(500).json({
      error: "Internal server error",
    });
  }
};

const verifyOTP = async (email, otp, otpFor) => {
  const storedOtp = await OTP.findOne({ email, otpFor });

  try {
    if (!storedOtp)
      return { valid: false, message: "OTP expired or not found" };
    if (new Date() > storedOtp.expiry) {
      await OTP.deleteOne({ email });
      return { valid: false, message: "OTP expired" };
    }
    if (storedOtp.otp !== otp) {
      return { valid: false, message: "Invalid OTP" };
    }

    await OTP.findOneAndUpdate({ email }, { verified: true });

    if (otpFor === "email") {
      await user.findOneAndUpdate({ email }, { verified: true }, { new: true });

      await OTP.deleteOne({ email, otpFor: "email" });
    }
    return { valid: true };
  } catch (error) {
    console.log("Error in otp controller verify otp", error.message);
    return {
      error: "Internal server error",
    };
  }
};

const resetPass = async (email, newPassword) => {
  try {
    if (newPassword.length < 8) {
      return {
        success: false,
        message: "Password should be more than 8 character",
      };
    }

    const verified = await OTP.findOne({ email, otpFor: "password" });

    if (!verified || !verified.verified) {
      return {
        success: false,
        message: "First Verify your OTP",
      };
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await user.findOneAndUpdate(
      { email },
      { password: hashedPassword },
      { new: true }
    );
    await OTP.deleteOne({ email, otpFor: "password" });
    return {
      success: true,
      message: "Password reset",
    };
  } catch (error) {
    console.log("Error in reset password function", error.message);
    return {
      error: "Internal server error",
    };
  }
};

const sendOTPEmail = async ({ email, otp, purpose }) => {
  const subject =
    purpose === "password"
      ? "🔒 Password Reset Request - Your OTP"
      : "✅ Verify your email - Your OTP";

  const title = purpose === "password" ? "Password Reset" : "Verify Email";
  const purposeText =
    purpose === "password"
      ? "We've received a request to reset your password"
      : "You're almost there! Verify your email to get started.";

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 20px auto;
            background: white;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
          }
          .header {
            background: #007bff;
            color: white;
            padding: 20px;
            text-align: center;
            border-top-left-radius: 10px;
            border-top-right-radius: 10px;
          }
          .content {
            padding: 30px;
            text-align: center;
          }
          .otp-box {
            background: #f8f9fa;
            padding: 20px;
            margin: 20px 0;
            border-radius: 8px;
            font-size: 24px;
            font-weight: bold;
            letter-spacing: 5px;
          }
          .footer {
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: #666;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${title}</h1>
            <p>${purposeText}</p>
          </div>
          <div class="content">
            <p>Hello ${email},</p>
            <p>Your OTP is:</p>
            <div class="otp-box">${otp}</div>
            <p>This OTP expires in 2 minutes.</p>
          </div>
          <div class="footer">
            <p>If you didn't request this, please ignore this email.</p>
            <p>&copy; ${new Date().getFullYear()} All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };
  return transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Error: ", error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

const processOTPRequest = async ({ email, otpFor, res }) => {
  if (!validator.isEmail(email)) {
    return res.json({ success: false, message: "Email is not valid" });
  }

  const User = await user.findOne({ email });
  if (!User) {
    return res.json({ success: false, message: "User doesn't Exist" });
  }

  const otp = generateOTP();
  await storeOTP(email, otp, otpFor);
  console.log(`OTP for ${email}: ${otp}`);
  await sendOTPEmail({ email, otp, purpose: otpFor });

  return res.json({ success: true, message: "OTP sent successfully" });
};

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  await processOTPRequest({ email, otpFor: "password", res });
});

const verifyEmail = asyncHandler(async (req, res) => {
  const { email } = req.body;
  await processOTPRequest({ email, otpFor: "email", res });
});

const verifyOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  const { otpFor } = req.query;

  if (!validator.isEmail(email)) {
    return res.json({ success: false, message: "Email is not valid" });
  }

  const User = await user.findOne({ email });
  try {
    if (User) {
      const result = await verifyOTP(email, otp, otpFor);
      res.json({ result });
    } else {
      return res.json({ success: false, message: "User doesn't Exist" });
    }
  } catch (error) {
    console.log("Error in reset password controller", error.message);
    res.status(500).json({
      error: "Internal server error",
    });
  }
});

const resetPassword = asyncHandler(async (req, res) => {
  const { email, newPassword } = req.body;

  if (!validator.isEmail(email)) {
    return res.json({ success: false, message: "Email is not valid" });
  }

  const User = await user.findOne({ email });

  try {
    if (User) {
      const result = await resetPass(email, newPassword);

      res.json(result);
    } else {
      return res.json({ success: false, message: "User doesn't Exist" });
    }
  } catch (error) {
    console.log("Error in reset password controller", error.message);
    res.status(500).json({
      error: "Internal server error",
    });
  }
});

export {
  generateOTP,
  storeOTP,
  verifyOtp,
  verifyEmail,
  forgotPassword,
  resetPassword,
};
