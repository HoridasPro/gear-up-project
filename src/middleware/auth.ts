import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { jwtUtils } from "../utils/jwt";
import config from "../config";
import { JwtPayload } from "jsonwebtoken";
import { Role, ActiveStatus } from "../../generated/prisma/enums";
import { prisma } from "../lib/prisma";

declare global {
  namespace Express {
    interface Request {
      data?: {
        email: string;
        name: string;
        id: string;
        role: Role;
      };
    }
  }
}

export const auth = (...requiredRoles: Role[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.accessToken
      ? req.cookies.accessToken
      : req.headers.authorization?.startsWith("Bearer")
        ? req.headers.authorization.split(" ")[1]
        : req.headers.authorization;

    if (!token) {
      throw new Error("User not logged in. Please login first.");
    }
    const veryfiedToken = jwtUtils.verifyToken(token, config.jwt_access_secret);
    if (!veryfiedToken.success) {
      throw new Error(veryfiedToken.error);
    }
    const { id, name, email, role } = veryfiedToken.data as JwtPayload;
    if (requiredRoles.length && !requiredRoles.includes(role)) {
      throw new Error("Forbidden,You have no permission to this source");
    }
    const user = await prisma.user.findUnique({
      where: { id },
    });
    if (!user) {
      throw new Error("User not found");
    }
    if (user.status === ActiveStatus.BLOCKED) {
      throw new Error("User is blocked");
    }

    req.data = { id, name, email, role };
    next();
  });
};
