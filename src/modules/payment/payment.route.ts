import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middleware/auth";
import { paymentController } from "./payment.controller";

const router = Router();
router.post(
  "/create",
  auth(Role.CUSTOMER),
  paymentController.createCheckoutSession,
);

router.post("/confirm", auth(Role.CUSTOMER), paymentController.confirmPayment);

router.get("/", auth(Role.CUSTOMER), paymentController.getMyPayments);
export const paymentRoutes = router;
