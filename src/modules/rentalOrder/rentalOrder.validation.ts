import { z } from "zod";
import { RentalStatus, Role } from "../../../generated/prisma/enums";

const createRentalOrderValidationSchema = z.object({
  body: z.object({
    gearItemId: z.string().trim().min(1, "Gear item id is required"),

    quantity: z.coerce
      .number()
      .refine((value) => !isNaN(value), {
        message: "Invalid quantity",
      })
      .int("Quantity must be an integer not float")
      .positive("Quantity must be greater than 0"),
  }),
});

const prodiverOrdeStatusValidationSchema = z.object({
  body: z.object({
    status: z.string().superRefine((value, ctx) => {
      if (!value) {
        ctx.addIssue({
          code: "custom",
          message: "Status is required",
        });
        return;
      }

      if (!Object.values(RentalStatus).includes(value as RentalStatus)) {
        ctx.addIssue({
          code: "custom",
          message: "Invalid status",
        });
      }
    }),
  }),
});

export const rentalOrderValidation = {
  createRentalOrderValidationSchema,
  prodiverOrdeStatusValidationSchema,
};
