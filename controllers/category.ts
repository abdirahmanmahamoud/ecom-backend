import { Request, Response } from "express";
import { categoryType } from "../schemas/category";
import { uploadImageToS3 } from "../lib/s3";
import { db } from "../lib/db";

export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name } = req.body as categoryType;

    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }

    const { url, key } = await uploadImageToS3({
      file: req.file,
    });

    // slug generation
    let slug = "";
    slug = name.toLowerCase().replace(/ /g, "-");

    // slug checking in database
    const slugExists = await db.category.findUnique({
      where: {
        slug: slug,
      },
    });

    if (slugExists) {
      slug = `${slug}-${Date.now()}`;
    }

    const category = await db.category.create({
      data: {
        name,
        slug,
        image: url,
        imageKey: key,
      },
    });

    return res.status(201).json({
      message: "Category created successfully",
      data: category,
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};
