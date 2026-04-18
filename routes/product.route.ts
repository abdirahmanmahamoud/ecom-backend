import express from "express";
import { tokenMiddleware } from "../middleware/middleware";
import { validateData } from "../middleware/validation";
import { productSchema } from "../schemas/product";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductBySlug,
} from "../controllers/product";

const router = express.Router();

router.post(
  "/",
  tokenMiddleware("ADMIN"),
  validateData(productSchema),
  createProduct,
);
router.get("/", getAllProducts);
router.get("/:slug", getProductBySlug);
router.delete("/:id", tokenMiddleware("ADMIN"), deleteProduct);

export default router;
