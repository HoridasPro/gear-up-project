import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middleware/auth";
import { paymentController } from "./payment.controller";
import { validateRequest } from "../../middleware/validationRequest";
import { paymentValidation } from "./payment.validation";

const router = Router();
router.post(
  "/create",
  auth(Role.CUSTOMER),
  validateRequest(paymentValidation.createPaymentValidationSchema),
  paymentController.createCheckoutSession,
);

router.post(
  "/confirm",
  auth(Role.CUSTOMER),
  validateRequest(paymentValidation.confirmPaymentValidationSchema),
  paymentController.confirmPayment,
);

router.get("/", auth(Role.CUSTOMER), paymentController.getMyPayments);

router.get("/:id", auth(Role.CUSTOMER), paymentController.getSinglePayment);
export const paymentRoutes = router;
