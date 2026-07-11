import { Router } from "express";
import { gearItemController } from "./gearItem.controller";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middleware/auth";

const router = Router();

router.post("/gear", auth(Role.PROVIDER), gearItemController.createGearItem);
router.get("/", gearItemController.getAllGearItem);
router.get("/:id", gearItemController.getSingleGearItem);
router.put("/gear/:id", auth(Role.PROVIDER), gearItemController.updateGearItem);
router.delete(
  "/gear/:id",
  auth(Role.PROVIDER),
  gearItemController.deleteGearItem,
);

export const gearItemRoutes = router;
