import { z } from "zod";

const createPaymentValidationSchema = z.object({
  body: z.object({
    rentalOrderId: z
      .string()
      .trim()
      .min(1, "Rental order ID is required")
      .refine(
        (value) => {
          if (!value) return true; // empty হলে min() handle করবে
          return /^c[a-z0-9]+$/.test(value);
        },
        {
          message: "Invalid rental order ID",
        },
      ),
  }),
});

const confirmPaymentValidationSchema = z.object({
  body: z.object({
    sessionId: z
      .string()
      .trim()
      .min(1, "Session ID is required")
      .refine(
        (value) => {
          if (!value) return true;
          return /^cs_(test|live)_[A-Za-z0-9]+$/.test(value);
        },
        {
          message: "Invalid session ID",
        },
      ),
  }),
});

export const paymentValidation = {
  createPaymentValidationSchema,
  confirmPaymentValidationSchema,
};
