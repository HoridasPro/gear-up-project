import { z } from "zod";

const createGearItemValidationSchema = z.object({
  body: z.object({
    title: z.string().trim().min(1, " Title is required"),

    description: z.string().trim().min(1, "Description is required"),

    category: z.string().trim().min(1, "Category is required"),

    price: z.coerce
      .number()
      .refine((value) => !isNaN(value), {
        message: "Invalid price",
      })
      .positive("Price must be greater than 0"),

    brand: z.string().trim().min(1, "Brand is required"),
    quantity: z.coerce
      .number()
      .refine((value) => !isNaN(value), {
        message: "Invalid quantity",
      })
      .int("Quantity must be an integer not float")
      .positive("Quantity must be greater than 0"),

    gearItemImage: z
      .string()
      .trim()
      .superRefine((value, ctx) => {
        if (!value) {
          ctx.addIssue({
            code: "custom",
            message: "Gear photo is required",
          });
          return;
        }

        try {
          new URL(value);
        } catch {
          ctx.addIssue({
            code: "custom",
            message: "Photo URL is not valid",
          });
        }
      }),
  }),
});

const providerPutGearItemValidationSchema = z.object({
  body: z.object({
    title: z.string().trim().min(1, " Title is required"),

    description: z.string().trim().min(1, "Description is required"),

    category: z.string().trim().min(1, "Category is required"),

    price: z.coerce
      .number()
      .refine((value) => !isNaN(value), {
        message: "Invalid price",
      })
      .positive("Price must be greater than 0"),

    brand: z.string().trim().min(1, "Brand is required"),
    quantity: z.coerce
      .number()
      .refine((value) => !isNaN(value), {
        message: "Invalid quantity",
      })
      .int("Quantity must be an integer not float")
      .positive("Quantity must be greater than 0"),

    gearItemImage: z
      .string()
      .trim()
      .superRefine((value, ctx) => {
        if (!value) {
          ctx.addIssue({
            code: "custom",
            message: "Gear photo is required",
          });
          return;
        }

        try {
          new URL(value);
        } catch {
          ctx.addIssue({
            code: "custom",
            message: "Photo URL is not valid",
          });
        }
      }),
  }),
});

export const gearItemValidation = {
  createGearItemValidationSchema,
  providerPutGearItemValidationSchema,
};
