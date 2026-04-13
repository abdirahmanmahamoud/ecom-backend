import { Request, Response } from "express";
import { ProductType } from "../schemas/product";
import { uploadImageToS3 } from "../lib/s3";
import { db } from "../lib/db";

export const createProduct = async (req: Request, res: Response) => {
  try {
    const {
      name,
      description,
      price,
      priceDiscount,
      quantity,
      image,
      featured,
      categoryId,
    } = req.body as ProductType;

    if (image.length > 5) {
      return res
        .status(400)
        .json({ message: "You can upload a maximum of 5 images" });
    }

    let img: string[] = [];
    let imgKey: string[] = [];

    image.forEach((imgFile: any) => {
      const { url, key } = uploadImageToS3(imgFile) as any;
      img.push(url);
      imgKey.push(key);
    });

    // slug generation
    let slug = "";
    slug = name.toLowerCase().replace(/ /g, "-");

    // slug checking in database
    const slugExists = await db.product.findUnique({
      where: {
        slug: slug,
      },
    });

    if (slugExists) {
      slug = `${slug}-${Date.now()}`;
    }

    const product = await db.product.create({
      data: {
        name,
        description,
        price,
        priceDiscount,
        quantity,
        image: img,
        imageKey: imgKey,
        featured,
        categoryId,
        slug,
      },
    });
    return res
      .status(201)
      .json({ message: "Product created successfully", product });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const products = await db.product.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        priceDiscount: true,
        quantity: true,
        image: true,
        slug: true,
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });
    return res.status(200).json({ products });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const getProductBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params as { slug: string };

    const product = await db.product.findUnique({
      where: {
        slug,
      },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        priceDiscount: true,
        quantity: true,
        image: true,
        slug: true,
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });
    return res.status(200).json({ product });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};
