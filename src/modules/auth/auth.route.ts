import { Router } from "express";
import { authController } from "./auth.controller";
import { authValidation } from "./auth.validation";
import { validateRequest } from "../../middleware/validationRequest";

const router = Router();
router.post(
  "/login",
  validateRequest(authValidation.userLoginValidationSchema),
  authController.userLogin,
);
export const authRoutes = router;
