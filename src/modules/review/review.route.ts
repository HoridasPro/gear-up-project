import { Router } from "express";
import { auth } from "../../middleware/auth";
import { Role } from "../../../generated/prisma/enums";
import { reviewController } from "./review.controller";
import { validateRequest } from "../../middleware/validationRequest";
import { reviewValidationSchema } from "./review.validation";

const router = Router();

router.post(
  "/reviews",
  auth(Role.CUSTOMER),
  validateRequest(reviewValidationSchema.createReviewValidationSchema),
  reviewController.createReview,
);

export const reviewRoute = router;
