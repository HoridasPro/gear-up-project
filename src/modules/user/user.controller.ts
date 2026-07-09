import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { userServiceDB } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";

const createUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;

    const user = await userServiceDB.createUserIntoDB(payload);

    res.status(httpStatus.CREATED).json({
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Register successfully",
      data: user,
    });
  },
);

export const userController = {
  createUser,
};
