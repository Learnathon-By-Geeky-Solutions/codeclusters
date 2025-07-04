import mongoose from "mongoose";

const userModel = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    verified: {
      type: Boolean,
      required: true,
      default: false,
    },
    isGoogleAccount: {
      type: Boolean,
      required: true,
      default: false,
    },
    cartData: {
      type: Object,
      default: {},
    },
  },
  {
    timestamps: true,
  },
  { minimize: false }
);
const user = mongoose.models.user || mongoose.model("user", userModel);

export default user;
