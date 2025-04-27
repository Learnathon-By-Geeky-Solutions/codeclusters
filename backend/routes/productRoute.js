import express from "express";
import {
  addProduct,
  listProduct,
  removeProduct,
  searchProducts,
  singleProduct,
  updateProduct,
  uploadBulkProduct,
} from "../controllers/productController.js";
import upload from "../middleware/multer.js";
import adminAuth from "../middleware/adminAuth.js";

const productRouter = express.Router();

productRouter.post(
  "/add",
  adminAuth,
  upload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
    { name: "image4", maxCount: 1 },
  ]),
  addProduct
);
productRouter.post(
  "/uploadBulkProduct",
  upload.single("file"),
  adminAuth,
  uploadBulkProduct
);
productRouter.post("/updateProduct", adminAuth, updateProduct);
productRouter.post("/remove", adminAuth, removeProduct);
productRouter.get("/single", singleProduct);
productRouter.get("/list", listProduct);
productRouter.get("/search", searchProducts);

export default productRouter;
