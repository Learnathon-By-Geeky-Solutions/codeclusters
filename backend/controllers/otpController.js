import asyncHandler from "express-async-handler";
import validator from "validator";
import crypto from "crypto";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import OTP from "../models/otp.js";
import user from "../models/userModel.js";

dotenv.config();

// Configure email transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Generate a 6-digit OTP
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

// Store OTP in MongoDB with expiry (10 minutes)
const storeOTP = async (email, otp) => {
  const expiry = new Date(Date.now() + 2 * 60 * 1000); // 10 minutes expiry
  try {
    await OTP.findOneAndUpdate(
      { email },
      { otp, expiry },
      { upsert: true, new: true }
    );
  } catch (error) {
    console.log("Error in otp controller store otp", error.message);
    res.status(500).json({
      error: "Internal server error",
    });
  }
};

// Verify OTP
const verifyOTP = async (email, otp) => {
  const storedOtp = await OTP.findOne({ email });

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

    await OTP.deleteOne({ email }); // Remove OTP after successful verification
    return { valid: true };
  } catch (error) {
    console.log("Error in otp controller verify otp", error.message);
    return {
      error: "Internal server error",
    };
  }
};

//reset password
const resetPass = async (email, newPassword) => {
  try {
    if (newPassword.length < 8) {
      return {
        success: false,
        message: "Password should be more than 8 character",
      };
    }
    // const c = await verifyOTP(email, otp);

    // if (c.valid) {
    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update user's password in the database
    await user.findOneAndUpdate(
      { email },
      { password: hashedPassword },
      { new: true }
    );

    return {
      success: true,
      message: "Password reset",
    };
    // } else {
    //   return {
    //     error: c.message,
    //   };
    // }
  } catch (error) {
    console.log("Error in reset password function", error.message);
    return {
      error: "Internal server error",
    };
  }
};

// Clear OTP manually (if needed)
const clearOTP = async (email) => {
  await OTP.deleteOne({ email });
};

//route for forgotPassword
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  //validating email & password
  if (!validator.isEmail(email)) {
    return res.json({ success: false, message: "Email is not valid" });
  }
  //checking user exist or not
  const User = await user.findOne({ email });
  try {
    if (User) {
      const otp = generateOTP();
      await storeOTP(email, otp);
      console.log(`OTP for ${email}: ${otp}`); // In production, send via email/SMS

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "🔒 Password Reset Request - Your OTP",
        html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            margin: 0;
                            padding: 0;
                            background-color: #f4f4f4;
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
                            display: inline-block;
                            cursor: pointer;
                            font-size: 24px;
                            font-weight: bold;
                            letter-spacing: 5px;
                            transition: all 0.3s ease;
                        }
                        .otp-box:hover {
                            background: #e9ecef;
                            transform: scale(1.05);
                        }
                        .footer {
                            padding: 20px;
                            text-align: center;
                            color: #666;
                            font-size: 12px;
                            border-bottom-left-radius: 10px;
                            border-bottom-right-radius: 10px;
                        }
                        .warning {
                            color: #dc3545;
                            margin-top: 20px;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>Password Reset</h1>
                            <p>We've received a request to reset your password</p>
                        </div>
                        <div class="content">
                            <p>Hello ${User.email},</p>
                            <p>Use the following One-Time Password (OTP) to reset your password:</p>
                            <div class="otp-box" onclick="copyOTP('${otp}')" title="Click to copy">
                                ${otp}
                            </div>
                            <p>Click the OTP above to copy it to your clipboard.<br>
                            If that doesn't work, please manually copy the code.</p>
                            <p class="warning">This OTP expires in 2 minutes</p>
                        </div>
                        <div class="footer">
                            <p>If you didn't request this, please ignore this email.</p>
                            <p>&copy; ${new Date().getFullYear()} All rights reserved.</p>
                        </div>
                    </div>
                    <script>
                        function copyOTP(otp) {
                            try {
                                navigator.clipboard.writeText(otp)
                                    .then(() => alert('OTP copied to clipboard!'))
                                    .catch(() => alert('Please manually copy the OTP: ' + otp));
                            } catch (err) {
                                alert('Please manually copy the OTP: ' + otp);
                            }
                        }
                    </script>
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
      res.json({ success: true, message: "OTP sent successfully" });
    } else {
      return res.json({ success: false, message: "User doesn't Exist" });
    }
  } catch (error) {
    console.log("Error in forgot password controller", error.message);
    res.status(500).json({
      error: "Internal server error",
    });
  }
});

//route for verifyOtp
const verifyOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  //validating email & password
  if (!validator.isEmail(email)) {
    return res.json({ success: false, message: "Email is not valid" });
  }
  //checking user exist or not
  const User = await user.findOne({ email });
  try {
    if (User) {
      const result = await verifyOTP(email, otp);
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

//route for resetPass
const resetPassword = asyncHandler(async (req, res) => {
  const { email, otp, newPassword } = req.body;

  //validating email & password
  if (!validator.isEmail(email)) {
    return res.json({ success: false, message: "Email is not valid" });
  }
  //checking user exist or not
  const User = await user.findOne({ email });
  //   console.log(User);
  try {
    if (User) {
      //   console.log(email, otp, newPassword);
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

export { generateOTP, storeOTP, verifyOtp, forgotPassword, resetPassword };
