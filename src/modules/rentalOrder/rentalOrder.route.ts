import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { rentalOrderController } from "./rentalOrder.controller";
import { auth } from "../../middleware/auth";
import { validateRequest } from "../../middleware/validationRequest";
import { rentalOrderValidation } from "./rentalOrder.validation";

const router = Router();

router.post(
  "/rentals",
  auth(Role.CUSTOMER),
  validateRequest(rentalOrderValidation.createRentalOrderValidationSchema),
  rentalOrderController.createRentalOrder,
);
router.get(
  "/rentals",
  auth(Role.CUSTOMER),
  rentalOrderController.allGetMyRentalOrders,
);
router.get(
  "/rentals/:id",
  auth(Role.CUSTOMER),
  rentalOrderController.getSingleRentalOrder,
);
router.get(
  "/orders",
  auth(Role.PROVIDER),
  rentalOrderController.getProviderOrders,
);

router.patch(
  "/orders/:id",
  auth(Role.PROVIDER),
  validateRequest(rentalOrderValidation.prodiverOrdeStatusValidationSchema),
  rentalOrderController.updateRentalOrderStatus,
);

router.get(
  "/admin/rentals",
  auth(Role.ADMIN),
  rentalOrderController.getAllRentalOrdersByAdmin,
);

export const rentalOrderRoutes = router;
