import express, { Request, Response } from "express";
import Product from "../models/Product";

const router = express.Router();

router.post("/", async (req: Request, res: Response) => {
  try {
    const newProduct = await Product.create(req.body);
    res.status(201).json(newProduct);
  } catch (error: any) {
    res.status(400).json({
      message: "Failed to create product",
      error: error.message
    });
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error: any) {
    res.status(500).json({
      message: "Failed to get product",
      error: error.message
    });
  }
});

router.put("/:id", async (req: Request, res: Response) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(updatedProduct);
  } catch (error: any) {
    res.status(400).json({
      message: "Failed to update product",
      error: error.message
    });
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product deleted successfully" });
  } catch (error: any) {
    res.status(500).json({
      message: "Failed to delete product",
      error: error.message
    });
  }
});

router.get("/", async (req: Request, res: Response) => {
  try {
    const { category, minPrice, maxPrice, sortBy, page = "1", limit = "10" } = req.query;

    const query: any = {};

    if (category) {
      query.category = category;
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) {
        query.price.$gte = Number(minPrice);
      }
      if (maxPrice) {
        query.price.$lte = Number(maxPrice);
      }
    }

    let sortOption: any = {};

    if (sortBy === "price_asc") {
      sortOption.price = 1;
    } else if (sortBy === "price_desc") {
      sortOption.price = -1;
    }

    const pageNumber = Number(page) || 1;
    const limitNumber = Number(limit) || 10;
    const skip = (pageNumber - 1) * limitNumber;

    const products = await Product.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(limitNumber);

    res.json(products);
  } catch (error: any) {
    res.status(500).json({
      message: "Failed to fetch products",
      error: error.message
    });
  }
});

export default router;