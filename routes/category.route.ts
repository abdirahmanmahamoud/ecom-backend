import express from "express";
import { tokenMiddleware } from "../middleware/middleware";
import { validateData } from "../middleware/validation";
import { categorySchema } from "../schemas/category";
import { createCategory } from "../controllers/category";
import upload from "../middleware/upload";

const router = express.Router();

router.post(
  "/",
  tokenMiddleware("ADMIN"),
  validateData(categorySchema),
  upload.single("image"),
  createCategory,
);

export default router;
