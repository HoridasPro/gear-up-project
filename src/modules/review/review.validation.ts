import { z } from "zod";

const createReviewValidationSchema = z.object({
  body: z.object({
    gearItemId: z.string().trim().min(1, "Gear item ID is required"),

    rating: z.coerce
      .number()
      .refine((value) => !isNaN(value), {
        message: "Invalid rating",
      })
      .int("Rating must be an integer")
      .min(1, "Rating must be at least 1")
      .max(5, "Rating cannot be greater than 5"),

    comment: z
      .string()
      .trim()
      .min(1, "Comment is required")
      .max(500, "Comment cannot exceed 500 characters"),
  }),
});
export const reviewValidationSchema = {
  createReviewValidationSchema,
};
