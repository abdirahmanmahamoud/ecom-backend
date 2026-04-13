import z from "zod";

export const productSchema = z.object({
  name: z.string().min(3, "Product name is required"),
  description: z.string().min(10, "Product description is required"),
  price: z.number().positive("Price must be a positive number"),
  priceDiscount: z.number().optional(),
  quantity: z
    .number()
    .int()
    .nonnegative("Quantity must be a non-negative integer"),
  image: z.array(z.string()),
  featured: z.any().optional(),
  categoryId: z.string().uuid("Invalid category ID"),
});

export type ProductType = z.infer<typeof productSchema>;
