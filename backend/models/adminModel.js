import mongoose from "mongoose";

const adminModel = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
  { minimize: false }
);
const admin = mongoose.models.admin || mongoose.model("admin", adminModel);

export default admin;
