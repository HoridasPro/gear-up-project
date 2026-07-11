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

export const rentalOrderRoutes = router;
