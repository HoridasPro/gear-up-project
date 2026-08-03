import { z } from "zod";
import { RentalStatus } from "../../../generated/prisma/enums";

// const createRentalOrderValidationSchema = z.object({
//   body: z.object({
//     gearItemId: z.string().trim().min(1, "Gear item id is required"),

//     quantity: z.coerce
//       .number()
//       .refine((value) => !isNaN(value), {
//         message: "Invalid quantity",
//       })
//       .int("Quantity must be an integer not float")
//       .positive("Quantity must be greater than 0"),
//   }),
// });
// import { z } from "zod";

export const createRentalOrderValidationSchema = z.object({
  body: z
    .object({
      gearItemId: z.string().trim().min(1, "Gear item id is required"),

      quantity: z.coerce
        .number()
        .refine((value) => !isNaN(value), {
          message: "Invalid quantity",
        })
        .int("Quantity must be an integer not float")
        .positive("Quantity must be greater than 0"),

      // 🗓️ তারিখ ফিল্ড দুটো যোগ করা হলো
      startDate: z
        .string({
          message: "Start date is required",
        })
        .refine((val) => !isNaN(Date.parse(val)), {
          message: "Invalid start date format",
        }),

      endDate: z
        .string({
          message: "End date is required",
        })
        .refine((val) => !isNaN(Date.parse(val)), {
          message: "Invalid end date format",
        }),
    })
    // 🔍 লজিক্যাল চেক: End Date যেন Start Date-এর আগে না হয়
    .refine((data) => new Date(data.endDate) >= new Date(data.startDate), {
      message: "End date cannot be before start date",
      path: ["endDate"], // এরর মেসেজটি endDate ফিল্ডে শো করবে
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
