import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { userServiceDB } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import config from "../../config";
import { jwtUtils } from "../../utils/jwt";
import { JwtPayload } from "jsonwebtoken";

const createUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;

    const user = await userServiceDB.createUserIntoDB(payload);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Register successfully",
      data: user,
    });
  },
);
const getMyProfile = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { accessToken } = req.cookies;
    const veryfiedToken = jwtUtils.verifyToken(
      accessToken,
      config.jwt_access_secret,
    ) as JwtPayload;

    const userProfile = await userServiceDB.getMyProfileIntoDB(
      veryfiedToken.data.id,
    );
    console.log(userProfile);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Profile retrieved successfully",
      data: userProfile,
    });
  },
);
export const userController = {
  createUser,
  getMyProfile,
};
