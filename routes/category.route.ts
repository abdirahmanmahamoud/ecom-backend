import express from "express";
import { tokenMiddleware } from "../middleware/middleware";
import { validateData } from "../middleware/validation";
import { categorySchema } from "../schemas/category";
import {
  createCategory,
  getallCategories,
  updateCategory,
  deleteCategory,
} from "../controllers/category";
import upload from "../middleware/upload";

const router = express.Router();

router.post(
  "/",
  tokenMiddleware("ADMIN"),
  validateData(categorySchema),
  upload.single("image"),
  createCategory,
);

router.get("/", getallCategories);
router.put(
  "/:id",
  tokenMiddleware("ADMIN"),
  validateData(categorySchema),
  upload.single("image"),
  updateCategory,
);
router.delete("/:id", tokenMiddleware("ADMIN"), deleteCategory);

export default router;
