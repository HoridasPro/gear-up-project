import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { rentalOrderController } from "./rentalOrder.controller";
import { auth } from "../../middleware/auth";

const router = Router();

router.post(
  "/rentals",
  auth(Role.CUSTOMER),
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

// router.patch(
//   "/orders/:id",
//   auth(Role.PROVIDER),
//   rentalOrderController.updateRentalOrderStatus,
// );

export const rentalOrderRoutes = router;
