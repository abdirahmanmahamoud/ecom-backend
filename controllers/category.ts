import { Request, Response } from "express";
import { categoryType } from "../schemas/category";
import { deleteImageFromS3, uploadImageToS3 } from "../lib/s3";
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

export const getallCategories = async (req: Request, res: Response) => {
  try {
    const data = await db.category.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        image: true,
      },
      orderBy: {
        CreatedAt: "desc",
      },
    });
    return res.status(200).json({ data });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    const { name } = req.body as categoryType;

    const category = await db.category.findUnique({
      where: {
        id: id,
      },
    });

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    if (req.file) {
      await uploadImageToS3({
        file: req.file,
        key: category.imageKey!,
      });
    }
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

    const data = await db.category.update({
      where: {
        id: id,
      },
      data: {
        name,
        slug,
      },
    });

    return res.status(200).json({
      message: "Category updated successfully",
      data,
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };

    const category = await db.category.findUnique({
      where: {
        id: id,
      },
    });

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    await deleteImageFromS3(category.imageKey!);
    await db.category.delete({
      where: {
        id: id,
      },
    });

    return res.status(200).json({
      message: "Category deleted successfully",
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};
