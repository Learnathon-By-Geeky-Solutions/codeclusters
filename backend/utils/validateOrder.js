import mongoose from "mongoose";

export const isValidUserId = (userId) => mongoose.isValidObjectId(userId);

export const isValidItems = (items) => {
  if (!Array.isArray(items) || items.length === 0) return false;

  for (let item of items) {
    if (
      !Array.isArray(item.image) ||
      item.image.length === 0 ||
      typeof item.name !== "string" ||
      typeof item.description !== "string" ||
      typeof item.price !== "number" ||
      item.price < 0 ||
      typeof item.category !== "string" ||
      typeof item.subCategory !== "string" ||
      typeof item.size !== "string" ||
      (item.bestSeller !== "true" && item.bestSeller !== "false") ||
      typeof item.quantity !== "number" ||
      item.quantity < 1
    ) {
      return false;
    }
  }

  return true;
};

export const isValidAddress = (address) => {
  return (
    address &&
    typeof address === "object" &&
    typeof address.firstName === "string" &&
    typeof address.lastName === "string" &&
    typeof address.email === "string" &&
    typeof address.city === "string" &&
    typeof address.state === "string" &&
    typeof address.zipcode === "string" &&
    typeof address.country === "string" &&
    typeof address.phone === "string"
  );
};

export const isValidAmount = (amount) =>
  typeof amount === "number" && amount > 0;
