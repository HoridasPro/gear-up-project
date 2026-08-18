import { Router } from "express";
import { userController } from "./user.controller";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middleware/auth";
import { userValidation } from "./user.validation";
import { validateRequest } from "../../middleware/validationRequest";
import upload from "../../middleware/middlewares/upload";

const router = Router();

router.post(
  "/register",
  upload.single("profilePhoto"),
  validateRequest(userValidation.createUserValidationSchema),
  userController.createUser,
);
router.get(
  "/me",
  auth(Role.CUSTOMER, Role.PROVIDER, Role.ADMIN),
  userController.getMyProfile,
);
router.get("/users", auth(Role.ADMIN), userController.getAllUsers);

router.patch(
  "/users/:id",
  auth(Role.ADMIN),
  validateRequest(userValidation.updateUserValidationSchema),
  userController.updateUserStatus,
);
router.patch(
  "/update",
  auth(Role.CUSTOMER, Role.PROVIDER, Role.ADMIN),
  userController.updateMyProfile,
);
router.patch(
  "/users/:id/role",
  auth(Role.ADMIN),
  userController.updateUserRole,
);

export const createRoutes = router;
