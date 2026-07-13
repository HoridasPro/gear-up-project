import { Router } from "express";
import { userController } from "./user.controller";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middleware/auth";

const router = Router();

router.post("/register", userController.createUser);
router.get(
  "/me",
  auth(Role.CUSTOMER, Role.PROVIDER),
  userController.getMyProfile,
);
router.get("/users", auth(Role.ADMIN), userController.getAllUsers);

router.patch(
  "/users/:id",
  auth(Role.ADMIN),

  userController.updateUserStatus,
);

export const createRoutes = router;
