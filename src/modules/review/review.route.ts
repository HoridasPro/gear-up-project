import { Router } from "express";
import { auth } from "../../middleware/auth";
import { Role } from "../../../generated/prisma/enums";
import { reviewController } from "./review.controller";

const router = Router();

router.post("/reviews", auth(Role.CUSTOMER), reviewController.createReview);

export const reviewRoute = router;
