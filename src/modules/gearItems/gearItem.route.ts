import { Router } from "express";
import { gearItemController } from "./gearItem.controller";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middleware/auth";

const router = Router();

router.post("/gear", auth(Role.PROVIDER), gearItemController.createGearItem);
router.get("/", gearItemController.getAllGearItem);

export const gearItemRoutes = router;
