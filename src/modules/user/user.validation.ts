import { z } from "zod";
import { Role } from "../../../generated/prisma/enums";
import { ActiveStatus } from "./../../../generated/prisma/enums";

const createUserValidationSchema = z.object({
  body: z.object({
    name: z.string().trim().min(1, "Name is required"),

    email: z
      .string()
      .trim()
      .min(1, "Email is required")
      .refine(
        (value) => value === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
        {
          message: "Email is not valid",
        },
      ),
    password: z
      .string()
      .trim()
      .superRefine((value, ctx) => {
        if (!value) {
          ctx.addIssue({
            code: "custom",
            message: "Password is required",
          });
          return;
        }

        if (value.length < 6) {
          ctx.addIssue({
            code: "custom",
            message: "Password must be at least 6 characters",
          });
        }
      }),

    role: z
      .string()
      .trim()
      .min(1, "Role is required")
      .refine(
        (value) =>
          value === "" || value === Role.CUSTOMER || value === Role.PROVIDER,
        {
          message: "Role must be CUSTOMER or PROVIDER",
        },
      ),

    address: z.string().trim().min(1, "Role is required"),

    profilePhoto: z
      .string()
      .trim()
      .superRefine((value, ctx) => {
        if (!value) {
          ctx.addIssue({
            code: "custom",
            message: "Profile photo is required",
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

const updateUserValidationSchema = z.object({
  body: z.object({
    status: z.string().superRefine((value, ctx) => {
      if (!value) {
        ctx.addIssue({
          code: "custom",
          message: "Status is required",
        });
        return;
      }

      if (!Object.values(ActiveStatus).includes(value as ActiveStatus)) {
        ctx.addIssue({
          code: "custom",
          message: "Invalid status",
        });
      }
    }),
  }),
});

export const userValidation = {
  createUserValidationSchema,
  updateUserValidationSchema,
};
