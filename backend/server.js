import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/db.js";
import userRouter from "./routes/userRoute.js";
import productRouter from "./routes/productRoute.js";
import orderRouter from "./routes/orderRoute.js";
import reviewRouter from "./routes/reviewRoutes.js";
import cartRouter from "./routes/cartRoute.js";
import { createDefaultAdmin } from "./controllers/userController.js";

const app = express();
app.disable("x-powered-by");
const port = process.env.PORT || 5000;
connectDB();

const corsOptions = {
  origin:
    process.env.NODE_ENV === "production"
      ? "https://yourshop2.netlify.app/"
      : "*",
};

app.use(express.json());
app.use(cors(corsOptions));

createDefaultAdmin();

app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/order", orderRouter);
app.use("/api/review", reviewRouter);
app.use("/api/cart", cartRouter);

app.use("/uploads", express.static("uploads"));

app.get("/", (req, res) => {
  res.send("API working");
});

app.listen(port, () =>
  console.log("Server started on: http://localhost:" + port)
);
