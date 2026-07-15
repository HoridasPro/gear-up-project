import { Router } from "express";
import { userController } from "./user.controller";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middleware/auth";
import { userValidation } from "./user.validation";
import { validateRequest } from "../../middleware/validationRequest";

const router = Router();

router.post(
  "/register",
  validateRequest(userValidation.createUserValidationSchema),
  userController.createUser,
);
router.get(
  "/me",
  auth(Role.CUSTOMER, Role.PROVIDER),
  userController.getMyProfile,
);
router.get("/users", auth(Role.ADMIN), userController.getAllUsers);

router.patch(
  "/users/:id",
  auth(Role.ADMIN),
  validateRequest(userValidation.updateUserValidationSchema),
  userController.updateUserStatus,
);

export const createRoutes = router;
