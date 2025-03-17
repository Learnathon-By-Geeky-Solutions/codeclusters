import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/db.js";
import userRouter from "./routes/userRoute.js";
import productRouter from "./routes/productRoute.js";

// App Config

const app = express();
const port = process.env.PORT || 5000;
connectDB();

//middlewares
app.use(express.json());
app.use(cors());

//API endpoints
app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/uploads", express.static("uploads"));

app.get("/", (req, res) => {
  res.send("API working");
});

app.listen(port, () =>
  console.log("Server started on: http://localhost:" + port)
);
