import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/connection";
import productRoutes from "./routes/productRoutes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3007;

connectDB();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Product API is running");
});

app.use("/api/products", productRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});