import { z } from "zod";

export const categorySchema = z.object({
  name: z.string().min(3, "Name is required"),
});

export type categoryType = z.infer<typeof categorySchema>;
