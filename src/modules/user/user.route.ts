import { Router } from "express";
import { userController } from "./user.controller";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middleware/auth";

const router = Router();

router.post(
  "/register",
  auth(Role.CUSTOMER, Role.PROVIDER),
  userController.createUser,
);
router.get(
  "/me",
  auth(Role.CUSTOMER, Role.PROVIDER),
  userController.getMyProfile,
);
router.get("/users", auth(Role.ADMIN), userController.getAllUsers);

export const createRoutes = router;
